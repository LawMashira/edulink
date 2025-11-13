export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT' | 'VENDOR';
  schoolId?: string;
  schoolName?: string;
  studentId?: string;
  parentId?: string;
  teacherId?: string;
}

export interface School {
  id: string;
  name: string;
  logo?: string;
  address: string;
  contact: string;
  email: string;
}

export interface Class {
  id: string;
  name: string;
  stream: string;
  schoolId: string;
  teacherId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  schoolId: string;
}

export interface Student {
  id: string;
  name: string;
  studentNumber: string;
  classId: string;
  parentId: string;
  schoolId: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  schoolId: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
}

export interface Fee {
  id: string;
  studentId: string;
  schoolId: string; // Multi-tenant isolation
  invoiceId?: string; // Link to invoice if auto-generated
  student?: {
    id: string;
    name: string;
    studentNumber: string;
    parentId?: string;
  };
  amount: number;
  paidAmount?: number; // For partial payments
  balance?: number; // amount - paidAmount
  title?: string; // Fee title/description (optional)
  category?: 'tuition' | 'library' | 'sports' | 'examination' | 'other';
  term?: string;
  year?: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'waived';
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  schoolId: string; // Multi-tenant isolation
  invoiceId: string; // Link to invoice/fee
  feeId?: string; // For backward compatibility
  fee?: Fee;
  amount: number;
  method: 'BankDeposit' | 'ProofUpload' | 'InPerson';
  bankName?: string;
  reference?: string; // Transaction reference
  proofUrl?: string; // Uploaded deposit slip or receipt
  receivedBy?: string; // Admin who recorded physical payment
  status: 'PendingVerification' | 'Verified' | 'Rejected';
  verifiedBy?: string; // Admin who verified
  verifiedAt?: string;
  rejectionReason?: string;
  receiptNumber?: string; // Auto-generated receipt number
  paidBy: string; // User ID (parent or admin)
  paidAt: string;
  notes?: string;
  createdAt: string;
}

export interface FeeStructure {
  id: string;
  schoolId: string; // Multi-tenant isolation
  name: string; // e.g., "Term 1 Fees 2025"
  category: 'tuition' | 'library' | 'sports' | 'examination' | 'other';
  amount: number;
  frequency: 'once' | 'termly' | 'monthly' | 'yearly';
  term?: string;
  year: number;
  classId?: string; // Optional: apply to specific class
  dueDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  schoolId: string; // Multi-tenant isolation
  studentId: string;
  invoiceNumber: string; // Auto-generated
  feeStructureId?: string; // If generated from fee structure
  items: Array<{
    category: string;
    description: string;
    amount: number;
  }>;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Result {
  id: string;
  studentId: string;
  subjectId: string;
  marks: number;
  maxMarks: number;
  term: string;
  year: number;
  grade: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}
