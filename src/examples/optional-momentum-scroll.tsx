/**
 * OPTIONAL: Enhanced Momentum Scrolling with GSAP
 * 
 * This is an OPTIONAL enhancement. The default CSS smooth scrolling works great!
 * Only use this if you specifically want custom momentum-based scrolling.
 * 
 * Trade-offs:
 * ✅ Custom scroll feel and easing
 * ✅ Fine-tuned control over speed
 * ❌ More JavaScript overhead
 * ❌ Requires careful testing
 * ❌ May need accessibility adjustments
 */

import { useRef, useEffect } from 'react';

interface MomentumScrollOptions {
  ease?: number;
  multiplier?: number;
  enabled?: boolean;
}

export function useMomentumScroll(options: MomentumScrollOptions = {}) {
  const {
    ease = 0.1,
    multiplier = 0.5,
    enabled = true,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    
    const container = containerRef.current;
    if (!container) return;

    let currentScroll = 0;
    let targetScroll = 0;
    let animationFrame: number | null = null;
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetScroll += e.deltaY * multiplier;
      targetScroll = Math.max(
        0,
        Math.min(targetScroll, container.scrollHeight - container.clientHeight)
      );
      
      // Start animation loop if not already running
      if (!isScrolling) {
        isScrolling = true;
        animationFrame = requestAnimationFrame(smoothScroll);
      }
    };

    const smoothScroll = () => {
      currentScroll += (targetScroll - currentScroll) * ease;
      
      if (Math.abs(targetScroll - currentScroll) > 0.5) {
        container.scrollTop = currentScroll;
        animationFrame = requestAnimationFrame(smoothScroll);
      } else {
        container.scrollTop = targetScroll;
        currentScroll = targetScroll;
        isScrolling = false;
      }
    };

    // Initialize scroll position
    currentScroll = container.scrollTop;
    targetScroll = container.scrollTop;

    // Add wheel event listener
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [ease, multiplier, enabled]);

  return containerRef;
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

export function ExampleWithMomentumScroll() {
  const scrollRef = useMomentumScroll({
    ease: 0.1,       // How smooth (0-1, lower = smoother but slower to respond)
    multiplier: 0.5, // Scroll speed multiplier
    enabled: true,   // Toggle momentum scrolling
  });

  return (
    <div 
      ref={scrollRef} 
      className="h-screen overflow-y-auto"
      // Don't add scrollBehavior: 'smooth' here - it will conflict
    >
      <div className="p-8 space-y-8">
        <h1>Content with Momentum Scrolling</h1>
        
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow">
            Section {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE: Conditional Momentum (Desktop Only)
// ============================================================================

export function ExampleConditionalMomentum() {
  const isMobile = window.innerWidth < 768;
  
  const scrollRef = useMomentumScroll({
    enabled: !isMobile, // Only enable on desktop
    ease: 0.1,
    multiplier: 0.5,
  });

  return (
    <div 
      ref={scrollRef}
      className="h-screen overflow-y-auto"
      style={{ 
        // Use native smooth scroll on mobile
        scrollBehavior: isMobile ? 'smooth' : 'auto' 
      }}
    >
      {/* Content */}
    </div>
  );
}

// ============================================================================
// EXAMPLE: With Scroll-to Functionality
// ============================================================================

export function ExampleWithScrollTo() {
  const scrollRef = useMomentumScroll({
    ease: 0.1,
    multiplier: 0.5,
  });

  const scrollToTop = () => {
    if (scrollRef.current) {
      // For programmatic scrolling, use GSAP
      import('gsap').then(({ gsap }) => {
        gsap.to(scrollRef.current, {
          scrollTop: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      });
    }
  };

  return (
    <>
      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Scroll to Top
      </button>
      
      <div ref={scrollRef} className="h-screen overflow-y-auto">
        {/* Content */}
      </div>
    </>
  );
}

// ============================================================================
// ACCESSIBILITY: Respect Reduced Motion
// ============================================================================

export function ExampleWithReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const scrollRef = useMomentumScroll({
    enabled: !prefersReducedMotion, // Disable if user prefers reduced motion
    ease: 0.1,
    multiplier: 0.5,
  });

  return (
    <div 
      ref={scrollRef}
      className="h-screen overflow-y-auto"
      style={{ 
        scrollBehavior: prefersReducedMotion ? 'auto' : 'smooth' 
      }}
    >
      {/* Content */}
    </div>
  );
}
