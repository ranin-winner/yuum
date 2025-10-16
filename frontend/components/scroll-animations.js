// frontend/components/scroll-animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ---- Tunables
const EASE = 'power2.out';
const DURATION_IN  = 0.65; // 0.55–0.75
const DURATION_OUT = 0.45;

// ---- Helpers
function setOnceFlag(node, key) {
  if (node[key]) return false;
  node[key] = true;
  return true;
}

// ---- [1] Reveal-in animations (fade+up)
function initReveal(root = document) {
  gsap.utils.toArray(root.querySelectorAll('[data-reveal]')).forEach((el) => {
    if (!setOnceFlag(el, '__whReveal')) return;

    gsap.set(el, { y: 24, opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter:     () => gsap.to(el, { y: 0,  opacity: 1, duration: DURATION_IN,  ease: EASE }),
      onLeaveBack: () => gsap.to(el, { y: 24, opacity: 0, duration: DURATION_OUT, ease: EASE })
    });
  });
}

// ---- [2] Parallax wrappers
function initParallax(root = document) {
  gsap.utils.toArray(root.querySelectorAll('[data-parallax]')).forEach((wrap) => {
    if (!setOnceFlag(wrap, '__whParallax')) return;

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

// ---- [3] Title fill-on-scroll (left → right)
// Працює тільки для елементів з атрибутом [data-fill-title].
// CSS має містити ::after з clip-path, а color береться через --title-color.
function initFillTitles(root = document) {
  gsap.utils.toArray(root.querySelectorAll('[data-fill-title]')).forEach((el) => {
    if (!setOnceFlag(el, '__whFill')) return;

    // Початково повністю “закрито” (правий відступ 100%).
    el.style.setProperty('--clip-right', '100%');

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'top 20%',
      scrub: true,
      onUpdate: (self) => {
        const right = 100 - (self.progress * 100);
        el.style.setProperty('--clip-right', right.toFixed(2) + '%');
      },
      onLeaveBack: () => {
        el.style.setProperty('--clip-right', '100%');
      }
    });

    // Якщо елемент уже в межах viewport під час ініціалізації — одразу виставляємо прогрес
    // після першого refresh.
    st.refresh();
  });
}

/** Ініціалізація для всієї сторінки або для щойно вставленої секції */
export function initScrollAnimations(root = document) {
  if (!root) root = document;
  initReveal(root);
  initParallax(root);
  initFillTitles(root);
}

/** Мʼяке оновлення тригерів при зміні DOM/розміру */
export function scrollAnimationsRefresh() {
  try { ScrollTrigger.refresh(); } catch (_) {}
}

// ---- Автоінтеграція з твоїми lazy-sections
// Коли секція довантажилась — ініціалізуємо анімації лише в її межах.
if (typeof document !== 'undefined') {
  document.addEventListener('lazy:section:loaded', (e) => {
    const root = e?.target || document;
    initScrollAnimations(root);
    // Невелика затримка для коректних розрахунків висот
    setTimeout(() => ScrollTrigger.refresh(), 50);
  });

  // На всяк випадок — при зміні розміру вікна
  window.addEventListener('resize', () => {
    // debounce через rAF
    let raf;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => ScrollTrigger.refresh());
  });
}
