# TableToolbarOptionsMenu Component Guidelines

**Component Name:** `TableToolbarOptionsMenu`  
**Location:** `/components/ui/TableToolbarOptionsMenu.tsx`  
**Version:** 1.0.0  
**Last Updated:** January 2, 2026

---

## Overview

The **TableToolbarOptionsMenu** component is a reusable three-dot vertical menu button designed for table toolbars. It provides a dropdown menu with quick access to common table actions such as toggling filters, adjusting density, managing column visibility, and exporting data.

### Key Features

- ✅ Three-dot vertical menu button (MoreVertical icon)
- ✅ Dropdown menu with built-in options: Filters, Density, Columns, Export
- ✅ Customizable menu items support
- ✅ Click-outside-to-close functionality
- ✅ Hover states and smooth transitions
- ✅ Three size variants: small, default, large
- ✅ Full TypeScript support
- ✅ Accessibility features (ARIA labels)
- ✅ Consistent with ERP design system

---

## When to Use

### ✅ Use TableToolbarOptionsMenu when:

- You need a table toolbar with multiple action options
- You want to provide quick access to filters, density, columns, and export
- You have limited toolbar space and need to consolidate actions
- You want consistent menu behavior across multiple tables
- You need a standardized "more options" pattern

### ❌ Don't use TableToolbarOptionsMenu when:

- You only have 1-2 actions (use individual buttons instead)
- Actions are primary and should be immediately visible
- You're building a mobile-first interface (consider bottom sheet or drawer)
- Actions require immediate visual feedback (use toggle buttons)

---

## Installation & Import

```tsx
import { TableToolbarOptionsMenu } from '../../components/ui/TableToolbarOptionsMenu';
```

---

## Basic Usage

### Minimal Example

```tsx
<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onToggleDensity={() => setShowDensityMenu(true)}
  onToggleColumns={() => setShowColumnSelector(true)}
  onExport={() => handleExport()}
/>
```

### With Selective Options

```tsx
{/* Only show Filters and Export */}
<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={() => handleExport()}
  showDensityOption={false}
  showColumnsOption={false}
/>
```

### With Custom Menu Items

```tsx
<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onToggleDensity={() => setShowDensityMenu(true)}
  onToggleColumns={() => setShowColumnSelector(true)}
  onExport={() => handleExport()}
  customMenuItems={[
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: <RefreshCw className="w-4 h-4 text-gray-500" />,
      onClick: () => handleRefresh(),
      divider: true
    },
    {
      id: 'settings',
      label: 'Table Settings',
      icon: <Settings className="w-4 h-4 text-gray-500" />,
      onClick: () => openSettings()
    }
  ]}
/>
```

### Different Sizes

```tsx
{/* Small size - compact toolbars */}
<TableToolbarOptionsMenu
  size="small"
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={() => handleExport()}
/>

{/* Default size - standard toolbars */}
<TableToolbarOptionsMenu
  size="default"
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={() => handleExport()}
/>

{/* Large size - prominent toolbars */}
<TableToolbarOptionsMenu
  size="large"
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={() => handleExport()}
/>
```

---

## Props API

### TableToolbarOptionsMenuProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onToggleFilters` | `() => void` | `undefined` | Callback when Filters option is clicked |
| `onToggleDensity` | `() => void` | `undefined` | Callback when Density option is clicked |
| `onToggleColumns` | `() => void` | `undefined` | Callback when Columns option is clicked |
| `onExport` | `() => void` | `undefined` | Callback when Export option is clicked |
| `showFiltersOption` | `boolean` | `true` | Whether to show the Filters menu item |
| `showDensityOption` | `boolean` | `true` | Whether to show the Density menu item |
| `showColumnsOption` | `boolean` | `true` | Whether to show the Columns menu item |
| `showExportOption` | `boolean` | `true` | Whether to show the Export menu item |
| `customMenuItems` | `TableToolbarOptionsMenuItem[]` | `[]` | Custom menu items to append |
| `className` | `string` | `''` | Additional CSS classes for trigger button |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | Size variant for the trigger button |

