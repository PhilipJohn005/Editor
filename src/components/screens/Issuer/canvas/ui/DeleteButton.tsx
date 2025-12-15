import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';



const DeleteComponent= ({canvas,canvasRef,onDelete}) => {
  const [deleteButtonPos, setDeleteButtonPos]=useState<{ top: number; left: number } | null>(null);
  const [selectedObject, setSelectedObject]=useState<fabric.Object|null>(null);

  useEffect(() => {
    if (!canvas) return;
  
    const updateDeleteButtonPosition=(e)=>{
      const target=e.selected?.[0]??e.target;
      if (target&&canvasRef.current){
        setSelectedObject(target);
  
        const { left, top } = target.getBoundingRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();
  
        setDeleteButtonPos({
          left: canvasRect.left + left + (target.width ?? 0) + 10,
          top: canvasRect.top + top,
        });
      }
    };
  
    const clearDeleteButton = () => {
      setDeleteButtonPos(null);
      setSelectedObject(null);
    };
  
    // Attach event listeners
    canvas.on('selection:created', updateDeleteButtonPosition);
    canvas.on('selection:updated', updateDeleteButtonPosition);
    canvas.on('selection:cleared', clearDeleteButton);
    canvas.on('object:moving', updateDeleteButtonPosition);
  
    return () => {
      canvas.off('selection:created', updateDeleteButtonPosition);
      canvas.off('selection:updated', updateDeleteButtonPosition);
      canvas.off('selection:cleared', clearDeleteButton);
      canvas.off('object:moving', updateDeleteButtonPosition);
    };
  }, [canvas, canvasRef]);

  const handleDelete = () => {
    if (selectedObject && canvas) {
      canvas.remove(selectedObject);
      canvas.discardActiveObject();
      canvas.renderAll();
      setDeleteButtonPos(null);
      setSelectedObject(null);
       onDelete();
    }
  };

  return (
    <>
      {deleteButtonPos && (
        <button onClick={handleDelete} className=' bg-red-500' style={{transform:'translateZ(0)'}}>
          Delete
        </button>
      )}
    </>
  );
};

export default DeleteComponent;
