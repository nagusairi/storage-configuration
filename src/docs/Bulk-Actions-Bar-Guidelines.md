# Bulk Actions Bar - Component Guidelines

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** ✅ Active - Use for all multi-select scenarios

---

## Overview

The **Bulk Actions Bar** is a standardized UI pattern for displaying selection count and bulk action buttons when users select multiple items in tables, lists, or grids across the ERP application.

**Key Features:**
- ✅ Conditional rendering based on selection state
- ✅ Purple/pink theme for visual prominence
- ✅ Proper pluralization
- ✅ Clear action buttons with icons
- ✅ Consistent spacing and styling
- ✅ Responsive design

---

## When to Use

- Data tables with checkbox multi-select functionality
- Item/component lists where users can select multiple items
- Any grid or list requiring bulk operations (delete, export, assign, etc.)
- Scenarios where users need visual confirmation of selected items count

---

## Visual Appearance

- **Appears conditionally** when one or more items are selected
- **Disappears automatically** when all items are deselected
- **Purple/pink theme** to indicate active selection state
- **Clean, prominent design** that stands out from regular table rows

---

## Standard Implementation

### Basic Pattern

```tsx
{selectedItems.length > 0 && (
  <div className="mb-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
    <span className="text-sm text-purple-900 font-medium">
      {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
    </span>
    <StyledButton
      variant="outline"
      size="small"
      onClick={handleBulkAction}
    >
      <ActionIcon className="w-4 h-4" />
      Action Label
    </StyledButton>
  </div>
)}
```

---

## Key Properties

### Container

| Property | Value | Description |
|----------|-------|-------------|
| **Conditional Rendering** | `{selectedItems.length > 0 && ...}` | Only shows when items are selected |
| **Padding** | `px-4 py-3` | 16px horizontal, 12px vertical |
| **Background** | `bg-purple-50` | Light purple background |
| **Border** | `border border-purple-200 rounded-lg` | Purple border with large radius |
| **Layout** | `flex items-center justify-between` | Text left, button right |
| **Margin** | `mb-3` | 12px bottom margin to separate from table |

### Selection Count Text

| Property | Value | Description |
|----------|-------|-------------|
| **Font Size** | `text-sm` | 14px |
| **Color** | `text-purple-900` | Dark purple for contrast |
| **Weight** | `font-medium` | Medium weight for emphasis |
| **Pluralization** | Dynamic | `item` vs `items` based on count |
| **Format** | `{count} {type}{s} selected` | e.g., "3 components selected" |

### Action Button

| Property | Value | Description |
|----------|-------|-------------|
| **Variant** | `outline` | Secondary style with border |
| **Size** | `small` | Compact size appropriate for toolbar |
| **Icon** | `w-4 h-4` | 16x16px icon (Trash2, Download, Edit, etc.) |
| **Gap** | Automatic | Icon and text have proper spacing |

---

## Color Variants

### Default (Purple) - General Selection

```tsx
className="px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg"
// Text: text-purple-900
```

**Use for:**
- Standard multi-select scenarios
- Component lists
- General data tables

### Alternative (Pink) - Emphasis

```tsx
className="px-4 py-3 bg-pink-50 border border-pink-200 rounded-lg"
// Text: text-pink-900
```

**Use for:**
- Special contexts requiring emphasis
- Temporary selections
- Promotional items

### Destructive (Red) - Dangerous Actions

```tsx
className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg"
// Text: text-red-900
```

**Use for:**
- Bulk delete operations
- Irreversible actions
- Warning scenarios

---

## Multiple Action Buttons

When multiple bulk actions are available:

