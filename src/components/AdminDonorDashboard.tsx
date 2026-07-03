'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_DONORS, MOCK_FUND_ALLOCATION, MOCK_LEDGER_ENTRIES } from '../lib/mock-data';
import { 
  ShieldCheck, FileText, ArrowLeft, Heart, BarChart2,
  CheckCircle, XCircle, Users, IndianRupee, Sparkles, Award,
  Search, ClipboardCheck, ArrowUpRight
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';

export const AdminDonorDashboard: React.FC = () => {
  const {
    navigate,
    verificationStatus,
    setVerificationStatus,
    verificationFiles
  } = useApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'transparency' | 'donors'>('approvals');
  const [mounted, setMounted] = useState(false);
  const [searchLedgerQuery, setSearchLedgerQuery] = useState('');

  // Mount check to avoid SSR hydration mismatches with Recharts
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApprove = () => {
    setVerificationStatus('approved');
  };

  const handleReject = () => {
    setVerificationStatus('rejected');
  };

  const handleResetQueue = () => {
    setVerificationStatus('pending');
  };

  // Filter ledger list based on search query
  const filteredLedger = MOCK_LEDGER_ENTRIES.filter(entry => 
    entry.purpose.toLowerCase().includes(searchLedgerQuery.toLowerCase()) ||
    entry.doctorName.toLowerCase().includes(searchLedgerQuery.toLowerCase()) ||
    entry.id.toLowerCase().includes(searchLedgerQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col justify-between h-full bg-white relative">
      
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        
        {/* Header toolbar */}
        <div className="p-5 bg-gradient-to-r from-teal-600/5 to-emerald-600/5 border-b border-slate-100 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="text-xl">💛</span>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Admin & Donor Board</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Transparency Portal</p>
            </div>
          </div>

          <button
            onClick={() => navigate('landing')}
            className="text-xs font-bold text-teal-600 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Switch Mode
          </button>
        </div>

        {/* ==================== A. APPROVAL QUEUE ==================== */}
        {activeTab === 'approvals' && (
          <div className="p-5 flex flex-col gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">KYC Approvals Queue</span>
              <h3 className="text-xl font-extrabold text-slate-800">Doctor Verifications</h3>
            </div>

            <p className="text-slate-400 text-xs font-semibold leading-relaxed">
              Manually review degrees and credentials to authorize doctors onto the Swasth Darshan patient consultation list.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              
              <div className="glass-panel p-4.5 rounded-3xl border border-white/60 shadow-lg shadow-slate-100/40 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center font-bold text-teal-700">
                    PP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Dr. Priya Patel</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      Gynecologist · Apollo Spectra, Ahmedabad
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                    Uploaded PDF Documents
                  </span>
                  
                  {verificationFiles.map((file, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <FileText className="w-4 h-4 text-teal-600" />
                        <span className="truncate max-w-[200px]">{file.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{file.size}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1 font-bold">
                    <span className="text-slate-400 font-semibold">Verification status:</span>
                    <span className={`px-2 py-0.5 rounded uppercase ${
                      verificationStatus === 'approved' 
                        ? 'bg-emerald-50 text-emerald-700 font-bold' 
                        : verificationStatus === 'pending'
                        ? 'bg-amber-50 text-amber-700 font-bold animate-pulse'
                        : 'bg-rose-50 text-rose-700 font-bold'
                    }`}>
                      {verificationStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleReject}
                    disabled={verificationStatus === 'rejected'}
                    className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition ${
                      verificationStatus === 'rejected'
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'border border-rose-200 text-rose-600 bg-white hover:bg-rose-50'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Credentials
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={verificationStatus === 'approved'}
                    className={`h-11 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition shadow-sm ${
                      verificationStatus === 'approved'
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/10'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Doctor
                  </button>
                </div>

                {verificationStatus === 'approved' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span>Dr. Priya Patel has been authorized! They are now discoverable in the Patient app search.</span>
                      <button 
                        onClick={handleResetQueue}
                        className="underline text-[10px] text-emerald-700 block mt-1 hover:text-emerald-800 cursor-pointer"
                      >
                        Reset to Pending (for demo loop)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== B. TRANSPARENCY FINANCIAL REPORT ==================== */}
        {activeTab === 'transparency' && (
          <div className="p-5 flex flex-col gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Philanthropic Audit</span>
              <h3 className="text-xl font-extrabold text-slate-800">Transparency Report</h3>
            </div>

            <p className="text-slate-400 text-xs font-semibold leading-relaxed">
              We take zero government or commercial funds. Every donated rupee is tracked and audited publicly to maintain political neutrality.
            </p>

            <div className="glass-panel p-4.5 rounded-3xl border border-white/60 shadow-lg flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
                Fund Allocations Today
              </span>

              {mounted ? (
                <div className="w-full h-56 relative select-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MOCK_FUND_ALLOCATION}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {MOCK_FUND_ALLOCATION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center select-none pointer-events-none">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Funds</span>
                    <span className="text-base font-black text-slate-800">₹1.25 Cr</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-56 flex items-center justify-center text-slate-400 text-xs shimmer-bg rounded-2xl" />
              )}

              <div className="w-full grid grid-cols-2 gap-2 mt-4 text-xs font-bold text-slate-600">
                {MOCK_FUND_ALLOCATION.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* EXPANDED FEATURE: Itemized Transaction Ledger Table */}
            <div className="flex flex-col gap-3 mt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                <ClipboardCheck className="w-4 h-4 text-teal-600" />
                Live Fund Ledger Audit
              </h4>
              
              {/* Search ledger */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search ledger by purpose, doctor name..."
                  value={searchLedgerQuery}
                  onChange={(e) => setSearchLedgerQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-slate-50"
                />
                <Search className="w-4 h-4 text-slate-450 absolute left-3 top-3" />
              </div>

              {/* Transactions List */}
              <div className="flex flex-col gap-2.5">
                {filteredLedger.length > 0 ? (
                  filteredLedger.map((tx) => (
                    <div 
                      key={tx.id} 
                      className="p-3.5 border border-slate-100 bg-white rounded-2xl flex flex-col gap-2 shadow-sm text-xs font-bold"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800">{tx.purpose}</span>
                        <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[10px]">
                          {tx.amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mt-1">
                        <span>Recipient: {tx.doctorName}</span>
                        <span>{tx.date}</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 bg-slate-50 p-1.5 rounded-lg font-mono border border-slate-100">
                        <span>Ledger Receipt Hash:</span>
                        <span className="flex items-center gap-0.5 text-teal-700">
                          {tx.recipientHash}
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 border border-slate-100 rounded-2xl">
                    <span className="text-slate-400 text-xs">No matching transactions found.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== C. DONOR RECOGNITION WALL ==================== */}
        {activeTab === 'donors' && (
          <div className="p-5 flex flex-col gap-4">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Philanthropy Partners</span>
              <h3 className="text-xl font-extrabold text-slate-800">Donor Wall of Fame</h3>
            </div>

            <p className="text-slate-400 text-xs font-semibold leading-relaxed">
              We are deeply grateful to the institutions and families funding the healthcare access revolution.
            </p>

            <div className="flex flex-col gap-3.5 mt-2">
              {MOCK_DONORS.map((don) => (
                <div
                  key={don.id}
                  className="glass-panel p-4.5 rounded-3xl border border-white/60 shadow-lg shadow-slate-100/40 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{don.name}</h4>
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold inline-block mt-0.5">
                        {don.badge}
                      </span>
                    </div>
                    <span className="text-base font-extrabold text-slate-800">
                      {don.amount}
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs font-semibold leading-relaxed italic border-l-2 border-slate-150 pl-3">
                    "{don.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Admin Bottom Navigation tabs */}
      <div className="absolute bottom-0 inset-x-0 h-18 bg-white/90 backdrop-blur-md border-t border-slate-100 z-40 shrink-0 grid grid-cols-3 select-none px-2 shadow-2xl">
        
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
            activeTab === 'approvals' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-500'
          }`}
        >
          <span className="text-xl">📄</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">KYC Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('transparency')}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
            activeTab === 'transparency' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-500'
          }`}
        >
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Audit Chart</span>
        </button>

        <button
          onClick={() => setActiveTab('donors')}
          className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
            activeTab === 'donors' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-500'
          }`}
        >
          <span className="text-xl">🏆</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Donors Wall</span>
        </button>

      </div>

    </div>
  );
};
