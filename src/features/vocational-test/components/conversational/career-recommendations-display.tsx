import { GraduationCap, TrendingUp, Info, Trophy, Medal, Award, Eye, X, Star, Sparkles, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// Try to import ScrollTrigger - fallback if not available
let ScrollTrigger: any = null
try {
  const ScrollTriggerModule = require('gsap/ScrollTrigger')
  ScrollTrigger = ScrollTriggerModule.ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)
} catch (e) {
  console.log('ScrollTrigger not available, using intersection observer fallback')
}

interface CareerSuggestion {
  careerId: string
  name: string
  confidence: number
  reasoning: string
  realityCheckPassed?: boolean
  realityCheckScore?: number
  discriminatingQuestions?: Array<{
    question: string
    careerAspect: string
    importance: number
    userResponse?: string
    impactOnScore?: number
  }>
}

interface CareerRecommendationsDisplayProps {
  careerSuggestions: CareerSuggestion[]
}

// Get badge styles based on ranking
const getBadgeStyles = (index: number) => {
  switch (index) {
    case 0: // First place - Gold
      return {
        badge: "bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/25",
        icon: Trophy,
        ring: "ring-1 ring-yellow-400/20"
      }
    case 1: // Second place - Silver
      return {
        badge: "bg-gradient-to-r from-slate-400 to-gray-500 text-white shadow-lg shadow-slate-500/25",
        icon: Medal,
        ring: "ring-2 ring-slate-400/50"
      }
    case 2: // Third place - Bronze
      return {
        badge: "bg-gradient-to-r from-orange-600 to-amber-700 text-white shadow-lg shadow-orange-600/25",
        icon: Award,
        ring: "ring-2 ring-orange-500/50"
      }
    default: // Fourth+ - Purple
      return {
        badge: "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/25",
        icon: Award,
        ring: "ring-2 ring-purple-400/50"
      }
  }
}

// Get confidence badge color
const getConfidenceBadgeStyle = (confidence: number) => {
  if (confidence >= 85) return "bg-green-500/10 backdrop-blur-sm text-green-300"
  if (confidence >= 75) return "bg-blue-500/10 backdrop-blur-sm text-blue-300"
  if (confidence >= 65) return "bg-yellow-500/10 backdrop-blur-sm text-yellow-300"
  return "bg-gray-500/10 backdrop-blur-sm text-gray-300"
}

// Get reality check badge information
const getRealityCheckBadge = (career: CareerSuggestion) => {
  if (career.realityCheckPassed === undefined) {
    // Reality check not performed or not available
    return null
  }
  
  if (career.realityCheckPassed) {
    return {
      icon: CheckCircle,
      text: 'Reality Check ✓',
      className: 'bg-green-500/20 text-green-300 border border-green-500/30',
      score: career.realityCheckScore
    }
  } else {
    return {
      icon: AlertCircle,
      text: 'Reality Check ✗',
      className: 'bg-red-500/20 text-red-300 border border-red-500/30',
      score: career.realityCheckScore
    }
  }
}

// Determine if reality check information should be shown
const hasRealityCheckData = (careers: CareerSuggestion[]) => {
  return careers.some(career => career.realityCheckPassed !== undefined)
}


