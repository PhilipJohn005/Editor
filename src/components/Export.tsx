import React from 'react';
import { jsPDF } from 'jspdf';
import canvasJson from '../Sample-json.json';

const Export = ({canvas}) => {
  const handleExport = async () => {
    try {
      const objects = canvasJson.objects;

      if (!objects || !Array.isArray(objects)) {
        console.error('Invalid canvas JSON structure');
        return;
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
      });

      const pxToMm = 0.264583;
      const dpiRatio = window.devicePixelRatio || 1;

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
          type
        } = obj;

        const actualWidth = width * scaleX;
        const actualHeight = height * scaleY;

        let x = left * pxToMm;
        let y = top * pxToMm;
        const w = actualWidth * pxToMm;
        const h = actualHeight * pxToMm;

        if (originX === 'center') x -= w / 2;
        if (originY === 'center') y -= h / 2;

        if (type.toLowerCase() === 'image') {
          try {
            if (obj.src) {
              const imageData = await loadImageFromSrc(obj.src);

              if (angle !== 0) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  const rad = angle * Math.PI / 180;
                  const sin = Math.abs(Math.sin(rad));
                  const cos = Math.abs(Math.cos(rad));
                  const canvasWidth = (w * cos + h * sin);
                  const canvasHeight = (w * sin + h * cos);

                  // Scale canvas for better image quality
                  canvas.width = canvasWidth * dpiRatio;
                  canvas.height = canvasHeight * dpiRatio;
                  canvas.style.width = `${canvasWidth}mm`;
                  canvas.style.height = `${canvasHeight}mm`;
                  
                  ctx.scale(dpiRatio, dpiRatio);
                  ctx.imageSmoothingQuality = 'high';

                  // Fill background and rotate
                  ctx.fillStyle = 'white';
                  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                  ctx.translate(canvasWidth / 2, canvasHeight / 2);
                  ctx.rotate(rad);
                  
                  // Draw image with original dimensions
                  ctx.drawImage(
                    imageData, 
                    -w/2, 
                    -h/2, 
                    w, 
                    h
                  );

                  // Calculate precise position adjustments
                  const xOffset = originX === 'center' ? 0 : (canvasWidth - w)/2;
                  const yOffset = originY === 'center' ? 0 : (canvasHeight - h)/2;

                  doc.addImage(
                    canvas.toDataURL('image/jpeg', 1.0), // Maximum quality
                    'JPEG', 
                    x - xOffset, 
                    y - yOffset, 
                    canvasWidth,
                    canvasHeight
                  );
                }
              } else {
                // For non-rotated images, maintain original quality
                doc.addImage(
                  imageData, 
                  'JPEG', 
                  x, 
                  y, 
                  w, 
                  h,
                  undefined,
                  'FAST',
                  0
                );
              }
            }
          } catch (err) {
            console.error('Image load error:', err);
          }
        }
      }

      doc.save('canvas_from_json.pdf');
    } catch (error) {
      console.error('Export failed:', error);
    }

      /*const imgData=canvas.toDataURL({
        format:'png',
        quality:1
      })

      const doc=new jsPDF();
      doc.addImage(imgData, 'PNG', 10, 10, 180, 160, undefined, 'FAST', 0);
      doc.save('ot.pdf')*/
  };

  const loadImageFromSrc = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Maintain original image dimensions for quality
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
          
          const resultImg = new Image();
          resultImg.src = canvas.toDataURL('image/jpeg', 1.0);
          resultImg.onload = () => resolve(resultImg);
        } else {
          reject('Canvas context error');
        }
      };
      img.onerror = () => {
        console.error('Failed to load image:', src);
        reject(`Failed to load image: ${src}`);
      };
      img.src = src;
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