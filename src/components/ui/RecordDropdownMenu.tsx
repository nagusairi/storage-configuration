import { ReactNode } from 'react';

export interface RecordDropdownMenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

interface RecordDropdownMenuProps {
  items: RecordDropdownMenuItem[];
  onClose: () => void;
  className?: string;
}

/**
 * RecordDropdownMenu - Reusable dropdown menu component for record-level actions
 * 
 * Standardizes:
 * - Menu item styling (padding: px-4 py-2)
 * - Icon sizing (w-4 h-4) and positioning (gap-3)
 * - Font size (text-sm)
 * - Hover states (hover:bg-gray-50)
 * - Rounded corners for first/last items
 * - Color variants (default gray, danger red)
 * 
 * Usage:
 * ```tsx
 * <RecordDropdownMenu
 *   items={[
 *     { id: 'edit', label: 'Edit Item', icon: <Edit className="w-4 h-4" />, onClick: handleEdit },
 *     { id: 'delete', label: 'Delete', icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: 'danger' }
 *   ]}
 *   onClose={() => setShowMenu(false)}
 * />
 * ```
 */
export function RecordDropdownMenu({ items, onClose, className = '' }: RecordDropdownMenuProps) {
  // Default positioning if no className provided, otherwise use custom positioning
  const defaultClasses = className || 'right-0 top-full mt-1';
  
  return (
    <div className={`absolute ${defaultClasses} bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]`}>
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        const isDanger = item.variant === 'danger';
        
        return (
          <button
            key={item.id}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
              item.onClick();
            }}
            className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
              isFirst ? 'rounded-t-lg' : ''
            } ${
              isLast ? 'rounded-b-lg' : ''
            } ${
              isDanger ? 'text-red-600' : 'text-gray-700'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}
          >
            <span className={isDanger ? 'text-red-500' : 'text-gray-500'}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}