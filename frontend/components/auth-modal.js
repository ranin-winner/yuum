// assets/store-auth.js
export function mountAuthStore() {
    let lastActiveEl = null;
    const getModalEl = () => document.getElementById('authModal');
  
    // stage ref for height animation
    let stageEl = null;
    const setStageHeight = (panelName) => {
      if (!stageEl) return;
      // знайти активну панель і поставити висоту під її контент
      const panel = stageEl.querySelector(`[data-panel="${panelName}"]`);
      if (!panel) return;
      // тимчасово зробимо її видимою для виміру
      const prev = panel.style.visibility;
      panel.style.visibility = 'hidden';
      panel.style.display = 'block';
      panel.style.position = 'static';
      const h = panel.offsetHeight;
      panel.style.visibility = prev || '';
      panel.style.display = '';
      panel.style.position = '';
      stageEl.style.height = h + 'px';
    };
  
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
        dir: 'forward',          // forward | back
        history: ['login'],      // стек для кнопки назад
        canGoBack: false,
        setStageEl(el) { stageEl = el; setStageHeight(this.panel); },
  
        open(panel = 'login') {
          this.panel = panel;
          this.history = [panel];
          this.canGoBack = false;
          this.dir = 'forward';
          this.isOpen = true;
  
          lastActiveEl = document.activeElement;
          document.body.classList.add('no-scroll');
  
          const m = getModalEl();
          if (m) {
            m.removeAttribute('inert');
            m.setAttribute('aria-hidden', 'false');
            // виставити висоту сцени
            setStageHeight(panel);
            queueMicrotask(() => {
              m.querySelector('[autofocus], input, button, [tabindex]:not([tabindex="-1"])')?.focus();
            });
          }
          getInertTargets().forEach(el => el.setAttribute('inert', ''));
        },
  
        switch(panel, direction = 'forward') {
          if (panel === this.panel) return;
          this.dir = direction === 'back' ? 'back' : 'forward';
          if (this.dir === 'forward') this.history.push(panel);
          this.canGoBack = this.history.length > 1;
          // анімуємо висоту під цільову панель
          setStageHeight(panel);
          this.panel = panel;
        },
  
        back() {
          if (this.history.length <= 1) return;
          this.dir = 'back';
          this.history.pop(); // прибрати поточну
          const prev = this.history[this.history.length - 1] || 'login';
          this.canGoBack = this.history.length > 1;
          setStageHeight(prev);
          this.panel = prev;
        },
  
        afterTransition() {
          // після кожного переходу синхронізуємо висоту на випадок зміни контенту
          setStageHeight(this.panel);
        },
  
        close() {
          const m = getModalEl();
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
  