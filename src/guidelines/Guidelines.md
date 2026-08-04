# ERP Application Design Guidelines

> **Note:** This document contains ERP-specific design standards. For global UX/UI principles, design patterns, and information architecture rules, see [`AI-Design-Guidelines.md`](./AI-Design-Guidelines.md).
> 
> **Priority Order:**
> 1. Explicit user instructions (highest)
> 2. ERP-specific guidelines (this file - colors, form elements, branding)
> 3. AI Design Guidelines (global UX patterns, structure, IA)

## Color Scheme
- Primary Color: `#5C1F3D` (Deep purple/maroon)
- Purple accent for AI features
- White backgrounds with colored left borders
- Minimal gradients approach

## Quick Reference: Form Elements Sizing

**Standard Height for ALL Form Inputs:**
- Height: **33px**
- Applied to: Text inputs, dropdowns, buttons, date pickers, number inputs

**Standard Width for Form Inputs:**
- **Text Inputs (`StyledTextField`)**: Requires `className="w-full"` for 100% width
- **Select Dropdowns (`StyledSelect`)**: Defaults to 100% width automatically (`fullWidth={true}`)
  - Override with `fullWidth={false}` and `minWidth={value}` for compact dropdowns
- **Buttons**: Use `w-full md:w-auto` for responsive widths

**Component Defaults:**
| Component | Width Default | Height Default | Notes |
|-----------|--------------|----------------|-------|
| `StyledSelect` | ✅ `100%` (automatic) | ✅ `33px` (automatic) | Use `fullWidth={false}` to override |
| `StyledTextField` | ❌ Manual (`w-full`) | ✅ `33px` (automatic) | Must add `className="w-full"` |
| `StyledButton` | ❌ Manual | ✅ `33px` (automatic) | Use `w-full` or specific width |

## Layout Structure
- Fixed left sidebar with collapsible navigation
- Sticky top navigation bar
- Scrollable main content area (HubSpot-like layout)
- Sidebar uses icon-based navigation when collapsed

## Breadcrumb Navigation

**IMPORTANT: Breadcrumb height must be consistent across the entire ERP application.**

**Standard Breadcrumb Area Height: 40px**

**Quick Calculation:**
```
Container padding (top):    9.5px (py-[9.5px])
Content height:            20px  (text-sm with line-height)
Container padding (bottom): 9.5px (py-[9.5px])
Bottom border:              1px   (border-b)
───────────────────────────────
TOTAL HEIGHT:              40px
```

**⚠️ DO NOT CHANGE** the vertical padding (`py-[9.5px]`) as it breaks height consistency across all pages.

**📖 Complete Documentation:** See [Breadcrumb-Guidelines.md](./Breadcrumb-Guidelines.md) for comprehensive specifications including:
- Container structure and styling
- Typography specifications
- Status and state badges (In Stock, Editing, etc.)
- Navigation arrows (Previous/Next)
- Breadcrumb actions area
- Truncation behavior
- All breadcrumb states (View, Edit, With Status, With Navigation)
- Click interactions and custom handlers
- ModulePageTemplate props
- Accessibility requirements
- Best practices and common patterns
- Visual consistency checklist

**Key Styling (View Mode):**
```tsx
<div className="px-[21px] py-[9.5px] border-b bg-white border-gray-200">
  <div className="flex items-center justify-between">
    <Breadcrumbs breadcrumbs={breadcrumbs} />
    {breadcrumbActions}
  </div>
</div>
```

**Key Styling (Edit Mode):**
```tsx
<div 
  className="px-[21px] py-[9.5px] border-b border-[#5C1F3D]"
  style={{ background: 'linear-gradient(to right, #F5F7FA, #FFFFFF)' }}
>
  <div className="flex items-center justify-between">
    <Breadcrumbs breadcrumbs={breadcrumbs} editingMode={true} />
    {breadcrumbActions}
  </div>
</div>
```

## Form Elements

### Input Fields (Text, Number, Date, etc.)

**Standard Styling:**
```tsx
<input
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
  style={{ height: '33px' }}
  placeholder="Enter text"
/>
```

**Key Properties:**
- Height: 33px - consistent across all inputs
- Padding: `px-3 py-2` (12px horizontal, 8px vertical)
- Border: `border border-gray-300` with `rounded-[3px]` corners
- Text: `text-sm text-gray-900`
- Placeholder: `placeholder:text-gray-400`
- Focus state: `focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent`
- Background: `bg-white`

**Disabled State:**
```tsx
<input
  disabled
  className="w-full px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-gray-50 cursor-not-allowed"
  style={{ height: '33px' }}
/>
```

**Key Changes for Disabled:**
- Text color: `text-gray-400`
- Background: `bg-gray-50`
- Cursor: `cursor-not-allowed`

### Select Dropdowns

**IMPORTANT: Always use the MUI StyledSelect component instead of native HTML select elements for consistency across the ERP application.**

**Standard Form Select (Full Width - Default):**
```tsx
import { StyledSelect, MenuItem } from '../components/ui/StyledSelect';

<StyledSelect
  value={selectedValue}
  onChange={(e) => setSelectedValue(e.target.value)}
  style={{ fontSize: 'var(--text-sm)' }}
>
  <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Select option</MenuItem>
  <MenuItem value="option1" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Option 1</MenuItem>
  <MenuItem value="option2" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Option 2</MenuItem>
</StyledSelect>
```

**Note:** The `className="w-full"` is no longer needed - the component defaults to 100% width automatically.

**Key Properties:**
- **Component**: Always use `StyledSelect` from `/components/ui/StyledSelect.tsx` (MUI-based)
- **Font Size**: Set `style={{ fontSize: 'var(--text-sm)' }}` on StyledSelect
- **Menu Items**: Use `MenuItem` components instead of `<option>` tags
- **MenuItem Styling**: Each MenuItem must have `style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}`
- **Import**: `import { StyledSelect, MenuItem } from '../components/ui/StyledSelect';` (adjust path as needed)
- **Width**: Defaults to 100% width (`fullWidth={true}` by default). Override with `fullWidth={false}` and `minWidth={value}` if needed
- **Height**: Automatically set to 33px - standard across all form elements

**Component Defaults (Automatic):**
- ✅ **Width**: `fullWidth={true}` - Automatically spans 100% of parent container
- ✅ **Height**: 33px - Matches all other form inputs
- ✅ **Padding**: `12px` horizontal (left/right)
- ✅ **Border**: `1px solid #d1d5db` (gray-300)
- ✅ **Border Radius**: `4px` (MUI default)
- ✅ **Focus State**: Purple ring (`#5C1F3D`) with 2px border width
- ✅ **Background**: White

**Override Defaults (when needed):**

For compact dropdowns in toolbars or filters that need custom widths:
```tsx
<StyledSelect
  value={filterValue}
  onChange={(e) => setFilterValue(e.target.value)}
  fullWidth={false}  // Override default
  minWidth={150}     // Set custom width
  className="pl-3 pr-10 py-2"
  style={{ height: '32px', fontSize: 'var(--text-sm)' }}
>
  <MenuItem value="" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>All Items</MenuItem>
  <MenuItem value="option1" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Option 1</MenuItem>
</StyledSelect>
```

**Pagination Dropdown (compact width):**
```tsx
<StyledSelect
  value={pageSize}
  onChange={(e) => setPageSize(Number(e.target.value))}
  fullWidth={false}  // Override default
  minWidth={80}      // Compact width for pagination
  className="h-8 pl-2 pr-8 py-1"
  style={{ fontSize: 'var(--text-sm)' }}
>
  <MenuItem value="10" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>10</MenuItem>
  <MenuItem value="25" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>25</MenuItem>
  <MenuItem value="50" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>50</MenuItem>
</StyledSelect>
```

**Do NOT use native HTML select:**
```tsx
// ❌ INCORRECT - Do not use native select
<select className="w-full...">
  <option>Option</option>
</select>

// ✅ CORRECT - Use StyledSelect
<StyledSelect className="w-full" style={{ fontSize: 'var(--text-sm)' }}>
  <MenuItem value="option" style={{ fontSize: 'var(--text-sm)', textAlign: 'left' }}>Option</MenuItem>
</StyledSelect>
```

**Legacy Documentation (for reference only - DO NOT USE):**

<details>
<summary>Old native select styling (deprecated)</summary>

```tsx
<select
  className="w-full h-10 pl-3 pr-10 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white appearance-none"
  style={{ 
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: 'right 14px center' 
  }}
>
  <option value="">Select option</option>
  <option value="option1">Option 1</option>
</select>
```

This approach is deprecated. Always use StyledSelect instead.
</details>

### Labels

**Standard Styling:**
```tsx
<label className="block text-sm text-gray-700 mb-2">
  Field Name <span className="text-red-500">*</span>
</label>
```

**Key Properties:**
- Display: `block`
- Text size: `text-sm`
- Color: `text-gray-700`
- Margin bottom: `mb-2`
- Required indicator: `<span className="text-red-500">*</span>`

### Standard Action Buttons

**IMPORTANT: Use these standardized button styles for all action buttons across the ERP application, including Bottom Action Bars, modals, forms, and page actions.**

#### Button Variants

**Primary Button:**
```tsx
<button className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]" style={{ height: '33px' }}>
  <Save className="w-4 h-4" />
  <span>Save</span>
</button>
```

**Secondary/Outline Button:**
```tsx
<button className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" style={{ height: '33px' }}>
  <X className="w-4 h-4" />
  <span>Cancel</span>
</button>
```

**Danger/Destructive Button:**
```tsx
<button className="px-4 py-2 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#EF4444] text-white hover:bg-[#DC2626]" style={{ height: '33px' }}>
  <Trash2 className="w-4 h-4" />
  <span>Delete</span>
</button>
```

#### Button States

**Disabled State:**
```tsx
<button 
  disabled
  className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831] opacity-40 cursor-not-allowed pointer-events-none"
>
  <span>Save</span>
</button>
```

**Loading State:**
```tsx
<button className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831] opacity-40 cursor-not-allowed pointer-events-none">
  <Loader2 className="w-4 h-4 animate-spin" />
  <span>Saving...</span>
</button>
```

#### Design Specifications

**Core Properties:**
- **Height**: 33px - consistent with all form elements
- **Padding**: `px-4 py-2` (16px horizontal, 8px vertical)
- **Border Radius**: `rounded-[3px]` (3px) - matches ERP design system
- **Text Size**: `text-sm` (14px)
- **Layout**: `flex items-center justify-center gap-2` (flexbox with 8px icon-label gap)
- **Transition**: `transition-colors` (smooth color transitions, NO shadows)

**Focus State:**
- **Primary/Danger Buttons**: `focus:ring-2 focus:ring-[#5C1F3D]` (purple ring)
- **Secondary Buttons**: `focus:ring-2 focus:ring-gray-400` (gray ring)
- **All Buttons**: `focus:border-transparent focus:outline-none`

**Color Specifications:**

| Variant | Background | Text | Hover Background | Border | Focus Ring |
|---------|-----------|------|------------------|--------|------------|
| **Primary** | `bg-[#5C1F3D]` | `text-white` | `hover:bg-[#4a1831]` | None | `focus:ring-[#5C1F3D]` |
| **Secondary** | `bg-white` | `text-gray-700` | `hover:bg-gray-50` | `border border-gray-300` | `focus:ring-gray-400` |
| **Danger** | `bg-[#EF4444]` | `text-white` | `hover:bg-[#DC2626]` | None | `focus:ring-[#5C1F3D]` |

**Disabled State Properties:**
- Opacity: `opacity-40` (40%)
- Cursor: `cursor-not-allowed`
- Pointer Events: `pointer-events-none`
- Applied to ALL variants

**Icon Guidelines:**
- Size: `w-4 h-4` (16x16px)
- Gap from label: `gap-2` (8px)
- Use lucide-react icons
- Wrap label in `<span>` tag for proper alignment

#### Usage Context

