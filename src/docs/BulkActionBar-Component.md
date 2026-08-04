# BulkActionBar Component - Documentation

## Overview

The **BulkActionBar** is a reusable floating action bar component for bulk operations on selected items in tables and data grids. It provides a consistent, accessible interface for actions like download, delete, export, etc.

**Component Location:** `/components/ui/BulkActionBar.tsx`

---

## Features

✅ **Centered positioning** - Fixed at bottom with configurable offset  
✅ **Responsive width** - Auto-adjusts to content, max-width constraint  
✅ **Multiple action buttons** - Support for unlimited actions with variants  
✅ **Close & Clear options** - Quick dismissal via X icon or Clear button  
✅ **Loading states** - Built-in spinner for async operations  
✅ **Disabled states** - Visual feedback for disabled actions  
✅ **Customizable styling** - Colors, radius, spacing, z-index  
✅ **Smooth animations** - Slide-up entrance with transitions  
✅ **Accessible** - Proper ARIA labels and keyboard support  

---

## Design Specifications

### Container

| Property | Default Value | Description |
|----------|---------------|-------------|
| **Position** | `fixed bottom-[20px] left-1/2 -translate-x-1/2` | Centered at bottom |
| **Background** | `#1a1b3d` (navy) | Dark background color |
| **Padding** | `px-8 py-4` (32px, 16px) | Spacious internal spacing |
| **Border Radius** | `rounded-xl` (12px) | Rounded corners |
| **Shadow** | `shadow-2xl` | Strong elevation effect |
| **Max Width** | `600px` | Maximum container width |
| **Z-Index** | `50` | Stacking order |
| **Animation** | `transition-all duration-300 ease-in-out` | Smooth transitions |

### Close Button (X Icon)

| Property | Value |
|----------|-------|
| **Size** | `w-4 h-4` (16x16px) |
| **Padding** | `p-1.5` (6px) |
| **Shape** | `rounded-full` |
| **Hover** | `bg-white/20` |
| **Color** | Inherits from textColor prop |

### Selection Count Text

| Property | Value |
|----------|-------|
| **Font Size** | `text-sm` (14px) |
| **Font Weight** | `font-medium` |
| **Color** | Inherits from textColor prop |
| **Format** | `{count} {label} selected` |

### Divider

| Property | Value |
|----------|-------|
| **Width** | `w-px` (1px) |
| **Height** | `h-5` (20px) |
| **Color** | `bg-white/30` (30% opacity) |

### Clear Button

| Property | Value |
|----------|-------|
| **Font Size** | `text-sm` (14px) |
| **Hover** | `opacity-80` |
| **Color** | Inherits from textColor prop |

### Action Buttons

| Property | Value |
|----------|-------|
| **Height** | `33px` (consistent with ERP form elements) |
| **Padding** | `px-4 py-2` (16px, 8px) |
| **Border Radius** | `rounded-[3px]` (3px) |
| **Font Size** | `text-sm` (14px) |
| **Font Weight** | `font-medium` |
| **Icon Size** | `w-4 h-4` (16x16px) |
| **Gap** | `gap-2` (8px between icon and label) |

### Button Variants

| Variant | Background | Hover | Text | Use Case |
|---------|-----------|-------|------|----------|
| **primary** | `#3B82F6` (blue) | `#2563EB` | `white` | Download, Export, Save |
| **danger** | `#EF4444` (red) | `#DC2626` | `white` | Delete, Remove |
| **secondary** | `white` | `gray-50` | `gray-700` | Cancel, Dismiss |
| **success** | `#10B981` (green) | `#059669` | `white` | Approve, Confirm |

---

## Props Interface

```tsx
interface BulkActionBarProps {
  /** Number of selected items (required) */
  selectedCount: number;
  
  /** Callback when clear/close is clicked (required) */
  onClear: () => void;
  
  /** Array of action buttons to display (required) */
  actions: BulkActionButton[];
  
  /** Background color (default: '#1a1b3d' - navy) */
  backgroundColor?: string;
  
  /** Bottom offset in pixels (default: 20) */
  bottomOffset?: number;
  
  /** Maximum width in pixels (default: 600) */
  maxWidth?: number;
  
  /** Show the "Clear" text button (default: true) */
  showClearButton?: boolean;
  
  /** Show the close (X) icon button (default: true) */
  showCloseButton?: boolean;
  
  /** Custom text color (default: 'white') */
  textColor?: string;
  
  /** Custom border radius (default: 'rounded-xl' - 12px) */
  borderRadius?: string;
  
  /** Custom z-index (default: 50) */
  zIndex?: number;
  
  /** Additional CSS classes for the container */
  className?: string;
  
  /** Singular label for item count (default: 'item') */
  itemLabel?: string;
  
  /** Plural label for item count (default: 'items') */
  itemsLabel?: string;
}

interface BulkActionButton {
  /** Unique identifier for the action */
  id: string;
  
  /** Button label text */
  label: string;
  
  /** Icon element (lucide-react icon) */
  icon?: React.ReactNode;
  
  /** Click handler */
  onClick: () => void;
  
  /** Visual variant (default: 'primary') */
  variant?: 'primary' | 'danger' | 'secondary' | 'success';
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state (shows spinner) */
  loading?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}
```

