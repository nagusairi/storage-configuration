# InventoryValuationInput - Design Specifications

## 🎨 Visual Design System

### Component Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Section Header                                               │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Inventory & Valuation                                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ 2. Top Row: Three Input Fields                                  │
│ ┌───────────────┬───────────────────┬───────────────────────┐   │
│ │ Re-Order Level│ Low Stock Alert   │ Valuation Method      │   │
│ └───────────────┴───────────────────┴───────────────────────┘   │
│                                                                  │
│ 3. Opening Stock Question + Radio Buttons                       │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Do you have opening stock? ● Yes  ○ No                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ 4. Conditional: Add Warehouse Interface (if Yes)                │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Warehouse search, quantity, add button]                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ 5. Conditional: Warehouse Table or Empty State                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Table with bulk operations OR empty state message]         │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📐 Measurements & Spacing

### Overall Container
- **Width:** `100%` (full width)
- **Spacing:** `16px` between major sections (space-y-4)

### 1. Section Header
```
┌─────────────────────────────────────────────────────────────┐
│ Inventory & Valuation                                       │
│ ─────────────────────────────────────────────────────────── │  ← 1px border
│                                                             │
│ Margin Bottom: 16px (mb-4)                                  │
│ Padding Bottom: 8px (pb-2)                                  │
│ Border Bottom: 1px solid #E5E7EB                            │
│ Font Size: 15px                                             │
│ Font Weight: Medium (500)                                   │
└─────────────────────────────────────────────────────────────┘
```

### 2. Top Row (Three Fields)
```
┌─────────────┬─────────────────┬──────────────────────┐
│ Re-Order    │ Low Stock Alert │ Valuation Method     │
│ Level       │ Level           │                      │
│             │                 │                      │
│ [Input  40px│ [Input      40px│ [Dropdown        40px│
│  height]    │  height]        │  height]            │
└─────────────┴─────────────────┴──────────────────────┘
     ↕              ↕                    ↕
   16px gap      16px gap            16px gap
```

**Specifications:**
- **Layout:** `grid grid-cols-3 gap-4`
- **Column Distribution:** Equal thirds (1fr 1fr 1fr)
- **Gap:** 16px between columns
- **Label Margin Bottom:** 8px (mb-2)
- **Input Height:** 40px (h-10)

### 3. Opening Stock Question
```
┌──────────────────────────────────────────────────────────────┐
│ Do you have opening stock for this item?                     │
│                                                               │
│ Margin Top: 16px (from previous section)                     │
│ Label Margin Bottom: 12px (mb-3)                             │
│                                                               │
│ ● Yes      ○ No                                              │
│   ↕          ↕                                               │
│  8px gap   8px gap  (between radio and label)               │
│   ←24px gap→                                                 │
└──────────────────────────────────────────────────────────────┘
```

**Radio Button Specifications:**
- **Size:** 16px × 16px (w-4 h-4)
- **Gap to Label:** 8px (gap-2)
- **Gap Between Radios:** 24px (gap-6)
- **Active Color:** `#5C1F3D`
- **Focus Ring:** 2px `#5C1F3D`

### 4. Add Warehouse Interface
```
┌────────────────────────────────────────────────────────────┐
│ Add Warehouse Items *                                      │
│ Padding: 16px (p-4)                                        │
│ Background: #F9FAFB (bg-gray-50)                          │
│ Border: 1px solid #E5E7EB (border-gray-200)               │
│ Border Radius: 8px (rounded-lg)                           │
│                                                            │
│ ┌───────────────────────┬─────────┬────────────┐          │
│ │ Select Warehouse      │ Qty     │ Add Button │          │
│ │ [Search field + icon] │ [Input] │ [Button]   │          │
│ │ Width: 1fr            │ 128px   │ auto       │          │
│ │ Height: 40px          │ 40px    │ 40px       │          │
│ └───────────────────────┴─────────┴────────────┘          │
│          ↕                  ↕           ↕                  │
│        12px gap         12px gap    12px gap              │
└────────────────────────────────────────────────────────────┘
```

