export function search() {
  const DEBOUNCE_MS = 220;

  const debounce = (fn, ms = DEBOUNCE_MS) => {
    let t;
    return function (...args) {
      const ctx = this;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(ctx, args), ms);
    };
  };

  function register(Alpine) {
    if (Alpine && Alpine.store && Alpine.store('search')) return;

    Alpine.store('search', {
      isOpen: false,
      isLoading: false,
      query: '',
      html: '',
      error: '',
      limit: 8,
      _overlayEl: null,
      _overlayHandler: null,

      // ⬇️ NEW: таймер для затримки появи overlay
      _overlayTimer: null,

      open() {
        this.isOpen = true;
        document.body.classList.add('no-scroll');

        // підʼєднуємо overlay
        if (!this._overlayEl) this._overlayEl = document.querySelector('.l-overlay');

        // ⬇️ NEW: скидаємо таймер (на випадок швидкого toggle)
        if (this._overlayTimer) {
          clearTimeout(this._overlayTimer);
          this._overlayTimer = null;
        }

        // ⬇️ NEW: ховаємо overlay одразу (навіть якщо display:block ставиться одразу)
        if (this._overlayEl) {
          this._overlayEl.style.transition = 'opacity 250ms ease';
          this._overlayEl.style.opacity = '0';
          this._overlayEl.style.pointerEvents = 'none';
        }

        // підʼєднуємо клік по overlay для закриття
        if (this._overlayEl && !this._overlayHandler) {
          this._overlayHandler = () => this.close();
          this._overlayEl.addEventListener('click', this._overlayHandler, { passive: true });
        }

        // ⬇️ NEW: показуємо overlay через 0.5 сек
        this._overlayTimer = setTimeout(() => {
          if (!this.isOpen || !this._overlayEl) return;
          this._overlayEl.style.opacity = '1';
          this._overlayEl.style.pointerEvents = 'auto';
        }, 210);

        Alpine.nextTick(() => {
          const input = document.getElementById('predictive-search-input');
          if (input) input.focus();
        });
      },

      close() {
        this.isOpen = false;
        document.body.classList.remove('no-scroll');
        this.query = '';
        this.html = '';
        this.error = '';

        // ⬇️ NEW: скидаємо таймер
        if (this._overlayTimer) {
          clearTimeout(this._overlayTimer);
          this._overlayTimer = null;
        }

        // ⬇️ NEW: ховаємо overlay одразу
        if (this._overlayEl) {
          this._overlayEl.style.opacity = '0';
          this._overlayEl.style.pointerEvents = 'none';
        }

        // знімаємо слухач, щоб не плодити їх між відкриттями
        if (this._overlayEl && this._overlayHandler) {
          this._overlayEl.removeEventListener('click', this._overlayHandler);
          this._overlayHandler = null;
        }
      },

      toggle() { this.isOpen ? this.close() : this.open(); },

      onInput: debounce(function () {
        const q = this.query.trim();
        if (!q) { this.html = ''; return; }
        this.fetchPredictive(q);
      }),

      fetchPredictive(q) {
        this.isLoading = true;
        this.error = '';

        const base = window.routes.predictive_search_url;
        // якщо вже додали колекції — поміняй "product" на "product,collection"
        const htmlUrl = `${base}?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=${this.limit}&section_id=predictive-search`;
        const jsonUrl = `${base}.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=${this.limit}`;

        const toCard = (p) => {
          const price = (p.price_min / 100).toLocaleString(undefined, { style: 'currency', currency: p.currency || 'GBP' });
          const img = p.image || (p.images && p.images[0]) || '';
          return `
              <a href="${p.url}" class="s-card" style="display:block;padding:12px;border:1px solid #eee;border-radius:12px;">
                <div style="aspect-ratio:1/1;overflow:hidden;border-radius:8px;background:#fafafa;display:flex;align-items:center;justify-content:center;">
                  ${img ? `<img src="${img}" alt="${p.title}" loading="lazy" style="max-width:100%;max-height:100%;object-fit:contain;">` : ''}
                </div>
                <div style="margin-top:8px;">
                  <div style="font-size:14px;line-height:1.3;">${p.title}</div>
                  <div style="margin-top:4px;font-size:14px;color:#474747;">${price}</div>
                </div>
              </a>
            `;
        };

        const renderFromJson = (data) => {
          const items = (data?.resources?.results?.products || []).slice(0, this.limit);
          if (!items.length) {
            this.html = `<div class="ps-empty" style="padding:24px 0;color:#777;">No results for “${q}”.</div>`;
            return;
          }
          this.html = `<div class="predictive-grid" data-fallback>${items.map(toCard).join('')}</div>`;
        };

        fetch(htmlUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
          .then(r => {
            if (!r.ok) throw new Error(`section_${r.status}`);
            return r.text();
          })
          .then(html => {
            if (html.includes('ps-empty')) {
              return fetch(jsonUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then(r => r.ok ? r.json() : Promise.reject(new Error('json_failed')))
                .then(data => { renderFromJson(data); });
            }
            this.html = html;
          })
          .catch(() => {
            return fetch(jsonUrl, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
              .then(r => r.ok ? r.json() : Promise.reject(new Error('json_failed')))
              .then(data => { renderFromJson(data); })
              .catch(() => { this.error = 'Failed to load predictive search'; });
          })
          .finally(() => { this.isLoading = false; });
      },

      submitForm() {
        const q = this.query.trim();
        if (!q) return;
        window.location.href = `/search?q=${encodeURIComponent(q)}`;
      },
    });
  }

  if (window.Alpine) register(window.Alpine);
  document.addEventListener('alpine:init', () => register(window.Alpine));
}
