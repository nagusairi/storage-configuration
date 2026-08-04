# GSAP Smooth Scrolling - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   App.tsx    │  │  Sidebar.tsx │  │  TopNav.tsx  │          │
│  │              │  │              │  │              │          │
│  │ Main Content │  │  Navigation  │  │  Dropdowns   │          │
│  │   Scroll     │  │    Scroll    │  │    Scroll    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
├───────────────────────────┼─────────────────────────────────────┤
│                           │                                     │
│  ┌────────────────────────┴────────────────────────┐           │
│  │          Sliding Panels (3 Types)                │           │
│  ├──────────────┬──────────────┬───────────────────┤           │
│  │  Assistant   │   Create     │   KPI Details     │           │
│  │    Panel     │    Action    │     Panel         │           │
│  │              │    Panel     │                   │           │
│  │ • Prompts    │ • Forms      │ • Analytics       │           │
│  │ • Chats      │ • Inputs     │ • Charts          │           │
│  │ • Library    │ • Validation │ • Data Tables     │           │
│  └──────┬───────┴──────┬───────┴───────┬───────────┘           │
│         │              │               │                       │
│         └──────────────┼───────────────┘                       │
│                        │                                       │
└────────────────────────┼───────────────────────────────────────┘
                         │
┌────────────────────────┼───────────────────────────────────────┐
│                        │        Hooks Layer                     │
├────────────────────────┼───────────────────────────────────────┤
│                        │                                       │
│  ┌─────────────────────▼──────────────────────┐               │
│  │         useGSAPScroll Hook                  │               │
│  ├─────────────────────────────────────────────┤               │
│  │ • Momentum scrolling                        │               │
│  │ • Custom wheel events                       │               │
│  │ • RAF animation loop                        │               │
│  │ • Configurable ease/speed                   │               │
│  └─────────────────────┬───────────────────────┘               │
│                        │                                       │
│  ┌─────────────────────▼──────────────────────┐               │
│  │       useSmoothScroll Hook                  │               │
│  ├─────────────────────────────────────────────┤               │
│  │ • Basic smooth scrolling                    │               │
│  │ • Simple configuration                      │               │
│  │ • Lightweight implementation                │               │
│  └─────────────────────┬───────────────────────┘               │
│                        │                                       │
└────────────────────────┼───────────────────────────────────────┘
                         │
┌────────────────────────┼───────────────────────────────────────┐
│                        │      Utilities Layer                   │
├────────────────────────┼───────────────────────────────────────┤
│                        │                                       │
│  ┌─────────────────────▼──────────────────────┐               │
│  │      scrollAnimations.ts                    │               │
│  ├─────────────────────────────────────────────┤               │
│  │ scrollToElement()      • Scroll to target   │               │
│  │ scrollToPosition()     • Scroll to px       │               │
│  │ scrollByDelta()        • Relative scroll    │               │
│  │ scrollToTop()          • Jump to top        │               │
│  │ scrollToBottom()       • Jump to bottom     │               │
│  │ SmoothScroller         • Advanced class     │               │
│  │ createParallaxScroll() • Parallax effect    │               │
│  │ animateScrollReveal()  • Reveal animations  │               │
│  └─────────────────────┬───────────────────────┘               │
│                        │                                       │
└────────────────────────┼───────────────────────────────────────┘
                         │
┌────────────────────────┼───────────────────────────────────────┐
│                        │       GSAP Core                        │
├────────────────────────┼───────────────────────────────────────┤
│                        │                                       │
│  ┌─────────────────────▼──────────────────────┐               │
│  │              gsap Library                   │               │
│  ├─────────────────────────────────────────────┤               │
│  │ • Tweening engine                           │               │
│  │ • Easing functions                          │               │
│  │ • Animation timeline                        │               │
│  │ • Performance optimizations                 │               │
│  └─────────────────────────────────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Scroll Event Flow

```
User Scrolls
     │
     ▼
┌──────────────────┐
│  Wheel Event     │
│  (mousewheel)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ preventDefault() │  ← Prevent native scroll
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate Delta  │  ← e.deltaY * multiplier
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update Target    │  ← target += delta
│ Scroll Position  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ RAF Animation    │  ← requestAnimationFrame
│ Loop Starts      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Ease Towards     │  ← current += (target - current) * ease
│ Target           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update DOM       │  ← element.scrollTop = current
│ ScrollTop        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Check Distance   │  ← |target - current| > threshold?
└────────┬─────────┘
         │
    Yes  │  No
    ┌────┴────┐
    ▼         ▼
Continue   Stop RAF
RAF Loop   & Snap
```

### Programmatic Scroll Flow

```
User Clicks Navigation
         │
         ▼
┌──────────────────┐
│ scrollToElement()│
│ Function Called  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate Target │  ← Get element offset
│ Position         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ GSAP Tween       │  ← gsap.to(container, {...})
│ Created          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Animate Over     │  ← Duration + Easing
│ Time Period      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Reach Target     │  ← Smooth arrival
│ Position         │
└──────────────────┘
```

## Component Integration Map

### Level 1: Main Layout
```
App.tsx
  ├─ Custom momentum scroll
  ├─ Main content area
  └─ Coordinates with panels
```

