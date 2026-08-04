# UOMConversionPanel Component Documentation

## Overview

**Component Name:** `UOMConversionPanel`  
**Location:** `/components/ui/UOMConversionPanel.tsx`  
**Purpose:** A reusable component for managing Units of Measure (UOM) conversions across the ERP application.

---

## What It Does

The `UOMConversionPanel` component provides a standardized interface for defining how a product can be measured and sold in different units beyond its base unit. It combines:

1. **Informational Banner** - Explains the base unit context with visual badge
2. **Conversion Interface** - Allows adding/editing unit conversions
3. **Validation** - Tracks conversion data validity and reports errors
4. **SKU Linking** - Associates conversions with parent item

---

## Key Features

### 1. Blue Informational Banner
- Light blue background with 4px left border accent
- Displays base unit inline with purple badge
- Customizable text or default explanation
- Can be hidden via prop

### 2. Pre-Configured Conversion Interface
- Uses `InventoryValuationInput` component internally
- Shows ONLY UOM-relevant fields
- Hides inventory-specific fields (opening stock, warehouse selector)
- Hides usage role matrix and conversion preview
- Displays base unit as read-only

### 3. Validation & Data Flow
- Tracks conversion data changes via `onChange` callback
- Reports validation errors via `onValidationChange` callback
- Links conversions to parent item via `parentSku` prop

### 4. Visual Consistency
- Purple badge (`#5C1F3D`) matches ERP branding
- Consistent spacing and typography
- Clean, minimal interface

---

## Props Interface

```typescript
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
```

---

## Usage Examples

### Basic Usage (Add New Item Form)

```tsx
import { UOMConversionPanel } from '../ui/UOMConversionPanel';

function AddItemForm() {
  const [measuringUnit, setMeasuringUnit] = useState('kg');
  const [conversions, setConversions] = useState({});
  
  return (
    <UOMConversionPanel
      baseUnit="kg"
      baseUnitLabel="Kilogram (kg)"
      initialData={conversions}
      onChange={(data) => setConversions(data)}
      parentSku="ITM-001"
    />
  );
}
```

### With Validation Tracking

```tsx
function ConfigureItemUnit() {
  const [conversions, setConversions] = useState({});
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({});
  
  return (
    <UOMConversionPanel
      baseUnit="pcs"
      baseUnitLabel="Piece"
      initialData={conversions}
      onChange={(data) => setConversions(data)}
      onValidationChange={(valid, validationErrors) => {
        setIsValid(valid);
        setErrors(validationErrors);
      }}
      showValidation={true}
      parentSku="ITM-002"
    />
  );
}
```

### Custom Banner Text

```tsx
<UOMConversionPanel
  baseUnit="litre"
  baseUnitLabel="Litre (L)"
  initialData={conversions}
  onChange={(data) => setConversions(data)}
  customBannerText="Define how this liquid product can be sold in different volumes."
  parentSku="ITM-003"
/>
```

### Hide Banner

```tsx
<UOMConversionPanel
  baseUnit="m"
  baseUnitLabel="Meter (m)"
  initialData={conversions}
  onChange={(data) => setConversions(data)}
  showBanner={false}
  parentSku="ITM-004"
/>
```

---

## Use Cases

### 1. Add New Item Form (Step 1)
- Conditionally shown when user selects "Configure Now" for UOM conversions
- Displays after user selects measuring unit
- Provides context about base unit selection

### 2. Configure Item Unit Page (`/dashboard/inventory/uom/create`)
- Dedicated page for configuring UOM conversions
- Full-featured conversion interface
- Validation tracking for form submission

### 3. Edit Item Form
- Modify existing conversions
- Pre-fill with existing data via `initialData` prop
- Track changes and validate before saving

---

## Visual Structure

```
┌─────────────────────────────────────────────────────────────┐
│  ℹ️ Blue Banner (Informational)                            │
│  "The selected measuring unit [Kilogram (kg)] is the base  │
│   unit for purchase, storage, sale, and conversions..."    │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Units of Measure (UOM) Conversions                        │
│  ─────────────────────────────────────────────────────────  │
│  Base Unit: Kilogram (kg) [Read-only]                      │
│                                                             │
│  Conversion Units:                                          │
│  [Add Conversion] button                                    │
│  Table/Form for entering conversions                        │
│  ┌───────────────────┬────────────────┬─────────────┐      │
│  │ Conversion Unit   │ Conv. Factor   │ Actions     │      │
│  ├───────────────────┼────────────────┼─────────────┤      │
│  │ Box               │ 1 box = 5 kg   │ [Delete]    │      │
│  │ Bag               │ 1 bag = 25 kg  │ [Delete]    │      │
│  │ Pallet            │ 1 pallet=1000kg│ [Delete]    │      │
│  └───────────────────┴────────────────┴─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
User Input (Conversions)
      ↓
InventoryValuationInput
      ↓
onChange callback
      ↓
Parent component updates state
      ↓
Submit form → Save to database
```

---

## Business Value Example

**Scenario:** Rice Supplier

- **Base Unit:** Kilogram (kg)
- **Conversions:**
  - 1 Box = 5 kg
  - 1 Bag = 25 kg
  - 1 Pallet = 1000 kg

