import { IconSearch } from '@tabler/icons-react'

interface ResultFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  dateFilter: 'all' | 'last_week' | 'last_month' | 'last_year'
  onDateChange: (value: 'all' | 'last_week' | 'last_month' | 'last_year') => void
}

export function ResultFilters({ 
  searchTerm, 
  onSearchChange, 
  dateFilter, 
  onDateChange
}: ResultFiltersProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
        <input
          type="text"
          placeholder="Buscar resultados..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      
      <select
        value={dateFilter}
        onChange={(e) => onDateChange(e.target.value as any)}
        className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="all" className="bg-white text-gray-900">Todos los períodos</option>
        <option value="last_week" className="bg-white text-gray-900">Última semana</option>
        <option value="last_month" className="bg-white text-gray-900">Último mes</option>
        <option value="last_year" className="bg-white text-gray-900">Último año</option>
      </select>
    </div>
  )
}