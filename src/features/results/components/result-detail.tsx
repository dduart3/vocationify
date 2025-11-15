import { Link, useParams } from '@tanstack/react-router'
import { IconArrowLeft, IconBrain, IconTrophy, IconUser, IconTarget, IconExternalLink } from '@tabler/icons-react'
import { useResultDetail } from '../hooks/use-results'
import { GlassmorphismSkeleton } from '@/components/ui/glassmorphism-loader'
import { PDFExport } from '../components/pdf-export'
import { RiasecRadarChart } from '../components/riasec-radar-chart'

export function ResultDetail() {
  const { sessionId } = useParams({ from: '/_authenticated/results/$sessionId' })
  const { data: result, isLoading, error } = useResultDetail(sessionId)

  const getRiasecDisplayName = (type: string) => {
    const names: Record<string, string> = {
      'R': 'Realista',
      'I': 'Investigativo',
      'A': 'Artístico', 
      'S': 'Social',
      'E': 'Emprendedor',
      'C': 'Convencional'
    }
    return names[type] || type
  }

  const getRiasecColor = (type: string) => {
    const colors: Record<string, string> = {
      'R': 'bg-green-100 text-green-700 border border-green-300',
      'I': 'bg-blue-100 text-blue-700 border border-blue-300',
      'A': 'bg-purple-100 text-purple-700 border border-purple-300',
      'S': 'bg-orange-100 text-orange-700 border border-orange-300',
      'E': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
      'C': 'bg-cyan-100 text-cyan-700 border border-cyan-300'
    }
    return colors[type] || 'bg-cyan-100 text-cyan-700 border border-cyan-300'
  }

  const getTopRiasecTypes = (scores: any) => {
    const sortedScores = Object.entries(scores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 2)
    
    return sortedScores.map(([type, score]) => ({
      type: type as string,
      score: score as number,
      name: getRiasecDisplayName(type)
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusDisplayName = (status: string) => {
    const statusMap: Record<string, string> = {
      'completed': 'Completado',
      'in_progress': 'En progreso',
      'pending': 'Pendiente',
      'failed': 'Fallido',
      'cancelled': 'Cancelado'
    }
    return statusMap[status.toLowerCase()] || status
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <GlassmorphismSkeleton count={1} height="h-16" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassmorphismSkeleton count={4} height="h-20" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GlassmorphismSkeleton count={2} height="h-80" />
          <GlassmorphismSkeleton count={2} height="h-80" />
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex-1 min-h-screen relative overflow-hidden">
        {/* Beautiful background similar to vocational test */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div 
            className="text-center p-8 rounded-3xl backdrop-blur-xl max-w-md w-full"
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
            <IconBrain className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Resultado no encontrado</h3>
            <p className="text-white/70 mb-8 leading-relaxed">
              El resultado que buscas no existe o ha sido eliminado.
            </p>
            <Link
              to="/results"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <IconArrowLeft className="w-4 h-4" />
              Volver a resultados
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const topTypes = getTopRiasecTypes(result.riasec_scores)

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pt-4 sm:pt-8" id="result-detail-content">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/results"
            className="p-2 rounded-lg bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 shadow-sm flex-shrink-0"
          >
            <IconArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Resultado del Test Vocacional</h1>
            <p className="text-gray-600 text-xs sm:text-sm font-medium">Completado el {formatDate(result.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          {/* PDF Export Button */}
          <PDFExport
            testResult={result}
            fileName="resultado-test-vocacional"
            title="Mi Resultado del Test Vocacional - Vocationify"
          />

          {/* Status Badge */}
          <div className="px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
            {getStatusDisplayName(result.status)}
          </div>
        </div>
      </div>

      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Top RIASEC Type */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconUser className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600 font-semibold">Tipo Principal</span>
          </div>
          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold ${getRiasecColor(topTypes[0]?.type || '')}`}>
            {topTypes[0]?.name || 'N/A'}
          </div>
          <div className="text-sm text-gray-700 font-medium mt-2">{topTypes[0]?.score || 0}% de compatibilidad</div>
        </div>

        {/* Secondary Type */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconTarget className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600 font-semibold">Tipo Secundario</span>
          </div>
          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold ${getRiasecColor(topTypes[1]?.type || '')}`}>
            {topTypes[1]?.name || 'N/A'}
          </div>
          <div className="text-sm text-gray-700 font-medium mt-2">{topTypes[1]?.score || 0}% de compatibilidad</div>
        </div>

        {/* Test Type */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconBrain className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600 font-semibold">Tipo de Test</span>
          </div>
          <div className="text-lg font-bold text-gray-900 capitalize">
            {result.session_type || 'Conversacional'}
          </div>
          <div className="text-sm text-gray-700 font-medium">Metodología RIASEC</div>
        </div>

        {/* Confidence Level */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconTrophy className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600 font-semibold">Confianza</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {result.confidence_level || 95}%
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 border border-gray-300 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"
              style={{ width: `${result.confidence_level || 95}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Left Column - RIASEC Analysis */}
        <div className="space-y-6">
          {/* RIASEC Radar Chart */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IconBrain className="w-5 h-5 text-blue-600" />
              Visualización del Perfil RIASEC
            </h2>
            <div className="flex justify-center">
              <RiasecRadarChart scores={result.riasec_scores} size={280} />
            </div>
          </div>

          {/* Detailed Scores - Horizontal Layout */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Puntuaciones Detalladas</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(result.riasec_scores).map(([type, score]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">{getRiasecDisplayName(type)}</span>
                    <span className="text-sm font-bold text-gray-900">{score}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden border border-gray-300 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm transition-all duration-300"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Career Recommendations */}
        <div className="space-y-6">
          {/* Career Recommendations */}
          {result.career_recommendations && result.career_recommendations.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IconTrophy className="w-5 h-5 text-amber-600" />
                Carreras Recomendadas
              </h2>
              <div className="space-y-3">
                {result.career_recommendations.map((career: any, index: number) => {
                  const careerContent = (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ${
                            index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : index === 1 ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-gray-500 to-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <h3 className={`font-bold text-gray-900 ${career.career_id ? 'group-hover:text-blue-600' : ''}`}>
                            {career.career_name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-blue-700 font-bold">{career.confidence}%</div>
                          {career.career_id && (
                            <IconExternalLink className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">{career.reasoning}</p>
                    </>
                  )

                  return career.career_id ? (
                    <Link
                      key={index}
                      to="/careers/$careerId"
                      params={{ careerId: String(career.career_id) }}
                      className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 block hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100/50 cursor-pointer transition-all duration-200 group"
                    >
                      {careerContent}
                    </Link>
                  ) : (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 block"
                    >
                      {careerContent}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Personality Description */}
          {result.personality_description && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IconUser className="w-5 h-5 text-purple-600" />
                Descripción de Personalidad
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm font-medium">{result.personality_description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}