import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CertificateSetup from './components/screens/CertificateSetup'
import CertificateEditor from './components/screens/CertificateEditor'
import CanvasSetup from './CanvasSetup'
import LandingPage from './components/LandingPage/LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/certificate-setup" element={<CertificateSetup />} />
        <Route path="/certificate-editor" element={<CertificateEditor />} />
      </Routes>
    </BrowserRouter>
      <Route path="/" element={<CanvasSetup/>} />
      <Route path="/editor" element={<App/>} />
      <Route path="/landing" element={<LandingPage/>}/>
    </Routes>
  </BrowserRouter>
)
