// Clean vocational test component
// Responsibility: Orchestrate sub-components and manage overall flow

import { useState, useRef, useEffect } from 'react'
import { Trophy, Clock, Play, Mic, Volume2, Target, Sparkles, Brain } from 'lucide-react'
import gsap from 'gsap'
import { useVocationalTest } from '../hooks/use-vocational-test'
import { ConversationHistory } from './conversation-history'
import { CareerRecommendations } from './career-recommendations'
import { PhaseTransitionButton } from './phase-transition-button'
import { MessageInput } from './message-input'
import { UIModeSwitcher, type UIMode } from './ui-mode-switcher'
import { VoiceInterface } from './voice-interface'
import { OnboardingProvider, vocationalTestLandingSteps, vocationalTestActiveSteps } from '@/features/onboarding'

interface VocationalTestProps {
  userId: string
  sessionId?: string
  onComplete?: (sessionId: string) => void
}

export function VocationalTest({ userId, sessionId, onComplete }: VocationalTestProps) {
  const [uiMode, setUIMode] = useState<UIMode>('voice')
  const glowLineRef = useRef<HTMLDivElement>(null)
  const bottomGlowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (glowLineRef.current) {
      gsap.fromTo(
        glowLineRef.current,
        { width: "2rem", opacity: 0.5 },
        { 
          width: "12rem", 
          opacity: 1, 
          duration: 1.5, 
          repeat: -1, 
          yoyo: true, 
          ease: "power2.inOut" 
        }
      )
    }

    if (bottomGlowRef.current) {
      gsap.to(bottomGlowRef.current, {
        opacity: 0.5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }
  }, [])
  
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
      <OnboardingProvider section="vocational-test" steps={vocationalTestLandingSteps}>
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

        {/* Background - Dark theme */}
        <div className="absolute inset-0 z-0 bg-[#020617] overflow-hidden">
          {/* Base dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617] to-transparent" />
          
          {/* Enhanced Bottom Light Source (Physical Light Effect) */}
          <div ref={bottomGlowRef} className="absolute bottom-0 left-0 right-0 h-[70vh] flex flex-col justify-end pointer-events-none origin-bottom">
            {/* Huge atmospheric wash */}
            <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-blue-800/80 via-blue-900/20 to-transparent" />
            
            {/* Intense radial bloom from the ground */}
            <div className="absolute -bottom-[30%] left-1/2 -translate-x-1/2 w-[180%] h-[120%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-500/80 via-blue-600/30 to-transparent blur-[70px]" />
            
            {/* Core light coming straight up from the floor */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-blue-400/70 via-blue-500/30 to-transparent blur-2xl" />
            
            {/* Hot blinding edge right at the intersection */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cyan-300/50 to-transparent blur-md" />
            
            {/* The absolute bright bottom physical line */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-[1px]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-cyan-100 to-transparent" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 min-h-screen flex flex-col items-center justify-center py-10">
          <div className="max-w-6xl mx-auto w-full">
            {/* Header Section */}
            <div id="test-landing-header" className="text-center mb-6">
              <div className="relative">
                {/* Elegant subtle top line glow */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
                
                {/* Hidden ref target to prevent GSAP animation errors */}
                <div ref={glowLineRef} className="hidden" />

                <style>{`
                  @keyframes title-shine {
                    0% { background-position: 200% center; }
                    100% { background-position: -200% center; }
                  }
                  .animate-title-shine {
                    background-size: 200% auto;
                    animation: title-shine 15s linear infinite;
                  }
                  @keyframes glare-sweep {
                    0% { transform: translateX(-150%) skewX(-20deg); }
                    100% { transform: translateX(300%) skewX(-20deg); }
                  }
                  @keyframes button-glow-pulse {
                    0%, 100% { opacity: 0.5; filter: blur(20px); transform: scale(0.95); }
                    50% { opacity: 1; filter: blur(30px); transform: scale(1.05); }
                  }
                `}</style>
                <div className="relative mb-4 flex justify-center px-4 mt-6">
                  <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight text-center flex flex-wrap justify-center items-center gap-x-3">
                    {/* Inner animated shimmer */}
                    <span className="bg-gradient-to-r from-slate-500 via-white to-slate-500 bg-clip-text text-transparent animate-title-shine">
                      Descubre tu Vocación
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Main content area - exact copy from original voice test controller */}
            <div className="max-w-4xl mx-auto px-6 pb-2">
              <div className="text-center space-y-8 relative">
                {/* Floating decorative elements - balanced */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/6 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -top-10 -right-32 w-32 h-32 bg-purple-500/7 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-32 left-1/4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
                
                {/* Naked CTA and description without card */}
                <div className="relative z-10 max-w-2xl mx-auto mt-8 flex flex-col items-center justify-center text-center gap-8">
                  {/* Subtle ambient glow behind the text to maintain legibility */}
                  <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-[60px] -z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  
                  <div className="max-w-md relative z-10">
                    <p className="text-[#94a3b8] text-sm md:text-base leading-relaxed font-light">
                      <span className="text-white font-medium block mb-2 text-lg">Conversa con ARIA</span>
                      Descubre tu perfil vocacional en una charla natural y amigable con nuestra IA.
                    </p>
                  </div>

                  <div id="start-test-button" className="shrink-0 relative z-10 group/btn cursor-pointer">
                    {/* Always active breathing 3D glow */}
                    {!hasExistingSession && (
                      <div className="absolute inset-[-10px] bg-blue-500/40 group-hover/btn:bg-blue-500/70 rounded-full animate-[button-glow-pulse_4s_ease-in-out_infinite] transition-colors duration-1000 pointer-events-none" />
                    )}

                    <button
                      onClick={startSession}
                      disabled={hasExistingSession}
                      className={`relative overflow-hidden inline-flex items-center justify-center px-10 py-3.5 rounded-full transition-all duration-1000 font-medium text-sm border ${
                        hasExistingSession 
                          ? 'bg-[#0f172a]/80 text-slate-500 cursor-not-allowed border-white/5'
                          : 'cursor-pointer bg-[#060b1c]/80 text-white border-blue-500/30 group-hover/btn:bg-blue-600 group-hover/btn:border-blue-400 group-hover/btn:text-white shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] group-hover/btn:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_inset_0_-4px_8px_rgba(0,0,0,0.3)]'
                      }`}
                    >
                      {/* Always active Glare effect sweeping across */}
                      {!hasExistingSession && (
                        <div className="absolute inset-0 -translate-x-[150%] animate-[glare-sweep_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-blue-200/30 group-hover/btn:via-white/50 to-transparent w-full pointer-events-none transition-colors duration-1000" />
                      )}
                      <span className="relative z-10">{hasExistingSession ? 'Test en Progreso' : 'Iniciar test'}</span>
                    </button>
                  </div>
                </div>
                
                {/* Message when incomplete session exists */}
                {hasExistingSession && (
                  <div className="text-center mt-4 relative z-10">
                    <p className="text-amber-300 text-sm">
                      Tienes un test en progreso. Complétalo o cancélalo para iniciar uno nuevo.
                    </p>
                  </div>
                )}

                {/* Enhanced Feature Cards */}
                <div id="test-features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8 relative z-10">
                  {/* General underglow for features section */}
                  <div className="absolute top-1/2 left-1/2 w-full h-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600/5 blur-[100px] pointer-events-none -z-10" />
                  
                  {[
                    { 
                      icon: Mic, 
                      title: 'Conversación Natural', 
                      desc: 'Habla libremente, como con un amigo de confianza',
                      color: 'text-blue-400',
                      bgGlow: 'from-blue-900/40 to-blue-800/20',
                      delay: '0s'
                    },
                    { 
                      icon: Volume2, 
                      title: 'IA Avanzada', 
                      desc: 'ARIA comprende contexto y emociones en tiempo real',
                      color: 'text-blue-400',
                      bgGlow: 'from-blue-900/40 to-blue-800/20',
                      delay: '0.2s'
                    },
                    { 
                      icon: Target, 
                      title: 'Análisis RIASEC', 
                      desc: 'Evaluación psicométrica adaptativa e inteligente',
                      color: 'text-blue-400',
                      bgGlow: 'from-blue-900/40 to-blue-800/20',
                      delay: '0.4s'
                    }
                  ].map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <div
                        key={index}
                        className="group relative rounded-[30px] overflow-visible bg-slate-800/20 transition-all duration-500 hover:-translate-y-1"
                        style={{ animationDelay: feature.delay }}
                      >
                        {/* Soft Outer Glow like in exactly the second picture */}
                        <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[30px]" />
                        
                        {/* Inner wrapper strictly for clipping the rotating square gradients to the card's rounded border shape */}
                        <div className="absolute inset-0 rounded-[30px] overflow-hidden pointer-events-none">
                          {/* The rotating gradient beam (subtle pulse) */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[conic-gradient(from_0deg,transparent_0_200deg,rgba(59,130,246,0.25)_360deg)] animate-[spin_4s_linear_infinite]" />
                          
                          {/* Stronger rotating glow appearing on hover */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(96,165,250,1)_360deg)] animate-[spin_4s_linear_infinite] opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
                        </div>
                        
                        {/* Main inner card - Glassmorphism. Masks the center so only border is animated */}
                        <div className="relative m-[1px] h-[calc(100%-2px)] w-[calc(100%-2px)] p-6 rounded-[29px] backdrop-blur-2xl flex flex-col items-center text-center z-10 box-border">
                          {/* Top rim light so it doesn't look totally dark without hover */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                          
                          {/* 3D Metallic Icon Container (Matching Reference & Blue Aesthetic) */}
                          <div className={`relative mb-6 w-[60px] h-[60px] rounded-full p-[1.5px] bg-gradient-to-b from-blue-300/60 via-slate-700/30 to-black/80 shadow-[0_15px_30px_rgba(0,0,0,0.8),_0_0_25px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-500`}>
                            {/* Inner dark matte face with inset shadow for depth */}
                            <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#131b2e] to-[#01030a] flex items-center justify-center overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.7)]">
                              {/* Subtle glass reflection on the top half of the inner face */}
                              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                              
                              {/* Central Icon */}
                              <IconComponent className={`relative z-10 w-6 h-6 ${feature.color} drop-shadow-[0_0_15px_currentColor]`} strokeWidth={1.5} />
                            </div>
                          </div>

                          {/* Content */}
                          <h3 className="text-white font-medium text-base mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Additional visual elements - Glassmorphism Pill */}
                <div className="flex justify-center items-center pt-8 relative z-10 w-full mb-4">
                  <div className="inline-flex items-center flex-wrap justify-center gap-3 sm:gap-5 px-5 sm:px-6 py-2.5 rounded-full bg-slate-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.5),_inset_0_0_20px_rgba(59,130,246,0.05)] backdrop-blur-md border border-white/5 transition-all duration-500 hover:border-white/10">
                    
                      <div className="flex items-center gap-2 text-slate-400 text-xs group hover:text-white transition-colors duration-300">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-900/20 border border-blue-500/10 group-hover:scale-110 group-hover:bg-blue-800/40 transition-all duration-300">
                          <Target className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="font-light tracking-wide text-[11px] sm:text-xs">Análisis personalizado</span>
                      </div>

                    <div className="w-1.5 h-1.5 bg-blue-500/30 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />

                      <div className="flex items-center gap-2 text-slate-400 text-xs group hover:text-white transition-colors duration-300">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-900/20 border border-blue-500/10 group-hover:scale-110 group-hover:bg-blue-800/40 transition-all duration-300">
                          <Volume2 className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="font-light tracking-wide text-[11px] sm:text-xs">100% conversacional</span>
                      </div>

                    <div className="w-1.5 h-1.5 bg-blue-500/30 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />

                      <div className="flex items-center gap-2 text-slate-400 text-xs group hover:text-white transition-colors duration-300">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-900/20 border border-blue-500/10 group-hover:scale-110 group-hover:bg-blue-800/40 transition-all duration-300">
                          <Trophy className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="font-light tracking-wide text-[11px] sm:text-xs">Resultados precisos</span>
                      </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </OnboardingProvider>
    )
  }

  // Loading state
  if (isStarting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        <div className="text-gray-900 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Iniciando tu sesión vocacional...</p>
        </div>
      </div>
    )
  }

  // Note: Removed immediate completion screen - now handled by PhaseTransitionButton

  // Main test interface
  return (
    <OnboardingProvider section="vocational-test-active" steps={vocationalTestActiveSteps}>
      <div className="h-screen bg-[#020617] flex flex-col relative overflow-hidden">
        {/* Subtle Dark Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617] to-transparent pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 right-0 h-[60vh] flex flex-col justify-end pointer-events-none z-0 opacity-40">
            <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[100%] h-[80%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-500/30 via-blue-900/10 to-transparent blur-3xl" />
        </div>

      {/* Enhanced Header with ARIA branding */}
      <div id="test-header" className="flex-shrink-0 relative z-20">
        {/* Header gradient line separator instead of full background */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
        <div
          className="relative backdrop-blur-2xl bg-[#0a1128]/60 shadow-lg"
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
                  <h1 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-white drop-shadow-sm font-medium">
                      Test Vocacional con
                    </span>
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-black tracking-wide">
                      ARIA
                    </span>
                  </h1>
                  <div className="flex items-center gap-3 text-slate-400 text-sm mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                      <span>Fase: <span className="text-white font-medium">{getPhaseText(currentPhase)}</span></span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <span
                      className="text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                    >
                      IA Conversacional
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Optional: Phase progress indicator with hover tooltips */}
              <div className="hidden md:flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1 font-medium tracking-wide uppercase">Progreso</div>
                  <div className="flex gap-1">
                    {['exploration', 'career_matching', 'reality_check', 'complete'].map((phase, index) => {
                      const phaseIndex = ['exploration', 'career_matching', 'reality_check', 'complete'].indexOf(currentPhase)
                      const isActive = phase === currentPhase
                      const isCompleted = index < phaseIndex

                      return (
                        <div
                          key={phase}
                          className={`w-3 h-1 rounded-full transition-all duration-300 relative group ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-400 to-indigo-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]'
                              : isCompleted
                                ? 'bg-slate-600'
                                : 'bg-slate-800'
                          }`}
                          title={phaseTranslations[phase]}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-3 right-0 bg-[#0f172a] text-slate-200 border border-slate-700 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10 shadow-xl">
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
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 80%,
                rgba(147, 51, 234, 0.08) 0%,
                rgba(147, 51, 234, 0.04) 30%,
                transparent 60%
              )
            `
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 80% 20%,
                rgba(59, 130, 246, 0.08) 0%,
                rgba(59, 130, 246, 0.04) 35%,
                transparent 65%
              )
            `
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 40% 40%,
                rgba(99, 102, 241, 0.06) 0%,
                rgba(99, 102, 241, 0.03) 40%,
                transparent 70%
              )
            `
          }}
        />
      </div>

      {/* Floating Elements for atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-blue-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-indigo-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main content area - single scrollable container */}
      <div className="flex-1 overflow-hidden flex flex-col relative z-10">
        
        {/* Career Recommendations Overlay (when needed) */}
        {uiBehavior.showCareers && recommendations && recommendations.length > 0 && (
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex flex-col">
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
              background: rgba(229, 231, 235, 0.5);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6));
              border-radius: 4px;
              transition: all 0.2s ease;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
            }
          `}</style>
          
          {/* UI Mode Switcher */}
          <div id="ui-mode-toggle" className="relative z-20 pt-6">
            <UIModeSwitcher
              currentMode={uiMode}
              onModeChange={setUIMode}
              disabled={isSending || isTransitioning}
            />
          </div>

          {/* Content based on UI mode */}
          {uiMode === 'chat' ? (
            <div id="conversation-display">
              <ConversationHistory
                messages={session?.conversation_history || []}
                currentPhase={currentPhase}
                enableVoice={true}
                autoSpeakNewMessages={false}
              />
            </div>
          ) : (
            <VoiceInterface
              onSendMessage={sendMessage}
              disabled={isSending || isTransitioning || (uiBehavior.showCareers && recommendations && recommendations.length > 0)}
              isLoading={isSending}
              currentQuestion={session?.conversation_history?.slice(-1)[0]?.role === 'assistant' ? session.conversation_history.slice(-1)[0].content : undefined}
              messages={session?.conversation_history || []}
              isComplete={isComplete}
              uiBehavior={uiBehavior}
            />
          )}
        </div>

        {/* Input Area - Only show for chat mode when no overlay */}
        {uiMode === 'chat' && !(uiBehavior.showCareers && recommendations && recommendations.length > 0) && (
          <>
            {(currentPhase === 'career_matching' || currentPhase === 'complete' || (currentPhase === 'reality_check' && isRealityCheckReady)) ? (
              <PhaseTransitionButton
                currentPhase={currentPhase}
                onTransition={() => {
                  if (currentPhase === 'career_matching') {
                    transitionToPhase('reality_check')
                  } else if (currentPhase === 'reality_check') {
                    completeRealityCheck()
                  } else if (currentPhase === 'complete') {
                    onComplete?.(currentSessionId!)
                  }
                }}
                isLoading={isTransitioning}
                isRealityCheckReady={isRealityCheckReady}
              />
            ) : (
              <div id="message-input">
                <MessageInput
                  onSendMessage={sendMessage}
                  disabled={isSending || isTransitioning}
                  isLoading={isSending}
                  enableVoice={true}
                  placeholder="Responde a ARIA..."
                />
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </OnboardingProvider>
  )
}