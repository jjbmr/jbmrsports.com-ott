import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const HISTORY_KEY = 'jbmr-watch-history'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota errors */
  }
}

type UserContextValue = {
  watchHistory: string[]
  addWatchHistory: (matchId: string) => void
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [watchHistory, setWatchHistory] = useState<string[]>(() => readJson(HISTORY_KEY, []))

  useEffect(() => writeJson(HISTORY_KEY, watchHistory), [watchHistory])

  const addWatchHistory = useCallback((matchId: string) => {
    setWatchHistory((prev) => [matchId, ...prev.filter((id) => id !== matchId)].slice(0, 50))
  }, [])

  const value = useMemo(
    () => ({
      watchHistory,
      addWatchHistory,
    }),
    [watchHistory, addWatchHistory],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUserStore() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUserStore must be used inside UserProvider')
  return ctx
}
