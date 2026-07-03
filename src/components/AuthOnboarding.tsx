'use client';

import React, { useState, useEffect } from 'react';
import { useApp, FontSize, UserRole } from '../context/AppContext';
import { ArrowLeft, CheckCircle, Sparkles, Mic, FileText, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from '../lib/mock-data';
import { SignIn, SignUp, useUser } from '@clerk/nextjs';

export const AuthOnboarding: React.FC = () => {
  const {
    currentScreen,
    navigate,
    fontSize,
    setFontSize,
    selectedLanguage,
    setLanguage,
    voiceAccessibility,
    setVoiceAccessibility,
    userRole,
    setRole
  } = useApp();

  const { isSignedIn, isLoaded } = useUser();

  // Stages: 'auth' | 'role' | 'accessibility'
  const [stage, setStage] = useState<'auth' | 'role' | 'accessibility'>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sync state if coming from landing
  useEffect(() => {
    if (currentScreen === 'login') {
      if (isLoaded && isSignedIn) {
        setStage('role');
      } else {
        setStage('auth');
      }
    }
  }, [currentScreen, isSignedIn, isLoaded]);

  // Transition stage when authenticated via Clerk
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        if (stage === 'auth') {
          // Skip the role selection step since it was chosen on the Landing page
          setStage('accessibility');
        }
      } else {
        setStage('auth');
      }
    }
  }, [isSignedIn, isLoaded]);

  const handleRoleSelection = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStage('accessibility');
  };

  const handleFinishOnboarding = () => {
    // Navigate to the correct dashboard based on the role chosen on Landing Page
    if (userRole === 'doctor') {
      navigate('doctor-dashboard');
    } else {
      navigate('patient-dashboard');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-white relative justify-between h-full">
      {/* Background Ambience */}
      <div className="absolute top-10 right-10 w-44 h-44 rounded-full bg-teal-50 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 z-10 shrink-0 select-none">
        {stage !== 'auth' && (
          <button
            onClick={() => {
              if (stage === 'accessibility') setStage('role');
              else if (stage === 'role') setStage('auth');
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
        )}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
            {stage === 'auth' && 'Step 1 of 3: Secure Login'}
            {stage === 'role' && 'Step 2 of 3: Profile Type'}
            {stage === 'accessibility' && 'Step 3 of 3: Accessibility Settings'}
          </span>
          <h2 className="text-xl font-bold text-slate-800">
            {stage === 'auth' && 'Create/Sign In Account'}
            {stage === 'role' && 'Who is using the app?'}
            {stage === 'accessibility' && 'Accessibility Settings'}
          </h2>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 py-4 flex flex-col justify-center items-center z-10 w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {stage === 'auth' && (
            <motion.div
              key="clerk-auth"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col items-center gap-4"
            >
              {/* Login Toggle Buttons */}
              <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-full max-w-sm mb-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 ${
                    authMode === 'signin' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95 ${
                    authMode === 'signup' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Embed Clerk Form */}
              <div className="w-full flex justify-center scale-95 origin-top max-h-[500px] overflow-y-auto">
                {authMode === 'signin' ? (
                  <SignIn 
                    routing="hash"
                    appearance={{
                      elements: {
                        cardBox: 'shadow-none border-0 rounded-2xl bg-white/70 backdrop-blur-md',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        footerAction: 'hidden',
                        logoImage: 'hidden',
                        logoBox: 'hidden',
                      }
                    }}
                  />
                ) : (
                  <SignUp 
                    routing="hash"
                    appearance={{
                      elements: {
                        cardBox: 'shadow-none border-0 rounded-2xl bg-white/70 backdrop-blur-md',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        footerAction: 'hidden',
                        logoImage: 'hidden',
                        logoBox: 'hidden',
                      }
                    }}
                  />
                )}
              </div>
            </motion.div>
          )}

          {stage === 'role' && (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 w-full"
            >
              <p className="text-center text-slate-500 text-sm leading-relaxed font-medium mb-3">
                Please select your profile role to personalize your Swasth Darshan experience.
              </p>

              {/* Patient Profile Card */}
              <button
                onClick={() => handleRoleSelection('patient')}
                className="w-full text-left p-5 glass-panel border border-white/50 rounded-2xl hover:scale-102 hover:bg-teal-50/20 active:scale-98 transition-all duration-300 shadow-sm shadow-slate-100 flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition duration-300 shrink-0">
                  <Mic className="w-7 h-7 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                    Consult Patient
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-teal-100 text-teal-700 rounded-full uppercase">Primary</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-snug font-medium">
                    Speak symptoms, book top-verified doctors, trace prescription timeline.
                  </p>
                </div>
              </button>

              {/* Doctor Profile Card */}
              <button
                onClick={() => handleRoleSelection('doctor')}
                className="w-full text-left p-5 glass-panel border border-white/50 rounded-2xl hover:scale-102 hover:bg-teal-50/20 active:scale-98 transition-all duration-300 shadow-sm shadow-slate-100 flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition duration-300 shrink-0">
                  <FileText className="w-7 h-7 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-800">
                    Medical Doctor Portal
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 leading-snug font-medium">
                    Consult patients via video/chat, manage bookings calendar, upload documents.
                  </p>
                </div>
              </button>
            </motion.div>
          )}

          {stage === 'accessibility' && (
            <motion.div
              key="accessibility-settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6 w-full"
            >
              {/* Language grid picker */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Preferred App Language
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`h-11 px-4 rounded-xl border flex items-center justify-between font-bold text-xs cursor-pointer active:scale-95 transition ${
                        selectedLanguage === lang.code
                          ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm shadow-teal-50/40'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600 bg-slate-50/30'
                      }`}
                    >
                      <span>{lang.name}</span>
                      {selectedLanguage === lang.code && <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font size picker */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  App Text Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`h-11 rounded-xl border flex items-center justify-center font-bold text-xs uppercase cursor-pointer active:scale-95 transition ${
                        fontSize === size
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className={size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base font-extrabold'}>
                        {size}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice-First Mode switch */}
              <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-white/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                    <Mic className="w-5.5 h-5.5 text-teal-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Voice-First Assistant</span>
                    <span className="text-[9px] text-slate-400 font-medium leading-normal">
                      Reads results out loud and auto-listens to voice commands.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setVoiceAccessibility(!voiceAccessibility)}
                  className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-250 cursor-pointer ${
                    voiceAccessibility ? 'bg-teal-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-sm transform transition-transform duration-250 ${
                      voiceAccessibility ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={handleFinishOnboarding}
                className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-teal-600/15 cursor-pointer active:scale-98 transition mt-2"
              >
                <Sparkles className="w-4 h-4" />
                Finish Setup
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div className="text-center z-10 shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest py-1 select-none">
        🔒 Real Authentication Secured by Clerk
      </div>
    </div>
  );
};
