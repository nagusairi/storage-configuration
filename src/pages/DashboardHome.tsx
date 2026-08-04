import { Home } from 'lucide-react';
import { ModulePageTemplate } from '../components/layouts/ModulePageTemplate';
import { useSidebar } from '../contexts/SidebarContext';

export function DashboardHome() {
  const { sidebarExpanded } = useSidebar();

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard']}
      sidebarExpanded={sidebarExpanded}
      disableTemplatePadding={false}
    >
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Home className="w-16 h-16 mx-auto mb-4 text-[#5C1F3D]" />
          <h2 className="text-xl text-gray-900 mb-2">Welcome to ERP Dashboard</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
            Your comprehensive business management platform. Navigate using the sidebar 
            to access Inventory, Finance, Procurement, and other modules.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Inventory</h3>
              <p className="text-xs text-gray-600">Manage items, stock, and warehouses</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Finance</h3>
              <p className="text-xs text-gray-600">Track accounts and transactions</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Procurement</h3>
              <p className="text-xs text-gray-600">Purchase orders and vendors</p>
            </div>
          </div>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
