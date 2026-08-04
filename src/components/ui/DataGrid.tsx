import React, { useState, useMemo, useRef, useEffect, ReactNode, Fragment } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  MoreVertical,
  Download,
  Eye,
  EyeOff,
  Columns3,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StyledSelect, MenuItem } from './StyledSelect';
import { StyledTextField } from './StyledTextField';
import { StyledButton } from './StyledButton';
import { PaginationBar } from './PaginationBar';
import { DataGridOptionsMenu } from './DataGridOptionsMenu';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface DataGridColumn<T = any> {
  id: string;
  label: string;
  sortable?: boolean;
  width?: string;
  minWidth?: number;
  pinned?: 'left' | 'right'; // NEW: Support pinned property on columns
  render: (row: T, hoveredRow: number | string | null) => ReactNode;
  className?: string;
}

export interface DataGridFilter {
  id: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'custom';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  customRender?: (value: any, onChange: (value: any) => void) => ReactNode;
  minWidth?: number;
}

export interface DataGridRowAction<T = any> {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'danger';
  visible?: (row: T) => boolean;
}

export interface DataGridBulkAction {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: (selectedRows: any[]) => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface DataGridMoreOption {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  divider?: boolean;
}

export interface DataGridProps<T = any> {
  // Data
  data: T[];
  columns: DataGridColumn<T>[];
  rowKey: string | ((row: T) => string | number);
  
  // Search
  searchEnabled?: boolean;
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  onSearch?: (searchTerm: string, data: T[]) => T[];
  searchExpandable?: boolean;
  searchActions?: ReactNode;
  
  // Filters
  filters?: DataGridFilter[];
  defaultFilters?: Record<string, any>;
  onFilter?: (filters: Record<string, any>, data: T[]) => T[];
  showAdvancedFilters?: boolean;
  onAdvancedFiltersClick?: () => void;
  
  // Sorting
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc' | null;
  onSort?: (field: string, direction: 'asc' | 'desc' | null, data: T[]) => T[];
  
  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];
  
