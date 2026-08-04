# Breadcrumb Navigation Guidelines

**IMPORTANT: Maintain consistent breadcrumb height across the entire ERP application for visual stability and predictable layout calculations.**

## Standard Breadcrumb Height

**Calculated Breadcrumb Area Height: 40px**

**Breakdown:**
```
Container padding (top):    9.5px (py-[9.5px])
Content height:            20px  (text-sm with line-height)
Container padding (bottom): 9.5px (py-[9.5px])
Bottom border:              1px   (border-b)
───────────────────────────────
TOTAL HEIGHT:              40px
```

**Usage in Layout Calculations:**
```tsx
// When calculating content area heights
const contentHeight = `calc(100vh - 123px)`;
// Where 123px = TopNav (60px) + Breadcrumb (40px) + margins/padding (23px)

// When positioning fixed elements below breadcrumb
top: calc(60px + 40px); // TopNav height + Breadcrumb height
```

---

## Container Structure

**Standard Implementation:**
```tsx
<div 
  className={`px-[21px] py-[9.5px] border-b ${
    editingMode 
      ? 'border-[#5C1F3D]' 
      : 'bg-white border-gray-200'
  }`}
  style={editingMode ? {
    background: 'linear-gradient(to right, #F5F7FA, #FFFFFF)'
  } : undefined}
>
  <div className="flex items-center justify-between">
    <Breadcrumbs {...props} />
    {breadcrumbActions}
  </div>
</div>
```

**Key Properties:**
- **Horizontal Padding**: `px-[21px]` (21px left/right)
- **Vertical Padding**: `py-[9.5px]` (9.5px top/bottom) - **DO NOT CHANGE**
- **Background (View Mode)**: `bg-white`
- **Background (Edit Mode)**: `linear-gradient(to right, #F5F7FA, #FFFFFF)`
- **Border**: `border-b` (1px bottom border)
- **Border Color (View Mode)**: `border-gray-200`
- **Border Color (Edit Mode)**: `border-[#5C1F3D]` (primary color)
- **Layout**: `flex items-center justify-between` (breadcrumbs left, actions right)

---

## Breadcrumb Component Specifications

**Typography:**
```tsx
// Container
<nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">

// Active/Last Breadcrumb
<span className="text-[#5C1F3D] font-medium">{label}</span>

// Inactive/Link Breadcrumbs
<Link className="text-gray-600 hover:text-[#5C1F3D] transition-colors">{label}</Link>
```

**Key Properties:**
- **Font Size**: `text-sm` (14px)
- **Line Height**: 20px (Tailwind default for text-sm: 1.428 ratio)
- **Gap Between Items**: `gap-2` (8px)
- **Active Color**: `text-[#5C1F3D]` (primary color)
- **Active Weight**: `font-medium`
- **Inactive Color**: `text-gray-600`
- **Hover Color**: `hover:text-[#5C1F3D]`

**Separator Icon:**
```tsx
<ChevronRight className="w-4 h-4 text-gray-400" />
```
- Size: `w-4 h-4` (16x16px)
- Color: `text-gray-400`

---

## Status and State Badges

**Product Status Badge (In Stock, Low Stock, Out of Stock):**
```tsx
<span className={`inline-flex items-center px-2.5 py-0.5 text-xs border rounded ${
  productStatus === 'In Stock'
    ? 'bg-green-50 text-green-700 border-green-200'
    : productStatus === 'Low Stock'
      ? 'bg-orange-50 text-orange-700 border-orange-200'
      : 'bg-red-50 text-red-700 border-red-200'
}`}>
  {productStatus}
</span>
```

**Editing Mode Badge:**
```tsx
<span className="inline-flex items-center px-2.5 py-0.5 text-xs border rounded bg-gray-50 text-gray-700 border-gray-200">
  Editing
</span>
```

**Badge Properties:**
- **Padding**: `px-2.5 py-0.5` (10px horizontal, 2px vertical)
- **Font Size**: `text-xs` (12px)
- **Line Height**: ~16px (Tailwind default for text-xs: 1.333 ratio)
- **Border Radius**: `rounded` (4px)
- **Border**: `border` (1px)
- **Display**: `inline-flex items-center` (vertically centered content)
- **Total Height**: ~20px (16px content + 4px padding)
- **Left Margin**: `ml-4` (16px gap from breadcrumb trail)

