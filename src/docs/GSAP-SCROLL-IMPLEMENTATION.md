# GSAP Smooth Scrolling Implementation Guide

## Overview

This document describes the comprehensive GSAP smooth scrolling implementation across the dashboard application. GSAP (GreenSock Animation Platform) provides buttery-smooth animations and scroll behaviors throughout the application.

## Features Implemented

### 1. **Global Smooth Scrolling**
- All scrollable containers have smooth scrolling enabled via CSS `scroll-behavior: smooth`
- Custom scrollbar styling for better UX
- Momentum-based smooth scrolling on main content areas

### 2. **Main Content Area Smooth Scroll**
Located in: `/App.tsx`
- Custom wheel event handling for momentum scrolling
- Smooth easing (0.1 ease factor) for natural scroll feel
- Reduced scroll speed (0.5 multiplier) for better control
- Applied to the main content area

```typescript
// Example usage in App.tsx
const mainContentRef = useRef<HTMLElement>(null);

useEffect(() => {
  const mainElement = mainContentRef.current;
  // Custom smooth scroll implementation with GSAP
}, []);
```

### 3. **Sidebar Navigation Smooth Scroll**
Located in: `/components/Sidebar.tsx`
- GSAP-powered smooth scrolling on arrow button clicks
- Smooth scroll behavior for overflow navigation
- Animated submenu entrance with opacity and translateX
- 0.2s duration with power2.out easing

Features:
- Smooth scroll up/down with arrow indicators
- GSAP `smoothScrollBy()` utility for arrow navigation
- Entrance animations for submenus

### 4. **Dropdown Menus Smooth Scroll**
Located in: `/components/TopNav.tsx`
- All 3 columns in the apps dropdown have smooth scrolling
- Applied to financial modules navigation
- Native smooth scrolling with CSS enhancement

### 5. **Sliding Panels Smooth Scroll**
All sliding panels include smooth scrolling:

#### Assistant Panel (`/components/AssistantPanel.tsx`)
- 3 scrollable areas with smooth behavior:
  - Prompt categories section
  - Chat history list
  - Main assistant conversation area
- Content entrance animations with GSAP (staggered fade-in)
- 0.4s duration with stagger effect

#### Create Action Panel (`/components/CreateActionPanel.tsx`)
- Form content area with smooth scrolling
- GSAP entrance animations for form elements
- Staggered content reveal

#### KPI Details Panel (`/components/KPIDetailsPanel.tsx`)
- Details content area with smooth scrolling
- Animated entrance for KPI data
- Smooth chart and data transitions

### 6. **Companies Table**
Located in: `/components/CompaniesTable.tsx`
- Form modal with smooth scrolling
- Applied to overflow content areas

## Utilities and Hooks

### Hook: `useSmoothScroll`
Located in: `/hooks/useSmoothScroll.ts`

Basic smooth scroll hook with momentum physics:

```typescript
import { useSmoothScroll } from './hooks/useSmoothScroll';

function MyComponent() {
  const scrollRef = useSmoothScroll({
    speed: 0.1,      // Ease factor
    smooth: 0.5,     // Scroll multiplier
  });
  
  return <div ref={scrollRef}>Content</div>;
}
```

### Hook: `useGSAPScroll`
Located in: `/hooks/useGSAPScroll.ts`

Enhanced GSAP scrolling with more features:

```typescript
import { useGSAPScroll } from './hooks/useGSAPScroll';

function MyComponent() {
  const scrollRef = useGSAPScroll({
    smooth: true,
    ease: 0.1,
    multiplier: 0.5,
    enabled: true,
  });
  
  return <div ref={scrollRef}>Content</div>;
}
```

Additional hooks available:
- `useScrollReveal()` - For scroll-triggered fade-in animations
- `useParallaxScroll()` - For parallax effects

### Utilities: `scrollAnimations.ts`
Located in: `/utils/scrollAnimations.ts`

Comprehensive scroll animation utilities:

#### Scroll To Element
```typescript
import { scrollToElement } from './utils/scrollAnimations';

scrollToElement(container, targetElement, {
  duration: 0.8,
  ease: 'power3.out',
  offset: 20,
});
```

#### Scroll To Position
```typescript
import { scrollToPosition } from './utils/scrollAnimations';

scrollToPosition(container, 500, {
  duration: 0.8,
  ease: 'power3.out',
});
```

