import { Doctor, Patient, Appointment, AppointmentStatus, LabReport, Notification, LiveQueue } from '../types';

// Helper to generate dates relative to today
const getDateOffset = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Irfana Patil',
    specialty: 'Dermatologist',
    experience: 14,
    qualification: 'MD, DNB (Dermatology & Venereology)',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.9,
    reviewsCount: 142,
    fees: 600,
    clinicName: 'Forever Young Clinic',
    clinicAddress: 'Rajarampuri 6th Lane, Opp. Union Bank, Kolhapur',
    clinicTimings: '10:00 AM - 01:00 PM & 05:00 PM - 08:30 PM',
    clinicPhotos: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=60'
    ],
    availableSlots: {
      morning: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
      afternoon: ['01:00 PM', '01:30 PM'],
      evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM']
    },
    biography: 'Dr. Irfana Patil is a highly skilled clinical and cosmetic dermatologist with over 14 years of experience. She specializes in advanced anti-aging treatments, acne scar revisions, and medical lasers. She founded Forever Young Clinic to provide comprehensive and evidence-based skin, hair, and aesthetic care.',
    education: [
      'MBBS - Rajarshee Chhatrapati Shahu Maharaj Government Medical College, Kolhapur',
      'MD in Dermatology - KEM Hospital & Seth GS Medical College, Mumbai',
      'Fellowship in Aesthetic Medicine - IADVL, Germany'
    ],
    specializations: ['Clinical Dermatology', 'Cosmetic Laser Therapy', 'Anti-Aging Injectables', 'Acne & Scar Management'],
    reviews: [
      { id: 'rev-1-1', patientName: 'Deepak Kamble', rating: 5, date: '2026-07-10', comment: 'Dr. Irfana is extremely patient. She explained my acne treatment in detail. Highly recommended!' },
      { id: 'rev-1-2', patientName: 'Sneha Deshmukh', rating: 4, date: '2026-07-05', comment: 'Very clean clinic. The queue management was great, didn\'t have to wait for long.' }
    ]
  },
  {
    id: 'doc-2',
    name: 'Dr. Noopur Patil',
    specialty: 'Dermatologist',
    experience: 11,
    qualification: 'MD, DDV (Skin & VD)',
    languages: ['English', 'Marathi'],
    rating: 4.8,
    reviewsCount: 98,
    fees: 500,
    clinicName: "Derma Lab Clinic",
    clinicAddress: 'Nagalapark, Near Sambhaji Garden, Kolhapur',
    clinicTimings: '10:30 AM - 01:30 PM & 05:30 PM - 09:00 PM',
    clinicPhotos: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
    ],
    availableSlots: {
      morning: ['10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM'],
      afternoon: ['01:30 PM'],
      evening: ['05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM']
    },
    biography: 'Dr. Noopur Patil is an expert in managing chronic skin disorders such as psoriasis, eczema, and vitiligo. Her clinic, Derma Lab, is equipped with state-of-the-art diagnostic facilities for detailed skin and hair analysis.',
    education: [
      'MBBS - RCSM Government Medical College, Kolhapur',
      'DDV - Lokmanya Tilak Municipal Medical College, Sion, Mumbai'
    ],
    specializations: ['Chronic Skin Disorders', 'Trichology (Hair Fall Solutions)', 'Skin Biopsies', 'Chemical Peels'],
    reviews: [
      { id: 'rev-2-1', patientName: 'Priya Powar', rating: 5, date: '2026-07-12', comment: 'Dr. Noopur helped cure my long-term eczema. Her treatment plans are very realistic and easy to follow.' }
    ]
  },
  {
    id: 'doc-3',
    name: 'Dr. Bhavana Phulari',
    specialty: 'Dermatologist',
    experience: 16,
    qualification: 'MD, FCPS (Dermatology)',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.9,
    reviewsCount: 178,
    fees: 700,
    clinicName: 'Dr. Bhavana Phulari Skin Clinic',
    clinicAddress: 'Tarabai Park, Opp. Town Hall Park, Kolhapur',
    clinicTimings: '09:30 AM - 01:00 PM & 04:30 PM - 08:00 PM',
    clinicPhotos: [
      'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&auto=format&fit=crop&q=60'
    ],
    availableSlots: {
      morning: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
      afternoon: ['01:00 PM'],
      evening: ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM']
    },
    biography: 'Dr. Bhavana Phulari is a senior skin specialist with 16 years of expertise. She is recognized for her academic contributions and clinical expertise in pediatric skin conditions, nail diseases, and pigmentary disorders.',
    education: [
      'MBBS - BJ Government Medical College, Pune',
      'MD (Dermatology) - Grant Medical College & Sir JJ Group of Hospitals, Mumbai',
      'FCPS (Dermatology) - College of Physicians & Surgeons, Mumbai'
    ],
    specializations: ['Pediatric Dermatology', 'Pigmentary Disorders', 'Nail Surgeries', 'Skin Allergies'],
    reviews: [
      { id: 'rev-3-1', patientName: 'Ajay Kulkarni', rating: 5, date: '2026-07-14', comment: 'Highly expert doctor. Standard clinic procedures are followed and staff is polite.' }
    ]
  },
  {
    id: 'doc-4',
    name: 'Dr. Priyanka Patil',
    specialty: 'Dermatologist',
    experience: 8,
    qualification: 'DNB, DDV (Dermatology)',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.7,
    reviewsCount: 84,
    fees: 500,
    clinicName: "Dr. Priyanka's Skinglo Clinic",
    clinicAddress: 'Rajarampuri Main Road, Near Pearl Hotel, Kolhapur',
    clinicTimings: '11:00 AM - 02:00 PM & 05:00 PM - 09:00 PM',
    clinicPhotos: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'
    ],
    availableSlots: {
      morning: ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM'],
      afternoon: ['02:00 PM'],
      evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM']
    },
    biography: 'Dr. Priyanka Patil is a young, passionate dermatologist focusing on modern cosmetic procedures. Skinglo clinic provides premium skin rejuvenation, laser hair reduction, carbon peels, and microdermabrasion.',
    education: [
      'MBBS - Dr. V. M. Government Medical College, Solapur',
      'DNB in Dermatology - National Board of Examinations, New Delhi'
    ],
    specializations: ['Skin Glow Treatments', 'Laser Hair Removal', 'Microdermabrasion', 'Platelet-Rich Plasma (PRP)'],
    reviews: [
      { id: 'rev-4-1', patientName: 'Komal Yadav', rating: 5, date: '2026-07-11', comment: 'Got my PRP therapy done here. The results are amazing and the process was pain-free.' }
    ]
  },
  {
    id: 'doc-5',
    name: 'Dr. Rajesh Shah',
    specialty: 'Dermatologist',
    experience: 15,
    qualification: 'MD, DVD (Dermatology & Skin)',
    languages: ['English', 'Hindi', 'Gujarati'],
    rating: 4.8,
    reviewsCount: 110,
    fees: 600,
    clinicName: 'Dermavita Clinic',
    clinicAddress: 'Laxmipuri, Near Laxmi Mandir, Kolhapur',
    clinicTimings: '10:00 AM - 01:00 PM & 05:00 PM - 08:30 PM',
    clinicPhotos: [
      'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=600&auto=format&fit=crop&q=60'
    ],
    availableSlots: {
      morning: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
      afternoon: ['01:00 PM'],
      evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM']
    },
    biography: 'Dr. Rajesh Shah is a consultant dermatologist specializing in general medical dermatology, dermatosurgery, and sexually transmitted infections. He has lectured at national conferences.',
    education: [
      'MBBS - BJMC, Pune',
      'MD (Skin) - GSMC, Mumbai'
    ],
    specializations: ['Dermatosurgery', 'Skin Tag & Wart Removal', 'Nail Pathology', 'Fungal Infection Therapy'],
    reviews: [
      { id: 'rev-5-1', patientName: 'Vikas Patil', rating: 4, date: '2026-07-02', comment: 'Good consultant. Understood the problem of persistent skin allergy immediately.' }
    ]
  },
  {
    id: 'doc-6',
    name: 'Dr. Amit Patil',
    specialty: 'Dermatologist',
    experience: 12,
    qualification: 'MD, MBBS',
    languages: ['English', 'Marathi', 'Hindi'],
    rating: 4.7,
    reviewsCount: 92,
    fees: 550,
    clinicName: 'WellSkin Skin Hair & Aesthetic Clinic',
    clinicAddress: 'Sambhaji Nagar, Above HDFC Bank, Kolhapur',
    clinicTimings: '09:30 AM - 01:00 PM & 05:00 PM - 08:00 PM',
    clinicPhotos: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=60'
    ],
    availableSlots: {
      morning: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
      afternoon: ['01:00 PM'],
      evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM']
    },
    biography: 'Dr. Amit Patil established WellSkin Clinic with the focus on clinical dermatology and hair loss. WellSkin offers modern treatment lines for scalp problems, pattern baldness, and hair transplant consultations.',
    education: [
      'MBBS - RCSM GMC, Kolhapur',
      'MD (Dermatology) - Government Medical College, Miraj'
    ],
    specializations: ['Trichology & Hair Regrowth', 'Platelet Rich Fibrin (PRF)', 'Melasma Treatment', 'Psoriasis Management'],
    reviews: [
      { id: 'rev-6-1', patientName: 'Rohan More', rating: 5, date: '2026-07-13', comment: 'Best clinic for hair loss treatment. Dr. Amits prescription showed results in 2 months.' }
    ]
  },
  {
    id: 'doc-7',
    name: 'Dr. Sayali Kulkarni',
    specialty: 'Dermatologist',
    experience: 10,
    qualification: 'DNB, DDV',
    languages: ['English', 'Marathi', 'Hindi'],
    rating: 4.9,
    reviewsCount: 125,
    fees: 500,
    clinicName: 'Muktangan Skin & Hair Clinic',
    clinicAddress: 'Collector Office Road, Opp. Treasury Building, Kolhapur',
    clinicTimings: '10:00 AM - 02:00 PM & 04:30 PM - 07:30 PM',
    clinicPhotos: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=60'
    ],
    availableSlots: {
      morning: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM'],
      afternoon: ['02:00 PM'],
      evening: ['04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM']
    },
    biography: 'Dr. Sayali Kulkarni is a compassionate physician specializing in skin health and pediatric dermatology. She runs Muktangan Clinic with focus on safe skin procedures and child-safe dermatological treatments.',
    education: [
      'MBBS - MIMER, Talegaon',
      'DNB - Command Hospital, Pune'
    ],
    specializations: ['Pediatric Skin Conditions', 'Sun Allergy Treatments', 'Eczema Control', 'Vitiligo Management'],
    reviews: [
      { id: 'rev-7-1', patientName: 'Nisha Shinde', rating: 5, date: '2026-07-09', comment: 'Dr. Sayali was amazing with my 3-year old daughter who had skin rashes. Very warm and skilled.' }
    ]
  },
  {
    id: 'doc-8',
    name: 'Dr. Vikram Dev',
    specialty: 'Dermatologist',
    experience: 18,
    qualification: 'MD, DVD, FAMS',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.9,
    reviewsCount: 210,
    fees: 800,
    clinicName: 'Mahakal Clinic',
    clinicAddress: 'Shahupuri, 2nd Lane, Near Station Road, Kolhapur',
    clinicTimings: '09:00 AM - 12:30 PM & 04:00 PM - 07:30 PM',
    clinicPhotos: [
      'https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&auto=format&fit=crop&q=60'
    ],
    availableSlots: {
      morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
      afternoon: ['12:30 PM'],
      evening: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM']
    },
    biography: 'Dr. Vikram Dev is a veteran dermatologist in Kolhapur with 18 years of clinical practice. He is renowned for his diagnostics and management of complicated autoimmune skin disorders, severe drug rashes, and vitiligo surgeries.',
    education: [
      'MBBS - Grant Medical College, Mumbai',
      'MD (Dermatology) - BJMC, Pune',
      'Fellowship in Dermatosurgery - National Skin Centre, Singapore'
    ],
    specializations: ['Autoimmune Skin Conditions', 'Vitiligo Graft Surgery', 'Laser Rejuvenation', 'Pemphigus Management'],
    reviews: [
      { id: 'rev-8-1', patientName: 'Sudhir Desai', rating: 5, date: '2026-07-15', comment: 'The most senior skin specialist in town. Got my vitiligo surgery done, results are superb.' }
    ]
  },
  {
    id: 'doc-9',
    name: 'Dr. Anshita Mane',
    specialty: 'Dermatologist',
    experience: 9,
    qualification: 'MD, DNB (Dermatology)',
    languages: ['English', 'Marathi'],
    rating: 4.8,
    reviewsCount: 76,
    fees: 550,
    clinicName: 'Anshita Skin Clinic',
    clinicAddress: 'Tarabai Park, Opp. Synergetic Gym, Kolhapur',
    clinicTimings: '10:00 AM - 01:30 PM & 05:00 PM - 08:30 PM',
    clinicPhotos: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
    ],
    availableSlots: {
      morning: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM'],
      afternoon: ['01:30 PM'],
      evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM']
    },
    biography: 'Dr. Anshita Mane specializes in cosmetic therapies, dermabrasion, chemical peels, and laser whitening. She prides herself in providing customized skincare plans tailored to Indian skin types.',
    education: [
      'MBBS - DY Patil Medical College, Kolhapur',
      'MD (Dermatology) - Topiwala National Medical College, Mumbai'
    ],
    specializations: ['Pigment Reduction', 'Cosmetic Peels', 'PRP for Skin & Hair', 'Laser Skin Resurfacing'],
    reviews: [
      { id: 'rev-9-1', patientName: 'Punam Shinde', rating: 5, date: '2026-07-04', comment: 'Excellent doctor. Highly satisfied with my laser toning sessions.' }
    ]
  }
];