```tsx
{selectedItems.length > 0 && (
  <div className="mb-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
    <span className="text-sm text-purple-900 font-medium">
      {selectedItems.length} component{selectedItems.length !== 1 ? 's' : ''} selected
    </span>
    <div className="flex gap-2">
      <StyledButton variant="outline" size="small" onClick={handleBulkEdit}>
        <Edit className="w-4 h-4" />
        Edit Selected
      </StyledButton>
      <StyledButton variant="outline" size="small" onClick={handleBulkExport}>
        <Download className="w-4 h-4" />
        Export Selected
      </StyledButton>
      <StyledButton variant="outline" size="small" onClick={handleBulkDelete}>
        <Trash2 className="w-4 h-4" />
        Remove Selected
      </StyledButton>
    </div>
  </div>
)}
```

---

## Usage Examples

### Bundle Components Table

```tsx
{selectedComponents.length > 0 && (
  <div className="mb-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
    <span className="text-sm text-purple-900 font-medium">
      {selectedComponents.length} component{selectedComponents.length !== 1 ? 's' : ''} selected
    </span>
    <StyledButton variant="outline" size="small" onClick={handleBulkRemove}>
      <Trash2 className="w-4 h-4" />
      Remove Selected
    </StyledButton>
  </div>
)}
```

### Warehouse List

```tsx
{selectedWarehouses.length > 0 && (
  <div className="mb-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
    <span className="text-sm text-purple-900 font-medium">
      {selectedWarehouses.length} warehouse{selectedWarehouses.length !== 1 ? 's' : ''} selected
    </span>
    <div className="flex gap-2">
      <StyledButton variant="outline" size="small" onClick={handleBulkActivate}>
        <CheckCircle className="w-4 h-4" />
        Activate
      </StyledButton>
      <StyledButton variant="outline" size="small" onClick={handleBulkDeactivate}>
        <XCircle className="w-4 h-4" />
        Deactivate
      </StyledButton>
    </div>
  </div>
)}
```

### Inventory Items

```tsx
{selectedItems.length > 0 && (
  <div className="mb-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
    <span className="text-sm text-purple-900 font-medium">
      {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
    </span>
    <StyledButton variant="outline" size="small" onClick={handleBulkDelete}>
      <Trash2 className="w-4 h-4" />
      Delete Selected
    </StyledButton>
  </div>
)}
```

---

## State Management

### Required State

```tsx
const [selectedItems, setSelectedItems] = useState<number[]>([]);
```

### Selection Handlers

```tsx
// Individual item selection
const handleItemSelect = (id: number, checked: boolean) => {
  if (checked) {
    setSelectedItems([...selectedItems, id]);
  } else {
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  }
};

// Select all items
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    setSelectedItems(items.map(item => item.id));
  } else {
    setSelectedItems([]);
  }
};

// Bulk action (e.g., remove)
const handleBulkRemove = () => {
  setItems(items.filter(item => !selectedItems.includes(item.id)));
  setSelectedItems([]); // Clear selection after action
};
```

---

## Positioning

### Above Table

```tsx
<>
  {/* Bulk Actions Bar */}
  {selectedItems.length > 0 && (
    <div className="mb-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
      {/* ... */}
    </div>
  )}
  
  {/* Table */}
  <div className="border border-gray-200 rounded-[3px] overflow-hidden">
    <table className="w-full">
      {/* ... */}
    </table>
  </div>
</>
```

### Inside Container (Before Table)

```tsx
<div className="mb-8">
  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
    <h2>Items</h2>
    <button>Add Item</button>
  </div>
  
  {items.length > 0 && (
    <>
      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div className="mb-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
          {/* ... */}
        </div>
      )}
      
      {/* Table */}
      <div className="border border-gray-200 rounded-[3px] overflow-hidden">
        {/* ... */}
      </div>
    </>
  )}
</div>
```

---

## Best Practices

### Content

- ✅ Always use proper pluralization (`item` vs `items`)
- ✅ Be specific about what's selected (`component`, `warehouse`, `product`)
- ✅ Include count prominently
- ✅ Use clear, action-oriented button labels

### Interaction

- ✅ Show immediately when first item is selected
- ✅ Update count dynamically as selection changes
- ✅ Hide automatically when all items are deselected
- ✅ Clear selection after bulk action completes
- ✅ Provide visual feedback for action completion

