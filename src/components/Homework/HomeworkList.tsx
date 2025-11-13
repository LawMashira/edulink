import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface Homework {
  id: string;
  title: string;
  description: string;
  subject?: string;
  subjectId?: string;
  class?: string;
  classId?: string;
  dueDate: string;
  status: 'active' | 'completed';
  submissions?: number;
  totalStudents?: number;
}

interface Subject {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
}

const HomeworkList: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [newHomework, setNewHomework] = useState({
    title: '',
    description: '',
    subjectId: '',
    classId: '',
    dueDate: '',
    file: null as File | null
  });

  useEffect(() => {
    fetchHomework();
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchHomework = async () => {
    try {
      setLoading(true);
      const data = await api.get('/homework');
      setHomework(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching homework:', err);
      setHomework([]);
    } finally {
      setLoading(false);
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

  const fetchClasses = async () => {
    try {
      const data = await api.get('/classes');
      setClasses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching classes:', err);
    }
  };

  const handleAddHomework = async () => {
    if (!newHomework.title || !newHomework.description || !newHomework.subjectId || !newHomework.classId || !newHomework.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await api.post('/homework', {
        title: newHomework.title,
        description: newHomework.description,
        subjectId: newHomework.subjectId,
        classId: newHomework.classId,
        dueDate: newHomework.dueDate
      });
      toast.success('Homework assigned successfully!');
      setShowAddModal(false);
      setNewHomework({ title: '', description: '', subjectId: '', classId: '', dueDate: '', file: null });
      fetchHomework();
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign homework');
    }
  };

  const getSubjectName = (subjectId?: string, subjectName?: string) => {
    if (subjectName) return subjectName;
    if (subjectId) {
      const subject = subjects.find(s => s.id === subjectId);
      return subject ? subject.name : 'Unknown Subject';
    }
    return 'Unknown Subject';
  };

  const getClassName = (classId?: string, className?: string) => {
    if (className) return className;
    if (classId) {
      const cls = classes.find(c => c.id === classId);
      return cls ? cls.name : 'Unknown Class';
    }
    return 'Unknown Class';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Homework Management</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Assign Homework
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{homework.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{homework.filter(hw => hw.status === 'completed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{homework.filter(hw => hw.status === 'active').length}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading homework...</p>
          </div>
        ) : homework.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No homework assignments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {homework.map((hw) => (
            <div key={hw.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{hw.title}</h3>
                  <p className="text-sm text-gray-600">{hw.description}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  hw.status === 'active' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {hw.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Subject</p>
                  <p className="font-medium">{getSubjectName(hw.subjectId, hw.subject)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-medium">{getClassName(hw.classId, hw.class)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium">{new Date(hw.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {hw.submissions !== undefined && hw.totalStudents !== undefined && (
                    <>
                      <span className="text-sm text-gray-600">
                        Submissions: {hw.submissions}/{hw.totalStudents}
                      </span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(hw.submissions / hw.totalStudents) * 100}%` }}
                    >                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    View Details
                  </button>
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Add Homework Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign New Homework</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newHomework.title}
                  onChange={(e) => setNewHomework({...newHomework, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter homework title"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newHomework.description}
                  onChange={(e) => setNewHomework({...newHomework, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter homework description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={newHomework.subjectId}
                    onChange={(e) => setNewHomework({...newHomework, subjectId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    value={newHomework.classId}
                    onChange={(e) => setNewHomework({...newHomework, classId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newHomework.dueDate}
                  onChange={(e) => setNewHomework({...newHomework, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach File (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setNewHomework({...newHomework, file: e.target.files?.[0] || null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddHomework}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Assign Homework
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeworkList;
