// frontend/components/lazy-sections.js
import { smoothRefresh } from './smooth-scroll-init';

const SELECTOR = '.lazy-section';
const CONCURRENCY = 2;

let queue = [];
let active = 0;
let io;

function onInserted(root) {
  // даємо DOM перемалюватися, тоді рефрешимо тригери/висоти
  setTimeout(() => smoothRefresh(), 50);
  root.dispatchEvent(new CustomEvent('lazy:section:loaded', { bubbles: true }));
}

async function fetchSection(el) {
  const id  = el.getAttribute('data-lazy-section');
  const src = el.getAttribute('data-src');
  if (!id || !src) return;

  el.setAttribute('data-loading', '1');

  try {
    const res = await fetch(src, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    el.innerHTML = html;
    el.removeAttribute('data-loading');
    el.setAttribute('data-loaded', '1');
    onInserted(el);
  } catch (err) {
    console.error('[lazy-section] load error:', err);
    el.setAttribute('data-error', '1');
    el.innerHTML = `
      <div class="lazy-error">
        <p>Не вдалося завантажити блок.</p>
        <button type="button" class="lazy-retry">Повторити</button>
      </div>`;
    el.querySelector('.lazy-retry')?.addEventListener('click', () => {
      el.removeAttribute('data-error');
      el.innerHTML = `<div class="lazy-skeleton" aria-hidden="true"></div>`;
      enqueue(el); pump();
    });
  }
}

function pump() {
  if (active >= CONCURRENCY) return;
  const next = queue.shift();
  if (!next) return;
  active++;
  fetchSection(next).finally(() => { active--; pump(); });
}

function enqueue(el) {
  if (el.hasAttribute('data-loaded') || el.hasAttribute('data-loading')) return;
  queue.push(el);
}

export function initLazySections() {
  io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        enqueue(entry.target);
        pump();
        io.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '200px 0px 200px 0px',
    threshold: 0
  });

  document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
}

export function lazySectionsRefresh() {
  document
    .querySelectorAll(`${SELECTOR}:not([data-loaded]):not([data-loading])`)
    .forEach((el) => io.observe(el));
}
