import * as fabric from "fabric";

export function moveLayer(target: fabric.Object, direction: "up" | "down") {
  const canvas = target.canvas;
  if (!canvas) return;

  const objects = canvas.getObjects();
  const selected = target;
  const currentIndex = objects.indexOf(selected);

  if (direction === "up" && currentIndex < objects.length - 1) {
    [objects[currentIndex], objects[currentIndex + 1]] =
      [objects[currentIndex + 1], objects[currentIndex]];
  } else if (direction === "down" && currentIndex > 0) {
    [objects[currentIndex], objects[currentIndex - 1]] =
      [objects[currentIndex - 1], objects[currentIndex]];
  }

  canvas.remove(...objects);
  objects.forEach((obj) => canvas.add(obj));

  canvas.setActiveObject(selected);
  canvas.renderAll();
}
