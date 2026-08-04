# 🎨 GSTDetailsInput - Visual Guide

## Component Name: `GSTDetailsInput`

---

## 📐 **Visual States**

### State 1: GST Toggle OFF (Initial State)

```
┌─────────────────────────────────────────────────────────┐
│ GST Details                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ GST Applicability *  [○───●] No                        │
│ ℹ GST will not be applied to this item.               │
│                                                         │
└─────────────────────────────────────────────────────────┘

Fields below are HIDDEN
```

---

### State 2: GST Toggle ON (Fields Visible)

```
┌─────────────────────────────────────────────────────────┐
│ GST Details                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ GST Applicability *  [●───○] Yes                       │
│ ℹ GST will be applied to this item. HSN/SAC Code and  │
│   GST Rate are required                                │
│                                                         │
│ ┌────────────────────────┐  ┌────────────────────────┐ │
│ │ HSN/SAC Code *         │  │ GST Rate *            │ │
│ │ ┌────────────────────┐ │  │ ┌────────────────────┐│ │
│ │ │ Search SAC code... │ │  │ │ Select GST rate ▼ ││ │
│ │ └────────────────────┘ │  │ └────────────────────┘│ │
│ └────────────────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

### State 3: Dropdown Open (No Search Term)

```
┌─────────────────────────────────────────────────────────┐
│ HSN/SAC Code *                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Search SAC code...                         🔍  │    │
│ └─────────────────────────────────────────────────┘    │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Showing all 10 SAC codes. Type to search...    │    │
│ │ Try: "software", "consulting", "995411"         │    │
│ ├─────────────────────────────────────────────────┤    │
│ │ 998314                               [18%]      │ ◄─ Hover
│ │ Software development services                   │    │
│ ├─────────────────────────────────────────────────┤    │
│ │ 996511                               [18%]      │    │
│ │ Accounting and bookkeeping services             │    │
│ ├─────────────────────────────────────────────────┤    │
│ │ 998313                               [18%]      │    │
│ │ IT consulting services                          │    │
│ ├─────────────────────────────────────────────────┤    │
│ │ 995411                               [18%]      │    │
│ │ Advertising services                            │    │
│ └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

Purple hover background on mouse over
```

---

### State 4: Dropdown with Search Results

```
┌─────────────────────────────────────────────────────────┐
│ HSN/SAC Code *                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ software                                   🔍  │    │
│ └─────────────────────────────────────────────────┘    │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Found 2 results                                 │    │
│ ├─────────────────────────────────────────────────┤    │
│ │ 998314                               [18%]      │    │
│ │ Software development services                   │    │
│ ├─────────────────────────────────────────────────┤    │
│ │ 998315                               [18%]      │    │
│ │ Software testing services                       │    │
│ └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

Real-time filtering as you type
```

---

### State 5: No Results Found

```
┌─────────────────────────────────────────────────────────┐
│ HSN/SAC Code *                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ xyz123                                     🔍  │    │
│ └─────────────────────────────────────────────────┘    │
│ ┌─────────────────────────────────────────────────┐    │
│ │                                                 │    │
│ │         No SAC codes found                      │    │
│ │                                                 │    │
│ │   Try searching: "software", "consulting",      │    │
│ │                  "995411"                       │    │
│ │                                                 │    │
│ └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

Helpful hints for user
```

---

### State 6: Code Selected (Success)

```
┌─────────────────────────────────────────────────────────┐
│ HSN/SAC Code *                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 998314                                     🔍  │    │
│ └─────────────────────────────────────────────────┘    │
│ ✓ Selected: 998314 - Software development services     │
│                                                         │
│ GST Rate *                                              │
│ ┌─────────────────────────────────────────────────┐    │
│ │ 18%                                         ▼  │    │ ◄─ Auto-filled!
│ └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

Green success message
GST Rate auto-populated
```

---

### State 7: Validation Error

```
┌─────────────────────────────────────────────────────────┐
│ HSN/SAC Code *                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │                                            🔍  │ ◄─ Red border
│ └─────────────────────────────────────────────────┘    │
│ ✗ SAC Code is required when GST is applicable          │ ◄─ Red text
│                                                         │
└─────────────────────────────────────────────────────────┘

Red border + error message
```

---

### State 8: Disabled (GST Toggle OFF)

```
┌─────────────────────────────────────────────────────────┐
│ HSN/SAC Code *                                          │
│ ┌─────────────────────────────────────────────────┐    │
│ │                                            🔍  │ ◄─ Gray bg, 60% opacity
│ └─────────────────────────────────────────────────┘    │
│ Enable GST Applicability to edit this field            │ ◄─ Helper text
│                                                         │
│ GST Rate *                                              │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Select GST rate                             ▼  │ ◄─ Gray bg, 60% opacity
│ └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘

Fields disabled, cursor not-allowed
```

---

## 🎨 **Color Palette**

| Element | Color | Usage |
|---------|-------|-------|
| **Toggle Active** | `#5C1F3D` | Primary ERP color |
| **Toggle Inactive** | `#E5E7EB` (gray-200) | Neutral state |
| **Dropdown Hover** | `#FAF5FF` (purple-50) | Item hover |
| **GST Badge** | `#5C1F3D` bg + white text | Rate badge |
| **Success Text** | `#059669` (green-600) | Confirmation |
| **Error Border** | `#EF4444` (red-500) | Validation |
| **Error Text** | `#EF4444` (red-500) | Error message |
| **Helper Text** | `#6B7280` (gray-500) | Instructions |
| **Disabled BG** | `#F9FAFB` (gray-50) | Disabled state |

---

## 📏 **Dimensions**

