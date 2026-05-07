import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../../assets/LogoAzul.png'
import { useAuth } from '../../context/AuthContext'
import { getRedirectPathForRole } from '../../routes/routes'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      // AuthContext guarda el `user` en localStorage; usamos el rol para redirigir.
      const savedUser = localStorage.getItem('user')
      let role: unknown = null
      if (savedUser) {
        try {
          role = JSON.parse(savedUser)?.role
        } catch {
          role = null
        }
      }
      navigate(getRedirectPathForRole(role))
    } catch {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="SafeSteps" className="w-12 h-12 object-contain mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg transition"
        >
          Ingresar
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">Regístrate</Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage