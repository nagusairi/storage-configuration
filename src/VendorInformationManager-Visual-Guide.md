# 🎨 VendorInformationManager - Visual Guide

## Component Name: `VendorInformationManager`

---

## 📐 **Visual States & Interactions**

### State 1: Empty State (No Vendors)

```
┌───────────────────────────────────────────────────────┐
│ Vendor Information                      [Add Vendor]  │
├───────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐   │
│ │ ☐ | Name | Code | Contact | Price | Time |... │   │
│ ├─────────────────────────────────────────────────┤   │
│ │                                                 │   │
│ │   No vendors attached to this item yet.        │   │
│ │   Click "Add Vendor" to get started.           │   │
│ │                                                 │   │
│ └─────────────────────────────────────────────────┘   │
│ Click on a vendor row to view or edit details...     │
└───────────────────────────────────────────────────────┘

No bulk toolbar
No selection
Helpful empty message
```

---

### State 2: With Vendors (Normal)

```
┌───────────────────────────────────────────────────────┐
│ Vendor Information                      [Add Vendor]  │
├───────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐   │
│ │ ☐ | Vendor Name  | Code  | Contact | Price  |🗑│   │
│ ├─────────────────────────────────────────────────┤   │
│ │ ☐ | Acme Corp    | V001  | John    | $100   |🗑│ ← Row
│ │ ☐ | Tech Co      | V002  | Jane    | $150   |🗑│   │
│ │ ☐ | Suppliers Inc| V003  | Bob     | $200   |🗑│   │
│ └─────────────────────────────────────────────────┘   │
│ Click on a vendor row to view or edit details...     │
└───────────────────────────────────────────────────────┘

Rows clickable
Individual delete icons
Helper text
```

---

### State 3: Row Hover

```
┌───────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────┐   │
│ │ ☐ | Vendor Name  | Code  | Contact | Price  |🗑│   │
│ ├─────────────────────────────────────────────────┤   │
│ │ ☐ | Acme Corp    | V001  | John    | $100   |🗑│ ← Normal
│ ├═════════════════════════════════════════════════┤   │
│ ║ ☐ | Tech Co      | V002  | Jane    | $150   |🗑║ ← Hover (purple-50 bg)
│ ├─────────────────────────────────────────────────┤   │
│ │ ☐ | Suppliers Inc| V003  | Bob     | $200   |🗑│   │
│ └─────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘

Purple background on hover
Cursor: pointer
```

---

### State 4: Vendors Selected (Bulk Toolbar Appears)

```
┌───────────────────────────────────────────────────────┐
│ Vendor Information                      [Add Vendor]  │
├───────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐   │
│ │ 2 vendors selected  Clear selection             │   │ ← Bulk toolbar
│ │                        [Remove Selected] 🗑      │   │   (purple bg)
│ └─────────────────────────────────────────────────┘   │
│ ┌─────────────────────────────────────────────────┐   │
│ │ ☑ | Vendor Name  | Code  | Contact | Price  |🗑│ ← Header
│ ├─────────────────────────────────────────────────┤   │
│ ║ ☑ | Acme Corp    | V001  | John    | $100   |🗑║ ← Selected
│ ├─────────────────────────────────────────────────┤   │
│ │ ☐ | Tech Co      | V002  | Jane    | $150   |🗑│   │
│ ├═════════════════════════════════════════════════┤   │
│ ║ ☑ | Suppliers Inc| V003  | Bob     | $200   |🗑║ ← Selected
│ └─────────────────────────────────────────────────┘   │
│ Select vendors using checkboxes and click...         │
└───────────────────────────────────────────────────────┘

Selected rows: purple-50 bg
Checkboxes checked
Bulk toolbar visible
```

---

### State 5: Add Vendor Modal (Search Empty)

