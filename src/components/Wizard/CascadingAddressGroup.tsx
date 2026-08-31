import React from 'react';
import { Building2, MapPin, Copy, Globe, Compass, Navigation } from 'lucide-react';
import { SearchableCountrySelect } from './SearchableCountrySelect';
import { SearchableSelect } from './SearchableSelect';
import { getStatesForCountry, getDistrictsForState } from '../../data/locations';

export interface AddressData {
  country?: string;
  state?: string;
  district?: string;
  area?: string;
  pinZip?: string;
}

interface CascadingAddressGroupProps {
  title: string;
  icon?: 'building' | 'mappin';
  values: AddressData;
  onChange: (updated: AddressData) => void;
  onCopyReporterAddress?: () => void;
  required?: boolean;
  isPermanentSection?: boolean;
  isSameAsCurrent?: boolean;
  onToggleSameAsCurrent?: (same: boolean) => void;
  sameAsCurrentNote?: string;
}

export const CascadingAddressGroup: React.FC<CascadingAddressGroupProps> = ({
  title,
  icon = 'building',
  values,
  onChange,
  onCopyReporterAddress,
  required = true,
  isPermanentSection = false,
  isSameAsCurrent = false,
  onToggleSameAsCurrent,
  sameAsCurrentNote,
}) => {
  const currentCountry = values.country || 'United States';
  const currentState = values.state || '';
  const currentDistrict = values.district || '';

  // Get dynamic cascading lists based on selected country & state
  const availableStates = getStatesForCountry(currentCountry);
  const availableDistricts = getDistrictsForState(currentCountry, currentState);

  const handleCountryChange = (newCountry: string) => {
    const newStates = getStatesForCountry(newCountry);
    const stateStillValid = currentState && newStates.includes(currentState);
    const updatedState = stateStillValid ? currentState : '';
    const newDistricts = updatedState ? getDistrictsForState(newCountry, updatedState) : [];
    const districtStillValid = updatedState && currentDistrict && newDistricts.includes(currentDistrict);

    const updated: AddressData = {
      ...values,
      country: newCountry,
      state: updatedState,
      district: districtStillValid ? currentDistrict : '',
    };
    onChange(updated);
  };

  const handleStateChange = (newState: string) => {
    const newDistricts = getDistrictsForState(currentCountry, newState);
    const districtStillValid = currentDistrict && newDistricts.includes(currentDistrict);

    const updated: AddressData = {
      ...values,
      state: newState,
      district: districtStillValid ? currentDistrict : '',
    };
    onChange(updated);
  };

  const handleDistrictChange = (newDistrict: string) => {
    const updated: AddressData = {
      ...values,
      district: newDistrict,
    };
    onChange(updated);
  };

  return (
    <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          {icon === 'building' ? (
            <Building2 className="w-4 h-4 text-teal-600 shrink-0" />
          ) : (
            <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
          )}
          <span>{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {onCopyReporterAddress && (
            <button
              type="button"
              onClick={onCopyReporterAddress}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1.5 hover:underline bg-teal-50/80 px-2.5 py-1 rounded-lg border border-teal-200"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Address from Reporter</span>
            </button>
          )}

          {isPermanentSection && onToggleSameAsCurrent && (
            <label className="flex items-center gap-2 text-xs font-semibold text-teal-950 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSameAsCurrent}
                onChange={(e) => onToggleSameAsCurrent(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
              />
              <span>Permanent same as current address</span>
            </label>
          )}
        </div>
      </div>

      {isPermanentSection && isSameAsCurrent ? (
        <div className="p-3.5 bg-teal-50/60 border border-teal-200/80 rounded-xl flex items-center gap-2.5 text-xs text-teal-900 animate-in fade-in">
          <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
          <span>
            {sameAsCurrentNote ||
              'Permanent address is synchronized with your Current Address. Uncheck the option above to enter a different permanent location.'}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Level 1: Country / Region */}
          <div>
            <SearchableCountrySelect
              label="Country / Region"
              required={required}
              value={currentCountry}
              onChange={handleCountryChange}
              helperText="Selecting country loads its states / provinces."
            />
          </div>

          {/* Level 2: State / Province / Administrative Region */}
          <div>
            <SearchableSelect
              label="State / Province / Region"
              required={required}
              value={currentState}
              options={availableStates}
              onChange={handleStateChange}
              placeholder={
                availableStates.length > 0
                  ? 'Select state / province...'
                  : 'Enter state / province / region'
              }
              searchPlaceholder="Search state, province or region..."
              emptyText={`No states found for ${currentCountry}.`}
              helperText={
                availableStates.length > 0
                  ? `${availableStates.length} states/provinces available for ${currentCountry}.`
                  : 'Type custom state or region if unlisted.'
              }
              icon={<Compass className="w-4 h-4 text-teal-600 shrink-0" />}
            />
          </div>

          {/* Level 3: District / County / Municipality */}
          <div>
            <SearchableSelect
              label="District / County / Municipality"
              required={false}
              value={currentDistrict}
              options={availableDistricts}
              onChange={handleDistrictChange}
              placeholder={
                availableDistricts.length > 0
                  ? 'Select district / county...'
                  : currentState
                  ? 'Enter district or county...'
                  : 'Select state first or type custom...'
              }
              searchPlaceholder="Search district, county or council..."
              emptyText={
                currentState
                  ? `No districts listed for ${currentState}.`
                  : 'Select a state first or enter custom.'
              }
              helperText={
                availableDistricts.length > 0
                  ? `${availableDistricts.length} districts available for ${currentState}.`
                  : 'Optional: Enter local county, district, or municipality.'
              }
              icon={<Navigation className="w-4 h-4 text-teal-600 shrink-0" />}
            />
          </div>

          {/* Level 4: City / Area / Street / Building */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City / Area / Street / House No.{' '}
              {required ? (
                <span className="text-rose-600">*</span>
              ) : (
                <span className="text-slate-400 font-normal">(Optional)</span>
              )}
            </label>
            <input
              type="text"
              required={required}
              placeholder="e.g. Flat 402, Oakwood Court, 12th Main Road, Sector 4"
              value={values.area || ''}
              onChange={(e) => onChange({ ...values, area: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 text-slate-900"
            />
          </div>

          {/* Level 5: PIN / ZIP / Postal Code */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PIN / ZIP / Postal Code{' '}
              {required ? (
                <span className="text-rose-600">*</span>
              ) : (
                <span className="text-slate-400 font-normal">(Optional)</span>
              )}
            </label>
            <input
              type="text"
              required={required}
              placeholder="e.g. 90210, 411001, SW1A 1AA, M5V 2T6, 75001"
              value={values.pinZip || ''}
              onChange={(e) => onChange({ ...values, pinZip: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Enter international postal code or PIN.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
