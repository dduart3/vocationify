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
import { IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight, IconBrain, IconTrophy } from '@tabler/icons-react'
import type { TestResult } from '../types'

function MobileResultTile({ row, onClick }: { row: any, onClick: () => void }) {
  const result = row.original as TestResult;
  
  // Hand-extracting styles from column defs for the tile look
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
    const types = { R: 'Realista', I: 'Investigativo', A: 'Artístico', S: 'Social', E: 'Emprendedor', C: 'Convencional' }
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
      'Convencional': 'text-cyan-600'
    }
    return colors[type] || 'text-cyan-600'
  }

  const topRiasec = getTopRiasecType(result.riasec_scores);
  const topCareer = result.career_recommendations?.[0];

  return (
    <div 
      onClick={onClick}
      className="bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] rounded-3xl p-5 active:scale-[0.98] transition-all duration-200 flex flex-col gap-4 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header: Date & Type */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-center">
            <IconBrain className="w-5 h-5 text-slate-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-[14px] text-slate-800 leading-tight">Test Vocacional</div>
            <div className="text-[11px] text-slate-500 font-medium">{formatDate(result.created_at)}</div>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Main Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Perfil RIASEC</div>
          <div className="flex items-center gap-2">
            <IconTrophy className={`w-4 h-4 ${getRiasecColor(topRiasec)}`} />
            <span className={`font-bold text-[14px] ${getRiasecColor(topRiasec)}`}>{topRiasec}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Confianza Test</div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-200 shadow-inner">
               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${result.confidence_level}%` }} />
            </div>
            <span className="font-bold text-[13px] text-slate-700">{result.confidence_level}%</span>
          </div>
        </div>
      </div>

      {/* Recommendation Block */}
      {topCareer && (
        <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-3 flex flex-col">
          <div className="text-[10px] uppercase tracking-wider font-bold text-blue-400 mb-1">Recomendación Principal</div>
          <div className="font-bold text-[13px] text-blue-700 leading-snug mb-1">{topCareer.career?.name || topCareer.name || topCareer.career_name || "Carrera recomendada"}</div>
          <div className="text-[11px] font-medium text-blue-500/80">{topCareer.confidence || topCareer.match || 'N/A'}% compatibilidad</div>
        </div>
      )}
    </div>
  )
}

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
    <div className="bg-white/50 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] rounded-[2rem] flex flex-col w-full pb-4">
      <div className="w-full overflow-auto custom-scrollbar hidden sm:block" data-lenis-prevent="true">
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

      {/* Mobile Tiles Container */}
      <div className="w-full flex flex-col gap-4 p-4 sm:hidden">
        {isLoading ? (
           Array(5).fill(0).map((_, i) => (
             <div key={i} className="bg-white/50 animate-pulse h-48 rounded-3xl" />
           ))
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-medium">
            No se encontraron resultados
          </div>
        ) : (
          table.getRowModel().rows.map((row) => (
            <MobileResultTile 
              key={row.id} 
              row={row} 
              onClick={() => navigate({ to: '/results/$sessionId', params: { sessionId: row.original.id } })}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="shrink-0 px-4 sm:px-6 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
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