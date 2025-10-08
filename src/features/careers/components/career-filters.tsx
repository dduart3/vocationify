import { IconSearch } from '@tabler/icons-react'
import type { RiasecType } from '../types'

interface CareerFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  riasecFilter: RiasecType | 'all'
  onRiasecChange: (value: RiasecType | 'all') => void
}

export function CareerFilters({ 
  searchTerm, 
  onSearchChange, 
  riasecFilter, 
  onRiasecChange 
}: CareerFiltersProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar carreras..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
      </div>

      <select
        value={riasecFilter}
        onChange={(e) => onRiasecChange(e.target.value as RiasecType | 'all')}
        className="px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
      >
        <option value="all">Todos</option>
        <option value="realistic">Realista</option>
        <option value="investigative">Investigativo</option>
        <option value="artistic">Artístico</option>
        <option value="social">Social</option>
        <option value="enterprising">Emprendedor</option>
        <option value="conventional">Convencional</option>
      </select>
    </div>
  )
}