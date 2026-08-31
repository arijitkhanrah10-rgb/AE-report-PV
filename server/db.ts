/**
 * SafeMeds PV - Server-Side Data Layer & Fictional Demo Datastore
 * Handles relational storage, persistence, audit logging, and demo seeds.
 */

import {
  AdverseEventReport,
  AuditLog,
  DashboardStats,
  PVAssessment,
  User,
  FollowUpThread,
} from '../src/types';

// Default mock users
export const MOCK_USERS: User[] = [
  {
    id: 'user_patient',
    name: 'Jane Doe (Demo Patient)',
    email: 'jane.patient@example-demo.com',
    role: 'reporter',
    organization: 'Self / Public Reporter',
    title: 'Patient Reporter',
  },
  {
    id: 'user_doctor',
    name: 'Dr. Arthur Davis, MD',
    email: 'dr.davis@stjude-hospital-demo.org',
    role: 'reporter',
    organization: 'Metro General Hospital',
    title: 'Attending Cardiologist',
  },
  {
    id: 'user_reviewer',
    name: 'Dr. Sarah Collins, PharmD',
    email: 'sarah.collins@safemeds-pv.org',
    role: 'pv_reviewer',
    organization: 'Global Drug Safety & PV Unit',
    title: 'Senior Pharmacovigilance Specialist',
  },
  {
    id: 'user_admin',
    name: 'Marcus Vance, MSc',
    email: 'marcus.vance@safemeds-pv.org',
    role: 'admin',
    organization: 'Regulatory & Pharmacovigilance Systems',
    title: 'Safety Systems Administrator',
  },
];

