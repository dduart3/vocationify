import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { IconEye } from '@tabler/icons-react'
import { useLatestRiasecProfile } from '../hooks/use-dashboard-data'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const riasecLabels = {
  R: { name: 'Realista', description: 'Práctico y manual', color: 'bg-green-500' },
  I: { name: 'Investigativo', description: 'Analítico y científico', color: 'bg-blue-500' },
  A: { name: 'Artístico', description: 'Creativo y expresivo', color: 'bg-pink-500' },
  S: { name: 'Social', description: 'Servicial y colaborativo', color: 'bg-orange-500' },
  E: { name: 'Emprendedor', description: 'Líder y persuasivo', color: 'bg-purple-500' },
  C: { name: 'Convencional', description: 'Organizado y detallista', color: 'bg-cyan-500' },
}

export function VocationalProgress() {
  const { data: riasecProfile, isLoading, error } = useLatestRiasecProfile()

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Tu Perfil Vocacional</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    )
  }

  if (error || !riasecProfile) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Tu Perfil Vocacional</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-slate-400 mb-4">
            No has completado ningún test vocacional aún
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/vocational-test">
              Realizar Test Vocacional
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Convert scores to percentages and sort by value
  const riasecData = Object.entries(riasecProfile)
    .map(([key, value]) => ({
      key: key as keyof typeof riasecLabels,
      area: riasecLabels[key as keyof typeof riasecLabels].name,
      description: riasecLabels[key as keyof typeof riasecLabels].description,
      progress: Math.round(value),
      color: riasecLabels[key as keyof typeof riasecLabels].color,
    }))
    .sort((a, b) => b.progress - a.progress)

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Tu Perfil RIASEC</CardTitle>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white hover:bg-white/10"
        >
          <Link to="/vocational-test">
            <IconEye size={16} className="mr-2" />
            Ver Detalles
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {riasecData.map((item) => (
          <div key={item.key} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-slate-300">
                  {item.area}
                </span>
                <p className="text-xs text-slate-500">
                  {item.description}
                </p>
              </div>
              <span className="text-sm text-slate-400 font-mono">
                {item.progress}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${item.color}`}
                style={{ width: `${item.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
        
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            Basado en tu último test completado. Los porcentajes más altos indican mayor afinidad.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
