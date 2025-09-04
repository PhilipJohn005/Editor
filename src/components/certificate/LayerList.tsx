import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/button';

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
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null);

  const moveSelectedLayer = (direction: 'up' | 'down') => {
    if (!selectedLayer || !canva) return;

    const objects = canva.getObjects();
    const object = objects.find((obj) => obj.id === selectedLayer);
    if (!object) return;

    const currentIndex = objects.indexOf(object);

    if (direction === 'up' && currentIndex < objects.length - 1) {
      [objects[currentIndex], objects[currentIndex + 1]] = [objects[currentIndex + 1], objects[currentIndex]];
    } else if (direction === 'down' && currentIndex > 0) {
      [objects[currentIndex], objects[currentIndex - 1]] = [objects[currentIndex - 1], objects[currentIndex]];
    }

    canva.remove(...objects);
    objects.forEach((obj) => canva.add(obj));

    canva.updateZIndices();
    canva.setActiveObject(object);
    canva.renderAll();
    updateButtonPosition(object);
  };

  const addIdToObject = (object: fabric.Object) => {
    if (!object.id) {
      object.id = `${object.type}_${Date.now()}`;
    }
  };

  fabric.Canvas.prototype.updateZIndices = function () {
    const objects = this.getObjects();
    objects.forEach((obj, index) => {
      addIdToObject(obj);
      obj.zIndex = index;
    });
  };

  const updateButtonPosition = (object: fabric.Object) => {
    if (!canva || !object) return;

    const bound = object.getBoundingRect();
    const canvasEl = canva.getElement();

    if (canvasEl instanceof HTMLCanvasElement) {
      const rect = canvasEl.getBoundingClientRect();
      setButtonPosition({
        top: rect.top + bound.top - 50, 
        left: rect.left + bound.left + bound.width / 2 - 50, 
      });
    }
  };

  const handleObjectSelected = (e: any) => {
    const selectedObject = e.selected ? e.selected[0] : null;
    if (selectedObject) {
      setSelectedLayer(selectedObject.id || null);
      updateButtonPosition(selectedObject);
    } else {
      setSelectedLayer(null);
      setButtonPosition(null);
    }
  };

  useEffect(() => {
    if (!canva) return;

    const updatePosition = () => {
      const active = canva.getActiveObject();
      if (active) updateButtonPosition(active);
    };

    canva.on('object:added', () => canva.updateZIndices());
    canva.on('object:modified', updatePosition);
    canva.on('object:moving', updatePosition);
    canva.on('selection:created', handleObjectSelected);
    canva.on('selection:updated', handleObjectSelected);
    canva.on('selection:cleared', () => {
      setSelectedLayer(null);
      setButtonPosition(null);
    });

    return () => {
      canva.off('object:added');
      canva.off('object:modified');
      canva.off('object:moving');
      canva.off('selection:created');
      canva.off('selection:updated');
      canva.off('selection:cleared');
    };
  }, [canva]);

  return (
    <>
      {buttonPosition && selectedLayer && (
        <div
          className='fixed z-50 flex gap-2'
          style={{ top: buttonPosition.top, left: buttonPosition.left }}
        >
          <Button
            size="sm"
            onClick={() => moveSelectedLayer('up')}
            className="bg-green-500 hover:bg-green-600"
          >
            Move Up
          </Button>
          <Button
            size="sm"
            onClick={() => moveSelectedLayer('down')}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            Move Down
          </Button>
        </div>
      )}
    </>
  );
};

export default LayerList;