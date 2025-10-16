// frontend/components/scroll-animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'power2.out';
const DURATION_IN  = 0.65;  // 0.55–0.75
const DURATION_OUT = 0.45;

function initReveal(root = document) {
  gsap.utils.toArray(root.querySelectorAll('[data-reveal]')).forEach((el) => {
    // уникаємо подвійної ініціалізації
    if (el.__whReveal) return;
    el.__whReveal = true;

    gsap.set(el, { y: 24, opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter:     () => gsap.to(el, { y: 0, opacity: 1, duration: DURATION_IN,  ease: EASE }),
      onLeaveBack: () => gsap.to(el, { y:24, opacity: 0, duration: DURATION_OUT, ease: EASE })
    });
  });
}

function initParallax(root = document) {
  gsap.utils.toArray(root.querySelectorAll('[data-parallax]')).forEach((wrap) => {
    if (wrap.__whParallax) return;
    wrap.__whParallax = true;

    const item = wrap.querySelector('img, video, picture, [data-parallax-item]');
    if (!item) return;

    gsap.fromTo(item, { yPercent: -8 }, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

/** Ініціалізація для всієї сторінки або для щойно вставленої секції */
export function initScrollAnimations(root = document) {
  initReveal(root);
  initParallax(root);
}
