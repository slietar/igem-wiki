if (document.querySelector('.hp-popup-root')) {
  window.addEventListener('hashchange', () => {
    let popup = location.hash.startsWith('#popup-');
    document.body.classList.toggle('_popup', popup);

    if (location.hash === '#close') {
      history.replaceState('', document.title, location.pathname + location.search);
    }
  });
}
