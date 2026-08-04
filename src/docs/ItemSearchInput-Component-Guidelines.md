# ItemSearchInput Component - Complete Documentation

## Overview

The **ItemSearchInput** is a comprehensive, reusable item search and selection component designed for ERP forms and workflows. It provides intelligent autocomplete functionality with rich item details, AI-powered suggestions, and stock level indicators.

**Component Location:** `/components/ui/ItemSearchInput.tsx`

---

## Key Features

### 🔍 **Smart Search**
- Search across multiple fields: item name, SKU, barcode, category
- Real-time filtering as you type
- Text highlighting for matched terms
- Fuzzy matching support

### 🤖 **AI-Powered Suggestions**
- AI-recommended items based on context
- Confidence scores and reasons
- Visual AI badge indicators

### 📊 **Rich Item Display**
- Item name, SKU, category
- Price display (₹ Indian Rupee format)
- Stock level with color-coded indicators
- Optional product images
- Unit of measurement

### ⌨️ **Keyboard Navigation**
- Arrow keys (↑/↓) for navigation
- Enter to select
- Escape to close
- Full accessibility support

### 🎨 **Visual Organization**
- Grouped suggestions (AI, Recent, All Items)
- Color-coded stock levels (green/orange/red)
- Sticky section headers
- Smooth hover effects

### ✅ **Validation & Filtering**
- Required field support
- Error message display
- Filter out-of-stock items
- Category filtering
- Stock availability checks

---

## Installation & Import

```tsx
import { ItemSearchInput, InventoryItem, ItemSuggestion } from '../components/ui/ItemSearchInput';
```

---

## Basic Usage

### Simple Item Selection

```tsx
import { useState } from 'react';
import { ItemSearchInput, InventoryItem } from '../components/ui/ItemSearchInput';

function CreatePurchaseOrder() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const inventoryItems: InventoryItem[] = [
    {
      id: 1,
      itemName: 'Wireless Mouse',
      sku: 'MOUSE-WL-001',
      category: 'Electronics',
      price: 599,
      stock: 45,
      unit: 'pcs',
      status: 'In Stock'
    },
    {
      id: 2,
      itemName: 'USB Cable Type-C',
      sku: 'CABLE-USBC-002',
      category: 'Accessories',
      price: 149,
      stock: 5,
      unit: 'pcs',
      status: 'Low Stock'
    }
  ];

  return (
    <ItemSearchInput
      value={selectedItem}
      onChange={setSelectedItem}
      items={inventoryItems}
      label="Select Item"
      placeholder="Search by item name, SKU, or category..."
      required
    />
  );
}
```

---

## Advanced Usage

### With AI Suggestions & Recent Items

```tsx
import { ItemSearchInput, ItemSuggestion, InventoryItem } from '../components/ui/ItemSearchInput';

function TransferForm() {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // AI-powered suggestions based on context
  const aiSuggestions: ItemSuggestion[] = [
    {
      itemId: 1,
      reason: 'Frequently transferred together',
      confidence: 95
    },
    {
      itemId: 3,
      reason: 'Low stock alert in target warehouse',
      confidence: 88
    }
  ];

  // Track recently used items
  const recentItemIds = [5, 12, 18, 23];

  return (
    <ItemSearchInput
      value={selectedItem}
      onChange={setSelectedItem}
      items={inventoryItems}
      aiSuggestions={aiSuggestions}
      recentItems={recentItemIds}
      displayMode="name"
      showStockLevel
      showPrice
      showCategory
      filterOutOfStock
      label="Item to Transfer"
      required
    />
  );
}
```

### With Category Filter

```tsx
<ItemSearchInput
  value={selectedItem}
  onChange={setSelectedItem}
  items={inventoryItems}
  categoryFilter="Electronics" // Only show items from Electronics category
  label="Select Electronic Item"
  placeholder="Search electronics..."
/>
```

### With Error Validation

```tsx
const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
const [error, setError] = useState<string>('');

const handleSubmit = () => {
  if (!selectedItem) {
    setError('Please select an item to continue');
    return;
  }
  // Proceed with submission
};

return (
  <ItemSearchInput
    value={selectedItem}
    onChange={(item) => {
      setSelectedItem(item);
      setError(''); // Clear error on selection
    }}
    items={inventoryItems}
    error={error}
    required
  />
);
```

