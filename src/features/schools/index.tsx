import { useState, useEffect } from 'react'
import { SchoolsTable, SchoolFilters } from './components'
import { schoolsColumns } from './components/schools-columns'
import { useSchools } from './hooks/use-schools'
import { OnboardingProvider, schoolsSteps } from '@/features/onboarding'
import { Shimmer } from "@/components/ai-elements/shimmer"

export function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'public' | 'private'>('all')

  // Debounce search term to avoid firing queries on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch schools data
  const { data: schools = [], isLoading } = useSchools({
    search: debouncedSearchTerm,
    type: typeFilter === 'all' ? undefined : typeFilter
  })

  return (
    <OnboardingProvider section="schools" steps={schoolsSteps}>
      <div className="flex-1 min-h-[100dvh] w-full relative flex flex-col bg-[#f8fafc] overflow-hidden">
        
        {/* Exact Sandra AI Background Match: Blue Gradient + Light Ellipse from Top */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#f8fafc]">
            {/* 1. The Multi-Color Pastel Gradient Background */}
            <div 
              className="absolute inset-x-0 bottom-0 h-full opacity-100" 
              style={{
                background: 'linear-gradient(120deg, #fed7aa 0%, #fbcfe8 45%, #bae6fd 100%)',
                maskImage: 'linear-gradient(to top, black 10%, transparent 65%)',
                WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 65%)'
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

            {/* 2. The Ellipse from Top to Bottom (creating the U-shape downward arch) */}
            <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[95vh] bg-[#f8fafc] rounded-[50%] blur-[70px]" />
            <div className="absolute -top-[5%] left-1/2 -translate-x-1/2 w-[70vw] h-[90vh] bg-[#f8fafc] rounded-[50%] blur-[40px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55vw] h-[85vh] bg-[#f8fafc] rounded-[50%] blur-[20px]" />

            {/* Warm reflection edge */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 opacity-60" />
            <div className="absolute bottom-0 inset-x-0 h-[8px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 blur-[4px] opacity-40" />
        </div>

        {/* Inner Structure */}
        <div className="relative z-10 w-full min-h-screen p-4 md:pl-[104px] md:pr-6 md:py-6 max-w-[1500px] mx-auto flex flex-col pt-6 sm:pt-6 lg:h-screen lg:max-h-screen lg:overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 px-2 sm:px-4 lg:px-6 pt-6 sm:pt-8 lg:pt-10">

          {/* Header */}
          <div id="schools-header" className="mb-6 sm:mb-8 shrink-0 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-2">
              <Shimmer 
                as="span" 
                duration={3} 
                spread={1.5} 
                className="font-medium [--color-muted-foreground:theme(colors.blue.400)] [--color-background:theme(colors.white)] drop-shadow-sm"
              >
                Instituciones
              </Shimmer>
            </h1>
            <p className="text-[14px] sm:text-[15px] text-gray-500 font-medium">Explora universidades e instituciones en Venezuela</p>
          </div>

          {/* Filters */}
          <div id="schools-filters" className="mb-4 sm:mb-6">
            <SchoolFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
            />
          </div>

          {/* Table */}
          <div id="schools-list" className="flex-1 overflow-hidden min-h-0 flex flex-col rounded-[2rem]">
            <SchoolsTable
              columns={schoolsColumns}
              data={schools}
              isLoading={isLoading}
            />
          </div>
          </div>
        </div>
      </div>
    </OnboardingProvider>
  )
}