```
          ┌──────────────────────────────┐
          │ Add Vendor to Item      [x]  │
          │ Select vendors from your...  │
          ├──────────────────────────────┤
          │ ┌──────────────────────────┐ │
          │ │ 🔍 Search vendors...     │ │
          │ └──────────────────────────┘ │
          │ ☐ Select all                 │
          ├──────────────────────────────┤
          │ ┌──────────────────────────┐ │
          │ │ ☐ Acme Corp - VEN-001    │ │
          │ │   john@acme.com          │ │
          │ │   Price: $100 • Lead: 2w │ │
          │ └──────────────────────────┘ │
          │ ┌──────────────────────────┐ │
          │ │ ☐ Tech Co - VEN-002      │ │
          │ │   jane@tech.com          │ │
          │ │   Price: $150 • Lead: 3w │ │
          │ └──────────────────────────┘ │
          ├──────────────────────────────┤
          │ [Cancel]     [Add Vendors]   │
          └──────────────────────────────┘

Vendor cards with details
No selection yet
"Add Vendors" disabled
```

---

### State 6: Add Vendor Modal (With Search)

```
          ┌──────────────────────────────┐
          │ Add Vendor to Item      [x]  │
          ├──────────────────────────────┤
          │ ┌──────────────────────────┐ │
          │ │ 🔍 acme                  │ │ ← Search term
          │ └──────────────────────────┘ │
          │ ☐ Select all    Found 1 vendor│ ← Result count
          ├──────────────────────────────┤
          │ ┌──────────────────────────┐ │
          │ │ ☐ Acme Corp - VEN-001    │ │ ← Only result
          │ │   john@acme.com          │ │
          │ │   Price: $100 • Lead: 2w │ │
          │ └──────────────────────────┘ │
          ├──────────────────────────────┤
          │ [Cancel]     [Add Vendors]   │
          └──────────────────────────────┘

Real-time filtering
Result counter
```

---

### State 7: Add Vendor Modal (Vendors Selected)

```
          ┌──────────────────────────────┐
          │ Add Vendor to Item      [x]  │
          ├──────────────────────────────┤
          │ ┌──────────────────────────┐ │
          │ │ 🔍 Search vendors...     │ │
          │ └──────────────────────────┘ │
          │ ☑ Select all  (2 selected)   │ ← Selection count
          ├──────────────────────────────┤
          │ ┌══════════════════════════┐ │
          │ ║ ☑ Acme Corp - VEN-001    ║ │ ← Selected (purple)
          │ ║   john@acme.com          ║ │
          │ ║   Price: $100 • Lead: 2w ║ │
          │ └══════════════════════════┘ │
          │ ┌──────────────────────────┐ │
          │ │ ☐ Tech Co - VEN-002      │ │
          │ │   jane@tech.com          │ │
          │ │   Price: $150 • Lead: 3w │ │
          │ └──────────────────────────┘ │
          │ ┌══════════════════════════┐ │
          │ ║ ☑ Suppliers - VEN-003    ║ │ ← Selected (purple)
          │ ║   bob@suppliers.com      ║ │
          │ ║   Price: $200 • Lead: 1w ║ │
          │ └══════════════════════════┘ │
          ├──────────────────────────────┤
          │ [Cancel]   [Add 2 Vendors]   │ ← Count in button
          └──────────────────────────────┘

Purple border/bg for selected
Button shows count
```

---

### State 8: Add Vendor Modal (No Results)

```
          ┌──────────────────────────────┐
          │ Add Vendor to Item      [x]  │
          ├──────────────────────────────┤
          │ ┌──────────────────────────┐ │
          │ │ 🔍 xyz123                │ │
          │ └──────────────────────────┘ │
          ├──────────────────────────────┤
          │                              │
          │        🔍 (large icon)       │
          │                              │
          │  No vendors found matching   │
          │        "xyz123"              │
          │                              │
          │  Try a different search term │
          │                              │
          ├──────────────────────────────┤
          │ [Cancel]     [Add Vendors]   │
          └──────────────────────────────┘

Empty state with icon
Helpful message
Shows search term
```

---

### State 9: Add Vendor Modal (All Attached)

```
          ┌──────────────────────────────┐
          │ Add Vendor to Item      [x]  │
          ├──────────────────────────────┤
          │ ┌──────────────────────────┐ │
          │ │ 🔍 Search vendors...     │ │
          │ └──────────────────────────┘ │
          ├──────────────────────────────┤
          │                              │
          │                              │
          │  All available vendors have  │
          │  been attached to this item. │
          │                              │
          │                              │
          ├──────────────────────────────┤
          │ [Cancel]     [Add Vendors]   │
          └──────────────────────────────┘

No search needed
Simple message
```

