import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { IconArrowLeft, IconSchool, IconTarget, IconClock, IconBookmark, IconBookmarkFilled, IconMapPin, IconBuilding } from '@tabler/icons-react'
import { useCareerWithSchools } from '../hooks/use-careers'
import { useAuth } from '@/context/auth-context'
import { calculateDistance, formatDistance } from '@/utils/distance'

interface CareerDetailProps {
  careerId: string
}

export function CareerDetail({ careerId }: CareerDetailProps) {
  const { data: career, isLoading, error } = useCareerWithSchools(careerId)
  const { profile } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  
  // Sort schools by distance if user has location
  const sortedSchools = useMemo(() => {
    if (!career?.schools || !profile?.location) {
      return career?.schools || []
    }
    
    const userLat = profile.location.latitude
    const userLon = profile.location.longitude
    
    return [...career.schools].sort((a, b) => {
      // If school doesn't have location, put it at the end
      if (!a.school.location?.latitude || !a.school.location?.longitude) return 1
      if (!b.school.location?.latitude || !b.school.location?.longitude) return -1
      
      const distanceA = calculateDistance(
        userLat, userLon,
        a.school.location.latitude, a.school.location.longitude
      )
      const distanceB = calculateDistance(
        userLat, userLon,
        b.school.location.latitude, b.school.location.longitude
      )
      
      return distanceA - distanceB
    })
  }, [career?.schools, profile?.location])

  const getRiasecColor = (type: string) => {
    const colors: Record<string, string> = {
      'realistic': 'bg-green-100 text-green-700 border border-green-300',
      'investigative': 'bg-blue-100 text-blue-700 border border-blue-300',
      'artistic': 'bg-purple-100 text-purple-700 border border-purple-300',
      'social': 'bg-orange-100 text-orange-700 border border-orange-300',
      'enterprising': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
      'conventional': 'bg-cyan-100 text-cyan-700 border border-cyan-300'
    }
    return colors[type.toLowerCase()] || 'bg-cyan-100 text-cyan-700 border border-cyan-300'
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



  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse bg-white/80 border border-gray-200 rounded-lg h-32" />
        ))}
      </div>
    )
  }

  if (error || !career) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <IconSchool className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Carrera no encontrada</h3>
          <p className="text-gray-600 mb-6">La carrera que buscas no existe o ha sido eliminada.</p>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-900 rounded-lg transition-all duration-200 shadow-sm"
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
          className="p-3 rounded-lg bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 shadow-sm"
        >
          <IconArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{career.name}</h1>
          <p className="text-gray-600 mt-1">Información detallada de la carrera</p>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-3 rounded-lg bg-white border-2 border-gray-300 hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 shadow-sm"
        >
          {isFavorite ? (
            <IconBookmarkFilled className="w-5 h-5 text-pink-600" />
          ) : (
            <IconBookmark className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Career Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">
              {career.description}
            </p>
          </div>

          {/* Skills */}
          {career.key_skills && career.key_skills.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Habilidades Clave</h2>
              <div className="flex flex-wrap gap-2">
                {career.key_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Environment */}
          {career.work_environment && career.work_environment.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ambiente de Trabajo</h2>
              <div className="flex flex-wrap gap-2">
                {career.work_environment.map((env, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-purple-100 text-purple-700 border border-purple-300 rounded-lg text-sm font-medium"
                  >
                    {env}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Careers */}
          {career.related_careers && career.related_careers.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Carreras Relacionadas</h2>
              <div className="flex flex-wrap gap-2">
                {career.related_careers.map((relatedCareer, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-100 text-green-700 border border-green-300 rounded-lg text-sm font-medium"
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
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <IconClock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Duración</p>
                  <p className="text-gray-900 font-medium">{career.duration_years} años</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIASEC Profile */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Perfil RIASEC</h2>
            <div className="space-y-3">
              <div className={`px-3 py-2 rounded-lg ${getRiasecColor(career.primary_riasec_type)}`}>
                <div className="flex items-center gap-2">
                  <IconTarget className="w-4 h-4" />
                  <span className="font-medium">{getRiasecDisplayName(career.primary_riasec_type)}</span>
                  <span className="text-sm opacity-75">Principal</span>
                </div>
              </div>

              {career.secondary_riasec_type && (
                <div className={`px-3 py-2 rounded-lg opacity-75 ${getRiasecColor(career.secondary_riasec_type)}`}>
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
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 w-12">{item.score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schools Section */}
      {sortedSchools && sortedSchools.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Dónde Estudiar</h2>
          {profile?.location && (
            <p className="text-sm text-green-700 mb-4 flex items-center gap-1">
              <IconMapPin className="w-4 h-4" />
              Ordenado por distancia desde tu ubicación
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSchools.map((schoolCareer, index) => {
              // Calculate distance if user has location
              const distance = profile?.location &&
                schoolCareer.school.location?.latitude &&
                schoolCareer.school.location?.longitude
                ? calculateDistance(
                    profile.location.latitude,
                    profile.location.longitude,
                    schoolCareer.school.location.latitude,
                    schoolCareer.school.location.longitude
                  )
                : null

              return (
                <Link key={index} to="/schools/$schoolId" params={{ schoolId: schoolCareer.school.id }}>
                  <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-200 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 border border-green-300 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconBuilding className="w-5 h-5 text-green-700" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                          {schoolCareer.school.name}
                        </h3>
                        {schoolCareer.school.location?.city && (
                          <div className="flex items-center gap-1 mt-1">
                            <IconMapPin className="w-3 h-3 text-gray-600" />
                            <span className="text-xs text-gray-600">
                              {schoolCareer.school.location.city}
                              {schoolCareer.school.location.state && `, ${schoolCareer.school.location.state}`}
                            </span>
                          </div>
                        )}
                        {distance !== null && (
                          <div className="flex items-center gap-1 mt-1">
                            <IconTarget className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">
                              {formatDistance(distance)} de distancia
                            </span>
                          </div>
                        )}
                        {schoolCareer.shifts && schoolCareer.shifts.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <IconClock className="w-3 h-3 text-gray-600" />
                            <span className="text-xs text-gray-600">
                              {Array.isArray(schoolCareer.shifts)
                                ? schoolCareer.shifts.join(', ')
                                : schoolCareer.shifts}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}