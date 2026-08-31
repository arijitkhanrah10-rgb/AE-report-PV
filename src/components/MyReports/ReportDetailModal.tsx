import React from 'react';
import {
  X,
  FileText,
  Calendar,
  User,
  Activity,
  Pill,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { AdverseEventReport } from '../../types';

interface ReportDetailModalProps {
  report: AdverseEventReport | null;
  onClose: () => void;
  onEdit?: (report: AdverseEventReport) => void;
  isEditable?: boolean;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onEdit,
  isEditable,
}) => {
  if (!report) return null;

  const dateSub = report.dateSubmitted || report.dateCreated;
  const formattedDate = dateSub ? new Date(dateSub).toLocaleString() : 'N/A';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="report-detail-modal"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg font-mono leading-tight">
                  {report.referenceNumber}
                </h3>
                <span className="text-[10px] bg-slate-800 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-mono">
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Submitted on {formattedDate}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Status & 5-Day Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-700">
                Status: <strong className="text-slate-900">{report.status}</strong>
              </span>
            </div>
            {isEditable ? (
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Editable (Within 5-Day Window)</span>
              </span>
            ) : (
              <span className="text-[11px] bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>View-Only (Editing Period Expired)</span>
              </span>
            )}
          </div>

          {/* Suspected Medications */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Pill className="w-4 h-4 text-teal-600" />
              <span>Suspected Medication(s)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {report.suspectedMedications && report.suspectedMedications.length > 0 ? (
                report.suspectedMedications.map((m, idx) => (
                  <div key={idx} className="p-3 bg-teal-50/50 border border-teal-200/60 rounded-xl space-y-1">
                    <p className="font-bold text-teal-900 text-xs">{m.brandName}</p>
                    {m.genericName && <p className="text-slate-500 text-[11px]">{m.genericName}</p>}
                    <p className="text-slate-600 text-[11px]">
                      Route: {m.route || 'N/A'} • Dose: {m.doseAmount ? `${m.doseAmount} ${m.doseUnit}` : 'N/A'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">No suspected medication recorded.</p>
              )}
            </div>
          </div>

          {/* Adverse Event Details */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Adverse Event / Reaction</span>
            </h4>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <p className="font-semibold text-slate-900">
                Reaction: {report.adverseEvent?.reactionTerms || 'N/A'}
              </p>
              <p className="text-slate-700 leading-relaxed">
                {report.adverseEvent?.description || 'No detailed clinical description provided.'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <p><strong>Severity:</strong> {report.adverseEvent?.severity || 'N/A'}</p>
                <p><strong>Outcome:</strong> {report.adverseEvent?.outcome || 'N/A'}</p>
                <p><strong>Hospitalization:</strong> {report.adverseEvent?.hospitalization || 'No'}</p>
                <p><strong>Event Start Date:</strong> {report.adverseEvent?.startDate || 'N/A'}</p>
                <p><strong>Ongoing:</strong> {report.adverseEvent?.ongoing ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <User className="w-4 h-4 text-teal-600" />
              <span>Patient Information</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <p><strong>Patient Name:</strong> {report.patientInfo?.fullName || 'Anonymous / Unspecified'}</p>
              <p><strong>Age:</strong> {report.patientInfo?.age ? `${report.patientInfo.age} yrs` : 'N/A'}</p>
              <p><strong>Sex:</strong> {report.patientInfo?.sex || 'N/A'}</p>
              <p>
                <strong>Date of Birth:</strong>{' '}
                {report.patientInfo?.dob
                  ? `${report.patientInfo.dob} ${report.patientInfo.isDobEstimated ? '(Estimated)' : ''}`
                  : 'N/A'}
              </p>
              <p><strong>Location:</strong> {[report.patientInfo?.state, report.patientInfo?.country].filter(Boolean).join(', ') || 'N/A'}</p>
              <p><strong>BMI:</strong> {report.patientMeasurements?.bmi ? `${report.patientMeasurements.bmi} kg/m²` : 'N/A'}</p>
            </div>
          </div>

          {/* Reporter Information */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Reporter Profile</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <p><strong>Reporter Type:</strong> {report.reporterType}</p>
              <p><strong>Reporter Name:</strong> {report.reporterInfo?.fullName || 'N/A'}</p>
              <p><strong>Phone:</strong> {report.reporterInfo?.phoneCountryCode} {report.reporterInfo?.mobile || 'N/A'}</p>
              <p><strong>Email:</strong> {report.reporterInfo?.email || 'N/A'}</p>
              <p><strong>Country:</strong> {report.reporterInfo?.country || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Reference: <strong className="font-mono text-slate-800">{report.referenceNumber}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            {isEditable && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(report);
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors cursor-pointer"
              >
                Edit Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
