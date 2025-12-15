import * as fabric from 'fabric';

export function attachGlobalBoundaryGuards(canvas: fabric.Canvas) {
  canvas.on('object:moving', enforceBounds);
  canvas.on('object:scaling', enforceBounds);
  canvas.on('object:rotating', enforceBounds);
}

function enforceBounds(e: fabric.TEvent) {
  const obj = (e as any).target as fabric.Object | undefined;
  if (!obj || !obj.canvas) return;

  obj.setCoords();
  const canvas = obj.canvas;
  const br = obj.getBoundingRect();

  if (br.left < 0) {
    obj.left! -= br.left;
  }

  if (br.top < 0) {
    obj.top! -= br.top;
  }

  if (br.left + br.width > canvas.getWidth()) {
    obj.left! -= (br.left + br.width - canvas.getWidth());
  }

  if (br.top + br.height > canvas.getHeight()) {
    obj.top! -= (br.top + br.height - canvas.getHeight());
  }
}
