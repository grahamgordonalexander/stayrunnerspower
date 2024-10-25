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
