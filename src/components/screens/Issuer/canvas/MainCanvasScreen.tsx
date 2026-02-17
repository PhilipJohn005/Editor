import React, { useRef, useState, useEffect } from 'react';
import { Canvas, Rect } from 'fabric';
import * as fabric from 'fabric';
import { useLocation, useNavigate } from 'react-router-dom';
import Image from './CredentialTemplate/Image';
import DeleteComponent from './ui/DeleteButton';
import Sidebar from './Sidebar/Sidebar';
import { handleMoving, clearGuideLines } from './logic/Snapping';
import LayerList from './ui/LayerList';
import Export from './ui/ExportPDF';
import axios from 'axios';
import rotate_icon from '@/assets/rotate.svg'
import { attachGlobalBoundaryGuards } from './logic/Boundary';
import { attachGlobalObjectStyling } from './logic/ObjectStyling';

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
      attachGlobalObjectStyling(initCanvas);
      initCanvas.on('object:moving', (event) =>
        handleMoving(initCanvas, event.target, guideLines, setGuideLines)
        
      );
      initCanvas.on('object:moving',(event)=>
        attachGlobalBoundaryGuards(initCanvas)
      )
      
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
      await axios.put(`/certificate/${certId}`, {
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

const rotateImg = new window.Image();
rotateImg.src = rotate_icon;

  const addRectangle = () => {
    if (!canvas) return;

    const rect = new Rect({
      top: 100,
      left: 50,
      width: 100,
      height: 60,
      fill: '#D84D42',
    });

    const existingMtr = rect.controls?.mtr; //move to reotate

    rect.controls.mtr = new fabric.Control({
      ...(existingMtr || {}),          
      x: 0,
      y: -0.5,                         
      offsetY: -40,                    
      withConnection: true,
      actionHandler: fabric.controlsUtils.rotationWithSnapping,
      cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
      render: (ctx, left, top, styleOverride, target) => {
        const size = 24;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(target.angle || 0));

        if (rotateImg.complete) {
          ctx.drawImage(rotateImg, -size / 2, -size / 2, size, size);
        }

        ctx.restore();
      },
    });
    rect.controls.layerUp = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -20,
      offsetX: -20,
      cursorStyle: "pointer",

      mouseUpHandler: (_, transform) => {
        const target = transform.target;
        const canvas = target.canvas;
        if (!canvas) return;

        const objs = canvas.getObjects();
        const index = objs.indexOf(target);

        if (index < objs.length - 1) {
          canvas.remove(target);
          canvas.insertAt(index + 1, target, true);  // FIXED
          canvas.renderAll();
        }
      },

      render: (ctx, left, top, styleOverride, obj) => {
        const size = 18; // instead of cornerSize
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(obj.angle || 0));

        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(0, -size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(-size / 2, size / 2);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();
        ctx.restore();
      },
    });
    rect.controls.layerDown = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: 5,    
      offsetX: -20,
      cursorStyle: "pointer",

      mouseUpHandler: (_, transform) => {
        const target = transform.target;
        const canvas = target.canvas;
        if (!canvas) return;

        const objs = canvas.getObjects();
        const index = objs.indexOf(target);

        if (index > 0) {
          canvas.remove(target);
          canvas.insertAt(index - 1, target, true);  // FIXED
          canvas.renderAll();
        }
      },

      render: (ctx, left, top, styleOverride, obj) => {
        const size = 18;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(obj.angle || 0));

        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(0, size / 2);
        ctx.lineTo(size / 2, -size / 2);
        ctx.lineTo(-size / 2, -size / 2);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();
        ctx.restore();
      },
    });


    canvas.add(rect);
    canvas.setActiveObject(rect);

    const roundedCornerControl = (controlName: string) => {
    rect.controls[controlName] = new fabric.Control({
      ...rect.controls[controlName],
      render: (ctx, left, top, styleOverride, obj) => {
        const radius = 7;

        ctx.save();
        ctx.beginPath();
        ctx.roundRect(left-6, top-6, 12,12,4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      },
    });
  };


  ["tl", "tr", "bl", "br", "mt", "ml", "mr", "mb"].forEach(roundedCornerControl);


    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      activeObj.set({
        borderColor: 'white',
        cornerColor: '#3BD4A6',
        cornerStrokeColor:'black',
        cornerSize: 12,
        transparentCorners: false,
      });
    }

    canvas.renderAll();

    if (!rotateImg.complete) {
      rotateImg.onload = () => {
        canvas.renderAll();
      };
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
            if (!canvas) return;
            const json = canvas.toJSON();

            json.canvasWidth = canvas.getWidth();
            json.canvasHeight = canvas.getHeight();

            json.objects = json.objects.map((obj: any, index: number) => {
              const fabricObj = canvas.getObjects()[index];

              const rect = fabricObj.getBoundingRect(true);

              const left = rect.left;
              const top = rect.top;
              const centerX = left + rect.width / 2;
              const centerY = top + rect.height / 2;

              return {
                ...obj,
                centerX,
                centerY,
                boundingWidth: rect.width,
                boundingHeight: rect.height,
              };
            });

            console.log(JSON.stringify(json, null, 2));
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
        
      </div>
    </div>
  );
};

export default MainCanvasScreen;