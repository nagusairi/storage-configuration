# InventoryValuationInput - Quick Reference Guide

## 🚀 Quick Start (30 seconds)

```tsx
import { InventoryValuationInput } from '../../components/ui/InventoryValuationInput';

const warehouses = [
  { id: 1, warehouseName: 'Main Warehouse', warehouseCode: 'WH-001' },
  { id: 2, warehouseName: 'Secondary', warehouseCode: 'WH-002' }
];

function MyForm() {
  return (
    <InventoryValuationInput
      availableWarehouses={warehouses}
    />
  );
}
```

---

## 📋 Must-Have Props

| Prop | Type | What It Does |
|------|------|--------------|
| `availableWarehouses` | `Warehouse[]` | List of warehouses user can select |

---

## 🎯 Common Use Cases

### 1. Basic Standalone
```tsx
<InventoryValuationInput
  availableWarehouses={warehouses}
/>
```

### 2. With Initial Data
```tsx
<InventoryValuationInput
  availableWarehouses={warehouses}
  initialData={{
    reorderLevel: 10,
    lowStockAlertLevel: 5,
    valuationMethod: 'fifo',
    hasOpeningStock: true,
    warehouseStocks: [
      { id: 1, warehouseName: 'Main', warehouseCode: 'WH-001', openingStock: 100 }
    ]
  }}
/>
```

### 3. With Change Tracking
```tsx
<InventoryValuationInput
  availableWarehouses={warehouses}
  onChange={(data) => {
    console.log('Data changed:', data);
    saveToServer(data);
  }}
/>
```

### 4. With Validation
```tsx
<InventoryValuationInput
  availableWarehouses={warehouses}
  required
  showValidation={submitting}
  onValidationChange={(isValid, errors) => {
    setCanSubmit(isValid);
  }}
/>
```

### 5. Disabled State
```tsx
<InventoryValuationInput
  availableWarehouses={warehouses}
  disabled
  initialData={existingData}
/>
```

---

## 🎨 Customization

### Custom Section Title
```tsx
<InventoryValuationInput
  sectionTitle="Stock Configuration"
  availableWarehouses={warehouses}
/>
```

### Minimum Value Constraints
```tsx
<InventoryValuationInput
  availableWarehouses={warehouses}
  minReorderLevel={5}
  minAlertLevel={1}
/>
```

---

## 📦 Data Structure

### Warehouse Object
```tsx
{
  id: 1,                              // number or string
  warehouseName: 'Main Warehouse',    // Display name
  warehouseCode: 'WH-001'             // Short code
}
```

### Output Data Format
```tsx
{
  reorderLevel: 10,                   // number or null
  lowStockAlertLevel: 5,              // number or null
  valuationMethod: 'fifo',            // 'fifo' | 'weighted-average'
  hasOpeningStock: true,              // boolean
  warehouseStocks: [                  // WarehouseStock[]
    {
      id: 1,
      warehouseName: 'Main Warehouse',
      warehouseCode: 'WH-001',
      openingStock: 100
    }
  ]
}
```

---

## ⚡ Pro Tips

### Tip 1: Listen to Validation Changes
```tsx
const [canSubmit, setCanSubmit] = useState(false);

<InventoryValuationInput
  onValidationChange={(isValid) => setCanSubmit(isValid)}
  required
/>

<button disabled={!canSubmit}>Submit</button>
```

### Tip 2: Save on Every Change
```tsx
<InventoryValuationInput
  onChange={(data) => {
    localStorage.setItem('inventory', JSON.stringify(data));
  }}
/>
```

### Tip 3: Cross-Validation
```tsx
// Alert level is automatically validated against reorder level
// No additional code needed!
```

### Tip 4: Bulk Warehouse Operations
```tsx
// Users can:
// 1. Check multiple warehouses
// 2. Click "Remove Selected" to bulk delete
// All handled automatically!
```

---

## 🔑 Key Features

| Feature | Description |
|---------|-------------|
| **Reorder Level** | Set minimum stock before reorder |
| **Alert Level** | Set warning threshold (validates against reorder) |
| **Valuation** | Choose FIFO or Weighted Average |
| **Opening Stock** | Toggle Yes/No |
| **Warehouse Search** | Type to filter warehouses |
| **Multi-Warehouse** | Add multiple warehouses with quantities |
| **Bulk Remove** | Select and remove multiple warehouses |
| **Real-time Validation** | Instant error feedback |
| **Touch-based Errors** | Errors show only after field is touched |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Dropdown not showing | Click in the warehouse search field |
| Can't add warehouse | Select warehouse and enter quantity first |
| Validation errors not showing | Set `showValidation={true}` |
| Warehouses not in dropdown | Check `availableWarehouses` prop |
| Can't remove warehouse | Check if `disabled={true}` |

---

## 📦 Full Props Cheat Sheet

```tsx
<InventoryValuationInput
  // Required
  availableWarehouses={warehouses}     // Warehouse[]
  
  // Optional Data
  initialData={{                       // Partial<InventoryValuationData>
    reorderLevel: 10,
    lowStockAlertLevel: 5,
    valuationMethod: 'fifo',
    hasOpeningStock: true,
    warehouseStocks: [...]
  }}
  
  // Callbacks
  onChange={(data) => {}}              // (data: InventoryValuationData) => void
  onValidationChange={(isValid, errors) => {}}  // (boolean, ValidationErrors) => void
  
  // Validation
  required={true}                      // boolean
  showValidation={false}               // boolean
  minReorderLevel={0}                  // number
  minAlertLevel={0}                    // number
  
  // Customization
  sectionTitle="Inventory & Valuation" // string
  className="my-class"                 // string
  disabled={false}                     // boolean
/>
```

---

## 📖 Validation Rules

1. **Reorder Level**
   - Required if `required={true}`
   - Must be >= `minReorderLevel`

2. **Low Stock Alert**
   - Required if `required={true}`
   - Must be >= `minAlertLevel`
   - Must be <= reorder level

3. **Warehouse Stocks**
   - If `hasOpeningStock = true`, must have at least 1 warehouse

---

## 🎯 Common Patterns

### Pattern 1: Form Submission
```tsx
const [data, setData] = useState(null);
const [isValid, setIsValid] = useState(false);

const handleSubmit = () => {
  if (isValid) {
    submitToAPI(data);
  }
};

<InventoryValuationInput
  onChange={setData}
  onValidationChange={(valid) => setIsValid(valid)}
  required
/>
```

### Pattern 2: Edit Mode
```tsx
const [editing, setEditing] = useState(false);

<InventoryValuationInput
  initialData={existingProduct.inventory}
  disabled={!editing}
  onChange={editing ? handleChange : undefined}
/>
```

### Pattern 3: Step-by-Step Form
```tsx
const [step, setStep] = useState(1);
const [inventoryData, setInventoryData] = useState(null);

{step === 2 && (
  <InventoryValuationInput
    initialData={inventoryData}
    onChange={setInventoryData}
    required
  />
)}
```

---

## 📚 Type Imports

```tsx
import {
  InventoryValuationInput,
  Warehouse,
  WarehouseStock,
  ValuationMethod,
  InventoryValuationData,
  ValidationErrors
} from '../../components/ui/InventoryValuationInput';
```

---

## 🔗 Quick Links

- **Full Documentation:** `/docs/InventoryValuationInput-Component-Documentation.md`
- **Component File:** `/components/ui/InventoryValuationInput.tsx`
- **Design Specs:** `/docs/InventoryValuationInput-Design-Specifications.md`

---

**Component:** `InventoryValuationInput`  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
