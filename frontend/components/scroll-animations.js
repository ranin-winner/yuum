// frontend/components/scroll-animations.js

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
import { SplitText } from 'gsap/SplitText';

// ---- Tunables
const EASE = 'power2.out';
const DURATION_IN = 0.65;
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
      onEnter: () => gsap.to(el, { y: 0, opacity: 1, duration: DURATION_IN, ease: EASE }),
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

// ---- [3] Title fill-on-scroll
function initFillTitles(root = document) {
  if (!gsap) return;

  gsap.utils.toArray(root.querySelectorAll('[data-fill-title]')).forEach((el) => {
    if (el.hasAttribute('data-anim') && el.getAttribute('data-anim') === 'text-color-fill') return;
    if (!setOnceFlag(el, '__whFill')) return;

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
}

// ---- [4] TEXT WORD ANIMATION
function initTextColorFill(root = document) {
  if (!gsap || !ScrollTrigger || !SplitText) return;

  const elements = root.querySelectorAll('[data-anim="text-color-fill"]');
  if (!elements.length) return;

  if (!gsap.plugins.splitText) {
    gsap.registerPlugin(SplitText);
  }

  function setupAnimation() {
    elements.forEach((element) => {
      if (!setOnceFlag(element, '__whTextColorFill')) return;

      if (element.anim) {
        element.anim.progress(1).kill();
        element.split?.revert();
      }

      try {
        element.split = new SplitText(element, {
          type: "words",
          wordsClass: "split-word"
        });

        gsap.set(element.split.words, { opacity: 0.4 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            end: "top 10%",
            scrub: 2,
            toggleActions: "play reverse play reverse"
          }
        });

        element.split.words.forEach((word, index) => {
          tl.to(word, {
            opacity: 1,
            duration: 10,
            ease: "power2.out"
          }, index * 0.85);
        });

        element.anim = tl;

      } catch (error) {
        console.error('Text word animation error:', error);
      }
    });
  }

  setupAnimation();
  ScrollTrigger.addEventListener('refresh', setupAnimation);
}

// ---- [5] Visit block animations
function initVisitAnimations(root = document) {
  if (!gsap) return;

  gsap.utils.toArray(root.querySelectorAll('[id^="visit-"]')).forEach((visitSection) => {
    if (!setOnceFlag(visitSection, '__visitAnimations')) return;

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

    gsap.utils.toArray(visitSection.querySelectorAll('[data-anim="fade-in-slide-up"]')).forEach((element) => {
      if (!setOnceFlag(element, '__visitFadeUp')) return;

      const delay = parseFloat(element.dataset.animDelay) || 0;

      gsap.to(element, {
        opacity: 1,
        y: 0,
        duration: 2,
        delay: delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      });
    });

    gsap.utils.toArray(visitSection.querySelectorAll('[data-anim="scroll-slide"]')).forEach(element => {
      if (!setOnceFlag(element, '__visitScrollSlide')) return;

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
  });
}

// ---- [6] Split Text Reveal Animation
function initSplitTextReveal(root = document) {
  if (!gsap || !ScrollTrigger || !SplitText) return;

  const elements = root.querySelectorAll('[data-anim="split-text-reveal"]');
  if (!elements.length) return;

  if (!gsap.plugins.splitText) {
    gsap.registerPlugin(SplitText);
  }

  elements.forEach((element) => {
    if (!setOnceFlag(element, '__whSplitReveal')) return;

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
  });
}

// ---- [7] Slide In Bottom Animation
function initSlideInBottom(root = document) {
  if (!gsap) return;

  gsap.utils.toArray(root.querySelectorAll('.anim-slide-in-bottom')).forEach((el) => {
    if (!setOnceFlag(el, '__whSlideBottom')) return;

    gsap.set(el, { y: 60, opacity: 0 });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out'
        });
      }
    });
  });
}

// ---- [8] Product Card Stagger Animation
function initProductCardStagger(root = document) {
  if (!gsap) return;

  // Шукаємо всі swiper контейнери замість data-swiper-parent
  const swiperContainers = root.querySelectorAll('.swiper-container');

  swiperContainers.forEach((container) => {
    const productCards = container.querySelectorAll('.product-card[data-anim="fade-in-slide-up"]');

    productCards.forEach((card, index) => {
      if (!setOnceFlag(card, '__whProductStagger')) return;

      gsap.set(card, {
        y: 30,
        opacity: 0,
        scale: 0.98
      });

      ScrollTrigger.create({
        trigger: container,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(card, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out'
          });
        }
      });
    });
  });
}

export function initScrollAnimations(root = document) {
  if (!root) root = document;

  if (!gsap || !ScrollTrigger) {
    setTimeout(() => initScrollAnimations(root), 100);
    return;
  }

  initReveal(root);
  initParallax(root);
  initFillTitles(root);
  initTextColorFill(root);
  initVisitAnimations(root);
  initSplitTextReveal(root);
  initSlideInBottom(root);
  initProductCardStagger(root);

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
