export interface Child {
  id: string;
  name: string;
  grade: string;
  section: string;
  profilePic: string;
  school: string;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'holiday';
}

export interface Homework {
  id: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  teacher: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

export interface ExamResult {
  id: string;
  subject: string;
  examName: string;
  date: string;
  marks: number;
  totalMarks: number;
  grade: string;
  status: 'passed' | 'failed';
}

export interface TimetableEntry {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  day: string;
}

export interface Fee {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  category?: 'Academics' | 'Library' | 'Transport' | 'Other';
  term?: string;
  paidDate?: string;
  type?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'general' | 'urgent' | 'event';
  author: string;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  content: string;
  date: string;
  type: 'teacher' | 'admin' | 'system';
  read: boolean;
}