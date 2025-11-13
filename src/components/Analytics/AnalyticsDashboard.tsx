import React, { useState, useEffect } from 'react';
import api from '../../config/api';

const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRate: 0,
    averageMarks: 0,
    totalFees: 0,
    paidFees: 0,
    collectionRate: 0,
    gradeDistribution: {} as Record<string, number>
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.get('/analytics');
      setStats({
        totalStudents: data.totalStudents || 0,
        totalTeachers: data.totalTeachers || 0,
        totalClasses: data.totalClasses || 0,
        attendanceRate: data.attendanceRate || 0,
        averageMarks: data.averageMarks || 0,
        totalFees: data.totalFees || 0,
        paidFees: data.paidFees || 0,
        collectionRate: data.collectionRate || 0,
        gradeDistribution: data.gradeDistribution || {}
      });
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">School Analytics Dashboard</h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👨‍🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Classes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg per Class</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalClasses > 0 ? Math.round(stats.totalStudents / stats.totalClasses) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Performance</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.attendanceRate}%</div>
              <p className="text-gray-600">Average Attendance Rate</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${stats.attendanceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Performance</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.averageMarks}%</div>
              <p className="text-gray-600">Average Marks</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats.averageMarks}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Collection</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Fees</span>
                <span className="font-semibold">${stats.totalFees}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Collected</span>
                <span className="font-semibold text-green-600">${stats.paidFees}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Outstanding</span>
                <span className="font-semibold text-red-600">${stats.totalFees - stats.paidFees}</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Collection Rate</span>
                  <span className="text-sm font-semibold">{stats.collectionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats.collectionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
            <div className="space-y-3">
              {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="flex justify-between items-center">
                  <span className="text-gray-600">Grade {grade}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Object.keys(stats.gradeDistribution).length > 0 ? (count / Object.values(stats.gradeDistribution).reduce((a, b) => a + b, 0)) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="text-center">
                <span className="text-2xl block mb-2">📊</span>
                <p className="font-medium">Generate Report</p>
              </div>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="text-center">
                <span className="text-2xl block mb-2">📈</span>
                <p className="font-medium">View Trends</p>
              </div>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="text-center">
                <span className="text-2xl block mb-2">📋</span>
                <p className="font-medium">Export Data</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
