import { Line } from 'fabric';

const SNAP_DISTANCE = 10;
const RELEASE_DISTANCE = 14;
const GUIDELINE_OFFSET = 1;

// per-object snap state
const snapState = new WeakMap<any, { x: number | null; y: number | null }>();

import { Circle, Rect } from "fabric";

export function drawDebugOverlay(canvas, obj) {
  // clear old debug objects
  canvas.getObjects().forEach(o => {
    if (o.debug === true) canvas.remove(o);
  });

  const rect = obj.getBoundingRect(true);

  // 🔵 origin (obj.left / obj.top)
  const originDot = new Circle({
    left: obj.left,
    top: obj.top,
    radius: 4,
    fill: "blue",
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  (originDot as any).debug = true;

  // 🟡 bounding rect top-left
  const rectDot = new Circle({
    left: rect.left,
    top: rect.top,
    radius: 4,
    fill: "yellow",
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  (rectDot as any).debug = true;

  // 🟥 bounding rectangle
  const bbox = new Rect({
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    fill: "rgba(255,0,0,0.08)",
    stroke: "red",
    strokeDashArray: [4, 4],
    selectable: false,
    evented: false,
  });
  (bbox as any).debug = true;

  // 🟢 bounding center
  const centerDot = new Circle({
    left: rect.left + rect.width / 2,
    top: rect.top + rect.height / 2,
    radius: 4,
    fill: "green",
    originX: "center",
    originY: "center",
    selectable: false,
    evented: false,
  });
  (centerDot as any).debug = true;

  canvas.add(bbox, originDot, rectDot, centerDot);
  canvas.requestRenderAll();
}


export const handleMoving = (canvas, obj, guideLines, setGuideLines) => {
  if (!obj) return;

  let state = snapState.get(obj);
  if (!state) {
    state = { x: null, y: null };
    snapState.set(obj, state);
  }

  const zoom = canvas.getZoom?.() || 1;
  const snap = SNAP_DISTANCE / zoom;
  const release = RELEASE_DISTANCE / zoom;

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const rect = obj.getBoundingRect(true);
  const left = rect.left;
  const top = rect.top;
  const right = left + rect.width;
  const bottom = top + rect.height;
  const centerX = left + rect.width / 2;
  const centerY = top + rect.height / 2;

  let newGuideLines = [];

  let targetLeft = obj.left;
  let targetTop = obj.top;
  //drawDebugOverlay(canvas, obj); //remove this

  /* ================= X AXIS ================= */

  if (state.x === null) {
    if (Math.abs(left) < snap) {
      targetLeft = obj.left - left; // Move object so left edge aligns with 0
      state.x = targetLeft;
      addV(canvas, 0, 'vertical-left', newGuideLines);
    } else if (Math.abs(right - canvasWidth) < snap) {
      targetLeft = obj.left + (canvasWidth - right); // Move object so right edge aligns with canvasWidth
      state.x = targetLeft;
      addV(canvas, canvasWidth - GUIDELINE_OFFSET, 'vertical-right', newGuideLines);
    } else if (Math.abs(centerX - canvasWidth / 2) < snap) {
      targetLeft = obj.left + (canvasWidth / 2 - centerX); // Move object so center aligns with canvas center
      state.x = targetLeft;
      addV(canvas, canvasWidth / 2, 'vertical-center', newGuideLines);
    }
  } else {
    if (Math.abs(obj.left - state.x) > release) {
      state.x = null;
    } else {
      targetLeft = state.x;
    }
  }

  /* ================= Y AXIS ================= */

  if (state.y === null) {
    if (Math.abs(top) < snap) {
      targetTop = obj.top - top; // Move object so top edge aligns with 0
      state.y = targetTop;
      addH(canvas, 0, 'horizontal-top', newGuideLines);
    } else if (Math.abs(bottom - canvasHeight) < snap) {
      targetTop = obj.top + (canvasHeight - bottom); // Move object so bottom edge aligns with canvasHeight
      state.y = targetTop;
      addH(canvas, canvasHeight - GUIDELINE_OFFSET, 'horizontal-bottom', newGuideLines);
    } else if (Math.abs(centerY - canvasHeight / 2) < snap) {
      targetTop = obj.top + (canvasHeight / 2 - centerY); // Move object so center aligns with canvas center
      state.y = targetTop;
      addH(canvas, canvasHeight / 2, 'horizontal-center', newGuideLines);
    }
  } else {
    if (Math.abs(obj.top - state.y) > release) {
      state.y = null;
    } else {
      targetTop = state.y;
    }
  }

  if (targetLeft !== obj.left || targetTop !== obj.top) {
    obj.set({ left: targetLeft, top: targetTop });
    obj.setCoords();
    setGuideLines(newGuideLines);
  }

  // clear ONLY when fully unsnapped
  if (state.x === null && state.y === null) {
    clearGuideLines(canvas);
  }
};

/* ================= HELPERS ================= */

const addV = (canvas, x, id, arr) => {
  if (!guidelineExists(canvas, id)) {
    const l = createVerticalGuideline(canvas, x, id);
    canvas.add(l);
    canvas.requestRenderAll();
    arr.push(l);
  }
};

const addH = (canvas, y, id, arr) => {
  if (!guidelineExists(canvas, id)) {
    const l = createHorizontalGuideline(canvas, y, id);
    canvas.add(l);
    canvas.requestRenderAll();
    arr.push(l);
  }
};

export const createVerticalGuideline = (canvas, x, id) =>
  new Line([x, -10, x, canvas.height + 10], guideStyle(id));

export const createHorizontalGuideline = (canvas, y, id) =>
  new Line([-10, y, canvas.width + 10, y], guideStyle(id));

const guideStyle = (id) => ({
  id,
  stroke: 'red',
  strokeWidth: 1,
  selectable: false,
  evented: false,
  strokeDashArray: [5, 5],
  opacity: 0.8,
});

export const clearGuideLines = (canvas) => {
  canvas.getObjects().forEach((o) => {
    if (o.id?.startsWith('vertical-') || o.id?.startsWith('horizontal-')) {
      canvas.remove(o);
    }
  });
};

const guidelineExists = (canvas, id) =>
  canvas.getObjects().some((o) => o.id === id);