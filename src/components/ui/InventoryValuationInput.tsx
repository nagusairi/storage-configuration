import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Package, Search, Plus, Trash2, X, Ruler, Target, Calculator, Settings, Activity, ShoppingCart, ShoppingBag, Warehouse as WarehouseIcon, Truck, Sparkles, Scale, AlertTriangle, AlertCircle } from 'lucide-react';
import { StyledTextField } from './StyledTextField';
import { StyledSelect, MenuItem } from './StyledSelect';
import { StyledButton } from './StyledButton';

// Predefined unit options for UOM conversions
const UNIT_OPTIONS = [
  { value: 'Piece', label: 'Pieces (pcs)' },
  { value: 'Carton', label: 'Carton' },
  { value: 'Box', label: 'Box' },
  { value: 'Pallet', label: 'Pallet' },
  { value: 'Case', label: 'Case' },
  { value: 'Pack', label: 'Pack' },
  { value: 'Bundle', label: 'Bundle' },
  { value: 'Kilogram', label: 'Kilograms (kg)' },
  { value: 'Gram', label: 'Grams (g)' },
  { value: 'Liter', label: 'Liters (L)' },
  { value: 'Milliliter', label: 'Milliliters (mL)' },
  { value: 'Meter', label: 'Meters (m)' },
  { value: 'Centimeter', label: 'Centimeters (cm)' },
  { value: 'Dozen', label: 'Dozen' },
  { value: 'Set', label: 'Set' }
];

