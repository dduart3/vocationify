export interface OnboardingStep {
  element: string
  popover: {
    title: string
    description: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
  }
}

export interface OnboardingConfig {
  steps: OnboardingStep[]
  showProgress?: boolean
  showButtons?: string[]
  disableActiveInteraction?: boolean
  allowClose?: boolean
  overlayOpacity?: number
  smoothScroll?: boolean
  animate?: boolean
  onDestroyed?: () => void
}

export interface OnboardingPageConfig {
  page: 'dashboard' | 'careers' | 'schools' | 'results' | 'profile' | 'vocational-test'
  route: string
  title: string
  steps: OnboardingStep[]
  order: number
}

export interface OnboardingProgress {
  currentPageIndex: number
  completedPages: string[]
  isActive: boolean
  startedAt: string | null
}
