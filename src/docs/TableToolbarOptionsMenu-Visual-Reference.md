# TableToolbarOptionsMenu - Visual Reference Guide

> **Component:** `/components/ui/TableToolbarOptionsMenu.tsx`  
> **Purpose:** Precise visual specifications for designers and developers

---

## Component Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│                    TRIGGER BUTTON                           │
│  ┌────────────────────────────────────────┐                │
│  │  ╔════════════════════════════════╗    │                │
│  │  ║  ⋮  MoreVertical Icon (16x16) ║    │                │
│  │  ╚════════════════════════════════╝    │                │
│  │   ← 8px padding (all sides) →          │                │
│  │   Height: 40px (h-10)                  │                │
│  │   Border: 1px solid #D1D5DB            │                │
│  │   Radius: 4px                          │                │
│  └────────────────────────────────────────┘                │
│                      ↓ 4px gap (mt-1)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              DROPDOWN MENU (192px wide)             │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ┌───┬─────────────────────────────────────────┐   │   │
│  │  │ ⊟ │ Filters                              │   │   │
│  │  └───┴─────────────────────────────────────────┘   │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  ┌───┬─────────────────────────────────────────┐   │   │
│  │  │ ☰ │ Density                              │   │   │
│  │  └───┴─────────────────────────────────────────┘   │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  ┌───┬─────────────────────────────────────────┐   │   │
│  │  │ ▦ │ Columns                              │   │   │
│  │  └───┴─────────────────────────────────────────┘   │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  ┌───┬─────────────────────────────────────────┐   │   │
│  │  │ ↓ │ Export                               │   │   │
│  │  └───┴─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│     ↑                                                       │
│     Each item: 16px L/R padding, 10px T/B padding          │
│     Icon size: 16x16px, 8px gap from label                 │
│     Border: 1px solid #E5E7EB                              │
│     Shadow: shadow-lg                                      │
│     Radius: 8px                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Precise Measurements

### Trigger Button (Default Size)

```
┌──────────────────────────────────────┐
│    ┌────────────────────────┐        │
│ 8px│  MoreVertical (16x16) │ 8px    │
│    └────────────────────────┘        │
└──────────────────────────────────────┘
   ↑                          ↑
  8px                       8px
  (padding-top)          (padding-bottom)

Total Width:  16px (icon) + 16px (padding) = 32px
Total Height: 16px (icon) + 16px (padding) = 32px
Actual Height: 40px (h-10 override)
```

**CSS:**
```css
.trigger-button {
  padding: 8px;            /* p-2 */
  height: 40px;            /* h-10 */
  border: 1px solid #D1D5DB; /* border border-gray-300 */
  border-radius: 4px;      /* rounded */
  background: transparent; /* default */
}

.trigger-button:hover {
  background: #F3F4F6;     /* bg-gray-100 */
  transition: background-color 150ms ease-in-out;
}

.trigger-icon {
  width: 16px;             /* w-4 */
  height: 16px;            /* h-4 */
  color: #4B5563;          /* text-gray-600 */
}
```

### Trigger Button (Small Size)

```
┌────────────────────────────────┐
│   ┌──────────────────────┐     │
│6px│  MoreVertical (14px) │6px  │
│   └──────────────────────┘     │
└────────────────────────────────┘
  ↑                      ↑
 6px                   6px

Total Width:  14px (icon) + 12px (padding) = 26px
Total Height: 32px (h-8)
```

**CSS:**
```css
.trigger-button-small {
  padding: 6px;            /* p-1.5 */
  height: 32px;            /* h-8 */
}

.trigger-icon-small {
  width: 14px;             /* w-3.5 */
  height: 14px;            /* h-3.5 */
}
```

### Trigger Button (Large Size)

```
┌──────────────────────────────────────┐
│     ┌────────────────────────┐       │
│10px │  MoreVertical (20x20) │ 10px  │
│     └────────────────────────┘       │
└──────────────────────────────────────┘
   ↑                          ↑
 10px                       10px

Total Width:  20px (icon) + 20px (padding) = 40px
Total Height: 48px (h-12)
```