#### Scroll By Delta
```typescript
import { scrollByDelta } from './utils/scrollAnimations';

scrollByDelta(container, 200, {
  duration: 0.5,
  ease: 'power2.out',
});
```

#### Scroll To Top/Bottom
```typescript
import { scrollToTop, scrollToBottom } from './utils/scrollAnimations';

scrollToTop(container, { duration: 0.8 });
scrollToBottom(container, { duration: 0.8 });
```

#### Smooth Scroller Class
For advanced momentum scrolling:

```typescript
import { SmoothScroller } from './utils/scrollAnimations';

const scroller = new SmoothScroller(containerElement, {
  ease: 0.08,
  multiplier: 0.5,
});

// Later, clean up
scroller.destroy();
```

#### Parallax Scrolling
```typescript
import { createParallaxScroll } from './utils/scrollAnimations';

const cleanup = createParallaxScroll(container, [
  { element: bg1, speed: 0.5 },
  { element: bg2, speed: 0.3 },
]);

// Later, clean up
cleanup();
```

## Global Styles

Located in: `/styles/globals.css`

### Smooth Scroll CSS
```css
html {
  scroll-behavior: smooth;
}

* {
  scroll-behavior: smooth;
}
```

### Custom Scrollbar Styling
```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
```

## Animation Patterns

### 1. Entrance Animations
Used in panels when they open:

```typescript
useEffect(() => {
  if (isOpen && panelRef.current) {
    const content = panelRef.current.children;
    gsap.fromTo(
      content,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.05,
        delay: 0.15,
      }
    );
  }
}, [isOpen]);
```

### 2. Submenu Animations
Used in sidebar submenus:

```typescript
gsap.fromTo(
  submenuRef.current,
  {
    opacity: 0,
    x: -10,
  },
  {
    opacity: 1,
    x: 0,
    duration: 0.2,
    ease: 'power2.out',
  }
);
```

### 3. Scroll Reveal
For elements that animate in on scroll:

```typescript
import { animateScrollReveal } from './utils/scrollAnimations';

animateScrollReveal(elements, {
  stagger: 0.1,
  duration: 0.6,
  ease: 'power3.out',
  y: 30,
  opacity: 0,
});
```

## GSAP Easing Options

Common easing functions used throughout:

- `power2.out` - Quick start, slow end (default for most animations)
- `power3.out` - Stronger version of power2 (for longer scrolls)
- `power3.inOut` - Smooth acceleration and deceleration
- `sine.out` - Very gentle easing
- `expo.out` - Dramatic deceleration

## Performance Considerations

1. **Will-change property**: Applied to scrolling elements for GPU acceleration
2. **Overflow-anchor**: Set to `none` to prevent scroll anchoring issues
3. **RequestAnimationFrame**: All scroll animations use RAF for smooth 60fps
4. **Cleanup**: All event listeners and animations are properly cleaned up in useEffect returns

## Browser Compatibility

- Modern browsers: Full support for all GSAP features
- Safari: Full support
- Firefox: Full support
- Chrome/Edge: Full support
- Mobile browsers: Touch events preserved, smooth scrolling works

## Debugging

To debug scroll animations:

1. Check browser console for GSAP errors
2. Verify refs are properly attached
3. Ensure animations are cleaned up properly
4. Test scroll performance with Chrome DevTools Performance tab

## Best Practices

1. **Always clean up animations** in useEffect returns
2. **Use refs for direct DOM manipulation** with GSAP
3. **Prefer CSS scroll-behavior** for simple cases
4. **Use GSAP utilities** for programmatic scrolling
5. **Test on different devices** and screen sizes
6. **Avoid scroll-jacking** - keep natural scroll feel
7. **Respect reduced-motion preferences** (to be implemented)

## Future Enhancements

Potential improvements:
- [ ] Respect `prefers-reduced-motion` media query
- [ ] Add scroll progress indicators with GSAP
- [ ] Implement virtual scrolling for large lists
- [ ] Add scroll-linked animations (ScrollTrigger)
- [ ] Smooth page transitions between routes
- [ ] Horizontal smooth scrolling support

## Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer/)

---

**Last Updated:** November 28, 2024
**Version:** 1.0.0
