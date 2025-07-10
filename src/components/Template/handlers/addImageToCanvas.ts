import * as fabric from 'fabric'
import axios from 'axios';

export async function addImageToCanvas(
  canvas: fabric.Canvas,
  base64Url: string,
  s3Url: string,
  certId: string,
  file: File
): Promise<fabric.Image> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Url;

    img.onload = async () => {
      const fabricImage = new fabric.Image(img, {
        hasBorders: true,
        hasControls: true,
        selectable: true,
        lockScalingFlip: true,
        originalFilePath: (file as File & { path?: string }).path || file.name,
        id: crypto.randomUUID(),
        src: s3Url,
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
      serialized.src = s3Url;
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
      resolve(fabricImage);
    };
  });
}
