import { useState } from 'react'
import { VoiceBubble } from './components/voice-bubble'
import { ChatInterface } from './components/chat-interface'
import { InteractionToggle } from './components/interaction-toggle'
import { 
  IconSparkles, 
  IconTarget, 
  IconMicrophone, 
  IconChartBar, 
  IconSchool,
  IconBrain,
  IconBriefcase,
  IconBuilding,
  IconTrendingUp,
  IconClock,
  IconDatabase
} from '@tabler/icons-react'

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
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 mb-6">
              <IconSparkles className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">Powered by AI</span>
            </div>
            
            <h1 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Test Vocacional
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Descubre tu camino profesional ideal a través de una conversación inteligente 
              con <span className="text-blue-400 font-semibold">ARIA</span>, nuestra asistente de orientación vocacional
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { icon: IconTarget, text: 'Análisis Personalizado' },
                { icon: IconMicrophone, text: 'Interacción por Voz' },
                { icon: IconChartBar, text: 'Resultados Precisos' },
                { icon: IconSchool, text: 'Recomendaciones Universitarias' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.08) 0%, 
                        rgba(255, 255, 255, 0.04) 100%
                      )
                    `,
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <feature.icon className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300 text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Interaction Mode Toggle */}
            <InteractionToggle 
              mode={interactionMode} 
              onModeChange={setInteractionMode} 
            />
          </div>

          {/* Main Test Area */}
          {interactionMode === 'voice' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left Info Panel */}
              <div className="lg:col-span-1 space-y-6">
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.08) 0%, 
                        rgba(255, 255, 255, 0.04) 100%
                      )
                    `,
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">¿Cómo funciona?</h3>
                  <div className="space-y-4">
                    {[
                      { step: '01', text: 'Haz clic en ARIA para comenzar' },
                      { step: '02', text: 'Responde las preguntas por voz' },
                      { step: '03', text: 'Recibe tu perfil vocacional' },
                      { step: '04', text: 'Explora carreras recomendadas' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {item.step}
                        </div>
                        <span className="text-slate-300 text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(34, 197, 94, 0.08) 0%, 
                        rgba(34, 197, 94, 0.04) 100%
                      )
                    `,
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <IconClock className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">Duración estimada</span>
                  </div>
                  <p className="text-white text-2xl font-bold">15-20 minutos</p>
                  <p className="text-slate-400 text-sm mt-1">Tiempo promedio de completación</p>
                </div>
              </div>

              {/* Center - Voice Bubble */}
              <div className="lg:col-span-1 flex justify-center">
                <VoiceBubble />
              </div>

              {/* Right Stats Panel */}
              <div className="lg:col-span-1 space-y-6">
                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.08) 0%, 
                        rgba(255, 255, 255, 0.04) 100%
                      )
                    `,
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Qué descubrirás</h3>
                  <div className="space-y-4">
                    {[
                      { icon: IconBrain, title: 'Tu perfil RIASEC', desc: 'Intereses y personalidad vocacional' },
                      { icon: IconBriefcase, title: 'Carreras compatibles', desc: 'Profesiones que se ajustan a ti' },
                      { icon: IconBuilding, title: 'Universidades', desc: 'Instituciones recomendadas' },
                      { icon: IconTrendingUp, title: 'Plan de acción', desc: 'Próximos pasos a seguir' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <item.icon className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="text-white font-medium text-sm">{item.title}</h4>
                          <p className="text-slate-400 text-xs">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="p-6 rounded-2xl"
                  style={{
                    background: `
                      linear-gradient(135deg, 
                        rgba(59, 130, 246, 0.08) 0%, 
                        rgba(147, 51, 234, 0.08) 100%
                      )
                    `,
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <IconDatabase className="w-6 h-6 text-blue-400 mr-2" />
                      <div className="text-3xl font-bold text-white">73+</div>
                    </div>
                    <div className="text-blue-400 text-sm font-medium mb-2">Carreras disponibles</div>
                    <div className="text-slate-400 text-xs">En nuestra base de datos</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Chat Interface */
            <div className="flex justify-center">
              <ChatInterface 
                onSwitchToVoice={() => setInteractionMode('voice')}
                isVoiceAvailable={true}
              />
            </div>
          )}

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div
              className="inline-block p-6 rounded-2xl max-w-2xl"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.05) 0%, 
                    rgba(255, 255, 255, 0.02) 100%
                  )
                `,
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <p className="text-slate-300 text-lg leading-relaxed">
                <span className="text-blue-400 font-semibold">ARIA</span> utilizará inteligencia artificial 
                para analizar tus respuestas y generar un perfil vocacional personalizado basado en el 
                modelo <span className="text-purple-400 font-semibold">Holland RIASEC</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

