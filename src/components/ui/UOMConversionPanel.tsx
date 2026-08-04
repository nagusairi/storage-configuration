import React from 'react';
import { InventoryValuationInput, InventoryValuationData, Warehouse, ValidationErrors } from './InventoryValuationInput';

interface UOMConversionPanelProps {
  /** Base unit code (e.g., "kg", "pcs", "litre") */
  baseUnit: string;
  /** Display label for base unit (e.g., "Kilogram (kg)", "Piece") */
  baseUnitLabel: string;
  /** Initial conversion data for edit mode */
  initialData?: InventoryValuationData;
  /** Callback when conversion data changes */
  onChange: (data: InventoryValuationData) => void;
  /** Callback when validation state changes */
  onValidationChange?: (isValid: boolean, errors: ValidationErrors) => void;
  /** Parent item SKU for linking conversions */
  parentSku?: string;
  /** Parent item name for display purposes */
  itemName?: string;
  /** Available warehouses (optional, used by underlying component) */
  availableWarehouses?: Warehouse[];
  /** Show/hide validation error messages */
  showValidation?: boolean;
  /** Custom section title (defaults to "Units of Measure (UOM) Conversions") */
  sectionTitle?: string;
  /** Show/hide the informational banner */
  showBanner?: boolean;
  /** Custom banner text (overrides default) */
  customBannerText?: string;
}

/**
 * UOMConversionPanel Component
 * 
 * A reusable component for managing Units of Measure (UOM) conversions.
 * Displays an informational banner explaining the base unit and provides
 * an interface for adding/editing conversion units.
 * 
 * **Key Features:**
 * - Blue informational banner with dynamic base unit badge
 * - Pre-configured InventoryValuationInput for UOM conversions only
 * - Hides inventory-specific fields (opening stock, warehouse selector)
 * - Hides usage role matrix and conversion preview
 * - Validates conversion data and reports errors to parent
 * - Links conversions to parent item via SKU
 * 
 * **Visual Design:**
 * - Light blue banner with 4px left border accent
 * - Purple badge displaying base unit inline with text
 * - Clean, minimal conversion table interface
 * - Consistent with ERP design system (#5C1F3D branding)
 * 
 * **Usage Scenarios:**
 * 1. Add New Item Form (Step 1) - Define conversions during item creation
 * 2. Configure Item Unit Page - Dedicated UOM management
 * 3. Edit Item Form - Modify existing conversions
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <UOMConversionPanel
 *   baseUnit="kg"
 *   baseUnitLabel="Kilogram (kg)"
 *   initialData={conversions}
 *   onChange={(data) => setConversions(data)}
 *   parentSku="ITM-001"
 * />
 * 
 * // With validation tracking
 * <UOMConversionPanel
 *   baseUnit="pcs"
 *   baseUnitLabel="Piece"
 *   initialData={conversions}
 *   onChange={(data) => setConversions(data)}
 *   onValidationChange={(isValid, errors) => {
 *     setIsValid(isValid);
 *     setErrors(errors);
 *   }}
 *   showValidation={true}
 *   parentSku="ITM-002"
 * />
 * 
 * // Custom banner text
 * <UOMConversionPanel
 *   baseUnit="litre"
 *   baseUnitLabel="Litre (L)"
 *   initialData={conversions}
 *   onChange={(data) => setConversions(data)}
 *   customBannerText="Define how this liquid product can be sold in different volumes."
 *   parentSku="ITM-003"
 * />
 * 
 * // Hide banner
 * <UOMConversionPanel
 *   baseUnit="m"
 *   baseUnitLabel="Meter (m)"
 *   initialData={conversions}
 *   onChange={(data) => setConversions(data)}
 *   showBanner={false}
 *   parentSku="ITM-004"
 * />
 * ```
 */
export function UOMConversionPanel({
  baseUnit,
  baseUnitLabel,
  initialData,
  onChange,
  onValidationChange,
  parentSku,
  itemName,
  availableWarehouses = [],
  showValidation = false,
  sectionTitle = "Units of Measure (UOM) Conversions",
  showBanner = true,
  customBannerText
}: UOMConversionPanelProps) {
  
  return (
    <div className="lg:col-span-2">
      {/* Informational Banner */}
      {showBanner && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <p className="text-sm text-blue-900">
            {customBannerText ? (
              customBannerText
            ) : (
              <>
                <span className="font-medium">Note:</span> The selected measuring unit{' '}
                {baseUnitLabel && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#5C1F3D] text-white text-xs font-medium border border-[#5C1F3D]">
                    {baseUnitLabel}
                  </span>
                )}{' '}
                is the base unit for purchase, storage, sale, and conversions; additional saleable units can be derived and tracked separately.
              </>
            )}
          </p>
        </div>
      )}

      {/* UOM Conversion Interface */}
      <InventoryValuationInput
        availableWarehouses={availableWarehouses}
        initialData={initialData}
        onChange={onChange}
        onValidationChange={onValidationChange}
        sectionTitle={sectionTitle}
        showValidation={showValidation}
        showInventoryFields={false}
        showUOCSection={true}
        hideBaseUnit={true}
        baseUnitValue={baseUnitLabel}
        showUsageRoleMatrix={false}
        showConversionPreview={false}
        parentSku={parentSku}
        itemName={itemName}
      />
    </div>
  );
}