---

### State 10: Remove Confirmation (Single Vendor)

```
        ┌────────────────────────────┐
        │ Remove Vendor              │
        │ Are you sure you want to   │
        │ remove this vendor from    │
        │ the item?                  │
        ├────────────────────────────┤
        │ ┌────────────────────────┐ │
        │ │ 🗑️ Acme Corp           │ │
        │ │    VEN-001             │ │
        │ │                        │ │
        │ │ This will remove the   │ │
        │ │ vendor association...  │ │
        │ └────────────────────────┘ │
        ├────────────────────────────┤
        │ [Cancel]  [Remove Vendor]  │
        └────────────────────────────┘

Single vendor card
Explanation text
Red delete button
```

---

### State 11: Remove Confirmation (Bulk Vendors)

```
        ┌────────────────────────────┐
        │ Remove 3 Vendors           │
        │ Are you sure you want to   │
        │ remove 3 vendors from      │
        │ this item?                 │
        ├────────────────────────────┤
        │ ┌────────────────────────┐ │
        │ │ ⚠️ These vendors will  │ │ ← Warning
        │ │ be removed from this   │ │
        │ │ item but will remain...│ │
        │ └────────────────────────┘ │
        │ ┌────────────────────────┐ │
        │ │ 🗑️ Acme Corp - V001    │ │ ← Vendor 1
        │ └────────────────────────┘ │
        │ ┌────────────────────────┐ │
        │ │ 🗑️ Tech Co - V002      │ │ ← Vendor 2
        │ └────────────────────────┘ │
        │ ┌────────────────────────┐ │
        │ │ 🗑️ Suppliers - V003    │ │ ← Vendor 3
        │ └────────────────────────┘ │
        ├────────────────────────────┤
        │ [Cancel] [Remove 3 Vendors]│
        └────────────────────────────┘

Warning banner
List of vendors
Count in button
```

---

### State 12: Vendor Details Pane (View Mode)

```
┌─────────────────────────┐
│ Vendor Details     [x]  │
│ View vendor info...     │
├─────────────────────────┤
│                         │ ← Scrollable
│ Basic Information       │   content
│ ─────────────────────   │
│ Vendor Name             │
│ Acme Corp               │
│                         │
│ Vendor Code             │
│ VEN-001                 │
│                         │
│ Contact Person          │
│ John Smith              │
│                         │
│ Email                   │
│ john@acme.com           │
│                         │
│ Phone                   │
│ +1 234 567 8900         │
│                         │
│ Pricing & Terms         │
│ ─────────────────────   │
│ Purchase Price          │
│ USD 100                 │
│                         │
│ Lead Time               │
│ 2 weeks                 │
│                         │
│ Minimum Order Quantity  │
│ 10 units                │
│                         │
│ Preferred Vendor        │
│ [Yes] (green badge)     │
│                         │
│ Notes                   │
│ ─────────────────────   │
│ Reliable supplier for   │
│ electronic components.  │
│                         │
├─────────────────────────┤
│ [Remove]      [Edit]    │ ← Footer
└─────────────────────────┘

Read-only fields
Green/gray badges
Two action buttons
```

---

### State 13: Vendor Details Pane (Edit Mode)

