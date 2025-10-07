document.addEventListener('alpine:init', () => {
    Alpine.data('productCard', (sectionId, product) => ({
  
      // ---------- STATE ----------
      sectionId,
      mainProduct: product || {},
  
      mode: 'one-time',
      showSubscription: false,
  
      discount: 0,
      regularPrice: 0,
      discountedPrice: 0,
      actualPrice: 0,
  
      sellingPlanGroups: undefined,
      sellingPlanId: null,
      sellingPlansMap: [],
      selectedPlanId: null,
      selectedPlan: {},
  
      isLoading: false,
      sliderLoading: false,
      swiper: null,
  
      // ---------- LIFECYCLE ----------
      init() {
        try { this.bootstrapModeFromDOM(); } catch(e) { /* noop */ }
        try { this.updateActualPrice(); } catch(e) { /* noop */ }
  
        // важливо інітити після першого рендера
        this.$nextTick(() => this.initProductSwiper());
      },
  
      destroy() {
        this.destroyProductSwiper();
      },
  
      // ---------- HELPERS ----------
      // Працюємо тільки всередині поточного Alpine-компонента
      $q(selector) { return this.$root ? this.$root.querySelector(selector) : null; }
      ,
  
      getSliderWrapper() {
        return this.$q('[data-role="main-product-slider"]');
      },
  
      // ---------- SWIPER ----------
      initProductSwiper() {
        try {
          this.destroyProductSwiper();
  
          const wrapper = this.getSliderWrapper();
          if (!wrapper) return;
          if (!window.Swiper) { console.error('[productCard] Swiper is not available'); return; }
  
          const container  = wrapper.querySelector('[data-el="container"]');
          const nextEl     = wrapper.querySelector('[data-el="next"]');
          const prevEl     = wrapper.querySelector('[data-el="prev"]');
          const pagination = wrapper.querySelector('[data-el="pagination"]');
  
          if (!container) return;
  
          // Підтримка і старої, і нової розмітки (на всяк випадок)
          // Якщо контейнер має клас .swiper-container — додамо .swiper для стилів Swiper v8+
          if (container.classList.contains('swiper-container')) {
            container.classList.add('swiper');
          }
  
          this.swiper = new window.Swiper(container, {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: false,
            watchOverflow: true,
  
            navigation: { nextEl, prevEl },
            pagination: { el: pagination, clickable: true },
  
            observer: true,
            observeParents: true,
          });
        } catch (e) {
          console.error('[productCard] initProductSwiper failed:', e);
        }
      },
  
      destroyProductSwiper() {
        try {
          if (this.swiper && typeof this.swiper.destroy === 'function') {
            this.swiper.destroy(true, true);
          }
        } finally {
          this.swiper = null;
        }
      },
  
      // ---------- AJAX ПІДМІНА СЕКЦІЇ ----------
      loadProduct(productHandle) {
        if (!productHandle) return;
  
        const sectionUrl = `/products/${productHandle}?sections=${this.sectionId}`;
        const jsonUrl    = `/products/${productHandle}.js`;
  
        this.isLoading = true;
  
        fetch(sectionUrl)
          .then((r) => { if (!r.ok) throw new Error('[productCard] Section fetch failed'); return r.json(); })
          .then((payload) => {
            const html = payload?.[this.sectionId];
            if (!html) throw new Error('[productCard] Section HTML not found');
  
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
  
            // Важливо: знайди новий корінь секції саме всередині $root-контексту
            const fresh = tmp.querySelector('#MainProduct-' + this.sectionId);
            if (fresh && this.$refs.productCardRef) {
              this.$refs.productCardRef.replaceWith(fresh);
              // Оновлюємо $root посилання на новий DOM вузол
              this.$root = fresh;
              this.$nextTick(() => this.initProductSwiper());
            }
  
            return fetch(jsonUrl);
          })
          .then((r) => { if (!r?.ok) throw new Error('[productCard] Product JSON fetch failed'); return r.json(); })
          .then((productData) => {
            this.initNewProduct(productData);
            window.history.pushState({ urlPath: productHandle }, '', productHandle);
          })
          .catch((e) => console.error(e))
          .finally(() => { this.isLoading = false; });
      },
  
      initNewProduct(productData) {
        if (!productData || !productData.id) return;
        this.mainProduct = productData;
        this.updateActualPrice();
        this.$nextTick(() => this.initProductSwiper());
      },
  
      // ---------- ВАРІАНТИ/ЦІНИ ----------
      updateActualPrice() {
        const variant = this.getSelectedVariant();
        if (!variant) return;
  
        this.regularPrice    = Number(variant.compare_at_price || variant.price || 0);
        this.discountedPrice = Number(variant.price || 0);
  
        if (this.showSubscription && this.selectedPlan && this.selectedPlan.discount) {
          const pct = Number(this.selectedPlan.discount) || 0;
          this.actualPrice = Math.round(this.discountedPrice * (1 - pct / 100));
        } else {
          this.actualPrice = this.discountedPrice;
        }
      },
  
      getSelectedVariant() {
        const variants = this.mainProduct?.variants || [];
        if (!variants.length) return null;
  
        const input = document.querySelector(
          '[name="id"][type="hidden"], [name="id"][type="radio"]:checked'
        );
        if (input && input.value) {
          const found = variants.find(v => String(v.id) === String(input.value));
          if (found) return found;
        }
        const fav = variants.find(v => v.available);
        return fav || variants[0];
      },
  
      onVariantChange() {
        try { this.updateActualPrice(); } catch(e) { /* noop */ }
      },
  
      // ---------- ПІДПИСКА ----------
      bootstrapModeFromDOM() {
        const el = document.querySelector('[data-subscription-tabs]');
        if (!el) { this.mode = 'one-time'; this.showSubscription = false; return; }
  
        const t1 = el.getAttribute('data-tab1-selected');
        const t2 = el.getAttribute('data-tab2-selected');
        const m  = el.getAttribute('data-tab-selected');
  
        if (t1 != null) this.tab1Selected = JSON.parse(t1);
        if (t2 != null) this.tab2Selected = JSON.parse(t2);
        if (m) this.mode = m;
  
        this.showSubscription = this.mode === 'subscribe';
      },
  
      selectPlan(planId) {
        this.selectedPlanId = planId || null;
        this.selectedPlan = (this.sellingPlansMap || []).find(p => String(p.id) === String(planId)) || {};
        this.showSubscription = !!this.selectedPlanId;
        this.updateActualPrice();
      },
  
      toggleSubscription(force) {
        if (typeof force === 'boolean') this.showSubscription = force;
        else this.showSubscription = !this.showSubscription;
        this.updateActualPrice();
      },
    }));
  });
  