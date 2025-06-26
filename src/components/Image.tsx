import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import axios from 'axios';
import ProgressBar from './Progressbar';

interface ImageComponentProps {
  canvas: fabric.Canvas;
  check: boolean;
  s: (value: boolean) => void;
  certId: string | null;
  addImageToSide: (url: string) => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  canvas,
  check,
  s,
  certId,
  addImageToSide
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (check && inputRef.current) {
      inputRef.current.value = '';
      s(false);
    }
  }, [check, s]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!certId) return;
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    try {
      setUploading(true);
      setProgress(0);

     
      const { data: { url } } = await axios.get(
        `http://localhost:3001/get-presigned-url?filename=${imgFile.name}`
      );

  
      await axios.put(url, imgFile, {
        headers: {
          'Content-Type': imgFile.type,
        },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / (event.total || 1));
          setProgress(percent);
        },
      });

      setUploading(false);

      
      const reader = new FileReader();
      reader.readAsDataURL(imgFile);

      reader.onload = () => {
        const base64Url = reader.result as string;
        addImageToSide(base64Url);

        const img = new Image();
        img.src = base64Url;

        img.onload = async () => {
          const s3ImageUrl = url.split('?')[0]; 

          const fabricImage = new fabric.Image(img, {
            hasBorders: true,
            hasControls: true,
            selectable: true,
            lockScalingFlip: true,
            originalFilePath: (imgFile as File & { path?: string }).path || imgFile.name,
            id: crypto.randomUUID(),
            src: s3ImageUrl,
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

          const serialized = fabricImage.toObject(['id', 'originalFilePath']) as any;
          serialized.src = s3ImageUrl;
          serialized.customType = 'image';

          await axios.post(
            `http://localhost:3001/certificate/${certId}/elements`,
            serialized
          );

          
          fabricImage.set({
            cornerColor: 'green',
            cornerSize: 12,
            transparentCorners: false,
            cornerStyle: 'circle',
          });

          canvas.renderAll();

          let prevLeft = 0,
            prevTop = 0,
            prevScaleX = 1,
            prevScaleY = 1;

          canvas.on('object:scaling', (e) => {
            const obj = e.target;
            if (!obj) return;
            obj.setCoords();
            const br = obj.getBoundingRect();
            if (
              br.left < 0 ||
              br.top < 0 ||
              br.left + br.width > canvas.width! ||
              br.top + br.height > canvas.height!
            ) {
              obj.set({
                left: prevLeft,
                top: prevTop,
                scaleX: prevScaleX,
                scaleY: prevScaleY,
              });
            } else {
              prevLeft = obj.left!;
              prevTop = obj.top!;
              prevScaleX = obj.scaleX!;
              prevScaleY = obj.scaleY!;
            }
          });

          canvas.on('object:moving', (e) => {
            const obj = e.target;
            if (!obj) return;
            obj.setCoords();
            const br = obj.getBoundingRect();
            if (
              br.left < 0 ||
              br.top < 0 ||
              br.left + br.width > canvas.width! ||
              br.top + br.height > canvas.height!
            ) {
              obj.set({
                left: prevLeft,
                top: prevTop,
                scaleX: prevScaleX,
                scaleY: prevScaleY,
              });
            } else {
              prevLeft = obj.left!;
              prevTop = obj.top!;
              prevScaleX = obj.scaleX!;
              prevScaleY = obj.scaleY!;
            }
          });

          canvas.on('object:rotating', (e) => {
            const obj = e.target;
            if (!obj) return;
            obj.setCoords();
            const br = obj.getBoundingRect();
            if (
              br.left < 0 ||
              br.top < 0 ||
              br.left + br.width > canvas.width! ||
              br.top + br.height > canvas.height!
            ) {
              obj.set({
                left: prevLeft,
                top: prevTop,
                scaleX: prevScaleX,
                scaleY: prevScaleY,
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
    } catch (e) {
      setUploading(false);
      console.error('Upload failed:', e);
    }
  };

  return (
    <div>
      {uploading && <ProgressBar progress={progress} />}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageUpload}
        className="cursor-pointer"
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
