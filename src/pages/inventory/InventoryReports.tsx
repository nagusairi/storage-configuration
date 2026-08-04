import { BarChart3 } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';

export function InventoryReports() {
  const { sidebarExpanded } = useSidebar();

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Inventory', 'Reports']}
      sidebarExpanded={sidebarExpanded}
      disableTemplatePadding={false}
    >
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[#5C1F3D]" />
          <h2 className="text-xl text-gray-900 mb-2">Inventory Reports</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            This page will provide comprehensive inventory reports including stock valuation, 
            movement analysis, aging reports, and custom report generation.
          </p>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
