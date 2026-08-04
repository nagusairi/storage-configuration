import { Edit3 } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';

export function InventoryAdjustments() {
  const { sidebarExpanded } = useSidebar();

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Inventory', 'Inventory Adjustments']}
      sidebarExpanded={sidebarExpanded}
      disableTemplatePadding={false}
    >
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Edit3 className="w-16 h-16 mx-auto mb-4 text-[#5C1F3D]" />
          <h2 className="text-xl text-gray-900 mb-2">Inventory Adjustments</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            This page will manage stock adjustments, cycle counts, physical inventory updates, 
            and adjustment history with audit trails.
          </p>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
