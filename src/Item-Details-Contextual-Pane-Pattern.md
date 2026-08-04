# Item Details View with Contextual Pane Pattern

## Pattern Name
**Item Details View with Collapsible Contextual Pane**

## Overview
A two-column layout pattern for displaying detailed item information with a collapsible left contextual pane and main content area. The contextual pane provides quick access to key item metadata, insights, and related information while the main area displays comprehensive details.

## When to Use
- Item/Product detail pages requiring both summary context and detailed information
- Master data detail views (Inventory Items, Products, Customers, Vendors, etc.)
- Any scenario where users benefit from persistent contextual information while viewing detailed content
- Pages requiring side-by-side comparison of summary vs. detailed data

## Layout Structure

### Container
```tsx
<div 
  className="item-details-layout-wrapper flex gap-3 -m-6" 
  style={{ height: 'calc(100vh - 120px)' }}
>
  {/* Left: Contextual Pane */}
  {/* Right: Main Content */}
</div>
```

**Key Properties:**
- **Display**: `flex` with `gap-3` (12px gap between columns)
- **Margin**: `-m-6` (negative margin to extend to page edges)
- **Height**: `calc(100vh - 120px)` (full viewport height minus header/nav)
- **Overflow**: Container manages scroll independently for each column

---

## Left Column - Collapsible Contextual Pane

### Container Structure
```tsx
<div 
  className="item-contextual-pane bg-white border-r border-b border-gray-300 transition-all duration-150 flex-shrink-0 overflow-visible flex flex-col relative"
  style={{ width: contextPaneExpanded ? '280px' : '20px', height: '100%' }}
>
  {/* Collapse/Expand Button */}
  {/* Pane Content (conditional) */}
</div>
```

**Key Properties:**
- **Width**: `280px` (expanded), `20px` (collapsed)
- **Transition**: `transition-all duration-150` (smooth 150ms animation)
- **Background**: `bg-white` with `border-r border-b border-gray-300`
- **Layout**: `flex flex-col` for vertical stacking
- **Flexibility**: `flex-shrink-0` prevents compression

### State Management
```tsx
const [contextPaneExpanded, setContextPaneExpanded] = useState(true);
const [showTopGradient, setShowTopGradient] = useState(false);
const [showBottomGradient, setShowBottomGradient] = useState(true);
const scrollRef = useRef<HTMLDivElement>(null);
```

---

## Collapse/Expand Toggle Button

**Position**: Absolutely positioned on the right edge of the pane

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
- **Size**: `w-6 h-6` (24px × 24px)
- **Position**: `absolute top-2 -right-3` (positioned outside pane border)
- **Background**: `bg-blue-600` (primary color) with `hover:bg-blue-700`
- **Border**: `border-2 border-white` (white ring for contrast)
- **Shadow**: `shadow-md` for elevation
- **Animation**: `active:scale-95` (press feedback)
- **Icon**: `ChevronLeft` (expanded) / `ChevronRight` (collapsed), size `w-3 h-3`
- **Z-index**: `z-10` to stay above content

**Important**: Always include `aria-label` for accessibility with descriptive toggle state.

---

## Pane Content Structure

### Conditional Rendering
Content only renders when `contextPaneExpanded === true`:

```tsx
{contextPaneExpanded && (
  <div className="flex flex-col h-full">
    {/* Fixed Header Card */}
    {/* Scrollable Content */}
  </div>
)}
```

---

## Fixed Header Card

**Non-scrolling area** displaying primary item information:

```tsx
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
    <h3 
      className="text-sm mb-2 pr-6" 
      style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}
    >
      {selectedItem.itemName}
    </h3>
    
    {/* SKU */}
    <p 
      className="text-xs text-gray-500 mb-3" 
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {selectedItem.sku}
    </p>
    
    {/* Stock Status Badge */}
    <span 
      className={`inline-flex items-center px-2 py-1 text-xs border ${
        selectedItem.stockStatus === 'In Stock'
          ? 'bg-green-50 text-green-700 border-green-200'
          : selectedItem.stockStatus === 'Low Stock'
            ? 'bg-orange-50 text-orange-700 border-orange-200'
            : 'bg-red-50 text-red-700 border-red-200'
      }`} 
      style={{ borderRadius: '5px', fontFamily: 'Poppins, sans-serif' }}
    >
      {selectedItem.stockStatus.toUpperCase()}
    </span>
  </div>
  
  {/* Item Details Table (imported component) */}
  <div className="mt-3">
    <Frame1 />
  </div>
</div>
```

**Key Properties:**

