import * as fabric from 'fabric'



interface Props{
    canvas:fabric.Canvas,
    updateCanvasToDB:(obj:any)=>void,
    signurl:string
}


const SignaturePanel = ({canvas,updateCanvasToDB,signurl}:Props) => {
    
      const addSignToCanvas=(signUrl:string)=>{
        const signElement=document.createElement('img');
        signElement.src=signUrl;
        signElement.onload=function (){
            const signImg=new fabric.Image(signElement,{
                hasBorders: true,
                hasControls: true,
                selectable: true,
                lockScalingFlip: true,
                id: crypto.randomUUID(),
            })
        
            const scaleFactor = (canvas.width! * 0.2) / signImg.width!;
            
            signImg.scale(scaleFactor)
        
            signImg.set({
                left: (canvas.width! - signImg.getScaledWidth())-10,
                top: canvas.height! - signImg.getScaledHeight() - 20,
            });
            canvas.add(signImg)
            canvas.setActiveObject(signImg)
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
            signImg.on('moving', function () {
                signImg.setCoords();
                const boundingRect = signImg.getBoundingRect();
        
                if (boundingRect.left < 0) signImg.left -= boundingRect.left;
                if (boundingRect.top < 0) signImg.top -= boundingRect.top;
                if (boundingRect.left + boundingRect.width > canvas.width!) {
                signImg.left -= (boundingRect.left + boundingRect.width - canvas.width!);
                }
                if (boundingRect.top + boundingRect.height > canvas.height!) {
                signImg.top -= (boundingRect.top + boundingRect.height - canvas.height!);
                }
            });
            
            signImg.on('rotating', function () {
            signImg.setCoords();
            });
            updateCanvasToDB(signImg)
        }
    
      }


  return (
    <div className="bg-blue-100 w-76 h-full p-4">
            <h2 className="text-xl font-bold mb-2">Digital Signature</h2>
            <p>Signature pad or upload interface goes here.</p>
            <img key={'sign1'} 
            src={signurl} 
            className="w-full max-h-40 object-contain cursor-pointer rounded border border-gray-300"
            onClick={()=>addSignToCanvas(signurl)}
            />
    </div>
  )
}

export default SignaturePanel
