import { useState, useEffect } from 'react'
import { ResultsTable, ResultFilters } from './components'
import { resultsColumns } from './components/results-columns'
import { useResults } from './hooks/use-results'
import { OnboardingProvider, resultsSteps } from '@/features/onboarding'
import { Shimmer } from "@/components/ai-elements/shimmer"

export function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'last_week' | 'last_month' | 'last_year'>('all')

  // Debounce search term to avoid firing queries on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch results data
  const { data: results = [], isLoading } = useResults({
    search: debouncedSearchTerm,
    date_range: dateFilter as any,
  })

  return (
    <OnboardingProvider section="results" steps={resultsSteps}>
      <div className="flex-1 min-h-[100dvh] w-full relative flex flex-col">
        {/* Fixed Ambient Background Gradient Behind Everything */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[#f8fafc]">
          <div 
            className="absolute inset-x-0 bottom-0 h-full opacity-70" 
            style={{
              background: 'linear-gradient(120deg, #fed7aa 0%, #fbcfe8 45%, #bae6fd 100%)',
              maskImage: 'linear-gradient(to top, black 10%, transparent 80%)',
              WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 80%)'
            }}
          />
          {/* Premium Fine Grain Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '120px 120px',
            }}
          />
          {/* White Ellipse from top down for contrast matching */}
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[95vh] bg-[#f8fafc] rounded-[50%] blur-[70px]" />
        </div>

        {/* Inner Structure */}
        <div className="relative z-10 w-full min-h-screen p-4 md:pl-[104px] md:pr-6 md:py-6 max-w-[1500px] mx-auto flex flex-col pt-6 sm:pt-6 lg:h-screen lg:max-h-screen lg:overflow-hidden">
          <div className="flex-1 bg-white/30 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-6 sm:p-8 lg:p-10 flex flex-col min-h-0">

          {/* Header */}
          <div id="results-header" className="mb-6 sm:mb-8 shrink-0 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-2">
              <Shimmer 
                as="span" 
                duration={3} 
                spread={1.5} 
                className="font-medium [--color-muted-foreground:theme(colors.blue.400)] [--color-background:theme(colors.white)] drop-shadow-sm"
              >
                Mis Resultados
              </Shimmer>
            </h1>
            <p className="text-[14px] sm:text-[15px] text-gray-500 font-medium">Historial de tus tests vocacionales y recomendaciones</p>
          </div>

          {/* Filters */}
          <div className="mb-5 shrink-0 z-20">
            <ResultFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
            />
          </div>

          {/* Table */}
          <div id="results-table" className="flex-1 min-h-0 flex flex-col z-10">
            <ResultsTable
              columns={resultsColumns}
              data={results}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      </div>
    </OnboardingProvider>
  )
}