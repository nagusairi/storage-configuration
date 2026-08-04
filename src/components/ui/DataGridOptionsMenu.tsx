import { useState, useRef, useEffect, ReactNode, Fragment } from 'react';
import { MoreVertical, Filter, Columns3, SlidersHorizontal, Download } from 'lucide-react';

/**
 * DataGridOptionsMenu Component
 * 
 * A specialized options menu for DataGrid component's column header.
 * This menu is positioned inline next to the first column header label.
 * 
 * @component
 * @internal - Used internally by DataGrid component
 */

export interface DataGridOptionsMenuProps {
  /**
   * Whether filters toggle is visible
   */
  showFiltersToggle?: boolean;
  
  /**
   * Callback when filters toggle is clicked
   */
  onToggleFilters?: () => void;
  
  /**
   * Current filter visibility state
   */
  filtersVisible?: boolean;
  
  /**
   * Whether columns selector is visible
   */
  showColumnsSelector?: boolean;
  
  /**
   * Callback when columns selector is clicked
   */
  onShowColumns?: () => void;
  
  /**
   * Whether density control is visible
   */
  showDensityControl?: boolean;
  
  /**
   * Current density setting
   */
  density?: 'compact' | 'standard' | 'comfortable';
  
  /**
   * Callback when density is changed
   */
  onDensityChange?: (density: 'compact' | 'standard' | 'comfortable') => void;
  
  /**
   * Whether export option is visible
   */
  showExportOption?: boolean;
  
  /**
   * Callback when export is clicked
   */
  onExport?: () => void;
  
  /**
   * Custom menu options to append
   */
  customOptions?: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    divider?: boolean;
  }>;
  
  /**
   * Whether to stop propagation on button click (for sortable column headers)
   */
  stopPropagation?: boolean;
}

/**
 * DataGridOptionsMenu Component
 * 
 * Displays inline options menu for DataGrid column header.
 */
export function DataGridOptionsMenu({
  showFiltersToggle = true,
  onToggleFilters,
  filtersVisible = false,
  showColumnsSelector = true,
  onShowColumns,
  showDensityControl = true,
  density = 'standard',
  onDensityChange,
  showExportOption = true,
  onExport,
  customOptions = [],
  stopPropagation = false
}: DataGridOptionsMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);
  
  const handleButtonClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    setShowMenu(!showMenu);
  };
  
  const handleMenuItemClick = (callback?: () => void) => {
    setShowMenu(false);
    if (callback) {
      callback();
    }
  };
  
  return (
    <div 
      className="relative inline-block" 
      ref={menuRef}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      {/* Trigger Button - Matches TableToolbarOptionsMenu design */}
      <button
        onClick={handleButtonClick}
        className="p-2 h-10 rounded hover:bg-gray-100 transition-colors border border-gray-300"
        aria-label="More options"
        aria-expanded={showMenu}
        aria-haspopup="true"
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </button>
      
      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
            aria-hidden="true"
          />
          
          {/* Menu Content - Matches TableToolbarOptionsMenu design */}
          <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48">
            {/* Filters toggle */}
            {showFiltersToggle && onToggleFilters && (
              <button
                onClick={() => handleMenuItemClick(onToggleFilters)}
                className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Filter className="w-4 h-4 text-gray-500" />
                <span>{filtersVisible ? 'Hide' : 'Show'} Filters</span>
              </button>
            )}
            
            {/* Column visibility */}
            {showColumnsSelector && onShowColumns && (
              <button
                onClick={() => handleMenuItemClick(onShowColumns)}
                className={`w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors ${
                  showFiltersToggle && onToggleFilters ? 'border-t border-gray-100' : ''
                }`}
              >
                <Columns3 className="w-4 h-4 text-gray-500" />
                <span>Columns</span>
              </button>
            )}
            
            {/* Density */}
            {showDensityControl && onDensityChange && (
              <div className={`px-4 py-2.5 ${
                (showFiltersToggle && onToggleFilters) || (showColumnsSelector && onShowColumns) ? 'border-t border-gray-100' : ''
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Density</span>
                </div>
                <div className="flex gap-1">
                  {(['compact', 'standard', 'comfortable'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => {
                        onDensityChange(d);
                        // Don't close menu when changing density
                      }}
                      className={`px-2 py-1 text-xs rounded-[3px] transition-colors ${
                        density === d
                          ? 'bg-[#5C1F3D] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Export */}
            {showExportOption && onExport && (
              <button
                onClick={() => handleMenuItemClick(onExport)}
                className={`w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors ${
                  (showFiltersToggle && onToggleFilters) || (showColumnsSelector && onShowColumns) || (showDensityControl && onDensityChange) ? 'border-t border-gray-100' : ''
                }`}
              >
                <Download className="w-4 h-4 text-gray-500" />
                <span>Export</span>
              </button>
            )}
            
            {/* Custom options */}
            {customOptions.map((option) => (
              <Fragment key={option.id}>
                {option.divider && <div className="border-t border-gray-200 my-1" />}
                <button
                  onClick={() => handleMenuItemClick(option.onClick)}
                  className="w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}