// Clean vocational test component
// Responsibility: Orchestrate sub-components and manage overall flow

import { useState, useRef, useEffect } from 'react'
import { Trophy, Clock, Target, Volume2, Play, Mic } from 'lucide-react'
import { Shimmer } from "@/components/ai-elements/shimmer"
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
            <div className="bg-white/90 backdrop-blur-xl rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-gradient-to-b from-white to-blue-50/80 shadow-[0_4px_10px_rgba(37,99,235,0.1),inset_0_-2px_4px_rgba(37,99,235,0.06),inset_0_2px_4px_rgba(255,255,255,1)] border border-blue-100/80">
                    <Clock className="w-5 h-5 text-blue-600 drop-shadow-sm" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-slate-800 font-semibold text-sm">
                      Test vocacional en progreso
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 font-medium">
                      {getPhaseText(existingSession?.current_phase || 'En progreso')} • {formatTime(existingSession?.updated_at || '')}
                    </p>
                  </div>
                </div>

              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={resumeSession}
                  className="group flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 border border-blue-400/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_6px_rgba(37,99,235,0.4)] active:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_1px_3px_rgba(37,99,235,0.3)] active:scale-[0.98] text-white rounded-full transition-all duration-200 text-sm font-semibold w-full"
                >
                  <Play className="w-4 h-4 fill-white group-active:scale-95 transition-transform" />
                  Continuar test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Background - Light theme */}
        <div className="absolute inset-0 z-0 bg-[#f8fafc] overflow-hidden">
          <div className="absolute inset-0 bg-[#f8fafc]" />
          
          {/* Clean Light Background matching chat interface colors */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* The Multi-Color Pastel Gradient Background at bottom */}
            <div 
              className="absolute inset-x-0 bottom-0 h-[40vh] opacity-80" 
              style={{
                background: 'linear-gradient(120deg, #fed7aa 0%, #fbcfe8 45%, #bae6fd 100%)',
                maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
              }}
            />
            {/* Warm reflection edges to anchor the bottom */}
            <div ref={glowEdgeRef} className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 opacity-60" />
            <div className="absolute bottom-0 inset-x-0 h-[8px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 blur-[4px] opacity-40" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 min-h-screen flex flex-col items-center justify-center py-10">
          <div className="max-w-6xl mx-auto w-full">
            {/* Header Section */}
            <div id="test-landing-header" className="text-center mb-6">
              <div className="relative">
                {/* Elegant subtle top line glow */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
                
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
                  <h1 className="relative text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight text-center flex flex-wrap justify-center items-center gap-x-3">
                    <Shimmer 
                      as="span" 
                      duration={3} 
                      spread={1.5} 
                      className="font-medium [--color-muted-foreground:theme(colors.blue.400)] [--color-background:theme(colors.white)] drop-shadow-sm"
                    >
                      Descubre tu Vocación
                    </Shimmer>
                  </h1>
                </div>
              </div>
            </div>

            {/* Main content area - exact copy from original voice test controller */}
            <div className="max-w-4xl mx-auto px-6 pb-2">
              <div className="text-center space-y-8 relative">
                {/* Floating decorative elements - balanced */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -top-10 -right-32 w-32 h-32 bg-purple-200/40 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-32 left-1/4 w-24 h-24 bg-indigo-200/40 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
                
                {/* Naked CTA and description without card */}
                <div className="relative z-10 max-w-2xl mx-auto mt-8 flex flex-col items-center justify-center text-center gap-8">
                  {/* Subtle ambient glow behind the text to maintain legibility */}
                  <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-50/50 rounded-full blur-[60px] -z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  
                  <div className="max-w-md relative z-10">
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed font-light">
                      <span className="text-slate-800 font-medium block mb-2 text-lg">Conversa con ARIA</span>
                      Descubre tu perfil vocacional en una charla natural y amigable con nuestra IA.
                    </p>
                  </div>

                  <div id="start-test-button" className="shrink-0 relative z-10 group/btn cursor-pointer">
                    {/* Always active breathing 3D glow */}
                    {!hasExistingSession && (
                      <div className="absolute inset-[-10px] bg-blue-300/40 group-hover/btn:bg-blue-400/50 rounded-full animate-[button-glow-pulse_4s_ease-in-out_infinite] transition-colors duration-1000 pointer-events-none" />
                    )}

                    <button
                      onClick={startSession}
                      disabled={hasExistingSession}
                      className={`relative overflow-hidden inline-flex items-center justify-center px-10 py-3.5 rounded-full transition-all duration-1000 font-medium text-sm border ${
                        hasExistingSession 
                          ? 'bg-gray-100 text-slate-400 cursor-not-allowed border-gray-200'
                          : 'cursor-pointer bg-blue-600 text-white border-blue-500 group-hover/btn:bg-blue-500 group-hover/btn:border-blue-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),_0_4px_10px_rgba(37,99,235,0.3)] group-hover/btn:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_0_6px_15px_rgba(37,99,235,0.4)]'
                      }`}
                    >
                      {/* Always active Glare effect sweeping across */}
                      {!hasExistingSession && (
                        <div className="absolute inset-0 -translate-x-[150%] animate-[glare-sweep_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 group-hover/btn:via-white/50 to-transparent w-full pointer-events-none transition-colors duration-1000" />
                      )}
                      <span className="relative z-10">{hasExistingSession ? 'Test en Progreso' : 'Iniciar test'}</span>
                    </button>
                  </div>
                </div>
                
                {/* Message when incomplete session exists */}
                {hasExistingSession && (
                  <div className="text-center mt-4 relative z-10">
                    <p className="text-amber-600 font-medium text-sm">
                      Tienes un test en progreso. Complétalo o cancélalo para iniciar uno nuevo.
                    </p>
                  </div>
                )}

                {/* Enhanced Feature Cards */}
                <div id="test-features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-8 relative z-10">
                  {/* General underglow for features section */}
                  <div className="absolute top-1/2 left-1/2 w-full h-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-100/50 blur-[100px] pointer-events-none -z-10" />
                  
                  {[
                    { 
                      icon: Mic, 
                      title: 'Conversación Natural', 
                      desc: 'Habla libremente, como con un amigo de confianza',
                      color: 'text-blue-600',
                      delay: '0s'
                    },
                    { 
                      icon: Volume2, 
                      title: 'IA Avanzada', 
                      desc: 'ARIA comprende contexto y emociones en tiempo real',
                      color: 'text-blue-600',
                      delay: '0.2s'
                    },
                    { 
                      icon: Target, 
                      title: 'Análisis RIASEC', 
                      desc: 'Evaluación psicométrica adaptativa e inteligente',
                      color: 'text-blue-600',
                      delay: '0.4s'
                    }
                  ].map((feature, index) => {
                    const IconComponent = feature.icon
                    return (
                      <div
                        key={index}
                        className="group relative flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1"
                        style={{ animationDelay: feature.delay }}
                      >
                       
                        {/* 3D Circular Icon matching the bottom pill icons design */}
                        <div className={`relative mb-4 flex shrink-0 items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-white to-blue-50 shadow-[0_4px_10px_rgba(37,99,235,0.1),inset_0_-2px_4px_rgba(37,99,235,0.06),inset_0_2px_4px_rgba(255,255,255,1)] border border-blue-100/80 group-hover:scale-105 transition-transform duration-500`}>
                          <IconComponent className={`w-6 h-6 text-blue-500 drop-shadow-sm`} strokeWidth={1.5} />
                        </div>

                        {/* Content */}
                        <h3 className="text- font-medium text-[15px] mb-1.5 px-4 relative z-10">
                          {feature.title}
                        </h3>
                        <p className="text-[#718299] text-[13px] leading-[1.6] px-4 relative z-10">
                          {feature.desc}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Additional visual elements - Glassmorphism Pill */}
                <div className="flex justify-center items-center pt-8 relative z-10 w-full mb-4">
                  <div className="inline-flex items-center flex-wrap justify-center gap-3 sm:gap-5 px-5 sm:px-6 py-2.5 rounded-full bg-slate-50/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(37,99,235,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-slate-200/50 transition-all duration-500 hover:bg-slate-50/60 hover:shadow-[0_8px_32px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,1)]">
                    
                      <div className="flex items-center gap-2 text-[#4b5b76]/90 group hover:text-[#4b5b76] transition-colors duration-300">
                        <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-b from-white to-blue-50 shadow-[0_2px_5px_rgba(37,99,235,0.1),inset_0_-1px_2px_rgba(37,99,235,0.06),inset_0_1px_2px_rgba(255,255,255,1)] border border-blue-100/80 group-hover:scale-110 transition-transform duration-300">
                          <Target className="w-3.5 h-3.5 text-blue-500 drop-shadow-sm" />
                        </div>
                        <span className="font-medium text-[13px]">Análisis personalizado</span>
                      </div>

                    <div className="w-1 h-1 bg-blue-200/80 rounded-full" />

                      <div className="flex items-center gap-2 text-[#4b5b76]/90 group hover:text-[#4b5b76] transition-colors duration-300">
                        <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-b from-white to-blue-50 shadow-[0_2px_5px_rgba(37,99,235,0.1),inset_0_-1px_2px_rgba(37,99,235,0.06),inset_0_1px_2px_rgba(255,255,255,1)] border border-blue-100/80 group-hover:scale-110 transition-transform duration-300">
                          <Volume2 className="w-3.5 h-3.5 text-blue-500 drop-shadow-sm" />
                        </div>
                        <span className="font-medium text-[13px]">100% conversacional</span>
                      </div>

                    <div className="w-1 h-1 bg-blue-200/80 rounded-full" />

                      <div className="flex items-center gap-2 text-[#4b5b76]/90 group hover:text-[#4b5b76] transition-colors duration-300">
                        <div className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-b from-white to-blue-50 shadow-[0_2px_5px_rgba(37,99,235,0.1),inset_0_-1px_2px_rgba(37,99,235,0.06),inset_0_1px_2px_rgba(255,255,255,1)] border border-blue-100/80 group-hover:scale-110 transition-transform duration-300">
                          <Trophy className="w-3.5 h-3.5 text-blue-500 drop-shadow-sm" />
                        </div>
                        <span className="font-medium text-[13px]">Resultados precisos</span>
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
      <div className="flex-1 min-h-screen relative overflow-hidden bg-[#f8fafc] flex items-center justify-center animate-in fade-in duration-700">
        <div className="absolute inset-0 bg-[#f8fafc] z-0" />
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div 
              className="absolute inset-x-0 bottom-0 h-[40vh] opacity-80" 
              style={{
                background: 'linear-gradient(120deg, #fed7aa 0%, #fbcfe8 45%, #bae6fd 100%)',
                maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
              }}
            />
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 opacity-60" />
            <div className="absolute bottom-0 inset-x-0 h-[8px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 blur-[4px] opacity-40" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <div className="text-blue-600 font-medium tracking-widest uppercase text-sm animate-pulse">
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
                <span className="text-sm font-semibold text-blue-600 tracking-wide">
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
          <div className="absolute inset-0 z-10 flex flex-col">
            {/* Career recommendations content - no duplicate header, uses main header */}
            <div className="flex-1 overflow-y-auto px-4 pt-24 md:px-6 md:pt-[110px] pb-6 flex flex-col justify-start">
              <div className="max-w-4xl mx-auto w-full">
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
            disabled={isSending || isTransitioning || !!(uiBehavior.showCareers && recommendations && recommendations.length > 0)}
          />
        </div>

        {/* Chat Interface with custom scrollbar */}
        {/* Content based on UI mode */}
        {uiMode === 'chat' && !(uiBehavior.showCareers && recommendations && recommendations.length > 0) && (
          <div 
            className="flex-1 overflow-y-auto custom-scrollbar relative z-0"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(147, 51, 234, 0.3) rgba(255, 255, 255, 0.05)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 60px, black calc(100% - 60px), transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 60px, black calc(100% - 60px), transparent 100%)'
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
        )}
        
        {uiMode === 'voice' && !(uiBehavior.showCareers && recommendations && recommendations.length > 0) && (
          <div className="flex-1 flex flex-col relative z-0 w-full h-full overflow-visible">
            <VoiceInterface
              onSendMessage={sendMessage}
              disabled={isSending || isTransitioning || !!(uiBehavior.showCareers && recommendations && recommendations.length > 0)}
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