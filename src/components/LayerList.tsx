import React, { useEffect, useState } from 'react'
import * as fabric from 'fabric';

declare module 'fabric' {
  interface Canvas {
    updateZIndices: () => void;
  }

  interface Object {
    zIndex?: number;
    id?: string;
  }
}

interface LayerListProps {
  canva: fabric.Canvas | null;
}

const LayerList: React.FC<LayerListProps> = ({ canva }) => {
  const [layers, setLayers] = useState<{ id: string; zIndex: number; type: string }[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);


    const moveSelectedLayer=(direction)=>{
        if(!selectedLayer)return;

        const objects=canva?.getObjects();
        const object=objects?.find((obj=>obj.id===selectedLayer));

        if(object){
            const currentIndex=objects?.indexOf(object);

            if(direction==="up" && currentIndex !== undefined && currentIndex < (objects?.length ?? 0) - 1){
                const temp=(objects ?? [])[currentIndex];
                (objects ?? [])[currentIndex]=(objects ?? [])[currentIndex+1];
                (objects ?? [])[currentIndex+1]=temp
            }else if(direction==="down" && currentIndex!==undefined && currentIndex>0){
                const temp=(objects ?? [])[currentIndex];
                (objects ?? [])[currentIndex]=(objects ?? [])[currentIndex-1];
                (objects ?? [])[currentIndex-1]=temp
            }


            const backgroudColour=canva?.backgroundColor;

            canva.clear();
            objects?.forEach((obj)=>canva?.add(obj));

            if (canva) {
                canva.backgroundColor = backgroudColour ?? '';
            }

            canva?.renderAll();

            objects?.forEach((obj,index)=>{
                obj.zIndex=index
            })
            canva?.setActiveObject(object);

            canva?.renderAll();

            updateLayers();
        }
    }

  const addIdToObject = (object: fabric.Object) => {
    if (!object.id) {
      const timestamp = new Date().getTime();
      object.id = `${object.type}_${timestamp}`;
    }
  };

  fabric.Canvas.prototype.updateZIndices = function () {
    const objects = this.getObjects();
    objects.forEach((obj, index) => {
      addIdToObject(obj);
      obj.zIndex = index;
    });
  };

  const updateLayers = () => {
    if (canva) {
      canva.updateZIndices();
      const objects = canva.getObjects()
        .filter(
          (obj) =>
            obj.id &&
            !obj.id.startsWith("vertical-") &&
            !obj.id.startsWith("horizontal-")
        )
        .map((obj) => ({
          id: obj.id!,
          zIndex: obj.zIndex!,
          type: obj.type
        }));
      setLayers([...objects].reverse());
    }
  };

  const handleObjectSelected = (e: any) => {
    const selectedObject = e.selected ? e.selected[0] : null;
    if (selectedObject) {
      setSelectedLayer(selectedObject.id || null);
    } else {
      setSelectedLayer(null);
    }
  };

  const selectedLayerInCanvas = (layerId: string) => {
    const object = canva?.getObjects().find((obj) => obj.id === layerId);
    if (object && canva) {
      canva.setActiveObject(object);
      canva.renderAll();
    }
  };

  useEffect(() => {
    if (canva) {
      canva.on("object:added", updateLayers);
      canva.on("object:removed", updateLayers);
      canva.on("object:modified", updateLayers);
      canva.on("selection:created", handleObjectSelected);
      canva.on("selection:updated", handleObjectSelected);
      canva.on("selection:cleared", () => setSelectedLayer(null));

      updateLayers();

      return () => {
        canva.off("object:added", updateLayers);
        canva.off("object:removed", updateLayers);
        canva.off("object:modified", updateLayers);
        canva.off("selection:created", handleObjectSelected);
        canva.off("selection:updated", handleObjectSelected);
        canva.off("selection:cleared", () => setSelectedLayer(null));
      };
    }
  }, [canva]);

  return (
    layers.length>0 && (
    <div className='bg-gray-400 w-32 relative m-5'>
        <div className='p-1 flex flex-row justify-between items-center'>
            <button className=' bg-green-400 rounded p-1 cursor-pointer' onClick={()=>moveSelectedLayer("up")} disabled={!selectedLayer || layers[0]?.id===selectedLayer} >up</button>
            <button className='bg-amber-300 rounded p-1 cursor-pointer' onClick={()=>moveSelectedLayer("down")} disabled={!selectedLayer || layers[layers.length-1]?.id===selectedLayer}>down</button>
        </div>

      <ul className='p-2 space-y-2'>
        {layers.map((layer) => (
          <li key={layer.id} onClick={() => selectedLayerInCanvas(layer.id)} className='cursor-pointer border border-white p-2'>
            {layer.type} (Z: {layer.zIndex})
          </li>
        ))}
      </ul>
    </div>)
  );
};

export default LayerList;
