import { ReporterType } from '../types';

export interface ReporterProfile {
  id: string;
  fullName: string;
  phoneCountryCode: string;
  mobile: string;
  phoneNormalized: string;
  email: string;
  reporterType: ReporterType;
  age?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | '';
  // Address
  country?: string;
  state?: string;
  district?: string;
  area?: string;
  currentAddress?: string;
  pinZip?: string;
  permanentSameAsCurrent?: boolean;
  permanentCountry?: string;
  permanentState?: string;
  permanentDistrict?: string;
  permanentArea?: string;
  permanentAddress?: string;
  permanentPin?: string;
  // Professional details
  qualification?: string;
  specialization?: string;
  institutionName?: string;
  department?: string;
  regNumber?: string;
  idType?: string;
  idNumber?: string;
  idNotAvailable?: boolean;
  registeredAt: string;
  lastLoginAt: string;
}

const REGISTRY_STORAGE_KEY = 'safemeds_registered_reporters_registry_v1';
const SESSION_STORAGE_KEY = 'safemeds_active_reporter_session_v1';

export const normalizePhoneNumber = (code: string, num: string): string => {
  const codeDigits = (code || '').replace(/\D/g, '');
  const numDigits = (num || '').replace(/\D/g, '');
  return `${codeDigits}${numDigits}`;
};

// Seed demo registered reporters
export const DEMO_REGISTERED_REPORTERS: ReporterProfile[] = [
  {
    id: 'rep_prof_001',
    fullName: 'Dr. Arthur Davis',
    phoneCountryCode: '+1',
    mobile: '(555) 342-8901',
    phoneNormalized: '15553428901',
    email: 'dr.davis@stjude-hospital-demo.org',
    reporterType: 'Doctor / Healthcare Professional',
    age: '48',
    gender: 'Male',
    country: 'United States',
    state: 'Illinois',
    district: 'Cook County',
    area: 'Downtown Medical District',
    currentAddress: '450 Healthcare Boulevard, Suite 300',
    pinZip: '60611',
    permanentSameAsCurrent: true,
    qualification: 'MD, FACC',
    specialization: 'Cardiovascular Medicine',
    institutionName: 'Metro General Hospital',
    department: 'Department of Cardiology',
    regNumber: 'IL-MD-992384',
    idType: 'Medical License ID',
    idNumber: 'IL-MD-992384',
    idNotAvailable: false,
    registeredAt: '2026-08-20T10:00:00Z',
    lastLoginAt: '2026-08-30T09:15:00Z',
  },
  {
    id: 'rep_prof_002',
    fullName: 'Jane Doe',
    phoneCountryCode: '+1',
    mobile: '(555) 782-1109',
    phoneNormalized: '15557821109',
    email: 'jane.patient@example-demo.com',
    reporterType: 'Patient',
    age: '34',
    gender: 'Female',
    country: 'United States',
    state: 'Illinois',
    district: 'Cook County',
    area: 'Lakeview Area',
    currentAddress: '124 Lakeview Terrace, Apt 4B',
    pinZip: '60614',
    permanentSameAsCurrent: true,
    idNotAvailable: true,
    registeredAt: '2026-08-22T14:30:00Z',
    lastLoginAt: '2026-08-29T16:00:00Z',
  },
];

export const getRegisteredReporters = (): ReporterProfile[] => {
  try {
    const saved = localStorage.getItem(REGISTRY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load registered reporters:', e);
  }
  // Initialize default demo reporters
  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(DEMO_REGISTERED_REPORTERS));
  } catch (e) {}
  return DEMO_REGISTERED_REPORTERS;
};

export const saveRegisteredReporters = (list: ReporterProfile[]): void => {
  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save registered reporters:', e);
  }
};

export const getLoggedInReporter = (): ReporterProfile | null => {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load reporter session:', e);
  }
  return null;
};

export const setLoggedInReporter = (reporter: ReporterProfile | null): void => {
  try {
    if (reporter) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(reporter));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    window.dispatchEvent(new Event('reporter-auth-changed'));
  } catch (e) {
    console.warn('Failed to update reporter session:', e);
  }
};

export const registerReporter = (
  data: Omit<ReporterProfile, 'id' | 'registeredAt' | 'lastLoginAt' | 'phoneNormalized'>
): ReporterProfile => {
  const reporters = getRegisteredReporters();
  const normalized = normalizePhoneNumber(data.phoneCountryCode, data.mobile);

  const existingIndex = reporters.findIndex(
    (r) =>
      r.phoneNormalized === normalized ||
      (r.mobile.replace(/\D/g, '') === data.mobile.replace(/\D/g, '') && r.phoneCountryCode === data.phoneCountryCode)
  );

  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const updated: ReporterProfile = {
      ...reporters[existingIndex],
      ...data,
      phoneNormalized: normalized,
      lastLoginAt: now,
    };
    reporters[existingIndex] = updated;
    saveRegisteredReporters(reporters);
    setLoggedInReporter(updated);
    return updated;
  }

  const newProfile: ReporterProfile = {
    ...data,
    id: `rep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    phoneNormalized: normalized,
    registeredAt: now,
    lastLoginAt: now,
  };

  reporters.push(newProfile);
  saveRegisteredReporters(reporters);
  setLoggedInReporter(newProfile);
  return newProfile;
};

export const loginReporterWithPhone = (
  rawPhone: string,
  countryCode: string = '+1'
): { success: boolean; reporter?: ReporterProfile; error?: string } => {
  const reporters = getRegisteredReporters();
  const cleanDigits = rawPhone.replace(/\D/g, '');
  const searchNormalized = normalizePhoneNumber(countryCode, rawPhone);

  if (!cleanDigits) {
    return { success: false, error: 'Please enter your registered phone number.' };
  }

  const match = reporters.find((r) => {
    const rClean = r.mobile.replace(/\D/g, '');
    return (
      r.phoneNormalized === searchNormalized ||
      r.phoneNormalized.endsWith(cleanDigits) ||
      rClean === cleanDigits ||
      cleanDigits.endsWith(rClean)
    );
  });

  if (!match) {
    return {
      success: false,
      error: `No registered reporter account found for phone number "${rawPhone}". Please register your details first.`,
    };
  }

  const updated: ReporterProfile = {
    ...match,
    lastLoginAt: new Date().toISOString(),
  };

  const idx = reporters.findIndex((r) => r.id === match.id);
  if (idx >= 0) {
    reporters[idx] = updated;
    saveRegisteredReporters(reporters);
  }

  setLoggedInReporter(updated);
  return { success: true, reporter: updated };
};

export const updateReporterProfile = (updates: Partial<ReporterProfile>): ReporterProfile | null => {
  const current = getLoggedInReporter();
  if (!current) return null;

  const reporters = getRegisteredReporters();
  const now = new Date().toISOString();

  const code = updates.phoneCountryCode || current.phoneCountryCode;
  const mob = updates.mobile || current.mobile;
  const normalized = normalizePhoneNumber(code, mob);

  const updated: ReporterProfile = {
    ...current,
    ...updates,
    phoneNormalized: normalized,
    lastLoginAt: now,
  };

  const idx = reporters.findIndex((r) => r.id === current.id);
  if (idx >= 0) {
    reporters[idx] = updated;
    saveRegisteredReporters(reporters);
  } else {
    reporters.push(updated);
    saveRegisteredReporters(reporters);
  }

  setLoggedInReporter(updated);
  return updated;
};

export const logoutReporter = (): void => {
  setLoggedInReporter(null);
};
