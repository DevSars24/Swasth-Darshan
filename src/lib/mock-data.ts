export interface Review {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  text: string;
}

export interface Slot {
  day: string;
  times: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  experience: number;
  languages: string[];
  trustScore: number;
  ratingsCount: number;
  verified: boolean;
  avatar: string;
  avatarColor: string;
  bio: string;
  slots: Slot[];
  reviews: Review[];
  distanceKm?: number;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  time: string;
  icon: 'pill' | 'capsule' | 'drop' | 'syringe';
  taken: boolean;
  type: string;
}

export interface Donor {
  id: string;
  name: string;
  amount: string;
  amountNum: number;
  message: string;
  badge: string;
  avatarEmoji: string;
  impactNote: string;
}

export interface FundAllocation {
  name: string;
  value: number;
  color: string;
  amountStr: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  purpose: string;
  amount: string;
  doctorName: string;
  recipientHash: string;
}

export interface PatientHistory {
  id: string;
  date: string;
  doctorName: string;
  specialty: string;
  diagnosis: string;
  prescription: string[];
  notes: string;
}

export interface CompanionCall {
  id: string;
  date: string;
  time: string;
  status: 'answered' | 'no-answer' | 'escalated';
  volunteerName: string;
  volunteerAvatar: string;
  notes: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  avatarEmoji: string;
  avatarColor: string;
  quote: string;
  rating: number;
}

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'mr', name: 'मराठी (Marathi)' }
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Amit Sharma',
    specialty: 'General Physician',
    hospital: 'Fortis Clinic, New Delhi',
    experience: 14,
    languages: ['Hindi', 'English', 'Punjabi'],
    trustScore: 4.9,
    ratingsCount: 342,
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=AmitSharma&backgroundColor=b6e3f4',
    avatarColor: '#0d9488',
    distanceKm: 1.2,
    bio: 'Dedicated family physician with 14+ years of experience treating chronic conditions like hypertension, diabetes, and infectious fevers. Strongly believes in open patient communication and preventative care.',
    slots: [
      { day: 'Today', times: ['09:30 AM', '11:00 AM', '04:15 PM', '05:30 PM'] },
      { day: 'Tomorrow', times: ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'] },
      { day: 'Monday', times: ['09:00 AM', '10:30 AM', '03:00 PM', '06:00 PM'] }
    ],
    reviews: [
      { id: 'rev-1-1', patientName: 'Rajesh Kumar', rating: 5, date: '02 July 2026', text: 'Dr. Amit listened to my symptoms very patiently. His prescription was simple and did not contain unnecessary antibiotics.' },
      { id: 'rev-1-2', patientName: 'Suman Lata', rating: 4, date: '28 June 2026', text: 'Excellent doctor. He spoke to me in Hindi and explained the dosage of the medicine very clearly.' },
      { id: 'rev-1-3', patientName: 'Gurpreet Singh', rating: 5, date: '15 June 2026', text: 'Very polite and professional. Highly recommended for family healthcare.' }
    ]
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Patel',
    specialty: 'Gynecologist & Obstetrician',
    hospital: 'Apollo Spectra, Ahmedabad',
    experience: 11,
    languages: ['Gujarati', 'Hindi', 'English'],
    trustScore: 4.85,
    ratingsCount: 220,
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=PriyaPatel&backgroundColor=ffd5dc',
    avatarColor: '#db2777',
    distanceKm: 2.3,
    bio: 'Specialist in women healthcare, high-risk pregnancies, and adolescent gynecology. Funded through philanthropy to provide 10 free remote rural consultations every week.',
    slots: [
      { day: 'Today', times: ['10:30 AM', '12:00 PM', '03:30 PM'] },
      { day: 'Tomorrow', times: ['09:00 AM', '10:00 AM', '11:00 AM', '04:30 PM'] },
      { day: 'Monday', times: ['11:00 AM', '01:00 PM', '05:00 PM'] }
    ],
    reviews: [
      { id: 'rev-2-1', patientName: 'Anjali Shah', rating: 5, date: '01 July 2026', text: 'Dr. Priya made me feel so comfortable during my pregnancy consultation. Highly experienced.' },
      { id: 'rev-2-2', patientName: 'Nisha Patel', rating: 5, date: '20 June 2026', text: 'Blessed to find a doctor who explains the medical terms so simply without rush.' }
    ]
  },
  {
    id: 'doc-3',
    name: 'Dr. Rajesh Iyer',
    specialty: 'Pediatrician',
    hospital: 'Manipal Hospital, Bengaluru',
    experience: 18,
    languages: ['Tamil', 'Kannada', 'English', 'Hindi'],
    trustScore: 4.8,
    ratingsCount: 418,
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=RajeshIyer&backgroundColor=c0aede',
    avatarColor: '#7c3aed',
    distanceKm: 3.1,
    bio: 'Senior child specialist focusing on newborn care, developmental nutrition, and childhood asthma management. Known for his friendly behavior with children.',
    slots: [
      { day: 'Today', times: ['11:30 AM', '05:00 PM'] },
      { day: 'Tomorrow', times: ['09:30 AM', '12:30 PM', '03:00 PM', '06:00 PM'] }
    ],
    reviews: [
      { id: 'rev-3-1', patientName: 'Karthik S.', rating: 5, date: '30 June 2026', text: 'Excellent with children. My son was not scared at all. Good explanation.' },
      { id: 'rev-3-2', patientName: 'Meenakshi Rao', rating: 4, date: '25 June 2026', text: 'Very experienced pediatrician. Tells practical home remedies as well.' }
    ]
  },
  {
    id: 'doc-4',
    name: 'Dr. Ananya Rao',
    specialty: 'Cardiologist',
    hospital: 'Narayana Health, Hyderabad',
    experience: 16,
    languages: ['Telugu', 'English', 'Hindi'],
    trustScore: 4.75,
    ratingsCount: 189,
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=AnanyaRao&backgroundColor=d1fae5',
    avatarColor: '#059669',
    distanceKm: 4.8,
    bio: 'Heart specialist with expertise in preventive cardiology, coronary artery disease management, and blood pressure control. Dedicated to rural cardiac health outreach.',
    slots: [
      { day: 'Tomorrow', times: ['10:00 AM', '11:00 AM', '04:00 PM'] },
      { day: 'Monday', times: ['09:00 AM', '11:30 AM', '03:30 PM'] }
    ],
    reviews: [
      { id: 'rev-4-1', patientName: 'Venkata Ramana', rating: 5, date: '29 June 2026', text: 'Gave very clear advice regarding post-heart attack precautions. Extremely knowledgeable.' }
    ]
  },
  {
    id: 'doc-5',
    name: 'Dr. Vikram Deshmukh',
    specialty: 'Orthopedic Surgeon',
    hospital: 'KEM Hospital, Mumbai',
    experience: 12,
    languages: ['Marathi', 'Hindi', 'English'],
    trustScore: 4.7,
    ratingsCount: 154,
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=VikramDeshmukh&backgroundColor=fef3c7',
    avatarColor: '#d97706',
    distanceKm: 5.6,
    bio: 'Expert in joint pains, arthritis management, fractures, and spine health. Devotes half of his hospital schedule to treating underprivileged patients.',
    slots: [
      { day: 'Today', times: ['02:30 PM', '04:00 PM'] },
      { day: 'Monday', times: ['10:00 AM', '12:00 PM', '05:00 PM'] }
    ],
    reviews: [
      { id: 'rev-5-1', patientName: 'Sanjay Patil', rating: 5, date: '24 June 2026', text: 'My knee joint pain is much better now after his recommended exercises. Very honest doctor.' }
    ]
  }
];

