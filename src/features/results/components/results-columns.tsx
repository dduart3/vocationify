import { Link } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { IconBrain, IconTrophy, IconEye } from '@tabler/icons-react'
import type { TestResult } from '../types'

const columnHelper = createColumnHelper<TestResult>()

// Move helper functions outside component to prevent infinite loops
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

export const resultsColumns: ColumnDef<TestResult>[] = [
  columnHelper.accessor('created_at' as any, {
    header: 'Fecha',
    cell: ({ getValue }) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.05)] group-even:bg-slate-200/60 group-even:border-slate-300/80 group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_2px_6px_rgba(59,130,246,0.15)] transition-all duration-300 flex items-center justify-center flex-shrink-0">
          <IconBrain className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors duration-300" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-[13px] text-slate-700 group-hover:text-blue-600 transition-colors duration-300">
            Test Vocacional
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
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
          <IconTrophy className={`w-4 h-4 ${getRiasecColor(getTopRiasecType(scores))}`} />
          <span className={`font-bold text-[13px] ${getRiasecColor(getTopRiasecType(scores))}`}>
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
          <div className="w-12 h-2 bg-slate-200/80 group-even:bg-slate-300/80 rounded-full overflow-hidden border border-slate-300 group-even:border-slate-300 shadow-inner transition-colors duration-200">
            <div
              className="h-full bg-blue-500 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
              style={{ width: `${confidence || 0}%` }}
            />
          </div>
          <span className="text-slate-700 text-[13px] font-bold">{confidence || 'N/A'}%</span>
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
        <div className="text-slate-700 min-w-0">
          <div className="font-bold text-[13px] text-blue-600 truncate">
            {topCareer.career?.name || topCareer.name || topCareer.career_name || topCareer.title || 'Carrera sin nombre'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium truncate">{topCareer.confidence || topCareer.match || 'N/A'}% compatibilidad</div>
        </div>
      ) : (
        <span className="text-slate-400 text-[12px] font-medium">Sin recomendaciones</span>
      )
    },
    size: 200,
  }),

  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link
        to="/results/$sessionId"
        params={{ sessionId: row.original.id }}
        className="w-7 h-7 rounded-full bg-slate-50 group-even:bg-slate-200/60 border border-slate-200 group-even:border-slate-300 shadow-[0_2px_5px_rgba(0,0,0,0.08),inset_0_-1px_2px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(0,0,0,0.02),inset_0_2px_4px_rgba(255,255,255,1)] hover:bg-white hover:-translate-y-[1px] hover:text-blue-600 text-slate-400 group-even:text-slate-500 transition-all duration-300 inline-flex items-center justify-center shrink-0"
      >
        <IconEye className="w-3.5 h-3.5 origin-center transition-transform duration-300 hover:scale-110" />
      </Link>
    ),
    size: 60,
  }),
]
