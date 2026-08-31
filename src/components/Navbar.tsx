import React, { useState } from 'react';
import {
  ShieldCheck,
  FilePlus2,
  Search,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  Users,
  Activity,
  Menu,
  X,
  UserCheck,
  History,
  Phone,
  LogOut,
  User,
  PhoneCall,
  Mail,
  Clock,
} from 'lucide-react';
import { User as AppUser } from '../types';
import { useReporterAuth } from '../context/ReporterAuthContext';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string, param?: string) => void;
  currentUser: AppUser;
  onUserChange: (user: AppUser) => void;
  onOpenHelp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  currentUser,
  onUserChange,
  onOpenHelp,
}) => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const {
    reporter,
    isLoggedIn,
    openLoginModal,
    openProfileModal,
    logout,
  } = useReporterAuth();

  const availableUsers: AppUser[] = [
    {
      id: 'user_patient_1',
      name: 'Jane Doe',
      role: 'reporter',
      organization: 'Patient / Consumer Reporter',
      title: 'Individual Reporter',
      email: 'jane.patient@example-demo.com',
    },
    {
      id: 'user_physician_1',
      name: 'Dr. Arthur Davis, MD',
      role: 'reporter',
      organization: 'St. Jude Memorial Hospital',
      title: 'Attending Physician / Cardiologist',
      email: 'dr.davis@stjude-hospital-demo.org',
    },
    {
      id: 'user_reviewer_1',
      name: 'Elena Rostova, PharmD',
      role: 'pv_reviewer',
      organization: 'Pharmacovigilance & Drug Safety Unit',
      title: 'Senior PV Safety Specialist',
      email: 'e.rostova@aereport-regulatory.gov',
    },
    {
      id: 'user_admin_1',
      name: 'Marcus Vance',
      role: 'admin',
      organization: 'AE Report Health Authority',
      title: 'PV Systems Administrator',
      email: 'm.vance@aereport-admin.org',
    },
  ];

  const navLinks = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'report', label: 'Report Adverse Event', icon: FilePlus2, highlight: true },
    { id: 'history', label: 'History / My Reports', icon: History },
    { id: 'status', label: 'Check Status', icon: Search },
    { id: 'about', label: 'About Pharmacovigilance', icon: BookOpen },
    { id: 'dashboard', label: 'PV Safety Portal', icon: LayoutDashboard, badge: 'Staff' },
  ];

  const handleHamburgerNav = (tabId: string) => {
    setHamburgerOpen(false);
    onNavigate(tabId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => onNavigate('home')}
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  AE<span className="text-teal-600">Report</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded">
                  Portal
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Pharmacovigilance & Drug Safety Reporting
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;

              if (link.highlight) {
                return (
                  <button
                    key={link.id}
                    id={`nav-${link.id}`}
                    onClick={() => onNavigate(link.id)}
                    className={`ml-1 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-teal-700/30 ring-2 ring-teal-500/50'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={link.id}
                  id={`nav-${link.id}`}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-2 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-teal-800 bg-teal-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded-sm ml-0.5">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Controls (Reporter Auth Status & Hamburger Button) */}
          <div className="flex items-center gap-2">
            {/* Quick Reporter Auth status button on desktop */}
            {isLoggedIn && reporter ? (
              <button
                onClick={openProfileModal}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-xs text-teal-900 font-semibold transition-colors cursor-pointer"
                title="View Reporter Profile"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate max-w-[120px]">{reporter.fullName}</span>
                <span className="text-[10px] bg-teal-200/70 text-teal-900 px-1.5 py-0.2 rounded">
                  {reporter.reporterType === 'Doctor / Healthcare Professional' ? 'Doctor' : reporter.reporterType}
                </span>
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
              >
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Reporter Login</span>
              </button>
            )}

            {/* Need Help Quick Button */}
            {onOpenHelp && (
              <button
                onClick={onOpenHelp}
                className="hidden sm:flex p-2 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                title="Need Help? / Patient Support"
                aria-label="Need Help"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            )}

            {/* Hamburger Menu Toggle Button */}
            <button
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label="Toggle navigation and account menu"
              id="hamburger-menu-btn"
            >
              {hamburgerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="text-xs font-bold hidden md:inline">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hamburger Drawer / Dropdown */}
      {hamburgerOpen && (
        <div
          className="border-t border-slate-200 bg-white px-4 sm:px-6 pt-4 pb-6 shadow-xl space-y-4 animate-in slide-in-from-top-2 duration-200"
          id="hamburger-drawer"
        >
          {/* Section 1: Reporter Account / Profile Status */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-600" />
                <span>Reporter Account</span>
              </span>
              {isLoggedIn && reporter && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Active Session
                </span>
              )}
            </div>

            {isLoggedIn && reporter ? (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{reporter.fullName}</h4>
                    <p className="text-xs text-slate-500 font-mono">
                      {reporter.phoneCountryCode} {reporter.mobile}
                    </p>
                    <p className="text-[11px] text-teal-700 font-medium">{reporter.reporterType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setHamburgerOpen(false);
                      openProfileModal();
                    }}
                    className="flex-1 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setHamburgerOpen(false);
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Log in or register with your phone number to automatically save and load your reporter details for all adverse event submissions.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setHamburgerOpen(false);
                      openLoginModal();
                    }}
                    className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Sign In with Phone</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Core Menu Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleHamburgerNav('report')}
              className="p-3 text-left bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 rounded-xl text-xs font-bold text-teal-950 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FilePlus2 className="w-4 h-4 text-teal-700" />
                <span>New Adverse Event Report</span>
              </div>
              <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded font-semibold">Start</span>
            </button>

            <button
              onClick={() => handleHamburgerNav('history')}
              className="p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-teal-600" />
                <span>History / My Reports</span>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">5-Day Edit</span>
            </button>

            <button
              onClick={() => handleHamburgerNav('status')}
              className="p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Check Report Status</span>
            </button>

            <button
              onClick={() => handleHamburgerNav('about')}
              className="p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>About Pharmacovigilance & FAQ</span>
            </button>

            <button
              onClick={() => handleHamburgerNav('dashboard')}
              className="p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-between sm:col-span-2 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>PV Safety Portal</span>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">Staff</span>
            </button>
          </div>

          {/* Section 3: Patient Support / Need Help (Fixed Contact Details) */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <HelpCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white">Patient Support / Need Help</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setHamburgerOpen(false);
                  if (onOpenHelp) onOpenHelp();
                }}
                className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 underline cursor-pointer"
              >
                View Details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
              {/* Phone */}
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <PhoneCall className="w-3 h-3 text-teal-400" />
                  <span>Support Phone Number</span>
                </div>
                <a
                  href="tel:+916295234084"
                  className="font-bold text-white hover:text-teal-300 transition-colors font-mono block text-xs"
                >
                  +91 6295234084
                </a>
              </div>

              {/* Email */}
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Mail className="w-3 h-3 text-teal-400" />
                  <span>Support Email Address</span>
                </div>
                <a
                  href="mailto:arijitkhanrah10@gmail.com"
                  className="font-bold text-white hover:text-teal-300 transition-colors block text-xs truncate"
                  title="arijitkhanrah10@gmail.com"
                >
                  arijitkhanrah10@gmail.com
                </a>
              </div>

              {/* Working Hours */}
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Clock className="w-3 h-3 text-teal-400" />
                  <span>Support Working Hours</span>
                </div>
                <p className="font-bold text-slate-200 text-xs">
                  Every day, 10:00 AM – 10:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Demo Persona Switcher */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Switch Demo Persona</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onUserChange(u);
                    setHamburgerOpen(false);
                  }}
                  className={`text-left p-2 rounded-xl text-xs flex items-center justify-between border transition-colors cursor-pointer ${
                    u.id === currentUser.id
                      ? 'bg-teal-50 border-teal-300 text-teal-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold leading-tight">{u.name}</p>
                    <p className="text-[10px] text-slate-500">{u.role}</p>
                  </div>
                  {u.id === currentUser.id && <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
