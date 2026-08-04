# SKUCodeInput - Design Specifications

## 🎨 Visual Design System

### Component Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Label & Mode Selector                                       │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ SKU Code *    ● Auto Generate    ○ Manual Entry            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ 2. Input Field (with optional Copy button)                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ SKU-AUTO-1735660800000                                 [📋] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ 3. Autocomplete Dropdown (Manual mode only)                    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Suggestions appear here]                                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ 4. Duplicate Warning Panel (when isDuplicate=true)             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Warning and AI suggestions appear here]                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📐 Measurements & Spacing

### Overall Container
- **Width:** `100%` (responsive)
- **Min Height:** Auto
- **Padding:** None (controlled by parent)

### 1. Label & Mode Selector Row
```
┌─ SKU Code * ──── Gap: 12px (gap-3) ────┬─── Gap: 16px (gap-4) ───┐
│                                         │                          │
│  Label (text-sm)                        │  Radio 1    Radio 2     │
│  + Asterisk (text-red-500)              │  (gap-1.5)  (gap-1.5)   │
│                                         │                          │
│  Margin Bottom: 8px (mb-2)              │                          │
└─────────────────────────────────────────┴──────────────────────────┘
```

**Specifications:**
- **Label Font Size:** 14px (`text-sm`)
- **Label Color:** `#374151` (`text-gray-700`)
- **Asterisk Color:** `#EF4444` (`text-red-500`)
- **Radio Button Size:** 16px (`w-4 h-4`)
- **Radio Active Color:** `#5C1F3D` (primary color)
- **Radio Label Font Size:** 14px (`text-sm`)
- **Gap between label and radios:** 12px (`gap-3`)
- **Gap between radio buttons:** 16px (`gap-4`)
- **Gap between radio and label:** 6px (`gap-1.5`)

### 2. Input Field
```
┌────────────────────────────────────────────────────────────┐
│  Padding: 12px (left) × 8px (top/bottom)                   │
│  Height: 40px (h-10)                                       │
│  Border: 1px solid #D1D5DB (border-gray-300)               │
│  Border Radius: 3px (rounded-[3px])                        │
│  Font Size: 14px (text-sm)                                 │
│  Min Height: 1.4375em                                      │
│                                                            │
│  [Copy Button - absolute positioned]                       │
│  Position: absolute right-2 top-1/2 -translate-y-1/2      │
│  Size: 16px × 16px (w-4 h-4)                               │
│  Padding: 6px (p-1.5)                                      │
└────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Height:** 40px (`h-10`)
- **Padding:** `12px 8px` (`px-3 py-2`)
- **Border:** 1px solid `#D1D5DB` (`border-gray-300`)
- **Border Radius:** 3px (`rounded-[3px]`)
- **Font Size:** 14px (`text-sm`)
- **Text Color (Enabled):** `#111827` (`text-gray-900`)
- **Text Color (Disabled):** `#9CA3AF` (`text-gray-400`)
- **Background (Enabled):** `#FFFFFF` (`bg-white`)
- **Background (Disabled):** `#F9FAFB` (`bg-gray-50`)
- **Focus Ring:** 2px `#5C1F3D` (`focus:ring-2 focus:ring-[#5C1F3D]`)

### 3. Copy Button
```
┌──────────────┐
│   [📋]       │  Size: 16×16px icon (w-4 h-4)
│   Padding:   │  Padding: 6px (p-1.5)
│   6px        │  Total clickable: 28×28px
└──────────────┘
```

**Specifications:**
- **Icon Size:** 16px × 16px (`w-4 h-4`)
- **Padding:** 6px (`p-1.5`)
- **Total Size:** 28px × 28px
- **Position:** Absolute, right 8px, vertically centered
- **Icon Color:** `#4B5563` (`text-gray-600`)
- **Background (Hover):** `#F3F4F6` (`hover:bg-gray-100`)
- **Border Radius:** 3px (`rounded`)
- **Success Feedback:** `#D1FAE5` (`bg-green-100`) for 1.5s

