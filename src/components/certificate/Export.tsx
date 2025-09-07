import React from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';

interface ExportProps {
  canvas: fabric.Canvas | null;
}

const Export: React.FC<ExportProps> = ({ canvas }) => {
  const handleExport = async () => {
    if (!canvas) return;

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
    const pageWidth = doc.internal.pageSize.getWidth() - 20;
    const imgRatio = imgProps.height / imgProps.width;
    const displayWidth = pageWidth;
    const displayHeight = displayWidth * imgRatio;

    doc.addImage(imageData, 'PNG', 10, 10, displayWidth, displayHeight, undefined, 'FAST');
    doc.save('certificate.pdf');
  };

  return (
    <div className="absolute bottom-8 right-8">
      <Button
        onClick={handleExport}
        className="bg-green-600 hover:bg-green-700"
        size="lg"
      >
        Export PDF
      </Button>
    </div>
  );
};

export default Export;