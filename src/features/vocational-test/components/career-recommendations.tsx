// CareerRecommendations component
// Responsibility: Display career recommendations in card format

import { useEffect, useState } from 'react'

interface CareerRecommendation {
  careerId: string
  name: string
  confidence: number
  reasoning: string
}

interface CareerRecommendationsProps {
  recommendations: CareerRecommendation[]
  showTitle?: boolean
  className?: string
}

export function CareerRecommendations({ 
  recommendations, 
  className = "" 
}: CareerRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return null
  }

  const targetAverage = Math.round(
    recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length
  )

  const [displayAverage, setDisplayAverage] = useState(0)
  const [showBars, setShowBars] = useState(false)
  const [showCards, setShowCards] = useState(false)

  useEffect(() => {
    // Animate average score
    let startTimestamp: number | null = null;
    const duration = 1500; // 1.5 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayAverage(Math.floor(easeProgress * targetAverage));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);

    // Trigger bars animation after score counts up slightly
    setTimeout(() => {
      setShowBars(true);
    }, 400);

    // Trigger cards appearing
    setTimeout(() => {
      setShowCards(true);
    }, 800);
  }, [targetAverage]);

  return (
    <div className={`space-y-4 ${className} pb-2 max-w-3xl mx-auto flex flex-col justify-center h-full`} id="career-recommendations-content">
      {/* Overview Stats Card (ATS Score Style) */}
      <div className="p-5 md:p-6 rounded-[1.5rem] bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_10px_30px_rgba(0,0,0,0.06)] mb-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-baseline gap-2 shrink-0">
            <span className="text-5xl md:text-6xl font-black bg-gradient-to-br from-blue-600 to-sky-400 bg-clip-text text-transparent drop-shadow-sm leading-none flex items-start">
              {displayAverage}
            </span>
            <span className="text-gray-500 font-medium text-sm leading-tight">
              Promedio de<br/>Compatibilidad
            </span>
          </div>

          {/* Segmented Line Bar Graph */}
          <div className="flex-1 flex gap-[2px] h-6 md:h-8 items-end max-w-full overflow-hidden opacity-90">
            {Array.from({ length: 50 }).map((_, i) => {
              const threshold = (i / 50) * 100
              const isFilled = showBars && threshold < targetAverage
              const delay = showBars ? `${i * 25}ms` : '0ms'
              return (
                <div 
                  key={i} 
                  style={{ transitionDelay: delay }}
                  className={`flex-1 rounded-sm transition-all duration-300 ${
                    isFilled 
                      ? 'h-full bg-gradient-to-t from-blue-600 to-sky-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]' 
                      : 'h-[35%] bg-blue-100/50'
                  }`} 
                />
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-blue-50/50">
           <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-br from-blue-600 to-sky-400 bg-clip-text text-transparent mb-1 pb-0.5 leading-snug">
                {recommendations.length}
              </span>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Carreras Encontradas
              </span>
           </div>
           
           <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-br from-sky-500 to-blue-400 bg-clip-text text-transparent mb-1 pb-0.5 leading-snug">
                {recommendations[0]?.name || 'N/A'}
              </span>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Mejor Opción
              </span>
           </div>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((career, index) => {
          const score = career.confidence;
          const getStrokeColor = (s: number) => {
            if (s >= 85) return 'text-green-500'
            if (s >= 70) return 'text-amber-400'
            return 'text-orange-400'
          }
          
          const getRankStyle = () => {
            return 'from-slate-100 to-slate-200 border-slate-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] text-slate-800'
          }

          const strokeClass = getStrokeColor(score)
          const rankClass = getRankStyle()
          const circleRadius = 22
          const circleCircumference = 2 * Math.PI * circleRadius
          const strokeDasharray = `${(score / 100) * circleCircumference} ${circleCircumference}`
          
          const animationDelay = `${index * 150}ms`

          return (
            <div
              key={career.careerId}
              style={{ 
                opacity: showCards ? 1 : 0, 
                transform: showCards ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: showCards ? animationDelay : '0ms'
              }}
              className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-[1.25rem] bg-slate-50/80 backdrop-blur-md border border-slate-200 shadow-inner hover:bg-slate-100/80 transition-all duration-500 group"
            >
              {/* Left side Rank */}
              <div className="shrink-0">
                <div className={`w-10 h-10 bg-gradient-to-b ${rankClass} rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-300 border`}>
                  {index + 1}
                </div>
              </div>

              {/* Middle Content */}
              <div className="flex-1 min-w-0 flex flex-col items-center md:items-start text-center md:text-left py-1">
                <h4 className="font-bold text-slate-800 text-[16px] leading-tight mb-1 flex items-center gap-2">
                  {career.name}
                </h4>
                <p className="text-slate-500 text-[13.5px] leading-relaxed font-medium">
                  {career.reasoning}
                </p>
              </div>

              {/* Right side Pie Chart */}
              <div className="shrink-0 relative w-[50px] h-[50px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                  <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4.5" fill="transparent" className="text-slate-100" />
                  <circle 
                    cx="25" cy="25" r="20" 
                    stroke="currentColor" strokeWidth="4.5" fill="transparent" 
                    strokeDasharray={showCards ? strokeDasharray : `0 ${circleCircumference}`} 
                    className={strokeClass} 
                    strokeLinecap="round" 
                    style={{ transition: 'stroke-dasharray 1.5s ease-out', transitionDelay: showCards ? animationDelay : '0ms' }} 
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={`text-xs font-bold ${strokeClass} drop-shadow-sm leading-none`}>
                    {score}%
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}