### 4. Autocomplete Dropdown
```
┌────────────────────────────────────────────────────────────┐
│  Position: absolute, top: 100% + 4px (mt-1)                │
│  Width: 100% (matches input)                               │
│  Max Height: 320px (max-h-80)                              │
│  Border: 1px solid #D1D5DB (border-gray-300)               │
│  Border Radius: 3px (rounded-[3px])                        │
│  Box Shadow: 0 10px 15px -3px rgba(0,0,0,0.1) (shadow-lg) │
│  Z-Index: 50 (z-50)                                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Error Banner (if isDuplicate)                        │  │
│  │ Padding: 12px 10px (px-3 py-2.5)                     │  │
│  │ Background: #FEF2F2 (bg-red-50)                      │  │
│  │ Border Bottom: 1px solid #FECACA (border-red-200)    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✨ AI-driven suggestions                            │  │
│  │ Padding: 6px 12px (px-3 py-1.5)                      │  │
│  │ Background: #FAF5FF (bg-purple-50)                   │  │
│  │ Font Size: 12px (text-xs)                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Suggestion Item                                      │  │
│  │ Padding: 10px 12px (px-3 py-2.5)                     │  │
│  │ Border Bottom: 1px solid #F9FAFB (border-gray-50)    │  │
│  │ Hover: #FAF5FF (hover:bg-purple-50 for AI)          │  │
│  │ Hover: #EFF6FF (hover:bg-blue-50 for System)        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Section Header Specifications:**
- **Padding:** `12px 6px` (`px-3 py-1.5`)
- **Font Size:** 12px (`text-xs`)
- **Font Weight:** Medium
- **AI Header Color:** `#7C3AED` (`text-purple-700`)
- **AI Header Background:** `#FAF5FF` (`bg-purple-50`)
- **System Header Color:** `#6B7280` (`text-gray-500`)
- **System Header Background:** `#F9FAFB` (`bg-gray-50`)

**Suggestion Item Specifications:**
- **Padding:** `12px 10px` (`px-3 py-2.5`)
- **Border Bottom:** 1px solid `#F9FAFB` (`border-gray-50`)
- **Font Size:** 14px (`text-sm`)
- **Font Family:** Monospace (`font-mono`)
- **Icon Size:** 16px (`w-4 h-4`)
- **Gap between elements:** 8px (`gap-2`)
- **Hover Background (AI):** `#FAF5FF` (`bg-purple-50`)
- **Hover Background (System):** `#EFF6FF` (`bg-blue-50`)
- **Active/Highlighted:** Same as hover

### 5. Duplicate Warning Panel
```
┌────────────────────────────────────────────────────────────┐
│  Margin Top: 8px (mt-2)                                    │
│  Padding: 12px (p-3)                                       │
│  Background: #FAF5FF (bg-purple-50)                        │
│  Border Left: 4px solid #5C1F3D (border-l-4)               │
│  Border Radius: 0 3px 3px 0 (rounded-r-[3px])              │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✨ Icon (16×16px) + Text Content                    │  │
│  │ Gap: 8px (gap-2)                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ AI Suggestions                                       │  │
│  │ Margin Top: 8px (mt-2)                               │  │
│  │                                                       │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ [AI] Badge + Confidence + Code + [Use this]    │   │  │
│  │ │ Gap: 8px (gap-2)                                │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │ ┌────────────────────────────────────────────────┐   │  │
│  │ │ [Pattern] Badge + Confidence + Code + [Button] │   │  │
│  │ └────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

**Panel Specifications:**
- **Margin Top:** 8px (`mt-2`)
- **Padding:** 12px (`p-3`)
- **Background:** `#FAF5FF` (`bg-purple-50`)
- **Border Left:** 4px solid `#5C1F3D` (`border-l-4 border-[#5C1F3D]`)
- **Border Radius:** `0 3px 3px 0` (`rounded-r-[3px]`)

**Badge Specifications:**
- **Padding:** `6px 4px` (`px-1.5 py-0.5`)
- **Font Size:** 12px (`text-xs`)
- **Border Radius:** 3px (`rounded`)
- **AI Badge:** `#DDD6FE` background, `#7C3AED` text (`bg-purple-100 text-purple-700`)
- **Pattern Badge:** `#DBEAFE` background, `#1D4ED8` text (`bg-blue-100 text-blue-700`)
- **Border:** 1px solid matching color

**Code Display Specifications:**
- **Padding:** `8px` (`px-2 py-1`)
- **Background:** `#FFFFFF` (`bg-white`)
- **Border:** 1px solid `#E5E7EB` (`border-gray-200`)
- **Border Radius:** 3px (`rounded`)
- **Font Size:** 12px (`text-xs`)
- **Font Family:** Monospace (`font-mono`)
- **Text Color:** `#111827` (`text-gray-900`)

