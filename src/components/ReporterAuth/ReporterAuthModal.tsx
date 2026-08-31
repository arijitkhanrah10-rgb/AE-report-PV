import React, { useState } from 'react';
import {
  X,
  Phone,
  User,
  Mail,
  ShieldCheck,
  Building,
  MapPin,
  Stethoscope,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useReporterAuth } from '../../context/ReporterAuthContext';
import { ReporterType } from '../../types';
import { PhoneInputWithCountryCode } from '../Wizard/PhoneInputWithCountryCode';
import { CascadingAddressGroup } from '../Wizard/CascadingAddressGroup';

export const ReporterAuthModal: React.FC = () => {
  const {
    activeAuthModal,
    closeAuthModals,
    login,
    register,
    openRegisterModal,
    openLoginModal,
    registeredReporters,
  } = useReporterAuth();

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginCountryCode, setLoginCountryCode] = useState('+1');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration form state
  const [regData, setRegData] = useState({
    fullName: '',
    reporterType: 'Patient' as ReporterType,
    phoneCountryCode: '+1',
    mobile: '',
    email: '',
    age: '',
    gender: 'Prefer not to say' as any,
    country: 'United States',
    state: '',
    district: '',
    area: '',
    currentAddress: '',
    pinZip: '',
    permanentSameAsCurrent: true,
    // HCP fields
    qualification: '',
    specialization: '',
    institutionName: '',
    department: '',
    regNumber: '',
    idType: 'National ID / License',
    idNumber: '',
    idNotAvailable: false,
  });

  const [regError, setRegError] = useState<string | null>(null);

  if (!activeAuthModal || (activeAuthModal !== 'login' && activeAuthModal !== 'register')) {
    return null;
  }

  const isLogin = activeAuthModal === 'login';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginPhone.trim()) {
      setLoginError('Please enter your registered mobile phone number.');
      return;
    }

    const res = login(loginPhone, loginCountryCode);
    if (!res.success) {
      setLoginError(res.error || 'No registered account found. Please register your profile.');
    }
  };

  const handleQuickLogin = (phone: string, code: string) => {
    setLoginError(null);
    setLoginPhone(phone);
    setLoginCountryCode(code);
    login(phone, code);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regData.fullName.trim()) {
      setRegError('Please provide your Full Name.');
      return;
    }
    if (!regData.mobile.trim()) {
      setRegError('Please provide your Phone Number.');
      return;
    }
    if (!regData.email.trim()) {
      setRegError('Please provide your Email Address for safety follow-up.');
      return;
    }

    try {
      register(regData);
    } catch (err: any) {
      setRegError(err?.message || 'Failed to create account.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeAuthModals}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="reporter-auth-modal"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {isLogin ? 'Reporter Login / Access' : 'Create Reporter Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {isLogin
                  ? 'Access your reporter profile & track your submitted reports'
                  : 'Save your details once & submit adverse events seamlessly'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModals}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 shrink-0">
          <button
            type="button"
            onClick={openLoginModal}
            className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
              isLogin
                ? 'border-teal-600 text-teal-800 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Sign In with Phone</span>
          </button>
          <button
            type="button"
            onClick={openRegisterModal}
            className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
              !isLogin
                ? 'border-teal-600 text-teal-800 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Register New Reporter</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-2xl text-xs text-teal-900 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block">Seamless Adverse Event Reporting:</strong>
                  Logging in automatically preloads your reporter profile so you never have to re-type contact details for future adverse event reports.
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Registered Phone Number <span className="text-rose-600">*</span>
                </label>
                <PhoneInputWithCountryCode
                  countryCode={loginCountryCode}
                  phoneNumber={loginPhone}
                  onCountryCodeChange={setLoginCountryCode}
                  onPhoneNumberChange={setLoginPhone}
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Enter the phone number you registered with (e.g. (555) 342-8901).
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Log In to Reporter Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Quick Accounts */}
              {registeredReporters.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Quick Demo Accounts
                  </p>
                  <div className="space-y-1.5">
                    {registeredReporters.slice(0, 3).map((rep) => (
                      <button
                        key={rep.id}
                        type="button"
                        onClick={() => handleQuickLogin(rep.mobile, rep.phoneCountryCode)}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all flex items-center justify-between text-xs group cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-teal-900">
                            {rep.fullName} ({rep.reporterType})
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {rep.phoneCountryCode} {rep.mobile}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-teal-700 bg-teal-100/70 group-hover:bg-teal-600 group-hover:text-white px-2 py-1 rounded-lg transition-colors">
                          Log In
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={openRegisterModal}
                  className="text-xs text-teal-700 hover:text-teal-900 font-bold hover:underline cursor-pointer"
                >
                  Don't have a registered account yet? Register here →
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  I am reporting as <span className="text-rose-600">*</span>
                </label>
                <select
                  value={regData.reporterType}
                  onChange={(e) => setRegData({ ...regData, reporterType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor / Healthcare Professional">Doctor / Healthcare Professional</option>
                  <option value="Family Member">Family Member</option>
                  <option value="Caregiver">Caregiver</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Davis or Jane Doe"
                  value={regData.fullName}
                  onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Phone with Country Code */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Mobile Phone Number <span className="text-rose-600">*</span>
                </label>
                <PhoneInputWithCountryCode
                  countryCode={regData.phoneCountryCode}
                  phoneNumber={regData.mobile}
                  onCountryCodeChange={(code) => setRegData({ ...regData, phoneCountryCode: code })}
                  onPhoneNumberChange={(mob) => setRegData({ ...regData, mobile: mob })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Email Address <span className="text-rose-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. reporter@example.com"
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Reporter Location & Address with Cascading Dependent Dropdowns */}
              <CascadingAddressGroup
                title="Reporter Location & Address"
                icon="building"
                required={false}
                values={{
                  country: regData.country || 'United States',
                  state: regData.state || '',
                  district: regData.district || '',
                  area: regData.area || regData.currentAddress || '',
                  pinZip: regData.pinZip || '',
                }}
                onChange={(addr) => {
                  setRegData((prev) => ({
                    ...prev,
                    country: addr.country || 'United States',
                    state: addr.state || '',
                    district: addr.district || '',
                    area: addr.area || '',
                    currentAddress: addr.area || '',
                    pinZip: addr.pinZip || '',
                  }));
                }}
              />

              {/* HCP details if professional */}
              {regData.reporterType === 'Doctor / Healthcare Professional' && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>Healthcare Professional Credentials</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Qualification (e.g. MD, MBBS)"
                      value={regData.qualification}
                      onChange={(e) => setRegData({ ...regData, qualification: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Medical Registration No."
                      value={regData.regNumber}
                      onChange={(e) => setRegData({ ...regData, regNumber: e.target.value, idNumber: e.target.value })}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Hospital / Institution / Clinic Name"
                    value={regData.institutionName}
                    onChange={(e) => setRegData({ ...regData, institutionName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Save Profile & Complete Registration</span>
                <UserCheck className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="text-xs text-teal-700 hover:text-teal-900 font-bold hover:underline cursor-pointer"
                >
                  Already registered? Sign in with your phone number →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
