import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  FileCode,
  Download,
  History,
  Stethoscope,
  Plus,
  RefreshCw,
  Clock,
  Flame,
  FileText,
} from 'lucide-react';
import { AdverseEventReport, ReportStatus, UserRole } from '../../types';
import { api } from '../../services/api';
import { CaseAssessmentModal } from './CaseAssessmentModal';
import { AuditLogsView } from './AuditLogsView';

interface PvDashboardProps {
  currentUser: { id: string; name: string; role: any; email: string };
  onNavigate: (tab: string, param?: string) => void;
}

export const PvDashboard: React.FC<PvDashboardProps> = ({ currentUser, onNavigate }) => {
  const [reports, setReports] = useState<AdverseEventReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<AdverseEventReport | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [seriousnessFilter, setSeriousnessFilter] = useState<string>('ALL');
  const [reporterTypeFilter, setReporterTypeFilter] = useState<string>('ALL');

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (e) {
      console.error('Failed to load PV reports', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportUpdated = (updatedReport: AdverseEventReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
    );
    setSelectedReport(updatedReport);
  };

  // Filter logic
  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (reporterTypeFilter !== 'ALL' && r.reporterType !== reporterTypeFilter) return false;
    if (seriousnessFilter === 'SERIOUS' && (r.seriousness?.noneOfTheAbove || !r.seriousness)) return false;
    if (seriousnessFilter === 'NON_SERIOUS' && !r.seriousness?.noneOfTheAbove) return false;
    if (seriousnessFilter === 'EXPEDITED' && r.assessment?.expectednessAssessment !== 'Unexpected / Unlisted') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const ref = (r.referenceNumber || '').toLowerCase();
      const patient = (r.patientInfo?.fullName || '').toLowerCase();
      const drug = (r.suspectedMedications?.[0]?.brandName || '').toLowerCase();
      const reaction = (r.adverseEvent?.reactionTerms || '').toLowerCase();
      const desc = (r.adverseEvent?.description || '').toLowerCase();

      return (
        ref.includes(q) ||
        patient.includes(q) ||
        drug.includes(q) ||
        reaction.includes(q) ||
        desc.includes(q)
      );
    }

    return true;
  });

  // Calculate Metrics
  const totalCases = reports.length;
  const seriousCasesCount = reports.filter((r) => r.seriousness && !r.seriousness.noneOfTheAbove).length;
  const seriousPercent = totalCases ? Math.round((seriousCasesCount / totalCases) * 100) : 0;
  const pendingReviewCount = reports.filter(
    (r) => r.status === 'Submitted' || r.status === 'Under Review' || r.status === 'Assessment in Progress'
  ).length;
  const expeditedCount = reports.filter(
    (r) => r.assessment?.expectednessAssessment === 'Unexpected / Unlisted'
  ).length;

  const handleDownloadE2B = async (reportId: string, format: 'xml' | 'json') => {
    try {
      const res = await api.exportE2B(reportId, format);
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
      console.error('Failed to download E2B', e);
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Under Review':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Assessment in Progress':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Additional Information Requested':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Closed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      {/* Top Banner / Reviewer Intro */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Pharmacovigilance Safety Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Safety Officer Workspace & ICSR Queue
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Review spontaneous adverse event reports, perform WHO-UMC causality assessments, manage follow-up queries, and generate regulatory-compliant ICH E2B(R3) transmissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAuditModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-teal-400" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={() => onNavigate('report')}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New ICSR Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total ICSR Cases</span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{totalCases}</div>
          <p className="text-[11px] text-slate-500">Post-marketing surveillance records</p>
        </div>

        {/* Serious Cases */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Serious ICSRs</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 font-mono">{seriousCasesCount}</span>
            <span className="text-xs font-semibold text-slate-500">({seriousPercent}%)</span>
          </div>
          <p className="text-[11px] text-slate-500">Hospitalized, life-threatening, or fatal</p>
        </div>

        {/* Pending Triage / Review */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Assessment</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">{pendingReviewCount}</div>
          <p className="text-[11px] text-slate-500">Requires triage or medical officer signoff</p>
        </div>

        {/* Expedited Watchlist */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">15-Day Expedited</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-700 font-mono">{expeditedCount}</div>
          <p className="text-[11px] text-slate-500">Expedited regulatory report watchlist</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Case Ref, Patient, Medicine, or Symptom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 text-xs"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assessment in Progress">Assessment in Progress</option>
              <option value="Additional Information Requested">Additional Info Requested</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Seriousness Filter */}
          <div>
            <select
              value={seriousnessFilter}
              onChange={(e) => setSeriousnessFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white text-xs"
            >
              <option value="ALL">All Seriousness</option>
              <option value="SERIOUS">Serious Cases Only</option>
              <option value="NON_SERIOUS">Non-Serious Cases Only</option>
              <option value="EXPEDITED">Expedited 15-Day Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span>Reporter Filter:</span>
            <select
              value={reporterTypeFilter}
              onChange={(e) => setReporterTypeFilter(e.target.value)}
              className="px-2 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-700 text-xs"
            >
              <option value="ALL">All Reporters</option>
              <option value="Patient">Patient</option>
              <option value="Doctor / Healthcare Professional">Doctor / HCP</option>
              <option value="Family Member">Family Member</option>
              <option value="Caregiver">Caregiver</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Showing {filteredReports.length} of {reports.length} ICSRs</span>
            <button
              onClick={fetchReports}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Refresh case list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Case Reference</th>
                <th className="py-3 px-4">Date / Reporter</th>
                <th className="py-3 px-4">Patient Baseline</th>
                <th className="py-3 px-4">Suspected Medicine</th>
                <th className="py-3 px-4">Adverse Reaction</th>
                <th className="py-3 px-4">Status & Causality</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold">No ICSR reports match your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const isSerious = report.seriousness && !report.seriousness.noneOfTheAbove;
                  const isExpedited = report.assessment?.expectednessAssessment === 'Unexpected / Unlisted';

                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      {/* Ref */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold font-mono text-teal-800 flex items-center gap-1.5">
                          <span>{report.referenceNumber}</span>
                          {isExpedited && (
                            <span className="w-2 h-2 rounded-full bg-purple-600" title="15-Day Expedited" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ID: {report.id}
                        </div>
                      </td>

                      {/* Date / Reporter */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">
                          {new Date(report.dateCreated).toLocaleDateString()}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {report.reporterType}
                        </div>
                      </td>

                      {/* Patient */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">
                          {report.patientInfo?.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {report.patientInfo?.age} yrs, {report.patientInfo?.sex}
                          {report.patientMeasurements?.bmi && ` • BMI ${report.patientMeasurements.bmi}`}
                        </div>
                      </td>

                      {/* Medicine */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">
                          {report.suspectedMedications?.[0]?.brandName || 'N/A'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Lot: {report.suspectedMedications?.[0]?.batchLotNumber || 'Unknown'}
                        </div>
                      </td>

                      {/* Reaction */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-rose-700 truncate">
                          {report.adverseEvent?.reactionTerms}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {report.adverseEvent?.outcome} • {isSerious ? 'Serious' : 'Non-serious'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                        {report.assessment?.causalityAssessment && (
                          <div className="text-[10px] text-teal-800 font-semibold mt-0.5">
                            WHO: {report.assessment.causalityAssessment}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
                            className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Assess</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDownloadE2B(report.id, 'xml')}
                            className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Export E2B(R3) XML"
                          >
                            <FileCode className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Case Assessment Modal */}
      {selectedReport && (
        <CaseAssessmentModal
          report={selectedReport}
          currentUser={currentUser}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          onReportUpdated={handleReportUpdated}
        />
      )}

      {/* Audit Log Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="max-w-5xl w-full">
            <AuditLogsView onClose={() => setShowAuditModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
