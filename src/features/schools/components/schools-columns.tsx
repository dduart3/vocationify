import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { IconBuilding, IconUsers, IconEye } from '@tabler/icons-react'
import type { School } from '../types'

const columnHelper = createColumnHelper<School>()

const getTypeColor = (type: string) => {
  return type === 'public' ? 'text-blue-700' : 'text-green-700'
}

const getTypeDisplayName = (type: string) => {
  return type === 'public' ? 'Pública' : 'Privada'
}

export const schoolsColumns: ColumnDef<School>[] = [
  columnHelper.accessor('name' as any, {
    header: 'Institución',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.05)] group-even:bg-slate-200/60 group-even:border-slate-300/80 group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_2px_6px_rgba(59,130,246,0.15)] transition-all duration-300 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
          <img
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/schools/${row.original.id}/logo.webp`}
            alt={`Logo de ${row.original.name}`}
            className="w-[85%] h-[85%] object-contain rounded-full relative z-10"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement
              if (nextElement) {
                nextElement.style.display = 'block'
              }
            }}
          />
          <IconBuilding className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors duration-300 hidden absolute" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-[13px] text-blue-600 truncate transition-colors duration-300">
            {row.original.name}
          </div>
        </div>
      </div>
    ),
    size: 300,
  }),

  columnHelper.accessor('type' as any, {
    header: 'Tipo',
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <IconUsers className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
        <span className={`font-bold text-[13px] ${getTypeColor(getValue() as string)}`}>
          {getTypeDisplayName(getValue() as string)}
        </span>
      </div>
    ),
    size: 150,
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
