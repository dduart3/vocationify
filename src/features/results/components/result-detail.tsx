import { Link, useParams } from '@tanstack/react-router'
import { IconArrowLeft, IconBrain, IconTrophy, IconUser, IconTarget, IconExternalLink, IconChartBar } from '@tabler/icons-react'
import { useResultDetail } from '../hooks/use-results'
import { GlassmorphismSkeleton } from '@/components/ui/glassmorphism-loader'
import { PDFExport } from '../components/pdf-export'
import { RiasecRadarChart } from '../components/riasec-radar-chart'
import { Shimmer } from '@/components/ai-elements/shimmer'
import { OnboardingProvider, resultDetailSteps } from '@/features/onboarding'

export function ResultDetail() {
  const { sessionId } = useParams({ from: '/_authenticated/results/$sessionId' })
  const { data: result, isLoading, error } = useResultDetail(sessionId)

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
      'R': 'bg-green-100 text-green-700 border border-green-300',
      'I': 'bg-blue-100 text-blue-700 border border-blue-300',
      'A': 'bg-purple-100 text-purple-700 border border-purple-300',
      'S': 'bg-orange-100 text-orange-700 border border-orange-300',
      'E': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
      'C': 'bg-cyan-100 text-cyan-700 border border-cyan-300'
    }
    return colors[type] || 'bg-cyan-100 text-cyan-700 border border-cyan-300'
  }

  const getRiasecTextColor = (type: string) => {
    const colors: Record<string, string> = {
      'R': 'text-green-700',
      'I': 'text-blue-700',
      'A': 'text-purple-700',
      'S': 'text-orange-700',
      'E': 'text-yellow-700',
      'C': 'text-cyan-700'
    }
    return colors[type] || 'text-cyan-700'
  }

  const getRiasecBarClasses = (type: string, isFilled: boolean) => {
    if (!isFilled) {
      const bases: Record<string, string> = {
        'R': 'bg-green-100/60',
        'I': 'bg-blue-100/60',
        'A': 'bg-purple-100/60',
        'S': 'bg-orange-100/60',
        'E': 'bg-yellow-100/60',
        'C': 'bg-cyan-100/60'
      }
      return bases[type] || 'bg-slate-100/60'
    }
    const fills: Record<string, string> = {
      'R': 'bg-gradient-to-t from-green-500 to-emerald-400 shadow-[0_2px_4px_rgba(34,197,94,0.2)]',
      'I': 'bg-gradient-to-t from-blue-500 to-sky-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]',
      'A': 'bg-gradient-to-t from-purple-500 to-fuchsia-400 shadow-[0_2px_4px_rgba(168,85,247,0.2)]',
      'S': 'bg-gradient-to-t from-orange-500 to-amber-400 shadow-[0_2px_4px_rgba(249,115,22,0.2)]',
      'E': 'bg-gradient-to-t from-yellow-500 to-amber-400 shadow-[0_2px_4px_rgba(234,179,8,0.2)]',
      'C': 'bg-gradient-to-t from-cyan-500 to-teal-400 shadow-[0_2px_4px_rgba(6,182,212,0.2)]'
    }
    return fills[type] || 'bg-gradient-to-t from-slate-500 to-slate-400 shadow-sm'
  }

  const getRiasecTextGradient = (type: string) => {
    const gradients: Record<string, string> = {
      'R': 'from-green-500 to-emerald-400',
      'I': 'from-blue-600 to-sky-400',
      'A': 'from-purple-600 to-fuchsia-400',
      'S': 'from-orange-500 to-amber-400',
      'E': 'from-yellow-500 to-amber-400',
      'C': 'from-cyan-500 to-teal-400'
    }
    return gradients[type] || 'from-slate-600 to-slate-400'
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
      <div className="max-w-7xl mx-auto space-y-6">
        <GlassmorphismSkeleton count={1} height="h-16" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassmorphismSkeleton count={4} height="h-20" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GlassmorphismSkeleton count={2} height="h-80" />
          <GlassmorphismSkeleton count={2} height="h-80" />
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="flex-1 min-h-screen relative overflow-hidden">
        {/* Beautiful background similar to vocational test */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div 
            className="text-center p-8 rounded-3xl backdrop-blur-xl max-w-md w-full"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.08) 0%, 
                  rgba(255, 255, 255, 0.04) 100%
                )
              `,
              boxShadow: `
                0 8px 32px 0 rgba(31, 38, 135, 0.37),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `
            }}
          >
            <IconBrain className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Resultado no encontrado</h3>
            <p className="text-white/70 mb-8 leading-relaxed">
              El resultado que buscas no existe o ha sido eliminado.
            </p>
            <Link
              to="/results"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <IconArrowLeft className="w-4 h-4" />
              Volver a resultados
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const topTypes = getTopRiasecTypes(result.riasec_scores)

  return (
    <OnboardingProvider section="result-detail" steps={resultDetailSteps}>
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
        <div className="relative z-10 w-full min-h-screen flex flex-col pt-6 sm:pt-6 lg:h-screen lg:max-h-screen lg:overflow-hidden md:pl-[104px]">
          <div className="flex-1 flex flex-col min-h-0 pt-6 sm:pt-8 lg:pt-10">

            {/* Header */}
            <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shrink-0" id="result-detail-content">
              <div className="flex items-center gap-5 sm:gap-6">
                <Link
                  to="/results"
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
                      Resultado del Test Vocacional
                    </Shimmer>
                  </h1>
                  <p className="text-slate-500 text-[13px] sm:text-[14px] font-medium mt-1">
                    Completado el {formatDate(result.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto sm:ml-0">
                {/* PDF Export Button */}
                <div id="export-pdf-button" className="transition-transform duration-300 hover:scale-105 active:scale-95">
                  <PDFExport
                    testResult={result}
                    fileName="resultado-test-vocacional"
                    title="Mi Resultado del Test Vocacional - Vocationify"
                  />
                </div>

                {/* Status Badge */}
                <div className="px-3.5 py-1.5 bg-gradient-to-b from-green-50 to-green-100 border border-green-200 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_4px_rgba(34,197,94,0.1)] rounded-full text-green-700 text-xs sm:text-sm font-bold whitespace-nowrap">
                  {getStatusDisplayName(result.status)}
                </div>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div 
              className="relative flex-1 min-h-0 w-full flex flex-col overflow-hidden"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent, black 24px, black calc(100% - 24px), transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 24px, black calc(100% - 24px), transparent)'
              }}
            >
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
              <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.5); }
              `}</style>
              
              {/* Top Row - Key Metrics */}
              {/* Top Row - Key Metrics Grouped */}
              <div className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_15px_rgba(0,0,0,0.03)] rounded-[24px] p-5 sm:p-6 mb-5 sm:mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 md:divide-x divide-slate-200/50">
                  
                  {/* Top RIASEC Type */}
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] border border-slate-300 flex items-center justify-center shrink-0">
                        <IconUser className="w-4 h-4 text-slate-500 drop-shadow-sm" />
                      </div>
                      <span className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">Tipo Principal</span>
                    </div>
                    <div className="flex flex-col items-start mt-auto">
                      <div className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] ${getRiasecColor(topTypes[0]?.type || '')}`}>
                        {topTypes[0]?.name || 'N/A'}
                      </div>
                      <div className="text-[15px] text-slate-600 font-medium mt-3 tracking-tight">
                        <span className={getRiasecTextColor(topTypes[0]?.type || '')}>{topTypes[0]?.score || 0}%</span> de compatibilidad
                      </div>
                    </div>
                  </div>

                  {/* Secondary Type */}
                  <div className="flex flex-col justify-between h-full md:pl-6 lg:pl-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] border border-slate-300 flex items-center justify-center shrink-0">
                        <IconTarget className="w-4 h-4 text-slate-500 drop-shadow-sm" />
                      </div>
                      <span className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">Tipo Secundario</span>
                    </div>
                    <div className="flex flex-col items-start mt-auto">
                      <div className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] ${getRiasecColor(topTypes[1]?.type || '')}`}>
                        {topTypes[1]?.name || 'N/A'}
                      </div>
                      <div className="text-[15px] text-slate-600 font-medium mt-3 tracking-tight">
                        <span className={getRiasecTextColor(topTypes[1]?.type || '')}>{topTypes[1]?.score || 0}%</span> de compatibilidad
                      </div>
                    </div>
                  </div>

                  {/* Test Type */}
                  <div className="flex flex-col justify-between h-full lg:pl-8 pt-6 md:pt-0 border-t md:border-none border-slate-200/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] border border-slate-300 flex items-center justify-center shrink-0">
                        <IconBrain className="w-4 h-4 text-slate-500 drop-shadow-sm" />
                      </div>
                      <span className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">Tipo de Test</span>
                    </div>
                    <div className="flex flex-col mt-auto">
                      <div className="text-lg sm:text-xl font-bold text-blue-600 capitalize tracking-tight">
                        {result.session_type || 'Conversacional'}
                      </div>
                      <div className="text-[13px] text-slate-500 font-medium mt-1">Metodología RIASEC</div>
                    </div>
                  </div>

                  {/* Confidence Level with Pill Bars */}
                  <div className="flex flex-col justify-between h-full md:pl-6 lg:pl-8 pt-6 lg:pt-0 border-t lg:border-none border-slate-200/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] border border-slate-300 flex items-center justify-center shrink-0">
                        <IconTrophy className="w-4 h-4 text-slate-500 drop-shadow-sm" />
                      </div>
                      <span className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">Confianza</span>
                    </div>
                    <div className="flex flex-col mt-auto w-full">
                      <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent drop-shadow-sm leading-tight pb-1 pr-1">
                          {result.confidence_level || 95}%
                        </span>
                      </div>
                      <div className="w-full flex gap-[4px] h-6 items-end opacity-90 mt-1">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const threshold = (i / 30) * 100
                          const isFilled = threshold < (result.confidence_level || 95)
                          return (
                            <div 
                              key={i} 
                              className={`flex-1 rounded-full transition-all duration-300 ${
                                isFilled 
                                  ? 'h-full bg-gradient-to-t from-blue-600 to-sky-400 shadow-[0_2px_4px_rgba(59,130,246,0.2)]' 
                                  : 'h-[30%] bg-blue-100/50'
                              }`} 
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Main Content - Multi Column Layout */}
              <div className="flex flex-col gap-5 sm:gap-6 pb-4">
                
                {/* Top Section: Radar Chart and Recommendations */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6">
                
                {/* Left Column - Core Analysis (Takes less space to leave room for recommendations) */}
                <div className="xl:col-span-5 flex flex-col gap-5 sm:gap-6">
                  
                  {/* RIASEC Radar Chart */}
                  <div id="riasec-chart" className="flex flex-col bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 h-full min-h-[400px]">
                    <h2 className="text-[18px] font-bold text-slate-800 mb-6 flex items-center gap-2 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-b from-blue-50 to-blue-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(59,130,246,0.4)] border border-blue-300 flex items-center justify-center shrink-0">
                        <IconBrain className="w-4 h-4 text-blue-600 drop-shadow-sm" />
                      </div>
                      Visualización del Perfil
                    </h2>
                    <div className="flex-1 flex justify-center items-center h-full min-h-[300px]">
                      <RiasecRadarChart scores={result.riasec_scores} size={300} />
                    </div>
                  </div>

                  {/* Detailed Scores (Moved to Bottom) */}

                </div>

                {/* Right Column - Recommendations & Details */}
                <div className="xl:col-span-7 flex flex-col gap-5 sm:gap-6">
                  
                  {/* Career Recommendations - Always show */}
                  <div id="career-recommendations" className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 flex-1">
                    <h2 className="text-[18px] font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-50 to-amber-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(245,158,11,0.4)] border border-amber-300 flex items-center justify-center shrink-0">
                        <IconTrophy className="w-4 h-4 text-amber-600 drop-shadow-sm" />
                      </div>
                      Carreras Recomendadas
                    </h2>
                    {result.career_recommendations && result.career_recommendations.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {result.career_recommendations.map((career: any, index: number) => {
                          const score = career.confidence || 0;
                          const getStrokeColor = (s: number) => {
                            if (s >= 85) return 'text-green-500'
                            if (s >= 70) return 'text-amber-400'
                            return 'text-orange-400'
                          }
                          const getRankStyle = () => {
                            return 'from-slate-100 to-slate-200 border-slate-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(148,163,184,0.4)] text-slate-800'
                          }

                          const strokeClass = getStrokeColor(score)
                          const rankClass = getRankStyle()
                          const circleRadius = 22
                          const circleCircumference = 2 * Math.PI * circleRadius
                          const strokeDasharray = `${(score / 100) * circleCircumference} ${circleCircumference}`

                          const careerContent = (
                            <div className="flex flex-col md:flex-row items-center gap-4 p-5 rounded-[20px] bg-white/60 backdrop-blur-md border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_15px_rgba(0,0,0,0.02)] hover:bg-white/80 hover:shadow-[0_8px_25px_rgba(59,130,246,0.08)] hover:-translate-y-1 transition-all duration-300 group">
                              {/* Left side Rank with 3D style */}
                              <div className="shrink-0">
                                <div className={`w-12 h-12 bg-gradient-to-b ${rankClass} rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-300 border shadow-[0_2px_5px_rgba(0,0,0,0.1)]`}>
                                  {index + 1}
                                </div>
                              </div>

                              {/* Middle Content */}
                              <div className="flex-1 min-w-0 flex flex-col items-center md:items-start text-center md:text-left py-1">
                                <h4 className="font-bold text-slate-800 text-[16px] leading-tight mb-2 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                  {career.career_name || 'Carrera sin nombre'}
                                  {career.career_id && (
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-b from-blue-50 to-blue-100 shadow-[0_2px_5px_rgba(59,130,246,0.15),inset_0_-1px_2px_rgba(59,130,246,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-blue-200/80 flex items-center justify-center">
                                      <IconExternalLink className="w-3 h-3 text-blue-600 drop-shadow-sm" />
                                    </div>
                                  )}
                                </h4>
                                {career.reasoning && (
                                  <p className="text-slate-500 text-[13.5px] leading-relaxed font-medium">
                                    {career.reasoning}
                                  </p>
                                )}
                              </div>

                              {/* Right side Pie Chart with 3D style */}
                              <div className="shrink-0 relative w-[56px] h-[56px] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white to-slate-50 shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] border border-slate-200/80"></div>
                                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm relative z-10" viewBox="0 0 56 56">
                                  <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4.5" fill="transparent" className="text-slate-100" />
                                  <circle 
                                    cx="28" cy="28" r="22" 
                                    stroke="currentColor" strokeWidth="4.5" fill="transparent" 
                                    strokeDasharray={strokeDasharray} 
                                    className={strokeClass} 
                                    strokeLinecap="round" 
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col z-20">
                                  <span className={`text-xs font-bold ${strokeClass} drop-shadow-sm leading-none`}>
                                    {score}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          )

                          return career.career_id ? (
                            <Link
                              key={index}
                              to="/careers/$careerId"
                              params={{ careerId: String(career.career_id) }}
                              className="block"
                            >
                              {careerContent}
                            </Link>
                          ) : (
                            <div key={index}>
                              {careerContent}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-slate-50 to-slate-100 shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_-2px_4px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,1)] border border-slate-200/80 flex items-center justify-center mb-4">
                          <IconTrophy className="w-8 h-8 text-slate-400 drop-shadow-sm" />
                        </div>
                        <p className="text-slate-500 text-[15px] font-medium mb-2">No hay carreras recomendadas disponibles</p>
                        <p className="text-slate-400 text-[13px]">Completa el test vocacional para recibir recomendaciones personalizadas</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Full Width Section */}
              <div className="flex flex-col gap-5 sm:gap-6">
                
                {/* Detailed Scores */}
                <div id="riasec-scores-breakdown" className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
                  <h2 className="text-[18px] font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-b from-purple-50 to-purple-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(168,85,247,0.4)] border border-purple-300 flex items-center justify-center shrink-0">
                       <IconChartBar className="w-4 h-4 text-purple-600 drop-shadow-sm" />
                     </div>
                     Puntuaciones Detalladas
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-6">
                    {Object.entries(result.riasec_scores).map(([type, score]) => (
                      <div key={type} className="flex flex-col gap-1.5">
                        <div className="flex items-end justify-between mb-1">
                          <span className="text-[14.5px] font-bold text-slate-600 mb-0.5">{getRiasecDisplayName(type)}</span>
                          <span className={`text-[25px] font-black bg-gradient-to-r ${getRiasecTextGradient(type)} bg-clip-text text-transparent leading-tight drop-shadow-sm pb-1 pr-0.5`}>
                            {score as number}%
                          </span>
                        </div>
                        <div className="w-full flex gap-[4.5px] h-[16px] items-end opacity-90 mt-1">
                          {Array.from({ length: 30 }).map((_, i) => {
                            const threshold = (i / 30) * 100
                            const isFilled = threshold < (score as number)
                            return (
                              <div 
                                key={i} 
                                className={`flex-[1_1_0%] rounded-full transition-all duration-300 ${isFilled ? 'h-full ' + getRiasecBarClasses(type, true) : 'h-[30%] ' + getRiasecBarClasses(type, false)}`} 
                              />
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personality Description */}
                  {result.personality_description && (
                    <div className="bg-white/50 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[24px] p-6 lg:p-8 shrink-0">
                      <h2 className="text-[18px] font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-b from-indigo-50 to-indigo-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_6px_rgba(99,102,241,0.4)] border border-indigo-300 flex items-center justify-center shrink-0">
                           <IconUser className="w-4 h-4 text-indigo-600 drop-shadow-sm" />
                        </div>
                        Descripción de Personalidad
                      </h2>
                      <p className="text-slate-600 leading-relaxed text-[14px] font-medium">{result.personality_description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

        </div>
      </div>
      </div>
      </div>
      </div>
    </OnboardingProvider>
  )
}