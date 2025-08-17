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
import { IconBuilding, IconMapPin, IconUsers, IconBookmark, IconBookmarkFilled, IconEye, IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useSchools } from '../hooks/use-schools'
import type { School } from '../types'

interface SchoolsTableProps {
  searchTerm: string
  typeFilter: string
}

const columnHelper = createColumnHelper<School>()

export function SchoolsTable({ searchTerm, typeFilter }: SchoolsTableProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const { data: schools = [], isLoading } = useSchools({
    search: searchTerm,
    type: typeFilter as any,
  })

  const toggleFavorite = (schoolId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(schoolId)) {
        newFavorites.delete(schoolId)
      } else {
        newFavorites.add(schoolId)
      }
      return newFavorites
    })
  }

  const getTypeColor = (type: string) => {
    return type === 'public' ? 'text-blue-600' : 'text-green-600'
  }

  const getTypeDisplayName = (type: string) => {
    return type === 'public' ? 'Pública' : 'Privada'
  }

  const columns = useMemo<ColumnDef<School>[]>(() => [
    columnHelper.accessor('name', {
      header: 'Institución',
      cell: ({ row }) => (
        <Link
          to="/schools/$schoolId"
          params={{ schoolId: row.original.id }}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
            <img 
              src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/schools/${row.original.id}/logo.webp`}
              alt={`Logo de ${row.original.name}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to icon if image fails to load
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling.style.display = 'block'
              }}
            />
            <IconBuilding className="w-4 h-4 text-blue-400 hidden" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
              {row.original.name}
            </div>
          </div>
        </Link>
      ),
      size: 300,
    }),
    
    columnHelper.accessor('type', {
      header: 'Tipo',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <IconUsers className="w-4 h-4 text-neutral-400" />
          <span className={`font-medium ${getTypeColor(getValue())}`}>
            {getTypeDisplayName(getValue())}
          </span>
        </div>
      ),
      size: 100,
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
            to="/schools/$schoolId"
            params={{ schoolId: row.original.id }}
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
    data: schools,
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
                  <td colSpan={3} className="px-6 py-4">
                    <div className="animate-pulse bg-white/20 h-12 rounded" />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-neutral-400">
                  No se encontraron instituciones
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