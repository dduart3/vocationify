import { useState } from 'react'
import { ResultsTable, ResultFilters } from './components'

export function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'last_week' | 'last_month' | 'last_year'>('all')

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Mis Resultados
          </h1>
          <p className="text-gray-600">
            Historial de tus tests vocacionales y recomendaciones
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <ResultFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            dateFilter={dateFilter}
            onDateChange={setDateFilter}
          />
        </div>

        {/* Table */}
        <div className="max-w-6xl mx-auto">
          <ResultsTable
            searchTerm={searchTerm}
            dateFilter={dateFilter}
          />
        </div>
      </div>
    </div>
  )
}