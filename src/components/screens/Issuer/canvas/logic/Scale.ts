import * as fabric from 'fabric';

export function scaleToFit(obj: fabric.Object, canvas: fabric.Canvas, factor = 0.8) {
  const scaleFactor = Math.min(
    (canvas.width! * factor) / (obj.width!),
    (canvas.height! * factor) / (obj.height!)
  );

  obj.scale(scaleFactor);
  obj.set({
    left: (canvas.width! - obj.getScaledWidth()) / 2,
    top: (canvas.height! - obj.getScaledHeight()) / 2,
  });

  obj.setCoords();
}
