import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface Class {
  id: string;
  name: string;
  stream: string;
}

interface Student {
  id: string;
  name: string;
  studentNumber: string;
}

interface ReportData {
  reportType: string;
  data: any;
  generatedAt: string;
  generatedBy: string;
}

const ReportsList: React.FC = () => {
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerateReports = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN' || 
    user.role === 'TEACHER' ||
    user.role === 'STUDENT' ||
    user.role === 'PARENT'
  );

  const canGenerateAdminReports = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN' || 
    user.role === 'TEACHER'
  );

  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', icon: '📋', adminOnly: true },
    { id: 'academic', name: 'Academic Performance', icon: '📊', adminOnly: true },
    { id: 'class', name: 'Class Summary', icon: '👥', adminOnly: true },
    { id: 'student', name: 'Individual Student', icon: '👨‍🎓', adminOnly: false }
  ];

  useEffect(() => {
    if (canGenerateAdminReports) {
      fetchClasses();
      if (selectedReport === 'student' || selectedReport === 'class') {
        fetchStudents();
      }
    } else if (user?.role === 'STUDENT') {
      // Students can only see their own report
      setSelectedStudent(user.id || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selectedReport]);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const data = await api.get('/classes');
      setClasses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const data = await api.get('/students');
      setStudents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const generateReport = async () => {
    if (!selectedReport) {
      toast.error('Please select a report type');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let reportResponse;

      switch (selectedReport) {
        case 'attendance':
          reportResponse = await api.post('/reports/attendance', {
            classId: selectedClass || undefined,
            studentId: selectedStudent || undefined
          });
          break;
        case 'academic':
          reportResponse = await api.post('/reports/academic', {
            classId: selectedClass || undefined,
            studentId: selectedStudent || undefined
          });
          break;
        case 'class':
          if (!selectedClass) {
            toast.error('Please select a class');
            setLoading(false);
            return;
          }
          reportResponse = await api.post(`/reports/class/${selectedClass}`, {});
          break;
        case 'student':
          const studentId = selectedStudent || user?.id;
          if (!studentId) {
            toast.error('Please select a student or ensure you are logged in as a student');
            setLoading(false);
            return;
          }
          reportResponse = await api.post(`/reports/student/${studentId}`, {});
          break;
        default:
          // Use general generate endpoint
          reportResponse = await api.post('/reports/generate', {
            reportType: selectedReport,
            classId: selectedClass || undefined,
            studentId: selectedStudent || undefined
          });
      }

      setReportData({
        reportType: selectedReport,
        data: reportResponse,
        generatedAt: new Date().toISOString(),
        generatedBy: user?.id || 'Unknown'
      });
    } catch (err: any) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report');
      toast.error(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!reportData) return;
    
    const dataStr = JSON.stringify(reportData.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedReport}-report-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!canGenerateReports) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">You do not have permission to generate reports.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reportTypes
            .filter(report => !report.adminOnly || canGenerateAdminReports)
            .map((report) => (
              <div 
                key={report.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedReport === report.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setSelectedReport(report.id);
                  setReportData(null);
                  setError(null);
                }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{report.icon}</div>
                  <h3 className="font-medium text-gray-900">{report.name}</h3>
                </div>
              </div>
            ))}
        </div>

        {selectedReport && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {(selectedReport === 'class' || selectedReport === 'attendance' || selectedReport === 'academic') && canGenerateAdminReports && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class {selectedReport === 'class' && '*'}
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loadingClasses}
                  >
                    <option value="">Choose a class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.stream})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(selectedReport === 'student' || selectedReport === 'attendance' || selectedReport === 'academic') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student {selectedReport === 'student' && '*'}
                    {user?.role === 'STUDENT' && ' (Your Report)'}
                  </label>
                  {user?.role === 'STUDENT' ? (
                    <input
                      type="text"
                      value="Your Report"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  ) : (
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loadingStudents}
                    >
                      <option value="">Choose a student</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.studentNumber})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedReport('');
                  setSelectedClass('');
                  setSelectedStudent('');
                  setReportData(null);
                  setError(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={generateReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        )}

        {reportData && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {reportTypes.find(r => r.id === reportData.reportType)?.name || 'Report'} Results
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleDownloadReport}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Download
                </button>
                <button
                  onClick={() => setReportData(null)}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(reportData.data, null, 2)}
              </pre>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Generated on {new Date(reportData.generatedAt).toLocaleString()}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReportsList;
