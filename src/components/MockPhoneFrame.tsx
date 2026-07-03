'use client';

import React from 'react';
import { Wifi, Battery, Signal, RefreshCw, Smartphone, Laptop, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useUser, SignOutButton } from '@clerk/nextjs';

interface MockPhoneFrameProps {
  children: React.ReactNode;
}

export const MockPhoneFrame: React.FC<MockPhoneFrameProps> = ({ children }) => {
  const { 
    currentScreen, 
    resetApp, 
    userRole, 
    isLoggedIn, 
    isFullscreenDesktop, 
    toggleFullscreenDesktop 
  } = useApp();
  
  const { isSignedIn, user } = useUser();

  return (
    <div className="relative min-h-screen w-full bg-[#f8fafc] text-slate-800 flex items-center justify-center p-0 md:p-8 overflow-hidden select-none">
      
      {/* Background ambient gradient blobs (only visible in mockup view) */}
      {!isFullscreenDesktop && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-200/30 blur-[120px] pointer-events-none animate-pulse duration-10000" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-200/20 blur-[120px] pointer-events-none animate-pulse duration-8000" />
          <div className="absolute top-[40%] right-[-20%] w-[40%] h-[40%] rounded-full bg-sky-200/20 blur-[120px] pointer-events-none animate-pulse duration-7000" />
          <div className="absolute bottom-[30%] left-[-20%] w-[40%] h-[40%] rounded-full bg-indigo-100/30 blur-[120px] pointer-events-none animate-pulse duration-9000" />
        </>
      )}

      {/* Outer wrapper - conditional sizing based on fullscreen setting */}
      <div 
        className={`bg-white relative overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreenDesktop 
            ? 'w-full min-h-screen h-full rounded-none border-0 shadow-none' 
            : 'w-full h-screen md:h-[840px] md:w-[412px] md:rounded-[48px] md:border-[10px] md:border-white md:shadow-2xl md:shadow-slate-900/10 md:glass-panel'
        }`}
      >
        
        {/* Device Status Bar (only shown in phone mockup view) */}
        {!isFullscreenDesktop && (
          <div className="h-10 px-6 pt-3 flex justify-between items-center bg-white/70 backdrop-blur-md border-b border-slate-100/50 z-30 shrink-0 text-slate-600 text-sm font-semibold select-none">
            <span>20:34</span>
            <div className="hidden md:block w-28 h-5 bg-slate-900 rounded-full absolute left-1/2 -translate-x-1/2 top-2 border border-slate-800/80 shadow-inner z-50" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] px-1 bg-teal-100 text-teal-700 rounded mr-1">SD v1.0</span>
              <Signal className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        )}

        {/* Global Toolbar Header (Clerk Session info & Demo switches) */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200/50 flex justify-between items-center text-xs font-semibold text-slate-500 z-30 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Mode: {userRole.toUpperCase()}</span>
            {isSignedIn && user && (
              <span className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded font-bold">
                Auth: {user.firstName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={resetApp}
              className="flex items-center gap-1 hover:text-teal-600 cursor-pointer active:scale-95 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            {isSignedIn && (
              <SignOutButton>
                <button className="flex items-center gap-1 hover:text-rose-600 cursor-pointer active:scale-95 transition">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </SignOutButton>
            )}
          </div>
        </div>

        {/* Dynamic App Content */}
        <div className="flex-1 w-full overflow-y-auto relative bg-white flex flex-col">
          {children}
        </div>

        {/* Mock Phone Home Swipe Bar (only shown in phone mockup view) */}
        {!isFullscreenDesktop && (
          <div className="hidden md:flex h-6 w-full items-center justify-center bg-white/70 backdrop-blur-md border-t border-slate-100/30 shrink-0 z-30">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        )}
      </div>

      {/* Floating Layout Toggle View Button (Persists on desktop viewport) */}
      <button
        onClick={toggleFullscreenDesktop}
        className="hidden md:flex fixed bottom-5 right-5 z-[9999] px-4.5 py-3 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-slate-800 transition-all duration-200 active:scale-95 items-center gap-2 text-xs font-bold border border-slate-700 cursor-pointer"
      >
        {isFullscreenDesktop ? (
          <>
            <Smartphone className="w-4 h-4 text-teal-400" />
            <span>Switch to Phone View</span>
          </>
        ) : (
          <>
            <Laptop className="w-4 h-4 text-teal-400" />
            <span>Switch to Fullscreen View</span>
          </>
        )}
      </button>

    </div>
  );
};
