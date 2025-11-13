export function headerSticky() {
  const header = document.getElementById('id_header');

  // Встановлюємо фіксовану висоту для body padding
  const headerHeight = 80; // твоя висота header без промо-бара

  if (document.body.classList.contains('template-index') || document.body.classList.contains('template-page')) {
    document.body.style.paddingTop = `${headerHeight}px`;
  }

  const sticky = 100;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > sticky) {
      header.classList.add('m-sticky');
    } else {
      header.classList.remove('m-sticky');
    }
  });
}
