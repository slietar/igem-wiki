import { createElement, setAttributes } from '../linear/dom.js';
import { areaAttributes, normalizeAngle, StrokeAttributes, textAttributes } from './util.js';


export default class Annotation {
  constructor(index, length, label, options) {
    this.index = index;
    this.label = label;
    this.length = length;
    this.layer = options.layer ?? 0;
    this.level = options.level ?? 0;

    this._options = {
      direction: 'none',
      ...options,
      fill: options.fill ?? '#0074d9',
      line: options.line !== null ? {
        color: options.line?.color ?? '#000',
        style: options.line?.style ?? '-',
        width: options.line?.width ?? 1
      } : null,
      text: {
        color: options.text?.color ?? '#000',
        font: options.text?.font ?? 'sans-serif',
        size: options.text?.size ?? 2
      }
    };
  }

  render(fig) {
    this._path = createElement('path', {
      ...areaAttributes(this._options)
    });

    let id = fig.allocateId();

    this._textPath = createElement('path', {
      ...StrokeAttributes,
      id
    });

    fig.defs.appendChild(this._textPath);

    let text = createElement('text', {
      ...textAttributes(this._options.text),
      'dominant-baseline': 'central'
    }, [
      createElement('textPath', {
        href: '#' + id,
        startOffset: '50%'
      }, this.label)
    ]);

    this._line = createElement('path', {
      ...StrokeAttributes
    });

    this._element = createElement('g', {}, [this._path, this._line, text]);
    return this._element;
  }

  update(fig) {
    let dir = this._options.direction;
    let layer = this._options.layer;

    let trackHeight = 4;
    let trackSpacing = 3;


    let radius1 = fig.radius - trackSpacing * (layer + 1) - trackHeight * layer;
    let radius2 = radius1 - trackHeight;

    // angle at the start
    let ang1 = (this.index / fig.length) * Math.PI * 2 + 0.5 / fig.radius;

    // angle at the end, on the middle
    let ang2 = ((this.index + this.length) / fig.length) * Math.PI * 2;

    // angle at the end, on the ends
    let angArrow1 = (dir === 'both') || (dir === 'reverse') ? 2 / fig.radius : 0;
    let angArrow2 = (dir === 'both') || (dir === 'forward') ? 2 / fig.radius : 0;

    let ang1s = ang1 + angArrow1;
    let ang2s = ang2 - angArrow2;

    let point = (ang, radius = this.radius) => {
      return [
        radius * Math.cos(ang),
        radius * Math.sin(ang)
      ];
    };

    let [xo1, yo1] = point(ang1s, radius1);
    let [xo2, yo2] = point(ang2s, radius1);

    let [xi1, yi1] = point(ang1s, radius2);
    let [xi2, yi2] = point(ang2s, radius2);

    let [xd1, yd1] = point(ang1, (radius1 + radius2) * 0.5);
    let [xd2, yd2] = point(ang2, (radius1 + radius2) * 0.5);

    let largeArc = this.length > 0.5 * fig.length ? 1 : 0;

    setAttributes(this._path, {
      d: `M${xo1} ${yo1}A${radius1} ${radius1} 0 ${largeArc} 1 ${xo2} ${yo2}L${xd2} ${yd2}L${xi2} ${yi2}A${radius2} ${radius2} 0 ${largeArc} 0 ${xi1} ${yi1}L${xd1} ${yd1}Z`,
    });

    //-

    let margin1 = 1;
    let margin1b = 0;
    let margin2 = 1.2;
    let margin3 = 0.8;
    let margin4 = 0;
    let textHeight = this._options.text.size;

    let r1 = trackHeight + margin1 + margin1b;
    let r2 = r1 + (margin2 + textHeight) * (this.level - 1);
    let r3 = this.level > 0
      ? (this.level > 1
        ? r2 + margin3
        : r2) + textHeight * 0.5
      : trackHeight * 0.5;


    let angMiddle = (ang1 + ang2) * 0.5;
    let ang = normalizeAngle((ang1 + ang2) * 0.5 + fig.rotation);
    let radius3 = radius1 - r3;

    let [xm1, ym1] = point(angMiddle - Math.PI * 0.3, radius3);
    let [xm2, ym2] = point(angMiddle + Math.PI * 0.3, radius3);

    if (this.level > 1) {
      let [xp1, yp1] = point(angMiddle, radius1 - r1 + margin1b);
      let [xp2, yp2] = point(angMiddle, radius1 - r2);

      setAttributes(this._line, {
        d: `M${xp1} ${yp1}L${xp2} ${yp2}`
      });
    }

    setAttributes(this._textPath, {
      d: ang < 0
        ? `M${xm1} ${ym1}A${radius3} ${radius3} 0 ${largeArc} 1 ${xm2} ${ym2}`
        : `M${xm2} ${ym2}A${radius3} ${radius3} 0 ${largeArc} 0 ${xm1} ${ym1}`
    });

  }
}
