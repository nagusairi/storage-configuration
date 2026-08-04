# "Add New" Pattern - Complete Design Documentation

> **Pattern Name:** "Add New"  
> **Pattern Type:** Form View Template  
> **Use Case:** Creating and editing records in ERP modules  
> **Applies To:** Inventory, Customers, Suppliers, Products, Transactions, and all entity management pages

---

## 1. Overview

The **"Add New" pattern** is a full-screen form view that allows users to create new records with comprehensive data entry across multiple categories. This pattern is used throughout the ERP application for adding inventory items, customers, suppliers, products, and other entities. It follows a dedicated form view pattern with breadcrumb navigation, contextual actions, and structured section-based layout.

**Pattern Reference Name:** When implementing this pattern, refer to it as the **"Add New"** pattern.

---

## 2. Layout Structure

### 2.1 Container Hierarchy

```
ModulePageTemplate (parent layout)
└── Form View (currentView === 'add-item')
    ├── Page Header (inline)
    ├── Form Content Container
    │   └── Form Sections
    │       ├── Basic Information
    │       ├── Stock Information
    │       ├── Pricing Information
    │       ├── Additional Details
    │       └── Product Image
    └── Form Action Buttons (footer)
```

### 2.2 Template Integration

The Add Item view is integrated within the `ModulePageTemplate` component and controlled by a `currentView` state variable:

```tsx
const [currentView, setCurrentView] = useState<'list' | 'add-item' | 'details' | 'edit'>('list');
```

**View States:**
- `'list'` - Main table/list view of all items
- `'add-item'` - Add new item form view
- `'details'` - Individual item details view (read-only)
- `'edit'` - Edit existing item form view

---

## 3. Breadcrumb Behavior

### 3.1 Breadcrumb Trail Structure

When in "Add New Inventory Item" view:

```tsx
breadcrumbs={['Dashboard', 'Inventory', 'All Items', 'Add New Inventory Item']}
```

**Breadcrumb Levels:**
1. **Dashboard** - Root level (non-clickable/visual only)
2. **Inventory** - Module level (non-clickable/visual only)
3. **All Items** - Returns to list view when clicked
4. **Add New Inventory Item** - Current page (non-clickable)

### 3.2 Breadcrumb Click Handling

Custom click handler manages navigation between views:

```tsx
const handleBreadcrumbClick = (index: number) => {
  const currentBreadcrumbs = currentView === 'details' && selectedItem
    ? ['Dashboard', 'Inventory', 'All Items', selectedItem.itemName]
    : currentView === 'add-item'
    ? ['Dashboard', 'Inventory', 'All Items', 'Add New Inventory Item']
    : currentView === 'edit' && selectedItem
    ? ['Dashboard', 'Inventory', 'All Items', selectedItem.itemName, 'Edit']
    : ['Dashboard', 'Inventory', 'All Items'];
  
  const clickedBreadcrumb = currentBreadcrumbs[index];
  
  // Reset to list view when clicking "All Items" from add/edit/details
  if (clickedBreadcrumb === 'All Items' && 
      (currentView === 'details' || currentView === 'add-item' || currentView === 'edit')) {
    setCurrentView('list');
    setSelectedItem(null);
    setCurrentItemIndex(-1);
  }
  
  // Return to details view when clicking item name while in edit mode
  if (currentView === 'edit' && selectedItem && clickedBreadcrumb === selectedItem.itemName) {
    setCurrentView('details');
  }
};
```

**Key Behaviors:**
- Clicking "All Items" while in add-item view → Returns to list view
- Clicking "All Items" → Clears selected item state
- Navigation resets pagination and filters (handled in triggering function)

### 3.3 Breadcrumb Actions (Top-Right Buttons)

When in Add Item or Edit views, only show the Data Agent button:

```tsx
breadcrumbActions={
  currentView === 'edit' || currentView === 'add-item' ? (
    <StyledButton
      variant="outline"
      icon={<Sparkles className="w-3.5 h-3.5" />}
      className="text-xs"
      style={{
        background: 'linear-gradient(135deg, #FF6B9D 0%, #C239B3 100%)',
        color: 'white',
        border: 'none'
      }}
    >
      Data Agent
    </StyledButton>
  ) : (
    // Other view-specific actions
  )
}
```

