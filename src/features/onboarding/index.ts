export { OnboardingProvider } from './components/onboarding-provider'
export { OnboardingProgressIndicator } from './components/onboarding-progress-indicator'
export { useSectionOnboarding } from './hooks/use-section-onboarding'
export { useGuidedOnboarding } from './hooks/use-guided-onboarding'
export { useOnboarding, useDashboardOnboarding } from './hooks/use-onboarding'
export {
  onboardingFlow,
  dashboardSteps,
  careersSteps,
  careerDetailSteps,
  schoolsSteps,
  schoolDetailSteps,
  resultsSteps,
  resultDetailSteps,
  vocationalTestSteps,
  vocationalTestLandingSteps,
  vocationalTestActiveSteps,
  profileSteps
} from './config/onboarding-pages'
export { useOnboardingStore, type OnboardingSection } from './store/onboarding-store'
export type { OnboardingStep, OnboardingConfig, OnboardingPageConfig, OnboardingProgress } from './types'
