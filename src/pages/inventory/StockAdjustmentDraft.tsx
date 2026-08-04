import { FileEdit } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';

export function StockAdjustmentDraft() {
  const { sidebarExpanded } = useSidebar();

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Inventory', 'Stock Adjustments', 'Draft']}
      sidebarExpanded={sidebarExpanded}
      disableTemplatePadding={false}
    >
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <FileEdit className="w-16 h-16 mx-auto mb-4 text-[#5C1F3D]" />
          <h2 className="text-xl text-gray-900 mb-2">Stock Adjustment Draft</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            This page will display and allow editing of saved stock adjustment drafts 
            before final submission and posting.
          </p>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
