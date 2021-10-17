import { createElement } from './dom.js';


const ResidueColors = {
  A: '#c8c8c8',
  R: '#145aff',
  N: '#00dcdc',
  C: '#e6e600',
  E: '#e60a0a',
  Q: '#00dcdc',
  G: '#ebebeb',
  H: '#8282d2',
  I: '#0f820f',
  L: '#0f820f',
  K: '#145aff',
  M: '#e6e600',
  F: '#3232aa',
  P: '#dc9682',
  S: '#fa9600',
  T: '#fa9600',
  W: '#b45ab4',
  Y: '#3232aa',
  V: '#0f820f'
};

const ResidueHues = {
  C: 56,
  D: 292,
  E: 0,
  F: 236,
  G: 292,
  H: 276,
  I: 114,
  K: 207,
  L: 114,
  P: 34,
  Q: 176,
  N: 176,
  S: 25,
  T: 25
};

export default class ResidueTrack {
  constructor(sequence) {
    this.bounds = [0, sequence.length * 3];
    this.sequence = sequence;
  }

  render(fig) {
    let residueWidth = fig.unitWidth * 3;
    let element = createElement('g');

    element.appendChild(createElement('pattern', {
      id: 'hatch',
      patternUnits: 'userSpaceOnUse',
      width: 4,
      height: 4
    }, [
      createElement('path', {
        d: 'M-1 1l2 -2M0 4l4 -4M3 5l2 -2',
        stroke: '#0003',
        'stroke-width': 1
      })
    ]));


    for (let index = 0; index < this.sequence.length; index++) {
      let residue = this.sequence[index];
      let sx = index * residueWidth;
      let arrow = 0.3 * fig.trackHeight;
      let d = `M${sx - arrow * 0.5} 0L${sx + residueWidth - arrow * 0.5} 0L${sx + residueWidth + arrow * 0.5} ${fig.trackHeight * 0.5}L${sx + residueWidth - arrow * 0.5} ${fig.trackHeight}L${sx - arrow * 0.5} ${fig.trackHeight}L${sx + arrow * 0.5} ${fig.trackHeight * 0.5}Z`;

      element.appendChild(createElement('path', {
        d,
        // fill: ResidueColors[residue] || '#eee'
        fill: `hsl(${ResidueHues[residue] || 0}, 67%, 61%)`,
        class: 'residue'
      }));

      if (Math.random() > 0.8) {
        element.appendChild(createElement('path', {
          d,
          fill: 'url(#hatch)',
          class: 'residue'
        }));
      }

      element.appendChild(createElement('path', {
        ...fig.strokeAttributes,
        d: `M${sx + residueWidth - arrow * 0.5} 0L${sx + residueWidth + arrow * 0.5} ${fig.trackHeight * 0.5}L${sx + residueWidth - arrow * 0.5} ${fig.trackHeight}`,
        stroke: '#fff',
        'stroke-width': 2
      }));

      element.appendChild(createElement('text', {
        ...fig.monoTextAttributes,
        x: sx + residueWidth * 0.5,
        y: fig.trackHeight - fig.trackMargin,
        'text-anchor': 'middle'
      }, residue));
    }

    return {
      bounds: this.bounds,
      element,
      height: fig.trackHeight
    };
  }
}
