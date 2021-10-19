let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);


for (let elGroup of $$('.imp-group')) {
  let setValue = (value) => {
    elGroup.querySelector(`.imp-selector [data-name="${activeName}"]`).classList.toggle('_active', value);
    elGroup.querySelector(`.imp-section[data-name="${activeName}"]`).classList.toggle('_active', value);
  };

  let activeName = elGroup.dataset.default;
  setValue(true);

  for (let el of elGroup.querySelectorAll('.imp-selector [data-name]')) {
    el.addEventListener('click', () => {
      setValue(false);
      activeName = el.dataset.name;
      setValue(true);
    });
  }
}
