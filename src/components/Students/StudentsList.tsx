import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface Student {
  id: string;
  name: string;
  studentNumber: string;
  classId: string;
  class?: {
    id: string;
    name: string;
    stream: string;
  };
  className?: string;
  parentId?: string;
  parent?: {
    id: string;
    name: string;
  };
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  schoolId: string;
  email?: string;
  createdAt?: string;
}

interface Class {
  id: string;
  name: string;
  stream: string;
}

interface StudentStatistics {
  totalStudents?: number;
  activeClasses?: number;
  averagePerClass?: number;
}

const StudentsList: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [statistics, setStatistics] = useState<StudentStatistics | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form states
  const [newStudent, setNewStudent] = useState({
    name: '',
    studentNumber: '',
    classId: '',
    parentId: '',
    email: ''
  });

  const canManageStudents = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN' || 
    user.role === 'TEACHER'
  );

  const canCreateStudents = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN'
  );

  useEffect(() => {
    if (canManageStudents) {
      fetchStudents();
      fetchStatistics();
      fetchClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await api.get('/students?includeClasses=true');
      setStudents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const data = await api.get('/students/statistics');
      setStatistics(data);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await api.get('/classes');
      setClasses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching classes:', err);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.studentNumber || !newStudent.classId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/students', {
        name: newStudent.name,
        studentNumber: newStudent.studentNumber,
        classId: newStudent.classId,
        parentId: newStudent.parentId || undefined,
        email: newStudent.email || undefined
      });
      toast.success('Student added successfully!');
      setShowAddModal(false);
      setNewStudent({ name: '', studentNumber: '', classId: '', parentId: '', email: '' });
      fetchStudents();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create student');
    }
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent || !newStudent.name || !newStudent.studentNumber || !newStudent.classId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.put(`/students/${selectedStudent.id}`, {
        name: newStudent.name,
        studentNumber: newStudent.studentNumber,
        classId: newStudent.classId,
        parentId: newStudent.parentId || undefined,
        email: newStudent.email || undefined
      });
      toast.success('Student updated successfully!');
      setShowEditModal(false);
      setSelectedStudent(null);
      setNewStudent({ name: '', studentNumber: '', classId: '', parentId: '', email: '' });
      fetchStudents();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update student');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/students/${studentId}`);
      toast.success('Student deleted successfully!');
      fetchStudents();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete student');
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setNewStudent({
      name: student.name,
      studentNumber: student.studentNumber,
      classId: student.classId,
      parentId: student.parentId || '',
      email: student.email || ''
    });
    setShowEditModal(true);
  };

  const getClassName = (student: Student) => {
    return student.class ? `${student.class.name} (${student.class.stream})` : 'Unknown Class';
  };

  if (!canManageStudents) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">You do not have permission to view students.</p>
      </div>
    );
  }

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading students...</div>
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
          <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
          {canCreateStudents && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Student
            </button>
          )}
        </div>

        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">👨‍🎓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalStudents || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.activeClasses || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average per Class</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.averagePerClass || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent Phone
                </th>
                {canCreateStudents && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.studentNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.className || getClassName(student) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.parentName || student.parent?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.parentEmail || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.parentPhone || '-'}
                    </td>
                    {canCreateStudents && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canCreateStudents ? 8 : 7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Student</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter student name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Number
                </label>
                <input
                  type="text"
                  value={newStudent.studentNumber}
                  onChange={(e) => setNewStudent({...newStudent, studentNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., HHS2024006"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class
                </label>
                <select
                  value={newStudent.classId}
                  onChange={(e) => setNewStudent({...newStudent, classId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a class</option>
                  {classes.map((cls: Class) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.stream})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="student@email.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent ID (Optional)
                </label>
                <input
                  type="text"
                  value={newStudent.parentId}
                  onChange={(e) => setNewStudent({...newStudent, parentId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter parent ID"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewStudent({ name: '', studentNumber: '', classId: '', parentId: '', email: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Student</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter student name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Number *
                </label>
                <input
                  type="text"
                  value={newStudent.studentNumber}
                  onChange={(e) => setNewStudent({...newStudent, studentNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., HHS2024006"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  value={newStudent.classId}
                  onChange={(e) => setNewStudent({...newStudent, classId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a class</option>
                  {classes.map((cls: Class) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.stream})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="student@email.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent ID (Optional)
                </label>
                <input
                  type="text"
                  value={newStudent.parentId}
                  onChange={(e) => setNewStudent({...newStudent, parentId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter parent ID"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStudent(null);
                    setNewStudent({ name: '', studentNumber: '', classId: '', parentId: '', email: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStudent}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