export const CURRENT_USER: Patient = {
  id: 'pat-1',
  name: 'Abhishek Kasar',
  email: 'abhishek.kasar@example.com',
  phone: '+91 98765 43210',
  bloodGroup: 'O+',
  emergencyContact: {
    name: 'Shital Kasar',
    relation: 'Spouse',
    phone: '+91 98765 43219'
  },
  insurance: {
    provider: 'Star Health Insurance',
    policyNumber: 'SH-294029-2026',
    expiryDate: '2028-12-31'
  },
  medicalConditions: ['Seasonal Allergies (Pollen)', 'Mild Eczema'],
  allergies: ['Sulfonamides', 'Peanuts'],
  address: 'Flat 402, Shivshakti Towers, Rajarampuri, Kolhapur, Maharashtra 416008',
  vitals: {
    bmi: 23.4,
    height: 176,
    weight: 72.5,
    heartRate: 72,
    bloodPressure: '122/79',
    sugarLevel: 94,
    cholesterol: 185,
    pulse: 74,
    healthScore: 88
  }
};

export const MOCK_PATIENTS: Patient[] = [
  CURRENT_USER,
  ...Array.from({ length: 100 }).map((_, i) => ({
    id: `pat-${i + 2}`,
    name: [
      'Ramesh Kadam', 'Sunita Jadhav', 'Rahul Patil', 'Aarti Shinde', 
      'Pradeep Deshmukh', 'Tejaswini Joshi', 'Sameer Powar', 'Vidya Naik',
      'Sanjay Chavan', 'Supriya Mane', 'Ganesh Kulkarni', 'Megha Shinde'
    ][i % 12] + ` ${10 + i}`,
    email: `patient.${i + 2}@example.com`,
    phone: `+91 90123 ${45000 + i}`,
    bloodGroup: ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-'][i % 7],
    emergencyContact: {
      name: 'Family Member',
      relation: 'Parent',
      phone: '+91 99999 88888'
    },
    insurance: {
      provider: 'HDFC Ergo Health',
      policyNumber: `HE-${903204 + i}`,
      expiryDate: '2028-06-30'
    },
    medicalConditions: i % 5 === 0 ? ['Hypertension'] : i % 8 === 0 ? ['Diabetes'] : [],
    allergies: i % 10 === 0 ? ['Penicillin'] : [],
    address: 'Kolhapur, Maharashtra',
    vitals: {
      bmi: Number((20 + (i % 8) * 1.2).toFixed(1)),
      height: 155 + (i % 25),
      weight: 55 + (i % 35),
      heartRate: 65 + (i % 20),
      bloodPressure: `${110 + (i % 25)}/${70 + (i % 15)}`,
      sugarLevel: 85 + (i % 45),
      cholesterol: 160 + (i % 60),
      pulse: 68 + (i % 18),
      healthScore: 60 + (i % 38)
    }
  }))
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    patientId: 'pat-1',
    patientName: 'Abhishek Kasar',
    doctorId: 'doc-1',
    doctorName: 'Dr. Irfana Patil',
    clinicName: 'Forever Young Clinic',
    date: getDateOffset(0), // Today
    time: '11:30 AM',
    token: 'T-12',
    status: 'Waiting',
    reason: 'Severe facial eczema flare-up and persistent skin itchiness.',
    payment: {
      amount: 600,
      status: 'Paid',
      method: 'UPI',
      transactionId: 'TXN-932840921',
      date: getDateOffset(0)
    }
  },
  {
    id: 'appt-2',
    patientId: 'pat-1',
    patientName: 'Abhishek Kasar',
    doctorId: 'doc-3',
    doctorName: 'Dr. Bhavana Phulari',
    clinicName: 'Dr. Bhavana Phulari Skin Clinic',
    date: getDateOffset(-20), // 20 days ago
    time: '10:30 AM',
    token: 'T-06',
    status: 'Completed',
    reason: 'Follow-up on dry skin rashes and allergy testing.',
    notes: 'Patient showed dry skin patches due to weather changes. Advised intensive moisturization.',
    prescription: [
      { id: 'rx-1', name: 'Hydroheal 1% Moisturizer Cream', dosage: '0-0-1', timing: 'After Food', duration: '15 Days', active: false, refillReminder: false },
      { id: 'rx-2', name: 'Allegra 120mg Tablet', dosage: '0-0-1', timing: 'Before Food', duration: '10 Days', active: false, refillReminder: false }
    ],
    payment: {
      amount: 700,
      status: 'Paid',
      method: 'Card',
      transactionId: 'TXN-832104928',
      date: getDateOffset(-20)
    }
  },
  {
    id: 'appt-3',
    patientId: 'pat-1',
    patientName: 'Abhishek Kasar',
    doctorId: 'doc-4',
    doctorName: 'Dr. Priyanka Patil',
    clinicName: "Dr. Priyanka's Skinglo Clinic",
    date: getDateOffset(-60), // 60 days ago
    time: '05:30 PM',
    token: 'T-21',
    status: 'Completed',
    reason: 'Consultation for dark spots on cheeks and microdermabrasion query.',
    notes: 'Sun-induced hyperpigmentation. Prescribed broad-spectrum sunscreen and Vitamin C serum.',
    prescription: [
      { id: 'rx-3', name: 'UV-Douz Silicone Sunscreen SPF 50', dosage: '1-0-1', timing: 'Any Time', duration: '30 Days', active: true, refillReminder: true },
      { id: 'rx-4', name: 'Sesderma C-Vit Liposomal Serum', dosage: '1-0-0', timing: 'Any Time', duration: '30 Days', active: true, refillReminder: false }
    ],
    payment: {
      amount: 500,
      status: 'Paid',
      method: 'UPI',
      transactionId: 'TXN-10395029',
      date: getDateOffset(-60)
    }
  },
  // Dynamically generated demo appointments for today (tokens T-01 to T-20, skipping T-12 for Abhishek)
  ...Array.from({ length: 20 }).map((_, idx) => {
    const tokenNum = idx + 1;
    if (tokenNum === 12) return null; // Skip T-12 since Abhishek holds T-12

    const token = `T-${String(tokenNum).padStart(2, '0')}`;
    const docIndex = (idx % 3); // Distribute among Dr. Irfana (doc-1), Dr. Noopur (doc-2), Dr. Bhavana (doc-3)
    const doctor = MOCK_DOCTORS[docIndex];
    
    // Mixed statuses: Completed (T-01 to T-08), Now Serving (T-09), Cancelled (T-16), Waiting (T-10 to T-17), Upcoming (T-18 to T-20)
    let status: AppointmentStatus = 'Waiting';
    if (tokenNum <= 8) {
      status = 'Completed';
    } else if (tokenNum === 9) {
      status = 'Now Serving';
    } else if (tokenNum === 16) {
      status = 'Cancelled';
    } else if (tokenNum >= 18) {
      status = 'Upcoming';
    }

    const patientNames = [
      'Amit Kulkarni', 'Siddharth Shah', 'Jyoti Deshmukh', 'Rajesh Joshi',
      'Pooja Chavan', 'Nikhil Patil', 'Sneha Mane', 'Vikram Shinde',
      'Anjali Powar', 'Ketan Naik', 'Supriya Kadam', 'Rohit Ghorpade',
      'Aarti Deshpande', 'Yash Gaikwad', 'Sayali Jadhav', 'Deepak More',
      'Harshada Salunkhe', 'Abhijit Sawant', 'Pallavi Rane', 'Pranav Kadam'
    ];
    
    const ages = [28, 34, 45, 19, 52, 23, 31, 40, 27, 36, 44, 50, 22, 29, 38, 47, 55, 33, 26, 61];
    const genders = ['Male', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male', 'Female', 'Male'];
    
    const timeSlots = [
      '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM',
      '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
      '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
      '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
      '05:00 PM', '05:15 PM', '05:30 PM', '05:45 PM'
    ];

    return {
      id: `appt-demo-${tokenNum}`,
      patientId: `pat-demo-${tokenNum}`,
      patientName: patientNames[idx],
      patientAge: ages[idx],
      patientGender: genders[idx],
      doctorId: doctor.id,
      doctorName: doctor.name,
      clinicName: doctor.clinicName,
      date: getDateOffset(0), // Today
      time: timeSlots[idx % timeSlots.length],
      token: token,
      status: status,
      isDemo: true,
      reason: ['Routine skin check', 'Acne treatment review', 'Hair loss consult', 'Laser therapy follow-up', 'Eczema management', 'Wart removal consult'][idx % 6],
      notes: status === 'Completed' ? 'Advised skin hydration and prescribed topical ointments.' : undefined,
      payment: {
        amount: doctor.fees,
        status: status === 'Cancelled' ? 'Refunded' : 'Paid' as any,
        method: ['UPI', 'Card', 'Wallet', 'Cash'][idx % 4] as any,
        transactionId: `TXN-DEMO${1000 + tokenNum}`,
        date: getDateOffset(0)
      }
    } as Appointment;
  }).filter((a): a is Appointment => a !== null),
  // Additional historical mock appointments
  ...Array.from({ length: 30 }).map((_, i) => {
    const docIndex = (i % 9);
    const doctor = MOCK_DOCTORS[docIndex];
    const status: AppointmentStatus = i % 15 === 0 ? 'Cancelled' : 'Completed';
    const apptDate = getDateOffset(-1 - (i % 15));
    
    return {
      id: `appt-mock-history-${i + 10}`,
      patientId: `pat-${(i % 50) + 2}`,
      patientName: MOCK_PATIENTS[(i % 50) + 1].name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      clinicName: doctor.clinicName,
      date: apptDate,
      time: ['10:30 AM', '11:15 AM', '12:00 PM', '05:30 PM', '06:15 PM', '07:00 PM'][i % 6],
      token: `T-0${(i % 15) + 1}`,
      status: status,
      reason: ['Acne checkup', 'Routine review', 'Skin allergy check'][i % 3],
      notes: 'Standard treatment completed.',
      payment: {
        amount: doctor.fees,
        status: 'Paid' as any,
        method: 'UPI' as any,
        transactionId: `TXN-MCKHIST${5932 + i}`,
        date: apptDate
      }
    };
  })
];

