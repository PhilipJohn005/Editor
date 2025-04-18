import React, { useEffect, useState } from 'react'
import { Canvas } from 'fabric';

const LayerList = (canvas) => {
  const [layers,setLayers]=useState([]);
  const [selectedLayer,setSelectedLayer]=useState(null)
  

    const addIdToObject=(object)=>{
        if(!object.id){
            const timestamp=new Date().getTime();
            object.id=`${object.type}_${timestamp}`;
        }
    }

    Canvas.prototype.updateZIndices=function(){
        const objects=this.getObjects();
        objects.forEach((obj,index) => {
           addIdToObject(obj);
           obj.zIndex=index;
        });
    
    }

    const updateLayers=()=>{
        if(canvas){
            canvas.updateZIndices();
            const objects=canvas.getObjects()
            .filter(
                (obj)=>
                    !(
                        obj.id.startsWith("vertical-") || obj.id.startsWith("horizontal-")
                    )
            )
            .map((obj)=>({
               id:obj.id,
                zIndex:obj.zIndex,
                type:obj.type
            }))
            setLayers([...objects].reverse());
        }
    }
    const handleObjectSelected=(e)=>{
        const selectedObject=e.selected?e.selected[0]:null;
        if(selectedObject){
            setSelectedLayer(selectedObject.id);
        }else{
            setSelectedLayer(null);
        }
    }
    
    const selectedLayerInCanvas=(layerId)=>{
        const object=canvas.getObjects().find((obj)=>obj.id===layerId)
        if(object){
            canvas.setActiveObject(object);
            canvas.renderAll();
        }
    }

    useEffect(()=>{
        if(canvas){
            canvas.on("object:added",updateLayers);
            canvas.on("object:removed",updateLayers);
            canvas.on("object:modified",updateLayers);
            canvas.on("object:created",handleObjectSelected);
            canvas.on("object:updated",handleObjectSelected);
            canvas.on("selection:cleared",()=>setSelectedLayer(null));

            
            
            updateLayers();

            return()=>{
                canvas.off("object:added",updateLayers);
                canvas.off("object:removed",updateLayers);
                canvas.off("object:modified",updateLayers);
                canvas.off("selection:created",handleObjectSelected);
                canvas.off("selection:updated",handleObjectSelected);
                canvas.off("selection:cleared",()=>setSelectedLayer(null));

            }
        }
    },[canvas]);

    return(
        <div>
            <ul>
                {layers.map((layer)=>(
                    <li key={layer.id} onClick={()=>selectedLayerInCanvas(layer.id)} className=''>
                        {layer.type}({layer.zIndex})
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default LayerList
