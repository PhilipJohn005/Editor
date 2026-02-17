import * as fabric from "fabric";
import rotate_icon from "@/assets/rotate.svg";
import { moveLayer } from "./moveLayer"; 
import upArrow_icon from '@/assets/upArrow.png'


const rotateImg = new Image();
rotateImg.src = rotate_icon;

const upArrow= new Image();
upArrow.src=upArrow_icon;


export function attachGlobalObjectStyling(canvas: fabric.Canvas) {
  canvas.on("selection:created", applyStylesToActive);
  canvas.on("selection:updated", applyStylesToActive);
  canvas.on("object:added", (e) => {
    if (e.target) applyControls(e.target);
  });
}

function applyStylesToActive(e: any) {
  const obj = e.selected?.[0] ?? e.target;
  if (!obj) return;

  applyControls(obj);
  applyDefaultAppearance(obj);
  obj.canvas?.renderAll();
}

function applyDefaultAppearance(obj: fabric.Object) {
  obj.set({
    borderColor: "white",
    cornerColor: "#3BD4A6",
    cornerStrokeColor: "black",
    cornerSize: 12,
    transparentCorners: false,
  });
}

function applyControls(obj: fabric.Object) {
  applyRotateControl(obj);
  applyRoundedCornerControls(obj);
  applyLayerControls(obj);  
}


function applyRotateControl(obj: fabric.Object) {
  const existing = obj.controls?.mtr;

  obj.controls.mtr = new fabric.Control({
    ...(existing || {}),
    withConnection: false,
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    render: (ctx, left, top, styleOverride, target) => {
      const size = 24;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(target?.angle || 0));
      if (rotateImg.complete) ctx.drawImage(rotateImg, -size / 2, -size / 2, size, size);
      ctx.restore();
    },
  });
}

function applyRoundedCornerControls(obj: fabric.Object) {
  const names = ["tl", "tr", "bl", "br", "mt", "ml", "mr", "mb"];

  names.forEach((name) => {
    obj.controls[name] = new fabric.Control({
      ...(obj.controls[name] || {}),

      cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,

      render: (ctx, left, top, styleOverride, target) => {
        ctx.save();
        // move to control center
        ctx.translate(left, top);

        // rotate WITH object (same as rotate control)
        ctx.rotate(fabric.util.degreesToRadians(target.angle || 0));

        ctx.strokeStyle = "black";
        ctx.fillStyle = "#3BD4A6";

        // draw RELATIVE to center
        ctx.roundRect(-7, -7, 14, 14, 4);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      },
    });
  });
}

function layerControlPosition(
  side: "up" | "down",
  target: fabric.Object
) {
  const center = target.getCenterPoint();

 
  const halfW = (target.getScaledWidth() ?? 0) / 2;
  const halfH = (target.getScaledHeight() ?? 0) / 2;

  const gap = 24; 

  
  const x = 
    side=="up"?
      center.x + halfW: 
      center.x + halfW + gap
  const y = center.y - halfH - 1.5* gap

  return new fabric.Point(x, y);
}

function layerUpPosition(dim: any, finalMatrix: number[], target: fabric.Object) {
  return layerControlPosition("up", target);
}

function layerDownPosition(dim: any, finalMatrix: number[], target: fabric.Object) {
  return layerControlPosition("down", target);
}


function applyLayerControls(obj: fabric.Object) {
 
  obj.controls.layerUp = new fabric.Control({
    /*x: 0.5,             //this is wrt ot object height and width and not canvas and pixel .. so 0.5 is 505 of object widht and + means right  and y-> -0.5 means 50% object height...together is top right corner...rest is done by offests
    y: -0.5,
    offsetY: -20,
    offsetX: -20,
    cursorStyle: "pointer",*/

    positionHandler:layerUpPosition,
    cursorStyle:"pointer",
    mouseUpHandler: (_, transform) => {
      moveLayer(transform.target, "up");   
    },

    render:drawUpArrow
  });

  
  obj.controls.layerDown = new fabric.Control({
   positionHandler:layerDownPosition,
    cursorStyle:"pointer",
    mouseUpHandler: (_, transform) => {
      moveLayer(transform.target, "down"); 
    },

    render: drawDownArrow
  });
}



function drawUpArrow(ctx: CanvasRenderingContext2D, left: number, top: number) {
  const size = 18;
  ctx.save();
  ctx.translate(left, top);

  ctx.beginPath();
  ctx.moveTo(0, size / 2);
  ctx.lineTo(0, -size / 2);
  ctx.lineTo(-size / 3, 0);
  ctx.moveTo(0, -size / 2);
  ctx.lineTo(size / 3, 0);

  ctx.stroke();
  ctx.restore();
}

function drawDownArrow(ctx: CanvasRenderingContext2D, left: number, top: number) {
  const size = 18;
  ctx.save();
  ctx.translate(left, top);

  ctx.beginPath();
  ctx.moveTo(0, -size / 2);
  ctx.lineTo(0, size / 2);
  ctx.lineTo(size / 3, 0);
  ctx.moveTo(0, size / 2);
  ctx.lineTo(-size / 3, 0);

  ctx.stroke();
  ctx.restore();
}
