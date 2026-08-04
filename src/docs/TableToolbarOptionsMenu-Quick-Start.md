# TableToolbarOptionsMenu - Quick Start Guide

> **⚡ 5-Minute Setup Guide**  
> Get up and running with TableToolbarOptionsMenu in minutes

---

## Installation Checklist

- [x] Component already exists at `/components/ui/TableToolbarOptionsMenu.tsx`
- [x] No installation needed
- [x] No external dependencies required

---

## Basic Implementation (Copy & Paste)

### Step 1: Import the Component

```tsx
import { TableToolbarOptionsMenu } from '../../components/ui/TableToolbarOptionsMenu';
```

### Step 2: Add Required State Variables

```tsx
const [showFilters, setShowFilters] = useState(false);
const [showDensityMenu, setShowDensityMenu] = useState(false);
const [showColumnSelector, setShowColumnSelector] = useState(false);
```

### Step 3: Create Export Handler

```tsx
const handleExport = () => {
  // Basic CSV export example
  const headers = ['ID', 'Name', 'SKU', 'Price'];
  const rows = filteredData.map(item => [item.id, item.name, item.sku, item.price]);
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'data.csv';
  link.click();
  URL.revokeObjectURL(url);
};
```

### Step 4: Add to Your Toolbar

```tsx
<div className="flex items-center gap-2">
  {/* Other toolbar buttons */}
  
  <TableToolbarOptionsMenu
    onToggleFilters={() => setShowFilters(!showFilters)}
    onToggleDensity={() => setShowDensityMenu(true)}
    onToggleColumns={() => setShowColumnSelector(true)}
    onExport={handleExport}
  />
</div>
```

### Step 5: Add Filter Panel (Conditional Rendering)

```tsx
{showFilters && (
  <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
    {/* Your filter controls here */}
    <button onClick={() => setShowFilters(false)}>Close Filters</button>
  </div>
)}
```

---

## ✅ Complete Working Example

```tsx
import { useState } from 'react';
import { TableToolbarOptionsMenu } from '../../components/ui/TableToolbarOptionsMenu';
import { StyledButton } from '../../components/ui/StyledButton';
import { Plus } from 'lucide-react';

export function ProductList() {
  // State
  const [showFilters, setShowFilters] = useState(false);
  const [showDensityMenu, setShowDensityMenu] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [products, setProducts] = useState([/* your data */]);
  
  // Export handler
  const handleExport = () => {
    const csv = generateCSV(products);
    downloadFile(csv, 'products.csv');
  };
  
  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl">Products</h1>
        
        <div className="flex items-center gap-2">
          <StyledButton variant="primary" onClick={() => navigate('/products/new')}>
            <Plus className="w-4 h-4" />
            Add Product
          </StyledButton>
          
          <TableToolbarOptionsMenu
            onToggleFilters={() => setShowFilters(!showFilters)}
            onToggleDensity={() => setShowDensityMenu(true)}
            onToggleColumns={() => setShowColumnSelector(true)}
            onExport={handleExport}
          />
        </div>
      </div>
      
      {/* Filters (conditional) */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3>Filters</h3>
          {/* Filter controls */}
        </div>
      )}
      
      {/* Table */}
      <table className="w-full">
        {/* Table content */}
      </table>
    </div>
  );
}
```

---

## Common Use Cases

### Use Case 1: Only Filters & Export

```tsx
<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={handleExport}
  // Density and Columns omitted = not shown
/>
```

### Use Case 2: Small Size for Compact Toolbars

```tsx
<TableToolbarOptionsMenu
  size="small"
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={handleExport}
/>
```

### Use Case 3: With Custom Menu Items

```tsx
import { Share2, Printer } from 'lucide-react';

const customItems = [
  {
    id: 'share',
    label: 'Share',
    icon: <Share2 className="w-4 h-4 text-gray-500" />,
    onClick: () => handleShare(),
    divider: true
  },
  {
    id: 'print',
    label: 'Print',
    icon: <Printer className="w-4 h-4 text-gray-500" />,
    onClick: () => window.print()
  }
];

<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={handleExport}
  customMenuItems={customItems}
/>
```

