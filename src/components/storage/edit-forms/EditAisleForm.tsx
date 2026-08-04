import { useState } from 'react';
import { StyledSelect, MenuItem } from '../../ui/StyledSelect';

interface AisleFormData {
  name: string;
  code: string;
  parentZone: string;
  length: string;
  lengthUnit: string;
  width: string;
  widthUnit: string;
  height: string;
  heightUnit: string;
  capacity: string;
  capacityUnit: string;
  accessType: string;
  status: 'active' | 'inactive';
}

interface EditAisleFormProps {
  initialData: AisleFormData;
  onChange: (data: AisleFormData) => void;
}

export function EditAisleForm({ initialData, onChange }: EditAisleFormProps) {
  const [formData, setFormData] = useState<AisleFormData>(initialData);

  const handleChange = (field: keyof AisleFormData, value: any) => {
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
              Aisle Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="Enter aisle name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Aisle Code <span className="text-red-500">*</span>
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
              Parent Zone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.parentZone}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-gray-50 cursor-not-allowed"
              style={{ height: '33px' }}
            />
            <p className="text-xs text-gray-500 mt-1">Parent location cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Physical Attributes */}
      <div>
        <h4 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Physical Attributes
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Length
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.length}
                onChange={(e) => handleChange('length', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
                placeholder="20"
                min="0"
                step="0.1"
              />
              <StyledSelect
                value={formData.lengthUnit}
                onChange={(e) => handleChange('lengthUnit', e.target.value)}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <MenuItem value="meters" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Meters</MenuItem>
                <MenuItem value="feet" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Feet</MenuItem>
              </StyledSelect>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Width
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.width}
                onChange={(e) => handleChange('width', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
                placeholder="2.5"
                min="0"
                step="0.1"
              />
              <StyledSelect
                value={formData.widthUnit}
                onChange={(e) => handleChange('widthUnit', e.target.value)}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <MenuItem value="meters" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Meters</MenuItem>
                <MenuItem value="feet" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Feet</MenuItem>
              </StyledSelect>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Height
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
                placeholder="5"
                min="0"
                step="0.1"
              />
              <StyledSelect
                value={formData.heightUnit}
                onChange={(e) => handleChange('heightUnit', e.target.value)}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <MenuItem value="meters" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Meters</MenuItem>
                <MenuItem value="feet" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Feet</MenuItem>
              </StyledSelect>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Capacity <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
                placeholder="500"
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
            <label className="block text-sm text-gray-700 mb-2">
              Access Type
            </label>
            <StyledSelect
              value={formData.accessType}
              onChange={(e) => handleChange('accessType', e.target.value)}
              style={{ fontSize: 'var(--text-sm)' }}
            >
              <MenuItem value="single-sided" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Single-Sided</MenuItem>
              <MenuItem value="double-sided" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Double-Sided</MenuItem>
            </StyledSelect>
          </div>

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
