import React, { useState } from 'react';
import { mockStudents, mockResults, mockAttendance, mockClasses } from '../../data/mockData';

const ReportsList: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', icon: '📋' },
    { id: 'academic', name: 'Academic Performance', icon: '📊' },
    { id: 'class', name: 'Class Summary', icon: '👥' },
    { id: 'student', name: 'Individual Student', icon: '👨‍🎓' }
  ];

  const generateReport = () => {
    if (!selectedReport) {
      alert('Please select a report type');
      return;
    }
    
    console.log('Generating report:', { selectedReport, selectedClass, selectedStudent });
    alert('Report generated successfully!');
  };

  const getStudentName = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getClassName = (classId: string) => {
    const cls = mockClasses.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown Class';
  };

  const getStudentResults = (studentId: string) => {
    return mockResults.filter(result => result.studentId === studentId);
  };

  const getStudentAttendance = (studentId: string) => {
    return mockAttendance.filter(att => att.studentId === studentId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reportTypes.map((report) => (
            <div 
              key={report.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedReport === report.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedReport(report.id)}
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
              {selectedReport === 'class' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a class</option>
                    {mockClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.stream})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedReport === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Student
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a student</option>
                    {mockStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.studentNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedReport('');
                  setSelectedClass('');
                  setSelectedStudent('');
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={generateReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Generate Report
              </button>
            </div>
          </div>
        )}

        {/* Sample Reports Display */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">Attendance Report - Form 4A</h4>
                  <p className="text-sm text-gray-600">Generated on 2024-01-15</p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    View
                  </button>
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                    Download
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">Academic Performance - Term 1</h4>
                  <p className="text-sm text-gray-600">Generated on 2024-01-10</p>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    View
                  </button>
                  <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsList;
