import { useState } from 'react'
import { ResultsTable, ResultFilters } from './components'

export function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'last_week' | 'last_month' | 'last_year'>('all')

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mis Resultados</h1>
          <p className="text-neutral-400">Historial de tus tests vocacionales y recomendaciones</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ResultFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            dateFilter={dateFilter}
            onDateChange={setDateFilter}
          />
        </div>

        {/* Table */}
        <div>
          <ResultsTable
            searchTerm={searchTerm}
            dateFilter={dateFilter}
          />
        </div>
      </div>
    </div>
  )
}