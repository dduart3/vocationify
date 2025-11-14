import { useState, useEffect } from 'react'
import { CareersTable, CareerFilters } from './components'
import { careersColumns } from './components/careers-columns'
import { useCareers } from './hooks/use-careers'
import type { RiasecType } from './types'

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
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carreras</h1>
          <p className="text-gray-600">Explora las diferentes carreras profesionales</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <CareerFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            riasecFilter={riasecFilter}
            onRiasecChange={setRiasecFilter}
          />
        </div>

        {/* Table */}
        <div>
          <CareersTable
            columns={careersColumns}
            data={careers}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}