**CSS:**
```css
.trigger-button-large {
  padding: 10px;           /* p-2.5 */
  height: 48px;            /* h-12 */
}

.trigger-icon-large {
  width: 20px;             /* w-5 */
  height: 20px;            /* h-5 */
}
```

---

## Dropdown Menu Container

```
┌────────────────────────────────────────────────────────────┐
│  Dropdown Menu - Detailed Measurements                     │
│                                                            │
│  Width: 192px (w-48)                                       │
│  Position: Absolute, Right-aligned                         │
│  Top Offset: 4px from trigger button (mt-1)                │
│  Background: #FFFFFF (bg-white)                            │
│  Border: 1px solid #E5E7EB (border-gray-200)               │
│  Border Radius: 8px (rounded-lg)                           │
│  Box Shadow: 0 10px 15px -3px rgba(0,0,0,0.1),            │
│              0 4px 6px -2px rgba(0,0,0,0.05)               │
│  Z-Index: 50                                               │
└────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.dropdown-menu {
  position: absolute;
  right: 0;                /* Align to right edge of trigger */
  top: 100%;               /* Below trigger button */
  margin-top: 4px;         /* mt-1 */
  width: 192px;            /* w-48 */
  background: #FFFFFF;     /* bg-white */
  border: 1px solid #E5E7EB; /* border border-gray-200 */
  border-radius: 8px;      /* rounded-lg */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  z-index: 50;             /* z-50 */
}
```

---

## Menu Item Structure

### Single Menu Item Anatomy

```
┌──────────────────────────────────────────────────────────┐
│  16px ├──┬────────────────────────────────────────┤ 16px│
│   ↓   │  │                                        │  ↑  │
│  10px ├──┼────────────────────────────────────────┤ 10px│
│   ↓   │  │  ┌────┐  ┌───────────────────────┐   │  ↑  │
│       │  │  │Icon│8px│ Label Text (14px)    │   │     │
│       │  │  └────┘  └───────────────────────┘   │     │
│  10px ├──┼────────────────────────────────────────┤ 10px│
│   ↑   │  │                                        │  ↓  │
│  16px ├──┴────────────────────────────────────────┤ 16px│
└──────────────────────────────────────────────────────────┘
   ↑                                              ↑
Padding-left: 16px                    Padding-right: 16px
Padding-top: 10px                     Padding-bottom: 10px
Icon: 16x16px                         Gap: 8px
```

**Total Height Calculation:**
- Padding Top: 10px (`py-2.5`)
- Text Line Height: ~20px (text-sm with normal line-height)
- Padding Bottom: 10px (`py-2.5`)
- **Total: ~40px per item**

**CSS:**
```css
.menu-item {
  width: 100%;             /* w-full */
  padding: 10px 16px;      /* px-4 py-2.5 */
  font-size: 14px;         /* text-sm */
  color: #374151;          /* text-gray-700 */
  text-align: left;        /* text-left */
  display: flex;           /* flex */
  align-items: center;     /* items-center */
  gap: 8px;                /* gap-2 */
  background: transparent; /* default */
  transition: background-color 150ms ease-in-out;
}

.menu-item:hover {
  background: #F9FAFB;     /* bg-gray-50 */
}

.menu-item-icon {
  width: 16px;             /* w-4 */
  height: 16px;            /* h-4 */
  color: #6B7280;          /* text-gray-500 */
  flex-shrink: 0;          /* Prevent icon from shrinking */
}
```

---

## Menu Item Dividers

```
┌────────────────────────────────────────────────┐
│  Menu Item Above                               │
└────────────────────────────────────────────────┘
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ← Divider (1px, #F3F4F6)
┌────────────────────────────────────────────────┐
│  Menu Item Below                               │
└────────────────────────────────────────────────┘
```

**CSS:**
```css
.menu-item-with-divider {
  border-top: 1px solid #F3F4F6; /* border-t border-gray-100 */
}
```

**Applied When:**
- `divider: true` in menu item configuration
- Automatically calculated based on previous visible items

