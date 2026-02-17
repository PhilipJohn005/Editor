import * as fabric from 'fabric';
import axios from 'axios';
import { scaleToFit } from '../logic/Scale'; // you create this small helper

// ============ STATIC TEXT ===============
export function createStaticText(canvas: fabric.Canvas, certId: string | null, opts: {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fillColor?: string;
}) {
  const textObj = new fabric.Textbox(opts.text ?? "Hello", {
    fill: opts.fillColor ?? "#000",
    fontSize: opts.fontSize ?? 24,
    fontFamily: opts.fontFamily ?? "Arial",
    editable: true,
    id: crypto.randomUUID(),
    customType: "static",
  });

  scaleToFit(textObj as any, canvas, 0.2);

  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  canvas.renderAll();

  if (certId) {
    const payload = textObj.toObject(['id', 'customType']);
    axios.post(`/certificate/${certId}/elements`, payload);
  }

  return textObj;
}



// ============ DYNAMIC TEXT ===============
export function createDynamicText(canvas: fabric.Canvas, certId: string | null, opts: {
  fontSize?: number;
  fontFamily?: string;
  fillColor?: string;
}) {
  const textObj = new fabric.Textbox("{Hello}", {
    fill: opts.fillColor ?? "#000",
    fontSize: opts.fontSize ?? 24,
    fontFamily: opts.fontFamily ?? "Arial",
    editable: true,
    width: 200,
    left: 100,
    top: 100,
    hasControls: true,
    lockUniScaling: true,
    id: crypto.randomUUID(),
    customType: "dynamic",
  });

  let originalContent = "Hello";
  let isEditing = false;

  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  canvas.renderAll();

  textObj.on('editing:entered', () => {
    isEditing = true;
    textObj.set({ text: originalContent });
    canvas.renderAll();
  });

  textObj.on('editing:exited', () => {
    isEditing = false;
    originalContent = textObj.text.replace(/[{}]/g, '');
    textObj.set({ text: `{${originalContent}}` });
    canvas.renderAll();
  });

  textObj.on('changed', () => {
    if (isEditing) {
      const newText = textObj.text.replace(/[{}]/g, '');
      if (newText !== textObj.text) {
        textObj.set({ text: newText });
        canvas.renderAll();
      }
      originalContent = newText;
    }
  });

  textObj.on('scaling', () => {
    const scaleX = typeof textObj.scaleX === 'number' ? textObj.scaleX : 1;
    const newFontSize = (opts.fontSize ?? 24) * scaleX;
    textObj.set({
      fontSize: newFontSize,
      scaleX: 1,
      scaleY: 1,
      width: textObj.width! * (textObj.scaleX ?? 1),
    });
    canvas.renderAll();
  });

  if (certId) {
    const payload = textObj.toObject(['id', 'customType']);
    axios.post(`/certificate/${certId}/elements`, payload);
  }

  return textObj;
}



// ============ QR IMAGE ===============
export async function createQRCode(canvas: fabric.Canvas, certId: string | null, url: string) {
  const imgEl = new Image();
  imgEl.src = url;

  return new Promise((resolve) => {
    imgEl.onload = () => {
      const qrImg = new fabric.Image(imgEl, {
        hasBorders: true,
        hasControls: true,
        selectable: true,
        lockScalingFlip: true,
        id: crypto.randomUUID(),
        customType: "qr"
      });

      scaleToFit(qrImg as any, canvas, 0.2);
        qrImg.set({
            left: (canvas.width! - qrImg.getScaledWidth()) / 2,
            top: canvas.height! - qrImg.getScaledHeight() - 20,
          });
      canvas.add(qrImg);
      canvas.setActiveObject(qrImg);
      canvas.renderAll();

      if (certId) {
        const payload = qrImg.toObject(['id','customType']);
        axios.post(`/certificate/${certId}/elements`, payload);
      }

      resolve(qrImg);
    };
  });
}



// ============ SIGNATURE ===============
export async function createSignature(canvas: fabric.Canvas, certId: string | null, url: string) {
  const imgEl = new Image();
  imgEl.src = url;

  return new Promise((resolve) => {
    imgEl.onload = () => {
      const signImg = new fabric.Image(imgEl, {
        hasBorders: true,
        hasControls: true,
        selectable: true,
        lockScalingFlip: true,
        id: crypto.randomUUID(),
        customType: "signature"
      });

      scaleToFit(signImg as any, canvas, 0.2);
      signImg.set({
                left: (canvas.width! - signImg.getScaledWidth())-10,
                top: canvas.height! - signImg.getScaledHeight() - 20,
            });

      canvas.add(signImg);
      canvas.setActiveObject(signImg);
      canvas.renderAll();

      if (certId) {
        const payload = signImg.toObject(['id','customType']);
        axios.post(`/certificate/${certId}/elements`, payload);
      }

      resolve(signImg);
    };
  });
}



// ============ LIBRARY IMAGE (local only) ===============
export function createLibraryImage(canvas: fabric.Canvas, url: string,certId:string | null) {
  const imgEl = new Image();
  imgEl.src = url;

  return new Promise((resolve) => {
    imgEl.onload = () => {
      const img = new fabric.FabricImage(imgEl, {
        hasBorders: true,
        hasControls: true,
        selectable: true,
        lockScalingFlip: true,
        id: crypto.randomUUID(),
        customType: "library"
      });

      scaleToFit(img as any, canvas, 0.2);

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    if (certId) {
        const payload = img.toObject(['id','customType']);
        axios.post(`/certificate/${certId}/elements`, payload);
      }
      resolve(img);
    };
  });
}
