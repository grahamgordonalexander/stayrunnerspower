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