---

## Usage Examples

### Basic Example (Single Download Action)

```tsx
import { BulkActionBar } from '../../components/ui/BulkActionBar';
import { Download } from 'lucide-react';

function MyTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleDownload = () => {
    // Download logic
    console.log('Downloading:', selectedRows);
    setSelectedRows([]);
  };

  return (
    <>
      {/* Table content */}
      
      {selectedRows.length > 0 && (
        <BulkActionBar
          selectedCount={selectedRows.length}
          onClear={() => setSelectedRows([])}
          actions={[
            {
              id: 'download',
              label: 'Download Selected',
              icon: <Download className="w-4 h-4" />,
              onClick: handleDownload,
              variant: 'primary'
            }
          ]}
        />
      )}
    </>
  );
}
```

### Multiple Actions Example

```tsx
import { Download, FileSpreadsheet, Trash2 } from 'lucide-react';

<BulkActionBar
  selectedCount={selectedRows.length}
  onClear={() => setSelectedRows([])}
  actions={[
    {
      id: 'download',
      label: 'Download PDF',
      icon: <Download className="w-4 h-4" />,
      onClick: handleDownloadPDF,
      variant: 'primary'
    },
    {
      id: 'export',
      label: 'Export Excel',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      onClick: handleExportExcel,
      variant: 'secondary'
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: handleDelete,
      variant: 'danger'
    }
  ]}
/>
```

### Custom Styling Example

```tsx
import { BulkActionBarPresets } from '../../components/ui/BulkActionBar';

<BulkActionBar
  selectedCount={5}
  onClear={clearSelection}
  actions={actions}
  {...BulkActionBarPresets.purple}  // Use purple preset
  bottomOffset={30}                  // 30px from bottom
  maxWidth={800}                     // Wider bar
  showCloseButton={false}            // Hide X icon
/>
```

### Loading State Example

```tsx
const [isDownloading, setIsDownloading] = useState(false);

const handleDownload = async () => {
  setIsDownloading(true);
  await downloadFiles();
  setIsDownloading(false);
  setSelectedRows([]);
};

<BulkActionBar
  selectedCount={selectedRows.length}
  onClear={() => setSelectedRows([])}
  actions={[
    {
      id: 'download',
      label: isDownloading ? 'Downloading...' : 'Download',
      icon: <Download className="w-4 h-4" />,
      onClick: handleDownload,
      variant: 'primary',
      loading: isDownloading,
      disabled: isDownloading
    }
  ]}
/>
```

### Custom Labels Example

```tsx
<BulkActionBar
  selectedCount={3}
  onClear={clearSelection}
  actions={actions}
  itemLabel="invoice"      // Singular
  itemsLabel="invoices"    // Plural
/>
// Result: "3 invoices selected"
```

---

## Preset Configurations

The component includes preset configurations for common use cases:

```tsx
import { BulkActionBarPresets } from '../../components/ui/BulkActionBar';

// Navy background (default ERP style)
<BulkActionBar {...BulkActionBarPresets.navy} />

// Purple background
<BulkActionBar {...BulkActionBarPresets.purple} />

// Primary brand color
<BulkActionBar {...BulkActionBarPresets.primary} />

// Dark gray
<BulkActionBar {...BulkActionBarPresets.dark} />

// Light background
<BulkActionBar {...BulkActionBarPresets.light} />
```

---

## Integration with Existing Tables

### Replace Old Pattern

**Before (Inline Implementation):**
```tsx
{selectedRows.length > 0 && (
  <div className="fixed bottom-[20px] left-1/2 -translate-x-1/2 bg-[#1a1b3d] ...">
    <button onClick={clearSelection}>
      <X className="w-4 h-4" />
    </button>
    <span>{selectedRows.length} items selected</span>
    <button onClick={clearSelection}>Clear</button>
    <button onClick={handleDownload}>
      <Download className="w-4 h-4" />
      Download
    </button>
  </div>
)}
```

**After (Using Component):**
```tsx
import { BulkActionBar } from '../../components/ui/BulkActionBar';
import { Download } from 'lucide-react';

{selectedRows.length > 0 && (
  <BulkActionBar
    selectedCount={selectedRows.length}
    onClear={() => setSelectedRows([])}
    actions={[
      {
        id: 'download',
        label: 'Download Selected',
        icon: <Download className="w-4 h-4" />,
        onClick: handleDownload,
        variant: 'primary'
      }
    ]}
  />
)}
```

---

## Common Use Cases

### 1. Sales Invoices Table