  // Selection
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedRows: (string | number)[]) => void;
  
  // Actions
  rowActions?: DataGridRowAction<T>[];
  bulkActions?: DataGridBulkAction[];
  onRowClick?: (row: T) => void;
  
  // Customization
  defaultVisibleColumns?: string[];
  onColumnVisibilityChange?: (visibleColumns: string[]) => void;
  defaultDensity?: 'compact' | 'standard' | 'comfortable';
  
  // Export
  exportEnabled?: boolean;
  onExport?: (data: T[]) => void;
  exportFileName?: string;
  
  // More Options
  moreOptions?: DataGridMoreOption[];
  
  // Expandable Rows
  expandable?: boolean;
  renderExpandedRow?: (row: T) => ReactNode;
  defaultExpandedRows?: (string | number)[];
  expandableColumn?: string; // NEW: Which column should display the chevron icon
  pinnedColumns?: string[]; // NEW: Which columns should be sticky/pinned
  
  // UI
  emptyMessage?: string;
  className?: string;
  hideToolbar?: boolean;
  hideFilters?: boolean;
  hidePagination?: boolean;
  hideBorder?: boolean; // NEW: Hide the outer border of the DataGrid container
  disablePaddingX?: boolean; // NEW: Remove horizontal padding from toolbar, filters, and table cells
  tableBorder?: boolean; // NEW: Add border to table section only (not toolbar/filters/pagination)
  tableBorderRadius?: string; // NEW: Add border radius to table section (e.g., "8px" or "lg")
  customBanner?: ReactNode; // NEW: Custom banner to display between filters and table
  toolbarActions?: ReactNode; // NEW: Custom actions to display in toolbar (right side, after search)
  toolbarActionsLeft?: ReactNode; // NEW: Custom actions to display in toolbar (left side, before filters)
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DataGrid<T = any>({
  data,
  columns,
  rowKey,
  searchEnabled = true,
  searchPlaceholder = 'Search...',
  searchFields = [],
  onSearch,
  searchExpandable = false,
  searchActions,
  filters = [],
  defaultFilters = {},
  onFilter,
  showAdvancedFilters = false,
  onAdvancedFiltersClick,
  defaultSortField,
  defaultSortDirection = null,
  onSort,
  pageSize: defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  selectable = false,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  rowActions = [],
  bulkActions = [],
  onRowClick,
  defaultVisibleColumns,
  onColumnVisibilityChange,
  defaultDensity = 'standard',
  exportEnabled = false,
  onExport,
  exportFileName = 'export.csv',
  moreOptions = [],
  expandable = false,
  renderExpandedRow,
  defaultExpandedRows = [],
  expandableColumn,
  pinnedColumns,
  emptyMessage = 'No data available',
  className = '',
  hideToolbar = false,
  hideFilters = false,
  hidePagination = false,
  hideBorder = false, // NEW: Hide the outer border of the DataGrid container
  disablePaddingX = false, // NEW: Remove horizontal padding from toolbar, filters, and table cells
  tableBorder = false, // NEW: Add border to table section only (not toolbar/filters/pagination)
  tableBorderRadius = '8px', // NEW: Add border radius to table section (e.g., "8px" or "lg")
  customBanner, // NEW: Custom banner to display between filters and table
  toolbarActions, // NEW: Custom actions to display in toolbar (right side, after search)
  toolbarActionsLeft // NEW: Custom actions to display in toolbar (left side, before filters)
}: DataGridProps<T>) {
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(defaultFilters);
  const [sortField, setSortField] = useState<string | null>(defaultSortField || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(defaultSortDirection);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [internalSelectedRows, setInternalSelectedRows] = useState<(string | number)[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | string | null>(null);
  const [hoveredHeader, setHoveredHeader] = useState(false);
  const [openRowActionMenu, setOpenRowActionMenu] = useState<number | string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [showFiltersSection, setShowFiltersSection] = useState(!hideFilters);
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    defaultVisibleColumns || columns.map(col => col.id)
  );
  const [density, setDensity] = useState<'compact' | 'standard' | 'comfortable'>(defaultDensity);
  const [expandedRows, setExpandedRows] = useState<(string | number)[]>(defaultExpandedRows);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);
  
  // Use controlled or uncontrolled selection
  const selectedRows = controlledSelectedRows !== undefined ? controlledSelectedRows : internalSelectedRows;
  const setSelectedRows = (rows: (string | number)[]) => {
    if (onSelectionChange) {
      onSelectionChange(rows);
    } else {
      setInternalSelectedRows(rows);
    }
  };
  
  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  const getRowKey = (row: T): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return (row as any)[rowKey];
  };
  
  const getDensityPadding = () => {
    switch (density) {
      case 'compact':
        return 'px-4 py-2';
      case 'comfortable':
        return 'px-6 py-4';
      default:
        return 'px-6 py-3';
    }
  };
  
  // Calculate left offset for pinned columns
  const getPinnedColumnOffset = (columnId: string): number => {
    const column = columns.find(col => col.id === columnId);
    const pinnedFromProp = pinnedColumns?.includes(columnId);
    const pinnedFromColumn = column?.pinned === 'left';
    
    if (!pinnedFromProp && !pinnedFromColumn) {
      return 0;
    }
    
    let offset = 0;
    
    // Add checkbox column width if selectable
    if (selectable) {
      offset += 48; // Checkbox column is w-12 (48px)
    }
    
    // Add chevron column width if expandable
    if (expandable) {
      offset += 48; // Chevron column is w-12 (48px)
    }
    
    // Add widths of all visible columns before this pinned column
    const visibleCols = columns.filter(col => visibleColumns.includes(col.id));
    const columnIndex = visibleCols.findIndex(col => col.id === columnId);
    
    for (let i = 0; i < columnIndex; i++) {
      const col = visibleCols[i];
      const isColPinned = pinnedColumns?.includes(col.id) || col.pinned === 'left';
      if (isColPinned) {
        // Use minWidth if available, otherwise default to 150px
        offset += col.minWidth || 150;
      }
    }
    
    return offset;
  };
  
  // Check if a column is pinned
  const isColumnPinned = (columnId: string): boolean => {
    const column = columns.find(col => col.id === columnId);
    return (pinnedColumns ? pinnedColumns.includes(columnId) : false) || column?.pinned === 'left';
  };
  
  // ============================================================================
  // DATA PROCESSING
  // ============================================================================
  
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply search
    if (searchEnabled && searchTerm) {
      if (onSearch) {
        result = onSearch(searchTerm, result);
      } else {
        result = result.filter(row => {
          if (searchFields.length === 0) {
            // Search all string fields
            return Object.values(row as any).some(value =>
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
          } else {
            // Search specified fields
            return searchFields.some(field =>
              String((row as any)[field]).toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
        });
      }
    }
    
    // Apply filters
    const activeFilterEntries = Object.entries(activeFilters).filter(([_, value]) => value !== '' && value !== null && value !== undefined);
    if (activeFilterEntries.length > 0) {
      if (onFilter) {
        result = onFilter(activeFilters, result);
      } else {
        result = result.filter(row => {
          return activeFilterEntries.every(([key, value]) => {
            return (row as any)[key] === value;
          });
        });
      }
    }
    
    // Apply sorting
    if (sortField && sortDirection) {
      if (onSort) {
        result = onSort(sortField, sortDirection, result);
      } else {
        result = [...result].sort((a, b) => {
          const aValue = (a as any)[sortField];
          const bValue = (b as any)[sortField];
          
          if (aValue === bValue) return 0;
          
          const comparison = aValue > bValue ? 1 : -1;
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }
    }
    
    return result;
  }, [data, searchTerm, activeFilters, sortField, sortDirection, searchEnabled, searchFields, onSearch, onFilter, onSort]);
  
  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);
  
  // Reset to page 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters]);
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const toggleRowSelection = (key: string | number) => {
    if (selectedRows.includes(key)) {
      setSelectedRows(selectedRows.filter(k => k !== key));
    } else {
      setSelectedRows([...selectedRows, key]);
    }
  };
  
  const toggleAll = () => {
    if (selectedRows.length === paginatedData.length && paginatedData.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(row => getRowKey(row)));
    }
  };
  
  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };
  
  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
  };
  
  const handleExport = () => {
    if (onExport) {
      onExport(processedData);
    } else {
      // Default CSV export
      const headers = columns.filter(col => visibleColumns.includes(col.id)).map(col => col.label);
      const rows = processedData.map(row => 
        columns.filter(col => visibleColumns.includes(col.id)).map(col => (row as any)[col.id])
      );
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportFileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };
  
  const toggleColumnVisibility = (columnId: string) => {
    const newVisibleColumns = visibleColumns.includes(columnId)
      ? visibleColumns.filter(id => id !== columnId)
      : [...visibleColumns, columnId];
    
    setVisibleColumns(newVisibleColumns);
    if (onColumnVisibilityChange) {
      onColumnVisibilityChange(newVisibleColumns);
    }
  };
  
  const toggleRowExpansion = (key: string | number) => {
    if (expandedRows.includes(key)) {
      setExpandedRows(expandedRows.filter(k => k !== key));
    } else {
      setExpandedRows([...expandedRows, key]);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target as Node)) {
        setShowMoreOptionsMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const renderColumnHeader = (columnId: string, columnLabel: string) => {
    const column = columns.find(col => col.id === columnId);
    const isPinned = isColumnPinned(columnId);
    const pinnedOffset = getPinnedColumnOffset(columnId);
    
    const pinnedStyles = isPinned ? {
      position: 'sticky' as const,
      left: `${pinnedOffset}px`,
      zIndex: 10,
      backgroundColor: '#f9fafb' // bg-gray-50
    } : {};
    
    if (!column?.sortable) {
      return (
        <th 
          key={columnId}
          className={`text-left ${getDensityPadding()} text-xs text-gray-500 uppercase tracking-wider ${column?.className || ''} ${isPinned ? 'shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]' : ''}`}
          style={{ width: column?.width, minWidth: column?.minWidth, ...pinnedStyles }}
        >
          <div className="flex items-center gap-2">
            <span>{columnLabel}</span>
          </div>
        </th>
      );
    }
    
    return (
      <th 
        key={columnId}
        className={`text-left ${getDensityPadding()} text-xs text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${column?.className || ''} ${isPinned ? 'shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]' : ''}`}
        onClick={() => handleSort(columnId)}
        style={{ width: column?.width, minWidth: column?.minWidth, ...pinnedStyles }}
      >
        <div className="flex items-center gap-2">
          <span>{columnLabel}</span>
          {sortField === columnId && (
            sortDirection === 'asc' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )
          )}
          {sortField !== columnId && column.sortable && (
            <ArrowUpDown className="w-3 h-3 opacity-30" />
          )}
        </div>
      </th>
    );
  };
  
  const activeFilterCount = Object.values(activeFilters).filter(v => v !== '' && v !== null && v !== undefined).length;
  const hasActiveFilters = searchTerm !== '' || activeFilterCount > 0;
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <div className="datagrid-container">
      {/* Main container - ONE unified border for toolbar, filters, and table */}
      <div className={`${hideBorder ? '' : "border border-gray-300 rounded-lg overflow-hidden"} ${className}`}>
        {/* Toolbar */}
        {!hideToolbar && (
          <div className={`bg-white ${disablePaddingX ? '' : 'px-4'} py-3 flex items-center justify-between border-b border-gray-200`}>
            {/* Left side */}
            <div className="flex items-center gap-3">
              {/* Custom actions - left side (FIRST) */}
              {toolbarActionsLeft}
              
              {/* Filters toggle button (SECOND) */}
              {filters.length > 0 && (
                <button
                  onClick={() => setShowFiltersSection(!showFiltersSection)}
                  className="px-3 py-2 h-9 text-sm rounded-[3px] transition-colors flex items-center gap-2 border border-gray-300 hover:bg-gray-50 relative"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="px-1.5 py-0.5 text-xs rounded-full bg-[#5C1F3D] text-white min-w-[18px] text-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              )}
              
              {/* Bulk actions (THIRD) */}
              {selectable && selectedRows.length > 0 && bulkActions.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedRows.length} selected
                  </span>
                  {bulkActions.map(action => (
                    <StyledButton
                      key={action.id}
                      variant={action.variant || 'secondary'}
                      size="small"
                      onClick={() => {
                        const selected = data.filter(row => selectedRows.includes(getRowKey(row)));
                        action.onClick(selected);
                      }}
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </StyledButton>
                  ))}
                </div>
              )}
            </div>
            
            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search */}
              {searchEnabled && (
                <>
                  {searchExpandable ? (
                    <div className="flex items-center gap-2">
                      {/* Search actions (e.g., lightbulb icon) - FIRST */}
                      {searchActions}
                      {/* Expandable search - SECOND */}
                      <div className={`flex items-center transition-all duration-300 ${searchExpanded ? 'w-64' : 'w-auto'}`}>
                        {searchExpanded ? (
                          <StyledTextField
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={searchPlaceholder}
                            icon={<Search className="w-4 h-4 text-gray-400" />}
                            iconPosition="start"
                            autoFocus
                            onBlur={() => {
                              if (!searchTerm) {
                                setSearchExpanded(false);
                              }
                            }}
                            sx={{ width: '100%' }}
                          />
                        ) : (
                          <button
                            onClick={() => setSearchExpanded(true)}
                            className="hover:bg-gray-100 rounded transition-colors flex items-center justify-center"
                            style={{ width: "32px", height: "32px" }}
                            title="Search"
                          >
                            <Search className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Non-expandable search */
                    <div className="flex items-center gap-2">
                      {/* Search actions (e.g., lightbulb icon) - FIRST */}
                      {searchActions}
                      {/* Search field - SECOND */}
                      <StyledTextField
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={searchPlaceholder}
                        icon={<Search className="w-4 h-4 text-gray-400" />}
                        iconPosition="start"
                        sx={{ width: '256px' }}
                      />
                    </div>
                  )}
                </>
              )}
              
              {/* More options menu - REMOVED FROM HERE, moved to table header */}
              {toolbarActions}
            </div>
          </div>
        )}
        
        {/* Filters section */}
        {showFiltersSection && filters.length > 0 && (
          <div className={`bg-gray-50 ${disablePaddingX ? '' : 'px-4'} py-3 border-b border-gray-200 flex flex-wrap items-end gap-3`}>
            {filters.map(filter => (
              <div key={filter.id} className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">{filter.label}</label>
                {filter.type === 'select' && (
                  <StyledSelect
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    fullWidth={false}
                    minWidth={filter.minWidth || 150}
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                      {filter.placeholder || 'All'}
                    </MenuItem>
                    {filter.options?.map(option => (
                      <MenuItem 
                        key={option.value} 
                        value={option.value}
                        style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                )}
                {filter.type === 'text' && (
                  <StyledTextField
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    placeholder={filter.placeholder}
                    style={{ width: filter.minWidth || 150 }}
                  />
                )}
                {filter.type === 'custom' && filter.customRender && (
                  filter.customRender(activeFilters[filter.id], (value) => handleFilterChange(filter.id, value))
                )}
              </div>
            ))}
            
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 h-10 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>Clear all</span>
              </button>
            )}
            
            {showAdvancedFilters && (
              <button
                onClick={onAdvancedFiltersClick}
                className="px-3 py-2 h-10 text-sm text-[#5C1F3D] hover:underline"
              >
                Advanced Filters
              </button>
            )}
          </div>
        )}
        
        {/* Filter summary banner */}
        {hasActiveFilters && (
          <div className="bg-blue-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-blue-900">
              <Filter className="w-4 h-4" />
              <span>
                Showing {processedData.length} of {data.length} results
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-700 hover:text-blue-900 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
        
        {/* Custom banner */}
        {customBanner}
        
        {/* Table - conditional border on table section only */}
        <div 
          ref={scrollRef}
          className={tableBorder ? 'border border-gray-300' : ''}
          style={{
            overflow: 'visible',
            ...(tableBorder && tableBorderRadius ? { borderRadius: tableBorderRadius } : {})
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table className="w-full" style={{ tableLayout: 'auto' }}>
              <thead 
                className="bg-gray-50 border-b border-gray-200"
                onMouseEnter={() => setHoveredHeader(true)}
                onMouseLeave={() => setHoveredHeader(false)}
              >
                <tr>
                  {selectable && (
                    <th 
                      className={`w-12 ${getDensityPadding()} text-center shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]`}
                      style={{
                        position: 'sticky',
                        left: 0,
                        zIndex: 10,
                        backgroundColor: '#f9fafb'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                        onChange={toggleAll}
                        className="rounded border-gray-300 text-[#5C1F3D] focus:ring-[#5C1F3D] cursor-pointer"
                      />
                    </th>
                  )}
                  {/* Expandable chevron column header */}
                  {expandable && (
                    <th 
                      className="w-12 text-center shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                      style={{
                        position: 'sticky',
                        left: selectable ? '48px' : 0,
                        zIndex: 10,
                        backgroundColor: '#f9fafb'
                      }}
                    >
                      {/* Empty header for chevron column */}
                    </th>
                  )}
                  {columns.filter(col => visibleColumns.includes(col.id)).map(col => 
                    renderColumnHeader(col.id, col.label)
                  )}
                  {/* More options menu - positioned on right side of header */}
                  <th className={`w-12 ${getDensityPadding()}`}>
                    <div className="flex items-center justify-end">
                      {hoveredHeader && (
                        <div className="transition-opacity duration-200">
                          <DataGridOptionsMenu
                            showFiltersToggle={filters.length > 0}
                            onToggleFilters={() => setShowFiltersSection(!showFiltersSection)}
                            filtersVisible={showFiltersSection}
                            onShowColumns={() => setShowColumnSelector(true)}
                            density={density}
                            onDensityChange={setDensity}
                            showExportOption={exportEnabled}
                            onExport={handleExport}
                            customOptions={moreOptions}
                            stopPropagation={true}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td 
                      colSpan={columns.length + (selectable ? 1 : 0) + 1}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => {
                    const key = getRowKey(row);
                    const isSelected = selectedRows.includes(key);
                    const visibleRowActions = rowActions.filter(action => 
                      !action.visible || action.visible(row)
                    );
                    
                    const mainRow = (
                      <tr
                        key={key}
                        onMouseEnter={() => setHoveredRow(key)}
                        onMouseLeave={() => {
                          setHoveredRow(null);
                          setOpenRowActionMenu(null);
                        }}
                        onClick={(e) => {
                          // Only trigger row click if clicking on td element (not on interactive children)
                          if (onRowClick && (e.target as HTMLElement).tagName === 'TD') {
                            onRowClick(row);
                          }
                        }}
                        className={`border-b border-gray-100 transition-colors ${
                          onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                        } ${isSelected ? 'bg-blue-50' : ''}`}
                      >
                        {selectable && (
                          <td 
                            className={`w-12 ${getDensityPadding()} text-center shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]`}
                            style={{
                              position: 'sticky',
                              left: 0,
                              zIndex: 10,
                              backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleRowSelection(key);
                              }}
                              className="rounded border-gray-300 text-[#5C1F3D] focus:ring-[#5C1F3D] cursor-pointer"
                            />
                          </td>
                        )}
                        {/* Expandable chevron column */}
                        {expandable && (
                          <td 
                            className="w-12 text-center shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                            style={{
                              position: 'sticky',
                              left: selectable ? '48px' : 0,
                              zIndex: 10,
                              backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF'
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpansion(key);
                              }}
                              className="p-1 rounded hover:bg-gray-100 transition-all flex-shrink-0"
                              title={expandedRows.includes(key) ? 'Collapse' : 'Expand'}
                            >
                              {expandedRows.includes(key) ? (
                                <ChevronUp className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                          </td>
                        )}
                        {columns.filter(col => visibleColumns.includes(col.id)).map(col => {
                          const isPinned = isColumnPinned(col.id);
                          const pinnedOffset = getPinnedColumnOffset(col.id);
                          const isExpandableCol = expandable && expandableColumn === col.id;
                          
                          const pinnedStyles = isPinned ? {
                            position: 'sticky' as const,
                            left: `${pinnedOffset}px`,
                            zIndex: 10,
                            backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF' // bg-blue-50 or bg-white
                          } : {};
                          
                          return (
                            <td 
                              key={col.id} 
                              className={`${getDensityPadding()} ${col.className || ''} ${isPinned ? 'shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]' : ''}`}
                              style={{ width: col.width, minWidth: col.minWidth, ...pinnedStyles }}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 flex items-center gap-2">
                                  {/* Chevron icon in expandableColumn */}
                                  {isExpandableCol && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleRowExpansion(key);
                                      }}
                                      className="p-1 rounded hover:bg-gray-100 transition-all flex-shrink-0"
                                      title={expandedRows.includes(key) ? 'Collapse' : 'Expand'}
                                    >
                                      {expandedRows.includes(key) ? (
                                        <ChevronUp className="w-4 h-4 text-gray-600" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-600" />
                                      )}
                                    </button>
                                  )}
                                  {/* Column content */}
                                  {col.render(row, hoveredRow)}
                                </div>
                                
                                {/* Row actions - only show in first column */}
                                {col.id === columns.filter(c => visibleColumns.includes(c.id))[0]?.id && 
                                 visibleRowActions.length > 0 && (
                                  <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenRowActionMenu(openRowActionMenu === key ? null : key);
                                        setMenuPosition({ top: e.clientY, left: e.clientX });
                                      }}
                                      className={`p-1 rounded hover:bg-gray-200 transition-all ${
                                        hoveredRow === key ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                      }`}
                                    >
                                      <MoreVertical className="w-4 h-4 text-gray-600" />
                                    </button>
                                    
                                    {openRowActionMenu === key && menuPosition && createPortal(
                                      <>
                                        <div 
                                          className="fixed inset-0 z-[100]" 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenRowActionMenu(null);
                                            setMenuPosition(null);
                                          }}
                                        />
                                        <div 
                                          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[101] min-w-[180px]"
                                          style={{
                                            top: `${menuPosition.top}px`,
                                            left: `${menuPosition.left + 10}px`
                                          }}
                                        >
                                          {visibleRowActions.map((action, index) => (
                                            <button
                                              key={action.id}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenRowActionMenu(null);
                                                setMenuPosition(null);
                                                action.onClick(row);
                                              }}
                                              className={`dropdown-menu-item w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 transition-colors ${
                                                index === 0 ? 'rounded-t-lg' : ''
                                              } ${
                                                index === visibleRowActions.length - 1 ? 'rounded-b-lg' : ''
                                              } ${
                                                action.variant === 'danger' 
                                                  ? 'text-red-600 hover:bg-red-50' 
                                                  : 'text-gray-700'
                                              }`}
                                            >
                                              <span className={action.variant === 'danger' ? 'text-red-500' : 'text-gray-500'}>
                                                {action.icon}
                                              </span>
                                              <span>{action.label}</span>
                                            </button>
                                          ))}
                                        </div>
                                      </>,
                                      document.body
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                        {/* Empty cell for menu column - no chevron here anymore */}
                        <td className={`w-12 ${getDensityPadding()}`}>
                          {/* Empty - menu appears on hover in header */}
                        </td>
                      </tr>
                    );
                    
                    // Return array instead of Fragment to avoid Figma inspector issues
                    const rows = [mainRow];
                    
                    if (expandable && expandedRows.includes(key) && renderExpandedRow) {
                      rows.push(
                        <tr key={`${key}-expanded`}>
                          <td 
                            colSpan={columns.length + (selectable ? 1 : 0) + 1}
                            className="px-6 py-4 bg-gray-50"
                          >
                            {renderExpandedRow(row)}
                          </td>
                        </tr>
                      );
                    }
                    
                    return rows;
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        {!hidePagination && processedData.length > 0 && (
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            pageSizeOptions={pageSizeOptions}
          />
        )}
        
        {/* Column selector modal */}
        {showColumnSelector && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
              onClick={() => setShowColumnSelector(false)}
            />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[400px]">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-base">Select Columns</h3>
                <button
                  onClick={() => setShowColumnSelector(false)}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 max-h-[400px] overflow-y-auto">
                <div className="space-y-2">
                  {columns.map(col => (
                    <label key={col.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.id)}
                        onChange={() => toggleColumnVisibility(col.id)}
                        className="rounded border-gray-300 text-[#5C1F3D] focus:ring-[#5C1F3D]"
                      />
                      <span className="text-sm text-gray-700">{col.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50 rounded-b-xl">
                <StyledButton
                  variant="outline"
                  size="small"
                  onClick={() => setShowColumnSelector(false)}
                >
                  Close
                </StyledButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}