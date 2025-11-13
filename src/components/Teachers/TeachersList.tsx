import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects?: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  subjectIds?: string[];
  schoolId: string;
  createdAt?: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface TeacherStatistics {
  totalTeachers?: number;
  totalSubjects?: number;
  averageSubjectsPerTeacher?: number;
}

const TeachersList: React.FC = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [statistics, setStatistics] = useState<TeacherStatistics | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form states
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    subjects: [] as string[]
  });

  const canManageTeachers = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN'
  );

  useEffect(() => {
    if (canManageTeachers) {
      fetchTeachers();
      fetchStatistics();
      fetchSubjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/teachers?includeSubjects=true');
      setTeachers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
      setError(err.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await api.get('/teachers/statistics');
      setStatistics(data);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await api.get('/subjects');
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching subjects:', err);
    }
  };

  const handleAddTeacher = async () => {
    if (!newTeacher.name || !newTeacher.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/teachers', {
        name: newTeacher.name,
        email: newTeacher.email,
        subjectIds: newTeacher.subjects
      });
      toast.success('Teacher added successfully!');
      setShowAddModal(false);
      setNewTeacher({ name: '', email: '', subjects: [] });
      fetchTeachers();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create teacher');
    }
  };

  const handleUpdateTeacher = async () => {
    if (!selectedTeacher || !newTeacher.name || !newTeacher.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.put(`/teachers/${selectedTeacher.id}`, {
        name: newTeacher.name,
        email: newTeacher.email,
        subjectIds: newTeacher.subjects
      });
      toast.success('Teacher updated successfully!');
      setShowEditModal(false);
      setSelectedTeacher(null);
      setNewTeacher({ name: '', email: '', subjects: [] });
      fetchTeachers();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update teacher');
    }
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!window.confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/teachers/${teacherId}`);
      toast.success('Teacher deleted successfully!');
      fetchTeachers();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete teacher');
    }
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setNewTeacher({
      name: teacher.name,
      email: teacher.email,
      subjects: teacher.subjectIds || teacher.subjects?.map(s => typeof s === 'string' ? s : s.id) || []
    });
    setShowEditModal(true);
  };

  const handleSubjectToggle = (subjectId: string) => {
    setNewTeacher(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter(id => id !== subjectId)
        : [...prev.subjects, subjectId]
    }));
  };

  const getSubjectNames = (teacher: Teacher) => {
    if (teacher.subjects && teacher.subjects.length > 0) {
      return teacher.subjects.map(s => typeof s === 'string' ? s : s.name);
    }
    return [];
  };

  if (!canManageTeachers) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">You do not have permission to view teachers.</p>
      </div>
    );
  }

  if (loading && teachers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading teachers...</div>
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
          <h2 className="text-2xl font-bold text-gray-900">Teacher Management</h2>
          {canManageTeachers && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Teacher
            </button>
          )}
        </div>

        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalTeachers || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalSubjects || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Subjects/Teacher</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.averageSubjectsPerTeacher || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.length > 0 ? (
            teachers.map((teacher) => {
              const subjectNames = getSubjectNames(teacher);
              return (
                <div key={teacher.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">👨‍🏫</span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Subjects:</h4>
                    {subjectNames.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {subjectNames.map((subjectName, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {subjectName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No subjects assigned</p>
                    )}
                  </div>

                  {canManageTeachers && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTeacher(teacher)}
                        className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              No teachers found
            </div>
          )}
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Teacher</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher Name
                </label>
                <input
                  type="text"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter teacher name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="teacher@school.co.zw"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Subjects (Optional)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {subjects.length > 0 ? (
                    subjects.map((subject: Subject) => (
                      <label key={subject.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newTeacher.subjects.includes(subject.id)}
                          onChange={() => handleSubjectToggle(subject.id)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{subject.name} ({subject.code})</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No subjects available</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTeacher({ name: '', email: '', subjects: [] });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTeacher}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && selectedTeacher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Teacher</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher Name *
                </label>
                <input
                  type="text"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter teacher name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="teacher@school.co.zw"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Subjects (Optional)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {subjects.length > 0 ? (
                    subjects.map((subject: Subject) => (
                      <label key={subject.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newTeacher.subjects.includes(subject.id)}
                          onChange={() => handleSubjectToggle(subject.id)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{subject.name} ({subject.code})</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No subjects available</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedTeacher(null);
                    setNewTeacher({ name: '', email: '', subjects: [] });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTeacher}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update Teacher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersList;
