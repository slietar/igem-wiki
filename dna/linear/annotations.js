import { createElement } from './dom.js';
import TrackManager from '../common/track-manager.js';
import { getTextMetrics } from '../common/util.js';


let labelColor = 0;

export default class Annotations {
  constructor() {
    this._annotations = [];
    this._manager = new TrackManager();
    this._tracks = [];
  }

  add(index, length, label) {
    let annotation = { index, length, label };
    this._annotations.push(annotation);

    return {
      bounds: [index, index + length]
    };
  }

  render(fig) {
    for (let ann of this._annotations) {
      let labelWidth = ann.length * fig.unitWidth;
      let textWidth = getTextMetrics(fig.labelFont, fig.labelSize, ann.label).width;

      this._manager.add(ann.index, ann.length, (ann.index + ann.length * 0.5) * fig.unitWidth, labelWidth, textWidth + 3, ann);
    }

    let tracks = this._manager.solve();

    let margin1 = 3;
    let margin1b = 1;
    let margin2 = 6;
    let margin3 = 3.5;
    let margin4 = 3;

    let textHeight = fig.labelSize * fig.monoMetrics.ascent;
    let height = 0;


    let element = createElement('g');

    tracks.forEach((track, trackIndex) => {
      let group = createElement('g', {
        transform: `translate(0 ${height})`
      });

      element.appendChild(group);

      for (let { level, object: ann } of track) {
        let hmargin = 1;
        let width = ann.length * fig.unitWidth;

        let color = `hsl(${labelColor * 30}, 90%, 70%)`;
        labelColor = (labelColor + 1) % 12;

        group.appendChild(createElement('g', {}, [
          createElement('rect', {
            ...fig.strokeAttributes,
            x: hmargin + ann.index * fig.unitWidth,
            y: 0,
            width: width - hmargin * 2,
            height: fig.trackHeight,
            fill: color
          }),
          /* createElement('text', {
            ...fig.labelTextAttributes,
            x: ann.index * fig.unitWidth + width * 0.5,
            y: trackY + fig.trackHeight * 0.5 + (fig.labelSize * fig.monoMetrics.ascent) * 0.5
          }, ann.label) */
        ]));
      }


      let maxLevel = -Infinity;

      for (let { level, object: ann } of track) {
        let width = ann.length * fig.unitWidth;
        let cx = ann.index * fig.unitWidth + width * 0.5;

        let yl1 = fig.trackHeight + margin1 + margin1b;
        let yl2 = yl1 + (margin2 + textHeight) * (level - 1);
        let yl3 = level > 0
          ? (level > 1
            ? yl2 + margin3
            : yl2)
          : textHeight * 0.5; // !!

        if (level >= 0) {
          group.appendChild(createElement('text', {
            ...fig.labelTextAttributes,
            x: cx,
            y: yl3 + textHeight * 0.5,
            'dominant-baseline': 'central'
          }, ann.label));
        } if (level > 1) {
          group.appendChild(createElement('path', {
            ...fig.strokeAttributes,
            d: `M${cx} ${yl1 - margin1b}L${cx} ${yl2}`
          }));
        }

        maxLevel = Math.max(maxLevel, level);
      }

      height += fig.trackHeight + margin1 + margin1b + textHeight * maxLevel + margin2 * (maxLevel - 1) + margin3 + margin4;

      if (trackIndex < tracks.length - 1) {
        height += fig.outerMargin;
      }
    });

    // element.appendChild(createElement('rect', {
    //   x: 135,
    //   y: 0,
    //   width: 10,
    //   height: fig.trackHeight + margin1 + margin1b + textHeight * maxLevel + margin2 * (maxLevel - 1) + margin3 + margin4
    // }));

    return {
      bounds: [
        Math.min(...this._annotations.map((ann) => ann.index)),
        Math.max(...this._annotations.map((ann) => ann.index + ann.length))
      ],
      element,
      height
    };
  }
}