**Outer Container:**
- Padding: `p-3`
- Border: `border-b border-gray-200` (separates from scrollable area)
- Flexibility: `flex-shrink-0` (fixed, doesn't compress)

**Inner Card:**
- Border: `border border-gray-200` with `rounded-lg`
- Padding: `p-4`
- Position: `relative` (for absolute positioned menu button)

**Three-Dot Menu Button:**
- Position: `absolute top-3 right-3`
- Size: Icon `w-4 h-4`
- Hover: `hover:bg-gray-100 rounded`
- Use vertical three-dot SVG pattern

**Item Name:**
- Size: `text-sm` (14px via inline style)
- Margin: `mb-2`, `pr-6` (padding-right to avoid menu overlap)
- Font: `Poppins, sans-serif`

**SKU:**
- Size: `text-xs`
- Color: `text-gray-500`
- Margin: `mb-3`

**Status Badge:**
- Padding: `px-2 py-1`
- Size: `text-xs`
- Border radius: `5px` (inline style)
- Conditional colors:
  - **In Stock**: `bg-green-50 text-green-700 border-green-200`
  - **Low Stock**: `bg-orange-50 text-orange-700 border-orange-200`
  - **Out of Stock**: `bg-red-50 text-red-700 border-red-200`
- Text transform: `.toUpperCase()` for badge text

---

## Scrollable Content Area with Gradient Indicators

### Container Structure
```tsx
<div className="flex-1 relative overflow-hidden">
  {/* Top gradient overlay with arrow */}
  {/* Bottom gradient overlay with arrow */}
  {/* Scrollable area */}
</div>
```

**Key Properties:**
- **Flex**: `flex-1` (takes remaining vertical space)
- **Position**: `relative` (for absolute positioned overlays)
- **Overflow**: `overflow-hidden` (hides scrollbar, contains gradients)

### Top Gradient Indicator

```tsx
<div 
  className="absolute top-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-300 flex items-start justify-center pt-2"
  style={{
    height: '40px',
    background: 'linear-gradient(to bottom, rgba(243, 244, 246, 1) 0%, rgba(255, 255, 255, 0) 100%)',
    opacity: showTopGradient ? 1 : 0
  }}
>
  <ChevronUp className="w-4 h-4 text-gray-800" />
</div>
```

**Key Properties:**
- **Position**: `absolute top-0 left-0 right-0` (full width at top)
- **Height**: `40px`
- **Z-index**: `z-10` (above content)
- **Pointer Events**: `pointer-events-none` (doesn't block clicks)
- **Background**: `linear-gradient(to bottom, rgba(243, 244, 246, 1) 0%, rgba(255, 255, 255, 0) 100%)`
  - Starts with `gray-100` (RGB: 243, 244, 246) at 100% opacity
  - Fades to transparent
- **Opacity**: Controlled by `showTopGradient` state (1 or 0)
- **Transition**: `transition-opacity duration-300`
- **Icon**: `ChevronUp`, `w-4 h-4`, `text-gray-800`, centered with `pt-2`

### Bottom Gradient Indicator

```tsx
<div 
  className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-300 flex items-end justify-center pb-2"
  style={{
    height: '40px',
    background: 'linear-gradient(to top, rgba(243, 244, 246, 1) 0%, rgba(255, 255, 255, 0) 100%)',
    opacity: showBottomGradient ? 1 : 0
  }}
>
  <ChevronDown className="w-4 h-4 text-gray-800" />
</div>
```

**Key Properties:**
- **Position**: `absolute bottom-0 left-0 right-0` (full width at bottom)
- **Height**: `40px`
- **Background**: `linear-gradient(to top, rgba(243, 244, 246, 1) 0%, rgba(255, 255, 255, 0) 100%)`
  - Gradient direction reversed (to top)
- **Icon**: `ChevronDown`, positioned with `pb-2`

### Scroll Detection Logic

**Implementation Pattern:**

```tsx
const scrollRef = useRef<HTMLDivElement>(null);
const [showTopGradient, setShowTopGradient] = useState(false);
const [showBottomGradient, setShowBottomGradient] = useState(true);

useEffect(() => {
  const handleScroll = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    
    // Show top gradient if scrolled down
    setShowTopGradient(scrollTop > 10);
    
    // Show bottom gradient if not at bottom
    setShowBottomGradient(scrollTop + clientHeight < scrollHeight - 10);
  };

  const scrollContainer = scrollRef.current;
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
  }

  return () => {
    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', handleScroll);
    }
  };
}, [selectedItem]); // Re-run when selected item changes
```

**Logic:**
- **Top Gradient**: Shows when `scrollTop > 10` (user has scrolled down)
- **Bottom Gradient**: Shows when not at bottom (`scrollTop + clientHeight < scrollHeight - 10`)
- **Threshold**: 10px buffer to prevent flickering
- **Dependencies**: Re-initialize when `selectedItem` changes

### Scrollable Area

```tsx
<div 
  ref={scrollRef} 
  className="absolute inset-0 overflow-y-auto px-3 pb-20 scroll-smooth"
>
  <div className="mt-2">
    <h3 
      className="text-sm mb-3" 
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      Item Insights
    </h3>
    <Frame6 />
  </div>
  
  <div className="mt-6">
    <h3 
      className="text-sm mb-3" 
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      Supplier Information
    </h3>
    <Frame2 />
  </div>
</div>
```

**Key Properties:**
- **Ref**: `ref={scrollRef}` for scroll detection
- **Position**: `absolute inset-0` (fills parent container)
- **Overflow**: `overflow-y-auto` (vertical scrolling)
- **Padding**: `px-3` (horizontal), `pb-20` (bottom padding for comfortable scrolling)
- **Scroll Behavior**: `scroll-smooth` (smooth scrolling)

**Section Headers:**
- Size: `text-sm`
- Margin: `mb-3` (12px below header)
- Font: `Poppins, sans-serif`
- Spacing: `mt-2` (first section), `mt-6` (subsequent sections)

---

## Right Column - Main Content Area

```tsx
<div className="flex-1 overflow-hidden">
  <ProductDetailsPageNew 
    item={selectedItem} 
    onBack={() => {
      setSelectedItem(null);
      setCurrentView('list');
    }}
  />
</div>
```

**Key Properties:**
- **Flex**: `flex-1` (takes remaining horizontal space)
- **Overflow**: `overflow-hidden` (contains internal scrolling)
- **Content**: Full detail component with back navigation handler

---

## Complete Implementation Template

```tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

export function ItemDetailsWithContextPane() {
  // State
  const [contextPaneExpanded, setContextPaneExpanded] = useState(true);
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = scrollRef.current;
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      setShowTopGradient(scrollTop > 10);
      setShowBottomGradient(scrollTop + clientHeight < scrollHeight - 10);
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [selectedItem]);

  return (
    <div 
      className="item-details-layout-wrapper flex gap-3 -m-6" 
      style={{ height: 'calc(100vh - 120px)' }}
    >
      {/* Left Column - Contextual Pane */}
      <div 
        className="item-contextual-pane bg-white border-r border-b border-gray-300 transition-all duration-150 flex-shrink-0 overflow-visible flex flex-col relative"
        style={{ width: contextPaneExpanded ? '280px' : '20px', height: '100%' }}
      >
        {/* Collapse/Expand Button */}
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

        {/* Pane Content */}
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
              
              {/* Additional Details Component */}
              <div className="mt-3">
                {/* Your details table/component here */}
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 relative overflow-hidden">
              {/* Top gradient overlay with arrow */}
              <div 
                className="absolute top-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-300 flex items-start justify-center pt-2"
                style={{
                  height: '40px',
                  background: 'linear-gradient(to bottom, rgba(243, 244, 246, 1) 0%, rgba(255, 255, 255, 0) 100%)',
                  opacity: showTopGradient ? 1 : 0
                }}
              >
                <ChevronUp className="w-4 h-4 text-gray-800" />
              </div>
              
              {/* Bottom gradient overlay with arrow */}
              <div 
                className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-300 flex items-end justify-center pb-2"
                style={{
                  height: '40px',
                  background: 'linear-gradient(to top, rgba(243, 244, 246, 1) 0%, rgba(255, 255, 255, 0) 100%)',
                  opacity: showBottomGradient ? 1 : 0
                }}
              >
                <ChevronDown className="w-4 h-4 text-gray-800" />
              </div>
              
              {/* Scrollable area */}
              <div ref={scrollRef} className="absolute inset-0 overflow-y-auto px-3 pb-20 scroll-smooth">
                <div className="mt-2">
                  <h3 className="text-sm mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Section Title
                  </h3>
                  {/* Section content */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Your main detail component here */}
      </div>
    </div>
  );
}
```

---

## Key UX Principles

1. **Persistent Context**: Left pane provides always-available contextual information without disrupting main content
2. **Space Efficiency**: Pane collapses to 20px when not needed, maximizing main content area
3. **Smooth Transitions**: 150ms transition for collapse/expand creates fluid experience
4. **Scroll Indicators**: Gradient arrows provide visual feedback about scrollable content
5. **Independent Scrolling**: Pane header stays fixed while content scrolls independently
6. **Accessible Toggle**: Circular button with clear chevron direction and aria-label
7. **Visual Hierarchy**: Card-based header separates primary metadata from detailed insights

---

## Visual Design Guidelines

### Colors
- **Pane Background**: `bg-white`
- **Borders**: `border-gray-200` (internal), `border-gray-300` (external)
- **Toggle Button**: `bg-blue-600` (or brand primary color)
- **Gradients**: `rgba(243, 244, 246, 1)` (gray-100) fading to transparent
- **Status Badges**: Semantic colors (green/orange/red with 50/200/700 variants)

### Spacing
- **Pane Width**: 280px (expanded), 20px (collapsed)
- **Column Gap**: 12px (`gap-3`)
- **Padding**: 12px (`p-3`) for sections
- **Gradient Height**: 40px
- **Bottom Scroll Padding**: 80px (`pb-20`)

### Typography
- **Font Family**: Poppins, sans-serif
- **Item Name**: 14px (`text-sm`)
- **SKU**: 12px (`text-xs`)
- **Section Headers**: 14px (`text-sm`)

### Borders & Radius
- **Card Border Radius**: 8px (`rounded-lg`)
- **Badge Border Radius**: 5px (inline style)
- **Toggle Button**: Fully rounded (`rounded-full`)

---

## Required Icons

```tsx
import { 
  ChevronLeft,    // Collapse button
  ChevronRight,   // Expand button
  ChevronUp,      // Top scroll indicator
  ChevronDown     // Bottom scroll indicator
} from 'lucide-react';
```

---

## Responsive Considerations

**Desktop (Default):**
- Contextual pane at 280px width
- Two-column layout with flexible main content

**Tablet/Mobile:**
- Consider converting to drawer/overlay pattern
- Full-width main content with slide-in contextual pane
- Or convert to tabbed interface

---

## Accessibility

- ✅ **Toggle Button**: Include descriptive `aria-label` indicating current state
- ✅ **Keyboard Navigation**: Ensure toggle button is keyboard accessible
- ✅ **Focus Management**: Maintain focus within visible content areas
- ✅ **Screen Readers**: Announce state changes on collapse/expand
- ✅ **Visual Indicators**: Gradients and arrows provide clear scroll feedback

---

## Common Variations

### Without Collapse Feature
Remove toggle button and set fixed width:
```tsx
<div className="item-contextual-pane bg-white border-r border-gray-300 flex flex-col" style={{ width: '280px' }}>
```

### Alternative Toggle Position
Position at top-left of pane instead:
```tsx
<div className="absolute top-2 left-2 z-10">
```

### Different Gradient Colors
Match gradient to your background color:
```tsx
background: 'linear-gradient(to bottom, rgba(YOUR_BG_RGB, 1) 0%, rgba(255, 255, 255, 0) 100%)'
```

### Multi-Section Scrollable Area
Add more sections with consistent spacing:
```tsx
<div className="mt-6">
  <h3 className="text-sm mb-3">Another Section</h3>
  {/* Content */}
</div>
```

---

## Integration with Routing

When used in detail pages, integrate with back navigation:

```tsx
onBack={() => {
  setSelectedItem(null);
  setCurrentView('list');
}}
```

Or use React Router:

```tsx
import { useNavigate } from 'react-router';

const navigate = useNavigate();

onBack={() => navigate(-1)}
```

---

## Performance Considerations

1. **Conditional Rendering**: Only render pane content when `contextPaneExpanded === true`
2. **Scroll Listener Cleanup**: Always remove scroll event listeners in cleanup function
3. **Debouncing**: For heavy content, consider debouncing scroll event handler
4. **Lazy Loading**: Load section components only when visible in scroll area

---

## Related Patterns

- **Add New Item Page**: Full-page form with side navigation (see `/Add-Item-Page-Documentation.md`)
- **Modal Overlays**: Slide-in panels for temporary actions (see Guidelines.md)
- **KPI Details Panel**: Expandable metric details (see existing pattern in app)

---

## Example Use Cases

1. **Inventory Item Details**: Context pane shows stock status, insights, supplier info
2. **Customer Details**: Context pane shows contact info, account summary, recent activity
3. **Vendor Details**: Context pane shows vendor rating, payment terms, contact info
4. **Order Details**: Context pane shows customer info, order summary, timeline
5. **Product Details**: Context pane shows variants, pricing, stock levels across warehouses
