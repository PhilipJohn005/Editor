import * as fabric from 'fabric'



interface Props{
    canvas:fabric.Canvas;
    updateCanvasToDB:(obj:any)=>void;
    sidebarImages:string[]
}


const LibraryPanel = ({canvas,updateCanvasToDB,sidebarImages}:Props) => {
    const addingImage = (imageUrl: string) => {
        const imageElement = document.createElement('img')
        imageElement.src = imageUrl
        imageElement.onload = function () {
          const image = new fabric.Image(imageElement, {
            hasBorders: true,
            hasControls: true,
            selectable: true,
            lockScalingFlip: true,
          })
    
          const scaleFactor = Math.min(
            (canvas.width! * 0.8) / image.width!,
            (canvas.height! * 0.8) / image.height!
          )
          image.scale(scaleFactor)
    
          image.set({
            left: (canvas.width! - image.width! * scaleFactor) / 2,
            top: (canvas.height! - image.height! * scaleFactor) / 2,
          })
          canvas.add(image)
          canvas.setActiveObject(image)
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
          image.on('moving', function () {
            image.setCoords();
            const boundingRect = image.getBoundingRect();
    
            if (boundingRect.left < 0) image.left -= boundingRect.left;
            if (boundingRect.top < 0) image.top -= boundingRect.top;
            if (boundingRect.left + boundingRect.width > canvas.width!) {
                image.left -= (boundingRect.left + boundingRect.width - canvas.width!);
            }
            if (boundingRect.top + boundingRect.height > canvas.height!) {
                image.top -= (boundingRect.top + boundingRect.height - canvas.height!);
            }
        });
        
        image.on('rotating', function () {
            image.setCoords();
        });
            updateCanvasToDB(image)
    
        }
    
      }
  return (
    <div className="bg-green-100 w-76 h-full p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">📚 Library</h2>
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
