import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import CanvasSetup from './CanvasSetup'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CanvasSetup/>} />
      <Route path="/editor" element={<App/>} />
    </Routes>
  </BrowserRouter>
)
