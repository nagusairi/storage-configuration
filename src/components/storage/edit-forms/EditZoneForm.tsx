import { useState } from 'react';
import { StyledSelect, MenuItem } from '../../ui/StyledSelect';
import { ColorPicker } from '../../ui/ColorPicker';

interface ZoneFormData {
  name: string;
  code: string;
  parentWarehouse: string;
  description: string;
  totalCapacity: string;
  capacityUnit: string;
  temperatureControlled: boolean;
  temperatureRange: string;
  colorTag: string;
  status: 'active' | 'inactive';
}

interface EditZoneFormProps {
  initialData: ZoneFormData;
  onChange: (data: ZoneFormData) => void;
}

// Predefined color options (same as AddZoneForm)
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

export function EditZoneForm({ initialData, onChange }: EditZoneFormProps) {
  const [formData, setFormData] = useState<ZoneFormData>(initialData);

  const handleChange = (field: keyof ZoneFormData, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h4 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Basic Information
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Zone Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="Enter zone name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Zone Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-gray-50 cursor-not-allowed"
              style={{ height: '33px' }}
            />
            <p className="text-xs text-gray-500 mt-1">Code cannot be changed after creation</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Parent Warehouse <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.parentWarehouse}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-gray-50 cursor-not-allowed"
              style={{ height: '33px' }}
            />
            <p className="text-xs text-gray-500 mt-1">Parent location cannot be changed</p>
          </div>

          <div>
            <ColorPicker
              value={formData.colorTag}
              onChange={(color) => handleChange('colorTag', color)}
              label="Color Tag"
              helperText="This color will be used throughout the system for this zone"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white resize-none"
              rows={3}
              placeholder="Enter zone description"
            />
          </div>
        </div>
      </div>

      {/* Capacity Configuration */}
      <div>
        <h4 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Capacity Configuration
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Total Capacity <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.totalCapacity}
                onChange={(e) => handleChange('totalCapacity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
                placeholder="10000"
                min="0"
              />
              <StyledSelect
                value={formData.capacityUnit}
                onChange={(e) => handleChange('capacityUnit', e.target.value)}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <MenuItem value="cubic_feet" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cubic Feet</MenuItem>
                <MenuItem value="cubic_meters" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cubic Meters</MenuItem>
                <MenuItem value="pallets" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Pallets</MenuItem>
              </StyledSelect>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.temperatureControlled}
                onChange={(e) => handleChange('temperatureControlled', e.target.checked)}
                className="w-4 h-4 text-[#5C1F3D] focus:ring-[#5C1F3D] rounded"
              />
              <span className="text-sm text-gray-700">Temperature Controlled</span>
            </label>
          </div>

          {formData.temperatureControlled && (
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Temperature Range
              </label>
              <input
                type="text"
                value={formData.temperatureRange}
                onChange={(e) => handleChange('temperatureRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
                placeholder="15°C - 25°C"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-4 h-4 text-[#5C1F3D] focus:ring-[#5C1F3D]"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-4 h-4 text-[#5C1F3D] focus:ring-[#5C1F3D]"
                />
                <span className="text-sm text-gray-700">Inactive</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}