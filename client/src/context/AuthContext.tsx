import { createContext, useContext, useState } from 'react'
import { loginService, logoutService } from '../services/auth.service'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(null!)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email: string, password: string) => {
    const data = await loginService({ email, password })
    setToken(data.session.access_token)
    setUser(data.user)
    localStorage.setItem('token', data.session.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const logout = () => {
    logoutService()
    setToken(null)
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)