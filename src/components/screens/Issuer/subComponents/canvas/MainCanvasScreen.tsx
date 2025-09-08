import React, { useRef, useState, useEffect } from 'react';
import { Canvas, Rect } from 'fabric';
import * as fabric from 'fabric';
import { useLocation, useNavigate } from 'react-router-dom';
import Image from './CredentialTemplate/Image';
import DeleteComponent from './DeleteComponent';
import Sidebar from './Sidebar/Sidebar';
import { handleMoving, clearGuideLines } from './Snapping';
import LayerList from './LayerList';
import Export from './Export';
import axios from 'axios';

const MainCanvasScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { width, height,certId } = location.state || {};

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [check, setCheck] = useState(false);
  const [guideLines, setGuideLines] = useState([]);
  const [sidebarImages, setSidebarImages] = useState<string[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);


  useEffect(() => {
    if (!width || !height || !certId) {
      navigate('/');
      return;
    }

    fabric.Object.prototype.toObject = (function(toObject) {
      return function(this: fabric.Object, propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat('originalFilePath');
        return toObject.call(this, propertiesToInclude);
      };
    })(fabric.Object.prototype.toObject);

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
  }, [width, height,certId]);

  useEffect(() => {
    const originalToObject = fabric.Object.prototype.toObject;
    fabric.Object.prototype.toObject = function (propertiesToInclude = []) {
      return originalToObject.call(this, [...propertiesToInclude, 'id', 'customType', 'fieldName', 'certificateId']);
    };
  
  
  }, []);

  const saveCanvasToDB=async()=>{
     if (!canvas || !certId) return;
    const start=performance.now();
    const canvasJSON = canvas.toJSON();

    try {
      await axios.put(`http://localhost:3001/certificate/${certId}`, {
        canvasData: canvasJSON
      });
      console.log("Canvas saved to DB");
      const end=performance.now();
      console.log(`Save time: ${(end - start).toFixed(2)} ms`);
      alert("Canvas saved!");
    } catch (err) {
      console.error("Error saving canvas:", err);
      alert("Failed to save!");
    }
    

  }

  const handleZoom =(direction:'in'|'out') => {
    const zoomFactor=direction==='in'?1.1:0.9;
    const newZoom = zoomLevel * zoomFactor;
    
    if (newZoom > 3 || newZoom < 0.5) return;
    
    setZoomLevel(newZoom);
    
    if (canvasContainerRef.current) {
      const currentTransform = canvasContainerRef.current.style.transform;
      const translateMatch = currentTransform.match(/translateX\(([^)]+)\)/);
      const currentTranslate = translateMatch ? translateMatch[1] : '-50%';
      
      canvasContainerRef.current.style.transform = `translateX(${currentTranslate}) scale(${newZoom})`;
      canvasContainerRef.current.style.transformOrigin = 'center top';
      
      const padding = 20 / newZoom; 
      canvasContainerRef.current.style.padding = `0 ${Math.max(10, padding)}px`;
    }
  };

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
      <div className="min-h-screen flex"> 
        <Sidebar sidebarImages={sidebarImages} canvas={canvas} certId={certId} />
      </div>
     
      <div className="flex-1 overflow-auto relative"> 
        <div ref={canvasContainerRef} className="absolute"
          style={{ top: '20%', left: '50%', transform: 'translateX(-50%) scale(1)',transition: 'transform 0.1s ease',willChange: 'transform',padding: '0 20px' }}>
            
            <div style={{ position: 'relative',width: `${width}px`,height: `${height}px`,margin: '0 auto' }}>
                <canvas ref={canvasRef} width={width} height={height}/>
            </div>
            <div style={{height:'50px'}}/>

        </div>
  
        <button onClick={addRectangle} className="absolute bg-red-500 px-4 py-2 rounded" style={{ bottom: '50%', right: '20%' }}>
          Add Rectangle
        </button>
        <button
          onClick={() => {
            if (canvas) {
              const json = canvas.toJSON();
              console.log(JSON.stringify(json, null, 2));
            }
          }}
          className="absolute bg-green-600 px-4 py-2 text-white rounded"
          style={{ bottom: '40%', right: '20%' }}
        >
          Log JSON
        </button>
        <Export canvas={canvas} />
  
        <div className="absolute top-4 right-4">
          <button  onClick={() =>handleZoom('in')} className="bg-blue-500 text-white">
            Zoom In
          </button>
          <button onClick={() =>handleZoom('out')} className="bg-blue-500 text-white">
            Zoom Out 
          </button>
          <div className="text-center text-sm">
            Zoom: {Math.round(zoomLevel*100)}%
          </div>
        </div>
  
        {canvas && (
          <Image canvas={canvas} check={check} s={setCheck} certId={certId} addImageToSide={handleAddSidebarImage}/>
        )}
  
        <div className="absolute right-1/5 top-1/5">
          <DeleteComponent canvas={canvas} canvasRef={canvasRef} onDelete={handleFlush} />
        </div>
        <div>
          <button 
          className='rounded bg-blue-500 hover:bg-blue-800 cursor-pointer px-4 py-2 absolute right-1/5 top-4/5'
            onClick={saveCanvasToDB}
          >
            Save
          </button>
        </div>
        <LayerList canva={canvas}/>
      </div>
    </div>
  );
};

export default MainCanvasScreen;