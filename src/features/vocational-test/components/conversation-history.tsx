// ConversationHistory component
// Responsibility: Display conversation messages in chat bubble format

import { useEffect, useRef, useState } from 'react'
import { User, Bot, Volume2, Pause } from 'lucide-react'
import { PhaseSeparator } from './phase-separator'
import { useTextToSpeech } from '@/features/vocational-test/hooks/use-text-to-speech'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ConversationHistoryProps {
  messages: Message[]
  currentPhase: string
  enableVoice?: boolean
  autoSpeakNewMessages?: boolean
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

export function ConversationHistory({ 
  messages, 
  currentPhase, 
  enableVoice = true,
  autoSpeakNewMessages = false 
}: ConversationHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentlyPlayingMessage, setCurrentlyPlayingMessage] = useState<number | null>(null)
  const previousMessageCountRef = useRef(messages.length)

  // Text-to-speech hook
  const {
    speak,
    stop,
    isSpeaking,
    isSupported: isSpeechSupported
  } = useTextToSpeech();

  // Auto-speak new AI messages
  useEffect(() => {
    if (autoSpeakNewMessages && enableVoice && isSpeechSupported && messages.length > previousMessageCountRef.current) {
      const newMessages = messages.slice(previousMessageCountRef.current)
      const newAIMessage = newMessages.find(msg => msg.role === 'assistant')
      
      if (newAIMessage) {
        const messageIndex = messages.findIndex(msg => msg === newAIMessage)
        handleSpeakMessage(messageIndex, newAIMessage.content)
      }
    }
    previousMessageCountRef.current = messages.length
  }, [messages, autoSpeakNewMessages, enableVoice, isSpeechSupported])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [messages])

  const handleSpeakMessage = (messageIndex: number, content: string) => {
    if (!enableVoice || !isSpeechSupported) return

    if (currentlyPlayingMessage === messageIndex && isSpeaking) {
      stop()
      setCurrentlyPlayingMessage(null)
    } else {
      stop() // Stop any current speech
      setCurrentlyPlayingMessage(messageIndex)
      speak(content)
    }
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <Bot className="w-12 h-12 mx-auto mb-4 text-blue-600" />
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
                    ? 'bg-blue-600 text-white ml-auto shadow-lg shadow-blue-200/50'
                    : 'bg-white/80 backdrop-blur-sm text-gray-900 border border-gray-200 shadow-lg shadow-gray-200/50'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <div className={`flex items-center justify-between mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <div className="text-xs">
                    {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>

                  {/* Voice control button for AI messages */}
                  {message.role === 'assistant' && enableVoice && isSpeechSupported && (
                    <button
                      onClick={() => handleSpeakMessage(index, message.content)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
                      title={currentlyPlayingMessage === index && isSpeaking ? "Detener audio" : "Reproducir audio"}
                    >
                      {currentlyPlayingMessage === index && isSpeaking ? (
                        <>
                          <Pause className="w-3 h-3 text-gray-600 group-hover:text-gray-900" />
                          <span className="text-xs text-gray-600 group-hover:text-gray-900">Pausar</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-gray-600 group-hover:text-gray-900" />
                          <span className="text-xs text-gray-600 group-hover:text-gray-900">Reproducir</span>
                        </>
                      )}
                    </button>
                  )}
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