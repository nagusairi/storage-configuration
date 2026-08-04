# 📋 Create UOM Page Revamp - Explanation & Plan

## 🔍 **Current State Analysis**

### **Existing Create UOM Page** (`/pages/inventory/CreateUOM.tsx`)

**Current Purpose:** Configure generic UOM (Unit of Measure) conversion rules  
**Current Fields:**

1. **Basic Information:**
   - UOM Name (e.g., "Kilogram", "Meter")
   - UOM Code (e.g., "KG", "M")
   - Category (Weight, Length, Volume, Area, Time, Quantity)
   - Base Unit (e.g., "Gram", "Centimeter")
   - Decimal Places (0-4)
   - Description

2. **Conversion Rules:**
   - From Unit (e.g., "1 Kilogram")
   - To Unit (e.g., "1000 Grams")
   - Conversion Factor (e.g., "1000")
   - Formula (e.g., "1 kg = 1000 g")
   - Multiple rules can be added

3. **AI Suggestions:**
   - Purple panel suggesting common conversions based on category

4. **Usage Summary:**
   - Read-only summary of configured UOM

**Current Workflow:**

```
User clicks "Configure Item Unit" button
         ↓
Navigates to /dashboard/inventory/uom/create
         ↓
User manually fills all fields
         ↓
User adds conversion rules manually
         ↓
User saves → Returns to UOM list page
```

---

## 🎯 **New Requirements**

### **Required Changes:**

1. **Item Selection System (NEW)**
   - Dropdown with smart search and suggestions to select an existing item
   - Once selected, auto-display item details in **read-only mode**

2. **Auto-Populated Item Details (NEW)**
   - **Item Name** - Read-only, from selected item
   - **Category** - Read-only, from selected item
   - **Brand Name** - Read-only, from selected item
   - **SKU Code** - Read-only, from selected item
   - **Measuring Unit** - Read-only, from selected item (BASE UNIT)

3. **Dynamic UOM Conversion Panel (REPLACED)**
   - Use the new `UOMConversionPanel` component we just created
   - Driven by the selected item's Measuring Unit (base unit)
   - Automatically initialized when item is selected

4. **Prepopulation Logic (NEW)**
   - **If item has existing UOM conversions** (configured during item creation):
     - Automatically prepopulate the "Conversion Units for Sales" section
     - Display all existing conversion units
     - Allow user to extend/modify them
   - **If item has NO UOM conversions**:
     - Show empty conversion panel
     - Allow user to add conversions manually (default flow)

5. **User Experience Rules:**
   - Prepopulated fields follow same validation rules
   - Users can review and extend conversions
   - Maintain data integrity

---

## 🔄 **New Workflow**

```
User clicks "Configure Item Unit" button
         ↓
Navigates to /dashboard/inventory/uom/create
         ↓
Page shows "Item Selection" dropdown
         ↓
User searches and selects an item (e.g., "Rice - Basmati")
         ↓
Item details auto-populate in read-only fields:
   - Item Name: Rice - Basmati
   - Category: Raw Materials
   - Brand Name: XYZ Foods
   - SKU Code: ITM-001
   - Measuring Unit: Kilogram (kg)
         ↓
UOM Conversion Panel initializes with base unit = "kg"
         ↓
IF item has existing conversions (from item creation):
   ✓ Prepopulate conversions in panel
   ✓ User can review and extend
ELSE:
   ✓ Show empty panel
   ✓ User adds conversions manually
         ↓
User adds/modifies conversion units:
   - 1 Box = 5 kg
   - 1 Bag = 25 kg
   - 1 Pallet = 1000 kg
         ↓
User clicks "Save UOM"
         ↓
Conversions saved and linked to item
         ↓
Returns to UOM list page
```

---

## 🎨 **Visual Layout (Planned)**

```
┌────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Dashboard > Inventory > Item transformation >    │
│              Configure Item Unit                               │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  ITEM SELECTION                                                │
│  ──────────────────────────────────────────────────────────────│
│                                                                 │
│  Select Item *                                                  │
│  [🔍 Search items by name, SKU, or category...          ▼]    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  ITEM DETAILS (Read-Only)                                      │
│  ──────────────────────────────────────────────────────────────│
│                                                                 │
│  Item Name                     SKU Code                        │
│  Rice - Basmati               ITM-001                          │
│                                                                 │
│  Category                      Brand Name                      │
│  Raw Materials                XYZ Foods                        │
│                                                                 │
│  Measuring Unit (Base Unit)                                    │
│  Kilogram (kg)                                                 │
│                                                                 │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  ℹ️ Blue Banner                                                │
│  "The selected measuring unit [Kilogram (kg)] is the base     │
│   unit for purchase, storage, sale, and conversions..."       │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  CONVERSION UNITS FOR SALES                                    │
│  ──────────────────────────────────────────────────────────────│
│                                                                 │
│  Base Unit: Kilogram (kg) [Read-only]                         │
│                                                                 │
│  [+ Add Conversion Unit]                                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 1️⃣ Conversion Unit 1                     [🗑️ Delete]   │ │
│  │                                                           │ │
│  │ Conversion Unit    Conversion Factor                     │ │
│  │ Box                1 box = 5 kg                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 2️⃣ Conversion Unit 2                     [🗑️ Delete]   │ │
│  │                                                           │ │
│  │ Conversion Unit    Conversion Factor                     │ │
│  │ Bag                1 bag = 25 kg                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  Bottom Action Bar                                             │
│  [Cancel]                                    [Save UOM] →      │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔧 **Technical Implementation Plan**

### **1. Create Mock Items Database**

```typescript
interface InventoryItem {
  id: number;
  itemName: string;
  categoryName: string;
  brandName: string;
  skuCode: string;
  measuringUnit: string; // Base unit code (e.g., "kg", "pcs")
  measuringUnitLabel: string; // Display label (e.g., "Kilogram (kg)")
  existingConversions?: UOMConversion[]; // Conversions from item creation
}

