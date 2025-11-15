import { CheckCircle, Circle } from 'lucide-react'
import { useGuidedOnboarding } from '../hooks/use-guided-onboarding'
import { onboardingFlow } from '../config/onboarding-pages'

export function OnboardingProgressIndicator() {
  const { isActive, currentPageIndex, isPageCompleted, getProgress } = useGuidedOnboarding()

  if (!isActive) return null

  const progress = getProgress()

  return (
    <div className="fixed top-4 right-4 z-50 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-blue-500/20 p-4 max-w-sm">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Recorrido Guiado</h3>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
            {progress.current} de {progress.total}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        {/* Current Step */}
        <p className="text-xs text-gray-600">
          Ahora: <span className="font-semibold text-gray-900">{progress.currentPageTitle}</span>
        </p>

        {/* Steps List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {onboardingFlow.map((page, index) => {
            const isCompleted = isPageCompleted(page.page)
            const isCurrent = index === currentPageIndex
            const isPending = index > currentPageIndex

            return (
              <div
                key={page.page}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : isCompleted
                    ? 'bg-green-50'
                    : 'bg-gray-50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                ) : isCurrent ? (
                  <Circle className="w-4 h-4 text-blue-600 fill-blue-600 flex-shrink-0 animate-pulse" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-blue-900'
                      : isCompleted
                      ? 'text-green-900'
                      : isPending
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                >
                  {page.title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer Message */}
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            {progress.current < progress.total
              ? 'Completa cada paso para terminar el recorrido'
              : '¡Último paso! Estás a punto de terminar'}
          </p>
        </div>
      </div>
    </div>
  )
}
