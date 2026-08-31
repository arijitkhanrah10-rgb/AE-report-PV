import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Stethoscope,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useReporterAuth } from '../../context/ReporterAuthContext';
import { ReporterType } from '../../types';
import { PhoneInputWithCountryCode } from '../Wizard/PhoneInputWithCountryCode';
import { CascadingAddressGroup } from '../Wizard/CascadingAddressGroup';

export const ReporterProfileModal: React.FC = () => {
  const {
    reporter,
    activeAuthModal,
    closeAuthModals,
    updateProfile,
    logout,
  } = useReporterAuth();

  const [formData, setFormData] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (reporter) {
      setFormData({
        ...reporter,
        phoneCountryCode: reporter.phoneCountryCode || '+1',
        country: reporter.country || 'United States',
      });
    }
  }, [reporter]);

  if (activeAuthModal !== 'profile' || !reporter || !formData) {
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(false);

    if (!formData.fullName?.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!formData.email?.trim() || !formData.email.includes('@')) {
      setErrorMessage('Valid email address is required.');
      return;
    }

    try {
      updateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update profile.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeAuthModals}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        id="reporter-profile-modal"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">My Reporter Profile</h3>
              <p className="text-xs text-slate-400 font-mono">
                {reporter.phoneCountryCode} {reporter.mobile}
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

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your reporter profile details were successfully saved!</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Reporter Role & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Reporting Role
              </label>
              <select
                value={formData.reporterType}
                onChange={(e) => setFormData({ ...formData, reporterType: e.target.value as ReporterType })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 font-medium"
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
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          </div>

          {/* Phone Number (Read-only ID or editable country code) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Registered Phone Number
            </label>
            <PhoneInputWithCountryCode
              countryCode={formData.phoneCountryCode || '+1'}
              phoneNumber={formData.mobile || ''}
              onCountryCodeChange={(code) => setFormData({ ...formData, phoneCountryCode: code })}
              onPhoneNumberChange={(num) => setFormData({ ...formData, mobile: num })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Email Address <span className="text-rose-600">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          {/* Location & Address with Cascading Dependent Dropdowns */}
          <CascadingAddressGroup
            title="Default Location & Address"
            icon="mappin"
            required={false}
            values={{
              country: formData.country || formData.currentCountry || 'United States',
              state: formData.state || formData.currentState || '',
              district: formData.district || formData.currentDistrict || '',
              area: formData.area || formData.currentAddress || '',
              pinZip: formData.pinZip || formData.currentPin || '',
            }}
            onChange={(addr) => {
              setFormData((prev: any) => ({
                ...prev,
                country: addr.country || 'United States',
                currentCountry: addr.country || 'United States',
                state: addr.state || '',
                currentState: addr.state || '',
                district: addr.district || '',
                currentDistrict: addr.district || '',
                area: addr.area || '',
                currentAddress: addr.area || '',
                pinZip: addr.pinZip || '',
                currentPin: addr.pinZip || '',
              }));
            }}
          />

          {/* Healthcare Professional Details if applicable */}
          {formData.reporterType === 'Doctor / Healthcare Professional' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Professional Healthcare Credentials</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Qualification (e.g. MD, PharmD)"
                  value={formData.qualification || ''}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  placeholder="Specialization (e.g. Cardiology)"
                  value={formData.specialization || ''}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>
              <input
                type="text"
                placeholder="Hospital / Institution Name"
                value={formData.institutionName || ''}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="Medical License / Registration No."
                value={formData.regNumber || formData.idNumber || ''}
                onChange={(e) => setFormData({ ...formData, regNumber: e.target.value, idNumber: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                logout();
                closeAuthModals();
              }}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-teal-700/20 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