interface UOMConversion {
  id: number;
  conversionUnit: string; // e.g., "Box"
  conversionFactor: string; // e.g., "5" (1 box = 5 kg)
  formula: string; // e.g., "1 box = 5 kg"
}

// Mock data
const mockItems: InventoryItem[] = [
  {
    id: 1,
    itemName: "Rice - Basmati",
    categoryName: "Raw Materials",
    brandName: "XYZ Foods",
    skuCode: "ITM-001",
    measuringUnit: "kg",
    measuringUnitLabel: "Kilogram (kg)",
    existingConversions: [
      {
        id: 1,
        conversionUnit: "Box",
        conversionFactor: "5",
        formula: "1 box = 5 kg",
      },
    ],
  },
  {
    id: 2,
    itemName: "Laptop - Dell XPS 15",
    categoryName: "Electronics",
    brandName: "Dell",
    skuCode: "ITM-002",
    measuringUnit: "pcs",
    measuringUnitLabel: "Piece",
    existingConversions: [], // No conversions yet
  },
];
```

### **2. Add Item Selection Component**

```typescript
// Searchable dropdown with item suggestions
<div className="mb-6">
  <label className="block text-sm text-gray-700 mb-2">
    Select Item <span className="text-red-500">*</span>
  </label>
  <Autocomplete
    options={mockItems}
    getOptionLabel={(item) => `${item.itemName} (${item.skuCode})`}
    onChange={(event, value) => setSelectedItem(value)}
    renderInput={(params) => (
      <TextField
        {...params}
        placeholder="Search items by name, SKU, or category..."
        // Custom styling to match ERP design
      />
    )}
    renderOption={(props, item) => (
      <li {...props}>
        <div>
          <div className="font-medium">{item.itemName}</div>
          <div className="text-xs text-gray-500">
            {item.skuCode} • {item.categoryName} • {item.measuringUnitLabel}
          </div>
        </div>
      </li>
    )}
  />
</div>
```

### **3. Add Read-Only Item Details Section**

```typescript
{selectedItem && (
  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
    <h2 className="mb-4 pb-2 border-b border-gray-200 font-medium" style={{ fontSize: '15px' }}>
      Item Details (Read-Only)
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm text-gray-700 mb-2">Item Name</label>
        <input
          type="text"
          value={selectedItem.itemName}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
          style={{ height: '33px' }}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">SKU Code</label>
        <input
          type="text"
          value={selectedItem.skuCode}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 bg-gray-100 cursor-not-allowed font-mono"
          style={{ height: '33px' }}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Category</label>
        <input
          type="text"
          value={selectedItem.categoryName}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
          style={{ height: '33px' }}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Brand Name</label>
        <input
          type="text"
          value={selectedItem.brandName}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
          style={{ height: '33px' }}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm text-gray-700 mb-2">Measuring Unit (Base Unit)</label>
        <input
          type="text"
          value={selectedItem.measuringUnitLabel}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 bg-gray-100 cursor-not-allowed"
          style={{ height: '33px' }}
        />
      </div>
    </div>
  </div>
)}
```

### **4. Replace Conversion Rules with UOMConversionPanel**

```typescript
import { UOMConversionPanel } from '../../components/ui/UOMConversionPanel';
import { InventoryValuationData } from '../../components/ui/InventoryValuationInput';

// State for conversions
const [conversions, setConversions] = useState<InventoryValuationData>({
  reorderLevel: null,
  lowStockAlertLevel: null,
  valuationMethod: 'fifo',
  hasOpeningStock: false,
  warehouseStocks: []
});

// When item is selected, prepopulate conversions
useEffect(() => {
  if (selectedItem && selectedItem.existingConversions) {
    // Transform existing conversions to InventoryValuationData format
    const prepopulatedData = transformConversionsToInventoryData(
      selectedItem.existingConversions
    );
    setConversions(prepopulatedData);
  } else {
    // Reset conversions if no existing data
    setConversions({
      reorderLevel: null,
      lowStockAlertLevel: null,
      valuationMethod: 'fifo',
      hasOpeningStock: false,
      warehouseStocks: []
    });
  }
}, [selectedItem]);

