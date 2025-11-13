import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';
import { Fee, Payment } from '../../types';
import PaymentModal from './PaymentModal';
import PaymentVerification from './PaymentVerification';

interface FeeStats {
  totalFees: number;
  paidFees: number;
  outstandingFees: number;
  overdueFees: number;
}

interface Student {
  id: string;
  name: string;
  studentNumber: string;
}

const FeeManagement: React.FC = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState<Fee[]>([]);
  const [stats, setStats] = useState<FeeStats | null>(null);
  const [overdueFees, setOverdueFees] = useState<Fee[]>([]);
  const [recentPayments, setRecentPayments] = useState<Fee[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showCreateFeeModal, setShowCreateFeeModal] = useState(false);
  const [showUpdateFeeModal, setShowUpdateFeeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentVerification, setShowPaymentVerification] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  
  // Form states
  const [newFee, setNewFee] = useState({
    studentId: '',
    amount: '',
    category: 'tuition',
    term: '',
    year: new Date().getFullYear().toString(),
    dueDate: ''
  });

  const isSchoolAdmin = user?.role === 'SCHOOL_ADMIN';
  const isParent = user?.role === 'PARENT';

  useEffect(() => {
    fetchFees();
    if (isSchoolAdmin) {
      fetchStats();
      fetchOverdueFees();
      fetchRecentPayments();
      fetchStudents();
      fetchPendingPayments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      // Backend should filter by schoolId from JWT/session
      const data = await api.get('/fees');
      setFees(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching fees:', err);
      setError(err.message || 'Failed to fetch fees');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const data = await api.get('/payments?status=PendingVerification');
      setPendingPayments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching pending payments:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.get('/fees/stats');
      setStats(data);
    } catch (err: any) {
      console.error('Error fetching fee stats:', err);
    }
  };

  const fetchOverdueFees = async () => {
    try {
      const data = await api.get('/fees/overdue');
      setOverdueFees(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching overdue fees:', err);
    }
  };

  const fetchRecentPayments = async () => {
    try {
      const data = await api.get('/fees/recent-payments?limit=5');
      setRecentPayments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching recent payments:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await api.get('/students');
      setStudents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching students:', err);
    }
  };

  const handleCreateFee = async () => {
    if (!newFee.studentId || !newFee.amount || !newFee.term || !newFee.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/fees', {
        studentId: newFee.studentId,
        schoolId: user?.schoolId, // Multi-tenant isolation
        amount: parseFloat(newFee.amount),
        category: newFee.category,
        term: newFee.term,
        year: parseInt(newFee.year),
        dueDate: newFee.dueDate
      });
      toast.success('Fee created successfully!');
      setShowCreateFeeModal(false);
      setNewFee({ studentId: '', amount: '', category: 'tuition', term: '', year: new Date().getFullYear().toString(), dueDate: '' });
      fetchFees();
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create fee');
    }
  };

  const handleUpdateFee = async () => {
    if (!selectedFee) return;

    if (!selectedFee.term) {
      toast.error('Term is required');
      return;
    }

    try {
      await api.put(`/fees/${selectedFee.id}`, {
        amount: selectedFee.amount,
        term: selectedFee.term,
        year: selectedFee.year,
        dueDate: selectedFee.dueDate
      });
      toast.success('Fee updated successfully!');
      setShowUpdateFeeModal(false);
      setSelectedFee(null);
      fetchFees();
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update fee');
    }
  };

  const handlePayFee = (feeId: string) => {
    const fee = fees.find(f => f.id === feeId);
    if (!fee) {
      toast.error('Fee not found');
      return;
    }
    setSelectedFee(fee);
    setShowPaymentModal(true);
  };

  const handlePaymentRecorded = () => {
    fetchFees();
    if (isSchoolAdmin) {
      fetchStats();
      fetchRecentPayments();
      fetchPendingPayments();
    }
  };

  const getStudentName = (fee: Fee) => {
    return fee.student?.name || 'Unknown Student';
  };

  const getStudentNumber = (fee: Fee) => {
    return fee.student?.studentNumber || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading fees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  // If showing payment verification, show only that view
  if (showPaymentVerification) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Payment Verification</h2>
            <button
              onClick={() => setShowPaymentVerification(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>
          <PaymentVerification />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Fee Management</h2>
          <div className="flex space-x-2">
            {isSchoolAdmin && (
              <>
                <button
                  onClick={() => {
                    console.log('Payment Verification button clicked');
                    setShowPaymentVerification(true);
                  }}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 relative"
                >
                  Payment Verification
                  {pendingPayments.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingPayments.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowCreateFeeModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create Fee
                </button>
              </>
            )}
          </div>
        </div>

        {isSchoolAdmin && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Fees</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalFees || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paid</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.paidFees || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Outstanding</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.outstandingFees || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <span className="text-2xl">🚨</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.overdueFees || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fee Summary by Category */}
        {fees.length > 0 && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Summary by Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {['tuition', 'library', 'sports', 'examination', 'other'].map((category) => {
                const categoryFees = fees.filter(f => (f.category || 'tuition') === category);
                const totalAmount = categoryFees.reduce((sum, f) => sum + f.amount, 0);
                const paidAmount = categoryFees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
                const balance = totalAmount - paidAmount;
                const paidCount = categoryFees.filter(f => f.status === 'paid').length;
                const unpaidCount = categoryFees.filter(f => f.status !== 'paid').length;

                if (categoryFees.length === 0) return null;

                return (
                  <div key={category} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900 capitalize">{category}</span>
                      <span className="text-xs text-gray-500">{categoryFees.length} fee(s)</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium">${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Paid:</span>
                        <span className="font-medium text-green-600">${paidAmount.toFixed(2)}</span>
                      </div>
                      {balance > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Balance:</span>
                          <span className="font-medium text-red-600">${balance.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="pt-1 mt-1 border-t border-gray-200">
                        <div className="flex justify-between text-xs">
                          <span className="text-green-600">✓ Paid: {paidCount}</span>
                          <span className="text-yellow-600">⏸ Unpaid: {unpaidCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Term
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paid/Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {(isSchoolAdmin || isParent) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fees.length > 0 ? (
                fees.map((fee) => (
                  <tr key={fee.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getStudentName(fee)}
                      {getStudentNumber(fee) && (
                        <span className="text-xs text-gray-500 block">{getStudentNumber(fee)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {fee.category || 'tuition'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fee.term && fee.year ? `${fee.term} ${fee.year}` : fee.term || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${fee.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fee.paidAmount !== undefined && fee.paidAmount > 0 ? (
                        <div className="flex flex-col">
                          <span className="text-green-600 font-medium">${fee.paidAmount.toFixed(2)}</span>
                          {fee.balance !== undefined && fee.balance > 0 && (
                            <span className="text-red-600 text-xs">Balance: ${fee.balance.toFixed(2)}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not paid</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        fee.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : fee.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : fee.status === 'partial'
                          ? 'bg-blue-100 text-blue-800'
                          : fee.status === 'waived'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {fee.status === 'paid' ? '✓ Paid' : 
                         fee.status === 'partial' ? '⏳ Partial' :
                         fee.status === 'overdue' ? '⚠ Overdue' :
                         fee.status === 'waived' ? '✓ Waived' :
                         '⏸ Pending'}
                      </span>
                    </td>
                    {(isSchoolAdmin || isParent) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {fee.status !== 'paid' && (
                          <button
                            onClick={() => handlePayFee(fee.id)}
                            className="text-green-600 hover:text-green-900 mr-2"
                          >
                            Pay
                          </button>
                        )}
                        {isSchoolAdmin && (
                          <button
                            onClick={() => {
                              setSelectedFee(fee);
                              setShowUpdateFeeModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isSchoolAdmin || isParent ? 8 : 7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No fees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isSchoolAdmin && overdueFees.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue Fees</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueFees.map((fee) => (
                  <tr key={fee.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getStudentName(fee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handlePayFee(fee.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Pay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isSchoolAdmin && recentPayments.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPayments.map((fee) => (
                  <tr key={fee.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getStudentName(fee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${fee.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fee.paidAt ? new Date(fee.paidAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Fee Modal */}
      {showCreateFeeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create Fee</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student *
                </label>
                <select
                  value={newFee.studentId}
                  onChange={(e) => setNewFee({...newFee, studentId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.studentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newFee.category}
                  onChange={(e) => setNewFee({...newFee, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tuition">Tuition</option>
                  <option value="library">Library</option>
                  <option value="sports">Sports</option>
                  <option value="examination">Examination</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term *
                </label>
                <select
                  value={newFee.term}
                  onChange={(e) => setNewFee({...newFee, term: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select term</option>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  value={newFee.year}
                  onChange={(e) => setNewFee({...newFee, year: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter year"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newFee.amount}
                  onChange={(e) => setNewFee({...newFee, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={newFee.dueDate}
                  onChange={(e) => setNewFee({...newFee, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateFeeModal(false);
                    setNewFee({ studentId: '', amount: '', category: 'tuition', term: '', year: new Date().getFullYear().toString(), dueDate: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFee}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Fee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Fee Modal */}
      {showUpdateFeeModal && selectedFee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Fee</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term *
                </label>
                <select
                  value={selectedFee.term || ''}
                  onChange={(e) => setSelectedFee({...selectedFee, term: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select term</option>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  value={selectedFee.year || ''}
                  onChange={(e) => setSelectedFee({...selectedFee, year: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={selectedFee.amount}
                  onChange={(e) => setSelectedFee({...selectedFee, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={selectedFee.dueDate ? new Date(selectedFee.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setSelectedFee({...selectedFee, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowUpdateFeeModal(false);
                    setSelectedFee(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFee}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update Fee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedFee && (
        <PaymentModal
          fee={selectedFee}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedFee(null);
          }}
          onPaymentRecorded={handlePaymentRecorded}
        />
      )}

    </div>
  );
};

export default FeeManagement;