---

## Border Radius Application

### First Menu Item (Top Corners)

```
╔════════════════════════════════════════╗  ← Top-left: 8px radius
║  ⊟   Filters                           ║  ← Top-right: 8px radius
╚════════════════════════════════════════╝
```

**CSS:**
```css
.menu-item:first-child {
  border-top-left-radius: 8px;    /* rounded-t-lg */
  border-top-right-radius: 8px;   /* rounded-t-lg */
}
```

### Last Menu Item (Bottom Corners)

```
╔════════════════════════════════════════╗
║  ↓   Export                            ║
╚════════════════════════════════════════╝  ← Bottom-left: 8px radius
                                           ← Bottom-right: 8px radius
```

**CSS:**
```css
.menu-item:last-child {
  border-bottom-left-radius: 8px; /* rounded-b-lg */
  border-bottom-right-radius: 8px; /* rounded-b-lg */
}
```

---

## Hover State Visual Reference

### Trigger Button Hover

**Default State:**
```
┌──────────────────┐
│  Background: transparent
│  Border: #D1D5DB (gray-300)
│  Icon: #4B5563 (gray-600)
└──────────────────┘
```

**Hover State:**
```
┌──────────────────┐
│  Background: #F3F4F6 (gray-100) ← CHANGE
│  Border: #D1D5DB (gray-300)
│  Icon: #4B5563 (gray-600)
│  Transition: 150ms ease-in-out
└──────────────────┘
```

### Menu Item Hover

**Default State:**
```
┌───────────────────────────────┐
│ ⊟  Filters
│ Background: transparent
│ Text: #374151 (gray-700)
│ Icon: #6B7280 (gray-500)
└───────────────────────────────┘
```

**Hover State:**
```
┌───────────────────────────────┐
│ ⊟  Filters
│ Background: #F9FAFB (gray-50) ← CHANGE
│ Text: #374151 (gray-700)
│ Icon: #6B7280 (gray-500)
│ Transition: 150ms ease-in-out
└───────────────────────────────┘
```

---

## Menu Positioning & Alignment

### Right-Aligned Menu (Default)

```
┌─────────────────────────────────────────────┐
│  Table Toolbar                              │
│  [Search...] [Filter] [Add Item] [⋮ Menu]  │
└─────────────────────────────────────────────┘
                                      ↓
                    ┌────────────────────────┐
                    │  Filters               │
                    │  ────────────────────  │
                    │  Density               │
                    │  ────────────────────  │
                    │  Columns               │
                    │  ────────────────────  │
                    │  Export                │
                    └────────────────────────┘
                    ↑
                    Right edge aligned
```

**CSS:**
```css
.dropdown-menu {
  right: 0;    /* Align to right edge of trigger */
  left: auto;  /* Not aligned to left */
}
```

---

## Color Palette Reference

### Trigger Button Colors

| Element | Default | Hover | CSS Variable |
|---------|---------|-------|--------------|
| **Background** | `transparent` | `#F3F4F6` | `bg-gray-100` |
| **Border** | `#D1D5DB` | `#D1D5DB` | `border-gray-300` |
| **Icon** | `#4B5563` | `#4B5563` | `text-gray-600` |

### Menu Container Colors

| Element | Color | CSS Variable |
|---------|-------|--------------|
| **Background** | `#FFFFFF` | `bg-white` |
| **Border** | `#E5E7EB` | `border-gray-200` |

### Menu Item Colors

| Element | Default | Hover | CSS Variable |
|---------|---------|-------|--------------|
| **Background** | `transparent` | `#F9FAFB` | `bg-gray-50` |
| **Text** | `#374151` | `#374151` | `text-gray-700` |
| **Icon** | `#6B7280` | `#6B7280` | `text-gray-500` |
| **Divider** | `#F3F4F6` | `#F3F4F6` | `border-gray-100` |

---

## Shadow Specifications

### Menu Dropdown Shadow (shadow-lg)

