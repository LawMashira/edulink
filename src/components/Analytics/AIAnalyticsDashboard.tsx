import React, { useState } from 'react';
import { aiAnalytics, businessIntelligence, performanceAnalytics } from '../../data/advancedMockData';

const AIAnalyticsDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">AI-Powered Analytics Dashboard</h2>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{businessIntelligence.realTimeMetrics.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{businessIntelligence.realTimeMetrics.attendanceRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fee Collection</p>
                <p className="text-2xl font-bold text-gray-900">{businessIntelligence.realTimeMetrics.feeCollectionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{businessIntelligence.realTimeMetrics.activeTeachers}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">📱</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Parent Engagement</p>
                <p className="text-2xl font-bold text-gray-900">{businessIntelligence.realTimeMetrics.parentEngagement}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Predictive Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI Predictive Insights</h3>
            <div className="space-y-4">
              {aiAnalytics.predictiveInsights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  insight.riskLevel === 'high' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{insight.name}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      insight.riskLevel === 'high' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {insight.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Predicted Grade: <span className="font-semibold">{insight.predictedGrade}</span> 
                    (Confidence: {insight.confidence}%)
                  </p>
                  <div className="text-xs text-gray-500">
                    <p className="font-medium mb-1">Key Factors:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {insight.factors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Attendance Patterns</h3>
            <div className="space-y-4">
              {aiAnalytics.attendancePatterns.map((pattern, index) => (
                <div key={index} className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{pattern.pattern}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-semibold ml-2">{pattern.frequency} times</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Affected:</span>
                      <span className="font-semibold ml-2">{pattern.affectedStudents} students</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{pattern.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fee Collection Optimization */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Smart Fee Collection Optimization</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {aiAnalytics.feeCollectionOptimization.averageCollectionRate}%
              </div>
              <p className="text-gray-600">Current Collection Rate</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {aiAnalytics.feeCollectionOptimization.optimalCollectionTime}
              </div>
              <p className="text-gray-600">Optimal Collection Time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">+12%</div>
              <p className="text-gray-600">Potential Improvement</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">AI Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {aiAnalytics.feeCollectionOptimization.suggestedActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Comparative Analytics */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏫 Comparative Analytics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Collection</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {businessIntelligence.comparativeAnalytics.map((school, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {school.school}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.attendanceRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.performance}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.feeCollection}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;
