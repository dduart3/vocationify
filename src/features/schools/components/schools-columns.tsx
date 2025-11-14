import { Link } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { IconBuilding, IconUsers, IconEye } from '@tabler/icons-react'
import type { School } from '../types'

const columnHelper = createColumnHelper<School>()

const getTypeColor = (type: string) => {
  return type === 'public' ? 'text-blue-700' : 'text-green-700'
}

const getTypeDisplayName = (type: string) => {
  return type === 'public' ? 'Pública' : 'Privada'
}

export const schoolsColumns: ColumnDef<School>[] = [
  columnHelper.accessor('name' as any, {
    header: 'Institución',
    cell: ({ row }) => (
      <Link
        to="/schools/$schoolId"
        params={{ schoolId: row.original.id }}
        className="flex items-center gap-3 group"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-1 border border-blue-200">
          <img
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/schools/${row.original.id}/logo.webp`}
            alt={`Logo de ${row.original.name}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement
              if (nextElement) {
                nextElement.style.display = 'block'
              }
            }}
          />
          <IconBuilding className="w-4 h-4 text-blue-600 hidden" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {row.original.name}
          </div>
        </div>
      </Link>
    ),
    size: 300,
  }),

  columnHelper.accessor('type' as any, {
    header: 'Tipo',
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <IconUsers className="w-4 h-4 text-gray-600" />
        <span className={`font-bold ${getTypeColor(getValue() as string)}`}>
          {getTypeDisplayName(getValue() as string)}
        </span>
      </div>
    ),
    size: 100,
  }),

  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link
        to="/schools/$schoolId"
        params={{ schoolId: row.original.id }}
        className="p-2 rounded-lg bg-blue-100 border border-blue-300 hover:border-blue-500 hover:bg-blue-200 text-blue-700 hover:text-blue-900 transition-all duration-200 inline-flex items-center justify-center"
      >
        <IconEye className="w-4 h-4" />
      </Link>
    ),
    size: 60,
  }),
]
