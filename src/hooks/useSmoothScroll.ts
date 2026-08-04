import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SmoothScrollOptions {
  speed?: number;
  smooth?: number;
  ease?: string;
}

export function useSmoothScroll(options: SmoothScrollOptions = {}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const scrollDataRef = useRef({
    current: 0,
    target: 0,
    ease: options.ease || 'power3.out',
    speed: options.speed || 0.1,
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let animationFrame: number;
    const scrollData = scrollDataRef.current;

    // Handle wheel events for smooth scrolling
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollData.target += e.deltaY;
      scrollData.target = Math.max(0, Math.min(scrollData.target, element.scrollHeight - element.clientHeight));
    };

    // Smooth scroll animation loop
    const updateScroll = () => {
      scrollData.current += (scrollData.target - scrollData.current) * scrollData.speed;
      
      if (Math.abs(scrollData.target - scrollData.current) > 0.5) {
        element.scrollTop = scrollData.current;
        animationFrame = requestAnimationFrame(updateScroll);
      } else {
        element.scrollTop = scrollData.target;
        scrollData.current = scrollData.target;
      }
    };

    // Initialize scroll position
    scrollData.current = element.scrollTop;
    scrollData.target = element.scrollTop;

    // Add wheel event listener
    element.addEventListener('wheel', handleWheel, { passive: false });

    // Start animation loop
    animationFrame = requestAnimationFrame(updateScroll);

    return () => {
      element.removeEventListener('wheel', handleWheel);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return elementRef;
}

// Smooth scroll to element utility
export function smoothScrollTo(
  container: HTMLElement,
  target: number | HTMLElement,
  duration: number = 0.8,
  ease: string = 'power3.out'
) {
  const targetScroll = typeof target === 'number' 
    ? target 
    : target.offsetTop - container.offsetTop;

  gsap.to(container, {
    scrollTop: targetScroll,
    duration,
    ease,
  });
}

// Smooth scroll by delta utility
export function smoothScrollBy(
  container: HTMLElement,
  delta: number,
  duration: number = 0.5,
  ease: string = 'power2.out'
) {
  gsap.to(container, {
    scrollTop: container.scrollTop + delta,
    duration,
    ease,
  });
}
