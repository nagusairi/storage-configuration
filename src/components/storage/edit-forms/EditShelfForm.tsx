import { useState } from 'react';
import { StyledSelect, MenuItem } from '../../ui/StyledSelect';

interface ShelfFormData {
  name: string;
  code: string;
  parentRack: string;
  position: string;
  shelfWidth: string;
  shelfDepth: string;
  dimensionUnit: string;
  capacity: string;
  capacityUnit: string;
  weightLimit: string;
  weightUnit: string;
  numberOfBins: string;
  status: 'active' | 'inactive';
}

interface EditShelfFormProps {
  initialData: ShelfFormData;
  onChange: (data: ShelfFormData) => void;
}

export function EditShelfForm({ initialData, onChange }: EditShelfFormProps) {
  const [formData, setFormData] = useState<ShelfFormData>(initialData);

  const handleChange = (field: keyof ShelfFormData, value: any) => {
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
              Shelf Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="Enter shelf name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Shelf Code <span className="text-red-500">*</span>
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
              Parent Rack <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.parentRack}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-gray-50 cursor-not-allowed"
              style={{ height: '33px' }}
            />
            <p className="text-xs text-gray-500 mt-1">Parent location cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="3"
              min="1"
              max="20"
            />
            <p className="text-xs text-gray-500 mt-1">Level position (1 = Bottom, 5 = Top)</p>
          </div>
        </div>
      </div>

      {/* Physical Configuration */}
      <div>
        <h4 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Physical Configuration
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Shelf Width
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.shelfWidth}
                onChange={(e) => handleChange('shelfWidth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
                placeholder="1.5"
                min="0"
                step="0.1"
              />
              <StyledSelect
                value={formData.dimensionUnit}
                onChange={(e) => handleChange('dimensionUnit', e.target.value)}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <MenuItem value="meters" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Meters</MenuItem>
                <MenuItem value="feet" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Feet</MenuItem>
              </StyledSelect>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Shelf Depth
            </label>
            <input
              type="number"
              value={formData.shelfDepth}
              onChange={(e) => handleChange('shelfDepth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="0.8"
              min="0"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">Unit: {formData.dimensionUnit}</p>
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
                placeholder="200"
                min="0"
              />
              <StyledSelect
                value={formData.capacityUnit}
                onChange={(e) => handleChange('capacityUnit', e.target.value)}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <MenuItem value="cubic_feet" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cubic Feet</MenuItem>
                <MenuItem value="cubic_meters" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cubic Meters</MenuItem>
              </StyledSelect>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Weight Limit <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.weightLimit}
                onChange={(e) => handleChange('weightLimit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
                placeholder="100"
                min="0"
              />
              <StyledSelect
                value={formData.weightUnit}
                onChange={(e) => handleChange('weightUnit', e.target.value)}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <MenuItem value="kg" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>KG</MenuItem>
                <MenuItem value="lbs" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>LBS</MenuItem>
              </StyledSelect>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Number of Bins
            </label>
            <input
              type="number"
              value={formData.numberOfBins}
              onChange={(e) => handleChange('numberOfBins', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="10"
              min="0"
              max="100"
            />
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
