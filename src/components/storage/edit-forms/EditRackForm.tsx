import { useState } from 'react';
import { StyledSelect, MenuItem } from '../../ui/StyledSelect';

interface RackFormData {
  name: string;
  code: string;
  parentAisle: string;
  numberOfShelves: string;
  rackHeight: string;
  rackWidth: string;
  rackDepth: string;
  dimensionUnit: string;
  weightCapacityPerShelf: string;
  weightUnit: string;
  rackType: string;
  status: 'active' | 'inactive';
}

interface EditRackFormProps {
  initialData: RackFormData;
  onChange: (data: RackFormData) => void;
}

export function EditRackForm({ initialData, onChange }: EditRackFormProps) {
  const [formData, setFormData] = useState<RackFormData>(initialData);

  const handleChange = (field: keyof RackFormData, value: any) => {
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
              Rack Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="Enter rack name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Rack Code <span className="text-red-500">*</span>
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
              Parent Aisle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.parentAisle}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-gray-50 cursor-not-allowed"
              style={{ height: '33px' }}
            />
            <p className="text-xs text-gray-500 mt-1">Parent location cannot be changed</p>
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
              Number of Shelves <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.numberOfShelves}
              onChange={(e) => handleChange('numberOfShelves', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="5"
              min="1"
              max="20"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Rack Height
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.rackHeight}
                onChange={(e) => handleChange('rackHeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
                placeholder="4"
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
              Rack Width
            </label>
            <input
              type="number"
              value={formData.rackWidth}
              onChange={(e) => handleChange('rackWidth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="1.5"
              min="0"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">Unit: {formData.dimensionUnit}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Rack Depth
            </label>
            <input
              type="number"
              value={formData.rackDepth}
              onChange={(e) => handleChange('rackDepth', e.target.value)}
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
              Weight Capacity per Shelf <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.weightCapacityPerShelf}
                onChange={(e) => handleChange('weightCapacityPerShelf', e.target.value)}
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
                <MenuItem value="tons" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Tons</MenuItem>
              </StyledSelect>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Rack Type
            </label>
            <StyledSelect
              value={formData.rackType}
              onChange={(e) => handleChange('rackType', e.target.value)}
              style={{ fontSize: 'var(--text-sm)' }}
            >
              <MenuItem value="pallet" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Pallet Rack</MenuItem>
              <MenuItem value="cantilever" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Cantilever Rack</MenuItem>
              <MenuItem value="drive-in" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Drive-In Rack</MenuItem>
              <MenuItem value="push-back" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Push-Back Rack</MenuItem>
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
