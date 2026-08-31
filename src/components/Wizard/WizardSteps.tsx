import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  Users,
  Activity,
  Pill,
  AlertTriangle,
  Clock,
  FileText,
  ShieldCheck,
  Plus,
  Trash2,
  Upload,
  Eye,
  Info,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Lock,
  Calculator,
  Globe,
  MapPin,
  Building2,
  Ruler,
  Check,
  RefreshCw,
} from 'lucide-react';
import {
  AdverseEventReport,
  ConcomitantMedication,
  PatientInfo,
  PatientMeasurements,
  PhysicianInfo,
  ReporterInfo,
  ReporterType,
  SupportingDocument,
  SuspectedMedication,
  TimelineEvent,
  TimelineStage,
} from '../../types';
import { VisualTimeline } from './VisualTimeline';
import { COUNTRIES, getDialCodeForCountry } from '../../data/countries';
import { getStatesForCountry, getDistrictsForState } from '../../data/locations';
import { SearchableCountrySelect } from './SearchableCountrySelect';
import { CascadingAddressGroup } from './CascadingAddressGroup';
import { PhoneInputWithCountryCode } from './PhoneInputWithCountryCode';

interface StepProps {
  reportData: Partial<AdverseEventReport>;
  updateData: (fields: Partial<AdverseEventReport>) => void;
  onJumpToStep?: (step: number) => void;
}

