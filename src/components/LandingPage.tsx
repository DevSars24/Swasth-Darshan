'use client';

import React, { useState } from 'react';
import { Mic, ShieldCheck, HeartHandshake, Sparkles, Globe, ChevronDown, Check, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, MOCK_TESTIMONIALS } from '../lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { navigate, setLanguage, selectedLanguage, setRole } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const activeLang = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0];

  const handleLanguageSelect = (code: string) => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col p-6 bg-white relative overflow-y-auto">
      {/* Background blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-600/10">SD</div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">Swasth Darshan</span>
        </div>

        {/* Language switcher */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-full hover:bg-slate-50 transition active:scale-95 shadow-sm cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600" />
            <span>{activeLang.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-panel-heavy border border-slate-100 p-1.5 z-50 shadow-xl shadow-black/5">
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Language</div>
              {LANGUAGES.map(lang => (
                <button key={lang.code} onClick={() => handleLanguageSelect(lang.code)} className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 rounded-xl transition cursor-pointer text-left font-medium">
                  <span>{lang.name}</span>
                  {selectedLanguage === lang.code && <Check className="w-4 h-4 text-teal-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="flex flex-col justify-center items-center py-6 z-10 w-full px-2">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center w-full">
          <span className="px-4 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shadow-sm shadow-teal-100/50 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Swasth Darshan Gateway
          </span>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Welcome to the Network.<br />
            <span className="text-slate-500 text-lg font-bold">Who is signing in today?</span>
          </h1>
        </motion.div>

        {/* Dual Gateway Cards */}
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 100 }} className="w-full flex flex-col gap-4 mt-8">
          {/* Patient */}
          <button
            onClick={() => { setRole('patient'); navigate('login'); }}
            className="w-full text-left p-5 glass-panel border border-white/60 rounded-3xl hover:scale-102 active:scale-98 transition-all duration-300 shadow-xl shadow-teal-900/5 flex items-center gap-4 cursor-pointer group relative overflow-hidden bg-white/40"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-teal-200/50 transition-colors" />
            <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center group-hover:bg-teal-700 shadow-md shadow-teal-600/20 transition duration-300 shrink-0 z-10">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-lg font-extrabold text-slate-800">I am a Patient</h3>
              <p className="text-teal-700 text-[10px] font-extrabold uppercase tracking-widest mt-0.5">मरीज़ (Mareeza)</p>
              <p className="text-slate-500 text-xs mt-1.5 leading-snug font-semibold">Speak your symptoms, book verified doctors, and view clinical history.</p>
            </div>
          </button>

          {/* Doctor */}
          <button
            onClick={() => { setRole('doctor'); navigate('login'); }}
            className="w-full text-left p-5 glass-panel border border-white/60 rounded-3xl hover:scale-102 active:scale-98 transition-all duration-300 shadow-xl shadow-blue-900/5 flex items-center gap-4 cursor-pointer group relative overflow-hidden bg-white/40"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-200/50 transition-colors" />
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 shadow-md shadow-blue-600/20 transition duration-300 shrink-0 z-10">
              <HeartHandshake className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 z-10">
              <h3 className="text-lg font-extrabold text-slate-800">I am a Doctor</h3>
              <p className="text-blue-700 text-[10px] font-extrabold uppercase tracking-widest mt-0.5">डॉक्टर (Doctor)</p>
              <p className="text-slate-500 text-xs mt-1.5 leading-snug font-semibold">Join the network, consult patients, and manage your schedule.</p>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Happy Patients mini-carousel */}
      <div className="z-10 mt-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">What patients are saying</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonialIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-3.5 rounded-2xl border border-white/60 shadow-md flex gap-3 items-start"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 border border-slate-100" style={{ backgroundColor: MOCK_TESTIMONIALS[testimonialIdx].avatarColor }}>
              {MOCK_TESTIMONIALS[testimonialIdx].avatarEmoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-[11px] text-slate-700 font-semibold leading-snug italic">"{MOCK_TESTIMONIALS[testimonialIdx].quote}"</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1">— {MOCK_TESTIMONIALS[testimonialIdx].name}, {MOCK_TESTIMONIALS[testimonialIdx].city}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-1 mt-2">
          {MOCK_TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setTestimonialIdx(i)} className={`h-1.5 rounded-full transition-all cursor-pointer ${i === testimonialIdx ? 'bg-teal-600 w-4' : 'bg-slate-300 w-1.5'}`} />
          ))}
        </div>
      </div>

      {/* Footer — tasteful credit + About link */}
      <div className="py-3 flex flex-col items-center gap-1.5 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('about')}
            className="text-[10px] font-bold text-teal-600 hover:underline cursor-pointer flex items-center gap-1"
          >
            About the Project
          </button>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-[10px] font-semibold text-slate-400">Made for Bharat ❤️</span>
        </div>
        <p className="text-[9px] text-slate-300 font-semibold">© 2026 Swasth Darshan</p>
      </div>
    </div>
  );
};
