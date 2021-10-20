if (document.querySelector('.hp-contents')) {
  let root = document.querySelector('.desc-root');


  let hp;

  let update = (value) => {
    hp = value;
    root.dataset.hpValue = value;
  };

  let updateHash = () => {
    let popup = location.hash.startsWith('#popup-');
    document.body.classList.toggle('_popup', popup);

    if (popup || location.hash.startsWith('#hp-')) {
      let value = popup ? 'gold' : location.hash.substring('#hp-'.length);
      update(value);
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
