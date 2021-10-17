import { createElement, setAttributes } from '../linear/dom.js';
import { StrokeAttributes, normalizeAngle, textAttributes } from './util.js';


export default class Axis {
  constructor(options) {
    this._options = {
      ...options,
      text: {
        color: options.text?.color ?? '#000',
        font: options.text?.font ?? 'sans-serif',
        size: options.text?.size ?? 2
      }
    };
  }

  render(fig) {
    this._element = createElement('g');

    this._circle = createElement('circle', {
      ...StrokeAttributes,
      cx: 0,
      cy: 0,
    });

    this._element.appendChild(this._circle);

    this._ticks = new Array(fig.length)
      .fill(0)
      .map((_, index) => ({ angle: index / fig.length * Math.PI * 2, index }))
      .filter(({ index }) => (index + 1) % 500 < 1);

    for (let tick of this._ticks) {
      tick.path = createElement('path', {
        ...StrokeAttributes,
      });

      tick.text = createElement('text', {
        ...textAttributes(this._options.text),
      }, (tick.index + 1).toString());

      this._element.appendChild(tick.path);
      this._element.appendChild(tick.text);
    }

    return this._element;
  }

  update(fig) {
    let radius = fig.radius + 2;

    setAttributes(this._circle, {
      r: radius
    });

    for (let tick of this._ticks) {
      let [ax, ay] = [
        radius * Math.cos(tick.angle),
        radius * Math.sin(tick.angle)
      ];

      let spread1 = 1;
      let spread2 = 2.4;

      let vx = ax / radius;
      let vy = ay / radius;

      let px = ax + vx * spread1;
      let py = ay + vy * spread1;

      let lx = ax + vx * spread2;
      let ly = ay + vy * spread2;

      setAttributes(tick.path, {
        d: `M${ax} ${ay}L${px} ${py}`
      });

      let ang = normalizeAngle(tick.angle + fig.rotation);
      let absAng = Math.abs(ang);

      setAttributes(tick.text, {
        x: lx,
        y: ly,
        'dominant-baseline': (ang > -Math.PI * 2/3 && ang < -Math.PI / 3) ? 'initial' : (ang > Math.PI / 3 && ang < Math.PI * 2/3 ? 'hanging' : 'middle'),
        'text-anchor': absAng < Math.PI / 3 ? 'start' : (absAng > Math.PI * 2/3 ? 'end' : 'middle'),
        transform: `rotate(${-fig.rotation / Math.PI * 180})`,
        'transform-origin': `${lx} ${ly}`
      });
    }
  }
}
