import * as fabric from 'fabric'


export function attachCanvasBoundaryGuards(
  canvas: fabric.Canvas,
  image: fabric.Image
) {
  let prevLeft = image.left || 0;
  let prevTop = image.top || 0;
  let prevScaleX = image.scaleX || 1;
  let prevScaleY = image.scaleY || 1;

  const enforceBounds = (e) => {
    const obj = e.target;
    if (!obj) return;
    obj.setCoords();
    const br = obj.getBoundingRect();

    if (
      br.left < 0 ||
      br.top < 0 ||
      br.left + br.width > canvas.width! ||
      br.top + br.height > canvas.height!
    ) {
      obj.set({
        left: prevLeft,
        top: prevTop,
        scaleX: prevScaleX,
        scaleY: prevScaleY,
      });
    } else {
      prevLeft = obj.left!;
      prevTop = obj.top!;
      prevScaleX = obj.scaleX!;
      prevScaleY = obj.scaleY!;
    }
  };

  canvas.on('object:scaling', enforceBounds);
  canvas.on('object:moving', enforceBounds);
  canvas.on('object:rotating', enforceBounds);
}
