/**
 * FullFunctionalTable Component
 * 
 * A comprehensive, enterprise-grade reusable data table component with:
 * - Multi-row selection with checkboxes
 * - Column sorting (asc/desc/none)
 * - Sticky columns (checkbox + first data column)
 * - Row-level actions via portal-rendered dropdown
 * - Bulk actions for selected rows
 * - Column visibility toggle
 * - Three density modes (compact, standard, comfortable)
 * - Horizontal scroll detection with visual indicators
 * - Empty/loading/error states
 * - Full accessibility (ARIA, keyboard navigation)
 * - Performance optimized with memoization
 */

import React, { Fragment, useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown as ChevronDownIcon,
  Package,
  Search,
  AlertTriangle,
  RefreshCw,
  Plus,
  Download,
  Trash2,
  Eye,
  Edit,
  Calendar,
  Info,
  X,
  XCircle,
  Settings2,
  Columns3,
  SlidersHorizontal,
  FileDown,
  Check,
} from 'lucide-react';
import { StyledSelect, MenuItem } from './StyledSelect';
import {
  FullFunctionalTableProps,
  ColumnConfig,
  DensityType,
  SortDirection,
  DateRangeValue,
} from './FullFunctionalTable.types';
import { FilterToggleButton } from './FilterToggleButton';
import { CloseButton } from './CloseButton';

