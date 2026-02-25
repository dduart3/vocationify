// Clean vocational test component
// Responsibility: Orchestrate sub-components and manage overall flow

import { useState, useRef, useEffect } from 'react'
import { Trophy, Clock, Play, Mic, Volume2, Target } from 'lucide-react'
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
  const glowLeftRef = useRef<HTMLDivElement>(null)
  const glowRightRef = useRef<HTMLDivElement>(null)
  const glowCenterRef = useRef<HTMLDivElement>(null)
  const glowEdgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (glowLineRef.current) {
      gsap.fromTo(
        glowLineRef.current,
        { width: "2rem", opacity: 0.5 },
        { width: "12rem", opacity: 1, duration: 1.5, repeat: -1, yoyo: true, ease: "power2.inOut" }
      )
    }

    // Animated breathing on each glow layer
    if (glowLeftRef.current) {
      gsap.fromTo(glowLeftRef.current,
        { opacity: 0.55, scale: 1 },
        { opacity: 0.85, scale: 1.08, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" }
      )
    }
    if (glowRightRef.current) {
      gsap.fromTo(glowRightRef.current,
        { opacity: 0.55, scale: 1 },
        { opacity: 0.85, scale: 1.08, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 }
      )
    }
    if (glowCenterRef.current) {
      gsap.fromTo(glowCenterRef.current,
        { opacity: 0.4, scale: 1 },
        { opacity: 0.7, scale: 1.05, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 }
      )
    }
    if (glowEdgeRef.current) {
      gsap.fromTo(glowEdgeRef.current,
        { opacity: 0.6 },
        { opacity: 1, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" }
      )
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
        <div className="flex-1 min-h-screen relative overflow-hidden animate-in fade-in duration-1000">
          {/* Shared dark base so transitions are smooth */}
          <div className="absolute inset-0 bg-[#020617] -z-20" />
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
          <div className="absolute inset-0 bg-[#020617]" />
          
          {/* Clean Dark Background with simple glow */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Subtle bottom glow to anchor the page */}
            <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-blue-900/10 to-transparent" />
            {/* Very thin bright line at the bottom */}
            <div ref={glowEdgeRef} className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent opacity-40" />
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
                        <div className="relative m-[1px] h-[calc(100%-2px)] w-[calc(100%-2px)] p-6 rounded-[29px] backdrop-blur-2xl flex flex-col items-center text-center z-10 box-border overflow-hidden bg-[#020617]/40">
                          {/* Subtle Noise/Grain Texture */}
                          <div 
                            className="absolute inset-0 z-0 opacity-20 mix-blend-screen pointer-events-none" 
                            style={{ 
                              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                              maskImage: 'linear-gradient(to bottom right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)',
                              WebkitMaskImage: 'linear-gradient(to bottom right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)'
                            }} 
                          />
                          
                          {/* Top rim light so it doesn't look totally dark without hover */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-10" />
                          
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
      <div className="flex-1 min-h-screen relative overflow-hidden bg-[#020617] flex items-center justify-center animate-in fade-in duration-700">
        {/* Transitional background matches the landing page theme */}
        <div className="absolute inset-0 bg-[#020617] z-0" />
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-gradient-to-t from-blue-900/10 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent opacity-40" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
          </div>
          <div className="text-blue-400 font-light tracking-widest uppercase text-sm animate-pulse">
            Iniciando sistema ARIA...
          </div>
        </div>
      </div>
    )
  }

  // Note: Removed immediate completion screen - now handled by PhaseTransitionButton

  // Main test interface
  return (
    <OnboardingProvider section="vocational-test-active" steps={vocationalTestActiveSteps}>
      <div className="h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden animate-in fade-in duration-1000">
        {/* Shared base so transitions are smooth */}
        <div className="absolute inset-0 bg-[#f8fafc] -z-20" />
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-[#f8fafc] pointer-events-none z-0" />
        
        {/* Exact Sandra AI Background Match: Blue Gradient + Light Ellipse from Top */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-[#f8fafc]">
            {/* 1. The Multi-Color Pastel Gradient Background */}
            <div 
              className="absolute inset-x-0 bottom-0 h-full opacity-100" 
              style={{
                background: 'linear-gradient(120deg, #fed7aa 0%, #fbcfe8 45%, #bae6fd 100%)',
                maskImage: 'linear-gradient(to top, black 10%, transparent 65%)',
                WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 65%)'
              }}
            />

            {/* Premium Fine Grain Texture Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '120px 120px',
              }}
            />

            {/* 2. The Ellipse from Top to Bottom (creating the U-shape downward arch) */}
            <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[95vh] bg-[#f8fafc] rounded-[50%] blur-[70px]" />
            <div className="absolute -top-[5%] left-1/2 -translate-x-1/2 w-[70vw] h-[90vh] bg-[#f8fafc] rounded-[50%] blur-[40px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55vw] h-[85vh] bg-[#f8fafc] rounded-[50%] blur-[20px]" />

            {/* Warm reflection edge */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 opacity-60" />
            <div className="absolute bottom-0 inset-x-0 h-[8px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 blur-[4px] opacity-40" />
        </div>

      {/* Floating Navbar Content */}
      <div id="test-header" className="flex-shrink-0 relative z-20 pt-8 w-full flex justify-center px-4">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-between gap-6 transition-all duration-300">
            
            {/* Left side: Minimalist Logo */}
            <div className="flex items-center justify-start lg:w-[220px]">
              <h1 className="text-xl font-medium tracking-tight text-slate-800 flex gap-1.5 items-center">
                ARIA <span className="text-slate-500 font-normal">AI</span>
              </h1>
            </div>

            {/* Center: Glowing Dot HUD Wizard */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="hidden lg:flex items-center justify-between w-[380px] relative px-4 mt-[-10px]">
                {(() => {
                  const steps = [
                    { label: 'Inicio', matches: ['greeting', 'initial'] },
                    { label: 'Exploración', matches: ['exploration'] },
                    { label: 'Análisis', matches: ['career_matching'] },
                    { label: 'Viabilidad', matches: ['reality_check'] },
                    { label: 'Resultados', matches: ['complete', 'final_results'] }
                  ];
                  const currentIdx = Math.max(0, steps.findIndex(s => s.matches.includes(currentPhase)));

                  return (
                    <>
                      {/* Background Connecting Line */}
                      <div className="absolute top-[8px] left-[8%] right-[8%] h-[2px] bg-slate-300 z-0 rounded-full" />
                      
                      {/* Animated Glowing Connecting Line */}
                      <div 
                        className="absolute top-[8px] left-[8%] h-[2px] bg-blue-500 z-0 rounded-full shadow-[0_0_10px_#3b82f6] transition-all duration-[1.5s] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{ width: `${(currentIdx / (steps.length - 1)) * 84}%` }}
                      />

                      {steps.map((step, idx) => {
                        const isPast = idx < currentIdx;
                        const isCurrent = idx === currentIdx;
                        const isActive = isPast || isCurrent;

                        return (
                          <div key={step.label} className="relative z-10 flex flex-col items-center">
                            {/* Glowing Dot Ring */}
                            <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-all duration-700 ease-in-out bg-[#f8fafc] ${
                              isActive ? 'border-blue-500 shadow-[0_0_12px_#3b82f6]' : 'border-slate-300'
                            }`}>
                              {/* Inner Glow Core */}
                              <div className={`w-1.5 h-1.5 rounded-full bg-blue-500 transition-all duration-500 ease-in-out ${
                                isCurrent ? 'opacity-100 animate-pulse' : 
                                isPast ? 'opacity-0' : 'opacity-0 scale-50'
                              }`} />
                            </div>
                            
                            {/* Label floating below */}
                            <div className={`absolute top-[22px] whitespace-nowrap text-[10px] font-medium tracking-wide transition-all duration-700 ${
                              isCurrent ? 'text-blue-600 drop-shadow-[0_0_2px_rgba(59,130,246,0.3)]' : 
                              isPast ? 'text-slate-600' : 
                              'text-slate-400'
                            }`}>
                              {step.label}
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )
                })()}
              </div>
            </div>

            {/* Right column: Current Phase Text Label */}
            <div className="hidden lg:flex justify-end items-center lg:w-[220px]">
              <div className="flex flex-col items-end text-right leading-tight">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  Fase Actual
                </span>
                <span className="text-sm font-medium text-slate-800 tracking-wide">
                  {getPhaseText(currentPhase)}
                </span>
              </div>
            </div>

        </div>
      </div>



      {/* Main content area - single scrollable container */}
      <div className={`flex-1 flex flex-col relative z-10 ${uiMode === 'chat' ? 'overflow-hidden' : 'overflow-visible'}`}>
        
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
        
        {/* Stable Fixed UI Mode Switcher (Always visible, never scrolled away) */}
        <div id="ui-mode-toggle" className="relative z-20 mt-8 mb-2 flex-shrink-0">
          <UIModeSwitcher
            currentMode={uiMode}
            onModeChange={setUIMode}
            disabled={isSending || isTransitioning}
          />
        </div>

        {/* Chat Interface with custom scrollbar */}
        {/* Content based on UI mode */}
        {uiMode === 'chat' ? (
          <div 
            className="flex-1 overflow-y-auto custom-scrollbar relative z-0"
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
            
            <div id="conversation-display">
              <ConversationHistory
                messages={session?.conversation_history || []}
                currentPhase={currentPhase}
                enableVoice={true}
                autoSpeakNewMessages={false}
                isLoading={isSending}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col relative z-0 w-full h-full overflow-visible">
            <VoiceInterface
              onSendMessage={sendMessage}
              disabled={isSending || isTransitioning || (uiBehavior.showCareers && recommendations && recommendations.length > 0)}
              isLoading={isSending}
              currentQuestion={session?.conversation_history?.slice(-1)[0]?.role === 'assistant' ? session.conversation_history.slice(-1)[0].content : undefined}
              messages={session?.conversation_history || []}
              isComplete={isComplete}
              uiBehavior={uiBehavior}
            />
          </div>
        )}

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