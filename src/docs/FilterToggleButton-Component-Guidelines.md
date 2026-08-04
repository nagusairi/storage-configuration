# FilterToggleButton Component Guidelines

## Overview

The **FilterToggleButton** is a standardized, reusable button component designed for toggling filter panels across all data tables and list views in the ERP application. It features an active filter count badge, multiple size variants, and full accessibility support.

**Component Location:** `/components/ui/FilterToggleButton.tsx`

---

## Table of Contents

1. [Visual Design](#visual-design)
2. [Props Reference](#props-reference)
3. [Usage Examples](#usage-examples)
4. [Size Variants](#size-variants)
5. [Badge Variants](#badge-variants)
6. [States](#states)
7. [Accessibility](#accessibility)
8. [Best Practices](#best-practices)
9. [Migration Guide](#migration-guide)

---

## Visual Design

### Design Specifications

| Property | Value | Notes |
|----------|-------|-------|
| **Height** | 33px | Consistent with all form elements |
| **Border Radius** | 3px | Standard ERP border radius |
| **Primary Color** | #5C1F3D | Deep purple/maroon |
| **Icon Size** | 16x16px (w-4 h-4) | From lucide-react |
| **Font Size** | 14px (text-sm) | Standard button text |
| **Padding** | px-4 py-2 | Horizontal: 16px, Vertical: 8px |

### Visual States

```
┌─────────────────────────────────────────┐
│  INACTIVE STATE (Outline Variant)      │
│  ┌───────────────────────────────────┐  │
│  │ [Filter Icon] Filters             │  │
│  └───────────────────────────────────┘  │
│  - Border: gray-300                     │
│  - Background: white                    │
│  - Text: gray-700                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ACTIVE STATE (Secondary Variant)       │
│  ┌───────────────────────────────────┐  │
│  │ [Filter Icon] Filters [3]         │  │
│  └───────────────────────────────────┘  │
│  - Border: gray-300                     │
│  - Background: gray-100                 │
│  - Badge: Primary color (#5C1F3D)      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  DISABLED STATE                         │
│  ┌───────────────────────────────────┐  │
│  │ [Filter Icon] Filters (grayed)    │  │
│  └───────────────────────────────────┘  │
│  - Opacity: 40%                         │
│  - Cursor: not-allowed                  │
│  - No pointer events                    │
└─────────────────────────────────────────┘
```

---

## Props Reference

### Core Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `isActive` | `boolean` | `false` | No | Whether the filter panel is currently shown |
| `onClick` | `() => void` | - | No | Click handler to toggle the filter panel |
| `activeCount` | `number` | `0` | No | Number of active filters (shows badge if > 0) |
| `label` | `string` | `"Filters"` | No | Custom label text |

### Customization Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | No | Button size variant |
| `icon` | `ReactNode` | `<Filter />` | No | Custom icon (defaults to Filter from lucide-react) |
| `badgeVariant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger'` | `'primary'` | No | Badge color variant |
| `alwaysShowBadge` | `boolean` | `false` | No | Show badge even when count is 0 |
| `className` | `string` | `''` | No | Additional CSS classes |

### State & Interaction Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `disabled` | `boolean` | `false` | No | Disabled state |
| `tooltip` | `string` | Auto-generated | No | Tooltip text on hover |
| `ariaLabel` | `string` | Auto-generated | No | ARIA label for accessibility |

### Backward Compatibility Props (Deprecated)

| Prop | Type | Description | Use Instead |
|------|------|-------------|-------------|
| `showFilters` | `boolean` | Alternative name for `isActive` | `isActive` |
| `onToggle` | `() => void` | Alternative name for `onClick` | `onClick` |
| `activeFilterCount` | `number` | Alternative name for `activeCount` | `activeCount` |

---

## Usage Examples

### Basic Usage (Most Common)

```tsx
import { FilterToggleButton } from '../../components/ui/FilterToggleButton';

function DataTable() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  return (
    <FilterToggleButton
      isActive={showFilters}
      onClick={() => setShowFilters(!showFilters)}
      activeCount={activeFilterCount}
    />
  );
}
```

### With Custom Label

```tsx
<FilterToggleButton
  isActive={advancedFiltersVisible}
  onClick={toggleAdvancedFilters}
  activeCount={5}
  label="Advanced Filters"
/>
```

### With Size Variants

```tsx
{/* Small - Compact toolbars */}
<FilterToggleButton
  isActive={showFilters}
  onClick={handleToggle}
  activeCount={2}
  size="small"
/>

{/* Medium - Default */}
<FilterToggleButton
  isActive={showFilters}
  onClick={handleToggle}
  activeCount={3}
  size="medium"
/>

{/* Large - Prominent placement */}
<FilterToggleButton
  isActive={showFilters}
  onClick={handleToggle}
  activeCount={4}
  size="large"
/>
```

### Disabled State

```tsx
<FilterToggleButton
  isActive={false}
  onClick={handleToggle}
  disabled={true}
  tooltip="Filters unavailable for this view"
/>
```

### Custom Badge Color

```tsx
{/* Warning - Many filters active */}
<FilterToggleButton
  isActive={true}
  onClick={handleToggle}
  activeCount={10}
  badgeVariant="warning"
/>

{/* Danger - Critical filter state */}
<FilterToggleButton
  isActive={true}
  onClick={handleToggle}
  activeCount={1}
  badgeVariant="danger"
  label="Required Filters"
/>

{/* Success - Optimal filter state */}
<FilterToggleButton
  isActive={true}
  onClick={handleToggle}
  activeCount={3}
  badgeVariant="success"
/>
```

### Always Show Badge (Zero State)

```tsx
<FilterToggleButton
  isActive={false}
  onClick={handleToggle}
  activeCount={0}
  alwaysShowBadge={true}
  label="Filters"
/>
{/* Badge shows "0" even when no filters are active */}
```

### Custom Icon

```tsx
import { Settings, Sliders } from 'lucide-react';

<FilterToggleButton
  isActive={showSettings}
  onClick={toggleSettings}
  activeCount={2}
  icon={<Settings className="w-4 h-4" />}
  label="Settings"
/>

<FilterToggleButton
  isActive={showAdvanced}
  onClick={toggleAdvanced}
  activeCount={5}
  icon={<Sliders className="w-4 h-4" />}
  label="Advanced"
/>
```

### Custom Tooltip & ARIA Label

```tsx
<FilterToggleButton
  isActive={showFilters}
  onClick={handleToggle}
  activeCount={3}
  tooltip="Toggle product filters panel"
  ariaLabel="Show or hide product filters, 3 filters active"
/>
```

### Backward Compatibility (Old Props)

```tsx
{/* Old pattern - still works but deprecated */}
<FilterToggleButton
  showFilters={isVisible}
  onToggle={handleVisibilityChange}
  activeFilterCount={filterCount}
/>

{/* New pattern - recommended */}
<FilterToggleButton
  isActive={isVisible}
  onClick={handleVisibilityChange}
  activeCount={filterCount}
/>
```

---

## Size Variants

### Small (Compact Toolbars)

```tsx
<FilterToggleButton size="small" isActive={false} onClick={handleToggle} />
```

**Use Cases:**
- Compact data tables with limited toolbar space
- Mobile/responsive layouts
- Dense UI sections

**Visual Specs:**
- Height: Reduced padding
- Icon: w-3 h-3 (12x12px)
- Font: text-xs (12px)

### Medium (Default)

```tsx
<FilterToggleButton size="medium" isActive={false} onClick={handleToggle} />
```

**Use Cases:**
- Standard data tables
- List pages
- Most common scenario

**Visual Specs:**
- Height: 33px
- Icon: w-4 h-4 (16x16px)
- Font: text-sm (14px)

### Large (Prominent Placement)

```tsx
<FilterToggleButton size="large" isActive={false} onClick={handleToggle} />
```

**Use Cases:**
- Dashboard filter panels
- Prominent filter controls
- Large screen layouts

**Visual Specs:**
- Height: Increased padding
- Icon: w-5 h-5 (20x20px)
- Font: text-base (16px)

---

## Badge Variants

### Primary (Default)

```tsx
<FilterToggleButton badgeVariant="primary" activeCount={3} />
```

**Color:** `#5C1F3D` (Deep purple/maroon)  
**Use Case:** Standard filter count display

### Secondary

```tsx
<FilterToggleButton badgeVariant="secondary" activeCount={3} />
```

**Color:** `gray-600`  
**Use Case:** Less prominent filter indicators

### Success

```tsx
<FilterToggleButton badgeVariant="success" activeCount={3} />
```

**Color:** `green-600`  
**Use Case:** Optimal number of filters applied

### Warning

```tsx
<FilterToggleButton badgeVariant="warning" activeCount={10} />
```

**Color:** `yellow-600`  
**Use Case:** High number of filters (may slow down results)

### Danger

```tsx
<FilterToggleButton badgeVariant="danger" activeCount={1} />
```

**Color:** `red-600`  
**Use Case:** Required filters missing or critical filter state

---

## States

### Default (Inactive)

**Visual:**
- Variant: Outline
- Background: White
- Border: gray-300
- Text: gray-700
- No badge visible (if count is 0)

**Behavior:**
- Clickable
- Tooltip shows "Show Filters"

### Active

**Visual:**
- Variant: Secondary
- Background: gray-100
- Border: gray-300
- Text: gray-700
- Badge visible (if count > 0)

**Behavior:**
- Clickable
- Tooltip shows "Hide Filters"

### Hover (Inactive)

**Visual:**
- Background: gray-50
- Border: gray-300
- Smooth transition (transition-colors)

### Hover (Active)

**Visual:**
- Background: gray-200
- Border: gray-300
- Smooth transition

### Focus

**Visual:**
- Focus ring: 2px solid #5C1F3D
- Border: transparent
- Outline: none

**Behavior:**
- Keyboard accessible
- Tab to navigate, Enter/Space to activate

### Disabled

**Visual:**
- Opacity: 40%
- Cursor: not-allowed
- Pointer events: none
- Badge: grayed out (if present)

**Behavior:**
- Not clickable
- Tooltip shows custom disabled message (if provided)

### Loading (Future Enhancement)

**Visual:**
- Spinner icon replaces filter icon
- Disabled state
- Badge visible but grayed

---

## Accessibility

### Keyboard Navigation

**Supported Keys:**
- **Tab**: Focus the button
- **Enter**: Activate toggle
- **Space**: Activate toggle
- **Shift + Tab**: Focus previous element

### Screen Reader Support

**Auto-Generated ARIA Labels:**

```tsx
// Inactive, no filters
aria-label="Show filters"

// Active, no filters
aria-label="Hide filters"

// Inactive, 3 filters
aria-label="Show filters, 3 active"

// Active, 5 filters
aria-label="Hide filters, 5 active"
```

**Custom ARIA Labels:**

```tsx
<FilterToggleButton
  isActive={true}
  onClick={handleToggle}
  activeCount={3}
  ariaLabel="Toggle advanced product filters, 3 filters currently applied"
/>
```

### Tooltip Support

**Auto-Generated Tooltips:**
- Inactive: "Show Filters"
- Active: "Hide Filters"

**Custom Tooltips:**

```tsx
<FilterToggleButton
  isActive={false}
  onClick={handleToggle}
  tooltip="Open filter panel to refine results"
/>
```

### Focus Visible

**Visual Indicator:**
- Purple focus ring (2px)
- High contrast for visibility
- Respects `prefers-reduced-motion`

---

## Best Practices

### ✅ Do's

1. **Use consistent labels across the app**
   ```tsx
   <FilterToggleButton label="Filters" /> {/* Good */}
   ```

2. **Update activeCount when filters change**
   ```tsx
   useEffect(() => {
     const count = Object.values(filters).filter(Boolean).length;
     setActiveFilterCount(count);
   }, [filters]);
   ```

3. **Place in top-right of toolbar**
   ```tsx
   <div className="flex items-center justify-between">
     <div>{/* Search, bulk actions */}</div>
     <div className="flex gap-2">
       <FilterToggleButton {...props} />
       <MoreOptionsMenu />
     </div>
   </div>
   ```

4. **Show badge only when filters are active**
   ```tsx
   <FilterToggleButton
     activeCount={actualFilterCount}
     alwaysShowBadge={false} {/* Default */}
   />
   ```

5. **Provide meaningful tooltips for custom use cases**
   ```tsx
   <FilterToggleButton
     tooltip="Filter by date range, status, and category"
     {...props}
   />
   ```

### ❌ Don'ts

1. **Don't use for non-filter actions**
   ```tsx
   {/* Bad - Use regular StyledButton */}
   <FilterToggleButton label="Settings" onClick={openSettings} />
   ```

2. **Don't show badge for unrelated counts**
   ```tsx
   {/* Bad - activeCount should only represent filters */}
   <FilterToggleButton activeCount={totalRecords} />
   ```

3. **Don't override critical styles**
   ```tsx
   {/* Bad - Breaks design consistency */}
   <FilterToggleButton className="bg-red-500 text-white" />
   ```

4. **Don't manually calculate badge visibility**
   ```tsx
   {/* Bad - Component handles this automatically */}
   {activeCount > 0 && <FilterToggleButton {...props} />}
   
   {/* Good - Component shows/hides badge internally */}
   <FilterToggleButton activeCount={activeCount} {...props} />
   ```

5. **Don't use for primary CTAs**
   ```tsx
   {/* Bad - This is for filters only */}
   <FilterToggleButton label="Create New Item" />
   ```

---

## Integration Patterns

### With Filter Panel

```tsx
function DataTable() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '', category: '' });

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div>{/* Search */}</div>
        <FilterToggleButton
          isActive={showFilters}
          onClick={() => setShowFilters(!showFilters)}
          activeCount={activeFilterCount}
        />
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          {/* Filter controls */}
        </div>
      )}

      {/* Table */}
      <table>{/* ... */}</table>
    </div>
  );
}
```

### With Multiple Filter States

```tsx
function AdvancedDataTable() {
  const [quickFiltersShown, setQuickFiltersShown] = useState(false);
  const [advancedFiltersShown, setAdvancedFiltersShown] = useState(false);
  
  const quickFilterCount = 3;
  const advancedFilterCount = 2;

  return (
    <div className="flex gap-2">
      <FilterToggleButton
        isActive={quickFiltersShown}
        onClick={() => setQuickFiltersShown(!quickFiltersShown)}
        activeCount={quickFilterCount}
        label="Quick Filters"
      />
      <FilterToggleButton
        isActive={advancedFiltersShown}
        onClick={() => setAdvancedFiltersShown(!advancedFiltersShown)}
        activeCount={advancedFilterCount}
        label="Advanced"
        icon={<Sliders className="w-4 h-4" />}
      />
    </div>
  );
}
```

### Responsive Behavior

```tsx
function ResponsiveToolbar() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
      {/* Mobile: Small size */}
      <div className="md:hidden">
        <FilterToggleButton
          size="small"
          label="Filters"
          {...props}
        />
      </div>
      
      {/* Desktop: Medium size */}
      <div className="hidden md:block">
        <FilterToggleButton
          size="medium"
          label="Filters"
          {...props}
        />
      </div>
    </div>
  );
}
```

---

## Migration Guide

### Updating from Old Props Pattern

**Before (Deprecated):**
```tsx
<FilterToggleButton
  showFilters={isVisible}
  onToggle={handleToggle}
  activeFilterCount={count}
/>
```

**After (Recommended):**
```tsx
<FilterToggleButton
  isActive={isVisible}
  onClick={handleToggle}
  activeCount={count}
/>
```

### Adding New Features

**Before (Basic):**
```tsx
<FilterToggleButton
  isActive={showFilters}
  onClick={toggleFilters}
/>
```

**After (Enhanced):**
```tsx
<FilterToggleButton
  isActive={showFilters}
  onClick={toggleFilters}
  activeCount={filterCount}
  size="medium"
  tooltip="Toggle product filters"
  ariaLabel="Show or hide product filters"
/>
```

---

## TypeScript Usage

### Type Import

```tsx
import { FilterToggleButton, FilterToggleButtonProps } from '../../components/ui/FilterToggleButton';
```

### Custom Wrapper Component

```tsx
import { FilterToggleButton, FilterToggleButtonProps } from '../../components/ui/FilterToggleButton';

interface CustomFilterButtonProps extends Omit<FilterToggleButtonProps, 'label'> {
  filterType: 'quick' | 'advanced';
}

export function CustomFilterButton({ filterType, ...props }: CustomFilterButtonProps) {
  const label = filterType === 'quick' ? 'Quick Filters' : 'Advanced Filters';
  
  return (
    <FilterToggleButton
      label={label}
      {...props}
    />
  );
}
```

---

## Testing

### Unit Test Example

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterToggleButton } from './FilterToggleButton';

describe('FilterToggleButton', () => {
  it('renders with default props', () => {
    const handleClick = jest.fn();
    render(<FilterToggleButton isActive={false} onClick={handleClick} />);
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('shows badge when activeCount > 0', () => {
    render(<FilterToggleButton isActive={true} onClick={() => {}} activeCount={5} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<FilterToggleButton isActive={false} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Filters'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<FilterToggleButton isActive={false} onClick={() => {}} disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

---

## Related Components

- **StyledButton** - Base button component used internally
- **MoreOptionsMenu** - Often used alongside FilterToggleButton
- **TableToolbarOptionsMenu** - Alternative menu component for tables
- **StyledSelect** - Used within filter panels
- **FilterPanel** - Panel component shown when filters are active

---

## Changelog

### Version 2.0 (Current)
- ✅ Added size variants (small, medium, large)
- ✅ Added badge color variants (primary, secondary, success, warning, danger)
- ✅ Added disabled state support
- ✅ Added tooltip and ARIA label customization
- ✅ Added backward compatibility for old prop names
- ✅ Added alwaysShowBadge option
- ✅ Improved documentation and examples
- ✅ Added TypeScript type exports

### Version 1.0 (Legacy)
- Basic toggle functionality
- Active filter count badge
- Primary/outline variants

---

## Support & Contributions

For questions, bug reports, or feature requests related to FilterToggleButton:

1. Check this documentation first
2. Review existing implementations in `/pages/inventory/ItemMaster.tsx`, `/pages/inventory/Bundles.tsx`, etc.
3. Refer to ERP design guidelines: `/Guidelines.md`
4. Test accessibility with keyboard navigation and screen readers

---

**Last Updated:** January 2025  
**Component Version:** 2.0  
**Maintainer:** ERP Development Team
