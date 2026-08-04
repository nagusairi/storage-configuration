import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ChevronRight as ArrowRight } from 'lucide-react';
import { StyledSelect, MenuItem } from './ui/StyledSelect';

interface BreadcrumbsProps {
  breadcrumbs: string[];
  productStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock';
  editingMode?: boolean; // NEW: Show "Editing" label when in edit mode
  addingMode?: boolean; // NEW: Show "Adding Item" label when in add mode
  addingModeLabel?: string; // NEW: Custom label for adding mode (default: "Adding Item")
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  canNavigatePrevious?: boolean;
  canNavigateNext?: boolean;
  onBreadcrumbClick?: (index: number, path: string) => void;
  // Dashboard selector props
  showDashboardSelector?: boolean;
  dashboardType?: string;
  dashboardTypes?: Array<{ value: string; label: string }>;
  onDashboardTypeChange?: (type: string) => void;
}

export function Breadcrumbs({ 
  breadcrumbs, 
  productStatus,
  editingMode = false, // NEW: Default to false
  addingMode = false, // NEW: Default to false
  addingModeLabel = 'Adding Item', // NEW: Default label
  onNavigatePrevious,
  onNavigateNext,
  canNavigatePrevious = false,
  canNavigateNext = false,
  onBreadcrumbClick,
  showDashboardSelector = false,
  dashboardType,
  dashboardTypes,
  onDashboardTypeChange
}: BreadcrumbsProps) {
  const navigate = useNavigate();
  
  // Generate links for breadcrumbs
  const getBreadcrumbPath = (index: number): string => {
    if (index === 0) return '/dashboard';
    
    const breadcrumb = breadcrumbs[index].toLowerCase();
    
    // Map breadcrumb text to routes
    const routeMap: Record<string, string> = {
      // First level - modules
      'inventory': '/dashboard/inventory/overview',
      'procure-to-pay': '/dashboard/procure-to-pay',
      
      // Second level - inventory pages
      'overview': '/dashboard/inventory/overview',
      'all items': '/dashboard/inventory/all-items',
      'inventory list': '/dashboard/inventory/all-items',
      'alerts': '/dashboard/inventory/alerts',
      'bundles': '/dashboard/inventory/bundles',
      'item transformation': '/dashboard/inventory/unit-of-measure',
      
      // Second level - procure-to-pay pages
      'vendor management': '/dashboard/procure-to-pay/vendor-management/all-vendors',
    };

    return routeMap[breadcrumb] || '#';
  };

  // Truncate breadcrumb label with ellipsis
  const truncateLabel = (label: string, isLast: boolean): string => {
    // Don't truncate the last breadcrumb (active page)
    if (isLast) return label;
    
    const maxLength = 10;
    if (label.length > maxLength) {
      return label.substring(0, maxLength) + '...';
    }
    return label;
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const path = getBreadcrumbPath(index);
        const displayLabel = truncateLabel(crumb, isLast);
        const needsTooltip = !isLast && crumb.length > 10;

        // Hide "Edit" breadcrumb when in editing mode (redundant with "Editing" badge)
        if (editingMode && isLast && crumb.toLowerCase() === 'edit') {
          return null;
        }

        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
            
            {isLast && showDashboardSelector && dashboardTypes && dashboardType ? (
              // Last breadcrumb as dashboard selector dropdown
              <StyledSelect
                value={dashboardType}
                onChange={(e) => onDashboardTypeChange?.(e.target.value)}
                fullWidth={false}
                style={{ 
                  fontSize: 'var(--text-sm)', 
                  height: '28px',
                  border: 'none',
                  background: 'transparent',
                  color: '#5C1F3D',
                  fontWeight: '500',
                  padding: '0',
                  width: 'auto'
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSelect-select': { 
                    padding: '0 !important',
                    paddingRight: '16px !important',
                    color: '#5C1F3D',
                    fontWeight: 500
                  },
                  '& .MuiSelect-icon': {
                    right: '-2px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
              >
                {dashboardTypes.map((type) => (
                  <MenuItem 
                    key={type.value} 
                    value={type.value}
                    style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}
                  >
                    {type.label}
                  </MenuItem>
                ))}
              </StyledSelect>
            ) : isLast ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (path !== '#') {
                    navigate(path);
                    onBreadcrumbClick?.(index, path);
                  }
                }}
                className="text-[#5C1F3D] font-medium hover:text-[#4a1831] transition-colors cursor-pointer bg-transparent border-none p-0"
                title={needsTooltip ? crumb : undefined}
              >
                {displayLabel}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (path !== '#') {
                    navigate(path);
                    onBreadcrumbClick?.(index, path);
                  }
                }}
                className="text-gray-600 hover:text-[#5C1F3D] transition-colors cursor-pointer bg-transparent border-none p-0"
                title={needsTooltip ? crumb : undefined}
              >
                {displayLabel}
              </button>
            )}
          </div>
        );
      })}
      {productStatus && (
        <div className="flex items-center gap-2 ml-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 text-xs border rounded ${
            productStatus === 'In Stock' || productStatus === 'Active'
              ? 'bg-green-50 text-green-700 border-green-200'
              : productStatus === 'Low Stock'
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : productStatus === 'Seasonal'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : productStatus === 'Inactive'
                    ? 'bg-gray-50 text-gray-700 border-gray-200'
                    : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {productStatus}
          </span>
        </div>
      )}
      {editingMode && (
        <div className="flex items-center gap-2 ml-4">
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs border rounded bg-gray-50 text-gray-700 border-gray-200">
            Editing
          </span>
        </div>
      )}
      {addingMode && (
        <div className="flex items-center gap-2 ml-4">
          <span className="inline-flex items-center px-2.5 py-0.5 text-xs border rounded bg-gray-50 text-gray-700 border-gray-200">
            {addingModeLabel}
          </span>
        </div>
      )}
      {(canNavigatePrevious || canNavigateNext) && (
        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={onNavigatePrevious}
            disabled={!canNavigatePrevious}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous product"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onNavigateNext}
            disabled={!canNavigateNext}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next product"
          >
            <ArrowRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </nav>
  );
}