import React from 'react';
import * as fabric from 'fabric';
import { createStaticText } from '../../handlers/createElement';

interface Props {
  canvas: fabric.Canvas;
  fillColor: string;
  fontSize: number;
  fontFamily: string;
  setSelectedTextObj: (obj: fabric.Textbox) => void;
  certId: string|null
}

const StaticTextPanel = ({ canvas, fillColor, fontSize, fontFamily, setSelectedTextObj,certId }: Props) => {
  
    const handleStaticAddText = () => {
        const text=createStaticText(canvas,certId,{
          fillColor,
          fontSize,
          fontFamily
        })

        setSelectedTextObj(text);

  };

  return (
    <div className="bg-blue-100 w-76 h-full p-4">
      <h2 className="text-xl font-bold mb-2">Static Text</h2>
      <button className="bg-amber-300 cursor-pointer rounded p-4" onClick={handleStaticAddText}>Add Text</button>
    </div>
  );
};

export default StaticTextPanel;
