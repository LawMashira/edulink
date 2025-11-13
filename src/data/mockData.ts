import { User, School, Class, Subject, Student, Teacher, Attendance, Fee, Result, Notice } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@zimeedulink.com',
    name: 'System Administrator',
    role: 'SUPER_ADMIN'
  },
  {
    id: '2',
    email: 'headmaster@school1.co.zw',
    name: 'John Moyo',
    role: 'SCHOOL_ADMIN',
    schoolId: 'school1'
  },
  {
    id: '3',
    email: 'teacher1@school1.co.zw',
    name: 'Sarah Chikwanda',
    role: 'TEACHER',
    schoolId: 'school1',
    teacherId: 'teacher1'
  },
  {
    id: '4',
    email: 'parent1@email.com',
    name: 'Mary Ncube',
    role: 'PARENT',
    schoolId: 'school1',
    parentId: 'parent1'
  },
  {
    id: '5',
    email: 'student1@school1.co.zw',
    name: 'Tendai Moyo',
    role: 'STUDENT',
    schoolId: 'school1',
    studentId: 'student1'
  },
  {
    id: '6',
    email: 'vendor@edubooks.co.zw',
    name: 'Educational Supplies Ltd',
    role: 'VENDOR'
  }
];

export const mockSchools: School[] = [
  {
    id: 'school1',
    name: 'Harare High School',
    address: '123 Samora Machel Avenue, Harare',
    contact: '+263 4 123456',
    email: 'info@hararehigh.co.zw'
  }
];

export const mockClasses: Class[] = [
  {
    id: 'class1',
    name: 'Form 4A',
    stream: 'Science',
    schoolId: 'school1',
    teacherId: 'teacher1'
  },
  {
    id: 'class2',
    name: 'Form 3B',
    stream: 'Arts',
    schoolId: 'school1',
    teacherId: 'teacher2'
  }
];

export const mockSubjects: Subject[] = [
  { id: 'sub1', name: 'Mathematics', code: 'MATH', schoolId: 'school1' },
  { id: 'sub2', name: 'English', code: 'ENG', schoolId: 'school1' },
  { id: 'sub3', name: 'Science', code: 'SCI', schoolId: 'school1' },
  { id: 'sub4', name: 'History', code: 'HIST', schoolId: 'school1' }
];

export const mockStudents: Student[] = [
  {
    id: 'student1',
    name: 'Tendai Moyo',
    studentNumber: 'HHS2024001',
    classId: 'class1',
    parentId: 'parent1',
    schoolId: 'school1'
  },
  {
    id: 'student2',
    name: 'Blessing Ncube',
    studentNumber: 'HHS2024002',
    classId: 'class1',
    parentId: 'parent2',
    schoolId: 'school1'
  },
  {
    id: 'student3',
    name: 'Chiedza Mupfumira',
    studentNumber: 'HHS2024003',
    classId: 'class1',
    parentId: 'parent3',
    schoolId: 'school1'
  },
  {
    id: 'student4',
    name: 'Tafadzwa Chigwada',
    studentNumber: 'HHS2024004',
    classId: 'class2',
    parentId: 'parent4',
    schoolId: 'school1'
  },
  {
    id: 'student5',
    name: 'Rumbidzai Muzenda',
    studentNumber: 'HHS2024005',
    classId: 'class2',
    parentId: 'parent5',
    schoolId: 'school1'
  }
];

export const mockTeachers: Teacher[] = [
  {
    id: 'teacher1',
    name: 'Sarah Chikwanda',
    email: 'teacher1@school1.co.zw',
    subjects: ['sub1', 'sub3'],
    schoolId: 'school1'
  },
  {
    id: 'teacher2',
    name: 'Peter Muzenda',
    email: 'teacher2@school1.co.zw',
    subjects: ['sub2', 'sub4'],
    schoolId: 'school1'
  }
];

export const mockAttendance: Attendance[] = [
  {
    id: 'att1',
    studentId: 'student1',
    classId: 'class1',
    date: '2024-01-15',
    status: 'present',
    markedBy: 'teacher1'
  },
  {
    id: 'att2',
    studentId: 'student2',
    classId: 'class1',
    date: '2024-01-15',
    status: 'absent',
    markedBy: 'teacher1'
  },
  {
    id: 'att3',
    studentId: 'student3',
    classId: 'class1',
    date: '2024-01-15',
    status: 'present',
    markedBy: 'teacher1'
  },
  {
    id: 'att4',
    studentId: 'student4',
    classId: 'class2',
    date: '2024-01-15',
    status: 'late',
    markedBy: 'teacher2'
  },
  {
    id: 'att5',
    studentId: 'student5',
    classId: 'class2',
    date: '2024-01-15',
    status: 'present',
    markedBy: 'teacher2'
  }
];

