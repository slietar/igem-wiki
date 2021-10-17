import { areaAttributes, textAttributes } from './util.js';
import { createElement, setAttributes } from '../linear/dom.js';


export default class Plasmid {
  constructor(title, subtitle, options = {}) {
    this._element = null;

    this._options = {
      circle: {
        fill: 'none',
        line: {
          ...options.circle?.line,
          color: '#777',
          style: '-',
          width: 3,
        },
        separation: 0.6,
        ...options.circle,
      },
      title: {
        size: 3,
        weight: 600,
        ...options.title
      },
      subtitle: {
        size: 2.6,
        ...options.subtitle
      }
    };

    this.title = title;
    this.subtitle = subtitle;
  }

  render(fig) {
    this._element = createElement('g');

    this._circleInner = createElement('circle', {
      ...areaAttributes(this._options.circle),
      cx: 0,
      cy: 0
    });

    this._circleOuter = this._circleInner.cloneNode();

    this._element.appendChild(this._circleInner);
    this._element.appendChild(this._circleOuter);

    if (this.title) {
      this._element.appendChild(createElement('text', {
        ...textAttributes(this._options.title),
        x: 0,
        y: 0
      }, this.title));
    } if (this.subtitle) {
      this._element.appendChild(createElement('text', {
        ...textAttributes(this._options.subtitle),
        x: 0,
        y: 4
      }, this.subtitle));
    }

    return { element: this._element, transformed: false };
  }

  update(fig) {
    let sep = this._options.circle.separation;

    setAttributes(this._circleInner, {
      r: fig.radius - sep
    });

    setAttributes(this._circleOuter, {
      r: fig.radius + sep
    });
  }
}
