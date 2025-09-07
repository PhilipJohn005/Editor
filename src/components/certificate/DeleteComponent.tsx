import React, { useEffect, useState } from 'react';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/button';

interface DeleteComponentProps {
  canvas: fabric.Canvas | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onDelete: () => void;
}

const DeleteComponent: React.FC<DeleteComponentProps> = ({canvas, canvasRef, onDelete}) => {
  const [deleteButtonPos, setDeleteButtonPos] = useState<{ top: number; left: number } | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

  useEffect(() => {
    if (!canvas) return;
  
    const updateDeleteButtonPosition = (e: any) => {
      const target = e.selected?.[0] ?? e.target;
      if (target && canvasRef.current){
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
        <div 
          className="fixed z-50"
          style={{ 
            top: deleteButtonPos.top, 
            left: deleteButtonPos.left,
            transform: 'translateZ(0)'
          }}
        >
          <Button 
            onClick={handleDelete} 
            variant="destructive"
            size="sm"
          >
            Delete
          </Button>
        </div>
      )}
    </>
  );
};

export default DeleteComponent;