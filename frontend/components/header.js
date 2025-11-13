export function headerSticky() {
  const header = document.getElementById('id_header');
  const mainWrapper = document.querySelector('#l-main');
  const headerHeight = header.offsetHeight;

  // Сторінки з fixed header
  const fixedHeaderPages = ['template-index', 'template-page'];
  const isFixedHeaderPage = fixedHeaderPages.some(className => document.body.classList.contains(className));

  // На сторінках з fixed header додаємо padding до body
  if (isFixedHeaderPage) {
    document.body.style.paddingTop = `${headerHeight}px`;
  }

  const sticky = 100;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > sticky) {
      header.classList.add('m-sticky');

      // На інших сторінках додаємо padding до main wrapper
      if (!isFixedHeaderPage) {
        mainWrapper.style.paddingTop = `${headerHeight}px`;
      }
    } else {
      header.classList.remove('m-sticky');
      if (!isFixedHeaderPage) {
        mainWrapper.style.paddingTop = '0px';
      }
    }
  });
}

