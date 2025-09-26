// src/store/useAppStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Notification } from '@/types'

interface AppState {
  // Theme
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void

  // App initialization
  isInitialized: boolean
  error: string | null
  initializeApp: () => Promise<void>

  // Sidebar
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
  clearAllNotifications: () => void

  // Loading states
  isLoading: boolean
  setLoading: (loading: boolean) => void

  // User preferences
  preferences: {
    mapProvider: 'mapbox' | 'google'
    units: 'metric' | 'imperial'
    timeFormat: '12h' | '24h'
    autoSave: boolean
  }
  updatePreferences: (preferences: Partial<AppState['preferences']>) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      setTheme: (theme) => {
        set({ theme })
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      },

      // App initialization
      isInitialized: false,
      error: null,
      initializeApp: async () => {
        try {
          set({ isLoading: true, error: null })

          // Simulate API calls for initialization
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Initialize theme
          const { theme } = get()
          if (theme === 'dark') {
            document.documentElement.classList.add('dark')
          }

          set({ isInitialized: true, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to initialize app',
            isLoading: false
          })
        }
      },

      // Sidebar
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          read: false,
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }))
      },
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      clearAllNotifications: () => set({ notifications: [] }),

      // Loading states
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // User preferences
      preferences: {
        mapProvider: 'mapbox',
        units: 'imperial',
        timeFormat: '12h',
        autoSave: true,
      },
      updatePreferences: (newPreferences) => set((state) => ({
        preferences: { ...state.preferences, ...newPreferences }
      })),
    }),
    {
      name: 'eld-app-store',
      partialize: (state) => ({
        theme: state.theme,
        preferences: state.preferences,
      }),
    }
  )
)

// Custom hooks for specific parts of the store
export const useNotifications = () => {
  const notifications = useAppStore((state) => state.notifications)
  const addNotification = useAppStore((state) => state.addNotification)
  const removeNotification = useAppStore((state) => state.removeNotification)
  const markAsRead = useAppStore((state) => state.markNotificationAsRead)
  const clearAll = useAppStore((state) => state.clearAllNotifications)

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
  }
}

export const useAppTheme = () => {
  return useAppStore((state) => state.theme)
}

export const useSidebar = () => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen)

  return {
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
  }
}
