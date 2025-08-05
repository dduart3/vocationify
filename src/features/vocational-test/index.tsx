import { useState } from 'react'
import { VoiceTestController } from './components/voice-test-controller'
import { ChatInterface } from './components/chat-interface'
import { InteractionToggle } from './components/interaction-toggle'
import { 
  IconSparkles, 
} from '@tabler/icons-react'
import { 
  Target, 
  Mic, 
  BarChart3, 
  GraduationCap,
  Brain,
  Briefcase,
  School,
  Clock,
  Database
} from 'lucide-react'

export function VocationalTest() {
  const [interactionMode, setInteractionMode] = useState<'voice' | 'chat'>('voice')

  return (
    <div className="flex-1 min-h-screen relative overflow-hidden">
      {/* Background remains the same */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.15),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 mb-8">
              <IconSparkles className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">Powered by AI</span>
            </div>
            
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Test Vocacional RIASEC
              </span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              Descubre tu perfil vocacional con <span className="text-blue-400 font-semibold">ARIA</span>, 
              tu asistente inteligente de orientación profesional
            </p>

            {/* Interaction Mode Toggle */}
            <InteractionToggle 
              mode={interactionMode} 
              onModeChange={setInteractionMode} 
            />
          </div>

          {/* Main Test Area */}
          {interactionMode === 'voice' ? (
            <VoiceTestController onTestComplete={(sessionId) => console.log('Test completed:', sessionId)} />
          ) : (
            /* Chat Interface */
            <div className="flex justify-center">
              <ChatInterface 
                onSwitchToVoice={() => setInteractionMode('voice')}
                isVoiceAvailable={true}
                onTestComplete={(sessionId) => console.log('Test completed:', sessionId)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

