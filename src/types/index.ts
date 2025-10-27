export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT' | 'VENDOR';
  schoolId?: string;
  studentId?: string;
  parentId?: string;
  teacherId?: string;
}

export interface School {
  id: string;
  name: string;
  logo?: string;
  address: string;
  contact: string;
  email: string;
}

export interface Class {
  id: string;
  name: string;
  stream: string;
  schoolId: string;
  teacherId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  schoolId: string;
}

export interface Student {
  id: string;
  name: string;
  studentNumber: string;
  classId: string;
  parentId: string;
  schoolId: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  schoolId: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
}

export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  term: string;
  year: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface Result {
  id: string;
  studentId: string;
  subjectId: string;
  marks: number;
  maxMarks: number;
  term: string;
  year: number;
  grade: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}