**Badge Variants:**
| Status | Background | Text | Border |
|--------|-----------|------|--------|
| **In Stock** | `bg-green-50` | `text-green-700` | `border-green-200` |
| **Low Stock** | `bg-orange-50` | `text-orange-700` | `border-orange-200` |
| **Out of Stock** | `bg-red-50` | `text-red-700` | `border-red-200` |
| **Editing** | `bg-gray-50` | `text-gray-700` | `border-gray-200` |

---

## Navigation Arrows (Previous/Next)

**Implementation:**
```tsx
<div className="flex items-center gap-1 ml-4">
  <button
    onClick={onNavigatePrevious}
    disabled={!canNavigatePrevious}
    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    title="Previous product"
  >
    <ChevronLeft className="w-4 h-4 text-gray-600" />
  </button>
  <button
    onClick={onNavigateNext}
    disabled={!canNavigateNext}
    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    title="Next product"
  >
    <ChevronRight className="w-4 h-4 text-gray-600" />
  </button>
</div>
```

**Key Properties:**
- **Padding**: `p-1.5` (6px all sides)
- **Icon Size**: `w-4 h-4` (16x16px)
- **Icon Color**: `text-gray-600`
- **Gap Between Buttons**: `gap-1` (4px)
- **Left Margin**: `ml-4` (16px gap from breadcrumb/badges)
- **Hover**: `hover:bg-gray-100` (light gray background)
- **Disabled**: `disabled:opacity-40 disabled:cursor-not-allowed`
- **Total Button Height**: 28px (16px icon + 12px padding)
- **Border Radius**: `rounded` (4px)

---

## Breadcrumb Actions Area (Right Side)

**Positioning:**
```tsx
<div className="flex items-center gap-2">
  {enableDataAgent && <DataAgentButton />}
  {breadcrumbActions}
</div>
```

**Properties:**
- **Layout**: `flex items-center gap-2` (8px gap between items)
- **Vertical Alignment**: `items-center` (centered with breadcrumb trail)
- **Common Actions**: Edit, Delete, Close, Export, Data Agent buttons
- **Button Height**: Should match breadcrumb height constraints (use compact button variants)

**Example Action Buttons:**
```tsx
// Edit Button (Primary)
<button className="px-4 py-2 h-10 text-sm rounded-[3px] bg-[#5C1F3D] text-white hover:bg-[#4a1831]">
  <Edit className="w-4 h-4" />
  <span>Edit</span>
</button>

// Delete Button (Danger)
<button className="px-4 py-2 h-10 text-sm rounded-[3px] bg-[#EF4444] text-white hover:bg-[#DC2626]">
  <Trash2 className="w-4 h-4" />
  <span>Delete</span>
</button>

// Close Button (Secondary)
<button className="px-4 py-2 h-10 text-sm rounded-[3px] bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
  <X className="w-4 h-4" />
  <span>Close</span>
</button>
```

**Note:** While action buttons have `h-10` (40px), they are visually balanced within the 37px breadcrumb container due to flexbox centering.

---

## Breadcrumb Truncation

**Behavior:**
```tsx
const truncateLabel = (label: string, isLast: boolean): string => {
  // Don't truncate the last breadcrumb (active page)
  if (isLast) return label;
  
  const maxLength = 10;
  if (label.length > maxLength) {
    return label.substring(0, maxLength) + '...';
  }
  return label;
};
```

**Rules:**
- **Max Length**: 10 characters for non-last breadcrumbs
- **Truncation**: Add `...` for labels exceeding max length
- **Last Breadcrumb**: Never truncate (always show full label)
- **Tooltip**: Show full text on hover for truncated labels using `title` attribute

**Example:**
```tsx
<Link
  to={path}
  className="text-gray-600 hover:text-[#5C1F3D] transition-colors"
  title={label.length > 10 ? label : undefined}
>
  {truncateLabel(label, false)}
</Link>
```

---

## Breadcrumb States

### **View Mode (Default)**
- Background: `bg-white`
- Border: `border-b border-gray-200`
- Last breadcrumb: `text-[#5C1F3D] font-medium`
- Links: `text-gray-600 hover:text-[#5C1F3D]`

**Visual Example:**
```
┌────────────────────────────────────────────────────────┐
│  Dashboard > Inventory > All Items > Product X  [Edit] │  ← 40px height
└────────────────────────────────────────────────────────┘
  ↑ gray-200 border, white background
```

