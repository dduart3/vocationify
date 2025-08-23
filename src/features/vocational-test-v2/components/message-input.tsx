// MessageInput component
// Responsibility: Handle user input (text for now, voice later)

import { useState } from 'react'
import { Send, Loader } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  isLoading?: boolean
  placeholder?: string
}

export function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  isLoading = false,
  placeholder = "Escribe tu respuesta..." 
}: MessageInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    
    if (trimmedInput && !disabled && !isLoading) {
      onSendMessage(trimmedInput)
      setInput('')
    }
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
    <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex gap-3 max-w-4xl mx-auto">
          
          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="
                w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3
                text-white placeholder-white/50 resize-none
                focus:outline-none focus:border-blue-400 focus:bg-white/15
                disabled:opacity-50 disabled:cursor-not-allowed
                min-h-[48px] max-h-32
              "
              style={{
                height: 'auto',
                minHeight: '48px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = Math.min(target.scrollHeight, 128) + 'px'
              }}
            />
            
            {/* Character counter for longer messages */}
            {input.length > 100 && (
              <div className="absolute bottom-1 right-2 text-xs text-white/40">
                {input.length}/500
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`
              px-6 py-3 rounded-xl font-medium flex items-center gap-2
              transition-all duration-200 min-w-[120px] justify-center
              ${isDisabled
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 shadow-lg'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar
              </>
            )}
          </button>
        </div>

        {/* Input status/hints */}
        {disabled && !isLoading && (
          <div className="mt-3 text-center">
            <p className="text-white/50 text-sm">
              💭 ARIA está procesando tu respuesta anterior...
            </p>
          </div>
        )}
        
        {isLoading && (
          <div className="mt-3 text-center">
            <p className="text-white/60 text-sm">
              🤖 ARIA está pensando...
            </p>
          </div>
        )}
      </form>
    </div>
  )
}