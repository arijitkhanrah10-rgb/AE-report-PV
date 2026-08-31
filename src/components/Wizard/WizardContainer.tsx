import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Lock,
  UserCheck,
  Edit3,
} from 'lucide-react';
import { AdverseEventReport, ReporterType } from '../../types';
import { api } from '../../services/api';
import { useReporterAuth } from '../../context/ReporterAuthContext';
import {
  Step1Reporter,
  Step2Physician,
  Step3Patient,
  Step4Measurements,
  Step5Medication,
  Step6AdverseEvent,
  Step7Timeline,
  Step8MedicalHistory,
  Step9ConcomitantMeds,
  Step10Seriousness,
  Step11ReporterOpinion,
  Step12SupportingDocs,
  Step13Consent,
  Step14Review,
} from './WizardSteps';
import { SubmissionSuccess } from './SubmissionSuccess';
import { SupportSection } from '../SupportSection';

const DRAFT_STORAGE_KEY = 'safemeds_pv_report_draft';

const STEP_TITLES = [
  'Reporter Type & Details',
  'Physician / Healthcare Professional',
  'Patient Information',
  'Patient Baseline & Measurements',
  'Suspected Medication(s)',
  'Adverse Event Details',
  'Clinical Event Timeline',
  'Patient Medical History',
  'Concomitant Medications',
  'Seriousness Criteria',
  'Reporter Opinion',
  'Supporting Documents',
  'Consent & Affirmation',
  'Review Report',
  'Submission Confirmation',
];

