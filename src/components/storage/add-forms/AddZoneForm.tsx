import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { StyledTextField } from '../../ui/StyledTextField';
import { StyledSelect, MenuItem } from '../../ui/StyledSelect';
import { ColorPicker } from '../../ui/ColorPicker';
import { StorageNode } from '../../../data/mockStorageData';

interface AddZoneFormProps {
  parentWarehouse: StorageNode;
  parentChain?: StorageNode[];
  onSave: (zoneData: Partial<StorageNode>) => void;
  onCancel: () => void;
}

// Predefined color options
const COLOR_OPTIONS = [
  { value: 'red', label: 'Red', hex: '#EF4444' },
  { value: 'orange', label: 'Orange', hex: '#F97316' },
  { value: 'yellow', label: 'Yellow', hex: '#EAB308' },
  { value: 'green', label: 'Green', hex: '#22C55E' },
  { value: 'blue', label: 'Blue', hex: '#3B82F6' },
  { value: 'purple', label: 'Purple', hex: '#A855F7' },
  { value: 'pink', label: 'Pink', hex: '#EC4899' },
  { value: 'gray', label: 'Gray', hex: '#6B7280' },
];

export function AddZoneForm({ parentWarehouse, parentChain = [], onSave, onCancel }: AddZoneFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    colorTag: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    capacity: '',
  });

  const [bulkCreate, setBulkCreate] = useState(false);
  const [bulkCount, setBulkCount] = useState('1');
  const [bulkPrefix, setBulkPrefix] = useState('Zone');

  // Auto-generate code when name changes
  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      code: value ? `ZN-${value.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}` : ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (bulkCreate) {
      // Bulk creation logic
      const count = parseInt(bulkCount);
      for (let i = 1; i <= count; i++) {
        const zoneData: Partial<StorageNode> = {
          type: 'zone',
          name: `${bulkPrefix} ${i}`,
          code: `ZN-${bulkPrefix.substring(0, 3).toUpperCase()}-${i.toString().padStart(3, '0')}`,
          colorTag: formData.colorTag || 'blue',
          description: formData.description,
          status: formData.status,
          capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
          parentId: parentWarehouse.id,
        };
        onSave(zoneData);
      }
    } else {
      // Single creation
      const zoneData: Partial<StorageNode> = {
        type: 'zone',
        name: formData.name,
        code: formData.code,
        colorTag: formData.colorTag || 'blue',
        description: formData.description,
        status: formData.status,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        parentId: parentWarehouse.id,
      };
      onSave(zoneData);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex-1 min-w-0 pr-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-600 overflow-x-auto">
            {parentChain.length > 0 ? (
              <>
                {parentChain.map((node, index) => (
                  <div key={node.id} className="flex items-center gap-1.5 flex-shrink-0">
                    {index > 0 && <ChevronRight className="w-3 h-3 text-gray-400" />}
                    <span className="text-gray-700">{node.name}</span>
                  </div>
                ))}
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="text-[#5C1F3D] font-medium">Add Zone</span>
              </>
            ) : (
              <>
                <span className="text-gray-700">{parentWarehouse.name}</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="text-[#5C1F3D] font-medium">Add Zone</span>
              </>
            )}
          </div>
          <h3 className="text-base text-gray-900">Add New Zone</h3>
          <p className="text-xs text-gray-500 mt-1">
            Create new zone under {parentWarehouse.name}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bulk Creation Toggle */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bulkCreate}
                onChange={(e) => setBulkCreate(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#5C1F3D] focus:ring-[#5C1F3D]"
              />
              <span className="text-sm text-gray-700">Create multiple zones at once</span>
            </label>
          </div>

          {bulkCreate ? (
            /* Bulk Creation Mode */
            <>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Zone Name Prefix <span className="text-red-500">*</span>
                </label>
                <StyledTextField
                  value={bulkPrefix}
                  onChange={(e) => setBulkPrefix(e.target.value)}
                  placeholder="e.g., Zone, Area, Section"
                  className="w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Zones will be named: {bulkPrefix} 1, {bulkPrefix} 2, etc.
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Number of Zones <span className="text-red-500">*</span>
                </label>
                <StyledTextField
                  type="number"
                  value={bulkCount}
                  onChange={(e) => setBulkCount(e.target.value)}
                  placeholder="Enter count"
                  className="w-full"
                  inputProps={{ min: 1, max: 50 }}
                  required
                />
              </div>
            </>
          ) : (
            /* Single Creation Mode */
            <>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Zone Name <span className="text-red-500">*</span>
                </label>
                <StyledTextField
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Zone A, North Wing"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Zone Code
                </label>
                <StyledTextField
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Auto-generated"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated based on zone name
                </p>
              </div>
            </>
          )}

          {/* Common fields for both modes */}
          <ColorPicker
            value={formData.colorTag}
            onChange={(color) => setFormData(prev => ({ ...prev, colorTag: color }))}
            label="Color Tag"
            helperText="This color will be used throughout the system for this zone"
            required
          />

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white resize-none"
              placeholder="Optional description..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Status
            </label>
            <StyledSelect
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
              className="w-full"
              style={{ fontSize: 'var(--text-sm)' }}
            >
              <MenuItem value="active" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Active</MenuItem>
              <MenuItem value="inactive" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Inactive</MenuItem>
            </StyledSelect>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Capacity (Optional)
            </label>
            <StyledTextField
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
              placeholder="e.g., 1000"
              className="w-full"
              inputProps={{ min: 0 }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum storage capacity for this zone
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 bg-gray-50 flex-shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          style={{ height: '33px' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
          style={{ height: '33px' }}
        >
          {bulkCreate ? `Create ${bulkCount} Zones` : 'Create Zone'}
        </button>
      </div>
    </div>
  );
}