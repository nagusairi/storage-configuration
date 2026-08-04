import { Boxes } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';

export function Bundles() {
  const { sidebarExpanded } = useSidebar();

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Inventory', 'Bundles']}
      sidebarExpanded={sidebarExpanded}
      disableTemplatePadding={false}
    >
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Boxes className="w-16 h-16 mx-auto mb-4 text-[#5C1F3D]" />
          <h2 className="text-xl text-gray-900 mb-2">Bundles</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            This page will display all product bundles with stock status, 
            pricing information, and bundle management capabilities.
          </p>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
