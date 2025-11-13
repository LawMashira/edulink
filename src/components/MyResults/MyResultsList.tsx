import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface Result {
  id: string;
  subjectId: string;
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  marks: number;
  maxMarks: number;
  grade?: string;
  term: string;
  year: number;
}

interface Stats {
  average: number;
  overallGrade: string;
  totalSubjects: number;
}

const MyResultsList: React.FC = () => {
  const { user } = useAuth();
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set default values
  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setSelectedYear(currentYear);
    setSelectedTerm('Term 1');
  }, []);

  // Fetch results when filters change
  useEffect(() => {
    if (selectedTerm && selectedYear && user?.role === 'STUDENT') {
      fetchResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTerm, selectedYear, user]);

  const fetchResults = async () => {
    if (!selectedTerm || !selectedYear) return;

    try {
      setLoading(true);
      setError(null);
      
      // Build query params
      const queryParams = new URLSearchParams();
      if (selectedTerm) queryParams.append('term', selectedTerm);
      if (selectedYear) queryParams.append('year', selectedYear);
      
      const response = await api.get(`/students/my-results?${queryParams.toString()}`);
      
      // Handle different response structures
      if (response.stats && response.results) {
        setStats(response.stats);
        setResults(Array.isArray(response.results) ? response.results : []);
      } else if (Array.isArray(response)) {
        // If response is just an array, calculate stats
        setResults(response);
        calculateStats(response);
      } else {
        // Try to extract stats and results from response
        const statsData = response.stats || {
          average: response.average || 0,
          overallGrade: response.overallGrade || 'N/A',
          totalSubjects: response.totalSubjects || 0
        };
        const resultsData = response.results || response || [];
        setStats(statsData);
        setResults(Array.isArray(resultsData) ? resultsData : []);
      }
    } catch (err: any) {
      console.error('Error fetching results:', err);
      setError(err.message || 'Failed to fetch results');
      setResults([]);
      setStats(null);
      toast.error(err.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (resultsData: Result[]) => {
    if (resultsData.length === 0) {
      setStats({
        average: 0,
        overallGrade: 'N/A',
        totalSubjects: 0
      });
      return;
    }

    const totalMarks = resultsData.reduce((sum, result) => sum + result.marks, 0);
    const totalMaxMarks = resultsData.reduce((sum, result) => sum + result.maxMarks, 0);
    const average = totalMaxMarks > 0 ? Math.round((totalMarks / totalMaxMarks) * 100) : 0;
    const overallGrade = getOverallGrade(average);

    setStats({
      average,
      overallGrade,
      totalSubjects: resultsData.length
    });
  };

  const getOverallGrade = (average: number): string => {
    if (average >= 90) return 'A+';
    if (average >= 80) return 'A';
    if (average >= 70) return 'B';
    if (average >= 60) return 'C';
    if (average >= 50) return 'D';
    return 'F';
  };

  const getSubjectName = (result: Result) => {
    if (result.subject) {
      return result.subject.name;
    }
    return 'Unknown Subject';
  };

  const getGradeColor = (grade: string) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    switch (grade.toUpperCase()) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Academic Results</h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Download Report
            </button>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.average || 0}%</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Grade</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.overallGrade || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalSubjects || results.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading results...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Results Table */}
        {!loading && !error && results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks Obtained
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maximum Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => {
                  const percentage = Math.round((result.marks / result.maxMarks) * 100);
                  const grade = result.grade || getOverallGrade(percentage);
                  return (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getSubjectName(result)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.marks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.maxMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(grade)}`}>
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">No results available for the selected term and year.</p>
          </div>
        ) : null}

        {/* Performance Chart */}
        {!loading && !error && results.length > 0 && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="space-y-3">
              {results.map((result) => {
                const percentage = Math.round((result.marks / result.maxMarks) * 100);
                return (
                  <div key={result.id} className="flex items-center">
                    <div className="w-32 text-sm font-medium text-gray-900">
                      {getSubjectName(result)}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            percentage >= 80 ? 'bg-green-500' : 
                            percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600 text-right">
                      {percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyResultsList;
