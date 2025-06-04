import React from 'react';
import { jsPDF } from 'jspdf';
import canvasJson from '../Sample-json.json';

const Export = ({ canvas }) => {
  const handleExport = async () => {
    /*try {
      const objects = canvasJson.objects;

      if (!objects || !Array.isArray(objects)) {
        console.error('Invalid canvas JSON structure');
        return;
      }

      // Canvas dimensions (should match your actual canvas size)
      const canvasWidth = 500;
      const canvasHeight = 500;

      // Create PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
      });

      // Get PDF page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Calculate scaling factor to fit canvas content on PDF page
      const scaleFactor = Math.min(
        (pageWidth - 20) / canvasWidth,
        (pageHeight - 20) / canvasHeight
      );

      // Center the content on the page
      const offsetX = (pageWidth - canvasWidth * scaleFactor) / 2;
      const offsetY = (pageHeight - canvasHeight * scaleFactor) / 2;

      // Process each object in the canvas
      for (const obj of objects) {
        const {
          left = 0,
          top = 0,
          width = 100,
          height = 50,
          angle = 0,
          scaleX = 1,
          scaleY = 1,
          originX = 'left',
          originY = 'top',
          type,
          src,
        } = obj;

        // Only process image objects with valid source
        if (type.toLowerCase() !== 'image' || !src) continue;

        try {
          const imgElement = await loadImageElement(src);

          // Calculate actual dimensions considering scale
          const actualWidth = width * scaleX;
          const actualHeight = height * scaleY;

          // Convert dimensions to mm
          const w = actualWidth * scaleFactor;
          const h = actualHeight * scaleFactor;

          // Calculate base position (top-left corner) in mm
          let x = left * scaleFactor + offsetX;
          let y = top * scaleFactor + offsetY;

          // Adjust for origin point
          if (originX === 'center') x -= w / 2;
          else if (originX === 'right') x -= w;

          if (originY === 'center') y -= h / 2;
          else if (originY === 'bottom') y -= h;

          if (angle !== 0) {
            // For rotated images, we need to create an offscreen canvas
            const rad = (angle * Math.PI) / 180;
            const sin = Math.sin(rad);
            const cos = Math.cos(rad);
            
            // Calculate rotated dimensions
            const rotatedWidth = Math.abs(actualWidth * cos) + Math.abs(actualHeight * sin);
            const rotatedHeight = Math.abs(actualWidth * sin) + Math.abs(actualHeight * cos);

            // Create offscreen canvas
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = Math.ceil(rotatedWidth);
            offscreenCanvas.height = Math.ceil(rotatedHeight);

            const ctx = offscreenCanvas.getContext('2d', { alpha: true });
            if (!ctx) throw new Error('Failed to get canvas context');

            ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

            // Calculate the center point of the rotated image
            const centerX = rotatedWidth / 2;
            const centerY = rotatedHeight / 2;

            // Draw rotated image to offscreen canvas
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rad);
            ctx.drawImage(
              imgElement,
              -actualWidth / 2,
              -actualHeight / 2,
              actualWidth,
              actualHeight
            );
            ctx.restore();

            // Calculate the origin offset based on the origin point
            let originOffsetX = 0;
            let originOffsetY = 0;

            if (originX === 'center') originOffsetX = w / 2;
            else if (originX === 'right') originOffsetX = w;

            if (originY === 'center') originOffsetY = h / 2;
            else if (originY === 'bottom') originOffsetY = h;

            // Calculate the rotated position of the origin point
            const rotatedOriginX = x + originOffsetX;
            const rotatedOriginY = y + originOffsetY;

            // The final position needs to account for the rotation center
            const finalX = rotatedOriginX - (rotatedWidth * scaleFactor / 2);
            const finalY = rotatedOriginY - (rotatedHeight * scaleFactor / 2);

            // Add rotated image to PDF
            doc.addImage(
              offscreenCanvas.toDataURL('image/png'),
              'PNG',
              finalX,
              finalY,
              rotatedWidth * scaleFactor,
              rotatedHeight * scaleFactor,
              undefined,
              'FAST'
            );
          } else {
            // For non-rotated images, simply add them to the PDF
            const imgData = await imageToDataURL(imgElement);
            doc.addImage(
              imgData,
              'PNG',
              x,
              y,
              w,
              h,
              undefined,
              'FAST'
            );
          }
        } catch (err) {
          console.error('Error processing image:', err);
        }
      }

      // Save the PDF
      doc.save('canvas_export.pdf');
    } catch (error) {
      console.error('Export failed:', error);
    }*/

       const originalCanvas = canvas.getElement();
    const originalWidth = originalCanvas.width;
    const originalHeight = originalCanvas.height;

    // Use higher pixel ratio for better quality rendering
    const scale = window.devicePixelRatio || 2;

    // Create high-DPI canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = originalWidth * scale;
    exportCanvas.height = originalHeight * scale;

    // Keep same visible size
    exportCanvas.style.width = `${originalWidth}px`;
    exportCanvas.style.height = `${originalHeight}px`;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get export canvas context');
      return;
    }

    // Scale drawing only, not visual size
    ctx.scale(scale, scale);
    ctx.drawImage(originalCanvas, 0, 0);

    // Convert to image
    const imageData = exportCanvas.toDataURL('image/png');

    // Create PDF
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
    doc.save('high_quality_canvas_export.pdf');

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
        Export from JSON File
      </button>
    </div>
  );
};

export default Export;