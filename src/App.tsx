/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './components/Home';
import { WizardContainer } from './components/Wizard/WizardContainer';
import { StatusChecker } from './components/StatusChecker';
import { PvDashboard } from './components/Dashboard/PvDashboard';
import { AboutPharmacovigilance } from './components/AboutPharmacovigilance';
import { MyReportsView } from './components/MyReports/MyReportsView';
import { ReporterAuthProvider } from './context/ReporterAuthContext';
import { ReporterAuthModal } from './components/ReporterAuth/ReporterAuthModal';
import { ReporterProfileModal } from './components/ReporterAuth/ReporterProfileModal';
import { HelpSupportModal } from './components/HelpSupportModal';
import { AdverseEventReport, ReporterType, User as AppUser } from './types';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [initialReporterType, setInitialReporterType] = useState<ReporterType | undefined>(undefined);
  const [editingReport, setEditingReport] = useState<AdverseEventReport | null>(null);
  const [statusParam, setStatusParam] = useState<{ ref: string; code: string }>({ ref: '', code: '' });
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Current logged in simulation persona
  const [currentUser, setCurrentUser] = useState<AppUser>({
    id: 'user_physician_1',
    name: 'Dr. Arthur Davis, MD',
    role: 'PV_PHYSICIAN',
    email: 'dr.davis@stjude-hospital-demo.org',
  });

  // Handle navigation
  const handleNavigate = (tab: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tab === 'status' && param) {
      const parts = param.split('|');
      setStatusParam({ ref: parts[0] || '', code: parts[1] || '' });
    }

    if (tab === 'faq') {
      setActiveTab('about');
      return;
    }

    if (tab === 'help') {
      setIsHelpModalOpen(true);
      return;
    }

    if (tab !== 'report') {
      setEditingReport(null);
    }

    setActiveTab(tab);
  };

  const handleStartReportWithType = (reporterType: string) => {
    setInitialReporterType(reporterType as ReporterType);
    setEditingReport(null);
    setActiveTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditReport = (report: AdverseEventReport) => {
    setEditingReport(report);
    setActiveTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingReport(null);
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Critical Medical Emergency Alert Banner */}
      <EmergencyBanner />

      {/* Main Header with Hamburger Menu & Reporter Status */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onUserChange={setCurrentUser}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onStartReportWithType={handleStartReportWithType}
          />
        )}

        {activeTab === 'report' && (
          <WizardContainer
            initialReporterType={initialReporterType}
            editingReport={editingReport}
            onCancelEdit={handleCancelEdit}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'history' && (
          <MyReportsView
            onNavigate={handleNavigate}
            onEditReport={handleEditReport}
          />
        )}

        {activeTab === 'status' && (
          <StatusChecker
            initialRef={statusParam.ref}
            initialCode={statusParam.code}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'dashboard' && (
          <PvDashboard
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'about' && (
          <AboutPharmacovigilance onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global Pharmacovigilance Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Modals */}
      <ReporterAuthModal />
      <ReporterProfileModal />
      <HelpSupportModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReporterAuthProvider>
      <AppContent />
    </ReporterAuthProvider>
  );
}
