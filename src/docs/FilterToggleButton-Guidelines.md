# FilterToggleButton Component Guidelines

## Overview

The `FilterToggleButton` is a standardized, reusable button component for toggling filter panels across the ERP application. It displays an active filter count badge and changes appearance based on the filter panel's visibility state.

## Component Location

**File:** `/components/ui/FilterToggleButton.tsx`

## When to Use

- **Data table pages** with collapsible filter panels
- **List views** requiring filter controls (Item Master, Purchase Orders, Sales Orders, etc.)
- **Dashboard pages** with filterable data grids
- Any page with a toggleable filter section that needs to show active filter count

## When NOT to Use

- **Dropdown filter selects** (use `StyledSelect` instead)
- **Inline filter fields** (use `StyledTextField` with search icon)
- **Permanent filter sections** (not toggleable)
- **Single filter dropdowns** without a panel (use individual filter components)

---

## Basic Usage

### Import

```tsx
import { FilterToggleButton } from '../../components/ui/FilterToggleButton';
```

### Simple Example

```tsx
function ProductList() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Calculate active filter count
  const activeFilterCount = [selectedCategory, selectedStatus].filter(Boolean).length;
  
  return (
    <div>
      <FilterToggleButton
        isActive={showFilters}
        onClick={() => setShowFilters(!showFilters)}
        activeCount={activeFilterCount}
      />
      
      {showFilters && (
        <div className="filter-panel">
          {/* Filter controls */}
        </div>
      )}
    </div>
  );
}
```

---

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isActive` | `boolean` | ✅ Yes | - | Controls button appearance (secondary when true, outline when false) |
| `onClick` | `() => void` | ✅ Yes | - | Handler function called when button is clicked |
| `activeCount` | `number` | ❌ No | `0` | Number of active filters. Badge only shows if > 0 |
| `label` | `string` | ❌ No | `"Filters"` | Custom button label text |
| `icon` | `ReactNode` | ❌ No | `<Filter />` | Custom icon (defaults to Filter icon from lucide-react) |
| `className` | `string` | ❌ No | `''` | Additional CSS classes for customization |

---

## Examples

### 1. Default Usage (Most Common)

```tsx
<FilterToggleButton
  isActive={showFilters}
  onClick={() => setShowFilters(!showFilters)}
  activeCount={activeFilterCount}
/>
```

**Result:**
- Button labeled "Filters"
- Filter icon on the left
- Purple badge showing count when filters are active
- Appearance changes when `isActive` is true

---

### 2. Custom Label

```tsx
<FilterToggleButton
  isActive={showAdvancedFilters}
  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
  activeCount={advancedFilterCount}
  label="Advanced Filters"
/>
```

**Result:**
- Button labeled "Advanced Filters" instead of default "Filters"

---

### 3. Custom Icon

```tsx
import { Sliders } from 'lucide-react';

<FilterToggleButton
  isActive={showFilters}
  onClick={() => setShowFilters(!showFilters)}
  activeCount={activeFilterCount}
  icon={<Sliders className="w-4 h-4" />}
/>
```

**Result:**
- Uses Sliders icon instead of default Filter icon

---

### 4. No Active Filters

```tsx
<FilterToggleButton
  isActive={showFilters}
  onClick={() => setShowFilters(!showFilters)}
  activeCount={0}
/>
```

**Result:**
- No badge shown (badge only appears when count > 0)

---

### 5. With Additional CSS Classes

```tsx
<FilterToggleButton
  isActive={showFilters}
  onClick={() => setShowFilters(!showFilters)}
  activeCount={activeFilterCount}
  className="ml-auto"
