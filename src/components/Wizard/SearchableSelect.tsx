import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X, Edit3, ListFilter, Plus } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  subtext?: string;
}

interface SearchableSelectProps {
  id?: string;
  label?: string;
  required?: boolean;
  value: string;
  options: (string | SelectOption)[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  helperText?: string;
  allowCustomInput?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id = 'searchable-select',
  label,
  required = false,
  value,
  options = [],
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Type to search...',
  emptyText = 'No matching options found.',
  helperText,
  allowCustomInput = true,
  disabled = false,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDirectTypingMode, setIsDirectTypingMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to standard format
  const normalizedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });

  const hasOptions = normalizedOptions.length > 0;

  // Filter options based on search query
  const filteredOptions = normalizedOptions.filter((opt) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      opt.label.toLowerCase().includes(term) ||
      (opt.subtext && opt.subtext.toLowerCase().includes(term)) ||
      opt.value.toLowerCase().includes(term)
    );
  });

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelectOption = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleUseCustomTerm = () => {
    if (searchTerm.trim()) {
      onChange(searchTerm.trim());
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // If no predefined options exist, automatically fallback to direct text input
  if (!hasOptions || isDirectTypingMode) {
    return (
      <div className="relative">
        {label && (
          <div className="flex items-center justify-between mb-1">
            <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
              {label} {required ? <span className="text-rose-600">*</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
            </label>
            {hasOptions && (
              <button
                type="button"
                onClick={() => setIsDirectTypingMode(false)}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 hover:underline"
              >
                <ListFilter className="w-3 h-3" /> Select from list
              </button>
            )}
          </div>
        )}
        <input
          id={id}
          type="text"
          required={required}
          disabled={disabled}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
        />
        {helperText && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}
      </div>
    );
  }

  const selectedOpt = normalizedOptions.find(
    (opt) => opt.value.toLowerCase() === (value || '').toLowerCase()
  );

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
            {label} {required ? <span className="text-rose-600">*</span> : <span className="text-slate-400 font-normal">(Optional)</span>}
          </label>
          {allowCustomInput && (
            <button
              type="button"
              onClick={() => setIsDirectTypingMode(true)}
              className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3 h-3" /> Type custom
            </button>
          )}
        </div>
      )}

      {/* Dropdown Trigger */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm flex items-center justify-between text-left transition-all ${
          isOpen ? 'ring-2 ring-teal-500 border-teal-500' : 'border-slate-300 hover:border-slate-400'
        } ${disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {icon}
          {value ? (
            <span className="font-medium text-slate-900 truncate">
              {selectedOpt ? selectedOpt.label : value}
            </span>
          ) : (
            <span className="text-slate-400 font-normal truncate">{placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isOpen ? 'rotate-180 text-teal-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Overlay Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {/* Sticky Search Input */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/90 sticky top-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
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

          {/* Quick Custom Value Button if user types something not in predefined list */}
          {searchTerm.trim() && (
            <div className="px-2 py-1.5 bg-teal-50/60 border-b border-teal-100">
              <button
                type="button"
                onClick={handleUseCustomTerm}
                className="w-full px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Use custom: "{searchTerm.trim()}"</span>
              </button>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 py-1 text-xs">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-4 text-slate-400 text-center space-y-2">
                <p>{emptyText}</p>
                {searchTerm.trim() && (
                  <button
                    type="button"
                    onClick={handleUseCustomTerm}
                    className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline"
                  >
                    Click here to use "{searchTerm.trim()}" as value
                  </button>
                )}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = (value || '').toLowerCase() === opt.value.toLowerCase();
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="truncate">{opt.label}</span>
                      {opt.subtext && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {opt.subtext}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
};
