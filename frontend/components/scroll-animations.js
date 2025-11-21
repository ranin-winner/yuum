// frontend/components/scroll-animations.js

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
import { SplitText } from 'gsap/SplitText';

// ---- Helpers
function setOnceFlag(node, key) {
  if (node[key]) return false;
  node[key] = true;
  return true;
}

// ---- [1] Універсальна анімація fade-in-slide-up
function initFadeInSlideUp(root = document) {
  if (!gsap) return;

  const selectors = [
    '[data-reveal]',
    '[data-anim="fade-in-slide-up"]',
    '.anim-slide-in-bottom',
    '.product-card[data-anim="fade-in-slide-up"]'
  ];

  selectors.forEach(selector => {
    gsap.utils.toArray(root.querySelectorAll(selector)).forEach((el, index) => {
      if (!setOnceFlag(el, `__fadeInUp_${selector}`)) return;

      const configs = {
        '[data-reveal]': { y: 24, duration: 0.65 },
        '[data-anim="fade-in-slide-up"]': { y: 30, duration: 0.8 },
        '.anim-slide-in-bottom': { y: 60, duration: 1.2 },
        '.product-card[data-anim="fade-in-slide-up"]': { y: 30, scale: 0.98, duration: 0.6 }
      };

      const config = configs[selector] || { y: 30, duration: 0.8 };

      gsap.set(el, {
        y: config.y,
        opacity: 0,
        ...(config.scale && { scale: config.scale })
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: config.duration,
            delay: selector.includes('product-card') ? index * 0.1 : 0,
            ease: 'power2.out'
          });
        },
        ...(selector === '[data-reveal]' && {
          onLeaveBack: () => gsap.to(el, {
            y: config.y,
            opacity: 0,
            duration: 0.45,
            ease: 'power2.out'
          })
        })
      });
    });
  });
}

// ---- [2] Паралакс (залишаємо як є)
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

// ---- [3] Scroll-slide анімації (об'єднуємо [5] частину)
function initScrollSlide(root = document) {
  if (!gsap) return;

  gsap.utils.toArray(root.querySelectorAll('[data-anim="scroll-slide"]')).forEach(element => {
    if (!setOnceFlag(element, '__scrollSlide')) return;

    const distance = parseInt(element.dataset.animDistance) || 60;
    const isReverse = element.hasAttribute('data-anim-dir');

    gsap.set(element, {
      y: isReverse ? -distance : distance
    });

    gsap.to(element, {
      y: 0,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        end: "bottom 50%",
        scrub: 2.5,
        invalidateOnRefresh: true
      }
    });
  });
}

// ---- [4] Текст анімації (об'єднуємо [3] і [4])
function initTextAnimations(root = document) {
  if (!gsap || !ScrollTrigger) return;

  // Fill titles
  gsap.utils.toArray(root.querySelectorAll('[data-fill-title]')).forEach((el) => {
    if (el.hasAttribute('data-anim') && el.getAttribute('data-anim') === 'text-color-fill') return;
    if (!setOnceFlag(el, '__fillTitle')) return;

    el.style.setProperty('--clip-right', '100%');

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 2,
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

  // Split text reveal
  if (!SplitText) return;

  const splitElements = root.querySelectorAll('[data-anim="split-text-reveal"]');
  if (!splitElements.length) return;

  if (!gsap.plugins.splitText) {
    gsap.registerPlugin(SplitText);
  }

  splitElements.forEach((element) => {
    if (!setOnceFlag(element, '__splitText')) return;

    try {
      const split = new SplitText(element, {
        type: 'chars',
        charsClass: 'split-char'
      });

      gsap.set(split.chars, {
        y: '100%',
        opacity: 0
      });

      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(split.chars, {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            stagger: 0.02,
            ease: 'power2.out'
          });
        }
      });
    } catch (error) {
      console.warn('SplitText failed:', error);
    }
  });

  // Text color fill
  const colorFillElements = root.querySelectorAll('[data-anim="text-color-fill"]');
  if (!colorFillElements.length) return;

  colorFillElements.forEach((element) => {
    if (!setOnceFlag(element, '__textColorFill')) return;

    try {
      const split = new SplitText(element, {
        type: "words",
        wordsClass: "split-word"
      });

      gsap.set(split.words, { opacity: 0.4 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          end: "top 10%",
          scrub: 2,
          toggleActions: "play reverse play reverse"
        }
      });

      split.words.forEach((word, index) => {
        tl.to(word, {
          opacity: 1,
          duration: 10,
          ease: "power2.out"
        }, index * 0.85);
      });

    } catch (error) {
      console.warn('Text color fill failed:', error);
    }
  });
}

// ---- [5] Visit block (спрощена версія)
function initVisitAnimations(root = document) {
  if (!gsap) return;

  gsap.utils.toArray(root.querySelectorAll('[id^="visit-"]')).forEach((visitSection) => {
    if (!setOnceFlag(visitSection, '__visitAnim')) return;

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
  });
}

export function initScrollAnimations(root = document) {
  if (!root) root = document;

  if (!gsap || !ScrollTrigger) {
    setTimeout(() => initScrollAnimations(root), 100);
    return;
  }

  initFadeInSlideUp(root);
  initParallax(root);
  initScrollSlide(root);
  initTextAnimations(root);
  initVisitAnimations(root);

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 50);
}

export function scrollAnimationsRefresh() {
  if (!ScrollTrigger) return;
  try {
    ScrollTrigger.refresh();
  } catch (error) {
    console.error('ScrollTrigger refresh error:', error);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
  });

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
