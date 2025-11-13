import React, { useState, useEffect } from 'react';
import VendorPostProduct from '../Marketplace/VendorPostProduct';
import api from '../../config/api';

interface DashboardStats {
  totalProducts?: number;
  totalSales?: number;
  totalRevenue?: number;
  pendingOrders?: number;
  recentOrders?: Array<{
    id: string;
    product: string;
    buyer: string;
    amount: number;
    status: string;
  }>;
  topProducts?: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
}

const VendorDashboard: React.FC = () => {
  const [showPostForm, setShowPostForm] = useState(false);
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

  if (showPostForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Post a Product</h2>
          <button
            onClick={() => setShowPostForm(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← Back to Dashboard
          </button>
        </div>
        <VendorPostProduct />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h2>
            <p className="text-gray-600 mt-1">Manage your educational products and sales</p>
          </div>
          <button
            onClick={() => setShowPostForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Post Product
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSales || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.totalRevenue || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="border-b border-gray-200 pb-3 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{order.product}</p>
                      <p className="text-sm text-gray-600">{order.buyer}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Order ID: {order.id}</span>
                    <span className="font-semibold text-gray-900">${order.amount}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent orders</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {stats.topProducts && stats.topProducts.length > 0 ? (
              stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No products yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Selling School Materials</h3>
        <p className="text-gray-700 mb-4">
          This marketplace is dedicated to educational materials only. You can sell:
        </p>
        <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <li>✓ Textbooks & Reference Books</li>
          <li>✓ Exercise Books & Notebooks</li>
          <li>✓ Stationery (Pens, Pencils, Rulers)</li>
          <li>✓ Calculators & Mathematical Tools</li>
          <li>✓ Science Laboratory Equipment</li>
          <li>✓ Art Supplies</li>
          <li>✓ Digital Learning Content</li>
          <li>✓ Educational Software</li>
        </ul>
      </div>
    </div>
  );
};

export default VendorDashboard;
