import * as fabric from 'fabric'
import { createSignature } from '../../handlers/createElement'


interface Props{
    canvas:fabric.Canvas,
    signurl:string,
    certId:string|null
}


const SignaturePanel = ({canvas,signurl,certId}:Props) => {
    
      const addSignToCanvas= async (signUrl:string)=>{
          const obj = await createSignature(canvas, certId, signurl);
          
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
