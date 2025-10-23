// product-carousel.js

(function ensureAlpineStore() {
    const setStore = () => {
      if (!window.Alpine) return
      if (!Alpine.store('ui')) Alpine.store('ui', {})
      if (typeof Alpine.store('ui').sliderLoading === 'undefined') {
        Alpine.store('ui').sliderLoading = true
      }
    }
    try { setStore() } catch (e) {}
    document.addEventListener('alpine:init', setStore, { once: true })
  })()
  
  // 2) Хелпер для лоадера
  function setSliderLoading(val) {
    try {
      if (window.Alpine && Alpine.store('ui')) Alpine.store('ui').sliderLoading = !!val
    } catch (e) {}
  }
  
  // 3) Утиліти
  const isMobile = () => window.matchMedia('(max-width: 767.98px)').matches
  
  const hardHide = (el) => {
    if (!el) return
    el.classList.add('hidden')
    el.setAttribute?.('aria-hidden', 'true')
    el.setAttribute?.('tabindex', '-1')
    el.style.display = 'none'
  }
  const hardShow = (el) => {
    if (!el) return
    el.classList.remove('hidden')
    el.removeAttribute?.('aria-hidden')
    el.removeAttribute?.('tabindex')
    el.style.display = ''
  }
  
  function countSlides(scope) {
    // рахуємо лише реальні слайди без клонів
    return scope.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)').length
  }
  
  // 4) Головна функція
  export function productCarousel(root = document) {
    const sections = Array.from(
      root.querySelectorAll('.b-product__gallery, .product-gallery, [data-product-gallery]')
    )
    if (!sections.length) return []
  
    const swipers = []
  
    sections.forEach((section) => {
      const container    = section.querySelector('.swiper, .swiper-container') || section
      const nextBtn      = section.querySelector('.swiper-button-next')
      const prevBtn      = section.querySelector('.swiper-button-prev')
      const paginationEl = section.querySelector('.swiper-pagination')
  
      // якщо немає контейнера — скіпаємо
      if (!container) return
  
      // якщо вже інітнуто — повертаємо існуючий
      if (container.swiper) { swipers.push(container.swiper); return }
  
      // функція ініціалізації Swiper (викликаємо лише коли слайдів ≥ 2)
      const initSwiper = () => {
        // лоадер
        setSliderLoading(true)
        const setLoaded = () => setSliderLoading(false)
  
        // мобайл — ховаємо кнопки ще до ініта, а модуль відключимо нижче
        const hideNav = () => { hardHide(nextBtn); hardHide(prevBtn) }
        const showNav = () => { hardShow(nextBtn); hardShow(prevBtn) }
        if (isMobile()) hideNav()
  
        const navigationAvailable = !!(nextBtn && prevBtn)
  
        const swiper = new Swiper(container, {
          loop: false,
          slidesPerView: 1,
          spaceBetween: 0,
          preloadImages: true,
          watchSlidesProgress: true,
  
          ...(navigationAvailable ? {
            navigation: {
              enabled: !isMobile(),
              nextEl: nextBtn,
              prevEl: prevBtn
            }
          } : {}),
  
          ...(paginationEl ? {
            pagination: { el: paginationEl, type: 'progressbar' }
          } : {}),
  
          on: {
            init() { setLoaded() },
            imagesReady() { setLoaded() },
            resize(sw) {
              if (!navigationAvailable || !sw.navigation) return
              const mobile = isMobile()
              sw.params.navigation.enabled = !mobile
              if (mobile) {
                sw.navigation.disable()
                hideNav()
              } else {
                sw.navigation.enable()
                showNav()
              }
            }
          }
        })
  
        if (!swiper.initialized) requestAnimationFrame(setLoaded)
  
        swipers.push(swiper)
      }
  
      // стан “один слайд”: не ініціалізуємо, жорстко ховаємо контролси
      const applySingleSlideState = () => {
        const slidesQty = countSlides(section)
        if (slidesQty <= 1) {
          hardHide(nextBtn)
          hardHide(prevBtn)
          hardHide(paginationEl)
          setSliderLoading(false)
          return true
        }
        // якщо слайдів ≥ 2 — переконаємось, що контролси не сховані (крім мобайлу)
        hardShow(nextBtn)
        hardShow(prevBtn)
        hardShow(paginationEl)
        return false
      }
  
      // якщо зараз 1 слайд — спостерігаємо, чи не додадуться інші
      if (applySingleSlideState()) {
        const mo = new MutationObserver(() => {
          if (countSlides(section) >= 2) {
            mo.disconnect()
            // повертаємо контролси і ініціалізуємо
            hardShow(nextBtn); hardShow(prevBtn); hardShow(paginationEl)
            initSwiper()
          }
        })
        mo.observe(section, { childList: true, subtree: true })
        return
      }
  
      // тут уже ≥ 2 слайдів — ініт
      initSwiper()
    })
  
    return swipers
  }
  
  // дефолтний експорт
  export default productCarousel
  