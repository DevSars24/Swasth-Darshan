'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MOCK_PATIENT_HISTORY, 
  MOCK_DOCTORS 
} from '../lib/mock-data';
import { 
  Calendar, Clock, Check, FileText, ArrowLeft, Upload, 
  ShieldAlert, ShieldCheck, Sparkles, MessageCircle, MoreVertical,
  Activity, Star, User, Users, ChevronRight, Inbox, Plus,
  History, Search, ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DoctorPortal: React.FC = () => {
  const {
    navigate,
    verificationFiles,
    addVerificationFile,
    verificationStatus,
    setVerificationStatus,
    switchDemoRole,
    userName,
    userAvatar
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'verification' | 'calendar' | 'chat'>('home');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Doctor identity comes from the authenticated Clerk user
  // We prefix 'Dr.' so if Saurabh logs in, it shows 'Dr. Saurabh Singh Shekhawat'
  const docName = userName.startsWith('Dr.') ? userName : `Dr. ${userName}`;
  const docInitials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
  // Specialty is a mock default (would come from doctor's profile in a real app)
  const docSpecialty = 'General Physician & Telemedicine';

  // State to preview patient clinical history
  const [historyPatientName, setHistoryPatientName] = useState<string | null>(null);

  // Mock list of today's appointments for the doctor
  const todayAppointments = [
    { id: 'app-d1', patientName: 'Aarti Sharma', time: '10:30 AM', status: 'completed', type: 'Fever checkup' },
    { id: 'app-d2', patientName: 'Karan Singh', time: '11:00 AM', status: 'scheduled', type: 'Video Consult' },
    { id: 'app-d3', patientName: 'Nisha Patil', time: '03:30 PM', status: 'scheduled', type: 'Pregnancy Routine' }
  ];

  // Mock calendar weekly slots
  const calendarSlots = [
    { day: 'Friday (Today)', slots: ['10:30 AM', '11:00 AM', '12:00 PM', '03:30 PM', '05:00 PM'] },
    { day: 'Saturday (Tomorrow)', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '04:30 PM'] },
    { day: 'Monday', slots: ['11:00 AM', '01:00 PM', '05:00 PM'] }
  ];

  // Mock patient inbox list
  const patientInbox = [
    { id: 'c-1', name: 'Karan Singh', snippet: 'Aap bilkul chinta na karein. Make sure...', time: '10:02 AM', unread: true },
    { id: 'c-2', name: 'Aarti Sharma', snippet: 'Thank you doctor, joint pain is better', time: 'Yesterday', unread: false },
    { id: 'c-3', name: 'Nisha Patil', snippet: 'Can I take iron supplements?', time: '2 days ago', unread: false }
  ];

  const [selectedPatientChat, setSelectedPatientChat] = useState<string | null>(null);
  const [docReply, setDocReply] = useState('');
  const [mockChatLogs, setMockChatLogs] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'patient', text: 'Namaste Doctor! I have a general query regarding blood count.', time: '09:50 AM' },
    { sender: 'doctor', text: 'Namaste. Please share your latest CBC report.', time: '09:55 AM' },
    { sender: 'patient', text: 'Sure, sharing it shortly. Thank you.', time: '10:00 AM' }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      addVerificationFile(file.name, `${fileSizeMB} MB`);
      setVerificationStatus('pending');
    }
  };

  const handleSendDocReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docReply.trim()) return;
    setMockChatLogs(prev => [
      ...prev,
      { sender: 'doctor', text: docReply, time: 'Just now' }
    ]);
    setDocReply('');
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-white relative">
      
      {/* Scrollable Core Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        
        {/* Profile Card Header */}
        <div className="p-5 bg-gradient-to-r from-teal-600/5 to-emerald-600/5 border-b border-slate-100 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-3">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={docName}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-teal-200 shadow-sm"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                {docInitials || 'DR'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-bold text-slate-800">{docName}</h3>
                {verificationStatus === 'approved' ? (
                  <ShieldCheck className="w-4.5 h-4.5 text-teal-600" />
                ) : (
                  <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
                )}
              </div>
              <p className="text-slate-400 text-[10px] font-semibold">{docSpecialty}</p>
            </div>
          </div>

          {/* Demo-only role switcher */}
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => switchDemoRole('patient')}
              className="text-[10px] font-bold text-teal-600 flex items-center gap-1 hover:underline cursor-pointer bg-teal-50 px-2 py-1 rounded-lg"
            >
              🎭 View as Patient
            </button>
            <button
              onClick={() => switchDemoRole('admin')}
              className="text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:underline cursor-pointer"
            >
              Admin View
            </button>
          </div>
        </div>

        {/* ==================== A. DOCTOR DASHBOARD ==================== */}
        {activeTab === 'home' && (
          <div className="p-5 flex flex-col gap-4">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-panel p-3 text-center rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Trust Score</span>
                <span className="text-base font-extrabold text-slate-800 mt-1 flex items-center justify-center gap-0.5">
                  <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                  4.85
                </span>
                <span className="text-[8px] text-slate-400 font-medium block mt-0.5">Verified ratings</span>
              </div>
              <div className="glass-panel p-3 text-center rounded-2xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Patients</span>
                <span className="text-base font-extrabold text-teal-600 mt-1 flex items-center justify-center gap-1">
                  <Users className="w-4 h-4" />
                  1,240
                </span>
                <span className="text-[8px] text-slate-400 font-medium block mt-0.5">Consultations</span>
              </div>
              <div className="glass-panel p-3 text-center rounded-2xl flex flex-col justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">KYC Status</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase ${
                  verificationStatus === 'approved' 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : verificationStatus === 'pending'
                    ? 'bg-amber-50 text-amber-700 animate-pulse'
                    : 'bg-rose-50 text-rose-700'
                }`}>
                  {verificationStatus}
                </span>
              </div>
            </div>

            {/* Dashboard Verification Notice */}
            {verificationStatus !== 'approved' && (
              <div className="glass-panel p-4.5 rounded-3xl border border-amber-200/50 bg-amber-50/15 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800">Credentials Pending Verification</h4>
                  <p className="text-slate-500 text-[10px] font-semibold leading-relaxed mt-0.5">
                    Your profile will be hidden in patient voice searches until files are approved by the Donor-funded admin board.
                  </p>
                  <button 
                    onClick={() => setActiveTab('verification')}
                    className="mt-2.5 text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg hover:bg-teal-100 transition cursor-pointer"
                  >
                    Upload Certificates
                  </button>
                </div>
              </div>
            )}

            {/* Today's appointments */}
            <div className="flex flex-col gap-2.5 mt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                <Activity className="w-4 h-4 text-teal-600" />
                Today's Appointments ({todayAppointments.length})
              </h4>

              <div className="flex flex-col gap-2.5">
                {todayAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="glass-panel p-3.5 rounded-2xl border border-white/60 shadow-md shadow-slate-100/30 flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 font-bold">
                          👤
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{app.patientName}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{app.type}</span>
                          <span className="text-[10px] text-teal-700 font-bold mt-0.5 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {app.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {app.status === 'scheduled' ? (
                          <>
                            <button
                              onClick={() => {
                                setHistoryPatientName(app.patientName);
                              }}
                              className="h-8 px-2.5 rounded-lg border border-slate-200 text-slate-600 bg-white text-xs font-bold hover:bg-slate-50 flex items-center gap-1 cursor-pointer active:scale-95 transition"
                              title="Explore Patient History"
                            >
                              <History className="w-3.5 h-3.5 text-teal-600" />
                              History
                            </button>
                            <button
                              onClick={() => alert(`Initiating mock video consult with ${app.patientName}`)}
                              className="h-8 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
                            >
                              Consult
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expandable Patient History Preview inside dashboard */}
                    <AnimatePresence>
                      {historyPatientName === app.patientName && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-slate-100 pt-3 flex flex-col gap-3 text-left bg-slate-50/20 p-2 rounded-xl"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1">
                              <ClipboardList className="w-3.5 h-3.5" />
                              Clinical History: {app.patientName}
                            </span>
                            <button
                              onClick={() => setHistoryPatientName(null)}
                              className="text-[10px] font-bold text-slate-400 hover:text-slate-500 cursor-pointer"
                            >
                              Close
                            </button>
                          </div>

                          {MOCK_PATIENT_HISTORY.map((record) => (
                            <div key={record.id} className="p-2.5 bg-white border border-slate-100 rounded-lg">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-700">
                                <span>Diagnosis: {record.diagnosis}</span>
                                <span className="text-slate-400">{record.date}</span>
                              </div>
                              <span className="text-[9px] text-slate-400 block mt-0.5">Written by {record.doctorName} ({record.specialty})</span>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {record.prescription.map((med, i) => (
                                  <span key={i} className="text-[8px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                                    {med}
                                  </span>
                                ))}
                              </div>
                              <p className="text-[9px] text-slate-500 mt-2 italic leading-relaxed">
                                Notes: "{record.notes}"
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== B. DOCUMENT VERIFICATION ==================== */}
        {activeTab === 'verification' && (
          <div className="p-5 flex flex-col gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">KYC Verification</span>
              <h3 className="text-xl font-extrabold text-slate-800">Upload Credentials</h3>
            </div>

            <p className="text-slate-400 text-xs font-semibold leading-relaxed">
              We verify all doctors to prevent fake practitioners. Upload registration licenses and degrees for admin review.
            </p>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-3xl p-6 text-center bg-slate-50/50 hover:bg-teal-50/10 transition duration-300 cursor-pointer flex flex-col items-center justify-center gap-2.5"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700 block">Click to upload certificates</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">PDF, PNG, JPG files up to 5MB</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Uploaded Credentials</h4>
              <div className="flex flex-col gap-2">
                {verificationFiles.map((file, idx) => (
                  <div 
                    key={idx}
                    className="p-3 border border-slate-100 rounded-xl bg-slate-50/20 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-700 block truncate">{file.name}</span>
                        <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{file.size} · Uploaded {file.uploadedAt}</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                      verificationStatus === 'approved' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : verificationStatus === 'pending'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {verificationStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== C. DOCTOR CALENDAR ==================== */}
        {activeTab === 'calendar' && (
          <div className="p-5 flex flex-col gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Consultation Schedule</span>
              <h3 className="text-xl font-extrabold text-slate-800">Weekly Calendar</h3>
            </div>

            <div className="flex flex-col gap-4">
              {calendarSlots.map((daySlot) => (
                <div key={daySlot.day} className="glass-panel p-4 rounded-3xl border border-white/60 flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    {daySlot.day}
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {daySlot.slots.map((slot) => {
                      const isBooked = todayAppointments.some(app => app.time === slot && daySlot.day.includes('Today'));
                      return (
                        <div
                          key={slot}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center flex flex-col gap-0.5 ${
                            isBooked 
                              ? 'bg-teal-50 border-teal-200 text-teal-800'
                              : 'bg-white border-slate-100 text-slate-400 font-medium'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className="text-[9px] font-bold">
                            {isBooked ? '✓ Booked' : 'Available'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== D. PATIENT CHAT INBOX ==================== */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full bg-slate-50/20">
            {selectedPatientChat === null ? (
              <div className="p-5 flex flex-col gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Secure Communication</span>
                  <h3 className="text-xl font-extrabold text-slate-800">Patient Messages</h3>
                </div>

                <div className="flex flex-col gap-2">
                  {patientInbox.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedPatientChat(chat.name)}
                      className="p-3.5 border border-slate-100 bg-white rounded-2xl flex justify-between items-center hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                          <User className="w-5.5 h-5.5 text-teal-600" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-700 block">{chat.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold block truncate mt-0.5">{chat.snippet}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[8px] text-slate-400 font-bold">{chat.time}</span>
                        {chat.unread && (
                          <span className="w-2 h-2 bg-teal-600 rounded-full mt-1.5" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[540px]">
                <div className="h-14 px-4 bg-white border-b border-slate-100 flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedPatientChat(null)}
                    className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowLeft className="w-4.5 h-4.5 text-slate-600" />
                  </button>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-800 block">{selectedPatientChat}</span>
                    <span className="text-[9px] text-slate-400 font-bold block">Patient Chat Thread</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {mockChatLogs.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex flex-col max-w-[80%] ${
                        msg.sender === 'doctor' ? 'self-end items-end' : 'self-start items-start'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl text-xs font-bold leading-normal shadow-sm ${
                        msg.sender === 'doctor'
                          ? 'bg-teal-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-slate-400 font-semibold mt-1 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendDocReply} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0 items-center">
                  <input
                    type="text"
                    placeholder={`Reply to ${selectedPatientChat}...`}
                    value={docReply}
                    onChange={(e) => setDocReply(e.target.value)}
                    className="flex-1 h-11 px-4 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50"
                  />
                  <button
                    type="submit"
                    className="w-11 h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center cursor-pointer"
                  >
                    Reply
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </div>

      {selectedPatientChat === null && (
        <div className="absolute bottom-0 inset-x-0 h-18 bg-white/90 backdrop-blur-md border-t border-slate-100 z-40 shrink-0 grid grid-cols-4 select-none px-2 shadow-2xl">
          
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'home' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'verification' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <span className="text-xl">📄</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">KYC Docs</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'calendar' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <span className="text-xl">📅</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              activeTab === 'chat' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-500'
            }`}
          >
            <span className="text-xl font-bold">💬</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Inbox</span>
          </button>

        </div>
      )}

    </div>
  );
};