**Grid Specifications:**
- **Layout:** `grid grid-cols-[1fr_auto_auto] gap-3`
- **Column 1:** Flexible (1fr) - Warehouse search
- **Column 2:** Fixed 128px (w-32) - Quantity input
- **Column 3:** Auto width - Add button
- **Gap:** 12px (gap-3)
- **Align Items:** End (items-end)

**Search Field Specifications:**
- **Height:** 40px
- **Padding:** `12px 40px 12px 12px` (px-3 py-2 + pr-10 for icon)
- **Border:** 1px solid `#D1D5DB`
- **Border Radius:** 3px
- **Icon:** Right-aligned, 16px × 16px, 12px from right edge

### 5. Warehouse Dropdown
```
┌────────────────────────────────────────────────────────────┐
│ Position: absolute, top: 100% + 4px (mt-1)                │
│ Width: 100% (matches search field)                         │
│ Max Height: 240px (max-h-60)                               │
│ Border: 1px solid #D1D5DB                                  │
│ Border Radius: 8px (rounded-lg)                            │
│ Box Shadow: 0 10px 15px -3px rgba(0,0,0,0.1) (shadow-lg)  │
│ Z-Index: 50 (z-50)                                         │
│ Background: white                                          │
│                                                            │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Warehouse Option                                     │  │
│ │ Padding: 12px 16px (px-4 py-3)                       │  │
│ │ Border Bottom: 1px solid #F3F4F6 (border-gray-100)   │  │
│ │ Hover: bg-purple-50 (#FAF5FF)                        │  │
│ │                                                       │  │
│ │ Main Warehouse                        ← 14px text    │  │
│ │ WH-001                                ← 12px text    │  │
│ └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Empty State in Dropdown:**
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                          🔍                                │
│                    40px × 40px                            │
│                                                            │
│              No warehouses found                           │
│           Try a different search term                      │
│                                                            │
│ Padding: 32px (p-8)                                        │
│ Text Align: Center                                         │
└────────────────────────────────────────────────────────────┘
```

### 6. Bulk Remove Toolbar
```
┌────────────────────────────────────────────────────────────┐
│ 2 warehouses selected            [Remove Selected]        │
│ ↕                                           ↕              │
│ Padding: 12px 16px (px-4 py-3)                            │
│ Background: #FEF2F2 (bg-red-50)                           │
│ Border: 1px solid #FECACA (border-red-200)                │
│ Border Radius: 8px (rounded-lg)                           │
│                                                            │
│ Text: #7F1D1D (text-red-900), 14px, medium weight        │
│ Button: white bg, red border, red text                    │
└────────────────────────────────────────────────────────────┘
```

### 7. Warehouse Table
```
┌────────────────────────────────────────────────────────────┐
│ Border: 1px solid #E5E7EB (border-gray-200)               │
│ Border Radius: 8px (rounded-lg)                           │
│ Overflow: hidden                                           │
│                                                            │
│ ┌──┬─────────────────────┬─────────────────┬───────────┐  │
│ │☑ │ Warehouse Name      │ Opening Stock   │ Actions   │  │  ← Header (bg-gray-50)
│ ├──┼─────────────────────┼─────────────────┼───────────┤  │
│ │☑ │ Main Warehouse      │ [100        ]   │ [🗑️]     │  │  ← Row
│ │  │ WH-001              │                 │           │  │
│ ├──┼─────────────────────┼─────────────────┼───────────┤  │
│ │□ │ Secondary Warehouse │ [50         ]   │ [🗑️]     │  │  ← Row
│ │  │ WH-002              │                 │           │  │
│ └──┴─────────────────────┴─────────────────┴───────────┘  │
└────────────────────────────────────────────────────────────┘

Column Widths:
- Checkbox: 48px (w-12)
- Warehouse Name: Flexible (1fr)
- Opening Stock: 160px (w-40)
- Actions: 80px (w-20)

Cell Padding: 12px 16px (px-4 py-3)
Header Height: ~36px
Row Height: ~52px (with two-line content)
Border Between Rows: 1px solid #F3F4F6
```