```
┌─────────────────────────┐
│ Edit Vendor        [x]  │
│ Update vendor details...│
├─────────────────────────┤
│                         │ ← Scrollable
│ Basic Information       │   content
│ ─────────────────────   │
│ Vendor Name *           │
│ ┌─────────────────────┐ │
│ │ Acme Corp          │ │ ← Editable
│ └─────────────────────┘ │
│                         │
│ Vendor Code *           │
│ ┌─────────────────────┐ │
│ │ VEN-001            │ │
│ └─────────────────────┘ │
│                         │
│ Contact Person          │
│ ┌─────────────────────┐ │
│ │ John Smith         │ │
│ └─────────────────────┘ │
│ ...                     │
│                         │
│ Pricing & Terms         │
│ ─────────────────────   │
│ Purchase Price *        │
│ ┌───┐ ┌──────────────┐ │
│ │USD│ │100           │ │ ← Split input
│ └───┘ └──────────────┘ │
│                         │
│ Lead Time *             │
│ ┌─────┐ ┌────────────┐ │
│ │2    │ │weeks ▼     │ │
│ └─────┘ └────────────┘ │
│ ...                     │
│                         │
│ ☑ Mark as Preferred     │ ← Checkbox
│                         │
│ Notes                   │
│ ┌─────────────────────┐ │
│ │ Reliable supplier...│ │ ← Textarea
│ │                     │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ [Cancel]      [Save]    │ ← Footer
└─────────────────────────┘

Form inputs
Split currency/price
Dropdown selects
Checkbox
```

---

## 🎨 **Color Palette**

| Element | Color | Usage |
|---------|-------|-------|
| **Primary Button** | `#5C1F3D` | Add, Save, Edit buttons |
| **Primary Hover** | `#4a1831` | Button hover state |
| **Purple Selection** | `purple-50` | Selected rows, toolbar bg |
| **Purple Border** | `purple-200` | Toolbar border, selected cards |
| **Danger Button** | `#EF4444` | Remove buttons |
| **Danger Hover** | `#DC2626` | Remove button hover |
| **Table Border** | `gray-200` | Table borders |
| **Row Border** | `gray-100` | Row separators |
| **Text Primary** | `gray-900` | Main text |
| **Text Secondary** | `gray-600` | Supporting text |
| **Text Muted** | `gray-500` | Helper text |
| **Background** | `white` | Modals, panes, table |
| **Background Alt** | `gray-50` | Headers, footers |

---

## 📏 **Dimensions**

| Element | Height | Width | Notes |
|---------|--------|-------|-------|
| **Section Header** | 40px | 100% | With border |
| **Add Button** | 40px | Auto | Standard button |
| **Bulk Toolbar** | Auto | 100% | Padding: 12px 16px |
| **Table Header** | Auto | 100% | Padding: 12px 16px |
| **Table Row** | Auto | 100% | Padding: 12px 16px |
| **Checkbox** | 16px | 16px | Standard checkbox |
| **Modal** | Max 90vh | 600px | Centered |
| **Remove Modal** | Max 90vh | 520px | Centered |
| **Side Pane** | 100vh | 500px | Fixed right |
| **Text Input** | 40px | 100% | Standard height |
| **Button** | 40px | Auto | Standard height |

---

## 🔤 **Typography**

| Element | Font Size | Weight | Color |
|---------|-----------|--------|-------|
| **Section Title** | 15px | Medium | Gray-900 |
| **Modal Title** | 16px (base) | Medium | Gray-900 |
| **Modal Subtitle** | 12px (xs) | Normal | Gray-500 |
| **Pane Title** | 16px (base) | Medium | Gray-900 |
| **Pane Subtitle** | 12px (xs) | Normal | Gray-500 |
| **Table Header** | 12px (xs) | Normal | Gray-600 |
| **Table Cell** | 14px (sm) | Normal | Gray-900/600 |
| **Button Text** | 14px (sm) | Normal | White/Gray-700 |
| **Helper Text** | 12px (xs) | Normal | Gray-500 |
| **Label** | 14px (sm) | Normal | Gray-700 |
| **Field Label** | 12px (xs) | Normal | Gray-500 |

---

## 🎯 **Interactive States**

### Button States
```
┌─────────────────────────────────────────┐
│ STATE       │ BACKGROUND  │ TEXT        │
├─────────────┼─────────────┼─────────────┤
│ Default     │ #5C1F3D     │ White       │
│ Hover       │ #4a1831     │ White       │
│ Disabled    │ #5C1F3D     │ White (40%) │
│ Secondary   │ White       │ Gray-700    │
│ Sec Hover   │ Gray-50     │ Gray-700    │
│ Danger      │ #EF4444     │ White       │
│ Danger Hover│ #DC2626     │ White       │
└─────────────┴─────────────┴─────────────┘
```

