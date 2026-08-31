import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Phone, X } from 'lucide-react';
import { COUNTRIES, CountryOption } from '../../data/countries';

interface PhoneInputWithCountryCodeProps {
  id?: string;
  label?: string;
  required?: boolean;
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (phone: string) => void;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
}

export const PhoneInputWithCountryCode: React.FC<PhoneInputWithCountryCodeProps> = ({
  id = 'phone-input',
  label,
  required = false,
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  placeholder = 'e.g. (555) 234-5678 or 98765 43210',
  helperText = 'Country calling code and address country operate independently.',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Clean the current dial code for matching (e.g. "+1", "+91")
  const currentCode = (countryCode || '+1').trim();

  // Find matching country by dial code if any (exact or best match)
  const matchedCountry = COUNTRIES.find((c) => c.dialCode === currentCode);

  const filteredCountries = COUNTRIES.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      c.name.toLowerCase().includes(term) ||
      c.code.toLowerCase().includes(term) ||
      c.dialCode.toLowerCase().includes(term)
    );
  });

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelectCountryCode = (c: CountryOption) => {
    onCountryCodeChange(c.dialCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-1" ref={containerRef}>
      {label && (
        <label htmlFor={`${id}-number`} className="block text-xs font-semibold text-slate-700">
          {label} {required ? <span className="text-rose-600">*</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
        </label>
      )}

      <div className="flex gap-2 relative">
        {/* Country Dial Code Selector Button */}
        <div className="relative">
          <button
            type="button"
            id={`${id}-code-btn`}
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={`h-10.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-sm font-semibold text-teal-950 flex items-center justify-between gap-1.5 transition-colors focus:ring-2 focus:ring-teal-500 ${
              isOpen ? 'ring-2 ring-teal-500 border-teal-500 bg-white' : ''
            } ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
            title="Select Country Calling Code"
          >
            <span className="tabular-nums">{currentCode || '+1'}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-teal-600' : ''}`} />
          </button>

          {/* Searchable Dial Code Dropdown */}
          {isOpen && (
            <div className="absolute left-0 top-full mt-1.5 z-50 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              {/* Search Box */}
              <div className="p-2 border-b border-slate-100 bg-slate-50/90 sticky top-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search country or code (+91, +44)..."
                    className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-900"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Direct Code Entry Option */}
              {searchTerm.trim().startsWith('+') && (
                <div className="px-2 py-1.5 bg-teal-50 border-b border-teal-100">
                  <button
                    type="button"
                    onClick={() => {
                      onCountryCodeChange(searchTerm.trim());
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="w-full px-2 py-1 text-xs font-semibold text-teal-800 hover:text-teal-950 text-left rounded bg-teal-100/70 hover:bg-teal-100 flex items-center justify-between"
                  >
                    <span>Use custom code:</span>
                    <span className="font-mono">{searchTerm.trim()}</span>
                  </button>
                </div>
              )}

              {/* Countries List */}
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 py-1 text-xs">
                {filteredCountries.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    No country calling codes found.
                  </div>
                ) : (
                  filteredCountries.map((c) => {
                    const isSelected = currentCode === c.dialCode;
                    return (
                      <button
                        key={`${c.code}-${c.dialCode}`}
                        type="button"
                        onClick={() => handleSelectCountryCode(c)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-teal-50 text-teal-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate pr-2">{c.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-slate-500 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                            {c.dialCode}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Direct Text input for Phone Number */}
        <div className="relative flex-1">
          <input
            id={`${id}-number`}
            type="tel"
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            value={phoneNumber || ''}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            className="w-full h-10.5 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900 font-medium"
          />
        </div>
      </div>

      {helperText && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
};
