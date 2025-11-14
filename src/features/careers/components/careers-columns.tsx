import { Link } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { IconSchool, IconTarget, IconClock, IconEye } from '@tabler/icons-react'
import type { Career } from '../types'

const columnHelper = createColumnHelper<Career>()

const getRiasecColor = (type: string | null | undefined) => {
  if (!type) return 'text-gray-700'
  const colors: Record<string, string> = {
    'realistic': 'text-green-700',
    'investigative': 'text-blue-700',
    'artistic': 'text-purple-700',
    'social': 'text-orange-700',
    'enterprising': 'text-yellow-700',
    'conventional': 'text-cyan-700'
  }
  return colors[type.toLowerCase()] || 'text-cyan-700'
}

const getRiasecDisplayName = (type: string | null | undefined) => {
  if (!type) return 'N/A'
  const names: Record<string, string> = {
    'realistic': 'Realista',
    'investigative': 'Investigativo',
    'artistic': 'Artístico',
    'social': 'Social',
    'enterprising': 'Emprendedor',
    'conventional': 'Convencional'
  }
  return names[type.toLowerCase()] || type
}

export const careersColumns: ColumnDef<Career>[] = [
  columnHelper.accessor('name' as any, {
    header: 'Carrera',
    cell: ({ row }) => (
      <Link
        to="/careers/$careerId"
        params={{ careerId: row.original.id }}
        className="flex items-center gap-3 group"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-200">
          <IconSchool className="w-4 h-4 text-blue-600" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {row.original.name}
          </div>
          <div className="text-xs text-gray-600 font-medium truncate">
            {row.original.description.slice(0, 60)}...
          </div>
        </div>
      </Link>
    ),
    size: 300,
  }),

  columnHelper.accessor('primary_riasec_type' as any, {
    header: 'RIASEC',
    cell: ({ getValue, row }) => (
      <div className="flex items-center gap-2">
        <IconTarget className="w-4 h-4 text-gray-600" />
        <span className={`font-bold ${getRiasecColor(getValue() as string)}`}>
          {getRiasecDisplayName(getValue() as string)}
        </span>
        {row.original.secondary_riasec_type && (
          <span className="text-gray-600 text-sm font-medium">
            +{getRiasecDisplayName(row.original.secondary_riasec_type)}
          </span>
        )}
      </div>
    ),
    size: 120,
  }),

  columnHelper.accessor('duration_years' as any, {
    header: 'Años',
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <IconClock className="w-4 h-4 text-gray-600" />
        <span className="text-gray-900 font-bold">{getValue() as number}</span>
      </div>
    ),
    size: 80,
  }),

  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link
        to="/careers/$careerId"
        params={{ careerId: row.original.id}}
        className="p-2 rounded-lg bg-blue-100 border border-blue-300 hover:border-blue-500 hover:bg-blue-200 text-blue-700 hover:text-blue-900 transition-all duration-200 inline-flex items-center justify-center"
      >
        <IconEye className="w-4 h-4" />
      </Link>
    ),
    size: 60,
  }),
]
