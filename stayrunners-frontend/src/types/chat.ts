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