interface WizardContainerProps {
  initialReporterType?: ReporterType;
  editingReport?: AdverseEventReport | null;
  onCancelEdit?: () => void;
  onNavigate: (tab: string, param?: string) => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
  initialReporterType,
  editingReport,
  onCancelEdit,
  onNavigate,
}) => {
  const { reporter, isLoggedIn, openLoginModal } = useReporterAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [reportData, setReportData] = useState<Partial<AdverseEventReport>>(() => {
    if (editingReport) {
      return { ...editingReport };
    }
    return {
      reporterType: initialReporterType || (reporter?.reporterType as ReporterType) || 'Patient',
      reporterInfo: {
        fullName: reporter?.fullName || '',
        phoneCountryCode: reporter?.phoneCountryCode || '+1',
        email: reporter?.email || '',
        mobile: reporter?.mobile || '',
        country: reporter?.country || 'United States',
        currentCountry: reporter?.country || 'United States',
        currentArea: reporter?.area || reporter?.currentAddress || '',
        currentAddress: reporter?.currentAddress || '',
        currentState: reporter?.state || '',
        state: reporter?.state || '',
        currentDistrict: reporter?.district || '',
        district: reporter?.district || '',
        currentPin: reporter?.pinZip || '',
        pinZip: reporter?.pinZip || '',
        permanentSameAsCurrent: reporter?.permanentSameAsCurrent !== false,
        permanentCountry: reporter?.permanentCountry || reporter?.country || 'United States',
        permanentArea: reporter?.permanentArea || reporter?.currentAddress || '',
        permanentAddress: reporter?.permanentAddress || reporter?.currentAddress || '',
        permanentState: reporter?.permanentState || reporter?.state || '',
        permanentDistrict: reporter?.permanentDistrict || reporter?.district || '',
        permanentPin: reporter?.permanentPin || reporter?.pinZip || '',
        idNotAvailable: true,
      },
      patientInfo: {
        fullName: '',
        phoneCountryCode: '+1',
        country: 'United States',
        state: '',
        district: '',
        area: '',
        currentAddress: '',
        pinZip: '',
        idNotAvailable: true,
      },
      suspectedMedications: [
        {
          id: 'med_init',
          brandName: '',
          route: 'Oral',
          stillTaking: false,
        },
      ],
      adverseEvent: {
        description: '',
        reactionTerms: '',
        startDate: '',
        ongoing: false,
        severity: 'Moderate',
        hospitalization: 'No',
        outcome: 'Recovering',
      },
      seriousness: {
        death: false,
        lifeThreatening: false,
        hospitalization: false,
        prolongationHospitalization: false,
        disability: false,
        congenitalAnomaly: false,
        otherMedicallyImportant: false,
        noneOfTheAbove: true,
      },
      reporterOpinion: {
        relatedToMedication: 'Yes',
      },
      consent: {
        accurateConfirmation: false,
        understandPvReview: false,
        consentContact: false,
        readPrivacyNotice: false,
        consentVersion: 'v2026.1',
      },
    };
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReport, setSubmittedReport] = useState<AdverseEventReport | null>(null);
  const [draftSavedToast, setDraftSavedToast] = useState<boolean>(false);

  // Sync editingReport if prop changes
  useEffect(() => {
    if (editingReport) {
      setReportData({ ...editingReport });
      setCurrentStep(1);
    }
  }, [editingReport]);

  // If user logs in and we are on Step 1 of a fresh report, automatically preload reporter profile
  useEffect(() => {
    if (isLoggedIn && reporter && !editingReport) {
      setReportData((prev) => {
        // Only preload if fields are currently empty
        const info = prev.reporterInfo || {};
        if (!info.fullName || info.fullName === '') {
          return {
            ...prev,
            reporterType: (reporter.reporterType as ReporterType) || prev.reporterType,
            reporterInfo: {
              ...info,
              fullName: reporter.fullName,
              phoneCountryCode: reporter.phoneCountryCode || '+1',
              email: reporter.email,
              mobile: reporter.mobile,
              country: reporter.country || 'United States',
              currentCountry: reporter.country || 'United States',
              currentArea: reporter.area || reporter.currentAddress || '',
              currentAddress: reporter.currentAddress || '',
              currentState: reporter.state || '',
              state: reporter.state || '',
              currentDistrict: reporter.district || '',
              district: reporter.district || '',
              currentPin: reporter.pinZip || '',
              pinZip: reporter.pinZip || '',
              permanentSameAsCurrent: reporter.permanentSameAsCurrent !== false,
              permanentCountry: reporter.permanentCountry || reporter.country || 'United States',
              permanentArea: reporter.permanentArea || '',
              permanentAddress: reporter.permanentAddress || '',
              permanentState: reporter.permanentState || '',
              permanentDistrict: reporter.permanentDistrict || '',
              permanentPin: reporter.permanentPin || '',
            },
          };
        }
        return prev;
      });
    }
  }, [isLoggedIn, reporter, editingReport]);

  // Load draft on mount (only if not in edit mode)
  useEffect(() => {
    if (editingReport) return;
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.reportData) {
          setReportData(parsed.reportData);
          if (parsed.step && parsed.step <= 14) {
            setCurrentStep(parsed.step);
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse draft from localStorage', e);
    }
  }, [editingReport]);

  // Update field handler
  const updateData = (fields: Partial<AdverseEventReport>) => {
    setReportData((prev) => {
      const updated = { ...prev, ...fields };
      if (!editingReport) {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({ step: currentStep, reportData: updated })
        );
      }
      return updated;
    });
  };

  const handleManualSaveDraft = () => {
    if (editingReport) return;
    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({ step: currentStep, reportData })
    );
    setDraftSavedToast(true);
    setTimeout(() => setDraftSavedToast(false), 2500);
  };

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to clear your current draft?')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      window.location.reload();
    }
  };

  // Validation before advancing step
  const validateCurrentStep = (): boolean => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!reportData.reporterType) {
        setValidationError('Please select who you are reporting as.');
        return false;
      }
      const info = reportData.reporterInfo;
      if (!info?.fullName?.trim()) {
        setValidationError('Please enter the reporter full name.');
        return false;
      }
      if (!info?.email?.trim() || !info.email.includes('@')) {
        setValidationError('Please enter a valid reporter email address.');
        return false;
      }
      if (!info?.mobile?.trim()) {
        setValidationError('Please enter a reporter phone/mobile number.');
        return false;
      }
      const hasCurrentArea = Boolean(info?.currentArea?.trim() || info?.currentAddress?.trim());
      if (!hasCurrentArea) {
        setValidationError('Please enter your current area / street address.');
        return false;
      }
      const hasState = Boolean(info?.currentState?.trim() || info?.state?.trim());
      const hasPin = Boolean(info?.currentPin?.trim() || info?.pinZip?.trim());
      if (!hasState || !hasPin) {
        setValidationError('Please enter your State / Province and PIN / Postal Code.');
        return false;
      }
      if (info.permanentSameAsCurrent === false) {
        const hasPermArea = Boolean(info?.permanentArea?.trim() || info?.permanentAddress?.trim());
        if (!hasPermArea) {
          setValidationError('Please enter your permanent area / street address, or check "Permanent same as current".');
          return false;
        }
        if (!info?.permanentState?.trim() || !info?.permanentPin?.trim()) {
          setValidationError('Please enter your permanent State / Province and PIN / Postal Code.');
          return false;
        }
      }
    }

    if (currentStep === 2) {
      if (reportData.reporterType === 'Doctor / Healthcare Professional') {
        if (!reportData.physicianInfo?.fullName?.trim()) {
          setValidationError('Please enter your professional physician name.');
          return false;
        }
      }
    }

    if (currentStep === 3) {
      const pat = reportData.patientInfo;
      if (!pat?.fullName?.trim()) {
        setValidationError('Please provide the patient name or initials.');
        return false;
      }
      if (!pat?.age && !pat?.dob) {
        setValidationError('Please enter the patient age or date of birth at the time of the event.');
        return false;
      }
      if (!pat?.sex) {
        setValidationError('Please select the patient sex / gender.');
        return false;
      }
    }

    if (currentStep === 5) {
      const meds = reportData.suspectedMedications || [];
      if (meds.length === 0) {
        setValidationError('Please specify at least one suspected medication.');
        return false;
      }
      for (const med of meds) {
        if (!med.brandName?.trim()) {
          setValidationError('Please enter the Brand or Trade Name of the suspected medicine.');
          return false;
        }
        if (!med.startDate) {
          setValidationError(`Please enter the Start Date for "${med.brandName}".`);
          return false;
        }
      }
    }

    if (currentStep === 6) {
      const ae = reportData.adverseEvent;
      if (!ae?.description?.trim()) {
        setValidationError('Please describe the adverse event in your own words.');
        return false;
      }
      if (!ae?.reactionTerms?.trim()) {
        setValidationError('Please enter at least one adverse event symptom/reaction term.');
        return false;
      }
      if (!ae?.startDate) {
        setValidationError('Please enter the date when the symptoms first started.');
        return false;
      }
    }

    if (currentStep === 11) {
      if (!reportData.reporterOpinion?.relatedToMedication) {
        setValidationError('Please select your opinion regarding the medication link.');
        return false;
      }
    }

    if (currentStep === 13) {
      const c = reportData.consent;
      if (
        !c?.accurateConfirmation ||
        !c?.understandPvReview ||
        !c?.consentContact ||
        !c?.readPrivacyNotice
      ) {
        setValidationError('Please check and confirm all 4 consent and privacy affirmations to proceed.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep((prev) => Math.min(prev + 1, 14));
    }
  };

  const handleBack = () => {
    setValidationError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleJumpToStep = (stepNum: number) => {
    setValidationError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(stepNum);
  };

  const handleSubmitFinalReport = async () => {
    setIsSubmitting(true);
    setValidationError(null);

    try {
      if (editingReport && editingReport.id) {
        // Update existing report within 5-day window
        const res = await api.updateReport(editingReport.id, reportData);
        if (res.report) {
          setSubmittedReport(res.report);
          setCurrentStep(15);
        } else {
          setValidationError(res.message || 'Failed to update report. The 5-day editing window may have expired.');
        }
      } else {
        // Create new report
        const res = await api.createReport(reportData);
        if (res.report) {
          setSubmittedReport(res.report);
          localStorage.removeItem(DRAFT_STORAGE_KEY);
          setCurrentStep(15);
        } else {
          setValidationError('Failed to submit report. Please try again.');
        }
      }
    } catch (err: any) {
      setValidationError(err?.message || 'A network error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Step 15 Confirmation if complete
  if (currentStep === 15 && submittedReport) {
    return (
      <SubmissionSuccess
        referenceNumber={submittedReport.referenceNumber}
        verificationCode={submittedReport.verificationCode}
        report={submittedReport}
        onNavigate={onNavigate}
        onNewReport={() => {
          setSubmittedReport(null);
          setCurrentStep(1);
          setReportData({
            reporterType: 'Patient',
            reporterInfo: { country: 'United States', idNotAvailable: true },
            patientInfo: { country: 'United States', idNotAvailable: true },
            suspectedMedications: [{ id: 'med_1', brandName: '', route: 'Oral', stillTaking: false }],
            adverseEvent: { severity: 'Moderate', hospitalization: 'No', outcome: 'Recovering' },
            seriousness: { noneOfTheAbove: true },
            reporterOpinion: { relatedToMedication: 'Yes' },
            consent: { consentVersion: 'v2026.1' },
          });
        }}
      />
    );
  }

  const progressPercentage = Math.round((currentStep / 14) * 100);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header with Progress & Edit Mode Alert */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 space-y-5">
        {editingReport ? (
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Edit3 className="w-5 h-5 text-teal-700 shrink-0" />
              <div>
                <span className="font-extrabold text-teal-900 block text-sm">
                  Editing Report: {editingReport.referenceNumber}
                </span>
                <span className="text-slate-600">
                  You are updating a report submitted on {new Date(editingReport.dateSubmitted || editingReport.dateCreated).toLocaleDateString()} (within the 5-day editing window).
                </span>
              </div>
            </div>
            {onCancelEdit && (
              <button
                onClick={onCancelEdit}
                className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>
        ) : isLoggedIn && reporter ? (
          <div className="p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-teal-900">
              <UserCheck className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                Logged in as <strong>{reporter.fullName}</strong> ({reporter.reporterType}). Your saved reporter details are preloaded automatically.
              </span>
            </div>
            <span className="text-[11px] font-mono text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md hidden sm:inline">
              {reporter.phoneCountryCode} {reporter.mobile}
            </span>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              Have a registered Reporter Account? Sign in with your phone number to automatically load your details.
            </span>
            <button
              onClick={openLoginModal}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 underline shrink-0 cursor-pointer"
            >
              Sign In with Phone →
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                Step {currentStep} of 14
              </span>
              <span className="text-xs text-slate-400 font-mono">({progressPercentage}% Completed)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {STEP_TITLES[currentStep - 1]}
            </h2>
          </div>

          {/* Save Draft Action */}
          {!editingReport && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleManualSaveDraft}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-teal-600" />
                <span>Save Draft</span>
              </button>
              <button
                type="button"
                onClick={handleClearDraft}
                title="Reset Form"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-teal-700 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {draftSavedToast && (
          <div className="p-2.5 bg-teal-50 text-teal-800 rounded-xl text-xs flex items-center gap-2 border border-teal-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Your report draft has been saved locally on this browser.</span>
          </div>
        )}
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="font-semibold">{validationError}</div>
        </div>
      )}

      {/* Dynamic Step Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        {currentStep === 1 && (
          <Step1Reporter reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 2 && (
          <Step2Physician reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 3 && (
          <Step3Patient reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 4 && (
          <Step4Measurements reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 5 && (
          <Step5Medication reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 6 && (
          <Step6AdverseEvent reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 7 && (
          <Step7Timeline reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 8 && (
          <Step8MedicalHistory reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 9 && (
          <Step9ConcomitantMeds reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 10 && (
          <Step10Seriousness reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 11 && (
          <Step11ReporterOpinion reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 12 && (
          <Step12SupportingDocs reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 13 && (
          <Step13Consent reportData={reportData} updateData={updateData} />
        )}
        {currentStep === 14 && (
          <Step14Review
            reportData={reportData}
            updateData={updateData}
            onJumpToStep={handleJumpToStep}
          />
        )}
      </div>

      {/* Step Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 14 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-teal-700/20 transition-all cursor-pointer"
          >
            <span>Proceed to Step {currentStep + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmitFinalReport}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-teal-800/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{editingReport ? 'Saving Updates...' : 'Submitting to PV Safety Database...'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>{editingReport ? 'Update Adverse Event Report' : 'Submit Final Adverse Event Report'}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Support helpdesk section */}
      <div className="mt-12">
        <SupportSection />
      </div>
    </div>
  );
};
