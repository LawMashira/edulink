import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface Class {
  id: string;
  name: string;
  level?: string;
  stream?: string;
  teacherId: string;
  teacher?: {
    id: string;
    name: string;
  };
  subjectId?: string;
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  studentCount?: number;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

const ClassesList: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [newClass, setNewClass] = useState({
    name: '',
    level: '',
    teacherId: '',
    subjectId: ''
  });

  const canManageClasses = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN'
  );

  const canEditClasses = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN' ||
    user.role === 'TEACHER'
  );

  useEffect(() => {
    if (user?.schoolId) {
      fetchClasses();
      fetchTeachers();
      fetchSubjects();
      fetchStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await api.get('/classes?includeDetails=true');
      setClasses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await api.get('/teachers');
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
      setTeachers([]);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await api.get('/subjects');
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching subjects:', err);
      setSubjects([]);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await api.get('/students');
      setStudents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setStudents([]);
    }
  };

  const handleAddClass = async () => {
    if (!newClass.name || !newClass.level || !newClass.teacherId || !newClass.subjectId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/classes', {
        name: newClass.name,
        level: newClass.level,
        teacherId: newClass.teacherId,
        subjectId: newClass.subjectId
      });
      toast.success('Class added successfully!');
      setShowAddModal(false);
      setNewClass({ name: '', level: '', teacherId: '', subjectId: '' });
      fetchClasses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create class');
    }
  };

  const handleUpdateClass = async () => {
    if (!selectedClass || !newClass.name || !newClass.level || !newClass.teacherId || !newClass.subjectId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.put(`/classes/${selectedClass.id}`, {
        name: newClass.name,
        level: newClass.level,
        teacherId: newClass.teacherId,
        subjectId: newClass.subjectId
      });
      toast.success('Class updated successfully!');
      setShowEditModal(false);
      setSelectedClass(null);
      setNewClass({ name: '', level: '', teacherId: '', subjectId: '' });
      fetchClasses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update class');
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/classes/${classId}`);
      toast.success('Class deleted successfully!');
      fetchClasses();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete class');
    }
  };

  const handleEditClass = (cls: Class) => {
    setSelectedClass(cls);
    setNewClass({
      name: cls.name,
      level: cls.level || '',
      teacherId: cls.teacherId,
      subjectId: cls.subjectId || ''
    });
    setShowEditModal(true);
  };

  const handleViewClass = async (classId: string) => {
    try {
      const data = await api.get(`/classes/${classId}`);
      // You can show this in a modal or navigate to a detail page
      console.log('Class details:', data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch class details');
    }
  };

  const getTeacherName = (cls: Class) => {
    if (cls.teacher) {
      return cls.teacher.name;
    }
    const teacher = teachers.find(t => t.id === cls.teacherId);
    return teacher ? teacher.name : 'Unassigned';
  };

  const getStudentsInClass = (classId: string) => {
    return students.filter(student => student.classId === classId);
  };

  const totalStudents = students.length;
  const avgStudentsPerClass = classes.length > 0 ? Math.round(totalStudents / classes.length) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Class Management</h2>
          {canManageClasses && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Class
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Students/Class</p>
                <p className="text-2xl font-bold text-gray-900">{avgStudentsPerClass}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading classes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.length > 0 ? (
              classes.map((cls) => {
                const studentsInClass = getStudentsInClass(cls.id);
                return (
                  <div key={cls.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{cls.name}</h3>
                        <p className="text-sm text-gray-600">Level: {cls.level || cls.stream || 'N/A'}</p>
                        {cls.subject && (
                          <p className="text-sm text-gray-600">Subject: {cls.subject.name}</p>
                        )}
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {studentsInClass.length} students
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Class Teacher:</strong> {getTeacherName(cls)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Students:</strong> {studentsInClass.length}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewClass(cls.id)}
                        className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                      >
                        View Details
                      </button>
                      {canEditClasses && (
                        <button 
                          onClick={() => handleEditClass(cls)}
                          className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
                        >
                          Edit
                        </button>
                      )}
                      {canManageClasses && (
                        <button 
                          onClick={() => handleDeleteClass(cls.id)}
                          className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No classes found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Class</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name *
                </label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Form 4A"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <input
                  type="text"
                  value={newClass.level}
                  onChange={(e) => setNewClass({...newClass, level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Form 1, Form 2, Grade 1"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Teacher *
                </label>
                <select
                  value={newClass.teacherId}
                  onChange={(e) => setNewClass({...newClass, teacherId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={newClass.subjectId}
                  onChange={(e) => setNewClass({...newClass, subjectId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewClass({ name: '', level: '', teacherId: '', subjectId: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClass}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Class</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name *
                </label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Form 4A"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <input
                  type="text"
                  value={newClass.level}
                  onChange={(e) => setNewClass({...newClass, level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Form 1, Form 2, Grade 1"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Teacher *
                </label>
                <select
                  value={newClass.teacherId}
                  onChange={(e) => setNewClass({...newClass, teacherId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  value={newClass.subjectId}
                  onChange={(e) => setNewClass({...newClass, subjectId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedClass(null);
                    setNewClass({ name: '', level: '', teacherId: '', subjectId: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateClass}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Update Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesList;
