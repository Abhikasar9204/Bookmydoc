'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Calendar, Activity, ShieldAlert, Award, FileText, Pill, 
  MapPin, Clock, Heart, Star, Compass, User, RefreshCw, Smartphone, 
  ChevronRight, ArrowLeft, CheckCircle2, QrCode, Download, Share2, 
  Plus, Users, Stethoscope, ChevronLeft, LogOut, Check, ToggleLeft, 
  ToggleRight, Flame, Droplet, Dumbbell, Shield, Settings, Info, 
  BookOpen, HelpCircle, UserPlus, CreditCard, ChevronDown, CheckSquare, 
  Eye, Menu, X, ArrowUpRight, TrendingUp, Printer, Microscope, Clipboard,
  Sun, Moon
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  MOCK_DOCTORS, CURRENT_USER, MOCK_APPOINTMENTS, 
  MOCK_LAB_REPORTS, MOCK_NOTIFICATIONS, MOCK_PATIENTS
} from '@/mock-data/db';
import { Doctor, Appointment, LabReport, Notification, LiveQueue, AppointmentStatus, Patient } from '@/types';

// Premium Animated Theme Toggle Component
const ThemeToggle = ({ dark, toggle }: { dark: boolean; toggle: () => void }) => {
  return (
    <button
      onClick={toggle}
      className="relative w-12 h-6.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between p-0.5 cursor-pointer select-none transition-colors duration-300 focus:outline-none theme-transition"
      aria-label="Toggle dark theme"
    >
      <motion.div
        className="absolute left-0.5 top-0.5 w-5.5 h-5.5 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center border border-slate-200/10 dark:border-slate-800/30"
        animate={{ x: dark ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        {dark ? (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -45 }}
            transition={{ duration: 0.15 }}
          >
            <Moon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            transition={{ duration: 0.15 }}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </motion.div>
        )}
      </motion.div>
      <Sun className="w-3 h-3 text-slate-400 dark:text-slate-600 ml-1.5 opacity-60 dark:opacity-100" />
      <Moon className="w-3 h-3 text-slate-600 dark:text-slate-400 mr-1.5 opacity-100 dark:opacity-60" />
    </button>
  );
};

const getDateOffset = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// SVGs and Icons
type View = 'splash' | 'onboarding' | 'auth' | 'app' | 'doctor' | 'receptionist';
type PatientTab = 'home' | 'appointments' | 'queue' | 'records' | 'profile';

