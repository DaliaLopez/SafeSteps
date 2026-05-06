import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../src/features/auth/LandingPage'
import RegisterPage from '../src/features/auth/LoginPage'
import LandingPage from '../src/features/auth/RegisterPage'

export default function App() {
  return (
    <BrowserRouter>          {/* ← debe ser el componente raíz */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}