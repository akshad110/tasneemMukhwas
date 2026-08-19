import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ApiRequestError, getToken, setToken } from '../lib/api'
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
  /** Bumps when login/logout starts so stale /auth/me calls cannot wipe the session */
  const sessionEpochRef = useRef(0)

  const refresh = useCallback(async () => {
    const epoch = sessionEpochRef.current
    const token = getToken()
    if (!token) {
      if (epoch === sessionEpochRef.current) {
        setUser(null)
        setLoading(false)
      }
      return
    }
    try {
      const me = await authApi.me()
      if (epoch === sessionEpochRef.current) {
        setUser(me)
      }
    } catch (err) {
      if (epoch !== sessionEpochRef.current) return
      // Only drop session on explicit auth failure — not during server restarts / network blips
      if (err instanceof ApiRequestError && err.status === 401) {
        setToken(null)
        setUser(null)
      }
    } finally {
      if (epoch === sessionEpochRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    sessionEpochRef.current += 1
    const data = await authApi.login(email, password)
    setToken(data.token)
    setUser(data.user)
    setLoading(false)
    return data.user
  }, [])

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; phone?: string }) => {
      sessionEpochRef.current += 1
      const data = await authApi.register(payload)
      setToken(data.token)
      setUser(data.user)
      setLoading(false)
      return data.user
    },
    [],
  )

  const logout = useCallback(() => {
    sessionEpochRef.current += 1
    setToken(null)
    setUser(null)
    setLoading(false)
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
