/**
 * SafeMeds PV - Core TypeScript Data Models & Types
 * Compliant with ICH ICSR / E2B(R3) pharmacovigilance standards
 */

export type UserRole = 'reporter' | 'pv_reviewer' | 'pv_officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  title: string;
}

export type ReporterType = 
  | 'Patient' 
  | 'Doctor / Healthcare Professional' 
  | 'Family Member' 
  | 'Caregiver' 
  | 'Other';

export interface ReporterInfo {
  fullName: string;
  age?: string;
  gender?: string;
  phoneCountryCode?: string;
  mobile: string;
  email: string;
  country: string;
  currentAddress: string;
  currentArea?: string;
  currentCountry?: string;
  currentState?: string;
  currentDistrict?: string;
  currentPin?: string;
  permanentSameAsCurrent?: boolean;
  permanentAddress?: string;
  permanentArea?: string;
  permanentCountry?: string;
  permanentState?: string;
  permanentDistrict?: string;
  permanentPin?: string;
  state: string;
  district?: string;
  pinZip: string;
  idType?: string;
  idNumber?: string;
  idNotAvailable: boolean;
}

export interface PhysicianInfo {
  fullName: string;
  qualification?: string;
  specialization?: string;
  institutionName?: string;
  department?: string;
  regNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  isTreatingPhysician: 'Yes' | 'No' | 'Unknown';
  availableForFollowUp: 'Yes' | 'No' | 'Unknown';
  comments?: string;
  detailsKnown?: boolean;
}

export interface PatientInfo {
  fullName: string;
  age?: string;
  dob?: string;
  isDobEstimated?: boolean;
  ageUnit?: 'years' | 'months' | 'days';
  sex: 'Male' | 'Female' | 'Other' | 'Unknown' | '';
  phoneCountryCode?: string;
  mobile?: string;
  country: string;
  state?: string;
  district?: string;
  pinZip?: string;
  area?: string;
  currentAddress?: string;
  currentArea?: string;
  currentCountry?: string;
  currentState?: string;
  currentDistrict?: string;
  currentPin?: string;
  permanentSameAsCurrent?: boolean;
  permanentAddress?: string;
  permanentArea?: string;
  permanentCountry?: string;
  permanentState?: string;
  permanentDistrict?: string;
  permanentPin?: string;
  idType?: string;
  idNumber?: string;
  idNotAvailable: boolean;
}

export interface PatientMeasurements {
  height?: string;
  heightUnit: 'cm' | 'm' | 'ft-in' | 'in';
  heightCm?: string;
  heightMeters?: string;
  heightFeet?: string;
  heightInches?: string;
  weight?: string;
  weightUnit: 'kg' | 'lb';
  bmi?: string;
  bmiCategory?: string;
  pregnancyStatus: 'Not Applicable' | 'Pregnant - 1st Trimester' | 'Pregnant - 2nd Trimester' | 'Pregnant - 3rd Trimester' | 'Not Pregnant' | 'Unknown';
  relevantLabValues?: string;
}

export interface SuspectedMedication {
  id: string;
  brandName: string;
  genericName?: string;
  strength?: string;
  dosageForm?: string;
  dose?: string;
  route?: string;
  frequency?: string;
  startDate?: string;
  stopDate?: string;
  stillTaking?: boolean;
  indication?: string;
  manufacturer?: string;
  batchLotNumber?: string;
  expiryDate?: string;
  detailsUnknown?: boolean;
}

export type EventOutcome = 
  | 'Recovered' 
  | 'Recovering' 
  | 'Not Recovered' 
  | 'Recovered with Sequelae' 
  | 'Fatal' 
  | 'Unknown';

export type EventSeverity = 'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening';

export interface AdverseEventDetails {
  description: string;
  reactionTerms: string;
  startDate: string;
  endDate?: string;
  ongoing: boolean;
  timeOfOnset?: string;
  severity: EventSeverity;
  treatmentReceived: string;
  hospitalization: 'No' | 'Yes - Hospitalized' | 'Yes - Prolonged Hospitalization' | 'Unknown';
  medicalIntervention?: string;
  outcome: EventOutcome;
}

export type TimelineStage = 
  | 'Medication Started'
  | 'Medication Taken'
  | 'Symptoms Appeared'
  | 'Medication Stopped/Continued'
  | 'Medical Treatment'
  | 'Current Outcome';