---

## Props Reference

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `InventoryItem \| null` | **Required** | Currently selected item |
| `onChange` | `(item: InventoryItem \| null) => void` | **Required** | Callback when item is selected or cleared |
| `items` | `InventoryItem[]` | **Required** | Array of all available inventory items |

### Display Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `displayMode` | `'name' \| 'sku'` | `'name'` | What to show in input after selection |
| `placeholder` | `string` | `'Search by item name...'` | Placeholder text for search input |
| `label` | `string` | `'Select Item'` | Label text above input |
| `noResultsText` | `string` | `'No items found'` | Message when no results match |

### AI Features

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `aiSuggestions` | `ItemSuggestion[]` | `[]` | AI-recommended items with reasons |
| `recentItems` | `(number \| string)[]` | `[]` | Array of recently used item IDs |

### Visual Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showStockLevel` | `boolean` | `true` | Display stock quantity badge |
| `showPrice` | `boolean` | `true` | Display item price |
| `showCategory` | `boolean` | `true` | Display item category |
| `showImage` | `boolean` | `false` | Display product image thumbnail |

### Validation & Filtering

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `required` | `boolean` | `false` | Mark field as required |
| `disabled` | `boolean` | `false` | Disable the input |
| `error` | `string` | `undefined` | Error message to display |
| `filterOutOfStock` | `boolean` | `false` | Hide out-of-stock items from results |
| `categoryFilter` | `string` | `undefined` | Filter items by specific category |

### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onSearchChange` | `(searchTerm: string) => void` | Called when search term changes |
| `onClear` | `() => void` | Called when selection is cleared |

### Styling

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes for container |

---

## Data Types

### InventoryItem

```tsx
interface InventoryItem {
  id: number | string;           // Unique identifier
  itemName: string;              // Display name
  sku: string;                   // Stock Keeping Unit code
  category: string;              // Product category
  price: number;                 // Item price (in ₹)
  stock: number;                 // Available quantity
  barcode?: string;              // Optional barcode
  imageUrl?: string;             // Optional product image URL
  unit?: string;                 // Unit of measurement (pcs, kg, liters)
  status?: 'In Stock' | 'Low Stock' | 'Out of Stock'; // Stock status
}
```

### ItemSuggestion

```tsx
interface ItemSuggestion {
  itemId: number | string;  // ID of the suggested item
  reason: string;           // Why this item is suggested
  confidence?: number;      // AI confidence score (0-100)
}
```

---

## Visual States

### Stock Level Indicators

The component automatically color-codes stock levels:

| Status | Color | Badge Style |
|--------|-------|-------------|
| **In Stock** | Green | `bg-green-50 text-green-600 border-green-200` |
| **Low Stock** | Orange | `bg-orange-50 text-orange-600 border-orange-200` |
| **Out of Stock** | Red | `bg-red-50 text-red-600 border-red-200` |

**Logic:**
- Out of Stock: `status === 'Out of Stock' || stock === 0`
- Low Stock: `status === 'Low Stock' || stock < 10`
- In Stock: All other cases

### Dropdown Sections

Items are grouped in the dropdown:

1. **AI Recommendations** (Purple header with ✨ Sparkles icon)
   - Items suggested by AI with reasons
   - Purple hover background
   
2. **Recently Used** (Blue header)
   - Items from `recentItems` prop
   - Blue hover background
   
3. **All Items** (Gray header)
   - Remaining filtered items
   - Gray hover background

---

## Examples by Use Case

### Purchase Order Line Item

```tsx
<ItemSearchInput
  value={lineItem.item}
  onChange={(item) => updateLineItem(lineItem.id, { item })}
  items={inventoryItems}
  displayMode="name"
  showStockLevel
  showPrice
  filterOutOfStock // Don't allow ordering out-of-stock items
  label="Item"
  placeholder="Search items to purchase..."
  required
/>
```

### Transfer Request

```tsx
<ItemSearchInput
  value={selectedItem}
  onChange={setSelectedItem}
  items={warehouseInventory}
  aiSuggestions={[
    { itemId: 42, reason: 'Low stock at destination warehouse' },
    { itemId: 15, reason: 'Frequently transferred to this location' }
  ]}
  recentItems={[10, 15, 42, 67]}
  showStockLevel
  showCategory
  filterOutOfStock
  label="Item to Transfer"
  required
/>
```

