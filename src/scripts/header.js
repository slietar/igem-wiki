let root = document.querySelector('#mw-content-text') || document.body;


let li = document.querySelectorAll('.header-nav > ul > li');
let activeIndex = null;

let update = () => {
  Array.from(li).forEach((el, index) => {
    el.classList.toggle('_active', index === activeIndex);
  });

  root.classList.toggle('_navactive', activeIndex !== null);

  if (activeIndex !== null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

Array.from(li).forEach((el, index) => {
  let a = el.querySelector(':scope > a:not(:only-child)');

  if (a) {
    a.addEventListener('click', (event) => {
      event.preventDefault();

      activeIndex = activeIndex !== index ? index : null;
      update();
    });
  }
});

document.querySelector('.overlay').addEventListener('click', () => {
  activeIndex = null;
  update();
});

document.querySelector('.header-menu').addEventListener('click', () => {
  document.querySelector('.header').classList.toggle('_open');
  root.classList.toggle('_navopen');
});


// Hide menu if the user is scrolling downwards
// window.scrollTo() would trigger this if we also accepted upwards scrolling

let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  let scrollY = window.scrollY;

  if (activeIndex !== null) {
    if (scrollY > lastScrollY) {
      activeIndex = null;
      update();
    }
  }

  lastScrollY = Math.max(0, scrollY);
});
