import { useState, useEffect } from 'react'
import { SchoolsTable, SchoolFilters } from './components'
import { schoolsColumns } from './components/schools-columns'
import { useSchools } from './hooks/use-schools'

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
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Instituciones Educativas</h1>
          <p className="text-sm sm:text-base text-gray-600">Explora universidades e instituciones en Venezuela</p>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-6">
          <SchoolFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
        </div>

        {/* Table */}
        <div>
          <SchoolsTable
            columns={schoolsColumns}
            data={schools}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}