**Rationale:** In form views, focus is on data entry. The Data Agent provides AI assistance for filling out forms, suggesting values, or validating data.

---

## 4. Page Header

### 4.1 Header Structure

```tsx
<div className="mb-4 flex items-center justify-between">
  <h1 className="text-2xl">Add New Inventory Item</h1>
  <button 
    onClick={() => setCurrentView('list')}
    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
  >
    Cancel
  </button>
</div>
```

**Components:**
- **Left Side:** Page title (h1)
- **Right Side:** Cancel button (secondary action)

### 4.2 Header Styling

- **Title:** Uses default h1 typography from globals.css (no Tailwind font classes)
- **Cancel Button:** 
  - Border: `border border-gray-300`
  - Radius: `rounded-lg` (8px)
  - Padding: `px-4 py-2`
  - Text size: `text-sm`
  - Hover: `hover:bg-gray-100`
  - Transition: `transition-colors`

### 4.3 Header Behavior

- **Cancel Button Click:** Returns user to list view (`setCurrentView('list')`)
- **Positioning:** Fixed at top of form view with margin-bottom spacing (`mb-4`)

---

## 5. Form Content Container

### 5.1 Container Styling

```tsx
<div className="bg-white rounded-lg border border-gray-300 p-6 overflow-y-auto" 
     style={{ scrollBehavior: 'smooth' }}>
  <form className="space-y-6">
    {/* Form sections */}
  </form>
</div>
```

**Key Properties:**
- **Background:** `bg-white`
- **Border:** `border border-gray-300`
- **Border Radius:** `rounded-lg` (8px)
- **Padding:** `p-6` (24px all sides)
- **Overflow:** `overflow-y-auto` (scrollable vertically)
- **Scroll Behavior:** `smooth` (inline style)
- **Section Spacing:** `space-y-6` (24px vertical gap between sections)

### 5.2 Scrolling Behavior

- Form container is scrollable independently
- Smooth scroll for better UX when navigating between sections
- Page header remains fixed (not part of scroll container)

---

## 6. Form Sections

### 6.1 Section Structure Pattern

Each form section follows this consistent pattern:

```tsx
<div>
  <h3 className="text-sm mb-4 pb-2 border-b border-gray-200">
    {Section Title}
  </h3>
  <div className="grid grid-cols-2 gap-4">
    {/* Form fields */}
  </div>
</div>
```

**Section Header:**
- **Heading:** `text-sm` (14px)
- **Margin Bottom:** `mb-4` (16px)
- **Padding Bottom:** `pb-2` (8px)
- **Border:** `border-b border-gray-200` (bottom border separator)

**Field Grid:**
- **Layout:** 2-column grid (`grid-cols-2`)
- **Gap:** `gap-4` (16px between fields)
- **Responsive:** Can be adapted to single column on mobile (not shown in current implementation)

### 6.2 Available Sections

1. **Basic Information**
   - Item Name (required)
   - SKU (required)
   - Category (required)
   - Supplier (required)

2. **Stock Information**
   - Quantity (required)
   - Unit of Measure
   - Reorder Level (required)
   - Location

3. **Pricing Information**
   - Unit Price (required)
   - Cost Price
   - Tax Rate (%)
   - Discount (%)

4. **Additional Details**
   - Barcode
   - Manufacturer
   - Brand
   - Weight
   - Description (full-width, spans 2 columns)

5. **Product Image**
   - Upload area with drag-and-drop functionality

---

## 7. Form Field Components

### 7.1 Text Input Fields

**Component:** `StyledTextField` (Material-UI based)

```tsx
<div>
  <label className="block text-sm mb-2">
    Item Name <span className="text-red-500">*</span>
  </label>
  <StyledTextField placeholder="Enter item name" />
</div>
```

**Label Styling:**
- Display: `block`
- Text size: `text-sm`
- Margin bottom: `mb-2`
- Required indicator: `<span className="text-red-500">*</span>`

**Field Properties:**
- Uses Material-UI TextField styled to match ERP design
- Height: 40px (standard from guidelines)
- Full width within grid cell
- Placeholder text for guidance

