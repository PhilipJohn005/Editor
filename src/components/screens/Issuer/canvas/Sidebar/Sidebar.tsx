import { useState, useEffect } from 'react'
import * as fabric from 'fabric'
import demoqr from '@/assets/demoqr.png'
import signurl from '@/assets/sign.jpeg'
import StaticTextPanel from './MiniPanels/StaticTextPanel'
import DynamicTextPanel from './MiniPanels/DynamicTextPanel'
import SignaturePanel from './MiniPanels/SignaturePanel'
import QRCodePanel from './MiniPanels/QRCodePanel'
import LibraryPanel from './MiniPanels/LibraryPanel'
import { menuItems } from './handlers/type-interfaceHandler'
import SidebarMenu from './SidebarMenu'


type SidebarWithMiniPanelProps = {
  sidebarImages: string[];
  canvas: fabric.Canvas;
  certId: string;
};

export default function SidebarWithMiniPanel({ sidebarImages, canvas, certId }: SidebarWithMiniPanelProps) {
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



  const handleTextPropertyChange = async(property: string, value: any) => {
    if (!selectedTextObj) return
    selectedTextObj.set(property, value)
    canvas.renderAll()
    const updates = {
      [property]: value
    };

  }


  const renderMiniPage = () => {
    switch (activePage) {
      case 'library':
        return (
          <LibraryPanel
            canvas={canvas}
            sidebarImages={sidebarImages}
            certId={certId}
          />
        )
      case 'staticText':
        return (
          <StaticTextPanel 
            canvas={canvas}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fillColor={fillColor}
            setSelectedTextObj={setSelectedTextObj}
            certId={certId}
            />
        )
      case 'dynamicText':
        return (
          <DynamicTextPanel 
            canvas={canvas}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fillColor={fillColor}
            setSelectedTextObj={setSelectedTextObj}
            certId={certId}
          />
        )
      case 'digitalSign':
        return (
          <SignaturePanel
            canvas={canvas}
            signurl={signurl}
            certId={certId}
          />
        )
      case 'qrCode':
        return (
          <QRCodePanel
            canvas={canvas}
            demoqr={demoqr}
            certId={certId}
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
          <label className="text-sm">
            Justify:
            <select
                className="ml-2 border p-1"
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
          </label>
        </div>
      )}
    </div>
  )
}