// Initial realistic Fictional Demo Cases
export const DEMO_REPORTS: AdverseEventReport[] = [
  {
    id: 'rep_001',
    referenceNumber: 'PV-2026-000101',
    verificationCode: 'SAFE-4921',
    dateCreated: '2026-08-25T10:14:00Z',
    dateSubmitted: '2026-08-25T11:30:00Z',
    lastUpdated: '2026-08-28T14:20:00Z',
    status: 'Under Review',
    isDraft: false,
    isDemoData: true,
    reporterType: 'Doctor / Healthcare Professional',
    assignedReviewer: 'Dr. Sarah Collins, PharmD',
    reporterInfo: {
      fullName: 'Dr. Arthur Davis',
      age: '48',
      gender: 'Male',
      mobile: '+1 (555) 342-8901',
      email: 'dr.davis@stjude-hospital-demo.org',
      currentAddress: '450 Healthcare Boulevard, Suite 300',
      country: 'United States',
      state: 'Illinois',
      district: 'Cook County',
      pinZip: '60611',
      idType: 'Medical License ID',
      idNumber: 'IL-MD-992384',
      idNotAvailable: false,
    },
    physicianInfo: {
      fullName: 'Dr. Arthur Davis, MD',
      qualification: 'MD, FACC',
      specialization: 'Cardiovascular Medicine',
      institutionName: 'Metro General Hospital',
      department: 'Department of Cardiology',
      regNumber: 'IL-MD-992384',
      address: '450 Healthcare Boulevard',
      city: 'Chicago',
      state: 'Illinois',
      pinCode: '60611',
      country: 'United States',
      phone: '+1 (555) 342-8900',
      email: 'dr.davis@stjude-hospital-demo.org',
      isTreatingPhysician: 'Yes',
      availableForFollowUp: 'Yes',
      comments: 'Patient admitted via Emergency Department with marked muscle weakness and tea-colored urine.',
      detailsKnown: true,
    },
    patientInfo: {
      fullName: 'Demo Patient A. (Fictional)',
      age: '62',
      dob: '1964-03-12',
      sex: 'Male',
      mobile: '+1 (555) 782-1109',
      currentAddress: '124 Lakeview Terrace, Apt 4B',
      country: 'United States',
      state: 'Illinois',
      district: 'Cook County',
      pinZip: '60614',
      idNotAvailable: true,
    },
    patientMeasurements: {
      height: '178',
      heightUnit: 'cm',
      weight: '84',
      weightUnit: 'kg',
      bmi: '26.5',
      bmiCategory: 'Overweight',
      pregnancyStatus: 'Not Applicable',
      relevantLabValues: 'Serum Creatine Kinase (CPK): 18,450 U/L (Ref: 30-200 U/L). Serum Creatinine: 2.4 mg/dL (Baseline 1.0). Urine Myoglobin: Positive.',
    },
    suspectedMedications: [
      {
        id: 'med_001_1',
        brandName: 'Cardiovent Plus',
        genericName: 'Atorvastatin + Ezetimibe',
        strength: '40mg / 10mg',
        dosageForm: 'Film-coated Tablet',
        dose: '1 tablet',
        route: 'Oral',
        frequency: 'Once daily at bedtime',
        startDate: '2026-08-01',
        stopDate: '2026-08-24',
        stillTaking: false,
        indication: 'Severe mixed hyperlipidemia and post-PCI prophylaxis',
        manufacturer: 'PharmaCore Therapeutics (Fictional)',
        batchLotNumber: 'CVT-2026-981A',
        expiryDate: '2028-04-30',
        detailsUnknown: false,
      },
    ],
    adverseEvent: {
      description: 'The patient presented with progressive severe bilateral thigh and shoulder myalgias, profound generalized muscle weakness, and dark tea-colored urine starting 20 days after initiating Cardiovent Plus. Laboratory testing confirmed acute rhabdomyolysis and secondary acute kidney injury.',
      reactionTerms: 'Rhabdomyolysis, Acute Kidney Injury, Myalgia, Dark Urine, HyperCKemia',
      startDate: '2026-08-21',
      endDate: '2026-08-28',
      ongoing: false,
      timeOfOnset: 'Approx 3 weeks after dose escalation',
      severity: 'Severe',
      treatmentReceived: 'Immediate discontinuation of Cardiovent Plus. Aggressive IV fluid resuscitation with sodium bicarbonate infusion, cardiac monitoring, and nephrology consultation.',
      hospitalization: 'Yes - Hospitalized',
      medicalIntervention: 'Intravenous hyperhydration and forced alkaline diuresis in telemetry unit.',
      outcome: 'Recovering',
    },
    timeline: [
      {
        id: 'tl_1',
        stage: 'Medication Started',
        date: '2026-08-01',
        title: 'Initiated Cardiovent Plus 40/10mg',
        description: 'Prescribed once daily for secondary hypercholesterolemia.',
      },
      {
        id: 'tl_2',
        stage: 'Symptoms Appeared',
        date: '2026-08-21',
        title: 'Onset of severe muscle pain & fatigue',
        description: 'Patient noticed deep muscle soreness in quadriceps and deltoids.',
      },
      {
        id: 'tl_3',
        stage: 'Medication Stopped/Continued',
        date: '2026-08-24',
        title: 'Medication halted upon ED admission',
        description: 'Cardiovent Plus immediately suspended following clinical evaluation.',
      },
      {
        id: 'tl_4',
        stage: 'Medical Treatment',
        date: '2026-08-24',
        title: 'Inpatient IV Hydration & Monitoring',
        description: 'Admitted to inpatient floor for IV fluid management and renal preservation.',
      },
      {
        id: 'tl_5',
        stage: 'Current Outcome',
        date: '2026-08-28',
        title: 'CPK trending downward (2,100 U/L)',
        description: 'Renal function normalized; patient recovering well with planned discharge.',
      },
    ],
    medicalHistory: {
      existingConditions: 'Hypertension (controlled), Type 2 Diabetes Mellitus, CAD status post stent (2024)',
      previousIllnesses: 'No prior history of myopathy or renal insufficiency',
      pastAdverseReactions: 'Mild GI upset with metformin in 2020',
      allergies: 'No known drug allergies (NKDA)',
      previousSurgeries: 'Percutaneous Coronary Intervention with Drug-Eluting Stent (2024)',
      relevantHistory: 'Non-smoker, no history of alcohol abuse or excessive strenuous exercise prior to onset.',
    },
    concomitantMedications: [
      {
        id: 'con_001_1',
        brandName: 'Metoprolol Succinate',
        genericName: 'Metoprolol Succinate ER',
        strength: '50mg',
        dose: '50mg',
        route: 'Oral',
        frequency: 'Once daily',
        startDate: '2024-05-10',
        stillTaking: true,
        reasonForUse: 'Hypertension and post-infarction rate control',
      },
      {
        id: 'con_001_2',
        brandName: 'Clarithromycin',
        genericName: 'Clarithromycin',
        strength: '500mg',
        dose: '500mg',
        route: 'Oral',
        frequency: 'Twice daily',
        startDate: '2026-08-16',
        stopDate: '2026-08-23',
        stillTaking: false,
        reasonForUse: 'Community-acquired respiratory infection (Suspected CYP3A4 inhibitor interaction)',
      },
    ],
    hasNoConcomitantMeds: false,
    seriousness: {
      death: false,
      lifeThreatening: false,
      hospitalization: true,
      prolongationHospitalization: false,
      disability: false,
      congenitalAnomaly: false,
      otherMedicallyImportant: true,
      noneOfTheAbove: false,
      unknown: false,
      details: 'Patient required 4-day inpatient hospitalization for life-threatening hyperCKemia and renal failure risk.',
    },
    reporterOpinion: {
      relatedToMedication: 'Yes',
      explanation: 'Temporal relationship and known pharmacology of statin + CYP3A4 inhibitor (clarithromycin) strongly support drug-induced rhabdomyolysis.',
    },
    supportingDocuments: [
      {
        id: 'doc_1',
        name: 'Inpatient_Discharge_Summary_CPK_Labs.pdf',
        type: 'Discharge summary',
        size: 245000,
        dateUploaded: '2026-08-25T11:28:00Z',
        notes: 'Includes serial CPK, Serum Creatinine, and electrolyte panels.',
      },
    ],
    consent: {
      accurateConfirmation: true,
      understandPvReview: true,
      consentContact: true,
      readPrivacyNotice: true,
      timestamp: '2026-08-25T11:29:50Z',
      consentVersion: 'v2026.1',
    },
    followUps: [],
  },
  {
    id: 'rep_002',
    referenceNumber: 'PV-2026-000102',
    verificationCode: 'SAFE-8120',
    dateCreated: '2026-08-26T14:10:00Z',
    dateSubmitted: '2026-08-26T15:02:00Z',
    lastUpdated: '2026-08-29T09:15:00Z',
    status: 'Assessment in Progress',
    isDraft: false,
    isDemoData: true,
    reporterType: 'Patient',
    assignedReviewer: 'Dr. Sarah Collins, PharmD',
    reporterInfo: {
      fullName: 'Demo Reporter B. (Fictional Patient)',
      age: '34',
      gender: 'Female',
      mobile: '+1 (555) 902-3341',
      email: 'patient.b.demo@example.com',
      currentAddress: '88 Evergreen Way',
      country: 'United States',
      state: 'Washington',
      pinZip: '98101',
      idNotAvailable: true,
    },
    physicianInfo: {
      fullName: 'Dr. Elena Rostova',
      qualification: 'MD, Psychiatrist',
      specialization: 'General Adult Psychiatry',
      institutionName: 'Cascadia Health Clinic',
      city: 'Seattle',
      state: 'Washington',
      isTreatingPhysician: 'Yes',
      availableForFollowUp: 'Yes',
      detailsKnown: true,
    },
    patientInfo: {
      fullName: 'Demo Reporter B. (Fictional Patient)',
      age: '34',
      sex: 'Female',
      country: 'United States',
      state: 'Washington',
      idNotAvailable: true,
    },
    patientMeasurements: {
      height: '165',
      heightUnit: 'cm',
      weight: '58',
      weightUnit: 'kg',
      bmi: '21.3',
      bmiCategory: 'Normal weight',
      pregnancyStatus: 'Not Pregnant',
    },
    suspectedMedications: [
      {
        id: 'med_002_1',
        brandName: 'NeuroCalm XR',
        genericName: 'Escitalopram Oxalate',
        strength: '20mg',
        dosageForm: 'Tablet',
        dose: '20mg',
        route: 'Oral',
        frequency: 'Daily morning',
        startDate: '2026-08-10',
        stopDate: '2026-08-25',
        stillTaking: false,
        indication: 'Major Depressive Disorder / Generalized Anxiety',
        detailsUnknown: false,
      },
    ],
    adverseEvent: {
      description: 'Patient developed high fever (39.2°C), spontaneous ocular clonus, extreme tremor, hyperreflexia, and profuse diaphoresis following addition of an OTC cough medicine containing dextromethorphan.',
      reactionTerms: 'Serotonin Syndrome, Hyperpyrexia, Clonus, Tremor, Autonomic Instability',
      startDate: '2026-08-24',
      endDate: '2026-08-26',
      ongoing: false,
      timeOfOnset: '4 hours after combined ingestion',
      severity: 'Life-Threatening',
      treatmentReceived: 'Emergency transport, cyproheptadine 12mg PO, external cooling blankets, and IV lorazepam.',
      hospitalization: 'Yes - Hospitalized',
      medicalIntervention: 'ICU monitoring for serotonin toxicity.',
      outcome: 'Recovered with Sequelae',
    },
    timeline: [
      {
        id: 'tl_2_1',
        stage: 'Medication Started',
        date: '2026-08-10',
        title: 'Started NeuroCalm XR 20mg',
        description: 'Prescribed for anxiety.',
      },
      {
        id: 'tl_2_2',
        stage: 'Symptoms Appeared',
        date: '2026-08-24',
        title: 'Severe tremors & fever spike',
        description: 'Symptoms flared rapidly after taking OTC cold syrup.',
      },
      {
        id: 'tl_2_3',
        stage: 'Medical Treatment',
        date: '2026-08-24',
        title: 'Emergency Dept / Cyproheptadine Administered',
        description: 'Treated by toxicologist with 5-HT antagonist.',
      },
      {
        id: 'tl_2_4',
        stage: 'Current Outcome',
        date: '2026-08-26',
        title: 'Fever resolved, residual fine tremor',
        description: 'Discharged with psychiatric follow-up.',
      },
    ],
    medicalHistory: {
      existingConditions: 'Mild asthma, Seasonal allergic rhinitis',
      pastAdverseReactions: 'None',
    },
    concomitantMedications: [
      {
        id: 'con_002_1',
        brandName: 'DextroMax Cough Relief',
        genericName: 'Dextromethorphan HBr',
        strength: '30mg/10mL',
        dose: '20mL',
        route: 'Oral',
        frequency: 'PRN for cough',
        startDate: '2026-08-23',
        stopDate: '2026-08-24',
        stillTaking: false,
        reasonForUse: 'Viral upper respiratory tract infection',
      },
    ],
    hasNoConcomitantMeds: false,
    seriousness: {
      death: false,
      lifeThreatening: true,
      hospitalization: true,
      prolongationHospitalization: false,
      disability: false,
      congenitalAnomaly: false,
      otherMedicallyImportant: true,
      noneOfTheAbove: false,
      unknown: false,
      details: 'Life-threatening serotonin toxicity requiring ICU care and cyproheptadine therapy.',
    },
    reporterOpinion: {
      relatedToMedication: 'Yes',
      explanation: 'Hospital doctors explained that the prescription antidepressant interacted dangerously with the cough medicine.',
    },
    supportingDocuments: [],
    consent: {
      accurateConfirmation: true,
      understandPvReview: true,
      consentContact: true,
      readPrivacyNotice: true,
      timestamp: '2026-08-26T15:00:00Z',
      consentVersion: 'v2026.1',
    },
    followUps: [],
    assessment: {
      reviewerId: 'user_reviewer',
      reviewerName: 'Dr. Sarah Collins, PharmD',
      reviewDate: '2026-08-29T09:15:00Z',
      reviewerComments: 'Classic presentation of Hunter Serotonin Toxicity Criteria following SSRI + DXM pharmacodynamic interaction.',
      medicalAssessment: 'Case meets formal criteria for Serotonin Syndrome. De-challenge positive upon cessation of both agents and administration of cyproheptadine.',
      causalityAssessment: 'Probable / Likely',
      causalityScale: 'WHO-UMC',
      naranjoScore: 7,
      expectednessAssessment: 'Expected / Listed',
      seriousnessConfirmed: true,
      followUpRequired: false,
      caseStatus: 'Assessment in Progress',
      internalNotes: 'Flagged for quarterly aggregate signal review on OTC DXM co-prescription warnings.',
    },
  },
  {
    id: 'rep_003',
    referenceNumber: 'PV-2026-000103',
    verificationCode: 'SAFE-3319',
    dateCreated: '2026-08-27T08:30:00Z',
    dateSubmitted: '2026-08-27T08:45:00Z',
    lastUpdated: '2026-08-30T16:00:00Z',
    status: 'Closed',
    isDraft: false,
    isDemoData: true,
    reporterType: 'Caregiver',
    assignedReviewer: 'Dr. Sarah Collins, PharmD',
    reporterInfo: {
      fullName: 'Demo Caregiver C. (Fictional)',
      age: '41',
      gender: 'Female',
      mobile: '+1 (555) 671-2290',
      email: 'caregiver.c@demo-family.net',
      currentAddress: '312 Maple Street',
      country: 'United States',
      state: 'Ohio',
      pinZip: '43215',
      idNotAvailable: true,
    },
    physicianInfo: {
      fullName: 'Dr. Robert Lin',
      isTreatingPhysician: 'Yes',
      availableForFollowUp: 'Yes',
      institutionName: 'Buckeye Family Practice',
      detailsKnown: true,
    },
    patientInfo: {
      fullName: 'Demo Elderly Patient C. (Fictional)',
      age: '79',
      sex: 'Female',
      country: 'United States',
      state: 'Ohio',
      idNotAvailable: true,
    },
    patientMeasurements: {
      height: '155',
      heightUnit: 'cm',
      weight: '52',
      weightUnit: 'kg',
      bmi: '21.6',
      bmiCategory: 'Normal weight',
      pregnancyStatus: 'Not Applicable',
    },
    suspectedMedications: [
      {
        id: 'med_003_1',
        brandName: 'DermaShield TopiCalm',
        genericName: 'Hydrocortisone Butyrate 0.1%',
        strength: '0.1% w/w',
        dosageForm: 'Topical Cream',
        dose: 'Thin layer',
        route: 'Topical',
        frequency: 'Twice daily',
        startDate: '2026-08-15',
        stopDate: '2026-08-26',
        stillTaking: false,
        indication: 'Localized eczema on forearm',
        detailsUnknown: false,
      },
    ],
    adverseEvent: {
      description: 'Applied topical cream to eczematous patch. Within 48 hours developed localized contact dermatitis with severe erythematous papules and intense itching spreading beyond application border.',
      reactionTerms: 'Contact Dermatitis, Pruritus, Erythema, Application Site Reaction',
      startDate: '2026-08-17',
      endDate: '2026-08-27',
      ongoing: false,
      severity: 'Mild',
      treatmentReceived: 'Discontinuation of cream and cool saline compresses.',
      hospitalization: 'No',
      outcome: 'Recovered',
    },
    timeline: [
      {
        id: 'tl_3_1',
        stage: 'Medication Started',
        date: '2026-08-15',
        title: 'Cream applied to forearm',
        description: 'Twice daily application for minor eczema.',
      },
      {
        id: 'tl_3_2',
        stage: 'Symptoms Appeared',
        date: '2026-08-17',
        title: 'Redness and burning papules flared',
        description: 'Rash expanded beyond margin.',
      },
      {
        id: 'tl_3_3',
        stage: 'Medication Stopped/Continued',
        date: '2026-08-26',
        title: 'Cream discontinued',
        description: 'Replaced with plain emollient.',
      },
      {
        id: 'tl_3_4',
        stage: 'Current Outcome',
        date: '2026-08-27',
        title: 'Rash completely resolved',
        description: 'Skin normalized with no residual scarring.',
      },
    ],
    medicalHistory: {
      existingConditions: 'Osteoarthritis, Atopic Diathesis',
    },
    concomitantMedications: [],
    hasNoConcomitantMeds: true,
    seriousness: {
      death: false,
      lifeThreatening: false,
      hospitalization: false,
      prolongationHospitalization: false,
      disability: false,
      congenitalAnomaly: false,
      otherMedicallyImportant: false,
      noneOfTheAbove: true,
      unknown: false,
    },
    reporterOpinion: {
      relatedToMedication: 'Yes',
      explanation: 'The rash happened right where the cream was rubbed.',
    },
    supportingDocuments: [],
    consent: {
      accurateConfirmation: true,
      understandPvReview: true,
      consentContact: true,
      readPrivacyNotice: true,
      timestamp: '2026-08-27T08:44:00Z',
      consentVersion: 'v2026.1',
    },
    followUps: [],
    assessment: {
      reviewerId: 'user_reviewer',
      reviewerName: 'Dr. Sarah Collins, PharmD',
      reviewDate: '2026-08-30T15:30:00Z',
      reviewerComments: 'Non-serious allergic contact dermatitis to vehicle or corticosteroid active component. Positive de-challenge documented.',
      medicalAssessment: 'Standard expected local adverse drug reaction. Well known class effect for topical corticosteroids with vehicle sensitivities.',
      causalityAssessment: 'Certain',
      causalityScale: 'WHO-UMC',
      naranjoScore: 6,
      expectednessAssessment: 'Expected / Listed',
      seriousnessConfirmed: false,
      followUpRequired: false,
      caseStatus: 'Closed',
      internalNotes: 'Case closed and logged in non-serious registry.',
    },
  },
  {
    id: 'rep_004',
    referenceNumber: 'PV-2026-000104',
    verificationCode: 'SAFE-6701',
    dateCreated: '2026-08-28T16:20:00Z',
    dateSubmitted: '2026-08-28T17:15:00Z',
    lastUpdated: '2026-08-30T11:45:00Z',
    status: 'Additional Information Requested',
    isDraft: false,
    isDemoData: true,
    reporterType: 'Family Member',
    assignedReviewer: 'Dr. Sarah Collins, PharmD',
    reporterInfo: {
      fullName: 'Demo Family Member D. (Son)',
      age: '38',
      gender: 'Male',
      mobile: '+1 (555) 431-8902',
      email: 'family.d.demo@example.com',
      currentAddress: '901 Pine Avenue',
      country: 'United States',
      state: 'Texas',
      pinZip: '77002',
      idNotAvailable: true,
    },
    physicianInfo: {
      fullName: 'Unknown / Hospital Physician',
      isTreatingPhysician: 'Unknown',
      availableForFollowUp: 'Unknown',
      detailsKnown: false,
    },
    patientInfo: {
      fullName: 'Demo Patient D. (Mother, Fictional)',
      age: '71',
      sex: 'Female',
      country: 'United States',
      state: 'Texas',
      idNotAvailable: true,
    },
    patientMeasurements: {
      height: '160',
      heightUnit: 'cm',
      weight: '65',
      weightUnit: 'kg',
      bmi: '25.4',
      bmiCategory: 'Overweight',
      pregnancyStatus: 'Not Applicable',
    },
    suspectedMedications: [
      {
        id: 'med_004_1',
        brandName: 'Glucotrend XR',
        genericName: 'Metformin Hydrochloride Extended Release',
        strength: '1000mg',
        dosageForm: 'Extended Release Tablet',
        dose: '1000mg',
        route: 'Oral',
        frequency: 'Twice daily with meals',
        startDate: '2026-08-05',
        stillTaking: false,
        indication: 'Type 2 Diabetes',
        detailsUnknown: false,
      },
    ],
    adverseEvent: {
      description: 'My mother became extremely dizzy, confused, short of breath, and started vomiting severely after her dosage was increased. She was rushed to the ER and doctors said her blood acid levels were dangerously high (metabolic lactic acidosis).',
      reactionTerms: 'Lactic Acidosis, Severe Vomiting, Tachypnea, Metabolic Acidosis, Somnolence',
      startDate: '2026-08-27',
      ongoing: true,
      severity: 'Severe',
      treatmentReceived: 'ICU admission, continuous renal replacement therapy (CRRT) / hemodialysis, IV bicarbonate.',
      hospitalization: 'Yes - Hospitalized',
      outcome: 'Recovering',
    },
    timeline: [
      {
        id: 'tl_4_1',
        stage: 'Medication Started',
        date: '2026-08-05',
        title: 'Glucotrend XR dose doubled to 2000mg/day',
        description: 'Dose adjusted for glycemic control.',
      },
      {
        id: 'tl_4_2',
        stage: 'Symptoms Appeared',
        date: '2026-08-27',
        title: 'Severe nausea, rapid breathing, confusion',
        description: 'Found lethargic by family member.',
      },
      {
        id: 'tl_4_3',
        stage: 'Medical Treatment',
        date: '2026-08-27',
        title: 'ICU Admission & Hemodialysis',
        description: 'Dialysis initiated for metformin-associated lactic acidosis.',
      },
    ],
    medicalHistory: {
      existingConditions: 'Type 2 Diabetes, Mild Chronic Kidney Disease (Stage 3)',
    },
    concomitantMedications: [],
    hasNoConcomitantMeds: true,
    seriousness: {
      death: false,
      lifeThreatening: true,
      hospitalization: true,
      prolongationHospitalization: false,
      disability: false,
      congenitalAnomaly: false,
      otherMedicallyImportant: true,
      noneOfTheAbove: false,
      unknown: false,
      details: 'Life-threatening lactic acidosis requiring ICU level care and emergent dialysis.',
    },
    reporterOpinion: {
      relatedToMedication: 'Yes',
      explanation: 'The ER physician informed us this was an adverse reaction to the diabetes medication in the setting of kidney strain.',
    },
    supportingDocuments: [],
    consent: {
      accurateConfirmation: true,
      understandPvReview: true,
      consentContact: true,
      readPrivacyNotice: true,
      timestamp: '2026-08-28T17:14:00Z',
      consentVersion: 'v2026.1',
    },
    followUps: [
      {
        id: 'fu_001',
        requestedBy: 'Dr. Sarah Collins, PharmD (PV Reviewer)',
        requestedDate: '2026-08-30T10:15:00Z',
        requestMessage: 'Could you please confirm the name of the treating hospital and provide the hospital discharge summary or baseline serum creatinine / eGFR values if available?',
        status: 'Pending Response',
      },
    ],
  },
  {
    id: 'rep_005',
    referenceNumber: 'PV-2026-000105',
    verificationCode: 'SAFE-1194',
    dateCreated: '2026-08-30T18:00:00Z',
    dateSubmitted: '2026-08-30T18:30:00Z',
    lastUpdated: '2026-08-30T18:30:00Z',
    status: 'Submitted',
    isDraft: false,
    isDemoData: true,
    reporterType: 'Doctor / Healthcare Professional',
    reporterInfo: {
      fullName: 'Dr. Marcus Holloway',
      mobile: '+1 (555) 882-9911',
      email: 'dr.holloway@pulmo-clinic.demo',
      currentAddress: '700 Riverwalk Way',
      country: 'United States',
      state: 'California',
      pinZip: '94107',
      idNotAvailable: true,
    },
    physicianInfo: {
      fullName: 'Dr. Marcus Holloway, MD',
      qualification: 'MD, Pulmonology',
      institutionName: 'Bay Area Pulmonary Associates',
      isTreatingPhysician: 'Yes',
      availableForFollowUp: 'Yes',
      detailsKnown: true,
    },
    patientInfo: {
      fullName: 'Demo Patient E. (Fictional)',
      age: '45',
      sex: 'Male',
      country: 'United States',
      state: 'California',
      idNotAvailable: true,
    },
    patientMeasurements: {
      height: '175',
      heightUnit: 'cm',
      weight: '78',
      weightUnit: 'kg',
      bmi: '25.5',
      bmiCategory: 'Overweight',
      pregnancyStatus: 'Not Applicable',
    },
    suspectedMedications: [
      {
        id: 'med_005_1',
        brandName: 'PulmoBreathe Inhaler',
        genericName: 'Fluticasone Propionate / Formoterol',
        strength: '250mcg / 10mcg',
        dosageForm: 'Metered Dose Inhaler',
        dose: '2 puffs',
        route: 'Inhalation',
        frequency: 'Twice daily',
        startDate: '2026-08-29',
        stillTaking: false,
        indication: 'Moderate persistent asthma exacerbation',
        detailsUnknown: false,
      },
    ],
    adverseEvent: {
      description: 'Immediately following the first dose inhalation, patient experienced severe acute paradoxical bronchospasm, audible stridor, chest tightness, and a drop in SpO2 to 86%.',
      reactionTerms: 'Paradoxical Bronchospasm, Hypoxia, Dyspnea, Acute Stridor',
      startDate: '2026-08-29',
      ongoing: false,
      severity: 'Severe',
      treatmentReceived: 'Immediate nebulized ipratropium + albuterol and supplemental oxygen.',
      hospitalization: 'No',
      outcome: 'Recovered',
    },
    timeline: [
      {
        id: 'tl_5_1',
        stage: 'Medication Started',
        date: '2026-08-29',
        title: 'First inhalation of PulmoBreathe',
        description: 'Administered under in-clinic instruction.',
      },
      {
        id: 'tl_5_2',
        stage: 'Symptoms Appeared',
        date: '2026-08-29',
        title: 'Immediate paradoxical bronchospasm',
        description: 'Severe bronchoconstriction within 90 seconds.',
      },
      {
        id: 'tl_5_3',
        stage: 'Medical Treatment',
        date: '2026-08-29',
        title: 'Emergency nebulization & O2 therapy',
        description: 'Resolved with anticholinergic nebulizer.',
      },
      {
        id: 'tl_5_4',
        stage: 'Current Outcome',
        date: '2026-08-29',
        title: 'SpO2 recovered to 98%',
        description: 'Discharged safely with alternative therapy.',
      },
    ],
    medicalHistory: {
      existingConditions: 'Asthma since childhood',
    },
    concomitantMedications: [],
    hasNoConcomitantMeds: true,
    seriousness: {
      death: false,
      lifeThreatening: false,
      hospitalization: false,
      prolongationHospitalization: false,
      disability: false,
      congenitalAnomaly: false,
      otherMedicallyImportant: true,
      noneOfTheAbove: false,
      unknown: false,
      details: 'Acute respiratory compromise requiring urgent in-office pharmacological resuscitation.',
    },
    reporterOpinion: {
      relatedToMedication: 'Yes',
      explanation: 'Immediate temporal onset post-inhalation confirms paradoxical reaction.',
    },
    supportingDocuments: [],
    consent: {
      accurateConfirmation: true,
      understandPvReview: true,
      consentContact: true,
      readPrivacyNotice: true,
      timestamp: '2026-08-30T18:29:00Z',
      consentVersion: 'v2026.1',
    },
    followUps: [],
  },
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    timestamp: '2026-08-25T11:30:00Z',
    userId: 'user_doctor',
    userName: 'Dr. Arthur Davis, MD',
    userRole: 'Doctor / HCP',
    action: 'Report Submitted',
    reportId: 'rep_001',
    reportRef: 'PV-2026-000101',
    details: 'Initial adverse event report created and submitted for Cardiovent Plus rhabdomyolysis.',
  },
  {
    id: 'log_002',
    timestamp: '2026-08-26T15:02:00Z',
    userId: 'user_patient',
    userName: 'Demo Patient B',
    userRole: 'Patient',
    action: 'Report Submitted',
    reportId: 'rep_002',
    reportRef: 'PV-2026-000102',
    details: 'Patient submitted report regarding NeuroCalm XR adverse reaction.',
  },
  {
    id: 'log_003',
    timestamp: '2026-08-28T14:20:00Z',
    userId: 'user_reviewer',
    userName: 'Dr. Sarah Collins, PharmD',
    userRole: 'PV Reviewer',
    action: 'Report Triage & Status Changed',
    reportId: 'rep_001',
    reportRef: 'PV-2026-000101',
    details: 'Status updated from "Submitted" to "Under Review". Prioritized as Serious Hospitalization case.',
  },
  {
    id: 'log_004',
    timestamp: '2026-08-29T09:15:00Z',
    userId: 'user_reviewer',
    userName: 'Dr. Sarah Collins, PharmD',
    userRole: 'PV Reviewer',
    action: 'PV Assessment Added',
    reportId: 'rep_002',
    reportRef: 'PV-2026-000102',
    details: 'Completed WHO-UMC causality evaluation (Probable) and medical evaluation notes.',
  },
  {
    id: 'log_005',
    timestamp: '2026-08-30T10:15:00Z',
    userId: 'user_reviewer',
    userName: 'Dr. Sarah Collins, PharmD',
    userRole: 'PV Reviewer',
    action: 'Follow-up Information Requested',
    reportId: 'rep_004',
    reportRef: 'PV-2026-000104',
    details: 'Sent request to reporter for hospital discharge summary and baseline kidney labs.',
  },
];

