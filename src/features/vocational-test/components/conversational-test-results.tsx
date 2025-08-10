import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  IconBrain, 
  IconTrophy, 
  IconRefresh, 
  IconSearch, 
  IconChevronRight,
  IconSparkles,
  IconUser,
  IconCircleCheck
} from '@tabler/icons-react'
import { useConversationalResults } from '../hooks/use-conversational-session'
import { RiasecRadarChart } from './riasec-radar-chart'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface ConversationalTestResultsProps {
  sessionId: string
  onRetakeTest: () => void
  onExploreAllCareers: () => void
}

export function ConversationalTestResults({ 
  sessionId, 
  onRetakeTest, 
  onExploreAllCareers 
}: ConversationalTestResultsProps) {
  const { data: results, isLoading, error } = useConversationalResults(sessionId, true)
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'profile'>('overview')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-700">
              Analizando tu perfil vocacional...
            </h3>
            <p className="text-slate-500">
              ARIA está procesando tu conversación para generar tus resultados
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <IconBrain className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-700">Error al cargar resultados</CardTitle>
            <CardDescription>
              No pudimos encontrar los resultados de tu conversación con ARIA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={onRetakeTest} className="w-full">
              <IconRefresh className="w-4 h-4 mr-2" />
              Realizar nueva conversación
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Backend now properly returns RIASEC scores from session_riasec_scores table (or 50s as fallback)
  const riasecScores = results.riasecScores || { R: 50, I: 50, A: 50, S: 50, E: 50, C: 50 }
  const topCareers = results.careerRecommendations?.slice(0, 3).map(rec => ({
    name: rec.name || 'Carrera no encontrada',
    confidence: rec.confidence,
    reasoning: rec.reasoning,
    careerId: rec.careerId
  })) || []
  const confidence = results.riasecAssessment?.confidence || 75

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8 space-y-4">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full">
          <IconCircleCheck className="w-5 h-5" />
          <span className="font-semibold">Conversación completada</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900">
          Tu Perfil Vocacional
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          ARIA ha analizado tu conversación y generado un perfil personalizado con recomendaciones de carreras
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full p-1 shadow-sm border">
          <div className="flex gap-1">
            {[
              { key: 'overview', label: 'Resumen', icon: IconSparkles },
              { key: 'profile', label: 'Mi Perfil', icon: IconUser },
              { key: 'recommendations', label: 'Carreras', icon: IconTrophy }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === 'overview' && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Confidence Score */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <IconBrain className="w-5 h-5 text-blue-600" />
                      Análisis de ARIA
                    </CardTitle>
                    <CardDescription>
                      Nivel de confianza en el análisis de tu perfil
                    </CardDescription>
                  </div>
                  <Badge variant={confidence >= 80 ? 'default' : confidence >= 60 ? 'secondary' : 'outline'}>
                    {confidence}% confianza
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={confidence} className="h-3 mb-4" />
                <p className="text-slate-600">
                  {results.riasecAssessment?.reasoning || 'ARIA ha analizado tu conversación para determinar tus intereses y habilidades vocacionales.'}
                </p>
              </CardContent>
            </Card>

            {/* Top Recommendation Preview */}
            {topCareers[0] && (
              <Card className="lg:col-span-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <IconTrophy className="w-5 h-5" />
                    Tu Carrera Recomendada #1
                  </CardTitle>
                  <CardDescription>
                    La opción que mejor se adapta a tu perfil según ARIA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {topCareers[0].name}
                    </h3>
                    <Badge className="bg-blue-600 text-white">
                      {topCareers[0].confidence}% compatible
                    </Badge>
                  </div>
                  <p className="text-slate-700">
                    {topCareers[0].reasoning}
                  </p>
                  <Button 
                    onClick={() => setActiveTab('recommendations')}
                    className="w-full"
                  >
                    Ver todas las recomendaciones
                    <IconChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* RIASEC Radar Chart */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Tu Perfil RIASEC</CardTitle>
                <CardDescription>
                  Visualización de tus intereses y habilidades vocacionales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RiasecRadarChart scores={riasecScores} />
              </CardContent>
            </Card>

            {/* RIASEC Breakdown */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Desglose de Puntuaciones</CardTitle>
                <CardDescription>
                  Tus niveles en cada tipo de personalidad vocacional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'R', label: 'Realista', desc: 'Trabajo práctico y con herramientas' },
                  { key: 'I', label: 'Investigativo', desc: 'Análisis y resolución de problemas' },
                  { key: 'A', label: 'Artístico', desc: 'Creatividad y expresión' },
                  { key: 'S', label: 'Social', desc: 'Ayudar y trabajar con personas' },
                  { key: 'E', label: 'Emprendedor', desc: 'Liderazgo y persuasión' },
                  { key: 'C', label: 'Convencional', desc: 'Organización y sistemas' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-slate-900">{label}</span>
                        <p className="text-sm text-slate-500">{desc}</p>
                      </div>
                      <Badge variant="outline">
                        {riasecScores[key as keyof typeof riasecScores]}%
                      </Badge>
                    </div>
                    <Progress value={riasecScores[key as keyof typeof riasecScores]} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                Carreras Recomendadas por ARIA
              </h2>
              <p className="text-slate-600">
                Estas son las {topCareers.length} carreras que mejor se adaptan a tu perfil vocacional
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
              {topCareers.map((career, index) => (
                <Card key={career.careerId || index} className={
                  index === 0 ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50' : ''
                }>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-emerald-600' : 'bg-slate-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{career.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>{career.confidence}% de compatibilidad</span>
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={
                        index === 0 ? 'bg-blue-600 text-white' : 
                        index === 1 ? 'bg-emerald-600 text-white' : 
                        'bg-slate-600 text-white'
                      }>
                        #{index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed">
                      {career.reasoning}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator className="my-12" />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button 
          onClick={onExploreAllCareers}
          size="lg" 
          className="w-full sm:w-auto min-w-[200px]"
        >
          <IconSearch className="w-5 h-5 mr-2" />
          Explorar todas las carreras
        </Button>
        <Button 
          onClick={onRetakeTest} 
          variant="outline" 
          size="lg"
          className="w-full sm:w-auto min-w-[200px]"
        >
          <IconRefresh className="w-5 h-5 mr-2" />
          Nueva conversación
        </Button>
      </div>

      {/* Conversation Summary */}
      <div className="mt-12 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Resumen de tu conversación</CardTitle>
            <CardDescription className="text-center">
              Intercambiaste {results.conversationHistory?.length || 0} mensajes con ARIA
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="inline-flex items-center gap-2 text-emerald-600">
              <IconCircleCheck className="w-5 h-5" />
              <span className="font-medium">
                Perfil vocacional completado con éxito
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}