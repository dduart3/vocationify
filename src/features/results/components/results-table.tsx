import { useNavigate } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import type { TestResult } from '../types'

interface ResultsTableProps {
  columns: ColumnDef<TestResult>[]
  data: TestResult[]
  isLoading?: boolean
}

export function ResultsTable({ columns, data, isLoading = false }: ResultsTableProps) {
  const navigate = useNavigate()

  const table = useReactTable({
    data,
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
    <div className="bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] flex flex-col min-h-0 h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 z-20">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 sm:px-6 py-3.5 sm:py-4 text-left text-[11px] sm:text-[12px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100/80 backdrop-blur-md border-b border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]"
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
                <tr 
                  key={row.id} 
                  onClick={() => navigate({ to: '/results/$sessionId', params: { sessionId: row.original.id } })}
                  className="hover:bg-white/60 transition-colors duration-200 border-b border-black/[0.04] last:border-0 cursor-pointer group even:bg-slate-100/40"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-4 sm:px-6 py-4 text-xs sm:text-sm align-middle"
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
      <div className="shrink-0 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 bg-slate-50/50 backdrop-blur-md border-t border-white/60 shadow-[inset_0_1px_0px_rgba(255,255,255,0.7)]">
        <div className="text-[12px] sm:text-[13px] text-slate-500 font-medium text-center sm:text-left">
          Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de{' '}
          {table.getFilteredRowModel().rows.length} resultados
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-xl bg-white/60 border border-slate-200/60 shadow-[0_2px_5px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1)] hover:bg-white hover:shadow-[0_4px_8px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <IconChevronLeft className="w-4 h-4 text-slate-600" />
          </button>

          <span className="px-3 py-1 text-[13px] text-slate-600 font-bold whitespace-nowrap bg-white/50 rounded-lg shadow-inner border border-black/5">
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-xl bg-white/60 border border-slate-200/60 shadow-[0_2px_5px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,1)] hover:bg-white hover:shadow-[0_4px_8px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <IconChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  )
}