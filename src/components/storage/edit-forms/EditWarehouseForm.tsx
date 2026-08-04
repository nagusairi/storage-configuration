import { useState } from 'react';
import { StyledSelect, MenuItem } from '../../ui/StyledSelect';

interface WarehouseFormData {
  name: string;
  code: string;
  address: string;
  gstin: string;
  contactPerson: string;
  contactPhone: string;
  status: 'active' | 'inactive';
  operatingHoursFrom: string;
  operatingHoursTo: string;
  warehouseType: string;
}

interface EditWarehouseFormProps {
  initialData: WarehouseFormData;
  onChange: (data: WarehouseFormData) => void;
}

export function EditWarehouseForm({ initialData, onChange }: EditWarehouseFormProps) {
  const [formData, setFormData] = useState<WarehouseFormData>(initialData);

  const handleChange = (field: keyof WarehouseFormData, value: any) => {
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
              Warehouse Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="Enter warehouse name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Warehouse Code <span className="text-red-500">*</span>
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
              Location/Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white resize-none"
              rows={3}
              placeholder="Enter warehouse address"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              GSTIN
            </label>
            <input
              type="text"
              value={formData.gstin}
              onChange={(e) => handleChange('gstin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="Enter GSTIN (15 characters)"
              maxLength={15}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => handleChange('contactPerson', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="Enter contact person name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              style={{ height: '33px' }}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>
      </div>

      {/* Operational Settings */}
      <div>
        <h4 className="text-sm text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Operational Settings
        </h4>
        <div className="space-y-4">
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

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Operating Hours
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">From</label>
                <input
                  type="time"
                  value={formData.operatingHoursFrom}
                  onChange={(e) => handleChange('operatingHoursFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                  style={{ height: '33px' }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">To</label>
                <input
                  type="time"
                  value={formData.operatingHoursTo}
                  onChange={(e) => handleChange('operatingHoursTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                  style={{ height: '33px' }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Warehouse Type
            </label>
            <StyledSelect
              value={formData.warehouseType}
              onChange={(e) => handleChange('warehouseType', e.target.value)}
              style={{ fontSize: 'var(--text-sm)' }}
            >
              <MenuItem value="own" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Own Warehouse</MenuItem>
              <MenuItem value="3pl" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>3PL Warehouse</MenuItem>
              <MenuItem value="bonded" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Bonded Warehouse</MenuItem>
            </StyledSelect>
          </div>
        </div>
      </div>
    </div>
  );
}
