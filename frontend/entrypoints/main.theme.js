// import '../styles/main.scss';

import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';

import { initSmoothScroll, smoothRefresh } from '../components/smooth-scroll-init.js';
import { initLazySections, lazySectionsRefresh } from '../components/lazy-sections.js';
import { initScrollAnimations } from '../components/scroll-animations.js';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import '../components/alp-main-store';
import '../components/alp-cart';
import '../components/alp-build-box'; // FE TODO Must be included only for the build box section
import '../components/main-product-replaced.js';
import { mountAuthStore } from '../components/auth-modal';
import { search } from '../components/search';
import { initMapSections } from '../components/map-section';
import { initFeaturesSlider } from '../components/features-slider';




window.Alpine = Alpine;
window.Swiper = Swiper;
Swiper.use([Navigation, Pagination]);

Alpine.plugin(persist);

initSmoothScroll();
mountAuthStore();
search();

Alpine.start();

import { variantSelect } from '../components/variant-select';
import { headerSticky } from '../components/header';
import { productCarousel } from '../components/product-carousel';

headerSticky();
variantSelect();
productCarousel();
initFeaturesSlider();



initScrollAnimations(document);

document.addEventListener('DOMContentLoaded', initLazySections);

initMapSections(document);


document.addEventListener('lazy:section:loaded', (e) => {
  initScrollAnimations(e.target); // тільки в нововставленій секції
  smoothRefresh();                 // оновити тригери висот
  initMapSections(e.target);
});

smoothRefresh();

document.addEventListener('product:variant:changed', smoothRefresh);
document.addEventListener('carousel:init', smoothRefresh);


document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.pathname.includes('a/wishlist-hero/wishlist')) return;
  
    function waitForElement(selector, callback) {
      const el = document.querySelector(selector);
      if (el) {
        callback(el);
        return;
      }
  
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          callback(el);
        }
      });
  
      observer.observe(document.body, { childList: true, subtree: true });
    }
  
    waitForElement('#wishlist-hero-shared-list-view', (target) => {
      const html = `
        <aside class="account-nav">
          <nav aria-label="Account navigation">
            <ul class="account-nav__list">
              <li>
                <a class="heading-5 account-nav__link is-active" href="/account/login">My Account</a>
              </li>
              <li>
                <a class="heading-5 account-nav__link" href="/collections/all">Wishlist</a>
              </li>
              <li>
                <a class="heading-5 account-nav__link" href="/account/login">My Orders</a>
              </li>
              <li>
                <a class="heading-5 account-nav__link" href="/account/logout">Logout</a>
              </li>
            </ul>
          </nav>
        </aside>
      `;
  
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim();
  
      target.parentNode.insertBefore(wrapper.firstElementChild, target);
    });
  });