### 7.2 Number Input Fields

```tsx
<StyledTextField 
  type="number" 
  placeholder="Enter quantity" 
  inputProps={{ min: 0 }} 
/>
```

**Special Properties:**
- `type="number"` for numeric keyboard on mobile
- `inputProps={{ min: 0 }}` prevents negative values
- `step` attribute for decimal values (e.g., `step: 0.01` for prices)

### 7.3 Currency Input Fields

```tsx
<StyledTextField 
  type="number" 
  placeholder="0.00" 
  icon={<span className="text-gray-500 text-sm">₹</span>} 
  inputProps={{ min: 0, step: 0.01 }} 
/>
```

**Special Properties:**
- `icon` prop displays currency symbol (₹)
- Two decimal places via `step: 0.01`
- Placeholder shows format (`0.00`)

### 7.4 Select/Dropdown Fields

**Component:** `StyledSelect` + `MenuItem` (Material-UI based)

```tsx
<div>
  <label className="block text-sm mb-2">
    Category <span className="text-red-500">*</span>
  </label>
  <StyledSelect defaultValue="">
    <MenuItem value="" sx={{ fontSize: '14px' }}>Select category</MenuItem>
    <MenuItem value="electronics" sx={{ fontSize: '14px' }}>Electronics</MenuItem>
    <MenuItem value="furniture" sx={{ fontSize: '14px' }}>Furniture</MenuItem>
    <MenuItem value="supplies" sx={{ fontSize: '14px' }}>Office Supplies</MenuItem>
  </StyledSelect>
</div>
```

**Key Properties:**
- `defaultValue=""` for unselected state
- First MenuItem with empty value serves as placeholder
- `sx={{ fontSize: '14px' }}` for consistent text size
- Full width within grid cell

**Important:** Always use `StyledSelect` instead of native HTML `<select>` as per ERP guidelines.

### 7.5 Multiline Text Area

```tsx
<div className="col-span-2">
  <label className="block text-sm mb-2">
    Description
  </label>
  <StyledTextField 
    placeholder="Enter item description" 
    multiline 
    rows={4} 
  />
</div>
```

**Special Properties:**
- `multiline` prop enables textarea mode
- `rows={4}` sets initial height
- `col-span-2` makes field span both grid columns

### 7.6 File Upload Area

```tsx
<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#5C1F3D] transition-colors cursor-pointer">
  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
  <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
</div>
```

**Styling:**
- Dashed border: `border-2 border-dashed border-gray-300`
- Hover effect: `hover:border-[#5C1F3D]` (changes to primary color)
- Padding: `p-8` (32px for large clickable area)
- Icon: `Package` from lucide-react (placeholder for product)
- Instructions: Two lines of text with size and format guidance

---

## 8. Form Action Buttons (Footer)

### 8.1 Footer Structure

```tsx
<div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
  <StyledButton variant="outline" onClick={() => setCurrentView('list')}>
    Cancel
  </StyledButton>
  <StyledButton variant="primary">
    Save Item
  </StyledButton>
</div>
```

### 8.2 Footer Styling

- **Spacing:** `mt-6` (margin-top 24px), `pt-6` (padding-top 24px)
- **Top Border:** `border-t border-gray-200` (visual separator from form)
- **Layout:** `flex items-center justify-end` (right-aligned)
- **Gap:** `gap-3` (12px between buttons)

### 8.3 Button Hierarchy

1. **Cancel Button (Secondary):**
   - Variant: `outline`
   - Action: Returns to list view
   - Position: Left

2. **Save Item Button (Primary):**
   - Variant: `primary`
   - Action: Saves the new item (implementation depends on backend)
   - Position: Right (emphasized position)

**Visual Hierarchy:** Primary action is rightmost and uses filled background, secondary action is outlined.

---

## 9. State Management

### 9.1 Required State Variables

```tsx
// View control
const [currentView, setCurrentView] = useState<'list' | 'add-item' | 'details' | 'edit'>('list');

// Selected item (for edit mode)
const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

// Item index tracking (for navigation)
const [currentItemIndex, setCurrentItemIndex] = useState<number>(-1);
```

