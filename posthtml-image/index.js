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

    return tree;
  };
};