/**
 * InventoryValuationInput Component
 * 
 * A comprehensive inventory and valuation management component for goods/products.
 * Handles reorder levels, stock alerts, valuation methods, and warehouse-specific
 * opening stock management with bulk operations.
 * 
 * Features:
 * - Re-order level and low stock alert configuration
 * - Valuation method selection (FIFO, Weighted Average)
 * - Opening stock management (Yes/No toggle)
 * - Searchable warehouse selection
 * - Multi-warehouse stock allocation
 * - Bulk warehouse operations (select all, bulk remove)
 * - Individual warehouse quantity editing
 * - Empty state handling
 * - Form validation
 * - Accessible keyboard navigation
 * 
 * @example
 * ```tsx
 * <InventoryValuationInput
 *   availableWarehouses={warehouses}
 *   initialData={{
 *     reorderLevel: 10,
 *     lowStockAlertLevel: 5,
 *     valuationMethod: 'fifo',
 *     hasOpeningStock: false,
 *     warehouseStocks: []
 *   }}
 *   onChange={(data) => console.log('Inventory data:', data)}
 *   onValidationChange={(isValid) => console.log('Valid:', isValid)}
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

export interface WarehouseStock extends Warehouse {
  openingStock: number;
}

export type ValuationMethod = 'fifo' | 'weighted-average';

export interface ConversionUnit {
  id: number | string;
  multiplier: number;
  unit: string;
  factor: number;
  baseUnit: string;
  skuCode: string;
  name: string;
}

export interface InventoryValuationData {
  reorderLevel: number | null;
  lowStockAlertLevel: number | null;
  valuationMethod: ValuationMethod;
  hasOpeningStock: boolean;
  warehouseStocks: WarehouseStock[];
  conversionUnits?: ConversionUnit[]; // Add this field for UOC conversions
}

export interface InventoryValuationInputProps {
  // Data
  availableWarehouses: Warehouse[];
  initialData?: Partial<InventoryValuationData>;
  
  // Callbacks
  onChange?: (data: InventoryValuationData) => void;
  onValidationChange?: (isValid: boolean, errors: ValidationErrors) => void;
  
  // Validation
  required?: boolean;
  showValidation?: boolean;
  minReorderLevel?: number;
  minAlertLevel?: number;
  
  // Customization
  sectionTitle?: string;
  className?: string;
  disabled?: boolean;
  showUOCSection?: boolean; // Controls visibility of Units of Measure & Conversions section
  showInventoryFields?: boolean; // Controls visibility of Re-order Level, Low Stock Alert, Valuation Method, Opening Stock, Warehouses
  hideBaseUnit?: boolean; // Hides the base unit field in UOC section (when base unit already selected elsewhere)
  baseUnitValue?: string; // Pre-selected base unit value from parent component
  showUsageRoleMatrix?: boolean; // Controls visibility of Usage Role Matrix section within UOC
  showConversionPreview?: boolean; // Controls visibility of Conversion Preview section within UOC
  parentSku?: string; // Parent item SKU for generating child SKU codes
  itemName?: string; // Parent item name for display purposes
  hideConversionTableHeader?: boolean; // Hides the "Conversion Units for Sales" header and "Add Conversion Unit" button
  addConversionTrigger?: number; // Increment this value to trigger adding a new conversion unit externally
}

export interface ValidationErrors {
  reorderLevel?: string;
  lowStockAlertLevel?: string;
  warehouseStocks?: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function InventoryValuationInput({
  availableWarehouses = [],
  initialData,
  onChange,
  onValidationChange,
  required = false,
  showValidation = false,
  minReorderLevel = 0,
  minAlertLevel = 0,
  sectionTitle = 'Inventory & Valuation',
  className = '',
  disabled = false,
  showUOCSection = true,
  showInventoryFields = true,
  hideBaseUnit = false,
  baseUnitValue = '',
  showUsageRoleMatrix = true,
  showConversionPreview = true,
  parentSku = '',
  itemName = '',
  hideConversionTableHeader = false,
  addConversionTrigger = 0
}: InventoryValuationInputProps) {
  
  // ============================================================================
  // State Management
  // ============================================================================
  
  const [reorderLevel, setReorderLevel] = useState<number | null>(
    initialData?.reorderLevel ?? null
  );
  const [lowStockAlertLevel, setLowStockAlertLevel] = useState<number | null>(
    initialData?.lowStockAlertLevel ?? null
  );
  const [valuationMethod, setValuationMethod] = useState<ValuationMethod>(
    initialData?.valuationMethod ?? 'fifo'
  );
  const [hasOpeningStock, setHasOpeningStock] = useState<boolean>(
    initialData?.hasOpeningStock ?? false
  );
  const [warehouseStocks, setWarehouseStocks] = useState<WarehouseStock[]>(
    initialData?.warehouseStocks ?? []
  );
  
  // Warehouse selection state
  const [warehouseSearchTerm, setWarehouseSearchTerm] = useState('');
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [currentWarehouseId, setCurrentWarehouseId] = useState<string>('');
  const [currentWarehouseQty, setCurrentWarehouseQty] = useState<number>(0);
  
  // Bulk operations state
  const [selectedWarehouseRows, setSelectedWarehouseRows] = useState<(number | string)[]>([]);
  
  // Delete confirmation modal state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [warehousesToDelete, setWarehousesToDelete] = useState<WarehouseStock[]>([]);
  const [deleteMode, setDeleteMode] = useState<'single' | 'bulk'>('single');
  
  // UOM Conversion deletion confirmation state
  const [showUOMDeleteConfirmation, setShowUOMDeleteConfirmation] = useState(false);
  const [uomConversionToDelete, setUOMConversionToDelete] = useState<{
    id: number;
    multiplier: number;
    unit: string;
    factor: number;
    baseUnit: string;
    skuCode: string;
    name: string;
  } | null>(null);
  
  // Units of Measure & Conversions state
  const [baseUnit, setBaseUnit] = useState(baseUnitValue || 'Piece');
  const [conversionUnits, setConversionUnits] = useState<Array<{
    id: number;
    multiplier: number;
    unit: string;
    factor: number;
    baseUnit: string;
    skuCode: string;
    name: string;
  }>>(initialData?.conversionUnits ?? []);
  const [usageRoles, setUsageRoles] = useState<{
    [unit: string]: {
      purchase: boolean;
      sell: boolean;
      stock: boolean;
      ship: boolean;
    };
  }>({});
  
  // SKU validation and AI suggestions state
  const [skuErrors, setSkuErrors] = useState<{[id: number]: string}>({});
  const [skuDuplicates, setSkuDuplicates] = useState<{[id: number]: string | null}>({});
  const [showSkuSuggestions, setShowSkuSuggestions] = useState<number | null>(null);
  const [skuSuggestionsList, setSkuSuggestionsList] = useState<string[]>([]);
  const skuDropdownRefs = useRef<{[id: number]: HTMLDivElement | null}>({});
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({
    reorderLevel: false,
    lowStockAlertLevel: false,
    warehouseStocks: false
  });
  
  // Refs
  const warehouseDropdownRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const onValidationChangeRef = useRef(onValidationChange);
  const isInitialMount = useRef(true);
  
  // ============================================================================
  // Helper Functions (defined before useEffects that use them)
  // ============================================================================
  
  // Generate child SKU based on parent SKU and unit
  const generateChildSku = useCallback((unitName: string): string => {
    if (!parentSku) {
      return '';
    }
    const unitCode = unitName.substring(0, 3).toUpperCase();
    return `${parentSku}-${unitCode}`;
  }, [parentSku]);
  
  // Update refs when callbacks change
  useEffect(() => {
    onChangeRef.current = onChange;
    onValidationChangeRef.current = onValidationChange;
  }, [onChange, onValidationChange]);
  
  // Sync baseUnit state with baseUnitValue prop when it changes
  useEffect(() => {
    if (baseUnitValue) {
      setBaseUnit(baseUnitValue);
      // Update all existing conversion units to use the new base unit
      setConversionUnits(prev => prev.map(unit => ({
        ...unit,
        baseUnit: baseUnitValue
      })));
    }
  }, [baseUnitValue]);
  
  // Sync conversionUnits when initialData.conversionUnits changes
  useEffect(() => {
    if (initialData?.conversionUnits) {
      setConversionUnits(initialData.conversionUnits);
    }
  }, [initialData?.conversionUnits]);
  
  // SKU generation removed - conversions are metadata, not separate items
  
  // Watch for external trigger to add conversion unit
  useEffect(() => {
    if (addConversionTrigger > 0) {
      setConversionUnits(prev => {
        const newId = Math.max(...prev.map(u => u.id), 0) + 1;
        const newUnit = 'Piece';
        return [
          ...prev,
          { id: newId, multiplier: 1, unit: newUnit, factor: 1, baseUnit: baseUnit, skuCode: '', name: '' }
        ];
      });
    }
  }, [addConversionTrigger, baseUnit]);
  
  // ============================================================================
  // Validation Logic
  // ============================================================================
  
  const validateForm = (): { isValid: boolean; errors: ValidationErrors } => {
    const errors: ValidationErrors = {};
    
    // Validate reorder level
    if (required && reorderLevel === null) {
      errors.reorderLevel = 'Re-order level is required';
    } else if (reorderLevel !== null && reorderLevel < minReorderLevel) {
      errors.reorderLevel = `Must be at least ${minReorderLevel}`;
    }
    
    // Validate low stock alert level
    if (required && lowStockAlertLevel === null) {
      errors.lowStockAlertLevel = 'Low stock alert level is required';
    } else if (lowStockAlertLevel !== null && lowStockAlertLevel < minAlertLevel) {
      errors.lowStockAlertLevel = `Must be at least ${minAlertLevel}`;
    }
    
    // Cross-field validation: alert level should be <= reorder level
    if (reorderLevel !== null && lowStockAlertLevel !== null && lowStockAlertLevel > reorderLevel) {
      errors.lowStockAlertLevel = 'Alert level should not exceed reorder level';
    }
    
    // Validate opening stock warehouses
    if (hasOpeningStock && warehouseStocks.length === 0) {
      errors.warehouseStocks = 'Please add at least one warehouse with opening stock';
    }
    
    const isValid = Object.keys(errors).length === 0;
    return { isValid, errors };
  };
  
  // ============================================================================
  // Effects
  // ============================================================================
  
  // Emit data changes
  useEffect(() => {
    // Skip the initial mount to prevent calling onChange with initialData
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (onChangeRef.current) {
      const data: InventoryValuationData = {
        reorderLevel,
        lowStockAlertLevel,
        valuationMethod,
        hasOpeningStock,
        warehouseStocks
      };
      onChangeRef.current(data);
    }
  }, [reorderLevel, lowStockAlertLevel, valuationMethod, hasOpeningStock, warehouseStocks]);
  
  // Emit validation changes
  useEffect(() => {
    if (onValidationChangeRef.current) {
      const { isValid, errors } = validateForm();
      onValidationChangeRef.current(isValid, errors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reorderLevel, lowStockAlertLevel, valuationMethod, hasOpeningStock, warehouseStocks]);
  
  // Update validation errors when showing validation
  useEffect(() => {
    if (showValidation) {
      const { errors } = validateForm();
      setValidationErrors(errors);
      setTouched({
        reorderLevel: true,
        lowStockAlertLevel: true,
        warehouseStocks: true
      });
    }
  }, [showValidation]);
  
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (warehouseDropdownRef.current && !warehouseDropdownRef.current.contains(event.target as Node)) {
        setShowWarehouseDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // ============================================================================
  // Helper Functions
  // ============================================================================
  
  const getFilteredWarehouses = () => {
    return availableWarehouses
      .filter(wh => !warehouseStocks.some(ws => ws.id === wh.id))
      .filter(warehouse => {
        if (!warehouseSearchTerm) return true;
        const searchLower = warehouseSearchTerm.toLowerCase();
        return (
          warehouse.warehouseName.toLowerCase().includes(searchLower) ||
          warehouse.warehouseCode.toLowerCase().includes(searchLower)
        );
      });
  };
  
  const handleAddWarehouse = () => {
    if (!currentWarehouseId) return;
    
    const warehouse = availableWarehouses.find(w => w.id.toString() === currentWarehouseId);
    if (!warehouse) return;
    
    const newWarehouseStock: WarehouseStock = {
      id: warehouse.id,
      warehouseName: warehouse.warehouseName,
      warehouseCode: warehouse.warehouseCode,
      openingStock: currentWarehouseQty
    };
    
    setWarehouseStocks([...warehouseStocks, newWarehouseStock]);
    setCurrentWarehouseId('');
    setCurrentWarehouseQty(0);
    setWarehouseSearchTerm('');
  };
  
  const handleRemoveWarehouse = (id: number | string) => {
    const warehouseToDelete = warehouseStocks.find(w => w.id === id);
    if (warehouseToDelete) {
      setWarehousesToDelete([warehouseToDelete]);
      setDeleteMode('single');
      setShowDeleteConfirmation(true);
    }
  };
  
  const handleBulkRemove = () => {
    const warehousesToRemove = warehouseStocks.filter(w => selectedWarehouseRows.includes(w.id));
    setWarehousesToDelete(warehousesToRemove);
    setDeleteMode('bulk');
    setShowDeleteConfirmation(true);
  };
  
  const confirmDelete = () => {
    if (deleteMode === 'bulk') {
      setWarehouseStocks(warehouseStocks.filter(w => !selectedWarehouseRows.includes(w.id)));
      setSelectedWarehouseRows([]);
    } else {
      const idToDelete = warehousesToDelete[0]?.id;
      if (idToDelete) {
        setWarehouseStocks(warehouseStocks.filter(w => w.id !== idToDelete));
        setSelectedWarehouseRows(selectedWarehouseRows.filter(rowId => rowId !== idToDelete));
      }
    }
    setShowDeleteConfirmation(false);
    setWarehousesToDelete([]);
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setWarehousesToDelete([]);
  };
  
  // UOM Conversion deletion handlers
  const handleRemoveUOMConversion = (conversion: typeof conversionUnits[0]) => {
    setUOMConversionToDelete(conversion);
    setShowUOMDeleteConfirmation(true);
  };
  
  const confirmUOMDelete = () => {
    if (uomConversionToDelete) {
      setConversionUnits(conversionUnits.filter(c => c.id !== uomConversionToDelete.id));
      setShowUOMDeleteConfirmation(false);
      setUOMConversionToDelete(null);
    }
  };
  
  const cancelUOMDelete = () => {
    setShowUOMDeleteConfirmation(false);
    setUOMConversionToDelete(null);
  };
  
  const handleWarehouseSelect = (warehouse: Warehouse) => {
    setCurrentWarehouseId(warehouse.id.toString());
    setWarehouseSearchTerm(warehouse.warehouseName);
    setShowWarehouseDropdown(false);
  };
  
  const handleUpdateWarehouseStock = (id: number | string, newStock: number) => {
    setWarehouseStocks(
      warehouseStocks.map(w => w.id === id ? { ...w, openingStock: newStock } : w)
    );
  };
  
  const handleSelectAllWarehouses = (checked: boolean) => {
    if (checked) {
      setSelectedWarehouseRows(warehouseStocks.map(w => w.id));
    } else {
      setSelectedWarehouseRows([]);
    }
  };
  
  const handleToggleWarehouseRow = (id: number | string, checked: boolean) => {
    if (checked) {
      setSelectedWarehouseRows([...selectedWarehouseRows, id]);
    } else {
      setSelectedWarehouseRows(selectedWarehouseRows.filter(rowId => rowId !== id));
    }
  };
  
  // SKU validation and AI suggestion helper functions
  const validateSKU = (id: number, sku: string): string | null => {
    if (!sku.trim()) {
      return 'SKU code is required';
    }
    const duplicate = conversionUnits.find(
      c => c.id !== id && c.skuCode.toLowerCase() === sku.toLowerCase()
    );
    if (duplicate) {
      return `SKU code already exists for ${duplicate.unit}`;
    }
    return null;
  };

  // Find duplicate unit name (for dropdown display)
  const findDuplicateUnit = (skuCode: string, currentId: number): string | null => {
    // Check against parent SKU
    if (skuCode && parentSku && skuCode.toLowerCase() === parentSku.toLowerCase()) {
      return 'Parent Item';
    }
    
    // Check against other conversion units
    const duplicate = conversionUnits.find(
      c => c.id !== currentId && c.skuCode && c.skuCode.toLowerCase() === skuCode.toLowerCase()
    );
    
    return duplicate ? duplicate.unit : null;
  };

  const generateSkuSuggestions = (unitName: string): string[] => {
    if (!parentSku) {
      const basePrefix = 'SKU';
      const unitShort = unitName.substring(0, 3).toUpperCase();
      const random = () => String(Math.floor(Math.random() * 1000)).padStart(3, '0');
      
      return [
        `${basePrefix}-${unitShort}-${random()}`,
        `${basePrefix}-${unitName.toUpperCase()}-001`,
        `${unitShort}-${baseUnit.substring(0, 2).toUpperCase()}-${String(conversionUnits.length).padStart(3, '0')}`,
        `${unitName.toUpperCase()}-${baseUnit.toUpperCase()}-${random()}`
      ];
    }
    
    // Generate suggestions based on parent SKU
    const unitFull = unitName.toUpperCase();
    const unitShort = unitName.substring(0, 3).toUpperCase();
    const unitInitials = unitName.substring(0, 2).toUpperCase();
    
    return [
      `${parentSku}-${unitFull}`,
      `${parentSku}-${unitShort}`,
      `${parentSku}-${unitInitials}`
    ];
  };

  const handleSkuChange = (id: number, newSku: string) => {
    // Update the SKU code
    setConversionUnits(conversionUnits.map(c =>
      c.id === id ? { ...c, skuCode: newSku } : c
    ));
    
    // Check for duplicates
    const duplicateUnit = findDuplicateUnit(newSku, id);
    setSkuDuplicates(prev => ({
      ...prev,
      [id]: duplicateUnit
    }));
    
    // Validate and set error
    const error = validateSKU(id, newSku);
    if (error) {
      setSkuErrors({ ...skuErrors, [id]: error });
    } else {
      const newErrors = { ...skuErrors };
      delete newErrors[id];
      setSkuErrors(newErrors);
    }
  };

  const handleSkuFocus = (id: number, unitName: string) => {
    setShowSkuSuggestions(id);
    setSkuSuggestionsList(generateSkuSuggestions(unitName));
  };

  const handleSkuBlur = () => {
    setTimeout(() => setShowSkuSuggestions(null), 200);
  };

  const handleSelectSkuSuggestion = (id: number, suggestion: string) => {
    handleSkuChange(id, suggestion);
    setShowSkuSuggestions(null);
  };
  
  // ============================================================================
  // Render Helpers
  // ============================================================================
  
  const filteredWarehouses = getFilteredWarehouses();
  const allSelected = selectedWarehouseRows.length === warehouseStocks.length && warehouseStocks.length > 0;
  const showError = (field: keyof typeof touched) => touched[field] && validationErrors[field];
  
  // ============================================================================
  // Render
  // ============================================================================
  
  return (
    <div className={className}>
      {/* Section Header */}
      <h2 className="mb-4 pb-2 border-b border-gray-200 font-medium" style={{ fontSize: '15px' }}>
        {sectionTitle}
      </h2>
      
      <div className="space-y-4">
        {/* Inventory & Valuation Fields */}
        {showInventoryFields && (
          <>
        {/* First Row: Re-order Level, Alert Level, Valuation Method */}
        <div className="grid grid-cols-3 gap-4">
          {/* Re-order Level */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Re-Order Level {required && <span className="text-red-500">*</span>}
            </label>
            <StyledTextField
              type="number"
              placeholder="Enter reorder level"
              value={reorderLevel ?? ''}
              onChange={(e) => {
                // Prevent negative values and minus sign
                if (e.target.value.includes('-')) return;
                const value = e.target.value === '' ? null : Number(e.target.value);
                if (value !== null && value < 0) return;
                setReorderLevel(value);
                setTouched(prev => ({ ...prev, reorderLevel: true }));
              }}
              onBlur={() => setTouched(prev => ({ ...prev, reorderLevel: true }))}
              inputProps={{ min: 0 }}
              disabled={disabled}
              error={!!showError('reorderLevel')}
              style={{ minHeight: '1.4375em' }}
            />
            {showError('reorderLevel') && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.reorderLevel}</p>
            )}
          </div>
          
          {/* Low Stock Alert Level */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Low Stock Alert Level {required && <span className="text-red-500">*</span>}
            </label>
            <StyledTextField
              type="number"
              placeholder="Enter alert level"
              value={lowStockAlertLevel ?? ''}
              onChange={(e) => {
                // Prevent negative values and minus sign
                if (e.target.value.includes('-')) return;
                const value = e.target.value === '' ? null : Number(e.target.value);
                if (value !== null && value < 0) return;
                setLowStockAlertLevel(value);
                setTouched(prev => ({ ...prev, lowStockAlertLevel: true }));
              }}
              onBlur={() => setTouched(prev => ({ ...prev, lowStockAlertLevel: true }))}
              inputProps={{ min: 0 }}
              disabled={disabled}
              error={!!showError('lowStockAlertLevel')}
              style={{ minHeight: '1.4375em' }}
            />
            {showError('lowStockAlertLevel') && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.lowStockAlertLevel}</p>
            )}
          </div>
          
          {/* Valuation Method */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Valuation Method
            </label>
            <StyledSelect
              value={valuationMethod}
              onChange={(e) => setValuationMethod(e.target.value as ValuationMethod)}
              disabled={disabled}
              style={{ fontSize: 'var(--text-sm)', minHeight: '1.4375em' }}
            >
              <MenuItem value="fifo" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                FIFO
              </MenuItem>
              <MenuItem value="weighted-average" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                Weighted Average
              </MenuItem>
            </StyledSelect>
          </div>
        </div>

        {/* Opening Stock Question */}
        <div>
          <label className="block text-sm text-gray-700 mb-3">
            Do you have opening stock for this item?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="openingStock"
                value="yes"
                checked={hasOpeningStock === true}
                onChange={() => {
                  setHasOpeningStock(true);
                  setTouched(prev => ({ ...prev, warehouseStocks: true }));
                }}
                disabled={disabled}
                className="w-4 h-4 text-[#5C1F3D] focus:ring-[#5C1F3D]"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="openingStock"
                value="no"
                checked={hasOpeningStock === false}
                onChange={() => {
                  setHasOpeningStock(false);
                  setWarehouseStocks([]);
                  setSelectedWarehouseRows([]);
                }}
                disabled={disabled}
                className="w-4 h-4 text-[#5C1F3D] focus:ring-[#5C1F3D]"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>

        {/* Conditional Opening Stock Fields */}
        {hasOpeningStock && (
          <div className="space-y-4 pt-2">
            {/* Add Warehouse Interface */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm text-gray-700 mb-3">
                Add Warehouse Items <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-end">
                {/* Warehouse Search/Select */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1.5">Select Warehouse</label>
                  <div className="relative" ref={warehouseDropdownRef}>
                    <input
                      type="text"
                      value={warehouseSearchTerm}
                      onChange={(e) => {
                        setWarehouseSearchTerm(e.target.value);
                        setShowWarehouseDropdown(true);
                      }}
                      onFocus={() => setShowWarehouseDropdown(true)}
                      placeholder="Search or select warehouse..."
                      disabled={disabled}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      style={{ minHeight: '1.4375em' }}
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    
                    {/* Searchable Dropdown */}
                    {showWarehouseDropdown && !disabled && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredWarehouses.length === 0 && warehouseSearchTerm ? (
                          <div className="p-8 text-center">
                            <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No warehouses found</p>
                            <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                          </div>
                        ) : filteredWarehouses.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-sm text-gray-500">All warehouses have been added</p>
                          </div>
                        ) : (
                          filteredWarehouses.map((warehouse) => (
                            <button
                              key={warehouse.id}
                              type="button"
                              onClick={() => handleWarehouseSelect(warehouse)}
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
                
                {/* Quantity Input */}
                <div className="w-32">
                  <label className="block text-xs text-gray-600 mb-1.5">Quantity</label>
                  <StyledTextField
                    type="number"
                    value={currentWarehouseQty}
                    onChange={(e) => {
                      // Prevent negative values and minus sign
                      if (e.target.value.includes('-')) return;
                      const value = Number(e.target.value);
                      if (value < 0) return;
                      setCurrentWarehouseQty(value);
                    }}
                    placeholder="0"
                    inputProps={{ min: 0 }}
                    disabled={disabled}
                    style={{ minHeight: '1.4375em' }}
                  />
                </div>
                
                {/* Add Button */}
                <StyledButton
                  variant="outline"
                  size="small"
                  onClick={handleAddWarehouse}
                  disabled={!currentWarehouseId || disabled}
                  className="h-10"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </StyledButton>
              </div>
            </div>

            {/* Warehouse Table */}
            {warehouseStocks.length > 0 && (
              <div className="space-y-3">
                {/* Bulk Remove Toolbar */}
                {selectedWarehouseRows.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-red-900 font-medium">
                        {selectedWarehouseRows.length} warehouse{selectedWarehouseRows.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <button
                      onClick={handleBulkRemove}
                      disabled={disabled}
                      className="px-3 py-1.5 text-sm bg-white border border-red-300 text-red-700 rounded-[3px] hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Selected</span>
                    </button>
                  </div>
                )}

                {/* Warehouse Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left w-12">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => handleSelectAllWarehouses(e.target.checked)}
                            disabled={disabled}
                            className="w-4 h-4 text-[#5C1F3D] rounded focus:ring-[#5C1F3D]"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600">Warehouse Name</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-600 w-40">Opening Stock</th>
                        <th className="px-4 py-3 text-center text-xs text-gray-600 w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warehouseStocks.map((warehouse) => {
                        const isSelected = selectedWarehouseRows.includes(warehouse.id);
                        return (
                          <tr
                            key={warehouse.id}
                            className={`border-b border-gray-100 transition-colors ${
                              isSelected ? 'bg-red-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleToggleWarehouseRow(warehouse.id, e.target.checked)}
                                disabled={disabled}
                                className="w-4 h-4 text-[#5C1F3D] rounded focus:ring-[#5C1F3D]"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-900">{warehouse.warehouseName}</span>
                                <span className="text-xs text-gray-500">{warehouse.warehouseCode}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <StyledTextField
                                type="number"
                                value={warehouse.openingStock}
                                onChange={(e) => {
                                  // Prevent negative values and minus sign
                                  if (e.target.value.includes('-')) return;
                                  const value = Number(e.target.value);
                                  if (value < 0) return;
                                  handleUpdateWarehouseStock(warehouse.id, value);
                                }}
                                inputProps={{ min: 0 }}
                                disabled={disabled}
                                className="w-full"
                                style={{ minHeight: '1.4375em' }}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleRemoveWarehouse(warehouse.id)}
                                disabled={disabled}
                                className="p-1.5 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Remove warehouse"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {warehouseStocks.length === 0 && (
              <div className="border border-gray-200 rounded-lg p-8 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No warehouses added yet</p>
                <p className="text-xs text-gray-400 mt-1">Add warehouses using the form above</p>
              </div>
            )}
            
            {/* Validation Error for Warehouses */}
            {showError('warehouseStocks') && (
              <p className="text-xs text-red-600 mt-1">{validationErrors.warehouseStocks}</p>
            )}
          </div>
        )}
          </>
        )}

        {/* Units of Measure & Conversions Section */}
        {showUOCSection && (
          <div className="mt-8 space-y-6">
            {/* BLOCK 1 - Base Unit */}
            {!hideBaseUnit && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-gray-600" />
                <h4 className="text-sm font-medium text-gray-900">Base Unit</h4>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Base Unit <span className="text-red-500">*</span>
                </label>
                <StyledSelect
                  value={baseUnit}
                  onChange={(e) => setBaseUnit(e.target.value)}
                  style={{ fontSize: 'var(--text-sm)', minHeight: '1.4375em' }}
                  className="w-full"
                >
                  <MenuItem value="Piece" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Piece</MenuItem>
                  <MenuItem value="Kilogram" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Kilogram</MenuItem>
                  <MenuItem value="Liter" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Liter</MenuItem>
                  <MenuItem value="Meter" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Meter</MenuItem>
                </StyledSelect>
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  Stock valuation and costing will use the base unit
                </p>
              </div>
            </div>
            )}

            {/* BLOCK 2 - Conversion Units Table */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              {!hideConversionTableHeader && (
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm font-medium text-gray-900">Conversion Units for Sales</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = Math.max(...conversionUnits.map(u => u.id), 0) + 1;
                      const newUnit = 'Piece';
                      setConversionUnits([
                        ...conversionUnits,
                        { id: newId, multiplier: 1, unit: newUnit, factor: 1, baseUnit: baseUnit, skuCode: '', name: '' }
                      ]);
                    }}
                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-[3px] hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Conversion Unit</span>
                  </button>
                </div>
              )}



              {/* Conversion Table */}
              <div className="border border-gray-200 rounded-lg overflow-visible">
                {conversionUnits.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50">
                    <Package className="w-12 h-12 text-gray-400 mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No unit conversions added yet</h3>
                    <p className="text-xs text-gray-500 text-center">Click 'Add Conversion Unit' button to get started</p>
                  </div>
                ) : (
                  <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs text-gray-600">Name</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-600 w-20">Base Qty Required</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-600">Base Unit</th>
                      <th className="px-3 py-2 text-center text-xs text-gray-600 w-8">=</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-600 w-20">Units Created</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-600">Sale Unit</th>
                      <th className="px-3 py-2 text-left text-xs text-gray-600">SKU Code</th>
                      <th className="px-3 py-2 text-center text-xs text-gray-600 w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversionUnits.map((conversion) => (
                      <tr key={conversion.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={conversion.name || ''}
                            onChange={(e) => {
                              setConversionUnits(conversionUnits.map(c =>
                                c.id === conversion.id ? { ...c, name: e.target.value } : c
                              ));
                            }}
                            placeholder="Enter name"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent"
                            style={{ height: '33px' }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={conversion.factor}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              setConversionUnits(conversionUnits.map(c =>
                                c.id === conversion.id ? { ...c, factor: numericValue ? Number(numericValue) : '' } : c
                              ));
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent"
                            style={{ height: '33px' }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-sm text-gray-700">{conversion.baseUnit}</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className="text-gray-400 font-medium">=</span>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={conversion.multiplier}
                            onChange={(e) => {
                              const numericValue = e.target.value.replace(/[^0-9]/g, '');
                              setConversionUnits(conversionUnits.map(c =>
                                c.id === conversion.id ? { ...c, multiplier: numericValue ? Number(numericValue) : '' } : c
                              ));
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent"
                            style={{ height: '33px' }}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col gap-1">
                            {itemName && (
                              <span className="text-xs text-gray-500">{itemName}</span>
                            )}
                            <StyledSelect
                              value={conversion.unit}
                              onChange={(e) => {
                                const newUnit = e.target.value;
                                setConversionUnits(conversionUnits.map(c =>
                                  c.id === conversion.id ? { ...c, unit: newUnit } : c
                                ));
                              }}
                              fullWidth={true}
                              style={{ fontSize: 'var(--text-sm)', height: '33px' }}
                            >
                              {UNIT_OPTIONS.map(option => (
                                <MenuItem 
                                  key={option.value} 
                                  value={option.value}
                                  style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </StyledSelect>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div
                            className="relative"
                            ref={el => skuDropdownRefs.current[conversion.id] = el}
                          >
                            <input
                              type="text"
                              value={conversion.skuCode}
                              onChange={(e) => handleSkuChange(conversion.id, e.target.value)}
                              onFocus={() => handleSkuFocus(conversion.id, conversion.unit)}
                              onBlur={handleSkuBlur}
                              placeholder="Enter SKU code"
                              className={`w-full px-2 py-1 text-xs font-mono border rounded focus:outline-none focus:ring-2 focus:border-transparent ${
                                skuErrors[conversion.id] || skuDuplicates[conversion.id]
                                  ? 'border-red-300 focus:ring-red-500'
                                  : 'border-gray-300 focus:ring-[#5C1F3D]'
                              }`}
                              style={{ height: '33px' }}
                            />
                            
                            {/* SKU Suggestions Dropdown with Duplicate Detection */}
                            {showSkuSuggestions === conversion.id && (skuDuplicates[conversion.id] || skuSuggestionsList.length > 0) && (
                              <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                {/* Duplicate Error Section */}
                                {skuDuplicates[conversion.id] && (
                                  <div className="px-3 py-2 bg-red-50 border-b border-red-200 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                    <span className="text-xs text-red-700">
                                      SKU code already used by <strong>{skuDuplicates[conversion.id]}</strong>
                                    </span>
                                  </div>
                                )}
                                
                                {/* AI Suggested Section */}
                                {skuSuggestionsList.length > 0 && (
                                  <>
                                    <div className="px-3 py-2 border-b border-purple-100 flex items-center gap-1.5 bg-purple-50">
                                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                      <span className="text-xs text-purple-900 font-medium">AI Suggested</span>
                                    </div>
                                    {skuSuggestionsList.map((suggestion) => (
                                      <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => handleSelectSkuSuggestion(conversion.id, suggestion)}
                                        className="w-full px-3 py-2 text-left text-xs font-mono hover:bg-purple-50 border-b border-gray-100 last:border-b-0 transition-colors text-gray-900"
                                      >
                                        {suggestion}
                                      </button>
                                    ))}
                                  </>
                                )}
                              </div>
                            )}
                            
                            {/* Error Message */}
                            {skuErrors[conversion.id] && (
                              <div className="absolute left-0 top-full mt-1 flex items-center gap-1 text-xs text-red-600">
                                <X className="w-3 h-3" />
                                <span>{skuErrors[conversion.id]}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveUOMConversion(conversion)}
                            className="p-1 hover:bg-red-50 rounded transition-colors"
                            title="Delete conversion"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>
            </div>

            {/* BLOCK 3 - Usage Role Matrix */}
            {/* HIDDEN_USAGE_ROLE_MATRIX - To enable: set showUsageRoleMatrix={true} in parent component */}
            {showUsageRoleMatrix && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-gray-600" />
                <h4 className="text-sm font-medium text-gray-900">Usage Role Matrix</h4>
              </div>
              <p className="text-xs text-gray-500 mb-3">Configure which units can be used in different transactions</p>

              {/* Usage Matrix Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {conversionUnits.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50">
                    <Activity className="w-12 h-12 text-gray-400 mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No usage roles configured yet</h3>
                    <p className="text-xs text-gray-500 text-center">Add conversion units first to configure usage roles</p>
                  </div>
                ) : (
                  <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-gray-600">Unit</th>
                      <th className="px-4 py-2 text-center text-xs text-gray-600">
                        <div className="flex items-center justify-center gap-1">
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Purchase</span>
                        </div>
                      </th>
                      <th className="px-4 py-2 text-center text-xs text-gray-600">
                        <div className="flex items-center justify-center gap-1">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Sell</span>
                        </div>
                      </th>
                      <th className="px-4 py-2 text-center text-xs text-gray-600">
                        <div className="flex items-center justify-center gap-1">
                          <WarehouseIcon className="w-3.5 h-3.5" />
                          <span>Stock</span>
                        </div>
                      </th>
                      <th className="px-4 py-2 text-center text-xs text-gray-600">
                        <div className="flex items-center justify-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Ship</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversionUnits.map((conversion) => {
                      const roles = usageRoles[conversion.unit] || { purchase: false, sell: false, stock: false, ship: false };
                      return (
                        <tr key={conversion.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <span className="text-sm text-gray-900 font-medium">{conversion.unit}</span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={roles.purchase}
                                onChange={(e) => {
                                  setUsageRoles({
                                    ...usageRoles,
                                    [conversion.unit]: { ...roles, purchase: e.target.checked }
                                  });
                                }}
                                className="w-4 h-4 text-[#5C1F3D] rounded focus:ring-[#5C1F3D] border-gray-300"
                              />
                            </label>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={roles.sell}
                                onChange={(e) => {
                                  setUsageRoles({
                                    ...usageRoles,
                                    [conversion.unit]: { ...roles, sell: e.target.checked }
                                  });
                                }}
                                className="w-4 h-4 text-[#5C1F3D] rounded focus:ring-[#5C1F3D] border-gray-300"
                              />
                            </label>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={roles.stock}
                                onChange={(e) => {
                                  setUsageRoles({
                                    ...usageRoles,
                                    [conversion.unit]: { ...roles, stock: e.target.checked }
                                  });
                                }}
                                className="w-4 h-4 text-[#5C1F3D] rounded focus:ring-[#5C1F3D] border-gray-300"
                              />
                            </label>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={roles.ship}
                                onChange={(e) => {
                                  setUsageRoles({
                                    ...usageRoles,
                                    [conversion.unit]: { ...roles, ship: e.target.checked }
                                  });
                                }}
                                className="w-4 h-4 text-[#5C1F3D] rounded focus:ring-[#5C1F3D] border-gray-300"
                              />
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                )}
              </div>
            </div>
            )}

            {/* BLOCK 4 - Preview Simulation */}
            {/* HIDDEN_CONVERSION_PREVIEW - To enable: set showConversionPreview={true} in parent component */}
            {showConversionPreview && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-medium text-gray-900">Conversion Preview</h4>
              </div>
              <p className="text-xs text-gray-600 mb-4">See how conversions affect your inventory</p>

              <div className="space-y-3">
                {conversionUnits.filter(c => c.factor > 1).length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-8 px-6">
                    <Sparkles className="w-12 h-12 text-purple-300 mb-3" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No conversion previews yet</h3>
                    <p className="text-xs text-gray-600 text-center">Add conversion units and assign usage roles to see live previews</p>
                  </div>
                ) : (
                  <>
                {conversionUnits
                  .filter(c => c.factor > 1)
                  .map((conversion) => {
                    const roles = usageRoles[conversion.unit] || { purchase: false, sell: false, stock: false, ship: false };
                    return (
                      <div key={conversion.id} className="space-y-2">
                        {roles.purchase && (
                          <div className="bg-white rounded-lg p-3 border border-green-200">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                                <ShoppingCart className="w-3.5 h-3.5 text-green-600" />
                              </div>
                              <p className="text-sm text-gray-700">
                                Buying <span className="font-semibold text-green-700">{conversion.multiplier} {conversion.unit}</span> adds{' '}
                                <span className="font-semibold text-green-700">{conversion.multiplier * conversion.factor} {conversion.baseUnit}s</span> to stock
                              </p>
                            </div>
                          </div>
                        )}
                        {roles.sell && (
                          <div className="bg-white rounded-lg p-3 border border-blue-200">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                              </div>
                              <p className="text-sm text-gray-700">
                                Selling <span className="font-semibold text-blue-700">{conversion.multiplier} {conversion.unit}</span> deducts{' '}
                                <span className="font-semibold text-blue-700">{conversion.multiplier * conversion.factor} {conversion.baseUnit}s</span> from stock
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </>
                )}
              </div>
            </div>
            )}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
            onClick={cancelDelete}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl w-[480px] max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-base text-gray-900">Remove Warehouse</h3>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure you want to remove {warehousesToDelete.length} warehouse{warehousesToDelete.length !== 1 ? 's' : ''}?
              </p>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4">
              {/* Warehouses to be removed */}
              <div className="space-y-2 mb-4">
                {warehousesToDelete.map((warehouse) => (
                  <div 
                    key={warehouse.id}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900">{warehouse.warehouseName}</span>
                      <span className="text-xs text-gray-500">{warehouse.warehouseCode}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">Opening Stock</span>
                      <p className="text-sm text-gray-900">{warehouse.openingStock}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex gap-2">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-yellow-800">Important Notice</p>
                  <p className="text-xs text-yellow-700 mt-0.5">
                    All the attached warehouse allocations and the related bin opening stock quantities will be deleted.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex items-center justify-between">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm border-2 border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <span className="uppercase tracking-wide">Remove {warehousesToDelete.length} Warehouse{warehousesToDelete.length !== 1 ? 's' : ''}</span>
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* UOM Conversion Delete Confirmation Modal */}
      {showUOMDeleteConfirmation && uomConversionToDelete && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
            onClick={cancelUOMDelete}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[520px] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-base font-medium">
                Remove Unit Conversion
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Are you sure you want to remove this unit conversion?
              </p>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {uomConversionToDelete.multiplier} {uomConversionToDelete.unit} = {uomConversionToDelete.factor} {uomConversionToDelete.baseUnit}
                    </h4>
                    <p className="text-xs text-gray-600 mt-0.5">SKU: {uomConversionToDelete.skuCode || 'Not assigned'}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      This will remove the unit conversion from this item. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 rounded-b-xl flex-shrink-0">
              <button
                type="button"
                onClick={cancelUOMDelete}
                className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmUOMDelete}
                className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#EF4444] text-white hover:bg-[#DC2626]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Conversion</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}