import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { StyledSelect, MenuItem } from './StyledSelect';

/**
 * GSTDetailsInput Component
 * 
 * A reusable component for handling GST (Goods and Services Tax) configuration in forms.
 * 
 * Features:
 * - GST Applicability toggle switch
 * - Searchable HSN/SAC Code dropdown with real-time filtering
 * - Auto-population of GST Rate based on selected HSN/SAC code
 * - Built-in validation with error messages
 * - Conditional field visibility
 * - Accessibility support
 * 
 * @example
 * ```tsx
 * <GSTDetailsInput
 *   gstApplicable={gstApplicable}
 *   hsnSacCode={hsnSacCode}
 *   gstRate={gstRate}
 *   onGstApplicableChange={setGstApplicable}
 *   onHsnSacCodeChange={setHsnSacCode}
 *   onGstRateChange={setGstRate}
 *   sacCodesDatabase={sacCodes}
 * />
 * ```
 */

export interface SACCode {
  code: string;
  description: string;
  gstRate: string;
}

export interface GSTDetailsInputProps {
  // Core Values
  gstApplicable: boolean;
  hsnSacCode: string;
  gstRate: string;
  
  // Change Handlers
  onGstApplicableChange: (applicable: boolean) => void;
  onHsnSacCodeChange: (code: string) => void;
  onGstRateChange: (rate: string) => void;
  
  // Data Source
  sacCodesDatabase: SACCode[];
  
  // Optional Configuration
  required?: boolean;
  disabled?: boolean;
  showSectionHeader?: boolean;
  className?: string;
  
  // Validation
  validationError?: string;
  onValidationChange?: (hasError: boolean) => void;
}

