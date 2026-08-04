import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ScrollableTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  count?: number;
}

interface ScrollableTabsProps {
  tabs: ScrollableTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function ScrollableTabs({ tabs, activeTab, onTabChange, className }: ScrollableTabsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check if tabs are overflowing and update arrow visibility
  const checkOverflow = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // Show left arrow if scrolled right
    setShowLeftArrow(scrollLeft > 0);
    
    // Show right arrow if there's more content on the right
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
  };

  // Check overflow on mount, tab changes, and window resize
  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [tabs]);

  // Scroll handler
  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 250; // Scroll by 250px
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    // Update arrow visibility after scroll animation
    setTimeout(checkOverflow, 300);
  };

  return (
    <div className={`relative flex items-center bg-[#f4f5f7] ${className || ''}`} style={{ borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}>
      {/* Left scroll arrow */}
      {showLeftArrow && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-2 z-10 w-6 h-6 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
        </button>
      )}

      {/* Scrollable tabs container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkOverflow}
        className="product-details-tabs flex items-center gap-[2px] px-[10px] pt-0 pb-0 overflow-x-auto scrollbar-hide flex-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`content-stretch flex gap-[5px] items-center px-[12px] relative rounded-tl-[5px] rounded-tr-[5px] shrink-0 transition-colors ${
                isActive ? 'bg-white py-[8px] mb-[-1px] pb-[9px]' : 'py-[8px]'
              }`}
              style={isActive ? { background: 'white' } : undefined}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(9, 30, 66, 0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '';
                } else {
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              {isActive && (
                <div aria-hidden="true" className="absolute border-[#d1def0] border-[1px_1px_0px] border-solid inset-0 pointer-events-none rounded-tl-[5px] rounded-tr-[5px]" />
              )}
              <IconComponent className="w-[14px] h-[14px] shrink-0 relative" style={{ color: '#172b4d' }} />
              <p className={`leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap whitespace-pre ${
                isActive ? "font-['Poppins:Medium',sans-serif]" : "font-['Poppins:Regular',sans-serif]"
              }`}>
                {tab.label}
              </p>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 text-xs rounded ${
                  isActive 
                    ? 'bg-[#5C1F3D] text-white border border-[#5C1F3D]' 
                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right scroll arrow */}
      {showRightArrow && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-2 z-10 w-6 h-6 rounded-full bg-white border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        </button>
      )}
    </div>
  );
}