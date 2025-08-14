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
        <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar resultados..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
      </div>
      
      <select
        value={dateFilter}
        onChange={(e) => onDateChange(e.target.value as any)}
        className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
      >
        <option value="all" className="bg-white">Todos los períodos</option>
        <option value="last_week" className="bg-white">Última semana</option>
        <option value="last_month" className="bg-white">Último mes</option>
        <option value="last_year" className="bg-white">Último año</option>
      </select>
    </div>
  )
}