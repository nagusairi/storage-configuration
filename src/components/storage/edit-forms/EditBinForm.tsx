import { useState } from 'react';
import { StyledSelect, MenuItem } from '../../ui/StyledSelect';

interface BinFormData {
  name: string;
  code: string;
  parentShelf: string;
  binPosition: string;
  binWidth: string;
  binDepth: string;
  binHeight: string;
  dimensionUnit: string;
  capacity: string;
  capacityUnit: string;
  binType: string;
  barcode: string;
  status: 'active' | 'inactive' | 'reserved';
}

interface EditBinFormProps {
  initialData: BinFormData;
  onChange: (data: BinFormData) => void;
}

export function EditBinForm({ initialData, onChange }: EditBinFormProps) {
  const [formData, setFormData] = useState<BinFormData>(initialData);

  const handleChange = (field: keyof BinFormData, value: any) => {
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
              Bin Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="Enter bin name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Bin Code <span className="text-red-500">*</span>
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
              Parent Shelf <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.parentShelf}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-gray-50 cursor-not-allowed"
              style={{ height: '33px' }}
            />
            <p className="text-xs text-gray-500 mt-1">Parent location cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Bin Configuration */}
      <div>
        <h4 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Bin Configuration
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Bin Position <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.binPosition}
              onChange={(e) => handleChange('binPosition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="5"
              min="1"
              max="100"
            />
            <p className="text-xs text-gray-500 mt-1">Sequential position on shelf</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Bin Width
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                value={formData.binWidth}
                onChange={(e) => handleChange('binWidth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                style={{ height: '33px' }}
                placeholder="0.3"
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
              Bin Depth
            </label>
            <input
              type="number"
              value={formData.binDepth}
              onChange={(e) => handleChange('binDepth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="0.3"
              min="0"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">Unit: {formData.dimensionUnit}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Bin Height
            </label>
            <input
              type="number"
              value={formData.binHeight}
              onChange={(e) => handleChange('binHeight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="0.4"
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
                placeholder="50"
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
              Bin Type
            </label>
            <StyledSelect
              value={formData.binType}
              onChange={(e) => handleChange('binType', e.target.value)}
              style={{ fontSize: 'var(--text-sm)' }}
            >
              <MenuItem value="standard" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Standard</MenuItem>
              <MenuItem value="small-parts" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Small Parts</MenuItem>
              <MenuItem value="bulk" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Bulk</MenuItem>
            </StyledSelect>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Barcode/QR Code
            </label>
            <input
              type="text"
              value={formData.barcode}
              onChange={(e) => handleChange('barcode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="BIN-B01-QR"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated, can be customized</p>
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="reserved"
                  checked={formData.status === 'reserved'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-4 h-4 text-[#5C1F3D] focus:ring-[#5C1F3D]"
                />
                <span className="text-sm text-gray-700">Reserved</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
