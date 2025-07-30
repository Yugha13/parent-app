import { Child, AttendanceRecord, Homework, ExamResult, TimetableEntry, Fee, Notice, Message } from '../types';

export const mockChildren: Child[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    grade: '8th',
    section: 'A',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    school: 'Green Valley School'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    grade: '5th',
    section: 'B',
    profilePic: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=100&h=100&fit=crop&crop=face',
    school: 'Green Valley School'
  }
];

export const mockAttendance: { [childId: string]: AttendanceRecord[] } = {
  '1': [
    { date: '2024-01-15', status: 'present' },
    { date: '2024-01-16', status: 'present' },
    { date: '2024-01-17', status: 'late' },
    { date: '2024-01-18', status: 'present' },
    { date: '2024-01-19', status: 'absent' },
    { date: '2024-01-22', status: 'present' },
    { date: '2024-01-23', status: 'present' },
  ],
  '2': [
    { date: '2024-01-15', status: 'present' },
    { date: '2024-01-16', status: 'present' },
    { date: '2024-01-17', status: 'present' },
    { date: '2024-01-18', status: 'late' },
    { date: '2024-01-19', status: 'present' },
    { date: '2024-01-22', status: 'present' },
    { date: '2024-01-23', status: 'absent' },
  ]
};

export const mockHomework: { [childId: string]: Homework[] } = {
  '1': [
    {
      id: '1',
      subject: 'Mathematics',
      title: 'Algebra Problems',
      description: 'Complete exercises 1-15 from chapter 4',
      dueDate: '2024-01-25',
      status: 'pending',
      teacher: 'Mrs. Patel'
    },
    {
      id: '2',
      subject: 'Science',
      title: 'Physics Lab Report',
      description: 'Write a report on the pendulum experiment',
      dueDate: '2024-01-24',
      status: 'completed',
      teacher: 'Mr. Kumar'
    },
    {
      id: '3',
      subject: 'English',
      title: 'Essay Writing',
      description: 'Write an essay on environmental conservation',
      dueDate: '2024-01-20',
      status: 'overdue',
      teacher: 'Ms. Singh'
    }
  ],
  '2': [
    {
      id: '4',
      subject: 'Mathematics',
      title: 'Multiplication Tables',
      description: 'Practice tables 12-15',
      dueDate: '2024-01-26',
      status: 'pending',
      teacher: 'Mrs. Gupta'
    },
    {
      id: '5',
      subject: 'Hindi',
      title: 'Story Reading',
      description: 'Read chapter 3 and answer questions',
      dueDate: '2024-01-23',
      status: 'completed',
      teacher: 'Mr. Verma'
    }
  ]
};

export const mockExamResults: { [childId: string]: ExamResult[] } = {
  '1': [
    {
      id: '1',
      subject: 'Mathematics',
      examName: 'Mid-term Exam',
      date: '2024-01-10',
      marks: 85,
      totalMarks: 100,
      grade: 'A',
      status: 'passed'
    },
    {
      id: '2',
      subject: 'Science',
      examName: 'Mid-term Exam',
      date: '2024-01-12',
      marks: 78,
      totalMarks: 100,
      grade: 'B+',
      status: 'passed'
    },
    {
      id: '3',
      subject: 'English',
      examName: 'Mid-term Exam',
      date: '2024-01-14',
      marks: 92,
      totalMarks: 100,
      grade: 'A+',
      status: 'passed'
    }
  ],
  '2': [
    {
      id: '4',
      subject: 'Mathematics',
      examName: 'Unit Test 1',
      date: '2024-01-08',
      marks: 88,
      totalMarks: 100,
      grade: 'A',
      status: 'passed'
    },
    {
      id: '5',
      subject: 'Hindi',
      examName: 'Unit Test 1',
      date: '2024-01-09',
      marks: 95,
      totalMarks: 100,
      grade: 'A+',
      status: 'passed'
    }
  ]
};

