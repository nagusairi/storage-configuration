import { 
  Users, 
  ShoppingCart, 
  FileText, 
  ChevronDown,
  Settings,
  Package,
  Warehouse,
  TrendingUp,
  Receipt,
  CreditCard,
  FileCheck,
  ChevronUp,
  Landmark,
  Calculator,
  FileBarChart,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { smoothScrollBy } from '../hooks/useSmoothScroll';

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
  onOpenAssistant?: () => void;
  onModuleClick?: (moduleTitle: string) => void;
}

interface NavItem {
  icon: any;
  label: string;
  active: boolean;
  path?: string;
}

export function Sidebar({ expanded, onToggle, onOpenAssistant, onModuleClick }: SidebarProps) {
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredExpandButton, setHoveredExpandButton] = useState(false);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Flat Level 1 navigation items
  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true, path: '/dashboard' },
    { icon: Package, label: 'Inventory', active: false, path: '/inventory' },
    { icon: Warehouse, label: 'Warehouse Management', active: false, path: '/warehouse' },
    { icon: Settings, label: 'Storage Configuration', active: false, path: '/storage-configuration' },
    { icon: Settings, label: 'Storage Configuration v2', active: false, path: '/storage-configuration-v2' },
    { icon: Settings, label: 'Storage Configuration v3', active: false, path: '/storage-configuration-v3' },
    { icon: Settings, label: 'Storage Configuration v4', active: false, path: '/storage-configuration-v4' },
    { icon: Users, label: 'Vendor Management', active: false, path: '/vendors' },
    { icon: ShoppingCart, label: 'Purchases', active: false, path: '/purchases' },
    { icon: TrendingUp, label: 'Sales', active: false, path: '/sales' },
    { icon: Users, label: 'Customer Management', active: false, path: '/customers' },
    { icon: Receipt, label: 'Account Receivables', active: false, path: '/receivables' },
    { icon: CreditCard, label: 'Credit Management', active: false, path: '/credit' },
    { icon: Landmark, label: 'Bank and Cash Management', active: false, path: '/bank' },
    { icon: Calculator, label: 'Accounting Hub', active: false, path: '/accounting' },
    { icon: FileBarChart, label: 'Financial Reporting', active: false, path: '/reporting' },
    { icon: FileText, label: 'General Ledger', active: false, path: '/ledger' },
    { icon: FileCheck, label: 'GST Core', active: false, path: '/gst' },
    { icon: Sparkles, label: 'AI Summary', active: false, path: '/ai-summary' }
  ];

  const checkScroll = () => {
    if (navRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = navRef.current;
      setShowTopArrow(scrollTop > 0);
      setShowBottomArrow(scrollTop + clientHeight < scrollHeight - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const startScroll = (direction: 'up' | 'down') => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
    
    scrollIntervalRef.current = setInterval(() => {
      if (navRef.current) {
        const scrollAmount = direction === 'down' ? 400 : -400;
        smoothScrollBy(navRef.current, scrollAmount, 0.3, 'power2.out');
        setTimeout(checkScroll, 300);
      }
    }, 300);
  };

  const stopScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleItemClick = (item: NavItem) => {
    // Handle AI Summary button
    if (item.label === 'AI Summary' && onOpenAssistant) {
      onOpenAssistant();
      return;
    }
    
    // Handle module navigation
    if (['Inventory', 'Warehouse Management', 'Purchases', 'Sales'].includes(item.label) && onModuleClick) {
      onModuleClick(item.label);
      return;
    }

    // Handle Storage Configuration
    if (item.label === 'Storage Configuration') {
      navigate('/dashboard/storage-configuration');
      return;
    }

    // Handle other navigation items
    if (item.path) {
      navigate(`/dashboard${item.path}`);
    }
  };

  return (
    <aside 
      className={`
        bg-[#5C1F3D] text-white flex flex-col transition-all duration-300 flex-shrink-0 relative overflow-visible z-[60]
        ${expanded ? 'w-[240px]' : 'w-[54px]'}
      `}
    >
      {/* Top Scroll Arrow */}
      {showTopArrow && (
        <div 
          className="h-8 flex items-center justify-center border-b border-[#7A2D54] cursor-pointer hover:bg-[#7A2D54] transition-colors flex-shrink-0"
          onMouseEnter={() => startScroll('up')}
          onMouseLeave={stopScroll}
        >
          <ChevronUp className="w-5 h-5" />
        </div>
      )}

      {/* Navigation Items - Scrollable */}
      <div 
        ref={navRef}
        className="flex-1 overflow-y-auto overflow-x-visible scrollbar-hide py-2 px-3 flex flex-col gap-1.5"
        onScroll={checkScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <div 
              key={index}
              className="relative"
              onMouseEnter={(e) => {
                setHoveredIndex(index);
                // Set tooltip position for collapsed mode
                if (!expanded) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  document.documentElement.style.setProperty('--tooltip-center', `${rect.top + rect.height / 2}px`);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <button
                className={`
                  w-full flex items-center gap-3 py-[14px] px-3 transition-colors rounded-md relative
                  ${expanded ? 'justify-start' : 'justify-center'}
                  ${item.active 
                    ? 'bg-[#7A2D54]' 
                    : 'hover:bg-[#7A2D54]'
                  }
                `}
                onClick={() => handleItemClick(item)}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {expanded && <span className="whitespace-nowrap text-sm">{item.label}</span>}
              </button>

              {/* Tooltip for collapsed mode */}
              {!expanded && hoveredIndex === index && (
                <div 
                  className="fixed left-[58px] px-3 py-1.5 bg-[#2D2D2D] text-white text-sm rounded whitespace-nowrap pointer-events-none -translate-y-1/2 shadow-xl z-[70]" 
                  style={{ top: 'var(--tooltip-center, 0)' }}
                >
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0" 
                    style={{
                      borderTop: '6px solid transparent',
                      borderBottom: '6px solid transparent',
                      borderRight: '6px solid #2D2D2D'
                    }}
                  />
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Scroll Arrow */}
      {showBottomArrow && (
        <div 
          className="h-8 flex items-center justify-center border-t border-[#7A2D54] cursor-pointer hover:bg-[#7A2D54] transition-colors flex-shrink-0"
          onMouseEnter={() => startScroll('down')}
          onMouseLeave={stopScroll}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      )}

      {/* Expand/Collapse Toggle Button */}
      <div 
        className="border-t border-[#7A2D54] py-0 px-3 flex-shrink-0 hover:bg-[#7A2D54] transition-colors cursor-pointer relative" 
        style={{ height: '32px' }} 
        onClick={onToggle}
        onMouseEnter={(e) => {
          setHoveredExpandButton(true);
          const rect = e.currentTarget.getBoundingClientRect();
          document.documentElement.style.setProperty('--expand-tooltip-top', `${rect.top + rect.height / 2}px`);
        }}
        onMouseLeave={() => setHoveredExpandButton(false)}
      >
        <button
          className={`
            w-full h-full flex items-center justify-center gap-3
            ${expanded ? 'px-3 justify-start' : ''}
          `}
        >
          {expanded ? (
            <>
              <PanelLeftClose className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap text-sm">Collapse</span>
            </>
          ) : (
            <PanelLeftOpen className="w-4 h-4 flex-shrink-0" />
          )}
        </button>
        {!expanded && hoveredExpandButton && (
          <div 
            className="fixed left-[58px] px-3 py-1.5 bg-[#2D2D2D] text-white text-sm rounded whitespace-nowrap pointer-events-none -translate-y-1/2 shadow-xl" 
            style={{ top: 'var(--expand-tooltip-top, 0)' }}
          >
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-0 h-0" 
              style={{
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: '6px solid #2D2D2D'
              }}
            />
            Expand
          </div>
        )}
      </div>
    </aside>
  );
}
