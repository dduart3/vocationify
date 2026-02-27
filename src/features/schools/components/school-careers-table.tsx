import { useNavigate } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table'
import { IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight, IconSchool, IconClock, IconEye } from '@tabler/icons-react'
import type { SchoolCareer } from '../types'

const columnHelper = createColumnHelper<SchoolCareer>()

const schoolCareersColumns: ColumnDef<SchoolCareer>[] = [
  columnHelper.accessor((row) => row.career?.name ?? '', {
    id: 'career',
    header: 'Carrera',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.05)] group-even:bg-slate-200/60 group-even:border-slate-300/80 group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_2px_6px_rgba(59,130,246,0.15)] transition-all duration-300 flex items-center justify-center flex-shrink-0">
          <IconSchool className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors duration-300" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-[13px] text-blue-600 truncate transition-colors duration-300">
            {row.original.career?.name ?? '—'}
          </div>
        </div>
      </div>
    ),
    size: 320,
  }),

  columnHelper.accessor((row) => row.shifts, {
    id: 'shifts',
    header: 'Turnos',
    cell: ({ getValue }) => {
      const shifts = getValue()
      if (!shifts?.length) return <span className="text-slate-400 text-[12px]">—</span>
      const list = Array.isArray(shifts) ? shifts : [shifts]
      return (
        <div className="flex flex-wrap gap-1.5">
          {list.map((shift: string, idx: number) => (
            <span
              key={idx}
              className="text-[11px] sm:text-[12px] text-blue-800 bg-gradient-to-b from-blue-100/90 to-blue-200/80 shadow-[0_2px_5px_rgba(59,130,246,0.15),inset_0_-1px_2px_rgba(37,99,235,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-blue-300/60 px-2.5 py-1 rounded-full font-bold"
            >
              {shift}
            </span>
          ))}
        </div>
      )
    },
    size: 180,
  }),

  columnHelper.accessor((row) => row.duration_years ?? (row.career as { duration_years?: number } | undefined)?.duration_years, {
    id: 'duration',
    header: 'Duración',
    cell: ({ row }) => {
      const years = row.original.duration_years ?? (row.original.career as { duration_years?: number } | undefined)?.duration_years
      return (
        <div className="flex items-center gap-2">
          <IconClock className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
          <span className="text-slate-700 text-[13px] font-bold">{years != null ? `${years} años` : '—'}</span>
        </div>
      )
    },
    size: 110,
  }),

  columnHelper.display({
    id: 'actions',
    header: '',
    cell: () => (
      <div
        className="w-7 h-7 rounded-full bg-slate-50 group-even:bg-slate-200/60 border border-slate-200 group-even:border-slate-300 shadow-[0_2px_5px_rgba(0,0,0,0.08),inset_0_-1px_2px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(0,0,0,0.02),inset_0_2px_4px_rgba(255,255,255,1)] hover:bg-white hover:-translate-y-[1px] hover:text-blue-600 text-slate-400 group-even:text-slate-500 transition-all duration-300 inline-flex items-center justify-center shrink-0"
      >
        <IconEye className="w-3.5 h-3.5 origin-center transition-transform duration-300 hover:scale-110" />
      </div>
    ),
    size: 60,
  }),
]

interface SchoolCareersTableProps {
  data: SchoolCareer[]
}

export function SchoolCareersTable({ data }: SchoolCareersTableProps) {
  const navigate = useNavigate()

  const table = useReactTable({
    data,
    columns: schoolCareersColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] flex flex-col min-h-0 overflow-hidden">
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={schoolCareersColumns.length} className="px-6 py-12 text-center text-gray-500 font-medium">
                  No hay carreras disponibles
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => row.original.career?.id && navigate({ to: '/careers/$careerId', params: { careerId: row.original.career.id } })}
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
      {data.length > 10 && (
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
      )}
    </div>
  )
}
