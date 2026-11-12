import React, { useState } from 'react';
import { UserRole } from '../types/drc';
import {
  FlaskConical,
  LayoutDashboard,
  PlusCircle,
  Mail,
  RotateCcw,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'create-batch' | 'email-outbox';
  setCurrentTab: (tab: 'dashboard' | 'create-batch' | 'email-outbox') => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  unreadEmailCount: number;
  onResetData: () => void;
  pendingCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  setActiveRole,
  unreadEmailCount,
  onResetData,
  pendingCount,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; icon: string }[] = [
    {
      role: 'Staf Makmal',
      label: 'Staf Makmal',
      desc: 'Kemasukan data pukal & pembetulan',
      icon: '🧪',
    },
    {
      role: 'Supervisor',
      label: 'Supervisor',
      desc: 'Semakan, kelulusan & penolakan',
      icon: '👔',
    },
    {
      role: 'Pegawai',
      label: 'Pegawai',
      desc: 'Laporan rasmi & muat turun data',
      icon: '📊',
    },
  ];

  return (
    <>
      <header className="bg-emerald-900 text-white shadow-md border-b border-emerald-800 sticky top-0 z-40 print:hidden">
        {/* Top announcement / Role highlight bar */}
        <div className="bg-emerald-950 px-4 py-1.5 text-xs text-emerald-200 border-b border-emerald-900/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              <strong>Mod Prototype Interaktif:</strong> Pengiraan automatik DRC (Dry Rubber Content) &amp; Kawalan Kelulusan.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-300">
              Peranan Aktif:{' '}
              <span className="bg-emerald-800 text-white px-2 py-0.5 rounded font-semibold text-xs border border-emerald-700">
                {activeRole}
              </span>
            </span>
            {activeRole === 'Supervisor' && pendingCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                {pendingCount} menunggu kelulusan anda
              </span>
            )}
          </div>
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center border border-emerald-500/50 shadow-inner group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                    RubberDRC <span className="text-emerald-400 font-bold">Pro</span>
                  </div>
                  <div className="text-[11px] text-emerald-300 font-medium tracking-wide">
                    Sistem Pengiraan &amp; Kelulusan DRC
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-emerald-950/60 p-1 rounded-xl border border-emerald-800/80">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'dashboard'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard &amp; Senarai
              </button>

              {/* + Input Batch: Staf Makmal only as per PRD */}
              {activeRole === 'Staf Makmal' ? (
                <button
                  onClick={() => setCurrentTab('create-batch')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    currentTab === 'create-batch'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-300" />
                  + Input Batch Baharu
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveRole('Staf Makmal');
                    setCurrentTab('create-batch');
                  }}
                  title="Tukar ke peranan Staf Makmal untuk input batch baharu"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-emerald-400/80 hover:text-emerald-200 hover:bg-emerald-900/40 opacity-75 hover:opacity-100"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  + Input Batch (Tukar Staf)
                </button>
              )}

              <button
                onClick={() => setCurrentTab('email-outbox')}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'email-outbox'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
                }`}
              >
                <Mail className="w-4 h-4" />
                Email Outbox (Simulasi)
                {unreadEmailCount > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-rose-500 rounded-full animate-bounce">
                    {unreadEmailCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Right controls: Role Switcher & Reset button */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Role Switcher */}
              <div className="flex items-center gap-2 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
                <span className="text-xs text-emerald-300 font-medium">Peranan:</span>
                <div className="flex items-center gap-1">
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => setActiveRole(r.role)}
                      title={r.desc}
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                        activeRole === r.role
                          ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                          : 'text-emerald-300 hover:text-white hover:bg-emerald-900'
                      }`}
                    >
                      <span>{r.icon}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Demo Data Button */}
              <button
                onClick={() => setShowResetConfirm(true)}
                title="Kembalikan data demo asal (1 Approved, 1 Pending, 1 Rejected)"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-emerald-300 hover:text-white hover:bg-emerald-800/80 rounded-lg border border-emerald-700/60 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Reset Demo</span>
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pt-2 pb-4 space-y-3 bg-emerald-950 border-t border-emerald-800 animate-in fade-in">
            <div className="space-y-1">
              <button
                onClick={() => {
                  setCurrentTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${
                  currentTab === 'dashboard' ? 'bg-emerald-700 text-white' : 'text-emerald-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard &amp; Senarai Batch
              </button>

              <button
                onClick={() => {
                  setActiveRole('Staf Makmal');
                  setCurrentTab('create-batch');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${
                  currentTab === 'create-batch' ? 'bg-emerald-700 text-white' : 'text-emerald-200'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                + Input Batch Baharu
              </button>

              <button
                onClick={() => {
                  setCurrentTab('email-outbox');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold ${
                  currentTab === 'email-outbox' ? 'bg-emerald-700 text-white' : 'text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Outbox (Simulasi)
                </div>
                {unreadEmailCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-rose-500 rounded-full">
                    {unreadEmailCount} baru
                  </span>
                )}
              </button>
            </div>

            <div className="pt-2 border-t border-emerald-800">
              <div className="text-xs font-semibold text-emerald-400 mb-2">Tukar Peranan Ujian:</div>
              <div className="grid grid-cols-3 gap-1">
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setActiveRole(r.role);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-xs py-1.5 px-2 rounded font-semibold text-center ${
                      activeRole === r.role
                        ? 'bg-emerald-600 text-white ring-1 ring-emerald-300'
                        : 'bg-emerald-900/60 text-emerald-200'
                    }`}
                  >
                    <div>{r.icon}</div>
                    <div className="truncate text-[11px]">{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowResetConfirm(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-emerald-300 bg-emerald-900/50 rounded-lg border border-emerald-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Data Contoh (Demo Data)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Set Semula Data Contoh?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Tindakan ini akan mengembalikan data kepada keadaan asal (1 batch <strong>Approved</strong>, 1 batch{' '}
              <strong>Pending Approval</strong>, dan 1 batch <strong>Rejected</strong>) berserta rekod email simulasi. Sebarang batch baharu yang anda cipta akan dipadam.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
              >
                Ya, Set Semula Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
