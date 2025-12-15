import * as fabric from 'fabric'
import { createLibraryImage } from '../../handlers/createElement';


interface Props{
    canvas:fabric.Canvas;
    sidebarImages:string[];
    certId:string | null
}


const LibraryPanel = ({canvas,sidebarImages,certId}:Props) => {
    const addingImage = async (imageUrl: string) => {
        const obj:any = await createLibraryImage(canvas, imageUrl,certId);
        
    }
    
      
  return (
    <div className="bg-green-100 w-76 h-full p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Library</h2>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {sidebarImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Library item ${i}`}
                  className="w-full max-h-40 object-contain cursor-pointer rounded border border-gray-300"
                  onClick={() => addingImage(url)}
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData("text/plain", url) }}
                  onDragEnd={() => addingImage(url)}
                />
              ))}
            </div>
          </div>
  )
}

export default LibraryPanel
