// ConversationHistory component
// Responsibility: Display conversation messages in chat bubble format

import { useEffect, useRef } from 'react'
import { User, Bot } from 'lucide-react'
import { PhaseSeparator } from './phase-separator'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ConversationHistoryProps {
  messages: Message[]
  currentPhase: string
}

// Function to detect phase transitions based on message patterns
function detectPhaseTransitions(messages: Message[]): Array<{ index: number, fromPhase: string, toPhase: string, timestamp: string }> {
  const transitions: Array<{ index: number, fromPhase: string, toPhase: string, timestamp: string }> = []
  
  // Look for specific AI messages that indicate phase transitions
  messages.forEach((message, index) => {
    if (message.role === 'assistant') {
      const content = message.content.toLowerCase()
      
      // Career matching phase start (after exploration) - show separator AFTER this message
      if (content.includes('recomendaciones iniciales') || content.includes('carreras que mejor encajan')) {
        // Add transition to appear AFTER this message (at next index)
        if (index + 1 < messages.length) {
          transitions.push({ 
            index: index + 1, 
            fromPhase: 'exploration', 
            toPhase: 'career_matching', 
            timestamp: message.timestamp 
          })
        }
      }
      
      // Reality check phase start - show separator BEFORE this message if previous message had career recommendations
      if (content.includes('¿estarías dispuesto') || content.includes('¿te sentirías') || content.includes('¿puedes tolerar')) {
        // Check if previous message contained career recommendations
        const prevMessage = messages[index - 1]
        if (prevMessage && prevMessage.role === 'assistant' && 
            (prevMessage.content.toLowerCase().includes('recomendaciones iniciales') || 
             prevMessage.content.toLowerCase().includes('carreras que mejor encajan'))) {
          transitions.push({ 
            index, 
            fromPhase: 'career_matching', 
            toPhase: 'reality_check', 
            timestamp: message.timestamp 
          })
        }
      }
      
      // Completion phase
      else if (content.includes('recomendaciones finales') || content.includes('resultados finales')) {
        transitions.push({ 
          index, 
          fromPhase: 'reality_check', 
          toPhase: 'complete', 
          timestamp: message.timestamp 
        })
      }
    }
  })
  
  return transitions
}

export function ConversationHistory({ messages, currentPhase }: ConversationHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [messages])

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

  const transitions = detectPhaseTransitions(messages)

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message, index) => (
        <div key={index}>
          {/* Show phase separator if there's a transition at this index */}
          {transitions.some(t => t.index === index) && (
            <>
              {transitions
                .filter(t => t.index === index)
                .map((transition, tIndex) => (
                  <PhaseSeparator
                    key={tIndex}
                    fromPhase={transition.fromPhase}
                    toPhase={transition.toPhase}
                    timestamp={transition.timestamp}
                  />
                ))}
            </>
          )}
          
          {/* Message bubble */}
          <div
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
                    : 'backdrop-blur-sm text-white'
                }`}
                style={{
                  background: message.role === 'user' 
                    ? 'linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(29, 78, 216) 100%)'
                    : `
                      linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.10) 0%, 
                        rgba(255, 255, 255, 0.06) 100%
                      )
                    `,
                  boxShadow: message.role === 'user'
                    ? `
                      0 4px 16px 0 rgba(37, 99, 235, 0.3),
                      inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `
                    : `
                      0 4px 16px 0 rgba(0, 0, 0, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.08)
                    `
                }}
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
        </div>
      ))}
      
      {/* Invisible element for auto-scrolling */}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  )
}