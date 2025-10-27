import React from 'react';
import { mockResults, mockFees, mockNotices } from '../../data/mockData';

const ParentDashboard: React.FC = () => {
  const childResults = mockResults.filter(result => result.studentId === 'student1');
  const childFees = mockFees.filter(fee => fee.studentId === 'student1');
  const recentNotices = mockNotices.slice(0, 3);

  const averageMarks = childResults.length > 0 
    ? Math.round(childResults.reduce((sum, result) => sum + result.marks, 0) / childResults.length)
    : 0;

  const totalFeesDue = childFees.filter(fee => fee.status === 'pending')
    .reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Parent Dashboard</h2>
        <p className="text-gray-600 mb-6">Monitoring your child's progress at school</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Child's Average</p>
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

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fees Due</p>
                <p className="text-2xl font-bold text-gray-900">${totalFeesDue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Child's Recent Results</h3>
          <div className="space-y-3">
            {childResults.map((result) => (
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Status</h3>
          <div className="space-y-3">
            {childFees.map((fee) => (
              <div key={fee.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{fee.term} {fee.year}</p>
                  <p className="text-sm text-gray-600">Due: {fee.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${fee.amount}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    fee.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {fee.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">School Notices</h3>
        <div className="space-y-3">
          {recentNotices.map((notice) => (
            <div key={notice.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{notice.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{notice.createdAt}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  notice.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : notice.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {notice.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