export const MOCK_TIMELINE_MEDICINES: Medicine[] = [
  { id: 'med-1', name: 'Paracetamol (Calpol 650)', dosage: '1 Tablet after food', time: '08:00 AM & 08:00 PM', icon: 'pill', taken: true, type: 'Fever & Pain' },
  { id: 'med-2', name: 'Amoxicillin (500mg)', dosage: '1 Capsule after food', time: '09:00 AM & 09:00 PM', icon: 'capsule', taken: false, type: 'Antibiotic' },
  { id: 'med-3', name: 'Multivitamin (Zincovit)', dosage: '1 Tablet after lunch', time: '02:00 PM', icon: 'pill', taken: true, type: 'Supplements' },
  { id: 'med-4', name: 'Cough Syrup (Ascoril)', dosage: '2 teaspoons (10ml)', time: '10:00 PM', icon: 'drop', taken: false, type: 'Cough relief' }
];

export const MOCK_DONORS: Donor[] = [
  {
    id: 'don-1',
    name: 'Tata Trusts',
    amount: '₹45,00,000',
    amountNum: 4500000,
    message: 'Committed to empowering digital health access for rural communities across India.',
    badge: 'Platinum Donor',
    avatarEmoji: '🏛️',
    impactNote: 'This ₹45L funded 12,860 rural telemedicine consultations this quarter — zero cost to patients.'
  },
  {
    id: 'don-2',
    name: 'Narayana Philanthropies',
    amount: '₹25,00,000',
    amountNum: 2500000,
    message: 'Supporting zero-cost telemedicine consults for underprivileged families.',
    badge: 'Gold Donor',
    avatarEmoji: '💛',
    impactNote: 'Funded 7,140 subsidized consultations. 94% of patients were first-time telemedicine users.'
  },
  {
    id: 'don-3',
    name: 'Premji Foundation',
    amount: '₹30,00,000',
    amountNum: 3000000,
    message: 'Sponsoring the companion care volunteer program to combat loneliness in elderly patients.',
    badge: 'Gold Donor',
    avatarEmoji: '🤝',
    impactNote: 'This ₹30L keeps 180 companion care volunteers employed making daily elderly check-in calls.'
  },
  {
    id: 'don-4',
    name: 'Rohan Deshmukh & Family',
    amount: '₹5,00,000',
    amountNum: 500000,
    message: 'In memory of late Savitri Deshmukh. Supporting pregnant women medical tracking.',
    badge: 'Silver Donor',
    avatarEmoji: '🕊️',
    impactNote: 'This ₹5L funded 1,425 high-risk pregnancy consultations for women in Tier-3 towns.'
  },
  {
    id: 'don-5',
    name: 'Infosys Foundation',
    amount: '₹20,00,000',
    amountNum: 2000000,
    message: 'Funded towards local language speech-to-text models development.',
    badge: 'Silver Donor',
    avatarEmoji: '🔬',
    impactNote: 'This ₹20L built multilingual voice models supporting 6 Indian languages used daily in the app.'
  }
];