**Benefits:**
- Customer orders "5 boxes of rice" → System converts to "25 kg" → Deducts 25 kg from inventory
- Invoice shows "5 boxes @ ₹500/box" (customer-friendly)
- Inventory tracked in single base unit (kg) for accuracy
- Purchase orders can use vendor-preferred units (pallets)
- Reports show unified inventory levels

---

## Design Specifications

### Colors
| Element | Background | Text | Border |
|---------|-----------|------|--------|
| Banner | `bg-blue-50` | `text-blue-900` | `border-blue-500` (left 4px) |
| Base Unit Badge | `bg-[#5C1F3D]` | `text-white` | `border-[#5C1F3D]` |

### Typography
| Element | Font Size | Font Weight | Color |
|---------|-----------|-------------|-------|
| Banner Text | `text-sm` (14px) | Normal | `text-blue-900` |
| "Note:" Label | `text-sm` | `font-medium` | `text-blue-900` |
| Badge Text | `text-xs` (12px) | `font-medium` | `text-white` |

### Spacing
- Banner padding: `p-3` (12px all sides)
- Banner margin bottom: `mb-4` (16px)
- Badge padding: `px-2 py-0.5` (8px horizontal, 2px vertical)
- Banner border radius: `rounded-r-lg` (right side only)

---

## Integration Checklist

When using `UOMConversionPanel` in a new page:

- [ ] Import component: `import { UOMConversionPanel } from '../ui/UOMConversionPanel';`
- [ ] Import types: `import { InventoryValuationData, Warehouse, ValidationErrors } from '../ui/InventoryValuationInput';`
- [ ] Create state for conversion data: `useState<InventoryValuationData>(...)`
- [ ] Create state for validation errors (optional): `useState<ValidationErrors>({})`
- [ ] Pass base unit code and label
- [ ] Provide onChange handler to capture conversion data
- [ ] Provide onValidationChange handler (optional) for validation tracking
- [ ] Pass parentSku if linking to existing item
- [ ] Configure showValidation prop based on form submission state

---

## Benefits Over Direct InventoryValuationInput Usage

1. **Pre-configured** - No need to remember 10+ props configuration
2. **Consistent UX** - Same banner and layout across all UOM pages
3. **Maintainable** - Update once, reflects everywhere
4. **Type-safe** - Proper TypeScript interfaces
5. **Documented** - Clear prop descriptions and examples
6. **Flexible** - Customizable banner text, section title, etc.

---

## Related Components

- **InventoryValuationInput** (`/components/ui/InventoryValuationInput.tsx`) - Underlying multi-purpose component
- **SKUCodeInput** (`/components/ui/SKUCodeInput.tsx`) - SKU input with auto-generation
- **StyledSelect** (`/components/ui/StyledSelect.tsx`) - MUI-based dropdown component
- **StyledTextField** (`/components/ui/StyledTextField.tsx`) - MUI-based text input

---

## Migration Guide

### Before (Direct InventoryValuationInput)

```tsx
<div className="lg:col-span-2">
  <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
    <p className="text-sm text-blue-900">
      <span className="font-medium">Note:</span> The selected measuring unit{' '}
      {measuringUnit && (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#5C1F3D] text-white text-xs font-medium border border-[#5C1F3D]">
          {getMeasuringUnitLabel(measuringUnit)}
        </span>
      )}{' '}
      is the base unit for purchase, storage, sale, and conversions...
    </p>
  </div>

  <InventoryValuationInput
    availableWarehouses={availableWarehouses}
    initialData={inventoryData}
    onChange={(data) => setInventoryData(data)}
    onValidationChange={(isValid, errors) => setInventoryValidationErrors(errors)}
    sectionTitle="Units of Measure (UOM) Conversions"
    showValidation={false}
    showInventoryFields={false}
    showUOCSection={true}
    hideBaseUnit={true}
    baseUnitValue={getMeasuringUnitLabel(measuringUnit)}
    showUsageRoleMatrix={false}
    showConversionPreview={false}
    parentSku={skuValue}
  />
</div>
```

### After (UOMConversionPanel)

```tsx
<UOMConversionPanel
  baseUnit={measuringUnit}
  baseUnitLabel={getMeasuringUnitLabel(measuringUnit)}
  initialData={inventoryData}
  onChange={(data) => setInventoryData(data)}
  onValidationChange={(isValid, errors) => setInventoryValidationErrors(errors)}
  parentSku={skuValue}
  availableWarehouses={availableWarehouses}
  showValidation={false}
/>
```

**Lines of code:** 30+ → 10 ✅  
**Props to configure:** 11 → 7 ✅  
**Consistency:** Manual → Guaranteed ✅

---

## Notes

- The `lg:col-span-2` class is included in the component wrapper, so no need to wrap it in a grid column container
- The component is designed to work within a parent grid layout (`grid grid-cols-1 lg:grid-cols-2`)
- All underlying configuration for UOM-only display is handled internally
- The component exports TypeScript types from `InventoryValuationInput` for convenience

---

## Future Enhancements

Potential improvements for future versions:

- [ ] Add tooltips for conversion inputs
- [ ] Add bulk import/export for conversions
- [ ] Add conversion validation rules (e.g., max factor, unique units)
- [ ] Add conversion preview calculations
- [ ] Add support for multi-level conversions (box → pallet → container)
- [ ] Add undo/redo for conversion edits
- [ ] Add conversion templates (standard industry conversions)

---

**Last Updated:** January 2025  
**Maintained By:** ERP Development Team
