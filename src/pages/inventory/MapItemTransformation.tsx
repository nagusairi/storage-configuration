import { GitBranch } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';

export function MapItemTransformation() {
  const { sidebarExpanded } = useSidebar();

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Inventory', 'Item Transformation', 'Map Items']}
      sidebarExpanded={sidebarExpanded}
      disableTemplatePadding={false}
    >
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <GitBranch className="w-16 h-16 mx-auto mb-4 text-[#5C1F3D]" />
          <h2 className="text-xl text-gray-900 mb-2">Map Item Transformation</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            This page will provide a multi-step wizard to map base items to processing workflows, 
            configure output items, and set transformation rules.
          </p>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
