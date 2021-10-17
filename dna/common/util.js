export function getTextMetrics(font, size, text) {
  let canvas = getTextMetrics.canvas || (getTextMetrics.canvas = document.createElement('canvas'));
  let context = canvas.getContext('2d');
  context.font = `${size}px ${font}`;

  return context.measureText(text);
}
