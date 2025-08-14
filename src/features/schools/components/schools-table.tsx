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
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconBuilding className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
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
          <IconUsers className="w-4 h-4 text-gray-400" />
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
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            {favorites.has(row.original.id) ? (
              <IconBookmarkFilled className="w-4 h-4 text-pink-500" />
            ) : (
              <IconBookmark className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <Link
            to="/schools/$schoolId"
            params={{ schoolId: row.original.id }}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-200"
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gray-50 border-b border-gray-200"
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
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                              }`}
                            />
                            <IconChevronDown
                              className={`w-3 h-3 -mt-1 ${
                                header.column.getIsSorted() === 'desc'
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
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
                    <div className="animate-pulse bg-gray-200 h-12 rounded" />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  No se encontraron instituciones
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
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
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de{' '}
          {table.getFilteredRowModel().rows.length} resultados
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <IconChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <span className="px-3 py-1 text-sm text-gray-600">
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <IconChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}