export const mockFees: Fee[] = [
  {
    id: 'fee1',
    studentId: 'student1',
    schoolId: 'school1',
    amount: 150,
    title: 'Term 1 Tuition Fee 2024',
    term: 'Term 1',
    year: 2024,
    dueDate: '2024-02-15',
    status: 'pending'
  },
  {
    id: 'fee2',
    studentId: 'student2',
    schoolId: 'school1',
    amount: 150,
    title: 'Term 1 Tuition Fee 2024',
    term: 'Term 1',
    year: 2024,
    dueDate: '2024-02-15',
    status: 'paid'
  },
  {
    id: 'fee3',
    studentId: 'student3',
    schoolId: 'school1',
    amount: 150,
    title: 'Term 1 Tuition Fee 2024',
    term: 'Term 1',
    year: 2024,
    dueDate: '2024-02-15',
    status: 'overdue'
  },
  {
    id: 'fee4',
    studentId: 'student4',
    schoolId: 'school1',
    amount: 150,
    title: 'Term 1 Tuition Fee 2024',
    term: 'Term 1',
    year: 2024,
    dueDate: '2024-02-15',
    status: 'paid'
  },
  {
    id: 'fee5',
    studentId: 'student5',
    schoolId: 'school1',
    amount: 150,
    title: 'Term 1 Tuition Fee 2024',
    term: 'Term 1',
    year: 2024,
    dueDate: '2024-02-15',
    status: 'pending'
  }
];

export const mockResults: Result[] = [
  {
    id: 'res1',
    studentId: 'student1',
    subjectId: 'sub1',
    marks: 85,
    maxMarks: 100,
    term: 'Term 1',
    year: 2024,
    grade: 'A'
  },
  {
    id: 'res2',
    studentId: 'student1',
    subjectId: 'sub2',
    marks: 78,
    maxMarks: 100,
    term: 'Term 1',
    year: 2024,
    grade: 'B'
  },
  {
    id: 'res3',
    studentId: 'student1',
    subjectId: 'sub3',
    marks: 92,
    maxMarks: 100,
    term: 'Term 1',
    year: 2024,
    grade: 'A+'
  },
  {
    id: 'res4',
    studentId: 'student2',
    subjectId: 'sub1',
    marks: 65,
    maxMarks: 100,
    term: 'Term 1',
    year: 2024,
    grade: 'C'
  },
  {
    id: 'res5',
    studentId: 'student2',
    subjectId: 'sub2',
    marks: 88,
    maxMarks: 100,
    term: 'Term 1',
    year: 2024,
    grade: 'A'
  },
  {
    id: 'res6',
    studentId: 'student3',
    subjectId: 'sub1',
    marks: 95,
    maxMarks: 100,
    term: 'Term 1',
    year: 2024,
    grade: 'A+'
  }
];

export const mockNotices: Notice[] = [
  {
    id: 'notice1',
    title: 'School Reopening',
    content: 'School reopens on 15th January 2024. All students should report by 8:00 AM.',
    schoolId: 'school1',
    createdBy: 'SCHOOL_ADMIN',
    createdAt: '2024-01-10',
    priority: 'high'
  },
  {
    id: 'notice2',
    title: 'Parent-Teacher Meeting',
    content: 'Parent-teacher meeting scheduled for 20th January 2024 at 2:00 PM.',
    schoolId: 'school1',
    createdBy: 'SCHOOL_ADMIN',
    createdAt: '2024-01-12',
    priority: 'medium'
  },
  {
    id: 'notice3',
    title: 'Sports Day Announcement',
    content: 'Annual sports day will be held on 25th February 2024. All students are encouraged to participate.',
    schoolId: 'school1',
    createdBy: 'SCHOOL_ADMIN',
    createdAt: '2024-01-15',
    priority: 'low'
  },
  {
    id: 'notice4',
    title: 'Fee Payment Reminder',
    content: 'Reminder: Term 1 fees are due by 15th February 2024. Please ensure timely payment.',
    schoolId: 'school1',
    createdBy: 'SCHOOL_ADMIN',
    createdAt: '2024-01-18',
    priority: 'high'
  },
  {
    id: 'notice5',
    title: 'Examination Schedule',
    content: 'Mid-term examinations will commence on 1st March 2024. Study hard and prepare well.',
    schoolId: 'school1',
    createdBy: 'SCHOOL_ADMIN',
    createdAt: '2024-01-20',
    priority: 'medium'
  }
];
