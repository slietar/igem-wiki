import { createElement } from './dom.js';


export default class AxisTrack {
  constructor(length, offset = 0, interval = 5) {
    this.length = length;
    this.offset = offset;
    this.interval = interval;
  }

  render(fig) {
    let element = createElement('g', {}, [
      createElement('path', {
        d: `M0 ${fig.trackHeight * 0.5}L${(this.length + this.offset) * fig.unitWidth} ${fig.trackHeight * 0.5}`,
        ...fig.strokeAttributes
      }),
    ]);

    for (let index = this.offset; index < this.offset + this.length; index++) {
      let pos = index + 1;

      if (pos % this.interval > 0) {
        continue;
      }

      let x = (index + 0.5) * fig.unitWidth;

      element.appendChild(createElement('path', {
        ...fig.strokeAttributes,
        d: `M${x} ${fig.trackHeight * 0.5}L${x} ${fig.trackHeight * 0.8}`
      }));

      element.appendChild(createElement('text', {
        ...fig.labelTextAttributes,
        x,
        y: fig.trackHeight * 1.5,
      }, pos.toString()));
    }

    return {
      bounds: [this.offset, this.offset + this.length],
      element,
      height: fig.trackHeight * 2
    };
  }
}
