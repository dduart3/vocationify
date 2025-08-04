import { useState } from 'react'
import { VoiceBubble } from './components/voice-bubble'
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
            <div className="space-y-8">
              {/* Top Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  { icon: Target, title: 'Análisis Personalizado', desc: 'Basado en tus respuestas', color: 'text-blue-400' },
                  { icon: Mic, title: 'Interacción por Voz', desc: 'Habla naturalmente', color: 'text-green-400' },
                  { icon: BarChart3, title: 'Resultados Precisos', desc: 'Modelo RIASEC científico', color: 'text-purple-400' },
                  { icon: GraduationCap, title: 'Recomendaciones', desc: 'Carreras y universidades', color: 'text-orange-400' }
                ].map((feature, index) => {
                  const IconComponent = feature.icon
                  return (
                    <div
                      key={index}
                      className="text-center p-4 rounded-xl group hover:scale-105 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)`,
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className={`w-8 h-8 ${feature.color}`} />
                      </div>
                      <div className="text-white text-sm font-medium mb-1">{feature.title}</div>
                      <div className="text-slate-400 text-xs">{feature.desc}</div>
                    </div>
                  )
                })}
              </div>

              {/* Main Voice Bubble Area */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 items-center">
                {/* Left Side Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div
                    className="p-6 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)`,
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">¿Cómo funciona?</h3>
                    <div className="space-y-3">
                      {[
                        { step: '1', text: 'Haz clic en ARIA para comenzar' },
                        { step: '2', text: 'Responde las preguntas por voz' },
                        { step: '3', text: 'Recibe tu perfil vocacional' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                            {item.step}
                          </div>
                          <span className="text-slate-300 text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: `linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.04) 100%)`,
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium text-sm">Duración</span>
                    </div>
                    <div className="text-white text-2xl font-bold">15-20 min</div>
                    <div className="text-slate-400 text-xs">Tiempo promedio</div>
                  </div>
                </div>

                {/* Center - Voice Bubble */}
                <div className="lg:col-span-3 flex justify-center">
                  <VoiceBubble onTestComplete={(sessionId) => console.log('Test completed:', sessionId)} />
                </div>

                {/* Right Side Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div
                    className="p-6 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)`,
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">Qué descubrirás</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Brain, title: 'Tu perfil RIASEC', desc: 'Personalidad vocacional', color: 'text-blue-400' },
                        { icon: Briefcase, title: 'Carreras compatibles', desc: 'Profesiones ideales', color: 'text-purple-400' },
                        { icon: School, title: 'Universidades', desc: 'Instituciones cercanas', color: 'text-orange-400' }
                      ].map((item, index) => {
                        const IconComponent = item.icon
                        return (
                          <div key={index} className="flex items-start space-x-3">
                            <IconComponent className={`w-5 h-5 mt-0.5 ${item.color}`} />
                            <div>
                              <h4 className="text-white font-medium text-sm">{item.title}</h4>
                              <p className="text-slate-400 text-xs">{item.desc}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: `linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)`,
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium text-sm">Base de datos</span>
                    </div>
                    <div className="text-white text-2xl font-bold">73+ carreras</div>
                    <div className="text-slate-400 text-xs">Disponibles para ti</div>
                  </div>
                </div>
              </div>

              {/* Bottom Call to Action */}
              <div className="text-center max-w-3xl mx-auto">
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)`,
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <p className="text-slate-300 text-base leading-relaxed">
                    <span className="text-blue-400 font-semibold">ARIA</span> utilizará inteligencia artificial 
                    para analizar tus respuestas y generar un perfil vocacional personalizado basado en el 
                    modelo <span className="text-purple-400 font-semibold">Holland RIASEC</span>
                  </p>
                </div>
              </div>
            </div>
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

