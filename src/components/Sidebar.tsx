import { useState } from 'react'
import * as fabric from 'fabric'

type MenuItem = {
  id: string
  label: string
  icon: string
  subItems?: { id: string; label: string }[]
}

const menuItems: MenuItem[] = [
  { id: 'library', label: 'Library', icon: '📚' },
  { id: 'text', label: 'Text', icon: '📝', subItems: [
    { id: 'staticText', label: 'Static Text' },
    { id: 'dynamicText', label: 'Dynamic Text' }
  ]},
  { id: 'verification', label: 'Verification', icon: '✅', subItems: [
    { id: 'digitalSign', label: 'Digital Sign' },
    { id: 'qrCode', label: 'QR Code' }
  ]}
]

export default function SidebarWithMiniPanel({ sidebarImages, canvas }) {
  const [activePage, setActivePage] = useState<string | null>(null)
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({})

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const addingImage = (imageUrl: string) => {
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
      case 'library':
        return (
          <div className="bg-green-100 w-76 h-full p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">📚 Library</h2>
            <p>Click or drag images to add to the canvas.</p>
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
      case 'staticText':
        return (
          <div className="bg-blue-100 w-76 h-full p-4">
            <h2 className="text-xl font-bold mb-2">Static Text</h2>
            <p>Static text editing UI goes here.</p>
          </div>
        )
      case 'dynamicText':
        return (
          <div className="bg-blue-100 w-76 h-full p-4">
            <h2 className="text-xl font-bold mb-2">Dynamic Text</h2>
            <p>Dynamic text editing UI goes here.</p>
          </div>
        )
      case 'digitalSign':
        return (
          <div className="bg-blue-100 w-76 h-full p-4">
            <h2 className="text-xl font-bold mb-2">Digital Signature</h2>
            <p>Signature pad or upload interface goes here.</p>
          </div>
        )
      case 'qrCode':
        return (
          <div className="bg-blue-100 w-76 h-full p-4">
            <h2 className="text-xl font-bold mb-2">QR Code</h2>
            <p>QR code generation or scan option goes here.</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-28 flex flex-col py-6 gap-4 px-2">
        <div className="text-2xl font-bold text-center">🌟</div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() =>
                  item.subItems ? toggleMenu(item.id) : setActivePage(item.id)
                }
                className={`${item.id==='verification' ?'px-3 py-2 left-0 hover:bg-gray-700':'w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-700'} ${activePage === item.id ? 'bg-gray-700 text-yellow-300' : ''}`}>
                
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-xl">{item.icon}</span> {item.label}
                </span>
                {item.subItems && (
                  <span>{expandedMenus[item.id] ? '' : ''}</span>
                )}
              </button>

              {item.subItems && expandedMenus[item.id] && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActivePage(sub.id)}
                      className={`text-sm text-left px-2 py-1 rounded hover:bg-gray-700 ${
                        activePage === sub.id ? 'bg-gray-700 text-yellow-300' : 'text-white'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mini Page */}
      {activePage && (
        <div className=" border-gray-300 shadow-lg">
          {renderMiniPage()}
        </div>
      )}
    </div>
  )
}
