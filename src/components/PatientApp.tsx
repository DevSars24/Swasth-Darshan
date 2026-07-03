'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp, Appointment } from '../context/AppContext';
import { 
  MOCK_DOCTORS, Doctor, getRecommendedDoctors, getNearbyDoctors,
  MOCK_PATIENT_HISTORY, MOCK_COMPANION_CALLS, MOCK_TESTIMONIALS,
  MOCK_DONORS, MOCK_FUND_ALLOCATION, MOCK_LEDGER_ENTRIES
} from '../lib/mock-data';
import { 
  Mic, Calendar, Clock, Pill, ChevronRight, User, MessageSquare, 
  Video, Star, Check, CheckCircle, AlertCircle, MapPin, Sparkles, 
  Send, Phone, ShieldCheck, Heart, ArrowLeft, Volume2, VolumeX,
  Plus, Search, Award, MessageCircle, MoreVertical,
  VideoOff, MicOff, FileText, Download, Play, History,
  AlertTriangle, Settings, LogOut, ChevronDown, IndianRupee,
  Users, Info, ClipboardCheck, ArrowUpRight, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// ─── DOCTOR AVATAR COMPONENT ─────────────────────────────────────────────────
const DoctorAvatar: React.FC<{ doctor: Doctor; size?: string }> = ({ doctor, size = 'w-14 h-14' }) => {
  const [imgErr, setImgErr] = useState(false);
  const initials = doctor.name.split(' ').slice(0, 2).map(n => n[0]).join('');
  if (imgErr) {
    return (
      <div
        className={`${size} rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shrink-0`}
        style={{ backgroundColor: doctor.avatarColor }}
      >
        {initials}
      </div>
    );
  }
  return (
    <img
      src={doctor.avatar}
      alt={doctor.name}
      className={`${size} rounded-2xl object-cover border border-slate-100 shrink-0`}
      onError={() => setImgErr(true)}
    />
  );
};

export const PatientApp: React.FC = () => {
  const {
    currentScreen,
    navigate,
    fontSize,
    selectedLanguage,
    voiceAccessibility,
    setVoiceAccessibility,
    selectedDoctor,
    setSelectedDoctor,
    appointments,
    bookAppointment,
    medicines,
    toggleMedicineTaken,
    companionStreak,
    symptomText,
    setSymptomText,
    recentCompletedAppointment,
    setRecentCompletedAppointment,
    submitRating,
    chatMessages,
    sendChatMessage,
    isDoctorTyping,
    userName,
    userAvatar,
    companionCareEnabled,
    setCompanionCareEnabled,
    switchDemoRole,
    resetApp
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'results' | 'timeline' | 'appointments'>('home');
  const [selectedLangFilter, setSelectedLangFilter] = useState('All');
  const [appointmentsSubTab, setAppointmentsSubTab] = useState<'consults' | 'history'>('consults');
  const [showCallLogs, setShowCallLogs] = useState(false);
  const [voiceSearchStage, setVoiceSearchStage] = useState<'listening' | 'transcribing' | 'completed'>('listening');
  const [transcribedText, setTranscribedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  // Emergency SOS state machine
  const [emergencyStage, setEmergencyStage] = useState<'idle' | 'notifying' | 'confirmed'>('idle');
  const [emergencyEta, setEmergencyEta] = useState(300); // 5 min countdown in seconds

  // Transparency chart mount
  const [chartMounted, setChartMounted] = useState(false);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => { setChartMounted(true); }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setTestimonialIndex(i => (i + 1) % MOCK_TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Emergency ETA countdown
  useEffect(() => {
    if (emergencyStage === 'notifying') {
      const t = setInterval(() => {
        setEmergencyEta(prev => {
          if (prev <= 1) {
            clearInterval(t);
            setEmergencyStage('confirmed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [emergencyStage]);

  // Trigger symptom voice search animation
  useEffect(() => {
    if (currentScreen === 'symptom-search') {
      setVoiceSearchStage('listening');
      setTranscribedText('');
      const t1 = setTimeout(() => setVoiceSearchStage('transcribing'), 1500);
      const t2 = setTimeout(() => {
        setVoiceSearchStage('completed');
        const simulatedTranscript = selectedLanguage === 'hi'
          ? 'मुझे ३ दिन से बहुत तेज बुखार है, गले में दर्द है और सूखी खांसी आ रही है।'
          : 'I have had a high fever, severe throat pain, and dry cough for 3 days.';
        setTranscribedText(simulatedTranscript);
        setSymptomText(simulatedTranscript);
        if (voiceAccessibility) speakText(simulatedTranscript);
      }, 3200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [currentScreen, selectedLanguage, setSymptomText]);

  // Scroll chat to bottom
  useEffect(() => {
    if (currentScreen === 'chat' && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, currentScreen, isDoctorTyping]);

  const handleMicClick = () => navigate('symptom-search');

  const handleSymptomConfirm = () => {
    navigate('doctor-results');
    setActiveTab('results');
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigate('doctor-profile');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput('');
  };

  const handleCallHangup = () => {
    const activeCallApp = appointments.find(app => app.status === 'scheduled') || appointments[0];
    setRecentCompletedAppointment(activeCallApp);
    navigate('rating');
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recentCompletedAppointment) {
      submitRating(recentCompletedAppointment.doctor.id, ratingStars, ratingComment);
    } else {
      navigate('appointments');
    }
    setRatingComment('');
    setRatingStars(5);
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const triggerPdfDownload = (diagnosisName: string) => {
    setNotification(`Downloading Prescription Report for ${diagnosisName}...`);
    setTimeout(() => {
      setNotification(`✓ Saved PDF successfully to device storage!`);
      setTimeout(() => setNotification(null), 3000);
    }, 2000);
  };

  const handleEmergencyStart = () => {
    setEmergencyEta(300);
    setEmergencyStage('notifying');
    navigate('emergency-live');
  };

  const matchingDoctors = getRecommendedDoctors(symptomText).filter(doc => {
    if (selectedLangFilter === 'All') return true;
    return doc.languages.includes(selectedLangFilter);
  });

  const nearbyDoctors = getNearbyDoctors().slice(0, 3);
  const filteredLedger = MOCK_LEDGER_ENTRIES.filter(e =>
    e.purpose.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
    e.doctorName.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  const totalRaised = MOCK_DONORS.reduce((sum, d) => sum + d.amountNum, 0);
  const fmtRupee = (n: number) => `₹${(n / 100000).toFixed(0)} Lakh`;

  // Screens that hide the bottom nav
  const hideNav = ['symptom-search', 'video-call', 'booking-confirm', 'emergency-confirm', 'emergency-live', 'companion-care', 'transparency', 'about'];

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-white select-none relative">

      {/* Notification Banner */}
      {notification && (
        <div className="absolute top-2 inset-x-4 bg-teal-900/95 text-white py-2.5 px-4 rounded-xl text-xs font-bold text-center z-50 shadow-lg backdrop-blur animate-bounce">
          {notification}
        </div>
      )}

      {/* Settings Slide-Over Panel */}
      <AnimatePresence>
        {showSettingsPanel && (
          <motion.div
            key="settings"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute inset-0 z-50 bg-white flex flex-col"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-extrabold text-slate-800">Profile & Settings</h3>
              <button onClick={() => setShowSettingsPanel(false)} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {/* User card */}
              <div className="glass-panel p-4 rounded-3xl border border-white/60 shadow-lg flex items-center gap-3">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-teal-600" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{userName}</h4>
                  <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">Patient Account</span>
                </div>
              </div>

              {/* Companion care toggle */}
              <div className="glass-panel p-4 rounded-2xl border border-white/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Companion Care</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Receive daily check-in calls</p>
                </div>
                <button
                  onClick={() => setCompanionCareEnabled(!companionCareEnabled)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${companionCareEnabled ? 'bg-teal-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${companionCareEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Voice toggle */}
              <div className="glass-panel p-4 rounded-2xl border border-white/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Voice Guide</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Reads results aloud</p>
                </div>
                <button
                  onClick={() => setVoiceAccessibility(!voiceAccessibility)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${voiceAccessibility ? 'bg-teal-600' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${voiceAccessibility ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* About link */}
              <button
                onClick={() => { setShowSettingsPanel(false); navigate('about'); }}
                className="w-full p-4 glass-panel border border-white/50 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Info className="w-4 h-4 text-teal-600" />
                  About Swasth Darshan
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* DEMO ONLY: Switch Role */}
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2">🎭 Demo Only — Switch Role</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setShowSettingsPanel(false); switchDemoRole('doctor'); }}
                    className="h-10 text-xs font-bold bg-blue-600 text-white rounded-xl cursor-pointer active:scale-95 transition"
                  >
                    View as Doctor
                  </button>
                  <button
                    onClick={() => { setShowSettingsPanel(false); switchDemoRole('admin'); }}
                    className="h-10 text-xs font-bold bg-slate-700 text-white rounded-xl cursor-pointer active:scale-95 transition"
                  >
                    View as Admin
                  </button>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={resetApp}
                className="w-full h-11 mt-2 border border-rose-200 text-rose-600 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out & Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">

        {/* ════════════════ A. PATIENT DASHBOARD ════════════════ */}
        {currentScreen === 'patient-dashboard' && (
          <div className="p-5 flex flex-col gap-5">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-11 h-11 rounded-full border border-slate-200 object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                )}
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wide">Namaste 🙏</span>
                  <h3 className="text-xl font-extrabold text-slate-800 leading-tight truncate max-w-[160px]">{userName}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Emergency SOS button */}
                <button
                  onClick={() => navigate('emergency-confirm')}
                  className="px-3 h-9 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer hover:bg-rose-100 transition active:scale-95"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  SOS
                </button>
                <button
                  onClick={() => setShowSettingsPanel(true)}
                  className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition"
                >
                  <Settings className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Voice symptom CTA */}
            <div className="glass-panel p-5 rounded-3xl border border-white/50 relative overflow-hidden flex flex-col items-center text-center shadow-lg shadow-black/[0.02]">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-teal-100/30 blur-2xl pointer-events-none" />
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">Voice symptom search</span>
              <h4 className="text-lg font-bold text-slate-800 leading-snug">Doctor consultation in your language</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed mt-1 mb-4 px-2">Tap the microphone and speak your symptoms.</p>
              <div className="relative flex flex-col items-center justify-center my-2">
                <div className="absolute w-24 h-24 rounded-full bg-teal-500/10 pulse-animation" />
                <button onClick={handleMicClick} className="relative w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center shadow-xl shadow-teal-600/25 hover:bg-teal-700 active:scale-95 transition cursor-pointer">
                  <Mic className="w-7 h-7 text-white" />
                </button>
              </div>
              <span className="text-xs text-teal-700 font-bold uppercase tracking-wider mt-4">Tap to speak symptoms</span>
            </div>

            {/* Upcoming Appointment */}
            {appointments.some(app => app.status === 'scheduled') && (() => {
              const nextApp = appointments.find(app => app.status === 'scheduled')!;
              return (
                <div className="glass-panel p-4 rounded-3xl border border-white/60 shadow-lg shadow-slate-100/50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" /> Upcoming Consult
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-teal-100 text-teal-700 rounded-full uppercase animate-pulse">Live</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DoctorAvatar doctor={nextApp.doctor} size="w-12 h-12" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800">{nextApp.doctor.name}</h4>
                      <p className="text-slate-400 text-[11px] font-semibold">{nextApp.doctor.specialty}</p>
                      <p className="text-slate-500 text-[11px] font-bold mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-600" />{nextApp.day} at {nextApp.time}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button onClick={() => navigate('chat')} className="h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95">
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </button>
                    <button onClick={() => navigate('video-call')} className="h-10 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition active:scale-95 shadow-md shadow-teal-600/10">
                      <Video className="w-3.5 h-3.5" /> Join Call
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Companion Care Card */}
            <button
              onClick={() => navigate('companion-care')}
              className="glass-panel p-4 rounded-3xl border border-white/60 shadow-lg shadow-rose-100/30 flex items-center justify-between w-full text-left cursor-pointer hover:bg-rose-50/20 transition active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                  <Heart className="w-5 h-5 fill-rose-500" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800">Companion Care</span>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Daily check-in calls at 5:00 PM</p>
                  <p className="text-[10px] text-rose-600 font-bold mt-0.5">{companionStreak} day streak ❤️ · Tap to view</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Doctors Near You */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">📍 Varanasi, UP</span>
                  <h4 className="text-sm font-bold text-slate-800">Doctors Near You</h4>
                </div>
                <button onClick={() => { navigate('doctor-results'); setActiveTab('results'); }} className="text-teal-600 text-xs font-bold hover:underline cursor-pointer">See All</button>
              </div>
              {nearbyDoctors.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 glass-panel border border-white/60 rounded-2xl shadow-sm cursor-pointer hover:bg-slate-50/60 transition" onClick={() => handleSelectDoctor(doc)}>
                  <DoctorAvatar doctor={doc} size="w-11 h-11" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">{doc.name}</h5>
                    <p className="text-[10px] text-slate-500 font-semibold">{doc.specialty}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700">
                      <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />{doc.trustScore}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-500">
                      <MapPin className="w-3 h-3 text-teal-600" />{doc.distanceKm} km
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Today's Medicines snippet */}
            <div className="glass-panel p-4.5 rounded-3xl border border-white/60 shadow-md shadow-slate-100/50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5 text-teal-600" /> Today's Medicines
                </span>
                <button onClick={() => { navigate('timeline'); setActiveTab('timeline'); }} className="text-teal-600 text-xs font-bold hover:underline cursor-pointer">View All</button>
              </div>
              <div className="flex flex-col gap-2">
                {medicines.slice(0, 2).map(med => (
                  <div key={med.id} onClick={() => toggleMedicineTaken(med.id)} className="flex justify-between items-center p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 font-bold">💊</div>
                      <div>
                        <span className="text-xs font-bold text-slate-700">{med.name}</span>
                        <span className="text-[9px] text-slate-400 font-medium block">{med.time}</span>
                      </div>
                    </div>
                    <button className={`h-7 px-3 text-[10px] font-bold rounded-lg border transition ${med.taken ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                      {med.taken ? '✓ Taken' : 'Mark'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparency link */}
            <button
              onClick={() => navigate('transparency')}
              className="w-full p-4 glass-panel border border-white/60 rounded-3xl flex items-center gap-3 cursor-pointer hover:bg-indigo-50/20 transition active:scale-98 shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                <IndianRupee className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1 text-left">
                <span className="text-xs font-bold text-slate-800">Donor Transparency</span>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">See where every rupee goes · {fmtRupee(totalRaised)} raised</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Happy Patients Testimonials */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-teal-600" /> Happy Patients
              </h4>
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-panel p-4 rounded-3xl border border-white/60 shadow-md"
                >
                  {(() => {
                    const t = MOCK_TESTIMONIALS[testimonialIndex];
                    return (
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 border border-slate-100" style={{ backgroundColor: t.avatarColor }}>
                          {t.avatarEmoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex gap-0.5 mb-1">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                          </div>
                          <p className="text-xs text-slate-700 font-semibold leading-snug italic">"{t.quote}"</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1.5">— {t.name}, {t.city}</p>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-1 mt-2">
                {MOCK_TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => setTestimonialIndex(i)} className={`w-1.5 h-1.5 rounded-full transition cursor-pointer ${i === testimonialIndex ? 'bg-teal-600 w-3' : 'bg-slate-300'}`} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ B. VOICE SYMPTOM SEARCH ════════════════ */}
        {currentScreen === 'symptom-search' && (
          <div className="p-6 flex flex-col justify-between items-center text-center h-[550px] relative">
            <div className="w-full flex justify-start">
              <button onClick={() => navigate('patient-dashboard')} className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center py-6 w-full">
              <span className="px-3.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 rounded-full uppercase tracking-wider mb-4 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Speech-to-Text Model
              </span>
              <div className="h-24 flex items-center justify-center gap-1.5 my-8">
                {voiceSearchStage === 'listening' ? (
                  <>
                    <div className="w-1.5 rounded-full bg-teal-600 soundwave-bar-1" />
                    <div className="w-1.5 rounded-full bg-teal-600 soundwave-bar-2" />
                    <div className="w-1.5 rounded-full bg-teal-600 soundwave-bar-3" />
                    <div className="w-1.5 rounded-full bg-teal-600 soundwave-bar-4" />
                    <div className="w-1.5 rounded-full bg-teal-600 soundwave-bar-5" />
                  </>
                ) : voiceSearchStage === 'transcribing' ? (
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce" />
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                    <Check className="w-8 h-8" />
                  </div>
                )}
              </div>
              <h4 className="text-xl font-bold text-slate-800">
                {voiceSearchStage === 'listening' && 'Listening to symptoms...'}
                {voiceSearchStage === 'transcribing' && 'Translating speech to English...'}
                {voiceSearchStage === 'completed' && 'Symptom analysis completed'}
              </h4>
              <p className="text-slate-400 text-xs font-semibold mt-1">
                {voiceSearchStage === 'listening' && 'Speak naturally. We support Hindi, English, Tamil, and Telugu.'}
                {voiceSearchStage === 'transcribing' && 'Synthesizing voice into clinical terms.'}
                {voiceSearchStage === 'completed' && 'Your symptoms have been successfully transcribed.'}
              </p>
              {transcribedText && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 w-full p-4 glass-panel border border-white/50 rounded-2xl text-left bg-slate-50/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transcription</span>
                    <button onClick={() => speakText(transcribedText)} className={`h-7 px-2.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition ${isSpeaking ? 'bg-teal-50 border-teal-300 text-teal-700 animate-pulse' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      <Play className="w-3 h-3 fill-current" /> {isSpeaking ? 'Reading...' : 'Speak out loud'}
                    </button>
                  </div>
                  <p className="text-slate-800 text-sm font-bold leading-relaxed italic">"{transcribedText}"</p>
                </motion.div>
              )}
            </div>
            {voiceSearchStage === 'completed' && (
              <button onClick={handleSymptomConfirm} className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-teal-600/15 cursor-pointer active:scale-98 transition">
                Search Matching Doctors <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* ════════════════ C. DOCTOR SEARCH RESULTS ════════════════ */}
        {currentScreen === 'doctor-results' && (
          <div className="p-5 flex flex-col gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Matching Doctors For</span>
              <h3 className="text-xl font-extrabold text-slate-800 truncate">"{symptomText || 'General Consultation'}"</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Hindi', 'English', 'Tamil', 'Telugu', 'Marathi'].map(lang => (
                <button key={lang} onClick={() => setSelectedLangFilter(lang)} className={`px-3 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap cursor-pointer transition active:scale-95 ${selectedLangFilter === lang ? 'bg-teal-600 border-teal-600 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  {lang}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3.5">
              {matchingDoctors.length > 0 ? matchingDoctors.map(doc => (
                <div key={doc.id} className="glass-panel p-4.5 rounded-3xl border border-white/60 shadow-lg shadow-slate-100/40 flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="relative shrink-0">
                      <DoctorAvatar doctor={doc} size="w-14 h-14" />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{doc.name}</h4>
                        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                      </div>
                      <p className="text-slate-500 text-[11px] font-bold">{doc.specialty}</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">{doc.hospital} · {doc.experience} yrs</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {doc.languages.map(l => <span key={l} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{l}</span>)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="flex items-center gap-0.5 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                        <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />{doc.trustScore}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1 font-semibold">{doc.ratingsCount} reviews</span>
                      {doc.distanceKm && <span className="text-[9px] text-teal-600 font-bold mt-1 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{doc.distanceKm} km</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button onClick={() => handleSelectDoctor(doc)} className="h-10 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer active:scale-95 transition">View Profile</button>
                    <button onClick={() => handleSelectDoctor(doc)} className="h-10 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/5 cursor-pointer active:scale-95 transition">Book Consult</button>
                  </div>
                </div>
              )) : (
                <div className="text-center p-8 glass-panel border border-white/50 rounded-3xl mt-4">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-700">No doctors match this language</h4>
                  <p className="text-xs text-slate-400 mt-1">Try switching the language filters above.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════════════ D. DOCTOR PROFILE ════════════════ */}
        {currentScreen === 'doctor-profile' && selectedDoctor && (
          <div className="flex flex-col">
            <div className="relative h-28 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 p-5 flex items-end">
              <button onClick={() => { navigate('doctor-results'); setActiveTab('results'); }} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow hover:bg-slate-50 cursor-pointer active:scale-95 transition">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="absolute -bottom-8 left-5 shrink-0 z-10">
                <DoctorAvatar doctor={selectedDoctor} size="w-18 h-18" />
              </div>
            </div>
            <div className="pt-10 px-5 pb-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-lg font-bold text-slate-800">{selectedDoctor.name}</h3>
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                  </div>
                  <p className="text-slate-500 text-xs font-bold">{selectedDoctor.specialty}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3 text-teal-600" />{selectedDoctor.hospital}</p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />{selectedDoctor.trustScore}
                </div>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl border border-white/50">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">About Doctor</h4>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">{selectedDoctor.bio}</p>
              </div>
              <div className="glass-panel p-3.5 rounded-2xl border border-white/50 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Verification Checklist</h4>
                {['MCI Registered (Medical License Verified)', 'Verified MBBS / MD Degree Credentials', 'Philanthropy Audit Completed (No Sponsored Boosts)'].map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" /><span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Available Slots</h4>
                {selectedDoctor.slots.map(daySlot => (
                  <div key={daySlot.day} className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-slate-600">{daySlot.day}</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {daySlot.times.map(time => (
                        <button key={time} onClick={() => bookAppointment(selectedDoctor, daySlot.day, time)} className="h-9 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-teal-50 hover:border-teal-400 text-slate-700 hover:text-teal-700 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition">
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2.5 mt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Patient Reviews ({selectedDoctor.reviews.length})</h4>
                {selectedDoctor.reviews.map(rev => (
                  <div key={rev.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/30">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-700">{rev.patientName}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-semibold">{rev.date}</p>
                    <p className="text-slate-500 text-xs mt-1 leading-snug font-medium">"{rev.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ E. BOOKING CONFIRMATION ════════════════ */}
        {currentScreen === 'booking-confirm' && (
          <div className="p-6 flex flex-col justify-center items-center text-center h-[550px]">
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 10 }} className="w-18 h-18 bg-emerald-50 rounded-full border-2 border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
              <Check className="w-10 h-10 stroke-[3px]" />
            </motion.div>
            <h3 className="text-2xl font-extrabold text-slate-800">Consultation Booked!</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs mt-1.5 px-4 font-semibold">Your video consultation slot is locked. The companion care coordinator has been notified.</p>
            {appointments[0] && (
              <div className="glass-panel p-4.5 rounded-2xl border border-white/60 w-full my-6 flex items-center gap-3 shadow-md shadow-slate-100/50">
                <DoctorAvatar doctor={appointments[0].doctor} size="w-12 h-12" />
                <div className="text-left flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800">{appointments[0].doctor.name}</h4>
                  <p className="text-slate-400 text-[10px] font-semibold">{appointments[0].doctor.specialty}</p>
                  <div className="flex items-center gap-1 text-teal-700 font-bold text-[11px] mt-1">
                    <Clock className="w-3.5 h-3.5" /><span>{appointments[0].day} · {appointments[0].time}</span>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => { navigate('patient-dashboard'); setActiveTab('home'); }} className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/10 cursor-pointer active:scale-98 transition">
              Go to Dashboard
            </button>
          </div>
        )}

        {/* ════════════════ F. HEALTH TIMELINE ════════════════ */}
        {currentScreen === 'timeline' && (
          <div className="p-5 flex flex-col gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Health Reminders</span>
              <h3 className="text-xl font-extrabold text-slate-800">Prescription Timeline</h3>
            </div>
            <div className="relative pl-6 border-l-2 border-slate-100 flex flex-col gap-4 mt-2">
              {medicines.map(med => (
                <div key={med.id} className="relative">
                  <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${med.taken ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}>
                    {med.taken && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </div>
                  <div className="glass-panel p-3.5 rounded-2xl border border-white/60 flex items-center justify-between shadow-md shadow-slate-100/30">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                        {med.icon === 'drop' ? '💧' : med.icon === 'syringe' ? '💉' : '💊'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-700">{med.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block">{med.dosage}</span>
                        <span className="text-[10px] text-teal-700 font-bold mt-0.5 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{med.time}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleMedicineTaken(med.id)} className={`h-8 px-3 rounded-lg border text-xs font-bold transition cursor-pointer active:scale-95 ${med.taken ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'}`}>
                      {med.taken ? '✓ Taken' : 'Mark Taken'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-panel p-4 rounded-2xl border border-white/50 bg-slate-50/10 mt-1">
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest block mb-1">Companion Care Reminder</span>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">If you miss a scheduled dose, our companion care volunteer will call you to check on your wellness.</p>
            </div>
          </div>
        )}

        {/* ════════════════ G. APPOINTMENTS & MEDICAL HISTORY ════════════════ */}
        {currentScreen === 'appointments' && (
          <div className="p-5 flex flex-col gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Trace History</span>
              <h3 className="text-xl font-extrabold text-slate-800">Consultations & Records</h3>
            </div>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-full">
              {(['consults', 'history'] as const).map(tab => (
                <button key={tab} onClick={() => setAppointmentsSubTab(tab)} className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${appointmentsSubTab === tab ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {tab === 'consults' ? 'Active Bookings' : 'Clinical History'}
                </button>
              ))}
            </div>
            {appointmentsSubTab === 'consults' && (
              <div className="flex flex-col gap-3">
                {appointments.map(app => (
                  <div key={app.id} className="glass-panel p-4 rounded-3xl border border-white/60 shadow-lg shadow-slate-100/40">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {app.id.substring(0, 10)}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase ${app.status === 'scheduled' ? 'bg-teal-100 text-teal-700 animate-pulse' : app.status === 'completed' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{app.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DoctorAvatar doctor={app.doctor} size="w-11 h-11" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{app.doctor.name}</h4>
                        <p className="text-slate-400 text-[10px] font-semibold">{app.doctor.specialty}</p>
                        <p className="text-slate-500 text-[10px] font-bold flex items-center gap-1 mt-0.5"><Clock className="w-3.5 h-3.5 text-teal-600" />{app.day} at {app.time}</p>
                      </div>
                    </div>
                    {app.status === 'scheduled' && (
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button onClick={() => navigate('chat')} className="h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition"><MessageSquare className="w-3.5 h-3.5" /> Chat</button>
                        <button onClick={() => navigate('video-call')} className="h-10 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition shadow-md shadow-teal-600/10"><Video className="w-3.5 h-3.5" /> Join Video</button>
                      </div>
                    )}
                    {app.status === 'completed' && (
                      <button onClick={() => { setRecentCompletedAppointment(app); navigate('rating'); }} className="w-full mt-4 h-10 border border-teal-600 hover:bg-teal-50 text-teal-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition">
                        <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" /> Rate Doctor
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {appointmentsSubTab === 'history' && (
              <div className="flex flex-col gap-3.5">
                {MOCK_PATIENT_HISTORY.map(record => (
                  <div key={record.id} className="glass-panel p-4.5 rounded-3xl border border-white/60 shadow-lg shadow-slate-100/40 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{record.doctorName}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{record.specialty}</span>
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{record.date}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-2 flex flex-col gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Diagnosis</span>
                        <span className="text-xs font-extrabold text-slate-800">{record.diagnosis}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {record.prescription.map((rx, idx) => <span key={idx} className="text-[9px] font-bold text-teal-700 bg-teal-50/50 border border-teal-100 px-2 py-0.5 rounded">💊 {rx}</span>)}
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed font-medium mt-1">
                        <span className="font-bold text-slate-700">Notes: </span>"{record.notes}"
                      </p>
                    </div>
                    <button onClick={() => triggerPdfDownload(record.diagnosis)} className="h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-slate-200/50 cursor-pointer active:scale-95 transition">
                      <Download className="w-4 h-4 text-teal-600" /> Download PDF Prescription
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════ H. CHAT ════════════════ */}
        {currentScreen === 'chat' && appointments.length > 0 && (
          <div className="flex flex-col h-[580px] bg-slate-50/30">
            <div className="h-14 px-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center gap-3 shrink-0">
              <button onClick={() => navigate('patient-dashboard')} className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 cursor-pointer active:scale-95 transition">
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </button>
              <DoctorAvatar doctor={appointments[0].doctor} size="w-9 h-9" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800">{appointments[0].doctor.name}</h4>
                {isDoctorTyping ? <span className="text-[9px] text-teal-600 font-bold animate-pulse">doctor is typing...</span> : <span className="text-[9px] text-slate-400 font-semibold">Online · Consult Coordinator</span>}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'patient' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs font-bold leading-normal shadow-sm ${msg.sender === 'patient' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}>{msg.text}</div>
                  <span className="text-[8px] text-slate-400 font-semibold mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {isDoctorTyping && (
                <div className="self-start flex gap-1 items-center p-3 rounded-2xl bg-white border border-slate-100 rounded-tl-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0 items-center">
              <input type="text" placeholder="Type your message..." value={chatInput} onChange={e => setChatInput(e.target.value)} className="flex-1 h-11 px-4 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50" />
              <button type="submit" className="w-11 h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ════════════════ I. VIDEO CALL ════════════════ */}
        {currentScreen === 'video-call' && appointments.length > 0 && (
          <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col justify-between p-6">
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider">Connected Live</span>
              </div>
              <span className="text-slate-400 text-xs font-bold bg-slate-800/80 px-3 py-1 rounded-full">04:22</span>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center relative my-6">
              <DoctorAvatar doctor={appointments[0].doctor} size="w-32 h-32" />
              <h4 className="text-white font-bold text-base mt-4">{appointments[0].doctor.name}</h4>
              <span className="text-slate-400 text-xs font-semibold">{appointments[0].doctor.specialty}</span>
              <div className="absolute bottom-2 right-2 w-24 h-32 bg-slate-800 border-2 border-slate-700 rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
                <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-500">
                  <User className="w-6 h-6" /><span>You</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center gap-5 z-10">
              <button className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 cursor-pointer active:scale-95 transition"><MicOff className="w-5 h-5" /></button>
              <button className="w-12 h-12 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 cursor-pointer active:scale-95 transition"><VideoOff className="w-5 h-5" /></button>
              <button onClick={handleCallHangup} className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 cursor-pointer active:scale-95 transition shadow-lg shadow-rose-600/20">
                <Phone className="w-6 h-6 rotate-135" />
              </button>
            </div>
          </div>
        )}

        {/* ════════════════ J. RATING ════════════════ */}
        {currentScreen === 'rating' && (
          <div className="p-6 flex flex-col justify-center items-center text-center h-[550px]">
            <span className="px-3.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full uppercase tracking-wider mb-3">Consult Completed</span>
            <h3 className="text-xl font-bold text-slate-800 leading-snug">Rate your consult with {recentCompletedAppointment?.doctor.name || 'your doctor'}</h3>
            <p className="text-slate-400 text-xs font-semibold leading-relaxed mt-1 mb-5 px-3">Your feedback is unpaid, tamper-proof, and helps other patients choose doctors.</p>
            <form onSubmit={handleRatingSubmit} className="w-full flex flex-col gap-5">
              <div className="flex justify-center gap-2 my-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setRatingStars(star)} className="cursor-pointer active:scale-95 transition">
                    <Star className={`w-10 h-10 ${star <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
              <textarea placeholder="Write about your experience..." value={ratingComment} onChange={e => setRatingComment(e.target.value)} className="w-full p-4 h-24 text-xs font-bold rounded-2xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50" />
              <button type="submit" className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-teal-600/15 cursor-pointer active:scale-98 transition">Submit Verified Rating</button>
            </form>
          </div>
        )}

        {/* ════════════════ K. COMPANION CARE (New Feature 1) ════════════════ */}
        {currentScreen === 'companion-care' && (
          <div className="flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 shrink-0 bg-gradient-to-r from-rose-50/50 to-white">
              <button onClick={() => navigate('patient-dashboard')} className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 cursor-pointer active:scale-95 transition">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Companion Care</h3>
                <p className="text-[10px] text-rose-600 font-bold">{companionStreak} day streak ❤️</p>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-5 overflow-y-auto">
              {/* Explainer */}
              <div className="glass-panel p-4 rounded-3xl border border-rose-100 bg-rose-50/20 flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">What is Companion Care?</h4>
                  <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">Daily check-in calls so elderly, pregnant, and seriously ill patients never feel alone. A trained volunteer calls every day to ask how you're doing and ensure medicines are taken.</p>
                </div>
              </div>

              {/* Streak ring visual */}
              <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-lg flex flex-col items-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="absolute top-0 left-0 w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#fce7f3" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f43f5e" strokeWidth="8"
                      strokeDasharray={`${(companionStreak / 30) * 251.3} 251.3`} strokeLinecap="round" />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-rose-600">{companionStreak}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">days</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-700 mt-3">{companionStreak} Days of Companion Care ❤️</p>
                <p className="text-[11px] text-slate-400 font-semibold text-center mt-1">Goal: 30-day continuous care streak</p>
              </div>

              {/* Today's call info */}
              <div className="glass-panel p-4 rounded-3xl border border-white/60 shadow-md flex items-center gap-3">
                <img src={MOCK_COMPANION_CALLS[0].volunteerAvatar} alt={MOCK_COMPANION_CALLS[0].volunteerName} className="w-12 h-12 rounded-2xl object-cover border border-slate-100" onError={e => (e.currentTarget.style.display = 'none')} />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Today's Call</p>
                  <h4 className="text-sm font-bold text-slate-800">{MOCK_COMPANION_CALLS[0].volunteerName}</h4>
                  <p className="text-[10px] text-teal-700 font-bold">Scheduled at 5:00 PM today</p>
                </div>
              </div>

              {/* Opt-in toggle */}
              <div className="glass-panel p-4 rounded-2xl border border-white/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Enrolled in Companion Care</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Receive daily wellness calls</p>
                </div>
                <button
                  onClick={() => setCompanionCareEnabled(!companionCareEnabled)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${companionCareEnabled ? 'bg-rose-500' : 'bg-slate-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 ${companionCareEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Call history */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1">
                  <History className="w-4 h-4 text-rose-500" /> Call History
                </h4>
                <div className="flex flex-col gap-2.5">
                  {MOCK_COMPANION_CALLS.map(call => (
                    <div key={call.id} className="p-3.5 border border-slate-100 bg-white rounded-2xl flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <div className="flex items-center gap-2">
                          <img src={call.volunteerAvatar} alt={call.volunteerName} className="w-7 h-7 rounded-full object-cover border border-slate-100" onError={e => (e.currentTarget.style.display = 'none')} />
                          <span className="text-slate-700">{call.volunteerName}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded uppercase text-[8px] font-bold ${call.status === 'answered' ? 'bg-emerald-50 text-emerald-700' : call.status === 'no-answer' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                          {call.status}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold">{call.date} · {call.time}</span>
                      <p className="text-slate-500 text-[10px] leading-snug font-medium">"{call.notes}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ L. EMERGENCY SOS — Confirm ════════════════ */}
        {currentScreen === 'emergency-confirm' && (
          <div className="p-6 flex flex-col justify-between h-full bg-white">
            <div className="w-full flex justify-start">
              <button onClick={() => navigate('patient-dashboard')} className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 cursor-pointer active:scale-95 transition">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6">
              <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-24 h-24 rounded-full bg-rose-50 border-4 border-rose-300 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-rose-500" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">Request Urgent Help?</h2>
                <p className="text-slate-500 text-sm font-semibold mt-2 leading-relaxed">Your saved address will be shared with our emergency care team immediately.</p>
              </div>
              <div className="w-full p-4 bg-rose-50/50 border border-rose-100 rounded-2xl text-left">
                <p className="text-[10px] text-rose-600 font-bold uppercase tracking-widest mb-1">Your Saved Address</p>
                <p className="text-sm font-bold text-slate-800">12, Shiv Nagar Colony, Near Ram Mandir,</p>
                <p className="text-sm font-bold text-slate-800">Varanasi, Uttar Pradesh — 221005</p>
              </div>
              <div className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Emergency Contacts (auto-notified)</p>
                <div className="flex flex-col gap-1.5">
                  {[{ name: 'Rahul Singh (Son)', phone: '+91 98765 43210' }, { name: 'Priya Devi (Daughter)', phone: '+91 87654 32109' }].map(c => (
                    <div key={c.name} className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{c.name}</span>
                      <span className="text-teal-600">{c.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleEmergencyStart}
                className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-base rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 cursor-pointer active:scale-98 transition"
              >
                <AlertTriangle className="w-5 h-5" /> Yes, Send Help Now
              </button>
              <button onClick={() => navigate('patient-dashboard')} className="w-full h-11 border border-slate-200 text-slate-600 text-xs font-bold rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                Cancel — I'm OK
              </button>
            </div>
          </div>
        )}

        {/* ════════════════ M. EMERGENCY LIVE STATUS ════════════════ */}
        {currentScreen === 'emergency-live' && (
          <div className="p-5 flex flex-col gap-5">
            <div className="flex items-center gap-3 pt-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-extrabold text-rose-600 uppercase tracking-widest">Emergency Active</span>
            </div>

            <div className="glass-panel p-5 rounded-3xl border border-rose-100 bg-rose-50/20 flex flex-col items-center gap-4 shadow-lg">
              <h3 className="text-xl font-extrabold text-slate-800">
                {emergencyStage === 'notifying' ? '🚨 Help Requested' : '✅ Care Team En Route'}
              </h3>
              <p className="text-slate-500 text-xs font-semibold text-center">
                {emergencyStage === 'notifying' ? 'Notifying the care team and your emergency contacts...' : 'Team has confirmed. They are on their way to your location.'}
              </p>

              {/* Progress steps */}
              <div className="w-full flex flex-col gap-3">
                {[
                  { label: 'SOS Request Sent', done: true },
                  { label: 'Care Team Notified', done: emergencyStage === 'confirmed' || emergencyEta < 240 },
                  { label: 'Team Dispatched', done: emergencyStage === 'confirmed' || emergencyEta < 120 },
                  { label: 'Team Arriving', done: emergencyStage === 'confirmed' }
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${step.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      {step.done ? <Check className="w-3.5 h-3.5 text-white" /> : <span className="w-2 h-2 rounded-full bg-slate-400" />}
                    </div>
                    <span className={`text-xs font-bold ${step.done ? 'text-emerald-700' : 'text-slate-400'}`}>{step.label}</span>
                  </div>
                ))}
              </div>

              {/* ETA timer */}
              <div className="w-full p-4 bg-white rounded-2xl border border-rose-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Estimated Arrival</p>
                  <p className="text-2xl font-black text-rose-600">{Math.ceil(emergencyEta / 60)} min</p>
                </div>
                {emergencyStage === 'confirmed' && (
                  <div className="flex flex-col items-end">
                    <p className="text-[10px] font-bold text-slate-400">Care Team Lead</p>
                    <p className="text-sm font-bold text-slate-800">Suresh Kumar</p>
                    <button className="mt-1 flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded cursor-pointer">
                      <Phone className="w-3 h-3" /> Call (Demo)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency contacts notified */}
            <div className="glass-panel p-4 rounded-3xl border border-white/60 shadow-md">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Contacts Auto-Notified</p>
              {[{ name: 'Rahul Singh (Son)', notified: true }, { name: 'Priya Devi (Daughter)', notified: emergencyEta < 200 }].map(c => (
                <div key={c.name} className="flex justify-between items-center py-1.5">
                  <span className="text-xs font-bold text-slate-700">{c.name}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${c.notified ? 'bg-emerald-50 text-emerald-700' : 'text-amber-600 bg-amber-50 animate-pulse'}`}>
                    {c.notified ? 'Notified ✓' : 'Sending...'}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={() => { setEmergencyStage('idle'); navigate('patient-dashboard'); }} className="w-full h-11 border border-slate-200 text-slate-600 text-xs font-bold rounded-2xl cursor-pointer hover:bg-slate-50 transition">
              I'm Safe — Cancel Emergency
            </button>
          </div>
        )}

        {/* ════════════════ N. TRANSPARENCY REPORT (New Feature 2) ════════════════ */}
        {currentScreen === 'transparency' && (
          <div className="flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 shrink-0">
              <button onClick={() => navigate('patient-dashboard')} className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 cursor-pointer active:scale-95 transition">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Donor Transparency</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Every rupee is publicly audited</p>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-5 overflow-y-auto">
              {/* Running counter */}
              <div className="glass-panel p-5 rounded-3xl border border-indigo-100 bg-indigo-50/20 flex flex-col items-center text-center shadow-lg">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">Total Funds Raised</span>
                <h2 className="text-4xl font-black text-slate-800">{fmtRupee(totalRaised)}</h2>
                <div className="flex gap-4 mt-3">
                  <div className="text-center">
                    <p className="text-xl font-black text-teal-600">21,425</p>
                    <p className="text-[10px] text-slate-400 font-bold">Patients Helped</p>
                  </div>
                  <div className="w-px bg-slate-200" />
                  <div className="text-center">
                    <p className="text-xl font-black text-teal-600">180</p>
                    <p className="text-[10px] text-slate-400 font-bold">Volunteers</p>
                  </div>
                  <div className="w-px bg-slate-200" />
                  <div className="text-center">
                    <p className="text-xl font-black text-teal-600">6</p>
                    <p className="text-[10px] text-slate-400 font-bold">Languages</p>
                  </div>
                </div>
              </div>

              {/* Fund allocation donut */}
              <div className="glass-panel p-4 rounded-3xl border border-white/60 shadow-lg flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Fund Allocation Breakdown</span>
                {chartMounted && (
                  <div className="w-full h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={MOCK_FUND_ALLOCATION} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                          {MOCK_FUND_ALLOCATION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => `${v}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                      <p className="text-[10px] font-bold text-slate-400">Total</p>
                      <p className="text-sm font-black text-slate-800">{fmtRupee(totalRaised)}</p>
                    </div>
                  </div>
                )}
                <div className="w-full grid grid-cols-2 gap-2 mt-3">
                  {MOCK_FUND_ALLOCATION.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-[10px] font-bold text-slate-700">{item.name}</p>
                        <p className="text-[9px] text-slate-400 font-semibold">{item.value}% · {item.amountStr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donor wall */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">Donor Wall of Fame</h4>
                <div className="flex flex-col gap-3">
                  {MOCK_DONORS.map(don => (
                    <div key={don.id} className="glass-panel p-4 rounded-3xl border border-white/60 shadow-md">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{don.avatarEmoji}</span>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">{don.name}</h5>
                            <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">{don.badge}</span>
                          </div>
                        </div>
                        <span className="text-sm font-extrabold text-slate-800">{don.amount}</span>
                      </div>
                      <p className="text-slate-500 text-[10px] font-semibold leading-snug mt-2.5 italic border-l-2 border-teal-200 pl-2">"{don.message}"</p>
                      <div className="mt-2.5 p-2 bg-emerald-50 rounded-xl">
                        <p className="text-[10px] text-emerald-800 font-bold">💡 Impact: {don.impactNote}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ledger table */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1">
                  <ClipboardCheck className="w-4 h-4 text-indigo-600" /> Live Audit Ledger
                </h4>
                <div className="relative mb-3">
                  <input type="text" placeholder="Search transactions..." value={ledgerSearch} onChange={e => setLedgerSearch(e.target.value)} className="w-full h-10 pl-9 pr-4 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50" />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <div className="flex flex-col gap-2">
                  {filteredLedger.map(tx => (
                    <div key={tx.id} className="p-3 border border-slate-100 bg-white rounded-2xl text-xs font-bold">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800">{tx.purpose}</span>
                        <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[10px]">{tx.amount}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-400 font-semibold mt-1">
                        <span>{tx.doctorName}</span><span>{tx.date}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 bg-slate-50 p-1.5 rounded-lg font-mono border border-slate-100 mt-1 flex justify-between">
                        <span>Hash:</span>
                        <span className="text-teal-700 flex items-center gap-0.5">{tx.recipientHash}<ArrowUpRight className="w-2.5 h-2.5" /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ O. ABOUT TEAM PAGE (Feature 6) ════════════════ */}
        {currentScreen === 'about' && (
          <div className="flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 shrink-0">
              <button onClick={() => navigate('patient-dashboard')} className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 cursor-pointer active:scale-95 transition">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">About Swasth Darshan</h3>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-5 overflow-y-auto">
              {/* Mission */}
              <div className="glass-panel p-5 rounded-3xl border border-teal-100 bg-teal-50/10 text-center">
                <div className="text-3xl mb-2">🩺</div>
                <h2 className="text-xl font-extrabold text-slate-800">Swasth Darshan</h2>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed mt-2 px-4">
                  A voice-first, philanthropist-funded healthcare platform connecting rural and underserved Indian patients with verified doctors in their own language — built for those who have been left behind by digital health.
                </p>
              </div>

              {/* Team */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">The Team</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      initials: 'SS',
                      name: 'Saurabh Singh Shekhawat',
                      title: '3rd Year Student · IIIT Bhagalpur',
                      role: 'Builder / Developer',
                      note: 'Built this end-to-end as a solo project — design, frontend, and product.',
                      color: '#0d9488',
                      bg: '#f0fdfa'
                    },
                    {
                      initials: 'SW',
                      name: 'Sandeep Swami',
                      title: 'SDE-2 · Industry Mentor',
                      role: 'Project Mentor',
                      note: 'Guided the architecture, product direction, and overall system design.',
                      color: '#6366f1',
                      bg: '#f5f3ff'
                    }
                  ].map(person => (
                    <div key={person.name} className="glass-panel p-4.5 rounded-3xl border border-white/60 shadow-md flex gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shrink-0" style={{ backgroundColor: person.color }}>
                        {person.initials}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-extrabold text-slate-800">{person.name}</h5>
                        <p className="text-[10px] text-slate-400 font-semibold">{person.title}</p>
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded mt-1 inline-block" style={{ color: person.color, backgroundColor: person.bg }}>{person.role}</span>
                        <p className="text-[10px] text-slate-500 font-semibold leading-snug mt-2 italic">"{person.note}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center p-4 text-[10px] text-slate-400 font-bold">
                Made with ❤️ for Bharat · © 2026 Swasth Darshan
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ════════════ PATIENT-ONLY BOTTOM NAV ════════════ */}
      {!hideNav.includes(currentScreen) && (
        <div className="absolute bottom-0 inset-x-0 h-18 bg-white/90 backdrop-blur-md border-t border-slate-100 z-40 grid grid-cols-4 px-2 shadow-2xl shadow-slate-900/5">
          {[
            { id: 'home', screen: 'patient-dashboard', emoji: '🏠', label: 'Home' },
            { id: 'results', screen: 'doctor-results', emoji: '🩺', label: 'Doctors' },
            { id: 'timeline', screen: 'timeline', emoji: '📅', label: 'Reminders' },
            { id: 'appointments', screen: 'appointments', emoji: '📊', label: 'Records' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { navigate(tab.screen); setActiveTab(tab.id as any); }}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${activeTab === tab.id ? 'text-teal-600' : 'text-slate-400 hover:text-slate-500'}`}
            >
              <span className="text-xl">{tab.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
