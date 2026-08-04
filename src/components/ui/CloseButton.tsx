import { X } from 'lucide-react';

interface CloseButtonProps {
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'dark';
  className?: string;
  ariaLabel?: string;
}

/**
 * CloseButton Component
 * 
 * A standardized close button for modals, dialogs, and side panels across the ERP application.
 * 
 * @param onClick - Function to call when the button is clicked
 * @param size - Button size variant: 'small' (16x16 icon), 'medium' (20x20 icon), 'large' (24x24 icon). Default: 'medium'
 * @param variant - Visual variant: 'default' (gray), 'dark' (darker gray). Default: 'default'
 * @param className - Optional additional CSS classes to apply
 * @param ariaLabel - Optional aria-label for accessibility. Default: 'Close'
 * 
 * @example
 * // Basic usage
 * <CloseButton onClick={() => setShowModal(false)} />
 * 
 * @example
 * // Small variant for compact headers
 * <CloseButton onClick={handleClose} size="small" />
 * 
 * @example
 * // Dark variant for light backgrounds
 * <CloseButton onClick={handleClose} variant="dark" />
 */
export function CloseButton({ 
  onClick, 
  size = 'medium',
  variant = 'default',
  className = '',
  ariaLabel = 'Close'
}: CloseButtonProps) {
  // Icon size mapping
  const iconSizeMap = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  // Padding mapping
  const paddingMap = {
    small: 'p-1',
    medium: 'p-1.5',
    large: 'p-2'
  };

  // Color variant mapping
  const colorMap = {
    default: 'text-gray-500 hover:bg-gray-100',
    dark: 'text-gray-600 hover:bg-gray-200'
  };

  return (
    <button
      onClick={onClick}
      className={`${paddingMap[size]} ${colorMap[variant]} rounded transition-colors ${className}`}
      aria-label={ariaLabel}
      type="button"
    >
      <X className={iconSizeMap[size]} />
    </button>
  );
}
