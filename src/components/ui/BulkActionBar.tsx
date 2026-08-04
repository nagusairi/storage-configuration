import React, { Fragment } from 'react';
import { X } from 'lucide-react';

/**
 * Action button configuration for the bulk action bar
 */
export interface BulkActionButton {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'danger' | 'secondary' | 'success';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * Props for the BulkActionBar component
 */
export interface BulkActionBarProps {
  /** Number of selected items */
  selectedCount: number;
  
  /** Callback when clear/close is clicked */
  onClear: () => void;
  
  /** Array of action buttons to display */
  actions: BulkActionButton[];
  
  /** Background color (default: '#1a1b3d' - navy) */
  backgroundColor?: string;
  
  /** Bottom offset in pixels (default: 20) */
  bottomOffset?: number;
  
  /** Maximum width Tailwind class (default: 'max-w-3xl') */
  maxWidth?: string;
  
  /** Show the "Clear" text button (default: true) */
  showClearButton?: boolean;
  
  /** Show the close (X) icon button (default: true) */
  showCloseButton?: boolean;
  
  /** Custom text color (default: 'white') */
  textColor?: string;
  
  /** Custom border radius (default: 'rounded-xl' - 12px) */
  borderRadius?: string;
  
  /** Custom z-index (default: 50) */
  zIndex?: number;
  
  /** Additional CSS classes for the container */
  className?: string;
  
  /** Singular label for item count (default: 'item') */
  itemLabel?: string;
  
  /** Plural label for item count (default: 'items') */
  itemsLabel?: string;
}

/**
 * BulkActionBar - Reusable floating action bar for bulk operations
 * 
 * Features:
 * - Centered at bottom of viewport with configurable offset
 * - Close button (X icon) for quick dismissal
 * - Selection count display
 * - Optional "Clear" text button
 * - Customizable action buttons with variants
 * - Smooth slide-up animation
 * - Fully customizable styling
 * 
 * @example
 * ```tsx
 * <BulkActionBar
 *   selectedCount={5}
 *   onClear={() => setSelectedRows([])}
 *   actions={[
 *     {
 *       id: 'download',
 *       label: 'Download',
 *       icon: <Download className="w-4 h-4" />,
 *       onClick: handleDownload,
 *       variant: 'primary'
 *     },
 *     {
 *       id: 'delete',
 *       label: 'Delete',
 *       icon: <Trash2 className="w-4 h-4" />,
 *       onClick: handleDelete,
 *       variant: 'danger'
 *     }
 *   ]}
 * />
 * ```
 */
export function BulkActionBar({
  selectedCount,
  onClear,
  actions,
  backgroundColor = '#1a1b3d',
  bottomOffset = 20,
  maxWidth = 'max-w-3xl',
  showClearButton = true,
  showCloseButton = true,
  textColor = 'white',
  borderRadius = 'rounded-xl',
  zIndex = 50,
  className = '',
  itemLabel = 'item',
  itemsLabel = 'items'
}: BulkActionBarProps) {
  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 w-full px-8 py-4 flex items-center justify-between ${maxWidth} ${borderRadius} shadow-2xl transform transition-all duration-300 ease-in-out ${className}`}
      style={{
        bottom: `${bottomOffset}px`,
        backgroundColor,
        color: textColor,
        zIndex
      }}
    >
      {/* Left side: Close button + Selection count + Clear button */}
      <div className="flex items-center gap-4">
        {/* Close button (X icon) */}
        {showCloseButton && (
          <button
            onClick={onClear}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
            aria-label="Close bulk actions"
          >
            <X className="w-4 h-4" style={{ color: textColor }} />
          </button>
        )}

        {/* Selection count */}
        <span className="text-sm font-medium whitespace-nowrap">
          {selectedCount} {selectedCount === 1 ? itemLabel : itemsLabel} selected
        </span>

        {/* Clear button */}
        {showClearButton && (
          <>
            {/* Divider */}
            <div className="w-px h-5 bg-white/30" />
            
            <button
              onClick={onClear}
              className="text-sm transition-colors hover:opacity-80 whitespace-nowrap"
              style={{ color: textColor }}
            >
              Clear Selection
            </button>
          </>
        )}
      </div>

      {/* Right side: Action buttons */}
      <div className="flex items-center gap-3 ml-6">
        {actions.map((action, index) => (
          <Fragment key={action.id}>
            {/* Divider before action buttons */}
            {index === 0 && <div className="w-px h-5 bg-white/30" />}
            
            <button
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                flex items-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${action.variant === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : action.variant === 'success'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : action.variant === 'secondary'
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                }
                ${action.className || ''}
              `}
            >
              {action.loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                action.icon
              )}
              <span>{action.label}</span>
            </button>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * Preset configurations for common use cases
 */
export const BulkActionBarPresets = {
  /** Navy background (default ERP style) */
  navy: {
    backgroundColor: '#1a1b3d',
    textColor: 'white'
  },
  
  /** Purple background (alternate style) */
  purple: {
    backgroundColor: '#2C1A4D',
    textColor: 'white'
  },
  
  /** Primary purple (ERP brand color) */
  primary: {
    backgroundColor: '#5C1F3D',
    textColor: 'white'
  },
  
  /** Dark gray background */
  dark: {
    backgroundColor: '#1F2937',
    textColor: 'white'
  },
  
  /** Light background */
  light: {
    backgroundColor: '#F9FAFB',
    textColor: '#111827',
    borderRadius: 'rounded-xl border border-gray-200'
  }
};

/**
 * Example usage configurations
 */
export const BulkActionBarExamples = {
  /** Download action */
  download: (onDownload: () => void, onClear: () => void, count: number): BulkActionBarProps => ({
    selectedCount: count,
    onClear,
    actions: [
      {
        id: 'download',
        label: 'Download Selected',
        icon: <span className="w-4 h-4">📥</span>,
        onClick: onDownload,
        variant: 'primary'
      }
    ]
  }),
  
  /** Delete action */
  delete: (onDelete: () => void, onClear: () => void, count: number): BulkActionBarProps => ({
    selectedCount: count,
    onClear,
    actions: [
      {
        id: 'delete',
        label: 'Delete Selected',
        icon: <span className="w-4 h-4">🗑️</span>,
        onClick: onDelete,
        variant: 'danger'
      }
    ]
  }),
  
  /** Multiple actions */
  multiAction: (handlers: { download: () => void; export: () => void; delete: () => void; clear: () => void }, count: number): BulkActionBarProps => ({
    selectedCount: count,
    onClear: handlers.clear,
    actions: [
      {
        id: 'download',
        label: 'Download',
        icon: <span className="w-4 h-4">📥</span>,
        onClick: handlers.download,
        variant: 'primary'
      },
      {
        id: 'export',
        label: 'Export',
        icon: <span className="w-4 h-4">📤</span>,
        onClick: handlers.export,
        variant: 'secondary'
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: <span className="w-4 h-4">🗑️</span>,
        onClick: handlers.delete,
        variant: 'danger'
      }
    ]
  })
};