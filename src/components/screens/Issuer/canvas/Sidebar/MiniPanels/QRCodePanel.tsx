import * as fabric from 'fabric'
import { createQRCode } from '../../handlers/createElement';


interface Props{
    canvas:fabric.Canvas;
    demoqr:string,
    certId: string | null
}



const QRCodePanel = ({canvas,demoqr,certId}:Props) => {

    const addQrToCanvas=async (qrUrl:string)=>{
          const obj = await createQRCode(canvas, certId, demoqr);
    
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
