function transform(node) {
  return {
    ...node,
    ...(node.content && { content: [node.content].flat().map((child) => {
      if (typeof child !== 'string') {
        return transform(child);
      }

      return child
        .replaceAll(/((?:^|[(| ])\d(?:[,\.\d]*\d)?) (?!and )([a-zA-Zµ]{1,3}[^a-z])/g, '$1&#8239;$2')
        .replaceAll(/((?:^|[(| ])\d(?:[,\.\d]*\d)?) ([a-zA-Z]{4,})/g, '$1&nbsp;$2')
        .replaceAll('OD600', 'OD<sub>600</sub>')
        .replaceAll('--', '&#8239;&ndash;&thinsp;')
    }) })
  };
}


module.exports = (opts) => {
  return async (tree) => {
    tree.match({ attrs: { class: 'desc-contents' } }, (node) => {
      return transform(node);
    });

    return tree;
  };
};
