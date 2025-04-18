import React, { useState, useEffect } from 'react';

const CanvasSettings = ({canvas}) => {
  const [canvasWidth, setCanvasWidth] = useState("500");
  const [canvasHeight, setCanvasHeight] = useState("500");

  useEffect(() => {
    if (canvas) {
      canvas.setWidth(parseInt(canvasWidth, 10) || 0);
      canvas.setHeight(parseInt(canvasHeight, 10) || 0);
      canvas.renderAll();
    }
  }, [canvasHeight,canvasWidth,canvas]);

  const handleWidthChange=(e)=>{
    const value = e.target.value.replace(/,/g, "");
    setCanvasWidth(value);
  };

  const handleHeightChange=(e)=>{
    const value = e.target.value.replace(/,/g,"");
    setCanvasHeight(value);
  };

  return (
    <div className="bg-amber-300 p-4 rounded-lg flex flex-col absolute right-1/5 gap-3 w-64 mx-auto">
    <input 
      type="text" 
      value={canvasWidth} 
      onChange={handleWidthChange} 
      placeholder="Width" 
      className="p-2 border border-gray-400 rounded-md"
    />
    <input 
      type="text" 
      value={canvasHeight} 
      onChange={handleHeightChange} 
      placeholder="Height" 
      className="p-2 border border-gray-400 rounded-md "
    />
  </div>

  );
};

export default CanvasSettings;
