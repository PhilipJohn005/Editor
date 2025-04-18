import React,{ useRef,useState,useEffect } from 'react'
import { Canvas, Rect } from 'fabric';
import Video from './components/Video';
import Image from './components/Image';
import CanvasSettings from './components/CanvasSettings';
import DeleteComponent from './components/DeleteComponent';
import { handleMoving,clearGuideLines } from './components/Snapping';
import * as fabric from 'fabric'
import Sidebar from './components/Sidebar';
//import LayerList from './components/LayerList';


const App=()=>{
  const canvasRef=useRef(null);
  const [canvas,setCanvas]=useState<Canvas|null>(null);
  const [check,setCheck]=useState(false);
  const [guideLines,setGuideLines]=useState([]);
  const [sidebarImages, setSidebarImages] = useState<string[]>([])

  const handleAddSidebarImage = (url: string) => {
    setSidebarImages(prev =>[...prev,url])
  }


  const handleFlush=()=>{
    setCheck(true);
  }

  useEffect(()=>{
    if(canvasRef.current){
      const initCanvas=new Canvas(canvasRef.current,{
        width:500,
        height:500,
      });

      initCanvas.backgroundColor="#fff";

      initCanvas.renderAll();
      setCanvas(initCanvas);
    

      initCanvas.on("object:moving",(event)=>handleMoving(initCanvas,event.target,guideLines,setGuideLines));
      initCanvas.on("object:modified",()=>clearGuideLines(initCanvas));


      return()=>{
        initCanvas.dispose();
      }
    }
  },[]);

  const addRectangle=()=>{
    if(canvas){
      const rect=new Rect({
        top:100,
        left:50,
        width:100,
        height:60,
        fill:"#D84D42"
      });
      
      canvas.add(rect)
      canvas.item(0).set({
        borderColor: 'red',
        cornerColor: 'green',
        cornerSize:12,
        transparentCorners: false
      });
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

  }

  return (
    <div className='bg-gray-200 relative h-screen'>
      <div className="absolute" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}>
        <canvas ref={canvasRef} width={500} height={500} />
      </div>
      <div>
        <button onClick={addRectangle} className="absolute bg-red-500 px-4 py-2 rounded" style={{ bottom: '50%', right: '20%' }}>Click</button>
        <CanvasSettings canvas={canvas}/>
      </div>
      <Image canvas={canvas} check={check} s={setCheck} addImageToSide={handleAddSidebarImage}/>
      <div className='absolute right-1/5 top-1/5'>
        <DeleteComponent canvas={canvas} canvasRef={canvasRef} onDelete={handleFlush} />
      </div>
      <Sidebar sidebarImages={sidebarImages} canvas={canvas}/>
    </div>
    
  );
  
}

export default App
