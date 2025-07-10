export type MenuItem = {
  id: string
  label: string
  icon: string
  subItems?: { id: string; label: string }[]
}

export const menuItems: MenuItem[] = [
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

export type SidebarWithMiniPanelProps = {
  sidebarImages: string[];
  canvas: fabric.Canvas;
  certId: string;
}

export interface PanelPropsBase {
  canvas: fabric.Canvas;
  updateCanvasToDB: (obj: any) => void;
}

export interface TextPanelProps extends PanelPropsBase {
  fontSize: number;
  fontFamily: string;
  fillColor: string;
  setSelectedTextObj: (obj: fabric.Textbox) => void;
}

export interface SignaturePanelProps extends PanelPropsBase {
  signurl: string;
}

export interface QRCodePanelProps extends PanelPropsBase {
  demoqr: string;
}

export interface LibraryPanelProps extends PanelPropsBase {
  sidebarImages: string[];
}
