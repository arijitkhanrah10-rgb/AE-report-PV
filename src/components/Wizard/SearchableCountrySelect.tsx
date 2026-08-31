import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Globe, X } from 'lucide-react';
import { COUNTRIES, CountryOption, getDialCodeForCountry } from '../../data/locations';

interface SearchableCountrySelectProps {
  value: string;
  onChange: (countryName: string, dialCode?: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  id?: string;
  error?: string;
  helperText?: string;
  showDialCode?: boolean;
}

export const SearchableCountrySelect: React.FC<SearchableCountrySelectProps> = ({
  value,
  onChange,
  label = 'Country',
  required = false,
  placeholder = 'Select a country...',
  id = 'searchable-country-select',
  error,
  helperText,
  showDialCode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = COUNTRIES.find(
    (c) => c.name.toLowerCase() === (value || '').trim().toLowerCase()
  );

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

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (c: CountryOption) => {
    onChange(c.name, c.dialCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1">
          {label} {required ? <span className="text-rose-600">*</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
        </label>
      )}

      {/* Button / Trigger */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm flex items-center justify-between text-left transition-all ${
          isOpen ? 'ring-2 ring-teal-500 border-teal-500' : 'border-slate-300 hover:border-slate-400'
        } ${error ? 'border-rose-400 ring-rose-300' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Globe className="w-4 h-4 text-teal-600 shrink-0" />
          {selectedCountry ? (
            <span className="font-medium text-slate-900 truncate">
              {selectedCountry.name}{' '}
              {showDialCode ? (
                <span className="text-xs text-slate-500 font-normal">({selectedCountry.dialCode})</span>
              ) : (
                <span className="text-xs text-slate-400 font-mono ml-1 uppercase">[{selectedCountry.code}]</span>
              )}
            </span>
          ) : (
            <span className="text-slate-400 font-normal">{value || placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-teal-600' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Search Box */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search country or code (+1, +91, UK)..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none text-slate-900"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 py-1 text-xs">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-3 text-slate-400 text-center">
                No matching countries found.
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = (value || '').toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                        {c.code}
                      </span>
                      <span>{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-teal-700 font-semibold">{c.dialCode}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}
      {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
    </div>
  );
};