### **Edit Mode**
- Background: `linear-gradient(to right, #F5F7FA, #FFFFFF)`
- Border: `border-b border-[#5C1F3D]` (primary color)
- "Editing" badge appears: `bg-gray-50 text-gray-700 border-gray-200`
- "Edit" breadcrumb hidden: Redundant with "Editing" badge

**Visual Example:**
```
┌────────────────────────────────────────────────────────┐
│  Dashboard > Inventory > All Items > Product X [Editing] │  ← 40px height
└────────────────────────────────────────────────────────┘
  ↑ #5C1F3D border, gradient background (#F5F7FA → #FFFFFF)
```

**Logic:**
```tsx
// Hide "Edit" breadcrumb when in editing mode
if (editingMode && isLast && crumb.toLowerCase() === 'edit') {
  return null;
}

// Show "Editing" badge when in editing mode
{editingMode && (
  <span className="inline-flex items-center px-2.5 py-0.5 text-xs border rounded bg-gray-50 text-gray-700 border-gray-200">
    Editing
  </span>
)}
```

### **With Product Status**
- Status badge appears after breadcrumb trail
- Gap: `ml-4` (16px)
- Colors: Green (In Stock), Orange (Low Stock), Red (Out of Stock)

**Visual Example:**
```
┌────────────────────────────────────────────────────────┐
│  Dashboard > Inventory > Product X [In Stock]    [Edit]│  ← 40px height
└────────────────────────────────────────────────────────┘
  ↑ Status badge with green styling
```

### **With Navigation Arrows**
- Arrows appear after breadcrumb/badges
- Gap: `ml-4` (16px)
- Used for item-to-item navigation (e.g., product details)

**Visual Example:**
```
┌────────────────────────────────────────────────────────┐
│  Dashboard > All Items > Product X [In Stock] [< >] [Edit]│  ← 40px height
└────────────────────────────────────────────────────────┘
  ↑ Navigation arrows between status and actions
```

---

## Breadcrumb Interactions

**Click Behavior:**
```tsx
<Breadcrumbs 
  breadcrumbs={breadcrumbs}
  onBreadcrumbClick={(index, path) => {
    // Custom navigation logic
    // Example: Return to list view when clicking "Warehouse List"
    if (clickedBreadcrumb === 'Warehouse List' && currentView === 'details') {
      setCurrentView('list');
      setSelectedItem(null);
    }
  }}
/>
```

**Rules:**
- **Last breadcrumb**: Not clickable (current page)
- **Previous breadcrumbs**: Clickable links
- **Custom handlers**: Use `onBreadcrumbClick` prop for page-specific logic
- **Default routing**: Links navigate to predefined routes via `getBreadcrumbPath()`

**Hover States:**
- Links: `hover:text-[#5C1F3D]` with `transition-colors`
- Navigation buttons: `hover:bg-gray-100`
- Action buttons: Individual hover styles

---

## ModulePageTemplate Props

**Breadcrumb-Related Props:**
```tsx
interface ModulePageTemplateProps {
  breadcrumbs?: string[];              // Breadcrumb trail array
  breadcrumbActions?: ReactNode;       // Right-aligned action buttons
  productStatus?: 'In Stock' | 'Low Stock' | 'Out of Stock'; // Status badge
  editingMode?: boolean;               // Show "Editing" badge, change styling
  onNavigatePrevious?: () => void;     // Previous item handler
  onNavigateNext?: () => void;         // Next item handler
  canNavigatePrevious?: boolean;       // Enable/disable previous button
  canNavigateNext?: boolean;           // Enable/disable next button
  onBreadcrumbClick?: (index: number, path: string) => void; // Custom click handler
  // ... other props
}
```

**Usage Example:**
```tsx
<ModulePageTemplate
  breadcrumbs={['Dashboard', 'Inventory', 'All Items', 'Product X']}
  productStatus="In Stock"
  editingMode={isEditMode}
  onNavigatePrevious={handlePrevProduct}
  onNavigateNext={handleNextProduct}
  canNavigatePrevious={currentIndex > 0}
  canNavigateNext={currentIndex < products.length - 1}
  onBreadcrumbClick={(index, path) => {
    if (path === '/dashboard/inventory/all-items') {
      setCurrentView('list');
    }
  }}
  breadcrumbActions={
    <button className="px-4 py-2 h-10 text-sm rounded-[3px] bg-[#5C1F3D] text-white">
      Edit
    </button>
  }
>
  {/* Page content */}
</ModulePageTemplate>
```