### 9.2 View Switching Logic

**Entering Add Item View:**
```tsx
// From list view (e.g., clicking "New Item" button)
<StyledButton
  variant="primary"
  icon={<Plus className="w-4 h-4" />}
  onClick={() => setCurrentView('add-item')}
>
  New Item
</StyledButton>
```

**Exiting Add Item View:**
```tsx
// Cancel button or breadcrumb navigation
setCurrentView('list');
```

### 9.3 Form State (Implementation Example)

While not shown in the current code, form state would typically be managed using:

**Option 1: React Hook Form (Recommended)**
```tsx
import { useForm } from 'react-hook-form@7.55.0';

const { register, handleSubmit, formState: { errors } } = useForm();

const onSubmit = (data) => {
  // API call to save item
  console.log(data);
  setCurrentView('list');
};
```

**Option 2: Local State**
```tsx
const [formData, setFormData] = useState({
  itemName: '',
  sku: '',
  category: '',
  // ... other fields
});

const handleInputChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

---

## 10. Interaction Design

### 10.1 User Flow

```
List View
  ↓ [Click "New Item" button]
Add Item View
  ↓ [Fill out form]
  ├─→ [Click "Cancel"] → Return to List View
  └─→ [Click "Save Item"] → Save & Return to List View (or Details View)
```

### 10.2 Navigation Patterns

**Entry Points to Add Item View:**
1. Primary action button in breadcrumb actions area
2. Empty state "Add First Item" button (if no data exists)
3. Quick action menu/panel

**Exit Points from Add Item View:**
1. Cancel button in page header
2. Cancel button in footer
3. Breadcrumb navigation (clicking "All Items")
4. Save button (after successful save)

### 10.3 Focus Management

**Initial Focus:**
- First input field (Item Name) should receive focus when view loads
- Implementation: `autoFocus` prop or `useEffect` with ref

**Tab Order:**
- Natural DOM order (top to bottom, left to right in grid)
- Skip over disabled fields
- Footer buttons are last in tab order

### 10.4 Validation States

**Field-Level Validation:**
- Required fields show asterisk (*) in label
- Error states display below field (Material-UI helperText)
- Success states (optional) show checkmark icon

**Form-Level Validation:**
- Submit button can be disabled until all required fields are filled
- Display error summary at top of form if validation fails

---

## 11. Responsive Behavior

### 11.1 Desktop (Default)

- 2-column grid for form fields
- Full sidebar and navigation visible
- Optimal field widths (not too wide)

### 11.2 Tablet (Recommended Enhancement)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Form fields */}
</div>
```

- Switch to single column below `md` breakpoint
- Maintain padding and spacing
- Scrollable form area

### 11.3 Mobile (Recommended Enhancement)

- Single column layout
- Larger touch targets for buttons
- Full-width inputs
- Sticky footer with action buttons

---

## 12. Accessibility

### 12.1 Semantic HTML

- `<form>` element wraps all inputs
- Proper `<label>` elements with `htmlFor` attributes
- `<h1>` for page title, `<h3>` for section headers
- `<button>` elements for actions (not divs)

### 12.2 ARIA Attributes

**Required Field Indicators:**
```tsx
<label>
  Item Name 
  <span className="text-red-500" aria-label="required">*</span>
</label>
```

**Error Messages:**
```tsx
<input aria-invalid="true" aria-describedby="error-message-id" />
<span id="error-message-id" role="alert">Error message here</span>
```

### 12.3 Keyboard Navigation

- All interactive elements accessible via Tab key
- Enter key submits form
- Escape key cancels (recommended enhancement)
- Focus visible indicators on all form controls

### 12.4 Screen Reader Support

- Page title announced when view changes
- Required fields announced by screen readers
- Error messages associated with fields
- Button labels are descriptive ("Save Item" not just "Save")

---

## 13. Edit Mode Differences

The Edit view (`currentView === 'edit'`) uses the same form structure with these differences:

### 13.1 Breadcrumb Changes

```tsx
breadcrumbs={['Dashboard', 'Inventory', 'All Items', selectedItem.itemName, 'Edit']}
```

