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

