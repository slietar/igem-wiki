if (document.querySelector('.hp-contents')) {
  let root = document.querySelector('.desc-root');


  let hp;

  let update = (value) => {
    hp = value;
    root.dataset.hpValue = value;
  };

  let updateHash = () => {
    if (location.hash.startsWith('#hp-')) {
      update(location.hash.substring('#hp-'.length));
      // history.replaceState('', document.title, window.location.pathname + window.location.search);

      return true;
    }
  };

  window.addEventListener('hashchange', () => {
    updateHash();
  });

  if (!updateHash()) {
    update('silver');
  }
}
