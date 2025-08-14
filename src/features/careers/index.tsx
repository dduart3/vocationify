import { useState } from 'react'
import { CareersTable, CareerFilters } from './components'
import type { RiasecType } from './types'

export function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [riasecFilter, setRiasecFilter] = useState<RiasecType | 'all'>('all')

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Explorar Carreras
          </h1>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <CareerFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            riasecFilter={riasecFilter}
            onRiasecChange={setRiasecFilter}
          />
        </div>

        {/* Table */}
        <div className="max-w-6xl mx-auto">
          <CareersTable
            searchTerm={searchTerm}
            riasecFilter={riasecFilter}
          />
        </div>
      </div>
    </div>
  )
}