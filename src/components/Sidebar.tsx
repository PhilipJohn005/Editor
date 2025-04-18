import { useState } from 'react'
import * as fabric from 'fabric'

type MenuItem = {
  id: string
  label: string
  icon: string
}

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'library', label: 'Library', icon: '📚' },
]

export default function SidebarWithMiniPanel({sidebarImages,canvas}) {
  const [activePage, setActivePage] = useState<string | null>(null)

  const addingImage=(imageUrl)=>{
    const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
    
                imageElement.onload = function () {
                    const image = new fabric.Image(imageElement, {
                        hasBorders: true,
                        hasControls: true,
                        selectable: true,
                        lockScalingFlip: true, 
                    });
    
                    const scaleFactor = Math.min(
                        (canvas.width! * 0.8) / image.width!,
                        (canvas.height! * 0.8) / image.height!
                    );
                    image.scale(scaleFactor);
    
                    // Center image and add to canvas
                    image.set({
                        left: (canvas.width! - image.width! * scaleFactor) / 2,
                        top: (canvas.height! - image.height! * scaleFactor) / 2,
                    });
                    canvas.add(image);
                canvas.renderAll();
                }
  }

  const renderMiniPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <div className="bg-blue-100 w-96 h-full p-4">
            <h2 className="text-xl font-bold mb-2">🏠 Home Page</h2>
            <p>This is some content for the home panel.</p>
          </div>
        )
        case 'library':
          return (
            <div className="bg-green-100 w-96 h-full p-4 overflow-y-auto">
              <h2 className="text-xl font-bold mb-2">📚 Library</h2>
              <p>Click or drag images to add to the canvas.</p>
        
              <div className="grid grid-cols-2 gap-2 mt-4">
                {sidebarImages.map((url,i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Library item ${i}`}
                    className="w-full max-h-40 object-contain cursor-pointer rounded border border-gray-300 hover:scale-105 transition-transform"
                    onClick={() => addingImage(url)} 
                    draggable
                    onDragStart={(e) => {e.dataTransfer.setData("text/plain", url)}}
                    onDragEnd={() => addingImage(url)}
                  />
                ))}
              </div>
            </div>
          )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-24 flex flex-col items-center py-6 gap-8">
        <div className="text-2xl font-bold">🌟</div>
        <nav className="flex flex-col items-center gap-8 w-full">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center text-sm transition-colors ${
                activePage === item.id
                  ? 'text-yellow-400'
                  : 'hover:text-gray-300'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Mini Page Content Panel */}
      {activePage && (
        <div className="border-l border-gray-300 shadow-lg">
          {renderMiniPage()}
        </div>
      )}
    </div>
  )
}
