let contents = document.querySelector('.desc-contents');
let toc = document.querySelector('.sidenav-toc');

if (contents) {
  let activeIndex = null;

  let update = (newActiveIndex) => {
    if (activeIndex !== newActiveIndex) {
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

  /* let observer = new IntersectionObserver((entries) => {
    for (let entry of entries) {
      let index = headings.findIndex((heading) => heading.element === entry.target);
      headings[index].visible = entry.isIntersecting;
    }


    let newActiveIndex = null;

    // for (let heading of headings) {
    for (let index = 0; index < headings.length; index++) {
      if (headings[index].visible) {
        newActiveIndex = index;

        break;
      }
    }

    update(newActiveIndex);
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 1
  }); */

  document.addEventListener('scroll', () => {
    let target = document.querySelector(':target');
    let y = document.body.scrollTop;

    for (let index = 0; index < headings.length; index++) {
      let element = headings[index].element;
      let headingY = headings[index + 1]?.y ?? Infinity;

      if (((headingY > y) && (element === target)) || (headingY > y + 100)) {
        update(index);
        break;
      }
    }
  });

  let headings = Array.from(contents.querySelectorAll('h2, h3'))
    .map((element) => {
      return { element, visible: false, y: element.offsetTop };
    });

  for (let { element } of headings) {
    // observer.observe(element);
  }
}
