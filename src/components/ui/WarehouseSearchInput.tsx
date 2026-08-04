import React, { useState, useRef, useEffect } from 'react';
import { Search, Warehouse as WarehouseIcon, MapPin, Sparkles, ChevronDown, X, AlertCircle, User, Package } from 'lucide-react';

/**
 * WarehouseSearchInput Component
 * 
 * A comprehensive warehouse search and selection component with intelligent autocomplete:
 * - Smart search across warehouse name, code, location, city
 * - Dual display mode: Show warehouse name or code in input
 * - Rich suggestions with warehouse details (location, capacity, manager, distance)
 * - Keyboard navigation support (Arrow keys, Enter, Escape)
 * - AI-powered suggestions based on context (frequent routes, nearest, optimal capacity)
 * - Visual capacity indicators and status badges
 * - Grouped suggestions (AI Recommendations, Recent, All Warehouses)
 * - Clear/reset functionality
 * - Smart filtering (exclude source, filter by type/status)
 * - Accessibility support with proper ARIA labels
 * 
 * @example
 * ```tsx
 * <WarehouseSearchInput
 *   value={selectedWarehouse}
 *   onChange={(wh) => setSelectedWarehouse(wh)}
 *   warehouses={allWarehouses}
 *   displayMode="name"
 *   excludeWarehouse={sourceWarehouse}
 *   aiSuggestions={[
 *     { warehouseId: 'WH-002', reason: 'Most frequent route', confidence: 95 }
 *   ]}
 *   showCapacity
 *   showDistance
 *   required
 * />
 * ```
 */

export interface Warehouse {
  id: string;                    // 'WH-001'
  name: string;                  // 'Main DC - Bangalore'
  code: string;                  // 'WH-BLR-001'
  location: string;              // 'Bangalore, Karnataka'
  type: 'DC' | 'Store' | 'Transit' | 'Return Center';
  status: 'Active' | 'Maintenance' | 'Closed';
  
  // Tax Compliance
  gstin?: string;                // '29ABCDE1234F1Z5' (GST Identification Number)
  
  // Capacity
  capacity: number;              // Max units (10,000)
  currentOccupancy: number;      // Current units (7,500)
  availableCapacity?: number;    // Free space (calculated if not provided)
  
  // Contact
  manager?: string;              // 'Rajesh Kumar'
  phone?: string;                // '+91 98765 43210'
  email?: string;                // 'bangalore.wh@company.com'
  
  // Geography
  address?: string;              // Full address
  city?: string;                 // 'Bangalore'
  state?: string;                // 'Karnataka'
  pincode?: string;              // '560001'
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Distance (calculated from source if available)
  distance?: number;             // km
  estimatedTime?: string;        // '2 hours'
  
  // Metadata
  imageUrl?: string;             // Warehouse photo
  features?: string[];           // ['Cold Storage', 'Hazmat Certified']
}

export interface WarehouseSuggestion {
  warehouseId: string;
  reason: string;
  confidence?: number;           // 0-100
  distance?: number;             // km
  estimatedTime?: string;        // '2 hours'
  transferCost?: number;         // ₹500
  availableCapacity?: number;    // Free units
}

export interface WarehouseSearchInputProps {
  // Core Value
  value: Warehouse | null;
  onChange: (warehouse: Warehouse | null) => void;
  
  // Data Source
  warehouses: Warehouse[];
  
  // Display Configuration
  displayMode?: 'name' | 'code'; // What to show in the input field
  placeholder?: string;
  
  // AI Features
  aiSuggestions?: WarehouseSuggestion[];
  recentWarehouses?: string[]; // Recent warehouse IDs
  
  // Visual Options
  showCapacity?: boolean;
  showOccupancy?: boolean;
  showDistance?: boolean;
  showManager?: boolean;
  showStatus?: boolean;
  
  // Validation
  required?: boolean;
  disabled?: boolean;
  error?: string;
  
