'use client';

import { useApp } from '@/context/AppContext';
import { MockPhoneFrame } from '@/components/MockPhoneFrame';
import { LandingPage } from '@/components/LandingPage';
import { AuthOnboarding } from '@/components/AuthOnboarding';
import { PatientApp } from '@/components/PatientApp';
import { DoctorPortal } from '@/components/DoctorPortal';
import { AdminDonorDashboard } from '@/components/AdminDonorDashboard';
import { AboutPage } from '@/components/AboutPage';

export default function Home() {
  const { currentScreen, userRole } = useApp();

  const renderActiveScreen = () => {
    // ─── PUBLIC ROUTES (no login required) ───────────────────────────────────
    if (currentScreen === 'landing') return <LandingPage />;
    if (currentScreen === 'about') return <AboutPage />;

    if (
      currentScreen === 'login' ||
      currentScreen === 'otp' ||
      currentScreen === 'role-selection' ||
      currentScreen === 'onboarding'
    ) {
      return <AuthOnboarding />;
    }

    // ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────
    if (currentScreen === 'admin-dashboard') {
      return <AdminDonorDashboard />;
    }

    // ─── STRICT ROLE GUARD ────────────────────────────────────────────────────
    // Once role is set, ONLY the matching portal is ever mounted.
    // There is zero possibility of cross-role screen leakage.
    if (userRole === 'doctor') {
      return <DoctorPortal />;
    }

    // Default: patient (covers 'patient' role and any fallback)
    return <PatientApp />;
  };

  return (
    <MockPhoneFrame>
      {renderActiveScreen()}
    </MockPhoneFrame>
  );
}
