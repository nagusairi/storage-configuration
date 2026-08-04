import { useEffect, useRef, useState, ReactNode } from 'react';
import { gsap } from 'gsap';

interface ViewportAwareDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  children: ReactNode;
  minWidth?: number;
  maxColumns?: number;
  title?: string;
}

interface DropdownPosition {
  left: number | 'auto';
  right: number | 'auto';
  top: number;
  maxWidth: number;
  maxHeight: number;
  alignment: 'left' | 'center' | 'right';
}

export function ViewportAwareDropdown({
  isOpen,
  onClose,
  triggerRef,
  children,
  minWidth = 600,
  maxColumns = 4,
  title,
}: ViewportAwareDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<DropdownPosition>({
    left: 0,
    right: 'auto',
    top: 0,
    maxWidth: window.innerWidth - 32,
    maxHeight: window.innerHeight * 0.8,
    alignment: 'left',
  });

  // Calculate optimal position and size
  useEffect(() => {
    if (!isOpen || !triggerRef.current || !dropdownRef.current) return;

    const calculatePosition = () => {
      const trigger = triggerRef.current!.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const PADDING = 16; // Padding from viewport edges

      // Calculate vertical position
      const topPosition = trigger.bottom + 8; // 8px gap below trigger
      const maxHeight = viewport.height - topPosition - PADDING;
      const maxWidth = viewport.width - (PADDING * 2);

      // Calculate horizontal position with collision detection
      let leftPosition: number | 'auto' = 'auto';
      let rightPosition: number | 'auto' = 'auto';
      let alignment: 'left' | 'center' | 'right' = 'left';

      // Get the dropdown's natural width
      const dropdownWidth = dropdown?.offsetWidth || minWidth;

      // Try to align left with trigger first
      const leftAligned = trigger.left;
      const leftAlignedRight = leftAligned + dropdownWidth;

      if (leftAligned >= PADDING && leftAlignedRight <= viewport.width - PADDING) {
        // Can align left with trigger
        leftPosition = leftAligned;
        alignment = 'left';
      } else if (leftAlignedRight > viewport.width - PADDING) {
        // Collision on right, align to right edge of viewport
        rightPosition = PADDING;
        leftPosition = 'auto';
        alignment = 'right';
      } else if (leftAligned < PADDING) {
        // Collision on left, align to left edge of viewport
        leftPosition = PADDING;
        alignment = 'left';
      }

      setPosition({
        left: leftPosition,
        right: rightPosition,
        top: topPosition,
        maxWidth,
        maxHeight,
        alignment,
      });
    };

    calculatePosition();

    // Recalculate on window resize
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [isOpen, triggerRef, minWidth, maxColumns]);

  // GSAP entrance animation
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        {
          opacity: 0,
          y: -10,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
        }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100]"
        onClick={onClose}
      />

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="fixed z-[101] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
        style={{
          left: position.left === 'auto' ? 'auto' : `${position.left}px`,
          right: position.right === 'auto' ? 'auto' : `${position.right}px`,
          top: `${position.top}px`,
          maxWidth: `${position.maxWidth}px`,
          maxHeight: `${position.maxHeight}px`,
        }}
      >
        {/* Title Header (if provided) */}
        {title && (
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-gray-700">{title}</h2>
          </div>
        )}

        {/* Content - scrollable if needed */}
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: title
              ? `${position.maxHeight - 60}px`
              : `${position.maxHeight}px`,
            scrollBehavior: 'smooth',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
