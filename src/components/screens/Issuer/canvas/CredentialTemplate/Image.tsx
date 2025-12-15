
import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric'
import ProgressBar from '../ui/Progressbar';
import { uploadImageToS3 } from './handlers/uploadToS3';
import { addImageToCanvas } from './handlers/addImageToCanvas';

interface ImageComponentProps {
  canvas: fabric.Canvas;
  check: boolean;
  s: (value: boolean) => void;
  certId: string | null;
  addImageToSide: (url: string) => void;
}

const ImageComponent: React.FC<ImageComponentProps> = ({canvas,check,s,certId,addImageToSide}) => {
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

      const s3Url = await uploadImageToS3(imgFile, setProgress);

      const reader = new FileReader();
      reader.readAsDataURL(imgFile);
      reader.onload = async () => {
        const base64Url = reader.result as string;
        addImageToSide(base64Url);

        const fabricImage = await addImageToCanvas(canvas, base64Url, s3Url, certId, imgFile);

       
        setUploading(false);
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
