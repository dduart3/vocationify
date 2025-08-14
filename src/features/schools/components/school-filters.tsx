import { IconSearch } from '@tabler/icons-react'

interface SchoolFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  typeFilter: 'all' | 'public' | 'private'
  onTypeChange: (value: 'all' | 'public' | 'private') => void
}

export function SchoolFilters({ 
  searchTerm, 
  onSearchChange, 
  typeFilter, 
  onTypeChange
}: SchoolFiltersProps) {

  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar instituciones..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
      </div>
      
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as 'all' | 'public' | 'private')}
        className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
      >
        <option value="all" className="bg-white">Todos los tipos</option>
        <option value="public" className="bg-white">Pública</option>
        <option value="private" className="bg-white">Privada</option>
      </select>

    </div>
  )
}