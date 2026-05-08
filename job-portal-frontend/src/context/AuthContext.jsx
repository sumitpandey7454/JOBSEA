import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (authData) => {
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify({
      name: authData.name,
      email: authData.email,
      phoneNumber: authData.phoneNumber,
      role: authData.role,
    }))
    setToken(authData.token)
    setUser({
      name: authData.name,
      email: authData.email,
      phoneNumber: authData.phoneNumber,
      role: authData.role,
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isAdmin = user?.role === 'ADMIN'
  const isLoggedIn = !!token

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)