export function CareerRecommendationsDisplay({ careerSuggestions }: CareerRecommendationsDisplayProps) {
  const podiumRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [selectedCareer, setSelectedCareer] = useState<{ career: CareerSuggestion; rank: string } | null>(null)
  
  useEffect(() => {
    if (!podiumRef.current || careerSuggestions.length < 3) return

    // Set initial state - cards start from ground level
    gsap.set(cardRefs.current, { y: 200, opacity: 0 })

    if (ScrollTrigger) {
      // Use ScrollTrigger if available
      console.log('Using ScrollTrigger')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: podiumRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
          once: false,
          markers: true
        }
      })
      
      // Animation sequence
      tl.to(cardRefs.current[2], { y: 0, opacity: 1, duration: 1, ease: 'power2.out' })
        .to(cardRefs.current[1], { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.7')
        .to(cardRefs.current[0], { y: 0, opacity: 1, duration: 1.5, ease: 'back.out(1.7)' }, '-=0.9')
        .to(cardRefs.current, { x: '+=3', duration: 0.1, yoyo: true, repeat: 3, ease: 'power2.inOut' }, '+=0.2')

      return () => {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
      }
    } else {
      // Fallback: Use Intersection Observer
      console.log('Using Intersection Observer fallback')
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Animate podium blocks rising
              const tl = gsap.timeline()
              tl.to(cardRefs.current[2], { y: 0, opacity: 1, duration: 1, ease: 'power2.out' })
                .to(cardRefs.current[1], { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.7')
                .to(cardRefs.current[0], { y: 0, opacity: 1, duration: 1.5, ease: 'back.out(1.7)' }, '-=0.9')
                .to(cardRefs.current, { x: '+=3', duration: 0.1, yoyo: true, repeat: 3, ease: 'power2.inOut' }, '+=0.2')
            }
          })
        },
        { threshold: 0.3 }
      )

      observer.observe(podiumRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [careerSuggestions])

  if (!careerSuggestions?.length) return null

  // Render single connected podium with text inside blocks and proper medal colors
  const renderUnifiedPodium = () => {
    return (
      <div className="flex items-end  justify-center max-w-6xl mx-auto">
        {/* 2nd Place Block - Left - Silver */}
        <div 
          ref={(el) => cardRefs.current[1] = el}
          className="w-80 h-96 shadow-2xl flex flex-col justify-center items-center p-6 text-center relative overflow-hidden border-2 rounded-t-2xl"
          style={{
            background: 'linear-gradient(to top, var(--silver-900), var(--silver-700), var(--silver-500))',
            borderColor: 'var(--silver-900)',
          }}
        >
          {/* Silver metallic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-white/10 to-white/5"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-silver-300 rounded-full"></div>
          </div>
          <div className="absolute top-4 right-4 w-6 h-6 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/10 rotate-45"></div>
          <div className="absolute bottom-6 right-6 w-2 h-2 bg-silver-400 rounded-full"></div>
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-4">
            {/* Medal Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-black font-bold text-sm shadow-xl"
              style={{ background: 'linear-gradient(135deg, var(--silver-300), var(--silver-500))' }}
            >
              <Medal className="w-4 h-4" />
              SEGUNDA
            </div>
            
            {/* Career Name */}
            <h3 className="text-white font-semibold text-xl leading-tight px-4 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {careerSuggestions[1]?.name}
            </h3>
            
            {/* Confidence */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-white font-semibold text-base shadow-lg"
              style={{
                backgroundColor: careerSuggestions[1]?.confidence >= 85 ? 'rgba(6, 95, 70, 0.4)' : 
                                careerSuggestions[1]?.confidence >= 75 ? 'rgba(30, 64, 175, 0.4)' :
                                careerSuggestions[1]?.confidence >= 65 ? 'rgba(180, 83, 9, 0.4)' : 'rgba(55, 65, 81, 0.4)'
              }}
            >
              <TrendingUp className="w-4 h-4" />
              {careerSuggestions[1]?.confidence}%
            </div>

            {/* Reality Check Badge */}
            {(() => {
              const realityCheck = getRealityCheckBadge(careerSuggestions[1])
              if (!realityCheck) return null
              const IconComponent = realityCheck.icon
              return (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${realityCheck.className}`}>
                  <IconComponent className="w-3 h-3" />
                  {realityCheck.text}
                </div>
              )
            })()}

            {/* View Details Button */}
            <button
              onClick={() => setSelectedCareer({ career: careerSuggestions[1], rank: 'SEGUNDA' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium text-base transition-all hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              Ver detalles
            </button>
          </div>
        </div>

        {/* 1st Place Block - Center - Gold */}
        <div 
          ref={(el) => cardRefs.current[0] = el}
          className="w-80 shadow-2xl flex flex-col justify-center items-center p-8 text-center relative overflow-hidden border-2 rounded-t-2xl"
          style={{
            height: '32rem',
            background: 'linear-gradient(to top, var(--gold-800), var(--gold-600), var(--gold-400))',
            borderColor: 'var(--gold-900)',
          }}
        >
          {/* Gold metallic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-white/10 to-white/5"></div>
          
          {/* Champion Crown Elements */}
          <div className="absolute top-6 left-6 w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-gold-200" />
          </div>
          <div className="absolute top-6 right-6 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white/60" />
          </div>
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/15 rotate-45"></div>
          
          {/* Victory laurels */}
          <div className="absolute bottom-8 left-6 w-6 h-6 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-8 right-6 w-4 h-4 bg-gold-300 rounded-full"></div>
          <div className="absolute bottom-16 left-8 w-3 h-3 bg-white/15 rotate-45"></div>
          <div className="absolute bottom-16 right-8 w-3 h-3 bg-white/15 rotate-45"></div>
          
          {/* Premium pattern overlay */}
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: 'radial-gradient(circle at 30% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 70%, white 1.5px, transparent 1.5px)',
            backgroundSize: '30px 30px'
          }}></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-6">
            {/* Crown/Trophy Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-black font-bold text-lg shadow-xl"
              style={{ background: 'linear-gradient(135deg, var(--gold-200), var(--gold-400))' }}
            >
              <Trophy className="w-5 h-5" />
              CAMPEÓN
            </div>
            
            {/* Career Name */}
            <h3 className="text-white font-semibold text-2xl leading-tight px-4 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {careerSuggestions[0]?.name}
            </h3>
            
            {/* Confidence */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-white font-semibold text-base shadow-lg"
              style={{
                backgroundColor: careerSuggestions[0]?.confidence >= 85 ? 'rgba(6, 95, 70, 0.4)' : 
                                careerSuggestions[0]?.confidence >= 75 ? 'rgba(30, 64, 175, 0.4)' :
                                careerSuggestions[0]?.confidence >= 65 ? 'rgba(180, 83, 9, 0.4)' : 'rgba(55, 65, 81, 0.4)'
              }}
            >
              <TrendingUp className="w-4 h-4" />
              {careerSuggestions[0]?.confidence}%
            </div>

            {/* Reality Check Badge */}
            {(() => {
              const realityCheck = getRealityCheckBadge(careerSuggestions[0])
              if (!realityCheck) return null
              const IconComponent = realityCheck.icon
              return (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${realityCheck.className}`}>
                  <IconComponent className="w-3 h-3" />
                  {realityCheck.text}
                </div>
              )
            })()}

            {/* View Details Button */}
            <button
              onClick={() => setSelectedCareer({ career: careerSuggestions[0], rank: 'CAMPEÓN' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium text-base transition-all hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              Ver detalles
            </button>
          </div>
        </div>

        {/* 3rd Place Block - Right - Bronze */}
        <div 
          ref={(el) => cardRefs.current[2] = el}
          className="w-80 h-80 shadow-2xl flex flex-col justify-center items-center p-6 text-center relative overflow-hidden border-2 rounded-t-2xl"
          style={{
            background: 'linear-gradient(to top, var(--bronze-900), var(--bronze-700), var(--bronze-500))',
            borderColor: 'var(--bronze-900)',
          }}
        >
          {/* Bronze metallic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-white/10 to-white/5"></div>
          
          {/* Bronze Decorative Elements */}
          <div className="absolute top-4 left-4 w-7 h-7 bg-white/12 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-bronze-300 rounded-full"></div>
          </div>
          <div className="absolute top-4 right-4 w-5 h-5 bg-white/8 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/12 rotate-45"></div>
          <div className="absolute bottom-6 right-6 w-3 h-3 bg-bronze-400 rounded-full"></div>
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/15 rounded-full"></div>
          
          {/* Achievement pattern */}
          <div className="absolute inset-0 opacity-12" style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '25px 25px'
          }}></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-4">
            {/* Medal Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-black font-bold text-sm shadow-xl"
              style={{ background: 'linear-gradient(135deg, var(--bronze-300), var(--bronze-500))' }}
            >
              <Award className="w-4 h-4" />
              TERCERA
            </div>
            
            {/* Career Name */}
            <h3 className="text-white font-semibold text-xl leading-tight px-4 text-center" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              {careerSuggestions[2]?.name}
            </h3>
            
            {/* Confidence */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm text-white font-semibold text-base shadow-lg"
              style={{
                backgroundColor: careerSuggestions[2]?.confidence >= 85 ? 'rgba(6, 95, 70, 0.4)' : 
                                careerSuggestions[2]?.confidence >= 75 ? 'rgba(30, 64, 175, 0.4)' :
                                careerSuggestions[2]?.confidence >= 65 ? 'rgba(180, 83, 9, 0.4)' : 'rgba(55, 65, 81, 0.4)'
              }}
            >
              <TrendingUp className="w-4 h-4" />
              {careerSuggestions[2]?.confidence}%
            </div>

            {/* Reality Check Badge */}
            {(() => {
              const realityCheck = getRealityCheckBadge(careerSuggestions[2])
              if (!realityCheck) return null
              const IconComponent = realityCheck.icon
              return (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${realityCheck.className}`}>
                  <IconComponent className="w-3 h-3" />
                  {realityCheck.text}
                </div>
              )
            })()}

            {/* View Details Button */}
            <button
              onClick={() => setSelectedCareer({ career: careerSuggestions[2], rank: 'TERCERA' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium text-base transition-all hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Helper function for mobile cards
  const renderMobileCard = (career: CareerSuggestion, index: number) => {
    const badgeStyle = getBadgeStyles(index)
    const BadgeIcon = badgeStyle.icon
    const confidenceStyle = getConfidenceBadgeStyle(career.confidence)
    
    return (
      <div key={career.careerId} className="bg-white/8 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:bg-white/12 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${badgeStyle.badge} font-bold text-sm shadow-xl`}>
            <BadgeIcon className="w-5 h-5" />
            {index === 0 ? 'TOP MATCH' : index === 1 ? 'GRAN OPCIÓN' : index === 2 ? 'BUENA OPCIÓN' : `OPCIÓN ${index + 1}`}
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${confidenceStyle} font-bold text-sm shadow-lg`}>
            <TrendingUp className="w-4 h-4" />
            {career.confidence}%
          </div>
        </div>
        <h4 className="text-white font-bold text-xl mb-4 leading-tight">{career.name}</h4>
        <div className="bg-white/3 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-white/90 text-sm leading-relaxed">{career.reasoning}</p>
        </div>
      </div>
    )
  }

  // Helper function for additional cards
  const renderAdditionalCard = (career: CareerSuggestion, index: number) => {
    const badgeStyle = getBadgeStyles(index)
    const BadgeIcon = badgeStyle.icon
    const confidenceStyle = getConfidenceBadgeStyle(career.confidence)
    
    return (
      <div key={career.careerId} className="bg-white/6 backdrop-blur-xl rounded-2xl p-5 shadow-xl hover:bg-white/10 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${badgeStyle.badge} font-bold text-xs shadow-lg`}>
            <BadgeIcon className="w-4 h-4" />
            OPCIÓN {index + 1}
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${confidenceStyle} font-semibold text-xs`}>
            <TrendingUp className="w-3 h-3" />
            {career.confidence}%
          </div>
        </div>
        <h4 className="text-white font-bold text-lg mb-3 leading-tight">{career.name}</h4>
        <div className="bg-white/3 backdrop-blur-sm rounded-xl p-3">
          <p className="text-white/85 text-xs leading-relaxed">{career.reasoning}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12 max-w-full mx-auto px-8">
      
      {/* Olympic Podium Layout - First 3 careers */}
      {careerSuggestions.length >= 3 ? (
        <>
          {/* Single Connected Olympic Podium */}
          <div 
            ref={podiumRef}
            className="hidden md:block mb-12 px-4 py-8"
          >
            {renderUnifiedPodium()}
          </div>
          
          {/* Mobile/tablet fallback - vertical stack */}
          <div className="md:hidden space-y-6">
            {careerSuggestions.slice(0, 3).map((career, index) => 
              renderMobileCard(career, index)
            )}
          </div>
          
          {/* Additional careers below podium (if any) */}
          {careerSuggestions.length > 3 && (
            <div className="mt-16 space-y-6">
              <h4 className="text-center text-white/70 font-semibold text-lg mb-8">
                Otras opciones interesantes
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                {careerSuggestions.slice(3).map((career, index) => 
                  renderAdditionalCard(career, index + 3)
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Fallback for less than 3 careers */
        <div className="space-y-6">
          {careerSuggestions.map((career, index) => renderMobileCard(career, index))}
        </div>
      )}
      
      {/* Helper functions moved outside JSX */}
      
      {/* Info section with reality check information */}
      <div className="mt-16 space-y-4">
        <div className="bg-white/6 backdrop-blur-xl rounded-3xl p-6 shadow-xl">
          <div className="flex items-start gap-4 text-blue-300">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-2">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-sm leading-relaxed">
              <p className="font-bold text-white mb-2">¿Cómo calculamos esto?</p>
              <p className="text-white/80">
                Analizamos tu perfil RIASEC, intereses únicos y compatibilidad natural con cada carrera. 
                Las recomendaciones están ordenadas por afinidad total.
              </p>
              {hasRealityCheckData(careerSuggestions) && (
                <p className="text-white/80 mt-3">
                  <strong className="text-green-300">Reality Check aplicado:</strong> Evaluamos si estás preparado/a para los aspectos más desafiantes de cada carrera.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reality Check Summary */}
        {hasRealityCheckData(careerSuggestions) && (
          <div className="bg-white/4 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
              <h4 className="text-white font-semibold">Resumen del Reality Check</h4>
            </div>
            <div className="space-y-2">
              {careerSuggestions.slice(0, 3).map((career, index) => {
                const realityCheck = getRealityCheckBadge(career)
                if (!realityCheck) return null
                const IconComponent = realityCheck.icon
                
                return (
                  <div key={career.careerId} className="flex items-center justify-between text-sm">
                    <span className="text-white/80">{career.name}</span>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${realityCheck.className}`}>
                      <IconComponent className="w-3 h-3" />
                      {career.realityCheckPassed ? 'Preparado/a' : 'Necesita consideración'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Career Details Modal */}
      {selectedCareer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-auto relative shadow-2xl border-2"
            style={{
              background: selectedCareer.rank === 'CAMPEÓN' 
                ? 'linear-gradient(to top, var(--gold-800), var(--gold-600), var(--gold-400))'
                : selectedCareer.rank === 'SEGUNDA'
                ? 'linear-gradient(to top, var(--silver-900), var(--silver-700), var(--silver-500))'
                : 'linear-gradient(to top, var(--bronze-900), var(--bronze-700), var(--bronze-500))',
              borderColor: selectedCareer.rank === 'CAMPEÓN'
                ? 'var(--gold-900)'
                : selectedCareer.rank === 'SEGUNDA' 
                ? 'var(--silver-900)'
                : 'var(--bronze-900)'
            }}
          >
            {/* Metallic overlay - exactly like podium */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-white/10 to-white/5"></div>
            
            {/* Decorative Elements - exactly like podium */}
            {selectedCareer.rank === 'CAMPEÓN' ? (
              <>
                <div className="absolute top-6 left-6 w-10 h-10 bg-white/15 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-gold-200" />
                </div>
                <div className="absolute top-6 right-6 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white/60" />
                </div>
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/15 rotate-45"></div>
                <div className="absolute bottom-8 left-6 w-6 h-6 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-8 right-6 w-4 h-4 bg-gold-300 rounded-full"></div>
                <div className="absolute bottom-16 left-8 w-3 h-3 bg-white/15 rotate-45"></div>
                <div className="absolute bottom-16 right-8 w-3 h-3 bg-white/15 rotate-45"></div>
                <div className="absolute inset-0 opacity-15" style={{
                  backgroundImage: 'radial-gradient(circle at 30% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 70%, white 1.5px, transparent 1.5px)',
                  backgroundSize: '30px 30px'
                }}></div>
              </>
            ) : selectedCareer.rank === 'SEGUNDA' ? (
              <>
                <div className="absolute top-4 left-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-silver-300 rounded-full"></div>
                </div>
                <div className="absolute top-4 right-4 w-6 h-6 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/10 rotate-45"></div>
                <div className="absolute bottom-6 right-6 w-2 h-2 bg-silver-400 rounded-full"></div>
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </>
            ) : (
              <>
                <div className="absolute top-4 left-4 w-7 h-7 bg-white/12 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-bronze-300 rounded-full"></div>
                </div>
                <div className="absolute top-4 right-4 w-5 h-5 bg-white/8 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-white/12 rotate-45"></div>
                <div className="absolute bottom-6 right-6 w-3 h-3 bg-bronze-400 rounded-full"></div>
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/15 rounded-full"></div>
                <div className="absolute inset-0 opacity-12" style={{
                  backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                  backgroundSize: '25px 25px'
                }}></div>
              </>
            )}
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCareer(null)}
              className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-all duration-200 hover:scale-105"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Modal Header with Medal Badge */}
            <div className="relative z-10 text-center p-8 pb-6">
              <div className="inline-flex items-center gap-3 mb-4">
                {selectedCareer.rank === 'CAMPEÓN' ? (
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-black font-bold text-lg shadow-xl"
                    style={{ background: 'linear-gradient(135deg, var(--gold-200), var(--gold-400))' }}
                  >
                    <Trophy className="w-5 h-5" />
                    {selectedCareer.rank}
                  </div>
                ) : selectedCareer.rank === 'SEGUNDA' ? (
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-black font-bold text-sm shadow-xl"
                    style={{ background: 'linear-gradient(135deg, var(--silver-300), var(--silver-500))' }}
                  >
                    <Medal className="w-4 h-4" />
                    {selectedCareer.rank}
                  </div>
                ) : (
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-black font-bold text-sm shadow-xl"
                    style={{ background: 'linear-gradient(135deg, var(--bronze-300), var(--bronze-500))' }}
                  >
                    <Award className="w-4 h-4" />
                    {selectedCareer.rank}
                  </div>
                )}
              </div>
              
              <h3 className="text-white font-bold text-2xl mb-2 leading-tight">
                {selectedCareer.career.name}
              </h3>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm text-white font-semibold text-lg">
                <TrendingUp className="w-5 h-5" />
                {selectedCareer.career.confidence}% de compatibilidad
              </div>
            </div>

            {/* Modal Content */}
            <div className="relative z-10 px-8 pb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  ¿Por qué es perfecta para ti?
                </h4>
                <p className="text-white/90 leading-relaxed text-base">
                  {selectedCareer.career.reasoning}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}