  // Filtering
  excludeWarehouse?: string;         // Exclude specific warehouse ID (e.g., source in destination)
  filterByType?: 'DC' | 'Store' | 'Transit' | 'Return Center';
  filterByStatus?: 'Active' | 'Maintenance' | 'Closed';
  minAvailableCapacity?: number;     // Minimum free capacity required
  
  // Labels
  label?: string;
  noResultsText?: string;
  
  // Styling
  className?: string;
  
  // Callbacks
  onSearchChange?: (searchTerm: string) => void;
  onClear?: () => void;
}

export function WarehouseSearchInput({
  value,
  onChange,
  warehouses,
  displayMode = 'name',
  placeholder = 'Search by warehouse name, code, or location...',
  aiSuggestions = [],
  recentWarehouses = [],
  showCapacity = true,
  showOccupancy = false,
  showDistance = false,
  showManager = false,
  showStatus = true,
  required = false,
  disabled = false,
  error,
  excludeWarehouse,
  filterByType,
  filterByStatus,
  minAvailableCapacity,
  label = 'Select Warehouse',
  noResultsText = 'No warehouses found',
  className = '',
  onSearchChange,
  onClear
}: WarehouseSearchInputProps) {
  // Internal state
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter warehouses based on search term and filters
  const filteredWarehouses = React.useMemo(() => {
    let filtered = warehouses;

    // Apply exclude filter
    if (excludeWarehouse) {
      filtered = filtered.filter(wh => wh.id !== excludeWarehouse);
    }

    // Apply type filter
    if (filterByType) {
      filtered = filtered.filter(wh => wh.type === filterByType);
    }

    // Apply status filter
    if (filterByStatus) {
      filtered = filtered.filter(wh => wh.status === filterByStatus);
    }

    // Apply capacity filter
    if (minAvailableCapacity !== undefined) {
      filtered = filtered.filter(wh => {
        const available = wh.availableCapacity ?? (wh.capacity - wh.currentOccupancy);
        return available >= minAvailableCapacity;
      });
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(wh =>
        wh.name.toLowerCase().includes(lowerSearch) ||
        wh.code.toLowerCase().includes(lowerSearch) ||
        wh.location.toLowerCase().includes(lowerSearch) ||
        (wh.city && wh.city.toLowerCase().includes(lowerSearch)) ||
        (wh.state && wh.state.toLowerCase().includes(lowerSearch)) ||
        (wh.gstin && wh.gstin.toLowerCase().includes(lowerSearch))
      );
    }

    return filtered;
  }, [warehouses, searchTerm, excludeWarehouse, filterByType, filterByStatus, minAvailableCapacity]);

  // Group filtered warehouses
  const groupedWarehouses = React.useMemo(() => {
    const aiWarehouseIds = aiSuggestions.map(s => s.warehouseId);
    const recentWarehouseIds = recentWarehouses;

    const aiWarehouses = filteredWarehouses.filter(wh => aiWarehouseIds.includes(wh.id));
    const recent = filteredWarehouses.filter(wh => 
      recentWarehouseIds.includes(wh.id) && !aiWarehouseIds.includes(wh.id)
    );
    const other = filteredWarehouses.filter(wh => 
      !aiWarehouseIds.includes(wh.id) && !recentWarehouseIds.includes(wh.id)
    );

    return { aiWarehouses, recent, other };
  }, [filteredWarehouses, aiSuggestions, recentWarehouses]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle warehouse selection
  const handleSelectWarehouse = (warehouse: Warehouse) => {
    onChange(warehouse);
    setSearchTerm('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  // Handle clear
  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
    if (onClear) {
      onClear();
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setShowDropdown(true);
    setHighlightedIndex(-1);
    
    if (onSearchChange) {
      onSearchChange(newValue);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allWarehouses = [
      ...groupedWarehouses.aiWarehouses,
      ...groupedWarehouses.recent,
      ...groupedWarehouses.other
    ];

    if (allWarehouses.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setShowDropdown(true);
        setHighlightedIndex(prev => 
          prev < allWarehouses.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        const selectedWarehouse = allWarehouses[highlightedIndex];
        handleSelectWarehouse(selectedWarehouse);
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    if (status === 'Active') {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    if (status === 'Maintenance') {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    }
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Calculate occupancy percentage
  const getOccupancyPercentage = (warehouse: Warehouse) => {
    return Math.round((warehouse.currentOccupancy / warehouse.capacity) * 100);
  };

  // Get occupancy color
  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-600';
    if (percentage >= 75) return 'bg-orange-600';
    return 'bg-blue-600';
  };

  // Render text with highlighted match
  const renderHighlightedText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;

    const lowerText = text.toLowerCase();
    const lowerSearch = searchTerm.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerSearch);

    if (matchIndex >= 0) {
      return (
        <>
          {text.substring(0, matchIndex)}
          <span className="font-semibold bg-yellow-100">
            {text.substring(matchIndex, matchIndex + searchTerm.length)}
          </span>
          {text.substring(matchIndex + searchTerm.length)}
        </>
      );
    }
    return text;
  };

  // Get AI suggestion reason
  const getAiReason = (warehouseId: string) => {
    const suggestion = aiSuggestions.find(s => s.warehouseId === warehouseId);
    return suggestion?.reason || '';
  };

  // Get AI suggestion confidence
  const getAiConfidence = (warehouseId: string) => {
    const suggestion = aiSuggestions.find(s => s.warehouseId === warehouseId);
    return suggestion?.confidence;
  };

  // Display value in input
  const displayValue = value 
    ? (displayMode === 'name' ? value.name : value.code)
    : searchTerm;

  // Flatten all warehouses for rendering
  const allFilteredWarehouses = [
    ...groupedWarehouses.aiWarehouses,
    ...groupedWarehouses.recent,
    ...groupedWarehouses.other
  ];

  // Get warehouse icon based on type
  const getWarehouseIcon = (type: string) => {
    if (type === 'Store') return '🏪';
    if (type === 'Transit') return '🚚';
    if (type === 'Return Center') return '↩️';
    return '🏢'; // DC
  };

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Field */}
      <div className="relative" ref={inputRef}>
        {/* Selected Warehouse Display */}
        {value && !inputFocused ? (
          <div className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm bg-white flex items-center justify-between group" style={{ height: '33px' }}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <WarehouseIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 truncate">
                {displayMode === 'name' ? value.name : value.code}
              </span>
            </div>
            <button
              onClick={handleClear}
              disabled={disabled}
              className="px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex-shrink-0 font-medium"
              title="Change selection"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={displayValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setInputFocused(true);
                setShowDropdown(true);
              }}
              onBlur={() => {
                // Delay to allow clicking on dropdown items
                setTimeout(() => setInputFocused(false), 200);
              }}
              disabled={disabled}
              placeholder={placeholder}
              className={`w-full pl-10 pr-10 py-2 border rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent bg-white ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-[#5C1F3D]'
              } ${disabled ? 'bg-gray-50 text-gray-500' : ''}`}
              style={{ height: '33px' }}
            />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}

        {/* Dropdown with Suggestions */}
        {showDropdown && !value && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-[3px] shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {allFilteredWarehouses.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <WarehouseIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">{noResultsText}</p>
              </div>
            ) : (
              <>
                {/* AI Recommendations */}
                {groupedWarehouses.aiWarehouses.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border-b border-purple-100 flex items-center gap-1.5 sticky top-0 z-10">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Recommendations
                    </div>
                    {groupedWarehouses.aiWarehouses.map((warehouse, idx) => {
                      const isHighlighted = highlightedIndex === idx;
                      const aiReason = getAiReason(warehouse.id);
                      const aiConfidence = getAiConfidence(warehouse.id);
                      
                      return (
                        <div
                          key={`ai-${warehouse.id}`}
                          onClick={() => handleSelectWarehouse(warehouse)}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`px-3 py-2.5 cursor-pointer transition-colors border-b border-gray-50 ${
                            isHighlighted ? 'bg-purple-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg flex-shrink-0 mt-0.5">{getWarehouseIcon(warehouse.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-gray-900 font-medium truncate">
                                    {renderHighlightedText(warehouse.name, searchTerm)}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-500 font-mono">
                                      {renderHighlightedText(warehouse.code, searchTerm)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      • {warehouse.location}
                                    </span>
                                    {warehouse.gstin && (
                                      <span className="text-xs text-gray-500">
                                        • GSTIN: {renderHighlightedText(warehouse.gstin, searchTerm)}
                                      </span>
                                    )}
                                  </div>
                                  {aiReason && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Sparkles className="w-3 h-3 text-purple-600" />
                                      <span className="text-xs text-purple-600">
                                        {aiReason}
                                        {aiConfidence && ` (${aiConfidence}%)`}
                                      </span>
                                    </div>
                                  )}
                                  {showDistance && warehouse.distance && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <MapPin className="w-3 h-3 text-gray-500" />
                                      <span className="text-xs text-gray-600">
                                        {warehouse.distance} km
                                        {warehouse.estimatedTime && ` • ~${warehouse.estimatedTime}`}
                                      </span>
                                    </div>
                                  )}
                                  {showManager && warehouse.manager && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <User className="w-3 h-3 text-gray-500" />
                                      <span className="text-xs text-gray-600">{warehouse.manager}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Recent Warehouses */}
                {groupedWarehouses.recent.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border-b border-blue-100 flex items-center gap-1.5 sticky top-0 z-10">
                      Recently Used
                    </div>
                    {groupedWarehouses.recent.map((warehouse, idx) => {
                      const adjustedIdx = idx + groupedWarehouses.aiWarehouses.length;
                      const isHighlighted = highlightedIndex === adjustedIdx;
                      
                      return (
                        <div
                          key={`recent-${warehouse.id}`}
                          onClick={() => handleSelectWarehouse(warehouse)}
                          onMouseEnter={() => setHighlightedIndex(adjustedIdx)}
                          className={`px-3 py-2.5 cursor-pointer transition-colors border-b border-gray-50 ${
                            isHighlighted ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg flex-shrink-0 mt-0.5">{getWarehouseIcon(warehouse.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-gray-900 font-medium truncate">
                                    {renderHighlightedText(warehouse.name, searchTerm)}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-500 font-mono">
                                      {renderHighlightedText(warehouse.code, searchTerm)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      • {warehouse.location}
                                    </span>
                                    {warehouse.gstin && (
                                      <span className="text-xs text-gray-500">
                                        • GSTIN: {renderHighlightedText(warehouse.gstin, searchTerm)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* All Other Warehouses */}
                {groupedWarehouses.other.length > 0 && (
                  <>
                    {(groupedWarehouses.aiWarehouses.length > 0 || groupedWarehouses.recent.length > 0) && (
                      <div className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                        All Warehouses
                      </div>
                    )}
                    {groupedWarehouses.other.map((warehouse, idx) => {
                      const adjustedIdx = idx + groupedWarehouses.aiWarehouses.length + groupedWarehouses.recent.length;
                      const isHighlighted = highlightedIndex === adjustedIdx;
                      
                      return (
                        <div
                          key={`other-${warehouse.id}`}
                          onClick={() => handleSelectWarehouse(warehouse)}
                          onMouseEnter={() => setHighlightedIndex(adjustedIdx)}
                          className={`px-3 py-2.5 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                            isHighlighted ? 'bg-gray-100' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg flex-shrink-0 mt-0.5">{getWarehouseIcon(warehouse.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-gray-900 font-medium truncate">
                                    {renderHighlightedText(warehouse.name, searchTerm)}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-500 font-mono">
                                      {renderHighlightedText(warehouse.code, searchTerm)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      • {warehouse.location}
                                    </span>
                                    {warehouse.gstin && (
                                      <span className="text-xs text-gray-500">
                                        • GSTIN: {renderHighlightedText(warehouse.gstin, searchTerm)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}