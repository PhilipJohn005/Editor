import { createRoot } from 'react-dom/client'
import './index.css'
import MainCanvasScreen from './components/screens/Issuer/canvas/MainCanvasScreen';
import CanvasSetup from './components/screens/Issuer/canvas/CanvasSetup'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IssuerLayout from './components/screens/Issuer/layouts/IssuerLayout';
import LoginPage from './components/screens/Login/LoginPage';
import Dashboard from './components/screens/Issuer/dashboard/Dashboard';
import BadgeClass from './components/screens/Issuer/badge-class/BadgeClass';
import CertificateManager from './components/screens/Issuer/CredentialManager/CertificateManager';
import SubscriptionandBilling from './components/screens/Issuer/subscription-and-billing/SubscriptionandBilling';
import ProfileManagement from './components/screens/Issuer/profile-management/ProfileManagement';
import Issuance from './components/screens/Issuer/issuance/Issuance';
import App from './App';
import RecipientProfile from './components/screens/Recipient/RecipientProfile';
import RecipientWallet from './components/screens/Recipient/RecipientWallet';
import VerifierFormPage from './components/screens/Verifier/VerifierFormPage';
import VerifierPage from './components/screens/Verifier/Verifierpage';
import BadgeManager from './components/screens/Issuer/CredentialManager/BadgeManager';
import CredentialDetail from './components/screens/Recipient/CredentialDetail';
import SignupPage from './components/screens/Signup/SignupPage';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<App/>}/>
      <Route path='signup' element={<SignupPage/>}/>
      <Route path='recipientwallet' element={<RecipientWallet/>}/>
      <Route path='recipientprofile' element={<RecipientProfile/>}/>

      <Route path='verifierpage' element={<VerifierPage/>}/>
      <Route path='verifierformpage' element={<VerifierFormPage/>}/>

      <Route path="credential/:id" element={<CredentialDetail />} />

      <Route element={<IssuerLayout/>}>
        <Route path="canvassetup" element={<CanvasSetup/>}/>
        <Route path="editor" element={<MainCanvasScreen/>}/>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="badge-class" element={<BadgeClass />} />
        <Route path='badgemanager' element={<BadgeManager/>}/>
        <Route path="certificatemanager" element={<CertificateManager/>}/>
        <Route path="issueance" element={<Issuance/>}/>
        <Route path="subscription" element={<SubscriptionandBilling/>}/>
        <Route path="profile" element={<ProfileManagement/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
)
