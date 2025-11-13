import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import { toast } from 'react-toastify';

interface Student {
  id: string;
  name: string;
  studentNumber: string;
}

interface Class {
  id: string;
  name: string;
  stream: string;
}

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
}

const AttendanceList: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  const canMarkAttendance = user && (
    user.role === 'TEACHER' || 
    user.role === 'SCHOOL_ADMIN'
  );

  useEffect(() => {
    if (canMarkAttendance) {
      fetchClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchStudents();
      fetchAttendanceRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      let data;
      
      // For teachers, use the teacher's classes endpoint
      if (user?.role === 'TEACHER') {
        try {
          data = await api.get('/teachers/my-classes');
          // The endpoint might return different structure, handle it
          if (Array.isArray(data)) {
            setClasses(data);
          } else if (data.classes && Array.isArray(data.classes)) {
            setClasses(data.classes);
          } else {
            setClasses([]);
          }
        } catch (teacherErr: any) {
          // Fallback to /classes if teacher endpoint doesn't work
          console.warn('Teacher classes endpoint failed, trying /classes:', teacherErr);
          data = await api.get('/classes');
          setClasses(Array.isArray(data) ? data : []);
        }
      } else {
        // For school admins, try /classes endpoint
        data = await api.get('/classes');
        setClasses(Array.isArray(data) ? data : []);
      }
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      // Don't set error state, just log it - the component will show "No classes available"
      setClasses([]);
      // Only show error for 404, not for other errors (might be permission issues)
      if (err.message && err.message.includes('404')) {
        setError('Classes endpoint not found. Please ensure the backend has a classes endpoint configured.');
      }
    }
  };

  const fetchStudents = async () => {
    if (!selectedClass) return;

    try {
      setLoading(true);
      let studentsData: Student[] = [];
      
      // Try the attendance endpoint first
      try {
        const data = await api.get(`/attendance/class/${selectedClass}/students`);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          studentsData = data;
        } else if (data && Array.isArray(data.students)) {
          studentsData = data.students;
        } else if (data && Array.isArray(data.data)) {
          studentsData = data.data;
        } else if (data && typeof data === 'object') {
          // If it's an object with array-like structure, try to find array values
          const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
          if (arrayKey) {
            studentsData = data[arrayKey];
          }
        }
      } catch (attendanceErr: any) {
        console.warn('Attendance endpoint failed, trying students endpoint:', attendanceErr);
        
        // Fallback: fetch all students and filter by class
        try {
          const allStudents = await api.get('/students');
          const studentsArray = Array.isArray(allStudents) ? allStudents : 
                               (allStudents?.students || allStudents?.data || []);
          
          // Filter students by classId
          studentsData = studentsArray.filter((student: any) => 
            student.classId === selectedClass || 
            student.class?.id === selectedClass ||
            student.classId === selectedClass
          );
        } catch (studentsErr: any) {
          console.error('Both endpoints failed:', studentsErr);
          throw new Error('Failed to fetch students. Please ensure students are assigned to this class.');
        }
      }
      
      setStudents(studentsData);
      
      if (studentsData.length === 0) {
        setError('No students found in this class. Please ensure students are assigned to this class in the Students management section.');
      } else {
        setError(null);
      }
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to fetch students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRecords = async () => {
    if (!selectedClass || !selectedDate) return;

    try {
      setLoading(true);
      const data = await api.get(`/attendance/class/${selectedClass}/records?date=${selectedDate}`);
      
      // Convert attendance records to the format we need
      const attendanceMap: Record<string, 'present' | 'absent' | 'late'> = {};
      if (Array.isArray(data)) {
        data.forEach((record: AttendanceRecord) => {
          attendanceMap[record.studentId] = record.status;
        });
      }
      setAttendance(attendanceMap);
      setError(null);
    } catch (err: any) {
      // If no records exist for this date, that's okay
      if (err.message && !err.message.includes('404')) {
        console.error('Error fetching attendance records:', err);
        setError(err.message || 'Failed to fetch attendance records');
      }
      // Clear attendance if no records found
      setAttendance({});
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
    setHasUnsavedChanges(true);
  };

  // Bulk actions
  const markAll = (status: 'present' | 'absent' | 'late') => {
    const newAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
    setHasUnsavedChanges(true);
  };

  // Auto-mark default: Present for all
  const autoMarkDefault = () => {
    const newAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach(student => {
      // If not already marked, default to present
      if (!attendance[student.id]) {
        newAttendance[student.id] = 'present';
      } else {
        newAttendance[student.id] = attendance[student.id];
      }
    });
    setAttendance(newAttendance);
    setHasUnsavedChanges(true);
  };

  // Filter students by search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: students.length,
    marked: Object.keys(attendance).length,
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    late: Object.values(attendance).filter(s => s === 'late').length,
    unmarked: students.length - Object.keys(attendance).length
  };

  // Check if all students are marked
  const isComplete = stats.marked === stats.total && stats.unmarked === 0;

  const saveAttendance = async () => {
    if (!selectedClass || !selectedDate) {
      toast.error('Please select a class and date');
      return;
    }

    if (Object.keys(attendance).length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    // Warning if not all students are marked
    if (stats.unmarked > 0) {
      const proceed = window.confirm(
        `Warning: ${stats.unmarked} student(s) have not been marked. Do you want to save anyway?`
      );
      if (!proceed) return;
    }

    try {
      setSaving(true);
      
      // Ensure all students have attendance marked (default to absent if unmarked)
      const attendanceArray: AttendanceRecord[] = students.map(student => ({
        studentId: student.id,
        status: attendance[student.id] || 'absent'
      }));

      await api.post('/attendance/mark', {
        classId: selectedClass,
        date: selectedDate,
        attendance: attendanceArray
      });

      setHasUnsavedChanges(false);
      setLastSavedTime(new Date());
      toast.success('Attendance saved successfully!');
      // Refresh attendance records to reflect saved state
      fetchAttendanceRecords();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  // Auto-mark default when class/date changes
  useEffect(() => {
    if (students.length > 0 && Object.keys(attendance).length === 0) {
      autoMarkDefault();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (!canMarkAttendance) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">You do not have permission to mark attendance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mark Attendance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
              Select Class *
            </label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.stream})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date *
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> {error}
            </p>
          </div>
        )}

        {classes.length === 0 && !loading && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Info:</strong> No classes available. If you're a teacher, make sure you're assigned to classes. 
              If you're a school admin, ensure classes are created in the system.
            </p>
          </div>
        )}

        {!selectedClass ? (
          <div className="text-center py-12 text-gray-500">
            <p>Please select a class to mark attendance</p>
          </div>
        ) : loading && students.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4 max-w-md mx-auto">
              <p className="text-yellow-800 font-semibold mb-2">No Students Found</p>
              {error && (
                <p className="text-yellow-700 text-sm">{error}</p>
              )}
              {!error && (
                <p className="text-yellow-700 text-sm">
                  No students are currently assigned to this class. 
                  Please assign students to this class in the Students management section.
                </p>
              )}
            </div>
            <button
              onClick={() => {
                fetchStudents();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              Refresh Student List
            </button>
          </div>
        ) : (
          <>
            {/* Bulk Actions and Search */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by name or student number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => markAll('present')}
                  className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                  title="Mark all present"
                >
                  All Present
                </button>
                <button
                  onClick={() => markAll('absent')}
                  className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                  title="Mark all absent"
                >
                  All Absent
                </button>
                <button
                  onClick={() => markAll('late')}
                  className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                  title="Mark all late"
                >
                  All Late
                </button>
                <button
                  onClick={autoMarkDefault}
                  className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                  title="Auto-mark unmarked as present"
                >
                  Auto-Fill
                </button>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total</p>
                  <p className="font-bold text-gray-900">{stats.total}</p>
                </div>
                <div>
                  <p className="text-green-600">Present</p>
                  <p className="font-bold text-green-900">{stats.present}</p>
                </div>
                <div>
                  <p className="text-red-600">Absent</p>
                  <p className="font-bold text-red-900">{stats.absent}</p>
                </div>
                <div>
                  <p className="text-yellow-600">Late</p>
                  <p className="font-bold text-yellow-900">{stats.late}</p>
                </div>
                <div>
                  <p className="text-gray-600">Unmarked</p>
                  <p className={`font-bold ${stats.unmarked > 0 ? 'text-orange-900' : 'text-gray-900'}`}>
                    {stats.unmarked}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Progress</p>
                  <p className="font-bold text-gray-900">
                    {stats.total > 0 ? Math.round((stats.marked / stats.total) * 100) : 0}%
                  </p>
                </div>
              </div>
              {stats.unmarked > 0 && (
                <div className="mt-2 text-xs text-orange-700">
                  Warning: {stats.unmarked} student(s) not yet marked
                </div>
              )}
              {isComplete && (
                <div className="mt-2 text-xs text-green-700">
                  All students marked - Ready to save
                </div>
              )}
              {lastSavedTime && (
                <div className="mt-2 text-xs text-gray-500">
                  Last saved: {lastSavedTime.toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Number
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => {
                      const currentStatus = attendance[student.id];
                      const isMarked = !!currentStatus;
                      return (
                        <tr 
                          key={student.id}
                          className={!isMarked ? 'bg-orange-50' : currentStatus === 'present' ? 'bg-green-50' : currentStatus === 'absent' ? 'bg-red-50' : 'bg-yellow-50'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                            {!isMarked && (
                              <span className="ml-2 text-xs text-orange-600">(unmarked)</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.studentNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'present')}
                                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                                  currentStatus === 'present'
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-green-100 hover:text-green-800'
                                }`}
                                title="Mark as Present (Keyboard: P)"
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'absent')}
                                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                                  currentStatus === 'absent'
                                    ? 'bg-red-500 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-800'
                                }`}
                                title="Mark as Absent (Keyboard: A)"
                              >
                                Absent
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'late')}
                                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                                  currentStatus === 'late'
                                    ? 'bg-yellow-500 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                                }`}
                                title="Mark as Late (Keyboard: L)"
                              >
                                Late
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No students found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {selectedClass && students.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t pt-4">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-600">
                {stats.marked > 0 && (
                  <span>
                    <strong className="text-green-600">{stats.present}</strong> Present, {' '}
                    <strong className="text-red-600">{stats.absent}</strong> Absent, {' '}
                    <strong className="text-yellow-600">{stats.late}</strong> Late
                  </span>
                )}
              </div>
              {hasUnsavedChanges && (
                <div className="text-xs text-orange-600">
                  Warning: You have unsaved changes
                </div>
              )}
              {lastSavedTime && !hasUnsavedChanges && (
                <div className="text-xs text-green-600">
                  Saved at {lastSavedTime.toLocaleTimeString()}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (hasUnsavedChanges) {
                    const confirm = window.confirm('You have unsaved changes. Are you sure you want to refresh?');
                    if (!confirm) return;
                  }
                  fetchAttendanceRecords();
                  setHasUnsavedChanges(false);
                }}
                disabled={saving}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Refresh
              </button>
              <button
                onClick={saveAttendance}
                disabled={saving || !selectedClass || stats.marked === 0}
                className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-all ${
                  isComplete && !saving
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Saving...
                  </span>
                ) : (
                  `Save Attendance${isComplete ? ' (Complete)' : ''}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;
