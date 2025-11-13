export function headerSticky() {
  const header = document.getElementById('id_header');
  const mainWrapper = document.querySelector('#l-main');

  const headerHeight = header.offsetHeight;

  // На головній сторінці додаємо padding до body щоб контент не залазив під fixed header
  if (document.body.classList.contains('template-index')) {
    document.body.style.paddingTop = `${headerHeight}px`;
  }

  const sticky = 100; // Початок скролу для sticky

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > sticky) {
      header.classList.add('m-sticky');

      // На інших сторінках додаємо padding до main wrapper
      if (!document.body.classList.contains('template-index')) {
        mainWrapper.style.paddingTop = `${headerHeight}px`;
      }
    } else {
      header.classList.remove('m-sticky');
      if (!document.body.classList.contains('template-index')) {
        mainWrapper.style.paddingTop = '0px';
      }
    }
  });
}
