import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface School {
  id: string;
  name: string;
  address?: string;
  contact?: string;
  email?: string;
  logo?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  stats?: {
    totalStudents?: number;
    totalTeachers?: number;
    totalClasses?: number;
  };
}

interface SchoolStatistics {
  totalSchools?: number;
  totalStudents?: number;
  totalTeachers?: number;
  activeSchools?: number;
}

const SchoolsList: React.FC = () => {
  const { user } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [statistics, setStatistics] = useState<SchoolStatistics | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Form states
  const [newSchool, setNewSchool] = useState({
    name: '',
    address: '',
    contact: '',
    email: '',
    logo: null as File | null
  });

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isSchoolAdmin = user?.role === 'SCHOOL_ADMIN';

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAllSchools();
      fetchStatistics();
    } else if (isSchoolAdmin && user?.schoolId) {
      fetchSchoolById(user.schoolId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAllSchools = async () => {
    try {
      setLoading(true);
      const data = await api.get('/schools?includeStats=true');
      setSchools(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching schools:', err);
      setError(err.message || 'Failed to fetch schools');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolById = async (schoolId: string) => {
    try {
      setLoading(true);
      const data = await api.get(`/schools/${schoolId}?includeStats=true`);
      setSchools([data]);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching school:', err);
      setError(err.message || 'Failed to fetch school');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await api.get('/schools/statistics');
      setStatistics(data);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleAddSchool = async () => {
    if (!newSchool.name || !newSchool.address || !newSchool.contact || !newSchool.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newSchool.name);
      formData.append('address', newSchool.address);
      formData.append('contact', newSchool.contact);
      formData.append('email', newSchool.email);
      if (newSchool.logo) {
        formData.append('logo', newSchool.logo);
      }

      // For file upload, we need to use fetch directly since api.post uses JSON
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${api.baseUrl}/schools`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || 'Request failed');
      }

      await response.json();
      toast.success('School added successfully!');
      setShowAddModal(false);
      setNewSchool({ name: '', address: '', contact: '', email: '', logo: null });
      fetchAllSchools();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create school');
    }
  };

  const handleUpdateSchool = async () => {
    if (!selectedSchool || !newSchool.name || !newSchool.address || !newSchool.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newSchool.name);
      formData.append('address', newSchool.address);
      formData.append('email', newSchool.email);
      if (newSchool.logo) {
        formData.append('logo', newSchool.logo);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${api.baseUrl}/schools/${selectedSchool.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || 'Request failed');
      }

      toast.success('School updated successfully!');
      setShowEditModal(false);
      setSelectedSchool(null);
      setNewSchool({ name: '', address: '', contact: '', email: '', logo: null });
      if (isSuperAdmin) {
        fetchAllSchools();
      } else if (user?.schoolId) {
        fetchSchoolById(user.schoolId);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update school');
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (!window.confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/schools/${schoolId}`);
      toast.success('School deleted successfully!');
      fetchAllSchools();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete school');
    }
  };

  const handleViewSchool = (school: School) => {
    setSelectedSchool(school);
    setShowViewModal(true);
  };

  const handleEditSchool = (school: School) => {
    setSelectedSchool(school);
    setNewSchool({
      name: school.name,
      address: school.address || '',
      contact: school.contact || '',
      email: school.email || '',
      logo: null
    });
    setShowEditModal(true);
  };

  if (!isSuperAdmin && !isSchoolAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">You do not have permission to view schools.</p>
      </div>
    );
  }

  if (loading && schools.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading schools...</div>
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
          <h2 className="text-2xl font-bold text-gray-900">School Management</h2>
          {isSuperAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add School
            </button>
          )}
        </div>

        {isSuperAdmin && statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🏫</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Schools</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalSchools || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">👨‍🎓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalStudents || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalTeachers || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Schools</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.activeSchools || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.length > 0 ? (
            schools.map((school) => (
              <div key={school.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {school.logo ? (
                    <img src={school.logo} alt={school.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">🏫</span>
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                    <p className="text-sm text-gray-600">
                      {school.isActive !== false ? (
                        <span className="text-green-600">Active</span>
                      ) : (
                        <span className="text-red-600">Inactive</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {school.address && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20">Address:</span>
                      <span className="text-gray-900">{school.address}</span>
                    </div>
                  )}
                  {school.contact && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20">Contact:</span>
                      <span className="text-gray-900">{school.contact}</span>
                    </div>
                  )}
                  {school.email && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-20">Email:</span>
                      <span className="text-gray-900">{school.email}</span>
                    </div>
                  )}
                  {school.stats && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Students:</span>
                          <span className="ml-1 font-medium">{school.stats.totalStudents || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Teachers:</span>
                          <span className="ml-1 font-medium">{school.stats.totalTeachers || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Classes:</span>
                          <span className="ml-1 font-medium">{school.stats.totalClasses || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewSchool(school)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                  >
                    View Details
                  </button>
                  {((isSuperAdmin) || (isSchoolAdmin && user?.schoolId === school.id)) && (
                    <button
                      onClick={() => handleEditSchool(school)}
                      className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
                    >
                      Edit
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button
                      onClick={() => handleDeleteSchool(school.id)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              No schools found
            </div>
          )}
        </div>
      </div>

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New School</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter school name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={newSchool.address}
                  onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter school address"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={newSchool.contact}
                  onChange={(e) => setNewSchool({...newSchool, contact: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+263 4 123456"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newSchool.email}
                  onChange={(e) => setNewSchool({...newSchool, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="info@school.co.zw"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewSchool({...newSchool, logo: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSchool({ name: '', address: '', contact: '', email: '', logo: null });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSchool}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add School
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit School Modal */}
      {showEditModal && selectedSchool && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit School</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name *
                </label>
                <input
                  type="text"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter school name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={newSchool.address}
                  onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter school address"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={newSchool.contact}
                  onChange={(e) => setNewSchool({...newSchool, contact: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+263 4 123456"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newSchool.email}
                  onChange={(e) => setNewSchool({...newSchool, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="info@school.co.zw"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewSchool({...newSchool, logo: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedSchool(null);
                    setNewSchool({ name: '', address: '', contact: '', email: '', logo: null });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSchool}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update School
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View School Details Modal */}
      {showViewModal && selectedSchool && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">School Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <p className="text-sm text-gray-900">{selectedSchool.name}</p>
                </div>

                {selectedSchool.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="text-sm text-gray-900">{selectedSchool.address}</p>
                  </div>
                )}

                {selectedSchool.contact && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <p className="text-sm text-gray-900">{selectedSchool.contact}</p>
                  </div>
                )}

                {selectedSchool.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900">{selectedSchool.email}</p>
                  </div>
                )}

                {selectedSchool.stats && (
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Students</p>
                        <p className="font-semibold text-gray-900">{selectedSchool.stats.totalStudents || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Teachers</p>
                        <p className="font-semibold text-gray-900">{selectedSchool.stats.totalTeachers || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Classes</p>
                        <p className="font-semibold text-gray-900">{selectedSchool.stats.totalClasses || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedSchool.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                    <p className="text-sm text-gray-900">{new Date(selectedSchool.createdAt).toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedSchool(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
                {((isSuperAdmin) || (isSchoolAdmin && user?.schoolId === selectedSchool.id)) && (
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditSchool(selectedSchool);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolsList;
