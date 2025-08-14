import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { IconArrowLeft, IconBrain, IconTrophy, IconUser, IconTarget, IconBuilding } from '@tabler/icons-react'
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
      'R': 'bg-green-100 text-green-800 border-green-200',
      'I': 'bg-blue-100 text-blue-800 border-blue-200',
      'A': 'bg-purple-100 text-purple-800 border-purple-200',
      'S': 'bg-orange-100 text-orange-800 border-orange-200',
      'E': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'C': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200'
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-32" />
        ))}
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <IconBrain className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Resultado no encontrado</h3>
          <p className="text-gray-600 mb-6">El resultado que buscas no existe o ha sido eliminado.</p>
          <Link
            to="/results"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
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
          className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        >
          <IconArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Resultado del Test Vocacional</h1>
          <p className="text-gray-600 mt-1">Completado el {formatDate(result.created_at)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* RIASEC Radar Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <IconBrain className="w-5 h-5 text-gray-400" />
              Visualización de tu Perfil
            </h2>
            <div className="flex justify-center">
              <RiasecRadarChart scores={result.riasec_scores} size={320} />
            </div>
          </div>

          {/* RIASEC Profile Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <IconUser className="w-5 h-5 text-gray-400" />
              Tu Perfil RIASEC
            </h2>
            
            {/* Top Types */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Tipos Dominantes:</h3>
              <div className="flex gap-3">
                {topTypes.map((type, index) => (
                  <div
                    key={type.type}
                    className={`px-3 py-2 rounded-lg border ${getRiasecColor(type.type)}`}
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
              <h3 className="text-sm font-medium text-gray-700">Puntuaciones detalladas:</h3>
              {Object.entries(result.riasec_scores).map(([type, score]) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{getRiasecDisplayName(type)}</span>
                    <span className="text-sm font-bold text-gray-900">{score}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Recommendations */}
          {result.career_recommendations && result.career_recommendations.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IconTrophy className="w-5 h-5 text-gray-400" />
                Carreras Recomendadas
              </h2>
              <div className="space-y-4">
                {result.career_recommendations.map((career: any, index: number) => (
                  <div key={index} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{career.career_name}</h3>
                          <div className="text-sm text-blue-600 font-medium">{career.confidence}% compatibilidad</div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{career.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Test Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Test</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <IconBrain className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Tipo de test</p>
                  <p className="text-gray-900 font-medium capitalize">{result.session_type || 'Conversacional'}</p>
                </div>
              </div>
              
              {result.confidence_level && (
                <div className="flex items-center gap-3">
                  <IconTarget className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Nivel de confianza</p>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${result.confidence_level}%` }}
                        />
                      </div>
                      <span className="text-gray-900 font-medium">{result.confidence_level}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <IconBuilding className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="text-gray-900 font-medium capitalize">{result.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {result.personality_description && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción de Personalidad</h2>
              <p className="text-gray-700 leading-relaxed">{result.personality_description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}