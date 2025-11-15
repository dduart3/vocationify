import { useState, useEffect } from 'react'
import { CareersTable, CareerFilters } from './components'
import { careersColumns } from './components/careers-columns'
import { useCareers } from './hooks/use-careers'
import type { RiasecType } from './types'
import { OnboardingProvider, careersSteps } from '@/features/onboarding'

export function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [riasecFilter, setRiasecFilter] = useState<RiasecType | 'all'>('all')

  // Debounce search term to avoid firing queries on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch careers data
  const { data: careers = [], isLoading } = useCareers({
    search: debouncedSearchTerm,
    riasecType: riasecFilter === 'all' ? undefined : riasecFilter,
    durationYears: 'all',
    state: 'all',
    schoolType: 'all'
  })

  return (
    <OnboardingProvider section="careers" steps={careersSteps}>
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div id="careers-header" className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Carreras</h1>
            <p className="text-sm sm:text-base text-gray-600">Explora las diferentes carreras profesionales</p>
          </div>

          {/* Filters */}
          <div id="career-filters" className="mb-4 sm:mb-6">
            <CareerFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              riasecFilter={riasecFilter}
              onRiasecChange={setRiasecFilter}
            />
          </div>

          {/* Table */}
          <div id="career-list">
            <CareersTable
              columns={careersColumns}
              data={careers}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </OnboardingProvider>
  )
}