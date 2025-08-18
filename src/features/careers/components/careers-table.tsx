import { useState, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table'
import { IconSchool, IconTarget, IconClock, IconStar, IconBookmark, IconBookmarkFilled, IconEye, IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useCareers } from '../hooks/use-careers'
import type { Career } from '../types'

interface CareersTableProps {
  searchTerm: string
  riasecFilter: string
}

const columnHelper = createColumnHelper<Career>()

export function CareersTable({ searchTerm, riasecFilter }: CareersTableProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const { data: careers = [], isLoading } = useCareers({
    search: searchTerm,
    riasecType: riasecFilter as any,
    durationYears: 'all',
    state: 'all',
    schoolType: 'all'
  })

  const toggleFavorite = (careerId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(careerId)) {
        newFavorites.delete(careerId)
      } else {
        newFavorites.add(careerId)
      }
      return newFavorites
    })
  }

  const getRiasecColor = (type: string) => {
    const colors: Record<string, string> = {
      'realistic': 'text-green-400',
      'investigative': 'text-blue-400', 
      'artistic': 'text-purple-400',
      'social': 'text-orange-400',
      'enterprising': 'text-yellow-400',
      'conventional': 'text-cyan-400'
    }
    return colors[type.toLowerCase()] || 'text-cyan-400'
  }

  const getRiasecDisplayName = (type: string) => {
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


  const columns = useMemo<ColumnDef<Career>[]>(() => [
    columnHelper.accessor('name', {
      header: 'Carrera',
      cell: ({ row }) => (
        <Link
          to="/careers/$careerId"
          params={{ careerId: row.original.id }}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconSchool className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
              {row.original.name}
            </div>
            <div className="text-xs text-neutral-400 truncate">
              {row.original.description.slice(0, 60)}...
            </div>
          </div>
        </Link>
      ),
      size: 300,
    }),
    
    columnHelper.accessor('primary_riasec_type', {
      header: 'RIASEC',
      cell: ({ getValue, row }) => (
        <div className="flex items-center gap-2">
          <IconTarget className="w-4 h-4 text-neutral-400" />
          <span className={`font-medium ${getRiasecColor(getValue())}`}>
            {getRiasecDisplayName(getValue())}
          </span>
          {row.original.secondary_riasec_type && (
            <span className="text-neutral-400 text-sm">
              +{getRiasecDisplayName(row.original.secondary_riasec_type)}
            </span>
          )}
        </div>
      ),
      size: 120,
    }),
    
    columnHelper.accessor('duration_years', {
      header: 'Años',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <IconClock className="w-4 h-4 text-neutral-400" />
          <span className="text-white">{getValue()}</span>
        </div>
      ),
      size: 80,
    }),


    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(row.original.id)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            {favorites.has(row.original.id) ? (
              <IconBookmarkFilled className="w-4 h-4 text-pink-400" />
            ) : (
              <IconBookmark className="w-4 h-4 text-neutral-400" />
            )}
          </button>
          <Link
            to="/careers/$careerId"
            params={{ careerId: row.original.id }}
            className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-200"
          >
            <IconEye className="w-4 h-4" />
          </Link>
        </div>
      ),
      size: 100,
    }),
  ], [favorites])

  const table = useReactTable({
    data: careers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden overflow-x-auto">
      <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-white/80 bg-white/5"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none hover:text-gray-900'
                            : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <IconChevronUp
                              className={`w-3 h-3 ${
                                header.column.getIsSorted() === 'asc'
                                  ? 'text-blue-400'
                                  : 'text-neutral-400'
                              }`}
                            />
                            <IconChevronDown
                              className={`w-3 h-3 -mt-1 ${
                                header.column.getIsSorted() === 'desc'
                                  ? 'text-blue-400'
                                  : 'text-neutral-400'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array(10).fill(0).map((_, i) => (
                <tr key={i}>
                  <td colSpan={4} className="px-6 py-4">
                    <div className="animate-pulse bg-white/20 h-12 rounded" />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-400">
                  No se encontraron carreras
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors duration-200">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between">
        <div className="text-sm text-neutral-300">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de{' '}
          {table.getFilteredRowModel().rows.length} resultados
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <IconChevronLeft className="w-4 h-4 text-neutral-300" />
          </button>

          <span className="px-3 py-1 text-sm text-neutral-300">
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <IconChevronRight className="w-4 h-4 text-neutral-300" />
          </button>
        </div>
      </div>
    </div>
  )
}