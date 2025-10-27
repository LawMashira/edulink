import React from 'react';
import { mockClasses, mockStudents, mockAttendance } from '../../data/mockData';

const TeacherDashboard: React.FC = () => {
  const myClasses = mockClasses.filter(cls => cls.teacherId === 'teacher1');
  const totalStudents = mockStudents.length;
  const todayAttendance = mockAttendance.filter(att => att.date === '2024-01-15');
  const presentCount = todayAttendance.filter(att => att.status === 'present').length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Teacher Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Attendance</p>
                <p className="text-2xl font-bold text-gray-900">{presentCount}/{totalStudents}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Classes</h3>
          <div className="space-y-3">
            {myClasses.map((cls) => (
              <div key={cls.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{cls.name}</h4>
                    <p className="text-sm text-gray-600">{cls.stream}</p>
                  </div>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    View Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-center">
                <span className="text-2xl block mb-2">📋</span>
                <p className="text-sm font-medium">Mark Attendance</p>
              </div>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="text-center">
                <span className="text-2xl block mb-2">📝</span>
                <p className="text-sm font-medium">Enter Marks</p>
              </div>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="text-center">
                <span className="text-2xl block mb-2">📚</span>
                <p className="text-sm font-medium">Assign Homework</p>
              </div>
            </button>
            <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
              <div className="text-center">
                <span className="text-2xl block mb-2">📊</span>
                <p className="text-sm font-medium">View Reports</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
