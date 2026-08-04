import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../SidebarRouter_new';
import { TopNav } from '../TopNav';
import { AssistantPanel } from '../AssistantPanel';
import { SidebarProvider } from '../../contexts/SidebarContext';

// Route metadata mapping
const routeMetadata: Record<string, { moduleKey: string | null; sidebarGroup: string | null }> = {
  '/dashboard': { moduleKey: null, sidebarGroup: null },
  '/dashboard/inventory': { moduleKey: 'inventory-management', sidebarGroup: 'inventory' },
  '/dashboard/inventory/overview': { moduleKey: 'inventory-management', sidebarGroup: 'inventory' },
  '/dashboard/inventory/item-master': { moduleKey: 'inventory-management', sidebarGroup: 'inventory' },
  '/dashboard/inventory/stock-overview': { moduleKey: 'inventory-management', sidebarGroup: 'inventory' },
  '/dashboard/inventory/stock-movements': { moduleKey: 'inventory-management', sidebarGroup: 'inventory' },
  '/dashboard/inventory/reports': { moduleKey: 'inventory-management', sidebarGroup: 'inventory' },
  '/dashboard/procure-to-pay': { moduleKey: 'procure-to-pay', sidebarGroup: 'procure-to-pay' },
};

export function AppLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const location = useLocation();

  // Get current route metadata - use smart path matching
  const getMetadata = () => {
    // First try exact match
    if (routeMetadata[location.pathname]) {
      return routeMetadata[location.pathname];
    }
    
    // Then try pattern matching for module paths
    const pathname = location.pathname;
    
    // Procure-to-Pay module paths
    if (pathname.startsWith('/dashboard/procure-to-pay/')) {
      return { moduleKey: 'procure-to-pay', sidebarGroup: 'procure-to-pay' };
    }
    
    // Inventory paths
    if (pathname.startsWith('/dashboard/inventory/')) {
      return { moduleKey: 'inventory-management', sidebarGroup: 'inventory' };
    }
    
    // Finance Core paths
    if (pathname.startsWith('/dashboard/finance-core/')) {
      return { moduleKey: 'finance-core', sidebarGroup: 'finance-core' };
    }
    
    // Order to Cash paths
    if (pathname.startsWith('/dashboard/order-to-cash/')) {
      return { moduleKey: 'order-to-cash', sidebarGroup: 'order-to-cash' };
    }
    
    // GST Compliance paths
    if (pathname.startsWith('/dashboard/gst-compliance/')) {
      return { moduleKey: 'gst-compliance', sidebarGroup: 'gst-compliance' };
    }
    
    // Default
    return { moduleKey: null, sidebarGroup: null };
  };

  const metadata = getMetadata();

  return (
    <SidebarProvider sidebarExpanded={sidebarExpanded}>
      <div className="flex flex-col h-screen overflow-hidden bg-[#F6F8FA]">
        {/* Top Navigation - Full Width */}
        <TopNav 
          onAssistantToggle={() => setIsAssistantOpen(!isAssistantOpen)}
          sidebarExpanded={sidebarExpanded}
        />

        {/* Bottom Section: Sidebar + Main Content */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Sidebar */}
          <Sidebar 
            expanded={sidebarExpanded} 
            onToggle={() => setSidebarExpanded(!sidebarExpanded)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            activeModuleKey={metadata.moduleKey || null}
            activeSidebarGroup={metadata.sidebarGroup || null}
          />

          {/* Main Content Area - Outlet */}
          <main className="flex-1 overflow-y-auto relative z-10">
            <Outlet />
          </main>
        </div>

        {/* Assistant Panel */}
        <AssistantPanel 
          isOpen={isAssistantOpen} 
          onClose={() => setIsAssistantOpen(false)} 
          sidebarExpanded={sidebarExpanded}
        />
      </div>
    </SidebarProvider>
  );
}