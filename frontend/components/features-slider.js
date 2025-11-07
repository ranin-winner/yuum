// features-slider.js
// Викликати: import { initFeaturesSlider } from './features-slider'; initFeaturesSlider();

export function initFeaturesSlider() {
    const mql = window.matchMedia('(max-width: 1023px)');
    const roots = Array.from(document.querySelectorAll('[data-features]'));
    if (!roots.length) return;
  
    function enable(root) {
      if (root._swiper) return;
  
      const slidesCount = Number(root.dataset.slidesCount || '0');
      const container = root.querySelector('.swiper');
      const paginationEl = root.querySelector('.swiper-pagination');
      if (!container) return;
  
      // eslint-disable-next-line no-undef
      const instance = new Swiper(container, {
        slidesPerView: 1,
        spaceBetween: 16,
        loop: slidesCount > 1,
        autoHeight: true,
        watchSlidesProgress: true,
        pagination: {
          el: paginationEl,
          clickable: true
        }
      });
  
      if (slidesCount <= 1 && paginationEl) paginationEl.style.display = 'none';
      root._swiper = instance;
    }
  
    function disable(root) {
      if (root._swiper) {
        root._swiper.destroy(true, true);
        root._swiper = null;
      }
    }
  
    function update() {
      roots.forEach(root => (mql.matches ? enable(root) : disable(root)));
    }
  
    update();
    mql.addEventListener('change', update);
  }
  