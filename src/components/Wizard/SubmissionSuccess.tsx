import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Search,
  FileText,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AdverseEventReport } from '../../types';

interface SubmissionSuccessProps {
  referenceNumber: string;
  verificationCode: string;
  report?: AdverseEventReport;
  onNavigate: (tab: string, param?: string) => void;
  onNewReport: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  referenceNumber,
  verificationCode,
  report,
  onNavigate,
  onNewReport,
}) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = (text: string, isCode = false) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8 text-center animate-in fade-in zoom-in-95">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Thank You for Your Report
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Your adverse event report has been successfully submitted to the pharmacovigilance safety evaluation queue.
          </p>
        </div>

        {/* Reference & Security Code Card */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-4 max-w-xl mx-auto">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Unique Report Reference Number
            </span>
            <div className="flex items-center justify-between gap-2 p-3 bg-white border border-slate-300 rounded-xl">
              <span className="text-lg sm:text-xl font-bold font-mono text-teal-700 select-all">
                {referenceNumber}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(referenceNumber, false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Copy reference number"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRef ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Status Verification Code
            </span>
            <div className="flex items-center justify-between gap-2 p-3 bg-white border border-slate-300 rounded-xl">
              <span className="text-sm font-semibold font-mono text-slate-800 select-all">
                {verificationCode}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(verificationCode, true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Copy verification code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-600">
            <span>Date Submitted: <strong>{new Date().toLocaleDateString()}</strong></span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
              Status: Submitted
            </span>
          </div>
        </div>

        {/* Informational Guidance */}
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-left text-xs text-teal-900 space-y-2 max-w-xl mx-auto">
          <div className="flex items-center gap-2 font-bold text-teal-950">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Next Steps in the Safety Review</span>
          </div>
          <p className="leading-relaxed text-teal-800">
            Please keep your Reference Number and Verification Code in a safe place. Our drug safety officers will evaluate the report. If additional clinical details are required, you may receive a follow-up request query on this platform.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => onNavigate('status', `${referenceNumber}|${verificationCode}`)}
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>Track Case Status Now</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={onNewReport}
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Submit Another Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