**Action Button Specifications:**
- **Padding:** `4px 12px` (`px-3 py-1`)
- **Font Size:** 12px (`text-xs`)
- **Background:** `#5C1F3D` (`bg-[#5C1F3D]`)
- **Text Color:** `#FFFFFF` (`text-white`)
- **Border Radius:** 3px (`rounded-[3px]`)
- **Hover Background:** `#4a1831` (`hover:bg-[#4a1831]`)
- **White Space:** No wrap (`whitespace-nowrap`)

---

## 🎨 Color Palette Reference

### Primary Colors
| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **Primary (Deep Purple)** | `#5C1F3D` | `bg-[#5C1F3D]` | Radio active, focus ring, border accent |
| **Primary Dark** | `#4a1831` | `hover:bg-[#4a1831]` | Button hover state |

### Grayscale
| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **White** | `#FFFFFF` | `bg-white` | Input background, dropdown background |
| **Gray 50** | `#F9FAFB` | `bg-gray-50` | Disabled input background |
| **Gray 100** | `#F3F4F6` | `bg-gray-100` | Copy button hover |
| **Gray 200** | `#E5E7EB` | `border-gray-200` | Code border |
| **Gray 300** | `#D1D5DB` | `border-gray-300` | Input border |
| **Gray 400** | `#9CA3AF` | `text-gray-400` | Disabled text, icon |
| **Gray 500** | `#6B7280` | `text-gray-500` | System header text |
| **Gray 600** | `#4B5563` | `text-gray-600` | Copy icon |
| **Gray 700** | `#374151` | `text-gray-700` | Label text |
| **Gray 900** | `#111827` | `text-gray-900` | Input text |

### Status Colors
| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **Red 50** | `#FEF2F2` | `bg-red-50` | Error banner background |
| **Red 200** | `#FECACA` | `border-red-200` | Error banner border |
| **Red 500** | `#EF4444` | `text-red-500` | Required asterisk |
| **Red 600** | `#DC2626` | `text-red-600` | Error icon |
| **Red 800** | `#991B1B` | `text-red-800` | Error heading |

### AI/Accent Colors
| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **Purple 50** | `#FAF5FF` | `bg-purple-50` | AI header, hover, warning panel |
| **Purple 100** | `#DDD6FE` | `bg-purple-100` | AI badge background |
| **Purple 700** | `#7C3AED` | `text-purple-700` | AI header text, badge text |
| **Blue 50** | `#EFF6FF` | `bg-blue-50` | System suggestion hover |
| **Blue 100** | `#DBEAFE` | `bg-blue-100` | Pattern badge background |
| **Blue 700** | `#1D4ED8` | `text-blue-700` | Pattern badge text |
| **Green 100** | `#D1FAE5` | `bg-green-100` | Copy success feedback |

### Text Highlight
| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **Yellow 100** | `#FEF3C7` | `bg-yellow-100` | Matched text highlight |

---

## 🔤 Typography Specifications

### Font Families
```css
/* Labels, Radio text */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Input value, Suggestion text, Code displays */
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
```

### Font Sizes
| Element | Size (px) | Tailwind Class | Line Height |
|---------|-----------|----------------|-------------|
| **Label** | 14px | `text-sm` | Normal |
| **Radio Label** | 14px | `text-sm` | Normal |
| **Input Text** | 14px | `text-sm` | `1.4375em` |
| **Suggestion Text** | 14px | `text-sm` | Normal |
| **Suggestion Reason** | 12px | `text-xs` | Normal |
| **Section Header** | 12px | `text-xs` | Normal |
| **Badge Text** | 12px | `text-xs` | Normal |
| **Error Text** | 12px | `text-xs` | Normal |
| **Code Text** | 12px | `text-xs` | Normal |
| **Button Text** | 12px | `text-xs` | Normal |

### Font Weights
| Element | Weight | Tailwind Class |
|---------|--------|----------------|
| **Default** | 400 (Regular) | - |
| **Section Header** | 500 (Medium) | `font-medium` |
| **Error Heading** | 500 (Medium) | `font-medium` |
| **Highlighted Text** | 600 (Semibold) | `font-semibold` |

---

## 📏 Spacing System

### Margin Scale
```
mt-1  = 4px   (dropdown margin top)
mt-2  = 8px   (warning panel margin top)
mb-2  = 8px   (label margin bottom)
```

### Padding Scale
```
p-1.5 = 6px   (copy button padding)
p-3   = 12px  (warning panel padding)

px-2  = 8px   (code horizontal padding)
px-3  = 12px  (input, suggestion horizontal padding)

py-1    = 4px   (code, button vertical padding)
py-0.5  = 2px   (badge vertical padding)
py-1.5  = 6px   (section header vertical padding)
py-2    = 8px   (input vertical padding)
py-2.5  = 10px  (suggestion vertical padding)
```

