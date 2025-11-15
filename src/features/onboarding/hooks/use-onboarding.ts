import { useEffect, useRef } from 'react'
import { driver } from 'driver.js'
import type { Driver } from 'driver.js'
import type { OnboardingStep, OnboardingConfig } from '../types'
import 'driver.js/dist/driver.css'

interface UseOnboardingOptions {
  steps: OnboardingStep[]
  enabled?: boolean
  onComplete?: () => void
  storageKey?: string
}

export function useOnboarding({
  steps,
  enabled = true,
  onComplete,
  storageKey
}: UseOnboardingOptions) {
  const driverInstance = useRef<Driver | null>(null)

  useEffect(() => {
    // Check if onboarding has been completed before
    if (storageKey && typeof window !== 'undefined') {
      const completed = localStorage.getItem(storageKey)
      if (completed === 'true') {
        return
      }
    }

    // Don't initialize if disabled or no steps
    if (!enabled || steps.length === 0) {
      return
    }

    // Create driver instance with custom configuration
    driverInstance.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: steps.map(step => ({
        element: step.element,
        popover: {
          title: step.popover.title,
          description: step.popover.description,
          side: step.popover.side || 'bottom',
          align: step.popover.align || 'start'
        }
      })),
      onDestroyed: () => {
        // Mark as completed when tour is finished
        if (storageKey && typeof window !== 'undefined') {
          localStorage.setItem(storageKey, 'true')
        }
        onComplete?.()
      }
    })

    return () => {
      driverInstance.current?.destroy()
    }
  }, [steps, enabled, onComplete, storageKey])

  const startTour = () => {
    driverInstance.current?.drive()
  }

  const resetTour = () => {
    if (storageKey && typeof window !== 'undefined') {
      localStorage.removeItem(storageKey)
    }
  }

  return {
    startTour,
    resetTour,
    driverInstance: driverInstance.current
  }
}

// Hook for dashboard onboarding specifically
export function useDashboardOnboarding(enabled: boolean = true) {
  return useOnboarding({
    steps: [], // Will be imported from config
    enabled,
    storageKey: 'vocationify-dashboard-onboarding-completed'
  })
}
