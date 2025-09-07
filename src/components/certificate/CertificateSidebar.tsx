import { useState, useEffect } from 'react'
import * as fabric from 'fabric'
import StaticTextPanel from './panels/StaticTextPanel'
import DynamicTextPanel from './panels/DynamicTextPanel'
import SignaturePanel from './panels/SignaturePanel'
import QRCodePanel from './panels/QRCodePanel'
import LibraryPanel from './panels/LibraryPanel'
import { menuItems } from './types/certificateTypes'
import SidebarMenu from './SidebarMenu'

// Demo assets - in a real app, these would come from your asset management system
const demoqr = 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
const signurl = 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=300&h=150&dpr=1'

type CertificateSidebarProps = {
  sidebarImages: string[];
  canvas: fabric.Canvas;
  certId: string;
};

export default function CertificateSidebar({ sidebarImages, canvas, certId }: CertificateSidebarProps) {
  const [activePage, setActivePage] = useState<string | null>(null)
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({})
  const [selectedTextObj, setSelectedTextObj] = useState<fabric.Textbox | null>(null)
  const [fontSize, setFontSize] = useState(24)
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fillColor, setFillColor] = useState('#000000')
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');

  useEffect(() => {
    if (!canvas) return

    const handleSelection = () => {
      const activeObj = canvas.getActiveObject()
      if (activeObj && activeObj.type === 'textbox') {
        setSelectedTextObj(activeObj as fabric.Textbox)
        const fs = parseInt((activeObj as fabric.Textbox).fontSize?.toString() || '24', 10);
        setFontSize(isNaN(fs) ? 24 : fs);
        setTextAlign(((activeObj as fabric.Textbox).textAlign as 'left' | 'center' | 'right' | 'justify') || 'left');
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

  const updateCanvasToDB = async (object: any) => {
    // Mock function - replace with actual API call when backend is available
    console.log('Would save to DB:', object);
  };

  const handleTextPropertyChange = async (property: string, value: any) => {
    if (!selectedTextObj) return
    selectedTextObj.set(property, value)
    canvas.renderAll()
    // Mock function - replace with actual API call when backend is available
    console.log('Would update object property:', property, value);
  }

  const renderMiniPage = () => {
    switch (activePage) {
      case 'library':
        return (
          <LibraryPanel
            canvas={canvas}
            updateCanvasToDB={updateCanvasToDB}
            sidebarImages={sidebarImages}
          />
        )
      case 'staticText':
        return (
          <StaticTextPanel 
            canvas={canvas}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fillColor={fillColor}
            updateCanvasToDB={updateCanvasToDB}
            setSelectedTextObj={setSelectedTextObj}
          />
        )
      case 'dynamicText':
        return (
          <DynamicTextPanel 
            canvas={canvas}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fillColor={fillColor}
            updateCanvasToDB={updateCanvasToDB}
            setSelectedTextObj={setSelectedTextObj}
          />
        )
      case 'digitalSign':
        return (
          <SignaturePanel
            canvas={canvas}
            updateCanvasToDB={updateCanvasToDB}
            signurl={signurl}
          />
        )
      case 'qrCode':
        return (
          <QRCodePanel
            canvas={canvas}
            updateCanvasToDB={updateCanvasToDB}
            demoqr={demoqr}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="relative flex h-full bg-gray-800">
      <SidebarMenu
        menuItems={menuItems}
        activePage={activePage}
        expandedMenus={expandedMenus}
        toggleMenu={toggleMenu}
        setActivePage={setActivePage}
      />

      {activePage && (
        <div className="border-gray-300 shadow-lg h-full">
          {renderMiniPage()}
        </div>
      )}

      {selectedTextObj && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg border border-gray-300 p-4 shadow-lg">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Font Size:</Label>
              <Input
                type="number"
                className="w-20"
                value={fontSize}
                onChange={(e) => {
                  const size = parseInt(e.target.value)
                  setFontSize(size)
                  handleTextPropertyChange('fontSize', size)
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Font:</Label>
              <select
                className="border rounded px-2 py-1 text-sm"
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
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Color:</Label>
              <input
                type="color"
                className="w-8 h-8 border rounded cursor-pointer"
                value={fillColor}
                onChange={(e) => {
                  setFillColor(e.target.value)
                  handleTextPropertyChange('fill', e.target.value)
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Align:</Label>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={textAlign}
                onChange={(e) => {
                  setTextAlign(e.target.value as 'left' | 'center' | 'right' | 'justify');
                  handleTextPropertyChange("textAlign", e.target.value as 'left' | 'center' | 'right' | 'justify');
                }}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}