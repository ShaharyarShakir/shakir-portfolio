import gsap from 'gsap';

/**
 * Utility to check if user prefers reduced motion
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Animates elements entering the page with a gentle fade and vertical drift.
 */
export function animateCardEntrance(
  elements: Element | Element[] | NodeListOf<Element> | string,
  options: { delay?: number; stagger?: number } = {}
) {
  if (isReducedMotion()) return;

  const { delay = 0, stagger = 0.08 } = options;

  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 24,
      scale: 0.98,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.75,
      delay,
      stagger,
      ease: 'power2.out',
      clearProps: 'opacity,transform',
    }
  );
}

/**
 * Creates hover elevation and icy highlight response on UI cards.
 */
export function initCardHoverAnimation(cardElement: HTMLElement) {
  if (isReducedMotion() || !cardElement) return;

  const onMouseEnter = () => {
    gsap.to(cardElement, {
      y: -4,
      scale: 1.008,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const onMouseLeave = () => {
    gsap.to(cardElement, {
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  cardElement.addEventListener('mouseenter', onMouseEnter);
  cardElement.addEventListener('mouseleave', onMouseLeave);

  return () => {
    cardElement.removeEventListener('mouseenter', onMouseEnter);
    cardElement.removeEventListener('mouseleave', onMouseLeave);
  };
}

/**
 * Animates a soft ambient pulsing glow for the moonlight aura.
 */
export function animateMoonGlow(glowElement: HTMLElement | SVGElement | null) {
  if (isReducedMotion() || !glowElement) return;

  return gsap.to(glowElement, {
    scale: 1.08,
    opacity: 0.9,
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
}
