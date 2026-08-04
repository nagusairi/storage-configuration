import { MoveRight } from 'lucide-react';
import { ModulePageTemplate } from '../../components/layouts/ModulePageTemplate';
import { useSidebar } from '../../contexts/SidebarContext';

export function StockMovements() {
  const { sidebarExpanded } = useSidebar();

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Inventory', 'Stock Movements']}
      sidebarExpanded={sidebarExpanded}
      disableTemplatePadding={false}
    >
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <MoveRight className="w-16 h-16 mx-auto mb-4 text-[#5C1F3D]" />
          <h2 className="text-xl text-gray-900 mb-2">Stock Movements</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            This page will track all stock movements including transfers, adjustments, 
            receipts, and shipments with detailed movement history.
          </p>
        </div>
      </div>
    </ModulePageTemplate>
  );
}
