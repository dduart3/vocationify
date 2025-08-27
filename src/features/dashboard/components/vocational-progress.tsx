import { Link } from '@tanstack/react-router'
import { useLatestRiasecProfile } from '../hooks/use-dashboard-data'

const riasecLabels = {
  realistic: { name: 'Realista', description: 'Práctico y manual', color: 'bg-green-500' },
  investigative: { name: 'Investigativo', description: 'Analítico y científico', color: 'bg-blue-500' },
  artistic: { name: 'Artístico', description: 'Creativo y expresivo', color: 'bg-pink-500' },
  social: { name: 'Social', description: 'Servicial y colaborativo', color: 'bg-orange-500' },
  enterprising: { name: 'Emprendedor', description: 'Líder y persuasivo', color: 'bg-purple-500' },
  conventional: { name: 'Convencional', description: 'Organizado y detallista', color: 'bg-cyan-500' },
}

export function VocationalProgress() {
  const { data: riasecProfile, isLoading, error } = useLatestRiasecProfile()

  if (isLoading) {
    return (
      <div
        className="p-8 rounded-3xl backdrop-blur-xl"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%, 
              rgba(255, 255, 255, 0.04) 100%
            )
          `,
          boxShadow: `
            0 8px 32px 0 rgba(31, 38, 135, 0.37),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-white/20 rounded animate-pulse w-40"></div>
          <div className="h-8 bg-white/10 rounded animate-pulse w-24"></div>
        </div>
        
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-4 bg-white/20 rounded animate-pulse w-24 mb-1"></div>
                  <div className="h-3 bg-white/10 rounded animate-pulse w-32"></div>
                </div>
                <div className="h-4 bg-white/10 rounded animate-pulse w-8"></div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="h-2 bg-white/20 rounded-full animate-pulse" style={{ width: `${Math.random() * 80 + 20}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !riasecProfile) {
    return (
      <div
        className="p-8 rounded-3xl backdrop-blur-xl"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%, 
              rgba(255, 255, 255, 0.04) 100%
            )
          `,
          boxShadow: `
            0 8px 32px 0 rgba(31, 38, 135, 0.37),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `
        }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Tu Perfil Vocacional</h2>
        <div className="text-center py-8">
          <p className="text-white/60 mb-6">
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
    }))
    .sort((a, b) => b.progress - a.progress)

  return (
    <div
      className="p-8 rounded-3xl backdrop-blur-xl"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.04) 100%
          )
        `,
        boxShadow: `
          0 8px 32px 0 rgba(31, 38, 135, 0.37),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Tu Perfil RIASEC</h2>
      </div>
      
      <div className="space-y-6">
        {riasecData.map((item) => (
          <div key={item.key} className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-semibold text-white">
                  {item.area}
                </span>
                <p className="text-sm text-white/60">
                  {item.description}
                </p>
              </div>
              <span className="text-sm text-white/80 font-mono font-bold">
                {item.progress}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${item.color}`}
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-white/50">
            Basado en tu último test completado. Los porcentajes más altos indican mayor afinidad.
          </p>
        </div>
      </div>
    </div>
  )
}
