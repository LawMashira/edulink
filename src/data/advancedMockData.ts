// Advanced Mock Data for ZimEduLink SaaS Features

// AI-Powered Analytics Data
export const aiAnalytics = {
  predictiveInsights: [
    {
      studentId: 'student1',
      name: 'Tendai Moyo',
      riskLevel: 'high',
      predictedGrade: 'C',
      confidence: 85,
      recommendations: [
        'Schedule extra tutoring in Mathematics',
        'Monitor attendance closely',
        'Engage parents in academic support'
      ],
      factors: ['Low attendance', 'Declining grades', 'Missing assignments']
    },
    {
      studentId: 'student2',
      name: 'Blessing Ncube',
      riskLevel: 'low',
      predictedGrade: 'A',
      confidence: 92,
      recommendations: [
        'Continue current study patterns',
        'Consider advanced placement',
        'Mentor other students'
      ],
      factors: ['Consistent attendance', 'High performance', 'Active participation']
    }
  ],
  attendancePatterns: [
    {
      pattern: 'Monday absenteeism',
      frequency: 15,
      affectedStudents: 8,
      recommendation: 'Investigate Monday morning issues'
    },
    {
      pattern: 'Late arrivals after lunch',
      frequency: 12,
      affectedStudents: 5,
      recommendation: 'Review lunch break timing'
    }
  ],
  feeCollectionOptimization: {
    optimalCollectionTime: 'First week of month',
    averageCollectionRate: 78,
    suggestedActions: [
      'Send reminders 3 days before due date',
      'Offer payment plans for struggling families',
      'Implement early payment discounts'
    ]
  }
};

// Business Intelligence Data
export const businessIntelligence = {
  realTimeMetrics: {
    totalStudents: 1247,
    activeTeachers: 45,
    attendanceRate: 94.2,
    feeCollectionRate: 87.3,
    parentEngagement: 78.9
  },
  comparativeAnalytics: [
    {
      school: 'Harare High School',
      students: 450,
      attendanceRate: 96.1,
      performance: 87.2,
      feeCollection: 92.3
    },
    {
      school: 'Bulawayo Secondary',
      students: 320,
      attendanceRate: 94.8,
      performance: 84.7,
      feeCollection: 89.1
    },
    {
      school: 'Mutare Academy',
      students: 280,
      attendanceRate: 95.5,
      performance: 86.3,
      feeCollection: 91.7
    }
  ],
  governmentCompliance: {
    zimsecRegistration: 'Complete',
    healthInspections: 'Passed',
    safetyCertifications: 'Valid',
    teacherQualifications: 'Verified',
    nextInspection: '2024-06-15'
  }
};

// Health Management Data
export const healthRecords = [
  {
    studentId: 'student1',
    name: 'Tendai Moyo',
    allergies: ['Peanuts', 'Dust'],
    medications: ['Inhaler for asthma'],
    emergencyContact: '+263 77 123 4567',
    bloodType: 'O+',
    lastCheckup: '2024-01-10',
    healthStatus: 'Good'
  },
  {
    studentId: 'student2',
    name: 'Blessing Ncube',
    allergies: [],
    medications: [],
    emergencyContact: '+263 77 234 5678',
    bloodType: 'A+',
    lastCheckup: '2024-01-15',
    healthStatus: 'Excellent'
  }
];

export const safetyIncidents = [
  {
    id: 'incident1',
    date: '2024-01-20',
    type: 'Minor injury',
    student: 'Tendai Moyo',
    description: 'Scraped knee during break',
    severity: 'Low',
    resolved: true,
    actionTaken: 'First aid applied, parents notified'
  },
  {
    id: 'incident2',
    date: '2024-01-18',
    type: 'Health concern',
    student: 'Blessing Ncube',
    description: 'Fever reported',
    severity: 'Medium',
    resolved: true,
    actionTaken: 'Sent home, medical certificate required for return'
  }
];

// Educational Content Data
export const digitalContent = [
  {
    id: 'content1',
    title: 'Mathematics Form 4 - Algebra',
    type: 'Video Lesson',
    subject: 'Mathematics',
    class: 'Form 4',
    duration: '45 minutes',
    uploadDate: '2024-01-15',
    views: 156,
    rating: 4.8,
    author: 'Dr. John Smith',
    format: 'MP4',
    description: 'Comprehensive algebra lesson covering quadratic equations',
    pages: 0,
    downloads: 234
  },
  {
    id: 'content2',
    title: 'English Literature - Shakespeare',
    type: 'Interactive Quiz',
    subject: 'English',
    class: 'Form 4',
    duration: '30 minutes',
    uploadDate: '2024-01-12',
    views: 89,
    rating: 4.6,
    author: 'Prof. Jane Doe',
    format: 'Interactive',
    description: 'Interactive quiz on Shakespearean literature',
    pages: 0,
    downloads: 189
  }
];