---

## Required Icons

```tsx
import { ChevronRight, ChevronLeft, Edit, Trash2, X } from 'lucide-react';
```

---

## Accessibility

**ARIA Attributes:**
```tsx
<nav aria-label="Breadcrumb">
  {/* Breadcrumb items */}
</nav>
```

**Keyboard Navigation:**
- All links and buttons are keyboard accessible
- Tab order: Breadcrumbs → Status/Badges → Navigation arrows → Action buttons
- Enter/Space to activate links and buttons

**Screen Readers:**
- Descriptive `aria-label` on navigation container
- `title` attributes on truncated labels
- Descriptive button titles ("Previous product", "Next product")
- Disabled states properly communicated

---

## Best Practices

✅ **DO:**
- Maintain 40px breadcrumb height across all pages
- Use `py-[9.5px]` padding (DO NOT CHANGE)
- Show "Editing" badge in edit mode
- Hide "Edit" breadcrumb when "Editing" badge is shown
- Use primary color border (`border-[#5C1F3D]`) in edit mode
- Truncate long labels (except last breadcrumb)
- Provide custom click handlers for complex navigation

❌ **DON'T:**
- Change vertical padding (breaks height consistency)
- Show both "Edit" breadcrumb and "Editing" badge simultaneously
- Truncate the last (active) breadcrumb
- Use different background colors in view mode (always white)
- Forget to add `title` attributes for truncated labels
- Mix navigation patterns (use either arrows OR breadcrumb clicks, not both)

---

## Common Patterns

**Simple Breadcrumb (List View):**
```tsx
<ModulePageTemplate
  breadcrumbs={['Dashboard', 'Inventory', 'All Items']}
>
```

**Details View with Actions:**
```tsx
<ModulePageTemplate
  breadcrumbs={['Dashboard', 'Inventory', 'All Items', item.name]}
  breadcrumbActions={
    <>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </>
  }
>
```

**Edit Mode:**
```tsx
<ModulePageTemplate
  breadcrumbs={['Dashboard', 'Inventory', 'All Items', item.name]}
  editingMode={true}
  // Bottom action bar appears, breadcrumb shows "Editing" badge
>
```

**With Product Status and Navigation:**
```tsx
<ModulePageTemplate
  breadcrumbs={['Dashboard', 'Inventory', 'All Items', product.name]}
  productStatus={product.status}
  onNavigatePrevious={() => setCurrentProduct(prev)}
  onNavigateNext={() => setCurrentProduct(next)}
  canNavigatePrevious={currentIndex > 0}
  canNavigateNext={currentIndex < products.length - 1}
>
```

---

## Visual Consistency Checklist

- [ ] Breadcrumb area is exactly 40px height
- [ ] Vertical padding is `py-[9.5px]` (9.5px top/bottom)
- [ ] Bottom border is present (`border-b`)
- [ ] Text size is `text-sm` (14px)
- [ ] Primary color (`#5C1F3D`) used for active breadcrumb
- [ ] Edit mode shows gradient background
- [ ] Edit mode shows primary color border
- [ ] "Editing" badge appears in edit mode
- [ ] "Edit" breadcrumb hidden when "Editing" badge shown
- [ ] Status badges properly styled (green/orange/red)
- [ ] Navigation arrows (if present) are properly sized
- [ ] Action buttons are vertically centered
- [ ] All interactive elements have hover states
- [ ] Truncated labels show tooltips

---

## Height Calculation Reference

**Quick Reference Card:**
```
BREADCRUMB AREA HEIGHT: 40px
───────────────────────────────
Container:
  • Padding Top:     9.5px (py-[9.5px])
  • Content:        20px   (text-sm line-height)
  • Padding Bottom:  9.5px (py-[9.5px])
  • Border Bottom:   1px   (border-b)
───────────────────────────────
TOTAL:             40px

DO NOT CHANGE: py-[9.5px] is critical for maintaining consistent height across the ERP.
```

**Use in calculations:**
- Content area height: `calc(100vh - TopNav - Breadcrumb - Padding)`
- Fixed element positioning: `top: calc(60px + 40px)`
- Scroll container offset: Account for 100px (60px + 40px) when needed
