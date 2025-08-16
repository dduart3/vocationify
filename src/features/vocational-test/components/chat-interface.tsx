import { useState, useRef, useEffect } from 'react'
import { IconSend, IconUser, IconRobot, IconMicrophone, IconSparkles } from '@tabler/icons-react'
import { useCreateSession, useNextQuestion, useSubmitResponse } from '../hooks'
import { useAuthStore } from '@/stores/auth-store'

interface Message {
  id: string
  content: string
  sender: 'user' | 'aria'
  timestamp: Date
  typing?: boolean
  questionId?: string
  category?: string
}

interface ChatInterfaceProps {
  onSwitchToVoice?: () => void
  isVoiceAvailable?: boolean
  onTestComplete?: (sessionId: string) => void
  onConversationStart?: () => void
  testState?: 'idle' | 'conversational' | 'completed'
  setTestState?: (state: 'idle' | 'conversational' | 'completed') => void
  resumingSessionId?: string | null
  hasIncompleteSession?: boolean
}

export function ChatInterface({ onSwitchToVoice, isVoiceAvailable = true, onTestComplete, onConversationStart, testState: externalTestState, setTestState: setExternalTestState, resumingSessionId, hasIncompleteSession }: ChatInterfaceProps) {
  const { user } = useAuthStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy ARIA, tu asistente de orientación vocacional. Estoy aquí para ayudarte a descubrir tu camino profesional ideal. ¿Estás listo para comenzar?',
      sender: 'aria',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [questionOrder, setQuestionOrder] = useState(1)
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // API hooks
  const createSession = useCreateSession()
  const { data: currentQuestion, isLoading: loadingQuestion } = useNextQuestion(sessionId || '', !!sessionId)
  const submitResponse = useSubmitResponse()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle session resumption
  useEffect(() => {
    if (resumingSessionId && !sessionId) {
      console.log('🔄 Resuming chat session:', resumingSessionId)
      setSessionId(resumingSessionId)
      setHasStarted(true)
      onConversationStart?.()
      setExternalTestState?.('conversational')
      
      // Add a system message indicating the session was resumed
      const resumeMessage: Message = {
        id: `resume-${Date.now()}`,
        content: 'Sesión reanudada. Puedes continuar desde donde lo dejaste.',
        sender: 'aria',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, resumeMessage])
    }
  }, [resumingSessionId, sessionId, onConversationStart, setExternalTestState])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Prevent starting new session if there's an incomplete one
    if (hasIncompleteSession && !hasStarted) {
      return
    }

    // Call onConversationStart on first message
    if (!hasStarted) {
      setHasStarted(true)
      onConversationStart?.()
      // Update shared test state if provided
      setExternalTestState?.('conversational')
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const ariaResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(userMessage.content),
        sender: 'aria',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, ariaResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const generateResponse = (userInput: string): string => {
    // Simple response logic - in real app, this would call your AI service
    const responses = [
      "Interesante. Cuéntame más sobre qué actividades disfrutas hacer en tu tiempo libre.",
      "Entiendo. ¿Qué tipo de ambiente de trabajo te resulta más atractivo?",
      "Perfecto. ¿Prefieres trabajar con personas, con datos, o con objetos y herramientas?",
      "Muy bien. ¿Qué materias escolares han sido tus favoritas y por qué?",
      "Excelente información. ¿Te consideras más una persona práctica o creativa?"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chat Header */}
      <div
        className="flex items-center justify-between p-4 rounded-t-2xl"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: 'none',
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <IconRobot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">ARIA</h3>
            <p className="text-slate-400 text-sm">Asistente Vocacional</p>
          </div>
        </div>

        {isVoiceAvailable && (
          <button
            onClick={onSwitchToVoice}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
          >
            <IconMicrophone className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Cambiar a voz</span>
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div
        className="h-96 overflow-y-auto p-4 space-y-4"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.05) 0%, 
              rgba(255, 255, 255, 0.02) 100%
            )
          `,
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderTop: 'none',
          borderBottom: 'none',
        }}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <IconRobot className="w-4 h-4 text-white" />
            </div>
            <TypingIndicator />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div
        className="p-4 rounded-b-2xl"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%, 
              rgba(255, 255, 255, 0.04) 100%
            )
          `,
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderTop: 'none',
        }}
      >
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={hasIncompleteSession && !hasStarted ? "Tienes un test en progreso..." : "Escribe tu respuesta aquí..."}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              disabled={isTyping || (hasIncompleteSession && !hasStarted)}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping || (hasIncompleteSession && !hasStarted)}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
          >
            <IconSend className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user'

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
          : 'bg-gradient-to-r from-blue-500 to-purple-500'
      }`}>
        {isUser ? (
          <IconUser className="w-4 h-4 text-white" />
        ) : (
          <IconRobot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
        isUser 
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30' 
          : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
      }`}>
        <p className="text-white text-sm leading-relaxed">{message.content}</p>
        <p className="text-slate-400 text-xs mt-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
      <div className="flex space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.4s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