export const assignments = [
  {
    id: 'assign1',
    title: 'Mathematics Problem Set 5',
    subject: 'Mathematics',
    class: 'Form 4A',
    dueDate: '2024-01-25',
    submissions: 12,
    totalStudents: 15,
    averageScore: 78.5
  },
  {
    id: 'assign2',
    title: 'English Essay - Climate Change',
    subject: 'English',
    class: 'Form 3B',
    dueDate: '2024-01-28',
    submissions: 8,
    totalStudents: 10,
    averageScore: 82.3
  }
];

// Marketplace Data
export const marketplaceItems = [
  {
    id: 'item1',
    name: 'Oxford Mathematics Form 4',
    category: 'Textbooks',
    price: 25.00,
    currency: 'USD',
    seller: 'Academic Books Zimbabwe',
    rating: 4.7,
    reviews: 23,
    image: '📚',
    description: 'Latest edition with updated curriculum',
    stock: 15,
    deliveryTime: '2-3 days'
  },
  {
    id: 'item2',
    name: 'Scientific Calculator',
    category: 'Stationery',
    price: 18.50,
    currency: 'USD',
    seller: 'Stationery Plus',
    rating: 4.5,
    reviews: 45,
    image: '🧮',
    description: 'Casio FX-82MS scientific calculator',
    stock: 8,
    deliveryTime: '1-2 days'
  },
  {
    id: 'item3',
    name: 'Exercise Books (Pack of 10)',
    category: 'Stationery',
    price: 5.00,
    currency: 'USD',
    seller: 'School Supplies Co',
    rating: 4.3,
    reviews: 67,
    image: '📝',
    description: 'A4 exercise books, 80 pages each',
    stock: 25,
    deliveryTime: '1 day'
  },
  {
    id: 'item4',
    name: 'Geography Atlas',
    category: 'Textbooks',
    price: 12.00,
    currency: 'USD',
    seller: 'Map Publishers',
    rating: 4.6,
    reviews: 34,
    image: '🗺️',
    description: 'Comprehensive world atlas for students',
    stock: 12,
    deliveryTime: '2-3 days'
  }
];

export const marketplaceCategories = [
  { name: 'Textbooks', count: 45, icon: '📚' },
  { name: 'Stationery', count: 78, icon: '✏️' },
  { name: 'Uniforms', count: 23, icon: '👔' },
  { name: 'Sports Equipment', count: 15, icon: '⚽' },
  { name: 'Electronics', count: 12, icon: '💻' },
  { name: 'Art Supplies', count: 18, icon: '🎨' }
];

// Branding & Customization Data
export const schoolBranding = {
  primaryColor: '#1E40AF',
  secondaryColor: '#F59E0B',
  logo: '🏫',
  schoolName: 'Harare High School',
  motto: 'Excellence Through Education',
  customFields: [
    { name: 'House System', type: 'text', required: true, options: [] },
    { name: 'Transport Route', type: 'select', required: false, options: ['Route A', 'Route B', 'Route C'] },
    { name: 'Parent Occupation', type: 'text', required: false, options: [] }
  ]
};

// Virtual Classroom Data
export const virtualClassrooms = [
  {
    id: 'vc1',
    name: 'Mathematics Form 4A',
    teacher: 'Mr. Tafadzwa Chigwada',
    students: 15,
    nextSession: '2024-01-25 10:00 AM',
    recordings: 8,
    averageAttendance: 14
  },
  {
    id: 'vc2',
    name: 'English Literature',
    teacher: 'Mrs. Sarah Moyo',
    students: 12,
    nextSession: '2024-01-26 2:00 PM',
    recordings: 12,
    averageAttendance: 11
  }
];

// E-Library Data
export const eLibrary = [
  {
    id: 'book1',
    title: 'Advanced Mathematics',
    author: 'Dr. John Smith',
    category: 'Mathematics',
    pages: 450,
    format: 'PDF',
    downloads: 234,
    rating: 4.8,
    description: 'Comprehensive guide to advanced mathematics concepts'
  },
  {
    id: 'book2',
    title: 'Zimbabwe History',
    author: 'Prof. Jane Doe',
    category: 'History',
    pages: 320,
    format: 'PDF',
    downloads: 189,
    rating: 4.6,
    description: 'Complete history of Zimbabwe from pre-colonial times'
  }
];

// Performance Analytics
export const performanceAnalytics = {
  studentProgress: [
    {
      student: 'Tendai Moyo',
      subject: 'Mathematics',
      currentGrade: 'C',
      targetGrade: 'B',
      progress: 65,
      trend: 'improving'
    },
    {
      student: 'Blessing Ncube',
      subject: 'English',
      currentGrade: 'A',
      targetGrade: 'A+',
      progress: 92,
      trend: 'stable'
    }
  ],
  classPerformance: [
    {
      class: 'Form 4A',
      averageScore: 78.5,
      improvement: 5.2,
      topPerformer: 'Blessing Ncube',
      needsAttention: 'Tendai Moyo'
    }
  ]
};
