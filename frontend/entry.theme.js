import './styles/main.scss';

import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';

import { initSmoothScroll, smoothRefresh } from './components/smooth-scroll-init';
import { initLazySections } from './components/lazy-sections';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import '../components/alp-main-store';
import '../components/alp-cart';
import '../components/alp-build-box'; // FE TODO Must be included only for the build box section
import '../components/main-product-replaced';

window.Alpine = Alpine;
window.Swiper = Swiper;
Swiper.use([Navigation, Pagination]);

Alpine.plugin(persist);

initSmoothScroll();

Alpine.start();

import { variantSelect } from '../components/variant-select';
import { headerSticky } from '../components/header';
import { productCarousel } from '../components/product-carousel';

headerSticky();
variantSelect();
productCarousel();

document.addEventListener('DOMContentLoaded', initLazySections);

smoothRefresh();
