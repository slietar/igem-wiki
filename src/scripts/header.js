let li = document.querySelectorAll('.header-nav > ul > li');
let activeIndex = null;

let update = () => {
  Array.from(li).forEach((el, index) => {
    el.classList.toggle('_active', index === activeIndex);
  });

  document.body.classList.toggle('_navactive', activeIndex !== null);

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
  document.body.classList.toggle('_navopen');
});


// Hide menu if the user is scrolling downwards
// window.scrollTo() would trigger this if we also accepted upwards scrolling

let lastScrollTop = document.body.scrollTop;

window.addEventListener('scroll', () => {
  let scrollTop = document.body.scrollTop;

  if (activeIndex !== null) {
    if (scrollTop > lastScrollTop) {
      activeIndex = null;
      update();
    }
  }

  lastScrollTop = Math.max(0, scrollTop);
});
