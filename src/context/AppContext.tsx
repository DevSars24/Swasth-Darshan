'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Doctor, Medicine, MOCK_DOCTORS, MOCK_TIMELINE_MEDICINES } from '../lib/mock-data';

export type UserRole = 'patient' | 'doctor' | 'admin';
export type FontSize = 'small' | 'medium' | 'large';

export interface Appointment {
  id: string;
  doctor: Doctor;
  day: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  patientName: string;
  type: string;
}

export interface VerificationFile {
  name: string;
  size: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor';
  text: string;
  time: string;
}

interface AppContextType {
  // Navigation & Auth
  currentScreen: string;
  navigate: (screen: string) => void;
  userRole: UserRole;
  setRole: (role: UserRole) => void;
  // switchDemoRole: safely changes role AND navigates to correct dashboard
  switchDemoRole: (role: UserRole) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  userName: string;
  userAvatar: string;

  // Companion care opt-in
  companionCareEnabled: boolean;
  setCompanionCareEnabled: (v: boolean) => void;

  // Accessibility Settings
  selectedLanguage: string;
  setLanguage: (lang: string) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  voiceAccessibility: boolean;
  setVoiceAccessibility: (enabled: boolean) => void;
  
  // Layout views
  isFullscreenDesktop: boolean;
  toggleFullscreenDesktop: () => void;

  // Patient App States
  selectedDoctor: Doctor | null;
  setSelectedDoctor: (doc: Doctor | null) => void;
  appointments: Appointment[];
  bookAppointment: (doctor: Doctor, day: string, time: string) => void;
  medicines: Medicine[];
  toggleMedicineTaken: (id: string) => void;
  companionStreak: number;
  incrementStreak: () => void;
  symptomText: string;
  setSymptomText: (text: string) => void;
  
  // Rating states
  recentCompletedAppointment: Appointment | null;
  setRecentCompletedAppointment: (app: Appointment | null) => void;
  submitRating: (doctorId: string, stars: number, comment: string) => void;

  // Chat states
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  isDoctorTyping: boolean;

  // Doctor Portal States
  verificationFiles: VerificationFile[];
  addVerificationFile: (name: string, size: string) => void;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  setVerificationStatus: (status: 'pending' | 'approved' | 'rejected') => void;
  
  // Reset
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [currentScreen, setCurrentScreen] = useState<string>('landing');
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Karan Singh');
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [companionCareEnabled, setCompanionCareEnabled] = useState(true);

  // Accessibility Settings
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [voiceAccessibility, setVoiceAccessibility] = useState<boolean>(false);
  
  // Layout toggler
  const [isFullscreenDesktop, setIsFullscreenDesktop] = useState<boolean>(false);

