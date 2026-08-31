import React, { useState } from 'react';
import {
  ShieldCheck,
  BookOpen,
  HelpCircle,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AboutPvProps {
  onNavigate: (tab: string) => void;
}

export const AboutPharmacovigilance: React.FC<AboutPvProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need absolute proof that the medication caused the adverse event before reporting?',
      a: 'No, absolute proof or clinical certainty is never required. Pharmacovigilance relies on spontaneous reporting of suspected adverse events. Even if you only suspect a connection, submitting a report helps safety epidemiologists detect emerging trends and patterns across thousands of patients.',
    },
    {
      q: 'What are the 4 minimum criteria required for an adverse event report (ICSR) to be valid?',
      a: 'According to international ICH guidelines, a valid Individual Case Safety Report (ICSR) requires at least four elements: (1) An identifiable reporter, (2) An identifiable patient, (3) At least one suspected medicinal product, and (4) At least one adverse reaction or symptom.',
    },
    {
      q: 'What is the difference between my opinion as a reporter and a formal causality assessment?',
      a: 'Your reporter opinion records your subjective impression of what occurred. A formal causality assessment is conducted separately by qualified pharmacovigilance physicians using standardized scientific criteria (such as the WHO-UMC or Naranjo algorithms) to evaluate biological plausibility, pharmacological mechanisms, and de-challenge factors.',
    },
    {
      q: 'Will my personal or identifying medical information be made public?',
      a: 'No. Strict patient confidentiality and data minimization principles are maintained. Reports transmitted to health authorities (such as the FDA, EMA, or WHO) are de-identified conforming to ICH E2B(R3) standards, preserving age, sex, and clinical data without exposing private personal identifiers.',
    },
    {
      q: 'What happens after I submit a report on AE Report?',
      a: 'Your report receives a unique Reference Number (e.g. PV-2026-000101). It enters the triage queue where drug safety specialists review the seriousness criteria, evaluate the timeline, contact you if additional details are needed, and perform standardized causality assessments.',
    },
    {
      q: 'Can family members or caregivers report on behalf of a patient?',
      a: 'Yes. Family members, legal guardians, and professional caregivers can report adverse events on behalf of a relative or client. The system accommodates proxy reporting while ensuring patient confidentiality.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Educational & Reference Guide</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Understanding Pharmacovigilance & Drug Safety
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Learn how spontaneous reporting of adverse drug reactions protects public health, informs clinical guidelines, and refines medication safety labels worldwide.
        </p>
      </div>

      {/* Section 1: What is PV & Why it matters */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            What is Pharmacovigilance (PV)?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The World Health Organization (WHO) defines <strong>Pharmacovigilance</strong> as the science and activities relating to the detection, assessment, understanding, and prevention of adverse effects or any other medicine- or vaccine-related problems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-5 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-2">
            <h4 className="font-bold text-teal-950 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700" />
              <span>Why Post-Marketing Surveillance Matters</span>
            </h4>
            <p className="text-xs text-teal-900 leading-relaxed">
              Clinical trials before drug approval involve limited numbers of selected patients under controlled conditions. Once a drug is prescribed widely, real-world reporting helps identify rare side effects, drug-drug interactions, and effects in diverse patient populations.
            </p>
          </div>

          <div className="p-5 bg-cyan-50/70 border border-cyan-200/80 rounded-2xl space-y-2">
            <h4 className="font-bold text-cyan-950 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-700" />
              <span>Signal Detection to Action</span>
            </h4>
            <p className="text-xs text-cyan-900 leading-relaxed">
              When safety specialists notice multiple similar reports (a "safety signal"), health authorities can investigate and take action — such as updating packaging warnings, issuing physician advisories, or modifying recommended dosages.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: The 4 Minimum ICSR Criteria */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
            ICH International Standard
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            The 4 Minimum Criteria of an Individual Case Safety Report (ICSR)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            For an adverse event submission to be medically evaluable and qualify as an ICSR under ICH guidelines, it must contain four core pillars:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm font-mono">
              1
            </div>
            <h4 className="font-bold text-white text-sm">Identifiable Reporter</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Name, qualification, or contact information enabling verification.
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm font-mono">
              2
            </div>
            <h4 className="font-bold text-white text-sm">Identifiable Patient</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Initials, age, sex, or unique demographic identifier.
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm font-mono">
              3
            </div>
            <h4 className="font-bold text-white text-sm">Suspected Drug</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Brand name or active pharmaceutical ingredient suspected of causing event.
            </p>
          </div>

          <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm font-mono">
              4
            </div>
            <h4 className="font-bold text-white text-sm">Adverse Event</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Description of the symptoms, onset time, or clinical reaction experienced.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: WHO-UMC Causality Categories Matrix */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            WHO-UMC Causality Assessment Framework
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Standard scientific algorithm applied by drug safety physicians to categorize medication relationship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
              Certain
            </span>
            <p className="text-slate-700 leading-relaxed">
              Plausible time relationship; cannot be explained by disease; positive de-challenge and verified positive re-challenge.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded text-[11px]">
              Probable / Likely
            </span>
            <p className="text-slate-700 leading-relaxed">
              Reasonable time relationship; unlikely to be attributed to concurrent disease; clinically reasonable de-challenge response.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded text-[11px]">
              Possible
            </span>
            <p className="text-slate-700 leading-relaxed">
              Reasonable time sequence; could also be explained by disease or other drugs; information on de-challenge may be lacking.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
              Unlikely
            </span>
            <p className="text-slate-700 leading-relaxed">
              Event with a time relationship that makes a causal connection improbable; other diseases or drugs provide plausible explanations.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded text-[11px]">
              Conditional / Unclassified
            </span>
            <p className="text-slate-700 leading-relaxed">
              More data needed before a proper assessment can be made, or additional data are under examination.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded text-[11px]">
              Unassessable
            </span>
            <p className="text-slate-700 leading-relaxed">
              Report suggesting an adverse reaction which cannot be judged because information is insufficient or contradictory.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Frequently Asked Questions Accordion */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Answers to common questions regarding patient safety reporting and data handling.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-900">{faq.q}</span>
                  <div className="p-1 rounded-lg bg-slate-100 text-slate-600">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Action Footer Callout */}
      <section className="bg-teal-50 border border-teal-200 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-teal-950">
          Have you or a patient experienced an adverse reaction?
        </h3>
        <p className="text-xs sm:text-sm text-teal-800 max-w-xl mx-auto leading-relaxed">
          Submitting a report takes just a few minutes. Every report is reviewed by qualified safety professionals to help protect patients.
        </p>
        <button
          onClick={() => onNavigate('report')}
          className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Begin Adverse Event Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
