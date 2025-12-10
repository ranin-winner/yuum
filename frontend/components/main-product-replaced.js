// main-product-replaced.js
import Alpine from 'alpinejs';

// Безпечне читання JSON продукту з PDP
function readProductJSON(root) {
  if (!root || typeof root.querySelector !== 'function') return null;
  const tag = root.querySelector('script[type="application/json"][data-product-json]');
  if (!tag) return null;
  try { return JSON.parse(tag.textContent.trim()); } catch { return null; }
}

// Форматування грошей з запасним варіантом
const formatMoney = (cents, format) => {
  if (typeof window?.Shopify?.formatMoney === 'function') {
    return window.Shopify.formatMoney(cents, format || window?.theme?.moneyFormat || window?.Shopify?.money_format || '${{amount}}');
  }
  return (Number(cents || 0) / 100).toFixed(2);
};

document.addEventListener('alpine:init', () => {
  // arg може бути DOM-елементом (PDP) або об'єктом опцій (PLP)
  Alpine.data('productPDP', (arg = null) => ({
    // state
    rootEl: null,
    sectionId: null,
    mainProduct: null,

    // variant / price
    currentVariantId: null,
    _unitPriceOverride: null, // коли priceCents приходить з опцій
    productUrl: null,

    // qty
    quantity: 1,
    min: 1,
    max: null,

    // lifecycle
    init() {
      // 1) Визначаємо root і опції
      if (arg && typeof arg === 'object' && !(arg instanceof Element)) {
        // Варіант: x-data="productCard({ ... })"
        this.rootEl = this.$root || this.$el;
        if (arg.variantId) this.currentVariantId = Number(arg.variantId);
        if (arg.priceCents) this._unitPriceOverride = Number(arg.priceCents);
        if (arg.productUrl) this.productUrl = arg.productUrl;
      } else {
        // Варіант: x-data="productCard($el)"
        this.rootEl = arg || this.$root || this.$el;
      }

      this.sectionId = this.rootEl?.dataset?.sectionId || null;

      // 2) Продукт з PDP (може бути відсутнім на картках)
      this.mainProduct = readProductJSON(this.rootEl) || {};

      // 3) Variant fallback: data-first-variant -> mainProduct.variants[0]
      if (!this.currentVariantId) {
        this.currentVariantId =
          Number(this.rootEl?.dataset?.firstVariant) ||
          this.mainProduct?.variants?.[0]?.id ||
          null;
      }

      // 4) Мін/макс з data-атрибутів, якщо прокидані
      if (this.rootEl?.dataset?.min) this.min = Number(this.rootEl.dataset.min) || 1;
      if (this.rootEl?.dataset?.max) this.max = Number(this.rootEl.dataset.max) || null;

      // 5) Money format — спробуємо взяти з data-money-format (актуально для карток)
      this.moneyFormat = this.rootEl?.dataset?.moneyFormat || null;

      console.log('[productCard:init]', {
        rootIsEl: this.rootEl instanceof Element,
        sectionId: this.sectionId,
        variantId: this.currentVariantId,
        unitPriceOverride: this._unitPriceOverride,
      });
    },

    // ---- Gift card helpers (PDP) ----
    gift: {
        customAmount: '',     // введене значення (у фунтах)
        customError: '',      // повідомлення про помилку
    },
    
    // обрати варіант із чіпса
    selectVariant({ id, priceCents }) {
        this.currentVariantId = Number(id);
        this._unitPriceOverride = Number(priceCents); // для відображення ціни на кнопці
        this.gift.customAmount = '';
        this.gift.customError = '';
    },
    
    // застосувати введену суму: шукаємо відповідний варіант за ціною
    applyCustomAmount() {
        this.gift.customError = '';
        const pounds = String(this.gift.customAmount || '').trim();
        if (!pounds) return;
    
        // перетворюємо у центи; step=1 => без копійок
        const cents = Math.round(Number(pounds) * 100);
        if (!Number.isFinite(cents) || cents <= 0) {
        this.gift.customError = 'Enter a valid amount';
        return;
        }
    
        // шукаємо варіант із такою ціною
        const match = (this.mainProduct?.variants || []).find(v => Number(v.price) === cents);
        if (!match) {
        // важливо: у Shopify не можна задати довільну ціну без окремого застосунку,
        // тому не даємо додати "нестандартну" суму — просимо обрати один із номіналів
        this.gift.customError = 'Please choose one of the available amounts';
        return;
        }
    
        // знайшли відповідний варіант
        this.currentVariantId = Number(match.id);
        this._unitPriceOverride = Number(match.price);
    },
    
    // невеличкий геттер для підсвітки активного чіпса
    isActiveChip(id) {
        return Number(this.currentVariantId) === Number(id);
    },
// end gift card code  

    // aliases для сумісності з розміткою
    get qty() { return this.quantity; },

    // ціни
    get unitPriceCents() {
      if (this._unitPriceOverride != null) return this._unitPriceOverride;

      // спробуємо з mainProduct
      const v = this.mainProduct?.variants?.find(x => x.id === this.currentVariantId);
      if (v?.price != null) return Number(v.price);

      if (this.mainProduct?.price != null) return Number(this.mainProduct.price);

      // останній шанс — data-price-cents на root
      if (this.rootEl?.dataset?.priceCents) return Number(this.rootEl.dataset.priceCents);

      return 0;
    },
    get totalPriceCents() {
      return (this.unitPriceCents || 0) * (Number(this.quantity) || 1);
    },
    get unitPrice() {
      return formatMoney(this.unitPriceCents, this.moneyFormat);
    },
    get totalPrice() {
      return formatMoney(this.totalPriceCents, this.moneyFormat);
    },
    get priceLabel() {
      return `${this.totalPrice} · ADD TO CART`;
    },

    // додавання в кошик
    async addToCartPDP(qty = 1) {
        const variantId = Number(this.currentVariantId || this.rootEl?.dataset?.firstVariant);
        const quantity = Number(qty) || 1;
        if (!variantId) { console.warn('[productCard] Missing variant id'); return; }
      
        const cart = Alpine.store('cart');
      
        // 1) Якщо у стора є "правильний" метод — використовуємо його (він сам відкриє дроуер)
        if (cart?.addToCart && typeof cart.addToCart === 'function') {
          try {
            await cart.addToCart({ variantId, quantity });
            this.quantity = 1;
            return;
          } catch (e) {
            console.debug('[productCard] cart.addToCart failed, fallback to /cart/add.js', e);
          }
        }
      
        // 2) Альтернативний метод, якщо в сторі він так називається
        if (cart?.add && typeof cart.add === 'function') {
          try {
            await cart.add({ id: variantId, quantity });
            // на деяких реалізаціях .add НЕ відкриває дроуер — відкриємо вручну:
            if (cart?.open) cart.open();
            else document.dispatchEvent(new CustomEvent('cart:open'));
            this.quantity = 1;
            return;
          } catch (e) {
            console.debug('[productCard] cart.add failed, fallback to /cart/add.js', e);
          }
        }
      
        // 3) Офіційний Shopify fallback
        try {
          const resp = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ items: [{ id: variantId, quantity }] }),
          });
          const data = await (resp.ok ? resp.json() : resp.json().then(err => Promise.reject(err)));
      
          // повідомляємо системі оновлення кошика
          document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
      
          // пробуємо відкрити дроуер стандартними шляхами
          if (cart?.open) cart.open();
          else document.dispatchEvent(new CustomEvent('cart:open'));
      
          // якщо у стора є метод оновлення/перезавантаження — дерни й його
          if (cart?.refresh) cart.refresh();
          if (cart?.fetch) await cart.fetch();
        } catch (err) {
          console.error('[productCard] /cart/add.js error', err);
        } finally {
          this.quantity = 1;
        }
      },
      
  }));
});
