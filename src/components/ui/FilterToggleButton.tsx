import { Filter } from 'lucide-react';
import { StyledButton } from './StyledButton';
import { ReactNode } from 'react';

/**
 * Props for the FilterToggleButton component
 */
interface FilterToggleButtonProps {
  /**
   * Whether the filter panel is currently shown
   * @default false
   */
  isActive?: boolean;
  
  /**
   * Alternative prop name for isActive (for backward compatibility)
   * @deprecated Use isActive instead
   */
  showFilters?: boolean;
  
  /**
   * Click handler to toggle the filter panel
   */
  onClick?: () => void;
  
  /**
   * Alternative prop name for onClick (for backward compatibility)
   * @deprecated Use onClick instead
   */
  onToggle?: () => void;
  
  /**
   * Number of active filters to display in the badge
   * If 0 or undefined, no badge is shown
   * @default 0
   */
  activeCount?: number;
  
  /**
   * Alternative prop name for activeCount (for backward compatibility)
   * @deprecated Use activeCount instead
   */
  activeFilterCount?: number;
  
  /**
   * Custom label text
   * @default "Filters"
   */
  label?: string;
  
  /**
   * Size variant of the button
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Custom icon (defaults to Filter icon from lucide-react)
   */
  icon?: ReactNode;
  
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Tooltip text to show on hover
   * If not provided, defaults to "Show Filters" / "Hide Filters"
   */
  tooltip?: string;
  
  /**
   * ARIA label for accessibility
   * If not provided, auto-generated based on state
   */
  ariaLabel?: string;
  
  /**
   * Optional additional CSS classes
   */
  className?: string;
  
  /**
   * Badge color variant
   * @default "primary"
   */
  badgeVariant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  
  /**
   * Show badge even when count is 0
   * @default false
   */
  alwaysShowBadge?: boolean;
}

/**
 * FilterToggleButton Component
 * 
 * A standardized, reusable button for toggling filter panels with an active filter count badge.
 * Follows ERP design guidelines with consistent height (33px), primary color (#5C1F3D), and accessibility features.
 * 
 * **Design Specifications:**
 * - Height: 33px (consistent with all form elements)
 * - Border radius: 3px
 * - Primary color: #5C1F3D
 * - Icon size: 16x16px (w-4 h-4)
 * - Badge: Shows active filter count when > 0
 * 
 * **States:**
 * - Default (inactive): Outline variant
 * - Active (filters shown): Secondary variant (filled)
 * - Hover: Background color transition
 * - Disabled: 40% opacity, no pointer events
 * - Focus: Purple ring (focus:ring-2 focus:ring-[#5C1F3D])
 * 
 * **Accessibility:**
 * - Keyboard accessible (Tab, Enter, Space)
 * - ARIA labels auto-generated or customizable
 * - Screen reader friendly
 * - Tooltip support
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <FilterToggleButton
 *   isActive={showFilters}
 *   onClick={() => setShowFilters(!showFilters)}
 *   activeCount={3}
 * />
 * 
 * // With custom label and size
 * <FilterToggleButton
 *   isActive={filtersVisible}
 *   onClick={handleToggle}
 *   activeCount={5}
 *   label="Advanced Filters"
 *   size="large"
 * />
 * 
 * // Disabled state
 * <FilterToggleButton
 *   isActive={false}
 *   onClick={handleToggle}
 *   disabled={true}
 *   tooltip="Filters unavailable"
 * />
 * 
 * // Custom badge color
 * <FilterToggleButton
 *   isActive={true}
 *   onClick={handleToggle}
 *   activeCount={10}
 *   badgeVariant="warning"
 * />
 * ```
 * 
 * @component
 * @category UI Components
 * @subcategory Buttons
 */
export function FilterToggleButton({
  isActive,
  showFilters, // Backward compatibility
  onClick,
  onToggle, // Backward compatibility
  activeCount = 0,
  activeFilterCount, // Backward compatibility
  label = 'Filters',
  size = 'medium',
  icon,
  disabled = false,
  tooltip,
  ariaLabel,
  className = '',
  badgeVariant = 'primary',
  alwaysShowBadge = false
}: FilterToggleButtonProps) {
  // Resolve backward compatibility props
  const isActiveResolved = isActive !== undefined ? isActive : showFilters ?? false;
  const onClickResolved = onClick || onToggle || (() => {});
  const activeCountResolved = activeCount || activeFilterCount || 0;
  
  // Default icon
  const defaultIcon = icon || <Filter className="w-4 h-4" />;
  
  // Auto-generate tooltip if not provided
  const resolvedTooltip = tooltip || (isActiveResolved ? 'Hide Filters' : 'Show Filters');
  
  // Auto-generate ARIA label if not provided
  const resolvedAriaLabel = ariaLabel || `${isActiveResolved ? 'Hide' : 'Show'} filters${activeCountResolved > 0 ? `, ${activeCountResolved} active` : ''}`;
  
  // Badge color mapping
  const badgeColors = {
    primary: 'bg-[#5C1F3D] text-white border-[#5C1F3D]',
    secondary: 'bg-gray-600 text-white border-gray-600',
    success: 'bg-green-600 text-white border-green-600',
    warning: 'bg-yellow-600 text-white border-yellow-600',
    danger: 'bg-red-600 text-white border-red-600'
  };
  
  return (
    <StyledButton
      variant={isActiveResolved ? 'secondary' : 'outline'}
      icon={defaultIcon}
      onClick={onClickResolved}
      disabled={disabled}
      size={size}
      className={className}
      aria-label={resolvedAriaLabel}
      title={resolvedTooltip}
    >
      <span className="flex items-center gap-2">
        {label}
        {(alwaysShowBadge || activeCountResolved > 0) && (
          <span 
            className={`px-2 py-0.5 text-xs rounded ${badgeColors[badgeVariant]}`}
            aria-label={`${activeCountResolved} active filters`}
          >
            {activeCountResolved}
          </span>
        )}
      </span>
    </StyledButton>
  );
}

/**
 * Type export for external usage
 */
export type { FilterToggleButtonProps };
