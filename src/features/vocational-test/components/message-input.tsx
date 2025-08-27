// MessageInput component
// Responsibility: Handle user input (text and voice)

import { useState, useEffect } from 'react'
import { Send, Loader, Mic, MicOff } from 'lucide-react'
import { useSpeechRecognition } from '@/features/vocational-test/hooks/use-speech-recognition'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  isLoading?: boolean
  placeholder?: string
  enableVoice?: boolean
}

export function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false,
  placeholder = "Escribe tu respuesta...",
  enableVoice = true
}: MessageInputProps) {
  const [input, setInput] = useState('')
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  
  // Speech recognition hook
  const {
    transcript,
    isListening,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError
  } = useSpeechRecognition()

  // Update input with speech transcript
  useEffect(() => {
    if (transcript && isVoiceMode) {
      setInput(transcript)
    }
  }, [transcript, isVoiceMode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    
    if (trimmedInput && !disabled && !isLoading) {
      onSendMessage(trimmedInput)
      setInput('')
      resetTranscript()
      if (isListening) {
        stopListening()
      }
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      setIsVoiceMode(true)
      startListening()
    }
  }

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    setIsVoiceMode(false) // Switch to text mode when typing
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const isValid = input.trim().length > 0
  const isDisabled = disabled || isLoading || !isValid

  return (
    <div className="flex-shrink-0 relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-purple-900/5 to-indigo-900/5" />
      </div>
      
      <div className="relative">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Sleek modern input design */}
            <div 
              className="bg-white/6 backdrop-blur-xl rounded-3xl shadow-2xl relative overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.06) 0%, 
                    rgba(255, 255, 255, 0.04) 100%
                  )
                `,
                boxShadow: `
                  0 8px 32px 0 rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.08)
                `
              }}
            >
              <div className="p-6">
                <div className="flex gap-4 items-center">
                  
                  {/* Modern Text Input */}
                  <div className="flex-1">
                    <textarea
                      value={input}
                      onChange={handleTextInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder={placeholder}
                      disabled={disabled}
                      rows={1}
                      className="
                        w-full bg-transparent border-0 px-0 py-2
                        text-white text-lg placeholder-white/50 resize-none
                        focus:outline-none focus:ring-0
                        disabled:opacity-50 disabled:cursor-not-allowed
                        min-h-[40px] max-h-32 overflow-y-hidden
                        leading-relaxed scrollbar-none
                      "
                      style={{
                        height: 'auto',
                        minHeight: '40px'
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = 'auto'
                        target.style.height = Math.min(target.scrollHeight, 128) + 'px'
                      }}
                    />
                    
                    {/* Subtle underline */}
                    <div className={`h-px mt-2 transition-all duration-300 ${
                      input.trim() ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400' : 'bg-white/5'
                    }`} />
                    
                    {/* Character counter for longer messages */}
                    {input.length > 100 && (
                      <div className="mt-2 text-right text-xs text-white/40">
                        {input.length}/500
                      </div>
                    )}
                  </div>

                  {/* Voice Button - only show if voice is enabled and supported */}
                  {enableVoice && isSpeechSupported && (
                    <button
                      type="button"
                      onClick={handleVoiceToggle}
                      disabled={disabled || isLoading}
                      className={`
                        relative group flex-shrink-0
                        w-12 h-12 rounded-2xl
                        transition-all duration-300
                        flex items-center justify-center
                        ${disabled || isLoading
                          ? 'bg-white/5 text-white/30 cursor-not-allowed'
                          : isListening
                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg animate-pulse'
                            : isVoiceMode && transcript
                              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg'
                              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:scale-110 shadow-lg hover:shadow-xl hover:shadow-orange-500/20'
                        }
                      `}
                    >
                      {/* Button inner glow */}
                      {!(disabled || isLoading) && (
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm ${
                          isListening
                            ? 'bg-gradient-to-r from-red-400/30 to-red-400/30'
                            : isVoiceMode && transcript
                              ? 'bg-gradient-to-r from-green-400/30 to-green-400/30'
                              : 'bg-gradient-to-r from-orange-400/30 to-orange-400/30'
                        }`} />
                      )}
                      
                      <div className="relative z-10">
                        {isListening ? (
                          <MicOff className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                  )}

                  {/* Elegant Send Button - better alignment */}
                  <button
                    type="submit"
                    disabled={isDisabled}
                    className={`
                      relative group flex-shrink-0
                      w-12 h-12 rounded-2xl
                      transition-all duration-300
                      flex items-center justify-center
                      ${isDisabled
                        ? 'bg-white/5 text-white/30 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl hover:shadow-blue-500/20'
                      }
                    `}
                  >
                    {/* Button inner glow */}
                    {!isDisabled && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/30 to-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    )}
                    
                    <div className="relative z-10">
                      {isLoading ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Elegant status indicators */}
          {(disabled && !isLoading) && (
            <div className="mt-4 text-center">
              <div 
                className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-sm"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.04) 0%, 
                      rgba(255, 255, 255, 0.01) 100%
                    )
                  `,
                  boxShadow: `
                    inset 0 1px 0 rgba(255, 255, 255, 0.03)
                  `
                }}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <p className="text-white/70 text-sm">
                  ARIA está procesando tu respuesta...
                </p>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="mt-4 text-center">
              <div 
                className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-sm"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(59, 130, 246, 0.06) 0%, 
                      rgba(147, 51, 234, 0.06) 100%
                    )
                  `,
                  boxShadow: `
                    inset 0 1px 0 rgba(59, 130, 246, 0.03)
                  `
                }}
              >
                <Loader className="w-4 h-4 animate-spin text-blue-400" />
                <p className="text-white/80 text-sm font-medium">
                  ARIA está pensando...
                </p>
              </div>
            </div>
          )}

          {/* Voice Status Indicators */}
          {enableVoice && isSpeechSupported && isListening && (
            <div className="mt-4 text-center">
              <div 
                className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-sm"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(239, 68, 68, 0.06) 0%, 
                      rgba(220, 38, 38, 0.06) 100%
                    )
                  `,
                  boxShadow: `
                    inset 0 1px 0 rgba(239, 68, 68, 0.03)
                  `
                }}
              >
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <p className="text-white/80 text-sm font-medium">
                  🎤 Escuchando tu respuesta...
                </p>
              </div>
            </div>
          )}

          {/* Voice Transcript Feedback */}
          {enableVoice && isSpeechSupported && isVoiceMode && transcript && !isListening && (
            <div className="mt-4 text-center">
              <div 
                className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-sm"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(34, 197, 94, 0.06) 0%, 
                      rgba(22, 163, 74, 0.06) 100%
                    )
                  `,
                  boxShadow: `
                    inset 0 1px 0 rgba(34, 197, 94, 0.03)
                  `
                }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <p className="text-white/80 text-sm font-medium">
                  ✓ Texto capturado por voz - Presiona enviar o continúa hablando
                </p>
              </div>
            </div>
          )}

          {/* Voice Error Indicator */}
          {enableVoice && speechError && (
            <div className="mt-4 text-center">
              <div 
                className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl backdrop-blur-sm"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(239, 68, 68, 0.06) 0%, 
                      rgba(220, 38, 38, 0.06) 100%
                    )
                  `,
                  boxShadow: `
                    inset 0 1px 0 rgba(239, 68, 68, 0.03)
                  `
                }}
              >
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <p className="text-white/80 text-sm font-medium">
                  ❌ Error de reconocimiento de voz - Intenta de nuevo
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}