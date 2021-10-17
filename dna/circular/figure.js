import Annotation from './annotation.js';
import Axis from './axis.js';
import Plasmid from './plasmid.js';
import TrackManager from '../common/track-manager.js';
import { getTextMetrics } from '../common/util.js';
import { createElement, setAttributes } from '../linear/dom.js';


export default class Figure {
  constructor(length, options = {}) {
    this.length = length;

    this.cx = 50;
    this.cy = 50;
    this.radius = 40;
    this.rotation = -Math.PI * 0.5;

    this.defs = null;

    this._annotations = [];
    this._components = [];
    this._options = {
      font: options.font ?? 'inherit'
    };

    this._manager = new TrackManager({ circularLength: length });
  }

  addComponent(comp) {
    this._components.push(comp);
    return comp;
  }

  allocateId() {
    return `x-${Math.floor(Math.random() * 1e6)}`;
  }

  annotate(index, length, label, options = {}) {
    let annotation = new Annotation(index, length, label, {
      fill: `hsl(${this._annotations.length * 30}, 90%, 70%)`,
      ...options,
      layer: options.layer ?? 0,
      text: options.text !== null ? {
        font: this._options.font,
        ...options.text
      } : null
    });

    this._annotations.push({ annotation, index, length });
    return this.addComponent(annotation);
  }

  axis(options = {}) {
    return this.addComponent(new Axis({
      text: options.text !== null ? {
        font: this._options.font,
        ...options.text
      } : null,
      ...options
    }));
  }

  plasmid(title = null, subtitle = null, options = {}) {
    return this.addComponent(new Plasmid(title, subtitle, {
      ...options,
      title: {
        ...options.title,
        font: options.title?.font ?? this._options.font
      }
    }));
  }

  render() {
    for (let ann of this._annotations) {
      let annOpts = ann.annotation._options;
      let textWidth = getTextMetrics(annOpts.text.font, annOpts.text.size, ann.annotation.label).width;

      this._manager.add({
        pos: ann.index,
        length: ann.length,
        cx: ann.index + ann.length * 0.5,
        labelWidth: ann.length,
        textWidth,
        object: ann.annotation
      });
    }

    this._group = createElement('g');
    this.defs = createElement('defs');

    this._element = createElement('svg', {
      style: 'max-width: 500px;'
    }, [this.defs, this._group]);

    for (let comp of this._components) {
      let res = comp.render(this);

      for (let el of (Array.isArray(res) ? res : [res])) {
        if ('transformed' in el && !el.transformed) {
          this._element.appendChild(el.element);
        } else {
          this._group.appendChild(el);
        }
      }
    }

    this.update();

    this._element.addEventListener('wheel', (event) => {
      if (event.ctrlKey) {
        let radiusDelta = event.deltaY * 0.3;
        let radius = Math.min(65, Math.max(40, this.radius - radiusDelta));
        let factor = (this.radius - radius) / radiusDelta;

        this.cy -= event.deltaY * 0.4 * factor;
        this.radius = radius;
      } else {
        let rotation = Math.min(Math.PI * 0.5, Math.max(-Math.PI * 1.5, this.rotation + event.deltaY * 0.01));

        if (rotation === this.rotation) {
          return;
        }

        this.rotation = rotation;
      }

      event.preventDefault();
      this.update();
    });

    return { element: this._element };
  }

  update() {
    // let tracks = this._manager.solve();

    setAttributes(this._element, {
      viewBox: `${-this.cx} ${-this.cy} 100 100`
      // viewBox: `${-this.cx} ${-this.cy} ${this.cx * 2} ${this.cy * 2}`,
    });

    setAttributes(this._group, {
      transform: `rotate(${this.rotation / Math.PI * 180})`
      // 'transform-origin': `${this.cx} ${this.cy}`
    });

    for (let comp of this._components) {
      comp.update(this);
    }
  }
}
