import React from 'react';
import { PhoneCall, Mail, Clock, HelpCircle, ShieldAlert } from 'lucide-react';
import { useSupportConfig } from '../config/supportConfig';

interface SupportSectionProps {
  compact?: boolean;
  className?: string;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  compact = false,
  className = '',
}) => {
  const { config } = useSupportConfig();

  return (
    <div
      id="contact-support-section"
      className={`bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Title & Context */}
        <div className="space-y-2 max-w-md">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-500/30">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need Help? / Patient Support</span>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Pharmacovigilance Helpdesk & Assistance
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Have questions about reporting, causality fields, or need help completing your submission? Our dedicated drug safety team is available to assist you.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          {/* Phone */}
          <div className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700/60 transition-colors space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                Support Phone Number
              </span>
              <a
                href={`tel:${config.phoneNumber}`}
                className="text-sm font-bold text-white hover:text-teal-300 transition-colors block font-mono"
              >
                {config.phoneDisplay}
              </a>
            </div>
            <span className="text-[10px] text-slate-400 block">Toll-free / Helpdesk Line</span>
          </div>

          {/* Email */}
          <div className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700/60 transition-colors space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                Support Email Address
              </span>
              <a
                href={`mailto:${config.emailAddress}`}
                className="text-xs font-bold text-white hover:text-teal-300 transition-colors block truncate"
                title={config.emailAddress}
              >
                {config.emailDisplay}
              </a>
            </div>
            <span className="text-[10px] text-slate-400 block">Safety Intake & Helpdesk</span>
          </div>

          {/* Operating Hours */}
          <div className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700/60 transition-colors space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                Support Working Hours
              </span>
              <p className="text-xs font-bold text-white">{config.workingHours}</p>
            </div>
            <p className="text-[10px] text-amber-300 flex items-center gap-1 font-semibold">
              <ShieldAlert className="w-3 h-3 shrink-0" />
              <span>{config.urgentTriageNote}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

