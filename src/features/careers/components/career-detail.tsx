import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { IconArrowLeft, IconSchool, IconTarget, IconClock, IconBookmark, IconBookmarkFilled, IconMapPin, IconBuilding, IconChartBar } from '@tabler/icons-react'
import { useCareerWithSchools } from '../hooks/use-careers'
import { useAuth } from '@/context/auth-context'
import { calculateDistance, formatDistance } from '@/utils/distance'
import { OnboardingProvider, careerDetailSteps } from '@/features/onboarding'
import { Shimmer } from '@/components/ai-elements/shimmer'

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



  const getRiasecBarClasses = (type: string, isFilled: boolean) => {
    if (!isFilled) {
      const bases: Record<string, string> = {
        'realistic': 'bg-green-100/60',
        'investigative': 'bg-blue-100/60',
        'artistic': 'bg-purple-100/60',
        'social': 'bg-orange-100/60',
        'enterprising': 'bg-yellow-100/60',
        'conventional': 'bg-cyan-100/60'
      }
      return bases[type.toLowerCase()] || 'bg-slate-100/60'
    }
    const fills: Record<string, string> = {
      'realistic': 'bg-gradient-to-t from-green-500 to-emerald-400 shadow-[0_2px_4px_rgba(34,197,94,0.2)]',
      'investigative': 'bg-gradient-to-t from-blue-500 to-sky-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]',
      'artistic': 'bg-gradient-to-t from-purple-500 to-fuchsia-400 shadow-[0_2px_4px_rgba(168,85,247,0.2)]',
      'social': 'bg-gradient-to-t from-orange-500 to-amber-400 shadow-[0_2px_4px_rgba(249,115,22,0.2)]',
      'enterprising': 'bg-gradient-to-t from-yellow-500 to-amber-400 shadow-[0_2px_4px_rgba(234,179,8,0.2)]',
      'conventional': 'bg-gradient-to-t from-cyan-500 to-teal-400 shadow-[0_2px_4px_rgba(6,182,212,0.2)]'
    }
    return fills[type.toLowerCase()] || 'bg-gradient-to-t from-slate-500 to-slate-400 shadow-sm'
  }

  const getRiasecTextGradient = (type: string) => {
    const gradients: Record<string, string> = {
      'realistic': 'from-green-500 to-emerald-400',
      'investigative': 'from-blue-600 to-sky-400',
      'artistic': 'from-purple-600 to-fuchsia-400',
      'social': 'from-orange-500 to-amber-400',
      'enterprising': 'from-yellow-500 to-amber-400',
      'conventional': 'from-cyan-500 to-teal-400'
    }
    return gradients[type.toLowerCase()] || 'from-slate-600 to-slate-400'
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
    <OnboardingProvider section="career-detail" steps={careerDetailSteps}>
      <div className="flex-1 min-h-[100dvh] w-full relative flex flex-col bg-[#f8fafc] overflow-hidden">
        {/* Exact Sandra AI Background Match */}
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
        <div className="relative z-10 w-full min-h-screen flex flex-col pt-6 sm:pt-8 lg:pt-10 pb-24">

            {/* Header */}
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 shrink-0" id="career-detail-header">
              <div className="flex items-center gap-5 sm:gap-6">
                <Link
                  to="/careers"
                  className="w-[42px] h-[42px] bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] text-slate-700 rounded-full flex items-center justify-center group-hover:scale-110 hover:-translate-y-[1px] transition-all duration-300 flex-shrink-0 group"
                >
                  <IconArrowLeft className="w-5 h-5 group-hover:-translate-x-[2px] transition-transform duration-300" />
                </Link>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight pb-1 md:pb-2">
                    <Shimmer
                      as="span"
                      duration={3}
                      spread={1.5}
                      className="font-black [--color-muted-foreground:theme(colors.blue.400)] [--color-background:theme(colors.white)] drop-shadow-sm"
                    >
                      {career.name}
                    </Shimmer>
                  </h1>
                  <p className="text-slate-500 text-[14px] font-medium mt-1">Información detallada de la carrera</p>
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

            {/* Main Content Area */}
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Main Info */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 mb-8">
                {/* Career Details */}
                <div className="xl:col-span-8 flex flex-col gap-5 sm:gap-6 xl:[&>div:last-child]:flex-1">
          {/* Description */}
          <div className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
            <h2 className="text-[18px] font-bold text-slate-800 mb-4 flex items-center gap-2">Descripción</h2>
            <p className="text-slate-600 leading-relaxed text-[14px] font-medium">
              {career.description}
            </p>
          </div>

          {/* Skills */}
          {career.key_skills && career.key_skills.length > 0 && (
            <div className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
              <h2 className="text-[18px] font-bold text-slate-800 mb-4 flex items-center gap-2">Habilidades Clave</h2>
              <div className="flex flex-wrap gap-2.5">
                {career.key_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-gradient-to-b from-blue-50 to-blue-100 shadow-[0_2px_5px_rgba(59,130,246,0.15),inset_0_-1px_2px_rgba(59,130,246,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-blue-200/80 rounded-full text-blue-700 text-[13px] font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Environment */}
          {career.work_environment && career.work_environment.length > 0 && (
            <div className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
              <h2 className="text-[18px] font-bold text-slate-800 mb-4 flex items-center gap-2">Ambiente de Trabajo</h2>
              <div className="flex flex-wrap gap-2.5">
                {career.work_environment.map((env, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-gradient-to-b from-purple-50 to-purple-100 shadow-[0_2px_5px_rgba(168,85,247,0.15),inset_0_-1px_2px_rgba(168,85,247,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-purple-200/80 rounded-full text-purple-700 text-[13px] font-bold"
                  >
                    {env}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Careers */}
          {career.related_careers && career.related_careers.length > 0 && (
            <div className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
              <h2 className="text-[18px] font-bold text-slate-800 mb-4 flex items-center gap-2">Carreras Relacionadas</h2>
              <div className="flex flex-wrap gap-2.5">
                {career.related_careers.map((relatedCareer, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 bg-gradient-to-b from-green-50 to-green-100 shadow-[0_2px_5px_rgba(34,197,94,0.15),inset_0_-1px_2px_rgba(34,197,94,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-green-200/80 rounded-full text-green-700 text-[13px] font-bold"
                  >
                    {relatedCareer}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-4 flex flex-col gap-5 sm:gap-6 xl:[&>div:last-child]:flex-1">
          {/* Quick Stats */}
          <div className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
            <h2 className="text-[18px] font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] border border-slate-300 flex items-center justify-center shrink-0">
                  <IconBuilding className="w-4 h-4 text-slate-600 drop-shadow-sm" />
              </div>
              Información General
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-50 to-amber-100 shadow-[0_2px_5px_rgba(245,158,11,0.15),inset_0_-1px_2px_rgba(245,158,11,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-amber-200/80 flex items-center justify-center shrink-0">
                   <IconClock className="w-4 h-4 text-amber-600 drop-shadow-sm" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">Duración</span>
                  <span className="text-[15px] font-bold text-slate-800 leading-tight">{career.duration_years} años</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIASEC Profile */}
          <div id="career-riasec-match" className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
            <h2 className="text-[18px] font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-purple-50 to-purple-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(168,85,247,0.4)] border border-purple-300 flex items-center justify-center shrink-0">
                  <IconChartBar className="w-4 h-4 text-purple-600 drop-shadow-sm" />
              </div>
              Perfil RIASEC
            </h2>
            
            <div className={`flex items-center justify-center gap-4 sm:gap-8 mb-6`}>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 shadow-[0_2px_5px_rgba(148,163,184,0.15),inset_0_1px_2px_rgba(255,255,255,1)] border border-slate-200/80 flex items-center justify-center shrink-0">
                    <IconTarget className="w-3 h-3 text-slate-500 drop-shadow-sm" />
                  </div>
                  <span className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">Principal</span>
                </div>
                <div className={`inline-flex items-center justify-center min-w-[105px] px-3 py-1 rounded-full text-[11.5px] font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] ${getRiasecColor(career.primary_riasec_type)}`}>
                  {getRiasecDisplayName(career.primary_riasec_type)}
                </div>
              </div>

              {career.secondary_riasec_type && (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 shadow-[0_2px_5px_rgba(148,163,184,0.15),inset_0_1px_2px_rgba(255,255,255,1)] border border-slate-200/80 flex items-center justify-center shrink-0">
                      <IconTarget className="w-3 h-3 text-slate-500 drop-shadow-sm" />
                    </div>
                    <span className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">Secundario</span>
                  </div>
                  <div className={`inline-flex items-center justify-center min-w-[105px] px-3 py-1 rounded-full text-[11.5px] font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] ${getRiasecColor(career.secondary_riasec_type)}`}>
                    {getRiasecDisplayName(career.secondary_riasec_type)}
                  </div>
                </div>
              )}
            </div>

            {/* RIASEC Scores */}
            <div className="space-y-3">
              <h3 className="text-[13.5px] font-bold text-slate-800 mb-1">Puntuaciones detalladas:</h3>
              <div className="flex flex-col gap-2.5">
              {[
                { key: 'realistic', label: 'Realista', score: career.realistic_score },
                { key: 'investigative', label: 'Investigativo', score: career.investigative_score },
                { key: 'artistic', label: 'Artístico', score: career.artistic_score },
                { key: 'social', label: 'Social', score: career.social_score },
                { key: 'enterprising', label: 'Emprendedor', score: career.enterprising_score },
                { key: 'conventional', label: 'Convencional', score: career.conventional_score },
              ].map((item) => (
                <div key={item.key} className="flex flex-col gap-1">
                  <div className="flex items-end justify-between">
                    <span className="text-[13px] font-bold text-slate-600">{item.label}</span>
                    <span className={`text-[15px] font-black bg-gradient-to-r ${getRiasecTextGradient(item.key)} bg-clip-text text-transparent leading-none drop-shadow-sm`}>
                      {item.score}%
                    </span>
                  </div>
                  <div className="w-full flex gap-[2px] h-[8px] items-end opacity-90">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const threshold = (i / 30) * 100
                      const isFilled = threshold < item.score
                      return (
                        <div 
                          key={i} 
                          className={`flex-[1_1_0%] rounded-full transition-all duration-300 ${isFilled ? 'h-full ' + getRiasecBarClasses(item.key, true) : 'h-[40%] ' + getRiasecBarClasses(item.key, false)}`} 
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schools Section */}
      {sortedSchools && sortedSchools.length > 0 && (
        <div id="career-schools-list" className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0 mb-8 w-full block">
          <h2 className="text-[18px] font-bold text-slate-800 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-blue-50 to-blue-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(59,130,246,0.4)] border border-blue-300 flex items-center justify-center shrink-0">
                  <IconSchool className="w-4 h-4 text-blue-600 drop-shadow-sm" />
              </div>
              Dónde Estudiar
          </h2>
          {profile?.location && (
            <p className="text-[13px] text-green-700 font-bold mb-6 flex items-center gap-1.5 ml-10">
              <IconMapPin className="w-4 h-4" />
              Ordenado por distancia desde tu ubicación
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  <div className="relative h-full bg-gradient-to-br from-blue-50/80 via-sky-50/70 to-blue-50/80 backdrop-blur-md border border-blue-200/60 shadow-[0_4px_15px_rgba(59,130,246,0.12),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(59,130,246,0.05)] rounded-[20px] p-6 hover:from-blue-50/90 hover:via-sky-50/80 hover:to-blue-50/90 hover:border-blue-300/70 hover:shadow-[0_8px_25px_rgba(59,130,246,0.2),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(59,130,246,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                    {/* Tooltip with 3D depth style */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 ease-out group-hover:translate-y-0 translate-y-2">
                      <div className="bg-gradient-to-br from-white/95 via-slate-50/90 to-white/95 backdrop-blur-xl border-2 border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.05)] rounded-[12px] px-4 py-2.5 relative">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                          <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-200/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"></div>
                        </div>
                        <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-white/40 to-transparent opacity-60 pointer-events-none"></div>
                        <p className="text-slate-800 font-bold text-[13px] leading-tight whitespace-nowrap relative z-10">
                          {schoolCareer.school.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col h-full">
                      {/* Icon and Title Section */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300 shadow-[0_3px_10px_rgba(59,130,246,0.25),inset_0_-2px_4px_rgba(37,99,235,0.15),inset_0_2px_4px_rgba(255,255,255,0.8)] border-2 border-blue-300/60 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-[0_5px_15px_rgba(59,130,246,0.35),inset_0_-2px_4px_rgba(37,99,235,0.2),inset_0_2px_4px_rgba(255,255,255,1)] transition-all duration-300 relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent opacity-60"></div>
                          <IconBuilding className="w-5 h-5 text-blue-700 drop-shadow-[0_2px_4px_rgba(37,99,235,0.3)] relative z-10" />
                        </div>
                        <div className="min-w-0 flex-1 pt-1">
                          <h3 className="font-bold text-blue-700 text-[15px] leading-tight group-hover:text-blue-800 transition-colors line-clamp-2">
                            {schoolCareer.school.name}
                          </h3>
                        </div>
                      </div>

                      {/* Location */}
                      {schoolCareer.school.location?.city && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-b from-blue-100 to-blue-200 shadow-[0_2px_5px_rgba(59,130,246,0.2),inset_0_-1px_2px_rgba(37,99,235,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-blue-300/60 flex items-center justify-center flex-shrink-0">
                            <IconMapPin className="w-3.5 h-3.5 text-blue-600 drop-shadow-sm" />
                          </div>
                          <span className="text-[13px] text-blue-800 font-medium">
                            {schoolCareer.school.location.city}
                            {schoolCareer.school.location.state && `, ${schoolCareer.school.location.state}`}
                          </span>
                        </div>
                      )}

                      {/* Distance */}
                      {distance !== null && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-b from-blue-100 to-blue-200 shadow-[0_2px_5px_rgba(59,130,246,0.2),inset_0_-1px_2px_rgba(37,99,235,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-blue-300/60 flex items-center justify-center flex-shrink-0">
                            <IconTarget className="w-3.5 h-3.5 text-blue-600 drop-shadow-sm" />
                          </div>
                          <span className="text-[12px] text-blue-800 bg-gradient-to-b from-blue-100/90 to-blue-200/80 shadow-[0_2px_5px_rgba(59,130,246,0.15),inset_0_-1px_2px_rgba(37,99,235,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-blue-300/60 px-2.5 py-1 rounded-full font-bold">
                            {formatDistance(distance)} de distancia
                          </span>
                        </div>
                      )}

                      {/* Shifts Section */}
                      {schoolCareer.shifts && schoolCareer.shifts.length > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-b from-blue-100 to-blue-200 shadow-[0_2px_5px_rgba(59,130,246,0.2),inset_0_-1px_2px_rgba(37,99,235,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-blue-300/60 flex items-center justify-center flex-shrink-0">
                            <IconClock className="w-3.5 h-3.5 text-blue-600 drop-shadow-sm" />
                          </div>
                          <div className="flex flex-wrap gap-1.5 flex-1">
                            {Array.isArray(schoolCareer.shifts)
                              ? schoolCareer.shifts.map((shift: string, idx: number) => (
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
              )
            })}
          </div>
        </div>
      )}
            </div>
        </div>
      </div>
    </OnboardingProvider>
  )
}