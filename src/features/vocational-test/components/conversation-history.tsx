// ConversationHistory component
// Responsibility: Display conversation messages in chat bubble format

import { useEffect, useRef, useState } from 'react'
import { Bot, Volume2, Pause } from 'lucide-react'
import { PhaseSeparator } from './phase-separator'
import { Shimmer } from '@/components/ai-elements/shimmer'
import { useTextToSpeech } from '@/features/vocational-test/hooks/use-text-to-speech'
import { 
  Conversation, 
  ConversationContent, 
  ConversationScrollButton 
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse
} from '@/components/ai-elements/message'

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
  isLoading?: boolean
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
  autoSpeakNewMessages = false,
  isLoading = false
}: ConversationHistoryProps) {
  const [currentlyPlayingMessage, setCurrentlyPlayingMessage] = useState<number | null>(null)
  const previousMessageCountRef = useRef(messages.length)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

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
    <Conversation className="flex-1 w-full relative">
      <ConversationContent className="px-6 py-6 md:px-20 lg:px-24 space-y-6 max-w-5xl mx-auto">
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
          
          {/* Minimalist Flat Bubble via ai-elements */}
          <Message from={message.role} className="relative mb-6">
            
            {/* 3D Metallic AI Avatar (Replica of Voice Persona) */}
            {message.role === 'assistant' && (
              <div 
                className="absolute -left-[52px] top-1 hidden md:flex items-center justify-center w-10 h-10 rounded-full z-10 shadow-[0_4px_10px_rgba(0,0,0,0.15)] border border-gray-300 ring-1 ring-white/50"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e7eb 30%, #9ca3af 70%, #4b5563 100%)'
                }}
              >
                {/* Premium Fine Noise Overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.3] mix-blend-overlay rounded-full pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '40px 40px',
                  }}
                />
                
                {/* Edge Rim Lighting */}
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(255,255,255,0.8),inset_0_1px_3px_rgba(255,255,255,0.9)] pointer-events-none" />

              </div>
            )}

            <MessageContent 
              className={
                message.role === 'user'
                  ? 'bg-blue-50 text-blue-600 ml-auto rounded-[24px] rounded-br-[4px] max-w-2xl px-6 py-4 shadow-sm'
                  : 'bg-gray-100 text-slate-700 max-w-3xl rounded-[24px] rounded-bl-[4px] px-6 py-4 shadow-sm'
              }
            >
              <div className="flex flex-row gap-4 items-end">
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  <MessageResponse>{message.content}</MessageResponse>
                </div>
                
                {/* Voice control button for AI messages (Compact 3D Circle) */}
                {message.role === 'assistant' && enableVoice && isSpeechSupported && (
                  <button
                    onClick={() => handleSpeakMessage(index, message.content)}
                    className="flex-shrink-0 group relative flex items-center justify-center w-[34px] h-[34px] rounded-full bg-gradient-to-b from-white to-gray-50 shadow-[0_2px_5px_rgba(0,0,0,0.06),inset_0_-2px_4px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] border border-gray-200/80 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_-2px_4px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)] hover:to-gray-100 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] active:translate-y-[1px] transition-all duration-200 cursor-pointer text-slate-500 hover:text-slate-700"
                    title={currentlyPlayingMessage === index && isSpeaking ? "Pausar" : "Escuchar"}
                  >
                    {currentlyPlayingMessage === index && isSpeaking ? (
                      <Pause className="w-[15px] h-[15px] drop-shadow-sm transition-colors" />
                    ) : (
                      <Volume2 className="w-[15px] h-[15px] drop-shadow-sm transition-colors" />
                    )}
                  </button>
                )}
              </div>
            </MessageContent>
          </Message>
        </div>
      ))}
      
      {/* Loading Bubble mimicking an AI response */}
      {isLoading && (
        <div className="relative mb-6">
          <Message from="assistant" className="relative">
            {/* 3D Metallic AI Avatar (Replica of Voice Persona) */}
            <div 
              className="absolute -left-[52px] top-1 hidden md:flex items-center justify-center w-10 h-10 rounded-full z-10 shadow-[0_4px_10px_rgba(0,0,0,0.15)] border border-gray-300 ring-1 ring-white/50"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e7eb 30%, #9ca3af 70%, #4b5563 100%)'
              }}
            >
              {/* Premium Fine Noise Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.3] mix-blend-overlay rounded-full pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '40px 40px',
                }}
              />
              
              {/* Edge Rim Lighting */}
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(255,255,255,0.8),inset_0_1px_3px_rgba(255,255,255,0.9)] pointer-events-none" />
            </div>

            <MessageContent className="bg-transparent text-[#334155] max-w-3xl pr-6 py-2">
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap mt-2 tracking-wide font-medium">
                <Shimmer className="[--color-background:#334155] [--color-muted-foreground:rgba(51,65,85,0.4)] text-[15px]">
                  ARIA está pensando...
                </Shimmer>
              </div>
            </MessageContent>
          </Message>
        </div>
      )}
      
      {/* Invisible anchor for auto-scrolling */}
      <div ref={messagesEndRef} className="h-4" />
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}