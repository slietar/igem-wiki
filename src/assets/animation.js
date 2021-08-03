for (let el of document.querySelectorAll('.animated')) {
  let value = false;

  let observer = new IntersectionObserver((entries) => {
    let ratio = entries[0].intersectionRatio;
    let past = window.pageYOffset > el.offsetTop;

    // el.classList.toggle('_visible', ratio > 0.4 || window.pageYOffset > el.offsetTop);

    /* if (!value && ratio > 0.4) {
      value = true;
    } if (value && ratio < 0.1 && !past) {
      value = false;
    } */

    // value = (value || ratio > 0.4) && (ratio > 0.1 || past);
    value = (value && (ratio > 0.1 || past)) || ratio > 0.4;
    el.classList.toggle('_visible', value);
  }, { threshold: [0.1, 0.4] });

  observer.observe(el);
}


let target = document.querySelector('.section2');
let index = 0;

for (let el of document.querySelectorAll('.section2 .links a')) {
  let i = index++;

  el.addEventListener('mouseenter', () => {
    target.setAttribute('data-image', i + 1);
  });

  el.addEventListener('mouseleave', () => {
    target.setAttribute('data-image', 0);
  });
}
