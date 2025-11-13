# Multi-Tenant School Fee Management System - Implementation Guide

## Overview
This document outlines the complete multi-tenant fee management system implementation for a School Management SaaS platform serving hundreds of schools.

## Core Principles

### 1. Multi-Tenant Data Isolation
- **Every record MUST include `schoolId`** for data isolation
- All API endpoints must filter by `schoolId` from JWT/session
- Prevent data leakage between schools
- Use `schoolId` in all database queries

### 2. Payment Workflows
The system supports three payment methods:
- **Bank Deposit**: Parent deposits at school's bank, submits proof
- **Proof Upload**: Parent uploads payment proof (mobile money, transfer, etc.)
- **In-Person**: Admin records payment physically made at school

### 3. Payment Verification
- Bank deposits and proof uploads require verification
- In-person payments are auto-verified
- Finance admins verify/reject payments with reasons

---

## Database Schema

### Fees Table
```sql
CREATE TABLE fees (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  school_id UUID REFERENCES schools(id) NOT NULL,
  invoice_id UUID REFERENCES invoices(id),
  amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  balance DECIMAL(10,2) GENERATED ALWAYS AS (amount - paid_amount) STORED,
  title VARCHAR(255),
  category VARCHAR(50) DEFAULT 'tuition',
  term VARCHAR(20),
  year INTEGER,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fees_school_id ON fees(school_id);
CREATE INDEX idx_fees_student_id ON fees(student_id);
CREATE INDEX idx_fees_status ON fees(status);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  student_id UUID REFERENCES students(id) NOT NULL,
  school_id UUID REFERENCES schools(id) NOT NULL,
  invoice_id UUID NOT NULL,
  fee_id UUID REFERENCES fees(id),
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(20) NOT NULL CHECK (method IN ('BankDeposit', 'ProofUpload', 'InPerson')),
  bank_name VARCHAR(100),
  reference VARCHAR(100),
  proof_url VARCHAR(500),
  received_by UUID REFERENCES users(id),
  status VARCHAR(30) NOT NULL CHECK (status IN ('PendingVerification', 'Verified', 'Rejected')),
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  rejection_reason TEXT,
  receipt_number VARCHAR(100),
  paid_by UUID REFERENCES users(id) NOT NULL,
  paid_at TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_school_id ON payments(school_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
```

### Fee Structures Table
```sql
CREATE TABLE fee_structures (
  id UUID PRIMARY KEY,
  school_id UUID REFERENCES schools(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('once', 'termly', 'monthly', 'yearly')),
  term VARCHAR(20),
  year INTEGER NOT NULL,
  class_id UUID REFERENCES classes(id),
  due_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fee_structures_school_id ON fee_structures(school_id);
```

### Invoices Table
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  school_id UUID REFERENCES schools(id) NOT NULL,
  student_id UUID REFERENCES students(id) NOT NULL,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  fee_structure_id UUID REFERENCES fee_structures(id),
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  balance DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
  status VARCHAR(20) DEFAULT 'pending',
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invoices_school_id ON invoices(school_id);
CREATE INDEX idx_invoices_student_id ON invoices(student_id);
```

---

## Backend API Endpoints

### Authentication & Authorization
All endpoints must:
1. Extract `schoolId` from JWT token or session
2. Filter all queries by `schoolId`
3. Validate user has access to the school

### Fee Management Endpoints

#### 1. Get Fees
```
GET /fees
GET /fees?status=pending
GET /fees?studentId=xxx
```

**Backend Logic:**
```javascript
// Extract schoolId from JWT
const schoolId = req.user.schoolId;

// For PARENT role
if (user.role === 'PARENT') {
  // Find all students where parentId = user.id AND schoolId matches
  const children = await Student.find({ 
    parentId: user.id,
    schoolId: schoolId 
  });
  const childrenIds = children.map(c => c.id);
  
  const fees = await Fee.find({ 
    studentId: { $in: childrenIds },
    schoolId: schoolId 
  }).populate('studentId');
  
  return fees;
}

// For STUDENT role
if (user.role === 'STUDENT') {
  const fees = await Fee.find({ 
    studentId: user.studentId,
    schoolId: schoolId 
  }).populate('studentId');
  return fees;
}

// For SCHOOL_ADMIN role
const fees = await Fee.find({ schoolId: schoolId })
  .populate('studentId');
return fees;
```

#### 2. Create Fee
```
POST /fees
Body: {
  studentId: string,
  schoolId: string, // From JWT, but validate
  amount: number,
  category: string,
  term: string,
  year: number,
  dueDate: string
}
```

**Backend Logic:**
```javascript
const { studentId, amount, category, term, year, dueDate } = req.body;
const schoolId = req.user.schoolId; // From JWT

