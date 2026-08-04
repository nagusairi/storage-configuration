# Filter Summary Banner - Design Guidelines

**Component Name:** Filter Summary Banner  
**Pattern Type:** Informational Banner / Active Filter Indicator  
**Used In:** FullFunctionalTable, DataGrid, and all custom data table implementations  
**Status:** ✅ Production Ready

---

## Overview

The **Filter Summary Banner** is a horizontal information bar that appears below the filter controls when one or more filters are active. It provides:
- **Visual confirmation** that filters are currently applied
- **Quick overview** of active filter values
- **One-click removal** of individual filters
- **Clear all** functionality to reset all filters at once

---

## When to Use

- **Data tables** with filter functionality (select dropdowns, date ranges, search)
- **List views** in all ERP modules (Item Master, Invoices, Purchase Orders, etc.)
- **Reports and analytics** pages with filter controls
- Any view where users need clear feedback on active filtering

---

## Complete Implementation Pattern

### Banner Structure

```tsx
{activeFilterCount > 0 && (
  <div className="flex items-center justify-between border border-gray-200 rounded px-4 py-2 mb-4" style={{ backgroundColor: '#F8F9FA' }}>
    {/* Left: Filter count with icon */}
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-600">
        {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} applied
      </span>
    </div>
    
    {/* Center: Active filter badges */}
    <div className="flex items-center gap-2 flex-1 ml-4">
      {Object.entries(activeFilters).map(([key, value]) => {
        if (!value) return null;
        
        const filterConfig = filters?.find(f => f.id === key);
        const filterLabel = filterConfig?.label || key;
        
        let displayValue = value;
        if (filterConfig?.type === 'select' && filterConfig.options) {
          const option = filterConfig.options.find(opt => opt.value === value);
          displayValue = option?.label || value;
        }
        
        return (
          <div 
            key={key}
            className="flex items-center gap-1.5 bg-white border border-gray-200 rounded px-2 py-0.5"
          >
            <span className="text-sm text-gray-600">
              {filterLabel}: <span className="text-gray-800">{displayValue}</span>
            </span>
            <button
              onClick={() => {
                const newFilters = { ...activeFilters };
                delete newFilters[key];
                setActiveFilters(newFilters);
                setCurrentPage(1);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
    
    {/* Right: Clear all link */}
    <button
      onClick={handleClearAllFilters}
      className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors whitespace-nowrap ml-4"
    >
      Clear all
    </button>
  </div>
)}
```

---

## Design Specifications

### Container (Banner Wrapper)

| Property | Value | CSS Class | Notes |
|----------|-------|-----------|-------|
| **Background Color** | `#F8F9FA` | Inline style | Very light gray/blue tint, almost white |
| **Border** | 1px solid `#E5E7EB` | `border border-gray-200` | Subtle border all around |
| **Border Radius** | 4px | `rounded` | Slightly rounded corners |
| **Padding Horizontal** | 16px | `px-4` | Left and right spacing |
| **Padding Vertical** | 8px | `py-2` | Top and bottom spacing |
| **Margin Bottom** | 16px | `mb-4` | Space below banner |
| **Layout** | Flexbox | `flex items-center justify-between` | Horizontal with space between |
| **Height** | Auto (~40px) | - | Based on content + padding |

### Left Section: Filter Count

| Element | Property | Value | CSS Class |
|---------|----------|-------|-----------|
| **Container** | Layout | Flexbox with 8px gap | `flex items-center gap-2` |
| **Icon** | Component | `SlidersHorizontal` | From lucide-react |
| **Icon** | Size | 16x16px | `w-4 h-4` |
| **Icon** | Color | `#9CA3AF` | `text-gray-400` |
| **Text** | Font Size | 14px | `text-sm` |
| **Text** | Color | `#4B5563` | `text-gray-600` |
| **Text** | Weight | 400 (Normal) | Default |
| **Text** | Content | "{count} filter(s) applied" | Dynamic |

### Center Section: Filter Badges

**Badge Container:**
| Property | Value | CSS Class |
|----------|-------|-----------|
| **Layout** | Flexbox with 8px gap | `flex items-center gap-2` |
| **Flex** | Takes available space | `flex-1 ml-4` |
| **Margin Left** | 16px | `ml-4` |