### 8. Empty State
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                          📦                                │
│                    48px × 48px                            │
│                  Margin Bottom: 12px                       │
│                                                            │
│              No warehouses added yet                       │
│          Add warehouses using the form above               │
│                                                            │
│ Padding: 32px (p-8)                                        │
│ Border: 1px solid #E5E7EB                                  │
│ Border Radius: 8px                                         │
│ Text Align: Center                                         │
│ Text: 14px / 12px, gray-500 / gray-400                    │
└────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette Reference

### Primary Colors
| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **Primary (Deep Purple)** | `#5C1F3D` | `text-[#5C1F3D]` | Radio active, focus ring |
| **Primary Hover** | `#4a1831` | `hover:bg-[#4a1831]` | Button hover state |

### Grayscale
| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **White** | `#FFFFFF` | `bg-white` | Input, table, dropdown backgrounds |
| **Gray 50** | `#F9FAFB` | `bg-gray-50` | Add warehouse panel, table header |
| **Gray 100** | `#F3F4F6` | `border-gray-100` | Table row borders |
| **Gray 200** | `#E5E7EB` | `border-gray-200` | Primary borders |
| **Gray 300** | `#D1D5DB` | `border-gray-300` | Input borders |
| **Gray 400** | `#9CA3AF` | `text-gray-400` | Placeholder, disabled text, icons |
| **Gray 500** | `#6B7280` | `text-gray-500` | Secondary text, sub-labels |
| **Gray 600** | `#4B5563` | `text-gray-600` | Sub-labels, table headers |
| **Gray 700** | `#374151` | `text-gray-700` | Primary labels |
| **Gray 900** | `#111827` | `text-gray-900` | Primary text, input text |

### Error/Red Colors
| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **Red 50** | `#FEF2F2` | `bg-red-50` | Selected row, bulk toolbar bg |
| **Red 200** | `#FECACA` | `border-red-200` | Bulk toolbar border |
| **Red 300** | `#FCA5A5` | `border-red-300` | Bulk remove button border |
| **Red 500** | `#EF4444` | `text-red-500` | Trash icon, required asterisk |
| **Red 600** | `#DC2626` | `text-red-600` | Error text |
| **Red 700** | `#B91C1C` | `text-red-700` | Bulk toolbar button text |
| **Red 900** | `#7F1D1D` | `text-red-900` | Bulk toolbar text |

### Accent Colors
| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **Purple 50** | `#FAF5FF` | `bg-purple-50` | Dropdown item hover |

---

## 🔤 Typography Specifications

### Font Sizes
| Element | Size (px) | Tailwind Class | Line Height |
|---------|-----------|----------------|-------------|
| **Section Header** | 15px | `style={{ fontSize: '15px' }}` | Normal |
| **Field Label** | 14px | `text-sm` | Normal |
| **Sub-label** | 12px | `text-xs` | Normal |
| **Input Text** | 14px | `text-sm` | `1.4375em` |
| **Radio Label** | 14px | `text-sm` | Normal |
| **Table Header** | 12px | `text-xs` | Normal |
| **Table Cell (Main)** | 14px | `text-sm` | Normal |
| **Table Cell (Sub)** | 12px | `text-xs` | Normal |
| **Button Text** | 14px | `text-sm` | Normal |
| **Error Text** | 12px | `text-xs` | Normal |
| **Empty State (Main)** | 14px | `text-sm` | Normal |
| **Empty State (Sub)** | 12px | `text-xs` | Normal |
| **Bulk Toolbar** | 14px | `text-sm` | Normal |

### Font Weights
| Element | Weight | Tailwind Class |
|---------|--------|----------------|
| **Section Header** | 500 (Medium) | `font-medium` |
| **Field Labels** | 400 (Regular) | - |
| **Bulk Toolbar Text** | 500 (Medium) | `font-medium` |
| **All Other Text** | 400 (Regular) | - |

---

## 📏 Spacing System

### Margin Scale
```
mb-1    = 4px   (error text margin top)
mb-1.5  = 6px   (sub-label margin bottom)
mb-2    = 8px   (label margin bottom)
mb-3    = 12px  (opening stock question label)
mb-4    = 16px  (section header margin bottom)
mt-1    = 4px   (dropdown margin top)
mt-2    = 8px   (opening stock section padding top)
```