### TableToolbarOptionsMenuItem Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | ✅ Yes | Unique identifier for the menu item |
| `label` | `string` | ✅ Yes | Display label for the menu item |
| `icon` | `ReactNode` | ✅ Yes | Icon element to display (lucide-react recommended) |
| `onClick` | `() => void` | ✅ Yes | Callback when menu item is clicked |
| `divider` | `boolean` | ❌ No | Whether to show a top border divider |
| `visible` | `boolean` | ❌ No | Whether the menu item should be visible |

---

## Design Specifications

### Trigger Button

| State | Background | Border | Icon Color | Hover |
|-------|-----------|--------|------------|-------|
| **Default** | Transparent | `border-gray-300` | `text-gray-600` | `bg-gray-100` |
| **Hover** | `bg-gray-100` | `border-gray-300` | `text-gray-600` | - |
| **Active (Menu Open)** | `bg-gray-100` | `border-gray-300` | `text-gray-600` | - |

**Button Dimensions:**
- **Small:** `h-8` (32px), padding `p-1.5`, icon `w-3.5 h-3.5`
- **Default:** `h-10` (40px), padding `p-2`, icon `w-4 h-4`
- **Large:** `h-12` (48px), padding `p-2.5`, icon `w-5 h-5`

**Border Radius:** `rounded` (4px)

### Dropdown Menu

| Property | Value | Notes |
|----------|-------|-------|
| **Width** | `w-48` (192px) | Fixed width for consistency |
| **Background** | `bg-white` | White background |
| **Border** | `border border-gray-200` | 1px gray border |
| **Border Radius** | `rounded-lg` (8px) | Rounded corners |
| **Shadow** | `shadow-lg` | Elevated appearance |
| **Z-Index** | `z-50` | Above backdrop (z-40) |
| **Position** | `absolute right-0 top-full mt-1` | Right-aligned, 4px below button |

### Menu Items

| State | Background | Text Color | Icon Color |
|-------|-----------|------------|------------|
| **Default** | `bg-white` | `text-gray-700` | `text-gray-500` |
| **Hover** | `bg-gray-50` | `text-gray-700` | `text-gray-500` |

**Menu Item Dimensions:**
- Padding: `px-4 py-2.5` (16px horizontal, 10px vertical)
- Font Size: `text-sm` (14px)
- Icon Size: Matches button size variant
- Gap: `gap-2` (8px between icon and label)

**Dividers:**
- Top border: `border-t border-gray-100`
- Only shown when `divider: true` on menu item

### Backdrop

| Property | Value | Notes |
|----------|-------|-------|
| **Position** | `fixed inset-0` | Covers entire viewport |
| **Z-Index** | `z-40` | Below menu (z-50), above content |
| **Background** | Transparent | Invisible but clickable |
| **Behavior** | Closes menu on click | Click-outside-to-close |

---

## Usage Examples

### Example 1: Item Master Table Toolbar

```tsx
import { useState } from 'react';
import { TableToolbarOptionsMenu } from '../../components/ui/TableToolbarOptionsMenu';
import { StyledTextField } from '../../components/ui/StyledTextField';

function ItemMasterToolbar() {
  const [showFilters, setShowFilters] = useState(false);
  const [showDensityMenu, setShowDensityMenu] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleExport = () => {
    // Export logic here
    console.log('Exporting data...');
  };
  
  return (
    <div className="flex items-center gap-2">
      <StyledTextField
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={<Search className="w-4 h-4" />}
        sx={{ width: '256px' }}
      />
      
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

### Example 2: Sales Orders Table with Custom Actions

```tsx
import { TableToolbarOptionsMenu } from '../../components/ui/TableToolbarOptionsMenu';
import { RefreshCw, Share2, Printer } from 'lucide-react';

