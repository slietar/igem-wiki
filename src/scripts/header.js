let active = null;

let li = document.querySelectorAll('.header-nav > ul > li');

let update = () => {
  Array.from(li).forEach((el, index) => {
    el.classList.toggle('_active', index === active);
  });

  document.body.classList.toggle('_navactive', active !== null);
};

Array.from(li).forEach((el, index) => {
  let a = el.querySelector(':scope > a:not(:only-child)');

  if (a) {
    a.addEventListener('click', (event) => {
      event.preventDefault();

      active = active !== index ? index : null;
      update();
    });
  }
});

document.querySelector('.overlay').addEventListener('click', () => {
  active = null;
  update();
});

document.querySelector('.header-menu').addEventListener('click', () => {
  document.querySelector('.header').classList.toggle('_open');
  document.body.classList.toggle('_navopen');
});