```tsx
<BulkActionBar
  selectedCount={selectedInvoices.length}
  onClear={() => setSelectedInvoices([])}
  actions={[
    {
      id: 'download',
      label: 'Download PDF',
      icon: <Download className="w-4 h-4" />,
      onClick: handleBulkDownload,
      variant: 'primary'
    },
    {
      id: 'email',
      label: 'Send Email',
      icon: <Mail className="w-4 h-4" />,
      onClick: handleBulkEmail,
      variant: 'secondary'
    }
  ]}
  itemLabel="invoice"
  itemsLabel="invoices"
/>
```

### 2. Purchase Orders Table

```tsx
<BulkActionBar
  selectedCount={selectedOrders.length}
  onClear={() => setSelectedOrders([])}
  actions={[
    {
      id: 'export',
      label: 'Export Excel',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      onClick: handleExport,
      variant: 'primary'
    },
    {
      id: 'cancel',
      label: 'Cancel Orders',
      icon: <X className="w-4 h-4" />,
      onClick: handleCancelOrders,
      variant: 'danger'
    }
  ]}
  itemLabel="order"
  itemsLabel="orders"
/>
```

### 3. Item Master Table

```tsx
<BulkActionBar
  selectedCount={selectedItems.length}
  onClear={() => setSelectedItems([])}
  actions={[
    {
      id: 'delete',
      label: 'Delete Items',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => setShowDeleteModal(true),
      variant: 'danger'
    }
  ]}
/>
```

---

## Visual Behavior

### Entrance Animation
- Bar slides up from bottom with `transition-all duration-300 ease-in-out`
- Appears when `selectedCount > 0`
- Disappears when selection is cleared

### Hover States
- **Close button**: `bg-white/20` on hover
- **Clear button**: `opacity-80` on hover
- **Action buttons**: Variant-specific hover colors

### Loading State
- Button shows spinner animation
- Label changes to loading text (e.g., "Downloading...")
- Button is disabled during loading

### Disabled State
- Button opacity: `50%`
- Cursor: `not-allowed`
- No hover effects

---

## Accessibility

✅ **ARIA Labels**: Close button has `aria-label="Close bulk actions"`  
✅ **Keyboard Navigation**: All buttons are keyboard accessible  
✅ **Focus Visible**: Default browser focus rings  
✅ **Screen Readers**: Selection count announced  
✅ **Disabled States**: Properly communicated to assistive tech  

---

## Best Practices

### Do ✅

- **Limit action count**: Maximum 3-4 action buttons for optimal UX
- **Use appropriate variants**: Primary for main action, danger for destructive
- **Provide clear labels**: "Download PDF", "Delete Items" (not just "Download", "Delete")
- **Include icons**: Visual indicators improve scannability
- **Clear selection on success**: Auto-clear after successful action
- **Show loading states**: Provide feedback during async operations

### Don't ❌

- **Too many actions**: Avoid 5+ buttons (consider dropdown instead)
- **Generic labels**: "Action 1", "Do Something"
- **No feedback**: Missing loading/success states
- **Persist after action**: Keep bar visible after successful completion
- **Use for single selection**: Only show when 2+ items selected (use row actions for single items)

---

## Responsive Behavior

- **Desktop**: Full width up to `maxWidth` (default 600px)
- **Tablet**: Auto-adjusts to content width
- **Mobile**: Consider alternative UI (bottom sheet, modal)

**Recommendation**: On mobile (<768px), replace with a different pattern:
```tsx
{selectedRows.length > 0 && (
  window.innerWidth >= 768 ? (
    <BulkActionBar {...props} />
  ) : (
    <MobileBulkActionSheet {...props} />
  )
)}
```

---

## Troubleshooting

### Bar not appearing
- ✅ Check `selectedCount > 0`
- ✅ Verify `z-index` is higher than other elements
- ✅ Ensure parent container allows fixed positioning

### Action buttons not working
- ✅ Check `onClick` handler is defined
- ✅ Verify `disabled` prop is not set
- ✅ Ensure `loading` state is managed correctly

### Styling conflicts
- ✅ Use `className` prop to override defaults
- ✅ Check for global CSS affecting fixed elements
- ✅ Verify `backgroundColor` and `textColor` contrast

---

## Migration Checklist

When replacing old bulk action bars:

- [ ] Import `BulkActionBar` component
- [ ] Import required icons from `lucide-react`
- [ ] Define action handlers
- [ ] Configure action buttons array
- [ ] Remove old inline bulk action bar code
- [ ] Test selection count display
- [ ] Test all action buttons
- [ ] Test clear/close functionality
- [ ] Verify styling matches design system
- [ ] Test loading states (if applicable)

---

## Related Components

- **DataGrid** - Includes built-in bulk selection
- **FullFunctionalTable** - Supports row selection
- **PaginationBar** - Table pagination controls
- **FilterToggleButton** - Filter controls

---

## Support

For issues or feature requests, please consult:
- `/docs/DataGrid-Component-Guidelines.md` - Table component documentation
- `Guidelines.md` - ERP design system guidelines
- Component source: `/components/ui/BulkActionBar.tsx`
