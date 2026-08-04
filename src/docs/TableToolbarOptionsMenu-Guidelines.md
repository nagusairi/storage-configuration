# TableToolbarOptionsMenu Component - Complete Documentation

> **Location:** `/components/ui/TableToolbarOptionsMenu.tsx`  
> **Type:** Reusable UI Component  
> **Category:** Table Toolbars & Menus  
> **Last Updated:** January 2026

---

## Overview

The **TableToolbarOptionsMenu** is a reusable three-dot vertical menu button (`MoreVertical` icon) with a dropdown that provides quick access to common table operations:
- **Filters** - Toggle filter panel visibility
- **Density** - Open density settings menu (compact/standard/comfortable)
- **Columns** - Open column visibility selector
- **Export** - Trigger data export functionality

This component standardizes the "More Options" menu pattern across all data tables in the ERP application.

---

## When to Use

✅ **Use this component when:**
- You have a data table/grid with multiple toolbar actions
- You need to provide access to Filters, Density, Columns, or Export options
- You want to reduce toolbar clutter by grouping secondary actions
- You need a consistent "More Options" menu across different table views
- You want to add custom menu items alongside standard table options

❌ **Do NOT use this component when:**
- You only have 1-2 primary actions (use dedicated buttons instead)
- The actions are critical and should be immediately visible (don't hide them in a menu)
- You need a completely custom menu structure (consider `RecordDropdownMenu` instead)
- The menu is not related to table toolbar operations

---

## Props API Reference

### TableToolbarOptionsMenuProps

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `onToggleFilters` | `() => void` | `undefined` | No | Callback when "Filters" menu item is clicked. If provided, Filters option will be visible. |
| `onToggleDensity` | `() => void` | `undefined` | No | Callback when "Density" menu item is clicked. If provided, Density option will be visible. |
| `onToggleColumns` | `() => void` | `undefined` | No | Callback when "Columns" menu item is clicked. If provided, Columns option will be visible. |
| `onExport` | `() => void` | `undefined` | No | Callback when "Export" menu item is clicked. If provided, Export option will be visible. |
| `showFiltersOption` | `boolean` | `true` | No | Whether to show the Filters menu item (only if `onToggleFilters` is provided). |
| `showDensityOption` | `boolean` | `true` | No | Whether to show the Density menu item (only if `onToggleDensity` is provided). |
| `showColumnsOption` | `boolean` | `true` | No | Whether to show the Columns menu item (only if `onToggleColumns` is provided). |
| `showExportOption` | `boolean` | `true` | No | Whether to show the Export menu item (only if `onExport` is provided). |
| `customMenuItems` | `TableToolbarOptionsMenuItem[]` | `[]` | No | Custom menu items to append after the default options. |
| `className` | `string` | `''` | No | Additional CSS classes for the trigger button. |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | No | Size variant for the trigger button. |

### TableToolbarOptionsMenuItem Interface

```typescript
export interface TableToolbarOptionsMenuItem {
  id: string;           // Unique identifier for the menu item
  label: string;        // Display text for the menu item
  icon: ReactNode;      // Icon component (Lucide icon recommended)
  onClick: () => void;  // Click handler function
  divider?: boolean;    // Whether to show a top border divider
  visible?: boolean;    // Whether the item should be displayed
}
```

---

## Visual Design Specifications

### Trigger Button

| Property | Value | Notes |
|----------|-------|-------|
| **Icon** | `MoreVertical` from lucide-react | Three vertical dots |
| **Icon Size (Small)** | `w-3.5 h-3.5` (14px) | For `size="small"` |
| **Icon Size (Default)** | `w-4 h-4` (16px) | For `size="default"` |
| **Icon Size (Large)** | `w-5 h-5` (20px) | For `size="large"` |
| **Icon Color** | `text-gray-600` | Dark gray |
| **Button Padding (Small)** | `p-1.5` (6px) | For `size="small"` |
| **Button Padding (Default)** | `p-2` (8px) | For `size="default"` |
| **Button Padding (Large)** | `p-2.5` (10px) | For `size="large"` |
| **Button Height (Small)** | `h-8` (32px) | For `size="small"` |
| **Button Height (Default)** | `h-10` (40px) | For `size="default"` |
| **Button Height (Large)** | `h-12` (48px) | For `size="large"` |
| **Border** | `border border-gray-300` | 1px solid gray border |
| **Border Radius** | `rounded` (4px) | Tailwind default rounded |
| **Background (Default)** | Transparent | No background color |
| **Background (Hover)** | `bg-gray-100` | Light gray |
| **Transition** | `transition-colors` | Smooth color transition |
| **Cursor** | `cursor-pointer` | Pointer on hover |

### Dropdown Menu Container

| Property | Value | Notes |
|----------|-------|-------|
| **Position** | `absolute right-0 top-full` | Aligned to right edge of trigger |
| **Top Offset** | `mt-1` (4px) | Gap between trigger and menu |
| **Width** | `w-48` (192px) | Fixed width |
| **Background** | `bg-white` | White background |
| **Border** | `border border-gray-200` | 1px solid light gray |
| **Border Radius** | `rounded-lg` (8px) | Rounded corners |
| **Shadow** | `shadow-lg` | Large elevation shadow |
| **Z-Index** | `z-50` | Above other content |

### Menu Items

| Property | Value | Notes |
|----------|-------|-------|
| **Width** | `w-full` (100%) | Full width of container |
| **Padding** | `px-4 py-2.5` | 16px horizontal, 10px vertical |
| **Text Size** | `text-sm` (14px) | Standard text size |
| **Text Color** | `text-gray-700` | Dark gray |
| **Background (Default)** | Transparent | No background |
| **Background (Hover)** | `bg-gray-50` | Light gray |
| **Layout** | `flex items-center gap-2` | Horizontal flex with 8px gap |
| **Text Alignment** | `text-left` | Left-aligned text |
| **Transition** | `transition-colors` | Smooth color transition |
| **Cursor** | `cursor-pointer` | Pointer on hover |
| **First Item Radius** | `rounded-t-lg` (8px top) | Matches container |
| **Last Item Radius** | `rounded-b-lg` (8px bottom) | Matches container |

### Menu Item Dividers

| Property | Value | Notes |
|----------|-------|-------|
| **Border** | `border-t border-gray-100` | 1px top border |
| **Color** | `border-gray-100` | Very light gray |
| **Applied When** | `divider: true` | Controlled by item config |

### Menu Item Icons

| Property | Value | Notes |
|----------|-------|-------|
| **Size (Small)** | `w-3.5 h-3.5` (14px) | For `size="small"` |
| **Size (Default)** | `w-4 h-4` (16px) | For `size="default"` |
| **Size (Large)** | `w-5 h-5` (20px) | For `size="large"` |
| **Color** | `text-gray-500` | Medium gray |
| **Gap from Label** | `gap-2` (8px) | Horizontal gap |

### Backdrop (Click-Outside-to-Close)

| Property | Value | Notes |
|----------|-------|-------|
| **Position** | `fixed inset-0` | Covers entire viewport |
| **Z-Index** | `z-40` | Below menu, above content |
| **Background** | Transparent | Invisible overlay |
| **Cursor** | `cursor-default` | Default cursor |
| **Purpose** | Captures outside clicks | Closes menu |

---

## Interactive States

### Trigger Button States

| State | Background | Border | Icon Color | Cursor | Transition |
|-------|-----------|--------|------------|--------|------------|
| **Default** | Transparent | `border-gray-300` | `text-gray-600` | `pointer` | - |
| **Hover** | `bg-gray-100` | `border-gray-300` | `text-gray-600` | `pointer` | 150ms |
| **Active (Menu Open)** | Transparent | `border-gray-300` | `text-gray-600` | `pointer` | - |
| **Focus** | Browser default | `border-gray-300` | `text-gray-600` | `pointer` | - |

### Menu Item States

| State | Background | Text Color | Icon Color | Cursor |
|-------|-----------|------------|------------|--------|
| **Default** | Transparent | `text-gray-700` | `text-gray-500` | `pointer` |
| **Hover** | `bg-gray-50` | `text-gray-700` | `text-gray-500` | `pointer` |
| **Active (Clicked)** | `bg-gray-50` | `text-gray-700` | `text-gray-500` | `pointer` |

---

## Default Menu Structure

The component provides 4 default menu items (order matters):

1. **Filters** (`id: 'filters'`)
   - Icon: `<Filter />` from lucide-react
   - Label: "Filters"
   - Callback: `onToggleFilters`
   - Divider: None

2. **Density** (`id: 'density'`)
   - Icon: `<AlignJustify />` from lucide-react
   - Label: "Density"
   - Callback: `onToggleDensity`
   - Divider: Top border if Filters is visible

3. **Columns** (`id: 'columns'`)
   - Icon: `<Columns />` from lucide-react
   - Label: "Columns"
   - Callback: `onToggleColumns`
   - Divider: Top border if Filters or Density is visible

4. **Export** (`id: 'export'`)
   - Icon: `<Download />` from lucide-react
   - Label: "Export"
   - Callback: `onExport`
   - Divider: Top border if any previous item is visible

**Note:** Menu items are only displayed if:
1. The corresponding callback is provided (e.g., `onToggleFilters`)
2. AND the corresponding `show*Option` prop is `true` (default)

---

## Behavior & Interactions

### Opening/Closing Menu

| Action | Behavior |
|--------|----------|
| **Click trigger button** | Toggle menu open/closed |
| **Click outside menu** | Close menu |
| **Click backdrop** | Close menu |
| **Click menu item** | Execute callback, then close menu |
| **Press Escape** | Not implemented (can be added) |

### Menu Positioning

- **Horizontal:** Aligned to the **right edge** of the trigger button
- **Vertical:** Opens **downward** from the trigger button (4px gap)
- **Overflow:** If menu extends beyond viewport, it will clip (no automatic repositioning)
- **Z-Index:** Menu (`z-50`) appears above backdrop (`z-40`)

### Click Propagation

- Backdrop clicks are captured and do NOT propagate to parent elements
- Menu item clicks close the menu first, then execute the callback
- Trigger button clicks toggle the menu state

---

## Usage Examples

### Basic Usage (All Default Options)

```tsx
import { TableToolbarOptionsMenu } from '../../components/ui/TableToolbarOptionsMenu';

function ProductTable() {
  const [showFilters, setShowFilters] = useState(false);
  const [showDensityMenu, setShowDensityMenu] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const handleExport = () => {
    console.log('Exporting data...');
    // Export logic here
  };

  return (
    <div className="flex items-center gap-2">
      <TableToolbarOptionsMenu
        onToggleFilters={() => setShowFilters(!showFilters)}
        onToggleDensity={() => setShowDensityMenu(true)}
        onToggleColumns={() => setShowColumnSelector(true)}
        onExport={handleExport}
      />
    </div>
  );
}
```

### Small Size Variant (Compact Toolbars)

```tsx
<TableToolbarOptionsMenu
  size="small"
  onToggleFilters={() => setShowFilters(!showFilters)}
  onToggleDensity={() => setShowDensityMenu(true)}
  onToggleColumns={() => setShowColumnSelector(true)}
  onExport={handleExport}
/>
```

### Large Size Variant (High-Density Displays)

```tsx
<TableToolbarOptionsMenu
  size="large"
  onToggleFilters={() => setShowFilters(!showFilters)}
  onToggleDensity={() => setShowDensityMenu(true)}
  onToggleColumns={() => setShowColumnSelector(true)}
  onExport={handleExport}
/>
```

### Only Filters and Export (Hide Density & Columns)

```tsx
<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={handleExport}
  showDensityOption={false}
  showColumnsOption={false}
/>
```

**Note:** You can also omit the callbacks entirely:

```tsx
<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={handleExport}
  // onToggleDensity and onToggleColumns not provided = not visible
/>
```

### With Custom Menu Items

```tsx
import { Share2, Printer } from 'lucide-react';

const customItems: TableToolbarOptionsMenuItem[] = [
  {
    id: 'share',
    label: 'Share',
    icon: <Share2 className="w-4 h-4 text-gray-500" />,
    onClick: () => console.log('Share clicked'),
    divider: true // Add divider above this item
  },
  {
    id: 'print',
    label: 'Print',
    icon: <Printer className="w-4 h-4 text-gray-500" />,
    onClick: () => window.print(),
    visible: true // Explicitly control visibility
  }
];

<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onToggleDensity={() => setShowDensityMenu(true)}
  onToggleColumns={() => setShowColumnSelector(true)}
  onExport={handleExport}
  customMenuItems={customItems}
/>
```

### With Custom CSS Classes

```tsx
<TableToolbarOptionsMenu
  className="ml-auto border-2 border-blue-500"
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={handleExport}
/>
```

### Conditional Visibility Based on User Permissions

```tsx
const hasExportPermission = user.permissions.includes('export');
const hasColumnControlPermission = user.permissions.includes('columns');

<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onToggleDensity={() => setShowDensityMenu(true)}
  onToggleColumns={hasColumnControlPermission ? () => setShowColumnSelector(true) : undefined}
  onExport={hasExportPermission ? handleExport : undefined}
/>
```

---

## Integration Patterns

### In DataGrid Component (Recommended)

```tsx
import { DataGrid } from '../../components/ui/DataGrid';

function ProductList() {
  return (
    <DataGrid
      data={products}
      columns={columns}
      rowKey="id"
      // DataGrid automatically renders TableToolbarOptionsMenu internally
      searchEnabled
      filters={filters}
    />
  );
}
```

### In Custom Table Toolbar

```tsx
function CustomTableToolbar() {
  return (
    <div className="flex items-center justify-between mb-4">
      {/* Left side - Search */}
      <div className="flex items-center gap-2">
        <StyledTextField
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        <FilterToggleButton
          activeFilterCount={activeFilterCount}
          onClick={() => setShowFilters(!showFilters)}
        />
        
        <StyledButton variant="primary" onClick={() => navigate('/items/new')}>
          <Plus className="w-4 h-4" />
          Add Item
        </StyledButton>
        
        <TableToolbarOptionsMenu
          onToggleFilters={() => setShowFilters(!showFilters)}
          onToggleDensity={() => setShowDensityMenu(true)}
          onToggleColumns={() => setShowColumnSelector(true)}
          onExport={handleExport}
        />
      </div>
    </div>
  );
}
```

### In Module Pages

```tsx
// In ItemMaster.tsx
<div className="flex items-center gap-2">
  <FilterToggleButton
    activeFilterCount={activeFilterCount}
    onClick={() => setShowFilters(!showFilters)}
  />
  
  <TableToolbarOptionsMenu
    onToggleFilters={() => setShowFilters(!showFilters)}
    onToggleDensity={() => setShowDensityMenu(true)}
    onToggleColumns={() => setShowColumnSelector(true)}
    onExport={() => {
      // Export logic
      const csv = convertToCSV(filteredData);
      downloadFile(csv, 'items.csv');
    }}
  />
</div>
```

---

## Common Patterns

### Pattern 1: Toggle Boolean State (Filters, Column Selector)

```tsx
const [showFilters, setShowFilters] = useState(false);

<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  // ... other props
/>

{showFilters && (
  <FilterPanel onClose={() => setShowFilters(false)} />
)}
```

### Pattern 2: Trigger Modal/Drawer (Density, Columns)

```tsx
const [showDensityModal, setShowDensityModal] = useState(false);

<TableToolbarOptionsMenu
  onToggleDensity={() => setShowDensityModal(true)}
  // ... other props
/>

{showDensityModal && (
  <DensityModal
    onClose={() => setShowDensityModal(false)}
    onSelect={(density) => {
      setTableDensity(density);
      setShowDensityModal(false);
    }}
  />
)}
```

### Pattern 3: Direct Action (Export)

```tsx
const handleExport = () => {
  const csv = generateCSV(filteredData);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'data.csv';
  link.click();
  URL.revokeObjectURL(url);
};

<TableToolbarOptionsMenu
  onExport={handleExport}
  // ... other props
/>
```

### Pattern 4: Custom Menu Items for Bulk Actions

```tsx
const customItems: TableToolbarOptionsMenuItem[] = [
  {
    id: 'bulk-edit',
    label: 'Bulk Edit',
    icon: <Edit className="w-4 h-4 text-gray-500" />,
    onClick: () => setBulkEditMode(true),
    divider: true,
    visible: selectedRows.length > 0 // Only show if rows are selected
  },
  {
    id: 'bulk-delete',
    label: 'Bulk Delete',
    icon: <Trash2 className="w-4 h-4 text-red-500" />,
    onClick: () => handleBulkDelete(selectedRows),
    visible: selectedRows.length > 0
  }
];

<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={handleExport}
  customMenuItems={customItems}
/>
```

---

## Accessibility

### ARIA Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `aria-label` | `"More options"` | Describes the trigger button |
| `aria-expanded` | `true` / `false` | Indicates menu open/closed state |
| `aria-haspopup` | `true` | Indicates button opens a popup menu |
| `aria-hidden` | `true` | Applied to backdrop (not read by screen readers) |

### Keyboard Navigation

| Key | Action | Status |
|-----|--------|--------|
| **Tab** | Navigate to trigger button | ✅ Supported |
| **Enter/Space** | Toggle menu open/closed | ✅ Supported (browser default) |
| **Escape** | Close menu | ❌ Not implemented |
| **Arrow Down/Up** | Navigate menu items | ❌ Not implemented |

**Note:** Full keyboard navigation (Escape, Arrow keys) can be added in future updates if needed.

### Screen Reader Support

- Trigger button is properly labeled as "More options"
- Menu open/closed state is announced via `aria-expanded`
- Menu items are standard buttons with text labels (no icon-only)
- Dividers do not interfere with navigation

---

## Design Tokens Reference

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| **Border (Default)** | `border-gray-300` (#D1D5DB) | Trigger button border |
| **Border (Light)** | `border-gray-200` (#E5E7EB) | Menu container border |
| **Border (Divider)** | `border-gray-100` (#F3F4F6) | Menu item dividers |
| **Text (Primary)** | `text-gray-700` (#374151) | Menu item labels |
| **Text (Icon)** | `text-gray-600` (#4B5563) | Trigger button icon |
| **Text (Icon Light)** | `text-gray-500` (#6B7280) | Menu item icons |
| **Background (Hover)** | `bg-gray-100` (#F3F4F6) | Trigger button hover |
| **Background (Item Hover)** | `bg-gray-50` (#F9FAFB) | Menu item hover |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| **Button Padding (Small)** | `p-1.5` (6px) | Small size trigger |
| **Button Padding (Default)** | `p-2` (8px) | Default size trigger |
| **Button Padding (Large)** | `p-2.5` (10px) | Large size trigger |
| **Menu Item Padding** | `px-4 py-2.5` (16px, 10px) | Menu items |
| **Menu Top Offset** | `mt-1` (4px) | Gap between trigger and menu |
| **Icon-Label Gap** | `gap-2` (8px) | Gap in menu items |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| **Trigger Button** | `rounded` (4px) | Button corners |
| **Menu Container** | `rounded-lg` (8px) | Container corners |
| **First Menu Item** | `rounded-t-lg` (8px top) | Top corners |
| **Last Menu Item** | `rounded-b-lg` (8px bottom) | Bottom corners |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| **Menu Shadow** | `shadow-lg` | Menu dropdown elevation |

---

## Best Practices

### ✅ Do's

- **Always provide at least 2 menu options** (otherwise use a dedicated button)
- **Use descriptive callback names** (e.g., `onToggleFilters` instead of `onClick`)
- **Handle state updates in parent component** (keep component stateless except for menu open/close)
- **Provide all 4 default callbacks** for consistent UX across tables
- **Use custom menu items** for table-specific actions (Share, Print, etc.)
- **Disable menu items conditionally** by not providing the callback or setting `visible: false`
- **Test keyboard navigation** and screen reader compatibility
- **Position in the right section** of table toolbars (typically far right)

### ❌ Don'ts

- **Don't hide critical primary actions** in the menu (use dedicated buttons instead)
- **Don't add too many custom menu items** (max 3-4 recommended)
- **Don't use for non-table actions** (use appropriate menu components instead)
- **Don't remove default menu items** without good reason (users expect Filters, Columns, Export)
- **Don't forget to implement the callbacks** (provide functional handlers, not empty functions)
- **Don't override essential styles** (maintain visual consistency)

---

## Troubleshooting

### Menu doesn't open when clicking trigger button

**Possible Causes:**
- State is not updating (`showMenu` is not toggling)
- Click event is being prevented by parent container

**Solution:**
```tsx
// Ensure state is managed internally (component handles this)
// If using controlled mode, verify state updates:
const [showMenu, setShowMenu] = useState(false);
```

### Menu is cut off at viewport edge

**Possible Causes:**
- Parent container has `overflow: hidden`
- Menu is positioned absolutely within a scrollable container

**Solution:**
```tsx
// Ensure parent doesn't clip overflow
<div className="relative overflow-visible">
  <TableToolbarOptionsMenu {...props} />
</div>
```

### Menu items are not clickable

**Possible Causes:**
- Z-index issue (menu is behind other elements)
- Backdrop is capturing all clicks

**Solution:**
- Verify menu `z-50` is higher than surrounding elements
- Check that backdrop is `z-40` (lower than menu)

### Custom menu items not showing

**Possible Causes:**
- `visible: false` in menu item config
- Icon component not imported correctly

**Solution:**
```tsx
const customItems: TableToolbarOptionsMenuItem[] = [
  {
    id: 'custom',
    label: 'Custom Action',
    icon: <CustomIcon className="w-4 h-4 text-gray-500" />, // ✅ Correct
    onClick: handleCustom,
    visible: true // ✅ Explicitly set to true
  }
];
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| **1.0.0** | January 2026 | Initial comprehensive documentation |

---

## Related Components

- **FilterToggleButton** - Dedicated filter toggle with active count badge
- **PaginationBar** - Standardized pagination controls
- **RecordDropdownMenu** - Row-level action menus for table rows
- **MoreOptionsMenu** - Legacy more options menu (being phased out)
- **DataGrid** - Complete data table component (includes this menu internally)

---

## Support & Questions

For questions, issues, or feature requests related to this component:
1. Check this documentation first
2. Review usage examples in:
   - `/pages/inventory/ItemMaster.tsx` (line 1827)
   - `/pages/inventory/Bundles.tsx` (line 1736)
   - `/pages/warehouse/InboundOutbound.tsx` (line 1755)
3. Consult `/docs/DataGrid-Component-Guidelines.md` for DataGrid integration
4. Refer to ERP Design Guidelines for global design patterns

---

**Last Updated:** January 17, 2026  
**Maintained By:** ERP Development Team  
**Component Status:** ✅ Stable & Production-Ready
