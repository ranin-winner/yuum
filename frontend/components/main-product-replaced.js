import Alpine from 'alpinejs';

function readProductJSON(root) {
  const tag = root.querySelector('script[type="application/json"][data-product-json]');
  if (!tag) return null;
  try { return JSON.parse(tag.textContent.trim()); } catch { return null; }
}

Alpine.data('productCard', (rootEl) => ({
  rootEl,
  sectionId: null,
  mainProduct: {},
  quantity: 1,
  sliderInitialized: false,
  sliderLoading: false,

  init() {
    this.rootEl = this.rootEl || this.$root || this.$el;
    this.sectionId = this.rootEl?.dataset?.sectionId || null;
    this.mainProduct = readProductJSON(this.rootEl) || {};

  },

  getFirstVariant() {
    const el = this.rootEl || this.$root || this.$el;
    return (el?.dataset?.firstVariant || '').trim();
  },

  addToCartPDP(qty = 1) {
    // 1) стабільно беремо variantId з кореня компонента
    const root = this.rootEl || this.$root || this.$el;
    const variantId = (root?.dataset?.firstVariant || '').trim();
  
    // 2) нормалізуємо кількість
    const quantity = Math.max(1, parseInt(qty, 10) || 1);
  
    if (!variantId) {
      console.error('[productCard] No variantId on root data-first-variant');
      return;
    }
  
    // 3) основний шлях — через cart store із правильною сигнатурою
    const store = window.Alpine?.store('cart');
    if (store && typeof store.addToCart === 'function') {
      try {
        const res = store.addToCart({ variantId, quantity, properties: {} }, true);
        if (res && typeof res.then === 'function') {
          res.finally(() => { this.quantity = 1; });
        } else {
          this.quantity = 1;
        }
        return;
      } catch (e) {
        console.warn('[productCard] cart store addToCart failed, using AJAX fallback', e);
      }
    }
  
    // 4) fallback — офіційний Shopify AJAX API (items[])
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        items: [{ id: variantId, quantity }],
      }),
    })
      .then(r => (r.ok ? r.json() : r.json().then(err => Promise.reject(err))))
      .then((data) => {
        document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
      })
      .catch((err) => console.error('[productCard] /cart/add.js error', err))
      .finally(() => { this.quantity = 1; });
  },
}));