// Validate student belongs to school
const student = await Student.findOne({ 
  id: studentId, 
  schoolId: schoolId 
});
if (!student) {
  return res.status(403).json({ error: 'Student not found in your school' });
}

const fee = await Fee.create({
  studentId,
  schoolId,
  amount,
  category,
  term,
  year,
  dueDate,
  status: 'pending'
});

return fee;
```

#### 3. Update Fee
```
PUT /fees/:feeId
Body: {
  amount: number,
  term: string,
  year: number,
  dueDate: string
}
```

**Backend Logic:**
```javascript
const schoolId = req.user.schoolId;
const fee = await Fee.findOne({ 
  id: feeId, 
  schoolId: schoolId 
});

if (!fee) {
  return res.status(404).json({ error: 'Fee not found' });
}

// Update fee
await fee.update(req.body);
return fee;
```

### Payment Endpoints

#### 4. Record Payment
```
POST /payments
Body: {
  studentId: string,
  schoolId: string, // From JWT
  invoiceId: string,
  feeId: string,
  amount: number,
  method: 'BankDeposit' | 'ProofUpload' | 'InPerson',
  bankName?: string,
  reference?: string,
  proofUrl?: string,
  receivedBy?: string,
  status: 'PendingVerification' | 'Verified',
  paidBy: string,
  paidAt: string,
  notes?: string
}
```

**Backend Logic:**
```javascript
const schoolId = req.user.schoolId;
const { invoiceId, feeId, amount, method, ...paymentData } = req.body;

// Validate fee/invoice belongs to school
const fee = await Fee.findOne({ 
  id: feeId, 
  schoolId: schoolId 
});

if (!fee) {
  return res.status(404).json({ error: 'Fee not found' });
}

// Auto-verify in-person payments by admins
const status = (method === 'InPerson' && req.user.role === 'SCHOOL_ADMIN') 
  ? 'Verified' 
  : 'PendingVerification';

// Generate receipt number
const receiptNumber = `RCP-${schoolId.substring(0, 8)}-${Date.now()}`;

// Create payment
const payment = await Payment.create({
  ...paymentData,
  schoolId,
  invoiceId,
  feeId,
  amount,
  method,
  status,
  receiptNumber,
  verifiedBy: status === 'Verified' ? req.user.id : null,
  verifiedAt: status === 'Verified' ? new Date() : null
});

// Update fee
const newPaidAmount = (fee.paidAmount || 0) + amount;
fee.paidAmount = newPaidAmount;
fee.balance = fee.amount - newPaidAmount;
fee.status = fee.balance === 0 ? 'paid' : fee.balance < fee.amount ? 'partial' : fee.status;
if (fee.balance === 0) {
  fee.paidAt = new Date();
}
await fee.save();

return payment;
```

#### 5. Verify Payment
```
POST /payments/:paymentId/verify
```

**Backend Logic:**
```javascript
const schoolId = req.user.schoolId;
const payment = await Payment.findOne({ 
  id: paymentId, 
  schoolId: schoolId 
});

if (!payment) {
  return res.status(404).json({ error: 'Payment not found' });
}

if (payment.status !== 'PendingVerification') {
  return res.status(400).json({ error: 'Payment already processed' });
}

payment.status = 'Verified';
payment.verifiedBy = req.user.id;
payment.verifiedAt = new Date();
await payment.save();

// Update fee status
const fee = await Fee.findById(payment.feeId);
if (fee) {
  const newPaidAmount = (fee.paidAmount || 0) + payment.amount;
  fee.paidAmount = newPaidAmount;
  fee.balance = fee.amount - newPaidAmount;
  fee.status = fee.balance === 0 ? 'paid' : 'partial';
  if (fee.balance === 0) {
    fee.paidAt = new Date();
  }
  await fee.save();
}

return payment;
```

#### 6. Reject Payment
```
POST /payments/:paymentId/reject
Body: {
  reason: string
}
```

**Backend Logic:**
```javascript
const schoolId = req.user.schoolId;
const payment = await Payment.findOne({ 
  id: paymentId, 
  schoolId: schoolId 
});

if (!payment) {
  return res.status(404).json({ error: 'Payment not found' });
}

payment.status = 'Rejected';
payment.rejectionReason = req.body.reason;
payment.verifiedBy = req.user.id;
payment.verifiedAt = new Date();
await payment.save();

return payment;
```

#### 7. Get Payments
```
GET /payments
GET /payments?status=PendingVerification
GET /payments?status=Verified
```

**Backend Logic:**
```javascript
const schoolId = req.user.schoolId;
const { status } = req.query;

const query = { schoolId: schoolId };
if (status) {
  query.status = status;
}

const payments = await Payment.find(query)
  .populate('feeId')
  .populate('paidBy')
  .sort({ createdAt: -1 });

