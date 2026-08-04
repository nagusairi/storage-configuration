import { X, ChevronRight } from 'lucide-react';
import { CloseButton } from '../../ui/CloseButton';
import { StorageNode } from '../../../data/mockStorageData';
import { getColorDisplay } from '../../../utils/zoneColors';

interface EditLocationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  breadcrumbs?: StorageNode[];
  children: React.ReactNode;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function EditLocationPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  breadcrumbs = [],
  children,
  onSave,
  onCancel,
  isSaving = false
}: EditLocationPanelProps) {
  if (!isOpen) return null;

  // Helper function to get parent zone color from breadcrumbs
  const getParentZoneColor = (): string | null => {
    // Find the zone in breadcrumbs (first occurrence from root)
    const zone = breadcrumbs.find(n => n.type === 'zone' && n.colorTag);
    if (zone && zone.colorTag) {
      return getColorDisplay(zone.colorTag).hex;
    }
    return null;
  };

  const zoneColor = getParentZoneColor();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" 
        onClick={onClose}
      />
      
      {/* Slide-Over Panel */}
      <div className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div 
          className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${
            zoneColor ? 'border-l-4' : ''
          }`}
          style={
            zoneColor
              ? { borderLeftColor: zoneColor }
              : undefined
          }
        >
          <div className="flex-1 min-w-0 pr-4">
            {/* Breadcrumb */}
            {breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-600 overflow-x-auto">
                {breadcrumbs.map((node, index) => (
                  <div key={node.id} className="flex items-center gap-1.5 flex-shrink-0">
                    {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400" />}
                    <span className="text-gray-700">{node.name}</span>
                  </div>
                ))}
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="text-[#5C1F3D] font-medium">Edit</span>
              </div>
            )}
            <h3 className="text-base text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <CloseButton onClick={onClose} />
        </div>
        
        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
        
        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between bg-gray-50">
          <button 
            className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            style={{ height: '33px' }}
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
            style={{ height: '33px' }}
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}