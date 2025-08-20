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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/results"
          className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          <IconArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">Resultado del Test Vocacional</h1>
          <p className="text-neutral-400 mt-1">Completado el {formatDate(result.created_at)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* RIASEC Radar Chart */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <IconBrain className="w-5 h-5 text-neutral-400" />
              Visualización de tu Perfil
            </h2>
            <div className="flex justify-center">
              <RiasecRadarChart scores={result.riasec_scores} size={320} />
            </div>
          </div>

          {/* RIASEC Profile Summary */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <IconUser className="w-5 h-5 text-neutral-400" />
              Tu Perfil RIASEC
            </h2>
            
            {/* Top Types */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-300 mb-3">Tipos Dominantes:</h3>
              <div className="flex gap-3">
                {topTypes.map((type, index) => (
                  <div
                    key={type.type}
                    className={`px-3 py-2 rounded-lg ${getRiasecColor(type.type)}`}
                  >
                    <div className="font-medium">{type.name}</div>
                    <div className="text-sm opacity-75">
                      {index === 0 ? 'Principal' : 'Secundario'} - {type.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-300">Puntuaciones detalladas:</h3>
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

          {/* Career Recommendations */}
          {result.career_recommendations && result.career_recommendations.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <IconTrophy className="w-5 h-5 text-neutral-400" />
                Carreras Recomendadas
              </h2>
              <div className="space-y-4">
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
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-neutral-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className={`font-semibold text-white ${career.career_id ? 'group-hover:text-blue-400' : ''}`}>
                              {career.career_name}
                            </h3>
                            <div className="text-sm text-blue-400 font-medium">{career.confidence}% compatibilidad</div>
                          </div>
                        </div>
                        {career.career_id && (
                          <div className="flex items-center gap-1 text-blue-400 text-xs font-medium opacity-75 hover:opacity-100 transition-opacity">
                            <span>Ver carrera</span>
                            <IconExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-neutral-300 text-sm leading-relaxed">{career.reasoning}</p>
                    </CareerComponent>
                  )
                })}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Test Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Información del Test</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <IconBrain className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-sm text-neutral-400">Tipo de test</p>
                  <p className="text-white font-medium capitalize">{result.session_type || 'Conversacional'}</p>
                </div>
              </div>
              
              {result.confidence_level && (
                <div className="flex items-center gap-3">
                  <IconTarget className="w-5 h-5 text-neutral-400" />
                  <div>
                    <p className="text-sm text-neutral-400">Nivel de confianza</p>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 rounded-full"
                          style={{ width: `${result.confidence_level}%` }}
                        />
                      </div>
                      <span className="text-white font-medium">{result.confidence_level}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <IconBuilding className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-sm text-neutral-400">Estado</p>
                  <p className="text-white font-medium">{getStatusDisplayName(result.status)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {result.personality_description && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Descripción de Personalidad</h2>
              <p className="text-neutral-300 leading-relaxed">{result.personality_description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}