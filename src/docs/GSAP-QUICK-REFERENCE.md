# GSAP Smooth Scrolling - Quick Reference

## 🚀 Quick Start

### Recommended: Use Native Smooth Scroll
```typescript
<div style={{ scrollBehavior: 'smooth' }} className="overflow-y-auto">
  {/* Content */}
</div>
```

### For Animations: Import GSAP
```typescript
import { gsap } from 'gsap';
```

**Note**: Native CSS smooth scrolling is recommended for wheel-based scrolling. Use GSAP for entrance animations and programmatic scroll-to functionality.

## 📦 Hooks

### useGSAPScroll
```typescript
import { useGSAPScroll } from './hooks/useGSAPScroll';

const scrollRef = useGSAPScroll({
  smooth: true,    // Enable smooth scrolling
  ease: 0.1,       // Momentum factor (0-1)
  multiplier: 0.5, // Speed multiplier
  enabled: true,   // Toggle on/off
});

<div ref={scrollRef}>Content</div>
```

### useSmoothScroll
```typescript
import { useSmoothScroll } from './hooks/useSmoothScroll';

const scrollRef = useSmoothScroll({
  speed: 0.1,
  smooth: 0.5,
});

<div ref={scrollRef}>Content</div>
```

## 🎯 Utilities

### Scroll To Element
```typescript
import { scrollToElement } from './utils/scrollAnimations';

scrollToElement(container, targetElement, {
  duration: 0.8,
  ease: 'power3.out',
  offset: 20,
});
```

### Scroll To Position
```typescript
import { scrollToPosition } from './utils/scrollAnimations';

scrollToPosition(container, 500, {
  duration: 0.8,
  ease: 'power3.out',
});
```

### Scroll To Top/Bottom
```typescript
import { scrollToTop, scrollToBottom } from './utils/scrollAnimations';

scrollToTop(container);
scrollToBottom(container);
```

### Scroll By Delta
```typescript
import { scrollByDelta } from './utils/scrollAnimations';

scrollByDelta(container, 200, {
  duration: 0.5,
  ease: 'power2.out',
});
```

## 🎨 Animation Patterns

### Entrance Animation
```typescript
useEffect(() => {
  if (isOpen && ref.current) {
    gsap.fromTo(
      ref.current.children,
      { opacity: 0, y: 20 },
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

### Fade In
```typescript
gsap.fromTo(
  element,
  { opacity: 0 },
  { 
    opacity: 1, 
    duration: 0.3,
    ease: 'power2.out',
  }
);
```

### Slide From Right
```typescript
gsap.fromTo(
  element,
  { x: 100, opacity: 0 },
  { 
    x: 0, 
    opacity: 1, 
    duration: 0.4,
    ease: 'power3.out',
  }
);
```

### Slide From Left
```typescript
gsap.fromTo(
  element,
  { x: -100, opacity: 0 },
  { 
    x: 0, 
    opacity: 1, 
    duration: 0.4,
    ease: 'power3.out',
  }
);
```

### Scale In
```typescript
gsap.fromTo(
  element,
  { scale: 0.8, opacity: 0 },
  { 
    scale: 1, 
    opacity: 1, 
    duration: 0.3,
    ease: 'back.out',
  }
);
```

### Staggered List
```typescript
gsap.fromTo(
  elements,
  { opacity: 0, y: 30 },
  { 
    opacity: 1, 
    y: 0, 
    duration: 0.6,
    ease: 'power3.out',
    stagger: 0.1, // 0.1s between each
  }
);
```

## 🎭 Easing Functions

| Easing | Use Case |
|--------|----------|
| `power2.out` | Default, gentle deceleration |
| `power3.out` | Stronger deceleration |
| `power3.inOut` | Smooth both ways |
| `expo.out` | Dramatic slow-down |
| `back.out` | Slight overshoot |
| `elastic.out` | Bouncy effect |
| `sine.out` | Very gentle |

## ⚡ Performance Tips

### GPU Acceleration
```css
.gsap-scroll {
  will-change: transform;
}
```

### Cleanup Animations
```typescript
useEffect(() => {
  const animation = gsap.to(element, { ... });
  
  return () => {
    animation.kill();
  };
}, []);
```

### Debounce Scroll Events
```typescript
const handleScroll = debounce(() => {
  // Heavy operations
}, 100);
```

## 🎯 Common Durations

| Duration | Use Case |
|----------|----------|
| 0.2s | Quick UI feedback |
| 0.3s | Button hover states |
| 0.4s | Panel entrance |
| 0.5s | Small scroll adjustments |
| 0.8s | Medium scroll navigation |
| 1.2s | Long scroll navigation |

## 🔧 Configuration

### Main Content Scroll
File: `/App.tsx`
```typescript
// Adjust speed
targetScroll += e.deltaY * 0.5; // Change multiplier

// Adjust smoothness
currentScroll += (target - current) * 0.1; // Change ease
```

### Sidebar Arrow Scroll
File: `/components/Sidebar.tsx`
```typescript
smoothScrollBy(navRef.current, 400, 0.3, 'power2.out');
//                              ↑    ↑    ↑
//                           pixels  dur  ease
```

## 📱 Responsive Considerations

```typescript
// Disable smooth scroll on mobile if needed
const isMobile = window.innerWidth < 768;

const scrollRef = useGSAPScroll({
  enabled: !isMobile,
  // ... other options
});
```

## 🐛 Debugging

### Check Animation Status
```typescript
const tween = gsap.to(element, { ... });
console.log(tween.isActive()); // Is currently animating?
console.log(tween.progress()); // 0 to 1
```

### Kill All Animations
```typescript
gsap.killTweensOf(element);
```

### Pause/Resume
```typescript
const tween = gsap.to(element, { ... });
tween.pause();
tween.resume();
```

## 📚 Component Examples

### Smooth Scroll Container
```typescript
function MyComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scrollToTop = () => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scrollTop: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  };
  
  return (
    <div ref={containerRef} style={{ scrollBehavior: 'smooth' }}>
      <button onClick={scrollToTop}>Top</button>
      {/* Content */}
    </div>
  );
}
```

### Animated Panel
```typescript
function Panel({ isOpen }) {
  const panelRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { x: 400, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [isOpen]);
  
  return <div ref={panelRef}>{/* Content */}</div>;
}
```

## 💡 Pro Tips

1. **Always cleanup** animations in useEffect returns
2. **Use refs** for direct DOM access with GSAP
3. **Prefer CSS** for simple hover states
4. **Use GSAP** for complex or programmatic animations
5. **Test on mobile** - performance can vary
6. **Keep durations short** - 0.2s to 0.8s is usually ideal
7. **Use stagger** for list animations
8. **Respect reduced-motion** (accessibility)

## 🔗 Quick Links

- [Full Implementation Guide](/docs/GSAP-SCROLL-IMPLEMENTATION.md)
- [Implementation Summary](/GSAP-IMPLEMENTATION-SUMMARY.md)
- [GSAP Documentation](https://greensock.com/docs/)
- [Ease Visualizer](https://greensock.com/ease-visualizer/)

---

**Last Updated**: November 28, 2024