**Bottom Action Bars:**
- Left-aligned: Cancel, Close, Delete, destructive actions (use `leftActionBarButtons` prop)
- Right-aligned: Save, Edit, Submit, primary actions (use `actionBarButtons` prop)

**Forms:**
- Submit buttons: Primary variant
- Cancel buttons: Secondary variant
- Delete/Remove buttons: Danger variant

**Modals:**
- Confirm/Save: Primary variant (right-aligned)
- Cancel/Close: Secondary variant (left-aligned)
- Destructive actions: Danger variant (left-aligned)

**Implementation Example (Bottom Action Bar):**
```tsx
<ModulePageTemplate
  showActionBar={true}
  leftActionBarButtons={[
    {
      label: 'Close',
      onClick: handleClose,
      variant: 'secondary' as const
    }
  ]}
  actionBarButtons={[
    {
      label: 'Edit',
      onClick: handleEdit,
      variant: 'primary' as const,
      icon: <Edit className="w-4 h-4" />
    }
  ]}
/>
```

## Bottom Action Bar

**IMPORTANT: Use this fixed bottom action bar pattern exclusively for EDIT MODE on detail pages. The action bar should appear conditionally when users are actively editing content.**

**When to Use:**
- **Edit mode ONLY** on item/record detail pages (Order Details, Invoice Details, Product Details, etc.)
- When users need quick access to "Save" or "Cancel" actions while scrolling through form fields
- To provide a persistent, always-visible way to commit or discard changes
- To prevent accidental navigation away from unsaved changes

**When NOT to Use:**
- View-only mode (use breadcrumb actions or page header buttons instead)
- List/table pages (use inline row actions or bulk action toolbars)
- Create/New item pages (use in-form button groups instead)

**Complete Implementation Pattern:**

### 1. Enable Bottom Action Bar in ModulePageTemplate (Edit Mode Only)

```tsx
<ModulePageTemplate
  breadcrumbs={['Dashboard', 'Orders', 'ORD-2024-001', editMode ? 'Edit' : 'View']}
  editingMode={editMode} // ✅ NEW: Shows "Editing" label beside breadcrumbs
  disableTemplatePadding={true} // Important: Page manages its own padding
  showActionBar={editMode} // ✅ CONDITIONAL - Only show in edit mode
  sidebarExpanded={sidebarExpanded} // For dynamic positioning
  leftActionBarButtons={[
    {
      label: 'Cancel',
      onClick: () => setEditMode(false),
      variant: 'secondary' as const
    }
  ]}
  actionBarButtons={[
    {
      label: 'Save Changes',
      onClick: handleSave,
      variant: 'primary' as const,
      icon: <Save className="w-4 h-4" />,
      loading: isSaving
    }
  ]}
>
  {/* Page content */}
</ModulePageTemplate>
```

### 2. Action Button Configuration (Edit Mode)

**Left-Aligned Button (Cancel Action):**
```tsx
leftActionBarButtons={[
  {
    label: 'Cancel',
    onClick: () => {
      // Discard changes and exit edit mode
      setEditMode(false);
      // Optionally reset form data
      resetFormData();
    },
    variant: 'secondary' as const
  }
]}
```

**Right-Aligned Button (Save Action):**
```tsx
actionBarButtons={[
  {
    label: 'Save Changes',
    onClick: handleSave,
    variant: 'primary' as const,
    icon: <Save className="w-4 h-4" />,
    loading: isSaving,
    disabled: !hasChanges // Disable if no changes made
  }
]}
```

### 3. Design Specifications

**Container Properties:**
- **Position**: `fixed bottom-0 right-0`
- **Height**: `h-12` (48px)
- **Padding**: `px-6` horizontal
- **Background**: `bg-white`
- **Border**: `border-t border-[#E5E7EB]`
- **Shadow**: `0 -2px 4px rgba(0,0,0,0.05)`
- **Z-Index**: `z-[100]`
- **Transition**: `transition-all duration-300`
- **Dynamic Left Position**: Adjusts based on sidebar state (expanded: 240px, collapsed: 54px)

**Button Specifications (within Action Bar):**
- **Height**: `h-8` (32px) - compact variant for action bar
- **Padding**: `px-4 py-1.5` (16px horizontal, 6px vertical)
- **Border Radius**: `rounded-[3px]` (3px)
- **Text Size**: `text-sm` (14px)
- **Icon Size**: `w-4 h-4` (16x16px)
- **Gap**: `gap-2` (8px between icon and label)
- **Spacing Between Buttons**: `gap-3` (12px)

**Layout Structure:**
```
EDIT MODE:
┌─────────────────────────────────────────────────────────────┐
│  Breadcrumb: Orders > ORD-2024-001 > Edit - [Editing]      │  ← "Editing" label appears
│  Page Content (editing form fields...)                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
│  Bottom Action Bar (48px height, white background)         │
│  ↕ 8px vertical padding                                    │
│  [Cancel] (32px)               [Save Changes] (32px) ──────→│
│  ↕ 8px vertical padding                                    │
│  Left-aligned                  Right-aligned                │
└─────────────────────────────────────────────────────────────┘

VIEW MODE:
┌─────────────────────────────────────────────────────────────┐
│  Breadcrumb: Orders > ORD-2024-001                          │  ← No "Editing" label
│  Breadcrumb Area: [Edit] [Delete] buttons                   │
│  Page Content (read-only)                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
(No bottom action bar - use breadcrumbActions prop instead)
```

**"Editing" Label:**
- **Appearance**: Gray badge with "Editing" text
- **Position**: After breadcrumb trail, before navigation arrows
- **Styling**: `bg-gray-50 text-gray-700 border-gray-200`
- **When to Show**: Only when `editingMode={true}` prop is passed
- **Purpose**: Clear visual indicator that the page is in edit mode


**Content Area Padding:**
- **With Action Bar**: `pb-[49px]` (49px bottom padding)
- **Gap from Bar**: 1px hairline separation
- **Calculation**: 49px padding - 48px bar height = 1px gap

### 4. Button Variants in Action Bar (Edit Mode Only)

**Primary Action (Right-Aligned) - Save:**
- Background: `bg-[#5C1F3D]`
- Text: `text-white`
- Hover: `hover:bg-[#4a1831]`
- Use for: Save, Save Changes, Submit

**Secondary Action (Left-Aligned) - Cancel:**
- Background: `bg-white`
- Border: `border border-gray-300`
- Text: `text-gray-700`
- Hover: `hover:bg-gray-50`
- Use for: Cancel (exits edit mode without saving)

### 5. Button States

**Normal State:**
```tsx
{
  label: 'Save Changes',
  onClick: handleSave,
  variant: 'primary' as const,
  icon: <Save className="w-4 h-4" />
}
```

**Loading State:**
```tsx
{
  label: 'Saving...',
  onClick: handleSave,
  variant: 'primary' as const,
  icon: <Save className="w-4 h-4" />,
  loading: true // Shows spinner, disables button
}
```

**Disabled State (No Changes):**
```tsx
{
  label: 'Save Changes',
  onClick: handleSave,
  variant: 'primary' as const,
  icon: <Save className="w-4 h-4" />,
  disabled: !hasChanges // 40% opacity, no pointer events
}
```

### 6. Sidebar Integration

**Dynamic Positioning:**
The action bar automatically adjusts its left position based on sidebar state:

```tsx
// In ModulePageTemplate component
const actionBarLeftPosition = sidebarExpanded ? sidebarExpandedWidth : sidebarCollapsedWidth;

// Applied to action bar
style={{ left: `${actionBarLeftPosition}px` }}
```

**Default Values:**
- Sidebar Expanded: 240px
- Sidebar Collapsed: 54px

**Custom Sidebar Widths:**
```tsx
<ModulePageTemplate
  showActionBar={true}
  sidebarExpanded={sidebarExpanded}
  sidebarExpandedWidth={280} // Custom width
  sidebarCollapsedWidth={60} // Custom width
  // ... other props
>
```

### 7. Complete Usage Example

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ModulePageTemplate } from '../components/layouts/ModulePageTemplate';
import { useSidebar } from '../contexts/SidebarContext';
import { Edit, Save } from 'lucide-react';

