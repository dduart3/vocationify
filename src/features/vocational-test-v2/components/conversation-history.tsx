// ConversationHistory component
// Responsibility: Display conversation messages in chat bubble format

import { User, Bot } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ConversationHistoryProps {
  messages: Message[]
  currentPhase: string
}

export function ConversationHistory({ messages, currentPhase }: ConversationHistoryProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-white/60">
          <Bot className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <p>ARIA está lista para comenzar tu evaluación vocacional...</p>
          <p className="text-sm mt-2">Fase actual: {currentPhase}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex gap-4 ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
          
          <div className={`max-w-2xl ${message.role === 'user' ? 'order-1' : ''}`}>
            <div
              className={`p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <div className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-blue-100' : 'text-white/50'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
          
          {message.role === 'user' && (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}