import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  Edit3,
  Eye,
  Search,
  AlertCircle,
  Pill,
  User,
  Activity,
  Plus,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { AdverseEventReport } from '../../types';
import { api } from '../../services/api';
import { useReporterAuth } from '../../context/ReporterAuthContext';
import { ReportDetailModal } from './ReportDetailModal';

interface MyReportsViewProps {
  onNavigate: (tab: string, param?: string) => void;
  onEditReport?: (report: AdverseEventReport) => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  onNavigate,
  onEditReport,
}) => {
  const { reporter, isLoggedIn, openLoginModal } = useReporterAuth();
  const [reports, setReports] = useState<AdverseEventReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<AdverseEventReport | null>(null);
  const [viewFilter, setViewFilter] = useState<'my' | 'all'>('my');

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReports();
      setReports(data || []);
    } catch (err: any) {
      console.error('Error fetching previous reports:', err);
      setError('Unable to load previous reports at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter reports
  const filteredReports = reports.filter((r) => {
    // If filtering by "my" and user is logged in
    if (viewFilter === 'my' && isLoggedIn && reporter) {
      const repPhone = reporter.mobile.replace(/\D/g, '');
      const reportPhone = (r.reporterInfo?.mobile || '').replace(/\D/g, '');
      const repEmail = (reporter.email || '').toLowerCase();
      const reportEmail = (r.reporterInfo?.email || '').toLowerCase();
      const repName = (reporter.fullName || '').toLowerCase();
      const reportName = (r.reporterInfo?.fullName || '').toLowerCase();

      const matchesReporter =
        (repPhone && reportPhone && (reportPhone.includes(repPhone) || repPhone.includes(reportPhone))) ||
        (repEmail && reportEmail && reportEmail === repEmail) ||
        (repName && reportName && reportName === repName);

      if (!matchesReporter) {
        return false;
      }
    }

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const refMatch = r.referenceNumber?.toLowerCase().includes(q);
    const patientMatch = r.patientInfo?.fullName?.toLowerCase().includes(q);
    const drugMatch = r.suspectedMedications?.some((m) =>
      m.brandName?.toLowerCase().includes(q) || m.genericName?.toLowerCase().includes(q)
    );
    const eventMatch =
      r.adverseEvent?.reactionTerms?.toLowerCase().includes(q) ||
      r.adverseEvent?.description?.toLowerCase().includes(q);

    return refMatch || patientMatch || drugMatch || eventMatch;
  });

  // Calculate 5-day editing period helper
  const getEditingWindowStatus = (report: AdverseEventReport) => {
    const dateStr = report.dateSubmitted || report.dateCreated;
    if (!dateStr) return { isEditable: false, message: 'Editing period unavailable' };

    const submissionTime = new Date(dateStr).getTime();
    if (isNaN(submissionTime)) return { isEditable: false, message: 'Invalid submission date' };

    const now = Date.now();
    const elapsedMs = now - submissionTime;
    const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

    if (elapsedMs > FIVE_DAYS_MS) {
      return {
        isEditable: false,
        message: 'Editing period expired — reports can only be viewed after 5 days.',
        daysPassed: Math.floor(elapsedMs / (24 * 60 * 60 * 1000)),
      };
    }

    const remainingMs = FIVE_DAYS_MS - elapsedMs;
    const daysLeft = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hoursLeft = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    let timeText = '';
    if (daysLeft > 0) {
      timeText = `${daysLeft} day${daysLeft > 1 ? 's' : ''} ${hoursLeft} hr${hoursLeft > 1 ? 's' : ''} remaining`;
    } else {
      timeText = `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''} remaining`;
    }

    return {
      isEditable: true,
      timeText,
      message: `Editable (${timeText})`,
    };
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>History & Records</span>
              </span>
              {isLoggedIn && reporter && (
                <span className="text-xs text-slate-500 font-medium">
                  Logged in as <strong className="text-slate-800">{reporter.fullName}</strong>
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              History & Submitted Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1">
              View your previously submitted adverse event reports, inspect clinical review statuses, or update reports submitted within the last 5 days.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('report')}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Adverse Event Report</span>
            </button>
          </div>
        </div>

        {/* Reporter Account Banner if not logged in */}
        {!isLoggedIn && (
          <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-teal-900">
              <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
              <div>
                <strong className="font-bold">Log in with your registered phone number</strong> to filter and automatically view your submitted adverse event reports.
              </div>
            </div>
            <button
              onClick={openLoginModal}
              className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Log In with Phone</span>
            </button>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Report ID, patient name, medication, or reaction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white transition-colors"
            />
          </div>

          {isLoggedIn && (
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 text-xs">
              <button
                onClick={() => setViewFilter('my')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewFilter === 'my'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Reports ({filteredReports.length})
              </button>
              <button
                onClick={() => setViewFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewFilter === 'all'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Reports ({reports.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Loading previous adverse event reports...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-2 text-rose-800 text-xs">
          <AlertCircle className="w-6 h-6 mx-auto text-rose-600" />
          <p className="font-bold">{error}</p>
          <button
            onClick={fetchReports}
            className="px-3 py-1.5 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Reports Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? 'No adverse event reports matched your search criteria.'
              : isLoggedIn
              ? 'You have not submitted any adverse event reports under this account yet.'
              : 'No adverse event reports found.'}
          </p>
          <button
            onClick={() => onNavigate('report')}
            className="mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Submit a New Report
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((rep) => {
            const dateStr = rep.dateSubmitted || rep.dateCreated;
            const formattedDate = dateStr ? new Date(dateStr).toLocaleString() : 'N/A';
            const windowStatus = getEditingWindowStatus(rep);

            return (
              <div
                key={rep.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Card Top: Ref number, submission date, status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-extrabold text-sm text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                      {rep.referenceNumber}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Submitted: {formattedDate}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {rep.status}
                    </span>
                  </div>
                </div>

                {/* Card Grid: Medications, Patient, Reaction */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Suspected Medications */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                      <Pill className="w-3.5 h-3.5 text-teal-600" />
                      <span>Suspected Medication(s)</span>
                    </p>
                    <div className="space-y-1">
                      {rep.suspectedMedications && rep.suspectedMedications.length > 0 ? (
                        rep.suspectedMedications.map((m, i) => (
                          <div key={i} className="font-medium text-slate-900 truncate">
                            • {m.brandName} {m.genericName ? `(${m.genericName})` : ''}
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 italic">Not specified</p>
                      )}
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                      <User className="w-3.5 h-3.5 text-teal-600" />
                      <span>Patient Details</span>
                    </p>
                    <p className="font-semibold text-slate-900">
                      {rep.patientInfo?.fullName || 'Anonymous / Unspecified'}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      {rep.patientInfo?.age ? `${rep.patientInfo.age} yrs` : 'Age N/A'} • {rep.patientInfo?.sex || 'Sex N/A'}
                      {rep.patientInfo?.dob ? ` • DOB: ${rep.patientInfo.dob}` : ''}
                    </p>
                  </div>

                  {/* Adverse Event */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                      <Activity className="w-3.5 h-3.5 text-rose-600" />
                      <span>Adverse Event</span>
                    </p>
                    <p className="font-semibold text-slate-900 truncate">
                      {rep.adverseEvent?.reactionTerms || rep.adverseEvent?.description || 'N/A'}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Severity: <strong className="text-slate-700">{rep.adverseEvent?.severity || 'N/A'}</strong> • Outcome: {rep.adverseEvent?.outcome || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Card Footer: 5-Day Notice & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  {/* 5-Day Period Notice */}
                  <div>
                    {windowStatus.isEditable ? (
                      <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-medium inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{windowStatus.message}</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl font-medium inline-flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Editing period expired — reports can only be viewed after 5 days.</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: View & Edit */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(rep)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>View Details</span>
                    </button>

                    {windowStatus.isEditable ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (onEditReport) {
                            onEditReport(rep);
                          }
                        }}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Report</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-not-allowed"
                        title="Editing period expired (5 days limit)"
                      >
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Edit Disabled</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Case Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onEdit={(rep) => {
            setSelectedReport(null);
            if (onEditReport) {
              onEditReport(rep);
            }
          }}
          isEditable={getEditingWindowStatus(selectedReport).isEditable}
        />
      )}
    </div>
  );
};