**Individual Badge:**
| Property | Value | CSS Class | Notes |
|----------|-------|-----------|-------|
| **Background** | `#FFFFFF` | `bg-white` | Pure white |
| **Border** | 1px solid `#E5E7EB` | `border border-gray-200` | Subtle gray |
| **Border Radius** | 4px | `rounded` | Slightly rounded |
| **Padding Horizontal** | 8px | `px-2` | Compact |
| **Padding Vertical** | 2px | `py-0.5` | Very compact |
| **Layout** | Flexbox with 6px gap | `flex items-center gap-1.5` | Icon + text spacing |

**Badge Text:**
| Element | Font Size | Color | CSS Class | Weight |
|---------|-----------|-------|-----------|--------|
| **Label** | 14px | `#4B5563` | `text-sm text-gray-600` | 400 |
| **Value** | 14px | `#1F2937` | `text-sm text-gray-800` | 400 |

**Badge Close Button:**
| Property | Value | CSS Class | Notes |
|----------|-------|-----------|-------|
| **Icon** | `X` from lucide-react | - | Close icon |
| **Size** | 14x14px | `w-3.5 h-3.5` | Compact |
| **Color Default** | `#9CA3AF` | `text-gray-400` | Subtle gray |
| **Color Hover** | `#4B5563` | `hover:text-gray-600` | Darker |
| **Transition** | Color change | `transition-colors` | Smooth |

### Right Section: Clear All Button

| Property | Value | CSS Class | Notes |
|----------|-------|-----------|-------|
| **Font Size** | 14px | `text-sm` | Matches badge text |
| **Color Default** | `#2563EB` | `text-blue-600` | Link blue |
| **Color Hover** | `#1D4ED8` | `hover:text-blue-700` | Darker blue |
| **Text Decoration** | Underline on hover | `hover:underline` | Standard link style |
| **Transition** | Color change | `transition-colors` | Smooth |
| **White Space** | No wrap | `whitespace-nowrap` | Prevents wrapping |
| **Margin Left** | 16px | `ml-4` | Space from badges |
| **Weight** | 400 (Normal) | Default | Not bold |

---

## Color Palette

| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **Banner Background** | `#F8F9FA` | Inline style | Main container |
| **White** | `#FFFFFF` | `bg-white` | Badge backgrounds |
| **Gray 200** | `#E5E7EB` | `border-gray-200` | Borders |
| **Gray 400** | `#9CA3AF` | `text-gray-400` | Icons (default) |
| **Gray 600** | `#4B5563` | `text-gray-600` | Primary text |
| **Gray 800** | `#1F2937` | `text-gray-800` | Badge values |
| **Blue 600** | `#2563EB` | `text-blue-600` | Clear all (default) |
| **Blue 700** | `#1D4ED8` | `text-blue-700` | Clear all (hover) |

---

## Spacing Reference

| Tailwind Class | Pixels | Usage |
|----------------|--------|-------|
| `gap-1.5` | 6px | Badge internal spacing |
| `gap-2` | 8px | Badge container, left section |
| `px-2` | 8px | Badge horizontal padding |
| `py-0.5` | 2px | Badge vertical padding |
| `px-4` | 16px | Banner horizontal padding |
| `py-2` | 8px | Banner vertical padding |
| `ml-4` | 16px | Section left margins |
| `mb-4` | 16px | Banner bottom margin |

---

## Interactive States

### Close Button (X on badges)
- **Default**: `#9CA3AF` (gray-400)
- **Hover**: `#4B5563` (gray-600)
- **Transition**: Smooth color transition (150ms)

### Clear All Link
- **Default**: `#2563EB` (blue-600), no underline
- **Hover**: `#1D4ED8` (blue-700), underlined
- **Transition**: Smooth color transition (150ms)

---

## Required Imports

```tsx
import { SlidersHorizontal, X } from 'lucide-react';
```

---

## State Management Pattern

```tsx
// Track active filters
const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

// Calculate active filter count
const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

// Clear all filters handler
const handleClearAllFilters = () => {
  setActiveFilters({});
  setAppliedDateRange(null);
  setCurrentPage(1);
};

// Remove individual filter
const removeFilter = (key: string) => {
  const newFilters = { ...activeFilters };
  delete newFilters[key];
  setActiveFilters(newFilters);
  setCurrentPage(1);
};
```

---

## Date Range Badge Variant

For custom date range filters, use this special badge format:

```tsx
{appliedDateRange && (
  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded px-2 py-0.5">
    <span className="text-sm text-gray-600">
      Date: <span className="text-gray-800">
        {new Date(appliedDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - 
        {new Date(appliedDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
    </span>
    <button
      onClick={() => {
        setAppliedDateRange(null);
        setCurrentPage(1);
      }}
      className="text-gray-400 hover:text-gray-600 transition-colors"
    >
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
)}
```

**Date Format:** `DD MMM YYYY` (e.g., "1 Jan 2024 - 31 Jan 2024")  
**Locale:** `en-GB` (British date format with day first)

---

## Usage Examples

### Example 1: Basic Filter Summary (FullFunctionalTable)

```tsx
<FullFunctionalTable
  data={items}
  columns={columns}
  filters={[
    { id: 'status', label: 'Status', type: 'select', options: statusOptions },
    { id: 'category', label: 'Category', type: 'select', options: categoryOptions }
  ]}
  // Filter summary banner appears automatically when filters are active
/>
```

### Example 2: Custom Implementation

```tsx
function CustomDataTable() {
  const [activeFilters, setActiveFilters] = useState({});
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div>
      {/* Filter controls */}
      
      {/* Filter Summary Banner */}
      {activeFilterCount > 0 && (
        <div className="flex items-center justify-between border border-gray-200 rounded px-4 py-2 mb-4" 
             style={{ backgroundColor: '#F8F9FA' }}>
          {/* Banner content */}
        </div>
      )}
      
      {/* Data table */}
    </div>
  );
}
```

---

## Best Practices

### Visual Hierarchy
- ✅ Banner appears **below** filter controls, **above** data table
- ✅ Use subtle background color to distinguish from main content
- ✅ Keep badges compact to maximize horizontal space

### Interaction
- ✅ Clicking X on badge removes that specific filter
- ✅ "Clear all" removes all filters at once
- ✅ Filter removal resets pagination to page 1
- ❌ Don't make the entire badge clickable (only the X button)

### Content
- ✅ Show filter label and value in each badge
- ✅ Use human-readable labels (not internal IDs)
- ✅ Format dates consistently (DD MMM YYYY)
- ❌ Don't show empty/null filter values

### Accessibility
- ✅ All buttons are keyboard accessible
- ✅ Clear hover states on interactive elements
- ✅ Sufficient color contrast for text
- ✅ Descriptive button labels (even if icon-only)

---

## Responsive Behavior

- **Desktop (>1024px)**: All badges in one row
- **Tablet (768px-1024px)**: Badges may wrap to second row
- **Mobile (<768px)**: Consider stacking or horizontal scroll

---

## Visual Reference

```
┌───────────────────────────────────────────────────────────────────────────┐
│ Background: #F8F9FA (very light gray/blue)                                │
│ Border: 1px solid #E5E7EB (gray-200)                                      │
│ Padding: 16px horizontal, 8px vertical                                    │
│                                                                            │
│  [Filter Icon] 2 filters applied    [Status: Active ×] [Category: Goods ×]    Clear all │
│  ↑                                   ↑                                     ↑             │
│  Left Section                        Center Section (badges)              Right Section │
│  (Gray-400 icon + Gray-600 text)    (White bg, Gray-200 border)         (Blue-600 link)│
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Notes

### Why Inline Style for Background?
- The specific color `#F8F9FA` is not a standard Tailwind color
- Using inline style ensures exact color match across all browsers
- Alternative: Could add custom color to Tailwind config

### Why Not Use Tailwind's `bg-gray-50`?
- `bg-gray-50` is `#F9FAFB` (slightly different tone)
- The design requires precise `#F8F9FA` for consistency

### Performance Considerations
- Conditional rendering (`{activeFilterCount > 0 && ...}`) prevents unnecessary DOM nodes
- Filter removal triggers single state update (batched by React)
- No complex animations to avoid jank

---

## Related Patterns

- **Filter Controls** (dropdowns, search, date pickers)
- **Custom Date Range Picker** (modal approach)
- **Pagination Bar** (appears below table)
- **Bulk Actions Bar** (appears when rows selected)

---

## Component Integration

This pattern is automatically included in:
- ✅ **FullFunctionalTable** (`/components/ui/FullFunctionalTable.tsx`)
- ✅ **DataGrid** (`/components/ui/DataGrid.tsx`)

For custom table implementations, use the code pattern provided in the "Complete Implementation Pattern" section above.

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Maintainer:** ERP Design System Team
