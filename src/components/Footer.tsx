import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Lock, HeartPulse, ExternalLink, FileText } from 'lucide-react';
import { PrivacyTermsModal } from './Modals/PrivacyTermsModal';
import { useSupportConfig } from '../config/supportConfig';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);
  const { config } = useSupportConfig();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Disclaimer Notice */}
        <div className="bg-slate-800/80 rounded-xl p-5 mb-10 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center gap-4 text-xs text-slate-300">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">
              Important Pharmacovigilance Principle & Causality Notice:
            </p>
            <p className="text-slate-400 leading-relaxed">
              Reporting an adverse event does not necessarily mean that the medicine caused the event. Submissions are documented as suspected reports and evaluated by qualified pharmacovigilance safety physicians and specialists. This portal uses strictly fictional demonstration data for educational and portfolio presentation purposes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">AE Report</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standardized, confidential adverse drug reaction intake platform for patients, consumers, and healthcare providers.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 pt-1 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>TLS 1.3 & E2B(R3) Pharmacovigilance Compliance</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="hover:text-teal-400 transition-colors text-left font-semibold text-teal-300"
                >
                  Report Adverse Event (14 Steps)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('history')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  History & My Reports (5-Day Edit)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('status')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Check Report Status & Follow-up
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  About Pharmacovigilance & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  PV Safety Portal (Staff Access)
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Compliance & Privacy</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setModalType('privacy')}
                  className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>Privacy Notice & Data Security</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('terms')}
                  className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>Terms of Adverse Event Reporting</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('disclaimer')}
                  className="hover:text-teal-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>Regulatory Disclaimer (ICH / E2B)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Pharmacovigilance Helpdesk</p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <p>
                📞 Phone:{' '}
                <a href={`tel:${config.phoneNumber}`} className="text-slate-300 hover:text-white underline font-mono">
                  {config.phoneDisplay}
                </a>
              </p>
              <p>
                ✉️ Email:{' '}
                <a href={`mailto:${config.emailAddress}`} className="text-slate-300 hover:text-white underline">
                  {config.emailDisplay}
                </a>
              </p>
              <p>🕒 Hours: <span className="text-slate-300">{config.workingHours}</span></p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 AE Report Prototype. Designed for Drug Safety & Pharmacovigilance Education.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Fictional Clinical Demo Data</span>
            <span>•</span>
            <span>E2B(R3) ICSR Ready</span>
          </div>
        </div>
      </div>

      {modalType && (
        <PrivacyTermsModal
          initialTab={modalType}
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </footer>
  );
};
