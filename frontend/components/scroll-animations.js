// frontend/components/scroll-animations.js

// Використовуємо глобальний GSAP
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

// Імпортуємо тільки SplitText
import { SplitText } from 'gsap/SplitText';

// ---- Tunables
const EASE = 'power2.out';
const DURATION_IN  = 0.65;
const DURATION_OUT = 0.45;

// ---- Helpers
function setOnceFlag(node, key) {
  if (node[key]) return false;
  node[key] = true;
  return true;
}

// ---- [1] Reveal-in animations (fade+up)
function initReveal(root = document) {
  if (!gsap) return;

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
  if (!gsap) return;

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
function initFillTitles(root = document) {
  if (!gsap) return;

  gsap.utils.toArray(root.querySelectorAll('[data-fill-title]')).forEach((el) => {
    if (!setOnceFlag(el, '__whFill')) return;

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

    st.refresh();
  });
}

// ---- [4] НОВА АНІМАЦІЯ ДЛЯ HERO ТЕКСТУ (split text)
function initHeroTextAnimation(root = document) {
  if (!gsap || !SplitText) return;

  const elements = root.querySelectorAll('[data-fill-title]');
  if (!elements.length) return;

  elements.forEach((element) => {
    if (!setOnceFlag(element, '__whHeroText')) return;

    // Cleanup previous animations
    if (element.anim) {
      element.anim.progress(1).kill();
      element.split?.revert();
    }

    try {
      // Initialize SplitText
      element.split = new SplitText(element, {
        type: "lines",
        linesClass: "split-line"
      });

      // Create animations for each line
      element.split.lines.forEach((line, index) => {
        // Set initial state - 40% OPACITY
        gsap.set(line, {
          opacity: 0.4 // 👈 ПО ДЕФОЛТУ 40% OPACITY
        });

        // Create scroll animation - ЗБІЛЬШУЄМО ДО 100% OPACITY
        element.anim = gsap.to(line, {
          opacity: 1, // 👈 ПРИ СКРОЛІ 100% OPACITY
          ease: "none",
          delay: 0.1 * index,
          scrollTrigger: {
            trigger: line,
            scrub: 0.3,
            start: "top center",
            end: "bottom center",
            invalidateOnRefresh: true
          }
        });
      });

    } catch (error) {
      console.error('Hero text animation error:', error);
    }
  });
}

// ---- [5] Visit block animations
function initVisitAnimations(root = document) {
  if (!gsap) return;

  // Знаходимо всі visit секції
  gsap.utils.toArray(root.querySelectorAll('[id^="visit-"]')).forEach((visitSection) => {
    if (!setOnceFlag(visitSection, '__visitAnimations')) return;

    // Логіка центрування
    const visitText = visitSection.querySelector('.visit-text');
    if (visitText) {
      const hasTitle = visitText.querySelector('h2');
      const hasText = visitText.querySelector('p');

      if (!hasTitle && !hasText) {
        visitText.classList.add('center-button');
        const gridClass = 'visit-grid-' + visitSection.id.replace('visit-', '');
        visitSection.querySelector('.' + gridClass)?.classList.add('center-grid');
      }
    }

    // Fade-in-slide-up для текстового контенту
    gsap.utils.toArray(visitSection.querySelectorAll('[data-anim="fade-in-slide-up"]')).forEach((element) => {
      if (!setOnceFlag(element, '__visitFadeUp')) return;

      const delay = parseFloat(element.dataset.animDelay) || 0;

      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      });
    });

    // Scroll slide для зображень
    gsap.utils.toArray(visitSection.querySelectorAll('[data-anim="scroll-slide"]')).forEach(element => {
      if (!setOnceFlag(element, '__visitScrollSlide')) return;

      const distance = parseInt(element.dataset.animDistance) || 60;
      const isReverse = element.hasAttribute('data-anim-dir');

      gsap.set(element, {
        y: isReverse ? -distance : distance
      });

      gsap.to(element, {
        y: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          end: "bottom 50%",
          scrub: 1.5,
          invalidateOnRefresh: true
        }
      });
    });
  });
}



/** Ініціалізація для всієї сторінки або для щойно вставленої секції */
export function initScrollAnimations(root = document) {
  if (!root) root = document;

  // Чекаємо на GSAP
  if (!gsap || !ScrollTrigger) {
    setTimeout(() => initScrollAnimations(root), 100);
    return;
  }

  initReveal(root);
  initParallax(root);
  initFillTitles(root);
  initHeroTextAnimation(root); // 👈 ДОДАЄМО НОВУ АНІМАЦІЮ
  initVisitAnimations(root);
}

/** Мʼяке оновлення тригерів при зміні DOM/розміру */
export function scrollAnimationsRefresh() {
  if (!ScrollTrigger) return;

  try {
    ScrollTrigger.refresh();
  } catch (error) {
    console.error('ScrollTrigger refresh error:', error);
  }
}

// ---- Автоінтеграція з lazy-sections
if (typeof document !== 'undefined') {
  document.addEventListener('lazy:section:loaded', (e) => {
    const root = e?.target || document;
    initScrollAnimations(root);
    setTimeout(() => {
      if (ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    }, 50);
  });

  window.addEventListener('resize', () => {
    let raf;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    });
  });
}