### Row States
```
┌─────────────────────────────────────┐
│ STATE      │ BACKGROUND │ CURSOR   │
├────────────┼────────────┼──────────┤
│ Default    │ White      │ Default  │
│ Hover      │ Purple-50  │ Pointer  │
│ Selected   │ Purple-50  │ Pointer  │
└────────────┴────────────┴──────────┘
```

### Vendor Card (Add Modal)
```
┌──────────────────────────────────────────┐
│ STATE      │ BORDER       │ BACKGROUND │
├────────────┼──────────────┼────────────┤
│ Default    │ Gray-200     │ White      │
│ Hover      │ #5C1F3D      │ Purple-50  │
│ Selected   │ #5C1F3D      │ Purple-50  │
└────────────┴──────────────┴────────────┘
```

---

## 📱 **Responsive Behavior**

### Desktop (All Features)
```
┌─────────────────────────────┐
│ Table: 100% width           │
│ Side Pane: 500px fixed      │
│ Modal: 600px centered       │
│ All features visible        │
└─────────────────────────────┘
```

### Tablet (Adjusted Pane)
```
┌─────────────────────────────┐
│ Table: 100% width           │
│ Side Pane: 400px fixed      │
│ Modal: 90% width max 600px  │
│ Consider full-width pane    │
└─────────────────────────────┘
```

### Mobile (Modal Approach)
```
┌─────────────────────────────┐
│ Table: Horizontal scroll    │
│ Side Pane: Full screen modal│
│ Modal: Full screen          │
│ Stack table columns         │
└─────────────────────────────┘
```

---

## 🎬 **Animation & Transitions**

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| **Row Hover** | `background` | 150ms | ease-in-out |
| **Button Hover** | `background` | 150ms | ease-in-out |
| **Card Select** | `border, bg` | 200ms | ease-in-out |
| **Modal Open** | `opacity` | 200ms | ease-out |
| **Pane Slide** | `transform` | 300ms | ease-in-out |
| **Backdrop** | `opacity` | 150ms | ease-in-out |

---

## 🔍 **Z-Index Hierarchy**

```
┌────────────────────────────────────┐
│ Layer 5: Side Pane (z-120)        │ ← Highest
├────────────────────────────────────┤
│ Layer 4: Pane Backdrop (z-110)    │
├────────────────────────────────────┤
│ Layer 3: Modals (z-50)            │
├────────────────────────────────────┤
│ Layer 2: Content (z-0)            │
├────────────────────────────────────┤
│ Layer 1: Background (z-0)         │ ← Lowest
└────────────────────────────────────┘
```

---

## ✅ **Visual Checklist**

Use this to verify correct implementation:

- [ ] Section header shows "Vendor Information" (or custom title)
- [ ] "Add Vendor" button is on the right
- [ ] Empty state shows helpful message
- [ ] Table has 8 columns
- [ ] Checkboxes appear in first column
- [ ] Trash icon appears in last column
- [ ] Rows have purple-50 background on hover
- [ ] Selected rows have purple-50 background always
- [ ] Bulk toolbar appears when vendors selected
- [ ] Bulk toolbar has purple-50 background
- [ ] Add modal is 600px wide
- [ ] Search bar has magnifying glass icon
- [ ] Vendor cards have purple border when selected
- [ ] "Select All" checkbox works correctly
- [ ] Remove modal shows vendor details
- [ ] Bulk remove shows all selected vendors
- [ ] Side pane slides from right
- [ ] Side pane is 500px wide
- [ ] View mode shows read-only fields
- [ ] Edit mode shows editable inputs
- [ ] All buttons are 40px height
- [ ] All inputs are 40px height
- [ ] Border radius is 3px everywhere
- [ ] Focus rings are 2px #5C1F3D

---

## 📖 **Related Documentation**

- **Full Docs:** `/docs/VendorInformationManager-Component-Documentation.md`
- **Quick Ref:** `/docs/VendorInformationManager-Quick-Reference.md`
- **Summary:** `/VendorInformationManager-Implementation-Summary.md`

---

**Last Updated:** December 31, 2024
