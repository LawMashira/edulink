import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

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
}

interface Student {
  id: string;
  name: string;
  studentNumber: string;
  classId: string;
}

const MyClassesList: React.FC = () => {
  const { user } = useAuth();
  const [myClasses, setMyClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchMyClasses();
      fetchStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchMyClasses = async () => {
    try {
      setLoading(true);
      // Try to use the teacher's classes endpoint first
      if (user?.role === 'TEACHER') {
        try {
          const data = await api.get('/teachers/my-classes');
          // Handle different response structures
          if (Array.isArray(data)) {
            setMyClasses(data);
          } else if (data.classes && Array.isArray(data.classes)) {
            setMyClasses(data.classes);
          } else {
            // Fallback: fetch all classes and filter by teacherId
            const allClasses = await api.get('/classes');
            const filtered = Array.isArray(allClasses) 
              ? allClasses.filter((cls: Class) => cls.teacherId === user.id)
              : [];
            setMyClasses(filtered);
          }
        } catch (err: any) {
          // Fallback: fetch all classes and filter by teacherId
          console.warn('Teacher classes endpoint failed, filtering all classes:', err);
          const allClasses = await api.get('/classes');
          const filtered = Array.isArray(allClasses) 
            ? allClasses.filter((cls: Class) => cls.teacherId === user?.id)
            : [];
          setMyClasses(filtered);
        }
      } else {
        // For non-teachers, just fetch all classes
        const data = await api.get('/classes');
        setMyClasses(Array.isArray(data) ? data : []);
      }
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      setMyClasses([]);
    } finally {
      setLoading(false);
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

  const getStudentsInClass = (classId: string) => {
    return students.filter(student => student.classId === classId);
  };

  const getTeacherName = (cls: Class) => {
    if (cls.teacher) {
      return cls.teacher.name;
    }
    return 'Unknown Teacher';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Classes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Classes</p>
                <p className="text-2xl font-bold text-gray-900">{myClasses.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {myClasses.reduce((sum, cls) => sum + getStudentsInClass(cls.id).length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg per Class</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myClasses.length > 0 ? Math.round(myClasses.reduce((sum, cls) => sum + getStudentsInClass(cls.id).length, 0) / myClasses.length) : 0}
                </p>
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
            {myClasses.length > 0 ? (
              myClasses.map((cls) => {
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
                        <p className="text-sm text-gray-600">Teacher: {getTeacherName(cls)}</p>
                      </div>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    {studentsInClass.length} students
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Students in this class:</h4>
                  <div className="max-h-32 overflow-y-auto">
                    {studentsInClass.length > 0 ? (
                      <div className="space-y-1">
                        {studentsInClass.map((student) => (
                          <div key={student.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-900">{student.name}</span>
                            <span className="text-gray-500">{student.studentNumber}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No students assigned to this class</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">
                    View Details
                  </button>
                  <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600">
                    Mark Attendance
                  </button>
                  <button className="flex-1 bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600">
                    Enter Marks
                  </button>
                </div>
              </div>
            );
          })
        ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Assigned</h3>
                <p className="text-gray-600">You haven't been assigned to any classes yet. Contact your school administrator.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClassesList;
