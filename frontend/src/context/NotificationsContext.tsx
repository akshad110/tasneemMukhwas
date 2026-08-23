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
import { notificationsApi, type AppNotification } from '../lib/services'
import { useAuth } from './AuthContext'

const MIN_REFRESH_MS = 30_000
const BACKGROUND_POLL_MS = 5 * 60_000

type NotificationsContextValue = {
  items: AppNotification[]
  unread: number
  loading: boolean
  refresh: (force?: boolean) => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  removeOne: (id: string) => Promise<void>
  removeAll: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<AppNotification[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const inFlightRef = useRef(false)
  const lastFetchRef = useRef(0)

  const refresh = useCallback(
    async (force = false) => {
      if (!user) {
        setItems([])
        setUnread(0)
        return
      }

      const now = Date.now()
      if (inFlightRef.current) return
      if (!force && now - lastFetchRef.current < MIN_REFRESH_MS) return

      inFlightRef.current = true
      const showSpinner = items.length === 0
      if (showSpinner) setLoading(true)
      try {
        const res = await notificationsApi.mine()
        setItems(res.items)
        setUnread(res.unread)
        lastFetchRef.current = Date.now()
      } catch {
        /* ignore — bell UI stays on last known state */
      } finally {
        inFlightRef.current = false
        setLoading(false)
      }
    },
    [user?.id],
  )

  useEffect(() => {
    if (!user) {
      setItems([])
      setUnread(0)
      lastFetchRef.current = 0
      return
    }

    void refresh(true)

    const onFocus = () => void refresh()
    window.addEventListener('focus', onFocus)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    document.addEventListener('visibilitychange', onVisibility)

    const pollId = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh()
    }, BACKGROUND_POLL_MS)

    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
      window.clearInterval(pollId)
    }
  }, [user?.id, refresh])

  const markRead = useCallback(
    async (id: string) => {
      await notificationsApi.markRead(id).catch(() => {})
      await refresh(true)
    },
    [refresh],
  )

  const markAllRead = useCallback(async () => {
    await notificationsApi.readAll().catch(() => {})
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnread(0)
  }, [])

  const removeOne = useCallback(
    async (id: string) => {
      await notificationsApi.remove(id).catch(() => {})
      await refresh(true)
    },
    [refresh],
  )

  const removeAll = useCallback(async () => {
    await notificationsApi.deleteAll().catch(() => {})
    setItems([])
    setUnread(0)
    lastFetchRef.current = Date.now()
  }, [])

  const value = useMemo(
    () => ({
      items,
      unread,
      loading,
      refresh,
      markRead,
      markAllRead,
      removeOne,
      removeAll,
    }),
    [items, unread, loading, refresh, markRead, markAllRead, removeOne, removeAll],
  )

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}
