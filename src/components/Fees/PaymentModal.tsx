import React, { useState } from 'react';
import { Payment, Fee } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface PaymentModalProps {
  fee: Fee;
  isOpen: boolean;
  onClose: () => void;
  onPaymentRecorded: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ fee, isOpen, onClose, onPaymentRecorded }) => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'BankDeposit' | 'ProofUpload' | 'InPerson'>('BankDeposit');
  const [amount, setAmount] = useState<string>(fee.balance?.toString() || fee.amount.toString());
  const [bankName, setBankName] = useState('');
  const [reference, setReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUrl, setProofUrl] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === 'SCHOOL_ADMIN';
  const isParent = user?.role === 'PARENT';

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'payment-proof');
      
      const response = await api.post('/upload', formData);
      
      setProofUrl(response.url || response.path);
      toast.success('Proof uploaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload proof');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      handleFileUpload(file);
    }
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    if (paymentMethod === 'BankDeposit' && (!bankName || !reference)) {
      toast.error('Please provide bank name and transaction reference');
      return;
    }

    if (paymentMethod === 'ProofUpload' && !proofUrl) {
      toast.error('Please upload payment proof');
      return;
    }

    setSubmitting(true);

    try {
      const paymentData: Partial<Payment> = {
        studentId: fee.studentId,
        schoolId: fee.schoolId,
        invoiceId: fee.invoiceId || fee.id,
        feeId: fee.id,
        amount: parseFloat(amount),
        method: paymentMethod,
        bankName: paymentMethod === 'BankDeposit' ? bankName : undefined,
        reference: paymentMethod === 'BankDeposit' ? reference : undefined,
        proofUrl: (paymentMethod === 'ProofUpload' || paymentMethod === 'BankDeposit') ? proofUrl : undefined,
        receivedBy: paymentMethod === 'InPerson' && isAdmin ? user?.id : undefined,
        status: paymentMethod === 'InPerson' && isAdmin ? 'Verified' : 'PendingVerification',
        paidBy: user?.id || '',
        paidAt: new Date(paymentDate).toISOString(),
        notes: notes || undefined,
      };

      await api.post(`/payments`, paymentData);
      
      toast.success(
        paymentMethod === 'InPerson' && isAdmin
          ? 'Payment recorded and verified successfully!'
          : 'Payment submitted! Awaiting verification.'
      );
      
      onPaymentRecorded();
      handleClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setPaymentMethod('BankDeposit');
    setAmount(fee.balance?.toString() || fee.amount.toString());
    setBankName('');
    setReference('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setProofFile(null);
    setProofUrl('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Record Payment</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          {/* Fee Information */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Student:</span>
                <span className="font-medium ml-2">{fee.student?.name || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <span className="font-medium ml-2 capitalize">{fee.category || 'tuition'}</span>
              </div>
              <div>
                <span className="text-gray-600">Term:</span>
                <span className="font-medium ml-2">{fee.term || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Year:</span>
                <span className="font-medium ml-2">{fee.year || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Fee Amount:</span>
                <span className="font-medium ml-2">${fee.amount.toFixed(2)}</span>
              </div>
              {fee.paidAmount && fee.paidAmount > 0 && (
                <div>
                  <span className="text-gray-600">Already Paid:</span>
                  <span className="font-medium text-green-600 ml-2">${fee.paidAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="col-span-2 border-t pt-2">
                <span className="text-gray-600 font-semibold">Balance:</span>
                <span className="font-semibold text-red-600 ml-2">
                  ${(fee.balance || fee.amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('BankDeposit')}
                className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                  paymentMethod === 'BankDeposit'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                🏦 Bank Deposit
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('ProofUpload')}
                className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                  paymentMethod === 'ProofUpload'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                📤 Proof Upload
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('InPerson')}
                className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                  paymentMethod === 'InPerson'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                🏫 In-Person
              </button>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={fee.balance || fee.amount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter payment amount"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum: ${(fee.balance || fee.amount).toFixed(2)}
            </p>
          </div>

          {/* Payment Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Date *
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bank Deposit Fields */}
          {paymentMethod === 'BankDeposit' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., CBZ Bank, Standard Chartered"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Reference *
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter transaction reference number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deposit Slip / Proof (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                {proofUrl && !uploading && (
                  <p className="text-xs text-green-600 mt-1">✓ Proof uploaded</p>
                )}
              </div>
            </>
          )}

          {/* Proof Upload Fields */}
          {paymentMethod === 'ProofUpload' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Proof *
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {uploading && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
              {proofUrl && !uploading && (
                <p className="text-xs text-green-600 mt-1">✓ Proof uploaded</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Upload screenshot or photo of payment confirmation (mobile money, transfer, etc.)
              </p>
            </div>
          )}

          {/* In-Person Payment Info */}
          {paymentMethod === 'InPerson' && isAdmin && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                This payment will be automatically verified since it's recorded in-person at the school.
              </p>
            </div>
          )}

          {paymentMethod === 'InPerson' && isParent && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                Please visit the school to make in-person payments. This option is for school administrators only.
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about this payment..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={submitting}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || uploading || (paymentMethod === 'InPerson' && !isAdmin)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