return payments;
```

### Fee Structure Endpoints

#### 8. Create Fee Structure
```
POST /fee-structures
Body: {
  name: string,
  category: string,
  amount: number,
  frequency: 'once' | 'termly' | 'monthly' | 'yearly',
  term?: string,
  year: number,
  classId?: string,
  dueDate: string
}
```

#### 9. Generate Invoices from Fee Structure
```
POST /fee-structures/:id/generate-invoices
```

**Backend Logic:**
```javascript
const schoolId = req.user.schoolId;
const feeStructure = await FeeStructure.findOne({ 
  id: feeStructureId, 
  schoolId: schoolId 
});

// Get all active students in school (or specific class)
const query = { schoolId: schoolId, isActive: true };
if (feeStructure.classId) {
  query.classId = feeStructure.classId;
}

const students = await Student.find(query);

// Generate invoices
const invoices = [];
for (const student of students) {
  const invoiceNumber = `INV-${schoolId.substring(0, 8)}-${Date.now()}-${student.id.substring(0, 8)}`;
  
  const invoice = await Invoice.create({
    schoolId,
    studentId: student.id,
    invoiceNumber,
    feeStructureId: feeStructure.id,
    items: [{
      category: feeStructure.category,
      description: feeStructure.name,
      amount: feeStructure.amount
    }],
    totalAmount: feeStructure.amount,
    paidAmount: 0,
    status: 'pending',
    issueDate: new Date(),
    dueDate: feeStructure.dueDate
  });

  // Create fee record
  await Fee.create({
    studentId: student.id,
    schoolId,
    invoiceId: invoice.id,
    amount: feeStructure.amount,
    category: feeStructure.category,
    term: feeStructure.term,
    year: feeStructure.year,
    dueDate: feeStructure.dueDate,
    status: 'pending'
  });

  invoices.push(invoice);
}

return invoices;
```

### Reporting Endpoints

#### 10. Fee Statistics
```
GET /fees/stats
```

**Backend Logic:**
```javascript
const schoolId = req.user.schoolId;

const totalFees = await Fee.aggregate([
  { $match: { schoolId: schoolId } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
]);

const paidFees = await Fee.aggregate([
  { $match: { schoolId: schoolId, status: 'paid' } },
  { $group: { _id: null, total: { $sum: '$paidAmount' } } }
]);

const outstandingFees = await Fee.aggregate([
  { $match: { schoolId: schoolId, status: { $in: ['pending', 'partial'] } } },
  { $group: { _id: null, total: { $sum: '$balance' } } }
]);

return {
  totalFees: totalFees[0]?.total || 0,
  paidFees: paidFees[0]?.total || 0,
  outstandingFees: outstandingFees[0]?.total || 0,
  overdueFees: 0 // Calculate based on dueDate
};
```

#### 11. Payment Methods Breakdown
```
GET /payments/stats/methods
```

**Backend Logic:**
```javascript
const schoolId = req.user.schoolId;

const breakdown = await Payment.aggregate([
  { $match: { schoolId: schoolId, status: 'Verified' } },
  { $group: {
    _id: '$method',
    count: { $sum: 1 },
    total: { $sum: '$amount' }
  }}
]);

return breakdown;
```

---

## Security Considerations

1. **Multi-Tenant Isolation**
   - Always filter by `schoolId` from JWT
   - Never trust `schoolId` from request body
   - Validate user belongs to school

2. **Payment Authorization**
   - Only parents/admins can record payments
   - Only admins can verify/reject payments
   - Payment records should be immutable (audit trail)

3. **Data Privacy**
   - Parents can only see their children's fees
   - Students can only see their own fees
   - Admins see all fees in their school

---

## Frontend Implementation

### Components Created
1. **PaymentModal** - Handles all three payment methods
2. **PaymentVerification** - Admin interface for verifying/rejecting payments
3. **FeeManagement** - Updated with multi-tenant support

### Key Features
- Multi-tenant data isolation (schoolId in all requests)
- Three payment methods (Bank Deposit, Proof Upload, In-Person)
- Payment verification workflow
- Payment history tracking
- Receipt generation
- Status indicators

---

## Next Steps

1. **Backend Implementation**
   - Implement all API endpoints
   - Add multi-tenant middleware
   - Set up database migrations

2. **File Upload**
   - Implement `/upload` endpoint for payment proofs
   - Store files in cloud storage (S3, etc.)
   - Generate secure URLs

3. **Notifications**
   - Email notifications for invoice generation
   - SMS/WhatsApp for payment confirmations
   - Payment verification alerts

4. **Reporting Dashboard**
   - Total collected vs expected
   - Payment methods breakdown
   - Outstanding balances by class/student

5. **Optional Enhancements**
   - Automatic bank reconciliation
   - QuickBooks/Xero export
   - Payment reminders automation