export const MOCK_FUND_ALLOCATION: FundAllocation[] = [
  { name: 'Rural Tele-Consults', value: 45, color: '#0d9488', amountStr: '₹56.25 L' },
  { name: 'Companion Care', value: 25, color: '#10b981', amountStr: '₹31.25 L' },
  { name: 'Medicine Subsidies', value: 18, color: '#0ea5e9', amountStr: '₹22.50 L' },
  { name: 'Infrastructure', value: 12, color: '#6366f1', amountStr: '₹15.00 L' }
];

export const MOCK_LEDGER_ENTRIES: LedgerEntry[] = [
  { id: 'tx-001', date: '03 July 2026', purpose: 'Consultation Subsidy - Rural Patient', amount: '₹350.00', doctorName: 'Dr. Amit Sharma', recipientHash: '0x3ef...d29' },
  { id: 'tx-002', date: '03 July 2026', purpose: 'Companion Call Volunteer Allowance', amount: '₹120.00', doctorName: 'N/A (Staff)', recipientHash: '0x88c...b22' },
  { id: 'tx-003', date: '02 July 2026', purpose: 'Medicine Subsidy - Chronic Care', amount: '₹540.00', doctorName: 'Dr. Sunita Rao', recipientHash: '0x1ab...f82' },
  { id: 'tx-004', date: '02 July 2026', purpose: 'Rural Cardiac Camp Outreach', amount: '₹8,500.00', doctorName: 'Dr. Ananya Rao', recipientHash: '0x44d...b38' },
  { id: 'tx-005', date: '01 July 2026', purpose: 'Consultation Subsidy - High Risk Pregnancy', amount: '₹400.00', doctorName: 'Dr. Priya Patel', recipientHash: '0xfa8...c13' }
];

export const MOCK_PATIENT_HISTORY: PatientHistory[] = [
  {
    id: 'h-01',
    date: '24 May 2026',
    doctorName: 'Dr. Amit Sharma',
    specialty: 'General Physician',
    diagnosis: 'Acute Viral Bronchitis',
    prescription: ['Calpol 650mg (TDS for 3 days)', 'Ascoril Cough Syrup (10ml HS)', 'Levocetirizine 5mg (OD for 5 days)'],
    notes: 'Patient presented with wheezing and persistent dry cough. Advised hot steam inhalation twice daily.'
  },
  {
    id: 'h-02',
    date: '10 April 2026',
    doctorName: 'Dr. Vikram Deshmukh',
    specialty: 'Orthopedic Surgeon',
    diagnosis: 'Osteoarthritis Grade 1 (Left Knee)',
    prescription: ['Tab Cartigen Pro (OD for 30 days)', 'Tab Ultracet (SOS for pain)', 'Volini Gel application Local'],
    notes: 'Mild joint crepitus. Advised low-impact knee exercises, weight control, and avoiding sitting cross-legged.'
  }
];

