// MessageInput component
// Responsibility: Handle user input (text and voice)

import { useState, useEffect } from 'react'
import { ArrowUp, Loader, Mic, MicOff, X } from 'lucide-react'
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
      {/* Subtle background blur only, no solid color overlay */}

      <div className="relative">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            
            {/* Status Indicators appearing ON TOP of the input */}
            <div className="flex flex-col items-center gap-2 empty:hidden">
              {/* Voice Status Indicators */}
              {enableVoice && isSpeechSupported && isListening && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1a1f2e] border border-red-500/20 shadow-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  <p className="text-white/80 text-[13px] font-medium tracking-wide">Escuchando tu respuesta...</p>
                </div>
              )}

              {/* Voice Transcript Feedback */}
              {enableVoice && isSpeechSupported && isVoiceMode && transcript && !isListening && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1a1f2e] border border-green-500/20 shadow-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <p className="text-white/80 text-[13px] font-medium tracking-wide">Texto capturado por voz - Presiona enviar o continúa hablando</p>
                </div>
              )}

              {/* Voice Error Indicator Matching Screenhsot */}
              {enableVoice && speechError && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1a1f2e] border border-red-500/20 shadow-lg mt-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                    <X className="w-3.5 h-3.5 text-red-500" strokeWidth={3} />
                  </div>
                  <p className="text-white/80 text-[13px] font-medium tracking-wide ml-0.5">Error de reconocimiento de voz - Intenta de nuevo</p>
                </div>
              )}
            </div>

            {/* Redesigned Dark Mode Input Container */}
            <div className="bg-[#1a1f2e] rounded-3xl p-3 flex flex-col gap-2 shadow-[0_4px_24px_rgba(0,0,0,0.5)] border border-white/5 w-full relative">
              
              {/* Top Row: Textarea */}
              <div className="px-2 pt-2 pb-1">
                <textarea
                  value={input}
                  onChange={handleTextInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  disabled={disabled || isLoading}
                  rows={2}
                  className="
                    w-full bg-transparent border-0 px-1 py-1
                    text-white text-[15px] placeholder-white/30 resize-none
                    focus:outline-none focus:ring-0 leading-relaxed
                    disabled:opacity-50 disabled:cursor-not-allowed
                    scrollbar-none
                  "
                  style={{
                    minHeight: '48px',
                    maxHeight: '160px'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = Math.min(target.scrollHeight, 160) + 'px'
                  }}
                />
              </div>

              {/* Bottom Row: Tool Actions */}
              <div className="flex items-center justify-end px-1 pb-1">

                {/* Right Side: Mic and Submit Tools */}
                <div className="flex items-center gap-2">
                  {/* Voice Button */}
                  {enableVoice && isSpeechSupported && (
                    <button
                      type="button"
                      onClick={handleVoiceToggle}
                      disabled={disabled || isLoading}
                      className={`
                        w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300
                        ${disabled || isLoading
                          ? 'text-white/20 cursor-not-allowed'
                          : isListening
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
                            : isVoiceMode && transcript
                              ? 'bg-white/10 hover:bg-white/20 text-green-400'
                              : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                        }
                      `}
                    >
                      {isListening ? (
                        <MicOff className="w-[18px] h-[18px]" />
                      ) : (
                        <Mic className="w-[18px] h-[18px]" />
                      )}
                    </button>
                  )}

                  {/* Elegant Send Button (Solid ArrowUp) */}
                  <button
                    type="submit"
                    disabled={isDisabled}
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
                      ${isDisabled
                        ? 'bg-white/10 text-white/30 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-gray-200 shadow-md transform hover:scale-105 active:scale-95'
                      }
                    `}
                  >
                    {isLoading ? (
                      <Loader className="w-[18px] h-[18px] text-gray-400 animate-spin" />
                    ) : (
                      <ArrowUp className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}