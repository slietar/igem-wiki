function transform(node) {
  return {
    ...node,
    ...(node.content && { content: [node.content].flat().map((child) => {
      if (typeof child !== 'string') {
        return transform(child);
      }

      return child
        .replaceAll(/((?: |^)[,\.\d]+) ([a-zA-Zµ]{1,3}[^a-z])/g, '$1&#8239;$2')
        .replaceAll(/( [,\.\d]+) ([a-zA-Z]{4,})/g, '$1&nbsp;$2')
        .replaceAll(/([a-zA-Z])(\d{1,3})([^a-zA-Z\d]|$)/g, '$1<sub>$2</sub>$3');
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
