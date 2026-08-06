import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MapPin, ArrowRight } from 'lucide-react';

interface Warehouse {
  id: string;
  name: string;
  location: string;
}

type ConfigStatus = 'not-configured' | 'draft' | 'published';

const STATUS_META: Record<ConfigStatus, { dot: string; label: string }> = {
  published:      { dot: 'bg-green-500',  label: 'Published' },
  draft:          { dot: 'bg-orange-400', label: 'Draft' },
  'not-configured': { dot: 'bg-red-400',  label: 'Setup Required' },
};

interface SearchableWarehouseSelectProps {
  warehouses: Warehouse[];
  value: string;
  onChange: (warehouseId: string) => void;
  includeAllOption?: boolean;
  /** Optional map of warehouseId → configStatus for inline status badges */
  statusByWarehouseId?: Record<string, ConfigStatus>;
  /** Optional callback to navigate to Warehouse Configuration Hub */
  onViewAllWarehouses?: () => void;
}

export function SearchableWarehouseSelect({ 
  warehouses, 
  value, 
  onChange,
  includeAllOption = true,
  statusByWarehouseId,
  onViewAllWarehouses,
}: SearchableWarehouseSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // All options including "All Warehouses" if enabled
  const allOptions = includeAllOption 
    ? [{ id: 'all', name: 'All Warehouses', location: 'All Locations' }, ...warehouses]
    : warehouses;

  // Filtered options based on search term
  const filteredOptions = searchTerm
    ? allOptions.filter(wh => 
        wh.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wh.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allOptions;

  // Get selected warehouse details
  const selectedWarehouse = allOptions.find(wh => wh.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (warehouseId: string) => {
    onChange(warehouseId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent text-left flex items-center justify-between"
        style={{ height: '33px' }}
      >
        <span className="truncate">{selectedWarehouse?.name || 'Select Warehouse'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-[3px] shadow-lg max-h-[340px] overflow-hidden flex flex-col min-w-[260px]">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent"
              />
            </div>
          </div>

          {/* Section Header */}
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/60 border-b border-gray-100">
            Recent Warehouses
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-[200px]">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No warehouses found
              </div>
            ) : (
              filteredOptions.map((warehouse) => {
                const status = statusByWarehouseId?.[warehouse.id];
                const statusMeta = status ? STATUS_META[status] : null;
                const isSelected = value === warehouse.id;
                return (
                  <button
                    key={warehouse.id}
                    onClick={() => handleSelect(warehouse.id)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      isSelected ? 'bg-purple-50 text-[#5C1F3D]' : 'text-gray-900'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${isSelected ? 'text-[#5C1F3D]' : 'text-gray-900'}`}>
                        {warehouse.name}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-[#5C1F3D]' : 'text-gray-500'}`} />
                        <span className={`text-xs truncate ${isSelected ? 'text-[#5C1F3D]' : 'text-gray-500'}`}>
                          {warehouse.location}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                      {statusMeta && (
                        <span className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusMeta.dot}`} />
                          <span className="text-[10px] text-gray-500 whitespace-nowrap">{statusMeta.label}</span>
                        </span>
                      )}
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#5C1F3D]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* View All Warehouses Footer Button */}
          {onViewAllWarehouses && (
            <div className="p-1.5 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onViewAllWarehouses();
                }}
                className="w-full px-3 py-2 text-xs font-bold text-[#5C1F3D] hover:bg-[#5C1F3D]/10 rounded-[3px] transition-colors flex items-center justify-between group"
              >
                <span>View All Warehouses</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#5C1F3D] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
