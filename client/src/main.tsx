import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LocationsProvider } from './providers/LocationsProvider' // <-- IMPORTANTE
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LocationsProvider>
          <App />
        </LocationsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)