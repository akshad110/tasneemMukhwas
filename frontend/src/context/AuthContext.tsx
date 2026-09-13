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

const USER_CACHE_KEY = 'tm-auth-user-v1'

function readCachedUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(USER_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function writeCachedUser(next: AuthUser | null) {
  try {
    if (!next) sessionStorage.removeItem(USER_CACHE_KEY)
    else sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(next))
  } catch {
    /* quota / private mode */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const bootToken = getToken()
  const bootUser = bootToken ? readCachedUser() : null
  const [user, setUser] = useState<AuthUser | null>(bootUser)
  const [loading, setLoading] = useState(Boolean(bootToken) && !bootUser)
  /** Bumps when login/logout starts so stale /auth/me calls cannot wipe the session */
  const sessionEpochRef = useRef(0)
  const refreshAbortRef = useRef<AbortController | null>(null)

  const refresh = useCallback(async () => {
    refreshAbortRef.current?.abort()
    const controller = new AbortController()
    refreshAbortRef.current = controller

    const epoch = sessionEpochRef.current
    const token = getToken()
    if (!token) {
      if (epoch === sessionEpochRef.current && !controller.signal.aborted) {
        writeCachedUser(null)
        setUser(null)
        setLoading(false)
      }
      return
    }
    try {
      const me = await authApi.me(controller.signal)
      if (controller.signal.aborted || epoch !== sessionEpochRef.current) return
      writeCachedUser(me)
      setUser(me)
    } catch (err) {
      if (controller.signal.aborted || epoch !== sessionEpochRef.current) return
      if (err instanceof ApiRequestError && err.status === 401) {
        setToken(null)
        writeCachedUser(null)
        setUser(null)
      }
    } finally {
      if (!controller.signal.aborted && epoch === sessionEpochRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void refresh()
    return () => refreshAbortRef.current?.abort()
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    refreshAbortRef.current?.abort()
    sessionEpochRef.current += 1
    const data = await authApi.login(email, password)
    setToken(data.token)
    writeCachedUser(data.user)
    setUser(data.user)
    setLoading(false)
    return data.user
  }, [])

  const register = useCallback(
    async (payload: { name: string; email: string; password: string; phone?: string }) => {
      refreshAbortRef.current?.abort()
      sessionEpochRef.current += 1
      const data = await authApi.register(payload)
      setToken(data.token)
      writeCachedUser(data.user)
      setUser(data.user)
      setLoading(false)
      return data.user
    },
    [],
  )

  const logout = useCallback(() => {
    refreshAbortRef.current?.abort()
    sessionEpochRef.current += 1
    setToken(null)
    writeCachedUser(null)
    setUser(null)
    setLoading(false)
  }, [])

  const updateProfile = useCallback(async (payload: Partial<AuthUser>) => {
    const next = await authApi.updateProfile(payload)
    writeCachedUser(next)
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