  // Patient states
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'app-init-1',
      doctor: MOCK_DOCTORS[0],
      day: 'Yesterday',
      time: '04:15 PM',
      status: 'completed',
      patientName: 'Karan Singh',
      type: 'General Checkup'
    }
  ]);
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_TIMELINE_MEDICINES);
  const [companionStreak, setCompanionStreak] = useState<number>(14);
  const [symptomText, setSymptomText] = useState<string>('');
  
  // Rating states
  const [recentCompletedAppointment, setRecentCompletedAppointment] = useState<Appointment | null>(null);

  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm-1', sender: 'doctor', text: 'Namaste! How can I help you today?', time: '10:00 AM' }
  ]);
  const [isDoctorTyping, setIsDoctorTyping] = useState<boolean>(false);

  // Doctor Verification
  const [verificationFiles, setVerificationFiles] = useState<VerificationFile[]>([
    { name: 'medical_license_registration.pdf', size: '1.4 MB', uploadedAt: 'Today, 11:30 AM', status: 'pending' },
    { name: 'mbbs_degree_certificate.pdf', size: '2.8 MB', uploadedAt: 'Today, 11:32 AM', status: 'pending' }
  ]);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  // Synchronize Clerk auth states
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        setIsLoggedIn(true);
        setUserName(user.fullName || user.firstName || 'Karan Singh');
        setUserAvatar(user.imageUrl || '');
        if (user.primaryPhoneNumber?.phoneNumber) {
          setPhoneNumber(user.primaryPhoneNumber.phoneNumber);
        }
      } else {
        setIsLoggedIn(false);
      }
    }
  }, [isSignedIn, user, isLoaded]);

  // ─── STRICT NAVIGATION: screen is always constrained to role ─────────────
  const navigate = (screen: string) => {
    // ROUTE GUARD: prevent cross-role navigation
    const doctorScreens = ['doctor-dashboard'];
    const patientScreens = [
      'patient-dashboard','symptom-search','doctor-results','doctor-profile',
      'booking-confirm','timeline','appointments','chat','video-call','rating',
      'companion-care','emergency-confirm','emergency-live','transparency'
    ];

    if (userRole === 'patient' && doctorScreens.includes(screen)) {
      setCurrentScreen('patient-dashboard');
      return;
    }
    if (userRole === 'doctor' && patientScreens.includes(screen)) {
      setCurrentScreen('doctor-dashboard');
      return;
    }
    setCurrentScreen(screen);
  };

  const setRole = (role: UserRole) => {
    setUserRole(role);
  };

  /** switchDemoRole: ONLY for demo use — changes role AND resets screen to correct dashboard */
  const switchDemoRole = (role: UserRole) => {
    setUserRole(role);
    setSelectedDoctor(null);
    setCurrentScreen(role === 'doctor' ? 'doctor-dashboard' : role === 'admin' ? 'admin-dashboard' : 'patient-dashboard');
  };

  const setLanguage = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const toggleFullscreenDesktop = () => {
    setIsFullscreenDesktop(prev => !prev);
  };

  const bookAppointment = (doctor: Doctor, day: string, time: string) => {
    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      doctor,
      day,
      time,
      status: 'scheduled',
      patientName: userName,
      type: 'Video Consultation'
    };
    setAppointments((prev) => [newAppointment, ...prev]);
    navigate('booking-confirm');
  };

  const toggleMedicineTaken = (id: string) => {
    setMedicines((prev) =>
      prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med))
    );
  };

  const incrementStreak = () => {
    setCompanionStreak((prev) => prev + 1);
  };

  const submitRating = (doctorId: string, stars: number, comment: string) => {
    console.log(`Submitted rating for ${doctorId}: ${stars} stars, text: ${comment}`);
    setRecentCompletedAppointment(null);
    navigate('appointments');
  };

  const sendChatMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, newMessage]);

    setIsDoctorTyping(true);
    setTimeout(() => {
      setIsDoctorTyping(false);
      const doctorReplies = [
        'Aap bilkul chinta na karein. Make sure to drink warm water and rest.',
        'Please take the Paracetamol medicine scheduled in your timeline.',
        'If the temperature exceeds 101°F, please connect with me immediately over video call.',
        'Let us wait for 2 days. If fevers persist, we will write a blood test.'
      ];
      const randomReply = doctorReplies[Math.floor(Math.random() * doctorReplies.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-doc-${Date.now()}`,
          sender: 'doctor',
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 2000);
  };

  const addVerificationFile = (name: string, size: string) => {
    const newFile: VerificationFile = {
      name,
      size,
      uploadedAt: 'Just now',
      status: 'pending'
    };
    setVerificationFiles((prev) => [...prev, newFile]);
  };

  const resetApp = () => {
    if (isSignedIn) {
      signOut();
    }
    setCurrentScreen('landing');
    setPhoneNumber('');
    setIsLoggedIn(false);
    setSelectedDoctor(null);
    setUserRole('patient');
    setAppointments([
      {
        id: 'app-init-1',
        doctor: MOCK_DOCTORS[0],
        day: 'Yesterday',
        time: '04:15 PM',
        status: 'completed',
        patientName: 'Karan Singh',
        type: 'General Checkup'
      }
    ]);
    setMedicines(MOCK_TIMELINE_MEDICINES);
    setCompanionStreak(14);
    setSymptomText('');
    setRecentCompletedAppointment(null);
    setChatMessages([
      { id: 'm-1', sender: 'doctor', text: 'Namaste! How can I help you today?', time: '10:00 AM' }
    ]);
  };

  // Adjust font size on root element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
      root.classList.add(`font-size-${fontSize}`);
    }
  }, [fontSize]);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigate,
        userRole,
        setRole,
        switchDemoRole,
        phoneNumber,
        setPhoneNumber,
        isLoggedIn,
        setIsLoggedIn,
        userName,
        userAvatar,
        companionCareEnabled,
        setCompanionCareEnabled,
        selectedLanguage,
        setLanguage,
        fontSize,
        setFontSize,
        voiceAccessibility,
        setVoiceAccessibility,
        isFullscreenDesktop,
        toggleFullscreenDesktop,
        selectedDoctor,
        setSelectedDoctor,
        appointments,
        bookAppointment,
        medicines,
        toggleMedicineTaken,
        companionStreak,
        incrementStreak,
        symptomText,
        setSymptomText,
        recentCompletedAppointment,
        setRecentCompletedAppointment,
        submitRating,
        chatMessages,
        sendChatMessage,
        isDoctorTyping,
        verificationFiles,
        addVerificationFile,
        verificationStatus,
        setVerificationStatus,
        resetApp
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