### Stock Adjustment

```tsx
<ItemSearchInput
  value={adjustmentItem}
  onChange={setAdjustmentItem}
  items={inventoryItems}
  displayMode="sku" // Show SKU in input instead of name
  categoryFilter={selectedCategory}
  showStockLevel
  showPrice={false} // Price not relevant for adjustments
  label="Select Item for Adjustment"
  placeholder="Enter SKU or item name..."
  required
/>
```

### Sales Order Line Item

```tsx
<ItemSearchInput
  value={orderLineItem}
  onChange={(item) => {
    setOrderLineItem(item);
    if (item) {
      // Auto-populate price and availability
      setLinePrice(item.price);
      setMaxQuantity(item.stock);
    }
  }}
  items={inventoryItems}
  aiSuggestions={[
    { itemId: 5, reason: 'Frequently purchased together', confidence: 92 },
    { itemId: 12, reason: 'Related to previous order items', confidence: 85 }
  ]}
  showStockLevel
  showPrice
  showImage // Show product images for customer-facing flows
  filterOutOfStock // Only show available items
  label="Select Product"
  onSearchChange={(term) => console.log('Searching:', term)}
  required
/>
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` (Arrow Down) | Navigate to next suggestion |
| `↑` (Arrow Up) | Navigate to previous suggestion |
| `Enter` | Select highlighted suggestion |
| `Escape` | Close dropdown |
| `Tab` | Move to next form field |

---

## Accessibility

### ARIA Support

- Proper `aria-label` attributes
- Keyboard navigation support
- Focus management
- Screen reader friendly

### Visual Feedback

- Clear hover states
- Highlighted keyboard navigation
- Color-coded stock levels (with text labels)
- Error message display

---

## Styling & Customization

### Height Consistency

The component follows ERP design guidelines:
- **Input height**: `h-10` (40px → **33px** per guidelines, update if needed)
- **Padding**: `px-3 py-2`
- **Border radius**: `rounded-[3px]`

### Colors

| Element | Color |
|---------|-------|
| Border (default) | `border-gray-300` |
| Focus ring | `focus:ring-[#5C1F3D]` (ERP primary color) |
| Error border | `border-red-500` |
| Error ring | `focus:ring-red-500` |
| AI section | Purple (`bg-purple-50`, `text-purple-700`) |
| Recent section | Blue (`bg-blue-50`, `text-blue-700`) |

### Custom Styling

```tsx
<ItemSearchInput
  className="mb-4" // Add margin bottom
  // ... other props
/>
```

---

## Performance Considerations

### Memoization

The component uses `React.useMemo` to optimize:
- Filtered items calculation
- Grouped items (AI, Recent, Other)

### Large Datasets

For large inventories (1000+ items):
- Consider implementing virtual scrolling
- Use debounced search (implement in parent)
- Lazy load images with `loading="lazy"`

**Example with Debounced Search:**

```tsx
import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

const [searchTerm, setSearchTerm] = useState('');

const handleSearchChange = useCallback(
  debounce((term: string) => {
    // Perform expensive search operation
    console.log('Searching for:', term);
  }, 300),
  []
);

<ItemSearchInput
  onSearchChange={handleSearchChange}
  // ... other props
/>
```

---

## Common Patterns

### Multi-Item Selection (Array)

For selecting multiple items (e.g., bundle composition):

```tsx
const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);

const handleAddItem = (item: InventoryItem | null) => {
  if (item && !selectedItems.find(i => i.id === item.id)) {
    setSelectedItems([...selectedItems, item]);
  }
};

return (
  <>
    <ItemSearchInput
      value={null} // Always null for multi-select
      onChange={handleAddItem}
      items={inventoryItems.filter(item => 
        !selectedItems.find(s => s.id === item.id) // Exclude already selected
      )}
      label="Add Items to Bundle"
    />
    
    {/* Display selected items */}
    <div className="mt-4">
      {selectedItems.map(item => (
        <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <span>{item.itemName}</span>
          <button onClick={() => setSelectedItems(selectedItems.filter(i => i.id !== item.id))}>
            Remove
          </button>
        </div>
      ))}
    </div>
  </>
);
```

### Dependent Dropdowns

When one selection affects another:

