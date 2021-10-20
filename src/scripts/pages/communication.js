import Splide from '@splidejs/splide';

for (let el of document.querySelectorAll('.splide')) {
  new Splide(el, {
    height: 500
  }).mount();
}
