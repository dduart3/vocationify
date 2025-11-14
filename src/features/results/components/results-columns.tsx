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

  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Link
        to="/results/$sessionId"
        params={{ sessionId: row.original.id }}
        className="p-2 rounded-lg bg-blue-100 border border-blue-300 hover:border-blue-500 hover:bg-blue-200 text-blue-700 hover:text-blue-900 transition-all duration-200 inline-flex items-center justify-center"
      >
        <IconEye className="w-4 h-4" />
      </Link>
    ),
    size: 60,
  }),
]
