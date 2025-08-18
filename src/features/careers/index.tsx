import { useState } from 'react'
import { CareersTable, CareerFilters } from './components'
import type { RiasecType } from './types'

export function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [riasecFilter, setRiasecFilter] = useState<RiasecType | 'all'>('all')

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Carreras</h1>
          <p className="text-neutral-400">Explora las diferentes carreras profesionales</p>
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
            searchTerm={searchTerm}
            riasecFilter={riasecFilter}
          />
        </div>
      </div>
    </div>
  )
}