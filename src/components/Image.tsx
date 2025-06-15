import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import axios from 'axios';
import ProgressBar from  './progressbar';

interface ImageComponentProps {
  canvas: fabric.Canvas;
  check: boolean;
  s: (value: boolean) => void;
  setCertId:(value:string|null)=>void;
  addImageToSide: (url: string) => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ canvas, check, s, setCertId,addImageToSide }) => {
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
    const imgFile = e.target.files?.[0];

    if (!imgFile) {
      console.warn("No image selected.");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const response = await axios.get(`http://localhost:3001/get-presigned-url?filename=${imgFile.name}`);
      const { url } = response.data;

      await axios.put(url, imgFile, {
        headers: {
          'Content-Type': imgFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
          setProgress(percent);
          console.log(`Uploading... ${percent}%`);
        },
      });
      const certCreate = await axios.post('http://localhost:3001/certificate', {
      name: imgFile.name,
      width: 1123,   // A4 px width at 96dpi
      height: 794,   // A4 px height at 96dpi
      canvasData: {}, // initially empty
    });

    setUploading(false);
    const createdCert = certCreate.data;
    console.log("Created certificate ID:", createdCert._id);

    setCertId(createdCert._id)
    } catch(e){
      setUploading(false);
      console.log("Error Uploading to s3"+e);
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
          originalFilePath: (imgFile as File & { path?: string }).path || imgFile.name,
          id: crypto.randomUUID(),
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

        canvas.on('object:moving', function (e) {
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

        canvas.on('object:rotating', function (e) {
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
      {uploading && <ProgressBar progress={progress} />}
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
