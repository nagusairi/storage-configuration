import { useState, useRef, useEffect, ReactNode } from 'react';
import { MoreVertical, Filter, AlignJustify, Columns, Download } from 'lucide-react';

/**
 * TableToolbarOptionsMenu Component
 * 
 * A reusable three-dot vertical menu button with dropdown for table toolbar actions.
 * Provides quick access to Filters, Density, Columns, and Export functionality.
 * 
 * @component
 * @example
 * ```tsx
 * <TableToolbarOptionsMenu
 *   onToggleFilters={() => setShowFilters(!showFilters)}
 *   onToggleDensity={() => setShowDensityMenu(true)}
 *   onToggleColumns={() => setShowColumnSelector(true)}
 *   onExport={() => handleExport()}
 *   showFiltersOption={true}
 *   showDensityOption={true}
 *   showColumnsOption={true}
 *   showExportOption={true}
 * />
 * ```
 */

export interface TableToolbarOptionsMenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  divider?: boolean;
  visible?: boolean;
}

export interface TableToolbarOptionsMenuProps {
  /**
   * Callback when Filters option is clicked
   */
  onToggleFilters?: () => void;
  
  /**
   * Callback when Density option is clicked
   */
  onToggleDensity?: () => void;
  
  /**
   * Callback when Columns option is clicked
   */
  onToggleColumns?: () => void;
  
  /**
   * Callback when Export option is clicked
   */
  onExport?: () => void;
  
  /**
   * Whether to show the Filters menu item
   * @default true
   */
  showFiltersOption?: boolean;
  
  /**
   * Whether to show the Density menu item
   * @default true
   */
  showDensityOption?: boolean;
  
  /**
   * Whether to show the Columns menu item
   * @default true
   */
  showColumnsOption?: boolean;
  
  /**
   * Whether to show the Export menu item
   * @default true
   */
  showExportOption?: boolean;
  
  /**
   * Custom menu items to append to the default options
   */
  customMenuItems?: TableToolbarOptionsMenuItem[];
  
  /**
   * Additional CSS classes for the trigger button
   */
  className?: string;
  
  /**
   * Size variant for the trigger button
   * @default 'default'
   */
  size?: 'small' | 'default' | 'large';
}

/**
 * TableToolbarOptionsMenu Component
 * 
 * Displays a three-dot vertical menu button that opens a dropdown with table options.
 * Commonly used in table toolbars for actions like toggling filters, columns, density settings, and export.
 */
export function TableToolbarOptionsMenu({
  onToggleFilters,
  onToggleDensity,
  onToggleColumns,
  onExport,
  showFiltersOption = true,
  showDensityOption = true,
  showColumnsOption = true,
  showExportOption = true,
  customMenuItems = [],
  className = '',
  size = 'default'
}: TableToolbarOptionsMenuProps) {
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
  
  // Button size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'p-1.5 h-8';
      case 'large':
        return 'p-2.5 h-12';
      default:
        return 'p-2 h-10';
    }
  };
  
  // Icon size classes
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'w-3.5 h-3.5';
      case 'large':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };
  
  const handleMenuItemClick = (callback?: () => void) => {
    setShowMenu(false);
    if (callback) {
      callback();
    }
  };
  
  // Default menu items
  const defaultMenuItems: TableToolbarOptionsMenuItem[] = [
    {
      id: 'filters',
      label: 'Filters',
      icon: <Filter className={`${getIconSize()} text-gray-500`} />,
      onClick: () => handleMenuItemClick(onToggleFilters),
      visible: showFiltersOption && !!onToggleFilters
    },
    {
      id: 'density',
      label: 'Density',
      icon: <AlignJustify className={`${getIconSize()} text-gray-500`} />,
      onClick: () => handleMenuItemClick(onToggleDensity),
      divider: showFiltersOption && !!onToggleFilters,
      visible: showDensityOption && !!onToggleDensity
    },
    {
      id: 'columns',
      label: 'Columns',
      icon: <Columns className={`${getIconSize()} text-gray-500`} />,
      onClick: () => handleMenuItemClick(onToggleColumns),
      divider: (showFiltersOption && !!onToggleFilters) || (showDensityOption && !!onToggleDensity),
      visible: showColumnsOption && !!onToggleColumns
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download className={`${getIconSize()} text-gray-500`} />,
      onClick: () => handleMenuItemClick(onExport),
      divider: (showFiltersOption && !!onToggleFilters) || (showDensityOption && !!onToggleDensity) || (showColumnsOption && !!onToggleColumns),
      visible: showExportOption && !!onExport
    }
  ];
  
  // Combine default and custom menu items
  const allMenuItems = [
    ...defaultMenuItems.filter(item => item.visible !== false),
    ...customMenuItems.filter(item => item.visible !== false)
  ];
  
  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${getSizeClasses()} rounded hover:bg-gray-100 transition-colors border border-gray-300 ${className}`}
        aria-label="More options"
        aria-expanded={showMenu}
        aria-haspopup="true"
      >
        <MoreVertical className={`${getIconSize()} text-gray-600`} />
      </button>
      
      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
            aria-hidden="true"
          />
          
          {/* Menu Content */}
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48">
            {allMenuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors text-left ${
                  item.divider ? 'border-t border-gray-100' : ''
                } ${
                  index === 0 ? 'rounded-t-lg' : ''
                } ${
                  index === allMenuItems.length - 1 ? 'rounded-b-lg' : ''
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
