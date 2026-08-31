import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Send,
  Printer,
  MessageSquare,
  Lock,
  Pill,
} from 'lucide-react';
import { AdverseEventReport, ReportStatus } from '../types';
import { api } from '../services/api';
import { VisualTimeline } from './Wizard/VisualTimeline';

interface StatusCheckerProps {
  initialRef?: string;
  initialCode?: string;
  onNavigate: (tab: string) => void;
}

export const StatusChecker: React.FC<StatusCheckerProps> = ({
  initialRef = '',
  initialCode = '',
  onNavigate,
}) => {
  const [referenceNumber, setReferenceNumber] = useState(initialRef);
  const [verificationCode, setVerificationCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AdverseEventReport | null>(null);

  // Follow-up reply state
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replySuccessMessage, setReplySuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialRef && initialCode) {
      handleLookup(initialRef, initialCode);
    }
  }, [initialRef, initialCode]);

  const handleLookup = async (refNum: string, code: string) => {
    if (!refNum.trim() || !code.trim()) {
      setError('Please provide both the Report Reference Number and Verification Code.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.getReportByReference(refNum.trim(), code.trim());
      if (res.success && res.data) {
        setReport(res.data);
      } else {
        setError(res.error || 'No matching case found. Please check your reference number and verification details.');
        setReport(null);
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred while looking up the report.');
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(referenceNumber, verificationCode);
  };

  const handleReplySubmit = async (queryId: string) => {
    if (!replyText.trim() || !report) return;
    setIsSubmittingReply(true);

    try {
      const res = await api.respondToQuery(
        report.id,
        queryId,
        replyText.trim(),
        report.reporterInfo?.fullName || 'Reporter'
      );
      if (res.success && res.data) {
        setReport(res.data);
        setReplyText('');
        setSelectedQueryId(null);
        setReplySuccessMessage('Your response has been transmitted to the safety reviewer.');
        setTimeout(() => setReplySuccessMessage(null), 4000);
      } else {
        setError(res.error || 'Failed to submit response.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit follow-up response.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Submitted':
        return { bg: 'bg-blue-50 text-blue-800 border-blue-200', label: '1. Received / Submitted' };
      case 'Under Review':
        return { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: '2. Clinical Review in Progress' };
      case 'Assessment in Progress':
        return { bg: 'bg-purple-50 text-purple-800 border-purple-200', label: '3. Medical Officer Assessment' };
      case 'Additional Information Requested':
        return { bg: 'bg-rose-50 text-rose-800 border-rose-200', label: 'Action Required: Additional Info Requested' };
      case 'Closed':
        return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: '4. Assessment Finalized & Closed' };
      default:
        return { bg: 'bg-slate-50 text-slate-800 border-slate-200', label: status };
    }
  };

  const statusWorkflowStages: ReportStatus[] = [
    'Submitted',
    'Under Review',
    'Assessment in Progress',
    'Closed',
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Adverse Event Report Status Tracker
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Enter your reference number and verification details to track clinical review progress, view the event timeline, and respond to safety follow-up requests.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Report Reference Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PV-2026-000101"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Verification (Security Code / Email / Phone) *
              </label>
              <input
                type="text"
                required
                placeholder="Security code (e.g. SAFE-4921) or reporter email"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span>Encrypted & Privacy Protected Verification</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setReferenceNumber('PV-2026-000104');
                  setVerificationCode('family.d.demo@example.com');
                  handleLookup('PV-2026-000104', 'family.d.demo@example.com');
                }}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                title="Fill with demo case having active follow-up query"
              >
                Sample Query Case
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{isLoading ? 'Searching...' : 'Track Report'}</span>
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Case Details Display */}
      {report && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Case File
                </span>
                <h3 className="text-xl font-bold font-mono text-slate-900">
                  {report.referenceNumber}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    getStatusBadge(report.status).bg
                  }`}
                >
                  {getStatusBadge(report.status).label}
                </span>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Workflow Pipeline Progression */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Safety Evaluation Progress:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                {statusWorkflowStages.map((stage, idx) => {
                  const stageIndex = statusWorkflowStages.indexOf(stage);
                  const currentReportStageIndex = statusWorkflowStages.indexOf(
                    report.status === 'Additional Information Requested' ? 'Under Review' : report.status
                  );
                  const isCompleted = currentReportStageIndex >= stageIndex;
                  const isCurrent = report.status === stage;

                  return (
                    <div
                      key={stage}
                      className={`p-3 rounded-xl border text-[11px] font-semibold transition-all ${
                        isCurrent
                          ? 'bg-teal-600 text-white border-teal-600 ring-2 ring-teal-500/20'
                          : isCompleted
                          ? 'bg-teal-50 text-teal-900 border-teal-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div className="font-mono text-[10px] opacity-70">Stage {idx + 1}</div>
                      <div className="truncate mt-0.5">{stage}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Date Received</span>
                <p className="font-bold text-slate-800">
                  {new Date(report.dateCreated || (report as any).dateSubmitted).toLocaleDateString()}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Suspected Medication</span>
                <p className="font-bold text-slate-800">
                  {report.suspectedMedications?.[0]?.brandName || 'N/A'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-500">Reported Adverse Event</span>
                <p className="font-bold text-rose-700">
                  {report.adverseEvent?.reactionTerms || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Active Follow-up Inquiries from Reviewer */}
          {report.followUps && report.followUps.length > 0 && (
            <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-200 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <MessageSquare className="w-4 h-4 text-amber-700" />
                <span>Pharmacovigilance Reviewer Queries ({report.followUps.length})</span>
              </div>

              {replySuccessMessage && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{replySuccessMessage}</span>
                </div>
              )}

              <div className="space-y-3">
                {report.followUps.map((query) => (
                  <div
                    key={query.id}
                    className="bg-white rounded-2xl p-4 border border-amber-200/80 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900">
                        Query from {query.requestedBy}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(query.requestedDate).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-slate-800 leading-relaxed font-medium bg-amber-50/50 p-2.5 rounded-lg">
                      "{query.requestMessage}"
                    </p>

                    {query.responseMessage ? (
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-1">
                        <span className="text-[11px] font-bold text-teal-900">
                          Your Submitted Response:
                        </span>
                        <p className="text-slate-800">{query.responseMessage}</p>
                        <span className="text-[10px] text-teal-700 block">
                          Responded on {query.responseDate ? new Date(query.responseDate).toLocaleString() : ''}
                        </span>
                      </div>
                    ) : (
                      <div>
                        {selectedQueryId === query.id ? (
                          <div className="space-y-2 pt-2">
                            <textarea
                              rows={3}
                              placeholder="Type your response to the clinical reviewer..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedQueryId(null);
                                  setReplyText('');
                                }}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                disabled={isSubmittingReply || !replyText.trim()}
                                onClick={() => handleReplySubmit(query.id)}
                                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs disabled:opacity-50 cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{isSubmittingReply ? 'Sending...' : 'Submit Response'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedQueryId(query.id);
                              setReplyText('');
                            }}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Respond to Query</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline View */}
          {report.timeline && report.timeline.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Clinical Event Timeline</span>
              </h4>
              <VisualTimeline timeline={report.timeline} isEditable={false} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