export const MOCK_COMPANION_CALLS: CompanionCall[] = [
  { id: 'call-01', date: '03 July 2026', time: '05:00 PM', status: 'answered', volunteerName: 'Aditya Sen', volunteerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=AdityaSen&backgroundColor=b6e3f4', notes: 'Karan answered promptly. Confirmed he took his evening dose of Calpol. Fever is stable (98.6°F).' },
  { id: 'call-02', date: '02 July 2026', time: '05:12 PM', status: 'answered', volunteerName: 'Aditya Sen', volunteerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=AdityaSen&backgroundColor=b6e3f4', notes: 'General check-in. Patient was cheerful and has started regular walking. Complied with all supplements.' },
  { id: 'call-03', date: '01 July 2026', time: '05:04 PM', status: 'no-answer', volunteerName: 'Megha Nair', volunteerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=MeghaNair&backgroundColor=ffd5dc', notes: 'First call went unanswered. Triggered automated retry in 10 minutes. Resolved on retry.' },
  { id: 'call-04', date: '28 June 2026', time: '05:15 PM', status: 'escalated', volunteerName: 'Megha Nair', volunteerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=MeghaNair&backgroundColor=ffd5dc', notes: 'Patient had missed two consecutive BP medication doses. Escalated alert sent to emergency contact.' },
  { id: 'call-05', date: '27 June 2026', time: '05:10 PM', status: 'answered', volunteerName: 'Preethi V.', volunteerAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=PreethiV&backgroundColor=d1fae5', notes: 'Routine check-in. Patient feels much better this week. Walked 2km this morning.' }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: 'test-1', name: 'Rameshwari Devi', city: 'Jaunpur, UP', avatarEmoji: '👩', avatarColor: '#fde68a', quote: 'Pehli baar ghar baithe doctor se baat kar payi. Hindi mein samjha, dawai bhi aa gayi.', rating: 5 },
  { id: 'test-2', name: 'Gopal Krishnan', city: 'Thanjavur, TN', avatarEmoji: '👨', avatarColor: '#bfdbfe', quote: "My father's heart condition was detected early. Dr. Ananya was exceptional — clear and caring.", rating: 5 },
  { id: 'test-3', name: 'Sunita Bai', city: 'Betul, MP', avatarEmoji: '🧕', avatarColor: '#ddd6fe', quote: 'Companion care volunteer Megha calls every day. Kabhi akela nahi lagta ab.', rating: 5 },
  { id: 'test-4', name: 'Deepak Yadav', city: 'Muzaffarpur, Bihar', avatarEmoji: '🧔', avatarColor: '#d1fae5', quote: 'Free consultation for people like us who cannot afford big hospitals. God bless this team.', rating: 5 },
  { id: 'test-5', name: 'Kamala Bai', city: 'Raichur, Karnataka', avatarEmoji: '👵', avatarColor: '#fce7f3', quote: 'No fake doctor rankings here. Genuine trust scores. My whole family now uses this.', rating: 5 }
];

export const getRecommendedDoctors = (symptomText: string): Doctor[] => {
  const query = symptomText.toLowerCase();
  if (query.includes('fever') || query.includes('cough') || query.includes('throat') || query.includes('cold') || query.includes('body pain')) {
    return [MOCK_DOCTORS[0], MOCK_DOCTORS[2]];
  }
  if (query.includes('pregnant') || query.includes('pregnancy') || query.includes('periods') || query.includes('delivery')) {
    return [MOCK_DOCTORS[1]];
  }
  if (query.includes('heart') || query.includes('bp') || query.includes('chest') || query.includes('blood pressure')) {
    return [MOCK_DOCTORS[3]];
  }
  if (query.includes('joint') || query.includes('knee') || query.includes('bone') || query.includes('fracture') || query.includes('back pain')) {
    return [MOCK_DOCTORS[4]];
  }
  return MOCK_DOCTORS;
};

export const getNearbyDoctors = () =>
  [...MOCK_DOCTORS].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
