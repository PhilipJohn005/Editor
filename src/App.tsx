import React, { useRef, useState, useEffect } from 'react';
import { Canvas, Rect } from 'fabric';
import * as fabric from 'fabric';
import { useLocation, useNavigate } from 'react-router-dom';
import Image from './components/Image';
import DeleteComponent from './components/DeleteComponent';
import Sidebar from './components/Sidebar';
import { handleMoving, clearGuideLines } from './components/Snapping';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { width, height } = location.state || {};

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [check, setCheck] = useState(false);
  const [guideLines, setGuideLines] = useState([]);
  const [sidebarImages, setSidebarImages] = useState<string[]>([]);

  useEffect(() => {
    if (!width || !height) {
      navigate('/'); // fallback if state not passed
      return;
    }

    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width,
        height,
      });

      initCanvas.backgroundColor = '#fff';
      initCanvas.renderAll();
      setCanvas(initCanvas);

      initCanvas.on('object:moving', (event) =>
        handleMoving(initCanvas, event.target, guideLines, setGuideLines)
      );
      initCanvas.on('object:modified', () => clearGuideLines(initCanvas));

      return () => {
        initCanvas.dispose();
      };
    }
  }, [width, height]);

  const handleAddSidebarImage = (url: string) => {
    setSidebarImages((prev) => [...prev, url]);
  };

  const handleFlush = () => {
    setCheck(true);
  };

  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: '#D84D42',
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);

      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        activeObj.set({
          borderColor: 'red',
          cornerColor: 'green',
          cornerSize: 12,
          transparentCorners: false,
          cornerStyle: 'circle',
        });
      }

      canvas.renderAll();
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen flex"> 
      
      <div className="h-screen flex"> 
      <Sidebar sidebarImages={sidebarImages} canvas={canvas} />
    </div>
  
      <div className="flex-1 overflow-auto relative"> 
        <div
          className="absolute"
          style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}
        >
          <canvas ref={canvasRef} width={width} height={height} />
        </div>
  
        <button
          onClick={addRectangle}
          className="absolute bg-red-500 px-4 py-2 rounded"
          style={{ bottom: '50%', right: '20%' }}
        >
          Add Rectangle
        </button>
  
        <Image
          canvas={canvas}
          check={check}
          s={setCheck}
          addImageToSide={handleAddSidebarImage}
        />
  
        <div className="absolute right-1/5 top-1/5">
          <DeleteComponent canvas={canvas} canvasRef={canvasRef} onDelete={handleFlush} />
        </div>
      </div>
    </div>
  );
};

export default App;
