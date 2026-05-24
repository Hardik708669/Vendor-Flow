import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const STORAGE_KEY = 'vendorflow_user'
const TOKEN_KEY = 'vendorflow_token'
const REFRESH_KEY = 'vendorflow_refresh_token'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    api.get('/auth/me')
      .then(({ data }) => {
        setUser({
          uid: data.user.id,
          email: data.user.email,
          username: data.user.username || '',
          displayName: data.user.name,
          role: data.user.role,
        })
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const signup = async (email, password, profileData = {}) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', {
        name: profileData.name || email,
        username: profileData.username || undefined,
        email,
        password,
        role: profileData.role === 'Admin' ? 'ADMIN' : 'STAFF',
      })
      localStorage.setItem(TOKEN_KEY, data.accessToken)
      localStorage.setItem(REFRESH_KEY, data.refreshToken)
      const newUser = {
        uid: data.user.id,
        email: data.user.email,
        username: data.user.username || '',
        displayName: data.user.name,
        phone: profileData.phone || '',
        role: data.user.role,
        city: profileData.city || '',
        businessName: profileData.businessName || '',
        businessType: profileData.businessType || '',
        gst: profileData.gst || '',
      }
      setUser(newUser)
      return { user: { ...newUser, getIdToken: async () => data.accessToken } }
    } finally {
      setLoading(false)
    }
  }

  const login = async (identifier, password, remember = true) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { identifier, password })
      const existingUser = {
        uid: data.user.id,
        email: data.user.email,
        username: data.user.username || '',
        displayName: data.user.name,
        role: data.user.role,
      }
      localStorage.setItem(TOKEN_KEY, data.accessToken)
      if (remember) localStorage.setItem(REFRESH_KEY, data.refreshToken)
      setUser(existingUser)
      return { user: { ...existingUser, getIdToken: async () => data.accessToken } }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // The server session may already be expired.
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    setUser(null)
  }

  const updateUser = (updates) => {
    if (!user) return
    setUser((prev) => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
