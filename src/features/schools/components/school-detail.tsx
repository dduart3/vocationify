import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { IconArrowLeft, IconBuilding, IconPhone, IconMail, IconWorld, IconCalendar, IconUsers, IconBookmark, IconBookmarkFilled, IconSchool, IconClock, IconMapPin } from '@tabler/icons-react'
import { SchoolMap } from './school-map'
import { useSchoolWithCareers } from '../hooks/use-schools'

interface SchoolDetailProps {
  schoolId: string
}

export function SchoolDetail({ schoolId }: SchoolDetailProps) {
  const { data: school, isLoading, error } = useSchoolWithCareers(schoolId)
  const [isFavorite, setIsFavorite] = useState(false)

  const getTypeColor = (type: string) => {
    return type === 'public' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200'
  }

  const getTypeDisplayName = (type: string) => {
    return type === 'public' ? 'Pública' : 'Privada'
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

  if (error || !school) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <IconBuilding className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Institución no encontrada</h3>
          <p className="text-gray-600 mb-6">La institución que buscas no existe o ha sido eliminada.</p>
          <Link
            to="/schools"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
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
          className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        >
          <IconArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {school.logo_url && (
              <img
                src={school.logo_url}
                alt={`Logo de ${school.name}`}
                className="w-16 h-16 object-contain rounded-lg border border-gray-200"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
              <p className="text-gray-600 mt-1">Información detallada de la institución</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        >
          {isFavorite ? (
            <IconBookmarkFilled className="w-5 h-5 text-pink-500" />
          ) : (
            <IconBookmark className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* School Details */}
        <div className="lg:col-span-2 space-y-6">

          {/* Address */}
          {school.address && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Dirección</h2>
              <p className="text-gray-700 leading-relaxed">
                {school.address}
              </p>
            </div>
          )}

          {/* Location */}
          {school.location && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <IconMapPin className="w-5 h-5 text-gray-400" />
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
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Información General</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <IconUsers className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <span className={`inline-block px-2 py-1 rounded border text-sm font-medium ${getTypeColor(school.type)}`}>
                    {getTypeDisplayName(school.type)}
                  </span>
                </div>
              </div>
              

            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contacto</h2>
            <div className="space-y-3">
              {school.phone_number && (
                <div className="flex items-center gap-3">
                  <IconPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 text-sm">{school.phone_number}</span>
                </div>
              )}
              
              {school.email && (
                <div className="flex items-center gap-3">
                  <IconMail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 text-sm">{school.email}</span>
                </div>
              )}
              
              {school.website_url && (
                <div className="flex items-center gap-3">
                  <IconWorld className="w-4 h-4 text-gray-400" />
                  <a 
                    href={school.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 text-sm font-medium rounded-lg border border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <IconWorld className="w-3 h-3" />
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
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Carreras Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {school.careers.map((schoolCareer, index) => (
              <div key={index} className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconSchool className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/careers/$careerId"
                      params={{ careerId: schoolCareer.career.id }}
                      className="font-semibold text-gray-900 text-sm leading-tight hover:text-blue-600 transition-colors"
                    >
                      {schoolCareer.career.name}
                    </Link>
                    
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
                    
                    {schoolCareer.duration_years && (
                      <div className="text-xs text-gray-500 mt-1">
                        {schoolCareer.duration_years} años
                      </div>
                    )}
                    
                    {schoolCareer.modality && (
                      <div className="text-xs text-gray-500 mt-1 capitalize">
                        {schoolCareer.modality}
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