import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  User,
  Stethoscope,
  Users,
  Search,
  CheckCircle2,
  HelpCircle,
  FileText,
  Activity,
  ChevronRight,
  HeartHandshake,
  Clock,
  Sparkles,
  Info,
  AlertTriangle,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: string, param?: string) => void;
  onStartReportWithType?: (reporterType: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onStartReportWithType }) => {
  const [quickRef, setQuickRef] = useState('');
  const [quickCode, setQuickCode] = useState('');

  const handleQuickStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRef.trim()) {
      onNavigate('status', `${quickRef.trim()}|${quickCode.trim()}`);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-850 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,148,136,0.25),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Prototype Notice Banner */}
          <div className="max-w-3xl mx-auto" id="homepage-prototype-notice">
            <div className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-medium shadow-sm backdrop-blur-sm flex items-center justify-center gap-2.5 text-center leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>⚠️ Prototype Notice:</strong> This website is a prototype developed for demonstration and educational purposes only. It is not an official pharmacovigilance or regulatory reporting system.
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Pharmacovigilance & Patient Safety Network
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Report a Suspected <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
              Adverse Event
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Your report can help improve medication safety and protect patients worldwide. Every report matters.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('report')}
              id="hero-report-btn"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base shadow-lg shadow-teal-500/25 hover:shadow-teal-400/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Report an Adverse Event</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('about')}
              id="hero-learn-btn"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-base border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Learn About Pharmacovigilance</span>
              <Info className="w-4 h-4 opacity-70" />
            </button>
          </div>

          {/* Core Safety & Medical Distinction Notice */}
          <div className="max-w-3xl mx-auto pt-6">
            <div className="bg-slate-800/90 border border-slate-700/90 rounded-xl p-4 text-left text-xs text-slate-300 space-y-2 shadow-inner">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Critical Safety Notice:</span>
              </div>
              <p className="text-slate-300 leading-relaxed pl-6">
                This reporting system is <strong>not intended for medical emergencies</strong>. If you or someone else is experiencing a medical emergency, contact your local emergency medical service immediately.
              </p>
              <div className="border-t border-slate-700/70 pt-2 pl-6 text-slate-400">
                <span>
                  <strong>Important:</strong> Reporting an adverse event does not necessarily mean that the medicine caused the event. Reports are evaluated by qualified pharmacovigilance professionals.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section 1: Information Cards for 3 Reporter Categories */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Who Can Submit a Safety Report?
            </h2>
            <p className="text-sm text-slate-600">
              Select your category below to initiate a streamlined, dynamically adapted report.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Patients */}
            <div
              className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-teal-400 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => onStartReportWithType ? onStartReportWithType('Patient') : onNavigate('report')}
              id="card-reporter-patient"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Patients
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Direct personal reporting of symptoms or unexpected side effects after taking a medication.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <p className="font-semibold text-slate-700">Helpful to have:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Medication name & dosage</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Date symptoms started</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Description in your own words</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-800 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
                  <span>Report as a Patient</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Healthcare Professionals */}
            <div
              className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-teal-400 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => onStartReportWithType ? onStartReportWithType('Doctor / Healthcare Professional') : onNavigate('report')}
              id="card-reporter-hcp"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    Healthcare Professionals
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Physicians, pharmacists, nurses, and hospital clinicians observing suspected adverse drug reactions (ADRs).
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <p className="font-semibold text-slate-700">Clinical fields supported:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>Batch/Lot number & Expiry</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>Concomitant meds & Lab findings</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>E2B(R3) standard compatibility</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full py-2.5 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-600 text-cyan-800 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
                  <span>Report as Doctor / HCP</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. Family Members & Caregivers */}
            <div
              className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-teal-400 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() => onStartReportWithType ? onStartReportWithType('Caregiver') : onNavigate('report')}
              id="card-reporter-caregiver"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Family Members & Caregivers
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Reporting on behalf of a relative, child, elderly dependent, or client under your care.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <p className="font-semibold text-slate-700">What you can include:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Patient details with privacy protection</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Optional treating doctor info</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>"I don't know" options for clinical details</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
                  <span>Report as Family / Caregiver</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Quick Status Checker Widget */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-semibold">
                <Search className="w-3.5 h-3.5" />
                <span>Track Existing Case</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Already Submitted a Report?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Enter your unique <strong>Report Reference Number</strong> (e.g. <code className="text-teal-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">PV-2026-000101</code>) and verification details to check review progress or respond to reviewer inquiries.
              </p>
              <div className="pt-1 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Real-time Triage Status</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Interactive Follow-up</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 shadow-lg">
              <form onSubmit={handleQuickStatusSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Report Reference Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PV-2026-000101"
                    value={quickRef}
                    onChange={(e) => setQuickRef(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Verification (Security Code / Email / Phone) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SAFE-4921 or dr.davis@stjude-hospital-demo.org"
                    value={quickCode}
                    onChange={(e) => setQuickCode(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Search className="w-4 h-4" />
                    <span>Check Case Status</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickRef('PV-2026-000104');
                      setQuickCode('family.d.demo@example.com');
                    }}
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs transition-colors"
                    title="Fill with demo data having active follow-up"
                  >
                    Demo Ref
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Section 3: How the Pharmacovigilance Process Works */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              The Pharmacovigilance Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              What happens after you submit an adverse event report?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 relative space-y-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Spontaneous Submission</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                You submit the suspected event. The system validates entries and generates a unique tamper-evident Reference ID.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 relative space-y-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Medical Triage & Seriousness</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Qualified drug safety officers triage the report against regulatory criteria (Death, Life-threatening, Hospitalization).
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 relative space-y-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Causality Assessment</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Physicians apply WHO-UMC / Naranjo causality scoring to evaluate biological plausibility and de-challenge factors.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 relative space-y-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Signal Detection & Action</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aggregated findings protect public health through updated package inserts, clinical alerts, or safety warnings.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Quick Launch Callout */}
        <section className="bg-teal-50 border border-teal-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-teal-950">
              Ready to report a suspected side effect?
            </h3>
            <p className="text-xs sm:text-sm text-teal-800 max-w-xl leading-relaxed">
              Our 15-step intuitive wizard guides you through the process step-by-step with automatic BMI calculations, visual event timelines, and instant draft saving.
            </p>
          </div>
          <button
            onClick={() => onNavigate('report')}
            className="px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            Start Adverse Event Report
          </button>
        </section>
      </div>
    </div>
  );
};
