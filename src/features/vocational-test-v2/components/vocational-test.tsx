// Clean vocational test component
// Responsibility: Orchestrate sub-components and manage overall flow

import { useEffect, useState } from 'react'
import { Trophy, ArrowRight, Clock, Play, X, Mic, Volume2, Target, Sparkles, Brain } from 'lucide-react'
import { useVocationalTest } from '../hooks/use-vocational-test'
import { ConversationHistory } from './conversation-history'
import { CareerRecommendations } from './career-recommendations'
import { PhaseTransitionButton } from './phase-transition-button'
import { MessageInput } from './message-input'
import { UIModeSwitcher, type UIMode } from './ui-mode-switcher'
import { VoiceInterface } from './voice-interface'

interface VocationalTestProps {
  userId: string
  sessionId?: string
  onComplete?: (sessionId: string) => void
}

export function VocationalTest({ userId, sessionId, onComplete }: VocationalTestProps) {
  const [uiMode, setUIMode] = useState<UIMode>('voice')
  
  const {
    session,
    sessionId: currentSessionId,
    currentPhase,
    uiBehavior,
    hasSession,
    hasExistingSession,
    existingSession,
    isComplete,
    recommendations,
    isRealityCheckReady,
    
    // Actions
    startSession,
    resumeSession,
    sendMessage,
    transitionToPhase,
    completeRealityCheck,
    
    // Loading states
    isStarting,
    isSending,
    isTransitioning
  } = useVocationalTest({ userId, sessionId })

  // Utility functions from original banner component
  const formatTime = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0) {
      return `hace ${diffHours}h ${diffMins}m`
    }
    return `hace ${diffMins}m`
  }

  // Phase translations - keeps original English values for backend, displays Spanish for users
  const phaseTranslations: Record<string, string> = {
    'greeting': 'Iniciando conversación',
    'exploration': 'Explorando intereses', 
    'career_matching': 'Analizando carreras',
    'reality_check': 'Evaluando perfil',
    'complete': 'Generando recomendaciones',
    'final_results': 'Resultados finales'
  }

  const getPhaseText = (phase: string) => {
    return phaseTranslations[phase] || 'En progreso'
  }

  // Completion is now handled manually via the "Ver resultados" button
  // No automatic redirect - user must click the button to go to results

  // No session - show start screen
  if (!hasSession && !isStarting) {
    return (
      <div className="flex-1 min-h-screen relative overflow-hidden">
        {/* Resume Session Banner - exactly like original */}
        {hasExistingSession && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-xl rounded-xl p-4 shadow-2xl ring-1 ring-white/20">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">
                      Test vocacional en progreso
                    </h3>
                    <p className="text-white/80 text-xs mt-1">
                      {getPhaseText(existingSession?.current_phase || 'En progreso')} • {formatTime(existingSession?.updated_at || '')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {/* Hide banner - will implement dismiss logic */}}
                  className="text-white/60 hover:text-white transition-colors duration-200 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={resumeSession}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 text-sm font-medium w-full"
                >
                  <Play className="w-4 h-4" />
                  Continuar test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Background - exact copy from original */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        {/* Floating Elements - exact copy from landing page */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="relative">
                {/* Subtle animated background */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-96 h-16 bg-gradient-to-r from-blue-500/8 via-purple-500/10 to-indigo-500/8 blur-3xl rounded-full animate-pulse" />
                
                <h1 className="relative text-6xl md:text-7xl font-black mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-50 to-purple-50 bg-clip-text text-transparent">
                    Test Vocacional
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                    con IA
                  </span>
                </h1>
              </div>
            </div>

            {/* Main content area - exact copy from original voice test controller */}
            <div className="max-w-4xl mx-auto px-6 pb-2">
              <div className="text-center space-y-8 relative">
                {/* Floating decorative elements - balanced */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/6 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -top-10 -right-32 w-32 h-32 bg-purple-500/7 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-32 left-1/4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
                
                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                      Conversa con ARIA
                    </h2>
                    <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
                      Descubre tu perfil vocacional en una charla natural
                    </p>
                  </div>
                </div>

                {/* Enhanced CTA Button */}
                <div className="relative inline-block">
                  <div className={`absolute -inset-2 rounded-2xl blur-lg opacity-75 ${
                    hasExistingSession 
                      ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30' 
                      : 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 animate-pulse'
                  }`}></div>
                  <button
                    onClick={startSession}
                    disabled={hasExistingSession}
                    className={`relative group inline-flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-500 ${
                      hasExistingSession 
                        ? 'bg-gradient-to-r from-amber-500/50 to-orange-500/50 cursor-not-allowed opacity-70'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-white/20 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      hasExistingSession ? '' : 'group-hover:rotate-12'
                    }`}>
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </div>
                    <div className="text-white font-bold text-lg">
                      {hasExistingSession ? 'Test en Progreso' : 'Iniciar Test'}
                    </div>
                  </button>
                </div>
                
                {/* Message when incomplete session exists */}
                {hasExistingSession && (
                  <div className="text-center mt-4">
                    <p className="text-amber-300 text-sm">
                      Tienes un test en progreso. Complétalo o cancélalo para iniciar uno nuevo.
                    </p>
                  </div>
                )}

                {/* Enhanced Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-12">
                  {[
                    { 
                      icon: Mic, 
                      title: 'Conversación Natural', 
                      desc: 'Habla libremente, como con un amigo de confianza',
                      color: 'from-green-400 to-emerald-500',
                      bgGlow: 'bg-green-500/10',
                      delay: '0s'
                    },
                    { 
                      icon: Volume2, 
                      title: 'IA Avanzada', 
                      desc: 'ARIA comprende contexto y emociones en tiempo real',
                      color: 'from-blue-400 to-cyan-500',
                      bgGlow: 'bg-blue-500/10',
                      delay: '0.2s'
                    },
                    { 
                      icon: Target, 
                      title: 'Análisis RIASEC', 
                      desc: 'Evaluación psicométrica adaptativa e inteligente',
                      color: 'from-purple-400 to-pink-500',
                      bgGlow: 'bg-purple-500/10',
                      delay: '0.4s'
                    }
                  ].map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <div
                        key={index}
                        className="group relative"
                        style={{ animationDelay: feature.delay }}
                      >
                        {/* Floating glow effect */}
                        <div className={`absolute -inset-2 ${feature.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        {/* Main card */}
                        <div
                          className="relative p-8 rounded-3xl backdrop-blur-xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2"
                          style={{
                            background: `
                              linear-gradient(135deg, 
                                rgba(255, 255, 255, 0.08) 0%, 
                                rgba(255, 255, 255, 0.02) 100%
                              )
                            `,
                            boxShadow: `
                              0 8px 32px 0 rgba(31, 38, 135, 0.37),
                              inset 0 1px 0 rgba(255, 255, 255, 0.1),
                              0 1px 0 rgba(255, 255, 255, 0.05)
                            `
                          }}
                        >
                          {/* Icon with gradient background */}
                          <div className="relative mb-6">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-1 mx-auto group-hover:rotate-12 transition-transform duration-300`}>
                              <div className="w-full h-full bg-black/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <IconComponent className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Content */}
                          <h3 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-100 group-hover:bg-clip-text transition-all duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                            {feature.desc}
                          </p>
                          
                          {/* Decorative elements */}
                          <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ animationDelay: '0.1s' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Additional visual elements */}
                <div className="flex justify-center items-center gap-8 pt-8 opacity-80">
                  <div className="flex items-center gap-3 text-slate-300 text-sm group hover:text-white transition-colors duration-300">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(59, 130, 246, 0.2) 0%, 
                            rgba(147, 51, 234, 0.2) 100%
                          )
                        `,
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Target className="w-4 h-4 text-blue-400" />
                    </div>
                    <span>Análisis personalizado</span>
                  </div>
                  
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-sm" />
                  
                  <div className="flex items-center gap-3 text-slate-300 text-sm group hover:text-white transition-colors duration-300">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(34, 197, 94, 0.2) 0%, 
                            rgba(16, 185, 129, 0.2) 100%
                          )
                        `,
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Volume2 className="w-4 h-4 text-green-400" />
                    </div>
                    <span>100% conversacional</span>
                  </div>
                  
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400/30 to-purple-400/30 rounded-full blur-sm" />
                  
                  <div className="flex items-center gap-3 text-slate-300 text-sm group hover:text-white transition-colors duration-300">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(147, 51, 234, 0.2) 0%, 
                            rgba(236, 72, 153, 0.2) 100%
                          )
                        `,
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <Trophy className="w-4 h-4 text-purple-400" />
                    </div>
                    <span>Resultados precisos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isStarting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Iniciando tu sesión vocacional...</p>
        </div>
      </div>
    )
  }

  // Note: Removed immediate completion screen - now handled by PhaseTransitionButton

  // Main test interface
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Enhanced Header with ARIA branding */}
      <div className="flex-shrink-0 relative z-20">
        {/* Header gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/8 via-purple-500/12 to-purple-600/8" />
        <div 
          className="relative backdrop-blur-xl bg-black/20"
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.03)'
          }}
        >
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* ARIA Logo/Icon */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-xl" />
                    <Brain className="w-7 h-7 text-white relative z-10" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      Test Vocacional con
                    </span>
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent font-black tracking-wide">
                      ARIA
                    </span>
                  </h1>
                  <div className="flex items-center gap-3 text-white/70 text-sm mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span>Fase: <span className="text-white font-medium">{getPhaseText(currentPhase)}</span></span>
                    </div>
                    <span>•</span>
                    <span 
                      className="text-green-300 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(34, 197, 94, 0.15) 0%, 
                            rgba(16, 185, 129, 0.15) 100%
                          )
                        `,
                        boxShadow: `
                          0 2px 8px 0 rgba(34, 197, 94, 0.2),
                          inset 0 1px 0 rgba(255, 255, 255, 0.05)
                        `
                      }}
                    >
                      IA Conversacional
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Optional: Phase progress indicator with hover tooltips */}
              <div className="hidden md:flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-white/50 mb-1">Progreso</div>
                  <div className="flex gap-1">
                    {['exploration', 'career_matching', 'reality_check', 'complete'].map((phase, index) => {
                      const phaseIndex = ['exploration', 'career_matching', 'reality_check', 'complete'].indexOf(currentPhase)
                      const isActive = phase === currentPhase
                      const isCompleted = index < phaseIndex
                      const isPending = index > phaseIndex
                      
                      return (
                        <div
                          key={phase}
                          className={`w-3 h-1 rounded-full transition-all duration-300 relative group ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
                              : isCompleted
                                ? 'bg-white/30'
                                : 'bg-white/10'
                          }`}
                          title={phaseTranslations[phase]}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-3 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                            {phaseTranslations[phase]}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background overlays with glassmorphism effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 backdrop-blur-3xl"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, 
                rgba(147, 51, 234, 0.15) 0%, 
                rgba(147, 51, 234, 0.08) 30%,
                transparent 60%
              )
            `
          }}
        />
        <div 
          className="absolute inset-0 backdrop-blur-2xl"
          style={{
            background: `
              radial-gradient(circle at 80% 20%, 
                rgba(168, 85, 247, 0.12) 0%, 
                rgba(168, 85, 247, 0.06) 35%,
                transparent 65%
              )
            `
          }}
        />
        <div 
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            background: `
              radial-gradient(circle at 40% 40%, 
                rgba(139, 92, 246, 0.10) 0%, 
                rgba(139, 92, 246, 0.04) 40%,
                transparent 70%
              )
            `
          }}
        />
      </div>

      {/* Floating Elements for atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 w-64 h-64 bg-purple-500/6 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-indigo-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main content area - single scrollable container */}
      <div className="flex-1 overflow-hidden flex flex-col relative z-10">
        
        {/* Career Recommendations Overlay (when needed) */}
        {uiBehavior.showCareers && recommendations && recommendations.length > 0 && (
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
            {/* Career recommendations content - no duplicate header, uses main header */}
            <div className="flex-1 overflow-y-auto p-6 pt-24">
              <div className="max-w-4xl mx-auto">
                <CareerRecommendations 
                  recommendations={recommendations}
                />
              </div>
            </div>

            {/* Transition button for careers overlay */}
            {(currentPhase === 'career_matching' || currentPhase === 'complete') && (
              <PhaseTransitionButton
                currentPhase={currentPhase}
                onTransition={() => {
                  if (currentPhase === 'career_matching') {
                    transitionToPhase('reality_check')
                  } else if (currentPhase === 'complete') {
                    onComplete?.(currentSessionId!)
                  }
                }}
                isLoading={isTransitioning}
                isRealityCheckReady={isRealityCheckReady}
              />
            )}
          </div>
        )}
        
        {/* Chat Interface with custom scrollbar */}
        <div 
          className="flex-1 overflow-y-auto custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(147, 51, 234, 0.3) rgba(255, 255, 255, 0.05)'
          }}
        >
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.05);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4));
              border-radius: 4px;
              transition: all 0.2s ease;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6));
            }
          `}</style>
          
          {/* UI Mode Switcher */}
          <div className="relative z-20 pt-6">
            <UIModeSwitcher 
              currentMode={uiMode}
              onModeChange={setUIMode}
              disabled={isSending || isTransitioning}
            />
          </div>
          
          {/* Content based on UI mode */}
          {uiMode === 'chat' ? (
            <ConversationHistory 
              messages={session?.conversation_history || []}
              currentPhase={currentPhase}
              enableVoice={true}
              autoSpeakNewMessages={false}
            />
          ) : (
            <VoiceInterface
              onSendMessage={sendMessage}
              disabled={isSending || isTransitioning || (uiBehavior.showCareers && recommendations && recommendations.length > 0)}
              isLoading={isSending}
              currentQuestion={session?.conversation_history?.slice(-1)[0]?.role === 'assistant' ? session.conversation_history.slice(-1)[0].content : undefined}
              messages={session?.conversation_history || []}
              isComplete={isComplete}
            />
          )}
        </div>

        {/* Input Area - Only show for chat mode when no overlay */}
        {uiMode === 'chat' && !(uiBehavior.showCareers && recommendations && recommendations.length > 0) && (
          <>
            {(currentPhase === 'career_matching' || currentPhase === 'complete') ? (
              <PhaseTransitionButton
                currentPhase={currentPhase}
                onTransition={() => {
                  if (currentPhase === 'career_matching') {
                    transitionToPhase('reality_check')
                  } else if (currentPhase === 'complete') {
                    onComplete?.(currentSessionId!)
                  }
                }}
                isLoading={isTransitioning}
                isRealityCheckReady={isRealityCheckReady}
              />
            ) : (
              <MessageInput
                onSendMessage={sendMessage}
                disabled={isSending || isTransitioning}
                isLoading={isSending}
                enableVoice={true}
                placeholder="Responde a ARIA..."
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}