import { Link } from '@tanstack/react-router'
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
                <tr key={row.id} className="hover:bg-blue-50/50 transition-colors duration-200 border-b border-gray-200 last:border-0 cursor-pointer">
                  <td colSpan={columns.length} className="p-0">
                    <Link
                      to="/results/$sessionId"
                      params={{ sessionId: row.original.id }}
                      className="block cursor-pointer"
                    >
                      <table className="w-full">
                        <tbody>
                          <tr>
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
                        </tbody>
                      </table>
                    </Link>
                  </td>
                </tr>
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