export interface TimelineEvent {
  id: string;
  stage: TimelineStage;
  date: string;
  time?: string;
  title: string;
  description: string;
  iconType?: string;
}

export interface MedicalHistory {
  existingConditions?: string;
  previousIllnesses?: string;
  pastAdverseReactions?: string;
  allergies?: string;
  previousSurgeries?: string;
  relevantHistory?: string;
  otherInformation?: string;
}

export interface ConcomitantMedication {
  id: string;
  brandName: string;
  genericName?: string;
  strength?: string;
  dose?: string;
  route?: string;
  frequency?: string;
  startDate?: string;
  stopDate?: string;
  stillTaking?: boolean;
  reasonForUse?: string;
}

export interface SeriousnessCriteria {
  death: boolean;
  lifeThreatening: boolean;
  hospitalization: boolean;
  prolongationHospitalization: boolean;
  disability: boolean;
  congenitalAnomaly: boolean;
  otherMedicallyImportant: boolean;
  noneOfTheAbove: boolean;
  unknown: boolean;
  details?: string;
}

export interface ReporterOpinion {
  relatedToMedication: 'Yes' | 'No' | 'Not sure' | 'Prefer not to say' | '';
  explanation?: string;
}

export interface SupportingDocument {
  id: string;
  name: string;
  type: 'Prescription' | 'Laboratory report' | 'Discharge summary' | 'Medication package/photo' | 'Relevant medical document' | 'Other';
  size: number;
  dateUploaded: string;
  dataUrl?: string;
  notes?: string;
}

export interface ConsentRecord {
  accurateConfirmation: boolean;
  understandPvReview: boolean;
  consentContact: boolean;
  readPrivacyNotice: boolean;
  timestamp: string;
  consentVersion: string;
}

export interface FollowUpThread {
  id: string;
  requestedBy: string;
  requestedDate: string;
  requestMessage: string;
  respondedBy?: string;
  responseDate?: string;
  responseMessage?: string;
  status: 'Pending Response' | 'Responded' | 'Closed';
}

export type CausalityCategory = 
  | 'Certain' 
  | 'Probable / Likely' 
  | 'Possible' 
  | 'Unlikely' 
  | 'Conditional / Unclassified' 
  | 'Unassessable / Unclassifiable';

export interface PVAssessment {
  reviewerId: string;
  reviewerName: string;
  reviewDate: string;
  reviewerComments: string;
  medicalAssessment: string;
  causalityAssessment: CausalityCategory;
  causalityScale: 'WHO-UMC' | 'Naranjo Algorithm';
  naranjoScore?: number;
  expectednessAssessment: 'Expected / Listed' | 'Unexpected / Unlisted' | 'Under Investigation';
  seriousnessConfirmed: boolean;
  followUpRequired: boolean;
  caseStatus: ReportStatus;
  internalNotes?: string;
  actionTaken?: string;
}

export type ReportStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Additional Information Requested'
  | 'Assessment in Progress'
  | 'Closed';

export interface AdverseEventReport {
  id: string;
  referenceNumber: string;
  verificationCode: string;
  dateCreated: string;
  dateSubmitted: string;
  lastUpdated: string;
  status: ReportStatus;
  currentStep?: number;
  isDraft?: boolean;
  isDemoData?: boolean;
  
  reporterType: ReporterType;
  reporterInfo: ReporterInfo;
  physicianInfo: PhysicianInfo;
  patientInfo: PatientInfo;
  patientMeasurements: PatientMeasurements;
  suspectedMedications: SuspectedMedication[];
  adverseEvent: AdverseEventDetails;
  timeline: TimelineEvent[];
  medicalHistory: MedicalHistory;
  concomitantMedications: ConcomitantMedication[];
  hasNoConcomitantMeds: boolean;
  seriousness: SeriousnessCriteria;
  reporterOpinion: ReporterOpinion;
  supportingDocuments: SupportingDocument[];
  consent: ConsentRecord;
  
  assessment?: PVAssessment;
  followUps: FollowUpThread[];
  assignedReviewer?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  reportId?: string;
  reportRef?: string;
  details: string;
  ipAddress?: string;
}

export interface DashboardStats {
  totalReports: number;
  newReports: number;
  underReview: number;
  seriousReports: number;
  requiringFollowUp: number;
  closedReports: number;
}
