import type { OnboardingSection } from '../store/onboarding-store'
import { useSectionOnboarding } from '../hooks/use-section-onboarding'
import type { OnboardingStep } from '../types'

interface OnboardingProviderProps {
  children: React.ReactNode
  section: OnboardingSection
  steps: OnboardingStep[]
  autoStart?: boolean
  delay?: number
}

export function OnboardingProvider({
  children,
  section,
  steps,
  autoStart = true,
  delay = 1000
}: OnboardingProviderProps) {
  // Initialize section-specific onboarding
  useSectionOnboarding({
    section,
    steps,
    autoStart,
    delay
  })

  return <>{children}</>
}
