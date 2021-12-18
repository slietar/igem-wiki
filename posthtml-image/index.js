const fs = require('fs');
const imageSize = require('image-size');
const path = require('path');


module.exports = (opts) => {
  return async (tree) => {
    let transform = (node) => {
      if (typeof node === 'string') {
        return node;
      }

      if (node.tag === 'img') {
        let size = imageSize(path.join(__dirname, '../dist', node.attrs.src));

        return {
          ...node,
          attrs: {
            ...node.attrs,
            width: size.width.toString(),
            height: size.height.toString(),
            loading: 'lazy'
          }
        };
      }

      return {
        ...node,
        ...(node.content && {
          content: [node.content].flat().map((child) => transform(child))
        })
      };
    };

    tree.match({ attrs: { class: 'desc-contents' } }, (node) => {
      return transform(node);
    });


    tree.match({ tag: 'img-embedded' }, (node) => {
      let contents;

      try {
        contents = fs.readFileSync(__dirname + '/../src/' + node.attrs.src).toString('base64');
      } catch (err) {
        contents = '';
      }

      return {
        tag: 'img',
        attrs: {
          ...node.attrs,
          src: 'data:image/jpeg;base64,' + contents
        }
      };
    });


    let index = 0;

    tree.match({ tag: 'figcaption' }, (node) => {
      let firstChild = node.content[0];

      if ((firstChild.tag === 'span') && (firstChild.content[0] === 'Figure (X)')) {
        index++;

        return {
          ...node,
          content: [
            { tag: 'span', content: [`Figure ${index}`] },
            ...node.content.slice(1)
          ]
        };
      }

      return node;
    });


    return tree;
  };
};