/**
 * In-Memory Database Store with Local Backup & Persistence Helpers
 */
class PharmacovigilanceDB {
  private reports: AdverseEventReport[] = [...DEMO_REPORTS];
  private drafts: AdverseEventReport[] = [];
  private auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  private users: User[] = [...MOCK_USERS];
  private reportCounter = 106;

  // Generate standardized PV reference numbers like PV-2026-000106
  public generateNextReference(): { refNumber: string; id: string; verificationCode: string } {
    const year = new Date().getFullYear();
    const countStr = String(this.reportCounter++).padStart(6, '0');
    const refNumber = `PV-${year}-${countStr}`;
    const id = `rep_${countStr}`;
    const verificationCode = `SAFE-${Math.floor(1000 + Math.random() * 9000)}`;
    return { refNumber, id, verificationCode };
  }

  public getDashboardStats(): DashboardStats {
    const totalReports = this.reports.length;
    const newReports = this.reports.filter((r) => r.status === 'Submitted').length;
    const underReview = this.reports.filter(
      (r) => r.status === 'Under Review' || r.status === 'Assessment in Progress'
    ).length;
    const seriousReports = this.reports.filter(
      (r) =>
        r.seriousness.death ||
        r.seriousness.lifeThreatening ||
        r.seriousness.hospitalization ||
        r.seriousness.prolongationHospitalization ||
        r.seriousness.disability ||
        r.seriousness.congenitalAnomaly ||
        r.seriousness.otherMedicallyImportant
    ).length;
    const requiringFollowUp = this.reports.filter(
      (r) => r.status === 'Additional Information Requested'
    ).length;
    const closedReports = this.reports.filter((r) => r.status === 'Closed').length;

    return {
      totalReports,
      newReports,
      underReview,
      seriousReports,
      requiringFollowUp,
      closedReports,
    };
  }

