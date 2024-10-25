#!/bin/bash

# Ensure we're in the stayrunners-frontend directory
cd stayrunners-frontend

# Create and populate app layout and pages
cat > src/app/layout.tsx << 'EOL'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StayRunners',
  description: 'On-demand delivery service',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
EOL

cat > src/app/page.tsx << 'EOL'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to StayRunners</h1>
    </main>
  )
}
EOL

# Create auth pages
cat > src/app/auth/login/page.tsx << 'EOL'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <h2 className="text-3xl font-bold text-center">Login</h2>
        <LoginForm />
      </div>
    </div>
  )
}
EOL

# Create components - Auth
cat > src/components/auth/LoginForm.tsx << 'EOL'
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add authentication logic here
    router.push('/customer/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Sign in
      </button>
    </form>
  )
}
EOL

# Create components - Chat
cat > src/components/chat/ChatInterface.tsx << 'EOL'
'use client'

import { useState, useEffect } from 'react'
import { useGroqChat } from '@/hooks/useGroqChat'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

export default function ChatInterface() {
  const { messages, sendMessage, isLoading } = useGroqChat()

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
          />
        ))}
      </div>
      <ChatInput 
        onSend={sendMessage} 
        isLoading={isLoading} 
      />
    </div>
  )
}
EOL

cat > src/components/chat/MessageBubble.tsx << 'EOL'
interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface Props {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const isBot = message.sender === 'bot'
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isBot ? 'bg-gray-100' : 'bg-blue-500 text-white'
      }`}>
        {message.content}
      </div>
    </div>
  )
}
EOL

cat > src/components/chat/ChatInput.tsx << 'EOL'
'use client'

import { useState } from 'react'

interface Props {
  onSend: (message: string) => void
  isLoading?: boolean
}

export default function ChatInput({ onSend, isLoading }: Props) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSend(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  )
}
EOL

# Create hooks
cat > src/hooks/useGroqChat.ts << 'EOL'
import { useState, useCallback, useEffect } from 'react'
import { socket } from '@/lib/socket'

export function useGroqChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true)
    try {
      socket.emit('message', { content })
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    socket.on('botResponse', (response) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date()
      }])
    })

    return () => {
      socket.off('botResponse')
    }
  }, [])

  return { messages, sendMessage, isLoading }
}
EOL

# Create lib files
cat > src/lib/socket.ts << 'EOL'
import { io } from 'socket.io-client'

export const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
})
EOL

cat > src/lib/auth.ts << 'EOL'
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
EOL

# Create store
cat > src/store/index.ts << 'EOL'
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
EOL

# Create types
cat > src/types/chat.ts << 'EOL'
export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  metadata?: {
    type?: 'negotiation' | 'confirmation' | 'update'
    data?: any
  }
}

export interface ChatResponse {
  content: string
  type: string
  data?: any
}
EOL

# Make script executable
chmod +x populate-frontend-files.sh
