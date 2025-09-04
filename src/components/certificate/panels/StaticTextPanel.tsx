import React from 'react';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/button';

interface Props {
  canvas: fabric.Canvas;
  fillColor: string;
  fontSize: number;
  fontFamily: string;
  updateCanvasToDB: (obj: any) => void;
  setSelectedTextObj: (obj: fabric.Textbox) => void;
}

const StaticTextPanel = ({ canvas, fillColor, fontSize, fontFamily, updateCanvasToDB, setSelectedTextObj }: Props) => {
  
  const handleStaticAddText = () => {
    const text = new fabric.Textbox("Hello", {
      fill: fillColor,
      fontSize: fontSize,
      fontFamily: fontFamily,
      editable: true,
      id: crypto.randomUUID(),
      customType: "static",
    });
    
    const scaleFactor = (canvas.width! * 0.2) / text.width!;
    text.scale(scaleFactor)

    text.set({
      left: (canvas.width! - text.getScaledWidth()) / 2,
      top: canvas.height! - text.getScaledHeight() - 20,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      activeObj.set({
        cornerColor: 'green',
        cornerSize: 12,
        transparentCorners: false,
        cornerStyle: 'circle',
      });
    }
    
    text.on('moving', function () {
      text.setCoords();
      const boundingRect = text.getBoundingRect();

      if (boundingRect.left < 0) text.left -= boundingRect.left;
      if (boundingRect.top < 0) text.top -= boundingRect.top;
      if (boundingRect.left + boundingRect.width > canvas.width!) {
        text.left -= (boundingRect.left + boundingRect.width - canvas.width!);
      }
      if (boundingRect.top + boundingRect.height > canvas.height!) {
        text.top -= (boundingRect.top + boundingRect.height - canvas.height!);
      }
    });
    
    text.on('rotating', function () {
      text.setCoords();
    });
    
    setSelectedTextObj(text);
    updateCanvasToDB(text.toObject(['id', 'customType']));
  };

  return (
    <div className="bg-blue-100 w-76 h-full p-4">
      <h2 className="text-xl font-bold mb-4">Static Text</h2>
      <Button onClick={handleStaticAddText} className="w-full">
        Add Text
      </Button>
    </div>
  );
};

export default StaticTextPanel;