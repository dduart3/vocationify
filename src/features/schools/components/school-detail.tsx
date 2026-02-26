import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { IconArrowLeft, IconBuilding, IconPhone, IconMail, IconWorld, IconUsers, IconBookmark, IconBookmarkFilled, IconSchool, IconClock, IconMapPin, IconTarget } from '@tabler/icons-react'
import { SchoolMap } from './school-map'
import { useSchoolWithCareers } from '../hooks/use-schools'
import { useAuth } from '@/context/auth-context'
import { calculateDistance, formatDistance } from '@/utils/distance'
import { OnboardingProvider, schoolDetailSteps } from '@/features/onboarding'
import { Shimmer } from '@/components/ai-elements/shimmer'

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
      <div className="flex-1 min-h-[100dvh] w-full relative flex flex-col bg-[#f8fafc] overflow-hidden">
        <div className="relative z-10 w-full min-h-screen flex flex-col pt-6 sm:pt-8 lg:pt-10 pb-24">
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-white/50 backdrop-blur-xl border border-white/60 rounded-[24px] h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !school) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-b from-red-50 to-red-100 shadow-[0_4px_10px_rgba(239,68,68,0.15),inset_0_-2px_4px_rgba(239,68,68,0.06),inset_0_2px_4px_rgba(255,255,255,1)] border border-red-200/80 flex items-center justify-center">
            <IconBuilding className="w-8 h-8 text-red-600 drop-shadow-sm" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Institución no encontrada</h3>
          <p className="text-gray-600 mb-6">La institución que buscas no existe o ha sido eliminada.</p>
          <Link
            to="/schools"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] text-gray-900 rounded-full transition-all duration-200 hover:scale-105 hover:-translate-y-[1px]"
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
      <div className="flex-1 min-h-[100dvh] w-full relative flex flex-col bg-[#f8fafc] overflow-hidden">
        {/* Background with gradient matching career-detail */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#f8fafc]">
          <div 
            className="absolute inset-x-0 bottom-0 h-full opacity-100" 
            style={{
              background: 'linear-gradient(120deg, #fed7aa 0%, #fbcfe8 45%, #bae6fd 100%)',
              maskImage: 'linear-gradient(to top, black 10%, transparent 65%)',
              WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 65%)'
            }}
          />
          <div 
            className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '120px 120px',
            }}
          />
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[95vh] bg-[#f8fafc] rounded-[50%] blur-[70px]" />
          <div className="absolute -top-[5%] left-1/2 -translate-x-1/2 w-[70vw] h-[90vh] bg-[#f8fafc] rounded-[50%] blur-[40px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55vw] h-[85vh] bg-[#f8fafc] rounded-[50%] blur-[20px]" />
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 opacity-60" />
          <div className="absolute bottom-0 inset-x-0 h-[8px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 blur-[4px] opacity-40" />
        </div>

        {/* Inner Structure */}
        <div className="relative z-10 w-full h-screen flex flex-col overflow-hidden">
          {/* Header - Fixed outside scrollable container */}
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-6 shrink-0" id="school-detail-header">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-5 sm:gap-6">
                <Link
                  to="/schools"
                  className="w-[42px] h-[42px] bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] text-slate-700 rounded-full flex items-center justify-center group-hover:scale-110 hover:-translate-y-[1px] transition-all duration-300 flex-shrink-0 group"
                >
                  <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-[2px] transition-transform duration-300" />
                </Link>
                <div className="flex items-center gap-4">
                  {school.logo_url && (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-b from-white to-slate-50 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_-2px_4px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,1)] border border-slate-200/80 p-2 flex-shrink-0">
                      <img
                        src={school.logo_url}
                        alt={`Logo de ${school.name}`}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight pb-1 md:pb-2">
                      <Shimmer
                        as="span"
                        duration={3}
                        spread={1.5}
                        className="font-black [--color-muted-foreground:theme(colors.blue.400)] [--color-background:theme(colors.white)] drop-shadow-sm"
                      >
                        {school.name}
                      </Shimmer>
                    </h1>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <p className="text-slate-500 text-[14px] font-medium">Información detallada de la institución</p>
                      {distanceFromUser !== null && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-b from-blue-50 to-blue-100 shadow-[0_2px_5px_rgba(59,130,246,0.15),inset_0_-1px_2px_rgba(59,130,246,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-blue-200/80 rounded-full">
                          <IconTarget className="w-3.5 h-3.5 text-blue-600 drop-shadow-sm" />
                          <span className="text-blue-700 font-bold text-[12px]">
                            {formatDistance(distanceFromUser)} de tu ubicación
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto sm:ml-0">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="w-[42px] h-[42px] bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] text-slate-700 rounded-full flex items-center justify-center group-hover:scale-110 hover:-translate-y-[1px] transition-all duration-300 flex-shrink-0 group"
                >
                  {isFavorite ? (
                    <IconBookmarkFilled className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <IconBookmark className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area with masked blur */}
          <div 
            className="relative flex-1 min-h-0 w-full overflow-y-auto custom-scrollbar"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)'
            }}
          >
            <style>{`
              .custom-scrollbar::-webkit-scrollbar { width: 6px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.5); }
            `}</style>
            
            {/* Main Content Area */}
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
            {/* Main Info */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 mb-8">
              {/* School Details */}
              <div className="xl:col-span-8 flex flex-col gap-5 sm:gap-6 xl:[&>div:last-child]:flex-1">
                {/* Address */}
                {school.address && (
                  <div className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
                    <h2 className="text-[18px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-b from-blue-50 to-blue-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(59,130,246,0.4)] border border-blue-300 flex items-center justify-center shrink-0">
                        <IconMapPin className="w-4 h-4 text-blue-600 drop-shadow-sm" />
                      </div>
                      Dirección
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-[14px] font-medium">
                      {school.address}
                    </p>
                  </div>
                )}

                {/* Location */}
                {school.location && (
                  <div id="school-location-map" className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 flex-1 flex flex-col">
                    <h2 className="text-[18px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-b from-green-50 to-green-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(34,197,94,0.4)] border border-green-300 flex items-center justify-center shrink-0">
                        <IconMapPin className="w-4 h-4 text-green-600 drop-shadow-sm" />
                      </div>
                      Ubicación
                    </h2>
                    <div className="h-96 w-full rounded-[20px] overflow-hidden border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex-1">
                      <SchoolMap
                        latitude={school.location.latitude}
                        longitude={school.location.longitude}
                        schoolName={school.name}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-4 flex flex-col gap-5 sm:gap-6 xl:[&>div:last-child]:flex-1">
                {/* Quick Info */}
                <div className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
                  <h2 className="text-[18px] font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] border border-slate-300 flex items-center justify-center shrink-0">
                      <IconBuilding className="w-4 h-4 text-slate-600 drop-shadow-sm" />
                    </div>
                    Información General
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-b from-purple-50 to-purple-100 shadow-[0_2px_5px_rgba(168,85,247,0.15),inset_0_-1px_2px_rgba(168,85,247,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-purple-200/80 flex items-center justify-center shrink-0">
                        <IconUsers className="w-4 h-4 text-purple-600 drop-shadow-sm" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">Tipo</span>
                        <span className={`inline-block px-3 py-1.5 rounded-full text-[13px] font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] mt-1 ${getTypeColor(school.type)}`}>
                          {getTypeDisplayName(school.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info - Same height as Location card */}
                <div className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 flex-1 flex flex-col">
                  <h2 className="text-[18px] font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-b from-cyan-50 to-cyan-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(6,182,212,0.4)] border border-cyan-300 flex items-center justify-center shrink-0">
                      <IconPhone className="w-4 h-4 text-cyan-600 drop-shadow-sm" />
                    </div>
                    Contacto
                  </h2>
                  <div className="space-y-4 flex-1 flex flex-col justify-start">
                    {school.phone_number && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-b from-blue-50 to-blue-100 shadow-[0_2px_5px_rgba(59,130,246,0.15),inset_0_-1px_2px_rgba(59,130,246,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-blue-200/80 flex items-center justify-center shrink-0">
                          <IconPhone className="w-4 h-4 text-blue-600 drop-shadow-sm" />
                        </div>
                        <span className="text-slate-700 text-[14px] font-medium">{school.phone_number}</span>
                      </div>
                    )}

                    {school.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-b from-pink-50 to-pink-100 shadow-[0_2px_5px_rgba(236,72,153,0.15),inset_0_-1px_2px_rgba(236,72,153,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-pink-200/80 flex items-center justify-center shrink-0">
                          <IconMail className="w-4 h-4 text-pink-600 drop-shadow-sm" />
                        </div>
                        <span className="text-slate-700 text-[14px] font-medium break-all">{school.email}</span>
                      </div>
                    )}

                    {school.website_url && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-b from-indigo-50 to-indigo-100 shadow-[0_2px_5px_rgba(99,102,241,0.15),inset_0_-1px_2px_rgba(99,102,241,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-indigo-200/80 flex items-center justify-center shrink-0">
                          <IconWorld className="w-4 h-4 text-indigo-600 drop-shadow-sm" />
                        </div>
                        <a
                          href={school.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-[14px] font-medium transition-colors duration-200 underline decoration-2 underline-offset-2"
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
              <div id="school-careers-offered" className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
                <h2 className="text-[18px] font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-50 to-amber-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(245,158,11,0.4)] border border-amber-300 flex items-center justify-center shrink-0">
                    <IconSchool className="w-4 h-4 text-amber-600 drop-shadow-sm" />
                  </div>
                  Carreras Disponibles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {school.careers.map((schoolCareer, index) => (
                    <Link key={index} to="/careers/$careerId" params={{ careerId: schoolCareer.career.id }}>
                      <div className="relative h-full bg-gradient-to-br from-blue-50/80 via-sky-50/70 to-blue-50/80 backdrop-blur-md border border-blue-200/60 shadow-[0_4px_15px_rgba(59,130,246,0.12),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(59,130,246,0.05)] rounded-[20px] p-6 hover:from-blue-50/90 hover:via-sky-50/80 hover:to-blue-50/90 hover:border-blue-300/70 hover:shadow-[0_8px_25px_rgba(59,130,246,0.2),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(59,130,246,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                        {/* Tooltip with 3D depth style - White theme */}
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 ease-out group-hover:translate-y-0 translate-y-2">
                          <div className="bg-gradient-to-br from-white/95 via-slate-50/90 to-white/95 backdrop-blur-xl border-2 border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.05)] rounded-[12px] px-4 py-2.5 relative">
                            {/* Arrow pointing down */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-200/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"></div>
                            </div>
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-white/40 to-transparent opacity-60 pointer-events-none"></div>
                            <p className="text-slate-800 font-bold text-[13px] leading-tight whitespace-nowrap relative z-10">
                              {schoolCareer.career.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col h-full">
                          {/* Icon and Title Section */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300 shadow-[0_3px_10px_rgba(59,130,246,0.25),inset_0_-2px_4px_rgba(37,99,235,0.15),inset_0_2px_4px_rgba(255,255,255,0.8)] border-2 border-blue-300/60 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_5px_15px_rgba(59,130,246,0.35),inset_0_-2px_4px_rgba(37,99,235,0.2),inset_0_2px_4px_rgba(255,255,255,1)] transition-all duration-300 relative">
                              {/* Inner glow effect */}
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-60"></div>
                              <IconSchool className="w-5 h-5 text-blue-700 drop-shadow-[0_2px_4px_rgba(37,99,235,0.3)] relative z-10" />
                            </div>
                            <div className="min-w-0 flex-1 pt-1">
                              <h3 className="font-bold text-blue-700 text-[15px] leading-tight group-hover:text-blue-800 transition-colors line-clamp-2">
                                {schoolCareer.career.name}
                              </h3>
                            </div>
                          </div>

                          {/* Shifts Section */}
                          {schoolCareer.shifts && schoolCareer.shifts.length > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-b from-blue-100 to-blue-200 shadow-[0_2px_5px_rgba(59,130,246,0.2),inset_0_-1px_2px_rgba(37,99,235,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-blue-300/60 flex items-center justify-center flex-shrink-0">
                                <IconClock className="w-3.5 h-3.5 text-blue-600 drop-shadow-sm" />
                              </div>
                              <div className="flex flex-wrap gap-1.5 flex-1">
                                {Array.isArray(schoolCareer.shifts)
                                  ? schoolCareer.shifts.map((shift, idx) => (
                                      <span key={idx} className="text-[12px] text-blue-800 bg-gradient-to-b from-blue-100/90 to-blue-200/80 shadow-[0_2px_5px_rgba(59,130,246,0.15),inset_0_-1px_2px_rgba(37,99,235,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-blue-300/60 px-2.5 py-1 rounded-full font-bold">
                                        {shift}
                                      </span>
                                    ))
                                  : <span className="text-[12px] text-blue-800 bg-gradient-to-b from-blue-100/90 to-blue-200/80 shadow-[0_2px_5px_rgba(59,130,246,0.15),inset_0_-1px_2px_rgba(37,99,235,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-blue-300/60 px-2.5 py-1 rounded-full font-bold">
                                      {schoolCareer.shifts}
                                    </span>
                                }
                              </div>
                            </div>
                          )}

                          {/* Additional Info */}
                          <div className="mt-auto pt-3 space-y-1.5 border-t border-blue-200/50">
                            {schoolCareer.duration_years && (
                              <div className="text-[12px] text-blue-700 font-medium">
                                Duración: {schoolCareer.duration_years} años
                              </div>
                            )}

                            {schoolCareer.modality && (
                              <div className="text-[12px] text-blue-700 font-medium capitalize">
                                Modalidad: {schoolCareer.modality}
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
        </div>
      </div>
      </div>
    </OnboardingProvider>
  )
}