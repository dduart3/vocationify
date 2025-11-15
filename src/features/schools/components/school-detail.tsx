import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { IconArrowLeft, IconBuilding, IconPhone, IconMail, IconWorld, IconUsers, IconBookmark, IconBookmarkFilled, IconSchool, IconClock, IconMapPin, IconTarget } from '@tabler/icons-react'
import { SchoolMap } from './school-map'
import { useSchoolWithCareers } from '../hooks/use-schools'
import { useAuth } from '@/context/auth-context'
import { calculateDistance, formatDistance } from '@/utils/distance'
import { OnboardingProvider, schoolDetailSteps } from '@/features/onboarding'

interface SchoolDetailProps {
  schoolId: string
}

export function SchoolDetail({ schoolId }: SchoolDetailProps) {
  const { data: school, isLoading, error } = useSchoolWithCareers(schoolId)
  const { profile } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  
  // Calculate distance from user location
  const distanceFromUser = useMemo(() => {
    if (!school?.location?.latitude || !school?.location?.longitude || !profile?.location) {
      return null
    }
    
    return calculateDistance(
      profile.location.latitude,
      profile.location.longitude,
      school.location.latitude,
      school.location.longitude
    )
  }, [school?.location, profile?.location])

  const getTypeColor = (type: string) => {
    return type === 'public' ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-green-100 text-green-700 border border-green-300'
  }

  const getTypeDisplayName = (type: string) => {
    return type === 'public' ? 'Pública' : 'Privada'
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

  if (error || !school) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <IconBuilding className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Institución no encontrada</h3>
          <p className="text-gray-600 mb-6">La institución que buscas no existe o ha sido eliminada.</p>
          <Link
            to="/schools"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-900 rounded-lg transition-all duration-200 shadow-sm"
          >
            <IconArrowLeft className="w-4 h-4" />
            Volver a instituciones
          </Link>
        </div>
      </div>
    )
  }

  return (
    <OnboardingProvider section="school-detail" steps={schoolDetailSteps}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div id="school-detail-header" className="flex items-center gap-4 mb-8">
        <Link
          to="/schools"
          className="p-3 rounded-lg bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-all duration-200 shadow-sm"
        >
          <IconArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {school.logo_url && (
              <img
                src={school.logo_url}
                alt={`Logo de ${school.name}`}
                className="w-16 h-16 object-contain rounded-lg bg-white border border-gray-200 p-2 shadow-sm"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-600">Información detallada de la institución</p>
                {distanceFromUser !== null && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 border border-blue-300 rounded-lg">
                    <IconTarget className="w-4 h-4 text-blue-700" />
                    <span className="text-blue-700 font-medium text-sm">
                      {formatDistance(distanceFromUser)} de tu ubicación
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
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
        {/* School Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Address */}
          {school.address && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Dirección</h2>
              <p className="text-gray-700 leading-relaxed">
                {school.address}
              </p>
            </div>
          )}

          {/* Location */}
          {school.location && (
            <div id="school-location-map" className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IconMapPin className="w-5 h-5 text-gray-600" />
                Ubicación
              </h2>
              <SchoolMap
                latitude={school.location.latitude}
                longitude={school.location.longitude}
                schoolName={school.name}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <IconUsers className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getTypeColor(school.type)}`}>
                    {getTypeDisplayName(school.type)}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contacto</h2>
            <div className="space-y-3">
              {school.phone_number && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <IconPhone className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{school.phone_number}</span>
                </div>
              )}

              {school.email && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <IconMail className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{school.email}</span>
                </div>
              )}

              {school.website_url && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <IconWorld className="w-4 h-4 text-gray-600" />
                  </div>
                  <a
                    href={school.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm transition-colors duration-200"
                  >
                    Visitar sitio web
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Careers Section */}
      {school.careers && school.careers.length > 0 && (
        <div id="school-careers-offered" className="bg-white/80 backdrop-blur-sm border border-gray-300/50 shadow-lg shadow-gray-200/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Carreras Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {school.careers.map((schoolCareer, index) => (
              <Link key={index} to="/careers/$careerId" params={{ careerId: schoolCareer.career.id }}>
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-200 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconSchool className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {schoolCareer.career.name}
                      </h3>

                      {schoolCareer.shifts && schoolCareer.shifts.length > 0 && (
                        <div className="flex items-start gap-1 mt-1">
                          <IconClock className="w-3 h-3 text-gray-600 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(schoolCareer.shifts)
                              ? schoolCareer.shifts.map((shift, idx) => (
                                  <span key={idx} className="text-xs text-gray-700 bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded">
                                    {shift}
                                  </span>
                                ))
                              : <span className="text-xs text-gray-700 bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded">
                                  {schoolCareer.shifts}
                                </span>
                            }
                          </div>
                        </div>
                      )}

                      {schoolCareer.duration_years && (
                        <div className="text-xs text-gray-600 mt-1">
                          {schoolCareer.duration_years} años
                        </div>
                      )}

                      {schoolCareer.modality && (
                        <div className="text-xs text-gray-600 mt-1 capitalize">
                          {schoolCareer.modality}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </OnboardingProvider>
  )
}