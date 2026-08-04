import { Repeat } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';

export function UnitOfMeasure() {
  const { sidebarExpanded } = useSidebar();

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Inventory', 'Item Transformation']}
      sidebarExpanded={sidebarExpanded}
      disableTemplatePadding={false}
    >
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Repeat className="w-16 h-16 mx-auto mb-4 text-[#5C1F3D]" />
          <h2 className="text-xl text-gray-900 mb-2">Item Transformation</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            This page will manage unit of measure conversions, item transformations, 
            and processing workflows with yield tracking and variant management.
          </p>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
