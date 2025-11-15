import { useState, useEffect } from 'react'
import { ResultsTable, ResultFilters } from './components'
import { resultsColumns } from './components/results-columns'
import { useResults } from './hooks/use-results'
import { OnboardingProvider, resultsSteps } from '@/features/onboarding'

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
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div id="results-header" className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mis Resultados</h1>
            <p className="text-sm sm:text-base text-gray-600">Historial de tus tests vocacionales y recomendaciones</p>
          </div>

          {/* Filters */}
          <div className="mb-4 sm:mb-6">
            <ResultFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              dateFilter={dateFilter}
              onDateChange={setDateFilter}
            />
          </div>

          {/* Table */}
          <div id="results-table">
            <ResultsTable
              columns={resultsColumns}
              data={results}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </OnboardingProvider>
  )
}