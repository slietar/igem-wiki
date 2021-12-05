function transform(node) {
  return {
    ...node,
    ...(node.content && { content: [node.content].flat().map((child) => {
      if (typeof child !== 'string') {
        return transform(child);
      }

      return child
        .replaceAll(/((?:^|[(| ])\d(?:[,\.\d]*\d)?) (?!and |or |to |by )([a-zA-Zµ]{1,3}[^a-z])/g, '$1&#8239;$2')
        .replaceAll(/((?:^|[(| ])\d(?:[,\.\d]*\d)?) ([a-zA-Z]{4,})/g, '$1&nbsp;$2')
        .replaceAll('OD600', 'OD<sub>600</sub>')
        .replaceAll('CuSO4', 'CuSO<sub>4</sub>')
        .replaceAll('SiO2', 'SiO<sub>2</sub>')
        .replaceAll('H2O', 'H<sub>2</sub>O')
        .replaceAll('CO2', 'CO<sub>2</sub>')
        .replaceAll('HNO3', 'HNO<sub>3</sub>')
        .replaceAll('Na2HPO4', 'Na<sub>2</sub>HPO<sub>4</sub>')
        .replaceAll('NaH2PO4', 'NaH<sub>2</sub>PO<sub>4</sub>')
        .replaceAll('K2HPO4', 'K<sub>2</sub>HPO<sub>4</sub>')
        .replaceAll('KH2PO4', 'KH<sub>2</sub>PO<sub>4</sub>')
        .replaceAll('CaCl2', 'CaCl<sub>2</sub>')
        .replaceAll('Ca2+', 'Ca<sup>2+</sup>')
        .replaceAll('Cu2+', 'Cu<sup>2+</sup>')
        .replaceAll('Mg2+', 'Mg<sup>2+</sup>')
        .replaceAll('I2C', 'I<sup>2</sup>C')
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
