'use client';

import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

// Inline SVG components for Social links to ensure absolute compatibility
const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const team = [
  {
    image: '/image.png',
    name: 'Saurabh Singh Shekhawat',
    title: '3rd Year Student',
    institution: 'IIIT Bhagalpur',
    role: 'Builder & Developer',
    roleColor: '#0d9488',
    roleBg: '#f0fdfa',
    avatarBg: '#0f766e',
    note: 'Built this end-to-end as a solo project — design, frontend & product vision.',
    linkedin: 'https://www.linkedin.com/in/saurabh-singh-rajput-25639a306/',
    x: 'https://x.com/SaurabhSin15850',
  },
  {
    image: '/53hUePQf_400x400.png',
    name: 'Sandeep Swami',
    title: 'SDE-2 @ Tailnode',
    institution: 'Industry Professional',
    role: 'Project Mentor',
    roleColor: '#6366f1',
    roleBg: '#f5f3ff',
    avatarBg: '#4f46e5',
    note: 'Guided the architecture, system design and overall product direction.',
    linkedin: 'https://www.linkedin.com/in/sandypswami/',
    x: 'https://x.com/sandeeyps',
  },
];

export const AboutPage: React.FC = () => {
  const { navigate, isLoggedIn, userRole } = useApp();

  const handleBack = () => {
    if (isLoggedIn) {
      if (userRole === 'doctor') navigate('doctor-dashboard');
      else navigate('patient-dashboard');
    } else {
      navigate('landing');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white relative overflow-y-auto">
      {/* Subtle background blobs */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-teal-50 rounded-full blur-3xl opacity-60 pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-20 right-0 w-56 h-56 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none translate-x-1/3" />

      {/* Header */}
      <div className="p-5 flex items-center gap-3 shrink-0 z-10">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 cursor-pointer active:scale-95 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <span className="text-sm font-bold text-slate-500">About</span>
      </div>

      <div className="flex-1 px-5 pb-10 flex flex-col gap-7 z-10">

        {/* Hero — Project identity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center gap-3 pt-2"
        >
          {/* Logo mark */}
          <div className="w-16 h-16 rounded-3xl bg-teal-600 flex items-center justify-center shadow-xl shadow-teal-600/25">
            <span className="text-white font-black text-xl tracking-tight">SD</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Swasth Darshan</h1>
            <p className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full mt-1 inline-block">
              स्वस्थ दर्शन
            </p>
          </div>

          {/* Mission */}
          <p className="text-sm text-slate-500 font-semibold leading-relaxed max-w-xs">
            A voice-first, philanthropist-funded healthcare platform connecting rural India with verified doctors — in their own language.
          </p>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">The Team</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Team Cards — side by side */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.1 }}
              className="glass-panel border border-white/60 rounded-3xl p-4 flex flex-col items-center text-center gap-3 shadow-lg shadow-black/[0.04] relative overflow-hidden"
            >
              {/* Subtle color glow behind card */}
              <div
                className="absolute top-0 inset-x-0 h-16 opacity-25 rounded-t-3xl"
                style={{ backgroundColor: member.avatarBg }}
              />

              {/* Photo component */}
              <div className="relative z-10 mt-1">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg shadow-black/10 mx-auto overflow-hidden bg-slate-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name & details */}
              <div className="flex flex-col gap-1 z-10 w-full">
                <h3 className="text-[11px] font-extrabold text-slate-800 leading-tight">
                  {member.name}
                </h3>
                <p className="text-[9px] text-slate-400 font-semibold leading-tight">
                  {member.title}
                </p>
                <p className="text-[9px] text-slate-500 font-bold">
                  {member.institution}
                </p>
                {/* Role badge */}
                <span
                  className="text-[8px] font-extrabold px-2 py-0.5 rounded-full mt-0.5 inline-block"
                  style={{ color: member.roleColor, backgroundColor: member.roleBg }}
                >
                  {member.role}
                </span>

                {/* Social Links */}
                <div className="flex justify-center gap-2 mt-2">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/60 hover:bg-slate-100 flex items-center justify-center text-teal-600 transition"
                  >
                    <LinkedInIcon />
                  </a>
                  <a
                    href={member.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/60 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition"
                  >
                    <XIcon />
                  </a>
                </div>
              </div>

              {/* Note */}
              <p className="text-[9px] text-slate-400 font-semibold leading-snug italic border-t border-slate-100 pt-2 w-full z-10">
                "{member.note}"
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* The Collaboration Story section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="glass-panel border border-teal-100 bg-teal-50/10 rounded-3xl p-4.5 flex flex-col gap-2 shadow-sm text-left"
        >
          <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 border border-teal-100/50 px-2.5 py-1 rounded-full uppercase tracking-wider self-start">
            🤝 IITian & IIITian Collaboration
          </span>
          <h4 className="text-xs font-black text-slate-800 leading-tight mt-1">
            Why we collaborated to build this project
          </h4>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            By combining the engineering mentorship of an industry veteran (IIT alumnus) with the fresh energy and dedication of a student builder (IIIT Bhagalpur), we set out to solve a real-world problem: digital health accessibility.
          </p>
          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
            Swasth Darshan bridges the digital divide in rural Bharat using voice-first design and a transparent, philanthropist-supported model, ensuring no citizen is left behind.
          </p>
        </motion.div>

        {/* Project stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="glass-panel border border-white/60 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center shadow-sm"
        >
          {[
            { value: '6', label: 'Languages' },
            { value: '5+', label: 'Mock Doctors' },
            { value: '100%', label: 'Open Source' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-lg font-black text-teal-600">{stat.value}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Stack note */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Clerk Auth', 'Recharts'].map((tech) => (
            <span key={tech} className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
              {tech}
            </span>
          ))}
        </div>

        {/* Footer credit */}
        <div className="text-center flex flex-col gap-1 pt-2">
          <p className="text-[10px] font-bold text-slate-400">Made with ❤️ for Bharat · © 2026</p>
          <p className="text-[9px] text-slate-300 font-semibold">Swasth Darshan — All rights reserved</p>
        </div>

      </div>
    </div>
  );
};