### Accessibility

- ✅ Use semantic HTML (native checkbox inputs)
- ✅ Include proper ARIA labels
- ✅ Ensure keyboard navigation works
- ✅ Provide clear focus states

### Visual Design

- ✅ Use purple theme for consistency with selection UI
- ✅ Ensure sufficient contrast for text readability
- ✅ Make buttons easily tappable on mobile (proper spacing)
- ✅ Maintain consistent spacing with table below

### Performance

- ✅ Use conditional rendering to mount/unmount component
- ✅ Avoid expensive computations in selection count display
- ✅ Debounce bulk actions if they involve API calls

---

## Common Patterns

### With Select All Checkbox

```tsx
{selectedItems.length > 0 && (
  <div className="mb-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={selectedItems.length === items.length}
        onChange={(e) => handleSelectAll(e.target.checked)}
        className="w-4 h-4 text-[#5C1F3D] border-gray-300 rounded focus:ring-[#5C1F3D]"
      />
      <span className="text-sm text-purple-900 font-medium">
        {selectedItems.length === items.length ? 'All' : selectedItems.length} selected
      </span>
    </div>
    <StyledButton variant="outline" size="small" onClick={handleBulkDelete}>
      <Trash2 className="w-4 h-4" />
      Delete Selected
    </StyledButton>
  </div>
)}
```

### With Clear Selection Button

```tsx
{selectedItems.length > 0 && (
  <div className="mb-3 px-4 py-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
    <span className="text-sm text-purple-900 font-medium">
      {selectedItems.length} selected
    </span>
    <div className="flex gap-2">
      <button
        onClick={() => setSelectedItems([])}
        className="text-sm text-purple-700 hover:text-purple-900 underline"
      >
        Clear selection
      </button>
      <StyledButton variant="outline" size="small" onClick={handleBulkAction}>
        <ActionIcon className="w-4 h-4" />
        Action
      </StyledButton>
    </div>
  </div>
)}
```

---

## Required Icons

```tsx
import { 
  Trash2,      // Delete/Remove actions
  Edit,        // Edit actions
  Download,    // Export actions
  CheckCircle, // Activate/Approve actions
  XCircle,     // Deactivate/Reject actions
  Archive,     // Archive actions
  Send         // Send/Submit actions
} from 'lucide-react';
```

---

## Technical Notes

- Always wrap in conditional rendering: `{selectedItems.length > 0 && ...}`
- Position with `mb-3` to maintain consistent spacing
- Use `justify-between` to separate count and actions
- Ensure button `onClick` handlers clear selection after action
- Include loading states for async bulk actions

---

## Responsive Behavior

### Mobile (< 768px)

- Consider stacking text and buttons vertically
- Reduce padding to `px-3 py-2`
- Make buttons full-width if space is limited

```tsx
{selectedItems.length > 0 && (
  <div className="mb-3 px-3 py-2 md:px-4 md:py-3 bg-purple-50 border border-purple-200 rounded-lg flex flex-col md:flex-row items-start md:items-center gap-2 md:justify-between">
    <span className="text-sm text-purple-900 font-medium">
      {selectedItems.length} selected
    </span>
    <StyledButton variant="outline" size="small" onClick={handleBulkAction} className="w-full md:w-auto">
      <ActionIcon className="w-4 h-4" />
      Action
    </StyledButton>
  </div>
)}
```

---

## Related Documentation

- [Guidelines.md](/guidelines/Guidelines.md) - Main ERP design guidelines
- [DataGrid Component](/docs/DataGrid-Component-Guidelines.md) - Table component with built-in multi-select
- [StyledButton Component](/components/ui/StyledButton.tsx) - Button component used in actions

---

## Changelog

### Version 1.0 (January 2026)
- ✅ Initial documentation
- ✅ Standardized purple theme
- ✅ Defined key properties and variants
- ✅ Added usage examples
- ✅ Documented state management patterns
- ✅ Added responsive behavior guidelines
