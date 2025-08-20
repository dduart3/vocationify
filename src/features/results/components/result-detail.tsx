import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { IconArrowLeft, IconBrain, IconTrophy, IconUser, IconTarget, IconBuilding, IconExternalLink } from '@tabler/icons-react'
import { useResultDetail } from '../hooks/use-results'
import { RiasecRadarChart } from '@/features/vocational-test/components/riasec-radar-chart'

interface ResultDetailProps {
  resultId: string
}

export function ResultDetail({ resultId }: ResultDetailProps) {
  const { data: result, isLoading, error } = useResultDetail(resultId)

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
      'R': 'bg-green-500/20 text-green-400',
      'I': 'bg-blue-500/20 text-blue-400',
      'A': 'bg-purple-500/20 text-purple-400',
      'S': 'bg-orange-500/20 text-orange-400',
      'E': 'bg-yellow-500/20 text-yellow-400',
      'C': 'bg-cyan-500/20 text-cyan-400'
    }
    return colors[type] || 'bg-cyan-500/20 text-cyan-400'
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
      <div className="max-w-4xl mx-auto space-y-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse bg-white/20 rounded-lg h-32" />
        ))}
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <IconBrain className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Resultado no encontrado</h3>
          <p className="text-neutral-400 mb-6">El resultado que buscas no existe o ha sido eliminado.</p>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors duration-200"
          >
            <IconArrowLeft className="w-4 h-4" />
            Volver a resultados
          </Link>
        </div>
      </div>
    )
  }

  const topTypes = getTopRiasecTypes(result.riasec_scores)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/results"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <IconArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Resultado del Test Vocacional</h1>
            <p className="text-neutral-400 text-sm">Completado el {formatDate(result.created_at)}</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
          {getStatusDisplayName(result.status)}
        </div>
      </div>

      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Top RIASEC Type */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconUser className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Tipo Principal</span>
          </div>
          <div className={`text-lg font-bold ${getRiasecColor(topTypes[0]?.type || '')}`}>
            {topTypes[0]?.name || 'N/A'}
          </div>
          <div className="text-sm text-neutral-300">{topTypes[0]?.score || 0}% de compatibilidad</div>
        </div>

        {/* Secondary Type */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconTarget className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Tipo Secundario</span>
          </div>
          <div className={`text-lg font-bold ${getRiasecColor(topTypes[1]?.type || '')}`}>
            {topTypes[1]?.name || 'N/A'}
          </div>
          <div className="text-sm text-neutral-300">{topTypes[1]?.score || 0}% de compatibilidad</div>
        </div>

        {/* Test Type */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconBrain className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Tipo de Test</span>
          </div>
          <div className="text-lg font-bold text-white capitalize">
            {result.session_type || 'Conversacional'}
          </div>
          <div className="text-sm text-neutral-300">Metodología RIASEC</div>
        </div>

        {/* Confidence Level */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconTrophy className="w-4 h-4 text-neutral-400" />
            <span className="text-sm text-neutral-400">Confianza</span>
          </div>
          <div className="text-lg font-bold text-white">
            {result.confidence_level || 95}%
          </div>
          <div className="w-full h-1 bg-white/20 rounded-full mt-2">
            <div 
              className="h-full bg-green-400 rounded-full"
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
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <IconBrain className="w-5 h-5 text-neutral-400" />
              Visualización del Perfil RIASEC
            </h2>
            <div className="flex justify-center">
              <RiasecRadarChart scores={result.riasec_scores} size={280} />
            </div>
          </div>

          {/* Detailed Scores - Horizontal Layout */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-lg font-bold text-white mb-4">Puntuaciones Detalladas</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(result.riasec_scores).map(([type, score]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-300">{getRiasecDisplayName(type)}</span>
                    <span className="text-sm font-bold text-white">{score}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 rounded-full transition-all duration-300"
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
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <IconTrophy className="w-5 h-5 text-neutral-400" />
                Carreras Recomendadas
              </h2>
              <div className="space-y-3">
                {result.career_recommendations.map((career: any, index: number) => {
                  const CareerComponent = career.career_id ? Link : 'div'
                  const linkProps = career.career_id ? {
                    to: '/careers/$careerId' as const,
                    params: { careerId: career.career_id }
                  } : {}
                  
                  return (
                    <CareerComponent 
                      key={index} 
                      className={`bg-white/5 rounded-lg p-4 block ${career.career_id ? 'hover:bg-white/10 cursor-pointer transition-colors duration-200' : ''}`}
                      {...linkProps}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-neutral-500'
                          }`}>
                            {index + 1}
                          </div>
                          <h3 className={`font-semibold text-white ${career.career_id ? 'group-hover:text-blue-400' : ''}`}>
                            {career.career_name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-blue-400 font-medium">{career.confidence}%</div>
                          {career.career_id && (
                            <IconExternalLink className="w-4 h-4 text-blue-400 opacity-75" />
                          )}
                        </div>
                      </div>
                      <p className="text-neutral-300 text-sm leading-relaxed">{career.reasoning}</p>
                    </CareerComponent>
                  )
                })}
              </div>
            </div>
          )}

          {/* Personality Description */}
          {result.personality_description && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <IconUser className="w-5 h-5 text-neutral-400" />
                Descripción de Personalidad
              </h2>
              <p className="text-neutral-300 leading-relaxed text-sm">{result.personality_description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}