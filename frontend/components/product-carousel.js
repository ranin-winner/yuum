// Мінімальна ініціалізація продуктового слайдера
export function productCarousel() {
    const section = document.querySelector('.b-product__gallery');
    if (!section) return;
  
    const container    = section.querySelector('.swiper-container');
    const nextBtn      = section.querySelector('.swiper-button-next');
    const prevBtn      = section.querySelector('.swiper-button-prev');
    const paginationEl = section.querySelector('.swiper-pagination');
  
    if (!container || container.swiper) return;
  
    new Swiper(container, {
      loop: false,
      slidesPerView: 1,
      spaceBetween: 0,
  
      ...(nextBtn && prevBtn ? {
        navigation: { nextEl: nextBtn, prevEl: prevBtn }
      } : {}),
  
      ...(paginationEl ? {
        pagination: {
          el: paginationEl,
          type: 'progressbar' // ось це ключове
        }
      } : {}),
    });
  }
  