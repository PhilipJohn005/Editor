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
      render: (ctx, left, top) => {
        ctx.save();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "#3BD4A6";
        ctx.roundRect(left - 7, top - 7, 14, 14, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      },
    });
  });
}

function applyLayerControls(obj: fabric.Object) {
 
  obj.controls.layerUp = new fabric.Control({
    x: 0.5,             //this is wrt ot object height and width and not canvas and pixel .. so 0.5 is 505 of object widht and + means right  and y-> -0.5 means 50% object height...together is top right corner...rest is done by offests
    y: -0.5,
    offsetY: -20,
    offsetX: -20,
    cursorStyle: "pointer",

    mouseUpHandler: (_, transform) => {
      moveLayer(transform.target, "up");   
    },

    render: (ctx, left, top, styleOverride, o) => {
      const size = 18;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(o.angle || 0));

      ctx.beginPath();
      ctx.moveTo(0,size/2);
      ctx.lineTo(0,-size/4)

      ctx.lineTo(-size/3,0)
      ctx.moveTo(0,-size/4);
      ctx.lineTo(size/3,0);

      ctx.stroke();
      ctx.restore();
    },
  });

  
  obj.controls.layerDown = new fabric.Control({
    x: 0.75,
    y: -0.5,
    offsetY: -15,
    
    cursorStyle: "pointer",

    mouseUpHandler: (_, transform) => {
      moveLayer(transform.target, "down"); 
    },

    render: (ctx, left, top, styleOverride, o) => {
      const size = 18;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(o.angle || 0));

    

      ctx.beginPath();
      ctx.moveTo(0, -size / 2);     
      ctx.lineTo(0, size / 4);     
   
      ctx.lineTo(size / 3, 0);    
      ctx.moveTo(0, size / 4);      
      ctx.lineTo(-size / 3, 0);     

      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },
  });
}
