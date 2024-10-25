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
