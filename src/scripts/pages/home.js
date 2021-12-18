if (document.querySelector('.home-root')) {
  let details = document.querySelector('.section9');

  window.addEventListener('hashchange', () => {
    if (location.hash.startsWith('#ref-') && !details.open) {
      details.open = true;
      document.getElementById(location.hash.substring(1)).scrollIntoView();
    }
  });
}