export const MOCK_LAB_REPORTS: LabReport[] = [
  {
    id: 'lab-1',
    patientId: 'pat-1',
    title: 'Complete Blood Count (CBC)',
    category: 'Blood Test',
    date: getDateOffset(-20),
    doctorName: 'Dr. Bhavana Phulari',
    status: 'Normal',
    valueSummary: 'Hemoglobin: 15.2 g/dL (Normal), WBC: 7,500 cells/mcL (Normal), Platelets: 2.5L (Normal)',
    fileUrl: '/reports/cbc_report.pdf'
  },
  {
    id: 'lab-2',
    patientId: 'pat-1',
    title: 'Allergen Panel - IgE Skin & Food',
    category: 'Blood Test',
    date: getDateOffset(-21),
    doctorName: 'Dr. Bhavana Phulari',
    status: 'Abnormal',
    valueSummary: 'High sensitivity detected for Peanut allergens (Class 4). Sulfonamides reactive. Pollen (Moderate).',
    fileUrl: '/reports/allergy_report.pdf'
  },
  {
    id: 'lab-3',
    patientId: 'pat-1',
    title: 'Serum IgE Level',
    category: 'Blood Test',
    date: getDateOffset(-21),
    doctorName: 'Dr. Bhavana Phulari',
    status: 'Abnormal',
    valueSummary: 'Total IgE level: 320 kU/L (Elevated, normal < 100 kU/L). Suggests active allergic response.',
    fileUrl: '/reports/ige_report.pdf'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Irfana Patil is confirmed for Today at 11:30 AM.',
    time: '2 hours ago',
    type: 'appointment',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Queue Alert: 3 Patients Ahead',
    message: '3 patients are ahead of you in Dr. Irfana\'s queue. Expected wait time is 25 minutes.',
    time: '15 mins ago',
    type: 'queue',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Sunscreen Refill Reminder',
    message: 'It is time to refill your UV-Douz Silicone Sunscreen as prescribed by Dr. Priyanka Patil.',
    time: '1 day ago',
    type: 'prescription',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Daily Skin Tip',
    message: 'Keep your skin hydrated. Drinking 3 liters of water daily helps maintain a healthy skin barrier.',
    time: '2 days ago',
    type: 'health_tip',
    read: true
  }
];

export const MOCK_QUEUES: LiveQueue[] = MOCK_DOCTORS.map((doc, index) => {
  // Generate random current tokens and timelines
  const currentNum = 5 + (index * 2) % 7;
  const myTokenNum = currentNum + 3;
  
  return {
    doctorId: doc.id,
    doctorName: doc.name,
    clinicName: doc.clinicName,
    currentToken: `T-${String(currentNum).padStart(2, '0')}`,
    expectedWaitingMin: 15 + (index * 5) % 30,
    patientsAhead: 3,
    timeline: Array.from({ length: 15 }).map((_, i) => {
      const tokenNum = i + 1;
      let status: 'completed' | 'ongoing' | 'waiting' | 'skipped' = 'waiting';
      if (tokenNum < currentNum) {
        status = tokenNum % 4 === 0 ? 'skipped' : 'completed';
      } else if (tokenNum === currentNum) {
        status = 'ongoing';
      }
      
      const patIndex = (tokenNum * 3) % MOCK_PATIENTS.length;
      return {
        token: `T-${String(tokenNum).padStart(2, '0')}`,
        status,
        patientName: tokenNum === myTokenNum ? 'Abhishek Kasar' : MOCK_PATIENTS[patIndex].name
      };
    })
  };
});
