// frontend/components/smooth-scroll-init.js
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis;

/** Глобальний плавний скрол + інтеграція зі ScrollTrigger */
export function initSmoothScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  console.log('[Lenis] prefers-reduced-motion =', prefersReduced);
  if (prefersReduced) return { refresh: () => ScrollTrigger.refresh() };

  lenis = new Lenis({
    lerp: 0.06,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1.05
  });

  // GSAP оновлюється від Lenis
  lenis.on('scroll', ScrollTrigger.update);

  // Проксі, щоб тригери читали позицію з Lenis
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    }
  });

  // RAF-цикл
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  document.documentElement.classList.add('lenis-ready');
  window.__lenis = lenis;                // щоб перевіряти у консолі: __lenis
  console.log('[Lenis] init OK');

  const refresh = () => ScrollTrigger.refresh();

  window.addEventListener('load', refresh);
  window.addEventListener('resize', () => {
    clearTimeout(window.__lenisResizeTO);
    window.__lenisResizeTO = setTimeout(refresh, 120);
  });

  return {
    refresh,
    stop:  () => lenis?.stop(),
    start: () => lenis?.start(),
  };
}

export function smoothRefresh() {
  ScrollTrigger.refresh();
}
