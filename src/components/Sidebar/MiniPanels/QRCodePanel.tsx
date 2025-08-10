import * as fabric from 'fabric'



interface Props{
    canvas:fabric.Canvas;
    updateCanvasToDB:(obj:any)=>void;
    demoqr:string
}

const QRCodePanel = ({canvas,updateCanvasToDB,demoqr}:Props) => {

    const addQrToCanvas=(qrUrl:string)=>{
        const qrElement= new Image();
        qrElement.src=qrUrl
        qrElement.onload=function(){
          const qrImage=new fabric.Image(qrElement,{
            hasBorders: true,
            hasControls: true,
            selectable: true,
            lockScalingFlip: true,
            id: crypto.randomUUID(),
          })
    
          
          const scaleFactor = (canvas.width! * 0.2) / qrImage.width!;
          qrImage.scale(scaleFactor)
    
          qrImage.set({
            left: (canvas.width! - qrImage.getScaledWidth()) / 2,
            top: canvas.height! - qrImage.getScaledHeight() - 20,
          });
          canvas.add(qrImage)
          canvas.setActiveObject(qrImage)
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
          qrImage.on('moving', function () {
            qrImage.setCoords();
            const boundingRect = qrImage.getBoundingRect();
    
            if (boundingRect.left < 0) qrImage.left -= boundingRect.left;
            if (boundingRect.top < 0) qrImage.top -= boundingRect.top;
            if (boundingRect.left + boundingRect.width > canvas.width!) {
                qrImage.left -= (boundingRect.left + boundingRect.width - canvas.width!);
            }
            if (boundingRect.top + boundingRect.height > canvas.height!) {
                qrImage.top -= (boundingRect.top + boundingRect.height - canvas.height!);
            }
        });
        
        qrImage.on('rotating', function () {
            qrImage.setCoords();
        });
            updateCanvasToDB(qrImage);
    
        }
    
      }

  return (
    <div className="bg-blue-100 w-76 h-full p-4">
            <h2 className="text-xl font-bold mb-2">QR Code</h2>
            <p>QR code generation or scan option goes here.</p>
            <img key={'qr1'} 
            src={demoqr} 
            className="w-full max-h-40 object-contain cursor-pointer rounded border border-gray-300"
            onClick={()=>addQrToCanvas(demoqr)}
            />
    </div>
  )
}

export default QRCodePanel
