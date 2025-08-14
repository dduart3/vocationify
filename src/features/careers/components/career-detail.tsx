import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { IconArrowLeft, IconSchool, IconTarget, IconClock, IconStar, IconBookmark, IconBookmarkFilled, IconMapPin, IconBuilding } from '@tabler/icons-react'
import { useCareerWithSchools } from '../hooks/use-careers'
import type { Career } from '../types'

interface CareerDetailProps {
  careerId: string
}

export function CareerDetail({ careerId }: CareerDetailProps) {
  const { data: career, isLoading, error } = useCareerWithSchools(careerId)
  const [isFavorite, setIsFavorite] = useState(false)

  const getRiasecColor = (type: string) => {
    const colors: Record<string, string> = {
      'realistic': 'bg-green-100 text-green-800 border-green-200',
      'investigative': 'bg-blue-100 text-blue-800 border-blue-200', 
      'artistic': 'bg-purple-100 text-purple-800 border-purple-200',
      'social': 'bg-orange-100 text-orange-800 border-orange-200',
      'enterprising': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'conventional': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getRiasecDisplayName = (type: string) => {
    const names: Record<string, string> = {
      'realistic': 'Realista',
      'investigative': 'Investigativo',
      'artistic': 'Artístico',
      'social': 'Social',
      'enterprising': 'Emprendedor',
      'conventional': 'Convencional'
    }
    return names[type.toLowerCase()] || type
  }

  const getTopRiasecScore = (career: any) => {
    return Math.max(
      career.realistic_score,
      career.investigative_score,
      career.artistic_score,
      career.social_score,
      career.enterprising_score,
      career.conventional_score
    )
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

  if (error || !career) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <IconSchool className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Carrera no encontrada</h3>
          <p className="text-gray-600 mb-6">La carrera que buscas no existe o ha sido eliminada.</p>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <IconArrowLeft className="w-4 h-4" />
            Volver a carreras
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/careers"
          className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        >
          <IconArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{career.name}</h1>
          <p className="text-gray-600 mt-1">Información detallada de la carrera</p>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        >
          {isFavorite ? (
            <IconBookmarkFilled className="w-5 h-5 text-pink-400" />
          ) : (
            <IconBookmark className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Career Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">
              {career.description}
            </p>
          </div>

          {/* Skills */}
          {career.key_skills && career.key_skills.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Habilidades Clave</h2>
              <div className="flex flex-wrap gap-2">
                {career.key_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Environment */}
          {career.work_environment && career.work_environment.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ambiente de Trabajo</h2>
              <div className="flex flex-wrap gap-2">
                {career.work_environment.map((env, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-sm font-medium"
                  >
                    {env}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Careers */}
          {career.related_careers && career.related_careers.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Carreras Relacionadas</h2>
              <div className="flex flex-wrap gap-2">
                {career.related_careers.map((relatedCareer, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-100 text-green-800 border border-green-200 rounded-lg text-sm font-medium"
                  >
                    {relatedCareer}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <IconClock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Duración</p>
                  <p className="text-gray-900 font-medium">{career.duration_years} años</p>
                </div>
              </div>
              
            </div>
          </div>

          {/* RIASEC Profile */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Perfil RIASEC</h2>
            <div className="space-y-3">
              <div className={`px-3 py-2 rounded-lg border ${getRiasecColor(career.primary_riasec_type)}`}>
                <div className="flex items-center gap-2">
                  <IconTarget className="w-4 h-4" />
                  <span className="font-medium">{getRiasecDisplayName(career.primary_riasec_type)}</span>
                  <span className="text-sm opacity-75">Principal</span>
                </div>
              </div>
              
              {career.secondary_riasec_type && (
                <div className={`px-3 py-2 rounded-lg border opacity-75 ${getRiasecColor(career.secondary_riasec_type)}`}>
                  <div className="flex items-center gap-2">
                    <IconTarget className="w-4 h-4" />
                    <span className="font-medium">{getRiasecDisplayName(career.secondary_riasec_type)}</span>
                    <span className="text-sm opacity-75">Secundario</span>
                  </div>
                </div>
              )}
            </div>

            {/* RIASEC Scores */}
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Puntuaciones detalladas:</h3>
              {[
                { key: 'realistic', label: 'Realista', score: career.realistic_score },
                { key: 'investigative', label: 'Investigativo', score: career.investigative_score },
                { key: 'artistic', label: 'Artístico', score: career.artistic_score },
                { key: 'social', label: 'Social', score: career.social_score },
                { key: 'enterprising', label: 'Emprendedor', score: career.enterprising_score },
                { key: 'conventional', label: 'Convencional', score: career.conventional_score },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-12">{item.score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schools Section */}
      {career.schools && career.schools.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Dónde Estudiar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {career.schools.map((schoolCareer, index) => (
              <div key={index} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 border border-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconBuilding className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {schoolCareer.school.name}
                    </h3>
                    {schoolCareer.school.location?.city && (
                      <div className="flex items-center gap-1 mt-1">
                        <IconMapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {schoolCareer.school.location.city}
                          {schoolCareer.school.location.state && `, ${schoolCareer.school.location.state}`}
                        </span>
                      </div>
                    )}
                    {schoolCareer.shifts && schoolCareer.shifts.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <IconClock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {Array.isArray(schoolCareer.shifts) 
                            ? schoolCareer.shifts.join(', ') 
                            : schoolCareer.shifts}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}