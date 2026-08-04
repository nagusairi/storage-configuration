import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MapPin } from 'lucide-react';

interface Warehouse {
  id: string;
  name: string;
  location: string;
}

interface SearchableWarehouseSelectProps {
  warehouses: Warehouse[];
  value: string;
  onChange: (warehouseId: string) => void;
  includeAllOption?: boolean;
}

export function SearchableWarehouseSelect({ 
  warehouses, 
  value, 
  onChange,
  includeAllOption = true 
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
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-[3px] shadow-lg max-h-[300px] overflow-hidden flex flex-col">
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

          {/* Options List */}
          <div className="overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No warehouses found
              </div>
            ) : (
              filteredOptions.map((warehouse) => (
                <button
                  key={warehouse.id}
                  onClick={() => handleSelect(warehouse.id)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    value === warehouse.id ? 'bg-purple-50 text-[#5C1F3D]' : 'text-gray-900'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium truncate ${value === warehouse.id ? 'text-[#5C1F3D]' : 'text-gray-900'}`}>
                      {warehouse.name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className={`w-3 h-3 flex-shrink-0 ${value === warehouse.id ? 'text-[#5C1F3D]' : 'text-gray-500'}`} />
                      <span className={`text-xs truncate ${value === warehouse.id ? 'text-[#5C1F3D]' : 'text-gray-500'}`}>
                        {warehouse.location}
                      </span>
                    </div>
                  </div>
                  {value === warehouse.id && (
                    <div className="ml-2 flex-shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5C1F3D]" />
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