// ----------------------------------------------------
// STEP 1: Reporter Type & Reporter Information
// ----------------------------------------------------
export const Step1Reporter: React.FC<StepProps> = ({ reportData, updateData }) => {
  const reporterTypes: ReporterType[] = [
    'Patient',
    'Doctor / Healthcare Professional',
    'Family Member',
    'Caregiver',
    'Other',
  ];

  const defaultCountry = 'United States';
  const info: ReporterInfo = reportData.reporterInfo || {
    fullName: '',
    phoneCountryCode: getDialCodeForCountry(defaultCountry),
    mobile: '',
    email: '',
    country: defaultCountry,
    currentCountry: defaultCountry,
    currentArea: '',
    currentAddress: '',
    currentState: '',
    state: '',
    currentDistrict: '',
    district: '',
    currentPin: '',
    pinZip: '',
    permanentSameAsCurrent: true,
    permanentCountry: defaultCountry,
    permanentArea: '',
    permanentAddress: '',
    permanentState: '',
    permanentDistrict: '',
    permanentPin: '',
    idNotAvailable: true,
  };

  const isPermanentSame = info.permanentSameAsCurrent !== false;

  const handleInfoChange = (field: keyof ReporterInfo, value: any) => {
    const updated = {
      ...info,
      [field]: value,
    };

    // If current address subfields are changed, keep legacy/compatibility fields in sync
    if (field === 'currentArea') {
      updated.currentAddress = value;
    } else if (field === 'currentState') {
      updated.state = value;
    } else if (field === 'currentDistrict') {
      updated.district = value;
    } else if (field === 'currentPin') {
      updated.pinZip = value;
    } else if (field === 'currentCountry') {
      updated.country = value;
    }

    // If permanent address is same as current, mirror current changes to permanent
    if (isPermanentSame) {
      if (field === 'currentCountry' || field === 'country') updated.permanentCountry = value;
      if (field === 'currentArea' || field === 'currentAddress') updated.permanentArea = value;
      if (field === 'currentState' || field === 'state') updated.permanentState = value;
      if (field === 'currentDistrict' || field === 'district') updated.permanentDistrict = value;
      if (field === 'currentPin' || field === 'pinZip') updated.permanentPin = value;
    }

    updateData({
      reporterInfo: updated,
    });
  };

  const handlePermanentSameToggle = (same: boolean) => {
    const updated: ReporterInfo = {
      ...info,
      permanentSameAsCurrent: same,
    };
    if (same) {
      updated.permanentCountry = info.currentCountry || info.country || defaultCountry;
      updated.permanentArea = info.currentArea || info.currentAddress || '';
      updated.permanentAddress = info.currentAddress || info.currentArea || '';
      updated.permanentState = info.currentState || info.state || '';
      updated.permanentDistrict = info.currentDistrict || info.district || '';
      updated.permanentPin = info.currentPin || info.pinZip || '';
    }
    updateData({
      reporterInfo: updated,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* 1. Reporter Type Question */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-bold">1</span>
            Who are you reporting as? *
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Please select the category that best describes your relationship to this event.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reporterTypes.map((type) => {
            const isSelected = reportData.reporterType === type;
            return (
              <label
                key={type}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 text-teal-950 font-semibold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="reporterType"
                  value={type}
                  checked={isSelected}
                  onChange={() => updateData({ reporterType: type })}
                  className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs sm:text-sm">{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Reporter Details Form */}
      <div className="space-y-6 pt-4 border-t border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs flex items-center justify-center font-bold">2</span>
            Reporter Information
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Contact and location details to allow the pharmacovigilance safety team to follow up if needed.
          </p>
        </div>

        {/* Core Personal & Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jane Doe or Dr. Arthur Davis"
              value={info.fullName || ''}
              onChange={(e) => handleInfoChange('fullName', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <PhoneInputWithCountryCode
              id="reporter-phone"
              label="Mobile / Phone Number"
              required={true}
              countryCode={info.phoneCountryCode || '+1'}
              phoneNumber={info.mobile || ''}
              onCountryCodeChange={(code) => handleInfoChange('phoneCountryCode', code)}
              onPhoneNumberChange={(phone) => handleInfoChange('mobile', phone)}
              helperText="Dial code is independent from address country selections."
            />
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-rose-600">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. reporter@example.com"
              value={info.email || ''}
              onChange={(e) => handleInfoChange('email', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="sm:col-span-2 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                min="0"
                max="120"
                placeholder="e.g. 42"
                value={info.age || ''}
                onChange={(e) => handleInfoChange('age', e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <select
                value={info.gender || ''}
                onChange={(e) => handleInfoChange('gender', e.target.value)}
                className="w-full px-2.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary / Other">Other</option>
                <option value="Prefer not to say">Prefer not</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 1: Current Address with Cascading Dropdowns */}
        <CascadingAddressGroup
          title="Current Address"
          icon="building"
          required={true}
          values={{
            country: info.currentCountry || info.country || defaultCountry,
            state: info.currentState || info.state || '',
            district: info.currentDistrict || info.district || '',
            area: info.currentArea || info.currentAddress || '',
            pinZip: info.currentPin || info.pinZip || '',
          }}
          onChange={(addr) => {
            const updated: ReporterInfo = {
              ...info,
              currentCountry: addr.country || defaultCountry,
              country: addr.country || info.country || defaultCountry,
              currentState: addr.state || '',
              state: addr.state || '',
              currentDistrict: addr.district || '',
              district: addr.district || '',
              currentArea: addr.area || '',
              currentAddress: addr.area || '',
              currentPin: addr.pinZip || '',
              pinZip: addr.pinZip || '',
            };
            if (isPermanentSame) {
              updated.permanentCountry = addr.country || defaultCountry;
              updated.permanentState = addr.state || '';
              updated.permanentDistrict = addr.district || '';
              updated.permanentArea = addr.area || '';
              updated.permanentAddress = addr.area || '';
              updated.permanentPin = addr.pinZip || '';
            }
            updateData({ reporterInfo: updated });
          }}
        />

        {/* SECTION 2: Permanent Address with Cascading Dropdowns & Same-As-Current Checkbox */}
        <CascadingAddressGroup
          title="Permanent Address"
          icon="mappin"
          required={true}
          isPermanentSection={true}
          isSameAsCurrent={isPermanentSame}
          onToggleSameAsCurrent={handlePermanentSameToggle}
          sameAsCurrentNote="Permanent address is synchronized with your Current Address. Uncheck the option above to specify a separate permanent location."
          values={{
            country: isPermanentSame ? (info.currentCountry || info.country || defaultCountry) : (info.permanentCountry || defaultCountry),
            state: isPermanentSame ? (info.currentState || info.state || '') : (info.permanentState || ''),
            district: isPermanentSame ? (info.currentDistrict || info.district || '') : (info.permanentDistrict || ''),
            area: isPermanentSame ? (info.currentArea || info.currentAddress || '') : (info.permanentArea || info.permanentAddress || ''),
            pinZip: isPermanentSame ? (info.currentPin || info.pinZip || '') : (info.permanentPin || ''),
          }}
          onChange={(addr) => {
            updateData({
              reporterInfo: {
                ...info,
                permanentCountry: addr.country || defaultCountry,
                permanentState: addr.state || '',
                permanentDistrict: addr.district || '',
                permanentArea: addr.area || '',
                permanentAddress: addr.area || '',
                permanentPin: addr.pinZip || '',
              },
            });
          }}
        />

        {/* Optional Government Identification */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span>Government / Professional Identification (Optional)</span>
            </div>
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={info.idNotAvailable}
                onChange={(e) => handleInfoChange('idNotAvailable', e.target.checked)}
                className="w-3.5 h-3.5 text-teal-600 rounded"
              />
              <span>Identification information is not available</span>
            </label>
          </div>

          <p className="text-[11px] text-slate-500">
            Government identification is completely optional. ID numbers are masked and shielded for privacy protection.
          </p>

          {!info.idNotAvailable && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  ID Type
                </label>
                <select
                  value={info.idType || ''}
                  onChange={(e) => handleInfoChange('idType', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                >
                  <option value="">Select ID Type</option>
                  <option value="National ID">National ID</option>
                  <option value="Passport">Passport</option>
                  <option value="Driver License">Driver License</option>
                  <option value="Medical License / Reg ID">Medical License / Reg ID</option>
                  <option value="Other">Other ID</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  ID Number (Encrypted)
                </label>
                <input
                  type="text"
                  placeholder="ID Number"
                  value={info.idNumber || ''}
                  onChange={(e) => handleInfoChange('idNumber', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// STEP 2: Physician / Healthcare Professional Details
// ----------------------------------------------------
export const Step2Physician: React.FC<StepProps> = ({ reportData, updateData }) => {
  const isHcp = reportData.reporterType === 'Doctor / Healthcare Professional';
  const phys: PhysicianInfo = reportData.physicianInfo || {
    fullName: '',
    isTreatingPhysician: isHcp ? 'Yes' : 'Unknown',
    availableForFollowUp: 'Yes',
    detailsKnown: isHcp,
  };

  const handlePhysChange = (field: keyof PhysicianInfo, value: any) => {
    updateData({
      physicianInfo: {
        ...phys,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-cyan-600" />
          Physician / Healthcare Professional Information
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {isHcp
            ? 'Please provide your professional medical credentials and institutional affiliation.'
            : "If you know your treating physician's details, you may provide them below to facilitate safety follow-up."}
        </p>
      </div>

      {!isHcp && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <p className="text-xs font-semibold text-slate-800">
            Do you have your treating doctor or clinic's details?
          </p>
          <div className="flex gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="radio"
                name="detailsKnown"
                checked={phys.detailsKnown === true}
                onChange={() => handlePhysChange('detailsKnown', true)}
                className="w-4 h-4 text-teal-600"
              />
              <span>Yes, I know my doctor's details</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="radio"
                name="detailsKnown"
                checked={phys.detailsKnown === false}
                onChange={() => handlePhysChange('detailsKnown', false)}
                className="w-4 h-4 text-teal-600"
              />
              <span>No / Not available (Skip this section)</span>
            </label>
          </div>
        </div>
      )}

      {(isHcp || phys.detailsKnown) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Physician / Healthcare Professional Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Arthur Davis, MD"
              value={phys.fullName || ''}
              onChange={(e) => handlePhysChange('fullName', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medical Qualification <span className="text-slate-400 font-normal">(e.g. MD, MBBS, PharmD)</span>
            </label>
            <input
              type="text"
              placeholder="MD, FACC"
              value={phys.qualification || ''}
              onChange={(e) => handlePhysChange('qualification', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Specialization / Practice Area
            </label>
            <input
              type="text"
              placeholder="e.g. Cardiology, Internal Medicine"
              value={phys.specialization || ''}
              onChange={(e) => handlePhysChange('specialization', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hospital / Clinic / Institution Name
            </label>
            <input
              type="text"
              placeholder="e.g. Metro General Hospital"
              value={phys.institutionName || ''}
              onChange={(e) => handlePhysChange('institutionName', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Department
            </label>
            <input
              type="text"
              placeholder="e.g. Department of Cardiology"
              value={phys.department || ''}
              onChange={(e) => handlePhysChange('department', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Professional Registration Number <span className="text-slate-400 font-normal">(Optional in prototype)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. MED-894129"
              value={phys.regNumber || ''}
              onChange={(e) => handlePhysChange('regNumber', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hospital / Clinic Phone
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phys.phone || ''}
              onChange={(e) => handlePhysChange('phone', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hospital / Clinic Email
            </label>
            <input
              type="email"
              placeholder="physician@hospital.org"
              value={phys.email || ''}
              onChange={(e) => handlePhysChange('email', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              placeholder="e.g. Chicago"
              value={phys.city || ''}
              onChange={(e) => handlePhysChange('city', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Are you the treating physician?
            </label>
            <select
              value={phys.isTreatingPhysician || 'Yes'}
              onChange={(e) => handlePhysChange('isTreatingPhysician', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Is the physician available for safety follow-up?
            </label>
            <select
              value={phys.availableForFollowUp || 'Yes'}
              onChange={(e) => handlePhysChange('availableForFollowUp', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Professional Comments <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Clinical context or admission observations..."
              value={phys.comments || ''}
              onChange={(e) => handlePhysChange('comments', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// STEP 3: Patient Information
// ----------------------------------------------------
export const Step3Patient: React.FC<StepProps> = ({ reportData, updateData }) => {
  const defaultCountry = 'United States';
  const patient: PatientInfo = reportData.patientInfo || {
    fullName: '',
    age: '',
    dob: '',
    isDobEstimated: false,
    sex: '',
    phoneCountryCode: getDialCodeForCountry(defaultCountry),
    mobile: '',
    country: defaultCountry,
    state: '',
    district: '',
    area: '',
    pinZip: '',
    currentAddress: '',
    idNotAvailable: true,
  };

  const [dobError, setDobError] = useState<string | null>(null);

  const calculateAgeFromDob = (dobString: string): { age: string; error?: string } => {
    if (!dobString) return { age: '' };
    const parts = dobString.split('-');
    if (parts.length !== 3) return { age: '' };
    const [y, m, d] = parts.map(Number);
    if (!y || !m || !d) return { age: '' };
    
    const birthDate = new Date(y, m - 1, d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      return { age: '', error: 'Date of birth cannot be in the future.' };
    }

    let calculatedAge = today.getFullYear() - y;
    const monthDiff = today.getMonth() - (m - 1);
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d)) {
      calculatedAge--;
    }
    return { age: Math.max(0, calculatedAge).toString() };
  };

  const handleDobChange = (newDob: string) => {
    if (!newDob) {
      setDobError(null);
      updateData({
        patientInfo: {
          ...patient,
          dob: '',
          isDobEstimated: false,
        },
      });
      return;
    }

    const { age: calculatedAge, error } = calculateAgeFromDob(newDob);
    if (error) {
      setDobError(error);
      updateData({
        patientInfo: {
          ...patient,
          dob: newDob,
        },
      });
    } else {
      setDobError(null);
      updateData({
        patientInfo: {
          ...patient,
          dob: newDob,
          age: calculatedAge,
          isDobEstimated: false,
        },
      });
    }
  };

  const handleAgeChange = (newAge: string) => {
    if (newAge === '') {
      setDobError(null);
      updateData({
        patientInfo: {
          ...patient,
          age: '',
          dob: patient.isDobEstimated ? '' : patient.dob,
          isDobEstimated: false,
        },
      });
      return;
    }

    const parsedAge = parseInt(newAge, 10);
    if (isNaN(parsedAge) || parsedAge < 0) {
      updateData({
        patientInfo: {
          ...patient,
          age: newAge,
        },
      });
      return;
    }

    const currentYear = new Date().getFullYear();
    const estYear = currentYear - parsedAge;
    const estDob = `${estYear}-01-01`;

    setDobError(null);
    updateData({
      patientInfo: {
        ...patient,
        age: newAge,
        dob: estDob,
        isDobEstimated: true,
      },
    });
  };

  const handlePatientChange = (field: keyof PatientInfo, value: any) => {
    const updated = {
      ...patient,
      [field]: value,
    };
    if (field === 'area') {
      updated.currentAddress = value;
    }
    updateData({
      patientInfo: updated,
    });
  };

  const copyReporterAddress = () => {
    const rep = reportData.reporterInfo;
    if (!rep) return;
    updateData({
      patientInfo: {
        ...patient,
        country: rep.country || rep.currentCountry || defaultCountry,
        state: rep.state || rep.currentState || '',
        district: rep.district || rep.currentDistrict || '',
        area: rep.currentArea || rep.currentAddress || '',
        currentAddress: rep.currentAddress || rep.currentArea || '',
        pinZip: rep.pinZip || rep.currentPin || '',
      },
    });
  };

  const isSelf = reportData.reporterType === 'Patient';

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-teal-600" />
          Patient Information & Demographics
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Details of the individual who experienced the suspected adverse drug reaction. Works for any country worldwide.
        </p>
      </div>

      {isSelf && (
        <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-teal-900">
          <span>You indicated you are reporting as the patient. You can auto-fill details from your reporter profile.</span>
          <button
            type="button"
            onClick={() => {
              const rep = reportData.reporterInfo;
              if (rep) {
                const repAge = rep.age || patient.age;
                let estDob = patient.dob;
                let isEst = patient.isDobEstimated;
                if (repAge && !estDob) {
                  const currentYear = new Date().getFullYear();
                  const estYear = currentYear - (parseInt(repAge, 10) || 0);
                  estDob = `${estYear}-01-01`;
                  isEst = true;
                }

                updateData({
                  patientInfo: {
                    ...patient,
                    fullName: rep.fullName || patient.fullName,
                    age: repAge,
                    dob: estDob,
                    isDobEstimated: isEst,
                    sex: (rep.gender as any) || patient.sex,
                    phoneCountryCode: rep.phoneCountryCode || patient.phoneCountryCode,
                    mobile: rep.mobile || patient.mobile,
                    country: rep.country || rep.currentCountry || defaultCountry,
                    state: rep.state || rep.currentState || '',
                    district: rep.district || rep.currentDistrict || '',
                    area: rep.currentArea || rep.currentAddress || '',
                    currentAddress: rep.currentAddress || rep.currentArea || '',
                    pinZip: rep.pinZip || rep.currentPin || '',
                  },
                });
              }
            }}
            className="px-3 py-1.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-xs shrink-0"
          >
            Copy All Reporter Details
          </button>
        </div>
      )}

      {/* Patient Core Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Patient Full Name or Initials *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. John Smith or Patient Initials (e.g. J.S.)"
            value={patient.fullName || ''}
            onChange={(e) => handlePatientChange('fullName', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Age Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Age at Time of Event (Years) <span className="text-rose-600">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-normal">
              {patient.dob && !patient.isDobEstimated ? '(From DOB)' : '(or enter DOB)'}
            </span>
          </div>
          <input
            type="number"
            min="0"
            max="125"
            required={!patient.dob}
            placeholder="e.g. 58"
            value={patient.age || ''}
            onChange={(e) => handleAgeChange(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
          {patient.dob && !patient.isDobEstimated && patient.age ? (
            <p className="text-[11px] text-teal-700 font-medium mt-1 flex items-center gap-1">
              <span>✓ Auto-calculated from Date of Birth ({patient.age} years old)</span>
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Entering age auto-estimates birth date as Jan 1 placeholder.
            </p>
          )}
        </div>

        {/* Date of Birth Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Date of Birth <span className="text-slate-400 font-normal">(Optional or Alternative to Age)</span>
            </label>
            {patient.isDobEstimated && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                Estimated (Jan 1)
              </span>
            )}
          </div>
          <input
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={patient.dob || ''}
            onChange={(e) => handleDobChange(e.target.value)}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm focus:ring-2 focus:ring-teal-500 ${
              dobError ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
            }`}
          />
          {dobError ? (
            <p className="text-[11px] text-rose-600 font-medium mt-1">{dobError}</p>
          ) : patient.isDobEstimated ? (
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Estimated placeholder (Jan 1). Edit to record exact birth date.
            </p>
          ) : patient.dob ? (
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              ✓ Exact Date of Birth recorded.
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-1">
              Selecting DOB auto-calculates patient age in years.
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Sex / Gender *
          </label>
          <select
            required
            value={patient.sex || ''}
            onChange={(e) => handlePatientChange('sex', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select Sex / Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        <div className="sm:col-span-2 md:col-span-1">
          <PhoneInputWithCountryCode
            id="patient-phone"
            label="Patient Mobile Number"
            required={false}
            countryCode={patient.phoneCountryCode || '+1'}
            phoneNumber={patient.mobile || ''}
            onCountryCodeChange={(code) => handlePatientChange('phoneCountryCode', code)}
            onPhoneNumberChange={(phone) => handlePatientChange('mobile', phone)}
            helperText="Calling code is independent from patient location address."
          />
        </div>
      </div>

      {/* Patient Location / Address Section */}
      <CascadingAddressGroup
        title="Patient Residential Location & Geography"
        icon="mappin"
        required={false}
        onCopyReporterAddress={copyReporterAddress}
        values={{
          country: patient.country || defaultCountry,
          state: patient.state || '',
          district: patient.district || '',
          area: patient.area || patient.currentAddress || '',
          pinZip: patient.pinZip || '',
        }}
        onChange={(addr) => {
          updateData({
            patientInfo: {
              ...patient,
              country: addr.country || defaultCountry,
              state: addr.state || '',
              district: addr.district || '',
              area: addr.area || '',
              currentAddress: addr.area || '',
              pinZip: addr.pinZip || '',
            },
          });
        }}
      />

      {/* Patient ID protection */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={patient.idNotAvailable}
            onChange={(e) => handlePatientChange('idNotAvailable', e.target.checked)}
            className="w-4 h-4 text-teal-600 rounded"
          />
          <span>Patient identification information is not available / Keep masked</span>
        </label>
        <p className="text-[11px] text-slate-500">
          Patient privacy is strictly safeguarded. Reports forwarded to regulatory bodies are de-identified conforming to ICH E2B international standards.
        </p>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// STEP 4: Patient Measurements & Clinical Details (Multi-Unit Height, Weight & Live BMI)
// ----------------------------------------------------
export const Step4Measurements: React.FC<StepProps> = ({ reportData, updateData }) => {
  const m: PatientMeasurements = reportData.patientMeasurements || {
    heightUnit: 'cm',
    height: '',
    heightCm: '',
    heightMeters: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    weightUnit: 'kg',
    pregnancyStatus: 'Not Applicable',
  };

  // State for active height unit tab
  const [activeHeightUnit, setActiveHeightUnit] = useState<'cm' | 'm' | 'ft-in'>(
    (m.heightUnit as any) || 'cm'
  );

  // Height conversion logic
  // Takes any input and calculates cm, meters, feet, inches
  const normalizeHeightToCm = (
    unit: 'cm' | 'm' | 'ft-in',
    val: string,
    feetVal?: string,
    inchesVal?: string
  ): number | null => {
    if (unit === 'cm') {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 ? num : null;
    }
    if (unit === 'm') {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0 ? num * 100 : null;
    }
    if (unit === 'ft-in') {
      const ft = parseFloat(feetVal || '0') || 0;
      const inch = parseFloat(inchesVal || '0') || 0;
      if (ft <= 0 && inch <= 0) return null;
      const totalInches = ft * 12 + inch;
      return totalInches * 2.54;
    }
    return null;
  };

  // Convert cm to other representations
  const getConvertedHeightValues = (cm: number | null) => {
    if (!cm || cm <= 0) {
      return { cmStr: '', mStr: '', ftStr: '', inStr: '', labelStr: '' };
    }
    const mVal = (cm / 100).toFixed(2);
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inRem = (totalInches % 12).toFixed(1);
    return {
      cmStr: cm.toFixed(1).replace(/\.0$/, ''),
      mStr: mVal,
      ftStr: ft.toString(),
      inStr: inRem.replace(/\.0$/, ''),
      labelStr: `${cm.toFixed(1).replace(/\.0$/, '')} cm  =  ${mVal} m  =  ${ft} ft ${inRem.replace(/\.0$/, '')} in`,
    };
  };

  // Helper to calculate BMI from normalized height in cm and weight
  const calculateBmiFromCmAndWeight = (
    cm: number | null,
    weightVal?: string,
    wUnit: 'kg' | 'lb' = 'kg'
  ) => {
    const w = parseFloat(weightVal || '');
    if (!cm || cm <= 0 || !w || w <= 0) return { bmi: '', category: '' };

    const heightM = cm / 100;
    const weightKg = wUnit === 'kg' ? w : w * 0.45359237;

    const bmiVal = weightKg / (heightM * heightM);
    const bmiFixed = bmiVal.toFixed(1);

    let cat = 'Normal weight';
    if (bmiVal < 18.5) cat = 'Underweight';
    else if (bmiVal >= 25 && bmiVal < 30) cat = 'Overweight';
    else if (bmiVal >= 30) cat = 'Obese';

    return { bmi: bmiFixed, category: cat };
  };

  // Current normalized cm
  const currentCm = normalizeHeightToCm(
    activeHeightUnit,
    m.height || '',
    m.heightFeet,
    m.heightInches
  );

  const converted = getConvertedHeightValues(currentCm);

  // Handle Height change from any input
  const handleHeightUpdate = (
    newUnit: 'cm' | 'm' | 'ft-in',
    rawVal: string,
    ftVal?: string,
    inVal?: string
  ) => {
    const cm = normalizeHeightToCm(newUnit, rawVal, ftVal, inVal);
    const conv = getConvertedHeightValues(cm);

    let mainHeight = rawVal;
    if (newUnit === 'ft-in') {
      mainHeight = `${ftVal || 0}' ${inVal || 0}"`;
    }

    const { bmi, category } = calculateBmiFromCmAndWeight(
      cm,
      m.weight,
      m.weightUnit || 'kg'
    );

    updateData({
      patientMeasurements: {
        ...m,
        heightUnit: newUnit,
        height: mainHeight,
        heightCm: conv.cmStr,
        heightMeters: conv.mStr,
        heightFeet: ftVal ?? conv.ftStr,
        heightInches: inVal ?? conv.inStr,
        bmi,
        bmiCategory: category,
      },
    });
  };

  // Switch active height unit tab with auto-fill
  const handleSwitchHeightUnit = (targetUnit: 'cm' | 'm' | 'ft-in') => {
    setActiveHeightUnit(targetUnit);
    if (currentCm) {
      const conv = getConvertedHeightValues(currentCm);
      let newHeight = conv.cmStr;
      if (targetUnit === 'm') newHeight = conv.mStr;
      if (targetUnit === 'ft-in') newHeight = `${conv.ftStr}' ${conv.inStr}"`;

      updateData({
        patientMeasurements: {
          ...m,
          heightUnit: targetUnit,
          height: newHeight,
          heightCm: conv.cmStr,
          heightMeters: conv.mStr,
          heightFeet: conv.ftStr,
          heightInches: conv.inStr,
        },
      });
    } else {
      updateData({
        patientMeasurements: {
          ...m,
          heightUnit: targetUnit,
        },
      });
    }
  };

  // Handle Weight change
  const handleWeightChange = (field: 'weight' | 'weightUnit', value: any) => {
    const nextWeight = field === 'weight' ? value : m.weight;
    const nextWeightUnit = field === 'weightUnit' ? value : m.weightUnit;

    const { bmi, category } = calculateBmiFromCmAndWeight(
      currentCm,
      nextWeight,
      nextWeightUnit
    );

    updateData({
      patientMeasurements: {
        ...m,
        [field]: value,
        bmi,
        bmiCategory: category,
      },
    });
  };

  // Weight conversion preview helper
  const getWeightConversionText = () => {
    const w = parseFloat(m.weight || '');
    if (!w || w <= 0) return null;
    if (m.weightUnit === 'kg') {
      const lb = (w * 2.20462).toFixed(1);
      return `${w} kg ≈ ${lb} lbs`;
    } else {
      const kg = (w * 0.453592).toFixed(1);
      return `${w} lbs ≈ ${kg} kg`;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          Patient Baseline Measurements & Clinical Profile
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Anthropometric measurements calculate body surface area, drug clearance, and dosage-to-weight correlation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Height Section with Multi-Unit Support & Live Conversion */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-teal-600" />
              <span>Height Measurement</span>
            </label>

            {/* Height Unit Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => handleSwitchHeightUnit('cm')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeHeightUnit === 'cm'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Centimeters (cm)
              </button>
              <button
                type="button"
                onClick={() => handleSwitchHeightUnit('m')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeHeightUnit === 'm'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Meters (m)
              </button>
              <button
                type="button"
                onClick={() => handleSwitchHeightUnit('ft-in')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeHeightUnit === 'ft-in'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Feet & Inches
              </button>
            </div>
          </div>

          {/* Unit Specific Input */}
          {activeHeightUnit === 'cm' && (
            <div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="280"
                  placeholder="e.g. 175"
                  value={m.heightCm || (m.heightUnit === 'cm' ? m.height : '') || ''}
                  onChange={(e) =>
                    handleHeightUpdate('cm', e.target.value, m.heightFeet, m.heightInches)
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 pr-12 text-slate-900 font-medium"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                  cm
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter height in centimeters (e.g. 175 cm).
              </p>
            </div>
          )}

          {activeHeightUnit === 'm' && (
            <div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.3"
                  max="2.8"
                  placeholder="e.g. 1.75"
                  value={m.heightMeters || (m.heightUnit === 'm' ? m.height : '') || ''}
                  onChange={(e) =>
                    handleHeightUpdate('m', e.target.value, m.heightFeet, m.heightInches)
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 pr-12 text-slate-900 font-medium"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                  m
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter height in meters (e.g. 1.75 m).
              </p>
            </div>
          )}

          {activeHeightUnit === 'ft-in' && (
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Feet (ft)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="8"
                      placeholder="e.g. 5"
                      value={m.heightFeet || ''}
                      onChange={(e) => {
                        const ftVal = e.target.value;
                        handleHeightUpdate('ft-in', '', ftVal, m.heightInches);
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 pr-12 text-slate-900 font-medium"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                      ft
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Inches (0 – 11 in)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      step="1"
                      placeholder="e.g. 9"
                      value={m.heightInches || ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') {
                          handleHeightUpdate('ft-in', '', m.heightFeet, '');
                          return;
                        }
                        const num = parseFloat(raw);
                        if (isNaN(num)) {
                          handleHeightUpdate('ft-in', '', m.heightFeet, '');
                          return;
                        }
                        // Limit inches strictly between 0 and 11
                        const clamped = Math.max(0, Math.min(11, num));
                        handleHeightUpdate('ft-in', '', m.heightFeet, clamped.toString());
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 pr-12 text-slate-900 font-medium"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                      in
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter height in feet and inches (inches restricted from 0 to 11).
              </p>
            </div>
          )}

          {/* Real-time Multi-Unit Conversion Card */}
          {currentCm ? (
            <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between text-[11px] font-bold text-teal-900">
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-teal-600 animate-spin-slow" />
                  Live Unit Equivalents
                </span>
                <span className="text-[10px] text-teal-700 font-normal">Auto-synchronized</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/80 p-1.5 rounded-lg border border-teal-100">
                  <span className="text-[10px] text-slate-400 block">Centimeters</span>
                  <span className="font-bold text-teal-950 font-mono">{converted.cmStr} cm</span>
                </div>
                <div className="bg-white/80 p-1.5 rounded-lg border border-teal-100">
                  <span className="text-[10px] text-slate-400 block">Meters</span>
                  <span className="font-bold text-teal-950 font-mono">{converted.mStr} m</span>
                </div>
                <div className="bg-white/80 p-1.5 rounded-lg border border-teal-100">
                  <span className="text-[10px] text-slate-400 block">Feet & Inches</span>
                  <span className="font-bold text-teal-950 font-mono">{converted.ftStr}' {converted.inStr}"</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-[11px] text-slate-400 text-center">
              Enter height above to see live conversion in cm, meters, and feet & inches.
            </div>
          )}
        </div>

        {/* Weight Section */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Weight Measurement</span>
          </label>

          <div>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="1"
                max="500"
                placeholder={m.weightUnit === 'kg' ? 'e.g. 70' : 'e.g. 154'}
                value={m.weight || ''}
                onChange={(e) => handleWeightChange('weight', e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
              />
              <select
                value={m.weightUnit || 'kg'}
                onChange={(e) => handleWeightChange('weightUnit', e.target.value)}
                className="w-28 px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-teal-500"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lb">Pounds (lbs)</option>
              </select>
            </div>

            {getWeightConversionText() && (
              <p className="text-[11px] text-teal-700 font-medium mt-1.5">
                Conversion: {getWeightConversionText()}
              </p>
            )}
          </div>

          {/* Automatic BMI Display Card */}
          {m.bmi ? (
            <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-xs">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                    Calculated Body Mass Index (BMI)
                  </span>
                  <div className="text-xl font-extrabold text-teal-950 font-mono">
                    {m.bmi} <span className="text-xs font-normal text-teal-700">kg/m²</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    m.bmiCategory === 'Normal weight'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : m.bmiCategory === 'Overweight'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : m.bmiCategory === 'Obese'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {m.bmiCategory}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">WHO Classification</span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 text-center italic">
              Enter both height and weight to automatically compute Body Mass Index (BMI).
            </div>
          )}
        </div>
      </div>

      {/* Pregnancy Status & Lab Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Pregnancy Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pregnancy Status <span className="text-slate-400 font-normal">(Where applicable)</span>
          </label>
          <select
            value={m.pregnancyStatus || 'Not Applicable'}
            onChange={(e) =>
              updateData({
                patientMeasurements: {
                  ...m,
                  pregnancyStatus: e.target.value as any,
                },
              })
            }
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          >
            <option value="Not Applicable">Not Applicable</option>
            <option value="Not Pregnant">Not Pregnant</option>
            <option value="Pregnant - 1st Trimester">Pregnant - 1st Trimester</option>
            <option value="Pregnant - 2nd Trimester">Pregnant - 2nd Trimester</option>
            <option value="Pregnant - 3rd Trimester">Pregnant - 3rd Trimester</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        {/* Relevant Lab Values */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Relevant Laboratory & Diagnostic Values <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Liver function tests (ALT: 142 U/L, AST: 110 U/L), Serum Creatinine (1.8 mg/dL), eGFR (45 mL/min), Potassium (5.2 mmol/L), ECG QT Interval..."
            value={m.relevantLabValues || ''}
            onChange={(e) =>
              updateData({
                patientMeasurements: {
                  ...m,
                  relevantLabValues: e.target.value,
                },
              })
            }
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// STEP 5: Suspected Medication (Dynamic Multi-Drug)
// ----------------------------------------------------
export const Step5Medication: React.FC<StepProps> = ({ reportData, updateData }) => {
  const medications = reportData.suspectedMedications || [];

  const handleAddMedication = () => {
    const newMed: SuspectedMedication = {
      id: `med_${Date.now()}`,
      brandName: '',
      stillTaking: false,
      detailsUnknown: false,
    };
    updateData({ suspectedMedications: [...medications, newMed] });
  };

  const handleRemoveMedication = (id: string) => {
    updateData({ suspectedMedications: medications.filter((m) => m.id !== id) });
  };

  const handleMedChange = (id: string, field: keyof SuspectedMedication, value: any) => {
    const updated = medications.map((m) => (m.id === id ? { ...m, [field]: value } : m));
    updateData({ suspectedMedications: updated });
  };

  // Ensure at least one medication exists
  if (medications.length === 0) {
    handleAddMedication();
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            Suspected Medication(s)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Specify the medication(s) you suspect may be associated with the adverse reaction.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddMedication}
          className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Another Medicine</span>
        </button>
      </div>

      <div className="space-y-6">
        {medications.map((med, index) => (
          <div
            key={med.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 relative"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
                Suspected Medicine #{index + 1}
              </span>
              {medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(med.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brand / Trade Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiovent Plus"
                  value={med.brandName || ''}
                  onChange={(e) => handleMedChange(med.id, 'brandName', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Generic / Active Ingredient <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Atorvastatin + Ezetimibe"
                  value={med.genericName || ''}
                  onChange={(e) => handleMedChange(med.id, 'genericName', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Strength <span className="text-slate-400 font-normal">(e.g. 40mg / 10mg)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 40mg"
                  value={med.strength || ''}
                  onChange={(e) => handleMedChange(med.id, 'strength', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dosage Form
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tablet, Capsule, Injection, Inhaler, Cream"
                  value={med.dosageForm || ''}
                  onChange={(e) => handleMedChange(med.id, 'dosageForm', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dose Taken
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 tablet, 2 puffs"
                  value={med.dose || ''}
                  onChange={(e) => handleMedChange(med.id, 'dose', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Route of Administration
                </label>
                <select
                  value={med.route || 'Oral'}
                  onChange={(e) => handleMedChange(med.id, 'route', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Oral">Oral (by mouth)</option>
                  <option value="Intravenous (IV)">Intravenous (IV)</option>
                  <option value="Intramuscular (IM)">Intramuscular (IM)</option>
                  <option value="Subcutaneous (SC)">Subcutaneous (SC)</option>
                  <option value="Inhalation">Inhalation</option>
                  <option value="Topical">Topical (Skin)</option>
                  <option value="Ophthalmic">Ophthalmic (Eye)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Frequency
                </label>
                <input
                  type="text"
                  placeholder="e.g. Once daily at bedtime, Twice daily"
                  value={med.frequency || ''}
                  onChange={(e) => handleMedChange(med.id, 'frequency', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={med.startDate || ''}
                  onChange={(e) => handleMedChange(med.id, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stop Date <span className="text-slate-400 font-normal">(If stopped)</span>
                </label>
                <input
                  type="date"
                  disabled={med.stillTaking}
                  value={med.stopDate || ''}
                  onChange={(e) => handleMedChange(med.id, 'stopDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 disabled:bg-slate-100"
                />
                <label className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={med.stillTaking || false}
                    onChange={(e) => handleMedChange(med.id, 'stillTaking', e.target.checked)}
                    className="w-3.5 h-3.5 text-teal-600 rounded"
                  />
                  <span>Still taking this medication</span>
                </label>
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Indication / Reason for Use
                </label>
                <input
                  type="text"
                  placeholder="e.g. High cholesterol, Hypertension, Joint pain"
                  value={med.indication || ''}
                  onChange={(e) => handleMedChange(med.id, 'indication', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Manufacturer / Brand Holder <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. PharmaCore Therapeutics"
                  value={med.manufacturer || ''}
                  onChange={(e) => handleMedChange(med.id, 'manufacturer', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Batch / Lot Number <span className="text-slate-400 font-normal">(Found on package)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CVT-2026-981A"
                  value={med.batchLotNumber || ''}
                  onChange={(e) => handleMedChange(med.id, 'batchLotNumber', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expiry Date <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={med.expiryDate || ''}
                  onChange={(e) => handleMedChange(med.id, 'expiryDate', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={med.detailsUnknown || false}
                  onChange={(e) => handleMedChange(med.id, 'detailsUnknown', e.target.checked)}
                  className="w-3.5 h-3.5 text-teal-600 rounded"
                />
                <span>I don't know some of these details (Batch / Manufacturer)</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// STEP 6: Adverse Event Details
// ----------------------------------------------------
export const Step6AdverseEvent: React.FC<StepProps> = ({ reportData, updateData }) => {
  const ae = reportData.adverseEvent || {
    description: '',
    reactionTerms: '',
    startDate: '',
    ongoing: false,
    severity: 'Moderate',
    treatmentReceived: '',
    hospitalization: 'No',
    outcome: 'Unknown',
  };

  const handleAeChange = (field: string, value: any) => {
    updateData({
      adverseEvent: {
        ...ae,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          Adverse Event Details
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Describe the symptoms and reactions experienced in as much detail as possible.
        </p>
      </div>

      <div className="space-y-4">
        {/* Own Words Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Describe what happened in your own words *
          </label>
          <textarea
            rows={4}
            required
            placeholder="Please detail the sequence of symptoms, how severe they were, what body parts were affected, and how you felt..."
            value={ae.description || ''}
            onChange={(e) => handleAeChange('description', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 leading-relaxed"
          />
        </div>

        {/* Reaction Terms */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Adverse Event / Reaction Term(s) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Severe muscle weakness, Dark urine, Swollen tongue, Skin rash"
            value={ae.reactionTerms || ''}
            onChange={(e) => handleAeChange('reactionTerms', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date Event Started *
            </label>
            <input
              type="date"
              required
              value={ae.startDate || ''}
              onChange={(e) => handleAeChange('startDate', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date Event Ended <span className="text-slate-400 font-normal">(If resolved)</span>
            </label>
            <input
              type="date"
              disabled={ae.ongoing}
              value={ae.endDate || ''}
              onChange={(e) => handleAeChange('endDate', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 disabled:bg-slate-100"
            />
            <label className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={ae.ongoing || false}
                onChange={(e) => handleAeChange('ongoing', e.target.checked)}
                className="w-3.5 h-3.5 text-teal-600 rounded"
              />
              <span>Event / symptoms still ongoing</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Time of Onset <span className="text-slate-400 font-normal">(e.g. 2 hours after dose)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 30 minutes / 3 weeks after dose"
              value={ae.timeOfOnset || ''}
              onChange={(e) => handleAeChange('timeOfOnset', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Severity *
            </label>
            <select
              value={ae.severity || 'Moderate'}
              onChange={(e) => handleAeChange('severity', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 font-medium"
            >
              <option value="Mild">Mild (Did not interfere with normal activities)</option>
              <option value="Moderate">Moderate (Interfered with normal activities)</option>
              <option value="Severe">Severe (Incapacitating, required urgent attention)</option>
              <option value="Life-Threatening">Life-Threatening (Immediate risk of death)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hospitalization Required? *
            </label>
            <select
              value={ae.hospitalization || 'No'}
              onChange={(e) => handleAeChange('hospitalization', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
            >
              <option value="No">No</option>
              <option value="Yes - Hospitalized">Yes - Initial Inpatient Hospitalization</option>
              <option value="Yes - Prolonged Hospitalization">Yes - Prolonged Existing Hospitalization</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Outcome of Adverse Event *
            </label>
            <select
              value={ae.outcome || 'Recovering'}
              onChange={(e) => handleAeChange('outcome', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 font-semibold"
            >
              <option value="Recovered">Recovered (Fully resolved)</option>
              <option value="Recovering">Recovering (Improving)</option>
              <option value="Not Recovered">Not Recovered (Symptoms persist unchanged)</option>
              <option value="Recovered with Sequelae">Recovered with Sequelae (Permanent residual effect)</option>
              <option value="Fatal">Fatal (Resulted in death)</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Treatment Received for this Adverse Event
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Discontinued suspect medicine, given IV fluids, epinephrine, antihistamines, oxygen..."
            value={ae.treatmentReceived || ''}
            onChange={(e) => handleAeChange('treatmentReceived', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// STEP 7: Event Timeline
// ----------------------------------------------------
export const Step7Timeline: React.FC<StepProps> = ({ reportData, updateData }) => {
  const timeline = reportData.timeline || [];

  // Function to automatically assemble timeline from entered data
  const handleAutoGenerate = () => {
    const events: TimelineEvent[] = [];
    const suspected = reportData.suspectedMedications || [];
    const ae = reportData.adverseEvent;

    // 1. Medication Started
    suspected.forEach((m, idx) => {
      if (m.startDate) {
        events.push({
          id: `tl_med_start_${idx}`,
          stage: 'Medication Started',
          date: m.startDate,
          title: `Started ${m.brandName || 'Suspected Drug'} (${m.dose || m.strength || ''})`,
          description: `Route: ${m.route || 'Oral'}, Frequency: ${m.frequency || 'N/A'} for ${m.indication || 'treatment'}.`,
        });
      }
    });

    // 2. Symptoms Appeared
    if (ae?.startDate) {
      events.push({
        id: 'tl_symptoms',
        stage: 'Symptoms Appeared',
        date: ae.startDate,
        time: ae.timeOfOnset,
        title: `Onset of symptoms: ${ae.reactionTerms || 'Adverse Event'}`,
        description: ae.description || 'Symptoms first noted.',
      });
    }

    // 3. Medication Stopped
    suspected.forEach((m, idx) => {
      if (m.stopDate) {
        events.push({
          id: `tl_med_stop_${idx}`,
          stage: 'Medication Stopped/Continued',
          date: m.stopDate,
          title: `Discontinued ${m.brandName}`,
          description: 'Medication halted following adverse reaction.',
        });
      }
    });

    // 4. Medical Treatment
    if (ae?.treatmentReceived) {
      events.push({
        id: 'tl_treatment',
        stage: 'Medical Treatment',
        date: ae.startDate,
        title: `Medical Treatment Received (${ae.hospitalization === 'No' ? 'Outpatient' : 'Hospitalized'})`,
        description: ae.treatmentReceived,
      });
    }

    // 5. Current Outcome
    if (ae?.outcome) {
      events.push({
        id: 'tl_outcome',
        stage: 'Current Outcome',
        date: ae.endDate || new Date().toISOString().slice(0, 10),
        title: `Outcome: ${ae.outcome}`,
        description: `Current clinical status: ${ae.ongoing ? 'Ongoing' : 'Resolved'}.`,
      });
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    updateData({ timeline: events });
  };

  const handleRemoveMilestone = (id: string) => {
    updateData({ timeline: timeline.filter((t) => t.id !== id) });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Visual Clinical Event Timeline
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Chronological reconstruction of drug initiation, symptom onset, treatment, and outcome.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoGenerate}
          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <span>Auto-Generate from Dates</span>
        </button>
      </div>

      <VisualTimeline
        timeline={timeline}
        onRemoveEvent={handleRemoveMilestone}
        isEditable={true}
      />
    </div>
  );
};

// ----------------------------------------------------
// STEP 8: Medical History
// ----------------------------------------------------
export const Step8MedicalHistory: React.FC<StepProps> = ({ reportData, updateData }) => {
  const mh = reportData.medicalHistory || {};

  const handleMhChange = (field: string, value: string) => {
    updateData({
      medicalHistory: {
        ...mh,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          Patient Medical History
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Underlying illnesses, previous drug sensitivities, and surgical history help assess pre-existing risk factors.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Existing Medical Conditions <span className="text-slate-400 font-normal">(e.g. Diabetes, Hypertension, Asthma, Kidney disease)</span>
          </label>
          <textarea
            rows={2}
            placeholder="List any chronic or pre-existing medical conditions..."
            value={mh.existingConditions || ''}
            onChange={(e) => handleMhChange('existingConditions', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Known Drug Allergies & Hypersensitivities
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Penicillin rash, Sulfa allergy, or 'No Known Drug Allergies (NKDA)'"
            value={mh.allergies || ''}
            onChange={(e) => handleMhChange('allergies', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Previous Adverse Drug Reactions (ADRs)
          </label>
          <textarea
            rows={2}
            placeholder="Has the patient experienced side effects to other medications in the past?"
            value={mh.pastAdverseReactions || ''}
            onChange={(e) => handleMhChange('pastAdverseReactions', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Previous Surgeries or Major Procedures
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Coronary stent (2024), Appendectomy (2018)..."
            value={mh.previousSurgeries || ''}
            onChange={(e) => handleMhChange('previousSurgeries', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Other Relevant Clinical Information <span className="text-slate-400 font-normal">(Lifestyle, Diet, Smoking, Alcohol)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Any other pertinent background or family history..."
            value={mh.relevantHistory || ''}
            onChange={(e) => handleMhChange('relevantHistory', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// STEP 9: Concomitant Medications
// ----------------------------------------------------
export const Step9ConcomitantMeds: React.FC<StepProps> = ({ reportData, updateData }) => {
  const concomitants = reportData.concomitantMedications || [];
  const noOtherMeds = reportData.hasNoConcomitantMeds ?? (concomitants.length === 0);

  const handleAddConcomitant = () => {
    const newMed: ConcomitantMedication = {
      id: `con_${Date.now()}`,
      brandName: '',
      stillTaking: true,
    };
    updateData({
      concomitantMedications: [...concomitants, newMed],
      hasNoConcomitantMeds: false,
    });
  };

  const handleRemoveConcomitant = (id: string) => {
    updateData({
      concomitantMedications: concomitants.filter((c) => c.id !== id),
    });
  };

  const handleConChange = (id: string, field: keyof ConcomitantMedication, value: any) => {
    const updated = concomitants.map((c) => (c.id === id ? { ...c, [field]: value } : c));
    updateData({ concomitantMedications: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            Other Medicines / Concomitant Medications
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Any other prescription, over-the-counter (OTC), herbal, or dietary supplements taken concurrently.
          </p>
        </div>
      </div>

      {/* No other medicines checkbox */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
          <input
            type="checkbox"
            checked={noOtherMeds}
            onChange={(e) => {
              updateData({
                hasNoConcomitantMeds: e.target.checked,
                concomitantMedications: e.target.checked ? [] : concomitants,
              });
            }}
            className="w-4 h-4 text-teal-600 rounded"
          />
          <span>No other medicines were taken at the time of the event</span>
        </label>
      </div>

      {!noOtherMeds && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddConcomitant}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Concomitant Medicine</span>
            </button>
          </div>

          {concomitants.map((med, idx) => (
            <div
              key={med.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Medicine #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveConcomitant(med.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Medicine / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Metoprolol"
                    value={med.brandName || ''}
                    onChange={(e) => handleConChange(med.id, 'brandName', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Dose & Frequency
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 50mg Once daily"
                    value={med.dose || ''}
                    onChange={(e) => handleConChange(med.id, 'dose', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Reason for Use
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Blood pressure"
                    value={med.reasonForUse || ''}
                    onChange={(e) => handleConChange(med.id, 'reasonForUse', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// STEP 10: Seriousness Criteria (ICH Regulatory Criteria)
// ----------------------------------------------------
export const Step10Seriousness: React.FC<StepProps> = ({ reportData, updateData }) => {
  const ser = reportData.seriousness || {
    death: false,
    lifeThreatening: false,
    hospitalization: false,
    prolongationHospitalization: false,
    disability: false,
    congenitalAnomaly: false,
    otherMedicallyImportant: false,
    noneOfTheAbove: false,
    unknown: false,
  };

  const handleToggle = (key: keyof typeof ser) => {
    if (key === 'noneOfTheAbove') {
      updateData({
        seriousness: {
          death: false,
          lifeThreatening: false,
          hospitalization: false,
          prolongationHospitalization: false,
          disability: false,
          congenitalAnomaly: false,
          otherMedicallyImportant: false,
          unknown: false,
          noneOfTheAbove: !ser.noneOfTheAbove,
          details: ser.details,
        },
      });
    } else {
      updateData({
        seriousness: {
          ...ser,
          [key]: !ser[key],
          noneOfTheAbove: false,
        },
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          Seriousness Information (Regulatory Criteria)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Select any regulatory seriousness criteria that apply according to ICH E2A/E2B standards.
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Pharmacovigilance Note:</strong> Criteria selected here help determine expedited regulatory reporting timelines. Final medical seriousness is independently verified by qualified safety reviewers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { key: 'death', label: 'Results in Death', desc: 'Patient died as a direct or contributing result.' },
          { key: 'lifeThreatening', label: 'Life-Threatening', desc: 'Patient was at immediate risk of death at the time of the event.' },
          { key: 'hospitalization', label: 'Requires Inpatient Hospitalization', desc: 'Caused admission to hospital for acute management.' },
          { key: 'prolongationHospitalization', label: 'Prolongs Existing Hospitalization', desc: 'Extended duration of an already ongoing inpatient stay.' },
          { key: 'disability', label: 'Persistent or Significant Disability / Incapacity', desc: 'Substantial disruption of ability to conduct normal life functions.' },
          { key: 'congenitalAnomaly', label: 'Congenital Anomaly / Birth Defect', desc: 'Adverse outcome observed in an offspring.' },
          { key: 'otherMedicallyImportant', label: 'Other Medically Important Condition', desc: 'May jeopardize patient or require intervention to prevent other outcomes.' },
          { key: 'noneOfTheAbove', label: 'None of the above (Non-serious)', desc: 'Mild/moderate adverse reaction with no life-threatening or hospitalizing criteria.' },
        ].map((item) => {
          const isChecked = (ser as any)[item.key];
          return (
            <label
              key={item.key}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                isChecked
                  ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/20 text-rose-950'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(item.key as any)}
                className="w-4 h-4 text-rose-600 rounded mt-0.5"
              />
              <div>
                <p className="text-xs font-bold">{item.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </label>
          );
        })}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Additional Seriousness Details <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <textarea
          rows={2}
          placeholder="Clarify hospital admission date, ICU admission, or medical intervention required..."
          value={ser.details || ''}
          onChange={(e) => updateData({ seriousness: { ...ser, details: e.target.value } })}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// STEP 11: Reporter Opinion
// ----------------------------------------------------
export const Step11ReporterOpinion: React.FC<StepProps> = ({ reportData, updateData }) => {
  const ro = reportData.reporterOpinion || { relatedToMedication: '' };

  const options = ['Yes', 'No', 'Not sure', 'Prefer not to say'];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          Reporter Opinion
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Your personal impression regarding the connection between the medication and the event.
        </p>
      </div>

      {/* Critical Pharmacovigilance Principle Banner */}
      <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-950 space-y-1.5">
        <p className="font-bold flex items-center gap-1.5">
          <Info className="w-4 h-4 text-teal-600" />
          Pharmacovigilance Causality Principle:
        </p>
        <p className="text-teal-800 leading-relaxed">
          The reporter's opinion is documented as your subjective viewpoint and does not constitute a definitive medical or legal verdict of causality. Professional pharmacovigilance causality assessment is conducted separately by safety reviewers using validated scientific scales.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Do you think the adverse event may be related to the medication? *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {options.map((opt) => {
              const isSelected = ro.relatedToMedication === opt;
              return (
                <label
                  key={opt}
                  className={`p-3.5 rounded-xl border text-center cursor-pointer font-semibold text-xs transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50 text-teal-950 ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="reporterOpinion"
                    value={opt}
                    checked={isSelected}
                    onChange={() =>
                      updateData({
                        reporterOpinion: { ...ro, relatedToMedication: opt as any },
                      })
                    }
                    className="sr-only"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Please explain your opinion <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Symptoms started shortly after taking the pill, and resolved after stopping..."
            value={ro.explanation || ''}
            onChange={(e) =>
              updateData({
                reporterOpinion: { ...ro, explanation: e.target.value },
              })
            }
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// STEP 12: Supporting Documents
// ----------------------------------------------------
export const Step12SupportingDocs: React.FC<StepProps> = ({ reportData, updateData }) => {
  const docs = reportData.supportingDocuments || [];
  const [docType, setDocType] = useState<SupportingDocument['type']>('Prescription');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: SupportingDocument[] = Array.from(files).map((f: File) => ({
      id: `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: f.name,
      type: docType,
      size: f.size,
      dateUploaded: new Date().toISOString(),
      notes: `${docType} uploaded by reporter.`,
    }));

    updateData({
      supportingDocuments: [...docs, ...fileList],
    });
  };

  const handleRemoveDoc = (id: string) => {
    updateData({
      supportingDocuments: docs.filter((d) => d.id !== id),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-5 h-5 text-teal-600" />
          Supporting Documents (Optional)
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Attach relevant documents such as prescriptions, laboratory reports, discharge summaries, or medication packaging photos.
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong>Privacy Safeguard:</strong> Please do not upload unnecessary personal or financial information. Ensure only clinically relevant medical records or packaging photographs are uploaded.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-4">
        <div className="max-w-xs mx-auto">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Document Category
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as any)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
          >
            <option value="Prescription">Prescription</option>
            <option value="Laboratory report">Laboratory report</option>
            <option value="Discharge summary">Discharge summary</option>
            <option value="Medication package/photo">Medication package / photo</option>
            <option value="Relevant medical document">Relevant medical document</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
            <Upload className="w-4 h-4" />
            <span>Select File(s) to Upload</span>
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>
          <p className="text-[11px] text-slate-400 mt-2">
            Supported formats: PDF, PNG, JPG, JPEG, DOCX (Max 10MB per file)
          </p>
        </div>
      </div>

      {/* Uploaded Documents List */}
      {docs.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Uploaded Files ({docs.length})
          </p>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <div>
                    <p className="font-semibold text-slate-800">{doc.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {doc.type} • {(doc.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDoc(doc.id)}
                  className="text-rose-600 hover:text-rose-800 p-1"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// STEP 13: Consent & Privacy
// ----------------------------------------------------
export const Step13Consent: React.FC<StepProps> = ({ reportData, updateData }) => {
  const consent = reportData.consent || {
    accurateConfirmation: false,
    understandPvReview: false,
    consentContact: false,
    readPrivacyNotice: false,
    timestamp: new Date().toISOString(),
    consentVersion: 'v2026.1',
  };

  const handleToggleConsent = (field: keyof typeof consent) => {
    updateData({
      consent: {
        ...consent,
        [field]: !consent[field],
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-teal-600" />
          Consent & Privacy Affirmations
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Please review and check each affirmation before submitting your adverse event report.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        {[
          {
            key: 'accurateConfirmation',
            label: 'I confirm that the information provided is accurate to the best of my knowledge.',
          },
          {
            key: 'understandPvReview',
            label: 'I understand that this report may be reviewed and evaluated by pharmacovigilance professionals.',
          },
          {
            key: 'consentContact',
            label: 'I consent to being contacted by pharmacovigilance safety personnel for additional clinical clarification if required.',
          },
          {
            key: 'readPrivacyNotice',
            label: 'I have read and understood the SafeMeds PV Privacy Notice and understand my data will be handled securely.',
          },
        ].map((item) => {
          const isChecked = (consent as any)[item.key];
          return (
            <label
              key={item.key}
              className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                isChecked
                  ? 'border-teal-500 bg-teal-50/50 text-teal-950 font-medium'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                required
                checked={isChecked}
                onChange={() => handleToggleConsent(item.key as any)}
                className="w-4 h-4 text-teal-600 rounded mt-0.5 focus:ring-teal-500"
              />
              <span className="text-xs sm:text-sm leading-relaxed">{item.label}</span>
            </label>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
        <span>Recorded Protocol Version: <strong>{consent.consentVersion}</strong></span>
        <span>Secure Timestamp: <strong>{new Date().toLocaleDateString()}</strong></span>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// STEP 14: Review & Final Confirmation
// ----------------------------------------------------
export const Step14Review: React.FC<StepProps> = ({ reportData, onJumpToStep }) => {
  const jump = (stepNum: number) => {
    if (onJumpToStep) onJumpToStep(stepNum);
  };

  const rep = reportData.reporterInfo;
  const phys = reportData.physicianInfo;
  const pat = reportData.patientInfo;
  const meas = reportData.patientMeasurements;
  const meds = reportData.suspectedMedications || [];
  const ae = reportData.adverseEvent;
  const ser = reportData.seriousness;
  const ro = reportData.reporterOpinion;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="border-b border-slate-200 pb-4">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-teal-600" />
          Review Your Adverse Event Report
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Please review all sections carefully. Click <strong>Edit</strong> beside any section to make adjustments before final submission.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        {/* Section 1: Reporter */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>1. Reporter Information</span>
              <span className="text-[11px] font-normal text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {reportData.reporterType}
              </span>
            </h4>
            <button
              type="button"
              onClick={() => jump(1)}
              className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-slate-600 pt-1">
            <p><strong>Name:</strong> {rep?.fullName || 'N/A'}</p>
            <p><strong>Email:</strong> {rep?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {rep?.phoneCountryCode ? `${rep.phoneCountryCode} ` : ''}{rep?.mobile || 'N/A'}</p>
            <p><strong>Country:</strong> {rep?.country || rep?.currentCountry || 'N/A'}</p>
            <p><strong>Current Address:</strong> {rep?.currentArea || rep?.currentAddress || 'N/A'}</p>
            <p><strong>State, District & PIN:</strong> {[rep?.currentState || rep?.state, rep?.currentDistrict || rep?.district, rep?.currentPin || rep?.pinZip].filter(Boolean).join(', ') || 'N/A'}</p>
            <p className="sm:col-span-2 lg:col-span-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
              <strong>Permanent Address:</strong> {rep?.permanentSameAsCurrent !== false ? 'Same as Current Address' : `${rep?.permanentArea || rep?.permanentAddress || ''}, ${[rep?.permanentState, rep?.permanentDistrict, rep?.permanentPin, rep?.permanentCountry].filter(Boolean).join(', ')}`}
            </p>
          </div>
        </div>

        {/* Section 2: Physician */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">2. Physician / Healthcare Professional</h4>
            <button
              type="button"
              onClick={() => jump(2)}
              className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-slate-600">
            <strong>Physician:</strong> {phys?.fullName || 'Not provided / N/A'}
            {phys?.institutionName ? ` (${phys.institutionName})` : ''}
          </p>
        </div>

        {/* Section 3 & 4: Patient & Measurements */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">3 & 4. Patient Information & Measurements</h4>
            <button
              type="button"
              onClick={() => jump(3)}
              className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 pt-1">
            <p><strong>Patient Name:</strong> {pat?.fullName || 'N/A'}</p>
            <p>
              <strong>Age & Sex:</strong> {pat?.age || 'N/A'} yrs • {pat?.sex || 'N/A'}
              {pat?.dob ? (
                <span className="block text-[11px] text-slate-500 font-normal">
                  DOB: {pat.dob} {pat.isDobEstimated ? '(Estimated)' : ''}
                </span>
              ) : null}
            </p>
            <p><strong>Location:</strong> {[pat?.state, pat?.country].filter(Boolean).join(', ') || 'N/A'}</p>
            <p><strong>BMI:</strong> {meas?.bmi ? `${meas.bmi} kg/m² (${meas.bmiCategory})` : 'N/A'}</p>
          </div>
        </div>

        {/* Section 5: Suspected Medication */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">5. Suspected Medication(s)</h4>
            <button
              type="button"
              onClick={() => jump(5)}
              className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2">
            {meds.map((m, idx) => (
              <div key={m.id || idx} className="p-2.5 bg-slate-50 rounded-xl text-slate-700 space-y-1">
                <p className="font-bold text-teal-900">{m.brandName} {m.strength && `(${m.strength})`}</p>
                <p className="text-[11px]">
                  Dose: {m.dose || 'N/A'} • Route: {m.route || 'Oral'} • Started: {m.startDate} {m.stopDate ? `to ${m.stopDate}` : '(Ongoing)'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Adverse Event Details */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">6. Adverse Event Details</h4>
            <button
              type="button"
              onClick={() => jump(6)}
              className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="space-y-1 text-slate-600">
            <p><strong>Reaction Term(s):</strong> <span className="font-semibold text-rose-700">{ae?.reactionTerms}</span></p>
            <p><strong>Description:</strong> {ae?.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <p><strong>Onset Date:</strong> {ae?.startDate}</p>
              <p><strong>Severity:</strong> {ae?.severity}</p>
              <p><strong>Outcome:</strong> <span className="font-semibold text-teal-800">{ae?.outcome}</span></p>
            </div>
          </div>
        </div>

        {/* Section 10: Seriousness */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">10. Seriousness Criteria</h4>
            <button
              type="button"
              onClick={() => jump(10)}
              className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-slate-700 font-medium">
            {ser?.noneOfTheAbove ? 'Non-Serious Adverse Event' : 'Serious Adverse Event criteria reported'}
          </p>
        </div>

        {/* Section 11: Reporter Opinion */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-slate-900 text-sm">11. Reporter Opinion</h4>
            <button
              type="button"
              onClick={() => jump(11)}
              className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-slate-600">
            <strong>Do you think medication caused event?</strong> {ro?.relatedToMedication || 'N/A'}
            {ro?.explanation ? ` — "${ro.explanation}"` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
