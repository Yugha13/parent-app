import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      timetable: 'Timetable',
      announcements: 'Announcements',
      profile: 'Profile',
      
      // Home Screen
      goodMorning: 'Good Morning!',
      goodAfternoon: 'Good Afternoon!',
      goodEvening: 'Good Evening!',
      selectChild: 'Select Child',
      
      // Dashboard Sections
      attendanceOverview: 'Attendance Overview',
      homeworkUpdates: 'Homework Updates',
      examMarks: 'Exam & Marks',
      todayTimetable: 'Today\'s Timetable',
      feesOverview: 'Fees Overview',
      noticeBoard: 'Notice Board',
      messages: 'Messages',
      
      // Attendance
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      attendanceRate: 'Attendance Rate',
      
      // Homework
      pending: 'Pending',
      completed: 'Completed',
      overdue: 'Overdue',
      dueDate: 'Due Date',
      dueToday: 'Due: Today',
      dueTomorrow: 'Due: Tomorrow',
      due: 'Due',
      todayHomework: 'Today\'s Homework',
      yesterdayHomeworkStatus: 'Yesterday\'s Homework Status',
      trackHomework: 'Track your child\'s homework assignments',
      attachment: 'attachment',
      attachments: 'attachments',
      
      // Exams
      latestResults: 'Latest Results',
      downloadReport: 'Download Report',
      passed: 'Passed',
      failed: 'Failed',
      
      // Fees
      totalFees: 'Total Fees',
      paidAmount: 'Paid Amount',
      pendingAmount: 'Pending Amount',
      payNow: 'Pay Now',
      
      // Settings
      settings: 'Settings',
      language: 'Language',
      notifications: 'Notifications',
      linkedStudents: 'Linked Students',
      appInfo: 'App Info',
      logout: 'Logout',
      
      // Common
      viewAll: 'View All',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      allTime: 'All Time',
      recent: 'Recent',
      grade: 'Grade',
      section: 'Section',
      subject: 'Subject',
      teacher: 'Teacher',
      time: 'Time',
      date: 'Date',
      status: 'Status',
      room: 'Room',
      all: 'All',
      term: 'Term',
      amount: 'Amount',
      paidOn: 'Paid On',
      markAsCompleted: 'Mark as Completed',
      noHomeworkFound: 'No homework found',
      noExamsFound: 'No exams found',
      noFeesFound: 'No fees found',
      avgMarks: 'Avg. Marks',
      highestMarks: 'Highest Marks',
      totalExams: 'Total Exams',
      marks: 'Marks',
      fees: 'Fees',
      paid: 'Paid',
      viewReceipt: 'View Receipt',
      attendance: 'Attendance',
      week: 'Week',
      total: 'Total',
      paymentHistory: 'Payment History',
      settings: 'Settings',
      paymentDetails: 'Payment Details',
      transactionId: 'Transaction ID',
      paymentMethod: 'Payment Method',
      paymentDate: 'Payment Date',
      paymentStatus: 'Payment Status',
      payWithCard: 'Pay with Card',
      payWithUPI: 'Pay with UPI',
      payWithNetBanking: 'Pay with Net Banking',
      payFullAmount: 'Pay Full Amount',
      payCategoryAmount: 'Pay {{category}} Amount',
      fullyPaid: 'Fully Paid',
      partiallyPaid: 'Partially Paid',
      totalDueAmount: 'Total Due Amount',
      category: 'Category',
      cancel: 'Cancel',
      exams: 'Exams',
      assignments: 'Assignments',
      month: 'Month',
      semester: 'Semester',
      noAttendanceRecords: 'No attendance records found',
      
      // Days of the week
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
      
      // Subjects
      mathematics: 'Mathematics',
      science: 'Science',
      english: 'English',
      history: 'History',
      physical_education: 'Physical Education',
      art: 'Art',
      hindi: 'Hindi',
      
      // Messages
      noClassesScheduled: 'No classes scheduled for',
    }
  },
  hi: {
    translation: {
      // Navigation
      home: 'होम',
      timetable: 'समय सारणी',
      announcements: 'घोषणाएं',
      profile: 'प्रोफ़ाइल',
      
      // Home Screen
      goodMorning: 'सुप्रभात!',
      goodAfternoon: 'नमस्कार!',
      goodEvening: 'शुभ संध्या!',
      selectChild: 'बच्चा चुनें',
      
      // Dashboard Sections
      attendanceOverview: 'उपस्थिति अवलोकन',
      homeworkUpdates: 'गृहकार्य अपडेट',
      examMarks: 'परीक्षा और अंक',
      todayTimetable: 'आज की समय सारणी',
      feesOverview: 'फीस अवलोकन',
      noticeBoard: 'सूचना बोर्ड',
      messages: 'संदेश',
      
      // Attendance
      present: 'उपस्थित',
      absent: 'अनुपस्थित',
      late: 'देर से',
      attendanceRate: 'उपस्थिति दर',
      
      // Homework
      pending: 'लंबित',
      completed: 'पूर्ण',
      overdue: 'अतिदेय',
      dueDate: 'नियत तारीख',
      
      // Exams
      latestResults: 'नवीनतम परिणाम',
      downloadReport: 'रिपोर्ट डाउनलोड करें',
      passed: 'उत्तीर्ण',
      failed: 'अनुत्तीर्ण',
      
      // Fees
      totalFees: 'कुल फीस',
      paidAmount: 'भुगतान की गई राशि',
      pendingAmount: 'लंबित राशि',
      payNow: 'अभी भुगतान करें',
      
      // Settings
      settings: 'सेटिंग्स',
      language: 'भाषा',
      notifications: 'सूचनाएं',
      linkedStudents: 'जुड़े छात्र',
      appInfo: 'ऐप जानकारी',
      logout: 'लॉग आउट',
      
      // Common
      viewAll: 'सभी देखें',
      today: 'आज',
      thisWeek: 'इस सप्ताह',
      thisMonth: 'इस महीने',
      lastMonth: 'पिछले महीने',
      allTime: 'सभी समय',
      recent: 'हाल ही का',
      grade: 'कक्षा',
      section: 'अनुभाग',
      subject: 'विषय',
      teacher: 'शिक्षक',
      time: 'समय',
      date: 'तारीख',
      status: 'स्थिति',
      room: 'कमरा',
      all: 'सभी',
      term: 'अवधि',
      amount: 'राशि',
      paidOn: 'भुगतान दिनांक',
      markAsCompleted: 'पूर्ण के रूप में चिह्नित करें',
      noHomeworkFound: 'कोई गृहकार्य नहीं मिला',
      noExamsFound: 'कोई परीक्षा नहीं मिली',
      noFeesFound: 'कोई फीस नहीं मिली',
      avgMarks: 'औसत अंक',
      highestMarks: 'उच्चतम अंक',
      totalExams: 'कुल परीक्षाएं',
      marks: 'अंक',
      fees: 'फीस',
      paid: 'भुगतान किया',
      viewReceipt: 'रसीद देखें',
      attendance: 'उपस्थिति',
      week: 'सप्ताह',
      total: 'कुल',
      paymentHistory: 'भुगतान इतिहास',
      settings: 'सेटिंग्स',
      paymentDetails: 'भुगतान विवरण',
      transactionId: 'लेनदेन आईडी',
      paymentMethod: 'भुगतान विधि',
      paymentDate: 'भुगतान तिथि',
      paymentStatus: 'भुगतान स्थिति',
      payWithCard: 'कार्ड से भुगतान करें',
      payWithUPI: 'यूपीआई से भुगतान करें',
      payWithNetBanking: 'नेट बैंकिंग से भुगतान करें',
      payFullAmount: 'पूरी राशि का भुगतान करें',
      payCategoryAmount: '{{category}} राशि का भुगतान करें',
      fullyPaid: 'पूरी तरह से भुगतान किया',
      partiallyPaid: 'आंशिक रूप से भुगतान किया',
      totalDueAmount: 'कुल बकाया राशि',
      category: 'श्रेणी',
      cancel: 'रद्द करें',
      exams: 'परीक्षाएं',
      assignments: 'असाइनमेंट',
      noFeesFound: 'कोई फीस नहीं मिली',
      avgMarks: 'औसत अंक',
      highestMarks: 'उच्चतम अंक',
      totalExams: 'कुल परीक्षाएं',
      marks: 'अंक',
      fees: 'फीस',
      paid: 'भुगतान किया',
      viewReceipt: 'रसीद देखें',
      attendance: 'उपस्थिति',
      week: 'सप्ताह',
      month: 'महीना',
      semester: 'सेमेस्टर',
      noAttendanceRecords: 'कोई उपस्थिति रिकॉर्ड नहीं मिला',
      
      // Days of the week
      monday: 'सोमवार',
      tuesday: 'मंगलवार',
      wednesday: 'बुधवार',
      thursday: 'गुरुवार',
      friday: 'शुक्रवार',
      saturday: 'शनिवार',
      sunday: 'रविवार',
      
      // Subjects
      mathematics: 'गणित',
      science: 'विज्ञान',
      english: 'अंग्रेज़ी',
      history: 'इतिहास',
      physical_education: 'शारीरिक शिक्षा',
      art: 'कला',
      hindi: 'हिंदी',
      
      // Messages
      noClassesScheduled: 'के लिए कोई कक्षा निर्धारित नहीं है',
    }
  },
  ta: {
    translation: {
      // Navigation
      home: 'முகப்பு',
      timetable: 'நேர அட்டவணை',
      announcements: 'அறிவிப்புகள்',
      profile: 'சுயவிவரம்',
      
      // Home Screen
      goodMorning: 'காலை வணக்கம்!',
      goodAfternoon: 'மதிய வணக்கம்!',
      goodEvening: 'மாலை வணக்கம்!',
      selectChild: 'குழந்தையைத் தேர்ந்தெடுக்கவும்',
      
      // Dashboard Sections
      attendanceOverview: 'வருகை மேலோட்டம்',
      homeworkUpdates: 'வீட்டுப்பாடம் புதுப்பிப்புகள்',
      examMarks: 'தேர்வு மற்றும் மதிப்பெண்கள்',
      todayTimetable: 'இன்றைய நேர அட்டவணை',
      feesOverview: 'கட்டணம் மேலோட்டம்',
      noticeBoard: 'அறிவிப்பு பலகை',
      messages: 'செய்திகள்',
      
      // Attendance
      present: 'வந்துள்ளார்',
      absent: 'வரவில்லை',
      late: 'தாமதம்',
      attendanceRate: 'வருகை விகிதம்',
      
      // Homework
      pending: 'நிலுவையில்',
      completed: 'முடிந்தது',
      overdue: 'தாமதமானது',
      dueDate: 'நிர்ணய தேதி',
      
      // Exams
      latestResults: 'சமீபத்திய முடிவுகள்',
      downloadReport: 'அறிக்கை பதிவிறக்கம்',
      passed: 'தேர்ச்சி',
      failed: 'தோல்வி',
      
      // Fees
      totalFees: 'மொத்த கட்டணம்',
      paidAmount: 'செலுத்திய தொகை',
      pendingAmount: 'நிலுவை தொகை',
      payNow: 'இப்போது செலுத்துங்கள்',
      
      // Settings
      settings: 'அமைப்புகள்',
      language: 'மொழி',
      notifications: 'அறிவிப்புகள்',
      linkedStudents: 'இணைக்கப்பட்ட மாணவர்கள்',
      appInfo: 'பயன்பாட்டு தகவல்',
      logout: 'வெளியேறு',
      
      // Common
      viewAll: 'அனைத்தையும் பார்க்க',
      today: 'இன்று',
      thisWeek: 'இந்த வாரம்',
      thisMonth: 'இந்த மாதம்',
      lastMonth: 'கடந்த மாதம்',
      allTime: 'எல்லா நேரமும்',
      recent: 'சமீபத்தில்',
      grade: 'வகுப்பு',
      section: 'பிரிவு',
      subject: 'பாடம்',
      teacher: 'ஆசிரியர்',
      time: 'நேரம்',
      date: 'தேதி',
      status: 'நிலை',
      room: 'அறை',
      all: 'அனைத்தும்',
      term: 'பருவம்',
      amount: 'தொகை',
      paidOn: 'செலுத்திய தேதி',
      markAsCompleted: 'முடிந்ததாக குறிக்கவும்',
      noHomeworkFound: 'வீட்டுப்பாடம் எதுவும் இல்லை',
      noExamsFound: 'தேர்வுகள் எதுவும் இல்லை',
      noFeesFound: 'கட்டணங்கள் எதுவும் இல்லை',
      avgMarks: 'சராசரி மதிப்பெண்கள்',
      highestMarks: 'அதிக மதிப்பெண்கள்',
      totalExams: 'மொத்த தேர்வுகள்',
      marks: 'மதிப்பெண்கள்',
      fees: 'கட்டணங்கள்',
      paid: 'செலுத்தப்பட்டது',
      viewReceipt: 'ரசீதைப் பார்க்க',
      attendance: 'வருகை',
      week: 'வாரம்',
      month: 'மாதம்',
      semester: 'செமஸ்டர்',
      noAttendanceRecords: 'வருகைப் பதிவுகள் எதுவும் இல்லை',
      
      // Days of the week
      monday: 'திங்கட்கிழமை',
      tuesday: 'செவ்வாய்க்கிழமை',
      wednesday: 'புதன்கிழமை',
      thursday: 'வியாழக்கிழமை',
      friday: 'வெள்ளிக்கிழமை',
      saturday: 'சனிக்கிழமை',
      sunday: 'ஞாயிற்றுக்கிழமை',
      
      // Subjects
      mathematics: 'கணிதம்',
      science: 'அறிவியல்',
      english: 'ஆங்கிலம்',
      history: 'வரலாறு',
      physical_education: 'உடற்கல்வி',
      art: 'கலை',
      hindi: 'இந்தி',
      
      // Messages
      noClassesScheduled: 'அன்று வகுப்புகள் எதுவும் திட்டமிடப்படவில்லை',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;