import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useLatestRiasecProfile } from '../hooks/use-dashboard-data'

const riasecLabels = {
  realistic: { name: 'Realista', description: 'Práctico y manual', color: 'bg-green-500', gradient: 'from-green-500 to-emerald-400' },
  investigative: { name: 'Investigativo', description: 'Analítico y científico', color: 'bg-blue-500', gradient: 'from-blue-600 to-sky-400' },
  artistic: { name: 'Artístico', description: 'Creativo y expresivo', color: 'bg-pink-500', gradient: 'from-pink-500 to-rose-400' },
  social: { name: 'Social', description: 'Servicial y colaborativo', color: 'bg-orange-500', gradient: 'from-orange-500 to-amber-400' },
  enterprising: { name: 'Emprendedor', description: 'Líder y persuasivo', color: 'bg-purple-500', gradient: 'from-purple-500 to-fuchsia-400' },
  conventional: { name: 'Convencional', description: 'Organizado y detallista', color: 'bg-cyan-500', gradient: 'from-cyan-500 to-teal-400' },
}

export function VocationalProgress() {
  const { data: riasecProfile, isLoading, error } = useLatestRiasecProfile()
  const [showBars, setShowBars] = useState(false)

  useEffect(() => {
    if (riasecProfile && !showBars) {
      setTimeout(() => setShowBars(true), 100)
    }
  }, [riasecProfile, showBars])

  if (isLoading) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
          <div className="h-8 bg-gray-100 rounded animate-pulse w-24"></div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-[1.25rem] bg-gray-50 border border-gray-100">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-1"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse w-32 hidden sm:block"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-12"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !riasecProfile) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tu Perfil Vocacional</h2>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-6">
            No has completado ningún test vocacional aún
          </p>
          <Link to="/vocational-test">
            <div className="inline-flex px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105">
              Realizar Test Vocacional
            </div>
          </Link>
        </div>
      </div>
    )
  }

  // Convert scores to percentages and sort by value
  const riasecData = Object.entries(riasecProfile)
    .map(([key, value]) => ({
      key: key as keyof typeof riasecLabels,
      area: riasecLabels[key as keyof typeof riasecLabels].name,
      description: riasecLabels[key as keyof typeof riasecLabels].description,
      progress: Math.round(value as number),
      color: riasecLabels[key as keyof typeof riasecLabels].color,
      gradient: riasecLabels[key as keyof typeof riasecLabels].gradient,
    }))
    .sort((a, b) => b.progress - a.progress)

  return (
    <div className="p-5 md:p-6 pb-4 sm:pb-5 rounded-[2rem] bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] h-full flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3 md:mb-5 shrink-0">
        <h2 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">Tu Perfil RIASEC</h2>
      </div>

      <div className="space-y-3 md:space-y-4 mt-1 overflow-y-auto custom-scrollbar pr-1 flex-1 min-h-0">
        <div className="space-y-3 sm:space-y-4">
          {riasecData.map((item) => (
            <div
              key={item.key}
              className="group flex flex-col gap-1.5"
            >
              <div className="flex items-end justify-between px-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] sm:text-[15px] font-bold text-gray-800">
                    {item.area}
                  </span>
                  <span className="text-[11.5px] sm:text-[12.5px] text-gray-500 font-medium hidden sm:block">
                    • {item.description}
                  </span>
                </div>

                <div className="shrink-0 flex items-center justify-center translate-y-[1px] md:translate-y-2">
                  <span className={`text-2xl sm:text-3xl font-black bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 drop-shadow-sm leading-none`}>
                    {item.progress}%
                  </span>
                </div>
              </div>

              {/* Segmented Line Bar Graph (Pills Bar) */}
              <div className="w-full flex gap-[2px] sm:gap-[3px] h-[20px] sm:h-6 items-end overflow-hidden opacity-95">
                {Array.from({ length: 60 }).map((_, i) => {
                  const threshold = (i / 60) * 100
                  const isFilled = showBars && threshold < item.progress
                  const delay = showBars ? `${i * 10}ms` : '0ms'
                  return (
                    <div 
                      key={i} 
                      style={{ transitionDelay: delay }}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isFilled 
                          ? `h-full bg-gradient-to-t ${item.gradient} shadow-[0_2px_4px_rgba(0,0,0,0.06)]` 
                          : 'h-[30%] bg-gray-200/60'
                      }`} 
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-200/50 mb-1">
          <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium text-center">
            Basado en tu último test completado
          </p>
        </div>
      </div>
    </div>
  )
}
