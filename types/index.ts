export type Specialty = 'Dermatologist' | 'General Physician' | 'Pediatrician' | 'Dentist' | 'Cardiologist' | 'Orthopedic';

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  experience: number; // in years
  qualification: string;
  languages: string[];
  rating: number;
  reviewsCount: number;
  fees: number;
  clinicName: string;
  clinicAddress: string;
  clinicLocationUrl?: string;
  clinicTimings: string;
  clinicPhotos: string[];
  availableSlots: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  biography: string;
  education: string[];
  specializations: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  medicalConditions: string[];
  allergies: string[];
  address: string;
  vitals: {
    bmi: number;
    height: number; // in cm
    weight: number; // in kg
    heartRate: number; // bpm
    bloodPressure: string; // e.g. "120/80"
    sugarLevel: number; // mg/dL
    cholesterol: number; // mg/dL
    pulse: number; // bpm
    healthScore: number; // 0-100
  };
}

export type AppointmentStatus = 'Upcoming' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'Waiting' | 'Now Serving';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  clinicName: string;
  date: string;
  time: string;
  token: string;
  status: AppointmentStatus;
  reason: string;
  prescriptionUrl?: string; // uploaded file
  notes?: string; // doctor notes
  prescription?: PrescriptionItem[];
  labRequestIds?: string[];
  payment: {
    amount: number;
    status: 'Paid' | 'Pending' | 'Refunded';
    method: 'UPI' | 'Card' | 'Wallet' | 'Cash';
    transactionId: string;
    date: string;
  };
  queueState?: {
    currentToken: string;
    patientsAhead: number;
    estimatedWaitTime: number; // in minutes
  };
  isDemo?: boolean;
  rescheduleHistory?: RescheduleHistoryItem[];
}

export interface RescheduleHistoryItem {
  originalDate: string;
  originalTime: string;
  originalDoctorId: string;
  originalDoctorName: string;
  newDate: string;
  newTime: string;
  newDoctorId: string;
  newDoctorName: string;
  rescheduledAt: string;
  rescheduledBy: 'Patient' | 'Receptionist' | 'System';
  reason?: string;
}


export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string; // e.g. "1-0-1" or "Once daily"
  timing: 'Before Food' | 'After Food' | 'With Food' | 'Any Time';
  duration: string; // e.g. "5 Days"
  instructions?: string;
  active: boolean;
  refillReminder: boolean;
}

export interface LabReport {
  id: string;
  patientId: string;
  title: string;
  category: 'Blood Test' | 'Urine Test' | 'X-Ray' | 'MRI' | 'CT Scan';
  date: string;
  doctorName: string;
  status: 'Normal' | 'Abnormal' | 'Critical';
  valueSummary: string; // Brief highlights
  fileUrl: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string; // relative or absolute ISO
  type: 'appointment' | 'queue' | 'prescription' | 'followup' | 'system' | 'health_tip';
  read: boolean;
}

export interface LiveQueue {
  doctorId: string;
  doctorName: string;
  clinicName: string;
  currentToken: string;
  expectedWaitingMin: number;
  patientsAhead: number;
  timeline: {
    token: string;
    status: 'completed' | 'ongoing' | 'waiting' | 'skipped';
    patientName?: string;
  }[];
}
