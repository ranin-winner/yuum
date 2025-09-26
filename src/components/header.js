export function headerSticky() {
  const header = document.getElementById('id_header');
  const sticky = header.offsetTop;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > sticky) {
      header.classList.add('m-sticky');
    } else {
      header.classList.remove('m-sticky');
    }
  });
}
