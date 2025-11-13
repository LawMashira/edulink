import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

const SchoolSetup: React.FC = () => {
  const { user } = useAuth();
  const [schoolInfo, setSchoolInfo] = useState({
    name: '',
    address: '',
    contact: '',
    email: '',
    logo: null as File | null
  });

  // Pre-populate school name from user's school info
  useEffect(() => {
    // If user has schoolId, fetch school info to pre-populate
    if (user?.schoolId) {
      fetchSchoolInfo();
    } else if (user?.schoolName) {
      // If school name is directly in user object, use it
      setSchoolInfo(prev => ({
        ...prev,
        name: user.schoolName || prev.name
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchSchoolInfo = async () => {
    if (!user?.schoolId) return;

    try {
      const data = await api.get(`/schools/${user.schoolId}`);
      setSchoolInfo(prev => ({
        ...prev,
        name: data.name || prev.name,
        address: data.address || prev.address,
        contact: data.contact || prev.contact,
        email: data.email || prev.email
      }));
    } catch (err: any) {
      console.error('Error fetching school info:', err);
      // If school info can't be fetched, at least try to use schoolName from user object
      if (user?.schoolName) {
        setSchoolInfo(prev => ({
          ...prev,
          name: user.schoolName || prev.name
        }));
      }
    }
  };

  const [classes, setClasses] = useState<Array<{id?: string, name: string, stream?: string, level?: string}>>([]);
  const [subjects, setSubjects] = useState<Array<{id?: string, name: string, code: string}>>([]);
  const [teachers, setTeachers] = useState<Array<{id: string, name: string, email: string}>>([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', level: '', teacherId: '', subjectId: '' });
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch existing classes and subjects on mount
  useEffect(() => {
    if (user?.schoolId) {
      fetchClasses();
      fetchSubjects();
      fetchTeachers();
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchClasses = async () => {
    try {
      const data = await api.get('/classes');
      setClasses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      setClasses([]);
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

  const fetchTeachers = async () => {
    try {
      const data = await api.get('/teachers');
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching teachers:', err);
      setTeachers([]);
    }
  };

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.schoolId) {
      toast.error('School ID not found. Please ensure you are associated with a school.');
      return;
    }

    try {
      setSaving(true);
      
      // Update school information
      const schoolData: any = {
        name: schoolInfo.name,
        address: schoolInfo.address,
        email: schoolInfo.email
      };

      // If logo is a file, upload it separately
      if (schoolInfo.logo) {
        const formData = new FormData();
        formData.append('logo', schoolInfo.logo);
        
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${api.baseUrl}/schools/${user.schoolId}/logo`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok && response.status !== 404) {
          // Logo endpoint might not exist, that's okay
          console.warn('Logo upload failed, continuing with school update');
        }
      }

      // Update school information
      await api.put(`/schools/${user.schoolId}`, schoolData);
      
      toast.success('School information saved successfully!');
      fetchSchoolInfo(); // Refresh school info
    } catch (err: any) {
      toast.error(err.message || 'Failed to save school information');
    } finally {
      setSaving(false);
    }
  };

  const handleAddClass = async () => {
    if (!newClass.name || !newClass.level || !newClass.teacherId || !newClass.subjectId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Try to create class via API
      const data = await api.post('/classes', {
        name: newClass.name,
        level: newClass.level,
        teacherId: newClass.teacherId,
        subjectId: newClass.subjectId
      });
      
      toast.success('Class added successfully!');
      setNewClass({ name: '', level: '', teacherId: '', subjectId: '' });
      setShowAddClass(false);
      fetchClasses(); // Refresh classes list
    } catch (err: any) {
      toast.error(err.message || 'Failed to add class. The classes endpoint may not be implemented yet.');
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.code) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      // Try to create subject via API
      const data = await api.post('/subjects', {
        name: newSubject.name,
        code: newSubject.code
      });
      
      toast.success('Subject added successfully!');
      setNewSubject({ name: '', code: '' });
      setShowAddSubject(false);
      fetchSubjects(); // Refresh subjects list
    } catch (err: any) {
      toast.error(err.message || 'Failed to add subject. The subjects endpoint may not be implemented yet.');
    }
  };

  return (
    <div className="space-y-6">
      {/* School Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">School Setup</h2>
        
        <form onSubmit={handleSchoolSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name
              </label>
              <input
                type="text"
                value={schoolInfo.name}
                onChange={(e) => setSchoolInfo({...schoolInfo, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter school name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={schoolInfo.contact}
                onChange={(e) => setSchoolInfo({...schoolInfo, contact: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+263 4 123456"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={schoolInfo.address}
                onChange={(e) => setSchoolInfo({...schoolInfo, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter school address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={schoolInfo.email}
                onChange={(e) => setSchoolInfo({...schoolInfo, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="info@school.co.zw"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSchoolInfo({...schoolInfo, logo: e.target.files?.[0] || null})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save School Information'}
          </button>
        </form>
      </div>

      {/* Classes Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Classes & Streams</h3>
          <button
            onClick={() => setShowAddClass(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Class
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-4 text-gray-500">Loading classes...</div>
          ) : classes.length > 0 ? (
            classes.map((cls) => (
              <div key={cls.id || cls.name} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{cls.name}</h4>
                <p className="text-sm text-gray-600">{cls.level || cls.stream}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">No classes added yet</div>
          )}
        </div>
      </div>

      {/* Subjects Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Subjects</h3>
          <button
            onClick={() => setShowAddSubject(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Add Subject
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-4 text-gray-500">Loading subjects...</div>
          ) : subjects.length > 0 ? (
            subjects.map((subject) => (
              <div key={subject.id || subject.code} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{subject.name}</h4>
                <p className="text-sm text-gray-600">Code: {subject.code}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-gray-500">No subjects added yet</div>
          )}
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Class</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name
                </label>
                <input
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Form 4A"
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
                  placeholder="e.g., Form 1, Form 2, Grade 1, etc."
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
                  onClick={() => setShowAddClass(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClass}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Add Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Subject</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Code
                </label>
                <input
                  type="text"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MATH"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddSubject(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubject}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Add Subject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolSetup;
