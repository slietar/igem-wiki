import { createElement } from './dom.js';


let forward = (seq) => seq.replaceAll(' ', '&nbsp;');

let reverse = (seq) =>
  seq
    .split('')
    .map((base) => ({ A: 'T', C: 'G', G: 'C', T: 'A', ' ': ' ' })[base] || '•')
    .join('');


export default class DoubleStrandTrack {
  constructor(seq1, seq2 = reverse(seq1)) {
    this.seq1 = forward(seq1);
    this.seq2 = forward(seq2);

    this._cuts = [];
  }

  cut(fwd, rev) {
    this._cuts.push({ fwd, rev });
  }

  render(fig) {
    let trackHeight = fig.trackHeight;

    let length = Math.max(this.seq1.length, this.seq2.length);
    let halfSpacing = trackHeight * 0.6;
    let height = (1 + halfSpacing / trackHeight) * 2 * trackHeight;

    let element = createElement('g');

    element.appendChild(createElement('text', {
      ...fig.monoTextAttributes,
      x: 0,
      y: trackHeight - fig.trackMargin,
    }, this.seq1));

    let localStrokeAttributes = {
      ...fig.strokeAttributes,
      stroke: '#777',
      'stroke-width': 1.8
    };

    element.appendChild(createElement('path', {
      ...localStrokeAttributes,
      d: `M0 ${trackHeight + halfSpacing}L${length * fig.unitWidth} ${trackHeight + halfSpacing}`,
    }));

    element.appendChild(createElement('text', {
      ...fig.monoTextAttributes,
      x: 0,
      y: (trackHeight + halfSpacing) * 2 - fig.trackMargin,
    }, this.seq2));

    for (let index = 0; index < length; index++) {
      let spread = ((index + 1) % 5 < 1) ? 0.6 : 0.2;
      let x = (index + 0.5) * fig.unitWidth;

      element.appendChild(createElement('path', {
        ...localStrokeAttributes,
        d: `M${x} ${trackHeight + halfSpacing * (1 - spread)}L${x} ${trackHeight + halfSpacing * (1 + spread)}`
      }));
    }


    element.appendChild(createElement('text', {
      ...fig.labelTextAttributes,
      x: -fig.unitWidth * 2,
      // y: trackHeight - trackMargin,
      y: trackHeight * 0.5 + (fig.monoSize * 0.8 * fig.monoMetrics.ascent) * 0.5,
      'fill': '#666',
      'font-size': fig.monoSize * 0.8
    }, '5’'));

    element.appendChild(createElement('text', {
      ...fig.labelTextAttributes,
      x: -fig.unitWidth * 2,
      // y: trackHeight - trackMargin,
      y: trackHeight * 1.5 + halfSpacing * 2 + (fig.monoSize * 0.8 * fig.monoMetrics.ascent) * 0.5,
      'fill': '#666',
      'font-size': fig.monoSize * 0.8
    }, '3’'));


    for (let cut of this._cuts) {
      let color = 'var(--cut-color, #0074d9)';

      let x1 = cut.fwd * fig.unitWidth;
      let x2 = cut.rev * fig.unitWidth;
      let d = `M${x1} ${trackHeight}L${x1} ${trackHeight + halfSpacing}L${x2} ${trackHeight + halfSpacing}L${x2} ${trackHeight + halfSpacing * 2}`;

      let arrowHor = 2;
      let arrowVert = 3;

      element.appendChild(createElement('g', {
        class: 'cut'
      }, [
        createElement('path', {
          ...fig.strokeAttributes,
          d,
          stroke: '#fff',
          'stroke-width': 3.6
        }),
        createElement('path', {
          ...fig.strokeAttributes,
          d,
          stroke: color,
          'stroke-width': 1.8
        }),
        createElement('path', {
          d: `M${x1} 0L${x1 + arrowHor} ${-arrowVert}L${x1 - arrowHor} ${-arrowVert}Z`,
          fill: color
        }),
        createElement('path', {
          d: `M${x2} ${(trackHeight + halfSpacing) * 2}L${x2 + arrowHor} ${(trackHeight + halfSpacing) * 2 + arrowVert}L${x2 - arrowHor} ${(trackHeight + halfSpacing) * 2 + arrowVert}Z`,
          fill: color
        })
      ]));
    }

    return {
      bounds: [0, length],
      element,
      height
    };
  }
}
