import { useState, useEffect } from 'react'
import * as fabric from 'fabric'

type MenuItem = {
  id: string
  label: string
  icon: string
  subItems?: { id: string; label: string }[]
}

const menuItems: MenuItem[] = [
  { id: 'library', label: 'Library', icon: '📚' },
  {
    id: 'text', label: 'Text', icon: '📝', subItems: [
      { id: 'staticText', label: 'Static Text' },
      { id: 'dynamicText', label: 'Dynamic Text' }
    ]
  },
  {
    id: 'verification', label: 'Verification', icon: '✅', subItems: [
      { id: 'digitalSign', label: 'Digital Sign' },
      { id: 'qrCode', label: 'QR Code' }
    ]
  }
]

export default function SidebarWithMiniPanel({ sidebarImages, canvas }) {
  const [activePage, setActivePage] = useState<string | null>(null)
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({})
  const [selectedTextObj, setSelectedTextObj] = useState<fabric.Textbox | null>(null)
  const [fontSize, setFontSize] = useState(24)
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fillColor, setFillColor] = useState('#000000')

  useEffect(() => {
    if (!canvas) return

    const handleSelection = () => {
      const activeObj = canvas.getActiveObject()
      if (activeObj && activeObj.type === 'textbox') {
        setSelectedTextObj(activeObj as fabric.Textbox)
        setFontSize((activeObj as fabric.Textbox).fontSize || 24)
        setFontFamily((activeObj as fabric.Textbox).fontFamily || 'Arial')
        setFillColor((activeObj as fabric.Textbox).fill as string || '#000000')
      } else {
        setSelectedTextObj(null)
      }
    }

    canvas.on('selection:created', handleSelection)
    canvas.on('selection:updated', handleSelection)
    canvas.on('selection:cleared', () => setSelectedTextObj(null))

    return () => {
      canvas.off('selection:created', handleSelection)
      canvas.off('selection:updated', handleSelection)
      canvas.off('selection:cleared', () => setSelectedTextObj(null))
    }
  }, [canvas])

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleAddText = () => {
    const text = new fabric.Textbox("Hello", {
      fill: fillColor,
      fontSize: fontSize,
      fontFamily: fontFamily,
      editable: true,
    })
    canvas.add(text)
    canvas.setActiveObject(text)

    setSelectedTextObj(text)
  }

  const handleTextPropertyChange = (property: string, value: any) => {
    if (!selectedTextObj) return
    selectedTextObj.set(property, value)
    canvas.renderAll()
  }

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
    }
  }

  const renderMiniPage = () => {
    switch (activePage) {
      case 'library':
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
            <button className='bg-amber-300 cursor-pointer rounded p-4' onClick={handleAddText}>Add Text</button>
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
    <div className="relative flex h-full bg-gray-800">
      {/* Sidebar */}
      <div className="text-white w-28 flex flex-col py-6 gap-4 px-2 h-full">
        <div className="text-2xl font-bold text-center">🌟</div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() =>
                  item.subItems ? toggleMenu(item.id) : setActivePage(item.id)
                }
                className={`${item.id === 'verification' ? 'px-3 py-2 left-0 hover:bg-gray-700' : 'w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-700'} ${activePage === item.id ? 'bg-gray-700 text-yellow-300' : ''}`}>
                <span className="flex items-center gap-2 text-sm">
                  <span className="text-xl">{item.icon}</span> {item.label}
                </span>
              </button>
              {item.subItems && expandedMenus[item.id] && (
                <div className="ml-6 mt-1 flex flex-col gap-1">
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActivePage(sub.id)}
                      className={`text-sm text-left px-2 py-1 rounded hover:bg-gray-700 ${activePage === sub.id ? 'bg-gray-700 text-yellow-300' : 'text-white'}`}
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

      {activePage && (
        <div className="border-gray-300 shadow-lg h-full">
          {renderMiniPage()}
        </div>
      )}

      {selectedTextObj && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-white rounded border border-gray-300 flex gap-4 items-center">
          <label className="text-sm">
            Font Size:
            <input
              type="number"
              className="ml-2 border p-1"
              value={fontSize}
              onChange={(e) => {
                const size = parseInt(e.target.value)
                setFontSize(size)
                handleTextPropertyChange('fontSize', size)
              }}
            />
          </label>
          <label className="text-sm">
            Font Family:
            <select
              className="ml-2 border p-1"
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value)
                handleTextPropertyChange('fontFamily', e.target.value)
              }}
            >
              <option>Arial</option>
              <option>Verdana</option>
              <option>Times New Roman</option>
              <option>Courier New</option>
              <option>Georgia</option>
            </select>
          </label>
          <label className="text-sm">
            Fill Color:
            <input
              type="color"
              className="ml-2 border p-1"
              value={fillColor}
              onChange={(e) => {
                setFillColor(e.target.value)
                handleTextPropertyChange('fill', e.target.value)
              }}
            />
          </label>
        </div>
      )}
    </div>
  )
}
