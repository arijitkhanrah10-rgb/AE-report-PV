import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Stethoscope,
  Pill,
  AlertTriangle,
  Clock,
  Send,
  Download,
  FileCode,
  CheckCircle2,
  Lock,
  User,
  History,
  FileText,
  Activity,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  AdverseEventReport,
  CausalityCategory,
  ReportStatus,
  User as AppUser,
} from '../../types';
import { api } from '../../services/api';
import { VisualTimeline } from '../Wizard/VisualTimeline';

interface CaseAssessmentModalProps {
  report: AdverseEventReport;
  currentUser: { id: string; name: string; role: any; email: string };
  isOpen: boolean;
  onClose: () => void;
  onReportUpdated: (updatedReport: AdverseEventReport) => void;
}

export const CaseAssessmentModal: React.FC<CaseAssessmentModalProps> = ({
  report,
  currentUser,
  isOpen,
  onClose,
  onReportUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'causality' | 'queries'>('details');

  // Status state
  const [currentStatus, setCurrentStatus] = useState<ReportStatus>(report.status);
  const [statusComment, setStatusComment] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Causality state
  const [causalityCategory, setCausalityCategory] = useState<CausalityCategory>(
    report.assessment?.causalityAssessment || 'Possible'
  );
  const [rationale, setRationale] = useState(report.assessment?.reviewerComments || '');
  const [medicalOfficerComments, setMedicalOfficerComments] = useState(report.assessment?.medicalAssessment || '');
  const [expeditedReportingRequired, setExpeditedReportingRequired] = useState(
    report.assessment?.expectednessAssessment === 'Unexpected / Unlisted'
  );
  const [isSavingCausality, setIsSavingCausality] = useState(false);
  const [causalitySavedToast, setCausalitySavedToast] = useState(false);

  // Follow-up query state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isSendingQuery, setIsSendingQuery] = useState(false);

  if (!isOpen) return null;

  const handleStatusChange = async (newStatus: ReportStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await api.updateReportStatus(report.id, newStatus, statusComment.trim() || undefined);
      if (res.success && res.data) {
        setCurrentStatus(newStatus);
        onReportUpdated(res.data);
        setStatusComment('');
      }
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveCausality = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCausality(true);
    try {
      const res = await api.saveCausalityAssessment(report.id, {
        category: causalityCategory,
        rationale,
        medicalOfficerComments,
        expeditedReportingRequired,
      });
      if (res.success && res.data) {
        onReportUpdated(res.data);
        setCausalitySavedToast(true);
        setTimeout(() => setCausalitySavedToast(false), 3000);
      }
    } catch (e) {
      console.error('Failed to save causality assessment', e);
    } finally {
      setIsSavingCausality(false);
    }
  };

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;
    setIsSendingQuery(true);
    try {
      const res = await api.addFollowUpQuery(report.id, newQuestionText.trim());
      if (res.success && res.data) {
        onReportUpdated(res.data);
        setNewQuestionText('');
      }
    } catch (e) {
      console.error('Failed to send query', e);
    } finally {
      setIsSendingQuery(false);
    }
  };

  const handleDownloadE2B = async (format: 'xml' | 'json') => {
    try {
      const res = await api.exportE2B(report.id, format);
      if (res.success && res.data) {
        const blob = new Blob([res.data.content], {
          type: format === 'xml' ? 'application/xml' : 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Failed to export E2B', e);
    }
  };

  const whoCategories: CausalityCategory[] = [
    'Certain',
    'Probable / Likely',
    'Possible',
    'Unlikely',
    'Conditional / Unclassified',
    'Unassessable / Unclassifiable',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-mono">{report.referenceNumber}</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                  {report.reporterType}
                </span>
                {report.seriousness && !report.seriousness.noneOfTheAbove && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Serious ICSR
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Created: {new Date(report.dateCreated).toLocaleString()} • Patient: {report.patientInfo?.fullName} ({report.patientInfo?.age} yrs, {report.patientInfo?.sex})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* E2B Export Actions */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => handleDownloadE2B('xml')}
                className="px-2.5 py-1 text-slate-200 hover:text-white hover:bg-slate-700 rounded-lg text-xs font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Download E2B(R3) compliant XML ICSR"
              >
                <FileCode className="w-3.5 h-3.5 text-teal-400" />
                <span>E2B XML</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadE2B('json')}
                className="px-2.5 py-1 text-slate-200 hover:text-white hover:bg-slate-700 rounded-lg text-xs font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Download E2B(R3) JSON ICSR"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>JSON</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-3 border-b border-slate-200 bg-slate-50 gap-3">
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'details'
                  ? 'border-teal-600 text-teal-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Case Details & Timeline</span>
            </button>
            <button
              onClick={() => setActiveTab('causality')}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'causality'
                  ? 'border-teal-600 text-teal-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>2. WHO-UMC Causality Assessment</span>
            </button>
            <button
              onClick={() => setActiveTab('queries')}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'queries'
                  ? 'border-teal-600 text-teal-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>3. Follow-up Queries ({report.followUps?.length || 0})</span>
            </button>
          </div>

          {/* Workflow Status Modifier */}
          <div className="flex items-center gap-2 pb-3 sm:pb-2 text-xs">
            <span className="text-slate-500 font-semibold">Status:</span>
            <select
              value={currentStatus}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value as ReportStatus)}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-teal-900 shadow-xs focus:ring-2 focus:ring-teal-500"
            >
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Additional Information Requested">Additional Info Requested</option>
              <option value="Assessment in Progress">Assessment in Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* TAB 1: Case Details & Timeline */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Event Highlights Header */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Reported Event Term(s)</span>
                  <p className="font-bold text-rose-700 text-sm mt-0.5">
                    {report.adverseEvent?.reactionTerms}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Severity: <strong>{report.adverseEvent?.severity}</strong> • Outcome: <strong>{report.adverseEvent?.outcome}</strong>
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block">Primary Suspect Medication</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {report.suspectedMedications?.[0]?.brandName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Active: {report.suspectedMedications?.[0]?.genericName || 'N/A'} • Dose: {report.suspectedMedications?.[0]?.dose || 'N/A'}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block">Hospitalization / Seriousness</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {report.adverseEvent?.hospitalization}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {report.seriousness?.noneOfTheAbove ? 'Non-Serious' : 'Meets Serious Criteria'}
                  </p>
                </div>
              </div>

              {/* Event Description in Reporter Words */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Reporter Event Description
                </h4>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed">
                  {report.adverseEvent?.description}
                </div>
              </div>

              {/* Visual Event Timeline */}
              {report.timeline && report.timeline.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Clinical Chronology & Milestones</span>
                  </h4>
                  <VisualTimeline timeline={report.timeline} isEditable={false} />
                </div>
              )}

              {/* Grid of Medical History, Concomitant, Measurements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Patient Baseline */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-teal-600" />
                    <span>Patient Baseline & Anthropometrics</span>
                  </h5>
                  <div className="space-y-1 text-slate-600">
                    <p><strong>Age:</strong> {report.patientInfo?.age} years • <strong>Sex:</strong> {report.patientInfo?.sex}</p>
                    <p><strong>Height:</strong> {report.patientMeasurements?.height || 'N/A'} {report.patientMeasurements?.heightUnit} • <strong>Weight:</strong> {report.patientMeasurements?.weight || 'N/A'} {report.patientMeasurements?.weightUnit}</p>
                    <p><strong>BMI:</strong> {report.patientMeasurements?.bmi ? `${report.patientMeasurements.bmi} kg/m² (${report.patientMeasurements.bmiCategory})` : 'N/A'}</p>
                    <p><strong>Pregnancy:</strong> {report.patientMeasurements?.pregnancyStatus || 'Not Applicable'}</p>
                    {report.patientMeasurements?.relevantLabValues && (
                      <p><strong>Lab Findings:</strong> {report.patientMeasurements.relevantLabValues}</p>
                    )}
                  </div>
                </div>

                {/* Medical History */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <span>Medical History & Sensitivities</span>
                  </h5>
                  <div className="space-y-1 text-slate-600">
                    <p><strong>Existing Conditions:</strong> {report.medicalHistory?.existingConditions || 'None specified'}</p>
                    <p><strong>Allergies:</strong> {report.medicalHistory?.allergies || 'None specified'}</p>
                    <p><strong>Past ADRs:</strong> {report.medicalHistory?.pastAdverseReactions || 'None specified'}</p>
                    <p><strong>Surgeries:</strong> {report.medicalHistory?.previousSurgeries || 'None specified'}</p>
                  </div>
                </div>

                {/* Suspected Medications Details */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <span>Suspected Medication Details</span>
                  </h5>
                  <div className="space-y-2">
                    {report.suspectedMedications?.map((m, idx) => (
                      <div key={m.id || idx} className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-[11px]">
                        <p className="font-bold text-teal-950">{m.brandName} {m.strength ? `(${m.strength})` : ''}</p>
                        <p>Dose: {m.dose} • Route: {m.route} • Freq: {m.frequency}</p>
                        <p>Dates: {m.startDate} {m.stopDate ? `to ${m.stopDate}` : '(Ongoing)'}</p>
                        <p className="font-mono text-slate-500">Batch/Lot: {m.batchLotNumber || 'Unknown'} • Exp: {m.expiryDate || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Concomitant Medications */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-slate-600" />
                    <span>Concomitant Medications</span>
                  </h5>
                  {report.hasNoConcomitantMeds || !report.concomitantMedications?.length ? (
                    <p className="text-slate-500 italic">No concomitant medications reported.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {report.concomitantMedications.map((c, idx) => (
                        <div key={c.id || idx} className="p-2 bg-slate-50 rounded-lg text-[11px]">
                          <p className="font-bold text-slate-800">{c.brandName}</p>
                          <p className="text-slate-500">{c.dose} • Reason: {c.reasonForUse || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHO-UMC Causality Assessment Form */}
          {activeTab === 'causality' && (
            <form onSubmit={handleSaveCausality} className="space-y-6">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-950 space-y-1">
                <div className="flex items-center gap-2 font-bold text-teal-900">
                  <Stethoscope className="w-4 h-4 text-teal-700" />
                  <span>WHO-UMC Standardized Causality Assessment Form</span>
                </div>
                <p className="text-teal-800 leading-relaxed">
                  Evaluate plausible time relationship, absence of other diseases or medications, de-challenge response upon drug withdrawal, and re-challenge characteristics.
                </p>
              </div>

              {causalitySavedToast && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Causality assessment successfully saved & audit logged.</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Causality Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    WHO-UMC Causality Category *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {whoCategories.map((cat) => {
                      const isSelected = causalityCategory === cat;
                      return (
                        <label
                          key={cat}
                          className={`p-3 rounded-xl border cursor-pointer text-xs transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500/20 text-teal-950 font-bold'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="whoCategory"
                            value={cat}
                            checked={isSelected}
                            onChange={() => setCausalityCategory(cat)}
                            className="w-4 h-4 text-teal-600"
                          />
                          <span>{cat}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Scientific Rationale */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scientific Assessment Rationale & Literature Grounding *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Document chronological plausibility, known pharmacology mechanisms, exclusion of confounders, and dechallenge findings..."
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Medical Officer Narrative */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Medical Officer Clinical Comments & Recommendations
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Optional expert commentary for safety review meeting or regulatory health authority dossier..."
                    value={medicalOfficerComments}
                    onChange={(e) => setMedicalOfficerComments(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Expedited Regulatory Flag */}
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-rose-950 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expeditedReportingRequired}
                      onChange={(e) => setExpeditedReportingRequired(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                    <span>Flag for 15-Day Expedited Regulatory Submission (Serious & Unexpected)</span>
                  </label>
                  <p className="text-[11px] text-rose-800">
                    Mandatory for serious, unlisted adverse reactions meeting FDA 15-Day Alert or EMA EudraVigilance expedited criteria.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingCausality}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSavingCausality ? 'Saving Assessment...' : 'Commit Causality Assessment'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Follow-up Inquiries */}
          {activeTab === 'queries' && (
            <div className="space-y-6">
              {/* Send new query form */}
              <form onSubmit={handleSendQuery} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-teal-600" />
                  <span>Send Follow-up Inquiry to Reporter ({report.reporterInfo?.fullName})</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  The reporter will be notified and can answer directly on the Status Tracking page using their reference number.
                </p>

                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Could you please specify if blood tests or CPK levels were checked during hospital admission?"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSendingQuery || !newQuestionText.trim()}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingQuery ? 'Sending...' : 'Transmit Follow-up Query'}</span>
                  </button>
                </div>
              </form>

              {/* Inquiries Thread */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Query History & Reporter Responses ({report.followUps?.length || 0})
                </h4>

                {!report.followUps?.length ? (
                  <p className="text-slate-400 italic text-xs">No follow-up queries dispatched yet.</p>
                ) : (
                  report.followUps.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          Query by {q.requestedBy}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(q.requestedDate).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg font-medium">
                        "{q.requestMessage}"
                      </p>

                      {q.responseMessage ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950">
                            <span>Response from {q.respondedBy || 'Reporter'}:</span>
                            <span className="text-[10px] text-emerald-700 font-mono font-normal">
                              {q.responseDate ? new Date(q.responseDate).toLocaleString() : ''}
                            </span>
                          </div>
                          <p className="text-emerald-900">{q.responseMessage}</p>
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Awaiting response from reporter</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