```css
box-shadow: 
  0 10px 15px -3px rgba(0, 0, 0, 0.1),  /* Main shadow */
  0 4px 6px -2px rgba(0, 0, 0, 0.05);   /* Subtle inner shadow */
```

**Visual Effect:**
- Creates a subtle elevation effect
- Separates menu from background content
- Provides depth perception

---

## Z-Index Hierarchy

```
Layer Stack (bottom to top):
┌─────────────────────────────────────┐
│  Page Content              (z-0)    │  ← Base layer
├─────────────────────────────────────┤
│  Backdrop                  (z-40)   │  ← Click-to-close overlay
├─────────────────────────────────────┤
│  Dropdown Menu             (z-50)   │  ← Menu content (highest)
└─────────────────────────────────────┘
```

**CSS:**
```css
.backdrop {
  z-index: 40;  /* Below menu, above content */
}

.dropdown-menu {
  z-index: 50;  /* Above backdrop */
}
```

---

## Responsive Behavior

### Desktop (Default)

```
Trigger Button: 40px height (h-10)
Menu Width: 192px (w-48)
```

### Tablet (md breakpoint)

```
No changes - Same as desktop
```

### Mobile (sm breakpoint)

```
Consider increasing touch target size:
Trigger Button: 44px min height (recommended)
Menu Width: Same (192px)
```

**Note:** Component does not implement responsive size changes by default. Use `size="large"` for better mobile UX.

---

## Accessibility Measurements

### Minimum Touch Target Size (Mobile)

**WCAG Guideline:** 44x44px minimum

| Size Variant | Width | Height | Meets WCAG? |
|--------------|-------|--------|-------------|
| **Small** | 26px | 32px | ❌ No |
| **Default** | 32px | 40px | ⚠️ Close |
| **Large** | 40px | 48px | ✅ Yes |

**Recommendation:** Use `size="large"` on mobile devices for better accessibility.

---

## Export for Design Tools

### Figma Auto Layout Specifications

```yaml
Component: TableToolbarOptionsMenu
Frame:
  Layout: Auto Layout
  Direction: Vertical
  Spacing: 0
  Padding: 0

Trigger Button:
  Layout: Auto Layout
  Direction: Horizontal
  Spacing: 0
  Padding: 8px (all sides)
  Fill: Transparent (default), #F3F4F6 (hover)
  Stroke: 1px #D1D5DB
  Corner Radius: 4px
  Width: Hug
  Height: Fixed (40px)

Dropdown Menu:
  Layout: Auto Layout
  Direction: Vertical
  Spacing: 0
  Padding: 0
  Fill: #FFFFFF
  Stroke: 1px #E5E7EB
  Corner Radius: 8px
  Width: Fixed (192px)
  Height: Hug
  Shadow: 0px 10px 15px -3px rgba(0,0,0,0.1)

Menu Item:
  Layout: Auto Layout
  Direction: Horizontal
  Spacing: 8px
  Padding: 10px 16px
  Fill: Transparent (default), #F9FAFB (hover)
  Width: Fill
  Height: Hug
```

---

## Print-Friendly Specifications

### For Developer Handoff

```
TRIGGER BUTTON (DEFAULT SIZE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Width:       Hug content
Height:      40px (fixed)
Padding:     8px all sides
Border:      1px solid #D1D5DB
Radius:      4px
Icon:        MoreVertical, 16x16px, #4B5563
Hover BG:    #F3F4F6

DROPDOWN MENU
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Width:       192px (fixed)
Position:    Absolute, right: 0, top: 100% + 4px
Background:  #FFFFFF
Border:      1px solid #E5E7EB
Radius:      8px
Shadow:      shadow-lg (0 10px 15px -3px rgba(0,0,0,0.1))
Z-Index:     50

MENU ITEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Width:       100%
Padding:     10px vertical, 16px horizontal
Text:        14px, #374151
Icon:        16x16px, #6B7280, 8px gap
Hover BG:    #F9FAFB
Divider:     1px solid #F3F4F6 (top border)
```

---

**Last Updated:** January 17, 2026  
**Component Version:** 1.0.0  
**Maintained By:** ERP Design System Team
