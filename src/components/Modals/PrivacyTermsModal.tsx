import React, { useState } from 'react';
import { X, Shield, Lock, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyTermsModalProps {
  initialTab?: 'privacy' | 'terms' | 'disclaimer';
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({
  initialTab = 'privacy',
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base">Legal, Privacy & Medical Safety Information</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy Notice & Data Minimization</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-teal-600 text-teal-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Use & Prototype Notice</span>
          </button>
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'disclaimer'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Medical Emergency Disclaimer</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p className="text-xs">
                  <strong>Data Minimization Principle:</strong> We only collect information strictly relevant to drug safety evaluation. Government identification is optional and never exposed without necessity.
                </p>
              </div>

              <h4 className="font-bold text-slate-900 text-sm">1. Purpose of Data Collection</h4>
              <p>
                The information provided in this reporting portal is gathered solely for post-marketing drug safety surveillance, signal detection, adverse drug reaction (ADR) evaluation, and quality improvement.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Confidentiality & Security</h4>
              <p>
                Personal identifying details (such as direct contact numbers and addresses) are restricted to authorized pharmacovigilance safety officers for legitimate follow-up and verification. Government ID information is entirely optional and encrypted.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. De-identification & Regulatory Transmissions</h4>
              <p>
                In standard pharmacovigilance operations conforming to ICH E2B(R3) specifications, patient details are pseudonymized/anonymized using age bands, initials, and age-at-onset before case transmission to health authorities.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">4. Reporter Rights</h4>
              <p>
                Reporters may contact the pharmacovigilance unit at any time to submit supplemental clinical information, request report status updates, or correct inadvertently submitted records.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">1. Prototype Demonstration Purpose</h4>
              <p>
                <strong>AE Report</strong> is an interactive educational and portfolio software prototype. All sample cases, patient names, and physician credentials supplied within the seed system represent fictional demo data.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">2. Nature of Adverse Event Reports</h4>
              <p>
                Submitting a report through this platform records a <em>suspected</em> temporal association between a medication and a clinical symptom. It does not establish legal liability, regulatory culpability, or proof of drug causation.
              </p>

              <h4 className="font-bold text-slate-900 text-sm">3. Separation of Reporter Opinion and Professional Assessment</h4>
              <p>
                The subjective impression or suspicion of the reporter is recorded without alteration. Formal scientific causality assessment is performed separately by trained pharmacovigilance personnel using standardized algorithms (e.g., WHO-UMC, Naranjo).
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-900">NOT AN EMERGENCY MEDICAL SERVICE</h4>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    This reporting system is designed for retrospective pharmacovigilance documentation and cannot provide real-time medical intervention, diagnostic triage, or emergency medical treatment.
                  </p>
                </div>
              </div>

              <p>
                If you, your patient, or a family member are experiencing acute symptoms such as:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
                <li>Severe difficulty breathing or chest tightness</li>
                <li>Sudden swelling of face, lips, tongue, or throat (anaphylaxis)</li>
                <li>Loss of consciousness, severe confusion, or seizures</li>
                <li>Severe unexpected bleeding or acute chest pain</li>
              </ul>
              <p className="font-bold text-slate-900">
                Please call your local emergency emergency number (911 in the US/Canada, 112 in Europe, 999 in the UK) or go to the nearest emergency room immediately.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close & Understand
          </button>
        </div>
      </div>
    </div>
  );
};
