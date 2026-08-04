# Smooth Scrolling Setup Guide

## Current Implementation

The dashboard uses **CSS-based smooth scrolling** by default, which provides excellent performance and browser compatibility while maintaining native scroll behavior.

## How It Works

### 1. Global CSS Smooth Scrolling
All scrollable containers have `scroll-behavior: smooth` applied via:

- Global CSS in `/styles/globals.css`
- Inline styles on specific containers
- Custom scrollbar styling for better UX

### 2. GSAP Animations
GSAP is used for:
- Panel entrance animations (fade-in, slide)
- Submenu animations
- Programmatic scroll-to functionality
- Content reveal effects

**Note**: GSAP is NOT used for wheel-based scrolling to preserve native browser behavior.

## Scrollable Areas

### ✅ Main Content Area
- **File**: `/App.tsx`
- **Type**: Native smooth scroll
- **Works with**: Mouse wheel, trackpad, scroll bar, touch

### ✅ Sidebar Navigation
- **File**: `/components/Sidebar.tsx`
- **Type**: Native smooth scroll + GSAP programmatic scrolling
- **Features**: Arrow navigation buttons with GSAP animations

### ✅ Dropdowns
- **File**: `/components/TopNav.tsx`
- **Type**: Native smooth scroll
- **Areas**: Apps dropdown (3 columns), Profile, Notifications

### ✅ Panels
- **Files**: AssistantPanel, CreateActionPanel, KPIDetailsPanel
- **Type**: Native smooth scroll + GSAP entrance animations
- **Features**: Smooth scrolling with animated content reveal

## Optional: Enable GSAP Momentum Scrolling

If you want to add momentum-based scrolling to the main content area:

### Step 1: Use the Hook

```typescript
import { useGSAPScroll } from './hooks/useGSAPScroll';

function App() {
  const scrollRef = useGSAPScroll({
    smooth: true,
    ease: 0.1,
    multiplier: 0.5,
    enabled: true,
  });
  
  return (
    <main ref={scrollRef} className="overflow-y-auto">
      {/* Content */}
    </main>
  );
}
```

### Step 2: Remove Native Smooth Scroll

Remove `style={{ scrollBehavior: 'smooth' }}` from the element to avoid conflicts.

### Trade-offs

**Native CSS Smooth Scroll (Current)**
- ✅ Works with all input methods
- ✅ Better browser compatibility
- ✅ No JavaScript overhead
- ✅ Respects browser settings
- ✅ Better accessibility
- ❌ Less customizable

**GSAP Momentum Scroll (Optional)**
- ✅ Custom easing and feel
- ✅ Unique scroll experience
- ✅ Fine-tuned control
- ❌ Requires more JavaScript
- ❌ Needs careful testing
- ❌ May conflict with accessibility features

## Programmatic Scrolling

For programmatic scroll-to functionality, use the GSAP utilities:

```typescript
import { scrollToElement } from './utils/scrollAnimations';

const handleClick = () => {
  const container = document.getElementById('content');
  const target = document.getElementById('section-2');
  
  scrollToElement(container, target, {
    duration: 0.8,
    ease: 'power3.out',
    offset: 20,
  });
};
```

## Custom Scrollbar Styling

All scrollable areas have custom scrollbar styling (defined in `/styles/globals.css`):

- 8px width
- Rounded corners
- Hover effects
- Dark mode support

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ✅ Mobile browsers: Full support

## Troubleshooting

### Scroll not working?
1. Check that `overflow-y-auto` is applied
2. Verify container has defined height
3. Ensure no `overflow: hidden` on parents
4. Check for conflicting JavaScript

### Scroll too fast/slow?
1. For native smooth scroll: Use browser settings
2. For GSAP scroll: Adjust `multiplier` option

### Scroll feels jerky?
1. Check for heavy rendering on scroll
2. Reduce animations during scroll
3. Use CSS `will-change` for animated elements

## Recommendations

✅ **Use native smooth scroll** for most areas (current implementation)  
✅ **Use GSAP utilities** for programmatic scrolling  
✅ **Use GSAP animations** for entrance effects  
❌ **Avoid custom wheel handlers** unless absolutely necessary

---

**Current Status**: Native smooth scrolling enabled ✅  
**Mouse Scroll**: Working ✅  
**Touch Scroll**: Working ✅  
**Keyboard Scroll**: Working ✅
