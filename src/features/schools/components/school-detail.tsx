import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { IconArrowLeft, IconBuilding, IconPhone, IconMail, IconWorld, IconUsers, IconBookmark, IconBookmarkFilled, IconSchool, IconClock, IconMapPin, IconTarget } from '@tabler/icons-react'
import { SchoolMap } from './school-map'
import { useSchoolWithCareers } from '../hooks/use-schools'
import { useAuthStore } from '@/stores/auth-store'
import { calculateDistance, formatDistance } from '@/utils/distance'

interface SchoolDetailProps {
  schoolId: string
}

export function SchoolDetail({ schoolId }: SchoolDetailProps) {
  const { data: school, isLoading, error } = useSchoolWithCareers(schoolId)
  const { profile } = useAuthStore()
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
    return type === 'public' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
  }

  const getTypeDisplayName = (type: string) => {
    return type === 'public' ? 'Pública' : 'Privada'
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

  if (error || !school) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <IconBuilding className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Institución no encontrada</h3>
          <p className="text-neutral-400 mb-6">La institución que buscas no existe o ha sido eliminada.</p>
          <Link
            to="/schools"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors duration-200"
          >
            <IconArrowLeft className="w-4 h-4" />
            Volver a instituciones
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
          to="/schools"
          className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          <IconArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {school.logo_url && (
              <img
                src={school.logo_url}
                alt={`Logo de ${school.name}`}
                className="w-16 h-16 object-contain rounded-lg bg-white p-2"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{school.name}</h1>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-neutral-400">Información detallada de la institución</p>
                {distanceFromUser !== null && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 rounded-lg">
                    <IconTarget className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-medium text-sm">
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
          className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          {isFavorite ? (
            <IconBookmarkFilled className="w-5 h-5 text-pink-500" />
          ) : (
            <IconBookmark className="w-5 h-5 text-neutral-400" />
          )}
        </button>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* School Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Address */}
          {school.address && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Dirección</h2>
              <p className="text-neutral-300 leading-relaxed">
                {school.address}
              </p>
            </div>
          )}

          {/* Location */}
          {school.location && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <IconMapPin className="w-5 h-5 text-neutral-400" />
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
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Información General</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <IconUsers className="w-5 h-5 text-neutral-400" />
                <div>
                  <p className="text-sm text-neutral-400">Tipo</p>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${getTypeColor(school.type)}`}>
                    {getTypeDisplayName(school.type)}
                  </span>
                </div>
              </div>
              

            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Contacto</h2>
            <div className="space-y-3">
              {school.phone_number && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <IconPhone className="w-4 h-4 text-neutral-400" />
                  </div>
                  <span className="text-neutral-300 text-sm">{school.phone_number}</span>
                </div>
              )}
              
              {school.email && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <IconMail className="w-4 h-4 text-neutral-400" />
                  </div>
                  <span className="text-neutral-300 text-sm">{school.email}</span>
                </div>
              )}
              
              {school.website_url && (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <IconWorld className="w-4 h-4 text-neutral-400" />
                  </div>
                  <a 
                    href={school.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
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
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Carreras Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {school.careers.map((schoolCareer, index) => (
              <Link key={index} to="/careers/$careerId" params={{ careerId: schoolCareer.career.id }}>
                <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors duration-200 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconSchool className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm leading-tight">
                        {schoolCareer.career.name}
                      </h3>
                      
                      {schoolCareer.shifts && schoolCareer.shifts.length > 0 && (
                        <div className="flex items-start gap-1 mt-1">
                          <IconClock className="w-3 h-3 text-neutral-400 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(schoolCareer.shifts) 
                              ? schoolCareer.shifts.map((shift, idx) => (
                                  <span key={idx} className="text-xs text-neutral-400 bg-white/10 px-1.5 py-0.5 rounded">
                                    {shift}
                                  </span>
                                ))
                              : <span className="text-xs text-neutral-400 bg-white/10 px-1.5 py-0.5 rounded">
                                  {schoolCareer.shifts}
                                </span>
                            }
                          </div>
                        </div>
                      )}
                      
                      {schoolCareer.duration_years && (
                        <div className="text-xs text-neutral-400 mt-1">
                          {schoolCareer.duration_years} años
                        </div>
                      )}
                      
                      {schoolCareer.modality && (
                        <div className="text-xs text-neutral-400 mt-1 capitalize">
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
  )
}