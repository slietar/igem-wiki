let walk = (children, fn) => {
  return (children ?? []).map((node) => {
    if (typeof node === 'string') {
      return node;
    }

    let result = fn(node);

    if (result) {
      return result;
    }

    return {
      ...node,
      content: walk(node.content, fn)
    };
  });
};


module.exports = (opts) => {
  let startLevel = 2;
  let maxLevel = 3;

  return (tree) => {
    let pointer = [{ children: [] }];

    tree.match({ attrs: { 'toc-contents': 'toc-contents' } }, (node) => {
      let { attrs, 'toc-contents': _ } = node;
      let content = node.content ?? [];
      let index = 0;

      return {
        ...node,
        attrs,
        content: walk(content, (child) => {
          if (child.tag.match(/^h[1-6]$/g)) {
            let level = parseInt(child.tag.substring(1));

            if (level <= maxLevel) {
              let id = child.attrs?.id ?? `heading-${index++}`;

              while (pointer.length + startLevel - 1 > level) {
                let last = pointer.pop();

                pointer.slice(-1)[0].children.push(last);
              }

              while (pointer.length + startLevel - 1 < level) {
                pointer.push({
                  heading: null,
                  children: []
                });
              }

              pointer.push({
                heading: {
                  id,
                  text: child.content.filter((subchild) => !subchild.tag || ['sub', 'sup'].includes(subchild.tag))
                },
                children: []
              });

              return {
                ...child,
                attrs: { ...child.attrs, id }
              };
            }
          }
        })
      };
    });

    while (pointer.length > 1) {
      let last = pointer.pop();

      pointer.slice(-1)[0].children.push(last);
    }

    let toc = pointer[0].children;

    let formatList = (list) => {
      return {
        tag: 'ul',
        attrs: { class: 'sidenav-toc-list' },
        content: list.map((item) => ({
          tag: 'li',
          attrs: { class: 'toc-list-item' },
          content: [
            ...(item.heading ? [
              { tag: 'a',
                attrs: { class: 'sidenav-toc-link', href: '#' + item.heading.id },
                content: [item.heading.text] }
            ] : []),
            ...(item.children.length > 0 ? [formatList(item.children)] : [])
          ]
        }))
      };
    };

    if (toc.length > 0) {
      tree.match({ tag: 'toc' }, (node) => {
        return formatList(toc);
      });
    }
  };
};
