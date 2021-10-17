import { createElement, getTextMetrics, setAttributes } from './dom.js';
import Annotations from './annotations.js';
import AxisTrack from './axis.js';
import DoubleStrandTrack from './dsna.js';
import ResidueTrack from './residues.js';



export default class Figure {
  constructor() {
    this._components = [];
    this._x = 0;
    this._annotations = null;

    this.viewLength = 80;

    this.trackHeight = 10;
    this.trackMargin = 1.8;

    this.monoFont = 'Menlo';
    this.monoMetrics = getTextMetrics(this.monoFont);
    this.monoSize = (this.trackHeight - 2 * this.trackMargin) / this.monoMetrics.ascent;

    this.labelFont = 'Inter';
    this.labelSize = this.monoSize * 0.7;

    this.unitWidth = this.monoMetrics.width * this.monoSize;
    this.outerMargin = 5;

    this.labelTextAttributes = {
      'font-family': this.labelFont,
      'font-size': this.labelSize,
      'text-anchor': 'middle'
    };

    this.monoTextAttributes = {
      'font-family': this.monoFont,
      'font-size': this.monoSize
    };

    this.strokeAttributes = {
      fill: 'none',
      stroke: '#000',
      'stroke-linecap': 'square',
      'stroke-width': 1,
      'vector-effect': 'non-scaling-stroke'
    };
  }


  annotate(index, length, label) {
    if (!this._annotations) {
      this._annotations = new Annotations();
      this._components.push(this._annotations);
    }

    return this._annotations.add(index, length, label);
  }

  axis(length) {
    let track = new AxisTrack(length);
    this._components.push(track);
    return track;
  }

  dsNA(seq1, seq2) {
    let track = new DoubleStrandTrack(seq1, seq2);
    this._components.push(track);
    return track;
  }

  residues(sequence) {
    let track = new ResidueTrack(sequence);
    this._components.push(track);
    return track;
  }


  render() {
    let element = createElement('svg');

    let y = this.outerMargin;
    let minX = +Infinity;
    let maxX = -Infinity;

    for (let component of this._components) {
      let ctx = component.render(this);

      setAttributes(ctx.element, {
        transform: `translate(${this.unitWidth * 0} ${y})`
      });

      element.appendChild(ctx.element);

      y += ctx.height + this.outerMargin;
      minX = Math.min(minX, ctx.bounds[0]);
      maxX = Math.max(maxX, ctx.bounds[1]);
    }

    let viewMinX = minX - 5;
    let viewMaxX = maxX + 5;

    let x;

    let updateViewbox = (nx = viewMinX) => {
      nx = Math.max(nx, viewMinX);
      nx = Math.min(nx, viewMaxX - this.viewLength);
      x = nx;

      setAttributes(element, {
        viewBox: `${x * this.unitWidth} 0 ${this.viewLength * this.unitWidth} ${y}`
      });
    };

    element.addEventListener('wheel', (event) => {
      if (!event.ctrlKey) {
        event.preventDefault();
        updateViewbox(x + event.deltaX * 0.1);
      }
    });

    updateViewbox();

    return {
      element,
      scrollIntoView: (component) => {
        let [minX, maxX] = component.bounds;
        let centerX = (minX + maxX) * 0.5;

        updateViewbox(centerX - this.viewLength * 0.5);
      }
    };
  }
}

class NucleicAcidTrack {
  constructor(sequence) {
    this.element = createElement('g');

    this.element.appendChild(createElement('text', {
      ...monospaceTextAttributes,
      'x': 0,
      'y': trackHeight - trackMargin,
    }, sequence));
  }
}




class CompositeTrack {
  constructor(tracks = []) {
    this.element = createElement('g');

    for (let track of tracks) {
      this.addTrack(track);
    }
  }

  addTrack(track, offset = 0) {
    this.element.appendChild(track.element);

    setAttributes(track.element, {
      transform: `translate(${offset * unitWidth} 0)`
    });
  }
}

class DoubleStrandLink {
  constructor(length) {
    this.element = createElement('g', {}, new Array(length).fill(0).map((_, index) => {
      let x = (index + 0.5) * unitWidth;

      return createElement('path', {
        ...strokeAttributes,
        d: `M${x} ${trackHeight}L${x} ${trackHeight + outerMargin * 2}`,
        stroke: '#ccc',
        'stroke-linecap': 'butt'
      });
    }));
  }
}