/>
```

**Result:**
- Button positioned with `margin-left: auto` (right-aligned in flex container)

---

## Active Filter Count Calculation

### Basic Pattern (Multiple Select Filters)

```tsx
const activeFilterCount = [
  selectedCategory,
  selectedStatus,
  selectedWarehouse
].filter(Boolean).length;
```

**Explanation:**
- Creates array of filter values
- `filter(Boolean)` removes empty strings, null, undefined
- `.length` counts remaining non-empty filters

---

### Advanced Pattern (Mixed Filter Types)

```tsx
const activeFilterCount = [
  selectedCategory,
  selectedStatus,
  searchTerm && 'search', // Only count if search term exists
  appliedDateRange ? 'date' : '', // Custom date range
  priceRange.min || priceRange.max ? 'price' : '' // Range filters
].filter(Boolean).length;
```

**Explanation:**
- Handles different filter types (text, date range, numeric range)
- Conditional counting based on filter state
- Returns meaningful count for badge display

---

## Complete Integration Example

### ItemMaster.tsx Pattern

```tsx
import { useState, useMemo } from 'react';
import { FilterToggleButton } from '../../components/ui/FilterToggleButton';
import { StyledSelect, MenuItem } from '../../components/ui/StyledSelect';

export function ItemMaster() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  
  // Calculate active filter count
  const activeFilterCount = [
    selectedCategory,
    selectedStatus,
    selectedSupplier
  ].filter(Boolean).length;
  
  return (
    <div>
      {/* Top toolbar with filter toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2>Item Master</h2>
        
        <div className="flex items-center gap-2">
          <FilterToggleButton
            isActive={showFilters}
            onClick={() => setShowFilters(!showFilters)}
            activeCount={activeFilterCount}
          />
        </div>
      </div>
      
      {/* Collapsible filter panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Category</label>
              <StyledSelect
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="furniture">Furniture</MenuItem>
              </StyledSelect>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Status</label>
              <StyledSelect
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </StyledSelect>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-2">Supplier</label>
              <StyledSelect
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <MenuItem value="">All Suppliers</MenuItem>
                <MenuItem value="supplier1">Supplier 1</MenuItem>
                <MenuItem value="supplier2">Supplier 2</MenuItem>
              </StyledSelect>
            </div>
          </div>
          
          {/* Clear filters button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedStatus('');
                setSelectedSupplier('');
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Data table */}
      <div>
        {/* Table content */}
      </div>
    </div>
  );
}
```

---

## Visual States

### 1. Inactive State (No Filters Applied, Panel Closed)

**Appearance:**
- Variant: `outline` (white background, gray border)
- Icon: Gray Filter icon
- Label: "Filters"
- Badge: Hidden

**CSS Classes:**
```tsx
// Applied by StyledButton when variant="outline"
bg-white border border-gray-300 text-gray-700 hover:bg-gray-50
```

---

### 2. Inactive State (Filters Applied, Panel Closed)

**Appearance:**
- Variant: `outline` (white background, gray border)
- Icon: Gray Filter icon
- Label: "Filters"
- Badge: **Visible** with purple background showing count

**Badge Styling:**
```tsx
px-2 py-0.5 text-xs rounded bg-[#5C1F3D] text-white border border-[#5C1F3D]
```

---

### 3. Active State (Panel Open, No Filters Applied)

**Appearance:**
- Variant: `secondary` (light gray background)
- Icon: Gray Filter icon
- Label: "Filters"
- Badge: Hidden

**CSS Classes:**
```tsx
// Applied by StyledButton when variant="secondary"
bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200
```

---

### 4. Active State (Panel Open, Filters Applied)

**Appearance:**
- Variant: `secondary` (light gray background)
- Icon: Gray Filter icon
- Label: "Filters"
- Badge: **Visible** with purple background showing count

**This is the most common "active" state** - panel is open and filters are applied.

---

## Design Specifications

### Button Properties (Inherited from StyledButton)

| Property | Value | Notes |
|----------|-------|-------|
| **Height** | `h-10` (40px) | Standard form element height |
| **Padding** | `px-4 py-2` | 16px horizontal, 8px vertical |
| **Border Radius** | `rounded-[3px]` | 3px radius |
| **Font Size** | `text-sm` (14px) | Standard button text |
| **Icon Size** | `w-4 h-4` (16x16px) | Standard icon size |
| **Icon Gap** | `gap-2` (8px) | Space between icon and label |
| **Transition** | `transition-colors` | Smooth color changes |

### Badge Properties

| Property | Value | Notes |
|----------|-------|-------|
| **Padding** | `px-2 py-0.5` | Compact padding |
| **Font Size** | `text-xs` (12px) | Smaller than button text |
| **Border Radius** | `rounded` | 4px radius (default rounded) |
| **Background** | `bg-[#5C1F3D]` | Primary purple color |
| **Text Color** | `text-white` | White text for contrast |
| **Border** | `border border-[#5C1F3D]` | Matches background |
| **Gap from Label** | `gap-2` (8px) | Space between "Filters" and badge |

### Color Specifications

| State | Background | Border | Text | Badge |
|-------|-----------|--------|------|-------|
| **Inactive (Outline)** | `bg-white` | `border-gray-300` | `text-gray-700` | `bg-[#5C1F3D]` (if count > 0) |
| **Active (Secondary)** | `bg-gray-100` | `border-gray-300` | `text-gray-700` | `bg-[#5C1F3D]` (if count > 0) |
| **Hover (Outline)** | `bg-gray-50` | `border-gray-300` | `text-gray-700` | N/A |
| **Hover (Secondary)** | `bg-gray-200` | `border-gray-300` | `text-gray-700` | N/A |

---

## Behavior & Interactions

### Click Behavior

1. **User clicks button**
2. `onClick` handler is triggered
3. Parent component toggles `isActive` state
4. Button appearance changes (outline ↔ secondary)
5. Filter panel shows/hides based on state

### Badge Behavior

1. **Badge only appears when `activeCount > 0`**
2. **Count updates automatically** when filters change
3. **Badge persists** when panel is open or closed (as long as count > 0)
4. **Badge disappears** when all filters are cleared (count = 0)

### Keyboard Accessibility

- **Tab**: Focus on button
- **Enter/Space**: Trigger onClick (toggle panel)
- **Focus visible**: Purple ring (`focus:ring-2 focus:ring-[#5C1F3D]`)

---

## Best Practices

### ✅ DO

- **Always calculate `activeFilterCount` dynamically** based on current filter state
- **Use `.filter(Boolean).length`** pattern for counting non-empty filters
- **Place button in top toolbar** near search and other controls
- **Keep label short** ("Filters", "Advanced Filters")
- **Use with collapsible filter panels** for clean UX
- **Include "Clear All Filters" button** in filter panel for easy reset

### ❌ DON'T

- **Don't hardcode filter count** - always calculate dynamically
- **Don't use for permanent filter sections** - only for toggleable panels
- **Don't put inside the filter panel itself** - keep in toolbar
- **Don't forget to update count** when filters change
- **Don't use very long labels** - keep it concise
- **Don't nest filter toggle inside dropdown menus** - make it prominent

---

## Common Use Cases

### 1. Item Master / Product Catalog

```tsx
// Filters: Category, Status, Supplier, Stock Level
const activeFilterCount = [
  selectedCategory,
  selectedStatus,
  selectedSupplier,
  selectedStockLevel
].filter(Boolean).length;
```

### 2. Purchase Orders

```tsx
// Filters: Vendor, Status, Date Range
const activeFilterCount = [
  selectedVendor,
  selectedStatus,
  appliedDateRange ? 'date' : ''
].filter(Boolean).length;
```

### 3. Sales Orders

```tsx
// Filters: Customer, Status, Payment Status, Date Range
const activeFilterCount = [
  selectedCustomer,
  selectedStatus,
  selectedPaymentStatus,
  appliedDateRange ? 'date' : ''
].filter(Boolean).length;
```

### 4. Invoices

```tsx
// Filters: Customer, Status, Due Status, Date Range, Amount Range
const activeFilterCount = [
  selectedCustomer,
  selectedStatus,
  selectedDueStatus,
  appliedDateRange ? 'date' : '',
  amountRange.min || amountRange.max ? 'amount' : ''
].filter(Boolean).length;
```

---

## Integration with Other Components

### Works Well With:

1. **StyledSelect** - For filter dropdown controls
2. **StyledTextField** - For text/search filters
3. **Custom Date Range Picker** - For date filters
4. **DataGrid** - For filtered data tables
5. **PaginationBar** - For paginated filtered results
6. **MoreOptionsMenu** - For additional filter options

### Example Toolbar Layout

```tsx
<div className="flex items-center justify-between mb-4">
  {/* Left: Search */}
  <div className="flex-1 max-w-md">
    <StyledTextField
      placeholder="Search items..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
  
  {/* Right: Filter button and other controls */}
  <div className="flex items-center gap-2">
    <FilterToggleButton
      isActive={showFilters}
      onClick={() => setShowFilters(!showFilters)}
      activeCount={activeFilterCount}
    />
    <MoreOptionsMenu items={[...]} />
  </div>
</div>
```

---

## Accessibility

### ARIA Attributes

The component inherits accessibility from `StyledButton`:

- **Focus Visible**: `focus:ring-2 focus:ring-[#5C1F3D]`
- **Keyboard Navigation**: Tab, Enter, Space
- **Screen Reader**: Button role and label are announced

### Recommended Enhancements

For better accessibility, consider adding:

```tsx
<FilterToggleButton
  isActive={showFilters}
  onClick={() => setShowFilters(!showFilters)}
  activeCount={activeFilterCount}
  aria-label={`Toggle filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
  aria-expanded={showFilters}
/>
```

---

## Troubleshooting

### Issue: Badge doesn't appear

**Cause**: `activeCount` is 0, undefined, or not passed  
**Solution**: Ensure `activeCount` is calculated correctly and passed to component

```tsx
// ✅ Correct
const activeFilterCount = [selectedCategory, selectedStatus].filter(Boolean).length;
<FilterToggleButton activeCount={activeFilterCount} ... />

// ❌ Incorrect
<FilterToggleButton activeCount={0} ... /> // Badge won't show
```

---

### Issue: Button doesn't change appearance

**Cause**: `isActive` prop not toggling  
**Solution**: Ensure state is being updated in `onClick` handler

```tsx
// ✅ Correct
<FilterToggleButton
  isActive={showFilters}
  onClick={() => setShowFilters(!showFilters)} // Toggles state
/>

// ❌ Incorrect
<FilterToggleButton
  isActive={showFilters}
  onClick={() => console.log('clicked')} // Doesn't update state
/>
```

---

### Issue: Count doesn't update when filters change

**Cause**: Active count calculation not in sync with filter state  
**Solution**: Use `useMemo` or ensure count is recalculated on every render

```tsx
// ✅ Correct - recalculates on every render
const activeFilterCount = [
  selectedCategory,
  selectedStatus
].filter(Boolean).length;

// ✅ Also correct - with useMemo
const activeFilterCount = useMemo(() => {
  return [selectedCategory, selectedStatus].filter(Boolean).length;
}, [selectedCategory, selectedStatus]);
```

---

## Related Components

- **StyledButton** - Base button component used internally
- **StyledSelect** - For filter dropdown controls
- **StyledTextField** - For search/text filters
- **MoreOptionsMenu** - Additional options menu
- **DataGrid** - Data table with built-in filtering

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2024 | Initial release with basic functionality |

---

## Examples in Production

**Current Usage:**
- `/pages/inventory/ItemMaster.tsx` - Item list filtering
- (Ready for use in other modules)

**Recommended for:**
- Purchase Orders listing
- Sales Orders listing
- Invoices listing
- Customers/Vendors listing
- All data grid pages with filters
