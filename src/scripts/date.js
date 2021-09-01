for (let el of document.querySelectorAll('.date')) {
  let date = new Date(el.innerText);

  el.innerHTML = new Intl.DateTimeFormat(navigator.language, { day: '2-digit', month: '2-digit', weekday: 'long' }).format(date);
}

for (let el of document.querySelectorAll('[data-date]')) {
  let date = new Date(el.innerText);
  let settings = (() => {
    switch (el.dataset.date) {
      case 'long': return {};
    }
  })();

  el.innerHTML = new Intl.DateTimeFormat(navigator.language, settings).format(date);
}