### Level 2: Navigation
```
Sidebar.tsx
  ├─ Arrow-based scrolling
  ├─ Submenu animations
  └─ Bookmark management

TopNav.tsx
  ├─ Apps dropdown (3 columns)
  ├─ Profile dropdown
  └─ Search integration
```

### Level 3: Content Areas
```
CompaniesTable.tsx
  ├─ Table scrolling
  └─ Modal form scrolling

AssistantPanel.tsx
  ├─ Prompt library scroll
  ├─ Chat history scroll
  ├─ Main content scroll
  └─ Entrance animations

CreateActionPanel.tsx
  ├─ Form content scroll
  └─ Entrance animations

KPIDetailsPanel.tsx
  ├─ Details scroll
  └─ Entrance animations
```

## Performance Architecture

```
┌─────────────────────────────────────────────┐
│            Browser Rendering                 │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────┐       │
│  │   GPU Layer (will-change)       │       │
│  │   • Transform animations        │       │
│  │   • Opacity changes             │       │
│  │   • Hardware acceleration       │       │
│  └────────────┬────────────────────┘       │
│               │                             │
│  ┌────────────▼────────────────────┐       │
│  │   JavaScript Thread             │       │
│  │   • RAF loop (60fps)            │       │
│  │   • Event handlers              │       │
│  │   • GSAP calculations           │       │
│  └────────────┬────────────────────┘       │
│               │                             │
│  ┌────────────▼────────────────────┐       │
│  │   Main Thread                   │       │
│  │   • React rendering             │       │
│  │   • State updates               │       │
│  │   • Event processing            │       │
│  └─────────────────────────────────┘       │
│                                             │
└─────────────────────────────────────────────┘
```

## Configuration Matrix

| Component | Scroll Type | Duration | Ease | Speed |
|-----------|-------------|----------|------|-------|
| Main Content | Momentum | RAF | 0.1 | 0.5x |
| Sidebar Nav | Programmatic | 0.3s | power2.out | 1.0x |
| Submenu | Animation | 0.2s | power2.out | N/A |
| Dropdowns | Native | N/A | smooth | 1.0x |
| Panels | Native | N/A | smooth | 1.0x |
| Entrance | Animation | 0.4s | power2.out | N/A |

## Memory Management

```
Component Lifecycle
        │
        ▼
┌──────────────────┐
│  useEffect       │
│  Setup           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Create          │
│  Event Listeners │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Start RAF       │
│  Animation Loop  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Component       │
│  Active          │
└────────┬─────────┘
         │
    Unmounts
         │
         ▼
┌──────────────────┐
│  useEffect       │
│  Cleanup         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Remove          │
│  Event Listeners │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Cancel RAF      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Kill Tweens     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Memory          │
│  Released        │
└──────────────────┘
```

## File Organization

```
/
├── App.tsx                          # Main momentum scroll
├── hooks/
│   ├── useGSAPScroll.ts            # Advanced GSAP hook
│   └── useSmoothScroll.ts          # Basic smooth hook
├── utils/
│   └── scrollAnimations.ts         # Utility functions
├── components/
│   ├── Sidebar.tsx                 # Nav + submenu scroll
│   ├── TopNav.tsx                  # Dropdown scroll
│   ├── AssistantPanel.tsx          # Panel scroll + animations
│   ├── CreateActionPanel.tsx       # Panel scroll + animations
│   ├── KPIDetailsPanel.tsx         # Panel scroll + animations
│   ├── CompaniesTable.tsx          # Table scroll
│   ├── GSAPScrollDemo.tsx          # Demo component
│   └── ScrollShowcase.tsx          # Interactive demo
├── styles/
│   └── globals.css                 # Global scroll styles
└── docs/
    ├── GSAP-SCROLL-IMPLEMENTATION.md  # Full guide
    ├── GSAP-QUICK-REFERENCE.md        # Quick ref
    └── GSAP-ARCHITECTURE.md           # This file
```

## Integration Points

### 1. Component Level
- Individual components import and use hooks
- Refs passed to scrollable containers
- Cleanup in useEffect returns

### 2. Utility Level  
- Centralized scroll functions
- Reusable across components
- Consistent behavior

### 3. Global Level
- CSS smooth scroll defaults
- Scrollbar styling
- Performance optimizations

## Extension Points

### Adding New Scroll Area

1. **Import Hook**
   ```typescript
   import { useGSAPScroll } from './hooks/useGSAPScroll';
   ```

2. **Create Ref**
   ```typescript
   const scrollRef = useGSAPScroll({ smooth: true });
   ```

3. **Attach to Element**
   ```typescript
   <div ref={scrollRef}>...</div>
   ```

4. **Add Styling** (optional)
   ```typescript
   style={{ scrollBehavior: 'smooth' }}
   ```

### Adding New Animation

1. **Import GSAP**
   ```typescript
   import { gsap } from 'gsap';
   ```

2. **Create Animation**
   ```typescript
   useEffect(() => {
     gsap.fromTo(ref.current, from, to);
   }, [trigger]);
   ```

3. **Cleanup**
   ```typescript
   return () => {
     gsap.killTweensOf(ref.current);
   };
   ```

---

**Version**: 1.0.0  
**Last Updated**: November 28, 2024
