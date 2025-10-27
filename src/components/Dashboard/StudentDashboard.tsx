import React from 'react';
import { mockResults, mockNotices } from '../../data/mockData';

const StudentDashboard: React.FC = () => {
  const myResults = mockResults.filter(result => result.studentId === 'student1');
  const recentNotices = mockNotices.slice(0, 3);

  const averageMarks = myResults.length > 0 
    ? Math.round(myResults.reduce((sum, result) => sum + result.marks, 0) / myResults.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Marks</p>
                <p className="text-2xl font-bold text-gray-900">{averageMarks}%</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">95%</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Homework</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h3>
          <div className="space-y-3">
            {myResults.map((result) => (
              <div key={result.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Mathematics</p>
                  <p className="text-sm text-gray-600">Term 1, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{result.marks}/{result.maxMarks}</p>
                  <p className="text-sm text-gray-600">Grade: {result.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notices</h3>
          <div className="space-y-3">
            {recentNotices.map((notice) => (
              <div key={notice.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{notice.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                <p className="text-xs text-gray-500 mt-2">{notice.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
