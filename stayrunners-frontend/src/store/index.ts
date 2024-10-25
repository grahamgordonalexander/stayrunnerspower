import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  user: any
  orders: any[]
  location: [number, number]
  activeChat: string | null
  messages: any[]
  
  // Actions
  setUser: (user: any) => void
  updateLocation: (location: [number, number]) => void
  addOrder: (order: any) => void
  updateOrder: (id: string, data: any) => void
  addMessage: (message: any) => void
  setActiveChat: (id: string | null) => void
}

export const useStore = create<State>()(
  devtools(
    (set) => ({
      user: null,
      orders: [],
      location: [-0.1276, 51.5074], // Default location
      activeChat: null,
      messages: [],
      
      setUser: (user) => set({ user }),
      updateLocation: (location) => set({ location }),
      addOrder: (order) => set((state) => ({ 
        orders: [...state.orders, order] 
      })),
      updateOrder: (id, data) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === id ? { ...order, ...data } : order
        )
      })),
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      setActiveChat: (id) => set({ activeChat: id })
    })
  )
)
