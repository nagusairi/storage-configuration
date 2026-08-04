import { useRef, useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface KPICard {
  id: string;
  label: string;
  value: string | number;
  icon: ReactNode;
  badgeColor: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
}

interface KPICardRowProps {
  cards: KPICard[];
  className?: string;
}

const badgeColorMap = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600' }
};

export function KPICardRow({ cards, className = '' }: KPICardRowProps) {
  const kpiScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const scrollKPICards = (direction: "left" | "right") => {
    if (!kpiScrollRef.current) return;
    
    const scrollAmount = 300; // Pixels to scroll per click
    const newScrollLeft =
      direction === "left"
        ? kpiScrollRef.current.scrollLeft - scrollAmount
        : kpiScrollRef.current.scrollLeft + scrollAmount;
    
    kpiScrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const scrollContainer = kpiScrollRef.current;
    if (!scrollContainer) return;
    
    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      
      // Show left arrow if scrolled right
      setShowLeftArrow(scrollLeft > 10);
      
      // Show right arrow if not at the end
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    };
    
    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [cards]);

  return (
    <div className={`relative ${className}`}>
      {/* Left Scroll Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scrollKPICards("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-50 hover:border-gray-400 transition-all"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Right Scroll Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scrollKPICards("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-50 hover:border-gray-400 transition-all"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      )}

      {/* Scrollable KPI Cards Container */}
      <div
        ref={kpiScrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {cards.map((card) => {
          const colors = badgeColorMap[card.badgeColor];
          return (
            <div
              key={card.id}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3 flex-shrink-0 min-w-[200px]"
            >
              {/* Icon Badge */}
              <div className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                <div className={colors.text}>
                  {card.icon}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600">{card.label}</p>
                <p className="text-lg text-gray-900 font-medium">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
