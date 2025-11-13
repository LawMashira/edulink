import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface Invitation {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
}

const InviteUser: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const [showInvitationsList, setShowInvitationsList] = useState(false);
  const navigate = useNavigate();

  const isSchoolAdmin = user?.role === 'SCHOOL_ADMIN';

  useEffect(() => {
    if (isSchoolAdmin) {
      fetchInvitations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchInvitations = async () => {
    try {
      setLoadingInvitations(true);
      const response = await api.get('/invitations/school');
      setInvitations(response.invitations || []);
    } catch (err: any) {
      console.error('Error fetching invitations:', err);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!isSchoolAdmin) {
      toast.error('Only school administrators can send invitations');
      return;
    }

    setIsLoading(true);
    
    try {
      await api.post('/invitations', {
        email: formData.email,
        name: formData.name,
        role: formData.role.toUpperCase()
      });
      
      toast.success(`Invitation sent to ${formData.email}! They will receive an email with registration instructions.`);
      setFormData({ email: '', role: '', name: '' });
      fetchInvitations();
    } catch (err: any) {
      toast.error(err.message || 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    if (!window.confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }

    try {
      await api.delete(`/invitations/${invitationId}`);
      toast.success('Invitation cancelled successfully');
      fetchInvitations();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel invitation');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'accepted':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Accepted</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Expired</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Cancelled</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (!isSchoolAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">Only school administrators can send invitations.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <img src="/images/edulink.jpg" alt="ZimEduLink" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invite Users</h1>
            <p className="text-gray-600">Invite teachers, parents, or students to join your school</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setShowInvitationsList(false)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                !showInvitationsList
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Send Invitation
            </button>
            <button
              onClick={() => {
                setShowInvitationsList(true);
                fetchInvitations();
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                showInvitationsList
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              View Invitations ({invitations.length})
            </button>
          </div>

          {/* Invitations List */}
          {showInvitationsList && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sent Invitations</h2>
              {loadingInvitations ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading invitations...</p>
                </div>
              ) : invitations.length > 0 ? (
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{invitation.name}</h3>
                          {getStatusBadge(invitation.status)}
                        </div>
                        <p className="text-sm text-gray-600">{invitation.email}</p>
                        <p className="text-sm text-gray-500">Role: {invitation.role}</p>
                        {invitation.acceptedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Accepted: {new Date(invitation.acceptedAt).toLocaleDateString()}
                          </p>
                        )}
                        {invitation.expiresAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {invitation.status.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => handleCancelInvitation(invitation.id)}
                          className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No invitations sent yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Send Invitation Form */}
          {!showInvitationsList && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="user@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Select Role *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.role ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Select a role</option>
                <option value="teacher">Teacher 👨‍🏫</option>
                <option value="parent">Parent 👨‍👩‍👧‍👦</option>
                <option value="student">Student 👨‍🎓</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              
              {formData.role && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {formData.role === 'teacher' && 'The teacher will receive an invitation to set up their account and access class management features.'}
                    {formData.role === 'parent' && 'The parent will receive an invitation to monitor their child\'s academic progress and school activities.'}
                    {formData.role === 'student' && 'The student will receive an invitation to access their academic records and school resources.'}
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <span className="text-xl mr-3">ℹ️</span>
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>How it works:</strong> An invitation email will be sent to the provided email address. The recipient will need to click the link in the email to complete their registration.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Invitation...
                </div>
              ) : (
                'Send Invitation'
              )}
            </button>
          </form>
          )}

          {/* Back Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;
