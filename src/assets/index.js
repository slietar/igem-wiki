let index = 0;

for (let element of document.querySelector('.contents').querySelectorAll('h1, h2, h3')) {
  element.id = `heading-${index++}`;
}


tocbot.init({
  tocSelector: '.sidenav-toc',
  contentSelector: '.contents',
  headingSelector: 'h2, h3',
  hasInnerContainers: true,
  orderedList: false,
  activeLinkClass: '_active',
  linkClass: 'sidenav-toc-link',
  listClass: 'sidenav-toc-list',
  positionFixedSelector: '.sidenav',
  collapseDepth: 3,
  fixedSidebarOffset: document.querySelector('.sidenav').offsetTop,
  headingsOffset: 20,
  scrollSmoothOffset: -20
});
