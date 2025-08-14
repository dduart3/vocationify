import { useState } from 'react'
import { SchoolsTable, SchoolFilters } from './components'

export function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'public' | 'private'>('all')

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Explorar Instituciones
          </h1>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <SchoolFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
          />
        </div>

        {/* Table */}
        <div className="max-w-6xl mx-auto">
          <SchoolsTable
            searchTerm={searchTerm}
            typeFilter={typeFilter}
          />
        </div>
      </div>
    </div>
  )
}