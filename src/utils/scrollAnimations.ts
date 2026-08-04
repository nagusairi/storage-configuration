import { gsap } from 'gsap';

/**
 * Smooth scroll to a specific element within a container
 */
export function scrollToElement(
  container: HTMLElement,
  target: HTMLElement,
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

  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  
  const scrollTop = container.scrollTop + (targetRect.top - containerRect.top) - offset;

  gsap.to(container, {
    scrollTop,
    duration,
    ease,
  });
}

/**
 * Smooth scroll to a specific position within a container
 */
export function scrollToPosition(
  container: HTMLElement,
  position: number,
  options: {
    duration?: number;
    ease?: string;
  } = {}
) {
  const {
    duration = 0.8,
    ease = 'power3.out',
  } = options;

  gsap.to(container, {
    scrollTop: position,
    duration,
    ease,
  });
}

/**
 * Smooth scroll by a delta amount
 */
export function scrollByDelta(
  container: HTMLElement,
  delta: number,
  options: {
    duration?: number;
    ease?: string;
  } = {}
) {
  const {
    duration = 0.5,
    ease = 'power2.out',
  } = options;

  gsap.to(container, {
    scrollTop: container.scrollTop + delta,
    duration,
    ease,
  });
}

/**
 * Scroll to top of container
 */
export function scrollToTop(
  container: HTMLElement,
  options: {
    duration?: number;
    ease?: string;
  } = {}
) {
  scrollToPosition(container, 0, options);
}

/**
 * Scroll to bottom of container
 */
export function scrollToBottom(
  container: HTMLElement,
  options: {
    duration?: number;
    ease?: string;
  } = {}
) {
  const bottom = container.scrollHeight - container.clientHeight;
  scrollToPosition(container, bottom, options);
}

/**
 * Animate scroll reveal when element enters viewport
 */
export function animateScrollReveal(
  elements: HTMLElement[],
  options: {
    stagger?: number;
    duration?: number;
    ease?: string;
    y?: number;
    opacity?: number;
  } = {}
) {
  const {
    stagger = 0.1,
    duration = 0.6,
    ease = 'power3.out',
    y = 30,
    opacity = 0,
  } = options;

  gsap.fromTo(
    elements,
    {
      y,
      opacity,
    },
    {
      y: 0,
      opacity: 1,
      duration,
      ease,
      stagger,
    }
  );
}

/**
 * Create smooth momentum scrolling effect
 */
export class SmoothScroller {
  private container: HTMLElement;
  private scrollData: {
    current: number;
    target: number;
    ease: number;
  };
  private animationFrame: number | null = null;
  private wheelHandler: ((e: WheelEvent) => void) | null = null;

  constructor(
    container: HTMLElement,
    options: {
      ease?: number;
      multiplier?: number;
    } = {}
  ) {
    this.container = container;
    this.scrollData = {
      current: container.scrollTop,
      target: container.scrollTop,
      ease: options.ease || 0.08,
    };

    this.wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      this.scrollData.target += e.deltaY * (options.multiplier || 0.5);
      this.scrollData.target = Math.max(
        0,
        Math.min(
          this.scrollData.target,
          this.container.scrollHeight - this.container.clientHeight
        )
      );
    };

    this.start();
  }

  private animate = () => {
    this.scrollData.current +=
      (this.scrollData.target - this.scrollData.current) * this.scrollData.ease;

    if (Math.abs(this.scrollData.target - this.scrollData.current) > 0.5) {
      this.container.scrollTop = this.scrollData.current;
      this.animationFrame = requestAnimationFrame(this.animate);
    } else {
      this.container.scrollTop = this.scrollData.target;
      this.scrollData.current = this.scrollData.target;
    }
  };

  private start() {
    if (this.wheelHandler) {
      this.container.addEventListener('wheel', this.wheelHandler, {
        passive: false,
      });
    }
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  public destroy() {
    if (this.wheelHandler) {
      this.container.removeEventListener('wheel', this.wheelHandler);
    }
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  public scrollTo(position: number, options: { duration?: number; ease?: string } = {}) {
    gsap.to(this.scrollData, {
      target: position,
      duration: options.duration || 0.8,
      ease: options.ease || 'power3.out',
    });
  }
}

/**
 * Parallax scrolling effect
 */
export function createParallaxScroll(
  container: HTMLElement,
  elements: { element: HTMLElement; speed: number }[]
) {
  const updateParallax = () => {
    const scrollTop = container.scrollTop;
    
    elements.forEach(({ element, speed }) => {
      const yPos = -(scrollTop * speed);
      gsap.set(element, {
        y: yPos,
      });
    });
  };

  container.addEventListener('scroll', updateParallax);
  
  return () => {
    container.removeEventListener('scroll', updateParallax);
  };
}