```tsx
const [selectedCategory, setSelectedCategory] = useState<string>('');
const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

return (
  <>
    <StyledSelect
      value={selectedCategory}
      onChange={(e) => {
        setSelectedCategory(e.target.value);
        setSelectedItem(null); // Reset item when category changes
      }}
    >
      <MenuItem value="">All Categories</MenuItem>
      <MenuItem value="Electronics">Electronics</MenuItem>
      <MenuItem value="Furniture">Furniture</MenuItem>
    </StyledSelect>
    
    <ItemSearchInput
      value={selectedItem}
      onChange={setSelectedItem}
      items={inventoryItems}
      categoryFilter={selectedCategory} // Filter by selected category
      label="Select Item"
    />
  </>
);
```

---

## Troubleshooting

### Issue: Dropdown doesn't close on selection

**Solution:** Ensure `onChange` is updating the `value` prop correctly.

```tsx
// ✅ Correct
<ItemSearchInput
  value={selectedItem}
  onChange={setSelectedItem} // Updates value, triggers dropdown close
  items={items}
/>

// ❌ Incorrect
<ItemSearchInput
  value={selectedItem}
  onChange={(item) => console.log(item)} // Doesn't update value
  items={items}
/>
```

### Issue: AI suggestions not showing

**Solution:** Verify `aiSuggestions` item IDs match items in `items` array.

```tsx
const items = [
  { id: 1, itemName: 'Mouse', ... },
  { id: 2, itemName: 'Keyboard', ... }
];

const aiSuggestions = [
  { itemId: 1, reason: '...' }, // ✅ Matches item id: 1
  { itemId: 999, reason: '...' } // ❌ No matching item
];
```

### Issue: Stock levels not color-coded

**Solution:** Ensure items have `status` property OR `stock` number.

```tsx
// ✅ Option 1: Use status
{ id: 1, stock: 5, status: 'Low Stock', ... }

// ✅ Option 2: Let component auto-detect from stock number
{ id: 1, stock: 5, ... } // Will show orange if < 10

// ❌ Missing both
{ id: 1, ... } // No stock indicator
```

---

## Integration with Forms

### React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form';

const { control, handleSubmit } = useForm();

<Controller
  name="selectedItem"
  control={control}
  rules={{ required: 'Please select an item' }}
  render={({ field, fieldState }) => (
    <ItemSearchInput
      value={field.value}
      onChange={field.onChange}
      items={inventoryItems}
      error={fieldState.error?.message}
      required
    />
  )}
/>
```

### Formik

```tsx
import { Formik, Field } from 'formik';

<Formik
  initialValues={{ item: null }}
  onSubmit={handleSubmit}
>
  {({ values, setFieldValue, errors, touched }) => (
    <ItemSearchInput
      value={values.item}
      onChange={(item) => setFieldValue('item', item)}
      items={inventoryItems}
      error={touched.item && errors.item ? String(errors.item) : undefined}
      required
    />
  )}
</Formik>
```

---

## Best Practices

✅ **DO:**
- Always provide a meaningful `label`
- Use `required` prop for mandatory fields
- Filter out-of-stock items in purchase/sales flows
- Show price in customer-facing workflows
- Use AI suggestions to improve UX
- Track recently used items for faster selection

❌ **DON'T:**
- Pass duplicate IDs in `aiSuggestions` and `recentItems`
- Forget to handle `null` value (when cleared)
- Show stock levels in contexts where it's not relevant
- Hardcode item data (fetch from API/database)

---

## Future Enhancements

Potential improvements for future versions:

- [ ] Virtual scrolling for 10,000+ items
- [ ] Barcode scanner integration
- [ ] Bulk selection mode
- [ ] Export/import selected items
- [ ] Custom template rendering for dropdown items
- [ ] Inline item creation ("+Add New Item" option)
- [ ] Search history persistence
- [ ] Advanced filtering (price range, stock range)

---

## Related Components

- **SKUCodeInput** - For SKU code entry with auto-generation
- **StyledSelect** - For simple dropdown selections
- **DataGrid** - For tabular item displays with actions

---

## Support

For questions or issues, refer to:
- Main ERP Design Guidelines: `/Guidelines.md`
- AI Design Guidelines: `/AI-Design-Guidelines.md`
- Component source: `/components/ui/ItemSearchInput.tsx`
