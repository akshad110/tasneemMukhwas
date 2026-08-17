import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getToken, setToken } from '../lib/api'
import { authApi, type AuthUser } from '../lib/services'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  register: (payload: {
    name: string
    email: string
    password: string
    phone?: string
  }) => Promise<AuthUser>
  logout: () => void
  refresh: () => Promise<void>
  updateProfile: (payload: Partial<AuthUser>) => Promise<AuthUser>
  changePassword: (payload: {
    currentPassword: string
    newPassword: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const me = await authApi.me()
      setUser(me)
    } catch {
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; phone?: string }) => {
      const data = await authApi.register(payload)
      setToken(data.token)
      setUser(data.user)
      return data.user
    },
    [],
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (payload: Partial<AuthUser>) => {
    const next = await authApi.updateProfile(payload)
    setUser(next)
    return next
  }, [])

  const changePassword = useCallback(
    async (payload: { currentPassword: string; newPassword: string }) => {
      await authApi.changePassword(payload)
    },
    [],
  )

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      refresh,
      updateProfile,
      changePassword,
    }),
    [user, loading, login, register, logout, refresh, updateProfile, changePassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
