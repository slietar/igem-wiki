export const StrokeAttributes = {
  fill: 'none',
  stroke: '#000',
  'stroke-linecap': 'square',
  'stroke-width': 1,
  'vector-effect': 'non-scaling-stroke'
};

export const TextAttributes = {
  'dominant-baseline': 'middle',
  'stroke': 'none',
  'text-anchor': 'middle'
};


export function areaAttributes(opts) {
  return {
    ...(opts && lineAttributes({ color: opts.color, ...opts.line })),
    fill: opts.fill
  };
}

export function lineAttributes(opts) {
  return {
    ...StrokeAttributes,
    stroke: opts.color,
    'stroke-width': opts.width,
    'stroke-dasharray': {
      '-': 'none',
      '--': '5',
      '-.': '3, 5, 1, 5',
      ':': '1'
    }[opts.style] ?? opts.style
  };
}

export function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle <= -Math.PI) angle += Math.PI * 2;

  return angle;
}

export function textAttributes(opts) {
  return {
    ...TextAttributes,
    'fill': opts.color ?? '#000',
    'font-family': opts.font ?? 'sans-serif',
    'font-size': opts.size,
    'font-weight': opts.weight ?? 400
  };
}