export const mockTimetable: { [childId: string]: TimetableEntry[] } = {
  '1': [
    // Monday
    { id: '1', subject: 'Mathematics', teacher: 'Mrs. Patel', time: '09:00 - 09:45', room: 'Room 101', day: 'Monday' },
    { id: '2', subject: 'Science', teacher: 'Mr. Kumar', time: '09:45 - 10:30', room: 'Lab 1', day: 'Monday' },
    { id: '3', subject: 'English', teacher: 'Ms. Singh', time: '11:00 - 11:45', room: 'Room 102', day: 'Monday' },
    { id: '4', subject: 'History', teacher: 'Mr. Sharma', time: '11:45 - 12:30', room: 'Room 103', day: 'Monday' },
    { id: '5', subject: 'Physical Education', teacher: 'Coach Raj', time: '14:00 - 14:45', room: 'Playground', day: 'Monday' },
    
    // Tuesday
    { id: '10', subject: 'Science', teacher: 'Mr. Kumar', time: '09:00 - 09:45', room: 'Lab 1', day: 'Tuesday' },
    { id: '11', subject: 'Mathematics', teacher: 'Mrs. Patel', time: '09:45 - 10:30', room: 'Room 101', day: 'Tuesday' },
    { id: '12', subject: 'Hindi', teacher: 'Mr. Verma', time: '11:00 - 11:45', room: 'Room 104', day: 'Tuesday' },
    { id: '13', subject: 'English', teacher: 'Ms. Singh', time: '11:45 - 12:30', room: 'Room 102', day: 'Tuesday' },
    { id: '14', subject: 'Art', teacher: 'Mrs. Rao', time: '14:00 - 14:45', room: 'Art Room', day: 'Tuesday' },
    
    // Wednesday
    { id: '15', subject: 'History', teacher: 'Mr. Sharma', time: '09:00 - 09:45', room: 'Room 103', day: 'Wednesday' },
    { id: '16', subject: 'Mathematics', teacher: 'Mrs. Patel', time: '09:45 - 10:30', room: 'Room 101', day: 'Wednesday' },
    { id: '17', subject: 'Science', teacher: 'Mr. Kumar', time: '11:00 - 11:45', room: 'Lab 1', day: 'Wednesday' },
    { id: '18', subject: 'English', teacher: 'Ms. Singh', time: '11:45 - 12:30', room: 'Room 102', day: 'Wednesday' },
    
    // Thursday
    { id: '19', subject: 'Mathematics', teacher: 'Mrs. Patel', time: '09:00 - 09:45', room: 'Room 101', day: 'Thursday' },
    { id: '20', subject: 'Hindi', teacher: 'Mr. Verma', time: '09:45 - 10:30', room: 'Room 104', day: 'Thursday' },
    { id: '21', subject: 'Science', teacher: 'Mr. Kumar', time: '11:00 - 11:45', room: 'Lab 1', day: 'Thursday' },
    { id: '22', subject: 'Physical Education', teacher: 'Coach Raj', time: '11:45 - 12:30', room: 'Playground', day: 'Thursday' },
    
    // Friday
    { id: '23', subject: 'English', teacher: 'Ms. Singh', time: '09:00 - 09:45', room: 'Room 102', day: 'Friday' },
    { id: '24', subject: 'Mathematics', teacher: 'Mrs. Patel', time: '09:45 - 10:30', room: 'Room 101', day: 'Friday' },
    { id: '25', subject: 'History', teacher: 'Mr. Sharma', time: '11:00 - 11:45', room: 'Room 103', day: 'Friday' },
    { id: '26', subject: 'Science', teacher: 'Mr. Kumar', time: '11:45 - 12:30', room: 'Lab 1', day: 'Friday' },
    
    // Saturday
    { id: '27', subject: 'Mathematics', teacher: 'Mrs. Patel', time: '09:00 - 09:45', room: 'Room 101', day: 'Saturday' },
    { id: '28', subject: 'Science', teacher: 'Mr. Kumar', time: '09:45 - 10:30', room: 'Lab 1', day: 'Saturday' },
    { id: '29', subject: 'English', teacher: 'Ms. Singh', time: '11:00 - 11:45', room: 'Room 102', day: 'Saturday' },
    { id: '30', subject: 'History', teacher: 'Mr. Sharma', time: '11:45 - 12:30', room: 'Room 103', day: 'Saturday' },
    { id: '31', subject: 'Physical Education', teacher: 'Coach Raj', time: '14:00 - 14:45', room: 'Playground', day: 'Saturday' },
  ],
  '2': [
    // Monday
    { id: '32', subject: 'Mathematics', teacher: 'Mrs. Gupta', time: '09:00 - 09:45', room: 'Room 201', day: 'Monday' },
    { id: '33', subject: 'Hindi', teacher: 'Mr. Verma', time: '09:45 - 10:30', room: 'Room 202', day: 'Monday' },
    { id: '34', subject: 'English', teacher: 'Ms. Jain', time: '11:00 - 11:45', room: 'Room 203', day: 'Monday' },
    { id: '35', subject: 'Art', teacher: 'Mrs. Rao', time: '11:45 - 12:30', room: 'Art Room', day: 'Monday' },
    
    // Tuesday
    { id: '36', subject: 'English', teacher: 'Ms. Jain', time: '09:00 - 09:45', room: 'Room 203', day: 'Tuesday' },
    { id: '37', subject: 'Mathematics', teacher: 'Mrs. Gupta', time: '09:45 - 10:30', room: 'Room 201', day: 'Tuesday' },
    { id: '38', subject: 'Science', teacher: 'Mr. Kumar', time: '11:00 - 11:45', room: 'Lab 2', day: 'Tuesday' },
    
    // Wednesday
    { id: '39', subject: 'Hindi', teacher: 'Mr. Verma', time: '09:00 - 09:45', room: 'Room 202', day: 'Wednesday' },
    { id: '40', subject: 'Mathematics', teacher: 'Mrs. Gupta', time: '09:45 - 10:30', room: 'Room 201', day: 'Wednesday' },
    { id: '41', subject: 'English', teacher: 'Ms. Jain', time: '11:00 - 11:45', room: 'Room 203', day: 'Wednesday' },
    { id: '42', subject: 'Physical Education', teacher: 'Coach Raj', time: '11:45 - 12:30', room: 'Playground', day: 'Wednesday' },
    
    // Thursday
    { id: '43', subject: 'Science', teacher: 'Mr. Kumar', time: '09:00 - 09:45', room: 'Lab 2', day: 'Thursday' },
    { id: '44', subject: 'Mathematics', teacher: 'Mrs. Gupta', time: '09:45 - 10:30', room: 'Room 201', day: 'Thursday' },
    { id: '45', subject: 'Hindi', teacher: 'Mr. Verma', time: '11:00 - 11:45', room: 'Room 202', day: 'Thursday' },
    
    // Friday
    { id: '46', subject: 'Mathematics', teacher: 'Mrs. Gupta', time: '09:00 - 09:45', room: 'Room 201', day: 'Friday' },
    { id: '47', subject: 'English', teacher: 'Ms. Jain', time: '09:45 - 10:30', room: 'Room 203', day: 'Friday' },
    { id: '48', subject: 'Art', teacher: 'Mrs. Rao', time: '11:00 - 11:45', room: 'Art Room', day: 'Friday' },
    { id: '49', subject: 'Science', teacher: 'Mr. Kumar', time: '11:45 - 12:30', room: 'Lab 2', day: 'Friday' },
    
    // Saturday
    { id: '50', subject: 'Hindi', teacher: 'Mr. Verma', time: '09:00 - 09:45', room: 'Room 202', day: 'Saturday' },
    { id: '51', subject: 'Mathematics', teacher: 'Mrs. Gupta', time: '09:45 - 10:30', room: 'Room 201', day: 'Saturday' },
    { id: '52', subject: 'English', teacher: 'Ms. Jain', time: '11:00 - 11:45', room: 'Room 203', day: 'Saturday' },
  ]
};

