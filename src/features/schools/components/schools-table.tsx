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
import { IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight, IconBuilding } from '@tabler/icons-react'
import type { School } from '../types'

function MobileSchoolTile({ row, onClick }: { row: any, onClick: () => void }) {
  const school = row.original as School;
  
  const getTypeColor = (type: string) => {
    return type === 'public' ? 'text-blue-600' : 'text-green-600'
  }

  const getTypeDisplayName = (type: string) => {
    return type === 'public' ? 'Pública' : 'Privada'
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] rounded-3xl p-5 active:scale-[0.98] transition-all duration-200 flex flex-col gap-4 relative overflow-hidden group mb-4"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/schools/${school.id}/logo.webp`}
              alt={`Logo de ${school.name}`}
              className="w-[85%] h-[85%] object-contain rounded-xl"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                if (nextElement) nextElement.style.display = 'block'
              }}
            />
            <IconBuilding className="w-6 h-6 text-slate-400 hidden" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-[16px] text-blue-600 leading-tight mb-2">{school.name}</div>
            <div className="flex items-center gap-2">
               <span className={`text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 ${getTypeColor(school.type)}`}>
                  {getTypeDisplayName(school.type)}
               </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SchoolsTableProps {
  columns: ColumnDef<School>[]
  data: School[]
  isLoading?: boolean
}

export function SchoolsTable({ columns, data, isLoading = false }: SchoolsTableProps) {
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
      <div className="flex-1 overflow-auto custom-scrollbar min-h-0 hidden sm:block" data-lenis-prevent="true">
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
                  <td colSpan={columns.length} className="px-6 py-4">
                    <div className="animate-pulse bg-gray-200 h-12 rounded" />
                  </td>
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 font-medium">
                  No se encontraron instituciones
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => navigate({ to: '/schools/$schoolId', params: { schoolId: row.original.id } })}
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

      {/* Mobile Tiles Container */}
      <div className="flex-1 overflow-auto custom-scrollbar sm:hidden p-4" data-lenis-prevent="true">
        {isLoading ? (
           Array(5).fill(0).map((_, i) => (
             <div key={i} className="bg-white/50 animate-pulse h-28 rounded-3xl mb-4" />
           ))
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-medium">
            No se encontraron instituciones
          </div>
        ) : (
          table.getRowModel().rows.map((row) => (
            <MobileSchoolTile 
              key={row.id} 
              row={row} 
              onClick={() => navigate({ to: '/schools/$schoolId', params: { schoolId: row.original.id } })}
            />
          ))
        )}
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