import React from 'react';
import { mockClasses, mockStudents, mockTeachers } from '../../data/mockData';

const MyClassesList: React.FC = () => {
  // Filter classes for the current teacher (teacher1)
  const myClasses = mockClasses.filter(cls => cls.teacherId === 'teacher1');

  const getStudentsInClass = (classId: string) => {
    return mockStudents.filter(student => student.classId === classId);
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown Teacher';
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myClasses.map((cls) => {
            const studentsInClass = getStudentsInClass(cls.id);
            return (
              <div key={cls.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-600">Stream: {cls.stream}</p>
                    <p className="text-sm text-gray-600">Teacher: {getTeacherName(cls.teacherId)}</p>
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
          })}
        </div>

        {myClasses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Assigned</h3>
            <p className="text-gray-600">You haven't been assigned to any classes yet. Contact your school administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClassesList;
