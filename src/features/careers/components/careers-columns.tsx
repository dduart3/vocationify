import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { IconSchool, IconTarget, IconClock, IconEye } from '@tabler/icons-react'
import type { Career } from '../types'

const columnHelper = createColumnHelper<Career>()

const getRiasecColor = (type: string | null | undefined) => {
  if (!type) return 'text-slate-700'
  const colors: Record<string, string> = {
    'realistic': 'text-green-700',
    'investigative': 'text-blue-700',
    'artistic': 'text-purple-700',
    'social': 'text-orange-700',
    'enterprising': 'text-yellow-700',
    'conventional': 'text-cyan-700'
  }
  return colors[type.toLowerCase()] || 'text-cyan-700'
}

const getRiasecDisplayName = (type: string | null | undefined) => {
  if (!type) return 'N/A'
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

export const careersColumns: ColumnDef<Career>[] = [
  columnHelper.accessor('name' as any, {
    header: 'Carrera',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.05)] group-even:bg-slate-200/60 group-even:border-slate-300/80 group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_2px_6px_rgba(59,130,246,0.15)] transition-all duration-300 flex items-center justify-center flex-shrink-0">
          <IconSchool className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors duration-300" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-[13px] text-blue-600 truncate transition-colors duration-300">
            {row.original.name}
          </div>
          <div className="text-[11px] text-slate-500 font-medium truncate">
            {row.original.description.slice(0, 60)}...
          </div>
        </div>
      </div>
    ),
    size: 300,
  }),

  columnHelper.accessor('primary_riasec_type' as any, {
    header: 'RIASEC',
    cell: ({ getValue, row }) => (
      <div className="flex items-center gap-2">
        <IconTarget className={`w-4 h-4 ${getRiasecColor(getValue() as string)}`} />
        <span className={`font-bold text-[13px] ${getRiasecColor(getValue() as string)}`}>
          {getRiasecDisplayName(getValue() as string)}
        </span>
        {row.original.secondary_riasec_type && (
          <span className="text-slate-500 text-[11px] font-medium ml-1">
            + {getRiasecDisplayName(row.original.secondary_riasec_type)}
          </span>
        )}
      </div>
    ),
    size: 150,
  }),

  columnHelper.accessor('duration_years' as any, {
    header: 'Años',
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <IconClock className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
        <span className="text-slate-700 text-[13px] font-bold">{getValue() as number} Años</span>
      </div>
    ),
    size: 100,
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
