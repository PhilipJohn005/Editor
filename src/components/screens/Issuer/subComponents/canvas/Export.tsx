import React from 'react';
import { jsPDF } from 'jspdf';
import canvasJson from '../Sample-json.json';

const Export = ({ canvas }) => {
  const handleExport = async () => {
   

    const originalCanvas = canvas.getElement();
    const originalWidth = originalCanvas.width;
    const originalHeight = originalCanvas.height;

    const scale = window.devicePixelRatio || 2;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = originalWidth * scale;
    exportCanvas.height = originalHeight * scale;

    exportCanvas.style.width = `${originalWidth}px`;
    exportCanvas.style.height = `${originalHeight}px`;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get export canvas context');
      return;
    }

    ctx.scale(scale, scale);
    ctx.drawImage(originalCanvas, 0, 0);

    const imageData = exportCanvas.toDataURL('image/png');

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = doc.getImageProperties(imageData);
    const pageWidth = doc.internal.pageSize.getWidth() - 20; // padding
    const imgRatio = imgProps.height / imgProps.width;
    const displayWidth = pageWidth;
    const displayHeight = displayWidth * imgRatio;

    doc.addImage(imageData, 'PNG', 10, 10, displayWidth, displayHeight, undefined, 'FAST');
    doc.save('canvas_pdf.pdf');

  };

  const loadImageElement = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));

      img.src = src;
    });
  };

  const imageToDataURL = (img: HTMLImageElement): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return reject('Canvas context error');

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/png'));
    });
  };

  return (
    <div>
      <button
        onClick={handleExport}
        className="absolute bg-green-600 text-white rounded px-4 py-2 hover:cursor-pointer"
        style={{ bottom: '30%', right: '20%' }}
      >
        Export
      </button>
    </div>
  );
};

export default Export;