export function GSTDetailsInput({
  gstApplicable,
  hsnSacCode,
  gstRate,
  onGstApplicableChange,
  onHsnSacCodeChange,
  onGstRateChange,
  sacCodesDatabase,
  required = true,
  disabled = false,
  showSectionHeader = true,
  className = '',
  validationError,
  onValidationChange
}: GSTDetailsInputProps) {
  // Internal state for search and dropdown
  const [sacSearchTerm, setSacSearchTerm] = useState('');
  const [showSacDropdown, setShowSacDropdown] = useState(false);
  const [sacCodeError, setSacCodeError] = useState('');

  // Ensure sacCodesDatabase is always an array
  const safeSacCodesDatabase = sacCodesDatabase || [];

  // Filter SAC codes based on search term
  const filteredSacCodes = sacSearchTerm.trim().length === 0
    ? safeSacCodesDatabase
    : safeSacCodesDatabase.filter(sac =>
        sac.code.toLowerCase().includes(sacSearchTerm.toLowerCase()) ||
        sac.description.toLowerCase().includes(sacSearchTerm.toLowerCase())
      );

  // Handle SAC code selection
  const handleSacCodeSelect = (code: string) => {
    const selected = safeSacCodesDatabase.find(sac => sac.code === code);
    if (selected) {
      onHsnSacCodeChange(code);
      onGstRateChange(selected.gstRate);
      setSacSearchTerm('');
      setShowSacDropdown(false);
      setSacCodeError('');
      onValidationChange?.(false);
    }
  };

  // Handle validation on blur
  const handleBlur = () => {
    setTimeout(() => {
      setShowSacDropdown(false);
      if (gstApplicable && !hsnSacCode && required) {
        const error = 'SAC Code is required when GST is applicable';
        setSacCodeError(error);
        onValidationChange?.(true);
      }
    }, 200);
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSacSearchTerm(value);
    onHsnSacCodeChange(''); // Clear selected code when searching
    setSacCodeError('');
    onValidationChange?.(false);
  };

  // Get selected SAC code details
  const selectedSacCode = safeSacCodesDatabase.find(s => s.code === hsnSacCode);

  return (
    <div className={className}>
      {/* Section Header */}
      {showSectionHeader && (
        <h2 className="mb-4 pb-2 border-b border-gray-200 font-medium" style={{ fontSize: '15px' }}>
          GST Details
        </h2>
      )}

      <div className="space-y-4">
        {/* GST Applicability Toggle */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="text-sm text-gray-700">
              GST Applicability {required && <span className="text-red-500">*</span>}
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={gstApplicable}
                onChange={(e) => {
                  onGstApplicableChange(e.target.checked);
                  if (!e.target.checked) {
                    // Clear GST fields when disabled
                    onHsnSacCodeChange('');
                    onGstRateChange('');
                    setSacSearchTerm('');
                    setSacCodeError('');
                    onValidationChange?.(false);
                  }
                }}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#5C1F3D] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5C1F3D] peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
            </label>
            <span className="text-sm text-gray-700 font-medium">{gstApplicable ? 'Yes' : 'No'}</span>
          </div>
          <p className="text-xs text-gray-500 ml-0">
            {gstApplicable 
              ? 'GST will be applied to this item. HSN/SAC Code and GST Rate are required.' 
              : 'GST will not be applied to this item.'}
          </p>
        </div>

        {/* Conditional GST Fields */}
        {gstApplicable && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* HSN/SAC Code - Searchable Dropdown */}
            <div className="relative">
              <label className="block text-sm text-gray-700 mb-2">
                HSN/SAC Code {required && gstApplicable && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sacSearchTerm || hsnSacCode}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    if (gstApplicable && !disabled) {
                      setShowSacDropdown(true);
                    }
                  }}
                  onBlur={handleBlur}
                  disabled={!gstApplicable || disabled}
                  placeholder="Search SAC code or description..."
                  className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white ${
                    !gstApplicable || disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''
                  } ${sacCodeError || validationError ? 'border-red-500' : ''}`}
                  style={{ minHeight: '1.4375em' }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                
                {/* Searchable Dropdown */}
                {showSacDropdown && gstApplicable && !disabled && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-auto">
                    {filteredSacCodes.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-gray-500 mb-2">No SAC codes found</p>
                        <p className="text-xs text-gray-400">Try searching: "software", "consulting", "995411"</p>
                      </div>
                    ) : (
                      <>
                        {/* Search Hint Header */}
                        <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200 z-10">
                          <p className="text-xs text-gray-600">
                            {sacSearchTerm.trim().length === 0 
                              ? `Showing all ${filteredSacCodes.length} SAC codes. Type to search...` 
                              : `Found ${filteredSacCodes.length} result${filteredSacCodes.length !== 1 ? 's' : ''}`}
                          </p>
                          {sacSearchTerm.trim().length === 0 && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Try: "software", "consulting", "advertising", "995411"
                            </p>
                          )}
                        </div>
                        
                        {/* Results List */}
                        {filteredSacCodes.map((sac) => (
                          <button
                            key={sac.code}
                            type="button"
                            onClick={() => handleSacCodeSelect(sac.code)}
                            className="w-full px-4 py-2.5 text-left hover:bg-purple-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-gray-900 font-medium">{sac.code}</div>
                                <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">{sac.description}</div>
                              </div>
                              <div className="flex-shrink-0">
                                <span className="inline-block px-2 py-0.5 text-xs rounded bg-[#5C1F3D] text-white border border-[#5C1F3D]">
                                  {sac.gstRate}%
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Validation Error */}
              {(sacCodeError || validationError) && gstApplicable && (
                <p className="text-xs text-red-500 mt-1">
                  {validationError || sacCodeError}
                </p>
              )}
              
              {/* Helper Text */}
              {!gstApplicable && (
                <p className="text-xs text-gray-500 mt-1">
                  Enable GST Applicability to edit this field
                </p>
              )}
              
              {/* Selected SAC Code Display */}
              {hsnSacCode && gstApplicable && !sacCodeError && !validationError && selectedSacCode && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Selected: {hsnSacCode} - {selectedSacCode.description}
                </p>
              )}
            </div>

            {/* GST Rate */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                GST Rate {required && gstApplicable && <span className="text-red-500">*</span>}
              </label>
              <StyledSelect 
                value={gstRate}
                onChange={(e) => onGstRateChange(e.target.value)}
                disabled={!gstApplicable || disabled}
                style={{ fontSize: 'var(--text-sm)', minHeight: '1.4375em', opacity: !gstApplicable || disabled ? 0.6 : 1 }}
              >
                <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Select GST rate</MenuItem>
                <MenuItem value="0" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>0%</MenuItem>
                <MenuItem value="5" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>5%</MenuItem>
                <MenuItem value="12" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>12%</MenuItem>
                <MenuItem value="18" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>18%</MenuItem>
                <MenuItem value="28" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>28%</MenuItem>
              </StyledSelect>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}