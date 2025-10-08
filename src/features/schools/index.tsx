import { useState } from 'react'
import { SchoolsTable, SchoolFilters } from './components'

export function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'public' | 'private'>('all')

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instituciones Educativas</h1>
          <p className="text-gray-600">Explora universidades e instituciones en Venezuela</p>
        </div>

        {/* Filters */}
        <div className="mb-6">
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
            searchTerm={searchTerm}
            typeFilter={typeFilter}
          />
        </div>
      </div>
    </div>
  )
}