export default function BookMyDocApp() {
  // Navigation / Shell States
  const [view, setView] = useState<View>('splash');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [patientTab, setPatientTab] = useState<PatientTab>('home');
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(true);
  const [receptionistSidebarOpen, setReceptionistSidebarOpen] = useState(false);
  const [doctorSidebarOpen, setDoctorSidebarOpen] = useState(false);
  
  // App Global State (Simulated DB)
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);
  
  // Flow States
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState<'details' | 'calendar' | 'prescription' | 'payment' | 'success'>('details');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [bookingReason, setBookingReason] = useState<string>('');
  const [bookingPrescriptionFile, setBookingPrescriptionFile] = useState<string>('');
  const [lastGeneratedAppt, setLastGeneratedAppt] = useState<Appointment | null>(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedFee, setSelectedFee] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  
  // Live Queue state
  const [myQueueNotify, setMyQueueNotify] = useState(true);
  const [walkSpeed, setWalkSpeed] = useState<string>('normal');
  const [distanceToClinic, setDistanceToClinic] = useState<string>('1.5');
  const [activeQueueId, setActiveQueueId] = useState<string>('doc-1');
  const [queueTicking, setQueueTicking] = useState(true);
  
  // Notification Indicator
  const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);
  
  // Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(59);

  // Settings
  const [darkMode, setDarkMode] = useState(false);
  const [appLanguage, setAppLanguage] = useState('English');

  // SOS state
  const [sosActive, setSosActive] = useState(false);

  // Health Center subtab
  const [healthSubTab, setHealthSubTab] = useState<'dashboard' | 'history' | 'medicines' | 'lab'>('dashboard');
  const [selectedLabReport, setSelectedLabReport] = useState<LabReport | null>(null);

  // Receptionist Console State
  const [receptionistSearch, setReceptionistSearch] = useState('');
  const [receptionistWalkinName, setReceptionistWalkinName] = useState('');
  const [receptionistWalkinPhone, setReceptionistWalkinPhone] = useState('');
  const [receptionistWalkinDoctor, setReceptionistWalkinDoctor] = useState('doc-1');
  const [receptionistWalkinTime, setReceptionistWalkinTime] = useState('11:00 AM');
  const [receptionistShowWalkinModal, setReceptionistShowWalkinModal] = useState(false);
  const [receptionistTab, setReceptionistTab] = useState<'dashboard' | 'appointments' | 'queue' | 'patients' | 'doctors' | 'reports' | 'settings'>('dashboard');
  const [receptionistApptSubTab, setReceptionistApptSubTab] = useState<'today' | 'upcoming' | 'completed' | 'cancelled' | 'rescheduled'>('today');
  const [selectedPatientForDrawer, setSelectedPatientForDrawer] = useState<Patient | null>(null);
  const [receptionistBookingOpen, setReceptionistBookingOpen] = useState(false);
  const [receptionistActivityLog, setReceptionistActivityLog] = useState<string[]>([
    "Initialised desk at 09:00 AM",
    "Verified live queue connectivity",
    "Auto-simulation status active"
  ]);
  const [receptionistAutoSimulate, setReceptionistAutoSimulate] = useState(true);
  
  // Receptionist Booking Screen states
  const [receptionistBookPatientName, setReceptionistBookPatientName] = useState('');
  const [receptionistBookPhone, setReceptionistBookPhone] = useState('');
  const [receptionistBookDoctorId, setReceptionistBookDoctorId] = useState('doc-1');
  const [receptionistBookDate, setReceptionistBookDate] = useState(getDateOffset(0));
  const [receptionistBookTime, setReceptionistBookTime] = useState('10:00 AM');
  const [receptionistBookReason, setReceptionistBookReason] = useState('');
  const [receptionistBookSuccess, setReceptionistBookSuccess] = useState(false);

  // Doctor Desk State
  const [doctorActivePatientId, setDoctorActivePatientId] = useState<string>('pat-2');
  const [doctorConsultNotes, setDoctorConsultNotes] = useState('');
  const [doctorRxName, setDoctorRxName] = useState('');
  const [doctorRxDosage, setDoctorRxDosage] = useState('1-0-1');
  const [doctorRxTiming, setDoctorRxTiming] = useState<'Before Food' | 'After Food' | 'With Food' | 'Any Time'>('After Food');
  const [doctorRxDuration, setDoctorRxDuration] = useState('5 Days');
  const [doctorPrescriptionsList, setDoctorPrescriptionsList] = useState<{name: string, dosage: string, timing: string, duration: string}[]>([]);
  const [doctorBreakActive, setDoctorBreakActive] = useState(false);

  // New Doctor Dashboard Workspace States
  const [doctorTab, setDoctorTab] = useState<'dashboard' | 'patients' | 'consultations' | 'appointments' | 'availability' | 'analytics' | 'profile'>('dashboard');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [doctorSelectedPatientId, setDoctorSelectedPatientId] = useState<string | null>(null);
  const [doctorConsultWorkspaceTab, setDoctorConsultWorkspaceTab] = useState<'diagnosis' | 'prescription' | 'clinical' | 'lab' | 'followup' | 'certificate' | 'referral'>('diagnosis');
  const [doctorSelectedLabTests, setDoctorSelectedLabTests] = useState<string[]>([]);
  const [doctorLabRequestGenerated, setDoctorLabRequestGenerated] = useState(false);
  const [doctorRxPrintOpen, setDoctorRxPrintOpen] = useState(false);
  
  // Status State
  const [doctorStatus, setDoctorStatus] = useState<'Available' | 'Busy' | 'On Break' | 'Offline'>('Available');

  // Availability Configuration
  const [doctorMaxPatients, setDoctorMaxPatients] = useState(25);
  const [doctorLunchTime, setDoctorLunchTime] = useState('01:00 PM - 02:00 PM');
  const [doctorWorkingHours, setDoctorWorkingHours] = useState('09:00 AM - 05:00 PM');
  const [doctorEmergencyAvailable, setDoctorEmergencyAvailable] = useState(true);
  const [doctorLeaveDays, setDoctorLeaveDays] = useState<string[]>([]);

  // PWA Support States
  const [pwaDeferredPrompt, setPwaDeferredPrompt] = useState<any>(null);
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [pwaStorageUsed, setPwaStorageUsed] = useState<string>('estimating...');
  const [showPwaSuccessAnimation, setShowPwaSuccessAnimation] = useState(false);

  // Theme Initialisation & Persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Synchronise state changes with HTML class list & LocalStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // PWA Register Service Worker & Install Event Handlers
  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('[PWA] Service Worker registered:', reg.scope))
          .catch((err) => console.error('[PWA] Service Worker registration failed:', err));
      } else {
        // Unregister service workers in development to prevent HMR and Fast Refresh reload loops
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().then((success) => {
              if (success) {
                console.log('[PWA] Active Service Worker unregistered for development');
              }
            });
          }
        });
      }
    }

    // 2. Install Prompt Listener
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setPwaDeferredPrompt(e);
        setShowPwaPrompt(true);
      }
    };
    window.addEventListener('beforebeforeinstallprompt', handleBeforeInstall); // standard event fallback
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 3. Online/Offline Listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial offline state
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    // 4. Estimate Storage Usage
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        const usedMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
        setPwaStorageUsed(`${usedMB} MB`);
      }).catch(() => setPwaStorageUsed('0.8 MB'));
    } else {
      setPwaStorageUsed('0.8 MB');
    }

    // 5. App Installed Listener
    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setShowPwaPrompt(false);
      setPwaDeferredPrompt(null);
      setShowPwaSuccessAnimation(true);
      setTimeout(() => setShowPwaSuccessAnimation(false), 3000);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Synchronise doctorBreakActive with doctorStatus
  useEffect(() => {
    setDoctorBreakActive(doctorStatus === 'On Break');
  }, [doctorStatus]);

  // --- Auto Splash Screen Transition ---
  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => {
        setView('onboarding');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // --- OTP Timer countdown ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (view === 'auth' && authMode === 'otp' && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, authMode, otpTimer]);

  // --- Receptionist Queue Simulation ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (receptionistAutoSimulate && view === 'receptionist') {
      interval = setInterval(() => {
        const todayStr = getDateOffset(0);
        const eventType = Math.floor(Math.random() * 4); // 0: checkin, 1: walkin, 2: call next, 3: cancel

        if (eventType === 0) {
          // Check-in an upcoming appointment
          setAppointments((prev) => {
            const upcoming = prev.find((a) => a.date === todayStr && a.status === 'Upcoming');
            if (!upcoming) return prev;
            
            // Add notification & log
            setNotifications(n => [
              {
                id: `notif-sim-${Date.now()}`,
                title: 'Patient Checked In',
                message: `${upcoming.patientName} has checked in. Token assigned: ${upcoming.token}.`,
                time: 'Just now',
                type: 'queue',
                read: false
              },
              ...n
            ]);
            setReceptionistActivityLog(log => [
              `[Check-in] Patient ${upcoming.patientName} checked in. Assigned token ${upcoming.token}.`,
              ...log.slice(0, 19)
            ]);
            
            return prev.map((a) => a.id === upcoming.id ? { ...a, status: 'Waiting' as const } : a);
          });
        } else if (eventType === 1) {
          // Add Walk-in
          const walkInNames = ['Sumit Patil', 'Neha Joshi', 'Amit Bhosale', 'Snehal Shinde', 'Prasad Kamble', 'Ruturaj Kadam'];
          const randomName = walkInNames[Math.floor(Math.random() * walkInNames.length)];
          const randomDoc = doctors[Math.floor(Math.random() * doctors.length)];
          
          setAppointments((prev) => {
            const docAppts = prev.filter(a => a.doctorId === randomDoc.id && a.date === todayStr);
            const maxToken = docAppts.reduce((max, a) => {
              const num = parseInt(a.token.replace('T-', ''));
              return num > max ? num : max;
            }, 0);
            const token = `T-${String(maxToken + 1).padStart(2, '0')}`;
            
            const newWalkin: Appointment = {
              id: `sim-walk-${Date.now()}`,
              patientId: `sim-pat-${Date.now()}`,
              patientName: randomName,
              doctorId: randomDoc.id,
              doctorName: randomDoc.name,
              clinicName: randomDoc.clinicName,
              date: todayStr,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              token: token,
              status: 'Waiting',
              reason: 'Walk-in Skin Check',
              payment: {
                amount: randomDoc.fees,
                status: 'Paid',
                method: 'Cash',
                transactionId: `TXN-SIM${Date.now().toString().slice(-4)}`,
                date: todayStr
              }
            };
            
            setNotifications(n => [
              {
                id: `notif-sim-${Date.now()}`,
                title: 'Walk-in Registered',
                message: `${randomName} is waiting for ${randomDoc.name}. Token: ${token}.`,
                time: 'Just now',
                type: 'appointment',
                read: false
              },
              ...n
            ]);
            setReceptionistActivityLog(log => [
              `[Walk-in] Registered walk-in ${randomName} for ${randomDoc.name}. Assigned ${token}.`,
              ...log.slice(0, 19)
            ]);
            
            return [newWalkin, ...prev];
          });
        } else if (eventType === 2) {
          // Advance doctor 1 (Dr. Irfana)
          setAppointments((prev) => {
            const doc1Appts = prev
              .filter((a) => a.doctorId === 'doc-1' && a.date === todayStr)
              .sort((a, b) => {
                const tA = parseInt(a.token.replace('T-', ''));
                const tB = parseInt(b.token.replace('T-', ''));
                return tA - tB;
              });
            
            const nowServing = doc1Appts.find((a) => a.status === 'Now Serving');
            const nextWaiting = doc1Appts.find((a) => a.status === 'Waiting');
            
            if (!nextWaiting) return prev;
            
            setNotifications(n => [
              {
                id: `notif-sim-${Date.now()}`,
                title: 'Queue Advanced',
                message: `Dr. Irfana Patil is now serving ${nextWaiting.patientName} (${nextWaiting.token}).`,
                time: 'Just now',
                type: 'queue',
                read: false
              },
              ...n
            ]);
            setReceptionistActivityLog(log => [
              `[Queue] Dr. Irfana Patil called next token: ${nextWaiting.token} (${nextWaiting.patientName}).`,
              ...log.slice(0, 19)
            ]);
            
            setDoctorActivePatientId(nextWaiting.patientId);
            
            return prev.map((a) => {
              if (nowServing && a.id === nowServing.id) {
                return { ...a, status: 'Completed' as const, notes: 'Completed skin consultation.' };
              }
              if (a.id === nextWaiting.id) {
                return { ...a, status: 'Now Serving' as const };
              }
              return a;
            });
          });
        } else {
          // Cancel an upcoming appointment
          setAppointments((prev) => {
            const upcoming = prev.find((a) => a.date === todayStr && a.status === 'Upcoming');
            if (!upcoming) return prev;
            
            setNotifications(n => [
              {
                id: `notif-sim-${Date.now()}`,
                title: 'Appointment Cancelled',
                message: `${upcoming.patientName} cancelled their slot (${upcoming.time}).`,
                time: 'Just now',
                type: 'appointment',
                read: false
              },
              ...n
            ]);
            setReceptionistActivityLog(log => [
              `[Cancel] Appointment ${upcoming.token} for ${upcoming.patientName} was cancelled.`,
              ...log.slice(0, 19)
            ]);
            
            return prev.map((a) => a.id === upcoming.id ? { ...a, status: 'Cancelled' as const } : a);
          });
        }
      }, 12000);
    }
    return () => clearInterval(interval);
  }, [receptionistAutoSimulate, view, doctors]);

  // --- Live Queue Movement Simulation ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (queueTicking && view === 'app' && patientTab === 'queue') {
      interval = setInterval(() => {
        setAppointments((prevAppts) => {
          const todayStr = getDateOffset(0);
          const doc1Appts = prevAppts
            .filter((a) => a.doctorId === 'doc-1' && a.date === todayStr)
            .sort((a, b) => {
              const tA = parseInt(a.token.replace('T-', ''));
              const tB = parseInt(b.token.replace('T-', ''));
              return tA - tB;
            });
          
          const nowServing = doc1Appts.find((a) => a.status === 'Now Serving');
          const nextWaiting = doc1Appts.find((a) => a.status === 'Waiting');

          // Log database realtime sync simulation
          console.log("[Supabase Realtime] Realtime broadcast: appointments table updated! Broadcasted queue change to all clients.");

          if (nowServing) {
            // Complete current consult and promote next waiting
            return prevAppts.map((appt) => {
              if (appt.id === nowServing.id) {
                return { ...appt, status: 'Completed' as const, notes: 'Completed skin consultation.' };
              }
              if (nextWaiting && appt.id === nextWaiting.id) {
                // Add notification if it's Abhishek
                if (nextWaiting.patientId === currentUser.id && myQueueNotify) {
                  const newNotif: Notification = {
                    id: `notif-live-${Date.now()}`,
                    title: "It's Your Turn! 🩺",
                    message: 'Dr. Irfana Patil is ready to see you. Please proceed to Consultation Room 1.',
                    time: 'Just now',
                    type: 'queue',
                    read: false
                  };
                  setNotifications(prev => [newNotif, ...prev]);
                }
                return { ...appt, status: 'Now Serving' as const };
              }
              return appt;
            });
          } else if (nextWaiting) {
            // No one is currently serving, promote first waiting
            return prevAppts.map((appt) => {
              if (appt.id === nextWaiting.id) {
                if (nextWaiting.patientId === currentUser.id && myQueueNotify) {
                  const newNotif: Notification = {
                    id: `notif-live-${Date.now()}`,
                    title: "It's Your Turn! 🩺",
                    message: 'Dr. Irfana Patil is ready to see you. Please proceed to Consultation Room 1.',
                    time: 'Just now',
                    type: 'queue',
                    read: false
                  };
                  setNotifications(prev => [newNotif, ...prev]);
                }
                return { ...appt, status: 'Now Serving' as const };
              }
              return appt;
            });
          } else {
            // Reset queue loop for continuous demo loop
            return prevAppts.map((appt) => {
              if (appt.doctorId === 'doc-1' && appt.date === todayStr) {
                if (appt.id === 'appt-doc1-1') return { ...appt, status: 'Now Serving' as const };
                if (appt.id === 'appt-doc1-2') return { ...appt, status: 'Waiting' as const };
                if (appt.id === 'appt-doc1-3') return { ...appt, status: 'Waiting' as const };
                if (appt.id === 'appt-1') return { ...appt, status: 'Waiting' as const };
                if (appt.id.startsWith('appt-new-') || appt.id.startsWith('appt-walk-')) return { ...appt, status: 'Waiting' as const };
              }
              return appt;
            });
          }
        });
      }, 15000); // Trigger every 15 seconds
    }
    return () => clearInterval(interval);
  }, [queueTicking, view, patientTab, myQueueNotify, currentUser.id]);

  // Derived state selector to fetch token details directly from appointments table
  const getDoctorQueueDetails = (docId: string, patId?: string) => {
    const todayStr = getDateOffset(0);
    const docTodayAppts = appointments
      .filter((a) => a.doctorId === docId && a.date === todayStr)
      .sort((a, b) => {
        const tA = parseInt(a.token.replace('T-', ''));
        const tB = parseInt(b.token.replace('T-', ''));
        return tA - tB;
      });

    const nowServing = docTodayAppts.find((a) => a.status === 'Now Serving');
    const activeQueueList = docTodayAppts.filter((a) => a.status === 'Waiting' || a.status === 'Now Serving');
    
    let patientsAhead = 0;
    if (patId) {
      const patIndex = activeQueueList.findIndex((a) => a.patientId === patId);
      patientsAhead = patIndex > -1 ? patIndex : 0;
    }

    return {
      currentToken: nowServing ? nowServing.token : 'None',
      patientsAhead: patientsAhead,
      estimatedWaitTime: patientsAhead * 10,
      timeline: activeQueueList.map((a) => ({
        token: a.token,
        status: a.status === 'Now Serving' ? ('ongoing' as const) : ('waiting' as const),
        patientName: a.patientName,
        patientId: a.patientId
      }))
    };
  };

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields.');
      return;
    }
    if (loginEmail.toLowerCase() === 'doctor@bookmydoc.com') {
      setView('doctor');
      setShowRoleSwitcher(true);
    } else if (loginEmail.toLowerCase() === 'receptionist@bookmydoc.com') {
      setView('receptionist');
      setShowRoleSwitcher(true);
    } else {
      // Normal patient login
      setLoginError('');
      setAuthMode('otp');
      setOtpTimer(59);
    }
  };

  // Handle Signup submission
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPhone || !signupPassword || !signupConfirmPassword) {
      setSignupError('All fields are required.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    setSignupError('');
    // Mock user creation
    setCurrentUser({
      ...CURRENT_USER,
      name: signupName,
      email: signupEmail,
      phone: signupPhone
    });
    setAuthMode('otp');
    setOtpTimer(59);
  };

  // Handle OTP digit inputs
  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    if (otpCode.join('').length < 6) return;
    setView('app');
    setPatientTab('home');
  };

  // Booking Flow trigger
  const triggerBooking = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep('details');
    setBookingDate(getDateOffset(0)); // Default today for instant live queue verification
    setBookingTime('10:30 AM');
    setBookingReason('');
    setBookingPrescriptionFile('');
    setPatientTab('appointments');
  };

  // Complete Booking
  const confirmBooking = () => {
    if (!selectedDoctor) return;
    
    // Create new appointment item
    const newApptId = `appt-new-${Date.now()}`;
    
    // Fetch token directly from existing appointments table (maxToken + 1)
    const doctorApptsOnDate = appointments.filter(a => a.doctorId === selectedDoctor.id && a.date === bookingDate);
    const maxTokenNum = doctorApptsOnDate.reduce((max, a) => {
      const num = parseInt(a.token.replace('T-', ''));
      return num > max ? num : max;
    }, 0);
    const token = `T-${String(maxTokenNum + 1).padStart(2, '0')}`;
    const status: AppointmentStatus = bookingDate === getDateOffset(0) ? 'Waiting' : 'Upcoming';

    console.log(`%c[Queue Pipeline: Appointment Creation]`, 'color: #0F8B8D; font-weight: bold;', {
      apptId: newApptId,
      patientName: currentUser.name,
      doctorName: selectedDoctor.name,
      date: bookingDate,
      time: bookingTime
    });
    console.log(`%c[Queue Pipeline: Token Generation]`, 'color: #4FD1C5; font-weight: bold;', {
      doctorName: selectedDoctor.name,
      bookingDate,
      calculatedToken: token,
      basedOnMaxToken: maxTokenNum
    });
    console.log(`%c[Queue Pipeline: Status Assignment]`, 'color: #3182CE; font-weight: bold;', {
      assignedStatus: status,
      isToday: bookingDate === getDateOffset(0)
    });

    const newAppt: Appointment = {
      id: newApptId,
      patientId: currentUser.id,
      patientName: currentUser.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      clinicName: selectedDoctor.clinicName,
      date: bookingDate,
      time: bookingTime,
      token: token,
      status: status, // Waiting if today, Upcoming if future
      reason: bookingReason || 'Routine Dermatology Checkup',
      prescriptionUrl: bookingPrescriptionFile || undefined,
      payment: {
        amount: selectedDoctor.fees,
        status: 'Paid',
        method: 'UPI',
        transactionId: `TXN-NEW${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0]
      }
    };

    setAppointments(prev => {
      const nextAppts = [newAppt, ...prev];
      console.log(`%c[Queue Pipeline: Queue Insertion]`, 'color: #E53E3E; font-weight: bold;', {
        insertedAppointmentId: newApptId,
        newQueueLength: nextAppts.filter(a => a.doctorId === selectedDoctor.id && a.date === bookingDate && (a.status === 'Waiting' || a.status === 'Now Serving')).length
      });
      return nextAppts;
    });
    setLastGeneratedAppt(newAppt);

    // Add notification
    const newNotif: Notification = {
      id: `notif-new-${Date.now()}`,
      title: 'Appointment Booked Successfully',
      message: `Your visit with ${selectedDoctor.name} at ${selectedDoctor.clinicName} is set for ${bookingDate} at ${bookingTime}. Token: ${token}.`,
      time: 'Just now',
      type: 'appointment',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Broadcast realtime event
    console.log(`%c[Supabase Realtime Broadcast]`, 'color: #ED8936; font-weight: bold;', {
      event: 'INSERT',
      schema: 'public',
      table: 'appointments',
      payload: newAppt
    });

    // Trigger Success
    setBookingStep('success');

    // Confetti effect
    try {
      const confetti = require('canvas-confetti');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0F8B8D', '#4FD1C5', '#7CE7E7', '#F59E0B']
      });
    } catch (e) {
      console.log('Confetti load error:', e);
    }
  };

  // Filter logic
  const filteredDoctors = doctors.filter((doc) => {
    // Search filter
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.clinicAddress.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Specialty filter
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    
    // Fee filter
    let matchesFee = true;
    if (selectedFee !== 'All') {
      const maxFee = parseInt(selectedFee);
      matchesFee = doc.fees <= maxFee;
    }
    
    // Experience filter
    let matchesExp = true;
    if (selectedExperience !== 'All') {
      const minExp = parseInt(selectedExperience);
      matchesExp = doc.experience >= minExp;
    }

    return matchesSearch && matchesSpecialty && matchesFee && matchesExp;
  });

  // Today's Appointment logic (includes Scheduled, Checked-in Waiting, or Now Serving states)
  const todayAppt = appointments.find(
    (appt) => appt.patientId === currentUser.id && 
              appt.date === getDateOffset(0) && 
              (appt.status === 'Upcoming' || appt.status === 'Waiting' || appt.status === 'Now Serving')
  );

  const todayQueue = todayAppt ? getDoctorQueueDetails(todayAppt.doctorId, currentUser.id) : null;

  // --- Receptionist Actions ---
  const handleReceptionistCheckin = (apptId: string) => {
    setAppointments(prev => 
      prev.map(appt => {
        if (appt.id === apptId) {
          console.log(`%c[Queue Pipeline: Receptionist Check-in]`, 'color: #0F8B8D; font-weight: bold;', {
            apptId,
            patientName: appt.patientName,
            doctorName: appt.doctorName,
            statusChange: `${appt.status} -> Waiting`
          });
          return { ...appt, status: 'Waiting' as const };
        }
        return appt;
      })
    );

    // Broadcast realtime event
    console.log(`%c[Supabase Realtime Broadcast]`, 'color: #ED8936; font-weight: bold;', {
      event: 'UPDATE',
      schema: 'public',
      table: 'appointments',
      targetId: apptId,
      newStatus: 'Waiting'
    });
  };

  const handleReceptionistAddWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receptionistWalkinName || !receptionistWalkinPhone) return;

    const doctor = doctors.find(d => d.id === receptionistWalkinDoctor);
    if (!doctor) return;

    // Fetch token directly from existing appointments table (maxToken + 1)
    const todayStr = getDateOffset(0);
    const doctorApptsToday = appointments.filter(a => a.doctorId === doctor.id && a.date === todayStr);
    const maxTokenNum = doctorApptsToday.reduce((max, a) => {
      const num = parseInt(a.token.replace('T-', ''));
      return num > max ? num : max;
    }, 0);
    const token = `T-${String(maxTokenNum + 1).padStart(2, '0')}`;
    const newApptId = `appt-walk-${Date.now()}`;

    console.log(`%c[Queue Pipeline: Receptionist Walk-in Creation]`, 'color: #0F8B8D; font-weight: bold;', {
      apptId: newApptId,
      patientName: receptionistWalkinName,
      doctorName: doctor.name,
      date: todayStr,
      time: receptionistWalkinTime
    });
    console.log(`%c[Queue Pipeline: Token Generation]`, 'color: #4FD1C5; font-weight: bold;', {
      doctorName: doctor.name,
      bookingDate: todayStr,
      calculatedToken: token,
      basedOnMaxToken: maxTokenNum
    });
    console.log(`%c[Queue Pipeline: Status Assignment]`, 'color: #3182CE; font-weight: bold;', {
      assignedStatus: 'Waiting',
      reason: 'Walk-in'
    });

    const newAppt: Appointment = {
      id: newApptId,
      patientId: `pat-walk-${Date.now()}`,
      patientName: receptionistWalkinName,
      doctorId: doctor.id,
      doctorName: doctor.name,
      clinicName: doctor.clinicName,
      date: todayStr,
      time: receptionistWalkinTime,
      token: token,
      status: 'Waiting', // Walk-in is checked in directly as Waiting status
      reason: 'Walk-in Skin Consult',
      payment: {
        amount: doctor.fees,
        status: 'Paid',
        method: 'Cash',
        transactionId: `TXN-WALK${Date.now().toString().slice(-4)}`,
        date: todayStr
      }
    };

    setAppointments(prev => {
      const nextAppts = [newAppt, ...prev];
      console.log(`%c[Queue Pipeline: Queue Insertion]`, 'color: #E53E3E; font-weight: bold;', {
        insertedAppointmentId: newApptId,
        newQueueLength: nextAppts.filter(a => a.doctorId === doctor.id && a.date === todayStr && (a.status === 'Waiting' || a.status === 'Now Serving')).length
      });
      return nextAppts;
    });

    // Broadcast realtime event
    console.log(`%c[Supabase Realtime Broadcast]`, 'color: #ED8936; font-weight: bold;', {
      event: 'INSERT',
      schema: 'public',
      table: 'appointments',
      payload: newAppt
    });

    // Reset Form
    setReceptionistWalkinName('');
    setReceptionistWalkinPhone('');
    setReceptionistShowWalkinModal(false);
  };

  const handleReceptionistBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receptionistBookPatientName || !receptionistBookPhone) return;

    const doctor = doctors.find(d => d.id === receptionistBookDoctorId);
    if (!doctor) return;

    // Fetch token directly from existing appointments table (maxToken + 1)
    const docApptsOnDate = appointments.filter(a => a.doctorId === doctor.id && a.date === receptionistBookDate);
    const maxTokenNum = docApptsOnDate.reduce((max, a) => {
      const num = parseInt(a.token.replace('T-', ''));
      return num > max ? num : max;
    }, 0);
    const token = `T-${String(maxTokenNum + 1).padStart(2, '0')}`;
    const status: AppointmentStatus = receptionistBookDate === getDateOffset(0) ? 'Waiting' : 'Upcoming';

    const newAppt: Appointment = {
      id: `appt-recept-${Date.now()}`,
      patientId: `pat-recept-${Date.now()}`,
      patientName: receptionistBookPatientName,
      doctorId: doctor.id,
      doctorName: doctor.name,
      clinicName: doctor.clinicName,
      date: receptionistBookDate,
      time: receptionistBookTime,
      token: token,
      status: status,
      reason: receptionistBookReason || 'Routine Skin Consult',
      payment: {
        amount: doctor.fees,
        status: 'Paid',
        method: 'UPI',
        transactionId: `TXN-RECEPT${Date.now().toString().slice(-4)}`,
        date: receptionistBookDate
      }
    };

    setAppointments(prev => [newAppt, ...prev]);

    setReceptionistActivityLog(log => [
      `[Booking] Booked patient ${receptionistBookPatientName} for ${doctor.name} on ${receptionistBookDate}. Token: ${token}.`,
      ...log.slice(0, 19)
    ]);

    setNotifications(n => [
      {
        id: `notif-recept-${Date.now()}`,
        title: 'New Booking Created',
        message: `${receptionistBookPatientName} is booked for ${doctor.name} on ${receptionistBookDate} at ${receptionistBookTime}. Token: ${token}.`,
        time: 'Just now',
        read: false,
        type: 'appointment'
      },
      ...n
    ]);

    setReceptionistBookSuccess(true);
    setTimeout(() => {
      setReceptionistBookSuccess(false);
      setReceptionistBookingOpen(false);
      setReceptionistBookPatientName('');
      setReceptionistBookPhone('');
      setReceptionistBookReason('');
    }, 1500);
  };

  // --- Doctor Desk Actions ---
  const handleDoctorCallNext = () => {
    const todayStr = getDateOffset(0);
    const doc1Appts = appointments
      .filter((a) => a.doctorId === 'doc-1' && a.date === todayStr)
      .sort((a, b) => {
        const tA = parseInt(a.token.replace('T-', ''));
        const tB = parseInt(b.token.replace('T-', ''));
        return tA - tB;
      });
    
    const nowServing = doc1Appts.find((a) => a.status === 'Now Serving');
    const nextWaiting = doc1Appts.find((a) => a.status === 'Waiting');

    if (!nextWaiting) {
      alert("No more waiting patients in the queue!");
      return;
    }

    setAppointments(prev => 
      prev.map(appt => {
        if (nowServing && appt.id === nowServing.id) {
          return { ...appt, status: 'Completed' as const, notes: 'Completed skin consultation.' };
        }
        if (appt.id === nextWaiting.id) {
          return { ...appt, status: 'Now Serving' as const };
        }
        return appt;
      })
    );

    setDoctorActivePatientId(nextWaiting.patientId);
    setDoctorPrescriptionsList([]);
    setDoctorConsultNotes('');
    console.log("[Supabase Realtime] Realtime broadcast: appointments table updated! Broadcasted queue change to all clients.");
  };

  const handleDoctorAddRx = () => {
    if (!doctorRxName) return;
    setDoctorPrescriptionsList(prev => [
      ...prev,
      { name: doctorRxName, dosage: doctorRxDosage, timing: doctorRxTiming, duration: doctorRxDuration }
    ]);
    setDoctorRxName('');
  };

  const handleDoctorCompleteConsult = () => {
    const todayStr = getDateOffset(0);
    const doc1Appts = appointments
      .filter((a) => a.doctorId === 'doc-1' && a.date === todayStr)
      .sort((a, b) => {
        const tA = parseInt(a.token.replace('T-', ''));
        const tB = parseInt(b.token.replace('T-', ''));
        return tA - tB;
      });
    
    const nowServing = doc1Appts.find((a) => a.status === 'Now Serving');
    const nextWaiting = doc1Appts.find((a) => a.status === 'Waiting');

    if (!nowServing) {
      alert("No patient is currently being served!");
      return;
    }

    setAppointments(prev => 
      prev.map(appt => {
        if (appt.id === nowServing.id) {
          return {
            ...appt,
            status: 'Completed' as const,
            notes: doctorConsultNotes,
            prescription: doctorPrescriptionsList.map((rx, idx) => ({
              id: `rx-added-${idx}-${Date.now()}`,
              name: rx.name,
              dosage: rx.dosage,
              timing: rx.timing as any,
              duration: rx.duration,
              active: true,
              refillReminder: true
            }))
          };
        }
        if (nextWaiting && appt.id === nextWaiting.id) {
          return { ...appt, status: 'Now Serving' as const };
        }
        return appt;
      })
    );

    if (nextWaiting) {
      setDoctorActivePatientId(nextWaiting.patientId);
    } else {
      setDoctorActivePatientId('');
    }
    
    setDoctorPrescriptionsList([]);
    setDoctorConsultNotes('');
    console.log("[Supabase Realtime] Realtime broadcast: appointments table updated! Broadcasted queue change to all clients.");
  };

  const getPatientDetails = (id: string): Patient => {
    const existing = MOCK_PATIENTS.find(p => p.id === id);
    if (existing) return existing;
    if (id === currentUser.id) return currentUser;
    
    // Fallback/Walk-in patient simulation details
    const appt = appointments.find(a => a.patientId === id);
    return {
      id: id,
      name: appt ? appt.patientName : 'Walk-in Patient',
      email: 'patient@example.com',
      phone: appt ? '9876543210' : '9876543210',
      bloodGroup: 'O+',
      emergencyContact: { name: 'Guardian', relation: 'Spouse', phone: '9876543211' },
      insurance: { provider: 'Star Health', policyNumber: 'POL-90082', expiryDate: '2027-12-31' },
      medicalConditions: ['None'],
      allergies: ['None'],
      address: 'Clinic Walk-in',
      vitals: {
        bmi: 22.4,
        height: 172,
        weight: 68,
        heartRate: 76,
        bloodPressure: '120/80',
        sugarLevel: 98,
        cholesterol: 185,
        pulse: 76,
        healthScore: 88
      }
    };
  };

  const activeDocPatient = getPatientDetails(doctorActivePatientId);

  // Reschedule Workflow States
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('');
  const [rescheduleDoctorId, setRescheduleDoctorId] = useState<string>('');
  const [rescheduleReason, setRescheduleReason] = useState<string>('');
  const [rescheduleError, setRescheduleError] = useState<string>('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState<string>('');

  // Selected Doctor Queue display state
  const [selectedQueueDoctorId, setSelectedQueueDoctorId] = useState<string>('doc-1');

  const triggerReschedule = (appt: Appointment) => {
    setRescheduleAppt(appt);
    setRescheduleDate(appt.date);
    setRescheduleTime(appt.time);
    setRescheduleDoctorId(appt.doctorId);
    setRescheduleReason('');
    setRescheduleError('');
    setRescheduleSuccess('');
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleAppt) return;
    setRescheduleError('');
    setRescheduleSuccess('');

    // Eligibility check
    if (rescheduleAppt.status === 'Completed' || rescheduleAppt.status === 'Cancelled') {
      setRescheduleError("Completed or cancelled appointments cannot be rescheduled.");
      return;
    }

    const newDoctor = doctors.find(d => d.id === rescheduleDoctorId);
    if (!newDoctor) {
      setRescheduleError("Please select a valid doctor.");
      return;
    }

    // Check if slot is already taken by another active appointment
    const isDoubleBooked = appointments.some(appt => 
      appt.id !== rescheduleAppt.id &&
      appt.doctorId === rescheduleDoctorId &&
      appt.date === rescheduleDate &&
      appt.time === rescheduleTime &&
      appt.status !== 'Cancelled'
    );
    if (isDoubleBooked) {
      setRescheduleError("This slot is already booked for this doctor. Please select another slot.");
      return;
    }

    // Allocate sequential token
    const doctorApptsOnDate = appointments.filter(a => 
      a.id !== rescheduleAppt.id && 
      a.doctorId === rescheduleDoctorId && 
      a.date === rescheduleDate
    );
    const maxTokenNum = doctorApptsOnDate.reduce((max, a) => {
      const num = parseInt(a.token.replace('T-', ''));
      return num > max ? num : max;
    }, 0);
    const newToken = `T-${String(maxTokenNum + 1).padStart(2, '0')}`;

    const historyItem = {
      originalDate: rescheduleAppt.date,
      originalTime: rescheduleAppt.time,
      originalDoctorId: rescheduleAppt.doctorId,
      originalDoctorName: rescheduleAppt.doctorName,
      newDate: rescheduleDate,
      newTime: rescheduleTime,
      newDoctorId: rescheduleDoctorId,
      newDoctorName: newDoctor.name,
      rescheduledAt: new Date().toISOString(),
      rescheduledBy: (view === 'receptionist' ? 'Receptionist' : 'Patient') as any,
      reason: rescheduleReason
    };

    setAppointments(prev => 
      prev.map(appt => {
        if (appt.id === rescheduleAppt.id) {
          const newStatus: AppointmentStatus = rescheduleDate === getDateOffset(0) ? 'Waiting' : 'Upcoming';
          return {
            ...appt,
            date: rescheduleDate,
            time: rescheduleTime,
            doctorId: rescheduleDoctorId,
            doctorName: newDoctor.name,
            clinicName: newDoctor.clinicName,
            token: newToken,
            status: newStatus,
            rescheduleHistory: [...(appt.rescheduleHistory || []), historyItem]
          };
        }
        return appt;
      })
    );

    console.log(`%c[Queue Pipeline: Appointment Rescheduled]`, 'color: #3182CE; font-weight: bold;', historyItem);
    console.log(`%c[Supabase Realtime Broadcast]`, 'color: #ED8936; font-weight: bold;', {
      event: 'UPDATE',
      schema: 'public',
      table: 'appointments',
      apptId: rescheduleAppt.id,
      newPayload: {
        date: rescheduleDate,
        time: rescheduleTime,
        token: newToken,
        doctorId: rescheduleDoctorId
      }
    });

    setRescheduleSuccess("Appointment rescheduled successfully!");
    setTimeout(() => {
      setRescheduleAppt(null);
      setRescheduleSuccess('');
    }, 1500);
  };

  // Active appointment and queue state derived directly from appointments table
  const abhishekQueueAppt = appointments.find(
    (a) => a.patientId === currentUser.id && 
           (a.status === 'Waiting' || a.status === 'Now Serving') && 
           a.doctorId === 'doc-1' && 
           a.date === getDateOffset(0)
  );

  const abhishekActiveQueue = getDoctorQueueDetails('doc-1', currentUser.id);

  return (
    <div className={cn("h-screen overflow-hidden lg:h-auto lg:overflow-visible flex flex-col bg-slate-50 dark:bg-slate-950 font-sans theme-transition", {
      "dark text-slate-100": darkMode
    })}>
      
      {/* Mobile Global Header (Visible only on < lg screens and for logged-in views) */}
      {view !== 'splash' && view !== 'onboarding' && view !== 'auth' && (
        <div className="lg:hidden w-full bg-white dark:bg-slate-900 border-b border-slate-150/80 dark:border-slate-800 flex flex-col pt-[calc(env(safe-area-inset-top)+12px)] px-4 pb-3 sticky top-0 z-40 shadow-xs theme-transition">
          
          {/* Row 1: Menu | Clinic Name | Notification | Dark Mode Toggle | Profile Avatar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {view !== 'app' ? (
                <button
                  onClick={() => {
                    if (view === 'receptionist') setReceptionistSidebarOpen(true);
                    else if (view === 'doctor') setDoctorSidebarOpen(true);
                  }}
                  className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                >
                  <Menu className="w-5.5 h-5.5 text-slate-600 dark:text-slate-350" />
                </button>
              ) : (
                <div className="w-7" />
              )}
              <h1 className="font-heading font-black text-clamp-heading leading-none text-slate-800 dark:text-white">
                {view === 'receptionist' && 'Dermavita Desk'}
                {view === 'doctor' && 'Dermavita Clinic'}
                {view === 'app' && 'BookMyDoc'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2.5">
              {/* Notification Bell */}
              <button 
                onClick={() => setShowNotificationOverlay(true)}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all focus:outline-none border border-slate-100/50 dark:border-slate-800/40"
              >
                <Bell className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900 animate-pulse" />
                )}
              </button>

              {/* Dark Mode Toggle */}
              <ThemeToggle dark={darkMode} toggle={() => setDarkMode(!darkMode)} />

              {/* Profile Avatar */}
              <div 
                onClick={() => {
                  if (view === 'app') setPatientTab('profile');
                  else if (view === 'doctor') setDoctorTab('profile');
                  else if (view === 'receptionist') setReceptionistTab('settings');
                }}
                className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-[11px] cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all border border-white/20"
              >
                {view === 'app' && currentUser.name.split(' ').map(n => n[0]).join('')}
                {view === 'doctor' && 'IP'}
                {view === 'receptionist' && 'SC'}
              </div>
            </div>
          </div>

          {/* Row 2: Current Date | Clinic Status | Live Sync Indicator */}
          <div className="flex items-center justify-between mt-2.5 px-0.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 border-t border-slate-100/60 dark:border-slate-800/50 pt-2 gap-2">
            <span suppressHydrationWarning className="truncate">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[9.5px]">
                <span className={cn("w-1.5 h-1.5 rounded-full", {
                  "bg-emerald-500": view === 'app' || (view === 'doctor' && doctorStatus === 'Available') || (view === 'receptionist' && receptionistAutoSimulate),
                  "bg-amber-500": view === 'doctor' && doctorStatus === 'Busy',
                  "bg-indigo-500": view === 'doctor' && doctorStatus === 'On Break',
                  "bg-slate-450": (view === 'doctor' && doctorStatus === 'Offline') || (view === 'receptionist' && !receptionistAutoSimulate)
                })} />
                {view === 'app' && 'Clinic Open'}
                {view === 'doctor' && doctorStatus}
                {view === 'receptionist' && (receptionistAutoSimulate ? 'Sim Active' : 'Sim Paused')}
              </span>
              <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-500 px-1.5 py-0.5 rounded-md text-[9px] uppercase font-black tracking-widest border border-emerald-100/35 dark:border-emerald-900/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Sync
              </span>
            </div>
          </div>

          {/* Row 3: Responsive Segmented Tabs */}
          <div className="mt-3 flex p-1 bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-xl overflow-x-auto scrollbar-none flex-nowrap whitespace-nowrap">
            {[
              { id: 'app', label: 'Patient app' },
              { id: 'receptionist', label: 'Receptionist desk' },
              { id: 'doctor', label: 'Doctor desk' }
            ].map((role) => {
              const isActive = view === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    if (role.id === 'app') {
                      setView('app');
                      setPatientTab('home');
                    } else {
                      setView(role.id as any);
                    }
                  }}
                  className={cn(
                    "flex-1 text-center text-clamp-small font-bold py-1.5 px-3 rounded-lg transition-all duration-200 focus:outline-none whitespace-nowrap",
                    {
                      "gradient-primary text-white shadow-xs": isActive,
                      "text-slate-500 hover:text-slate-800 dark:hover:text-slate-205": !isActive
                    }
                  )}
                >
                  {role.label}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* --- LIFTED DESKTOP VIEW: RECEPTIONIST OPERATING CONSOLE DASHBOARD --- */}
      {view === 'receptionist' && (
        <div className="flex-1 flex bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen overflow-hidden font-sans relative">
          
          {/* Sidebar */}
          <aside className={cn(
            "w-64 bg-white dark:bg-slate-900 border-r border-slate-150 dark:border-slate-800 flex flex-col justify-between p-6 z-20 shrink-0",
            "fixed inset-y-0 left-0 transform -translate-x-full lg:translate-x-0 lg:relative transition-transform duration-300 ease-in-out",
            {
              "translate-x-0": receptionistSidebarOpen
            }
          )}>
            <div className="flex flex-col gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0F8B8D] flex items-center justify-center text-white shadow-sm">
                  <Stethoscope className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h1 className="font-heading font-black text-base leading-none">Dermavita</h1>
                  <span className="text-[9px] font-bold text-brand uppercase tracking-widest block mt-1">RECEPTION DESK</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-1.5">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Compass },
                  { id: 'appointments', label: 'Appointments', icon: Calendar },
                  { id: 'queue', label: 'Live Queue', icon: Activity },
                  { id: 'patients', label: 'Patients Database', icon: Users },
                  { id: 'doctors', label: 'Doctors Status', icon: Stethoscope },
                  { id: 'reports', label: 'Operations Audit', icon: FileText },
                  { id: 'settings', label: 'Desk Settings', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = receptionistTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setReceptionistTab(item.id as any); setReceptionistSidebarOpen(false); }}
                      className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-200 border border-transparent focus:outline-none", {
                        "bg-[#0F8B8D]/10 text-[#0F8B8D] dark:bg-[#0F8B8D]/20": isActive,
                        "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850": !isActive
                      })}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0F8B8D]/10 dark:bg-[#0F8B8D]/20 text-[#0F8B8D] flex items-center justify-center font-bold text-xs uppercase">
                  SC
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-none">Sarah Connor</h4>
                  <span className="text-[9.5px] text-slate-400 font-semibold block mt-1">Front Desk Officer</span>
                </div>
              </div>
              <div className="flex gap-1.5 p-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <button
                  onClick={() => { setView('app'); setPatientTab('home'); setReceptionistSidebarOpen(false); }}
                  className="flex-1 text-[9.5px] font-bold py-2 rounded-xl text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 hover:shadow-xs transition-all text-center focus:outline-none"
                >
                  Patient App
                </button>
                <button
                  onClick={() => { setView('doctor'); setReceptionistSidebarOpen(false); }}
                  className="flex-1 text-[9.5px] font-bold py-2 rounded-xl text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 hover:shadow-xs transition-all text-center focus:outline-none"
                >
                  Doctor Desk
                </button>
              </div>
            </div>
          </aside>

          {receptionistSidebarOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-15 lg:hidden"
              onClick={() => setReceptionistSidebarOpen(false)}
            />
          )}

          {/* Main Area */}
          <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
            {/* Header */}
            <header className="hidden lg:flex h-18 bg-white dark:bg-slate-900 border-b border-slate-150/80 dark:border-slate-800 px-4 md:px-8 justify-between items-center z-10 gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setReceptionistSidebarOpen(true)}
                  className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
                >
                  <Menu className="w-5.5 h-5.5" />
                </button>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block" suppressHydrationWarning>Friday, July 17, 2026</span>
                  <h2 className="text-[17px] font-heading font-black text-slate-800 dark:text-slate-100 mt-0.5 leading-none">Dermavita Console</h2>
                </div>
              </div>

              {/* Header Right */}
              <div className="flex items-center gap-4">
                {/* Auto simulation badge */}
                <div className="flex items-center gap-2 border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-1.5 rounded-2xl shadow-xs">
                  <span className="relative flex h-2 w-2">
                    {receptionistAutoSimulate && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span className={cn("relative inline-flex rounded-full h-2 w-2", {
                      "bg-emerald-500": receptionistAutoSimulate,
                      "bg-amber-500": !receptionistAutoSimulate
                    })}></span>
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:inline">
                    {receptionistAutoSimulate ? 'Simulation Active' : 'Simulation Paused'}
                  </span>
                  <button 
                    onClick={() => setReceptionistAutoSimulate(!receptionistAutoSimulate)}
                    className="text-[9.5px] bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 px-2 py-0.5 rounded-lg font-bold ml-0.5 sm:ml-2 transition-colors focus:outline-none"
                  >
                    {receptionistAutoSimulate ? 'Pause' : 'Resume'}
                  </button>
                </div>

                {/* Notifications bell */}
                <button 
                  onClick={() => setShowNotificationOverlay(true)}
                  className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all shadow-xs border border-slate-100 dark:border-slate-800 focus:outline-none"
                >
                  <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </button>
              </div>
            </header>

            {/* Dashboard Content Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 relative">
              {/* Large Desktop Background Branding Watermark */}
              <div className="hidden lg:block absolute right-8 bottom-6 text-[110px] font-heading font-black text-slate-200/25 dark:text-slate-800/10 pointer-events-none select-none z-0 tracking-tighter transition-colors">
                Dermavita
              </div>
              
              {/* --- DASHBOARD TAB CONTENT --- */}
              {receptionistTab === 'dashboard' && (
                <div className="flex flex-col gap-8">
                  {/* Summary Metric Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    
                    {/* Metrics */}
                    {[
                      { 
                        title: "Today's Bookings", 
                        value: appointments.filter(a => a.date === getDateOffset(0)).length, 
                        trend: "+15.2% vs avg", 
                        icon: Calendar, 
                        bg: "bg-[#0F8B8D]/10 text-[#0F8B8D]",
                        desc: "Including walk-in slots"
                      },
                      { 
                        title: "Active Waiting", 
                        value: appointments.filter(a => a.date === getDateOffset(0) && a.status === 'Waiting').length, 
                        trend: `${appointments.filter(a => a.date === getDateOffset(0) && a.status === 'Now Serving').length} being served`, 
                        icon: Clock, 
                        bg: "bg-amber-100/70 text-amber-600 dark:bg-amber-900/10 dark:text-amber-500",
                        desc: "Checked-in list lineup"
                      },
                      { 
                        title: "Completed", 
                        value: appointments.filter(a => a.date === getDateOffset(0) && a.status === 'Completed').length, 
                        trend: `${appointments.filter(a => a.date === getDateOffset(0) && a.status === 'Cancelled').length} cancelled today`, 
                        icon: CheckCircle2, 
                        bg: "bg-emerald-100/70 text-emerald-600 dark:bg-emerald-900/10 dark:text-emerald-500",
                        desc: "Consultations finished"
                      },
                      { 
                        title: "Revenue Today", 
                        value: `₹${appointments.filter(a => a.date === getDateOffset(0) && a.payment?.status === 'Paid').reduce((sum, a) => sum + (a.payment?.amount || 0), 0)}`, 
                        trend: "Collected at desk", 
                        icon: CreditCard, 
                        bg: "bg-indigo-100/70 text-indigo-600 dark:bg-indigo-900/10 dark:text-indigo-500",
                        desc: "Card & UPI checkouts"
                      }
                    ].map((card, idx) => {
                      const Icon = card.icon;
                      return (
                        <Card key={idx} variant="elevated" className="p-3.5 sm:p-5 border border-slate-150/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center gap-2.5 sm:gap-4.5 theme-transition">
                          <div className={cn("w-9.5 h-9.5 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0", card.bg)}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] sm:text-[10px] text-slate-400 block uppercase font-bold tracking-wider truncate">{card.title}</span>
                            <span className="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-heading block mt-0.5 leading-none">{card.value}</span>
                            <span className="text-[8.5px] sm:text-[9.5px] text-slate-400 dark:text-slate-550 block font-semibold mt-1.5 truncate">{card.trend} • <span className="text-slate-450 dark:text-slate-500">{card.desc}</span></span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Mid Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Live queue monitor list */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live Desk 1 Queue timeline (Dr. Irfana)</h3>
                        <Badge variant="success" size="xs" dot>Live Sync</Badge>
                      </div>

                      <Card variant="elevated" className="p-6 border border-slate-150/80 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-6">
                        <div className="grid grid-cols-3 gap-4 text-center border-b pb-5 border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Serving Now</span>
                            <span className="text-2xl font-black text-brand font-heading mt-1.5 block">
                              {getDoctorQueueDetails('doc-1').currentToken}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Patients Waiting</span>
                            <span className="text-2xl font-black text-slate-700 dark:text-slate-200 font-heading mt-1.5 block">
                              {getDoctorQueueDetails('doc-1').timeline.filter(t => t.status === 'waiting').length}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Estimated Wait</span>
                            <span className="text-2xl font-black text-slate-700 dark:text-slate-200 font-heading mt-1.5 block">
                              {getDoctorQueueDetails('doc-1').timeline.filter(t => t.status === 'waiting').length * 10} mins
                            </span>
                          </div>
                        </div>

                        {/* Interactive lineup scroll */}
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Queue Timeline Lineup</span>
                          <div className="flex items-center gap-3.5 overflow-x-auto py-2 scrollbar-none">
                            {(() => {
                              const details = getDoctorQueueDetails('doc-1');
                              const activeServing = appointments.find(a => a.doctorId === 'doc-1' && a.date === getDateOffset(0) && a.status === 'Now Serving');
                              
                              return (
                                <>
                                  {activeServing ? (
                                    <div className="flex-shrink-0 bg-primary/10 border-2 border-primary/40 p-3.5 rounded-2xl flex items-center gap-3.5">
                                      <div className="w-9.5 h-9.5 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-sm uppercase">
                                        {activeServing.patientName[0]}
                                      </div>
                                      <div className="text-left min-w-[90px] max-w-[145px]">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <strong className="text-xs text-brand font-extrabold break-words whitespace-normal leading-tight block">{activeServing.patientName}</strong>
                                          <Badge variant="primary" size="xs" className="shrink-0">Serving</Badge>
                                        </div>
                                        <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">Token: {activeServing.token}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5 rounded-xl">No active patient currently</span>
                                  )}

                                  {details.timeline.filter(t => t.status === 'waiting').length > 0 && (
                                    <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                  )}

                                  {details.timeline.filter(t => t.status === 'waiting').map((item, idx) => (
                                    <div 
                                      key={idx} 
                                      onClick={() => {
                                        const p = MOCK_PATIENTS.find(pt => pt.id === item.patientId) || MOCK_PATIENTS[0];
                                        setSelectedPatientForDrawer(p);
                                      }}
                                      className="flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 p-3.5 rounded-2xl flex items-center gap-3.5 cursor-pointer transition-all shadow-xs"
                                    >
                                      <div className="w-9.5 h-9.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm uppercase">
                                        {item.patientName[0]}
                                      </div>
                                      <div className="text-left min-w-[90px] max-w-[145px]">
                                        <strong className="text-xs text-slate-800 dark:text-slate-100 font-extrabold break-words whitespace-normal leading-tight block">{item.patientName}</strong>
                                        <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">Token: {item.token} • Wait ~{idx * 10}m</span>
                                      </div>
                                    </div>
                                  ))}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </Card>

                      {/* Log Console */}
                      <div className="flex justify-between items-center mt-2">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Real-time Desk Log Feed</h3>
                        <button onClick={() => setReceptionistActivityLog(["Initialised desk at 09:00 AM", "Verified live queue connectivity"])} className="text-[10px] text-[#0F8B8D] font-bold hover:underline focus:outline-none">Clear logs</button>
                      </div>
                      <Card className="p-5 bg-slate-900 border-none rounded-2xl font-mono text-[11.5px] text-emerald-400 max-h-56 overflow-y-auto flex flex-col gap-2 shadow-inner">
                        {receptionistActivityLog.map((log, idx) => (
                          <div key={idx} className="flex gap-2.5">
                            <span className="text-emerald-600 font-semibold select-none">&gt;</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </Card>
                    </div>

                    {/* Right column: Quick actions and Doctors Status */}
                    <div className="flex flex-col gap-6">
                      
                      {/* Desk Quick Actions */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Quick Desk Actions</h3>
                        <Card variant="elevated" className="p-5 border border-slate-150/70 bg-white dark:bg-slate-905 shadow-sm flex flex-col gap-3">
                          <Button onClick={() => setReceptionistBookingOpen(true)} className="w-full justify-start rounded-2xl h-12 text-xs font-bold font-sans">
                            <Plus className="w-5 h-5 mr-2" /> Book New Appointment
                          </Button>
                          <Button onClick={() => setReceptionistShowWalkinModal(true)} variant="secondary" className="w-full justify-start rounded-2xl h-12 text-xs font-bold font-sans">
                            <UserPlus className="w-5 h-5 mr-2" /> Register Walk-In Patient
                          </Button>

                          <div className="grid grid-cols-2 gap-3 mt-1">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                handleDoctorCallNext();
                                alert("Called next queue patient.");
                              }}
                              className="h-11 rounded-2xl text-[11px] font-bold border-slate-200/80 hover:bg-slate-50 dark:border-slate-800"
                            >
                              Call Next
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setAppointments(prev => prev.map(a => a.status === 'Waiting' ? { ...a, status: 'Completed' as const } : a));
                                alert("Simulation: Completed all serving patients.");
                              }}
                              className="h-11 rounded-2xl text-[11px] font-bold border-slate-200/80 hover:bg-slate-50 dark:border-slate-800"
                            >
                              Flush Serving
                            </Button>
                          </div>

                          <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 flex flex-col gap-2.5">
                            <button onClick={() => alert("Printing active queue ticket...")} className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 text-[11.5px] font-bold text-slate-600 dark:text-slate-400 transition-colors">
                              <span className="flex items-center gap-2"><Printer className="w-4.5 h-4.5 text-slate-400" /> Print Token Receipt</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            <button onClick={() => alert("Activating QR Ticket scanner...")} className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 text-[11.5px] font-bold text-slate-600 dark:text-slate-400 transition-colors">
                              <span className="flex items-center gap-2"><QrCode className="w-4.5 h-4.5 text-slate-400" /> Scan QR Check-in</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                          </div>
                        </Card>
                      </div>

                      {/* Doctor live status list */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Doctor Desk Status</h3>
                        <Card variant="elevated" className="p-4 border border-slate-150/70 bg-white dark:bg-slate-905 shadow-sm flex flex-col gap-3">
                          {doctors.slice(0, 4).map((doc) => {
                            const q = getDoctorQueueDetails(doc.id);
                            return (
                              <div key={doc.id} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0 border-slate-100 dark:border-slate-800 text-xs">
                                <div>
                                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100">{doc.name}</h4>
                                  <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Room: {doc.id === 'doc-1' ? 'Room 01' : doc.id === 'doc-2' ? 'Room 02' : doc.id === 'doc-3' ? 'Room 03' : 'Room 04'}</span>
                                </div>
                                <div className="text-right">
                                  <Badge 
                                    variant={doc.id === 'doc-1' ? (doctorBreakActive ? 'warning' : 'success') : 'neutral'} 
                                    size="xs"
                                    dot
                                  >
                                    {doc.id === 'doc-1' ? (doctorBreakActive ? 'Break' : 'Busy') : 'Available'}
                                  </Badge>
                                  <span className="text-[10px] text-slate-400 block font-bold mt-1">Wait: {q.timeline.filter(t => t.status === 'waiting').length * 10}m</span>
                                </div>
                              </div>
                            );
                          })}
                        </Card>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* --- APPOINTMENTS TAB CONTENT --- */}
              {receptionistTab === 'appointments' && (
                <div className="flex flex-col gap-6">
                  
                  {/* Tab Selector & Search bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                      {[
                        { id: 'today', label: "Today's Queue" },
                        { id: 'upcoming', label: "Upcoming" },
                        { id: 'completed', label: "Completed" },
                        { id: 'cancelled', label: "Cancelled" },
                        { id: 'rescheduled', label: "Rescheduled" }
                      ].map((subTab) => (
                        <button
                          key={subTab.id}
                          onClick={() => setReceptionistApptSubTab(subTab.id as any)}
                          className={cn("px-3 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none", {
                            "bg-primary-50 dark:bg-primary-950/20 text-[#0F8B8D]": receptionistApptSubTab === subTab.id,
                            "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200": receptionistApptSubTab !== subTab.id
                          })}
                        >
                          {subTab.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative flex items-center w-full lg:w-72">
                      <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search patient name..."
                        value={receptionistSearch}
                        onChange={(e) => setReceptionistSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  {/* List Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {appointments
                      .filter((appt) => {
                        const todayStr = getDateOffset(0);
                        const matchesSearch = appt.patientName.toLowerCase().includes(receptionistSearch.toLowerCase());
                        
                        if (receptionistApptSubTab === 'today') {
                          return appt.date === todayStr && matchesSearch;
                        } else if (receptionistApptSubTab === 'upcoming') {
                          return appt.date > todayStr && appt.status === 'Upcoming' && matchesSearch;
                        } else if (receptionistApptSubTab === 'completed') {
                          return appt.status === 'Completed' && matchesSearch;
                        } else if (receptionistApptSubTab === 'cancelled') {
                          return appt.status === 'Cancelled' && matchesSearch;
                        } else {
                          return (appt.rescheduleHistory && appt.rescheduleHistory.length > 0) && matchesSearch;
                        }
                      })
                      .map((appt) => {
                        const initials = appt.patientName.split(' ').map(n => n[0]).join('');
                        return (
                          <Card key={appt.id} variant="elevated" className="p-4.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-3.5 text-xs shadow-xs theme-transition">
                            
                            {/* Row 1: Avatar, Name, Token */}
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-450 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <strong className="text-slate-800 dark:text-slate-105 font-extrabold text-[13.5px] block break-words whitespace-normal leading-tight">{appt.patientName}</strong>
                                  <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium block mt-0.5">{appt.date} • {appt.time}</span>
                                </div>
                              </div>
                              <span className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-lg font-bold border border-slate-200/40 dark:border-slate-700/60 shrink-0">{appt.token}</span>
                            </div>

                            {/* Row 2: Doctor and Status info */}
                            <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-800/40 pt-2.5">
                              <div>
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Assigned Doctor</span>
                                <span className="text-[#0F8B8D] font-bold block mt-0.5">{appt.doctorName}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Status</span>
                                <Badge
                                  variant={appt.status === 'Completed' ? 'success' : appt.status === 'Cancelled' ? 'error' : appt.status === 'Waiting' ? 'warning' : appt.status === 'Now Serving' ? 'primary' : 'neutral'}
                                  size="xs"
                                  dot
                                  className="mt-0.5"
                                >
                                  {appt.status}
                                </Badge>
                              </div>
                            </div>

                            {/* Row 3: Action Buttons */}
                            <div className="flex flex-wrap gap-2 border-t border-slate-50 dark:border-slate-800/40 pt-2.5 justify-end">
                              {appt.status === 'Upcoming' && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-8.5 rounded-xl text-[10.5px] px-3 font-bold flex-1 sm:flex-initial"
                                  onClick={() => {
                                    handleReceptionistCheckin(appt.id);
                                    alert(`Patient ${appt.patientName} checked in successfully!`);
                                  }}
                                >
                                  Check In
                                </Button>
                              )}

                              {(appt.status === 'Waiting' || appt.status === 'Upcoming') && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8.5 rounded-xl text-[10.5px] px-3 border-slate-250 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 flex-1 sm:flex-initial"
                                  onClick={() => triggerReschedule(appt)}
                                >
                                  Reschedule
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8.5 w-8.5 p-0 rounded-xl border-slate-205 dark:border-slate-800 shrink-0"
                                onClick={() => {
                                  const pt = MOCK_PATIENTS.find(p => p.id === appt.patientId) || MOCK_PATIENTS[0];
                                  setSelectedPatientForDrawer(pt);
                                }}
                              >
                                <User className="w-4 h-4 text-slate-400" />
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* --- LIVE QUEUE TAB --- */}
              {receptionistTab === 'queue' && (
                <div className="flex flex-col gap-6">
                  
                  {/* Selector for doctor queue */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select Doctor Queue</h3>
                    <select
                      value={selectedQueueDoctorId}
                      onChange={(e) => setSelectedQueueDoctorId(e.target.value)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-xs focus:outline-none font-bold text-slate-700 dark:text-slate-200 shadow-xs"
                    >
                      {doctors.slice(0, 4).map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                  </div>

                  {/* Visual Queue Monitor Details */}
                  {(() => {
                    const doc = doctors.find(d => d.id === selectedQueueDoctorId) || doctors[0];
                    const q = getDoctorQueueDetails(doc.id);
                    const servingAppt = appointments.find(a => a.doctorId === doc.id && a.date === getDateOffset(0) && a.status === 'Now Serving');
                    
                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Queue list */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                          <Card variant="elevated" className="p-6 border border-slate-150/70 bg-white dark:bg-slate-900 shadow-sm">
                            <h4 className="font-heading font-extrabold text-sm mb-4">Patient line lineup ({q.timeline.length} patients)</h4>
                            
                            <div className="flex flex-col gap-3">
                              {/* Serving Now Item */}
                              {servingAppt ? (
                                <div className="bg-primary/5 dark:bg-primary-955/10 border-2 border-primary/20 p-4 rounded-2xl flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm uppercase">
                                      {servingAppt.patientName[0]}
                                    </div>
                                    <div className="text-left">
                                      <div className="flex items-center gap-1.5">
                                        <h5 className="font-extrabold text-xs text-brand">{servingAppt.patientName}</h5>
                                        <Badge variant="primary" size="xs">Serving</Badge>
                                      </div>
                                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Token: {servingAppt.token} • Consultation Ongoing</span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-200 dark:border-slate-800 text-[10.5px] rounded-xl font-bold h-8.5"
                                    onClick={() => {
                                      setAppointments(prev => prev.map(a => a.id === servingAppt.id ? { ...a, status: 'Completed' as const } : a));
                                      alert("Consultation completed!");
                                    }}
                                  >
                                    Finish
                                  </Button>
                                </div>
                              ) : (
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-center text-xs text-slate-500 font-semibold border border-dashed border-slate-200 dark:border-slate-800">
                                  No patient is currently being served in this room.
                                </div>
                              )}

                              {/* Divider */}
                              <div className="border-t border-slate-105 dark:border-slate-800 my-2"></div>

                              {/* Waiting Timeline Items */}
                              {q.timeline.filter(t => t.status === 'waiting').length > 0 ? (
                                <div className="flex flex-col gap-2.5">
                                  {q.timeline.filter(t => t.status === 'waiting').map((item, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-3.5 rounded-2xl flex justify-between items-center hover:border-slate-400 dark:hover:border-slate-700 transition-all">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8.5 h-8.5 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-355 uppercase">
                                          {item.patientName[0]}
                                        </div>
                                        <div>
                                          <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">{item.patientName}</h5>
                                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Token: {item.token} • Wait ~{idx * 10} mins</span>
                                        </div>
                                      </div>

                                      <Badge variant="neutral" size="xs">Waiting</Badge>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-4 text-xs text-slate-500 font-semibold">
                                  No patients in waiting line.
                                </div>
                              )}
                            </div>
                          </Card>
                        </div>

                        {/* Doctor room details */}
                        <div className="flex flex-col gap-4">
                          <Card variant="elevated" className="p-5 border border-slate-150/70 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-4">
                            <h4 className="font-heading font-extrabold text-sm">Consultation Room Details</h4>
                            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                              <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                                {doc.name[4]}
                              </div>
                              <div>
                                <h5 className="font-bold text-xs">{doc.name}</h5>
                                <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">{doc.specialty}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 text-xs">
                              <div className="flex justify-between border-b pb-2.5 border-slate-100 dark:border-slate-800 text-slate-500 font-semibold">
                                <span>Clinic timings:</span>
                                <span className="font-bold text-slate-750 dark:text-slate-255 text-right">{doc.clinicTimings}</span>
                              </div>
                              <div className="flex justify-between pt-1 text-slate-500 font-semibold">
                                <span>Estimated delay:</span>
                                <span className="font-bold text-[#0F8B8D]">{q.timeline.filter(t => t.status === 'waiting').length * 10} mins</span>
                              </div>
                            </div>
                            
                            <Button 
                              onClick={() => {
                                handleDoctorCallNext();
                                alert(`Called next token for ${doc.name}`);
                              }}
                              className="w-full rounded-2xl h-11 text-xs font-bold font-sans mt-2"
                            >
                              Call Next in Room
                            </Button>
                          </Card>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* --- PATIENTS DATABASE TAB --- */}
              {receptionistTab === 'patients' && (
                <div className="flex flex-col gap-6">
                  
                  {/* Search and database summary */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Clinic Patient Directory</h3>
                      <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">Showing registered users</span>
                    </div>

                    <div className="relative flex items-center w-full lg:w-72">
                      <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by name, ID, or phone..."
                        value={receptionistSearch}
                        onChange={(e) => setReceptionistSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-primary bg-white dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Patients grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_PATIENTS
                      .filter(p => p.name.toLowerCase().includes(receptionistSearch.toLowerCase()) || p.phone.includes(receptionistSearch))
                      .slice(0, 18)
                      .map((p) => (
                        <Card 
                          key={p.id} 
                          onClick={() => setSelectedPatientForDrawer(p)}
                          className="p-5 border border-slate-150/70 bg-white dark:bg-slate-900 rounded-2xl flex items-center gap-4 hover:border-slate-400 dark:hover:border-slate-600 cursor-pointer shadow-xs transition-all animate-fade-in"
                        >
                          <div className="w-11 h-11 rounded-xl bg-[#0F8B8D]/10 text-[#0F8B8D] flex items-center justify-center font-bold text-sm uppercase">
                            {p.name[0]}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-none">{p.name}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{p.phone}</span>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="neutral" size="xs">Blood: {p.bloodGroup}</Badge>
                              {p.allergies.length > 0 && <Badge variant="error" size="xs">Allergies</Badge>}
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* --- DOCTORS TAB --- */}
              {receptionistTab === 'doctors' && (
                <div className="flex flex-col gap-6">
                  
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Medical Team Roster</h3>
                    <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">Live duty status</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.slice(0, 5).map((doc) => {
                      const q = getDoctorQueueDetails(doc.id);
                      return (
                        <Card key={doc.id} variant="elevated" className="p-5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 shadow-xs flex flex-col gap-4 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm">
                              {doc.name[4]}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-800 dark:text-slate-150 text-sm leading-none">{doc.name}</h4>
                              <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{doc.specialty} • exp {doc.experience}y</span>
                            </div>
                          </div>

                          <div className="border-t border-b py-3 border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                            <div className="flex justify-between font-semibold text-slate-500">
                              <span>Consult Room:</span>
                              <strong className="text-slate-750 dark:text-slate-200">Room {doc.id === 'doc-1' ? 'Room 01' : doc.id === 'doc-2' ? 'Room 02' : doc.id === 'doc-3' ? 'Room 03' : 'Room 04'}</strong>
                            </div>
                            <div className="flex justify-between font-semibold text-slate-500">
                              <span>Active Token:</span>
                              <strong className="text-brand">{q.currentToken}</strong>
                            </div>
                            <div className="flex justify-between font-semibold text-slate-500">
                              <span>Wait List Length:</span>
                              <strong className="text-slate-750 dark:text-slate-200">{q.timeline.filter(t => t.status === 'waiting').length} patients</strong>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[10.5px] text-slate-400 font-bold uppercase">Room State</span>
                            <Badge 
                              variant={doc.id === 'doc-1' ? (doctorBreakActive ? 'warning' : 'success') : 'neutral'} 
                              size="xs"
                              dot
                            >
                              {doc.id === 'doc-1' ? (doctorBreakActive ? 'Break' : 'Busy') : 'Available'}
                            </Badge>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* --- AUDIT/REPORTS ANALYTICS TAB --- */}
              {receptionistTab === 'reports' && (
                <div className="flex flex-col gap-6">
                  
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Clinic Operations Audit</h3>
                    <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">Summary of throughput performance metrics</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Performance Widget */}
                    <Card variant="elevated" className="p-5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 shadow-xs text-xs flex flex-col gap-4">
                      <h4 className="font-heading font-extrabold text-sm">Channel Distribution</h4>
                      
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="flex justify-between font-bold mb-1">
                            <span>Online Patient App Bookings</span>
                            <span>64%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#0F8B8D] h-full rounded-full" style={{ width: '64%' }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-bold mb-1">
                            <span>Desk Walk-in Registrations</span>
                            <span>36%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-secondary h-full rounded-full" style={{ width: '36%' }}></div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Operational performance speed */}
                    <Card variant="elevated" className="p-5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 shadow-xs text-xs flex flex-col gap-4">
                      <h4 className="font-heading font-extrabold text-sm">Service Level Metrics</h4>
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800 font-semibold text-slate-500">
                          <span>Average Wait Time:</span>
                          <strong className="text-slate-800 dark:text-slate-100">12.5 minutes</strong>
                        </div>
                        <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800 font-semibold text-slate-500">
                          <span>Completion Rate:</span>
                          <strong className="text-emerald-500">92.4%</strong>
                        </div>
                        <div className="flex justify-between font-semibold text-slate-500">
                          <span>Average consult time:</span>
                          <strong className="text-slate-800 dark:text-slate-100">9.2 mins/room</strong>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* --- SETTINGS TAB --- */}
              {receptionistTab === 'settings' && (
                <div className="flex flex-col gap-6">
                  
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Desk Settings</h3>
                    <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">Control preferences for receptionist environment</span>
                  </div>

                  <Card variant="elevated" className="p-5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 shadow-xs text-xs flex flex-col gap-4 max-w-md">
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-[13px] leading-none">Auto-Simulate Live Queue</h4>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1">Generates clinic activity automatically</span>
                      </div>
                      <button onClick={() => setReceptionistAutoSimulate(!receptionistAutoSimulate)} className="text-[#0F8B8D] focus:outline-none">
                        {receptionistAutoSimulate ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-slate-400" />}
                      </button>
                    </div>

                    <div className="flex justify-between items-center border-t pt-4 border-slate-100 dark:border-slate-800">
                      <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-[13px] leading-none">Dark Mode Settings</h4>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-1">Toggle dark UI theme</span>
                      </div>
                      <button onClick={() => setDarkMode(!darkMode)} className="text-[#0F8B8D] focus:outline-none">
                        {darkMode ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-slate-400" />}
                      </button>
                    </div>
                  </Card>
                </div>
              )}
              
            </div>
          </main>

          {/* Patient Details Drawer overlay */}
          {selectedPatientForDrawer && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex justify-end">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl p-6 relative flex flex-col gap-5 text-xs overflow-y-auto"
              >
                <button 
                  onClick={() => setSelectedPatientForDrawer(null)}
                  className="absolute top-4.5 right-4.5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-[#0F8B8D]/10 text-[#0F8B8D] flex items-center justify-center font-bold text-xl uppercase">
                    {selectedPatientForDrawer.name[0]}
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-[16px] text-slate-800 dark:text-slate-100 leading-none">{selectedPatientForDrawer.name}</h3>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">{selectedPatientForDrawer.phone}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block">{selectedPatientForDrawer.email}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-[11px] text-slate-400 uppercase tracking-widest">Medical Summary</h4>
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Blood Group</span>
                      <strong className="text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{selectedPatientForDrawer.bloodGroup}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Emergency Dial</span>
                      <strong className="text-slate-800 dark:text-slate-200 text-sm mt-0.5 block truncate">{selectedPatientForDrawer.emergencyContact.name} ({selectedPatientForDrawer.emergencyContact.relation})</strong>
                    </div>
                  </div>

                  {selectedPatientForDrawer.allergies && selectedPatientForDrawer.allergies.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Allergies List</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPatientForDrawer.allergies.map(a => <Badge key={a} variant="error" size="xs" dot className="font-bold">{a}</Badge>)}
                      </div>
                    </div>
                  )}

                  {selectedPatientForDrawer.medicalConditions && selectedPatientForDrawer.medicalConditions.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Pre-existing Conditions</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPatientForDrawer.medicalConditions.map(c => <Badge key={c} variant="neutral" size="xs" className="font-bold">{c}</Badge>)}
                      </div>
                    </div>
                  )}

                  {/* Vitals */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Vitals Status Checklist</span>
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-center">
                      <div>
                        <span className="text-[8px] text-slate-400 block font-bold">BP</span>
                        <strong className="text-slate-700 dark:text-slate-200 text-xs">{selectedPatientForDrawer.vitals.bloodPressure}</strong>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block font-bold">Heart Rate</span>
                        <strong className="text-slate-700 dark:text-slate-200 text-xs">{selectedPatientForDrawer.vitals.heartRate} bpm</strong>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 block font-bold">Pulse</span>
                        <strong className="text-slate-700 dark:text-slate-200 text-xs">{selectedPatientForDrawer.vitals.pulse}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Previous Appointments logs */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">Previous Consultation Visits</span>
                    <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1 scrollbar-none">
                      {appointments
                        .filter(a => a.patientId === selectedPatientForDrawer.id)
                        .map((appt, i) => (
                          <div key={i} className="bg-slate-50/70 dark:bg-slate-950/70 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 flex justify-between items-center">
                            <div>
                              <strong className="text-xs text-slate-700 dark:text-slate-200 block">{appt.doctorName}</strong>
                              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{appt.date} • {appt.time}</span>
                            </div>
                            <Badge variant={appt.status === 'Completed' ? 'success' : appt.status === 'Cancelled' ? 'error' : 'neutral'} size="xs">{appt.status}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Booking Screen dialog overlay */}
          {receptionistBookingOpen && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-fade-in">
              <Card variant="elevated" className="w-full max-w-md p-6 bg-white relative flex flex-col gap-4 text-xs shadow-premium rounded-3xl border border-slate-100 animate-scale-in">
                <button 
                  onClick={() => setReceptionistBookingOpen(false)}
                  className="absolute top-4.5 right-4.5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="font-heading font-extrabold text-base text-slate-800">Book Patient Appointment</h3>
                
                {receptionistBookSuccess ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center animate-scale-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-505 flex items-center justify-center shadow-inner">
                      <CheckCircle2 className="w-10 h-10 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-slate-800">Booking Generated Successfully!</h4>
                      <p className="text-[11.5px] text-slate-400 mt-1">Sequential queue token is assigned. Updating timeline...</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleReceptionistBookSubmit} className="flex flex-col gap-4 animate-scale-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="block text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Patient Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={receptionistBookPatientName}
                          onChange={(e) => setReceptionistBookPatientName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="block text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          value={receptionistBookPhone}
                          onChange={(e) => setReceptionistBookPhone(e.target.value)}
                          placeholder="Phone Number"
                          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="block text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Select Dermatologist</label>
                      <select 
                        value={receptionistBookDoctorId}
                        onChange={(e) => setReceptionistBookDoctorId(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-primary"
                      >
                        {doctors.slice(0, 5).map(doc => (
                          <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="block text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Appointment Date</label>
                        <input 
                          type="date" 
                          required
                          min={getDateOffset(0)}
                          value={receptionistBookDate}
                          onChange={(e) => setReceptionistBookDate(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="block text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Select Time Slot</label>
                        <select 
                          value={receptionistBookTime}
                          onChange={(e) => setReceptionistBookTime(e.target.value)}
                          className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-primary"
                        >
                          {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '05:00 PM', '06:00 PM'].map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="block text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">Reason for Visit</label>
                      <input 
                        type="text" 
                        value={receptionistBookReason}
                        onChange={(e) => setReceptionistBookReason(e.target.value)}
                        placeholder="E.g. Acne consulting, laser revision..."
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
                      />
                    </div>

                    <Button type="submit" className="w-full h-11 rounded-2xl text-xs font-bold font-sans mt-2">
                      Generate Appointment
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          )}

          {/* Walk-in Modal simulation overlay */}
          {receptionistShowWalkinModal && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-fade-in">
              <Card variant="elevated" className="w-full max-w-sm p-6 flex flex-col gap-4.5 relative bg-white border border-slate-100/80 shadow-premium rounded-3xl animate-scale-in">
                <button 
                  onClick={() => setReceptionistShowWalkinModal(false)}
                  className="absolute top-4.5 right-4.5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
                <h4 className="font-heading font-black text-base text-slate-800">Add Walk-In Patient</h4>
                <form onSubmit={handleReceptionistAddWalkin} className="flex flex-col gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wider text-[9px]">Patient Full Name</label>
                    <input 
                      type="text" 
                      value={receptionistWalkinName} 
                      onChange={(e) => setReceptionistWalkinName(e.target.value)} 
                      className="w-full p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all text-xs"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wider text-[9px]">Phone Number</label>
                    <input 
                      type="tel" 
                      value={receptionistWalkinPhone} 
                      onChange={(e) => setReceptionistWalkinPhone(e.target.value)} 
                      className="w-full p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all text-xs"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wider text-[9px]">Select Dermatologist</label>
                    <select 
                      value={receptionistWalkinDoctor} 
                      onChange={(e) => setReceptionistWalkinDoctor(e.target.value)} 
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:border-primary"
                    >
                      {doctors.slice(0, 5).map(d => <option key={d.id} value={d.id}>{d.name} ({d.clinicName})</option>)}
                    </select>
                  </div>
                  <Button type="submit" className="w-full h-11 rounded-2xl text-xs font-bold font-sans mt-2">Check-in Walk-in</Button>
                </form>
              </Card>
            </div>
          )}

        </div>
      )}

      {/* --- LIFTED DESKTOP VIEW: PREMIUM DOCTOR WORKSPACE --- */}
      {view === 'doctor' && (
        <div className="flex-1 flex bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen overflow-hidden font-sans relative">
          
          {/* Sidebar */}
          <aside className={cn(
            "w-64 bg-white dark:bg-slate-900 border-r border-slate-150 dark:border-slate-800 flex flex-col justify-between p-6 z-20 shrink-0",
            "fixed inset-y-0 left-0 transform -translate-x-full lg:translate-x-0 lg:relative transition-transform duration-300 ease-in-out",
            {
              "translate-x-0": doctorSidebarOpen
            }
          )}>
            <div className="flex flex-col gap-8">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0F8B8D] flex items-center justify-center text-white shadow-sm">
                  <Stethoscope className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h1 className="font-heading font-black text-base leading-none tracking-tight">BookMyDoc</h1>
                  <span className="text-[10px] text-[#0F8B8D] font-bold tracking-widest uppercase mt-0.5 block">Doctor Desk</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="flex flex-col gap-1">
                {[
                  { id: 'dashboard', label: 'Workspace', icon: Activity },
                  { id: 'patients', label: 'Patient Directory', icon: Users },
                  { id: 'consultations', label: 'Consultation History', icon: Clipboard },
                  { id: 'appointments', label: 'Appointments', icon: Calendar },
                  { id: 'availability', label: 'Duty Settings', icon: Clock },
                  { id: 'analytics', label: 'Desk Analytics', icon: TrendingUp },
                  { id: 'profile', label: 'Doctor Profile', icon: User }
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => { setDoctorTab(item.id as any); setDoctorSidebarOpen(false); }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 focus:outline-none",
                        {
                          "gradient-primary text-white shadow-md shadow-primary/10": doctorTab === item.id,
                          "text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50": doctorTab !== item.id
                        }
                      )}
                    >
                      <IconComp className="w-4.5 h-4.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer with Status Changer */}
            <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              {/* Doctor Details */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-light/50 border border-primary/20 flex items-center justify-center font-heading font-black text-sm text-[#0F8B8D]">
                  IP
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-tight">Dr. Irfana Patil</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Room 03 • Dermavita Clinic</span>
                </div>
              </div>

              {/* Status Select Toggle */}
              <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1.5">Duty Status</span>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { status: 'Available', color: 'bg-emerald-500' },
                    { status: 'Busy', color: 'bg-amber-500' },
                    { status: 'On Break', color: 'bg-indigo-500' },
                    { status: 'Offline', color: 'bg-slate-400' }
                  ].map((s) => (
                    <button
                      key={s.status}
                      onClick={() => setDoctorStatus(s.status as any)}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-[10px] font-bold border transition-all focus:outline-none justify-start",
                        {
                          "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs text-slate-700 dark:text-slate-100": doctorStatus === s.status,
                          "bg-transparent border-transparent text-slate-400 hover:text-slate-650": doctorStatus !== s.status
                        }
                      )}
                    >
                      <span className={cn("w-2 h-2 rounded-full", s.color)} />
                      <span>{s.status.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={() => { setView('auth'); setDoctorSidebarOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all focus:outline-none mt-1"
              >
                <LogOut className="w-4.5 h-4.5" />
                <span>Log Out Desk</span>
              </button>
            </div>
          </aside>

          {doctorSidebarOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-15 lg:hidden"
              onClick={() => setDoctorSidebarOpen(false)}
            />
          )}

          {/* Main workspace container */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="hidden lg:flex h-16 border-b border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 justify-between items-center px-4 md:px-8 z-10 gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDoctorSidebarOpen(true)}
                  className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
                >
                  <Menu className="w-5.5 h-5.5" />
                </button>
                <div className="flex items-center gap-3">
                  <h2 className="font-heading font-black text-base text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                    {doctorTab === 'dashboard' && 'Clinical Consultation Suite'}
                    {doctorTab === 'patients' && 'Patient Registry & Records'}
                    {doctorTab === 'consultations' && 'Historical Consultation Audits'}
                    {doctorTab === 'appointments' && 'Appointment Scheduler Queue'}
                    {doctorTab === 'availability' && 'Doctor Duty & Slots Scheduler'}
                    {doctorTab === 'analytics' && 'Operational Metrics Analytics'}
                    {doctorTab === 'profile' && 'Professional Profile Portfolio'}
                  </h2>
                  <Badge variant={doctorStatus === 'Available' ? 'success' : doctorStatus === 'Busy' ? 'warning' : 'neutral'} size="xs" dot>
                    {doctorStatus}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 font-bold hidden md:inline" suppressHydrationWarning>Room 03 • Dermavita Clinic • {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                
                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotificationOverlay(true)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors relative focus:outline-none border border-slate-100 dark:border-slate-800"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </header>

            {/* Scrollable Tab Workspaces */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-none bg-[#F8FAFC] dark:bg-slate-950 relative">
              {/* Large Desktop Background Branding Watermark */}
              <div className="hidden lg:block absolute right-8 bottom-6 text-[110px] font-heading font-black text-slate-200/25 dark:text-slate-800/10 pointer-events-none select-none z-0 tracking-tighter transition-colors">
                BookMyDoc
              </div>
              
              {/* TAB 1: WORKSPACE (DASHBOARD) */}
              {doctorTab === 'dashboard' && (
                <div className="flex flex-col gap-6 max-w-6.5xl mx-auto">
                  
                  {/* Today's Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Appointments Today', val: appointments.filter(a => a.doctorId === 'doc-1' && a.date === getDateOffset(0)).length, desc: 'Total queued bookings', color: 'text-brand' },
                      { label: 'Completed Consults', val: appointments.filter(a => a.doctorId === 'doc-1' && a.date === getDateOffset(0) && a.status === 'Completed').length, desc: 'Finished check-ups', color: 'text-info' },
                      { label: 'Waiting Patients', val: appointments.filter(a => a.doctorId === 'doc-1' && a.date === getDateOffset(0) && a.status === 'Waiting').length, desc: 'Awaiting duty call', color: 'text-warning' },
                      { label: 'Average Service Time', val: '12m', desc: 'Consultation speed rate', color: 'text-brand' }
                    ].map((stat, idx) => (
                      <Card key={idx} variant="elevated" className="p-3.5 sm:p-5 flex flex-col gap-1 theme-transition">
                        <span className="text-[9px] sm:text-[10px] text-muted font-bold uppercase tracking-wider block truncate">{stat.label}</span>
                        <div className="flex justify-between items-baseline mt-1 gap-1">
                          <span className={cn("text-xl sm:text-2xl font-black font-heading tracking-tight shrink-0", stat.color)}>{stat.val}</span>
                          <span className="text-[8px] sm:text-[9px] text-muted font-bold block truncate">{stat.desc}</span>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Main Grid: Left Workspace, Right Queue */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Column 1 & 2: Active Patient & Consult Notes */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      {doctorActivePatientId ? (
                        <Card variant="elevated" className="p-6 flex flex-col gap-6 theme-transition">
                          
                          {/* Patient ID Banner */}
                          <div className="flex justify-between items-start border-b pb-4.5 border-custom">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full bg-primary-light/50 border border-primary/20 flex items-center justify-center font-heading font-black text-xl text-brand">
                                {activeDocPatient.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-heading font-black text-[16px] text-primary">{activeDocPatient.name}</h3>
                                  <span className="text-[10px] bg-bg-custom text-secondary px-2 py-0.5 rounded-lg font-bold border border-custom">
                                    Token {appointments.find(a => a.patientId === activeDocPatient.id && a.date === getDateOffset(0))?.token || 'T-XX'}
                                  </span>
                                </div>
                                <span className="text-xs text-muted block mt-1">
                                  {activeDocPatient.vitals.height}cm • {activeDocPatient.vitals.weight}kg • {activeDocPatient.bloodGroup} Blood Group
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-xl text-xs font-bold"
                                onClick={() => setDoctorSelectedPatientId(activeDocPatient.id)}
                              >
                                <FileText className="w-4 h-4 mr-1.5 text-muted" /> Patient Medical File
                              </Button>
                            </div>
                          </div>

                          {/* Medical Alerts Banner */}
                          {(activeDocPatient.allergies.length > 0 && activeDocPatient.allergies[0] !== 'None') && (
                            <div className="bg-danger-subtle text-danger p-3.5 rounded-2xl border border-danger/15 text-xs flex items-center gap-3 font-semibold">
                              <ShieldAlert className="w-5 h-5 shrink-0" />
                              <div>
                                <span className="font-black">Allergy Alert:</span> Patient allergic to {activeDocPatient.allergies.join(', ')}. Exercise caution during prescribing.
                              </div>
                            </div>
                          )}

                          {/* Patient Vitals Quick Read Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { label: 'Blood Pressure', val: activeDocPatient.vitals.bloodPressure, desc: 'Normal range: 120/80', stat: 'Normal' },
                              { label: 'Pulse Rate', val: `${activeDocPatient.vitals.heartRate} bpm`, desc: 'Normal: 60-100', stat: 'Stable' },
                              { label: 'Sugar Level', val: `${activeDocPatient.vitals.sugarLevel} mg/dL`, desc: 'Fasting levels', stat: 'Ideal' },
                              { label: 'Health Score', val: `${activeDocPatient.vitals.healthScore}%`, desc: 'Overall index', stat: 'Good' }
                            ].map((vital, idx) => (
                              <div key={idx} className="bg-bg-custom border border-custom p-3 rounded-2xl text-xs">
                                <span className="text-[9px] text-muted block font-bold uppercase tracking-wider">{vital.label}</span>
                                <strong className="text-primary text-sm font-black mt-1 block leading-tight">{vital.val}</strong>
                                <span className="text-[9px] text-muted font-bold block mt-0.5">{vital.desc}</span>
                              </div>
                            ))}
                          </div>

                          {/* Chief Complaint / Consultation Reason */}
                          <div className="bg-bg-custom p-4 rounded-2xl border border-custom text-xs flex flex-col gap-1.5">
                            <span className="text-[9px] text-muted font-black uppercase tracking-wider">Chief Complaint / Diagnosis Reason</span>
                            <p className="text-secondary font-semibold leading-relaxed">
                              {appointments.find(a => a.patientId === activeDocPatient.id && a.date === getDateOffset(0))?.reason || 'Routine general dermatology screening and follow-up.'}
                            </p>
                          </div>

                          {/* Consultation Interactive Workspace Tabs */}
                          <div className="flex flex-col gap-4 mt-2">
                            {/* Tab Headers */}
                            <div className="flex border-b border-custom pb-1 scrollbar-none overflow-x-auto gap-2">
                              {[
                                { id: 'diagnosis', label: 'Diagnosis Notes', icon: Clipboard },
                                { id: 'prescription', label: 'Rx Prescription', icon: Pill },
                                { id: 'lab', label: 'Lab Orders Check', icon: Microscope },
                                { id: 'followup', label: 'Follow-up Details', icon: Calendar },
                                { id: 'certificate', label: 'Fitness Certificate', icon: FileText }
                              ].map((t) => {
                                const TabIcon = t.icon;
                                return (
                                  <button
                                    key={t.id}
                                    onClick={() => setDoctorConsultWorkspaceTab(t.id as any)}
                                    className={cn(
                                      "flex items-center gap-2 pb-2.5 px-3 text-[11px] font-bold transition-all border-b-2 -mb-[11px] focus:outline-none whitespace-nowrap",
                                      {
                                        "border-brand text-brand": doctorConsultWorkspaceTab === t.id,
                                        "border-transparent text-muted hover:text-secondary": doctorConsultWorkspaceTab !== t.id
                                      }
                                    )}
                                  >
                                    <TabIcon className="w-3.5 h-3.5" />
                                    <span>{t.label}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Tab Content 1: DIAGNOSIS */}
                            {doctorConsultWorkspaceTab === 'diagnosis' && (
                              <div className="flex flex-col gap-2 pt-2">
                                <label className="text-[10px] text-muted font-bold uppercase tracking-wider">Clinical Finding & Diagnosis Notes</label>
                                <textarea
                                  value={doctorConsultNotes}
                                  onChange={(e) => setDoctorConsultNotes(e.target.value)}
                                  placeholder="Document patient complaints, clinical findings, skin diagnoses, lesions parameters, etc."
                                  className="w-full p-4 border border-custom rounded-2xl bg-bg-custom focus:outline-none focus:border-primary focus:bg-card-custom text-primary text-xs h-32 transition-all leading-relaxed"
                                />
                              </div>
                            )}

                            {/* Tab Content 2: PRESCRIPTION */}
                            {doctorConsultWorkspaceTab === 'prescription' && (
                              <div className="flex flex-col gap-4 pt-2">
                                {/* Medicine compiler row */}
                                <div className="bg-bg-custom p-4 rounded-2xl border border-custom flex flex-col gap-4">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1">
                                      <label className="text-[9px] text-muted font-bold uppercase tracking-wider pl-1">Drug Name</label>
                                      <input
                                        type="text"
                                        placeholder="e.g. Allegra 120mg"
                                        value={doctorRxName}
                                        onChange={(e) => setDoctorRxName(e.target.value)}
                                        className="w-full p-2.5 border border-custom rounded-xl bg-card-custom focus:outline-none focus:border-primary text-primary text-xs"
                                      />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="col-span-2 flex flex-col gap-1">
                                        <label className="text-[9px] text-muted font-bold uppercase tracking-wider pl-1">Dosage Frequency</label>
                                        <input
                                          type="text"
                                          placeholder="e.g. 1-0-1"
                                          value={doctorRxDosage}
                                          onChange={(e) => setDoctorRxDosage(e.target.value)}
                                          className="w-full p-2.5 border border-custom rounded-xl bg-card-custom focus:outline-none focus:border-primary text-primary text-xs text-center font-bold"
                                        />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <label className="text-[9px] text-muted font-bold uppercase tracking-wider pl-1">Duration</label>
                                        <input
                                          type="text"
                                          value={doctorRxDuration}
                                          onChange={(e) => setDoctorRxDuration(e.target.value)}
                                          className="w-full p-2.5 border border-custom rounded-xl bg-card-custom focus:outline-none focus:border-primary text-primary text-xs text-center"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center border-t border-custom pt-3">
                                    <div className="flex gap-2">
                                      {['Before Food', 'After Food', 'With Food', 'Any Time'].map((tim) => (
                                        <button
                                          key={tim}
                                          type="button"
                                          onClick={() => setDoctorRxTiming(tim as any)}
                                          className={cn(
                                            "px-2.5 py-1.5 border rounded-lg text-[10px] font-bold transition-all focus:outline-none",
                                            {
                                              "bg-brand border-brand text-white": doctorRxTiming === tim,
                                              "bg-card-custom border-custom text-secondary": doctorRxTiming !== tim
                                            }
                                          )}
                                        >
                                          {tim}
                                        </button>
                                      ))}
                                    </div>
                                    <Button
                                      size="sm"
                                      type="button"
                                      onClick={handleDoctorAddRx}
                                      className="h-8 rounded-xl px-4 text-xs font-bold font-sans"
                                    >
                                      Add Medicine
                                    </Button>
                                  </div>
                                </div>

                                {/* Common dermatology drugs suggestions */}
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-[9px] text-muted font-bold uppercase tracking-wider pl-1">Frequently Prescribed Drugs</span>
                                  <div className="flex flex-wrap gap-1.5">
                                    {[
                                      { name: 'Ebastine 10mg', dose: '0-0-1', dur: '10 Days', tim: 'After Food' },
                                      { name: 'Mometasone Furoate Cream', dose: 'Once daily', dur: '14 Days', tim: 'Any Time' },
                                      { name: 'Allegra 120mg', dose: '1-0-0', dur: '7 Days', tim: 'Before Food' },
                                      { name: 'Cetirizine 10mg', dose: '0-0-1', dur: '5 Days', tim: 'After Food' },
                                      { name: 'Amoxicillin 500mg', dose: '1-0-1', dur: '5 Days', tim: 'After Food' },
                                      { name: 'Paracetamol 650mg', dose: '1-1-1', dur: '3 Days', tim: 'After Food' }
                                    ].map((sug, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => {
                                          setDoctorRxName(sug.name);
                                          setDoctorRxDosage(sug.dose);
                                          setDoctorRxDuration(sug.dur);
                                          setDoctorRxTiming(sug.tim as any);
                                        }}
                                        className="text-[9.5px] bg-slate-50 hover:bg-slate-105 border border-slate-150 rounded-xl px-2.5 py-1 text-slate-600 font-semibold focus:outline-none transition-colors"
                                      >
                                        + {sug.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Added medicines list */}
                                {doctorPrescriptionsList.length > 0 ? (
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center pl-1">
                                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Compiled Prescription Record</span>
                                      <button 
                                        onClick={() => setDoctorRxPrintOpen(true)}
                                        className="text-[10.5px] text-[#0F8B8D] font-bold hover:underline flex items-center gap-1 focus:outline-none"
                                      >
                                        <Printer className="w-3.5 h-3.5" /> Printable Preview
                                      </button>
                                    </div>
                                    <div className="flex flex-col gap-2 bg-emerald-50/40 dark:bg-slate-900/30 p-3 rounded-2xl border border-emerald-100/50 dark:border-slate-800">
                                      {doctorPrescriptionsList.map((rx, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs">
                                          <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-black">{idx + 1}</span>
                                            <strong className="text-slate-800 dark:text-slate-150 font-bold">{rx.name}</strong>
                                            <span className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded font-semibold">{rx.dosage}</span>
                                            <span className="text-[10px] text-slate-400 font-semibold">• {rx.timing}</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <span className="text-[10.5px] text-slate-400 font-bold">{rx.duration}</span>
                                            <button
                                              onClick={() => setDoctorPrescriptionsList(prev => prev.filter((_, i) => i !== idx))}
                                              className="text-rose-500 hover:text-rose-750 font-bold px-1 text-[11px] focus:outline-none"
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center p-6 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-semibold">
                                    No medicines prescribed yet. Use the fields above to add.
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Tab Content 3: LAB ORDERS */}
                            {doctorConsultWorkspaceTab === 'lab' && (
                              <div className="flex flex-col gap-4 pt-2">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1">Order Dermatology / Lab Screenings</span>
                                
                                <div className="grid grid-cols-2 gap-3">
                                  {[
                                    'Blood Allergy Panel', 'Skin Scraping (Fungal)', 'Biopsy Histopathology', 
                                    'Complete Blood Count (CBC)', 'Serum IgE Level', 'Skin Patch Test', 
                                    'CT Scan Face/Sinus', 'MRI Soft Tissue'
                                  ].map((test) => {
                                    const selected = doctorSelectedLabTests.includes(test);
                                    return (
                                      <button
                                        key={test}
                                        onClick={() => {
                                          if (selected) {
                                            setDoctorSelectedLabTests(prev => prev.filter(t => t !== test));
                                          } else {
                                            setDoctorSelectedLabTests(prev => [...prev, test]);
                                          }
                                        }}
                                        className={cn(
                                          "p-3.5 border rounded-2xl text-xs font-bold transition-all text-left flex justify-between items-center focus:outline-none shadow-3xs",
                                          {
                                            "bg-primary-light/45 border-primary text-[#0F8B8D]": selected,
                                            "bg-white dark:bg-slate-900 border-slate-200 hover:border-slate-400 text-slate-600 dark:text-slate-300": !selected
                                          }
                                        )}
                                      >
                                        <span>{test}</span>
                                        <div className={cn("w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition-all", {
                                          "bg-primary border-primary text-white": selected,
                                          "border-slate-300": !selected
                                        })}>
                                          {selected && <Check className="w-3 h-3" />}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>

                                <div className="flex justify-between items-center mt-2 border-t pt-4">
                                  <span className="text-xs text-slate-400 font-bold">{doctorSelectedLabTests.length} tests selected</span>
                                  <Button
                                    size="sm"
                                    disabled={doctorSelectedLabTests.length === 0}
                                    onClick={() => setDoctorLabRequestGenerated(true)}
                                    className="rounded-xl h-9.5 text-xs font-bold font-sans"
                                  >
                                    <Microscope className="w-4 h-4 mr-1.5" /> Generate Lab Request Sheet
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Tab Content 4: FOLLOW-UP */}
                            {doctorConsultWorkspaceTab === 'followup' && (
                              <div className="flex flex-col gap-4 pt-2">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1">Configure Scheduled Return Visit</span>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1">Recommend Return In</label>
                                    <select className="w-full p-2.5 border border-slate-200 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold">
                                      <option>3 Days</option>
                                      <option>1 Week</option>
                                      <option>2 Weeks</option>
                                      <option>1 Month</option>
                                      <option>No Follow-up Required</option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1">Visit Urgency</label>
                                    <select className="w-full p-2.5 border border-slate-200 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold">
                                      <option>Routine Check-up</option>
                                      <option>Urgent (If rash persists)</option>
                                      <option>Sos (In case of complications)</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1">Special Follow-up Instructions</label>
                                  <input 
                                    type="text"
                                    placeholder="e.g. Keep skin moisturised, avoid direct sunlight and report if red patches spread"
                                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-primary text-xs"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Tab Content 5: CERTIFICATE */}
                            {doctorConsultWorkspaceTab === 'certificate' && (
                              <div className="flex flex-col gap-4 pt-2">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1">Compile Sick Leave / Medical Fitness Certificate</span>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1 block mb-1">Rest From Date</label>
                                    <input type="date" defaultValue={getDateOffset(0)} className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white dark:bg-slate-900" />
                                  </div>
                                  <div>
                                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1 block mb-1">Rest Until Date</label>
                                    <input type="date" defaultValue={getDateOffset(3)} className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold bg-white dark:bg-slate-900" />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1 block mb-1">Medical Reason For Leave</label>
                                  <input type="text" defaultValue="Acute contact dermatitis with severe pruritus requiring topical ointment and bed rest." className="w-full p-3 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-primary" />
                                </div>
                                <Button size="sm" onClick={() => alert("Digital Fitness Certificate compiled! Sent to patient dashboard.")} className="w-full h-10 rounded-xl text-xs font-bold font-sans">
                                  Compile & Issue Fitness Certificate
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons Row */}
                          <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-5 mt-2 gap-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                alert("Consultation skipped. Patient placed back in queue.");
                                handleDoctorCallNext();
                              }}
                              className="h-11 rounded-2xl text-xs font-bold border-slate-200 hover:border-slate-400 text-slate-600 px-5 focus:outline-none"
                            >
                              Skip Patient
                            </Button>
                            
                            <Button
                              onClick={() => {
                                handleDoctorCompleteConsult();
                                alert("Consultation completed successfully! Visit record added to history and queue advanced.");
                              }}
                              className="h-11 rounded-2xl text-xs font-bold font-sans px-8 shadow-sm"
                            >
                              Complete Consultation
                            </Button>
                          </div>

                        </Card>
                      ) : (
                        <Card className="p-8 text-center flex flex-col items-center gap-4 justify-center py-20">
                          <div className="w-16 h-16 rounded-full bg-success-subtle flex items-center justify-center text-success shadow-2xs border border-success/15">
                            <CheckCircle2 className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="font-heading font-black text-[17px] text-primary">Workspace is Idle</h3>
                            <p className="text-xs text-muted font-semibold mt-1">No patient is currently called. Click the button below to retrieve the next check-in from the queue.</p>
                          </div>
                          <Button
                            onClick={handleDoctorCallNext}
                            className="rounded-2xl h-11 px-8 font-sans font-bold shadow-sm"
                          >
                            Call Next Patient
                          </Button>
                        </Card>
                      )}
                    </div>

                    {/* Column 3: Live Patient Queue Timeline */}
                    <div className="col-span-1 flex flex-col gap-4">
                      <Card variant="elevated" className="p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-center border-b pb-3 border-custom">
                          <h4 className="font-heading font-black text-xs uppercase tracking-wider text-muted">Active Queue Lineup</h4>
                          <Badge variant="primary" size="xs">Live Today</Badge>
                        </div>

                        {/* Pinned Currently Consulting Patient */}
                        {doctorActivePatientId ? (
                          <div className="bg-success-subtle/80 border border-success/15 p-3.5 rounded-2xl flex flex-col gap-2 relative">
                            <div className="flex justify-between items-start">
                              <span className="text-[8px] bg-success-subtle text-success border border-success/15 px-2 py-0.5 rounded-lg font-black uppercase tracking-wider">Now Serving</span>
                              <span className="text-[10px] text-emerald-700 font-black font-heading">{appointments.find(a => a.patientId === doctorActivePatientId && a.date === getDateOffset(0))?.token || 'T-XX'}</span>
                            </div>
                            <div>
                              <strong className="text-slate-800 font-black text-xs block leading-tight">{activeDocPatient.name}</strong>
                              <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">Dermatology Consult</span>
                            </div>
                          </div>
                        ) : null}

                        {/* Queue list */}
                        <div className="flex flex-col gap-2.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pl-1 block">Next Waiting In Line</span>
                          
                          {getDoctorQueueDetails('doc-1').timeline.filter(t => t.status === 'waiting').length > 0 ? (
                            getDoctorQueueDetails('doc-1').timeline.filter(t => t.status === 'waiting').map((qItem, idx) => {
                              const matchAppt = appointments.find(a => a.token === qItem.token && a.date === getDateOffset(0));
                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    if (matchAppt) {
                                      setDoctorActivePatientId(matchAppt.patientId);
                                      // Switch active check status in appointments to 'Now Serving'
                                      setAppointments(prev => prev.map(a => {
                                        if (a.id === matchAppt.id) return { ...a, status: 'Now Serving' as const };
                                        if (doctorActivePatientId && a.patientId === doctorActivePatientId) return { ...a, status: 'Waiting' as const };
                                        return a;
                                      }));
                                      alert(`Called patient ${qItem.patientName} (Token ${qItem.token}) to consultation.`);
                                    }
                                  }}
                                  className="group border border-slate-100 dark:border-slate-800 hover:border-[#0F8B8D]/30 p-3 rounded-2xl flex justify-between items-center text-xs bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 cursor-pointer shadow-3xs transition-all duration-200 theme-transition"
                                >
                                  <div className="min-w-0 flex-1 mr-2 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-[#0F8B8D] transition-colors shrink-0" />
                                      <strong className="text-slate-800 dark:text-slate-200 font-extrabold break-words whitespace-normal leading-tight">{qItem.patientName}</strong>
                                    </div>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-550 font-semibold block mt-0.5 pl-3.5">Wait Est: {(idx + 1) * 10} min</span>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-lg font-bold border border-slate-200/40 dark:border-slate-700/60">{qItem.token}</span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center p-4 py-8 border border-dashed border-slate-150 rounded-2xl text-slate-400 text-xs font-semibold">
                              No patients currently waiting.
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: PATIENT DIRECTORY */}
              {doctorTab === 'patients' && (
                <div className="flex flex-col gap-6 max-w-6.5xl mx-auto">
                  {/* Search and Filters */}
                  <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-xs gap-4">
                    <div className="relative flex-1 flex items-center">
                      <Search className="absolute left-4 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search patient registry by name or email..."
                        value={doctorSearchQuery}
                        onChange={(e) => setDoctorSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-[13px] focus:outline-none focus:border-primary shadow-3xs transition-all placeholder:text-slate-400 bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  {/* Patients List Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {MOCK_PATIENTS.filter(p => p.name.toLowerCase().includes(doctorSearchQuery.toLowerCase())).map((pat) => (
                      <Card key={pat.id} variant="elevated" className="p-5 bg-white border border-slate-100 flex flex-col gap-4 shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-heading font-black text-sm text-slate-700 dark:text-slate-300">
                            {pat.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-heading font-black text-sm text-slate-800">{pat.name}</h4>
                            <span className="text-[10.5px] text-slate-400 font-semibold block mt-0.5">{pat.phone} • {pat.bloodGroup} Group</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl text-[11px]">
                          <div>
                            <span className="text-slate-400 block font-bold">Allergies</span>
                            <strong className="text-slate-700 dark:text-slate-300 font-bold block truncate">{pat.allergies.join(', ')}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-bold">Health Score</span>
                            <strong className="text-[#0F8B8D] font-bold block">{pat.vitals.healthScore}% Index</strong>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setDoctorSelectedPatientId(pat.id)}
                          className="w-full h-9 rounded-xl text-xs font-bold"
                        >
                          Review Patient File
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CONSULTATION HISTORY */}
              {doctorTab === 'consultations' && (
                <div className="max-w-4.5xl mx-auto flex flex-col gap-4">
                  {appointments.filter(a => a.doctorId === 'doc-1' && a.status === 'Completed').length > 0 ? (
                    appointments.filter(a => a.doctorId === 'doc-1' && a.status === 'Completed').map((appt) => (
                      <Card key={appt.id} className="p-5 bg-white border border-slate-100 flex justify-between items-start text-xs shadow-xs">
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-400">{appt.date}</span>
                            <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg font-bold border border-slate-200/40">{appt.token}</span>
                          </div>
                          <div>
                            <strong className="text-slate-800 text-[14px] font-black block">{appt.patientName}</strong>
                            <span className="text-slate-500 font-semibold block mt-0.5">Reason: {appt.reason}</span>
                          </div>
                          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-slate-600">
                            <strong className="font-bold text-slate-800 block mb-0.5">Diagnosis Notes:</strong>
                            {appt.notes || 'Routine general dermatology screening and follow-up.'}
                          </div>
                          {appt.prescription && appt.prescription.length > 0 && (
                            <div>
                              <span className="font-bold text-slate-500 block mb-1">Prescribed Drugs:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {appt.prescription.map((rx) => (
                                  <Badge key={rx.id} variant="secondary" size="xs">
                                    {rx.name} • {rx.dosage} ({rx.timing})
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Badge variant="success" size="sm">Completed</Badge>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center p-8 py-16 bg-white border border-dashed border-slate-200 rounded-3xl text-slate-400 text-xs font-semibold">
                      No completed consultations logged today yet.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: APPOINTMENTS */}
              {doctorTab === 'appointments' && (
                <div className="max-w-5xl mx-auto flex flex-col gap-6">
                  {/* Desktop Appointments Table */}
                  <Card className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-sm overflow-hidden rounded-3xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-150 dark:border-slate-800">
                          <th className="p-4 pl-6">Token</th>
                          <th className="p-4">Patient Name</th>
                          <th className="p-4">Slot Time</th>
                          <th className="p-4">Reason for Visit</th>
                          <th className="p-4">Payment Method</th>
                          <th className="p-4 pr-6 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.filter(a => a.doctorId === 'doc-1').map((appt) => (
                          <tr key={appt.id} className="border-b last:border-0 border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                            <td className="p-4 pl-6 font-bold text-slate-800 dark:text-slate-205">{appt.token}</td>
                            <td className="p-4 font-black text-slate-900 dark:text-slate-105">{appt.patientName}</td>
                            <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">{appt.time}</td>
                            <td className="p-4 text-slate-500 dark:text-slate-400 truncate max-w-xs">{appt.reason}</td>
                            <td className="p-4 text-slate-500 dark:text-slate-400 font-bold">{appt.payment.method}</td>
                            <td className="p-4 pr-6 text-right">
                              <Badge
                                variant={
                                  appt.status === 'Completed' ? 'success' :
                                  appt.status === 'Now Serving' ? 'primary' :
                                  appt.status === 'Waiting' ? 'warning' : 'neutral'
                                }
                                size="xs"
                                dot
                              >
                                {appt.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>

                  {/* Mobile Appointments Card List */}
                  <div className="lg:hidden flex flex-col gap-3">
                    {appointments.filter(a => a.doctorId === 'doc-1').map((appt) => {
                      const initials = appt.patientName.split(' ').map(n => n[0]).join('');
                      return (
                        <Card key={appt.id} variant="elevated" className="p-4.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/85 shadow-xs flex flex-col gap-3.5 theme-transition">
                          
                          {/* Row 1: Patient Avatar, Name, Token */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-855 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <strong className="text-slate-800 dark:text-slate-105 font-extrabold text-[13px] block break-words whitespace-normal leading-tight">{appt.patientName}</strong>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block mt-0.5">{appt.time}</span>
                              </div>
                            </div>
                            <span className="text-[10px] bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-2.5 py-0.5 rounded-lg font-bold border border-slate-200/40 dark:border-slate-700/60 shrink-0">{appt.token}</span>
                          </div>

                          {/* Row 2: Doctor and Status */}
                          <div className="flex justify-between items-center text-[11.5px] border-t border-slate-100 dark:border-slate-800/40 pt-2.5">
                            <div>
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Doctor</span>
                              <span className="font-semibold text-slate-600 dark:text-slate-350">{appt.doctorName}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Status</span>
                              <Badge
                                variant={
                                  appt.status === 'Completed' ? 'success' :
                                  appt.status === 'Now Serving' ? 'primary' :
                                  appt.status === 'Waiting' ? 'warning' : 'neutral'
                                }
                                size="xs"
                                dot
                              >
                                {appt.status}
                              </Badge>
                            </div>
                          </div>

                          {/* Row 3: Reason and Actions */}
                          <div className="flex flex-col gap-2.5 border-t border-slate-100 dark:border-slate-800/40 pt-2.5 text-left">
                            <div className="text-[11.5px]">
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Reason for Visit</span>
                              <p className="text-slate-500 dark:text-slate-400 break-words mt-0.5">{appt.reason}</p>
                            </div>
                            
                            {appt.status === 'Waiting' && (
                              <div className="flex gap-2 mt-1">
                                <Button
                                  size="sm"
                                  className="w-full h-8.5 rounded-xl text-[11px] font-bold shadow-xs"
                                  onClick={() => {
                                    setDoctorActivePatientId(appt.patientId);
                                    // Change status to Now Serving
                                    setAppointments(prev => prev.map(a => {
                                      if (a.id === appt.id) return { ...a, status: 'Now Serving' as const };
                                      if (doctorActivePatientId && a.patientId === doctorActivePatientId) return { ...a, status: 'Waiting' as const };
                                      return a;
                                    }));
                                    alert(`Called patient ${appt.patientName} (Token ${appt.token}) to workspace.`);
                                  }}
                                >
                                  Call to Workspace
                                </Button>
                              </div>
                            )}
                          </div>

                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: DUTY SETTINGS */}
              {doctorTab === 'availability' && (
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Setup parameters */}
                  <Card variant="elevated" className="p-6 bg-white border border-slate-100 shadow-sm flex flex-col gap-5">
                    <h4 className="font-heading font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100 border-b pb-3.5 border-slate-100 dark:border-slate-800">Work Hours Configuration</h4>
                    <div className="flex flex-col gap-4 text-xs">
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[9px]">Duty Working Hours</label>
                        <input 
                          type="text" 
                          value={doctorWorkingHours}
                          onChange={(e) => setDoctorWorkingHours(e.target.value)}
                          className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-950 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[9px]">Lunch/Break Hours</label>
                        <input 
                          type="text" 
                          value={doctorLunchTime}
                          onChange={(e) => setDoctorLunchTime(e.target.value)}
                          className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-950 transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[9px]">Max Patients/Day</label>
                          <input 
                            type="number" 
                            value={doctorMaxPatients}
                            onChange={(e) => setDoctorMaxPatients(parseInt(e.target.value))}
                            className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-slate-955 transition-all text-center"
                          />
                        </div>
                        <div className="flex flex-col justify-end pb-1.5 pl-2">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-600 dark:text-slate-450">
                            <input 
                              type="checkbox" 
                              checked={doctorEmergencyAvailable}
                              onChange={(e) => setDoctorEmergencyAvailable(e.target.checked)}
                              className="rounded border-slate-400 dark:border-slate-700 text-brand focus:ring-brand w-4.5 h-4.5"
                            />
                            <span>Emergency Duty</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Summary displays */}
                  <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col gap-4.5 text-xs text-slate-500 dark:text-slate-400">
                    <h4 className="font-heading font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100 border-b pb-3.5 border-slate-100 dark:border-slate-800">Live Workspace Status Preview</h4>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span>Clinic Work Hours:</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">{doctorWorkingHours}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Lunch Break Schedule:</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">{doctorLunchTime}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Emergency Call Availability:</span>
                        <Badge variant={doctorEmergencyAvailable ? 'success' : 'neutral'} size="xs">
                          {doctorEmergencyAvailable ? 'Active SOS Call' : 'Disabled'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Daily Intake Capacity limit:</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">{doctorMaxPatients} patients max</strong>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB 6: ANALYTICS */}
              {doctorTab === 'analytics' && (
                <div className="max-w-4.5xl mx-auto flex flex-col gap-6">
                  {/* Metrics grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Consultations Completed', val: appointments.filter(a => a.doctorId === 'doc-1' && a.status === 'Completed').length, desc: 'All time finished consultations' },
                      { label: 'Avg consultation speed', val: '12 min', desc: 'Average active service time' },
                      { label: 'Consult Completion rate', val: '94.2%', desc: 'Roster appointments conversion' }
                    ].map((stat, idx) => (
                      <Card key={idx} variant="elevated" className="p-5 flex flex-col gap-1 bg-white border border-slate-100 shadow-xs">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                        <span className="text-2xl font-black font-heading text-slate-800 dark:text-slate-100 mt-1 block">{stat.val}</span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-1">{stat.desc}</span>
                      </Card>
                    ))}
                  </div>

                  {/* Peak consultation hours simulated */}
                  <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-sm flex flex-col gap-4">
                    <h4 className="font-heading font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-100">Peak Consultation Hours Feed</h4>
                    <div className="flex flex-col gap-3.5 mt-2">
                      {[
                        { hour: '09:00 AM - 11:00 AM', pct: 85, count: 12, label: 'High Patient Traffic' },
                        { hour: '11:00 AM - 01:00 PM', pct: 60, count: 8, label: 'Medium Traffic' },
                        { hour: '02:00 PM - 04:00 PM', pct: 95, count: 15, label: 'Peak Capacity Traffic' },
                        { hour: '04:00 PM - 05:00 PM', pct: 30, count: 4, label: 'Low Traffic' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1.5 text-xs text-slate-500">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-slate-800 font-extrabold">{item.hour}</span>
                            <span>{item.count} patients seen ({item.label})</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-[#0F8B8D] h-2 rounded-full" style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* TAB 7: PROFILE */}
              {doctorTab === 'profile' && (
                <div className="max-w-4xl mx-auto flex flex-col gap-6">
                  {/* Bio details card */}
                  <Card variant="elevated" className="p-6 bg-white border border-slate-100 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-5 border-b pb-5 border-slate-100 dark:border-slate-800">
                      <div className="w-16 h-16 rounded-full bg-[#0F8B8D] text-white flex items-center justify-center font-heading font-black text-2xl shadow-sm">
                        IP
                      </div>
                      <div>
                        <h3 className="font-heading font-black text-lg text-slate-800 dark:text-slate-100">Dr. Irfana Patil</h3>
                        <span className="text-xs text-brand font-bold block mt-1">MD Dermatology, Fellowship in Cosmetology</span>
                        <span className="text-[11px] text-slate-400 block font-semibold mt-0.5">Registration Number: REG-490802-A</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Clinical Specialties</span>
                        <strong className="text-slate-800 dark:text-slate-200 block text-sm">Cosmetic Dermatology, Dermato-surgery, Acne Scars Treatment</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Languages Spoken</span>
                        <strong className="text-slate-800 dark:text-slate-200 block text-sm">English, Hindi, Marathi, Kannada</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Consultation Fees</span>
                        <strong className="text-slate-800 dark:text-slate-200 block text-sm">$45.00 / Check-up Consultation</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Clinical Experience</span>
                        <strong className="text-slate-800 dark:text-slate-200 block text-sm">12+ Years Clinical Practice</strong>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

            </div>
          </main>

          {/* RIGHT DRAWER: PATIENT FULL MEDICAL ID HISTORY CARD */}
          {doctorSelectedPatientId && (() => {
            const filePatient = getPatientDetails(doctorSelectedPatientId);
            return (
              <div className="absolute inset-y-0 right-0 left-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col p-6 shadow-2xl animate-slide-in-right">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4 border-slate-100 dark:border-slate-800">
                  <h4 className="font-heading font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5 text-base">
                    <Clipboard className="w-5 h-5 text-brand animate-pulse" /> Patient Medical Dossier
                  </h4>
                  <button
                    onClick={() => setDoctorSelectedPatientId(null)}
                    className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 scrollbar-none text-xs">
                  {/* Demographics Card */}
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-xl bg-[#0F8B8D] flex items-center justify-center font-heading font-black text-white text-base">
                      {filePatient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-100 font-black text-[15px] block">{filePatient.name}</strong>
                      <span className="text-slate-400 font-semibold mt-0.5 block">{filePatient.phone} • {filePatient.email}</span>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Insurance Provider: {filePatient.insurance.provider} (Policy {filePatient.insurance.policyNumber})</span>
                    </div>
                  </div>

                  {/* Medical Vitals */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'BP Vitals', val: filePatient.vitals.bloodPressure },
                      { label: 'Pulse Rate', val: `${filePatient.vitals.heartRate} bpm` },
                      { label: 'Sugar Level', val: `${filePatient.vitals.sugarLevel} mg/dL` },
                      { label: 'Overall Vitals Score', val: `${filePatient.vitals.healthScore}%` },
                      { label: 'Blood Group', val: filePatient.bloodGroup },
                      { label: 'Body Weight', val: `${filePatient.vitals.weight} kg` }
                    ].map((v, idx) => (
                      <div key={idx} className="border border-slate-100 dark:border-slate-800 p-2.5 rounded-xl bg-white dark:bg-slate-900">
                        <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">{v.label}</span>
                        <strong className="text-slate-700 dark:text-slate-400 text-xs block font-black mt-0.5">{v.val}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Allergies list */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1">Allergies & Medical Alerts</span>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {filePatient.allergies.map((all, idx) => (
                        <Badge key={idx} variant="error" size="xs" dot className="font-bold">{all}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Previous visit logs timeline derived dynamically */}
                  <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <span className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider pl-1 block">Clinical Consultations Timeline History</span>
                    
                    {appointments.filter(a => a.patientId === filePatient.id && a.status === 'Completed').length > 0 ? (
                      <div className="flex flex-col gap-3 pl-2 border-l-2 border-[#0F8B8D]/20 ml-2">
                        {appointments.filter(a => a.patientId === filePatient.id && a.status === 'Completed').map((appt) => (
                          <div key={appt.id} className="relative pl-4 flex flex-col gap-1.5">
                            {/* timeline dot indicator */}
                            <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0F8B8D] border border-white" />
                            <div className="flex justify-between items-baseline">
                              <span className="text-[10px] text-slate-400 font-bold">{appt.date}</span>
                              <strong className="text-[10px] text-[#0F8B8D] font-bold">{appt.doctorName}</strong>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-660 dark:text-slate-300">
                              <strong className="text-slate-800 dark:text-slate-100 font-bold block mb-0.5">Diagnosis:</strong>
                              {appt.notes || 'Routine general dermatology screening and follow-up.'}
                            </div>
                            {appt.prescription && appt.prescription.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {appt.prescription.map((rx) => (
                                  <Badge key={rx.id} variant="secondary" size="xs">
                                    {rx.name} ({rx.dosage})
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 border border-dashed border-slate-150 rounded-2xl text-slate-400 text-[11px] font-semibold mt-1">
                        No previous completed consultation visits in records.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* PRESCRIPTION PRINT PREVIEW MODAL */}
          {doctorRxPrintOpen && (
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs z-55 flex items-center justify-center p-6 animate-fade-in">
              <Card variant="elevated" className="w-full max-w-lg bg-white text-slate-800 border shadow-2xl rounded-3xl p-8 relative flex flex-col gap-6 animate-scale-in">
                
                {/* Close Button */}
                <button
                  onClick={() => setDoctorRxPrintOpen(false)}
                  className="absolute top-4.5 right-4.5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* RX Letterhead */}
                <div className="flex justify-between items-start border-b-2 border-slate-150 pb-5">
                  <div>
                    <h3 className="font-heading font-black text-base text-slate-800">DR. IRFANA PATIL, MD</h3>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block mt-0.5">Dermatologist & Cosmetologist</span>
                    <span className="text-[9.5px] text-slate-400 block">Licence REG-490802-A • Room 03</span>
                  </div>
                  <div className="text-right">
                    <h4 className="font-heading font-extrabold text-[13px] text-[#0F8B8D]">Dermavita Clinic Center</h4>
                    <span className="text-[9px] text-slate-400 block mt-0.5">12 Health Park Ave, Suite 300</span>
                    <span className="text-[9px] text-slate-400 block">Tel: +1-202-555-0144</span>
                  </div>
                </div>

                {/* Patient metadata */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block">Patient Name:</span>
                    <strong className="text-slate-800 font-black">{activeDocPatient.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-right">Consultation Date:</span>
                    <strong className="text-slate-800 font-black block text-right">{getDateOffset(0)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Age / Gender:</span>
                    <strong className="text-slate-800 font-black">28 Yrs / Female</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-right">Queue Token Reference:</span>
                    <strong className="text-slate-800 font-black block text-right">
                      {appointments.find(a => a.patientId === activeDocPatient.id && a.date === getDateOffset(0))?.token || 'T-XX'}
                    </strong>
                  </div>
                </div>

                {/* Prescription List */}
                <div className="flex-1 flex flex-col gap-3 min-h-48 text-xs">
                  <div className="flex items-center gap-1 font-bold text-slate-800 text-[13px] mb-1">
                    <span className="text-base font-black italic font-serif">Rx</span>
                    <span className="tracking-wider uppercase text-[10px] text-slate-400">(Prescribed Medicines List)</span>
                  </div>
                  <div className="flex flex-col gap-2 pl-3 border-l-2 border-slate-200">
                    {doctorPrescriptionsList.map((rx, idx) => (
                      <div key={idx} className="flex justify-between items-baseline">
                        <div>
                          <strong className="font-extrabold text-slate-800">{idx + 1}. {rx.name}</strong>
                          <span className="text-slate-400 font-semibold block text-[10.5px] mt-0.5">Instructions: {rx.dosage} ({rx.timing})</span>
                        </div>
                        <span className="text-slate-500 font-bold text-[11px]">{rx.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prescription footer */}
                <div className="border-t border-slate-150 pt-5 flex justify-between items-end">
                  <div className="text-[9px] text-slate-400 font-medium">
                    * Generated electronically by BookMyDoc Clinic Suite.<br />
                    No physical signature required.
                  </div>
                  <div className="text-center w-36">
                    <div className="h-9 border-b border-slate-300 flex items-center justify-center font-serif text-[#0F8B8D] italic text-xs">
                      Dr. I. Patil
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Authorized Seal</span>
                  </div>
                </div>

                {/* Print CTA */}
                <div className="flex justify-end gap-3 mt-2 border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDoctorRxPrintOpen(false)}
                    className="h-10 rounded-2xl text-xs font-bold border-slate-200 text-slate-600 px-5"
                  >
                    Close Preview
                  </Button>
                  <Button
                    onClick={() => {
                      alert("Connecting to local printer... Printing Prescription PDF!");
                      setDoctorRxPrintOpen(false);
                    }}
                    className="h-10 rounded-2xl text-xs font-bold px-6 font-sans"
                  >
                    Print Rx Ticket
                  </Button>
                </div>

              </Card>
            </div>
          )}

          {/* LAB REQUEST SHEET PREVIEW MODAL */}
          {doctorLabRequestGenerated && (
            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs z-55 flex items-center justify-center p-6 animate-fade-in">
              <Card variant="elevated" className="w-full max-w-lg bg-white text-slate-800 border shadow-2xl rounded-3xl p-8 relative flex flex-col gap-6 animate-scale-in">
                
                {/* Close Button */}
                <button
                  onClick={() => setDoctorLabRequestGenerated(false)}
                  className="absolute top-4.5 right-4.5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Letterhead */}
                <div className="flex justify-between items-start border-b-2 border-slate-150 pb-5">
                  <div>
                    <h3 className="font-heading font-black text-base text-slate-800">DR. IRFANA PATIL, MD</h3>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block mt-0.5">Dermatologist & Cosmetologist</span>
                    <span className="text-[9.5px] text-slate-400 block">Licence REG-490802-A</span>
                  </div>
                  <div className="text-right">
                    <h4 className="font-heading font-extrabold text-[13px] text-[#0F8B8D]">Dermavita Clinic Center</h4>
                    <span className="text-[9px] text-slate-400 block mt-0.5">12 Health Park Ave, Suite 300</span>
                  </div>
                </div>

                {/* Patient metadata */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block">Patient Name:</span>
                    <strong className="text-slate-800 font-black">{activeDocPatient.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block text-right">Date:</span>
                    <strong className="text-slate-800 font-black block text-right">{getDateOffset(0)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Token Number:</span>
                    <strong className="text-slate-800 font-black">
                      {appointments.find(a => a.patientId === activeDocPatient.id && a.date === getDateOffset(0))?.token || 'T-XX'}
                    </strong>
                  </div>
                </div>

                {/* Test orders */}
                <div className="flex-1 flex flex-col gap-3 min-h-36 text-xs">
                  <span className="font-bold text-slate-800 text-[13px] uppercase tracking-wider block mb-1">Requested Laboratory Screenings:</span>
                  <div className="flex flex-col gap-3 pl-3 border-l-2 border-[#0F8B8D]/30">
                    {doctorSelectedLabTests.map((test, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-black">{idx + 1}</span>
                        <strong className="text-slate-800 font-extrabold">{test}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer and Print button */}
                <div className="border-t border-slate-150 pt-5 flex justify-between items-end">
                  <div className="text-[9px] text-slate-400 font-medium">
                    * Requested lab orders generated electronically.<br />
                    Please present this at the clinic desk.
                  </div>
                  <div className="text-center w-36">
                    <div className="h-9 border-b border-slate-400 flex items-center justify-center font-serif text-[#0F8B8D] italic text-xs">
                      Dr. I. Patil
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2 border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setDoctorLabRequestGenerated(false)}
                    className="h-10 rounded-2xl text-xs font-bold border-slate-200 text-slate-600 px-5"
                  >
                    Close Preview
                  </Button>
                  <Button
                    onClick={() => {
                      alert("Connecting to local printer... Printing Lab Request Ticket!");
                      setDoctorLabRequestGenerated(false);
                      setDoctorSelectedLabTests([]);
                    }}
                    className="h-10 rounded-2xl text-xs font-bold px-6 font-sans"
                  >
                    Print Lab Order
                  </Button>
                </div>

              </Card>
            </div>
          )}

        </div>
      )}

      {/* Container simulating a premium mobile device shell, centered on desktop */}
      {view !== 'receptionist' && view !== 'doctor' && (
        <div className="w-full max-w-md flex-1 h-full lg:h-screen mx-auto bg-background dark:bg-slate-950 shadow-lg flex flex-col relative overflow-hidden pb-20">
        
        {/* --- 1. SPLASH SCREEN --- */}
        <AnimatePresence>
          {view === 'splash' && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-50 gradient-splash flex flex-col items-center justify-between py-16 px-10 text-white"
            >
              {/* Floating medical icons */}
              <div className="relative w-full flex justify-between px-4 opacity-20">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                  <Heart className="w-6 h-6" />
                </motion.div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
                  <Shield className="w-5 h-5" />
                </motion.div>
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                  <Activity className="w-6 h-6" />
                </motion.div>
              </div>
              <div className="flex flex-col items-center gap-8 text-center">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 120, damping: 10 }}
                  className="w-28 h-28 rounded-[32px] bg-white/15 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/25"
                >
                  <Stethoscope className="w-14 h-14 text-white" />
                </motion.div>
                <motion.h1 
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-[42px] font-heading font-extrabold tracking-tight leading-none"
                >
                  BookMyDoc
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.85 }}
                  transition={{ delay: 0.75, duration: 0.5 }}
                  className="text-base font-medium max-w-[260px] font-sans leading-relaxed"
                >
                  No More Waiting Rooms.<br/>Just Walk In On Time.
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
                className="text-[11px] font-medium tracking-wider"
              >
                Version 1.2.0 • PWA Enabled
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 2. ONBOARDING CAROUSEL --- */}
        <AnimatePresence>
          {view === 'onboarding' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-white dark:bg-slate-950 flex flex-col justify-between px-8 py-10"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Stethoscope className="w-6 h-6 text-brand" />
                  <span className="font-heading font-bold text-lg text-brand">BookMyDoc</span>
                </div>
                <button 
                  onClick={() => setView('auth')} 
                  className="text-sm font-semibold text-muted hover:text-brand transition-colors"
                >
                  Skip
                </button>
              </div>

              {/* Onboarding steps contents */}
              <div className="my-auto flex flex-col items-center text-center px-4">
                <AnimatePresence mode="wait">
                  {onboardingStep === 0 && (
                    <motion.div
                      key="step1"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="w-48 h-48 rounded-[40px] bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-md">
                        <Calendar className="w-20 h-20 text-brand" />
                      </div>
                      <h2 className="text-[26px] font-heading font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Book Appointments</h2>
                      <p className="text-slate-500 dark:text-slate-400 max-w-[280px] text-[15px] leading-relaxed">
                        Find and schedule consultation slots with top-rated dermatologists instantly.
                      </p>
                    </motion.div>
                  )}

                  {onboardingStep === 1 && (
                    <motion.div
                      key="step2"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="w-48 h-48 rounded-[40px] bg-gradient-to-br from-teal-50 to-secondary-light flex items-center justify-center shadow-md">
                        <Activity className="w-20 h-20 text-brand" />
                      </div>
                      <h2 className="text-[26px] font-heading font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Live Queue Tracking</h2>
                      <p className="text-slate-500 dark:text-slate-400 max-w-[280px] text-[15px] leading-relaxed">
                        Track live tokens in real time and arrive exactly when it&apos;s your turn.
                      </p>
                    </motion.div>
                  )}

                  {onboardingStep === 2 && (
                    <motion.div
                      key="step3"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <div className="w-48 h-48 rounded-[40px] bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center shadow-md">
                        <FileText className="w-20 h-20 text-secondary" />
                      </div>
                      <h2 className="text-[26px] font-heading font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Digital Health History</h2>
                      <p className="text-slate-500 dark:text-slate-400 max-w-[280px] text-[15px] leading-relaxed">
                        Securely store prescriptions, lab reports, and vitals in one place.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dot Indicators */}
                <div className="flex gap-2 mt-14">
                  {[0, 1, 2].map((idx) => (
                    <motion.span 
                      key={idx}
                      layout
                      className={cn("h-2 rounded-full transition-colors duration-300", {
                        "w-8 bg-primary": onboardingStep === idx,
                        "w-2 bg-slate-200": onboardingStep !== idx
                      })}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Nav actions */}
              <div className="flex gap-4">
                {onboardingStep < 2 ? (
                  <Button 
                    className="w-full"
                    onClick={() => setOnboardingStep(prev => prev + 1)}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => { setView('auth'); setAuthMode('login'); }}
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- 3. AUTHENTICATION SCREENS (LOGIN, SIGNUP, OTP) --- */}
        <AnimatePresence>
          {view === 'auth' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 z-30 bg-background dark:bg-slate-950 flex flex-col px-8 py-10 overflow-y-auto"
            >
              {/* Back Button */}
              {authMode !== 'login' && (
                <button 
                  onClick={() => setAuthMode(authMode === 'otp' ? 'login' : 'login')}
                  className="self-start p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              {/* Header */}
              <div className="text-center mt-8 mb-10">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-premium mb-5">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-[28px] font-heading font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  {authMode === 'login' && 'Welcome Back'}
                  {authMode === 'signup' && 'Create Account'}
                  {authMode === 'otp' && 'Verify OTP'}
                </h2>
                <p className="text-slate-400 dark:text-slate-500 text-[15px] mt-2 leading-relaxed">
                  {authMode === 'login' && 'Log in to track your queue & appointments'}
                  {authMode === 'signup' && 'Sign up to manage clinic visits'}
                  {authMode === 'otp' && 'Enter the 6-digit code sent to your inbox/phone'}
                </p>
              </div>

              {/* Login Mode */}
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                  <Input 
                    type="email"
                    placeholder="Email Address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    icon={<User className="w-5 h-5" />}
                    error={loginError}
                  />
                  
                  <Input 
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    icon={<Shield className="w-5 h-5" />}
                  />

                  <div className="flex justify-between items-center text-[13px] mt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-muted">
                      <input type="checkbox" className="rounded-md text-brand focus:ring-brand/30 w-4 h-4" defaultChecked />
                      Remember Me
                    </label>
                    <a href="#" className="font-semibold text-brand hover:underline">Forgot Password?</a>
                  </div>

                  <Button type="submit" className="w-full mt-4">
                    Login
                  </Button>

                  <div className="relative flex py-4 items-center mt-2">
                    <div className="flex-grow border-t border-custom"></div>
                    <span className="flex-shrink mx-5 text-muted text-[11px] font-semibold tracking-wider uppercase">or continue with</span>
                    <div className="flex-grow border-t border-custom"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="outline" className="h-[52px] text-[14px] rounded-2xl">
                      <Smartphone className="w-4 h-4 mr-2" /> Phone
                    </Button>
                    <Button type="button" variant="outline" className="h-[52px] text-[14px] rounded-2xl">
                      Google
                    </Button>
                  </div>

                  <p className="text-center text-sm text-muted mt-6">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => setAuthMode('signup')} className="font-semibold text-brand hover:underline">
                      Sign Up
                    </button>
                  </p>
                </form>
              )}

              {/* Signup Mode */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignup} className="flex flex-col gap-3">
                  <Input 
                    type="text"
                    placeholder="Full Name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    error={signupError}
                  />
                  <Input 
                    type="email"
                    placeholder="Email Address"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                  <Input 
                    type="tel"
                    placeholder="Phone Number"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                  />
                  <Input 
                    type="password"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                  <Input 
                    type="password"
                    placeholder="Confirm Password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  />

                  <div className="text-[11px] text-muted leading-relaxed mt-2">
                    By signing up, you agree to our{' '}
                    <a href="#" className="font-semibold text-brand hover:underline">Terms of Service</a> and{' '}
                    <a href="#" className="font-semibold text-brand hover:underline">Privacy Policy</a>.
                  </div>

                  <Button type="submit" className="w-full mt-4">
                    Create Account
                  </Button>

                  <p className="text-center text-sm text-muted mt-4">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setAuthMode('login')} className="font-semibold text-brand hover:underline">
                      Log In
                    </button>
                  </p>
                </form>
              )}

              {/* OTP Mode */}
              {authMode === 'otp' && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-center gap-2">
                    {otpCode.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        className="w-13 h-[58px] text-center text-2xl font-bold rounded-2xl border-[1.5px] border-custom bg-card-custom text-primary focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none transition-all duration-200"
                        value={digit}
                        onChange={(e) => handleOtpInput(i, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && i > 0) {
                            document.getElementById(`otp-${i - 1}`)?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>

                  <Button onClick={handleVerifyOtp} className="w-full mt-4">
                    Verify OTP
                  </Button>

                  <div className="text-center text-sm text-muted">
                    {otpTimer > 0 ? (
                      <span>Resend code in <strong className="text-brand">{otpTimer}s</strong></span>
                    ) : (
                      <button 
                        onClick={() => setOtpTimer(59)} 
                        className="font-semibold text-brand hover:underline"
                      >
                        Resend OTP Code
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Login credentials helper for testing */}
              <div className="mt-auto bg-primary-50 border border-primary-200/50 p-5 rounded-2xl text-[12px] flex flex-col gap-2 text-primary-700">
                <span className="font-bold text-[13px]">✨ Quick Access Role Shortcuts</span>
                <div className="text-primary-600">Patient Login: <code className="font-bold bg-white px-1.5 py-0.5 rounded-lg text-brand">any email/password</code> then click Verify</div>
                <div className="text-primary-600">Doctor Login: <code className="font-bold bg-white px-1.5 py-0.5 rounded-lg text-brand">doctor@bookmydoc.com</code></div>
                <div className="text-primary-600">Receptionist: <code className="font-bold bg-white px-1.5 py-0.5 rounded-lg text-brand">receptionist@bookmydoc.com</code></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>



        {/* --- 5. PATIENT PORTAL ROOT SHELL --- */}
        {view === 'app' && (
          <div className="flex-1 flex flex-col bg-background dark:bg-slate-950 overflow-y-auto pb-28">
            
            {/* Header */}
            <div className="gradient-header dark:from-primary/5 dark:to-transparent px-6 pt-4 lg:pt-14 pb-5 flex justify-between items-center">
              <div>
                <span className="text-[13px] font-medium text-slate-400 dark:text-slate-500 block">Good Morning,</span>
                <span className="text-[22px] font-heading font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{currentUser.name}</span>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                {/* Notification Bell */}
                <button 
                  onClick={() => setShowNotificationOverlay(true)}
                  className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center relative hover:scale-105 active:scale-95 transition-transform shadow-xs"
                >
                  <Bell className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </button>
                {/* Profile Pic */}
                <div 
                  onClick={() => setPatientTab('profile')}
                  className="w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-[13px] border-2 border-white cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-transform"
                >
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>

            {/* --- TAB VIEW 1: HOME --- */}
            {patientTab === 'home' && (
              <div className="px-6 flex flex-col gap-7 flex-1 pb-10">
                {/* Quick Search */}
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search doctors, clinics, specialty..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPatientTab('appointments'); }}
                    className="w-full pl-12 pr-5 py-3.5 bg-white border border-slate-200/80 rounded-2xl text-[14px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Quick Actions Grid */}
                <div>
                  <h3 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div 
                      onClick={() => setPatientTab('queue')}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/60 border border-indigo-100/50 flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 group-active:scale-95 transition-transform">
                        <Activity className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Live Queue</span>
                    </div>

                    <div 
                      onClick={() => { setSelectedDoctor(doctors[0]); triggerBooking(doctors[0]); }}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-100/50 flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 group-active:scale-95 transition-transform">
                        <Calendar className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Book Visit</span>
                    </div>

                    <div 
                      onClick={() => setPatientTab('appointments')}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-100/50 flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 group-active:scale-95 transition-transform">
                        <Stethoscope className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Find Doc</span>
                    </div>

                    <div 
                      onClick={() => { setPatientTab('records'); setHealthSubTab('history'); }}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/60 border border-rose-100/50 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 group-active:scale-95 transition-transform">
                        <FileText className="w-5.5 h-5.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Records</span>
                    </div>
                  </div>
                </div>

                {/* Today's Active Appointment Card */}
                {todayAppt ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Visit</h3>
                    </div>
                    <Card variant="elevated" className="p-6 border-none flex flex-col gap-6 relative overflow-hidden shadow-xl shadow-primary/5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[11px] font-bold text-primary block uppercase tracking-widest">{todayAppt.clinicName}</span>
                            <span className="font-heading font-extrabold text-[17px] text-slate-800 dark:text-slate-100 mt-1 block">{todayAppt.doctorName}</span>
                            <span className="text-[13px] text-slate-400 flex items-center gap-1.5 mt-1.5"><Clock className="w-3.5 h-3.5" />{todayAppt.time} • Today</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wide">Token</span>
                            <span className="text-3xl font-black text-primary block leading-none mt-1 font-heading">{todayAppt.token}</span>
                          </div>
                        </div>
                      
                      {/* Live queue teaser inside today card */}
                      {todayQueue && (
                        <div className="bg-primary-50/50 dark:bg-primary-950/20 rounded-2xl p-4.5 flex justify-between items-center text-xs border border-primary-100 dark:border-primary-900/30">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-slate-600 dark:text-slate-400">
                              Serving: <strong className="text-primary font-bold">{todayQueue.currentToken}</strong>
                            </span>
                          </div>
                          <span className="text-slate-500">
                            <strong className="text-slate-800 dark:text-slate-200 font-bold">{todayQueue.patientsAhead}</strong> ahead ({todayQueue.estimatedWaitTime}m wait)
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-10 rounded-xl px-1 text-[11px]"
                          onClick={() => setPatientTab('queue')}
                        >
                          <Activity className="w-3.5 h-3.5 mr-1 text-primary animate-pulse" /> Queue
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-10 rounded-xl px-1 text-[11px] border-primary/20 text-primary hover:bg-primary/5"
                          onClick={() => triggerReschedule(todayAppt)}
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reschedule
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-10 rounded-xl px-1 text-[11px] border-dashed hover:border-error hover:bg-rose-50"
                          onClick={() => {
                            if(confirm("Are you sure you want to cancel this appointment?")) {
                              setAppointments(prev => prev.map(a => a.id === todayAppt.id ? { ...a, status: 'Cancelled' } : a));
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Card>
                  </div>
                ) : (
                  <Card className="p-6 border-dashed border-2 border-gray-200 dark:border-slate-800 flex flex-col items-center gap-4 text-center">
                    <Calendar className="w-10 h-10 text-gray-300" />
                    <div>
                      <h4 className="font-bold text-gray-700 dark:text-slate-200">No appointments today</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Need skin consultation? Book one with our specialist dermatologists.</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="rounded-xl px-4"
                      onClick={() => {
                        setSelectedDoctor(doctors[0]);
                        triggerBooking(doctors[0]);
                      }}
                    >
                      Book Appointment
                    </Button>
                  </Card>
                )}

                {/* Health Summary widgets */}
                <div>
                  <h3 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">My Vitals Overview</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Card padding="compact" className="flex flex-col items-center text-center gap-2 border border-slate-100/70 hover:shadow-premium transition-all duration-200">
                      <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500">
                        <Flame className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold uppercase tracking-wider">Pulse</span>
                        <span className="font-heading font-black text-slate-800 dark:text-slate-100 text-[15px] mt-1 block leading-none">{currentUser.vitals.pulse} <span className="text-[10px] font-medium text-slate-400">bpm</span></span>
                      </div>
                    </Card>
                    <Card padding="compact" className="flex flex-col items-center text-center gap-2 border border-slate-100/70 hover:shadow-premium transition-all duration-200">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-500">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold uppercase tracking-wider">BP</span>
                        <span className="font-heading font-black text-slate-800 dark:text-slate-100 text-[13px] mt-1 block leading-none truncate">{currentUser.vitals.bloodPressure}</span>
                      </div>
                    </Card>
                    <Card padding="compact" className="flex flex-col items-center text-center gap-2 border border-slate-100/70 hover:shadow-premium transition-all duration-200">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold uppercase tracking-wider">BMI</span>
                        <span className="font-heading font-black text-slate-800 dark:text-slate-100 text-[15px] mt-1 block leading-none">{currentUser.vitals.bmi}</span>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Health Score banner */}
                <Card className="p-5 bg-gradient-to-r from-primary to-secondary text-white flex justify-between items-center relative overflow-hidden border-none shadow-premium">
                  <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center">
                    <Heart className="w-36 h-36 -mr-6 animate-float" />
                  </div>
                  <div className="flex flex-col gap-1.5 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Overall Wellness Rating</span>
                    <span className="text-2xl font-black font-heading tracking-tight">Excellent Health</span>
                    <span className="text-[11px] text-white/85 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Updated 2 days ago</span>
                  </div>
                  <div className="w-16 h-16 rounded-2xl border-2 border-white/20 flex items-center justify-center font-heading font-black text-xl bg-white/10 backdrop-blur-md shadow-inner z-10">
                    {currentUser.vitals.healthScore}
                  </div>
                </Card>

              </div>
            )}

            {/* --- TAB VIEW 2: APPOINTMENTS (Dermatologist list / Search / Detail / Booking) --- */}
            {patientTab === 'appointments' && (
              <div className="px-6 flex flex-col gap-5 flex-1 pb-10">
                
                {/* Search, Filter list view */}
                {!selectedDoctor && (
                  <>
                    <h3 className="text-xl font-heading font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Find Dermatologist</h3>
                    
                    {/* Search Input */}
                    <div className="flex gap-2.5">
                      <div className="relative flex items-center flex-1">
                        <Search className="absolute left-4 w-4.5 h-4.5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search name, location..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-[13px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-xs transition-all placeholder:text-slate-400"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn("h-[46px] px-4 rounded-2xl border-slate-200 text-xs font-semibold", { "bg-primary-50 border-primary-200 text-primary-750": showFilters })}
                      >
                        Filters
                      </Button>
                    </div>

                    {/* Filter controls */}
                    {showFilters && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800 p-5 rounded-2xl flex flex-col gap-4 shadow-md text-xs"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[9px]">Max Consultation Fee</label>
                            <select 
                              value={selectedFee} 
                              onChange={(e) => setSelectedFee(e.target.value)}
                              className="w-full p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary text-xs"
                            >
                              <option value="All">Any Fees</option>
                              <option value="500">Under ₹500</option>
                              <option value="600">Under ₹600</option>
                              <option value="700">Under ₹700</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[9px]">Experience</label>
                            <select 
                              value={selectedExperience} 
                              onChange={(e) => setSelectedExperience(e.target.value)}
                              className="w-full p-2.5 border border-slate-200/80 rounded-xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary text-xs"
                            >
                              <option value="All">Any Experience</option>
                              <option value="10">10+ Years</option>
                              <option value="15">15+ Years</option>
                            </select>
                          </div>
                        </div>
                        <button 
                          onClick={() => { setSelectedFee('All'); setSelectedExperience('All'); setSelectedSpecialty('All'); }} 
                          className="self-end text-primary font-bold hover:underline mt-1"
                        >
                          Reset Filters
                        </button>
                      </motion.div>
                    )}

                    {/* Doctor Cards */}
                    <div className="flex flex-col gap-4 mt-2">
                      {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doc) => (
                          <Card 
                            key={doc.id} 
                            hoverable
                            onClick={() => triggerBooking(doc)}
                            className="p-4 flex gap-4 border border-slate-100/70 hover:shadow-premium transition-all duration-300"
                          >
                            <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 relative">
                              <img src={doc.clinicPhotos[0]} alt={doc.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start">
                                  <h4 className="font-heading font-extrabold text-[15px] text-slate-800 dark:text-slate-100 leading-snug">{doc.name}</h4>
                                  <div className="flex items-center text-amber-500 font-black text-xs gap-0.5 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-lg border border-amber-100/30">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    {doc.rating}
                                  </div>
                                </div>
                                <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">{doc.qualification}</span>
                                <span className="text-[12px] font-bold text-primary block mt-1.5">{doc.clinicName}</span>
                                <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-medium"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {doc.clinicAddress.split(',')[0]}</span>
                              </div>
                              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100/80">
                                <span className="text-xs font-black text-slate-800 dark:text-slate-200">₹{doc.fees} <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide ml-0.5">Consult</span></span>
                                <Badge variant="secondary" size="sm" className="text-[10px] font-bold">View Slots</Badge>
                              </div>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-10 text-slate-400 font-medium">No doctors found matching filters.</div>
                      )}
                    </div>
                  </>
                )}

                {/* Booking wizard (when selectedDoctor is not null) */}
                {selectedDoctor && (
                  <div className="flex flex-col gap-4">
                    {/* Back Button */}
                    <button 
                      onClick={() => setSelectedDoctor(null)}
                      className="self-start flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to Search
                    </button>

                    {/* Clinic & Doctor header */}
                    <Card className="p-4 bg-gradient-to-r from-primary-50/50 to-slate-50/20 border border-slate-150/40 flex gap-4 shadow-sm">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 overflow-hidden flex-shrink-0 relative">
                        <img src={selectedDoctor.clinicPhotos[0]} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase block tracking-widest">{selectedDoctor.clinicName}</span>
                        <h4 className="font-heading font-extrabold text-base text-slate-800 dark:text-slate-100 mt-0.5">{selectedDoctor.name}</h4>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-medium"><Clock className="w-3.5 h-3.5 text-slate-400" /> {selectedDoctor.clinicTimings.split('&')[0]}</span>
                      </div>
                    </Card>

                    {/* Step: Details / Doctor Bio */}
                    {bookingStep === 'details' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                        <div className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1.5 text-[13px]">Biography</span>
                          {selectedDoctor.biography}
                        </div>

                        <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1.5 text-[13px]">Education</span>
                          {selectedDoctor.education.map((edu, i) => (
                            <div key={i} className="flex gap-2 items-start mt-0.5 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{edu}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                          <Button onClick={() => setBookingStep('calendar')} className="w-full">
                            Book Appointment Slot
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step: Calendar / Slot selection */}
                    {bookingStep === 'calendar' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                        <h4 className="text-[14px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Select Date & Time</h4>
                        
                        {/* Mini Calendar Row */}
                        <div className="grid grid-cols-5 gap-2 text-center text-xs">
                          {[0, 1, 2, 3, 4].map((offset) => {
                            const date = new Date();
                            date.setDate(date.getDate() + offset);
                            const active = bookingDate === date.toISOString().split('T')[0];
                            const labelDay = date.toLocaleDateString('en-US', { weekday: 'short' });
                            const labelDate = date.getDate();
                            return (
                              <div 
                                key={offset}
                                onClick={() => setBookingDate(date.toISOString().split('T')[0])}
                                className={cn("p-3 rounded-2xl border-1.5 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center", {
                                  "bg-primary border-primary text-white shadow-premium scale-105": active,
                                  "bg-white border-slate-150 hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400": !active
                                })}
                              >
                                <span className="block text-[9px] uppercase tracking-widest font-bold opacity-80" suppressHydrationWarning>{labelDay}</span>
                                <span className="block text-[17px] font-black mt-1 font-heading leading-none" suppressHydrationWarning>{labelDate}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Slot Categories Picker */}
                        <div className="flex flex-col gap-4 mt-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest mb-2.5">Morning Slots</span>
                            <div className="grid grid-cols-4 gap-2.5">
                              {selectedDoctor.availableSlots.morning.map(slot => (
                                <button 
                                  key={slot}
                                  onClick={() => setBookingTime(slot)}
                                  className={cn("py-2.5 text-[11px] font-bold rounded-xl border transition-all duration-200 shadow-xs", {
                                    "bg-primary-50 border-primary-350 text-primary dark:bg-primary-950/20 dark:border-primary-800": bookingTime === slot,
                                    "bg-white border-slate-150 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400": bookingTime !== slot
                                  })}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest mb-2.5">Evening Slots</span>
                            <div className="grid grid-cols-4 gap-2.5">
                              {selectedDoctor.availableSlots.evening.slice(0, 8).map(slot => (
                                <button 
                                  key={slot}
                                  onClick={() => setBookingTime(slot)}
                                  className={cn("py-2.5 text-[11px] font-bold rounded-xl border transition-all duration-200 shadow-xs", {
                                    "bg-primary-50 border-primary-350 text-primary dark:bg-primary-950/20 dark:border-primary-800": bookingTime === slot,
                                    "bg-white border-slate-150 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400": bookingTime !== slot
                                  })}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Button 
                          onClick={() => setBookingStep('prescription')}
                          disabled={!bookingDate || !bookingTime}
                          className="w-full mt-4"
                        >
                          Continue
                        </Button>
                      </motion.div>
                    )}
                    {/* Step: Upload Prescription & Reason */}
                    {bookingStep === 'prescription' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Reason for Appointment</label>
                          <textarea 
                            value={bookingReason}
                            onChange={(e) => setBookingReason(e.target.value)}
                            placeholder="Describe skin allergy, acne, eczema flare, etc..."
                            className="w-full p-4 border border-slate-200/80 rounded-2xl text-[13px] bg-white dark:bg-slate-900 dark:border-slate-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 h-24 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Upload Previous Prescription (Optional)</label>
                          <div 
                            onClick={() => setBookingPrescriptionFile('doc_ref.pdf')}
                            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center bg-white dark:bg-slate-900 cursor-pointer hover:border-primary/50 hover:bg-primary-50/10 dark:hover:bg-primary-950/5 transition-all duration-200"
                          >
                            {bookingPrescriptionFile ? (
                              <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 font-bold">
                                <CheckCircle2 className="w-5 h-5" /> prescription_uploaded.pdf
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-slate-400 text-xs">
                                <Plus className="w-8 h-8 text-slate-400" />
                                <span className="font-semibold text-slate-500">Click to mock upload file</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button onClick={() => setBookingStep('payment')} className="w-full mt-4">
                          Proceed to Payment
                        </Button>
                      </motion.div>
                    )}

                    {/* Step: Payment Summary Checkout */}
                    {bookingStep === 'payment' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                        <h4 className="text-[14px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Checkout Summary</h4>
                        
                        <Card variant="elevated" className="p-5 border border-slate-100/60 flex flex-col gap-4 text-xs bg-slate-50/20">
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Consultation Fee</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100">₹{selectedDoctor.fees}.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Booking Charges</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100">₹0.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400 font-semibold">Tax & GST</span>
                            <span className="font-bold text-slate-800 dark:text-slate-100">₹0.00</span>
                          </div>
                          <div className="border-t border-slate-150 pt-4 flex justify-between text-[13px] font-extrabold text-slate-800 dark:text-slate-150">
                            <span>Amount Payable</span>
                            <span className="text-primary text-base">₹{selectedDoctor.fees}.00</span>
                          </div>
                        </Card>

                        <div className="flex flex-col gap-3.5 text-xs mt-2">
                          <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Select UPI App</span>
                          <div className="grid grid-cols-3 gap-2.5">
                            <button className="p-3.5 border border-slate-200 rounded-2xl bg-white dark:bg-slate-900 dark:border-slate-800 font-bold flex items-center justify-center gap-1 hover:border-primary hover:bg-primary-50/10 transition-all duration-200 text-[11px] text-slate-700 dark:text-slate-400 shadow-xs">
                              Google Pay
                            </button>
                            <button className="p-3.5 border border-slate-200 rounded-2xl bg-white dark:bg-slate-900 dark:border-slate-800 font-bold flex items-center justify-center gap-1 hover:border-primary hover:bg-primary-50/10 transition-all duration-200 text-[11px] text-slate-700 dark:text-slate-400 shadow-xs">
                              PhonePe
                            </button>
                            <button className="p-3.5 border border-slate-200 rounded-2xl bg-white dark:bg-slate-900 dark:border-slate-800 font-bold flex items-center justify-center gap-1 hover:border-primary hover:bg-primary-50/10 transition-all duration-200 text-[11px] text-slate-700 dark:text-slate-400 shadow-xs">
                              Paytm
                            </button>
                          </div>
                        </div>

                        <Button onClick={confirmBooking} className="w-full mt-4">
                          Pay & Confirm Booking
                        </Button>
                      </motion.div>
                    )}

                    {/* Step: Success Screen */}
                    {bookingStep === 'success' && lastGeneratedAppt && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="flex flex-col items-center text-center gap-6 py-6"
                      >
                        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-500 shadow-premium animate-bounce-in">
                          <CheckCircle2 className="w-11 h-11" />
                        </div>
                        <div>
                          <h4 className="text-xl font-heading font-black text-slate-800 dark:text-slate-100 tracking-tight">Booking Confirmed!</h4>
                          <p className="text-xs text-slate-400 mt-1.5">Your queue token has been generated successfully.</p>
                        </div>

                        {/* Interactive Queue Token Card */}
                        <Card variant="elevated" className="p-6 w-full border border-emerald-100/60 bg-gradient-to-b from-white to-slate-50 flex flex-col items-center gap-5 shadow-premium">
                          <div className="flex justify-between w-full border-b pb-4 text-xs">
                            <div className="text-left">
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Appointment ID</span>
                              <span className="font-bold text-slate-700 mt-0.5 block">{lastGeneratedAppt.id.replace('appt-new-', 'BD-')}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Time & Slot</span>
                              <span className="font-bold text-slate-700 mt-0.5 block">{lastGeneratedAppt.time}</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Queue Token</span>
                            <span className="text-6xl font-black text-primary font-heading mt-2 leading-none">{lastGeneratedAppt.token}</span>
                          </div>

                          {/* Dummy QR Code */}
                          <div className="w-32 h-32 bg-white border border-slate-200/80 rounded-3xl flex items-center justify-center p-3 shadow-md">
                            <QrCode className="w-full h-full text-slate-800" />
                          </div>

                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Present QR at Reception</span>

                          <div className="grid grid-cols-2 gap-3 w-full border-t pt-4">
                            <Button variant="outline" size="sm" className="h-11 rounded-2xl text-xs font-bold">
                              <Download className="w-4 h-4 mr-1.5" /> PDF Invoice
                            </Button>
                            <Button variant="outline" size="sm" className="h-11 rounded-2xl text-xs font-bold">
                              <Share2 className="w-4 h-4 mr-1.5" /> Share Slot
                            </Button>
                          </div>
                        </Card>

                        <Button 
                          onClick={() => { setSelectedDoctor(null); setPatientTab('home'); }} 
                          className="w-full mt-2"
                        >
                          Go to Dashboard
                        </Button>
                      </motion.div>
                    )}

                  </div>
                )}

              </div>
            )}

            {/* --- TAB VIEW 3: QUEUE MONITOR BOARD --- */}
            {patientTab === 'queue' && (
              <div className="px-6 flex flex-col gap-6 flex-1 pb-10">
                <div className="flex justify-between items-center pt-6">
                  <div>
                    <h3 className="text-xl font-heading font-extrabold text-primary tracking-tight">Live Queue Board</h3>
                    <span className="text-[11px] text-muted font-semibold block mt-0.5">Realtime clinic display monitor</span>
                  </div>
                  
                  {/* Play/Pause Queue Updates toggle */}
                  <button 
                    onClick={() => setQueueTicking(!queueTicking)}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-brand bg-primary-50 dark:bg-primary-950/20 px-3.5 py-1.5 rounded-full hover:scale-105 active:scale-95 transition-transform"
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", { "animate-spin": queueTicking })} />
                    {queueTicking ? 'Syncing Live' : 'Paused'}
                  </button>
                </div>

                {/* Doctor Selection Tab scroll */}
                <div className="flex gap-2.5 overflow-x-auto pb-2 px-6 -mx-6 scrollbar-none sticky top-0 z-30 bg-background/95 dark:bg-slate-950/95 backdrop-blur-md pt-3.5 border-b border-slate-100/50 dark:border-slate-800/40 shadow-xs">
                  {doctors.slice(0, 3).map((doc) => {
                    const docDetails = getDoctorQueueDetails(doc.id, currentUser.id);
                    const isActive = selectedQueueDoctorId === doc.id;
                    return (
                      <Card 
                        key={doc.id}
                        onClick={() => setSelectedQueueDoctorId(doc.id)}
                        className={cn("p-4 flex flex-col min-w-[135px] border cursor-pointer transition-all duration-200 hover:scale-[1.02] shadow-xs theme-transition", {
                          "border-primary bg-primary-50/50 dark:bg-primary-950/20 font-bold": isActive,
                          "border-custom bg-card-custom": !isActive
                        })}
                      >
                        <span className="text-[9px] text-muted block uppercase font-bold tracking-wider">Desk Monitor</span>
                        <span className="text-xs text-primary mt-1 truncate">{doc.name}</span>
                        <div className="flex justify-between items-center mt-3.5 border-t pt-2.5 border-custom">
                          <span className="text-[9px] font-bold text-muted uppercase">Serving:</span>
                          <span className="text-[12px] font-black text-brand font-heading">{docDetails.currentToken}</span>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* Derived Queue variables for selected doctor */}
                {(() => {
                  const todayStr = getDateOffset(0);
                  const docApptsToday = appointments
                    .filter((a) => a.doctorId === selectedQueueDoctorId && a.date === todayStr)
                    .sort((a, b) => {
                      const tA = parseInt(a.token.replace('T-', ''));
                      const tB = parseInt(b.token.replace('T-', ''));
                      return tA - tB;
                    });
                  
                  const nowServing = docApptsToday.find((a) => a.status === 'Now Serving');
                  const waitingList = docApptsToday.filter((a) => a.status === 'Waiting');
                  const completedList = docApptsToday.filter((a) => a.status === 'Completed');
                  
                  const next5Patients = waitingList.slice(0, 5);
                  const remainingWaiting = waitingList.slice(5);

                  const myApptIndex = waitingList.findIndex(a => a.patientId === currentUser.id);

                  return (
                    <div className="flex flex-col gap-6 md:gap-8">
                      
                      {/* Now Serving Panel */}
                      <Card className="p-5 border border-success/15 bg-success-subtle/10 dark:bg-success-subtle/5 relative z-10 overflow-hidden shadow-premium theme-transition">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-xl -mr-6 -mt-6 animate-pulse" />
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                            </span>
                            <span className="text-[10px] font-bold text-success uppercase tracking-widest leading-none font-heading">NOW SERVING</span>
                          </div>
                          <Badge variant="success" className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5">Room 01</Badge>
                        </div>

                        {nowServing ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-4xl font-black font-heading text-success leading-none">{nowServing.token}</span>
                              <h4 className="font-heading font-extrabold text-[15px] text-primary mt-2">{nowServing.patientName}</h4>
                              <span className="text-[10px] text-muted font-semibold uppercase tracking-wider mt-1 block">
                                {nowServing.isDemo ? 'Demo Patient Profile' : 'Verified Appointment'}
                              </span>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-success-subtle text-success border border-success/15 font-heading font-black text-base flex items-center justify-center shadow-inner">
                              {nowServing.patientName.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-5">
                            <span className="text-xl font-bold text-muted block">All Caught Up!</span>
                            <span className="text-[10px] text-muted font-medium mt-1 block">No patient is currently in the consultation room.</span>
                          </div>
                        )}
                      </Card>

                      {/* Queue Statistics Block */}
                      <div className="grid grid-cols-4 gap-3 relative z-10">
                        <Card padding="compact" className="p-2 sm:p-4 text-center flex flex-col justify-center shadow-xs theme-transition">
                          <span className="text-[9px] text-muted block uppercase font-bold tracking-wider">Waiting</span>
                          <span className="text-xl font-black text-warning mt-1">{waitingList.length}</span>
                        </Card>
                        <Card padding="compact" className="p-2 sm:p-4 text-center flex flex-col justify-center shadow-xs theme-transition">
                          <span className="text-[9px] text-muted block uppercase font-bold tracking-wider">Done</span>
                          <span className="text-xl font-black text-success mt-1">{completedList.length}</span>
                        </Card>
                        <Card padding="compact" className="p-2 sm:p-4 text-center flex flex-col justify-center col-span-2 shadow-xs theme-transition">
                          <span className="text-[9px] text-muted block uppercase font-bold tracking-wider">Est. Wait Time</span>
                          <span className="text-xl font-black text-primary mt-1 font-heading">
                            {waitingList.length * 10} <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">mins</span>
                          </span>
                        </Card>
                      </div>

                      {/* Travel Assistant Calculator */}
                      {myApptIndex > -1 && (
                        <Card className="p-5 flex flex-col gap-4 theme-transition">
                          <h4 className="text-[13px] font-extrabold text-primary flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand" /> Live Travel Assistant</h4>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="flex flex-col gap-1">
                              <label className="block text-[10px] text-muted font-bold uppercase tracking-wider">Your Distance (km)</label>
                              <input 
                                type="number" 
                                step="0.1"
                                value={distanceToClinic}
                                onChange={(e) => setDistanceToClinic(e.target.value)}
                                className="w-full p-2.5 border border-custom rounded-xl bg-bg-custom text-primary text-xs focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="block text-[10px] text-muted font-bold uppercase tracking-wider">Transit Mode</label>
                              <select 
                                value={walkSpeed}
                                onChange={(e) => setWalkSpeed(e.target.value)}
                                className="w-full p-2.5 border border-custom rounded-xl bg-bg-custom text-primary text-xs focus:outline-none focus:border-primary"
                              >
                                <option value="walk">Walking (5 km/h)</option>
                                <option value="normal">Driving (20 km/h)</option>
                                <option value="fast">Traffic delay (10 km/h)</option>
                              </select>
                            </div>
                          </div>
                          <div className="bg-primary-50 dark:bg-primary-950/25 rounded-xl p-3 text-xs text-primary-600 dark:text-primary-400 font-bold flex justify-between items-center border border-primary-200/40">
                            <span>Estimated travel duration:</span>
                            <span>
                              {Math.round(parseFloat(distanceToClinic || '0') / (walkSpeed === 'walk' ? 5 : walkSpeed === 'normal' ? 20 : 10) * 60)} mins
                            </span>
                          </div>
                          {Math.round(parseFloat(distanceToClinic || '0') / (walkSpeed === 'walk' ? 5 : walkSpeed === 'normal' ? 20 : 10) * 60) > myApptIndex * 10 && (
                            <div className="text-[10px] text-danger bg-danger-subtle p-2.5 rounded-xl border border-danger/15 font-bold flex items-center gap-1.5">
                              <ShieldAlert className="w-4 h-4 animate-pulse flex-shrink-0" /> Leave now! Your travel duration exceeds your estimated call slot.
                            </div>
                          )}
                        </Card>
                      )}

                      {/* Next 5 Patients list */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-[13px] font-bold text-muted uppercase tracking-widest">Next 5 Patients</h4>
                          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Waiting List</span>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          {next5Patients.length > 0 ? (
                            next5Patients.map((item, idx) => {
                              const isMe = item.patientId === currentUser.id;
                              return (
                                <div 
                                  key={item.id}
                                  className={cn("p-3.5 rounded-2xl flex justify-between items-center text-xs transition-all border", {
                                    "bg-primary-50/50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/40 font-bold shadow-xs": isMe,
                                    "bg-white dark:bg-slate-900 border-slate-100/80 dark:border-slate-800": !isMe
                                  })}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className={cn("w-9 h-9 rounded-full flex items-center justify-center font-heading font-black text-[11px] shadow-xs", {
                                      "bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300": !isMe,
                                      "bg-primary text-white": isMe
                                    })}>
                                      {item.token}
                                    </span>
                                    <div>
                                      <span className={cn("block text-[13px]", { "text-slate-800 dark:text-slate-200": !isMe, "text-primary font-extrabold": isMe })}>
                                        {item.patientName} {isMe && '(You)'}
                                      </span>
                                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">Estimated wait: {idx * 10 + 10} mins</span>
                                    </div>
                                  </div>
                                  
                                  <Badge variant={isMe ? 'primary' : 'neutral'} size="xs" className="font-bold text-[9px] uppercase tracking-wider">
                                    Waiting
                                  </Badge>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-5 bg-white rounded-2xl border border-slate-100/80 text-slate-400 text-xs font-semibold">
                              No patients waiting next.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Extended Waiting List */}
                      {remainingWaiting.length > 0 && (
                        <div>
                          <h4 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Extended Waiting ({remainingWaiting.length})</h4>
                          <div className="flex flex-col gap-2.5 max-h-40 overflow-y-auto pr-1 scrollbar-none">
                            {remainingWaiting.map((item) => {
                              const isMe = item.patientId === currentUser.id;
                              return (
                                <div key={item.id} className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center text-xs shadow-xs">
                                  <span className="font-semibold text-slate-600 dark:text-slate-400">{item.token} — {item.patientName} {isMe && '(You)'}</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Wait: {((next5Patients.length + remainingWaiting.indexOf(item)) * 10) + 10}m</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Completed Today List */}
                      {completedList.length > 0 && (
                        <div>
                          <h4 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Completed Today ({completedList.length})</h4>
                          <div className="flex flex-col gap-2.5 max-h-40 overflow-y-auto pr-1 scrollbar-none">
                            {completedList.map((item) => (
                              <div key={item.id} className="p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center text-xs text-slate-500">
                                <span className="font-bold text-slate-600 dark:text-slate-400">{item.token} — {item.patientName}</span>
                                <Badge variant="success" size="xs" dot>
                                  Completed
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })()}

              </div>
            )}

            {/* --- TAB VIEW 4: HEALTH RECORDS & REPORTS --- */}
            {patientTab === 'records' && (
              <div className="px-6 flex flex-col gap-6 flex-1 pb-10">
                
                {/* Health subtab selector */}
                <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-1.5 rounded-2xl grid grid-cols-4 gap-1.5 text-center text-[12px] font-bold shadow-xs">
                  <button 
                    onClick={() => setHealthSubTab('dashboard')}
                    className={cn("py-2.5 rounded-xl transition-all duration-200", { "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm": healthSubTab === 'dashboard', "text-slate-500 hover:text-slate-800": healthSubTab !== 'dashboard' })}
                  >
                    Vitals
                  </button>
                  <button 
                    onClick={() => setHealthSubTab('history')}
                    className={cn("py-2.5 rounded-xl transition-all duration-200", { "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm": healthSubTab === 'history', "text-slate-500 hover:text-slate-800": healthSubTab !== 'history' })}
                  >
                    Visits
                  </button>
                  <button 
                    onClick={() => setHealthSubTab('medicines')}
                    className={cn("py-2.5 rounded-xl transition-all duration-200", { "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm": healthSubTab === 'medicines', "text-slate-500 hover:text-slate-800": healthSubTab !== 'medicines' })}
                  >
                    Pills
                  </button>
                  <button 
                    onClick={() => setHealthSubTab('lab')}
                    className={cn("py-2.5 rounded-xl transition-all duration-200", { "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-sm": healthSubTab === 'lab', "text-slate-500 hover:text-slate-800": healthSubTab !== 'lab' })}
                  >
                    Labs
                  </button>
                </div>

                {/* SubTab Content 1: Vitals Trends (Animated SVGs) */}
                {healthSubTab === 'dashboard' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                    {/* SVG BP Trend Chart */}
                    <Card variant="elevated" className="p-5 border border-slate-100/70 flex flex-col gap-4 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Monthly Blood Pressure (mmHg)</span>
                        <Badge variant="primary" size="xs">Sys / Dia</Badge>
                      </div>
                      
                      {/* Simple clean Mock graph */}
                      <div className="h-32 w-full flex items-end justify-between px-2 pt-4 relative">
                        {/* Horizontal GRID Lines */}
                        <div className="absolute inset-x-0 bottom-0 border-b border-slate-100/80 text-[8px] text-slate-400 flex justify-between pr-2 pb-0.5"><span>60</span></div>
                        <div className="absolute inset-x-0 bottom-10 border-b border-slate-100/80 text-[8px] text-slate-400 flex justify-between pr-2 pb-0.5"><span>80</span></div>
                        <div className="absolute inset-x-0 bottom-20 border-b border-slate-100/80 text-[8px] text-slate-400 flex justify-between pr-2 pb-0.5"><span>100</span></div>
                        <div className="absolute inset-x-0 bottom-28 border-b border-slate-100/80 text-[8px] text-slate-400 flex justify-between pr-2 pb-0.5"><span>120</span></div>

                        {/* Graph points */}
                        <div className="flex flex-col items-center gap-1 relative z-10">
                          <div className="w-2.5 h-16 bg-primary/20 rounded-full flex flex-col justify-between">
                            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-slow" />
                            <span className="w-2.5 h-2.5 bg-secondary rounded-full" />
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">Apr</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 relative z-10">
                          <div className="w-2.5 h-20 bg-primary/20 rounded-full flex flex-col justify-between">
                            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-slow" />
                            <span className="w-2.5 h-2.5 bg-secondary rounded-full" />
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">May</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 relative z-10">
                          <div className="w-2.5 h-18 bg-primary/20 rounded-full flex flex-col justify-between">
                            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-slow" />
                            <span className="w-2.5 h-2.5 bg-secondary rounded-full" />
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">Jun</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 relative z-10">
                          <div className="w-2.5 h-24 bg-primary/25 rounded-full flex flex-col justify-between border border-primary/50">
                            <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse-slow" />
                            <span className="w-2.5 h-2.5 bg-secondary rounded-full" />
                          </div>
                          <span className="text-[9px] font-extrabold text-primary uppercase mt-1">Jul</span>
                        </div>
                      </div>
                    </Card>

                    {/* Vitals Cards Detail */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <Card variant="elevated" className="p-5 flex flex-col gap-2.5 border border-slate-100/70 hover:shadow-premium transition-all duration-200">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Sugar Level</span>
                        <div className="flex justify-between items-end">
                          <span className="text-2xl font-black font-heading text-slate-800 dark:text-slate-100">{currentUser.vitals.sugarLevel}</span>
                          <span className="text-[10px] font-semibold text-slate-400 pb-0.5">mg/dL</span>
                        </div>
                        <Badge variant="success" size="xs" className="self-start text-[9px] font-bold">Normal</Badge>
                      </Card>
                      <Card variant="elevated" className="p-5 flex flex-col gap-2.5 border border-slate-100/70 hover:shadow-premium transition-all duration-200">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Cholesterol</span>
                        <div className="flex justify-between items-end">
                          <span className="text-2xl font-black font-heading text-slate-800 dark:text-slate-100">{currentUser.vitals.cholesterol}</span>
                          <span className="text-[10px] font-semibold text-slate-400 pb-0.5">mg/dL</span>
                        </div>
                        <Badge variant="success" size="xs" className="self-start text-[9px] font-bold">Normal</Badge>
                      </Card>
                    </div>
                  </motion.div>
                )}

                {/* SubTab Content 2: Visits history timeline */}
                {healthSubTab === 'history' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                    {appointments.filter(a => a.patientId === currentUser.id && a.status === 'Completed').map((appt) => (
                      <Card key={appt.id} className="p-5 flex flex-col gap-3.5 border border-slate-100/70 shadow-xs hover:shadow-premium transition-all duration-200 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[11px] font-bold text-slate-400 block">{appt.date}</span>
                            <h4 className="font-heading font-extrabold text-[15px] text-slate-800 dark:text-slate-100 mt-1">{appt.doctorName}</h4>
                            <span className="text-primary font-bold text-[12px] block mt-1">{appt.clinicName}</span>
                          </div>
                          <Badge variant="success" size="sm">Completed</Badge>
                        </div>
                        
                        <div className="bg-slate-50/70 dark:bg-slate-900 p-3 rounded-2xl text-slate-600 dark:text-slate-400 border border-slate-100/50">
                          <strong>Diagnosis:</strong> {appt.notes || 'Routine Consult'}
                        </div>

                        {appt.prescription && appt.prescription.length > 0 && (
                          <div>
                            <span className="font-bold text-gray-700 block mb-1">Prescribed Medicines:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {appt.prescription.map((rx) => (
                                <Badge key={rx.id} variant="secondary" className="text-[9px]">
                                  {rx.name} ({rx.dosage})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </motion.div>
                )}

                {/* SubTab Content 3: Active Medicines */}
                {healthSubTab === 'medicines' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                    {appointments.filter(a => a.patientId === currentUser.id && a.prescription).flatMap(a => a.prescription || []).map((rx) => (
                      <Card key={rx.id} className="p-4.5 flex justify-between items-center border border-slate-100/80 hover:shadow-premium transition-all duration-200 text-xs shadow-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500">
                            <Pill className="w-5.5 h-5.5" />
                          </div>
                          <div>
                            <h4 className="font-heading font-extrabold text-[14px] text-slate-800 dark:text-slate-100 leading-snug">{rx.name}</h4>
                            <span className="text-slate-400 block mt-1 font-semibold text-[11px]">{rx.dosage} • {rx.timing}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Duration</span>
                          <span className="font-extrabold text-slate-700 dark:text-slate-200 mt-1 block">{rx.duration}</span>
                        </div>
                      </Card>
                    ))}
                  </motion.div>
                )}

                {/* SubTab Content 4: Lab Reports */}
                {healthSubTab === 'lab' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                    {MOCK_LAB_REPORTS.map((report) => (
                      <Card 
                        key={report.id} 
                        hoverable
                        onClick={() => setSelectedLabReport(report)}
                        className="p-4.5 flex justify-between items-center border border-slate-100/80 shadow-xs text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-500">
                            <FileText className="w-5.5 h-5.5" />
                          </div>
                          <div>
                            <h4 className="font-heading font-extrabold text-[14px] text-slate-800 dark:text-slate-100 leading-snug">{report.title}</h4>
                            <span className="text-slate-400 block mt-1 font-semibold text-[11px]">{report.date} • {report.doctorName}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={report.status === 'Normal' ? 'success' : 'error'}
                          size="xs"
                          dot
                        >
                          {report.status}
                        </Badge>
                      </Card>
                    ))}
                  </motion.div>
                )}

              </div>
            )}

            {/* --- TAB VIEW 5: PATIENT PROFILE, SETTINGS & SOS --- */}
            {patientTab === 'profile' && (
              <div className="px-6 flex flex-col gap-6 flex-1 pb-10">
                {/* Profile card summary */}
                <Card variant="elevated" className="p-6 flex items-center gap-4.5 border border-slate-100/70 shadow-sm bg-white">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl font-bold font-heading shadow-md border-2 border-white">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-[17px] text-slate-800 dark:text-slate-100 leading-snug">{currentUser.name}</h4>
                    <span className="text-xs text-slate-400 block mt-1 font-semibold">{currentUser.phone}</span>
                    <span className="text-xs text-slate-400 block font-semibold">{currentUser.email}</span>
                  </div>
                </Card>

                {/* Emergency SOS Button */}
                <Card 
                  onClick={() => setSosActive(!sosActive)}
                  className={cn("p-4.5 text-center cursor-pointer transition-all border shadow-sm rounded-2xl", {
                    "bg-red-650 text-white border-red-650 shadow-lg animate-pulse": sosActive,
                    "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200/50 hover:bg-red-100/50": !sosActive
                  })}
                >
                  <div className="flex items-center justify-center gap-2.5 font-black font-heading text-sm uppercase tracking-wider">
                    <ShieldAlert className="w-5 h-5 animate-pulse" /> 
                    {sosActive ? 'SOS Active - Contacting Help' : 'Emergency SOS Alert'}
                  </div>
                </Card>

                {/* Patient medical conditions detail */}
                <Card variant="elevated" className="p-5 flex flex-col gap-4 border border-slate-100/70 shadow-sm bg-white text-xs">
                  <h4 className="font-heading font-bold text-[13px] text-slate-700 dark:text-slate-200 uppercase tracking-widest border-b pb-2">Medical ID Card</h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-slate-500">
                    <div>
                      <span className="font-bold block text-[10px] text-slate-400 uppercase tracking-wider">Blood Group</span>
                      <strong className="text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">{currentUser.bloodGroup}</strong>
                    </div>
                    <div>
                      <span className="font-bold block text-[10px] text-slate-400 uppercase tracking-wider">Emergency Contact</span>
                      <strong className="text-slate-800 dark:text-slate-100 text-sm mt-0.5 block truncate">{currentUser.emergencyContact.name} ({currentUser.emergencyContact.relation})</strong>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3.5">
                    <span className="font-bold block text-[10px] text-slate-400 uppercase tracking-wider mb-2">Medical Conditions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentUser.medicalConditions.map(cond => <Badge key={cond} variant="neutral" size="xs" className="font-bold">{cond}</Badge>)}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3.5">
                    <span className="font-bold block text-[10px] text-slate-400 uppercase tracking-wider mb-2">Known Allergies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentUser.allergies.map(all => <Badge key={all} variant="error" size="xs" dot className="font-bold">{all}</Badge>)}
                    </div>
                  </div>
                </Card>

                {/* Settings list */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Preferences</h4>
                  
                  {/* Dark Mode */}
                  <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs shadow-xs transition-all">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-[13px]">Dark Theme Mode</span>
                    <button onClick={() => setDarkMode(!darkMode)} className="text-primary focus:outline-none">
                      {darkMode ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
                    </button>
                  </div>

                  {/* PWA Settings */}
                  <h4 className="text-[13px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 mt-4">Application Details (PWA)</h4>

                  {/* Install App */}
                  <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs shadow-xs transition-all">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-700 dark:text-slate-200 text-[13px]">Install Application</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Enable one-tap access on home screen</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => {
                        if (pwaDeferredPrompt) {
                          pwaDeferredPrompt.prompt();
                          pwaDeferredPrompt.userChoice.then((choiceResult: any) => {
                            if (choiceResult.outcome === 'accepted') {
                              console.log('[PWA] User installed via Settings');
                            }
                            setPwaDeferredPrompt(null);
                          });
                        } else {
                          alert("BookMyDoc is already running in standalone PWA mode or the prompt is not supported by your browser.");
                        }
                      }}
                      className="h-8.5 rounded-xl font-bold font-sans px-4"
                    >
                      Install App
                    </Button>
                  </div>

                  {/* Network Status */}
                  <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs shadow-xs transition-all">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-[13px]">Offline Status</span>
                    <Badge variant={isOffline ? 'error' : 'success'} size="xs" dot>
                      {isOffline ? 'Offline' : 'Connected / Online'}
                    </Badge>
                  </div>

                  {/* Cache Storage */}
                  <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs shadow-xs transition-all">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-[13px]">Storage Utilised</span>
                    <strong className="text-slate-800 dark:text-slate-100 font-bold">{pwaStorageUsed}</strong>
                  </div>

                  {/* Check for Updates */}
                  <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs shadow-xs transition-all">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-[13px]">Check for Updates</span>
                    <button 
                      onClick={() => {
                        alert("Checking for PWA updates... Cache is fully optimized. Running version v1.2.0-pwa.");
                      }}
                      className="text-[#0F8B8D] font-bold hover:underline focus:outline-none text-xs"
                    >
                      Check Now
                    </button>
                  </div>

                  {/* App Version */}
                  <div className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs shadow-xs transition-all">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-[13px]">App Version Info</span>
                    <span className="text-slate-400 font-bold">v1.2.0-pwa</span>
                  </div>

                  {/* Log Out */}
                  <button 
                    onClick={() => setView('auth')}
                    className="p-4.5 bg-white dark:bg-slate-900 border border-slate-150/70 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs shadow-xs hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-450 font-bold transition-all"
                  >
                    <span className="text-[13px]">Log Out Account</span>
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>

              </div>
            )}

            {/* Bottom Nav Bar */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-150/60 dark:border-slate-800 px-6 flex justify-between items-center z-30 safe-bottom shadow-lg">
              <button 
                onClick={() => setPatientTab('home')}
                className={cn("flex flex-col items-center gap-1 flex-1 text-slate-400 hover:text-slate-500 transition-colors focus:outline-none", { "text-primary": patientTab === 'home' })}
              >
                <Compass className="w-5.5 h-5.5" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Home</span>
              </button>
              
              <button 
                onClick={() => { setSelectedDoctor(null); setPatientTab('appointments'); }}
                className={cn("flex flex-col items-center gap-1 flex-1 text-slate-400 hover:text-slate-500 transition-colors focus:outline-none", { "text-primary": patientTab === 'appointments' })}
              >
                <Calendar className="w-5.5 h-5.5" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Book</span>
              </button>

              <button 
                onClick={() => setPatientTab('queue')}
                className={cn("flex flex-col items-center gap-1 flex-1 text-slate-400 hover:text-slate-500 transition-colors focus:outline-none", { "text-primary": patientTab === 'queue' })}
              >
                <Activity className="w-5.5 h-5.5 animate-pulse" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Live Queue</span>
              </button>

              <button 
                onClick={() => setPatientTab('records')}
                className={cn("flex flex-col items-center gap-1 flex-1 text-slate-400 hover:text-slate-500 transition-colors focus:outline-none", { "text-primary": patientTab === 'records' })}
              >
                <FileText className="w-5.5 h-5.5" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Health</span>
              </button>

              <button 
                onClick={() => setPatientTab('profile')}
                className={cn("flex flex-col items-center gap-1 flex-1 text-slate-400 hover:text-slate-500 transition-colors focus:outline-none", { "text-primary": patientTab === 'profile' })}
              >
                <User className="w-5.5 h-5.5" />
                <span className="text-[8px] font-bold uppercase tracking-widest">Me</span>
              </button>
            </div>

          </div>
        )}

        {/* --- 6. RECEPTIONIST CONSOLE DASHBOARD (LIFTED OUTSIDE MOBILE CONTAINER) --- */}

        {/* --- 7. DOCTOR DASHBOARD STATION (LIFTED OUTSIDE MOBILE CONTAINER) --- */}

        {/* --- 8. GLOBAL MODAL OVERLAYS (LAB REPORT PREVIEW, NOTIFICATION CENTER) --- */}
        
        {/* Lab Report Preview Modal */}
        {selectedLabReport && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-fade-in">
            <Card variant="elevated" className="w-full max-w-sm p-6 bg-white relative flex flex-col gap-4 text-xs shadow-premium rounded-3xl border border-slate-100">
              <button 
                onClick={() => setSelectedLabReport(null)}
                className="absolute top-4.5 right-4.5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 border-b pb-3.5 border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">DIGITAL LAB REPORT</span>
                  <h4 className="font-heading font-extrabold text-sm text-slate-800">{selectedLabReport.title}</h4>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Ordered By:</span>
                  <span className="font-bold text-slate-700">{selectedLabReport.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Test Date:</span>
                  <span className="font-bold text-slate-700">{selectedLabReport.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Report Status:</span>
                  <Badge variant={selectedLabReport.status === 'Normal' ? 'success' : 'error'} size="xs" dot>{selectedLabReport.status}</Badge>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed">
                <strong>Test Highlights:</strong><br/>
                {selectedLabReport.valueSummary}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2 border-t pt-4 border-slate-100">
                <Button variant="secondary" className="h-11 rounded-2xl text-xs font-bold">
                  <Download className="w-4 h-4 mr-1.5" /> Download
                </Button>
                <Button variant="outline" className="h-11 rounded-2xl text-xs font-bold border-slate-200">
                  <Share2 className="w-4 h-4 mr-1.5" /> Share
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Reschedule Modal Overlay */}
        {rescheduleAppt && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs z-[100] flex items-center justify-center p-6 animate-fade-in">
            <Card variant="elevated" className="w-full max-w-sm p-6 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 relative flex flex-col gap-4 text-xs shadow-premium rounded-3xl animate-scale-in">
              <button 
                onClick={() => setRescheduleAppt(null)}
                className="absolute top-4.5 right-4.5 p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 border-b pb-3.5 border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">SCHEDULING ASSISTANT</span>
                  <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-slate-100">Reschedule Appointment</h4>
                </div>
              </div>

              {rescheduleError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-2.5 rounded-xl font-medium">
                  {rescheduleError}
                </div>
              )}
              {rescheduleSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-2.5 rounded-xl font-medium">
                  {rescheduleSuccess}
                </div>
              )}

              <div className="flex flex-col gap-3.5">
                {/* Original Details */}
                <div className="bg-slate-50/70 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-slate-500">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5">Original Slot</span>
                  <div className="flex justify-between font-medium">
                    <span>Doctor: {rescheduleAppt.doctorName}</span>
                    <span>Token: {rescheduleAppt.token}</span>
                  </div>
                  <div className="flex justify-between font-medium mt-1">
                    <span>Date: {rescheduleAppt.date}</span>
                    <span>Time: {rescheduleAppt.time}</span>
                  </div>
                </div>

                {/* Form fields */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-600 dark:text-slate-400">Select Dermatologist</label>
                  <select 
                    value={rescheduleDoctorId}
                    onChange={(e) => setRescheduleDoctorId(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary"
                  >
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-600 dark:text-slate-400">Select Date</label>
                    <input 
                      type="date"
                      min={getDateOffset(0)}
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-xs focus:outline-none focus:border-primary dark:text-slate-200"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-slate-600 dark:text-slate-400">Select Time Slot</label>
                    <select 
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-xs focus:outline-none focus:border-primary dark:text-slate-200"
                    >
                      {/* Dynamically list slots for selected doctor */}
                      {(() => {
                        const selectedDoc = doctors.find(d => d.id === rescheduleDoctorId) || doctors[0];
                        const morningSlots = selectedDoc.availableSlots?.morning || [];
                        const afternoonSlots = selectedDoc.availableSlots?.afternoon || [];
                        const eveningSlots = selectedDoc.availableSlots?.evening || [];
                        const allSlots = [...morningSlots, ...afternoonSlots, ...eveningSlots];
                        
                        const slotsToShow = allSlots.length > 0 ? allSlots : ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '05:00 PM', '06:00 PM'];
                        return slotsToShow.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ));
                      })()}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-600 dark:text-slate-400">Reason for Rescheduling</label>
                  <input 
                    type="text"
                    placeholder="E.g., Medical emergency, travel issues..."
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 dark:bg-slate-800 dark:border-slate-700 text-xs focus:outline-none focus:border-primary dark:text-slate-200"
                  />
                </div>

                {/* Reschedule History Logs */}
                {rescheduleAppt.rescheduleHistory && rescheduleAppt.rescheduleHistory.length > 0 && (
                  <div className="mt-2 border-t pt-3.5 border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-2">Audit Trail / History</span>
                    <div className="flex flex-col gap-2 max-h-24 overflow-y-auto pr-1 scrollbar-none">
                      {rescheduleAppt.rescheduleHistory.map((h, i) => (
                        <div key={i} className="bg-slate-50/50 dark:bg-slate-800/40 p-2.5 rounded-xl text-[10px] text-slate-500 border border-slate-100/50 leading-relaxed">
                          Rescheduled to <strong>{h.newDate} at {h.newTime}</strong> by {h.rescheduledBy} ({h.reason || 'No reason given'})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4 border-t pt-4 border-slate-100 dark:border-slate-800">
                  <Button 
                    variant="outline" 
                    className="h-11 rounded-2xl text-xs font-bold border-slate-200"
                    onClick={() => setRescheduleAppt(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    className="h-11 rounded-2xl text-xs font-bold shadow-sm bg-[#0F8B8D] hover:bg-[#0D7A7C] text-white"
                    onClick={handleRescheduleSubmit}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Notification Center overlay drawer */}
        {showNotificationOverlay && (
          <>
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-45"
              onClick={() => setShowNotificationOverlay(false)}
            />
            <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200/80 dark:border-slate-800 z-50 flex flex-col p-6 shadow-2xl animate-slide-in-right">
              <div className="flex justify-between items-center border-b pb-4 mb-4 border-slate-100 dark:border-slate-800">
                <h4 className="font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 text-base"><Bell className="w-5 h-5 text-primary" /> Notifications</h4>
                <button 
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({...n, read: true})));
                    setShowNotificationOverlay(false);
                  }}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1 scrollbar-none">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={cn("p-3 rounded-xl border text-xs flex flex-col gap-1 transition-colors", {
                      "bg-primary-light/40 border-primary/20 dark:bg-primary-950/20 dark:border-primary-900/30 dark:text-primary-300 font-medium": !notif.read,
                      "bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400": notif.read
                    })}
                  >
                    <div className="flex justify-between items-start font-bold text-slate-800 dark:text-slate-200">
                      <span className="capitalize">{notif.type} Reminder</span>
                      <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500">{notif.time}</span>
                    </div>
                    <p className="leading-relaxed mt-0.5 text-slate-650 dark:text-slate-350">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
          </div>
        )}

      {/* --- PWA INSTALL PROMPT BOTTOM SHEET --- */}
      <AnimatePresence>
        {showPwaPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 inset-x-0 z-50 p-6 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-t-3xl flex flex-col gap-4 max-w-md mx-auto"
          >
            <div className="flex gap-4 items-start text-xs">
              <div className="w-12 h-12 rounded-2xl bg-primary-light/50 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Stethoscope className="w-6 h-6 text-[#0F8B8D]" />
              </div>
              <div className="flex-1">
                <h4 className="font-heading font-black text-slate-800 dark:text-slate-100 text-sm">Install BookMyDoc</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  No more searching for the website. Install BookMyDoc for one-tap access.
                </p>
              </div>
              <button 
                onClick={() => {
                  setShowPwaPrompt(false);
                  sessionStorage.setItem('pwa-prompt-dismissed', 'true');
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => {
                  setShowPwaPrompt(false);
                  sessionStorage.setItem('pwa-prompt-dismissed', 'true');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 focus:outline-none"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowPwaPrompt(false);
                  sessionStorage.setItem('pwa-prompt-dismissed', 'true');
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-400 hover:bg-slate-50 focus:outline-none"
              >
                Not Now
              </button>
              <Button
                onClick={() => {
                  if (pwaDeferredPrompt) {
                    pwaDeferredPrompt.prompt();
                    pwaDeferredPrompt.userChoice.then((choiceResult: any) => {
                      if (choiceResult.outcome === 'accepted') {
                        console.log('[PWA] User accepted install');
                      }
                      setPwaDeferredPrompt(null);
                      setShowPwaPrompt(false);
                    });
                  } else {
                    alert("To install BookMyDoc, open your browser options and select 'Add to Home Screen'.");
                    setShowPwaPrompt(false);
                  }
                }}
                className="h-10 rounded-xl px-5 text-xs font-bold font-sans shadow-sm"
              >
                Install
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PWA SUCCESS INSTALLATION TOAST --- */}
      <AnimatePresence>
        {showPwaSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 inset-x-6 z-55 max-w-sm mx-auto bg-emerald-50 border border-emerald-200/50 p-4 rounded-2xl shadow-xl flex items-center gap-3 text-xs"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-xs font-bold text-slate-800 block">BookMyDoc Installed!</strong>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Application successfully added to home screen.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PWA OFFLINE DETECTOR OVERLAY --- */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6 text-center"
          >
            <Card variant="elevated" className="w-full max-w-sm p-8 bg-white border border-slate-100 flex flex-col items-center gap-5 shadow-2xl rounded-3xl animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-2xs">
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-slate-800">No Internet Connection</h3>
                <p className="text-xs text-slate-400 font-semibold mt-2.5 leading-relaxed">
                  It looks like you are currently offline. Please check your network connection and try again.
                </p>
              </div>
              <Button
                onClick={() => {
                  if (typeof navigator !== 'undefined') {
                    setIsOffline(!navigator.onLine);
                    if (navigator.onLine) {
                      alert("Reconnected successfully!");
                    }
                  }
                }}
                className="w-full h-11 rounded-2xl font-sans font-bold shadow-sm"
              >
                Retry Connection
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FLOATING DEMO ROLE SWITCHER --- */}
      {showRoleSwitcher && view !== 'splash' && view !== 'onboarding' && (
        <div className="hidden lg:flex fixed top-3 left-1/2 -translate-x-1/2 z-[45] glass-morphic shadow-premium rounded-full px-1.5 py-1.5 items-center gap-0.5">
          <span className="text-[9px] font-bold text-slate-400 mx-2 uppercase tracking-widest">Demo</span>
          <button 
            onClick={() => { setView('app'); setPatientTab('home'); }} 
            className={cn("text-[11px] font-bold px-3 py-1 rounded-full transition-all duration-200", {
              "gradient-primary text-white shadow-sm": view === 'app',
              "text-slate-500 hover:bg-slate-100": view !== 'app'
            })}
          >
            Patient
          </button>
          <button 
            onClick={() => setView('receptionist')} 
            className={cn("text-[11px] font-bold px-3 py-1 rounded-full transition-all duration-200", {
              "gradient-primary text-white shadow-sm": (view as string) === 'receptionist',
              "text-slate-500 hover:bg-slate-100": (view as string) !== 'receptionist'
            })}
          >
            Receptionist
          </button>
          <button 
            onClick={() => setView('doctor')} 
            className={cn("text-[11px] font-bold px-3 py-1 rounded-full transition-all duration-200", {
              "gradient-primary text-white shadow-sm": (view as string) === 'doctor',
              "text-slate-500 hover:bg-slate-100": (view as string) !== 'doctor'
            })}
          >
            Doctor
          </button>
        </div>
      )}

    </div>
  );
}