### Padding Scale
```
p-1.5   = 6px   (button padding, remove icon)
p-3     = 12px  (table cell padding - horizontal & vertical)
p-4     = 16px  (add warehouse panel padding)
p-8     = 32px  (empty state padding)

px-3    = 12px  (input horizontal padding)
px-4    = 16px  (dropdown item, table cell, toolbar)

py-1.5  = 6px   (bulk toolbar button vertical)
py-2    = 8px   (input vertical padding)
py-3    = 12px  (table cell, dropdown item, toolbar)

pb-2    = 8px   (section header padding bottom)
```

### Gap Scale
```
gap-2   = 8px   (radio and label)
gap-3   = 12px  (add warehouse grid)
gap-4   = 16px  (top row grid, section spacing)
gap-6   = 24px  (radio buttons)
```

---

## 🖼️ Visual States

### Input Field States

#### Normal
- Border: `1px solid #D1D5DB`
- Background: `#FFFFFF`
- Text: `#111827`
- Placeholder: `#9CA3AF`

#### Focus
- Border: transparent
- Ring: `2px solid #5C1F3D`
- Background: `#FFFFFF`
- Text: `#111827`

#### Error
- Border: `1px solid #EF4444`
- Ring (on focus): `2px solid #EF4444`
- Background: `#FFFFFF`
- Text: `#111827`
- Error Message: `#DC2626`, 12px, below field

#### Disabled
- Border: `1px solid #D1D5DB`
- Background: `#F9FAFB`
- Text: `#9CA3AF`
- Cursor: not-allowed

### Radio Button States

#### Unchecked
- Border: `2px solid #D1D5DB`
- Background: `#FFFFFF`
- Size: 16px × 16px

#### Checked
- Border: `2px solid #5C1F3D`
- Background: `#5C1F3D`
- Inner dot: white

#### Focus
- Ring: `2px solid #5C1F3D`
- Offset: 2px

### Dropdown States

#### Closed
- Not visible

#### Open
- Visible with shadow
- Z-index: 50
- Max height: 240px
- Scrollable if needed

#### Item Normal
- Background: `#FFFFFF`
- Text: `#111827`
- Border bottom: `1px solid #F3F4F6`

#### Item Hover
- Background: `#FAF5FF`
- Text: `#111827`
- Cursor: pointer

### Table Row States

#### Normal
- Background: `#FFFFFF`
- Text: `#111827`
- Border bottom: `1px solid #F3F4F6`

#### Hover
- Background: `#F9FAFB`
- Text: `#111827`

#### Selected (for removal)
- Background: `#FEF2F2`
- Text: `#111827`
- Checkbox: checked

### Button States

#### Add Button (Normal)
- Background: `#FFFFFF`
- Border: `1px solid #D1D5DB`
- Text: `#374151`
- Icon: `#374151`

#### Add Button (Hover)
- Background: `#F9FAFB`
- Border: `1px solid #D1D5DB`
- Text: `#374151`

#### Add Button (Disabled)
- Background: `#FFFFFF`
- Border: `1px solid #D1D5DB`
- Text: `#9CA3AF`
- Icon: `#9CA3AF`
- Cursor: not-allowed
- Opacity: 0.5

#### Remove Icon (Normal)
- Color: `#EF4444`
- Size: 16px × 16px

#### Remove Icon (Hover)
- Background: `#FEF2F2`
- Color: `#EF4444`
- Border radius: 3px

---

## ♿ Accessibility Annotations

### Focus Indicators
All interactive elements have visible focus states:
- **Input fields:** 2px purple ring
- **Radio buttons:** 2px purple ring with offset
- **Checkboxes:** 2px purple ring
- **Buttons:** 2px ring (color varies by button type)
- **Dropdown items:** Background color change
- **Remove icons:** Background color on hover

