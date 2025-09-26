import './styles/main.scss';

import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';
import './components/alp-cart';
import './components/alp-build-box';

window.Alpine = Alpine;

Alpine.plugin(persist);
Alpine.start();

import { counter } from './components/counter';
import { variantSelect } from './components/variant-select';
import { headerSticky } from './components/header';

headerSticky();
variantSelect();
