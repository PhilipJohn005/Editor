import * as fabric from 'fabric'
import { createDynamicText } from '../../handlers/createElement';

interface Props {
    canvas: fabric.Canvas;
    fillColor: string;
    fontSize: number;
    fontFamily: string;
    setSelectedTextObj: (obj: fabric.Textbox) => void;
    certId: string|null
}


const DynamicTextPanel = ({fillColor,fontSize,fontFamily,canvas,setSelectedTextObj,certId}:Props) => {
  const handleDynamicAddText=()=>{
    const obj = createDynamicText(canvas, certId, { fontSize, fontFamily, fillColor });
        setSelectedTextObj(obj)
        
  }    
  
      
  return (
    <div className="bg-blue-100 w-76 h-full p-4">
        <h2 className="text-xl font-bold mb-2">Dynamic Text</h2>
        <button className='bg-amber-300 cursor-pointer rounded p-4' onClick={handleDynamicAddText}>Add Text</button>
    </div>
  )
}

export default DynamicTextPanel