  public getAllReports(): AdverseEventReport[] {
    return [...this.reports].sort(
      (a, b) => new Date(b.dateSubmitted || b.dateCreated).getTime() - new Date(a.dateSubmitted || a.dateCreated).getTime()
    );
  }

  public getReportById(id: string): AdverseEventReport | undefined {
    return this.reports.find((r) => r.id === id || r.referenceNumber === id);
  }

  public findReportByVerification(refNumber: string, verificationQuery: string): AdverseEventReport | undefined {
    const cleanRef = refNumber.trim().toUpperCase();
    const cleanQuery = verificationQuery.trim().toLowerCase();

    return this.reports.find((r) => {
      if (r.referenceNumber.toUpperCase() !== cleanRef) return false;
      // Match by verification code, email, or mobile
      const codeMatch = r.verificationCode.toLowerCase() === cleanQuery;
      const emailMatch = r.reporterInfo.email.toLowerCase() === cleanQuery;
      const mobileMatch = r.reporterInfo.mobile.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, ''));
      return codeMatch || emailMatch || mobileMatch;
    });
  }

  public createReport(reportData: Partial<AdverseEventReport>, user?: User): AdverseEventReport {
    const { refNumber, id, verificationCode } = this.generateNextReference();
    const now = new Date().toISOString();

    const newReport: AdverseEventReport = {
      id,
      referenceNumber: refNumber,
      verificationCode,
      dateCreated: now,
      dateSubmitted: now,
      lastUpdated: now,
      status: 'Submitted',
      isDraft: false,
      isDemoData: false,
      reporterType: reportData.reporterType || 'Patient',
      reporterInfo: reportData.reporterInfo || ({} as any),
      physicianInfo: reportData.physicianInfo || ({ isTreatingPhysician: 'Unknown', availableForFollowUp: 'Unknown' } as any),
      patientInfo: reportData.patientInfo || ({ sex: 'Unknown', country: 'United States', idNotAvailable: true } as any),
      patientMeasurements: reportData.patientMeasurements || ({ heightUnit: 'cm', weightUnit: 'kg', pregnancyStatus: 'Not Applicable' } as any),
      suspectedMedications: reportData.suspectedMedications || [],
      adverseEvent: reportData.adverseEvent || ({ severity: 'Moderate', outcome: 'Unknown', ongoing: false, hospitalization: 'No', description: '', reactionTerms: '', startDate: '', treatmentReceived: '' } as any),
      timeline: reportData.timeline || [],
      medicalHistory: reportData.medicalHistory || {},
      concomitantMedications: reportData.concomitantMedications || [],
      hasNoConcomitantMeds: reportData.hasNoConcomitantMeds ?? true,
      seriousness: reportData.seriousness || ({ death: false, lifeThreatening: false, hospitalization: false, prolongationHospitalization: false, disability: false, congenitalAnomaly: false, otherMedicallyImportant: false, noneOfTheAbove: true, unknown: false }),
      reporterOpinion: reportData.reporterOpinion || { relatedToMedication: '' },
      supportingDocuments: reportData.supportingDocuments || [],
      consent: reportData.consent || ({ accurateConfirmation: true, understandPvReview: true, consentContact: true, readPrivacyNotice: true, timestamp: now, consentVersion: 'v2026.1' }),
      followUps: [],
    };

    this.reports.unshift(newReport);

    // Add Audit Log
    this.addAuditLog({
      userId: user?.id || 'public_reporter',
      userName: user?.name || newReport.reporterInfo.fullName || 'Anonymous Reporter',
      userRole: user?.role || 'reporter',
      action: 'Report Submitted',
      reportId: newReport.id,
      reportRef: newReport.referenceNumber,
      details: `New adverse event report submitted with reference ${newReport.referenceNumber} for suspected drug(s): ${newReport.suspectedMedications.map(m => m.brandName).join(', ') || 'N/A'}.`,
    });

    return newReport;
  }

  public saveDraft(draftData: Partial<AdverseEventReport>, user?: User): { draftId: string; referenceNumber: string; verificationCode: string } {
    const existingIndex = this.drafts.findIndex((d) => d.id === draftData.id || d.referenceNumber === draftData.referenceNumber);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      this.drafts[existingIndex] = {
        ...this.drafts[existingIndex],
        ...draftData,
        lastUpdated: now,
        isDraft: true,
      } as AdverseEventReport;
      return {
        draftId: this.drafts[existingIndex].id,
        referenceNumber: this.drafts[existingIndex].referenceNumber,
        verificationCode: this.drafts[existingIndex].verificationCode,
      };
    }

    const { refNumber, id, verificationCode } = this.generateNextReference();
    const newDraft: AdverseEventReport = {
      ...(draftData as any),
      id,
      referenceNumber: refNumber,
      verificationCode,
      dateCreated: now,
      dateSubmitted: '',
      lastUpdated: now,
      status: 'Draft',
      isDraft: true,
      isDemoData: false,
    };

    this.drafts.push(newDraft);

    this.addAuditLog({
      userId: user?.id || 'guest',
      userName: user?.name || draftData.reporterInfo?.fullName || 'Guest Reporter',
      userRole: 'reporter',
      action: 'Draft Saved',
      reportId: newDraft.id,
      reportRef: newDraft.referenceNumber,
      details: `Report draft saved at Step ${draftData.currentStep || 1}.`,
    });

    return { draftId: id, referenceNumber: refNumber, verificationCode };
  }

  public getDraftByRef(ref: string): AdverseEventReport | undefined {
    return this.drafts.find((d) => d.referenceNumber === ref || d.id === ref || d.verificationCode === ref);
  }

  public updateAssessment(reportId: string, assessment: PVAssessment, reviewer: User): AdverseEventReport | null {
    const report = this.reports.find((r) => r.id === reportId || r.referenceNumber === reportId);
    if (!report) return null;

    report.assessment = assessment;
    report.status = assessment.caseStatus;
    report.lastUpdated = new Date().toISOString();

    this.addAuditLog({
      userId: reviewer.id,
      userName: reviewer.name,
      userRole: reviewer.role,
      action: 'PV Assessment Updated',
      reportId: report.id,
      reportRef: report.referenceNumber,
      details: `PV Assessment updated. Causality: ${assessment.causalityAssessment}, Status: ${assessment.caseStatus}, Expectedness: ${assessment.expectednessAssessment}.`,
    });

    return report;
  }

  public addFollowUpRequest(reportId: string, requestMessage: string, reviewer: User): AdverseEventReport | null {
    const report = this.reports.find((r) => r.id === reportId || r.referenceNumber === reportId);
    if (!report) return null;

    const followUp: FollowUpThread = {
      id: `fu_${Date.now()}`,
      requestedBy: `${reviewer.name} (${reviewer.title || 'PV Reviewer'})`,
      requestedDate: new Date().toISOString(),
      requestMessage,
      status: 'Pending Response',
    };

    report.followUps.push(followUp);
    report.status = 'Additional Information Requested';
    report.lastUpdated = new Date().toISOString();

    this.addAuditLog({
      userId: reviewer.id,
      userName: reviewer.name,
      userRole: reviewer.role,
      action: 'Follow-up Information Requested',
      reportId: report.id,
      reportRef: report.referenceNumber,
      details: `Reviewer requested follow-up: "${requestMessage.slice(0, 80)}${requestMessage.length > 80 ? '...' : ''}"`,
    });

    return report;
  }

  public replyToFollowUp(reportId: string, followUpId: string, responseMessage: string, responderName: string): AdverseEventReport | null {
    const report = this.reports.find((r) => r.id === reportId || r.referenceNumber === reportId);
    if (!report) return null;

    const followUp = report.followUps.find((f) => f.id === followUpId);
    if (followUp) {
      followUp.respondedBy = responderName;
      followUp.responseDate = new Date().toISOString();
      followUp.responseMessage = responseMessage;
      followUp.status = 'Responded';
    }

    report.status = 'Under Review';
    report.lastUpdated = new Date().toISOString();

    this.addAuditLog({
      userId: 'reporter',
      userName: responderName,
      userRole: 'reporter',
      action: 'Follow-up Response Submitted',
      reportId: report.id,
      reportRef: report.referenceNumber,
      details: `Reporter submitted response to follow-up query: "${responseMessage.slice(0, 80)}..."`,
    });

    return report;
  }

  public updateReport(reportId: string, updatedData: Partial<AdverseEventReport>, user?: User): AdverseEventReport | null {
    const index = this.reports.findIndex((r) => r.id === reportId || r.referenceNumber === reportId);
    if (index === -1) return null;

    const existing = this.reports[index];
    const now = new Date().toISOString();

    const mergedReport: AdverseEventReport = {
      ...existing,
      ...updatedData,
      id: existing.id,
      referenceNumber: existing.referenceNumber,
      verificationCode: existing.verificationCode,
      dateCreated: existing.dateCreated,
      dateSubmitted: existing.dateSubmitted,
      lastUpdated: now,
    };

    this.reports[index] = mergedReport;

    this.addAuditLog({
      userId: user?.id || 'reporter_edit',
      userName: user?.name || mergedReport.reporterInfo?.fullName || 'Reporter',
      userRole: user?.role || 'reporter',
      action: 'Report Edited / Updated',
      reportId: existing.id,
      reportRef: existing.referenceNumber,
      details: `Adverse event report ${existing.referenceNumber} was edited/updated within the 5-day window.`,
    });

    return mergedReport;
  }

  public addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.auditLogs.unshift(newLog);
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  public getUsers(): User[] {
    return [...this.users];
  }

  public addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      id: `user_${Date.now()}`,
      ...user,
    };
    this.users.push(newUser);
    this.addAuditLog({
      userId: 'admin_sys',
      userName: 'Administrator',
      userRole: 'admin',
      action: 'User Created',
      details: `Created new user account: ${newUser.name} (${newUser.role})`,
    });
    return newUser;
  }

  // Export structured E2B(R3) XML according to ICH ICSR standards
  public generateE2BR3Xml(report: AdverseEventReport): string {
    const escapeXml = (unsafe?: string) => {
      if (!unsafe) return '';
      return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  ICH ICSR E2B(R3) Prototype Export
  Generated by SafeMeds PV Pharmacovigilance Platform
  Specification: ICH E2B(R3) Individual Case Safety Report (Educational Prototype)
-->
<ichicsr lang="en">
  <ichicsrmessageheader>
    <messagetype>ichicsr</messagetype>
    <messageformatversion>2.1</messageformatversion>
    <messageformatrelease>2.0</messageformatrelease>
    <messagenumb>${escapeXml(report.referenceNumber)}</messagenumb>
    <messagesenderidentifier>SAFEMEDS-PV-SYSTEM</messagesenderidentifier>
    <messagereceiveridentifier>REGULATORY-AUTHORITY-DEMO</messagereceiveridentifier>
    <messagedateformat>204</messagedateformat>
    <messagedate>${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}</messagedate>
  </ichicsrmessageheader>
  <safetyreport>
    <safetyreportversion>1</safetyreportversion>
    <safetyreportid>${escapeXml(report.referenceNumber)}</safetyreportid>
    <primarysourcecountry>${escapeXml(report.reporterInfo?.country || 'US')}</primarysourcecountry>
    <occurcountry>${escapeXml(report.patientInfo?.country || 'US')}</occurcountry>
    <transmissiondateformat>102</transmissiondateformat>
    <transmissiondate>${(report.dateSubmitted || new Date().toISOString()).slice(0, 10).replace(/-/g, '')}</transmissiondate>
    <reporttype>1</reporttype> <!-- Spontaneous report -->
    <serious>${report.seriousness?.noneOfTheAbove ? '2' : '1'}</serious>
    <seriousnesscriteria>
      <seriousnessdeath>${report.seriousness?.death ? '1' : '2'}</seriousnessdeath>
      <seriousnesslifethreatening>${report.seriousness?.lifeThreatening ? '1' : '2'}</seriousnesslifethreatening>
      <seriousnesshospitalization>${report.seriousness?.hospitalization ? '1' : '2'}</seriousnesshospitalization>
      <seriousnessdisabling>${report.seriousness?.disability ? '1' : '2'}</seriousnessdisabling>
      <seriousnesscongenitalanomali>${report.seriousness?.congenitalAnomaly ? '1' : '2'}</seriousnesscongenitalanomali>
      <seriousnessother>${report.seriousness?.otherMedicallyImportant ? '1' : '2'}</seriousnessother>
    </seriousnesscriteria>

    <!-- Primary Source / Reporter Information -->
    <primarysource>
      <reportergivename>${escapeXml(report.reporterInfo?.fullName?.split(' ')[0] || 'Unknown')}</reportergivename>
      <reporterfamilyname>${escapeXml(report.reporterInfo?.fullName?.split(' ').slice(1).join(' ') || 'Reporter')}</reporterfamilyname>
      <reporterorganization>${escapeXml(report.physicianInfo?.institutionName || 'Public')}</reporterorganization>
      <reporterdepartment>${escapeXml(report.physicianInfo?.department || '')}</reporterdepartment>
      <reportercity>${escapeXml(report.reporterInfo?.state || '')}</reportercity>
      <qualification>${report.reporterType === 'Doctor / Healthcare Professional' ? '1' : '3'}</qualification>
    </primarysource>

    <!-- Patient Information -->
    <patient>
      <patientinitials>${escapeXml((report.patientInfo?.fullName || 'XX').split(' ').map(n => n[0]).join('').toUpperCase())}</patientinitials>
      <patientagegroup>${Number(report.patientInfo?.age || 0) >= 65 ? '6' : Number(report.patientInfo?.age || 0) >= 18 ? '5' : '4'}</patientagegroup>
      <patientonsetage>${escapeXml(report.patientInfo?.age || '')}</patientonsetage>
      <patientonsetageunit>801</patientonsetageunit> <!-- Years -->
      <patientsex>${report.patientInfo?.sex === 'Male' ? '1' : report.patientInfo?.sex === 'Female' ? '2' : '0'}</patientsex>
      <patientweight>${escapeXml(report.patientMeasurements?.weight || '')}</patientweight>
      <patientheight>${escapeXml(report.patientMeasurements?.height || '')}</patientheight>
      
      <!-- Medical History -->
      <medicalhistoryepisode>
        <patientepisodename>${escapeXml(report.medicalHistory?.existingConditions || 'None reported')}</patientepisodename>
        <patientmedicalhistorytext>${escapeXml(report.medicalHistory?.relevantHistory || '')}</patientmedicalhistorytext>
      </medicalhistoryepisode>

      <!-- Suspected & Concomitant Drugs -->
      <patientdruglist>
${report.suspectedMedications?.map((drug, index) => `        <drug>
          <drugcharacterization>1</drugcharacterization> <!-- 1 = Suspect -->
          <medicinalproduct>${escapeXml(drug.brandName)}</medicinalproduct>
          <activesubstancename>${escapeXml(drug.genericName || drug.brandName)}</activesubstancename>
          <drugdosageform>${escapeXml(drug.dosageForm || 'Tablet')}</drugdosageform>
          <drugdosagetext>${escapeXml(drug.dose || drug.strength || '')}</drugdosagetext>
          <drugadministrationroute>${escapeXml(drug.route || 'Oral')}</drugadministrationroute>
          <drugindication>${escapeXml(drug.indication || 'Adverse event indication')}</drugindication>
          <drugstartdate>${escapeXml((drug.startDate || '').replace(/-/g, ''))}</drugstartdate>
          <drugenddate>${escapeXml((drug.stopDate || '').replace(/-/g, ''))}</drugenddate>
          <drugbatchnumb>${escapeXml(drug.batchLotNumber || 'Unknown')}</drugbatchnumb>
          <actiontaken>${drug.stillTaking ? '4' : '1'}</actiontaken>
        </drug>`).join('\n')}
${report.concomitantMedications?.map((drug, index) => `        <drug>
          <drugcharacterization>2</drugcharacterization> <!-- 2 = Concomitant -->
          <medicinalproduct>${escapeXml(drug.brandName)}</medicinalproduct>
          <activesubstancename>${escapeXml(drug.genericName || drug.brandName)}</activesubstancename>
          <drugdosagetext>${escapeXml(drug.dose || '')}</drugdosagetext>
          <drugindication>${escapeXml(drug.reasonForUse || '')}</drugindication>
        </drug>`).join('\n')}
      </patientdruglist>

      <!-- Reaction / Adverse Event -->
      <reaction>
        <primarysourcereaction>${escapeXml(report.adverseEvent?.reactionTerms || report.adverseEvent?.description || 'Adverse Drug Reaction')}</primarysourcereaction>
        <reactionmeddraversionllt>27.0</reactionmeddraversionllt>
        <reactionstartdate>${escapeXml((report.adverseEvent?.startDate || '').replace(/-/g, ''))}</reactionstartdate>
        <reactionoutcome>${report.adverseEvent?.outcome === 'Recovered' ? '1' : report.adverseEvent?.outcome === 'Recovering' ? '2' : report.adverseEvent?.outcome === 'Not Recovered' ? '3' : report.adverseEvent?.outcome === 'Recovered with Sequelae' ? '4' : report.adverseEvent?.outcome === 'Fatal' ? '5' : '6'}</reactionoutcome>
      </reaction>

      <!-- Narrative summary -->
      <summary>
        <narrativeincludeclinical>${escapeXml(report.adverseEvent?.description)}</narrativeincludeclinical>
        <reportercomment>${escapeXml(report.reporterOpinion?.explanation || report.reporterOpinion?.relatedToMedication)}</reportercomment>
        <sendercomment>${escapeXml(report.assessment?.reviewerComments || 'Under standard PV evaluation')}</sendercomment>
        <sendercausalityassessment>${escapeXml(report.assessment?.causalityAssessment || 'Pending Assessment')}</sendercausalityassessment>
      </summary>
    </patient>
  </safetyreport>
</ichicsr>`;
  }
}

export const pvDb = new PharmacovigilanceDB();
