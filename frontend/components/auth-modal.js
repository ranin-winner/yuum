// assets/store-auth.js
export function mountAuthStore() {
    let lastActiveEl = null;
  
    // Повертає елемент модалки (раптом вона рендериться пізніше)
    const getModalEl = () => document.getElementById('authModal');
  
    // Обираємо елементи, яким ставимо inert, ВИКЛЮЧАЮЧИ предка модалки
    const getInertTargets = () => {
      const modalEl = getModalEl();
      const candidates = Array.from(document.querySelectorAll('header, #l-main, footer'));
      return candidates.filter(el => !(modalEl && el.contains(modalEl)));
    };
  
    function register() {
      if (window.Alpine && Alpine.store('auth')) return;
  
      const api = {
        isOpen: false,
        panel: 'login',
  
        open(panel = 'login') {
          this.panel = panel;
          this.isOpen = true;
  
          lastActiveEl = document.activeElement;
          document.body.classList.add('no-scroll');
  
          const m = getModalEl();
          if (m) {
            m.removeAttribute('inert');
            m.setAttribute('aria-hidden', 'false');
            queueMicrotask(() => {
              m.querySelector('[autofocus], input, button, [tabindex]:not([tabindex="-1"])')?.focus();
            });
          }
  
          getInertTargets().forEach(el => el.setAttribute('inert', ''));
        },
  
        switch(panel) {
          this.panel = panel;
          // опційно автофокус на перше поле кожної панелі
          const m = getModalEl();
          if (m) {
            queueMicrotask(() => {
              m.querySelector('[data-panel="'+ panel +'"] [autofocus], [data-panel="'+ panel +'"] input, [data-panel="'+ panel +'"] button')?.focus?.();
            });
          }
        },
  
        close() {
          const m = getModalEl();
  
          // знімаємо фокус із елемента всередині модалки перед aria-hidden
          if (m && m.contains(document.activeElement)) {
            (document.activeElement instanceof HTMLElement) && document.activeElement.blur();
          }
  
          queueMicrotask(() => { try { lastActiveEl?.focus?.(); } catch (e) {} });
  
          this.isOpen = false;
          document.body.classList.remove('no-scroll');
  
          if (m) {
            m.setAttribute('aria-hidden', 'true');
            m.removeAttribute('inert');
          }
  
          getInertTargets().forEach(el => el.removeAttribute('inert'));
        },
  
        toggle(v) {
          if (typeof v === 'boolean') v ? this.open() : this.close();
          else this.isOpen ? this.close() : this.open();
        }
      };
  
      if (window.Alpine) Alpine.store('auth', api);
  
      // на випадок автівідкриття з шаблонів
      window.__initAuthStore = () => {
        if (!window.Alpine) return;
        if (!Alpine.store('auth')) Alpine.store('auth', api);
        return Alpine.store('auth');
      };
    }
  
    if (!window.Alpine) {
      document.addEventListener('alpine:init', register, { once: true });
    } else {
      register();
    }
  }
  
  