export function OrderDetailsView() {
  const navigate = useNavigate();
  const { sidebarExpanded } = useSidebar();
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ /* order data */ });
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveOrder(formData);
      setHasChanges(false);
      setEditMode(false); // Exit edit mode after successful save
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmed) return;
    }
    setEditMode(false);
    // Reset form data to original values
    resetFormData();
  };

  return (
    <ModulePageTemplate
      breadcrumbs={['Dashboard', 'Orders', 'ORD-2024-001', editMode ? 'Edit' : 'View']}
      editingMode={editMode} // ✅ Show "Editing" label in edit mode
      disableTemplatePadding={true}
      showActionBar={editMode} // ✅ Only show in edit mode
      sidebarExpanded={sidebarExpanded}
      breadcrumbActions={
        !editMode && ( // Show Edit button in breadcrumb area when NOT editing
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 h-10 text-sm rounded-[3px] transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-[#5C1F3D] text-white hover:bg-[#4a1831]"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        )
      }
      leftActionBarButtons={[
        {
          label: 'Cancel',
          onClick: handleCancel,
          variant: 'secondary' as const
        }
      ]}
      actionBarButtons={[
        {
          label: 'Save Changes',
          onClick: handleSave,
          variant: 'primary' as const,
          icon: <Save className="w-4 h-4" />,
          loading: isSaving,
          disabled: !hasChanges
        }
      ]}
    >
      {/* Order details content */}
      <div className="bg-white">
        {editMode ? (
          <OrderEditForm 
            data={formData} 
            onChange={(data) => {
              setFormData(data);
              setHasChanges(true);
            }}
          />
        ) : (
          <OrderDetailsReadOnly data={formData} />
        )}
      </div>
    </ModulePageTemplate>
  );
}
```

### 8. Best Practices

**Action Alignment:**
- ✅ **Left**: Cancel (exits edit mode without saving)
- ✅ **Right**: Save Changes (commits edits and exits edit mode)
- ❌ **Avoid**: Adding more than 2 buttons (keep it simple)

**Edit Mode Workflow:**
1. User clicks "Edit" button (in breadcrumb area or page header)
2. Page enters edit mode, bottom action bar appears
3. User makes changes to form fields
4. User scrolls through page, action bar remains fixed at bottom
5. User clicks "Save Changes" → data saved, edit mode exits, action bar disappears
6. OR user clicks "Cancel" → changes discarded, edit mode exits, action bar disappears

**Unsaved Changes Protection:**
- Show confirmation dialog when user clicks "Cancel" with unsaved changes
- Consider browser "beforeunload" event to warn about navigation with unsaved changes
- Disable "Save" button when no changes have been made

**Loading States:**
- Always show loading state during save operation
- Disable both "Save" and "Cancel" buttons while saving
- Update button label to reflect action (e.g., "Saving...")

**View Mode Actions:**
- Place "Edit", "Delete", "Close" buttons in the breadcrumb area using `breadcrumbActions` prop
- Do NOT use bottom action bar for view mode

**Responsive Behavior:**
- Action bar remains fixed at bottom on all screen sizes
- Maintains 48px height across breakpoints
- On mobile, consider stacking buttons if needed

**Content Padding:**
- Always set `disableTemplatePadding={true}` on ModulePageTemplate
- Apply `pb-[49px]` to page content when in edit mode
- Remove bottom padding when in view mode (no action bar)

### 9. Accessibility

**Keyboard Navigation:**
- All buttons are keyboard accessible (Tab to navigate)
- Enter/Space to activate
- Focus visible with purple ring (`focus:ring-2 focus:ring-[#5C1F3D]`)

**Screen Readers:**
- Button labels are descriptive ("Close", "Save Changes", not just icons)
- Loading states announced ("Saving...")
- Disabled states communicated

**Visual Feedback:**
- Hover states provide clear visual feedback
- Active/pressed states visible
- Loading spinner indicates progress

### 10. Technical Notes

**Required Props:**
- `showActionBar={true}` - Enables the action bar
- `disableTemplatePadding={true}` - Prevents double padding
- `sidebarExpanded={sidebarExpanded}` - For responsive positioning

**Optional Props:**
- `sidebarExpandedWidth` - Custom sidebar width (default: 240px)
- `sidebarCollapsedWidth` - Custom collapsed width (default: 54px)

**Action Button Interface:**
```tsx
interface ActionButton {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}
```

**Z-Index Management:**
- Action Bar: `z-[100]`
- Ensures bar appears above content
- Below modals/dialogs (typically `z-[200]` or higher)

### Badges

**Standard Badge:**
```tsx
<span className="px-3 py-1.5 text-sm rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
  Badge Text
</span>
```

**Mini Badge:**
```tsx
<span className="px-2 py-0.5 text-xs rounded bg-gray-50 text-gray-700 border border-gray-200">
  Badge Text
</span>
```

**Badge Variants:**
```tsx
{/* Success/Green Badge */}
<span className="px-2 py-0.5 text-xs rounded bg-green-50 text-green-700 border border-green-200">
  Success
</span>

{/* Error/Red Badge */}
<span className="px-2 py-0.5 text-xs rounded bg-red-50 text-red-700 border border-red-200">
  Error
</span>

{/* Warning/Yellow Badge */}
<span className="px-2 py-0.5 text-xs rounded bg-yellow-50 text-yellow-700 border border-yellow-200">
  Warning
</span>

{/* Info/Blue Badge */}
<span className="px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-700 border border-blue-200">
  Info
</span>
```

**Key Properties:**
- **Standard Badge**: `px-3 py-1.5`, `text-sm`, `rounded-lg`
- **Mini Badge**: `px-2 py-0.5`, `text-xs`, `rounded`
- Border: `border border-{color}-200`
- Background: `bg-{color}-50`
- Text: `text-{color}-700`

## Modal Overlays and Backdrops

**IMPORTANT: Use Gaussian blur for all modal and panel overlays to create visual depth and focus.**

**Centered Modal Dialogs:**
```tsx
{/* Modal Backdrop with blur */}
<div 
  className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
  onClick={() => setShowModal(false)}
/>
```

**Slide-Over Panels:**
```tsx
{/* Backdrop with subtle blur */}
<div 
  className="fixed inset-0 backdrop-blur-[2px] z-40 transition-opacity"
  onClick={() => setShowPanel(false)}
/>
```

**Key Properties:**
- **Centered Modals**: Use `bg-black/20 backdrop-blur-[2px]` for optimal visibility with subtle Gaussian blur effect
- **Slide-Over Panels**: Use `backdrop-blur-[2px]` for subtle blur effect
- **Z-Index**: Modal backdrop at `z-50`, panel backdrop at `z-40`
- **Interaction**: Always include `onClick` handler to close on backdrop click
- **Transition**: Add `transition-opacity` for smooth animations where applicable
- **Opacity**: Use `/20` (20% opacity) to ensure background content is clearly visible through the blur

## Close Button Component

**IMPORTANT: Always use the standardized CloseButton component for ALL modals, dialogs, and side panels across the ERP application.**

**When to Use:**
- Modal dialog headers (centered modals, confirmation dialogs)
- Side panel headers (slide-over panels, contextual panes)
- Drawer headers
- Any overlay component that can be closed by the user

**Component Import:**
```tsx
import { CloseButton } from '../../components/ui/CloseButton';
```

**Basic Usage:**
```tsx
{/* In modal/panel header */}
<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
  <div>
    <h3 className="text-base font-medium">Modal Title</h3>
    <p className="text-xs text-gray-500 mt-1">Optional description</p>
  </div>
  <CloseButton onClick={() => setShowModal(false)} />
</div>
```

**Size Variants:**
```tsx
{/* Small - 16x16 icon with 4px padding (compact headers) */}
<CloseButton onClick={handleClose} size="small" />

{/* Medium (default) - 20x20 icon with 6px padding (standard modals) */}
<CloseButton onClick={handleClose} size="medium" />

{/* Large - 24x24 icon with 8px padding (large dialogs) */}
<CloseButton onClick={handleClose} size="large" />
```

**Visual Variants:**
```tsx
{/* Default - Gray icon with light gray hover (most common) */}
<CloseButton onClick={handleClose} variant="default" />

{/* Dark - Darker gray icon with darker hover (for light backgrounds) */}
<CloseButton onClick={handleClose} variant="dark" />
```

**Component Props Interface:**
```tsx
interface CloseButtonProps {
  onClick: () => void;              // Required: Close handler function
  size?: 'small' | 'medium' | 'large';  // Optional: Size variant (default: 'medium')
  variant?: 'default' | 'dark';     // Optional: Color variant (default: 'default')
  className?: string;               // Optional: Additional CSS classes
  ariaLabel?: string;               // Optional: Accessibility label (default: 'Close')
}
```

**Do NOT use custom close buttons:**
```tsx
// ❌ INCORRECT - Custom close button
<button onClick={handleClose} className="p-2 hover:bg-gray-200 rounded">
  <X className="w-5 h-5 text-gray-500" />
</button>

// ✅ CORRECT - Standardized CloseButton component
<CloseButton onClick={handleClose} />
```

## Custom Date Range Picker (Modal Approach)

**IMPORTANT: Use this modal-based approach for ALL custom date range selection requirements in filter sections.**

**When to Use:**
- Filter sections with date range options
- Any scenario requiring custom date selection with start and end dates
- When quick preset options (Today, Last 7 Days, etc.) would enhance UX

**Complete Implementation Pattern:**

**1. Required State Variables:**
```tsx
const [showDateRangePicker, setShowDateRangePicker] = useState(false);
const [dateRange, setDateRange] = useState({ start: '', end: '' });
const [selectedDateRange, setSelectedDateRange] = useState('');
const [appliedDateRange, setAppliedDateRange] = useState<{ start: string; end: string } | null>(null);
```

**State Management Pattern:**
- `showDateRangePicker`: Controls modal visibility
- `dateRange`: Temporary working state for date inputs in modal (not applied until "Apply Filter" is clicked)
- `selectedDateRange`: Tracks which preset option is selected in dropdown ('today', 'this-month', 'custom', etc.)
- `appliedDateRange`: The confirmed/applied custom date range used for actual filtering (only set when user clicks "Apply Filter")

**2. Date Range Dropdown:**
```tsx
<StyledSelect 
  value={appliedDateRange ? `${new Date(appliedDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(appliedDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : selectedDateRange}
  onChange={(e) => {
    const value = e.target.value;
    // Check if user clicked on the custom date range display option (to edit it)
    if (appliedDateRange && value === `${new Date(appliedDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(appliedDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`) {
      setShowDateRangePicker(true);
      return;
    }
    setSelectedDateRange(value);
    if (value === 'custom') {
      setShowDateRangePicker(true);
    } else {
      setAppliedDateRange(null);
    }
  }}
>
  {appliedDateRange && (
    <MenuItem 
      value={`${new Date(appliedDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(appliedDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`} 
      sx={{ fontSize: '14px' }}
    >
      {new Date(appliedDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(appliedDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
    </MenuItem>
  )}
  <MenuItem value="" sx={{ fontSize: '14px' }}>All dates</MenuItem>
  <MenuItem value="today" sx={{ fontSize: '14px' }}>Today</MenuItem>
  <MenuItem value="this-week" sx={{ fontSize: '14px' }}>This Week</MenuItem>
  <MenuItem value="this-month" sx={{ fontSize: '14px' }}>This Month</MenuItem>
  <MenuItem value="last-month" sx={{ fontSize: '14px' }}>Last Month</MenuItem>
  <MenuItem value="custom" sx={{ fontSize: '14px' }}>Custom Range</MenuItem>
</StyledSelect>
```

**3. Applied Date Range Badge (DEPRECATED - DO NOT USE):**

<details>
<summary>Old separate badge approach (replaced by in-dropdown display)</summary>

```tsx
{appliedDateRange && (
  <div 
    className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm cursor-pointer hover:bg-blue-100 transition-colors self-end"
    onClick={() => setShowDateRangePicker(true)}
  >
    <Calendar className="w-4 h-4 text-blue-600" />
    <span className="text-blue-900">
      {new Date(appliedDateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(appliedDateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
    </span>
    <button
      onClick={(e) => {
        e.stopPropagation();
        setAppliedDateRange(null);
        setDateRange({ start: '', end: '' });
        setSelectedDateRange('');
      }}
      className="ml-1 hover:bg-blue-200 rounded p-0.5"
    >
      <XCircle className="w-3.5 h-3.5 text-blue-600" />
    </button>
  </div>
)}
```

This approach is deprecated. The custom date range now displays directly in the dropdown.
</details>

**4. Date Range Picker Modal:**
```tsx
{showDateRangePicker && (
  <>
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50" 
      onClick={() => {
        setShowDateRangePicker(false);
        if (!appliedDateRange) {
          setSelectedDateRange('');
        }
      }}
    />
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-[400px] max-h-[90vh] overflow-auto">
      {/* Modal Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base">Select Date Range</h3>
          <p className="text-xs text-gray-500 mt-1">Choose start and end dates for your filter</p>
        </div>
        <button
          onClick={() => {
            setShowDateRangePicker(false);
            if (!appliedDateRange) {
              setSelectedDateRange('');
            }
          }}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
        >
          <XCircle className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Modal Content */}
      <div className="px-6 py-4">
        {/* Date Input Fields */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">Date Range</label>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5">From</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1.5">To</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-[3px] text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5C1F3D] focus:border-transparent bg-white"
              />
            </div>
          </div>
        </div>

        {/* Quick Select Options */}
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-2">Quick Select</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Today', days: 0 },
              { label: 'Last 7 Days', days: 7 },
              { label: 'Last 30 Days', days: 30 },
              { label: 'This Month', days: 'month' },
              { label: 'Last Month', days: 'last-month' },
              { label: 'This Year', days: 'year' }
            ].map((option) => {
              // Calculate expected date range for this option to determine selected state
              const today = new Date().toISOString().split('T')[0];
              let expectedStart = today;
              let expectedEnd = today;
              
              if (typeof option.days === 'number') {
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - option.days);
                expectedStart = startDate.toISOString().split('T')[0];
              } else if (option.days === 'month') {
                const now = new Date();
                expectedStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
              } else if (option.days === 'last-month') {
                const now = new Date();
                expectedStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                expectedEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
              } else if (option.days === 'year') {
                const now = new Date();
                expectedStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
              }
              
              const isSelected = dateRange.start === expectedStart && dateRange.end === expectedEnd;
              
              return (
                <button
                  key={option.label}
                  onClick={() => {
                    const end = new Date().toISOString().split('T')[0];
                    let start = end;
                    
                    if (typeof option.days === 'number') {
                      const startDate = new Date();
                      startDate.setDate(startDate.getDate() - option.days);
                      start = startDate.toISOString().split('T')[0];
                    } else if (option.days === 'month') {
                      const now = new Date();
                      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                    } else if (option.days === 'last-month') {
                      const now = new Date();
                      start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
                      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
                      setDateRange({ start, end: lastDay });
                      return;
                    } else if (option.days === 'year') {
                      const now = new Date();
                      start = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
                    }
                    
                    setDateRange({ start, end });
                  }}
                  className={`px-3 py-1.5 text-xs border rounded-[3px] transition-colors ${
                    isSelected 
                      ? 'bg-purple-50 border-[#5C1F3D] text-[#5C1F3D]' 
                      : 'border-gray-300 hover:bg-gray-50 hover:border-[#5C1F3D]'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        {dateRange.start && dateRange.end && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-[3px]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-900">
                {new Date(dateRange.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(dateRange.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 rounded-b-xl">
        <button
          onClick={() => {
            setDateRange({ start: '', end: '' });
          }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Clear Selection
        </button>
        <div className="flex gap-2">
          <StyledButton
            variant="outline"
            size="small"
            onClick={() => {
              setShowDateRangePicker(false);
              if (!appliedDateRange) {
                setSelectedDateRange('');
                setDateRange({ start: '', end: '' });
              }
            }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            variant="primary"
            size="small"
            disabled={!dateRange.start || !dateRange.end}
            onClick={() => {
              if (dateRange.start && dateRange.end) {
                setAppliedDateRange({ ...dateRange });
                setShowDateRangePicker(false);
              }
            }}
          >
            Apply Filter
          </StyledButton>
        </div>
      </div>
    </div>
  </>
)}
```

**5. Filtering Logic (use appliedDateRange, not dateRange):**
```tsx
// In your useMemo for filtered data
if (appliedDateRange) {
  const startDate = new Date(appliedDateRange.start);
  const endDate = new Date(appliedDateRange.end);
  result = result.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });
} else if (selectedDateRange && selectedDateRange !== 'custom') {
  // Handle preset ranges (today, this-week, etc.)
}

// Include appliedDateRange in dependencies
}, [searchTerm, otherFilters, appliedDateRange, selectedDateRange]);
```

**6. Clear All Filters (reset all date range states):**
```tsx
const clearAllFilters = () => {
  setSelectedDateRange('');
  setAppliedDateRange(null);
  setDateRange({ start: '', end: '' });
  // ... reset other filters
};
```

**7. Active Filter Count and Badges:**
```tsx
const activeFilterCount = [
  selectedStatus,
  selectedAccount,
  appliedDateRange ? 'date' : selectedDateRange && selectedDateRange !== 'custom' ? 'date' : ''
].filter(Boolean).length;

// Filter results summary condition
{(selectedStatus || selectedAccount || appliedDateRange || (selectedDateRange && selectedDateRange !== 'custom')) && (
  // Show filter summary
)}
```

**Key UX Principles:**
- Modal provides better focus and prevents accidental changes
- Quick select buttons offer convenient presets
- Live preview shows selected range before applying
- Applied range appears as a badge for easy reference and modification
- Clicking badge reopens modal for editing
- Cancel preserves previously applied range
- Clear All resets everything including custom ranges

**Required Icons:**
```tsx
import { Calendar, XCircle } from 'lucide-react';
```

## Product Tabs with Count Badges

**IMPORTANT: Use this pattern for all tabbed navigation with data counts in ERP pages.**

**When to Use:**
- Module pages with multiple data views/tabs
- Scenarios where displaying item counts enhances UX
- Pages requiring clear visual indication of active tab state

**Complete Implementation Pattern:**

**Container Structure:**
```tsx
<div className="product-tabs flex gap-0 mb-0 relative bg-[#f7f8f9]" style={{ borderBottom: '1px solid #d1def0' }}>
  {/* Tab buttons here */}
</div>
```

**Individual Tab Button (with count badge):**
```tsx
<button
  onClick={() => {
    setActiveTab('tab-name');
    setCurrentPage(1);
    setSelectedRows([]);
    setSortField(null);
    setSortDirection(null);
  }}
  className={`content-stretch flex gap-[5px] items-center px-[12px] relative rounded-tl-[5px] rounded-tr-[5px] shrink-0 transition-colors ${
    activeTab === 'tab-name' ? 'bg-white py-[8px] mb-[-1px] pb-[9px] z-10' : 'py-[8px]'
  }`}
  style={activeTab === 'tab-name' ? { background: 'white' } : undefined}
  onMouseEnter={(e) => {
    if (activeTab !== 'tab-name') {
      e.currentTarget.style.background = 'rgba(9, 30, 66, 0.06)';
    }
  }}
  onMouseLeave={(e) => {
    if (activeTab !== 'tab-name') {
      e.currentTarget.style.background = '';
    } else {
      e.currentTarget.style.background = 'white';
    }
  }}
>
  {/* Border overlay for active tab */}
  {activeTab === 'tab-name' && (
    <div aria-hidden="true" className="absolute border-[#d1def0] border-[1px_1px_0px] border-solid inset-0 pointer-events-none rounded-tl-[5px] rounded-tr-[5px]" />
  )}
  
  {/* Tab icon */}
  <FileText className="w-[14px] h-[14px] shrink-0 relative" style={{ color: '#172b4d' }} />
  
  {/* Tab label */}
  <p className={`leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[12px] text-center text-nowrap whitespace-pre ${
    activeTab === 'tab-name' ? "font-['Poppins:Medium',sans-serif]" : "font-['Poppins:Regular',sans-serif]"
  }`}>
    Tab Label
  </p>
  
  {/* Count badge with conditional styling */}
  <span className={`px-2 py-0.5 text-xs rounded ${
    activeTab === 'tab-name' 
      ? 'bg-[#5C1F3D] text-white border border-[#5C1F3D]' 
      : 'bg-gray-50 text-gray-700 border border-gray-200'
  }`}>
    {dataArray.length}
  </span>
</button>
```

**Key Properties:**

**Container:**
- Background: `bg-[#f7f8f9]`
- Border bottom: `1px solid #d1def0`
- Layout: `flex gap-0 mb-0 relative`

**Tab Button:**
- Padding: `px-[12px]`, `py-[8px]` (inactive), `py-[8px] mb-[-1px] pb-[9px]` (active)
- Border radius: `rounded-tl-[5px] rounded-tr-[5px]` (top corners only)
- Gap between elements: `gap-[5px]`
- Transition: `transition-colors`
- Z-index: `z-10` for active tab

**Active State:**
- Background: `bg-white` (white)
- Explicit style: `{ background: 'white' }`
- Margin bottom: `mb-[-1px]` (overlaps container border)
- Padding bottom: `pb-[9px]` (compensates for negative margin)
- Border overlay: Absolute positioned div with `border-[#d1def0] border-[1px_1px_0px]`

**Inactive State:**
- Background: transparent
- Padding: `py-[8px]` only

**Hover Effect (Inactive Only):**
- Background: `rgba(9, 30, 66, 0.06)` (light blue-gray tint)
- Applied via inline style in `onMouseEnter`
- Removed via `onMouseLeave`

**Icon:**
- Size: `w-[14px] h-[14px]`
- Color: `#172b4d` (dark blue-gray)

**Label Text:**
- Size: `text-[12px]`
- Color: `text-[#172b4d]`
- Font: `Poppins:Medium` (active), `Poppins:Regular` (inactive)
- Styling: `leading-[normal] not-italic text-center text-nowrap whitespace-pre`

**Count Badge:**
- Padding: `px-2 py-0.5`
- Size: `text-xs`
- Border radius: `rounded`
- **Active Tab**: 
  - Background: `bg-[#5C1F3D]` (primary color)
  - Text: `text-white`
  - Border: `border border-[#5C1F3D]`
- **Inactive Tab**:
  - Background: `bg-gray-50`
  - Text: `text-gray-700`
  - Border: `border border-gray-200`

**State Management Pattern:**
```tsx
const [activeTab, setActiveTab] = useState('default-tab');
```

**Reset Actions on Tab Click:**
- Reset current page: `setCurrentPage(1)`
- Clear selections: `setSelectedRows([])`
- Reset sorting: `setSortField(null)`, `setSortDirection(null)`

**Visual Behavior:**
- Active tab appears "lifted" with white background and border
- Inactive tabs are flush with gray background
- Smooth color transition on hover for inactive tabs
- Count badges change from gray (inactive) to primary color (active)
- No hover effect on active tab

**Required Icons Example:**
```tsx
import { FileText, GitCompare, Package, FileCheck } from 'lucide-react';
```

## Table Row Hover Menu (Horizontal Icon Menu Pattern)

**IMPORTANT: Use this pattern for data tables requiring multiple actions (View, Edit, Delete) with a cleaner horizontal icon-only layout.**

**When to Use:**
- Data tables with 3+ row-level actions
- Finance and banking modules where space is premium
- Tables requiring destructive actions (Delete, Remove)
- When icon-only actions provide clearer visual hierarchy than text labels
- Scenarios where horizontal space is available but vertical dropdown would be too long

**Complete Implementation Pattern:**

**1. Required State Variables:**
```tsx
const [hoveredRow, setHoveredRow] = useState<number | null>(null);
const [openDropdown, setOpenDropdown] = useState<number | null>(null);
```

**2. Table Row Structure with Horizontal Icon Menu:**
```tsx
<tbody>
  {paginatedData.map((item) => (
    <tr
      key={item.id}
      onMouseEnter={() => setHoveredRow(item.id)}
      onMouseLeave={() => setHoveredRow(null)}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Main content (e.g., account name) */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-900">{item.name}</span>
            <span className="text-xs text-gray-500">{item.details}</span>
          </div>
          
          {/* Horizontal icon menu - visible only on hover */}
          {hoveredRow === item.id && (
            <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === item.id ? null : item.id);
                }}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* Horizontal dropdown with icon-only actions */}
              {openDropdown === item.id && (
                <>
                  {/* Backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(null);
                    }}
                  />
                  
                  {/* Horizontal menu */}
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 flex items-center divide-x divide-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(null);
                        // View action
                        handleViewItem(item);
                      }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(null);
                        // Edit action
                        handleEditItem(item);
                      }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      title="Edit item"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(null);
                        // Delete action
                        handleDeleteItem(item);
                      }}
                      className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </td>
      {/* Other table cells */}
    </tr>
  ))}
</tbody>
```

**Key Properties:**

**Table Row:**
- Add `onMouseEnter` and `onMouseLeave` handlers to track hover state
- Classes: `border-b border-gray-100 hover:bg-gray-50 transition-colors`
- No `group` class needed (uses state-based visibility)

**Menu Trigger Button:**
- Icon: `MoreVertical` from lucide-react (horizontal three dots)
- Size: `w-4 h-4`
- Color: `text-gray-600`
- Padding: `p-1`
- Hover: `hover:bg-gray-100`
- Border radius: `rounded`
- Conditional rendering: `{hoveredRow === item.id && ...}`

**Horizontal Dropdown Menu:**
- Position: `absolute right-0 top-full mt-1 z-20`
- Layout: `flex items-center divide-x divide-gray-200` (horizontal with dividers)
- Background: `bg-white`
- Border: `border border-gray-200`
- Border radius: `rounded-lg`
- Shadow: `shadow-lg`

**Icon-Only Action Buttons:**
- Padding: `px-3 py-2`
- Font size: `text-sm`
- Layout: `flex items-center gap-2`
- Icon size: `w-4 h-4`
- **Standard actions** (View, Edit):
  - Text color: `text-gray-700`
  - Icon color: `text-gray-500`
  - Hover: `hover:bg-gray-50`
- **Destructive actions** (Delete, Remove):
  - Text color: `text-red-600`
  - Icon color: `text-red-500`
  - Hover: `hover:bg-red-50`
- Include `title` attribute for accessibility tooltip

**Backdrop:**
- Position: `fixed inset-0 z-10`
- Invisible but clickable to close menu
- Prevents event propagation: `e.stopPropagation()`

**State Management:**
```tsx
// Track which row is being hovered
const [hoveredRow, setHoveredRow] = useState<number | null>(null);

// Track which dropdown is open
const [openDropdown, setOpenDropdown] = useState<number | null>(null);

// Row hover handlers
onMouseEnter={() => setHoveredRow(item.id)}
onMouseLeave={() => setHoveredRow(null)}

// Toggle dropdown
onClick={(e) => {
  e.stopPropagation();
  setOpenDropdown(openDropdown === item.id ? null : item.id);
}}

// Close dropdown after action
onClick={(e) => {
  e.stopPropagation();
  setOpenDropdown(null);
  // Perform action...
}}
```

**Required Imports:**
```tsx
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
```

**Visual Behavior:**
- Menu trigger appears when hovering over the row
- Clicking trigger button opens horizontal icon menu
- Menu appears below the trigger button, aligned to the right
- Icon-only buttons with tooltips on hover
- Visual dividers between action buttons
- Red styling for destructive actions
- Menu closes when clicking backdrop or selecting an action
- Smooth transitions on all interactions

**Accessibility Notes:**
- `title` attributes provide tooltips for icon-only buttons
- Keyboard accessible (tab navigation)
- Click outside to close (backdrop)
- Clear visual distinction for destructive actions (red color)
- Hover states provide clear feedback
- `stopPropagation()` prevents row click events from interfering

**Comparison with Vertical Dot Menu Pattern:**
- **Use Horizontal Icon Menu when:**
  - You have 3+ actions per row
  - Icon-only buttons are sufficient (tooltips provide context)
  - You need to include destructive actions (Delete)
  - Horizontal space is available
  - Cleaner visual appearance is desired
  
- **Use Vertical Dot Menu when:**
  - You have 2 simple actions (View, Edit)
  - Text labels improve clarity
  - Vertical space is limited
  - Standard dropdown pattern is preferred

**Extensibility:**
You can add more action buttons by adding additional buttons with dividers:
```tsx
<button
  onClick={(e) => {
    e.stopPropagation();
    setOpenDropdown(null);
    // Custom action
  }}
  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
  title="Custom action"
>
  <CustomIcon className="w-4 h-4 text-gray-500" />
</button>
```

## Pagination Component

**IMPORTANT: Use this standardized pagination pattern for ALL tables and data grids across the ERP application.**

**When to Use:**
- Any table or data grid displaying multiple rows of data
- List views in all modules (Inventory, Finance, Orders, Invoices, etc.)
- Search results pages
- Any scenario where data needs to be displayed in pages

**Complete Implementation Pattern:**

**1. Required State Variables:**
```tsx
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

// Calculate total pages
const totalPages = Math.ceil(totalItems / pageSize);

// Calculate paginated data
const paginatedData = useMemo(() => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredData.slice(startIndex, endIndex);
}, [filteredData, currentPage, pageSize]);
```

**2. Complete Pagination Bar Component:**
```tsx
<div className="px-4 py-3 flex items-center justify-between">
  {/* Left side - Rows per page selector */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-700">Rows per page:</span>
    <StyledSelect
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset to page 1 when changing page size
      }}
      minWidth={80}
    >
      <MenuItem value={10} sx={{ fontSize: '14px' }}>10</MenuItem>
      <MenuItem value={25} sx={{ fontSize: '14px' }}>25</MenuItem>
      <MenuItem value={50} sx={{ fontSize: '14px' }}>50</MenuItem>
    </StyledSelect>
  </div>

  {/* Right side - Page navigation */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-700">
      Page {currentPage} of {totalPages}
    </span>
    <div className="flex gap-1">
      {/* First page button */}
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
      >
        <ChevronsLeft className="w-4 h-4 text-gray-600 group-hover:text-white" />
      </button>
      
      {/* Previous page button */}
      <button
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-white" />
      </button>
      
      {/* Next page button */}
      <button
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
      >
        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
      </button>
      
      {/* Last page button */}
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="p-1 rounded hover:bg-[#5C1F3D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors group"
      >
        <ChevronsRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
      </button>
    </div>
  </div>
</div>
```

**Key Properties:**

**Container:**
- Padding: `px-4 py-3`
- Layout: `flex items-center justify-between` (rows selector on left, navigation on right)
- Background: Usually part of table footer or below table

**Rows Per Page Selector:**
- Label: `text-sm text-gray-700`
- Uses `StyledSelect` component with `minWidth={80}`
- Options: 10, 25, 50 (standard increments)
- Font size: `14px` on MenuItem
- **Behavior**: Resets to page 1 when page size changes

**Page Info Display:**
- Text: `text-sm text-gray-700`
- Format: "Page X of Y"

**Navigation Buttons:**
- Padding: `p-1` (compact)
- Border radius: `rounded`
- Icon size: `w-4 h-4`
- **Hover state**: `hover:bg-[#5C1F3D]` with icon color change to white using group classes
- **Disabled state**: 
  - Opacity: `disabled:opacity-40`
  - Cursor: `disabled:cursor-not-allowed`
  - Applied when at first/last page
- **Gap between buttons**: `gap-1`

**Button Icons (from lucide-react):**
- `ChevronsLeft`: Jump to first page
- `ChevronLeft`: Previous page
- `ChevronRight`: Next page
- `ChevronsRight`: Jump to last page

**State Management Best Practices:**
```tsx
// Reset to page 1 when filters change
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, selectedStatus, selectedCategory]);

// Reset to page 1 when changing tabs
const handleTabChange = (tab: string) => {
  setActiveTab(tab);
  setCurrentPage(1);
  setSelectedRows([]);
  setSortField(null);
  setSortDirection(null);
};
```

**Positioning in Table:**
```tsx
<div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
  {/* Table content */}
  <table className="w-full">
    {/* thead and tbody */}
  </table>
  
  {/* Pagination bar at the bottom */}
  <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
    {/* Pagination component here */}
  </div>
</div>
```

**Required Imports:**
```tsx
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { StyledSelect, MenuItem } from '../../components/ui/StyledSelect';
```

**Accessibility Notes:**
- Navigation buttons have clear disabled states
- Keyboard navigation supported
- Clear visual feedback on hover and disabled states
- Page info clearly displayed

**Visual Behavior:**
- Icons change from gray to white on hover with primary color background
- Smooth transitions on all interactions
- Disabled buttons clearly distinguishable
- Professional, clean appearance consistent with ERP design

## Item Details Contextual Pane v01

**IMPORTANT: Use this collapsible sidebar pattern for item/record detail views that require quick access to contextual information and insights.**

**When to Use:**
- Item detail pages where users need quick access to related information
- Product/inventory detail views with stock status and supplier data
- Record detail pages requiring contextual insights without cluttering the main view
- Scenarios where additional information should be accessible but not always visible

**Complete Implementation Pattern:**

### 1. Container Structure

```tsx
<div 
  className="item-contextual-pane bg-white border-r border-b border-gray-300 transition-all duration-150 flex-shrink-0 overflow-visible flex flex-col relative"
  style={{ width: contextPaneExpanded ? '280px' : '20px', height: '100%' }}
>
  {/* Collapse/Expand Button */}
  {/* Pane Content */}
</div>
```

**Key Properties:**
- **Width (Expanded)**: `280px`
- **Width (Collapsed)**: `20px` (just enough for the toggle button)
- **Height**: `100%` (full viewport height)
- **Background**: `bg-white`
- **Borders**: `border-r border-b border-gray-300`
- **Transition**: `transition-all duration-150` (smooth collapse/expand animation)
- **Layout**: `flex flex-col` (vertical stacking)
- **Position**: `relative` (for absolute positioned toggle button)
- **Overflow**: `overflow-visible` (allows toggle button to extend beyond pane)

### 2. Collapse/Expand Toggle Button

```tsx
<div className="absolute top-2 -right-3 z-10">
  <button
    onClick={() => setContextPaneExpanded(!contextPaneExpanded)}
    className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-md border-2 border-white"
    aria-label={contextPaneExpanded ? 'Collapse pane' : 'Expand pane'}
  >
    {contextPaneExpanded ? (
      <ChevronLeft className="w-3 h-3 text-white" />
    ) : (
      <ChevronRight className="w-3 h-3 text-white" />
    )}
  </button>
</div>
```

**Key Properties:**
- **Position**: `absolute top-2 -right-3` (positioned 3px outside the pane edge)
- **Size**: `w-6 h-6` (24x24px circular button)
- **Background**: `bg-blue-600` with `hover:bg-blue-700`
- **Shape**: `rounded-full`
- **Border**: `border-2 border-white` (creates visual separation from content)
- **Shadow**: `shadow-md` (subtle elevation)
- **Icon Size**: `w-3 h-3` (12x12px)
- **Icon Color**: `text-white`
- **Interaction**: `active:scale-95` (press animation)
- **Z-Index**: `z-10` (appears above pane content)

### 3. Fixed Header Card

```tsx
{contextPaneExpanded && (
  <div className="flex flex-col h-full">
    {/* Fixed Header Card */}
    <div className="p-3 border-b border-gray-200 bg-white flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
        {/* Three-dot menu button */}
        <button className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
        
        {/* Item Name */}
        <h3 className="text-sm mb-2 pr-6" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
          {selectedItem.itemName}
        </h3>
        
        {/* SKU */}
        <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {selectedItem.sku}
        </p>
        
        {/* Stock Status Badge */}
        <span className={`inline-flex items-center px-2 py-1 text-xs border ${
          selectedItem.stockStatus === 'In Stock'
            ? 'bg-green-50 text-green-700 border-green-200'
            : selectedItem.stockStatus === 'Low Stock'
              ? 'bg-orange-50 text-orange-700 border-orange-200'
              : 'bg-red-50 text-red-700 border-red-200'
        }`} style={{ borderRadius: '5px', fontFamily: 'Poppins, sans-serif' }}>
          {selectedItem.stockStatus.toUpperCase()}
        </span>
      </div>
      
      {/* Item Details Table (imported component) */}
      <div className="mt-3">
        <Frame1 />
      </div>
    </div>
  </div>
)}
```

**Key Properties:**
- **Container**: `p-3 border-b border-gray-200 bg-white flex-shrink-0` (fixed, won't scroll)
- **Inner Card**: `bg-white border border-gray-200 rounded-lg p-4 relative`
- **Three-Dot Menu**: `absolute top-3 right-3` with hover effect
- **Item Name**: `text-sm` (14px), Poppins font
- **SKU**: `text-xs text-gray-500` (12px gray text)
- **Status Badge**: Conditional colors (green/orange/red), `border-radius: 5px`
- **Status Variants**:
  - In Stock: `bg-green-50 text-green-700 border-green-200`
  - Low Stock: `bg-orange-50 text-orange-700 border-orange-200`
  - Out of Stock: `bg-red-50 text-red-700 border-red-200`

### 4. Scrollable Content with Gradient Overlays

```tsx
{/* Scrollable Content */}
<div className="flex-1 relative overflow-hidden">
  {/* Top gradient overlay with arrow */}
  <div 
    className="absolute top-0 left-0 right-0 z-10 transition-opacity duration-300 flex items-start justify-center pt-2 cursor-pointer"
    style={{
      height: '40px',
      background: 'linear-gradient(to bottom, rgba(243, 244, 246, 1) 0%, rgba(255, 255, 255, 0) 100%)',
      opacity: showTopGradient ? 1 : 0,
      pointerEvents: showTopGradient ? 'auto' : 'none'
    }}
    onClick={() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ top: -200, behavior: 'smooth' });
      }
    }}
  >
    <ChevronUp className="w-4 h-4 text-gray-800" />
  </div>
  
  {/* Bottom gradient overlay with arrow */}
  <div 
    className="absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-300 flex items-end justify-center pb-2 cursor-pointer"
    style={{
      height: '40px',
      background: 'linear-gradient(to top, rgba(243, 244, 246, 1) 0%, rgba(255, 255, 255, 0) 100%)',
      opacity: showBottomGradient ? 1 : 0,
      pointerEvents: showBottomGradient ? 'auto' : 'none'
    }}
    onClick={() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ top: 200, behavior: 'smooth' });
      }
    }}
  >
    <ChevronDown className="w-4 h-4 text-gray-800" />
  </div>
  
  {/* Scrollable area */}
  <div ref={scrollRef} className="absolute inset-0 overflow-y-auto px-3 pb-20 scroll-smooth">
    <div className="mt-2">
      <h3 className="text-sm mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Item Insights</h3>
      <Frame6 />
    </div>
    
    <div className="mt-6">
      <h3 className="text-sm mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Supplier Information</h3>
      <Frame2 />
    </div>
  </div>
</div>
```

**Key Properties:**

**Scrollable Container:**
- **Layout**: `flex-1 relative overflow-hidden` (takes remaining space, allows absolute positioning)
- **Scroll Area**: `absolute inset-0 overflow-y-auto px-3 pb-20 scroll-smooth`
- **Padding**: `px-3` horizontal, `pb-20` bottom (extra space for last section)

**Gradient Overlays:**
- **Height**: `40px`
- **Top Gradient**: `linear-gradient(to bottom, rgba(243, 244, 246, 1) 0%, rgba(255, 255, 255, 0) 100%)`
- **Bottom Gradient**: `linear-gradient(to top, rgba(243, 244, 246, 1) 0%, rgba(255, 255, 255, 0) 100%)`
- **Opacity**: Controlled by state (`showTopGradient`, `showBottomGradient`)
- **Transition**: `transition-opacity duration-300` (smooth fade in/out)
- **Pointer Events**: `pointerEvents: showGradient ? 'auto' : 'none'` (disabled when hidden)
- **Z-Index**: `z-10` (appears above scrollable content)
- **Interaction**: Clickable, scrolls content by 200px

**Scroll Arrow Icons:**
- **Size**: `w-4 h-4` (16x16px)
- **Color**: `text-gray-800`
- **Position**: Centered in gradient overlay

### 5. State Management

```tsx
// Required state variables
const [contextPaneExpanded, setContextPaneExpanded] = useState(true); // Pane visibility
const [showTopGradient, setShowTopGradient] = useState(false); // Top scroll indicator
const [showBottomGradient, setShowBottomGradient] = useState(true); // Bottom scroll indicator
const scrollRef = useRef<HTMLDivElement>(null); // Scroll container reference

// Scroll event handler to update gradient visibility
useEffect(() => {
  const scrollContainer = scrollRef.current;
  if (!scrollContainer) return;
  
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    
    // Show top gradient if scrolled down
    setShowTopGradient(scrollTop > 10);
    
    // Show bottom gradient if not at bottom
    setShowBottomGradient(scrollTop + clientHeight < scrollHeight - 10);
  };
  
  scrollContainer.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
  
  return () => scrollContainer.removeEventListener('scroll', handleScroll);
}, [contextPaneExpanded]);
```

### 6. Integration with Page Layout

```tsx
<div className="item-details-layout-wrapper flex gap-3 -m-6" style={{ height: 'calc(100vh - 120px)' }}>
  {/* Item Contextual Pane (Left) */}
  <div className="item-contextual-pane ...">
    {/* Pane content */}
  </div>
  
  {/* Main Content Area (Right) */}
  <div className="flex-1 bg-white border border-gray-300 overflow-hidden">
    {/* Main item details content */}
  </div>
</div>
```

**Key Properties:**
- **Layout**: `flex gap-3` (horizontal layout with 12px gap)
- **Negative Margin**: `-m-6` (extends to parent container edges)
- **Height**: `calc(100vh - 120px)` (full viewport minus header/breadcrumb)
- **Main Content**: `flex-1` (takes remaining space after pane)

### 7. Required Imports

```tsx
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import Frame1 from '../../imports/Frame3136'; // Item details table
import Frame6 from '../../imports/Frame3704'; // Item insights
import Frame2 from '../../imports/Frame3136-2223-1933'; // Supplier information
```

### 8. Design Specifications

**Color Palette:**
| Element | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| **Pane Container** | `bg-white` | N/A | `border-gray-300` | N/A |
| **Toggle Button** | `bg-blue-600` | `text-white` | `border-white` | `bg-blue-700` |
| **Header Card** | `bg-white` | `text-gray-900` | `border-gray-200` | N/A |
| **Three-Dot Menu** | Transparent | `text-gray-600` | None | `bg-gray-100` |
| **Status Badge (In Stock)** | `bg-green-50` | `text-green-700` | `border-green-200` | N/A |
| **Status Badge (Low Stock)** | `bg-orange-50` | `text-orange-700` | `border-orange-200` | N/A |
| **Status Badge (Out of Stock)** | `bg-red-50` | `text-red-700` | `border-red-200` | N/A |
| **Gradient Overlay** | `rgba(243, 244, 246, 1)` → transparent | N/A | None | N/A |
| **Scroll Arrow** | Transparent | `text-gray-800` | None | N/A |

**Typography:**
| Element | Font Family | Font Size | Font Weight | Color |
|---------|------------|-----------|-------------|-------|
| **Item Name** | Poppins | 14px | Normal | `text-gray-900` |
| **SKU** | Poppins | 12px | Normal | `text-gray-500` |
| **Status Badge** | Poppins | 12px | Normal | Contextual |
| **Section Headers** | Poppins | 14px | Normal | `text-gray-900` |

### 9. Visual Behavior

**Collapse/Expand Animation:**
- Pane width smoothly transitions from 280px to 20px
- Toggle button icon switches from ChevronLeft to ChevronRight
- Content visibility controlled by conditional rendering
- Duration: 150ms (`duration-150`)

**Scroll Indicators:**
- Top gradient fades in when scrolled down > 10px
- Bottom gradient fades out when reaching bottom (within 10px)
- Gradients are clickable and scroll content by 200px
- Smooth scroll behavior: `scroll-smooth`
- Scroll event updates gradient visibility in real-time

**Interactive Elements:**
- Toggle button scales down on press: `active:scale-95`
- Three-dot menu shows background on hover: `hover:bg-gray-100`
- Gradient overlays have smooth opacity transitions
- All interactions have smooth transitions

### 10. Accessibility

**Keyboard Navigation:**
- Toggle button is keyboard accessible (Tab to focus, Enter/Space to activate)
- Scroll container supports keyboard scrolling (arrow keys, Page Up/Down)
- Focus visible on interactive elements

**Screen Reader Support:**
- `aria-label` on toggle button describes current state
- Status badges use semantic color and text
- Section headers provide clear context

**Visual Feedback:**
- Clear hover states on all interactive elements
- Gradient overlays indicate scrollable content
- Toggle button icon indicates current state

### 11. Use Cases and Examples

**Inventory Management:**
- Item details page with stock status, supplier info, and insights
- Quick access to related data without leaving the detail view
- Collapsible to maximize space for main content

**Product Catalog:**
- Product details with images, specifications, and analytics
- Supplier information and pricing history
- Customer reviews and ratings summary

**Warehouse Management:**
- Bin location details with capacity and occupancy
- Recent stock movements and transactions
- Related warehouse zones and areas

### 12. Best Practices

**Content Organization:**
- ✅ Place most critical info in fixed header (always visible)
- ✅ Use scrollable area for supplementary data
- ✅ Group related information under clear section headers
- ❌ Avoid overloading the pane with too much information

**Performance:**
- ✅ Use conditional rendering to mount content only when expanded
- ✅ Optimize scroll event listener with throttling if needed
- ✅ Lazy load heavy components (charts, tables) in scrollable area
- ❌ Avoid complex animations that may cause jank

**Responsive Design:**
- Consider hiding the pane on mobile devices (< 768px)
- Use a modal/drawer approach on smaller screens
- Ensure toggle button is easily tappable on touch devices

**User Experience:**
- Default to expanded state if space permits
- Remember user's collapse/expand preference (localStorage)
- Provide clear visual indicators for scrollable content
- Ensure main content remains usable when pane is expanded

### 13. Common Patterns

**With Imported Frame Components:**
```tsx
{/* Use pre-built Figma-imported components */}
<Frame1 /> {/* Item details table */}
<Frame6 /> {/* Item insights */}
<Frame2 /> {/* Supplier information */}
```

**With Custom Content:**
```tsx
{/* Build custom content inline */}
<div className="mt-2">
  <h3 className="text-sm mb-3">Recent Transactions</h3>
  <div className="space-y-2">
    {transactions.map(tx => (
      <div key={tx.id} className="p-2 bg-gray-50 rounded">
        {/* Transaction details */}
      </div>
    ))}
  </div>
</div>
```

## Mini KPI Cards (Compact Horizontal Layout)

**IMPORTANT: Use this standardized mini KPI card pattern for all metric displays, summary sections, and dashboard KPIs across the ERP application.**

**When to Use:**
- Overview sections on detail pages (Item Details, Bundle Details, Order Details, etc.)
- Dashboard KPI rows
- Summary metrics at the top of data tables
- Stock availability summaries
- Any scenario requiring compact, scannable metrics display

### Complete Implementation Pattern

**Container:**
```tsx
<div className="grid grid-cols-4 gap-3 mb-6">
  {/* KPI Cards */}
</div>
```

**Individual Mini KPI Card:**
```tsx
<div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
  {/* Icon Badge */}
  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
    <Package className="w-3.5 h-3.5 text-blue-600" />
  </div>
  
  {/* Content */}
  <div className="flex-1 min-w-0">
    <p className="text-xs text-gray-600">Total Stock</p>
    <p className="text-lg text-gray-900 font-medium">1,234 units</p>
  </div>
</div>
```

### Design Specifications

**Card Container:**
- **Background**: `bg-white` (unified white, no colored backgrounds)
- **Border**: `border border-gray-200` (subtle gray, consistent across all cards)
- **Border Radius**: `rounded-lg` (8px)
- **Padding**: `px-3 py-2.5` (12px horizontal, 10px vertical)
- **Layout**: `flex items-center gap-3` (horizontal icon-content layout)
- **Gap**: `gap-3` (12px between cards in grid)

**Icon Badge:**
- **Size**: `w-5 h-5` (20x20px circular badge)
- **Shape**: `rounded-full`
- **Background**: Contextual light color (`bg-blue-100`, `bg-green-100`, `bg-purple-100`, etc.)
- **Icon Size**: `w-3.5 h-3.5` (14x14px)
- **Icon Color**: Contextual darker color (`text-blue-600`, `text-green-600`, etc.)
- **Flex**: `flex-shrink-0` (prevents badge from shrinking)
- **Layout**: `flex items-center justify-center` (centers icon in badge)

**Content Wrapper:**
- **Layout**: `flex-1 min-w-0` (takes remaining space, handles overflow)
- **Vertical Stacking**: Natural block stacking (no margin needed)

**Label (Top Line):**
- **Font Size**: `text-xs` (12px)
- **Color**: `text-gray-600` (unified muted gray for all cards)
- **Element**: `<p>` tag

**Value (Bottom Line):**
- **Font Size**: `text-lg` (18px)
- **Color**: `text-gray-900` (unified dark gray for all cards)
- **Font Weight**: `font-medium`
- **Element**: `<p>` tag

### Color Mapping (Icon Badges)

| Metric Type | Badge Background | Icon Color | Use Case |
|------------|------------------|------------|----------|
| **Primary/Code** | `bg-blue-100` | `text-blue-600` | Bundle Code, Order ID, Item Code |
| **Money/Price** | `bg-green-100` | `text-green-600` | Prices, Revenue, Payments |
| **Quantity/Stock** | `bg-purple-100` | `text-purple-600` | Stock levels, Quantities |
| **Status (Active)** | `bg-green-100` | `text-green-600` | Active status indicators |
| **Status (Inactive)** | `bg-gray-100` | `text-gray-600` | Inactive/disabled status |
| **Status (Error)** | `bg-red-100` | `text-red-600` | Error/critical status |
| **Warnings** | `bg-orange-100` | `text-orange-600` | Alerts, Low stock warnings |
| **Info/General** | `bg-blue-100` | `text-blue-600` | General information |

### Grid Layouts

**4-Column Grid (Most Common):**
```tsx
<div className="grid grid-cols-4 gap-3 mb-6">
  {/* 4 KPI cards */}
</div>
```

**3-Column Grid:**
```tsx
<div className="grid grid-cols-3 gap-3 mb-6">
  {/* 3 KPI cards */}
</div>
```

**Responsive Grid (4 → 2 → 1):**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  {/* Responsive KPI cards */}
</div>
```

### Conditional Badge Colors (Status-Based)

**For dynamic status-based cards:**
```tsx
<div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
    status === 'Active' 
      ? 'bg-green-100' 
      : status === 'Inactive'
      ? 'bg-gray-100'
      : 'bg-red-100'
  }`}>
    <StatusIcon className={`w-3.5 h-3.5 ${
      status === 'Active' 
        ? 'text-green-600' 
        : status === 'Inactive'
        ? 'text-gray-600'
        : 'text-red-600'
    }`} />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-xs text-gray-600">Status</p>
    <p className="text-lg text-gray-900 font-medium">{status}</p>
  </div>
</div>
```

### Common Examples

**Bundle Details Overview:**
```tsx
<div className="grid grid-cols-4 gap-3 mb-6">
  {/* Bundle Code */}
  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <Box className="w-3.5 h-3.5 text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-600">Bundle Code</p>
      <p className="text-lg text-gray-900 font-medium">BDL-GAMING-001</p>
    </div>
  </div>

  {/* Bundle Price */}
  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
      <DollarSign className="w-3.5 h-3.5 text-green-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-600">Bundle Price</p>
      <p className="text-lg text-gray-900 font-medium">₹1,44,900</p>
    </div>
  </div>

  {/* Stock */}
  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
      <Layers className="w-3.5 h-3.5 text-purple-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-600">Stock</p>
      <p className="text-lg text-gray-900 font-medium">5 items</p>
    </div>
  </div>

  {/* Status */}
  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-600">Status</p>
      <p className="text-lg text-gray-900 font-medium">Active</p>
    </div>
  </div>
</div>
```

**Stock Availability Summary:**
```tsx
<div className="grid grid-cols-3 gap-3 mb-6">
  {/* Total Assembled */}
  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
      <Package className="w-3.5 h-3.5 text-green-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-600">Total Assembled</p>
      <p className="text-lg text-gray-900 font-medium">87</p>
    </div>
  </div>

  {/* Can Assemble */}
  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <Wrench className="w-3.5 h-3.5 text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-600">Can Assemble</p>
      <p className="text-lg text-gray-900 font-medium">143</p>
    </div>
  </div>

  {/* Total Capacity */}
  <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
      <Boxes className="w-3.5 h-3.5 text-purple-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-600">Total Capacity</p>
      <p className="text-lg text-gray-900 font-medium">230</p>
    </div>
  </div>
</div>
```

### Benefits of Mini KPI Cards

✅ **Compact & Space-Efficient** - ~40% less vertical space than traditional large cards  
✅ **High Information Density** - More metrics visible without scrolling  
✅ **Consistent Visual Hierarchy** - Icon badges serve as quick visual identifiers  
✅ **Unified Color Scheme** - White backgrounds with gray borders reduce visual noise  
✅ **Better Scannability** - Horizontal layout makes labels and values easy to parse  
✅ **Modern ERP Aesthetic** - Subtle, professional, data-focused design  
✅ **Responsive** - Works well in 2, 3, or 4-column grids  

### Do NOT Use

❌ **Old style with full colored backgrounds:**
```tsx
// INCORRECT - Do not use
<div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
  <Icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
  <span className="text-sm text-blue-700 mb-1 block">Label</span>
  <p className="text-xl text-blue-900">Value</p>
</div>
```

❌ **Vertical layout with large icons**  
❌ **Contextual colored backgrounds for each card**  
❌ **Centered text alignment**  
❌ **Large padding (p-4, p-6)**  

### Accessibility

- **Semantic HTML**: Use `<p>` tags for labels and values
- **Color Independence**: Information conveyed through text, not just icon color
- **Contrast**: Text meets WCAG AA standards (gray-600 on white, gray-900 on white)
- **Icon Size**: 14px icons are large enough to be recognizable

### Required Imports

```tsx
import { 
  Box, Package, Layers, DollarSign, Info, 
  CheckCircle2, Wrench, Boxes, TrendingUp 
} from 'lucide-react';
```

## Mini KPI Cards with Horizontal Scroll Arrows

**IMPORTANT: Use this pattern for KPI card rows that may contain more cards than fit in the viewport, requiring horizontal scrolling.**

**When to Use:**
- Dashboard KPI rows with 5+ metrics
- Pricing overview sections with multiple price points
- Sales metrics with 6+ data points
- Any KPI row where content overflow is expected or dynamic

### Complete Implementation Pattern

**1. Required State Variables:**
```tsx
const pricingKpiScrollRef = useRef<HTMLDivElement>(null);
const [showLeftArrow, setShowLeftArrow] = useState(false);
const [showRightArrow, setShowRightArrow] = useState(true);
```

**2. Scroll Handler Function:**
```tsx
const scrollKPICards = (direction: "left" | "right") => {
  if (!pricingKpiScrollRef.current) return;
  
  const scrollAmount = 300; // Pixels to scroll per click
  const newScrollLeft =
    direction === "left"
      ? pricingKpiScrollRef.current.scrollLeft - scrollAmount
      : pricingKpiScrollRef.current.scrollLeft + scrollAmount;
  
  pricingKpiScrollRef.current.scrollTo({
    left: newScrollLeft,
    behavior: "smooth",
  });
};
```

**3. Scroll Event Listener (Update Arrow Visibility):**
```tsx
useEffect(() => {
  const scrollContainer = pricingKpiScrollRef.current;
  if (!scrollContainer) return;
  
  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    
    // Show left arrow if scrolled right
    setShowLeftArrow(scrollLeft > 10);
    
    // Show right arrow if not at the end
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };
  
  scrollContainer.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check
  
  return () => scrollContainer.removeEventListener('scroll', handleScroll);
}, []);
```

**4. Complete Container Structure:**
```tsx
<div className="relative mb-6">
  {/* Left Scroll Arrow */}
  {showLeftArrow && (
    <button
      onClick={() => scrollKPICards("left")}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-50 hover:border-gray-400 transition-all"
      aria-label="Scroll left"
    >
      <ChevronLeft className="w-4 h-4 text-gray-600" />
    </button>
  )}

  {/* Right Scroll Arrow */}
  {showRightArrow && (
    <button
      onClick={() => scrollKPICards("right")}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-50 hover:border-gray-400 transition-all"
      aria-label="Scroll right"
    >
      <ChevronRight className="w-4 h-4 text-gray-600" />
    </button>
  )}

  {/* Scrollable KPI Cards Container */}
  <div
    ref={pricingKpiScrollRef}
    className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
    style={{
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    }}
  >
    {/* KPI Cards (using mini card pattern) */}
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-3 flex-shrink-0 min-w-[200px]">
      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <Package className="w-3.5 h-3.5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600">Metric Name</p>
        <p className="text-lg text-gray-900 font-medium">Value</p>
      </div>
    </div>
    
    {/* More cards... */}
  </div>
</div>
```

### Design Specifications

**Scroll Arrow Buttons:**
- **Size**: `w-8 h-8` (32x32px)
- **Shape**: `rounded-full` (circular)
- **Position**: `absolute left-0/right-0 top-1/2 -translate-y-1/2` (vertically centered)
- **Z-Index**: `z-20` (appears above cards)
- **Background**: `bg-white`
- **Border**: `border border-gray-300`
- **Shadow**: `shadow-md` (subtle elevation)
- **Hover State**: `hover:bg-gray-50 hover:border-gray-400`
- **Icon Size**: `w-4 h-4` (16x16px)
- **Icon Color**: `text-gray-600`

**Scrollable Container:**
- **Layout**: `flex gap-3 overflow-x-auto scroll-smooth`
- **Scrollbar Hide**: `scrollbar-hide` class + inline styles
- **Inline Styles**: `scrollbarWidth: "none"`, `msOverflowStyle: "none"` (hide scrollbar in Firefox/IE)

**Individual Cards in Scroll Container:**
- **Flex**: `flex-shrink-0` (prevents cards from shrinking)
- **Min Width**: `min-w-[200px]` (ensures minimum card width)
- **All other styling**: Follow standard mini KPI card pattern

**Arrow Visibility Logic:**
- **Left Arrow**: Show when `scrollLeft > 10` (scrolled right by at least 10px)
- **Right Arrow**: Show when `scrollLeft + clientWidth < scrollWidth - 10` (not at end)
- **Initial State**: Left arrow hidden, right arrow visible (assuming content overflows)

### Scroll Behavior

**Scroll Amount:** 300px per click (configurable)  
**Scroll Type:** Smooth scroll (`behavior: "smooth"`)  
**Update Frequency:** On scroll event (real-time arrow visibility updates)

### Common Use Cases

**Dashboard KPI Row (6+ Metrics):**
```tsx
{/* Example: Bundles dashboard with 8 KPIs */}
<div className="relative mb-6">
  {/* Arrows */}
  <div ref={kpiScrollRef} className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide">
    {kpiData.map(kpi => (
      <div key={kpi.id} className="flex-shrink-0 min-w-[200px]">
        {/* Mini KPI Card */}
      </div>
    ))}
  </div>
</div>
```

**Pricing Overview (Multiple Price Points):**
```tsx
{/* Example: Product pricing with base price, discounts, margins, etc. */}
<div className="relative mb-6">
  {/* Arrows */}
  <div ref={pricingScrollRef} className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide">
    {pricingMetrics.map(metric => (
      <div key={metric.id} className="flex-shrink-0 min-w-[200px]">
        {/* Mini KPI Card */}
      </div>
    ))}
  </div>
</div>
```

### Visual Behavior

- **Arrow Appearance**: Smooth fade-in when needed, fade-out when not
- **Hover Effect**: Background darkens, border strengthens (subtle feedback)
- **Click Action**: Smooth scroll 300px left/right
- **Scroll Update**: Arrows update visibility based on scroll position
- **No Scrollbar**: Hidden scrollbar provides cleaner appearance

### Accessibility

- **Keyboard Navigation**: Scroll container supports keyboard scrolling (arrow keys, Tab)
- **ARIA Labels**: `aria-label="Scroll left"` and `aria-label="Scroll right"`
- **Focus Visible**: Arrow buttons show focus ring when keyboard-focused
- **Screen Readers**: Buttons announced as "Scroll left button" / "Scroll right button"

### Required Imports

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
```

### Best Practices

✅ **Always hide scrollbar** - Use `scrollbar-hide` class + inline styles  
✅ **Set min-width on cards** - Ensures cards don't shrink below readable size  
✅ **Use smooth scroll** - Better UX than instant jumps  
✅ **Update arrows on scroll** - Real-time feedback prevents confusion  
✅ **Use ref for scroll container** - Required for programmatic scrolling  
✅ **Add flex-shrink-0 to cards** - Prevents unwanted shrinking  

❌ **Don't use hard-coded arrow visibility** - Always calculate dynamically  
❌ **Don't forget initial scroll check** - Run `handleScroll()` on mount  
❌ **Don't use fixed card widths in grid** - Use flexbox with min-width instead  
❌ **Don't show arrows when content fits** - Only show when overflow exists  

### Integration with Mini KPI Cards

This pattern works seamlessly with the Mini KPI Card pattern. Simply:
1. Wrap the mini KPI cards in the scrollable container
2. Add `flex-shrink-0 min-w-[200px]` to each card
3. Change grid layout to `flex gap-3`
4. Add scroll arrows and event listeners

### Advanced: Dynamic Card Count Detection

For automatically determining if scroll arrows are needed:

```tsx
const [needsScroll, setNeedsScroll] = useState(false);

useEffect(() => {
  const scrollContainer = pricingKpiScrollRef.current;
  if (!scrollContainer) return;
  
  // Check if content overflows
  const checkOverflow = () => {
    setNeedsScroll(scrollContainer.scrollWidth > scrollContainer.clientWidth);
  };
  
  checkOverflow();
  window.addEventListener('resize', checkOverflow);
  
  return () => window.removeEventListener('resize', checkOverflow);
}, []);

// Only render arrows if content needs scrolling
{needsScroll && showLeftArrow && <button>...</button>}
```

## AI Features

### AI Suggestions Styling
- Purple sparkle icons for AI assistance
- Background: `bg-purple-50` with `border-purple-200`
- Left border: `border-l-4 border-[#5C1F3D]` for important AI sections
- Gradient backgrounds: `bg-gradient-to-r from-purple-50 to-pink-50`

### AI Panel
- Width: `w-80` (320px)
- Sparkles icon for AI branding
- Purple accent colors throughout

## Typography

**Important:** Do not output Tailwind classes for:
- Font size (e.g., `text-2xl`)
- Font weight (e.g., `font-bold`)
- Line-height (e.g., `leading-none`)

...unless the user specifically requests changes to these properties. Default typography is set up in `/styles/globals.css`.

## Border Radius
- Standard: `rounded-[3px]` (3px)
- Outline buttons use 3px border radius

## Spacing
- Form grid gap: `gap-6`
- Section spacing: `space-y-4` or `space-y-6`
- Card padding: `p-6` or `p-4`

## Responsive Design
- Use responsive classes: `md:grid-cols-2`, `md:col-span-2`
- Mobile-first approach
- Ensure proper stacking on smaller screens

## General Guidelines
- Always use consistent heights across form elements (h-10 / 40px)
- Ensure proper spacing and alignment
- Use purple (#5C1F3D) for primary actions and AI features
- Maintain visual hierarchy with proper contrast
- Follow accessibility best practices (labels, focus states, etc.)
- **IMPORTANT**: Always use `StyledSelect` and `MenuItem` components for ALL dropdown/select elements instead of native HTML `<select>` tags

## Form Layout Patterns

### Add New Item Form - Layout V1 (Legacy - Sequential Vertical Layout)

**Name:** Sequential Vertical Layout with Inline Sections

**Description:** This was the original layout for the "Add New Item" form where all sections flow vertically in the left column first, then the right column, with vendor information spanning full width at the bottom.

**Layout Structure:**

```
┌─────────────────────────────────────────────────────────────────┐
│  LEFT COLUMN                    │  RIGHT COLUMN                  │
├─────────────────────────────────┼────────────────────────────────┤
│  Basic Information              │  Additional Details            │
│  - Item Type*                   │  - Barcode                     │
│  - Brand Name                   │  - QR Code                     │
│  - Category Name*               │  - Dimensions (L/W/H/Unit)     │
│  - Item Name*                   │  - Weight (Value/Unit)         │
│  - Measuring Unit*              │  - Product Image Upload        │
│  - Description                  │  - Tracking Options            │
│                                 │    (Batch/Serial/Expiry)       │
│  GST Details                    │  - Default Bin Location        │
│  - GST Applicability Toggle     │    (Warehouse/Zone/Aisle/etc)  │
│  - HSN/SAC Code* (searchable)   │                                │
│  - GST Rate*                    │                                │
│                                 │                                │
│  Inventory & Valuation          │                                │
│  (Only for Goods)               │                                │
│  - Re-Order Level               │                                │
│  - Low Stock Alert Level        │                                │
│  - Valuation Method             │                                │
│  - Opening Stock (Yes/No)       │                                │
│    - Warehouse*                 │                                │
│    - Opening Stock Count*       │                                │
├─────────────────────────────────┴────────────────────────────────┤
│  Vendor Information (Full Width)                                 │
│  - Add Vendor button (top-right)                                 │
│  - Vendor table with bulk operations                             │
│  - Checkbox selection for bulk remove                            │
└──────────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- **Left Column Priority:** All primary/required fields flow down the left column first
- **Inline Section Headers:** Each section (Basic Information, GST Details, Inventory & Valuation) has its own header within the column
- **Right Column:** Contains supplementary information (Additional Details for Goods items)
- **Conditional Sections:** Inventory & Valuation and Additional Details only appear when Item Type = "Goods"
- **Full-Width Footer:** Vendor Information spans both columns at the bottom
- **Vertical Flow:** User reads top-to-bottom in left column, then top-to-bottom in right column

**Use Cases:**
- Original implementation of Item Master "Add New Item" form
- Simple forms where fields have natural sequential dependency
- When most fields are required and should be filled top-to-bottom

**Replaced By:** Layout V2 (Grouped Section Headers Layout) - see below

### Add New Item Form - Layout V2 (Current - Grouped Section Headers Layout)

**Name:** Grouped Section Headers Layout

**Description:** Current layout for the "Add New Item" form with full-width section headers that group related content across both columns, creating clearer visual hierarchy and logical field grouping.

**Layout Structure:**

```
┌──────────────────────────────────────────────────────────────────┐
│  BASIC INFORMATION (Full-Width Section Header)                   │
├─────────────────────────────────┬────────────────────────────────┤
│  LEFT COLUMN                    │  RIGHT COLUMN                  │
│  - Item Type*                   │  (Empty)                       │
│  - Brand Name                   │                                │
│  - Category Name*               │                                │
│  - Item Name*                   │                                │
│  - Measuring Unit*              │                                │
│  - Description                  │                                │
├─────────────────────────────────┴────────────────────────────────┤
│  GST DETAILS (Full-Width Section Header)                         │
├──────────────────────────────────────────────────────────────────┤
│  - GST Applicability Toggle (Yes/No)                             │
│  - HSN/SAC Code* (searchable dropdown)                           │
│  - GST Rate* (dropdown)                                          │
├─────────────────────────────────┬────────────────────────────────┤
│  INVENTORY & VALUATION          │  ADDITIONAL DETAILS            │
│  (Only for Goods)               │  (Only for Goods)              │
│  - Re-Order Level               │  - Barcode                     │
│  - Low Stock Alert Level        │  - QR Code                     │
│  - Valuation Method             │  - Dimensions (L/W/H/Unit)     │
│  - Opening Stock (Yes/No)       │  - Weight (Value/Unit)         │
│    - Warehouse*                 │  - Product Image Upload        │
│    - Opening Stock Count*       │  - Tracking Options            │
│                                 │    (Batch/Serial/Expiry)       │
│                                 │  - Default Bin Location        │
│                                 │    (Warehouse/Zone/Aisle/etc)  │
├─────────────────────────────────┴────────────────────────────────┤
│  VENDOR INFORMATION (Full-Width Section Header)                  │
│  - Add Vendor button (top-right)                                 │
│  - Vendor table with bulk operations                             │
│  - Checkbox selection for bulk remove                            │
└──────────────────────────────────────────────────────────────────┘
```

**Key Characteristics:**
- **Full-Width Section Headers:** Major sections (Basic Information, GST Details, Inventory & Valuation + Additional Details, Vendor Information) span the full form width
- **Grouped GST Section:** GST fields are grouped under a single full-width header for better visibility
- **Side-by-Side Middle Sections:** Inventory & Valuation and Additional Details appear as peer sections in the same row
- **Clearer Visual Hierarchy:** Section headers create clear boundaries between form areas
- **Improved Scannability:** Users can quickly identify major form sections
- **Balanced Layout:** Both columns are utilized more evenly in the middle sections

**Section Styling:**
```tsx
<h2 className="mb-4 pb-2 border-b border-gray-200 font-medium" style={{ fontSize: '15px' }}>
  Section Name
</h2>
```

**Use Cases:**
- Current implementation (as of December 2024)
- Complex forms with multiple logical groupings
- When certain sections (like GST) need prominent full-width treatment
- Forms where side-by-side comparison of related sections is beneficial

**Benefits Over V1:**
- Better visual separation between form sections
- More prominent GST section (compliance-critical)
- Balanced column usage in middle sections
- Easier to scan and navigate for users
- Clearer indication of form structure

 Some of the base components you are using may have styling(eg. gap/typography) baked in as defaults.
So make sure you explicitly set any styling information from the guidelines in the generated react to override the defaults.

## Data Grid Component (Reusable Table Component)

**IMPORTANT: Use the standardized DataGrid component for ALL data tables across the ERP application to ensure consistent filtering, search, sorting, and pagination behavior.**

**Component Location:** `/components/ui/DataGrid.tsx`  
**Documentation:** `/docs/DataGrid-Component-Guidelines.md`

### Overview

The **DataGrid** component is a comprehensive, reusable data table solution that consolidates:
- Search functionality with customizable search fields
- Filter system with dropdown and custom filter types
- Column sorting (ascending/descending)
- Row selection with checkboxes
- Row-level actions (View, Edit, Delete) via hover menu
- Bulk actions for selected rows
- Column visibility control
- Table density options (compact, standard, comfortable)
- Pagination with configurable page sizes
- Export functionality
- More options menu for additional actions

### When to Use

- **Item/Product lists** (Item Master, Purchase Orders, Sales Orders, Invoices, etc.)
- **Transaction tables** (Payments, Receipts, Journal Entries)
- **Master data tables** (Customers, Vendors, Employees, Warehouses)
- **Any tabular data** requiring search, filter, sort, and pagination

### Quick Start Example

```tsx
import { DataGrid, DataGridColumn, DataGridFilter, DataGridRowAction } from '../../components/ui/DataGrid';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
}

// Define columns
const columns: DataGridColumn<Product>[] = [
  {
    id: 'name',
    label: 'Product Name',
    sortable: true,
    render: (row) => <span className="text-gray-900">{row.name}</span>
  },
  {
    id: 'sku',
    label: 'SKU',
    sortable: true,
    render: (row) => <span className="font-mono text-sm text-gray-600">{row.sku}</span>
  },
  {
    id: 'price',
    label: 'Price',
    sortable: true,
    render: (row) => <span>₹{row.price.toLocaleString('en-IN')}</span>
  }
];

// Define filters
const filters: DataGridFilter[] = [
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    placeholder: 'All Categories',
    minWidth: 180,
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'furniture', label: 'Furniture' }
    ]
  }
];

// Define row actions
const rowActions: DataGridRowAction<Product>[] = [
  {
    id: 'view',
    label: 'View details',
    icon: <Eye className="w-4 h-4 text-gray-500" />,
    onClick: (row) => navigate(`/products/${row.id}`)
  },
  {
    id: 'edit',
    label: 'Edit product',
    icon: <Edit className="w-4 h-4 text-gray-500" />,
    onClick: (row) => setEditingProduct(row)
  },
  {
    id: 'delete',
    label: 'Delete product',
    icon: <Trash2 className="w-4 h-4 text-red-500" />,
    variant: 'danger',
    onClick: (row) => handleDelete(row.id)
  }
];

// Use the component
function ProductList() {
  return (
    <DataGrid
      data={products}
      columns={columns}
      rowKey="id"
      filters={filters}
      rowActions={rowActions}
      searchEnabled
      searchPlaceholder="Search products..."
      searchFields={['name', 'sku']}
      selectable
      pageSize={25}
    />
  );
}
```

### Core Features

1. **Search** - Full-text search across specified fields, custom search function support
2. **Filters** - Dropdown filters, custom filter rendering, filter summary banner
3. **Sorting** - Click column headers, three states (asc/desc/none), visual indicators
4. **Row Selection** - Checkbox selection, select all, controlled/uncontrolled mode
5. **Row Actions** - Horizontal icon menu on hover, conditional visibility
6. **Bulk Actions** - Shown when rows selected, count display
7. **Column Visibility** - Show/hide columns via modal
8. **Density Control** - Compact/standard/comfortable padding
9. **Pagination** - Configurable page sizes, first/previous/next/last navigation
10. **More Options Menu** - Filters, density, columns, export, custom items

### Key Props

| Category | Key Props |
|----------|-----------|
| **Data** | `data`, `columns`, `rowKey` |
| **Search** | `searchEnabled`, `searchFields`, `onSearch` |
| **Filters** | `filters`, `defaultFilters`, `onFilter` |
| **Selection** | `selectable`, `selectedRows`, `onSelectionChange` |
| **Actions** | `rowActions`, `bulkActions` |
| **Customization** | `defaultVisibleColumns`, `defaultDensity` |

### Complete Documentation

For comprehensive documentation see: `/docs/DataGrid-Component-Guidelines.md`

 Some of the base components you are using may have styling(eg. gap/typography) baked in as defaults.
So make sure you explicitly set any styling information from the guidelines in the generated react to override the defaults.