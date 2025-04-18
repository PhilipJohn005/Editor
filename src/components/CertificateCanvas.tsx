import { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import type { Canvas, IText, Image as FabricImage } from 'fabric/fabric-impl';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';

type Orientation = 'portrait' | 'landscape';

const CertificateCanvas = () => {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
    });
    setCanvas(initCanvas);

    return () => {
      initCanvas.dispose();
    };
  }, []);

  // Handle PDF upload and conversion
  const handlePdfUpload = async (file: File) => {
    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      
      const page = pdfDoc.getPages()[0];
      const { width, height } = page.getSize();
      setOrientation(width > height ? 'landscape' : 'portrait');
      
      // Create a temporary canvas to render PDF page
      const pdfCanvas = document.createElement('canvas');
      const pdfContext = pdfCanvas.getContext('2d');
      if (!pdfContext) return;
      
      pdfCanvas.width = width;
      pdfCanvas.height = height;
      
      // Simplified approach - in production, use pdf.js or similar
      pdfContext.fillStyle = '#ffffff';
      pdfContext.fillRect(0, 0, width, height);
      pdfContext.fillStyle = '#000000';
      pdfContext.font = '20px Arial';
      pdfContext.fillText('PDF Preview - Would render actual PDF in production', 50, 50);
      
      const dataUrl = pdfCanvas.toDataURL('image/jpeg');
      setPdfUrl(dataUrl);
      setImageUrl(dataUrl);
    } catch (error) {
      console.error('Error processing PDF:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgUrl = e.target?.result as string;
      setImageUrl(imgUrl);
      setPdfUrl(null);
      
      // Check orientation
      const img = new Image();
      img.onload = () => {
        setOrientation(img.width > img.height ? 'landscape' : 'portrait');
      };
      img.src = imgUrl;
    };
    reader.readAsDataURL(file);
  };

  // Dropzone configuration
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.type === 'application/pdf') {
          handlePdfUpload(file);
        } else {
          handleImageUpload(file);
        }
      }
    }
  });

  // Load image onto canvas
  useEffect(() => {
    if (!canvas || !imageUrl) return;
    
    canvas.clear();
    
    FabricImage.fromURL(imageUrl, (img: FabricImage) => {
      if (!canvas.width || !canvas.height || !img.width || !img.height) return;
      
      // Scale image to fit canvas while maintaining aspect ratio
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        scaleX: scale,
        scaleY: scale
      });
      
      canvas.add(img);
      canvas.renderAll();
    });
  }, [canvas, imageUrl]);

  // Add text to canvas
  const addText = () => {
    if (!canvas) return;
    
    const text = new IText('Double click to edit', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#000000',
      editable: true,
      hasControls: true
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    canvas.renderAll();
  };

  // Download the certificate
  const downloadCertificate = () => {
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });
    
    const link = document.createElement('a');
    link.download = 'certificate.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="certificate-generator">
      <div className="controls">
        <button onClick={addText}>Add Text</button>
        <button 
          onClick={downloadCertificate} 
          disabled={!imageUrl}
        >
          Download Certificate
        </button>
        
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag & drop a template (JPEG/PDF), or click to select</p>
        </div>
      </div>
      
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={orientation === 'landscape' ? 800 : 600}
          height={orientation === 'landscape' ? 600 : 800}
        />
      </div>
    </div>
  );
};

export default CertificateCanvas;