### Use Case 4: Hide Specific Options

```tsx
<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onToggleDensity={() => setShowDensityMenu(true)}
  onToggleColumns={() => setShowColumnSelector(true)}
  onExport={handleExport}
  showDensityOption={false}  // Hide density option
/>
```

---

## Integration with DataGrid

If you're using the DataGrid component, the TableToolbarOptionsMenu is already included:

```tsx
import { DataGrid } from '../../components/ui/DataGrid';

<DataGrid
  data={products}
  columns={columns}
  rowKey="id"
  // TableToolbarOptionsMenu is automatically rendered
  // No need to add it separately
/>
```

---

## Troubleshooting

### ❌ Menu doesn't open

**Problem:** Clicking the button does nothing

**Solution:** Verify the component is imported correctly:
```tsx
import { TableToolbarOptionsMenu } from '../../components/ui/TableToolbarOptionsMenu';
//                                     ^^^ Correct path
```

### ❌ Menu items are missing

**Problem:** Menu is empty or only shows some items

**Solution:** Ensure you're passing the callback props:
```tsx
<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}  // ✅ Required
  onExport={handleExport}                               // ✅ Required
  // If callback is not provided, menu item won't show
/>
```

### ❌ Menu is cut off at edge

**Problem:** Dropdown is clipped by parent container

**Solution:** Ensure parent has `overflow: visible`:
```tsx
<div className="relative overflow-visible">  {/* ✅ Add overflow-visible */}
  <TableToolbarOptionsMenu {...props} />
</div>
```

### ❌ Export doesn't work

**Problem:** Export button does nothing

**Solution:** Implement the export handler:
```tsx
const handleExport = () => {
  console.log('Export clicked');  // ✅ Add your export logic
  // Example: Generate CSV and download
};

<TableToolbarOptionsMenu onExport={handleExport} />
```

---

## Testing Checklist

- [ ] Menu opens when clicking trigger button
- [ ] Menu closes when clicking outside
- [ ] Menu closes when clicking a menu item
- [ ] Filters toggle works (if implemented)
- [ ] Density menu opens (if implemented)
- [ ] Column selector opens (if implemented)
- [ ] Export function executes (if implemented)
- [ ] Custom menu items appear (if added)
- [ ] Hover states work correctly
- [ ] Menu is positioned correctly (right-aligned)
- [ ] Menu is visible (not clipped)

---

## Props Quick Reference

| Prop | Type | Example |
|------|------|---------|
| `onToggleFilters` | `() => void` | `() => setShowFilters(!showFilters)` |
| `onToggleDensity` | `() => void` | `() => setShowDensityMenu(true)` |
| `onToggleColumns` | `() => void` | `() => setShowColumnSelector(true)` |
| `onExport` | `() => void` | `() => handleExport()` |
| `size` | `'small' \| 'default' \| 'large'` | `size="small"` |
| `customMenuItems` | `TableToolbarOptionsMenuItem[]` | `customMenuItems={items}` |
| `showFiltersOption` | `boolean` | `showFiltersOption={false}` |

---

## Next Steps

1. ✅ Component is now working in your toolbar
2. 📖 Read full documentation: `/docs/TableToolbarOptionsMenu-Guidelines.md`
3. 🎨 Review visual specs: `/docs/TableToolbarOptionsMenu-Visual-Reference.md`
4. 🔍 See real examples in:
   - `/pages/inventory/ItemMaster.tsx` (line 1827)
   - `/pages/inventory/Bundles.tsx` (line 1736)
   - `/pages/warehouse/InboundOutbound.tsx` (line 1755)

---

**Need Help?**
- Check the main documentation: `/docs/TableToolbarOptionsMenu-Guidelines.md`
- Review usage examples in existing pages
- Search for `TableToolbarOptionsMenu` in the codebase for more examples

---

**Last Updated:** January 17, 2026  
**Component Version:** 1.0.0
