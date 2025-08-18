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
        <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
        <input
          type="text"
          placeholder="Buscar carreras..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      
      <select
        value={riasecFilter}
        onChange={(e) => onRiasecChange(e.target.value as RiasecType | 'all')}
        className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="all" className="bg-white text-gray-900">Todos</option>
        <option value="realistic" className="bg-white text-gray-900">Realista</option>
        <option value="investigative" className="bg-white text-gray-900">Investigativo</option>
        <option value="artistic" className="bg-white text-gray-900">Artístico</option>
        <option value="social" className="bg-white text-gray-900">Social</option>
        <option value="enterprising" className="bg-white text-gray-900">Emprendedor</option>
        <option value="conventional" className="bg-white text-gray-900">Convencional</option>
      </select>
    </div>
  )
}