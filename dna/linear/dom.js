export function createElement(tag, attributes = {}, contents) {
  let element = ['circle', 'clipPath', 'defs', 'foreignObject', 'g', 'pattern', 'path', 'rect', 'svg', 'text', 'textPath'].includes(tag)
    ? document.createElementNS('http://www.w3.org/2000/svg', tag)
    : document.createElement(tag);

  setAttributes(element, attributes);

  if (typeof contents === 'string') {
    element.innerHTML = contents;
  } else if (Array.isArray(contents)) {
    for (let child of contents) {
      element.appendChild(child);
    }
  }

  return element;
}

export function setAttributes(element, attributes) {
  for (let [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
}

export function getTextMetrics(font) {
  let size = 100;
  let canvas = getTextMetrics.canvas || (getTextMetrics.canvas = document.createElement('canvas'));
  let context = canvas.getContext('2d');
  context.font = `${size}px ${font}`;

  let metrics = context.measureText('T');

  return {
    ascent: metrics.actualBoundingBoxAscent / size,
    descent: metrics.actualBoundingBoxDescent / size,
    width: metrics.width / size
  };
}
