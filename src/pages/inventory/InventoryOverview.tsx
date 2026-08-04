import { LayoutDashboard } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';

export function InventoryOverview() {
  const { sidebarExpanded } = useSidebar();

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Inventory', 'Overview']}
      sidebarExpanded={sidebarExpanded}
      disableTemplatePadding={false}
    >
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-[#5C1F3D]" />
          <h2 className="text-xl text-gray-900 mb-2">Inventory Overview</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            This page will provide a comprehensive dashboard with KPIs, stock summaries, 
            recent activities, and quick access to key inventory functions.
          </p>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
