const Cite = require('citation-js');
const fs = require('fs');


let cache = {};

try {
  cache = require('./cache.json');
} catch (err) {

}


module.exports = (opts) => {
  let refNodeId = (index) => `ref-${index}`;

  return async (tree) => {
    let nextId = 0;
    let nextIndex = 0;
    let refs = {};

    tree.match({ tag: 'ref' }, (node) => {
      let doi = node.attrs.doi;
      let id = doi ?? node.attrs.id ?? nextId++;
      let index;

      if (id in refs) {
        index = refs[id].index;
      } else {
        index = nextIndex++;

        refs[id] = {
          ...node.attrs,
          index
        };
      }

      return {
        tag: 'a',
        attrs: {
          class: 'ref',
          href: '#' + refNodeId(index)
        },
        content: `${index + 1}`
      };
    });

    let entries = await Promise.all(
      Object.values(refs)
        .sort((a, b) => a.index - b.index)
        .map(async (ref) => {
          let entry = { index: ref.index };

          if (ref.doi) {
            // return {
            //   tag: 'li',
            //   attrs: { class: 'ref-item', id: refNodeId(ref.index) },
            //   content: []
            // };


            let cached = cache[ref.doi];
            let info;

            if (cached) {
              info = new Cite(cached);
            } else {
              try {
                info = await Cite.async(ref.doi);

                if (info) {
                  cache[ref.doi] = info.data;
                }
              } catch (err) {
                console.error('>', ref);
                console.error('>', ref.doi);
                console.error(err.message);
                console.error('------');

                return {
                  tag: 'li',
                  attrs: { class: 'ref-item', id: refNodeId(ref.index) },
                  content: [
                    { tag: 'div',
                      attrs: { class: 'ref-authors' },
                      content: ['DOI: ' + ref.doi] },
                    // { tag: 'div',
                    //   attrs: { class: 'ref-links' },
                    //   content: [''].map(([content, href]) =>
                    //     ({ tag: 'a', attrs: { class: 'ref-link', href, target: '_blank' }, content })
                    //   ) }
                  ]
                };
              }
            }

            if (!info) {
              return '';
            }

            let formatted = info.format('data', {
              format: 'object',
            })[0];

            let data = info.data[0];

            let year = formatted.issued['date-parts'][0][0];
            let authors = joinAuthors((data.author ?? []).map((author) => author.family));

            Object.assign(entry, {
              authors,
              journal: [
                { tag: 'i',
                  content: [data['container-title']] },
                ['', data.volume && `vol.&nbsp;${data.volume}`, data.issue && `no.&nbsp;${data.issue}`, data.page && `pp.&nbsp;${data.page}`]
                  .filter((x) => x || x === '')
                  .join(', ')
                // `, vol.&nbsp;${data.volume}, no.&nbsp;${data.issue}, pp.&nbsp;${data.page}`
              ],
              links: { 'Crossref': data.URL, 'Google Scholar': 'https://scholar.google.ch/scholar?q=' + encodeURIComponent(ref.doi) },
              title: data.title,
              year
            });
          } else {
            Object.assign(entry, {
              authors: ref.authors,
              journal: ref.journal && [{ tag: 'i', content: [ref.journal] }],
              links: { 'Full text': ref.url },
              title: ref.title,
              year: ref.year
            });
          }

          return {
            tag: 'li',
            attrs: { class: 'ref-item', id: refNodeId(ref.index) },
            content: [
              ...(entry.authors ? [{ tag: 'div',
                attrs: { class: 'ref-authors' },
                content: [entry.authors].concat(entry.year ? [`&nbsp;(${entry.year})`] : []) }] : []),
              { tag: 'div',
                attrs: { class: 'ref-title' },
                content: [entry.title] },
              ...(entry.journal ? [{ tag: 'div',
                attrs: { class: 'ref-journal' },
                content: entry.journal }] : []),
              { tag: 'div',
                attrs: { class: 'ref-links' },
                content: Object.entries(entry.links).map(([content, href]) =>
                  ({ tag: 'a', attrs: { class: 'ref-link', href, target: '_blank' }, content })
                ) }
            ]
          };
        })
    );


    tree.match({ tag: 'bibliography' }, (node) => {
      return {
        tag: 'ol',
        attrs: { class: 'ref-list' },
        content: entries
      };
    });


    fs.writeFileSync(__dirname + '/cache.json', JSON.stringify(cache));

    return tree;
  };
};

function joinAuthors(authors) {
  return authors.length > 1
    ? authors.slice(0, -1).join(', ') + ' &amp; ' + authors.slice(-1)[0]
    : authors[0];
}
