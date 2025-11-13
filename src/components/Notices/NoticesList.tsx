import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  schoolId: string;
  createdBy: string;
  createdByUser?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
}

const NoticesList: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const canCreateNotice = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN' || 
    user.role === 'TEACHER'
  );

  const canEditNotice = user && !!user.schoolId;

  useEffect(() => {
    fetchNotices();
  }, [user]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const data = await api.get('/notices/my-school');
      setNotices(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching notices:', err);
      setError(err.message || 'Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNotice = async () => {
    if (!newNotice.title || !newNotice.content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await api.post('/notices/my-school', {
        title: newNotice.title,
        content: newNotice.content,
        priority: newNotice.priority
      });
      toast.success('Notice added successfully!');
      setShowAddModal(false);
      setNewNotice({ title: '', content: '', priority: 'medium' });
      fetchNotices();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create notice');
    }
  };

  const handleUpdateNotice = async () => {
    if (!selectedNotice || !newNotice.title || !newNotice.content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await api.put(`/notices/${selectedNotice.id}`, {
        title: newNotice.title,
        content: newNotice.content,
        priority: newNotice.priority
      });
      toast.success('Notice updated successfully!');
      setShowEditModal(false);
      setSelectedNotice(null);
      setNewNotice({ title: '', content: '', priority: 'medium' });
      fetchNotices();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update notice');
    }
  };

  const handleDeleteNotice = async (noticeId: string) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      await api.delete(`/notices/${noticeId}`);
      toast.success('Notice deleted successfully!');
      fetchNotices();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete notice');
    }
  };

  const handleEditNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setNewNotice({
      title: notice.title,
      content: notice.content,
      priority: notice.priority
    });
    setShowEditModal(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCreatedBy = (notice: Notice) => {
    return notice.createdByUser?.name || notice.createdBy || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading notices...</div>
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">School Notices</h2>
          {canCreateNotice && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Notice
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <div key={notice.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notice.priority)}`}>
                      {notice.priority.toUpperCase()}
                    </span>
                    {canEditNotice && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditNotice(notice)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{notice.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Posted by: {getCreatedBy(notice)}</span>
                  <span>{new Date(notice.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No notices found</p>
          )}
        </div>
      </div>

      {/* Add Notice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Notice</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notice title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter notice content"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newNotice.priority}
                  onChange={(e) => setNewNotice({...newNotice, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewNotice({ title: '', content: '', priority: 'medium' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNotice}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {showEditModal && selectedNotice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Notice</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notice title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter notice content"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newNotice.priority}
                  onChange={(e) => setNewNotice({...newNotice, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedNotice(null);
                    setNewNotice({ title: '', content: '', priority: 'medium' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateNotice}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticesList;
