import { useEffect, useRef, RefObject } from 'react';
import { gsap } from 'gsap';

interface GSAPScrollOptions {
  smooth?: boolean;
  ease?: number;
  multiplier?: number;
  enabled?: boolean;
}

/**
 * Enhanced GSAP smooth scrolling hook
 * Provides momentum-based smooth scrolling for any container
 */
export function useGSAPScroll(
  options: GSAPScrollOptions = {}
): RefObject<HTMLDivElement> {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollDataRef = useRef({
    current: 0,
    target: 0,
    ease: options.ease || 0.1,
    multiplier: options.multiplier || 0.5,
  });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const enabled = options.enabled !== false && options.smooth !== false;
    
    if (!container || !enabled) return;

    const scrollData = scrollDataRef.current;

    // Wheel event handler for smooth momentum scrolling
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollData.target += e.deltaY * scrollData.multiplier;
      scrollData.target = Math.max(
        0,
        Math.min(
          scrollData.target,
          container.scrollHeight - container.clientHeight
        )
      );
      
      // Start animation if not already running
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Smooth animation loop
    const animate = () => {
      scrollData.current += (scrollData.target - scrollData.current) * scrollData.ease;

      if (Math.abs(scrollData.target - scrollData.current) > 0.5) {
        container.scrollTop = scrollData.current;
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        container.scrollTop = scrollData.target;
        scrollData.current = scrollData.target;
        animationFrameRef.current = null;
      }
    };

    // Initialize scroll position
    scrollData.current = container.scrollTop;
    scrollData.target = container.scrollTop;

    // Add event listener
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [options.enabled, options.smooth, options.ease, options.multiplier]);

  return containerRef;
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollReveal(
  dependencies: any[] = []
): RefObject<HTMLDivElement> {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('[data-scroll-reveal]');
    
    gsap.fromTo(
      elements,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, dependencies);

  return containerRef;
}

/**
 * Hook for parallax scroll effects
 */
export function useParallaxScroll(
  speed: number = 0.5
): RefObject<HTMLDivElement> {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const yPos = -(scrolled * speed);
      
      gsap.set(element, {
        y: yPos,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return elementRef;
}

/**
 * Scroll to element with GSAP animation
 */
export function scrollToElement(
  container: HTMLElement,
  target: HTMLElement | number,
  options: {
    duration?: number;
    ease?: string;
    offset?: number;
  } = {}
) {
  const {
    duration = 0.8,
    ease = 'power3.out',
    offset = 0,
  } = options;

  const scrollTop = typeof target === 'number'
    ? target
    : target.offsetTop - container.offsetTop - offset;

  gsap.to(container, {
    scrollTop,
    duration,
    ease,
  });
}