| Element | Height | Width | Notes |
|---------|--------|-------|-------|
| **Toggle Switch** | 24px (h-6) | 44px (w-11) | Standard toggle |
| **Input Field** | 40px (h-10) | 100% | Matches ERP forms |
| **Dropdown** | Max 320px | 100% | Scrollable |
| **GST Badge** | Auto | Auto | Padding: 2px 8px |
| **Border Radius** | 3px | - | Standard ERP radius |

---

## 🔤 **Typography**

| Element | Font Size | Weight | Color |
|---------|-----------|--------|-------|
| **Section Header** | 15px | Medium | Gray-900 |
| **Label** | 14px (text-sm) | Normal | Gray-700 |
| **Input Text** | 14px (text-sm) | Normal | Gray-900 |
| **Placeholder** | 14px (text-sm) | Normal | Gray-400 |
| **Helper Text** | 12px (text-xs) | Normal | Gray-500 |
| **Error Text** | 12px (text-xs) | Normal | Red-500 |
| **Success Text** | 12px (text-xs) | Normal | Green-600 |
| **Dropdown Item** | 14px (text-sm) | Normal | Gray-900 |
| **Dropdown Desc** | 12px (text-xs) | Normal | Gray-600 |

---

## 🎯 **Interactive States**

### Toggle Switch
```
┌─────────────────────────────────────┐
│ STATE         │ BACKGROUND │ SLIDER │
├───────────────┼────────────┼────────┤
│ Off           │ Gray-200   │ Left   │
│ On            │ #5C1F3D    │ Right  │
│ Focus (Off)   │ Gray-200   │ Ring   │
│ Focus (On)    │ #5C1F3D    │ Ring   │
│ Disabled      │ Gray-200   │ 50%    │
└───────────────┴────────────┴────────┘
```

### Input Field
```
┌─────────────────────────────────────────┐
│ STATE      │ BORDER      │ RING        │
├────────────┼─────────────┼─────────────┤
│ Default    │ Gray-300    │ None        │
│ Focus      │ Transparent │ 2px #5C1F3D │
│ Error      │ Red-500     │ None        │
│ Success    │ Gray-300    │ None        │
│ Disabled   │ Gray-300    │ None        │
└────────────┴─────────────┴─────────────┘
```

### Dropdown Items
```
┌──────────────────────────────────────┐
│ STATE   │ BACKGROUND  │ TEXT       │
├─────────┼─────────────┼────────────┤
│ Default │ White       │ Gray-900   │
│ Hover   │ Purple-50   │ Gray-900   │
│ Active  │ Purple-100  │ Gray-900   │
└─────────┴─────────────┴────────────┘
```

---

## 📱 **Responsive Behavior**

### Desktop (≥1024px)
```
┌────────────────────────┐  ┌────────────────────────┐
│ HSN/SAC Code           │  │ GST Rate              │
│ [Search...]            │  │ [Select GST rate ▼]   │
└────────────────────────┘  └────────────────────────┘

Two columns side-by-side
```

### Mobile (<1024px)
```
┌────────────────────────────────────┐
│ HSN/SAC Code                       │
│ [Search SAC code...]               │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ GST Rate                           │
│ [Select GST rate ▼]                │
└────────────────────────────────────┘

Single column, stacked vertically
```

---

## 🎬 **Animation & Transitions**

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| **Toggle Slider** | `translate-x` | 150ms | ease-in-out |
| **Dropdown Open** | `opacity` | 200ms | ease-out |
| **Item Hover** | `background` | 150ms | ease-in-out |
| **Border Color** | `border-color` | 150ms | ease-in-out |

---

## 🔍 **Z-Index Hierarchy**

```
┌──────────────────────────────────┐
│ Layer 4: Dropdown (z-50)        │ ← Highest
├──────────────────────────────────┤
│ Layer 3: Backdrop (z-10)        │
├──────────────────────────────────┤
│ Layer 2: Sticky Header (z-10)   │
├──────────────────────────────────┤
│ Layer 1: Content (z-0)          │ ← Lowest
└──────────────────────────────────┘
```

---

## ✅ **Visual Checklist**

Use this to verify correct implementation:

- [ ] Toggle switch is purple (#5C1F3D) when active
- [ ] Toggle switch is gray when inactive
- [ ] Fields appear when toggle is ON
- [ ] Fields hide when toggle is OFF
- [ ] Help text changes based on toggle state
- [ ] Dropdown shows all codes on focus (no search)
- [ ] Dropdown filters in real-time as you type
- [ ] Result counter updates correctly
- [ ] Hover state is purple-50 background
- [ ] Selected code shows green confirmation
- [ ] GST rate auto-fills when code selected
- [ ] Error state shows red border + message
- [ ] Disabled state is gray with 60% opacity
- [ ] Search icon appears on the right
- [ ] GST rate badge is purple with white text
- [ ] All text sizes match specification
- [ ] Border radius is 3px everywhere
- [ ] Input height is 40px

---

## 🎨 **Design System Compliance**

✅ Matches ERP design guidelines  
✅ Uses primary color (#5C1F3D)  
✅ Standard form heights (40px)  
✅ Border radius (3px)  
✅ Focus ring (2px primary color)  
✅ Error states (red-500)  
✅ Success states (green-600)  
✅ Disabled states (60% opacity)  
✅ Responsive grid layout  
✅ Consistent spacing  

---

## 📖 **Related Documentation**

- **Full Docs:** `/docs/GSTDetailsInput-Component-Documentation.md`
- **Quick Ref:** `/docs/GSTDetailsInput-Quick-Reference.md`
- **Summary:** `/GSTDetailsInput-Implementation-Summary.md`

---

**Last Updated:** December 31, 2024
