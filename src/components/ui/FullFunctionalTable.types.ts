/**
 * TypeScript Type Definitions for FullFunctionalTable Component
 */

export interface ColumnConfig<T> {
  id: string;
  label: string;
  field: keyof T;
  sortable?: boolean;
  sticky?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  className?: string;
  visible?: boolean;
}

export interface RowAction<T> {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'danger';
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export interface BulkAction<T> {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: (selectedRows: T[]) => void;
  variant?: 'default' | 'danger';
}

/**
 * Filter Configuration Interface
 */
export interface DataGridFilter {
  // Core properties
  id: string;                           // Unique filter identifier (used as key in activeFilters)
  label: string;                        // Display label shown above filter
  type: 'select' | 'custom' | 'dateRange';  // Filter type
  
  // Select filter properties
  placeholder?: string;                 // Placeholder text (default: "All {label}")
  minWidth?: number;                    // Minimum width in pixels (used with fullWidth={false})
  options?: Array<{                     // Options for select dropdown
    value: string;
    label: string;
  }>;
  
  // Custom render properties
  customRender?: (props: {
    value: any;
    onChange: (value: any) => void;
    activeFilters: Record<string, any>;
  }) => React.ReactNode;
  
  // Conditional behavior
  disabled?: boolean | ((activeFilters: Record<string, any>) => boolean);
  visible?: boolean | ((activeFilters: Record<string, any>) => boolean);
  
  // Help & guidance
  helpText?: string;                    // Help text shown below filter
  tooltip?: string;                     // Tooltip shown on info icon
  
  // Loading state
  isLoading?: boolean;                  // Show loading spinner
  loadingText?: string;                 // Loading message (default: "Loading options...")
}

/**
 * Date Range State
 */
export interface DateRangeValue {
  start: string;  // ISO date string (YYYY-MM-DD)
  end: string;    // ISO date string (YYYY-MM-DD)
}

/**
 * Filter Preset (Saved Filter Views)
 */
export interface FilterPreset {
  id: string;
  name: string;
  filters: Record<string, any>;
  createdAt: string;
}

export interface FullFunctionalTableProps<T extends Record<string, any>> {
  // Required
  data: T[];
  columns: ColumnConfig<T>[];
  rowKey: keyof T;
  
  // Selection
  selectable?: boolean;
  selectedRows?: any[];
  onSelectionChange?: (selectedIds: any[]) => void;
  
  // Sorting
  sortable?: boolean;
  defaultSort?: { field: keyof T; direction: 'asc' | 'desc' };
  onSort?: (field: keyof T, direction: 'asc' | 'desc' | null) => void;
  
  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  
  // Column Visibility
  defaultVisibleColumns?: string[];
  onColumnVisibilityChange?: (columns: string[]) => void;
  
  // Density
  density?: 'compact' | 'standard' | 'comfortable';
  onDensityChange?: (density: string) => void;
  
  // Row Actions
  rowActions?: RowAction<T>[];
  bulkActions?: BulkAction<T>[];
  onRowClick?: (row: T) => void;
  
  // States
  isLoading?: boolean;
  error?: string | null;
  
  // Messages
  emptyMessage?: string;
  noResultsMessage?: string;
  loadingMessage?: string;
  
  // Callbacks
  onRetry?: () => void;
  onAddNew?: () => void;
  
  // Styling
  className?: string;
  headerClassName?: string;           // Custom className for table headers
  
  // Features
  enableSearch?: boolean;
  searchExpandable?: boolean;           // NEW: Make search collapsible/expandable
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  
  // Filter Configuration
  filters?: DataGridFilter[];
  defaultFilters?: Record<string, any>;
  onFilter?: (filters: Record<string, any>, data: T[]) => T[];
  filterLogic?: 'AND' | 'OR';           // How multiple filters combine (default: 'AND')
  
  // Filter Presets
  filterPresets?: FilterPreset[];
  onSaveFilterPreset?: (name: string, filters: Record<string, any>) => void;
  onLoadFilterPreset?: (preset: FilterPreset) => void;
  onDeleteFilterPreset?: (presetId: string) => void;
  
  // Filter State Management
  persistFiltersInURL?: boolean;        // Save/load filters from URL params
  onFilterChange?: (filters: Record<string, any>) => void;  // Callback when filters change
  
  // Toolbar Actions
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  
  // Expandable Rows (Parent-Child Functionality)
  expandable?: boolean;                     // Enable expand/collapse feature
  childRowRender?: (row: T) => React.ReactNode;  // Render content when row expanded
  expandedRows?: string[];                  // Controlled mode: which rows are expanded
  onExpandedRowsChange?: (expandedRows: string[]) => void;  // Callback for expansion changes
  defaultExpandedRows?: string[];           // Uncontrolled mode: initial expanded rows
}