export const mockFees: { [childId: string]: Fee[] } = {
  '1': [
    { id: '1', description: 'Tuition Fee - January', amount: 5000, dueDate: '2024-01-31', status: 'paid' },
    { id: '2', description: 'Transport Fee - January', amount: 1500, dueDate: '2024-01-31', status: 'paid' },
    { id: '3', description: 'Tuition Fee - February', amount: 5000, dueDate: '2024-02-28', status: 'pending' },
    { id: '4', description: 'Activity Fee', amount: 800, dueDate: '2024-01-20', status: 'overdue' },
  ],
  '2': [
    { id: '5', description: 'Tuition Fee - January', amount: 4000, dueDate: '2024-01-31', status: 'paid' },
    { id: '6', description: 'Transport Fee - January', amount: 1500, dueDate: '2024-01-31', status: 'pending' },
    { id: '7', description: 'Book Fee', amount: 1200, dueDate: '2024-02-15', status: 'pending' },
  ]
};

export const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Annual Sports Day',
    content: 'Annual Sports Day will be held on February 15th, 2024. All students are required to participate.',
    date: '2024-01-20',
    type: 'event',
    author: 'Principal'
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    content: 'Parent-Teacher meeting scheduled for January 30th, 2024 from 10:00 AM to 4:00 PM.',
    date: '2024-01-18',
    type: 'urgent',
    author: 'Academic Coordinator'
  },
  {
    id: '3',
    title: 'Holiday Notice',
    content: 'School will remain closed on January 26th for Republic Day celebration.',
    date: '2024-01-15',
    type: 'general',
    author: 'Administration'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    from: 'Mrs. Patel (Mathematics)',
    subject: 'Homework Reminder',
    content: 'Please remind Aarav to complete the algebra homework due tomorrow.',
    date: '2024-01-22',
    type: 'teacher',
    read: false
  },
  {
    id: '2',
    from: 'School Administration',
    subject: 'Fee Payment Reminder',
    content: 'This is a reminder that the activity fee payment is overdue. Please make the payment at your earliest convenience.',
    date: '2024-01-21',
    type: 'admin',
    read: true
  },
  {
    id: '3',
    from: 'Mr. Kumar (Science)',
    subject: 'Excellent Performance',
    content: 'Congratulations! Aarav performed excellently in the recent science test.',
    date: '2024-01-20',
    type: 'teacher',
    read: true
  }
];