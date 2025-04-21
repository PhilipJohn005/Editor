import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CanvasSetup = () => {
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  const navigate = useNavigate();

  const handleStart = (w: number, h: number) => {
    navigate('/editor', { state: { width: w, height: h } });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-blue-100">
      <h1 className="text-xl font-bold">Enter Canvas Size</h1>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Width"
          value={width}
          onChange={(e) => setWidth(parseInt(e.target.value))}
          className="p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Height"
          value={height}
          onChange={(e) => setHeight(parseInt(e.target.value))}
          className="p-2 border rounded"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleStart(width, height)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Start Canvas
        </button>
        <button
          onClick={() => handleStart(595, 842)}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          A4 Portrait
        </button>
        <button
          onClick={() => handleStart(842, 595)}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          A4 Landscape
        </button>
      </div>
    </div>
  );
};

export default CanvasSetup;