function SalesOrdersToolbar() {
  return (
    <TableToolbarOptionsMenu
      onToggleFilters={() => setShowFilters(!showFilters)}
      onToggleColumns={() => setShowColumnSelector(true)}
      onExport={() => handleExport()}
      showDensityOption={false}
      customMenuItems={[
        {
          id: 'refresh',
          label: 'Refresh Orders',
          icon: <RefreshCw className="w-4 h-4 text-gray-500" />,
          onClick: () => fetchLatestOrders(),
          divider: true
        },
        {
          id: 'share',
          label: 'Share Report',
          icon: <Share2 className="w-4 h-4 text-gray-500" />,
          onClick: () => shareReport()
        },
        {
          id: 'print',
          label: 'Print View',
          icon: <Printer className="w-4 h-4 text-gray-500" />,
          onClick: () => window.print()
        }
      ]}
    />
  );
}
```

### Example 3: Compact Mobile Toolbar

```tsx
<TableToolbarOptionsMenu
  size="small"
  onToggleFilters={() => setShowFilters(!showFilters)}
  onExport={() => handleExport()}
  showDensityOption={false}
  showColumnsOption={false}
  className="md:hidden"
/>
```

### Example 4: Conditional Menu Items

```tsx
<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onToggleDensity={() => setShowDensityMenu(true)}
  onToggleColumns={() => setShowColumnSelector(true)}
  onExport={hasExportPermission ? () => handleExport() : undefined}
  showExportOption={hasExportPermission}
  customMenuItems={[
    {
      id: 'bulk-edit',
      label: 'Bulk Edit',
      icon: <Edit className="w-4 h-4 text-gray-500" />,
      onClick: () => enableBulkEdit(),
      visible: selectedRows.length > 0,
      divider: true
    }
  ]}
/>
```

---

## State Management

### Required State Variables

```tsx
const [showFilters, setShowFilters] = useState(false);
const [showDensityMenu, setShowDensityMenu] = useState(false);
const [showColumnSelector, setShowColumnSelector] = useState(false);
```

### Menu Open/Close State

The component manages its own internal state for the dropdown menu visibility. You don't need to manage this externally.

```tsx
// Internal state (managed by component)
const [showMenu, setShowMenu] = useState(false);
```

---

## Accessibility

### ARIA Attributes

- `aria-label="More options"` - Describes the button purpose
- `aria-expanded={showMenu}` - Indicates dropdown state
- `aria-haspopup="true"` - Indicates popup menu
- `aria-hidden="true"` - Hides backdrop from screen readers

### Keyboard Support

- **Tab:** Focus on trigger button
- **Enter/Space:** Open/close dropdown menu
- **Escape:** Close dropdown menu (requires custom implementation)
- **Tab (menu open):** Navigate through menu items

### Screen Reader Behavior

- Button announces as "More options, button, collapsed" when closed
- Button announces as "More options, button, expanded" when open
- Menu items announce with their labels and icon context

---

## Best Practices

### Do's ✅

- **Do** use for table toolbars with 3+ action options
- **Do** provide all callback functions for enabled options
- **Do** use consistent icon sizing (lucide-react icons)
- **Do** set `visible: false` for conditional custom menu items
- **Do** use dividers to group related actions
- **Do** match size variant to toolbar height
- **Do** provide clear, actionable labels

### Don'ts ❌

- **Don't** use when actions should be immediately visible
- **Don't** overcrowd the menu (max 6-8 items recommended)
- **Don't** use for primary actions (Save, Submit)
- **Don't** mix icon-only and icon+label menu items
- **Don't** forget to handle menu item callbacks
- **Don't** use on mobile without considering touch targets

---

## Styling Customization

### Custom CSS Classes

```tsx
<TableToolbarOptionsMenu
  className="ml-auto" // Right-align in toolbar
  onToggleFilters={() => setShowFilters(!showFilters)}
/>
```

### Custom Menu Item Styling

```tsx
customMenuItems={[
  {
    id: 'danger-action',
    label: 'Delete All',
    icon: <Trash2 className="w-4 h-4 text-red-500" />, // Red icon
    onClick: () => handleDeleteAll(),
    divider: true
  }
]}
```

---

## Integration with Existing Components

### With DataGrid Component

```tsx
import { DataGrid } from '../../components/ui/DataGrid';
import { TableToolbarOptionsMenu } from '../../components/ui/TableToolbarOptionsMenu';