// Render UOMConversionPanel
{selectedItem && (
  <UOMConversionPanel
    baseUnit={selectedItem.measuringUnit}
    baseUnitLabel={selectedItem.measuringUnitLabel}
    initialData={conversions}
    onChange={(data) => {
      setConversions(data);
      setHasChanges(true);
    }}
    parentSku={selectedItem.skuCode}
    showValidation={false}
    sectionTitle="Conversion Units for Sales"
  />
)}
```

### **5. Update Save Logic**

```typescript
const handleSave = async () => {
  if (!selectedItem) {
    alert("Please select an item first");
    return;
  }

  setIsSaving(true);

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log("Saving UOM Conversions:", {
    itemId: selectedItem.id,
    itemName: selectedItem.itemName,
    skuCode: selectedItem.skuCode,
    baseUnit: selectedItem.measuringUnit,
    conversions: conversions, // Contains the conversion data
  });

  setIsSaving(false);
  setHasChanges(false);

  // Navigate back to UOM list
  navigate("/dashboard/inventory/unit-of-measure");
};
```

---

## 📊 **Data Flow**

```
Item Selected
      ↓
selectedItem state updated
      ↓
Item details auto-populate (read-only fields)
      ↓
useEffect checks for existingConversions
      ↓
IF existingConversions exist:
   ✓ Transform to InventoryValuationData format
   ✓ Set conversions state with prepopulated data
   ✓ UOMConversionPanel renders with prepopulated rows
ELSE:
   ✓ Set conversions to empty state
   ✓ UOMConversionPanel renders with empty form
      ↓
User adds/modifies conversions via UOMConversionPanel
      ↓
onChange callback updates conversions state
      ↓
User clicks "Save UOM"
      ↓
Conversions saved to database (linked to item)
      ↓
Navigate back to UOM list page
```

---

## ✅ **Key Benefits**

1. **Context-Aware:** Conversions are tied to specific items
2. **Smart Prepopulation:** Reuses existing conversion data if available
3. **Consistent UX:** Uses standardized `UOMConversionPanel` component
4. **Read-Only Protection:** Item details cannot be modified (prevents data corruption)
5. **Search & Discovery:** Smart dropdown helps find items quickly
6. **Data Integrity:** Base unit is locked and driven by item's measuring unit
7. **Flexible Workflow:** Supports both prepopulated and manual entry flows

---

## 🚨 **Important Notes**

1. **Remove Old Fields:**
   - UOM Name
   - UOM Code
   - Category dropdown
   - Base Unit input
   - Decimal Places
   - Description
   - Old Conversion Rules section

2. **Keep:**
   - Bottom Action Bar (Cancel, Save UOM)
   - "Creating UOM" label in breadcrumb
   - Page structure and styling

3. **Add New:**
   - Item Selection dropdown with search
   - Read-Only Item Details section
   - UOMConversionPanel component

---

## 🎯 **User Stories**

### **Story 1: Configure UOM for Item with Existing Conversions**

```
As a warehouse manager,
When I select "Rice - Basmati" from the item dropdown,
Then I should see its existing conversions (Box = 5 kg) prepopulated,
And I can add more conversions (Bag = 25 kg, Pallet = 1000 kg),
So that I can extend the item's saleable units without losing existing data.
```

### **Story 2: Configure UOM for Item Without Conversions**

```
As a warehouse manager,
When I select "Laptop - Dell XPS 15" from the item dropdown,
Then I should see an empty conversion panel,
And I can manually add conversions (Carton = 10 pcs, Pallet = 100 pcs),
So that I can define saleable units for the first time.
```

### **Story 3: Search and Select Item**

```
As a warehouse manager,
When I type "Rice" in the item search field,
Then I should see all items matching "Rice" in the dropdown,
With their SKU, category, and base unit displayed,
So that I can quickly find the item I want to configure.
```

---

## 🔄 **Changes Summary**

| Component            | Current                                        | New                                                  |
| -------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| **Page Purpose**     | Generic UOM configuration                      | Item-specific UOM conversions                        |
| **Item Context**     | None (standalone UOM)                          | Required (select item first)                         |
| **Basic Fields**     | Manual entry (Name, Code, Category, Base Unit) | Auto-populated from selected item (read-only)        |
| **Conversion Panel** | Custom form with From/To/Factor/Formula        | `UOMConversionPanel` component                       |
| **Prepopulation**    | None (always manual)                           | Smart prepopulation if item has existing conversions |
| **Data Linking**     | No item linkage                                | Conversions linked to specific item via SKU          |
| **Base Unit**        | User-entered                                   | Driven by item's measuring unit                      |

---

**Should I proceed with implementing these changes?** 🚀