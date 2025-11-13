import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Payment } from '../../types';

const PaymentVerification: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<'PendingVerification' | 'Verified' | 'Rejected' | 'all'>('PendingVerification');
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'all' 
        ? '/payments' 
        : `/payments?status=${filter}`;
      const data = await api.get(endpoint);
      setPayments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      toast.error(err.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (paymentId: string) => {
    if (!window.confirm('Are you sure you want to verify this payment?')) {
      return;
    }

    try {
      await api.post(`/payments/${paymentId}/verify`, {});
      toast.success('Payment verified successfully!');
      fetchPayments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to verify payment');
    }
  };

  const handleReject = async () => {
    if (!selectedPayment) return;
    
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await api.post(`/payments/${selectedPayment.id}/reject`, {
        reason: rejectionReason
      });
      toast.success('Payment rejected');
      setShowRejectModal(false);
      setSelectedPayment(null);
      setRejectionReason('');
      fetchPayments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject payment');
    }
  };

  const openRejectModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowRejectModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'PendingVerification':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'BankDeposit':
        return '🏦 Bank Deposit';
      case 'ProofUpload':
        return '📤 Proof Upload';
      case 'InPerson':
        return '🏫 In-Person';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payment Verification</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('PendingVerification')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'PendingVerification'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({payments.filter(p => p.status === 'PendingVerification').length})
            </button>
            <button
              onClick={() => setFilter('Verified')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'Verified'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setFilter('Rejected')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'Rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.fee?.student?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getMethodLabel(payment.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.reference || payment.bankName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status === 'PendingVerification' ? '⏳ Pending' :
                         payment.status === 'Verified' ? '✓ Verified' :
                         '✗ Rejected'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.proofUrl && (
                        <a
                          href={payment.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View Proof
                        </a>
                      )}
                      {payment.status === 'PendingVerification' && (
                        <>
                          <button
                            onClick={() => handleVerify(payment.id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => openRejectModal(payment)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Payment Modal */}
      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Payment</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Amount: <span className="font-medium">${selectedPayment.amount.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Student: <span className="font-medium">{selectedPayment.fee?.student?.name || 'Unknown'}</span>
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reason for rejection..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedPayment(null);
                    setRejectionReason('');
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Reject Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;