function ProductTable() {
  return (
    <>
      {/* Custom Toolbar */}
      <div className="bg-white border-x border-t border-gray-300 px-4 py-3 flex items-center justify-between">
        <div>
          <h2>Products</h2>
        </div>
        <div className="flex items-center gap-2">
          <StyledTextField placeholder="Search..." />
          <TableToolbarOptionsMenu
            onToggleFilters={() => setShowFilters(!showFilters)}
            onExport={() => handleExport()}
          />
        </div>
      </div>
      
      {/* DataGrid */}
      <DataGrid
        data={products}
        columns={columns}
        hideToolbar={true} // Use custom toolbar above
        // ... other props
      />
    </>
  );
}
```

### With FilterToggleButton

```tsx
<div className="flex items-center gap-2">
  <FilterToggleButton
    showFilters={showFilters}
    onToggle={() => setShowFilters(!showFilters)}
    activeFilterCount={activeFilterCount}
  />
  
  <TableToolbarOptionsMenu
    onToggleDensity={() => setShowDensityMenu(true)}
    onToggleColumns={() => setShowColumnSelector(true)}
    onExport={() => handleExport()}
    showFiltersOption={false} // Handled by FilterToggleButton
  />
</div>
```

---

## Common Patterns

### Pattern 1: Standard Table Toolbar

```tsx
<div className="bg-white border-x border-t border-gray-300 px-4 py-3 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <StyledButton variant="primary" onClick={() => setShowAddModal(true)}>
      <Plus className="w-4 h-4" />
      <span>Add New</span>
    </StyledButton>
  </div>
  
  <div className="flex items-center gap-2">
    <StyledTextField placeholder="Search..." />
    <TableToolbarOptionsMenu
      onToggleFilters={() => setShowFilters(!showFilters)}
      onToggleDensity={() => setShowDensityMenu(true)}
      onToggleColumns={() => setShowColumnSelector(true)}
      onExport={() => handleExport()}
    />
  </div>
</div>
```

### Pattern 2: Minimal Toolbar (Mobile)

```tsx
<div className="flex items-center gap-2 justify-end p-3">
  <TableToolbarOptionsMenu
    size="small"
    onToggleFilters={() => setShowFilters(!showFilters)}
    onExport={() => handleExport()}
    showDensityOption={false}
    showColumnsOption={false}
  />
</div>
```

### Pattern 3: With Conditional Export

```tsx
<TableToolbarOptionsMenu
  onToggleFilters={() => setShowFilters(!showFilters)}
  onToggleDensity={() => setShowDensityMenu(true)}
  onToggleColumns={() => setShowColumnSelector(true)}
  onExport={hasExportPermission ? () => handleExport() : undefined}
  showExportOption={hasExportPermission}
/>
```

---

## Troubleshooting

### Issue: Menu doesn't close when clicking outside

**Solution:** Ensure the component is not inside another element with `stopPropagation()` or `preventDefault()`.

### Issue: Menu items not responding to clicks

**Solution:** Check that callback functions are properly defined and not undefined.

```tsx
// ❌ Wrong
<TableToolbarOptionsMenu
  onExport={handleExport} // handleExport is undefined
/>

// ✅ Correct
<TableToolbarOptionsMenu
  onExport={() => handleExport()} // handleExport is defined
/>
```

### Issue: Menu appears cut off at viewport edge

**Solution:** The menu is right-aligned by default. If you need left-alignment, modify the component or use a wrapper with custom positioning.

### Issue: Custom menu items not showing

**Solution:** Check the `visible` property. If `visible: false`, the item won't render.

```tsx
customMenuItems={[
  {
    id: 'action',
    label: 'Action',
    icon: <Icon />,
    onClick: () => {},
    visible: true // Ensure this is true or omit the property
  }
]}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-02 | Initial release with core functionality |

---

## Related Components

- **DataGrid** - Main data table component
- **FilterToggleButton** - Dedicated filter toggle button
- **PaginationBar** - Table pagination controls
- **StyledButton** - Standard button component
- **MoreOptionsMenu** - General purpose options menu (legacy)

---

## Future Enhancements

- [ ] Keyboard navigation (Escape to close)
- [ ] Custom dropdown width prop
- [ ] Position prop (left-aligned vs right-aligned)
- [ ] Animation variants (fade, slide)
- [ ] Nested submenu support
- [ ] Mobile-specific behavior (bottom sheet)
- [ ] Icon-only menu items option
- [ ] Custom trigger button content

---

## Support

For issues, questions, or feature requests, please contact the ERP development team or create an issue in the project repository.
