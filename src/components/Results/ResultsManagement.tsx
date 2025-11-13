import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface Result {
  id: string;
  studentId: string;
  student?: {
    id: string;
    name: string;
    studentNumber: string;
    parentId?: string;
    parent?: {
      id: string;
      name: string;
      email?: string;
    };
    classId?: string;
    class?: {
      id: string;
      name: string;
      teacherId?: string;
      teacher?: {
        id: string;
        name: string;
      };
    };
  };
  studentName?: string;
  studentNumber?: string;
  parentName?: string;
  className?: string;
  teacherName?: string;
  subjectId: string;
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  subjectName?: string;
  marks: number;
  maxMarks: number;
  grade: string;
  term: string;
  year: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Student {
  id: string;
  name: string;
  studentNumber: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Statistics {
  totalResults?: number;
  averageGrade?: string;
  topPerformer?: {
    name: string;
    averageMarks: number;
  };
}

const ResultsManagement: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    classId: '',
    subjectId: '',
    studentId: '',
    term: '',
    year: new Date().getFullYear().toString()
  });
  
  // Form states
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState('100');
  const [term, setTerm] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  // Modal states
  const [showAddMarksModal, setShowAddMarksModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  // Only teachers can add/edit marks
  const canAddMarks = user?.role === 'TEACHER';
  
  // All roles can view results
  const canViewResults = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN' || 
    user.role === 'TEACHER' ||
    user.role === 'PARENT' ||
    user.role === 'STUDENT'
  );

  // Only admins and teachers can download reports (backend restriction)
  const canDownloadReport = user && (
    user.role === 'SCHOOL_ADMIN' || 
    user.role === 'SUPER_ADMIN' || 
    user.role === 'TEACHER'
  );

  useEffect(() => {
    if (canViewResults) {
      fetchResults();
      fetchStatistics();
    }
    // Only teachers and admins need students/subjects for adding marks
    if (canAddMarks || user?.role === 'SCHOOL_ADMIN' || user?.role === 'SUPER_ADMIN') {
      fetchStudents();
      fetchSubjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filters]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.classId) queryParams.append('classId', filters.classId);
      if (filters.subjectId) queryParams.append('subjectId', filters.subjectId);
      if (filters.studentId) queryParams.append('studentId', filters.studentId);
      if (filters.term) queryParams.append('term', filters.term);
      if (filters.year) queryParams.append('year', filters.year);

      const endpoint = `/results${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const data = await api.get(endpoint);
      setResults(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching results:', err);
      setError(err.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.classId) queryParams.append('classId', filters.classId);
      if (filters.subjectId) queryParams.append('subjectId', filters.subjectId);
      if (filters.term) queryParams.append('term', filters.term);
      if (filters.year) queryParams.append('year', filters.year);

      const endpoint = `/results/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const data = await api.get(endpoint);
      setStatistics(data);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await api.get('/students');
      setStudents(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await api.get('/subjects');
      setSubjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching subjects:', err);
    }
  };

  const handleAddMarks = async () => {
    if (!selectedStudent || !selectedSubject || !marks || !term) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/results', {
        studentId: selectedStudent,
        subjectId: selectedSubject,
        marks: parseFloat(marks),
        maxMarks: parseFloat(maxMarks),
        term,
        year: parseInt(year)
      });
      toast.success('Marks added successfully!');
      setShowAddMarksModal(false);
      setSelectedStudent('');
      setSelectedSubject('');
      setMarks('');
      setMaxMarks('100');
      setTerm('');
      setYear(new Date().getFullYear().toString());
      fetchResults();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add marks');
    }
  };

  const handleUpdateMarks = async () => {
    if (!selectedResult || !marks || !term) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.put(`/results/${selectedResult.id}`, {
        marks: parseFloat(marks),
        maxMarks: parseFloat(maxMarks),
        term,
        year: parseInt(year)
      });
      toast.success('Marks updated successfully!');
      setShowEditModal(false);
      setSelectedResult(null);
      setMarks('');
      setMaxMarks('100');
      setTerm('');
      fetchResults();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update marks');
    }
  };

  const handleDeleteMarks = async (resultId: string) => {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return;
    }

    try {
      await api.delete(`/results/${resultId}`);
      toast.success('Result deleted successfully!');
      fetchResults();
      fetchStatistics();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete result');
    }
  };

  const handleDownloadReport = async () => {
    try {
      // Build query parameters matching backend expectations
      const queryParams = new URLSearchParams();
      if (filters.classId) queryParams.append('classId', filters.classId);
      if (filters.subjectId) queryParams.append('subjectId', filters.subjectId);
      if (filters.studentId) queryParams.append('studentId', filters.studentId);
      if (filters.term) queryParams.append('term', filters.term);
      if (filters.year) queryParams.append('year', filters.year);

      const endpoint = `/results/export${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const token = localStorage.getItem('accessToken');
      
      // Fetch PDF from backend
      const response = await fetch(`${api.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to download report' }));
        throw new Error(errorData.message || 'Failed to download report');
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/pdf')) {
        // It's a PDF from backend, download it
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `results-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('PDF report downloaded successfully!');
      } else {
        // Backend returned something else, try fallback
        if (results.length === 0) {
          toast.error('No results to download. Please apply filters to see results.');
          return;
        }
        generateSchoolReport();
      }
    } catch (err: any) {
      console.error('Error downloading report:', err);
      // Fallback to client-side generation if backend fails
      if (results.length === 0) {
        toast.error('No results to download. Please apply filters to see results.');
        return;
      }
      generateSchoolReport();
    }
  };

  const generateSchoolReport = () => {
    if (results.length === 0) {
      toast.error('No results to generate report.');
      return;
    }

    // Generate professional school report design
    const reportDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });

    // Get school info from user context if available
    const schoolName = user?.schoolName || 'School Name';
    const currentTerm = filters.term || results[0]?.term || '';
    const currentYear = filters.year || results[0]?.year || new Date().getFullYear();

    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Academic Results Report</title>
        <style>
          @media print {
            @page {
              margin: 0.8cm;
              size: A4;
            }
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Times New Roman', 'Georgia', serif;
            margin: 0;
            padding: 15px;
            color: #1a1a1a;
            font-size: 10px;
            line-height: 1.4;
            background: #fff;
          }
          .report-container {
            max-width: 100%;
            margin: 0 auto;
          }
          .school-header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 3px double #1a1a1a;
          }
          .school-name {
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 1px;
            margin-bottom: 5px;
            color: #1a1a1a;
            text-transform: uppercase;
          }
          .school-motto {
            font-size: 10px;
            font-style: italic;
            color: #555;
            margin-bottom: 8px;
          }
          .report-title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 12px 0 8px 0;
            color: #1a1a1a;
          }
          .report-info {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            margin-bottom: 12px;
            padding: 8px;
            background-color: #f8f9fa;
            border-left: 3px solid #2563eb;
          }
          .info-item {
            margin: 2px 0;
          }
          .info-label {
            font-weight: bold;
            color: #555;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            font-size: 9px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          thead {
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
            color: white;
          }
          th {
            padding: 8px 6px;
            text-align: left;
            font-weight: bold;
            font-size: 9px;
            border: 1px solid #1e3a8a;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          tbody tr {
            border-bottom: 1px solid #e5e7eb;
            transition: background-color 0.2s;
          }
          tbody tr:nth-child(even) {
            background-color: #f9fafb;
          }
          tbody tr:hover {
            background-color: #f3f4f6;
          }
          td {
            padding: 6px;
            font-size: 9px;
            border: 1px solid #e5e7eb;
          }
          .grade-cell {
            font-weight: bold;
          }
          .grade-A-plus {
            color: #059669;
          }
          .grade-A {
            color: #10b981;
          }
          .grade-B {
            color: #3b82f6;
          }
          .grade-C {
            color: #f59e0b;
          }
          .grade-D, .grade-F {
            color: #ef4444;
          }
          .summary-section {
            margin-top: 15px;
            padding: 10px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 2px solid #2563eb;
            border-radius: 4px;
            font-size: 9px;
          }
          .summary-title {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 6px;
            color: #1e40af;
            text-transform: uppercase;
          }
          .summary-item {
            margin: 3px 0;
            padding-left: 10px;
          }
          .footer {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 2px solid #e5e7eb;
            font-size: 8px;
            color: #666;
            text-align: center;
          }
          .signature-section {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
          }
          .signature-box {
            text-align: center;
            width: 45%;
          }
          .signature-line {
            border-top: 1px solid #1a1a1a;
            margin-top: 40px;
            padding-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="school-header">
            <div class="school-name">${schoolName}</div>
            <div class="school-motto">Excellence in Education</div>
            <div class="report-title">Academic Results Report</div>
          </div>
          
          <div class="report-info">
            <div>
              <div class="info-item"><span class="info-label">Term:</span> ${currentTerm}</div>
              <div class="info-item"><span class="info-label">Academic Year:</span> ${currentYear}</div>
            </div>
            <div>
              <div class="info-item"><span class="info-label">Report Date:</span> ${reportDate}</div>
              <div class="info-item"><span class="info-label">Total Records:</span> ${results.length}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Student</th>
                <th style="width: 10%;">Student #</th>
                <th style="width: 12%;">Parent</th>
                <th style="width: 10%;">Class/Grade</th>
                <th style="width: 12%;">Teacher</th>
                <th style="width: 12%;">Subject</th>
                <th style="width: 10%;">Marks</th>
                <th style="width: 8%;">Grade</th>
                <th style="width: 6%;">Term</th>
                <th style="width: 5%;">Year</th>
              </tr>
            </thead>
            <tbody>
    `;

    results.forEach((result: Result) => {
      const percentage = ((result.marks / result.maxMarks) * 100).toFixed(0);
      const gradeClass = `grade-${result.grade.replace('+', '-plus').replace(/\s/g, '-')}`;
      
      htmlContent += `
              <tr>
                <td><strong>${getStudentName(result)}</strong></td>
                <td>${getStudentNumber(result) || 'N/A'}</td>
                <td>${getParentName(result)}</td>
                <td>${getClassName(result)}</td>
                <td>${getTeacherName(result)}</td>
                <td>${getSubjectName(result)}</td>
                <td>${result.marks}/${result.maxMarks} <span style="color: #2563eb;">(${percentage}%)</span></td>
                <td class="grade-cell ${gradeClass}">${result.grade}</td>
                <td>${result.term || 'N/A'}</td>
                <td>${result.year || 'N/A'}</td>
              </tr>
      `;
    });

    // Calculate summary statistics
    const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
    const totalMaxMarks = results.reduce((sum, r) => sum + r.maxMarks, 0);
    const averagePercentage = totalMaxMarks > 0 ? ((totalMarks / totalMaxMarks) * 100).toFixed(1) : '0';

    htmlContent += `
            </tbody>
          </table>

          <div class="summary-section">
            <div class="summary-title">Report Summary</div>
            <div class="summary-item"><strong>Total Results:</strong> ${results.length}</div>
            <div class="summary-item"><strong>Average Performance:</strong> ${averagePercentage}%</div>
            <div class="summary-item"><strong>Academic Term:</strong> ${currentTerm || 'N/A'}</div>
            <div class="summary-item"><strong>Academic Year:</strong> ${currentYear}</div>
            ${results.length > 0 ? `
            <div class="summary-item"><strong>Students Count:</strong> ${new Set(results.map(r => r.studentId)).size}</div>
            <div class="summary-item"><strong>Subjects Count:</strong> ${new Set(results.map(r => r.subjectId)).size}</div>
            ` : ''}
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">Principal/Head Teacher</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">Date</div>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated report. For official copies, please contact the school administration.</p>
            <p>Generated on ${reportDate} | ${schoolName}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      setTimeout(() => {
        printWindow.print();
      }, 250);
    } else {
      // Fallback: download as HTML file
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `results-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const handleEditResult = (result: Result) => {
    setSelectedResult(result);
    setMarks(result.marks.toString());
    setMaxMarks(result.maxMarks.toString());
    setTerm(result.term);
    setYear(result.year.toString());
    setShowEditModal(true);
  };

  const getStudentName = (result: Result) => {
    return result.studentName || result.student?.name || 'Unknown Student';
  };

  const getStudentNumber = (result: Result) => {
    return result.studentNumber || result.student?.studentNumber || '';
  };

  const getParentName = (result: Result) => {
    return result.parentName || result.student?.parent?.name || 'N/A';
  };

  const getClassName = (result: Result) => {
    return result.className || result.student?.class?.name || 'N/A';
  };

  const getTeacherName = (result: Result) => {
    return result.teacherName || result.student?.class?.teacher?.name || 'N/A';
  };

  const getSubjectName = (result: Result) => {
    return result.subjectName || result.subject?.name || 'Unknown Subject';
  };

  const calculateGrade = (marks: number, maxMarks: number) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  if (!canViewResults) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">You do not have permission to view results.</p>
      </div>
    );
  }

  if (loading && results.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Results Management</h2>
          <div className="flex space-x-2">
            {canAddMarks && (
              <button
                onClick={() => setShowAddMarksModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Marks
              </button>
            )}
            {canDownloadReport && (
              <button
                onClick={handleDownloadReport}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Download Report
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Student</label>
              <select
                value={filters.studentId}
                onChange={(e) => setFilters({...filters, studentId: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Students</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={filters.subjectId}
                onChange={(e) => setFilters({...filters, subjectId: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Term</label>
              <select
                value={filters.term}
                onChange={(e) => setFilters({...filters, term: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Terms</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Year"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ classId: '', subjectId: '', studentId: '', term: '', year: new Date().getFullYear().toString() })}
                className="w-full px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Results</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.totalResults || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Grade</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.averageGrade || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Top Performer</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.topPerformer?.name || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Term
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.length > 0 ? (
                results.map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getStudentName(result)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getSubjectName(result)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.marks}/{result.maxMarks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.grade === 'A' || result.grade === 'A+'
                          ? 'bg-green-100 text-green-800'
                          : result.grade === 'B'
                          ? 'bg-blue-100 text-blue-800'
                          : result.grade === 'C'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.term} {result.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {canAddMarks && (
                        <>
                          <button
                            onClick={() => handleEditResult(result)}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMarks(result.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {!canAddMarks && (
                        <span className="text-gray-400 text-xs">View Only</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Marks Modal */}
      {showAddMarksModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Student Marks</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a student</option>
                  {students.map((student: Student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.studentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a subject</option>
                  {subjects.map((subject: Subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks Obtained *
                  </label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter marks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Marks *
                  </label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term *
                  </label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select term</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {marks && maxMarks && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Grade: <span className="font-medium">{calculateGrade(parseFloat(marks), parseFloat(maxMarks))}</span>
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddMarksModal(false);
                    setSelectedStudent('');
                    setSelectedSubject('');
                    setMarks('');
                    setMaxMarks('100');
                    setTerm('');
                    setYear(new Date().getFullYear().toString());
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMarks}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Marks Modal */}
      {showEditModal && selectedResult && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Student Marks</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks Obtained *
                  </label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter marks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Marks *
                  </label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Term *
                  </label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {marks && maxMarks && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Grade: <span className="font-medium">{calculateGrade(parseFloat(marks), parseFloat(maxMarks))}</span>
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedResult(null);
                    setMarks('');
                    setMaxMarks('100');
                    setTerm('');
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMarks}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update Marks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsManagement;
