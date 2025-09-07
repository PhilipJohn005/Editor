import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric'
import ProgressBar from './ProgressBar';
import { Button } from '@/components/ui/button';

interface CertificateImageProps {
  canvas: fabric.Canvas;
  check: boolean;
  s: (value: boolean) => void;
  certId: string | null;
  addImageToSide: (url: string) => void;
}

const CertificateImage: React.FC<CertificateImageProps> = ({canvas, check, s, certId, addImageToSide}) => {
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

      // Mock upload progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      const reader = new FileReader();
      reader.readAsDataURL(imgFile);
      reader.onload = async () => {
        const base64Url = reader.result as string;
        addImageToSide(base64Url);

        // Add image to canvas
        const img = new Image();
        img.src = base64Url;
        img.onload = () => {
          const fabricImage = new fabric.Image(img, {
            hasBorders: true,
            hasControls: true,
            selectable: true,
            lockScalingFlip: true,
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

          fabricImage.set({
            cornerColor: 'green',
            cornerSize: 12,
            transparentCorners: false,
            cornerStyle: 'circle',
          });

          canvas.renderAll();
          setUploading(false);
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
      <div className="absolute top-4 left-4">
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <Button asChild>
          <label htmlFor="image-upload" className="cursor-pointer">
            Upload Image
          </label>
        </Button>
      </div>
    </div>
  );
};

export default CertificateImage;