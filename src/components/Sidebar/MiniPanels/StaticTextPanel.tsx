import React from 'react';
import * as fabric from 'fabric';

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

        canvas.add(text);
        canvas.setActiveObject(text);
        setSelectedTextObj(text);

        updateCanvasToDB(text.toObject(['id', 'customType']));
  };

  return (
    <div className="bg-blue-100 w-76 h-full p-4">
      <h2 className="text-xl font-bold mb-2">Static Text</h2>
      <button className="bg-amber-300 cursor-pointer rounded p-4" onClick={handleStaticAddText}>Add Text</button>
    </div>
  );
};

export default StaticTextPanel;
