import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const progressData = [
  { area: 'Ciencias', progress: 85, color: 'bg-blue-500' },
  { area: 'Tecnología', progress: 92, color: 'bg-purple-500' },
  { area: 'Artes', progress: 45, color: 'bg-pink-500' },
  { area: 'Humanidades', progress: 67, color: 'bg-green-500' },
  { area: 'Negocios', progress: 78, color: 'bg-orange-500' },
]

export function VocationalProgress() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white">Tu Perfil Vocacional</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {progressData.map((item) => (
          <div key={item.area} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">
                {item.area}
              </span>
              <span className="text-sm text-slate-400">
                {item.progress}%
              </span>
            </div>
            <Progress 
              value={item.progress} 
              className="h-2"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
