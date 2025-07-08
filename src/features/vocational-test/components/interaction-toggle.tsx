import { useState } from 'react'
import { IconMicrophone, IconMessage } from '@tabler/icons-react'

interface InteractionToggleProps {
  mode: 'voice' | 'chat'
  onModeChange: (mode: 'voice' | 'chat') => void
}

export function InteractionToggle({ mode, onModeChange }: InteractionToggleProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div
        className="flex items-center p-1 rounded-full"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 100%
            )
          `,
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <button
          onClick={() => onModeChange('voice')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
            mode === 'voice'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <IconMicrophone className="w-5 h-5" />
          <span className="font-medium">Voz</span>
        </button>
        
        <button
          onClick={() => onModeChange('chat')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
            mode === 'chat'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <IconMessage className="w-5 h-5" />
          <span className="font-medium">Chat</span>
        </button>
      </div>
    </div>
  )
}
