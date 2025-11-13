import React, { useState, useEffect } from 'react';
import api from '../../config/api';

interface DashboardStats {
  averageMarks?: number;
  attendanceRate?: number;
  pendingHomework?: number;
  recentResults?: Array<{
    id: string;
    subjectName?: string;
    marks: number;
    maxMarks: number;
    grade: string;
    term?: string;
    year?: number;
  }>;
  recentNotices?: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
  }>;
}

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await api.get('/dashboard/stats');
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message || 'Failed to fetch dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Marks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageMarks || 0}%</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate || 0}%</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.pendingHomework || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h3>
          <div className="space-y-3">
            {stats.recentResults && stats.recentResults.length > 0 ? (
              stats.recentResults.map((result) => (
                <div key={result.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{result.subjectName || 'Subject'}</p>
                    <p className="text-sm text-gray-600">
                      {result.term && result.year ? `Term ${result.term}, ${result.year}` : 'Recent'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{result.marks}/{result.maxMarks}</p>
                    <p className="text-sm text-gray-600">Grade: {result.grade}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent results</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notices</h3>
          <div className="space-y-3">
            {stats.recentNotices && stats.recentNotices.length > 0 ? (
              stats.recentNotices.map((notice) => (
                <div key={notice.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{notice.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notice.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent notices</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