export function FullFunctionalTable<T extends Record<string, any>>({
  // Required props
  data,
  columns,
  rowKey,
  
  // Selection props
  selectable = false,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  
  // Sorting props
  sortable = true,
  defaultSort,
  onSort,
  
  // Pagination props
  pageSize: controlledPageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  currentPage: controlledCurrentPage = 1,
  onPageChange,
  onPageSizeChange,
  
  // Column visibility props
  defaultVisibleColumns,
  onColumnVisibilityChange,
  
  // Density props
  density: controlledDensity = 'standard',
  onDensityChange,
  
  // Row actions
  rowActions = [],
  bulkActions = [],
  onRowClick,
  
  // States
  isLoading = false,
  error = null,
  
  // Messages
  emptyMessage = 'No items found',
  noResultsMessage = 'No results found',
  loadingMessage = 'Loading items...',
  
  // Callbacks
  onRetry,
  onAddNew,
  
  // Styling
  className = '',
  headerClassName = '',           // NEW: Custom className for table headers
  
  // Features
  enableSearch = false,
  searchExpandable = false,             // NEW: Make search collapsible/expandable
  searchPlaceholder = 'Search...',
  searchFields = [],
  
  // Filter props
  filters,
  defaultFilters,
  onFilter,
  filterLogic = 'AND',
  persistFiltersInURL = false,
  onFilterChange,
  
  // Toolbar Actions
  primaryAction,
  
  // Expandable rows props
  expandable = false,
  childRowRender,
  expandedRows: controlledExpandedRows,
  onExpandedRowsChange,
  defaultExpandedRows = [],
}: FullFunctionalTableProps<T>) {
  // Internal state management
  const [internalSelectedRows, setInternalSelectedRows] = useState<any[]>([]);
  const [internalCurrentPage, setInternalCurrentPage] = useState(controlledCurrentPage);
  const [internalPageSize, setInternalPageSize] = useState(controlledPageSize);
  const [internalDensity, setInternalDensity] = useState<DensityType>(controlledDensity);
  const [internalExpandedRows, setInternalExpandedRows] = useState<string[]>(defaultExpandedRows);
  
  // Use controlled or uncontrolled state
  const selectedRows = controlledSelectedRows ?? internalSelectedRows;
  const setSelectedRows = onSelectionChange ?? setInternalSelectedRows;
  const currentPage = controlledCurrentPage ?? internalCurrentPage;
  const setCurrentPage = onPageChange ?? setInternalCurrentPage;
  const pageSize = controlledPageSize ?? internalPageSize;
  const setPageSize = onPageSizeChange ?? setInternalPageSize;
  const density = controlledDensity ?? internalDensity;
  const expandedRows = controlledExpandedRows ?? internalExpandedRows;
  const setExpandedRows = onExpandedRowsChange ?? setInternalExpandedRows;
  
  // Sorting state
  const [sortField, setSortField] = useState<keyof T | null>(defaultSort?.field ?? null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSort?.direction ?? null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(!searchExpandable); // Collapsed by default if expandable
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    defaultVisibleColumns ?? columns.map(col => col.id)
  );
  
  // UI state
  const [hoveredRow, setHoveredRow] = useState<any>(null);
  const [openDropdown, setOpenDropdown] = useState<any>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isTableScrolled, setIsTableScrolled] = useState(false);
  
  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(
    defaultFilters || {}
  );
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRangeValue>({ start: '', end: '' });
  const [appliedDateRange, setAppliedDateRange] = useState<DateRangeValue | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('');
  
  // Refs
  const tableScrollRef = useRef<HTMLDivElement>(null);
  
  // Helper: Get density padding
  const getDensityPadding = useCallback(() => {
    switch (density) {
      case 'compact':
        return 'px-4 py-1.5';
      case 'comfortable':
        return 'px-4 py-4';
      default:
        return 'px-4 py-3';
    }
  }, [density]);
  
  // Helper: Render cell value with null handling
  const renderCellValue = useCallback((value: any, fallback: string = '-') => {
    return value ?? fallback;
  }, []);
  
  // Helper: Get sticky column background
  const getStickyColumnBg = useCallback((currentRowKey: any) => {
    return hoveredRow === currentRowKey ? '#F9FAFB' : '#FFFFFF';
  }, [hoveredRow]);
  
  // Helper: Toggle row expansion
  const toggleRowExpansion = useCallback((rowId: string) => {
    setExpandedRows((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter(id => id !== rowId);
      } else {
        return [...prev, rowId];
      }
    });
  }, [setExpandedRows]);
  
  // Search filter
  const searchedData = useMemo(() => {
    if (!enableSearch || !searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(item => {
      // Search in specified fields or all string fields
      const fieldsToSearch = searchFields.length > 0 
        ? searchFields 
        : Object.keys(item) as (keyof T)[];
      
      return fieldsToSearch.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        return false;
      });
    });
  }, [data, searchTerm, enableSearch, searchFields]);
  
  // Apply filters
  const filteredData = useMemo(() => {
    // If custom filter function provided, use it
    if (onFilter && (Object.keys(activeFilters).length > 0 || appliedDateRange)) {
      return onFilter(activeFilters, searchedData);
    }
    
    // Default filter logic
    let result = [...searchedData];
    
    // Apply each active filter
    if (filters) {
      filters.forEach(filter => {
        const filterValue = activeFilters[filter.id];
        if (!filterValue) return;
        
        if (filter.type === 'select') {
          result = result.filter(row => {
            const rowValue = String(row[filter.id as keyof T] || '');
            return rowValue === filterValue;
          });
        }
      });
    }
    
    // Apply date range filter if present
    if (appliedDateRange) {
      result = result.filter(row => {
        // Assumes row has a 'date' field - customize as needed
        const rowDate = row.date ? new Date(row.date) : null;
        if (!rowDate) return false;
        
        const startDate = new Date(appliedDateRange.start);
        const endDate = new Date(appliedDateRange.end);
        
        return rowDate >= startDate && rowDate <= endDate;
      });
    }
    
    return result;
  }, [searchedData, activeFilters, appliedDateRange, filters, onFilter]);
  
  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle null/undefined
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Numeric comparison
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredData, sortField, sortDirection]);
  
  // Paginate data
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);
  
  // Selection logic
  const isAllSelected = selectedRows.length === paginatedData.length && paginatedData.length > 0;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < paginatedData.length;
  
  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(row => row[rowKey]));
    }
  }, [isAllSelected, paginatedData, rowKey, setSelectedRows]);
  
  const toggleRow = useCallback((id: any) => {
    setSelectedRows((prev: any[]) =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  }, [setSelectedRows]);
  
  // Sort handler
  const handleSort = useCallback((field: keyof T) => {
    if (!sortable) return;
    
    if (sortField !== field) {
      setSortField(field);
      setSortDirection('asc');
      onSort?.(field, 'asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
      onSort?.(field, 'desc');
    } else {
      setSortField(null);
      setSortDirection(null);
      onSort?.(field, null);
    }
  }, [sortable, sortField, sortDirection, onSort]);
  
  /**
   * Handle individual filter change
   */
  const handleFilterChange = useCallback((filterId: string, value: any) => {
    setActiveFilters(prev => {
      const newFilters = {
        ...prev,
        [filterId]: value || undefined
      };
      
      // Remove undefined keys
      Object.keys(newFilters).forEach(key => {
        if (newFilters[key] === undefined || newFilters[key] === '') {
          delete newFilters[key];
        }
      });
      
      // Call onChange callback
      onFilterChange?.(newFilters);
      
      return newFilters;
    });
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
    
    // Clear selection when filters change
    if (selectable && selectedRows.length > 0) {
      setSelectedRows([]);
    }
  }, [onFilterChange, selectable, selectedRows.length, setCurrentPage, setSelectedRows]);

  /**
   * Clear all filters
   */
  const handleClearAllFilters = useCallback(() => {
    setActiveFilters({});
    setAppliedDateRange(null);
    setTempDateRange({ start: '', end: '' });
    setSelectedDateRange('');
    setSearchTerm('');
    setCurrentPage(1);
    setSelectedRows([]);
    
    onFilterChange?.({});
  }, [onFilterChange, setCurrentPage, setSelectedRows]);

  /**
   * Clear individual filter
   */
  const handleClearFilter = useCallback((filterId: string) => {
    handleFilterChange(filterId, '');
  }, [handleFilterChange]);

  /**
   * Apply date range filter
   */
  const handleApplyDateRange = useCallback(() => {
    if (tempDateRange.start && tempDateRange.end) {
      setAppliedDateRange({ ...tempDateRange });
      setShowDateRangePicker(false);
      setCurrentPage(1);
      
      // Clear selection
      if (selectable && selectedRows.length > 0) {
        setSelectedRows([]);
      }
    }
  }, [tempDateRange, selectable, selectedRows.length, setCurrentPage, setSelectedRows]);

  /**
   * Clear date range filter
   */
  const handleClearDateRange = useCallback(() => {
    setAppliedDateRange(null);
    setTempDateRange({ start: '', end: '' });
    setSelectedDateRange('');
    setCurrentPage(1);
  }, [setCurrentPage]);
  
  /**
   * Handle density change
   */
  const handleDensityChange = useCallback((newDensity: DensityType) => {
    setInternalDensity(newDensity);
    onDensityChange?.(newDensity);
  }, [onDensityChange]);
  
  /**
   * Handle column visibility toggle
   */
  const handleToggleColumn = useCallback((columnId: string) => {
    setVisibleColumns(prev => {
      const newColumns = prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId];
      
      onColumnVisibilityChange?.(newColumns);
      return newColumns;
    });
  }, [onColumnVisibilityChange]);
  
  // Get visible columns (needed before handleExportCSV)
  const visibleColumnConfigs = useMemo(() => {
    return columns.filter(col => visibleColumns.includes(col.id));
  }, [columns, visibleColumns]);
  
  // Calculate active filter count (needed before keyboard shortcuts useEffect)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.values(activeFilters).forEach(value => {
      if (value) count++;
    });
    if (appliedDateRange) count++;
    return count;
  }, [activeFilters, appliedDateRange]);
  
  /**
   * Handle CSV export
   */
  const handleExportCSV = useCallback(() => {
    // Create CSV header
    const headers = visibleColumnConfigs.map(col => col.label).join(',');
    
    // Create CSV rows
    const rows = filteredData.map(row => {
      return visibleColumnConfigs.map(col => {
        const value = row[col.field];
        // Escape commas and quotes
        const stringValue = String(value ?? '');
        return stringValue.includes(',') || stringValue.includes('"')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      }).join(',');
    });
    
    // Combine header and rows
    const csv = [headers, ...rows].join('\n');
    
    // Create and download file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [visibleColumnConfigs, filteredData]);
  
  // Column header renderer
  const renderColumnHeader = useCallback((column: ColumnConfig<T>) => {
    const isSorted = sortField === column.field;
    const isAscending = sortDirection === 'asc';
    
    if (column.headerRender) {
      return column.headerRender();
    }
    
    return (
      <th
        key={column.id}
        onClick={() => column.sortable !== false && handleSort(column.field)}
        className={`
          ${getDensityPadding()} 
          text-xs text-gray-700 uppercase
          ${column.sortable !== false && sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}
          transition-colors
          ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
          ${headerClassName}
        `}
        style={{ fontWeight: 600 }}
        aria-sort={
          isSorted
            ? (isAscending ? 'ascending' : 'descending')
            : 'none'
        }
      >
        <div className={`flex items-center ${column.align === 'right' ? 'justify-end' : 'justify-between'} gap-2`}>
          <span>{column.label}</span>
          {column.sortable !== false && sortable && (
            isSorted ? (
              isAscending ? (
                <ArrowUp className="w-4 h-4 text-[#5C1F3D]" aria-hidden="true" />
              ) : (
                <ArrowDown className="w-4 h-4 text-[#5C1F3D]" aria-hidden="true" />
              )
            ) : (
              <ArrowUpDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
            )
          )}
        </div>
      </th>
    );
  }, [sortField, sortDirection, sortable, handleSort, getDensityPadding]);
  
  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (tableScrollRef.current) {
        setIsTableScrolled(tableScrollRef.current.scrollLeft > 0);
      }
    };
    
    const scrollContainer = tableScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (openDropdown !== null) {
        setOpenDropdown(null);
      }
    };
    
    const container = tableScrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [openDropdown]);
  
  // Close dropdown on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openDropdown !== null) {
          setOpenDropdown(null);
        }
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [openDropdown]);
  
  // Keyboard shortcuts for filtering
  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      ) {
        return;
      }
      
      // Ctrl+F / Cmd+F - Toggle filters (only if filters exist)
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && filters && filters.length > 0) {
        e.preventDefault();
        setShowFilters(prev => !prev);
      }
      
      // Escape - Close date range picker or clear all filters
      if (e.key === 'Escape') {
        if (showDateRangePicker) {
          setShowDateRangePicker(false);
          if (!appliedDateRange) {
            setTempDateRange({ start: '', end: '' });
          }
        } else if (activeFilterCount > 0) {
          handleClearAllFilters();
        }
      }
      
      // Ctrl+Shift+C / Cmd+Shift+C - Clear all filters
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C' && activeFilterCount > 0) {
        e.preventDefault();
        handleClearAllFilters();
      }
    };
    
    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [
    filters, 
    showDateRangePicker, 
    appliedDateRange, 
    activeFilterCount, 
    handleClearAllFilters
  ]);
  
  // Handle page size change
  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, [setPageSize, setCurrentPage]);

  // Get visible filters based on visibility conditions
  const visibleFilters = useMemo(() => {
    if (!filters) return [];
    return filters.filter(filter => {
      if (typeof filter.visible === 'function') {
        return filter.visible(activeFilters);
      }
      return filter.visible !== false;
    });
  }, [filters, activeFilters]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C1F3D] mb-4"></div>
        <p className="text-sm text-gray-500">{loadingMessage}</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to load data
        </h3>
        <p className="text-sm text-gray-500 mb-6 text-center">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-[#5C1F3D] text-white rounded-[3px] hover:bg-[#4a1831] flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }
  
  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Package className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Get started by adding your first item
        </p>
        {onAddNew && (
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-[#5C1F3D] text-white rounded-[3px] hover:bg-[#4a1831] flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        )}
      </div>
    );
  }
  
  // No results state
  if (sortedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <Search className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {noResultsMessage}
        </h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Try adjusting your search terms or filters
        </p>
        {enableSearch && (
          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-[3px] hover:bg-gray-50 transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter Toggle + Search bar */}
      {((filters && filters.length > 0) || enableSearch || primaryAction) && (
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Left side: Primary Action + Filters */}
          <div className="flex items-center gap-2">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                style={{ height: '33px' }}
              >
                {primaryAction.icon}
                <span>{primaryAction.label}</span>
              </button>
            )}
            
            {filters && filters.length > 0 && (
              <FilterToggleButton
                isActive={showFilters}
                onClick={() => setShowFilters(!showFilters)}
                activeCount={activeFilterCount}
              />
            )}
          </div>
          
          {/* Right side: Search */}
          {enableSearch && (
            searchExpandable ? (
              // Expandable search (collapsed by default)
              searchExpanded ? (
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                    style={{ height: '33px' }}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchExpanded(false);
                      setSearchTerm('');
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                // Collapsed state - just a search icon button
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="px-2 py-1.5 border border-gray-300 rounded-[3px] hover:bg-gray-50 transition-colors"
                  style={{ height: '33px', minWidth: '33px' }}
                  aria-label="Expand search"
                  title="Search"
                >
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
              )
            ) : (
              // Always visible search (non-expandable)
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                  style={{ height: '33px' }}
                />
              </div>
            )
          )}
        </div>
      )}
      
      {/* Collapsible Filter Section - Part 1: Select Filters */}
      {showFilters && filters && filters.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          {/* Filter grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleFilters.map(filter => {
              const isDisabled = typeof filter.disabled === 'function' 
                ? filter.disabled(activeFilters) 
                : filter.disabled || false;
              
              // Select filter
              if (filter.type === 'select') {
                return (
                  <div key={filter.id}>
                    <label className="block text-sm text-gray-700 mb-2">
                      {filter.label}
                      {filter.tooltip && (
                        <button
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          title={filter.tooltip}
                        >
                          <Info className="w-3.5 h-3.5 inline" />
                        </button>
                      )}
                    </label>
                    <StyledSelect
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      disabled={isDisabled}
                      style={{ fontSize: 'var(--text-sm)' }}
                    >
                      <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                        {filter.placeholder || `All ${filter.label}`}
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
                    {filter.helpText && (
                      <p className="text-xs text-gray-500 mt-1">{filter.helpText}</p>
                    )}
                  </div>
                );
              }
              
              // Date range filter
              if (filter.type === 'dateRange') {
                return (
                  <div key={filter.id}>
                    <label className="block text-sm text-gray-700 mb-2">
                      {filter.label}
                    </label>
                    <button
                      onClick={() => setShowDateRangePicker(true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                      style={{ height: '33px' }}
                    >
                      <span className={appliedDateRange ? 'text-gray-900' : 'text-gray-400'}>
                        {appliedDateRange 
                          ? `${new Date(appliedDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(appliedDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                          : 'Select date range'
                        }
                      </span>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </button>
                    {appliedDateRange && (
                      <button
                        onClick={handleClearDateRange}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        Clear date range
                      </button>
                    )}
                  </div>
                );
              }
              
              // Custom filter
              if (filter.type === 'custom' && filter.customRender) {
                return (
                  <div key={filter.id}>
                    <label className="block text-sm text-gray-700 mb-2">
                      {filter.label}
                    </label>
                    {filter.customRender({
                      value: activeFilters[filter.id],
                      onChange: (value) => handleFilterChange(filter.id, value),
                      activeFilters
                    })}
                  </div>
                );
              }
              
              return null;
            })}
          </div>
        </div>
      )}
      
      {/* Active Filters Banner - Shows in both expanded and collapsed states */}
      {activeFilterCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-blue-900 font-medium">Active filters:</span>
              
              {/* Search term badge */}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 border border-blue-200">
                  <Search className="w-3 h-3" />
                  {searchTerm}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {/* Regular filter badges */}
              {Object.entries(activeFilters).map(([filterId, value]) => {
                const filter = filters?.find(f => f.id === filterId);
                if (!filter || !value) return null;
                
                const displayValue = filter.type === 'select'
                  ? filter.options?.find(opt => opt.value === value)?.label || value
                  : value;
                
                return (
                  <span 
                    key={filterId}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 border border-blue-200"
                  >
                    {filter.label}: {displayValue}
                    <button
                      onClick={() => handleClearFilter(filterId)}
                      className="hover:bg-blue-200 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              
              {/* Date range badge */}
              {appliedDateRange && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 border border-blue-200">
                  <Calendar className="w-3 h-3" />
                  {new Date(appliedDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(appliedDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  <button
                    onClick={handleClearDateRange}
                    className="hover:bg-blue-200 rounded p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-700">
                {filteredData.length} results
              </span>
              <button
                onClick={handleClearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Selection banner */}
      {selectable && selectedRows.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-900">
              {selectedRows.length} item{selectedRows.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedRows([])}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear selection
            </button>
          </div>
          
          {bulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              {bulkActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => {
                    const selectedData = data.filter(row => selectedRows.includes(row[rowKey]));
                    action.onClick(selectedData);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-[3px] transition-colors flex items-center gap-2 ${
                    action.variant === 'danger'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'border border-blue-300 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Table container */}
      <div
        ref={tableScrollRef}
        className="overflow-x-auto border border-gray-300 rounded-lg"
      >
        <style>{`
          #full-functional-table td,
          #full-functional-table th {
            border: none !important;
          }
        `}</style>
        
        <table
          id="full-functional-table"
          className="w-full"
          style={{
            tableLayout: 'auto',
            borderCollapse: 'collapse',
          }}
        >
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* Expand/Collapse header */}
              {expandable && (
                <th
                  className={`${getDensityPadding()} sticky left-0 bg-gray-50 z-30 text-center ${headerClassName}`}
                  style={{
                    width: '48px',
                    minWidth: '48px',
                    maxWidth: '48px',
                  }}
                >
                  {/* Empty header for expand column */}
                </th>
              )}
              
              {/* Checkbox header */}
              {selectable && (
                <th
                  className={`${getDensityPadding()} sticky ${expandable ? 'left-[48px]' : 'left-0'} bg-gray-50 z-30 text-center ${headerClassName}`}
                  style={{
                    width: '56px',
                    minWidth: '56px',
                    maxWidth: '56px',
                  }}
                >
                  <input
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isSomeSelected && !isAllSelected;
                      }
                    }}
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-[#FF7A59] focus:ring-[#FF7A59] focus:ring-offset-0 cursor-pointer"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              
              {/* Column headers */}
              {visibleColumnConfigs.map(column => renderColumnHeader(column))}
            </tr>
          </thead>
          
          <tbody>
            {paginatedData.map((row) => {
              const rowId = row[rowKey];
              const isRowSelected = selectedRows.includes(rowId);
              const isRowExpanded = expandable && expandedRows.includes(String(rowId));
              
              return (
                <Fragment key={rowId}>
                  {/* Parent Row */}
                  <tr
                    onMouseEnter={() => setHoveredRow(rowId)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`
                      border-b border-gray-100 
                      hover:bg-gray-50 
                      transition-colors
                      ${isRowSelected ? 'bg-blue-50' : ''}
                    `}
                    onClick={() => onRowClick?.(row)}
                  >
                    {/* Expand/Collapse cell */}
                    {expandable && (
                      <td
                        className={`${getDensityPadding()} sticky left-0 text-center transition-all duration-200`}
                        style={{
                          zIndex: 25,
                          backgroundColor: getStickyColumnBg(rowId),
                          width: '48px',
                          minWidth: '48px',
                          maxWidth: '48px',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => toggleRowExpansion(String(rowId))}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          aria-label={isRowExpanded ? 'Collapse row' : 'Expand row'}
                        >
                          {isRowExpanded ? (
                            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </td>
                    )}
                    
                    {/* Checkbox cell */}
                    {selectable && (
                      <td
                        className={`${getDensityPadding()} sticky ${expandable ? 'left-[48px]' : 'left-0'} text-center transition-all duration-200`}
                        style={{
                          zIndex: 25,
                          backgroundColor: getStickyColumnBg(rowId),
                          width: '56px',
                          minWidth: '56px',
                          maxWidth: '56px',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isRowSelected}
                          onChange={() => toggleRow(rowId)}
                          className="rounded border-gray-300 text-[#FF7A59] focus:ring-[#FF7A59] focus:ring-offset-0 cursor-pointer"
                          aria-label={`Select row ${rowId}`}
                        />
                      </td>
                    )}
                  
                  {/* Data cells */}
                  {visibleColumnConfigs.map((column, colIndex) => {
                    const isFirstColumn = colIndex === 0;
                    const hasActions = rowActions.length > 0;
                    
                    return (
                      <td
                        key={column.id}
                        className={`
                          ${getDensityPadding()} 
                          text-sm 
                          ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                          ${column.className || ''}
                        `}
                        style={isFirstColumn && hasActions ? {
                          position: 'sticky',
                          left: expandable && selectable ? '104px' : expandable ? '48px' : selectable ? '56px' : '0',
                          backgroundColor: getStickyColumnBg(rowId),
                          boxShadow: isTableScrolled ? '2px 0 4px rgba(0,0,0,0.1)' : 'none',
                          zIndex: 20,
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                        } : {
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                        }}
                      >
                        {isFirstColumn && hasActions ? (
                          <div className="flex items-center justify-between gap-2">
                            {/* Cell content */}
                            <div className="flex-1">
                              {column.render ? column.render(row) : renderCellValue(row[column.field])}
                            </div>
                            
                            {/* Row actions dropdown */}
                            <div
                              className={`relative inline-block transition-opacity ${
                                hoveredRow === rowId ? 'opacity-100' : 'opacity-0'
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  setDropdownPosition({
                                    top: rect.bottom + 4,
                                    left: rect.left,
                                  });
                                  setOpenDropdown(openDropdown === rowId ? null : rowId);
                                }}
                                className="p-1 rounded hover:bg-gray-100 transition-colors"
                                aria-label="Row actions"
                                aria-haspopup="true"
                                aria-expanded={openDropdown === rowId}
                              >
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          column.render ? column.render(row) : renderCellValue(row[column.field])
                        )}
                      </td>
                    );
                  })}
                </tr>
                
                {/* Child Row (Expanded Content) */}
                {isRowExpanded && childRowRender && (
                  <tr className="bg-gray-50">
                    <td 
                      colSpan={
                        (expandable ? 1 : 0) + 
                        (selectable ? 1 : 0) + 
                        visibleColumnConfigs.length
                      }
                      className="p-0"
                    >
                      {childRowRender(row)}
                    </td>
                  </tr>
                )}
              </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Portal-rendered dropdown menu */}
      {openDropdown !== null &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(null);
              }}
            />
            
            {/* Dropdown menu */}
            <div
              className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col min-w-[160px]"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
              }}
            >
              {rowActions.map((action) => {
                const currentRow = paginatedData.find(row => row[rowKey] === openDropdown);
                if (!currentRow) return null;
                
                const isVisible = action.visible ? action.visible(currentRow) : true;
                const isDisabled = action.disabled ? action.disabled(currentRow) : false;
                
                if (!isVisible) return null;
                
                return (
                  <button
                    key={action.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDisabled) {
                        setOpenDropdown(null);
                        action.onClick(currentRow);
                      }
                    }}
                    disabled={isDisabled}
                    className={`
                      px-3 py-2 text-sm flex items-center gap-2 transition-colors text-left w-full
                      ${action.variant === 'danger'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                      ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                      first:rounded-t-lg last:rounded-b-lg
                    `}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </>,
          document.body
        )}
      
      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 bg-white rounded-b-lg">
        {/* Left: Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Rows per page:</span>
          <StyledSelect
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            fullWidth={false}
            minWidth={80}
            style={{ fontSize: '14px' }}
          >
            {pageSizeOptions.map(size => (
              <MenuItem key={size} value={size} sx={{ fontSize: '14px' }}>
                {size}
              </MenuItem>
            ))}
          </StyledSelect>
        </div>
        
        {/* Right: Page navigation */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4 text-gray-600 group-hover:text-white" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-white" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Picker Modal */}
      {showDateRangePicker && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
            onClick={() => {
              setShowDateRangePicker(false);
              if (!appliedDateRange) {
                setTempDateRange({ start: '', end: '' });
              }
            }}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[400px] max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base">Select Date Range</h3>
                <p className="text-xs text-gray-500 mt-1">Choose start and end dates for your filter</p>
              </div>
              <CloseButton
                onClick={() => {
                  setShowDateRangePicker(false);
                  if (!appliedDateRange) {
                    setTempDateRange({ start: '', end: '' });
                  }
                }}
              />
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4">
              {/* Date Input Fields */}
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Date Range</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1.5">From</label>
                    <input
                      type="date"
                      value={tempDateRange.start}
                      onChange={(e) => setTempDateRange({ ...tempDateRange, start: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                      style={{ height: '33px' }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1.5">To</label>
                    <input
                      type="date"
                      value={tempDateRange.end}
                      onChange={(e) => setTempDateRange({ ...tempDateRange, end: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                      style={{ height: '33px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Select Options */}
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Quick Select</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Today', days: 0 },
                    { label: 'Last 7 Days', days: 7 },
                    { label: 'Last 30 Days', days: 30 },
                    { label: 'This Month', days: 'month' },
                    { label: 'Last Month', days: 'last-month' },
                    { label: 'This Year', days: 'year' }
                  ].map((option) => {
                    // Calculate expected date range for this option
                    const today = new Date().toISOString().split('T')[0];
                    let expectedStart = today;
                    let expectedEnd = today;
                    
                    if (typeof option.days === 'number') {
                      const startDate = new Date();
                      startDate.setDate(startDate.getDate() - option.days);
                      expectedStart = startDate.toISOString().split('T')[0];
                    } else if (option.days === 'month') {
                      const now = new Date();
                      expectedStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                    } else if (option.days === 'last-month') {
                      const now = new Date();
                      expectedStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                      expectedEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
                    } else if (option.days === 'year') {
                      const now = new Date();
                      expectedStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                    }
                    
                    const isSelected = tempDateRange.start === expectedStart && tempDateRange.end === expectedEnd;
                    
                    return (
                      <button
                        key={option.label}
                        onClick={() => {
                          const end = new Date().toISOString().split('T')[0];
                          let start = end;
                          
                          if (typeof option.days === 'number') {
                            const startDate = new Date();
                            startDate.setDate(startDate.getDate() - option.days);
                            start = startDate.toISOString().split('T')[0];
                          } else if (option.days === 'month') {
                            const now = new Date();
                            start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                          } else if (option.days === 'last-month') {
                            const now = new Date();
                            start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                            const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
                            setTempDateRange({ start, end: lastDay });
                            return;
                          } else if (option.days === 'year') {
                            const now = new Date();
                            start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                          }
                          
                          setTempDateRange({ start, end });
                        }}
                        className={`px-3 py-1.5 text-xs border rounded-[3px] transition-colors ${
                          isSelected 
                            ? 'bg-purple-50 border-[#5C1F3D] text-[#5C1F3D]' 
                            : 'border-gray-300 hover:bg-gray-50 hover:border-[#5C1F3D]'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              {tempDateRange.start && tempDateRange.end && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-[3px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-900">
                      {new Date(tempDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(tempDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setTempDateRange({ start: '', end: '' });
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Selection
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDateRangePicker(false);
                    if (!appliedDateRange) {
                      setTempDateRange({ start: '', end: '' });
                    }
                  }}
                  className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  style={{ height: '33px' }}
                >
                  Cancel
                </button>
                <button
                  disabled={!tempDateRange.start || !tempDateRange.end}
                  onClick={handleApplyDateRange}
                  className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                  style={{ height: '33px' }}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Export types for external use
export type { FullFunctionalTableProps, ColumnConfig, RowAction, BulkAction } from './FullFunctionalTable.types';