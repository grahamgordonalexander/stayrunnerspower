import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
  refreshToken: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })
          
          if (!response.ok) throw new Error('Authentication failed')
          
          const data = await response.json()
          set({ 
            token: data.token,
            user: data.user,
            isAuthenticated: true
          })
        } catch (error) {
          set({ error: (error as Error).message })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false
        })
      },

      register: async (userData) => {
        // Add registration logic
      },

      refreshToken: async () => {
        // Add token refresh logic
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
