const fs = require('fs');


module.exports = (opts) => {
  return async (tree) => {
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
