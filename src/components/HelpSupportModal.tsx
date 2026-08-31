import React from 'react';
import {
  X,
  PhoneCall,
  Mail,
  Clock,
  HelpCircle,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useSupportConfig } from '../config/supportConfig';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose }) => {
  const { config } = useSupportConfig();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="help-support-modal"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Patient Support / Need Help</h3>
              <p className="text-xs text-slate-400">
                Pharmacovigilance Helpdesk & Patient Assistance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Context card */}
          <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-1.5 text-teal-950">
            <p className="font-bold text-sm text-teal-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-700" />
              <span>Drug Safety & Reporting Guidance</span>
            </p>
            <p className="text-slate-600 leading-relaxed">
              If you or a loved one are experiencing severe or life-threatening symptoms, please call emergency services immediately. For adverse event reporting queries or case assistance, our support team is available to assist you.
            </p>
          </div>

          {/* Support Information Cards */}
          <div className="space-y-3">
            {/* Phone */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3.5 hover:border-teal-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Support Phone Number
                </span>
                <a
                  href={`tel:${config.phoneNumber}`}
                  className="text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors font-mono block mt-0.5"
                >
                  {config.phoneDisplay}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3.5 hover:border-teal-300 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Support Email Address
                </span>
                <a
                  href={`mailto:${config.emailAddress}`}
                  className="text-sm font-bold text-teal-800 hover:text-teal-950 transition-colors block mt-0.5"
                >
                  {config.emailDisplay}
                </a>
              </div>
            </div>

            {/* Working Hours */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Support Working Hours
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {config.workingHours}
                </p>
                {config.urgentTriageNote && (
                  <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>{config.urgentTriageNote}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