### Gap Scale
```
gap-1.5 = 6px   (radio and label)
gap-2   = 8px   (suggestion items, warning content)
gap-3   = 12px  (label and radios)
gap-4   = 16px  (radio buttons)
```

---

## 🖼️ Visual States

### Input States

#### Default (Manual Mode)
- Border: `1px solid #D1D5DB`
- Background: `#FFFFFF`
- Text: `#111827`
- Cursor: text

#### Focus (Manual Mode)
- Border: transparent
- Ring: `2px solid #5C1F3D`
- Background: `#FFFFFF`
- Text: `#111827`
- Cursor: text

#### Disabled (Auto Mode)
- Border: `1px solid #D1D5DB`
- Background: `#F9FAFB`
- Text: `#9CA3AF`
- Cursor: not-allowed
- Opacity: 0.6

### Radio Button States

#### Unchecked
- Border: `2px solid #D1D5DB`
- Background: `#FFFFFF`
- Inner Circle: none

#### Checked
- Border: `2px solid #5C1F3D`
- Background: `#5C1F3D`
- Inner Circle: white

#### Focus
- Ring: `2px solid #5C1F3D`

### Suggestion States

#### Default
- Background: `#FFFFFF`
- Text: `#111827`
- Border Bottom: `1px solid #F9FAFB`

#### Hover (AI)
- Background: `#FAF5FF`
- Text: `#111827`
- Border Bottom: `1px solid #F9FAFB`

#### Hover (System)
- Background: `#EFF6FF`
- Text: `#111827`
- Border Bottom: `1px solid #F9FAFB`

#### Active/Highlighted
- Same as hover

### Copy Button States

#### Default
- Background: transparent
- Icon: `#4B5563`

#### Hover
- Background: `#F3F4F6`
- Icon: `#4B5563`

#### Success (After Copy)
- Background: `#D1FAE5`
- Icon: `#4B5563`
- Duration: 1.5 seconds

---

## ♿ Accessibility Annotations

### Focus Indicators
All interactive elements have visible focus states:
- **Radio buttons:** 2px purple ring
- **Input field:** 2px purple ring
- **Copy button:** Visible background on hover
- **Suggestions:** Background color change

### Color Contrast Ratios
- **Label text (#374151) on white:** 8.6:1 (AAA)
- **Input text (#111827) on white:** 17.9:1 (AAA)
- **Error text (#991B1B) on #FEF2F2:** 7.1:1 (AAA)
- **Purple text (#7C3AED) on #FAF5FF:** 6.8:1 (AA+)

### Touch Targets
- **Radio buttons:** 16px × 16px with 6px label gap = 22px minimum
- **Copy button:** 28px × 28px (exceeds 24px minimum)
- **Suggestions:** 40px height (exceeds 40px minimum for touch)

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
- All elements at full specified sizes
- Dropdown max-height: 320px

### Tablet (768px - 1023px)
- Same as desktop
- Consider reducing dropdown max-height if needed

### Mobile (<768px)
- Radio buttons may wrap to second line
- Dropdown covers most of viewport height
- Consider modal/bottom sheet for suggestions on very small screens

---

## 🎭 Animation Specifications

### Transitions
```css
/* All color transitions */
transition-property: background-color, border-color, color;
transition-duration: 150ms;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

### Copy Button Success Feedback
```css
/* Background change */
background-color: #D1FAE5;
transition-duration: 300ms;

/* Return to normal */
transition-delay: 1500ms;
transition-duration: 300ms;
```

### Dropdown Appearance
- No animation (instant)
- Z-index: 50 (above most content)

---

## 🔍 Inspector Values (for QA)

### Element Heights
- Label row: ~24px (auto based on content)
- Input field: 40px
- Copy button: 28px (including padding)
- Section header: ~28px (auto based on content)
- Suggestion item: ~41px (auto based on content + padding)
- Warning panel: Auto (based on content)

### Element Widths
- All elements: 100% of container
- Copy button: 28px (fixed)
- Radio button: 16px (fixed)
- Badges: Auto (based on text)

### Borders
- Input: 1px solid
- Dropdown: 1px solid
- Warning panel left: 4px solid
- Suggestion separator: 1px solid

---

**Component:** `SKUCodeInput`  
**Design System Version:** 1.0.0  
**Last Updated:** December 31, 2025
