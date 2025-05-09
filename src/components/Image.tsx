import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';


interface ImageComponentProps {
  canvas: fabric.Canvas;
  check: boolean;
  s: (value: boolean) => void;
  addImageToSide: (url: string) => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ canvas, check, s, addImageToSide }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (check && inputRef.current) {
      inputRef.current.value = '';
      s(false);
    }
  }, [check, s]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];

    if (!imgFile) {
      console.warn("No image selected.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(imgFile); 

    reader.onload = () => {
      const imageUrl = reader.result as string; 
      addImageToSide(imageUrl);  

      console.log("Base64 Image URL loaded:", imageUrl);

      const img = new Image();
      img.src = imageUrl;  

      img.onload = () => {
        const fabricImage = new fabric.Image(img, {
          hasBorders: true,
          hasControls: true,
          selectable: true,
          lockScalingFlip: true,
          originalFilePath: (imgFile as any).path || imgFile.name,
          id:crypto.randomUUID(),
        });

        const scaleFactor = Math.min(
          (canvas.width! * 0.8) / fabricImage.width!,
          (canvas.height! * 0.8) / fabricImage.height!
        );
        fabricImage.scale(scaleFactor);

        fabricImage.set({
          left: (canvas.width! - fabricImage.width! * scaleFactor) / 2,
          top: (canvas.height! - fabricImage.height! * scaleFactor) / 2,
        });

        canvas.add(fabricImage);
        canvas.setActiveObject(fabricImage);

        const activeObj = canvas.getActiveObject();
        if (activeObj) {
          activeObj.set({
            cornerColor: 'green',
            cornerSize: 12,
            transparentCorners: false,
            cornerStyle: 'circle',
          });
        }

        canvas.renderAll();

        let prevLeft = 0, prevTop = 0, prevScaleX = 1, prevScaleY = 1;

        canvas.on('object:scaling', function (e) {
          const obj = e.target;
          if (!obj) return;
          obj.setCoords();
          const br = obj.getBoundingRect();

          if (br.left < 0 || br.top < 0 || br.left + br.width > canvas.width! || br.top + br.height > canvas.height!) {
            obj.set({
              left: prevLeft,
              top: prevTop,
              scaleX: prevScaleX,
              scaleY: prevScaleY
            });
          } else {
            prevLeft = obj.left!;
            prevTop = obj.top!;
            prevScaleX = obj.scaleX!;
            prevScaleY = obj.scaleY!;
          }
        });

        canvas.on('object:moving', function(e){
          const obj = e.target;
          if (!obj) return;
          obj.setCoords();
          const br = obj.getBoundingRect();

          if (br.left < 0 || br.top < 0 || br.left + br.width > canvas.width! || br.top + br.height > canvas.height!) {
            obj.set({
              left: prevLeft,
              top: prevTop,
              scaleX: prevScaleX,
              scaleY: prevScaleY
            });
          } else {
            prevLeft = obj.left!;
            prevTop = obj.top!;
            prevScaleX = obj.scaleX!;
            prevScaleY = obj.scaleY!;
          }
        });

        canvas.on('object:rotating', function(e){
          const obj = e.target;
          if (!obj) return;
          obj.setCoords();
          const br = obj.getBoundingRect();

          if (br.left < 0 || br.top < 0 || br.left + br.width > canvas.width! || br.top + br.height > canvas.height!) {
            obj.set({
              left: prevLeft,
              top: prevTop,
              scaleX: prevScaleX,
              scaleY: prevScaleY
            });
          } else {
            prevLeft = obj.left!;
            prevTop = obj.top!;
            prevScaleX = obj.scaleX!;
            prevScaleY = obj.scaleY!;
          }
        });
      };
 
    };

  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageUpload}
        className='cursor-pointer'
        style={{
          position: 'absolute',
          top: '10%',
          left: '40%',
          backgroundColor: 'blue',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
};

export default ImageComponent;