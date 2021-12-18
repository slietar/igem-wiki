let contents = document.querySelector('.desc-contents');
let toc = document.querySelector('.sidenav-toc');

if (contents) {
  let activeIndex = null;

  let update = (newActiveIndex, force) => {
    if (activeIndex !== newActiveIndex || force) {
      let inactiveId = headings[activeIndex]?.element?.id;
      let activeId = headings[newActiveIndex]?.element?.id;

      if (inactiveId) {
        toc.querySelector(`[href="#${inactiveId}"]`)?.classList?.remove('_active');
      }

      if (activeId) {
        toc.querySelector(`[href="#${activeId}"]`)?.classList?.add('_active');
      }

      activeIndex = newActiveIndex;
    }
  };


  let headings;
  let igemMode = !!document.querySelector('#mw-content-text');

  document.addEventListener('scroll', () => {
    if (!headings) {
      return;
    }

    let target = document.querySelector(':target');
    let y = igemMode ? (document.documentElement.scrollTop - 16) : document.body.scrollTop;

    for (let index = 0; index < headings.length; index++) {
      let element = headings[index].element;
      let headingY = headings[index + 1]?.y ?? Infinity;

      if (((headingY > y) && (element === target)) || (headingY > y + 100)) {
        update(index);
        break;
      }
    }
  });


  let define = () => {
    headings = Array.from(contents.querySelectorAll('h2, h3'))
      .map((element) => {
        return { element, visible: false, y: element.offsetTop };
      });
  };

  let reset = () => {
    define();
    update(activeIndex, true);
  };

  for (let el of document.querySelectorAll('details')) {
    el.addEventListener('toggle', () => {
      reset();
    });
  }

  window.addEventListener('load', () => {
    define();
  });
}
