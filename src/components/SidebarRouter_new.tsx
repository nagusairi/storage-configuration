import { 
  Package,
  Warehouse,
  Users,
  ShoppingCart,
  TrendingUp,
  Receipt,
  CreditCard,
  Landmark,
  Calculator,
  FileBarChart,
  FileText,
  FileCheck,
  Sparkles,
  LayoutDashboard,
  Bookmark,
  Star,
  ChevronUp,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardList,
  BarChart3,
  DollarSign,
  Truck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  XCircle,
  Target,
  Bell,
  ArrowLeftRight,
  Settings
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
  onOpenAssistant?: () => void;
  activeModuleKey: string | null;
  activeSidebarGroup: string | null;
}

export function Sidebar({ expanded, onToggle, onOpenAssistant, activeModuleKey, activeSidebarGroup }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredSubmenu, setHoveredSubmenu] = useState<number | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<number>>(new Set());
  const [hoveredCategoryHeader, setHoveredCategoryHeader] = useState<number | null>(null);
  const [hoveredArrow, setHoveredArrow] = useState<'top' | 'bottom' | null>(null);
  const [hoveredBookmark, setHoveredBookmark] = useState<{menuIndex: number, subIndex: number} | null>(null);
  const [bookmarkedItems, setBookmarkedItems] = useState<Array<{menuLabel: string, subLabel: string, path: string}>>([]);
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('dashboardBookmarks');
    if (savedBookmarks) {
      try {
        const bookmarks = JSON.parse(savedBookmarks);
        // Filter out any bookmarks with malformed paths (containing doubled segments or deprecated paths)
        const validBookmarks = bookmarks.filter((bookmark: any) => {
          if (!bookmark.path) return false;
          
          // Remove deprecated warehouse paths
          if (bookmark.path && bookmark.path.startsWith('/dashboard/warehouse')) {
            console.warn('Removing deprecated warehouse bookmark path:', bookmark.path);
            return false;
          }
          
          // Check for doubled path segments like vendor-management/vendor-management
          const pathParts = bookmark.path.split('/').filter(Boolean);
          const hasDuplicates = pathParts.some((part, index) => 
            index > 0 && part === pathParts[index - 1]
          );
          if (hasDuplicates) {
            console.warn('Removing invalid bookmark with duplicated path:', bookmark.path);
            return false;
          }
          return true;
        });
        
        // Save cleaned bookmarks back to localStorage if we removed any
        if (validBookmarks.length !== bookmarks.length) {
          localStorage.setItem('dashboardBookmarks', JSON.stringify(validBookmarks));
        }
        
        setBookmarkedItems(validBookmarks);
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
        // Clear corrupted bookmarks
        localStorage.removeItem('dashboardBookmarks');
      }
    }
  }, []);

  // Toggle bookmark
  const toggleBookmark = (menuLabel: string, subLabel: string, path: string) => {
    setBookmarkedItems(prev => {
      const isBookmarked = prev.some(b => b.menuLabel === menuLabel && b.subLabel === subLabel);
      let newBookmarks;
      
      if (isBookmarked) {
        newBookmarks = prev.filter(b => !(b.menuLabel === menuLabel && b.subLabel === subLabel));
      } else {
        newBookmarks = [...prev, { menuLabel, subLabel, path }];
      }
      
      // Save to localStorage
      localStorage.setItem('dashboardBookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  // Check if an item is bookmarked
  const isBookmarked = (menuLabel: string, subLabel: string) => {
    return bookmarkedItems.some(b => b.menuLabel === menuLabel && b.subLabel === subLabel);
  };

  // Define navigation structure
  const mainModules = [
    {
      categoryTitle: 'BOOKMARKS',
      categoryIcon: Bookmark,
      items: bookmarkedItems.length > 0 
        ? bookmarkedItems.map(b => ({
            icon: Star,
            label: b.subLabel,
            path: b.path,
            parentLabel: b.menuLabel,
            isBookmark: true
          }))
        : [{ icon: Bookmark, label: 'No Bookmarks', path: '#', disabled: true }]
    },
    {
      categoryTitle: 'MAIN',
      categoryIcon: LayoutDashboard,
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: location.pathname === '/dashboard' },
        { icon: Settings, label: 'Storage Configuration', path: '/dashboard/storage-configuration', active: location.pathname === '/dashboard/storage-configuration' }
      ]
    },
    {
      categoryTitle: 'INVENTORY',
      categoryIcon: Package,
      items: [
        { 
          icon: Package, 
          label: 'Inventory', 
          path: '/dashboard/inventory',
          moduleKey: 'inventory-management',
          submenu: [
            { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/inventory/overview' },
            { icon: ClipboardList, label: 'Inventory List', path: '/dashboard/inventory/all-items' },
            { icon: FileText, label: 'Inventory Adjustments', path: '/dashboard/inventory/adjustments' },
            { icon: Package, label: 'Bundles', path: '/dashboard/inventory/bundles' },
            { icon: Target, label: 'Item transformation', path: '/dashboard/inventory/uom' },
            { icon: Bell, label: 'Alerts', path: '/dashboard/inventory/alerts' }
          ]
        }
      ]
    },
    {
      categoryTitle: 'AI TOOLS',
      categoryIcon: Sparkles,
      items: [
        { icon: Sparkles, label: 'AI Summary', path: '#', action: 'openAssistant' }
      ]
    }
  ];

  // Module-specific sidebar when in a module
  const getModuleSidebar = () => {
    if (activeModuleKey === 'inventory-management') {
      const inventoryCategory = mainModules.find(m => m.categoryTitle === 'INVENTORY');
      const bookmarksCategory = mainModules.find(m => m.categoryTitle === 'BOOKMARKS');
      
      const items = [...(inventoryCategory?.items || [])];
      
      return {
        showBookmarks: true,
        bookmarksCategory,
        items
      };
    }
    
    if (activeModuleKey === 'procure-to-pay') {
      const procureToPay = mainModules.find(m => m.categoryTitle === 'PROCURE-TO-PAY');
      const bookmarksCategory = mainModules.find(m => m.categoryTitle === 'BOOKMARKS');
      
      const items = [...(procureToPay?.items || [])];
      
      return {
        showBookmarks: true,
        bookmarksCategory,
        items
      };
    }
    
    if (activeModuleKey === 'finance-core') {
      const financeCore = mainModules.find(m => m.categoryTitle === 'FINANCE CORE');
      const bookmarksCategory = mainModules.find(m => m.categoryTitle === 'BOOKMARKS');
      
      const items = [...(financeCore?.items || [])];
      
      return {
        showBookmarks: true,
        bookmarksCategory,
        items
      };
    }
    
    if (activeModuleKey === 'order-to-cash') {
      const orderToCash = mainModules.find(m => m.categoryTitle === 'CUSTOMER-TO-CASH');
      const bookmarksCategory = mainModules.find(m => m.categoryTitle === 'BOOKMARKS');
      
      const items = [...(orderToCash?.items || [])];
      
      return {
        showBookmarks: true,
        bookmarksCategory,
        items
      };
    }
    
    if (activeModuleKey === 'gst-compliance') {
      const gstCompliance = mainModules.find(m => m.categoryTitle === 'GST COMPLIANCE');
      const bookmarksCategory = mainModules.find(m => m.categoryTitle === 'BOOKMARKS');
      
      const items = [...(gstCompliance?.items || [])];
      
      return {
        showBookmarks: true,
        bookmarksCategory,
        items
      };
    }
    
    return null;
  };

  const moduleSidebar = getModuleSidebar();
  const navItems = moduleSidebar ? moduleSidebar.items : mainModules;

  // Get current module name
  const getCurrentModuleName = () => {
    if (activeSidebarGroup === 'inventory') return 'Inventory';
    if (activeSidebarGroup === 'warehouse') return 'Warehouse Management';
    if (activeSidebarGroup === 'procure-to-pay') return 'Procure to Pay';
    if (activeSidebarGroup === 'bank-cash-management') return 'Bank and Cash management';
    if (activeSidebarGroup === 'accounting-hub') return 'Accounting Hub';
    if (activeSidebarGroup === 'financial-reporting') return 'Financial Reporting';
    if (activeSidebarGroup === 'general-ledger') return 'General Ledger';
    if (activeSidebarGroup === 'sales') return 'Sales';
    if (activeSidebarGroup === 'customer-management') return 'Customer Management';
    if (activeSidebarGroup === 'account-receivables') return 'Account Receivables';
    if (activeSidebarGroup === 'credit-management') return 'Credit Management';
    if (activeSidebarGroup === 'gst-core') return 'GST Core';
    return null;
  };

  const currentModuleName = getCurrentModuleName();

  // Toggle category collapse/expand
  const toggleCategory = (catIndex: number) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(catIndex)) {
        newSet.delete(catIndex);
      } else {
        newSet.add(catIndex);
      }
      return newSet;
    });
  };

  const handleItemClick = (item: any) => {
    if (item.action === 'openAssistant' && onOpenAssistant) {
      onOpenAssistant();
      return;
    }
    
    if (item.path && item.path !== '#') {
      navigate(item.path);
    }
  };

  const handleSubmenuClick = (path: string) => {
    if (path.startsWith('/')) {
      navigate(path);
    } else {
      console.warn('Relative path detected in handleSubmenuClick:', path);
      navigate(`/dashboard/${path}`);
    }
  };

  const handleBackToMain = () => {
    navigate('/dashboard');
  };

  // Auto-scroll handler when hovering arrows
  const handleArrowScroll = (direction: 'up' | 'down') => {
    if (!navRef.current) return;

    const scrollStep = direction === 'up' ? -25 : 25;
    
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    scrollIntervalRef.current = setInterval(() => {
      if (navRef.current) {
        navRef.current.scrollTop += scrollStep;
      }
    }, 10);
  };

  const stopArrowScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  // Scroll detection for arrows
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = navRef.current;
        setShowTopArrow(scrollTop > 10);
        setShowBottomArrow(scrollTop < scrollHeight - clientHeight - 10);
      }
    };

    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener('scroll', handleScroll);
      handleScroll();
      
      const observer = new ResizeObserver(handleScroll);
      observer.observe(navElement);
      
      return () => {
        navElement.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    }
  }, [navItems, expanded, collapsedCategories]);

  return (
    <aside
      className={`h-full bg-[#5C1F3D] text-white flex flex-col transition-all duration-300 ease-in-out relative ${
        expanded ? 'w-[240px]' : 'w-[54px]'
      }`}
    >
      {/* Fixed Header Section - Back to Main, Module Name, and Bookmarks (for module view) */}
      {moduleSidebar && (
        <div className="flex-shrink-0 px-3 pt-4 pb-2 border-b border-[#7A2D54]">
          {expanded ? (
            <>
              <button
                onClick={handleBackToMain}
                className="w-full flex items-center gap-2 py-2 px-3 text-sm text-gray-300 hover:text-white hover:bg-[#7A2D54]/50 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Main</span>
              </button>
              
              {currentModuleName && (
                <div className="mt-3 mb-4 px-3">
                  <div className="flex items-start gap-2">
                    {activeSidebarGroup === 'inventory' ? (
                      <Package className="w-4 h-4" />
                    ) : activeSidebarGroup === 'warehouse' ? (
                      <Warehouse className="w-4 h-4" />
                    ) : activeSidebarGroup === 'procure-to-pay' ? (
                      <ShoppingCart className="w-4 h-4" />
                    ) : null}
                    <div>
                      <div className="font-medium">
                        {activeModuleKey === 'inventory-management' && 'Inventory and Warehouse Management'}
                        {activeModuleKey === 'procure-to-pay' && 'Procure to Pay'}
                      </div>
                      <div className="text-xs text-gray-400">Module</div>
                    </div>
                  </div>
                </div>
              )}

              {moduleSidebar.showBookmarks && moduleSidebar.bookmarksCategory && (
                <div className="mb-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs uppercase tracking-wider text-gray-400">
                        BOOKMARKS
                      </span>
                    </div>
                  </div>
                  {moduleSidebar.bookmarksCategory.items.map((item: any, idx: number) => {
                    const Icon = item.icon;
                    const isActive = item.path === location.pathname;
                    const itemIsBookmarked = item.parentLabel ? isBookmarked(item.parentLabel, item.label) : false;
                    return (
                      <div
                        key={idx}
                        className="relative group"
                        onMouseEnter={() => setHoveredBookmark({menuIndex: -2, subIndex: idx})}
                        onMouseLeave={() => setHoveredBookmark(null)}
                      >
                        <button
                          disabled={item.disabled}
                          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors ${
                            item.disabled 
                              ? 'opacity-50 cursor-not-allowed' 
                              : isActive 
                                ? 'bg-[#7A2D54]' 
                                : 'hover:bg-[#7A2D54]/50'
                          }`}
                          onClick={() => !item.disabled && handleItemClick(item)}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap text-sm truncate">{item.label}</span>
                        </button>
                        {!item.disabled && item.parentLabel && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(item.parentLabel, item.label, item.path);
                            }}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-opacity ${
                              itemIsBookmarked || (hoveredBookmark?.menuIndex === -2 && hoveredBookmark?.subIndex === idx)
                                ? 'opacity-100' 
                                : 'opacity-0'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleBackToMain}
                className="w-full flex items-center justify-center py-3 text-gray-300 hover:text-white hover:bg-[#7A2D54] rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {moduleSidebar.showBookmarks && moduleSidebar.bookmarksCategory && (
                <div
                  className="relative mt-2"
                  onMouseEnter={() => {
                    setHoveredIndex(-1);
                    if (submenuTimeoutRef.current) {
                      clearTimeout(submenuTimeoutRef.current);
                    }
                    submenuTimeoutRef.current = setTimeout(() => {
                      setHoveredSubmenu(-1);
                    }, 100);
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                    if (submenuTimeoutRef.current) {
                      clearTimeout(submenuTimeoutRef.current);
                    }
                    submenuTimeoutRef.current = setTimeout(() => {
                      setHoveredSubmenu(null);
                    }, 800);
                  }}
                >
                  <button
                    ref={(el) => buttonRefs.current['bookmark-button'] = el}
                    className={`w-full flex items-center justify-center py-3 transition-colors rounded-md ${
                      hoveredIndex === -1 ? 'bg-[#7A2D54]' : 'hover:bg-[#7A2D54]'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 flex-shrink-0" />
                  </button>

                  {hoveredSubmenu === -1 && moduleSidebar.bookmarksCategory.items.length > 0 && (() => {
                    const buttonEl = buttonRefs.current['bookmark-button'];
                    const topPos = buttonEl ? buttonEl.getBoundingClientRect().top : 0;
                    
                    return (
                      <div
                        className="fixed left-[58px] bg-[#5C1F3D] text-white rounded-r shadow-xl z-[45] min-w-[200px] py-2"
                        style={{ top: `${topPos}px` }}
                        onMouseEnter={() => {
                          if (submenuTimeoutRef.current) {
                            clearTimeout(submenuTimeoutRef.current);
                          }
                          setHoveredSubmenu(-1);
                        }}
                        onMouseLeave={() => {
                          setHoveredSubmenu(null);
                        }}
                      >
                        <div className="px-3 py-2 text-xs font-medium border-b border-[#7A2D54]">
                          BOOKMARKS
                        </div>
                        <div className="py-1">
                          {moduleSidebar.bookmarksCategory.items.map((item: any, idx: number) => {
                            const Icon = item.icon;
                            const itemIsBookmarked = item.parentLabel ? isBookmarked(item.parentLabel, item.label) : false;
                            return (
                              <div
                                key={idx}
                                className="relative group"
                                onMouseEnter={() => setHoveredBookmark({menuIndex: -3, subIndex: idx})}
                                onMouseLeave={() => setHoveredBookmark(null)}
                              >
                                <button
                                  disabled={item.disabled}
                                  onClick={() => !item.disabled && handleItemClick(item)}
                                  className={`w-full flex items-center gap-3 px-3 py-2 transition-colors text-sm ${
                                    item.disabled 
                                      ? 'opacity-50 cursor-not-allowed' 
                                      : 'hover:bg-[#7A2D54]'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                  <span className="flex-1 text-left">{item.label}</span>
                                </button>
                                {!item.disabled && item.parentLabel && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleBookmark(item.parentLabel, item.label, item.path);
                                    }}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-opacity ${
                                      itemIsBookmarked || (hoveredBookmark?.menuIndex === -3 && hoveredBookmark?.subIndex === idx)
                                        ? 'opacity-100' 
                                        : 'opacity-0'
                                    }`}
                                  >
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Fixed Header Section - Bookmarks and Main (for main categories view) */}
      {!moduleSidebar && (
        <div className="flex-shrink-0 px-3 pt-4 pb-2 border-b border-[#7A2D54]">
          {expanded ? (
            <>
              {/* Bookmarks Category */}
              {(() => {
                const bookmarksCategory = mainModules.find(m => m.categoryTitle === 'BOOKMARKS');
                if (!bookmarksCategory) return null;
                const isCategoryCollapsed = collapsedCategories.has(0);
                
                return (
                  <div className="mb-4">
                    <div
                      className="flex items-center justify-between px-3 py-2 cursor-pointer group"
                      onClick={() => toggleCategory(0)}
                      onMouseEnter={() => setHoveredCategoryHeader(0)}
                      onMouseLeave={() => setHoveredCategoryHeader(null)}
                    >
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs uppercase tracking-wider text-gray-400">
                          BOOKMARKS
                        </span>
                      </div>
                      {isCategoryCollapsed ? (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      ) : (
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                      )}
                    </div>

                    {!isCategoryCollapsed && bookmarksCategory.items.map((item: any, index: number) => {
                      const Icon = item.icon;
                      const isActive = item.path === location.pathname;
                      return (
                        <button
                          key={index}
                          disabled={item.disabled}
                          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors ${
                            item.disabled 
                              ? 'opacity-50 cursor-not-allowed'
                              : isActive ? 'bg-[#7A2D54]' : 'hover:bg-[#7A2D54]/50'
                          }`}
                          onClick={() => !item.disabled && handleItemClick(item)}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Main Category */}
              {(() => {
                const mainCategory = mainModules.find(m => m.categoryTitle === 'MAIN');
                if (!mainCategory) return null;
                const isCategoryCollapsed = collapsedCategories.has(1);
                
                return (
                  <div className="mb-2">
                    <div
                      className="flex items-center justify-between px-3 py-2 cursor-pointer group"
                      onClick={() => toggleCategory(1)}
                      onMouseEnter={() => setHoveredCategoryHeader(1)}
                      onMouseLeave={() => setHoveredCategoryHeader(null)}
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs uppercase tracking-wider text-gray-400">
                          MAIN
                        </span>
                      </div>
                      {isCategoryCollapsed ? (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      ) : (
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                      )}
                    </div>

                    {!isCategoryCollapsed && mainCategory.items.map((item: any, index: number) => {
                      const Icon = item.icon;
                      const isActive = item.path === location.pathname;
                      return (
                        <button
                          key={index}
                          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors ${
                            isActive ? 'bg-[#7A2D54]' : 'hover:bg-[#7A2D54]/50'
                          }`}
                          onClick={() => handleItemClick(item)}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </>
          ) : (
            <>
              {/* Bookmarks in collapsed mode */}
              <div
                className="relative mb-2"
                onMouseEnter={() => {
                  setHoveredIndex(-1);
                  if (submenuTimeoutRef.current) {
                    clearTimeout(submenuTimeoutRef.current);
                  }
                  submenuTimeoutRef.current = setTimeout(() => {
                    setHoveredSubmenu(-1);
                  }, 100);
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  if (submenuTimeoutRef.current) {
                    clearTimeout(submenuTimeoutRef.current);
                  }
                  submenuTimeoutRef.current = setTimeout(() => {
                    setHoveredSubmenu(null);
                  }, 800);
                }}
              >
                <button
                  ref={(el) => buttonRefs.current['bookmark-button-main'] = el}
                  className={`w-full flex items-center justify-center py-3 transition-colors rounded-md ${
                    hoveredIndex === -1 ? 'bg-[#7A2D54]' : 'hover:bg-[#7A2D54]'
                  }`}
                >
                  <Bookmark className="w-4 h-4 flex-shrink-0" />
                </button>

                {hoveredSubmenu === -1 && (() => {
                  const bookmarksCategory = mainModules.find(m => m.categoryTitle === 'BOOKMARKS');
                  if (!bookmarksCategory) return null;
                  const buttonEl = buttonRefs.current['bookmark-button-main'];
                  const topPos = buttonEl ? buttonEl.getBoundingClientRect().top : 0;
                  
                  return (
                    <div
                      className="fixed left-[58px] bg-[#5C1F3D] text-white rounded-r shadow-xl z-[45] min-w-[200px] py-2"
                      style={{ top: `${topPos}px` }}
                      onMouseEnter={() => {
                        if (submenuTimeoutRef.current) {
                          clearTimeout(submenuTimeoutRef.current);
                        }
                        setHoveredSubmenu(-1);
                      }}
                      onMouseLeave={() => {
                        setHoveredSubmenu(null);
                      }}
                    >
                      <div className="px-3 py-2 text-xs font-medium border-b border-[#7A2D54]">
                        BOOKMARKS
                      </div>
                      <div className="py-1">
                        {bookmarksCategory.items.map((item: any, index: number) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={index}
                              disabled={item.disabled}
                              onClick={() => !item.disabled && handleItemClick(item)}
                              className={`w-full flex items-center gap-3 px-3 py-2 transition-colors text-sm ${
                                item.disabled 
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-[#7A2D54]'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="flex-1 text-left">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Main in collapsed mode */}
              <div
                className="relative mb-2"
                onMouseEnter={() => {
                  setHoveredIndex(-2);
                  if (submenuTimeoutRef.current) {
                    clearTimeout(submenuTimeoutRef.current);
                  }
                  submenuTimeoutRef.current = setTimeout(() => {
                    setHoveredSubmenu(-2);
                  }, 100);
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  if (submenuTimeoutRef.current) {
                    clearTimeout(submenuTimeoutRef.current);
                  }
                  submenuTimeoutRef.current = setTimeout(() => {
                    setHoveredSubmenu(null);
                  }, 800);
                }}
              >
                <button
                  ref={(el) => buttonRefs.current['main-button'] = el}
                  className={`w-full flex items-center justify-center py-3 transition-colors rounded-md ${
                    hoveredIndex === -2 ? 'bg-[#7A2D54]' : 'hover:bg-[#7A2D54]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                </button>

                {hoveredSubmenu === -2 && (() => {
                  const mainCategory = mainModules.find(m => m.categoryTitle === 'MAIN');
                  if (!mainCategory) return null;
                  const buttonEl = buttonRefs.current['main-button'];
                  const topPos = buttonEl ? buttonEl.getBoundingClientRect().top : 0;
                  
                  return (
                    <div
                      className="fixed left-[58px] bg-[#5C1F3D] text-white rounded-r shadow-xl z-[45] min-w-[200px] py-2"
                      style={{ top: `${topPos}px` }}
                      onMouseEnter={() => {
                        if (submenuTimeoutRef.current) {
                          clearTimeout(submenuTimeoutRef.current);
                        }
                        setHoveredSubmenu(-2);
                      }}
                      onMouseLeave={() => {
                        setHoveredSubmenu(null);
                      }}
                    >
                      <div className="px-3 py-2 text-xs font-medium border-b border-[#7A2D54]">
                        MAIN
                      </div>
                      <div className="py-1">
                        {mainCategory.items.map((item: any, index: number) => {
                          const Icon = item.icon;
                          return (
                            <button
                              key={index}
                              onClick={() => handleItemClick(item)}
                              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#7A2D54] transition-colors text-sm"
                            >
                              <Icon className="w-4 h-4" />
                              <span className="flex-1 text-left">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      )}

      {/* Scroll Arrow - Top (positioned after fixed header) */}
      {(showTopArrow || hoveredCategoryHeader !== null) && (
        <div 
          className="flex-shrink-0 h-8 bg-[#5C1F3D] flex items-center justify-center cursor-pointer border-b border-[#7A2D54] hover:bg-[#7A2D54] transition-colors"
          onMouseEnter={() => {
            setHoveredArrow('top');
            handleArrowScroll('up');
          }}
          onMouseLeave={() => {
            setHoveredArrow(null);
            stopArrowScroll();
          }}
        >
          <ChevronUp className={`w-4 h-4 ${hoveredCategoryHeader !== null || hoveredArrow === 'top' ? 'text-yellow-400' : 'text-white'} ${hoveredCategoryHeader !== null || hoveredArrow === 'top' ? 'animate-bounce' : ''}`} />
        </div>
      )}

      {/* Scrollable Navigation Items */}
      <nav ref={navRef} className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-[#7A2D54] scrollbar-track-transparent">
        <div className="space-y-1">
          {moduleSidebar ? (
            <>
              {moduleSidebar.items.map((item: any, index) => {
                const Icon = item.icon;
                const isActive = false;
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                const isCategoryCollapsed = collapsedCategories.has(index);
                const isCurrentModule = item.label === currentModuleName;

                return (
                  <div key={index}>
                    {expanded && (
                      <div>
                        <button
                          className="w-full flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors hover:bg-[#7A2D54]/50"
                          onClick={() => {
                            if (hasSubmenu) {
                              toggleCategory(index);
                            } else {
                              handleItemClick(item);
                            }
                          }}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="whitespace-nowrap text-sm flex-1 text-left">{item.label}</span>
                          {hasSubmenu && (
                            <span className="p-1 cursor-pointer">
                              {isCategoryCollapsed ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronUp className="w-3.5 h-3.5" />
                              )}
                            </span>
                          )}
                        </button>

                        {hasSubmenu && !isCategoryCollapsed && (
                          <div className="mt-1 mb-2 space-y-0.5">
                            {item.submenu.map((subItem: any, subIndex: number) => {
                              const SubIcon = subItem.icon;
                              const isSubActive = location.pathname === subItem.path;
                              const itemIsBookmarked = isBookmarked(item.label, subItem.label);
                              
                              // Hide Overview submenu items
                              if (subItem.label === 'Overview') {
                                return null;
                              }
                              
                              return (
                                <div
                                  key={subIndex}
                                  className="relative group"
                                  onMouseEnter={() => setHoveredBookmark({menuIndex: index, subIndex})}
                                  onMouseLeave={() => setHoveredBookmark(null)}
                                >
                                  <button
                                    onClick={() => handleSubmenuClick(subItem.path)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                                      location.pathname === subItem.path
                                        ? 'bg-[#7A2D54] text-white' 
                                        : 'text-gray-300 hover:bg-[#7A2D54]/50 hover:text-white'
                                    }`}
                                  >
                                    <SubIcon className="w-4 h-4" />
                                    <span className="flex-1 text-left">{subItem.label}</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleBookmark(item.label, subItem.label, subItem.path);
                                    }}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-opacity ${
                                      itemIsBookmarked || (hoveredBookmark?.menuIndex === index && hoveredBookmark?.subIndex === subIndex)
                                        ? 'opacity-100' 
                                        : 'opacity-0'
                                    }`}
                                  >
                                    {itemIsBookmarked ? (
                                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    ) : (
                                      <Star className="w-3.5 h-3.5 text-gray-400 hover:text-yellow-400" />
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {!expanded && (
                      <div
                        className="relative"
                        onMouseEnter={() => {
                          setHoveredIndex(index);
                          if (submenuTimeoutRef.current) {
                            clearTimeout(submenuTimeoutRef.current);
                          }
                          submenuTimeoutRef.current = setTimeout(() => {
                            setHoveredSubmenu(index);
                          }, 100);
                        }}
                        onMouseLeave={() => {
                          setHoveredIndex(null);
                          if (submenuTimeoutRef.current) {
                            clearTimeout(submenuTimeoutRef.current);
                          }
                          submenuTimeoutRef.current = setTimeout(() => {
                            setHoveredSubmenu(null);
                          }, 800);
                        }}
                      >
                        <button
                          ref={(el) => buttonRefs.current[`module-item-${index}`] = el}
                          className={`w-full flex items-center justify-center py-3 transition-colors rounded-md ${
                            hoveredIndex === index || isActive ? 'bg-[#7A2D54]' : 'hover:bg-[#7A2D54]'
                          }`}
                          onClick={() => handleItemClick(item)}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                        </button>

                        {hoveredSubmenu === index && hasSubmenu && (() => {
                          const buttonEl = buttonRefs.current[`module-item-${index}`];
                          const topPos = buttonEl ? buttonEl.getBoundingClientRect().top : 0;
                          
                          return (
                            <div
                              className="fixed left-[58px] bg-[#5C1F3D] text-white rounded-r shadow-xl z-[45] min-w-[200px] py-2"
                              style={{ top: `${topPos}px` }}
                              onMouseEnter={() => {
                                if (submenuTimeoutRef.current) {
                                  clearTimeout(submenuTimeoutRef.current);
                                }
                                setHoveredSubmenu(index);
                              }}
                              onMouseLeave={() => {
                                setHoveredSubmenu(null);
                              }}
                            >
                              <div className="px-3 py-2 text-sm font-medium border-b border-gray-700">
                                {item.label}
                              </div>
                              <div className="py-1">
                                {item.submenu.map((subItem: any, subIndex: number) => {
                                  const SubIcon = subItem.icon;
                                  const isSubActive = location.pathname === subItem.path;
                                  const itemIsBookmarked = isBookmarked(item.label, subItem.label);
                                  
                                  // Hide Overview submenu items
                                  if (subItem.label === 'Overview') {
                                    return null;
                                  }
                                  
                                  return (
                                    <div
                                      key={subIndex}
                                      className="relative group"
                                      onMouseEnter={() => setHoveredBookmark({menuIndex: index, subIndex})}
                                      onMouseLeave={() => setHoveredBookmark(null)}
                                    >
                                      <button
                                        onClick={() => handleSubmenuClick(subItem.path)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 transition-colors text-sm ${
                                          isSubActive 
                                            ? 'bg-[#7A2D54] text-white' 
                                            : 'text-gray-300 hover:bg-[#7A2D54]/50 hover:text-white'
                                        }`}
                                      >
                                        <SubIcon className="w-4 h-4" />
                                        <span className="flex-1 text-left">{subItem.label}</span>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleBookmark(item.label, subItem.label, subItem.path);
                                        }}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-opacity ${
                                          itemIsBookmarked || (hoveredBookmark?.menuIndex === index && hoveredBookmark?.subIndex === subIndex)
                                            ? 'opacity-100' 
                                            : 'opacity-0'
                                        }`}
                                      >
                                        {itemIsBookmarked ? (
                                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                        ) : (
                                          <Star className="w-3.5 h-3.5 text-gray-400 hover:text-yellow-400" />
                                        )}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            navItems.slice(2).map((category: any, catIndex) => {
              const CategoryIcon = category.categoryIcon;
              const actualIndex = catIndex + 2;
              const isCategoryCollapsed = collapsedCategories.has(actualIndex);

              return (
                <div key={catIndex} className="mb-4">
                  {expanded && (
                    <>
                      <div
                        className="flex items-center justify-between px-3 py-2 cursor-pointer group"
                        onClick={() => toggleCategory(actualIndex)}
                        onMouseEnter={() => setHoveredCategoryHeader(actualIndex)}
                        onMouseLeave={() => setHoveredCategoryHeader(null)}
                      >
                        <div className="flex items-center gap-2">
                          <CategoryIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs uppercase tracking-wider text-gray-400">
                            {category.categoryTitle}
                          </span>
                        </div>
                        {isCategoryCollapsed ? (
                          <ChevronDown className="w-3 h-3 text-gray-400" />
                        ) : (
                          <ChevronUp className="w-3 h-3 text-gray-400" />
                        )}
                      </div>

                      {!isCategoryCollapsed && category.items.map((item: any, index: number) => {
                        const Icon = item.icon;
                        const isActive = item.path === location.pathname;
                        return (
                          <button
                            key={index}
                            className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-md transition-colors ${
                              isActive ? 'bg-[#7A2D54]' : 'hover:bg-[#7A2D54]/50'
                            }`}
                            onClick={() => handleItemClick(item)}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap text-sm">{item.label}</span>
                          </button>
                        );
                      })}
                    </>
                  )}

                  {!expanded && (
                    <div
                      className="relative"
                      onMouseEnter={() => {
                        setHoveredIndex(catIndex);
                        if (submenuTimeoutRef.current) {
                          clearTimeout(submenuTimeoutRef.current);
                        }
                        submenuTimeoutRef.current = setTimeout(() => {
                          setHoveredSubmenu(catIndex);
                        }, 100);
                      }}
                      onMouseLeave={() => {
                        setHoveredIndex(null);
                        if (submenuTimeoutRef.current) {
                          clearTimeout(submenuTimeoutRef.current);
                        }
                        submenuTimeoutRef.current = setTimeout(() => {
                          setHoveredSubmenu(null);
                        }, 800);
                      }}
                    >
                      <button
                        ref={(el) => buttonRefs.current[`category-${catIndex}`] = el}
                        className={`w-full flex items-center justify-center py-3 transition-colors rounded-md ${
                          hoveredIndex === catIndex ? 'bg-[#7A2D54]' : 'hover:bg-[#7A2D54]'
                        }`}
                        onClick={() => {
                          if (category.items.length === 1) {
                            handleItemClick(category.items[0]);
                          }
                        }}
                      >
                        <CategoryIcon className="w-4 h-4 flex-shrink-0" />
                      </button>

                      {hoveredSubmenu === catIndex && category.items.length > 0 && (() => {
                        const buttonEl = buttonRefs.current[`category-${catIndex}`];
                        const topPos = buttonEl ? buttonEl.getBoundingClientRect().top : 0;
                        
                        return (
                          <div
                            className="fixed left-[58px] bg-[#5C1F3D] text-white rounded-r shadow-xl z-[45] min-w-[200px] py-2"
                            style={{ top: `${topPos}px` }}
                            onMouseEnter={() => {
                              if (submenuTimeoutRef.current) {
                                clearTimeout(submenuTimeoutRef.current);
                              }
                              setHoveredSubmenu(catIndex);
                            }}
                            onMouseLeave={() => {
                              setHoveredSubmenu(null);
                            }}
                          >
                            <div className="px-3 py-2 text-xs font-medium border-b border-[#7A2D54]">
                              {category.categoryTitle}
                            </div>
                            <div className="py-1">
                              {category.items.map((item: any, index: number) => {
                                const Icon = item.icon;
                                return (
                                  <button
                                    key={index}
                                    onClick={() => handleItemClick(item)}
                                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#7A2D54] transition-colors text-sm"
                                  >
                                    <Icon className="w-4 h-4" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </nav>

      {/* Scroll Arrow - Bottom */}
      {(showBottomArrow || hoveredCategoryHeader !== null) && (
        <div 
          className="flex-shrink-0 h-8 bg-[#5C1F3D] flex items-center justify-center cursor-pointer border-t border-[#7A2D54] hover:bg-[#7A2D54] transition-colors"
          onMouseEnter={() => {
            setHoveredArrow('bottom');
            handleArrowScroll('down');
          }}
          onMouseLeave={() => {
            setHoveredArrow(null);
            stopArrowScroll();
          }}
        >
          <ChevronDown className={`w-4 h-4 ${hoveredCategoryHeader !== null || hoveredArrow === 'bottom' ? 'text-yellow-400' : 'text-white'} ${hoveredCategoryHeader !== null || hoveredArrow === 'bottom' ? 'animate-bounce' : ''}`} />
        </div>
      )}

      {/* Expand/Collapse Button - Anchored at bottom */}
      <div className="flex items-center justify-center p-3 border-t border-[#7A2D54] flex-shrink-0">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-[#7A2D54] rounded-md transition-colors"
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {expanded ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
}
