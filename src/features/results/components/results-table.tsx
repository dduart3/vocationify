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
import { IconBrain, IconCalendar, IconTrophy, IconEye, IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight, IconClock } from '@tabler/icons-react'
import { useResults } from '../hooks/use-results'
import type { TestResult } from '../types'

interface ResultsTableProps {
  searchTerm: string
  dateFilter: string
}

const columnHelper = createColumnHelper<TestResult>()

export function ResultsTable({ searchTerm, dateFilter }: ResultsTableProps) {
  const { data: results = [], isLoading } = useResults({
    search: searchTerm,
    date_range: dateFilter as any,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTopRiasecType = (scores: TestResult['riasec_scores']) => {
    const types = {
      R: 'Realista',
      I: 'Investigativo', 
      A: 'Artístico',
      S: 'Social',
      E: 'Emprendedor',
      C: 'Convencional'
    }
    
    const maxScore = Math.max(...Object.values(scores))
    const topType = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as keyof typeof types
    
    return topType ? types[topType] : 'N/A'
  }

  const getRiasecColor = (type: string) => {
    const colors: Record<string, string> = {
      'Realista': 'text-green-600',
      'Investigativo': 'text-blue-600', 
      'Artístico': 'text-purple-600',
      'Social': 'text-orange-600',
      'Emprendedor': 'text-yellow-600',
      'Convencional': 'text-gray-600'
    }
    return colors[type] || 'text-gray-600'
  }

  const columns = useMemo<ColumnDef<TestResult>[]>(() => [
    columnHelper.accessor('created_at', {
      header: 'Fecha',
      cell: ({ getValue, row }) => (
        <Link
          to="/vocational-test/results/$sessionId"
          params={{ sessionId: row.original.id }}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconBrain className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              Test Vocacional
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(getValue())}
            </div>
          </div>
        </Link>
      ),
      size: 200,
    }),
    
    columnHelper.accessor('riasec_scores', {
      header: 'Perfil RIASEC',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <IconTrophy className="w-4 h-4 text-gray-400" />
          <span className={`font-medium ${getRiasecColor(getTopRiasecType(getValue()))}`}>
            {getTopRiasecType(getValue())}
          </span>
        </div>
      ),
      size: 150,
    }),
    
    columnHelper.accessor('confidence_level', {
      header: 'Confianza',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${getValue() || 0}%` }}
            />
          </div>
          <span className="text-gray-700 text-sm font-medium">{getValue() || 'N/A'}%</span>
        </div>
      ),
      size: 120,
    }),

    columnHelper.accessor('career_recommendations', {
      header: 'Carrera Principal',
      cell: ({ getValue }) => {
        const recommendations = getValue()
        const topCareer = recommendations?.[0]
        return topCareer ? (
          <div className="text-gray-700">
            <div className="font-medium text-sm">
              {topCareer.career?.name || topCareer.name || topCareer.career_name || topCareer.title || 'Carrera sin nombre'}
            </div>
            <div className="text-xs text-gray-500">{topCareer.confidence || topCareer.match || 'N/A'}% compatibilidad</div>
          </div>
        ) : (
          <span className="text-gray-400">Sin recomendaciones</span>
        )
      },
      size: 200,
    }),


    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            to="/vocational-test/results/$sessionId"
            params={{ sessionId: row.original.id }}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-200"
          >
            <IconEye className="w-4 h-4" />
          </Link>
        </div>
      ),
      size: 80,
    }),
  ], [])

  const table = useReactTable({
    data: results,
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
                  <td colSpan={5} className="px-6 py-4">
                    <div className="animate-pulse bg-gray-200 h-12 rounded" />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No se encontraron resultados
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