### Color Contrast Ratios
- **Label text (#374151) on white:** 8.6:1 (AAA)
- **Input text (#111827) on white:** 17.9:1 (AAA)
- **Error text (#DC2626) on white:** 7.1:1 (AAA)
- **Sub-label (#6B7280) on white:** 5.5:1 (AA+)
- **Placeholder (#9CA3AF) on white:** 3.8:1 (AA for large text)

### Touch Targets
- **Radio buttons:** 16px × 16px with 8px gap = minimum 24px
- **Checkboxes:** 16px × 16px with padding = minimum 28px
- **Add button:** 40px height (exceeds 40px minimum)
- **Remove icons:** 24px × 24px (with padding) = meets minimum
- **Table rows:** 52px height (exceeds 40px minimum)

### Semantic HTML
- Uses proper `<label>` elements
- Table uses semantic `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`
- Radio buttons use `name` attribute for grouping
- Checkboxes use proper `type="checkbox"`

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Three-column grid for top fields
- Full-width add warehouse interface
- Table with all columns visible

### Tablet (768px - 1023px)
- Maintain three-column grid (may be tight)
- Consider reducing padding slightly
- Table may need horizontal scroll

### Mobile (<768px)
- **Recommended:** Stack top fields vertically (grid-cols-1)
- Add warehouse interface: Stack fields
- Table: Horizontal scroll or card-based layout
- Reduce padding for better space utilization

**Note:** Component does not include built-in responsive breakpoints. Parent should handle responsive layout.

---

## 🎭 Animation Specifications

### Transitions
```css
/* All color/background transitions */
transition-property: background-color, border-color, color;
transition-duration: 150ms;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* Tailwind class */
transition-colors
```

### Dropdown Appearance
- No animation (instant)
- Z-index: 50 (above content)

### Hover Effects
- Button background: 150ms transition
- Dropdown item background: 150ms transition
- Table row background: 150ms transition
- Remove icon background: 150ms transition

---

## 🔍 Inspector Values (for QA)

### Element Heights
- Section header: ~31px (15px text + 8px padding + 1px border + 16px margin)
- Field label: ~20px (14px text + 8px margin)
- Input field: 40px
- Radio button row: ~24px (16px button + margins)
- Add warehouse panel: Auto (based on content + 16px padding)
- Dropdown item: ~48px (content + 12px top/bottom padding)
- Table header: ~36px (12px text + 12px top/bottom padding)
- Table row: ~52px (two lines + 12px top/bottom padding)
- Bulk toolbar: ~44px (14px text + 12px top/bottom padding)
- Empty state: ~128px (48px icon + text + 32px padding)

### Element Widths
- All elements: 100% of container
- Top fields: ~33.33% each (minus gaps)
- Warehouse search: Flexible (1fr)
- Quantity input: 128px
- Add button: Auto (content-based)
- Table columns: 48px, 1fr, 160px, 80px
- Checkbox: 16px
- Radio button: 16px
- Icons: 16px (most), 48px (empty state)

### Borders
- Section header: 1px bottom
- Input fields: 1px all sides
- Add warehouse panel: 1px all sides
- Dropdown: 1px all sides
- Dropdown items: 1px bottom (except last)
- Table: 1px all sides
- Table rows: 1px bottom
- Bulk toolbar: 1px all sides

### Border Radius
- Input fields: 3px
- Add warehouse panel: 8px
- Dropdown: 8px
- Table container: 8px
- Bulk toolbar: 8px
- Remove icon hover: 3px
- Empty state: 8px

---

## 📊 Component Metrics

| Metric | Value |
|--------|-------|
| **Total Interactive Elements** | 10+ (inputs, radios, checkboxes, buttons) |
| **Visual States** | 20+ states |
| **Validation Rules** | 4 rules |
| **Color Variations** | 25+ colors |
| **Spacing Values** | 15+ unique spacings |
| **Font Sizes** | 4 sizes (12px, 14px, 15px) |
| **Conditional Sections** | 3 (warehouse interface, table, empty state) |

---

**Component:** `InventoryValuationInput`  
**Design System Version:** 1.0.0  
**Last Updated:** December 31, 2025  
**Design Status:** ✅ Finalized
