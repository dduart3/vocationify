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
      <div className="p-8 rounded-3xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-40"></div>
          <div className="h-8 bg-gray-100 rounded animate-pulse w-24"></div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-1"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-32"></div>
                </div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-8"></div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="h-2 bg-gray-200 rounded-full animate-pulse" style={{ width: `${Math.random() * 80 + 20}%` }}></div>
              </div>
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
    }))
    .sort((a, b) => b.progress - a.progress)

  return (
    <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">Tu Perfil RIASEC</h2>
      </div>

      <div className="space-y-6">
        {riasecData.map((item, index) => (
          <div key={item.key} className="space-y-3 group">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-bold text-gray-900">
                  {item.area}
                </span>
                <p className="text-sm text-gray-600 font-medium">
                  {item.description}
                </p>
              </div>
              <span className="text-lg text-gray-900 font-mono font-bold px-3 py-1 bg-gray-100 rounded-lg border border-gray-300">
                {item.progress}%
              </span>
            </div>
            <div className="w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className={`h-4 rounded-full transition-all duration-1000 ${item.color} shadow-md`}
                style={{
                  width: `${item.progress}%`,
                  boxShadow: index === 0 ? '0 2px 8px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
              ></div>
            </div>
          </div>
        ))}

        <div className="mt-6 pt-6 border-t border-gray-300">
          <p className="text-sm text-gray-600 font-medium">
            Basado en tu último test completado. Los porcentajes más altos indican mayor afinidad.
          </p>
        </div>
      </div>
    </div>
  )
}