**Click Behavior:**
- Clicking item name → Returns to details view (read-only)
- Clicking "All Items" → Returns to list view

### 13.2 Pre-populated Fields

```tsx
<StyledTextField 
  placeholder="Enter item name" 
  defaultValue={selectedItem.itemName} 
/>

<StyledSelect defaultValue={selectedItem.category.toLowerCase().replace(/ /g, '-')}>
  <MenuItem value="electronics">Electronics</MenuItem>
  {/* ... */}
</StyledSelect>
```

**Key Differences:**
- `defaultValue` prop set to existing item data
- Select dropdowns match current value
- Page title changes to item name (not shown in header in current implementation)

### 13.3 Save Button Label

```tsx
<StyledButton variant="primary">
  Update Item {/* Instead of "Save Item" */}
</StyledButton>
```

---

## 14. Reusability Pattern

### 14.1 Template Abstraction

This form pattern can be abstracted into a reusable component:

```tsx
interface FormViewProps {
  title: string;
  mode: 'add' | 'edit';
  sections: FormSection[];
  onSave: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function FormView({ title, mode, sections, onSave, onCancel, initialData }: FormViewProps) {
  // Render form structure
}
```

### 14.2 Section Configuration

```tsx
interface FormSection {
  title: string;
  fields: FormField[];
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiline' | 'file';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  icon?: ReactNode;
  validation?: ValidationRule[];
  colSpan?: 1 | 2;
}
```

### 14.3 Usage Example

```tsx
<FormView
  title="Add New Inventory Item"
  mode="add"
  sections={inventoryFormSections}
  onSave={handleSaveInventoryItem}
  onCancel={() => setCurrentView('list')}
/>
```

---

## 15. Design Consistency Checklist

When implementing this pattern in other modules, ensure:

- [ ] Uses `ModulePageTemplate` as parent layout
- [ ] Breadcrumb trail includes full path with form title
- [ ] Breadcrumb actions show only Data Agent button in form views
- [ ] Page header includes title and Cancel button
- [ ] Form container has white background, border, padding, and smooth scroll
- [ ] Sections use consistent header styling with bottom border
- [ ] Fields arranged in 2-column grid with 16px gap
- [ ] Labels include required indicators (*) for mandatory fields
- [ ] Uses `StyledTextField` for text inputs
- [ ] Uses `StyledSelect` + `MenuItem` for dropdowns (never native select)
- [ ] Footer includes Cancel (left) and Save/Update (right) buttons
- [ ] Footer separated from form with top border
- [ ] Clicking Cancel returns to list view
- [ ] Clicking breadcrumb "All Items" returns to list view
- [ ] Currency fields include symbol icon
- [ ] Number fields have appropriate min/max/step constraints
- [ ] File upload areas have dashed border and hover effect
- [ ] Multiline fields span 2 columns where appropriate

---

## 16. Code Reference

**Full Component Path:** `/pages/inventory/ItemMaster.tsx`

**Key Code Sections:**
- Lines 793-988: Add Item View implementation
- Lines 221-240: Breadcrumb handling logic
- Lines 254-269: Breadcrumb actions for form views
- Lines 810-975: Form sections and fields

**Related Components:**
- `ModulePageTemplate` - Parent layout wrapper
- `StyledTextField` - Text input component
- `StyledSelect` + `MenuItem` - Dropdown component
- `StyledButton` - Button component

---

## 17. Future Enhancements

### 17.1 Validation

- Real-time field validation
- Form-level validation summary
- Async validation (e.g., SKU uniqueness check)

### 17.2 Auto-save

- Draft saving to localStorage
- Auto-save indicator
- Recovery from accidental navigation

### 17.3 AI Assistance

- Data Agent integration for field suggestions
- Auto-fill based on similar items
- Smart categorization

### 17.4 Bulk Import

- CSV upload option
- Mapping interface for columns
- Preview before import

### 17.5 Advanced Features

- Image upload with preview and cropping
- Multi-image support (gallery)
- Barcode scanner integration
- Voice input for descriptions
- Template/preset selection

---

## End of Documentation

This documentation provides a complete reference for implementing the Add/Edit form view pattern across the ERP application. Follow these guidelines to ensure consistency and maintainability.