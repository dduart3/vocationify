import { useMemo } from 'react'
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
import { IconBrain, IconTrophy, IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
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
      'Realista': 'text-green-700',
      'Investigativo': 'text-blue-700',
      'Artístico': 'text-purple-700',
      'Social': 'text-orange-700',
      'Emprendedor': 'text-yellow-700',
      'Convencional': 'text-cyan-700'
    }
    return colors[type] || 'text-cyan-700'
  }

  const columns = useMemo<ColumnDef<TestResult>[]>(() => [
    columnHelper.accessor('created_at' as any, {
      header: 'Fecha',
      cell: ({ getValue }) => (
        <div className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-200">
            <IconBrain className="w-4 h-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              Test Vocacional
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {formatDate(getValue() as string)}
            </div>
          </div>
        </div>
      ),
      size: 200,
    }),
    
    columnHelper.accessor('riasec_scores' as any, {
      header: 'Perfil RIASEC',
      cell: ({ getValue }) => {
        const scores = getValue() as TestResult['riasec_scores']
        return (
          <div className="flex items-center gap-2">
            <IconTrophy className="w-4 h-4 text-amber-600" />
            <span className={`font-bold ${getRiasecColor(getTopRiasecType(scores))}`}>
              {getTopRiasecType(scores)}
            </span>
          </div>
        )
      },
      size: 150,
    }),
    
    columnHelper.accessor('confidence_level' as any, {
      header: 'Confianza',
      cell: ({ getValue }) => {
        const confidence = getValue() as number | null
        return (
          <div className="flex items-center gap-2">
            <div className="w-12 h-2.5 bg-gray-200 rounded-full overflow-hidden border border-gray-300 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"
                style={{ width: `${confidence || 0}%` }}
              />
            </div>
            <span className="text-gray-900 text-sm font-bold">{confidence || 'N/A'}%</span>
          </div>
        )
      },
      size: 120,
    }),

    columnHelper.accessor('career_recommendations' as any, {
      header: 'Carrera Principal',
      cell: ({ getValue }) => {
        const recommendations = getValue() as TestResult['career_recommendations']
        const topCareer = recommendations?.[0]
        return topCareer ? (
          <div className="text-gray-900">
            <div className="font-bold text-sm">
              {topCareer.career?.name || topCareer.name || topCareer.career_name || topCareer.title || 'Carrera sin nombre'}
            </div>
            <div className="text-xs text-gray-600 font-medium">{topCareer.confidence || topCareer.match || 'N/A'}% compatibilidad</div>
          </div>
        ) : (
          <span className="text-gray-500 font-medium">Sin recomendaciones</span>
        )
      },
      size: 200,
    }),

  ], [])

  const table = useReactTable({
    data: results,
    columns: columns as ColumnDef<TestResult>[],
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-300/50 shadow-lg shadow-gray-200/50">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-bold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none hover:text-blue-600'
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
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Link
                  key={row.id}
                  to="/results/$sessionId"
                  params={{ sessionId: row.original.id }}
                  className="table-row hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer border-b border-gray-200 last:border-0"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-6 py-4"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </Link>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-300">
        <div className="text-sm text-gray-700 font-medium">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de{' '}
          {table.getFilteredRowModel().rows.length} resultados
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            <IconChevronLeft className="w-4 h-4 text-gray-700" />
          </button>

          <span className="px-3 py-1 text-sm text-gray-700 font-bold">
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            <IconChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  )
}