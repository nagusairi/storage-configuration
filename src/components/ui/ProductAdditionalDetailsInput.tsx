import React, { useState, useRef } from 'react';
import { ImageIcon, X, Plus, Trash2, Search } from 'lucide-react';
import { StyledTextField } from './StyledTextField';
import { StyledSelect, MenuItem } from './StyledSelect';

/**
 * ProductAdditionalDetailsInput Component
 * 
 * A comprehensive additional information component for goods/products including:
 * - Barcode and QR code inputs
 * - Physical dimensions (length, width, height with unit)
 * - Weight with unit
 * - Product image upload (drag-drop, multiple images, lightbox viewer)
 * - Tracking options (batch, serial, expiry)
 * - Default bin location management with searchable warehouses
 * 
 * Features:
 * - Multi-image upload with drag-and-drop
 * - Image size validation (10MB limit)
 * - Image lightbox viewer with navigation
 * - Primary image indication
 * - Searchable warehouse selection for bin locations
 * - Complete bin location hierarchy (Zone > Aisle > Rack > Shelf > Bin)
 * - Bulk bin location operations
 * - Location preview breadcrumb
 * - Form validation
 * - Accessible keyboard navigation
 * 
 * @example
 * ```tsx
 * <ProductAdditionalDetailsInput
 *   availableWarehouses={warehouses}
 *   initialData={{
 *     barcode: '',
 *     qrCode: '',
 *     dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
 *     weight: { value: 0, unit: 'kg' },
 *     images: [],
 *     tracking: { batch: false, serial: false, expiry: false },
 *     hasBinLocation: false,
 *     binLocations: []
 *   }}
 *   onChange={(data) => console.log('Data:', data)}
 *   onValidationChange={(isValid, errors) => console.log('Valid:', isValid)}
 *   required
 *   showValidation
 * />
 * ```
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface Warehouse {
  id: number | string;
  warehouseName: string;
  warehouseCode: string;
}

export interface UploadedImage {
  file: File;
  preview: string;
  id: number;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'm' | 'in' | 'ft';
}

export interface Weight {
  value: number;
  unit: 'kg' | 'g' | 'lbs' | 'oz';
}

export interface TrackingOptions {
  batch: boolean;
  serial: boolean;
  expiry: boolean;
}

export interface BinLocation {
  id: number | string;
  warehouse: string;
  warehouseCode: string;
  zone: string;
  aisle: string;
  rack: string;
  shelf: string;
  bin: string;
}

export interface ProductAdditionalDetailsData {
  barcode: string;
  qrCode: string;
  dimensions: Dimensions;
  weight: Weight;
  images: UploadedImage[];
  tracking: TrackingOptions;
  hasBinLocation: boolean;
  binLocations: BinLocation[];
}

export interface ProductAdditionalDetailsInputProps {
  // Data
  availableWarehouses?: Warehouse[];
  initialData?: Partial<ProductAdditionalDetailsData>;
  
  // Callbacks
  onChange?: (data: ProductAdditionalDetailsData) => void;
  onValidationChange?: (isValid: boolean, errors: ValidationErrors) => void;
  
  // Validation
  required?: boolean;
  showValidation?: boolean;
  maxImageSizeMB?: number;
  
  // Customization
  sectionTitle?: string;
  className?: string;
  disabled?: boolean;
}

export interface ValidationErrors {
  barcode?: string;
  qrCode?: string;
  dimensions?: string;
  weight?: string;
  images?: string;
  binLocations?: string;
}

// ============================================================================
// Main Component
// ============================================================================

// Default warehouse data (matches data used across inventory screens)
const DEFAULT_WAREHOUSES: Warehouse[] = [
  { id: 1, warehouseName: 'Main Warehouse', warehouseCode: 'WH-MAIN' },
  { id: 2, warehouseName: 'Main Distribution Center', warehouseCode: 'WH-MDC' },
  { id: 3, warehouseName: 'West Wing', warehouseCode: 'WH-WEST' },
  { id: 4, warehouseName: 'East Wing', warehouseCode: 'WH-EAST' },
  { id: 5, warehouseName: 'South Branch', warehouseCode: 'WH-SOUTH' },
  { id: 6, warehouseName: 'West Coast Hub', warehouseCode: 'WH-WCH' },
  { id: 7, warehouseName: 'East Coast Facility', warehouseCode: 'WH-ECF' }
];

export function ProductAdditionalDetailsInput({
  availableWarehouses = DEFAULT_WAREHOUSES,
  initialData,
  onChange,
  onValidationChange,
  required = false,
  showValidation = false,
  maxImageSizeMB = 10,
  sectionTitle = 'Additional Details',
  className = '',
  disabled = false
}: ProductAdditionalDetailsInputProps) {
  
  // ============================================================================
  // State Management
  // ============================================================================
  
  const [barcode, setBarcode] = useState(initialData?.barcode ?? '');
  const [qrCode, setQrCode] = useState(initialData?.qrCode ?? '');
  const [dimensions, setDimensions] = useState<Dimensions>(
    initialData?.dimensions ?? { length: 0, width: 0, height: 0, unit: 'cm' }
  );
  const [weight, setWeight] = useState<Weight>(
    initialData?.weight ?? { value: 0, unit: 'kg' }
  );
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    initialData?.images ?? []
  );
  const [tracking, setTracking] = useState<TrackingOptions>(
    initialData?.tracking ?? { batch: false, serial: false, expiry: false }
  );
  const [hasBinLocation, setHasBinLocation] = useState(
    initialData?.hasBinLocation ?? false
  );
  const [binLocations, setBinLocations] = useState<BinLocation[]>(
    initialData?.binLocations ?? []
  );
  
  // Image upload state
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Bin location state
  const [showBinLocationForm, setShowBinLocationForm] = useState(false);
  const [currentBinLocation, setCurrentBinLocation] = useState<Partial<BinLocation>>({
    warehouse: '',
    warehouseCode: '',
    zone: '',
    aisle: '',
    rack: '',
    shelf: '',
    bin: ''
  });
  const [binLocationWarehouseSearch, setBinLocationWarehouseSearch] = useState('');
  const [showBinLocationWarehouseDropdown, setShowBinLocationWarehouseDropdown] = useState(false);
  const [selectedBinLocationIds, setSelectedBinLocationIds] = useState<(number | string)[]>([]);
  
  // Delete confirmation modal state
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<{
    type: 'single' | 'bulk';
    locationId?: number | string;
    locations?: BinLocation[];
  } | null>(null);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({
    barcode: false,
    qrCode: false,
    dimensions: false,
    weight: false,
    images: false,
    binLocations: false
  });
  
  // ============================================================================
  // Validation Logic
  // ============================================================================
  
  const validateForm = (): { isValid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {};
    
    // Validate bin locations if enabled
    if (hasBinLocation && binLocations.length === 0) {
      errors.binLocations = 'Please add at least one bin location';
    }
    
    // Validate image sizes
    const oversizedImages = uploadedImages.filter(img => img.file.size > maxImageSizeMB * 1024 * 1024);
    if (oversizedImages.length > 0) {
      errors.images = `${oversizedImages.length} image(s) exceed ${maxImageSizeMB}MB limit`;
    }
    
    const isValid = Object.keys(errors).length === 0;
    return { isValid, errors };
  };
  
  // ============================================================================
  // Effects
  // ============================================================================
  
  React.useEffect(() => {
    if (onChange) {
      const data: ProductAdditionalDetailsData = {
        barcode,
        qrCode,
        dimensions,
        weight,
        images: uploadedImages,
        tracking,
        hasBinLocation,
        binLocations
      };
      onChange(data);
    }
  }, [barcode, qrCode, dimensions, weight, uploadedImages, tracking, hasBinLocation, binLocations, onChange]);
  
  React.useEffect(() => {
    if (onValidationChange) {
      const { isValid, errors } = validateForm();
      onValidationChange(isValid, errors);
    }
  }, [uploadedImages, hasBinLocation, binLocations, onValidationChange]);
  
  React.useEffect(() => {
    if (showValidation) {
      const { errors } = validateForm();
      setValidationErrors(errors);
      setTouched({
        barcode: true,
        qrCode: true,
        dimensions: true,
        weight: true,
        images: true,
        binLocations: true
      });
    }
  }, [showValidation]);
  
  // Cleanup image URLs on unmount
  React.useEffect(() => {
    return () => {
      uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    };
  }, []);
  
  // ============================================================================
  // Image Upload Handlers
  // ============================================================================
  
  const validateImageFile = (file: File): string | null => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return `Invalid file type: ${file.type}. Only PNG, JPG, and GIF are allowed.`;
    }
    
    const maxSizeBytes = maxImageSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds ${maxImageSizeMB}MB limit.`;
    }
    
    return null;
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    const newImages: UploadedImage[] = [];
    const errors: string[] = [];
    
    fileArray.forEach(file => {
      const error = validateImageFile(file);
      if (error) {
        errors.push(error);
      } else {
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          id: Date.now() + Math.random()
        });
      }
    });
    
    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }
    
    if (newImages.length > 0) {
      setUploadedImages(prev => [...prev, ...newImages]);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    const newImages: UploadedImage[] = [];
    const errors: string[] = [];
    
    fileArray.forEach(file => {
      const error = validateImageFile(file);
      if (error) {
        errors.push(error);
      } else {
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          id: Date.now() + Math.random()
        });
      }
    });
    
    if (errors.length > 0) {
      alert(`Upload errors:\n${errors.join('\n')}`);
    }
    
    if (newImages.length > 0) {
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const imageToRemove = uploadedImages[index];
    URL.revokeObjectURL(imageToRemove.preview);
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    }
  };
  
  // ============================================================================
  // Bin Location Handlers
  // ============================================================================
  
  const handleAddBinLocation = () => {
    if (!currentBinLocation.warehouse) {
      alert('Please select a warehouse');
      return;
    }
    
    const newLocation: BinLocation = {
      id: Date.now(),
      warehouse: currentBinLocation.warehouse || '',
      warehouseCode: currentBinLocation.warehouseCode || '',
      zone: currentBinLocation.zone || '',
      aisle: currentBinLocation.aisle || '',
      rack: currentBinLocation.rack || '',
      shelf: currentBinLocation.shelf || '',
      bin: currentBinLocation.bin || ''
    };
    
    setBinLocations(prev => [...prev, newLocation]);
    setShowBinLocationForm(false);
    setCurrentBinLocation({
      warehouse: '',
      warehouseCode: '',
      zone: '',
      aisle: '',
      rack: '',
      shelf: '',
      bin: ''
    });
    setBinLocationWarehouseSearch('');
  };
  
  const handleRemoveBinLocation = (id: number | string) => {
    const locationToRemove = binLocations.find(loc => loc.id === id);
    if (!locationToRemove) return;
    
    setDeleteModalData({
      type: 'single',
      locationId: id,
      locations: [locationToRemove]
    });
    setShowDeleteConfirmModal(true);
  };
  
  const handleBulkRemoveBinLocations = () => {
    const locationsToRemove = binLocations.filter(loc => selectedBinLocationIds.includes(loc.id));
    setDeleteModalData({
      type: 'bulk',
      locations: locationsToRemove
    });
    setShowDeleteConfirmModal(true);
  };
  
  const confirmDelete = () => {
    if (!deleteModalData) return;
    
    if (deleteModalData.type === 'single' && deleteModalData.locationId) {
      setBinLocations(prev => prev.filter(loc => loc.id !== deleteModalData.locationId));
      setSelectedBinLocationIds(prev => prev.filter(locId => locId !== deleteModalData.locationId));
    } else if (deleteModalData.type === 'bulk') {
      setBinLocations(prev => prev.filter(loc => !selectedBinLocationIds.includes(loc.id)));
      setSelectedBinLocationIds([]);
    }
    
    setShowDeleteConfirmModal(false);
    setDeleteModalData(null);
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setDeleteModalData(null);
  };
  
  const handleSelectAllBinLocations = (checked: boolean) => {
    if (checked) {
      setSelectedBinLocationIds(binLocations.map(loc => loc.id));
    } else {
      setSelectedBinLocationIds([]);
    }
  };
  
  const handleToggleBinLocationRow = (id: number | string, checked: boolean) => {
    if (checked) {
      setSelectedBinLocationIds(prev => [...prev, id]);
    } else {
      setSelectedBinLocationIds(prev => prev.filter(locId => locId !== id));
    }
  };
  
  const getFilteredWarehouses = () => {
    return availableWarehouses.filter(warehouse => {
      if (!binLocationWarehouseSearch) return true;
      const searchLower = binLocationWarehouseSearch.toLowerCase();
      return (
        warehouse.warehouseName.toLowerCase().includes(searchLower) ||
        warehouse.warehouseCode.toLowerCase().includes(searchLower)
      );
    });
  };
  
  const getBinLocationPreview = () => {
    return [
      currentBinLocation.warehouse,
      currentBinLocation.zone,
      currentBinLocation.aisle,
      currentBinLocation.rack,
      currentBinLocation.shelf,
      currentBinLocation.bin
    ].filter(Boolean).join(' > ') || 'No location specified';
  };
  
  // ============================================================================
  // Render Helpers
  // ============================================================================
  
  const filteredWarehouses = getFilteredWarehouses();
  const allBinLocationsSelected = selectedBinLocationIds.length === binLocations.length && binLocations.length > 0;
  const showError = (field: keyof typeof touched) => touched[field] && validationErrors[field];
  
  // ============================================================================
  // Render
  // ============================================================================
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dimensions & Weight */}
      <div>
        <label className="block text-sm text-gray-700 mb-1">
          Dimensions & Weight
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Size details, shipping/storage calculations, and freight management
        </p>
        <div className="flex gap-4">
          {/* Dimensions Box */}
          <div className="border border-gray-300 rounded-lg p-4" style={{ width: '500px' }}>
            <div className="flex gap-3">
              {/* Length */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1.5">Length</label>
                <StyledTextField
                  type="number"
                  placeholder="0"
                  value={dimensions.length || ''}
                  onChange={(e) => setDimensions(prev => ({ ...prev, length: Number(e.target.value) }))}
                  inputProps={{ min: 0 }}
                  disabled={disabled}
                  style={{ minHeight: '1.4375em' }}
                />
              </div>

              {/* Width */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1.5">Width</label>
                <StyledTextField
                  type="number"
                  placeholder="0"
                  value={dimensions.width || ''}
                  onChange={(e) => setDimensions(prev => ({ ...prev, width: Number(e.target.value) }))}
                  inputProps={{ min: 0 }}
                  disabled={disabled}
                  style={{ minHeight: '1.4375em' }}
                />
              </div>

              {/* Height */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1.5">Height</label>
                <StyledTextField
                  type="number"
                  placeholder="0"
                  value={dimensions.height || ''}
                  onChange={(e) => setDimensions(prev => ({ ...prev, height: Number(e.target.value) }))}
                  inputProps={{ min: 0 }}
                  disabled={disabled}
                  style={{ minHeight: '1.4375em' }}
                />
              </div>

              {/* Single Unit Dropdown for All Dimensions */}
              <div style={{ width: '80px' }}>
                <label className="block text-xs text-gray-500 mb-1.5">Unit</label>
                <StyledSelect
                  value={dimensions.unit}
                  onChange={(e) => setDimensions(prev => ({ ...prev, unit: e.target.value as Dimensions['unit'] }))}
                  disabled={disabled}
                  fullWidth={false}
                  minWidth={80}
                  style={{ fontSize: 'var(--text-sm)', minHeight: '1.4375em' }}
                >
                  <MenuItem value="cm" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>cm</MenuItem>
                  <MenuItem value="m" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>m</MenuItem>
                  <MenuItem value="in" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>in</MenuItem>
                  <MenuItem value="ft" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>ft</MenuItem>
                </StyledSelect>
              </div>
            </div>
          </div>

          {/* Weight Box */}
          <div className="border border-gray-300 rounded-lg p-4" style={{ width: '180px' }}>
            <div className="flex gap-3">
              {/* Weight with Unit */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1.5">Weight</label>
                <div className="flex gap-2">
                  <StyledTextField
                    type="number"
                    placeholder="0"
                    value={weight.value || ''}
                    onChange={(e) => setWeight(prev => ({ ...prev, value: Number(e.target.value) }))}
                    inputProps={{ min: 0 }}
                    disabled={disabled}
                    style={{ minHeight: '1.4375em', flex: 1 }}
                  />
                  <StyledSelect
                    value={weight.unit}
                    onChange={(e) => setWeight(prev => ({ ...prev, unit: e.target.value as Weight['unit'] }))}
                    disabled={disabled}
                    fullWidth={false}
                    minWidth={70}
                    style={{ fontSize: 'var(--text-sm)', minHeight: '1.4375em' }}
                  >
                    <MenuItem value="kg" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>kg</MenuItem>
                    <MenuItem value="g" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>g</MenuItem>
                    <MenuItem value="lbs" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>lbs</MenuItem>
                    <MenuItem value="oz" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>oz</MenuItem>
                  </StyledSelect>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Image Upload */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Product Image
        </label>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif"
          multiple
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        {/* Upload Dropzone */}
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          onDragOver={!disabled ? handleDragOver : undefined}
          onDragLeave={!disabled ? handleDragLeave : undefined}
          onDrop={!disabled ? handleDrop : undefined}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          } ${
            isDragging
              ? 'border-[#5C1F3D] bg-purple-50'
              : 'border-gray-300 hover:border-[#5C1F3D]'
          }`}
        >
          <ImageIcon className={`w-12 h-12 mx-auto mb-3 transition-colors ${
            isDragging ? 'text-[#5C1F3D]' : 'text-gray-400'
          }`} />
          <p className="text-sm text-gray-600 mb-1">
            {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to {maxImageSizeMB}MB</p>
        </div>

        {/* Uploaded Images Preview */}
        {uploadedImages.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-600 font-medium">
              Uploaded Images ({uploadedImages.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => !disabled && setSelectedImageIndex(index)}
                  className="relative group cursor-pointer"
                >
                  {/* Primary Badge */}
                  {index === 0 && (
                    <div className="absolute top-1 left-1 z-10">
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#5C1F3D] text-white border border-[#5C1F3D]">
                        Primary
                      </span>
                    </div>
                  )}

                  {/* Delete Button */}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                      className="absolute top-1 right-1 z-10 p-0.5 rounded-full bg-white/90 hover:bg-red-50 border border-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  )}

                  {/* Small Thumbnail */}
                  <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:border-[#5C1F3D] hover:shadow-md transition-all">
                    <img
                      src={image.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validation Error */}
        {showError('images') && (
          <p className="text-xs text-red-600 mt-1">{validationErrors.images}</p>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImageIndex !== null && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
            onClick={() => setSelectedImageIndex(null)}
          />

          {/* Lightbox Content */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedImageIndex === 0 && (
                      <span className="px-2 py-1 text-xs rounded bg-[#5C1F3D] text-white border border-[#5C1F3D]">
                        Primary Image
                      </span>
                    )}
                    <span className="text-sm text-white">
                      {selectedImageIndex + 1} / {uploadedImages.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedImageIndex(null)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="flex items-center justify-center bg-gray-100 h-[70vh]">
                <img
                  src={uploadedImages[selectedImageIndex].preview}
                  alt={uploadedImages[selectedImageIndex].file.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Footer with Image Info */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium truncate">
                      {uploadedImages[selectedImageIndex].file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(uploadedImages[selectedImageIndex].file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                      disabled={selectedImageIndex === 0}
                      className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(Math.min(uploadedImages.length - 1, selectedImageIndex + 1))}
                      disabled={selectedImageIndex === uploadedImages.length - 1}
                      className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tracking Options */}
      <div className="flex flex-row gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={tracking.batch}
            onChange={(e) => setTracking(prev => ({ ...prev, batch: e.target.checked }))}
            disabled={disabled}
            className="w-4 h-4 text-[#5C1F3D] rounded focus:ring-[#5C1F3D]"
          />
          <span className="text-sm text-gray-700">Enable Batch Tracking</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={tracking.serial}
            onChange={(e) => setTracking(prev => ({ ...prev, serial: e.target.checked }))}
            disabled={disabled}
            className="w-4 h-4 text-[#5C1F3D] rounded focus:ring-[#5C1F3D]"
          />
          <span className="text-sm text-gray-700">Enable Serial Tracking</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={tracking.expiry}
            onChange={(e) => setTracking(prev => ({ ...prev, expiry: e.target.checked }))}
            disabled={disabled}
            className="w-4 h-4 text-[#5C1F3D] rounded focus:ring-[#5C1F3D]"
          />
          <span className="text-sm text-gray-700">Enable Expiry Management</span>
        </label>
      </div>

      {/* Default Bin Location */}
      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Default Bin Location
        </label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="defaultBinLocation"
              value="no"
              checked={!hasBinLocation}
              onChange={() => {
                setHasBinLocation(false);
                setBinLocations([]);
                setSelectedBinLocationIds([]);
              }}
              disabled={disabled}
              className="w-4 h-4 text-[#5C1F3D] focus:ring-[#5C1F3D]"
            />
            <span className="text-sm text-gray-700">No</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="defaultBinLocation"
              value="yes"
              checked={hasBinLocation}
              onChange={() => {
                setHasBinLocation(true);
                setTouched(prev => ({ ...prev, binLocations: true }));
              }}
              disabled={disabled}
              className="w-4 h-4 text-[#5C1F3D] focus:ring-[#5C1F3D]"
            />
            <span className="text-sm text-gray-700">Yes</span>
          </label>
        </div>

        {/* Warehouse Configuration - Shows when "Yes" is selected */}
        {hasBinLocation && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-purple-900 font-medium">
                Configure warehouse bin locations for this item
              </p>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => {
                    setShowBinLocationForm(true);
                    setCurrentBinLocation({
                      warehouse: '',
                      warehouseCode: '',
                      zone: '',
                      aisle: '',
                      rack: '',
                      shelf: '',
                      bin: ''
                    });
                  }}
                  className="px-3 py-1.5 text-xs rounded-[3px] transition-colors flex items-center gap-1.5 bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Warehouse Location
                </button>
              )}
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedBinLocationIds.length > 0 && !disabled && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-purple-900 font-medium">
                    {selectedBinLocationIds.length} location{selectedBinLocationIds.length !== 1 ? 's' : ''} selected
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedBinLocationIds([])}
                    className="text-xs text-purple-700 hover:text-purple-900 underline"
                  >
                    Clear selection
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleBulkRemoveBinLocations}
                  className="px-3 py-1.5 text-xs rounded-[3px] transition-colors flex items-center gap-1.5 bg-red-600 text-white hover:bg-red-700"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Selected
                </button>
              </div>
            )}

            {/* Bin Locations Table */}
            {binLocations.length > 0 && (
              <div className="bg-white border border-purple-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 w-10">
                        <input
                          type="checkbox"
                          checked={allBinLocationsSelected}
                          onChange={(e) => handleSelectAllBinLocations(e.target.checked)}
                          disabled={disabled}
                          className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                        />
                      </th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Warehouse</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Zone</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Aisle</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Rack</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Shelf</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Bin</th>
                      <th className="px-3 py-2 text-center text-gray-700 font-medium w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {binLocations.map((location) => (
                      <tr key={location.id} className="border-t border-gray-100 hover:bg-purple-50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedBinLocationIds.includes(location.id)}
                            onChange={(e) => handleToggleBinLocationRow(location.id, e.target.checked)}
                            disabled={disabled}
                            className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col">
                            <span className="text-gray-900">{location.warehouse}</span>
                            <span className="text-gray-500">{location.warehouseCode}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-700">{location.zone || '-'}</td>
                        <td className="px-3 py-2 text-gray-700">{location.aisle || '-'}</td>
                        <td className="px-3 py-2 text-gray-700">{location.rack || '-'}</td>
                        <td className="px-3 py-2 text-gray-700">{location.shelf || '-'}</td>
                        <td className="px-3 py-2 text-gray-700">{location.bin || '-'}</td>
                        <td className="px-3 py-2 text-center">
                          {!disabled && (
                            <button
                              type="button"
                              onClick={() => handleRemoveBinLocation(location.id)}
                              className="p-1 rounded hover:bg-red-100 transition-colors"
                              title="Remove location"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add/Edit Bin Location Form */}
            {showBinLocationForm && (
              <div className="bg-white border border-purple-300 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">Add Warehouse Bin Location</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBinLocationForm(false);
                      setCurrentBinLocation({
                        warehouse: '',
                        warehouseCode: '',
                        zone: '',
                        aisle: '',
                        rack: '',
                        shelf: '',
                        bin: ''
                      });
                      setBinLocationWarehouseSearch('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Warehouse */}
                  <div>
                    <label className="block text-xs text-gray-700 mb-1.5">
                      Warehouse <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={binLocationWarehouseSearch}
                        onChange={(e) => {
                          setBinLocationWarehouseSearch(e.target.value);
                          setShowBinLocationWarehouseDropdown(true);
                        }}
                        onFocus={() => setShowBinLocationWarehouseDropdown(true)}
                        onBlur={() => {
                          setTimeout(() => setShowBinLocationWarehouseDropdown(false), 200);
                        }}
                        placeholder="Search or select warehouse..."
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
                        style={{ minHeight: '1.4375em' }}
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                      {/* Searchable Dropdown */}
                      {showBinLocationWarehouseDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {filteredWarehouses.length === 0 && binLocationWarehouseSearch ? (
                            <div className="p-8 text-center">
                              <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No warehouses found</p>
                              <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                            </div>
                          ) : filteredWarehouses.length === 0 ? (
                            <div className="p-8 text-center">
                              <p className="text-sm text-gray-500">No warehouses available</p>
                            </div>
                          ) : (
                            filteredWarehouses.map((warehouse) => (
                              <button
                                key={warehouse.id}
                                type="button"
                                onClick={() => {
                                  setBinLocationWarehouseSearch(warehouse.warehouseName);
                                  setCurrentBinLocation({
                                    ...currentBinLocation,
                                    warehouse: warehouse.warehouseName,
                                    warehouseCode: warehouse.warehouseCode
                                  });
                                  setShowBinLocationWarehouseDropdown(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-purple-50 border-b border-gray-100 last:border-b-0 transition-colors"
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-900">{warehouse.warehouseName}</span>
                                  <span className="text-xs text-gray-500">{warehouse.warehouseCode}</span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Zone */}
                  <div>
                    <label className="block text-xs text-gray-700 mb-1.5">
                      Zone
                    </label>
                    <StyledSelect
                      value={currentBinLocation.zone || ''}
                      onChange={(e) => setCurrentBinLocation({ ...currentBinLocation, zone: e.target.value })}
                      style={{ fontSize: 'var(--text-sm)', minHeight: '1.4375em' }}
                    >
                      <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Select zone</MenuItem>
                      <MenuItem value="Zone A" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Zone A</MenuItem>
                      <MenuItem value="Zone B" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Zone B</MenuItem>
                      <MenuItem value="Zone C" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Zone C</MenuItem>
                      <MenuItem value="Zone D" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Zone D</MenuItem>
                    </StyledSelect>
                  </div>

                  {/* Aisle */}
                  <div>
                    <label className="block text-xs text-gray-700 mb-1.5">
                      Aisle
                    </label>
                    <StyledTextField
                      value={currentBinLocation.aisle || ''}
                      onChange={(e) => setCurrentBinLocation({ ...currentBinLocation, aisle: e.target.value })}
                      placeholder="e.g., A1, A2"
                      style={{ minHeight: '1.4375em' }}
                    />
                  </div>

                  {/* Rack */}
                  <div>
                    <label className="block text-xs text-gray-700 mb-1.5">
                      Rack
                    </label>
                    <StyledTextField
                      value={currentBinLocation.rack || ''}
                      onChange={(e) => setCurrentBinLocation({ ...currentBinLocation, rack: e.target.value })}
                      placeholder="e.g., R1, R2"
                      style={{ minHeight: '1.4375em' }}
                    />
                  </div>

                  {/* Shelf */}
                  <div>
                    <label className="block text-xs text-gray-700 mb-1.5">
                      Shelf
                    </label>
                    <StyledTextField
                      value={currentBinLocation.shelf || ''}
                      onChange={(e) => setCurrentBinLocation({ ...currentBinLocation, shelf: e.target.value })}
                      placeholder="e.g., S1, S2"
                      style={{ minHeight: '1.4375em' }}
                    />
                  </div>

                  {/* Bin */}
                  <div>
                    <label className="block text-xs text-gray-700 mb-1.5">
                      Bin
                    </label>
                    <StyledTextField
                      value={currentBinLocation.bin || ''}
                      onChange={(e) => setCurrentBinLocation({ ...currentBinLocation, bin: e.target.value })}
                      placeholder="e.g., BIN-001"
                      style={{ minHeight: '1.4375em' }}
                    />
                  </div>
                </div>

                {/* Preview of full bin location */}
                {currentBinLocation.warehouse && (
                  <div className="bg-purple-100 border border-purple-300 rounded p-2 mt-3">
                    <p className="text-xs text-purple-700 mb-1">Preview:</p>
                    <p className="text-sm text-purple-900 font-medium">
                      {getBinLocationPreview()}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBinLocationForm(false);
                      setCurrentBinLocation({
                        warehouse: '',
                        warehouseCode: '',
                        zone: '',
                        aisle: '',
                        rack: '',
                        shelf: '',
                        bin: ''
                      });
                      setBinLocationWarehouseSearch('');
                    }}
                    className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddBinLocation}
                    className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Location
                  </button>
                </div>
              </div>
            )}

            {/* Validation Error */}
            {showError('binLocations') && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.binLocations}</p>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && deleteModalData && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
            onClick={cancelDelete}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[440px]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-base text-gray-900">
                {deleteModalData.type === 'single'
                  ? 'Are you sure you want to remove 1 location?'
                  : `Remove Multiple Warehouses`}
              </h3>
              {deleteModalData.type === 'bulk' && (
                <p className="text-sm text-gray-600 mt-2">
                  Are you sure you want to remove {deleteModalData.locations?.length || 0} warehouse{(deleteModalData.locations?.length || 0) !== 1 ? 's' : ''} and their opening stock from this item?
                </p>
              )}
            </div>

            {/* Modal Content - List of warehouses to be removed */}
            {deleteModalData.type === 'bulk' && deleteModalData.locations && deleteModalData.locations.length > 0 && (
              <div className="px-6 py-4 space-y-3">
                <p className="text-xs text-gray-600 font-medium">Warehouses to be removed:</p>
                <div className="space-y-2">
                  {deleteModalData.locations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{location.warehouse}</span>
                        <span className="text-xs text-gray-500">{location.warehouseCode} - Opening Stock: 0 units</span>
                      </div>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </div>
                  ))}
                </div>

                {/* Warning Message */}
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                  <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs">!</span>
                  </div>
                  <p className="text-xs text-red-700">
                    This action will remove the selected warehouse allocations and their opening stock quantities from this item.
                  </p>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm rounded-[3px] transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                style={{ height: '33px' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-[3px] transition-colors bg-[#EF4444] text-white hover:bg-[#DC2626] flex items-center gap-2"
                style={{ height: '33px' }}
              >
                <Trash2 className="w-4 h-4" />
                Remove {deleteModalData.type === 'bulk' ? deleteModalData.locations?.length || 0 : '1'} {deleteModalData.type === 'bulk' ? 'Warehouse' : 'Location'}{deleteModalData.type === 'bulk' && (deleteModalData.locations?.length || 0) !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}