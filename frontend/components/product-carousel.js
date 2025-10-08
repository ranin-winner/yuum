// product-carousel.js
// Ініціалізація головного слайдера(ів) продукту

// 1) Підстрахуємо Alpine.store
(function ensureAlpineStore() {
    const setStore = () => {
      if (!window.Alpine) return
      if (!Alpine.store('ui')) Alpine.store('ui', {})
      if (typeof Alpine.store('ui').sliderLoading === 'undefined') {
        Alpine.store('ui').sliderLoading = true
      }
    }
    // якщо Alpine вже є — створимо стор зараз
    try { setStore() } catch (e) {}
    // і на випадок, якщо Alpine інітнеться пізніше
    document.addEventListener('alpine:init', setStore, { once: true })
  })()
  
  // 2) Хелпери для увімк/вимк стану лоадера (не кидають помилок, якщо Alpine відсутній)
  function setSliderLoading(val) {
    try {
      if (window.Alpine && Alpine.store('ui')) Alpine.store('ui').sliderLoading = !!val
    } catch (e) {}
  }
  
  // 3) Основна функція
  export function productCarousel(root = document) {
    // шукаємо секції з головним слайдером
    const sections = Array.from(root.querySelectorAll('.b-product__gallery'))
    if (!sections.length) return []
  
    const swipers = []
  
    sections.forEach((section) => {
      const container    = section.querySelector('.swiper-container, .swiper') // залежить від розмітки
      const nextBtn      = section.querySelector('.swiper-button-next')
      const prevBtn      = section.querySelector('.swiper-button-prev')
      const paginationEl = section.querySelector('.swiper-pagination')
  
      if (!container) return
      if (container.swiper) { swipers.push(container.swiper); return } // уже інітнуто
  
      // Увімкнути лоадер перед інітом
      setSliderLoading(true)
  
      const setLoaded = () => setSliderLoading(false)
  
      const swiper = new Swiper(container, {
        // базові опції — підлаштуй під свою тему
        loop: false,
        slidesPerView: 1,
        spaceBetween: 0,
        preloadImages: true,
        watchSlidesProgress: true,
  
        ...(nextBtn && prevBtn ? {
          navigation: { nextEl: nextBtn, prevEl: prevBtn }
        } : {}),
  
        ...(paginationEl ? {
          pagination: { el: paginationEl, type: 'progressbar' }
        } : {}),
  
        on: {
          init() { setLoaded() },
          imagesReady() { setLoaded() }
        }
      })
  
      // Fallback: якщо події не спрацювали (нестандартні зображення тощо)
      if (!swiper.initialized) {
        requestAnimationFrame(setLoaded)
      }
  
      swipers.push(swiper)
    })
  
    return swipers
  }
  
  // опціонально — дефолтний експорт
  export default productCarousel
  