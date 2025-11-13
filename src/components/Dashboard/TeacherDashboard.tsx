import React, { useState, useEffect } from 'react';
import api from '../../config/api';

interface DashboardStats {
  totalClasses?: number;
  totalStudents?: number;
  todayAttendance?: {
    present: number;
    total: number;
  };
  myClasses?: Array<{
    id: string;
    name: string;
    stream: string;
  }>;
}

const TeacherDashboard: React.FC = () => {
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Teacher Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Classes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClasses || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents || 0}</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {stats.todayAttendance ? `${stats.todayAttendance.present}/${stats.todayAttendance.total}` : '0/0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Classes</h3>
          <div className="space-y-3">
            {stats.myClasses && stats.myClasses.length > 0 ? (
              stats.myClasses.map((cls) => (
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
              ))
            ) : (
              <p className="text-sm text-gray-500">No classes assigned</p>
            )}
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
