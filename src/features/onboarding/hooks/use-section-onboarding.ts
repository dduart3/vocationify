import { useEffect, useRef, useCallback } from 'react'
import { driver } from 'driver.js'
import type { Driver, DriveStep } from 'driver.js'
import { useOnboardingStore, type OnboardingSection } from '../store/onboarding-store'
import { useAuth } from '@/context/auth-context'
import type { OnboardingStep } from '../types'
import 'driver.js/dist/driver.css'

interface UseSectionOnboardingOptions {
  section: OnboardingSection
  steps: OnboardingStep[]
  autoStart?: boolean
  delay?: number
}

export function useSectionOnboarding({
  section,
  steps,
  autoStart = true,
  delay = 1000
}: UseSectionOnboardingOptions) {
  const { profile, updateProfile } = useAuth()
  const driverInstance = useRef<Driver | null>(null)

  const {
    shouldShowOnboarding,
    markSectionCompleted,
    markSectionSkipped,
    isSectionCompleted,
    isSectionSkipped,
    isFullyCompleted
  } = useOnboardingStore()

  const shouldShow = shouldShowOnboarding(section) && profile?.onboarding_completed === false

  // Check and update DB if all sections are completed
  const checkAndCompleteOnboarding = useCallback(async () => {
    if (isFullyCompleted() && profile?.onboarding_completed === false) {
      try {
        await updateProfile({ onboarding_completed: true })
        console.log('✅ Onboarding fully completed! Marked in database.')
      } catch (error) {
        console.error('Error marking onboarding as completed:', error)
      }
    }
  }, [isFullyCompleted, profile?.onboarding_completed, updateProfile])

  // Complete section
  const completeSection = useCallback(() => {
    markSectionCompleted(section)
    driverInstance.current?.destroy()
    checkAndCompleteOnboarding()
  }, [section, markSectionCompleted, checkAndCompleteOnboarding])

  // Skip section
  const skipSection = useCallback(() => {
    markSectionSkipped(section)
    driverInstance.current?.destroy()
    checkAndCompleteOnboarding()
  }, [section, markSectionSkipped, checkAndCompleteOnboarding])

  // Start the tour
  const startTour = useCallback(() => {
    if (driverInstance.current) {
      driverInstance.current.destroy()
    }

    // Add skip button to the steps
    const stepsWithSkip: DriveStep[] = steps.map((step, index) => ({
      element: step.element,
      popover: {
        title: step.popover.title,
        description: step.popover.description,
        side: step.popover.side || 'bottom',
        align: step.popover.align || 'start',
        showButtons: index === 0 ? ['next', 'close'] : ['previous', 'next', 'close'],
        nextBtnText: index === steps.length - 1 ? 'Finalizar' : 'Siguiente',
        prevBtnText: 'Anterior',
        closeBtnText: 'Omitir Tutorial',
      }
    }))

    let wasCompleted = false

    driverInstance.current = driver({
      showProgress: true,
      allowClose: false, // Prevent closing by clicking outside
      disableActiveInteraction: true,
      steps: stepsWithSkip,
      onCloseClick: () => {
        // Skip button clicked
        skipSection()
      },
      onNextClick: () => {
        // Check if this is the last step before moving
        const currentDriver = driverInstance.current
        if (currentDriver && currentDriver.isLastStep()) {
          wasCompleted = true
        }
        currentDriver?.moveNext()
      },
      onDestroyed: () => {
        // If we completed all steps, mark as completed
        if (wasCompleted) {
          completeSection()
        }
      }
    })

    setTimeout(() => {
      driverInstance.current?.drive()
    }, 300)
  }, [steps, completeSection, skipSection])

  // Auto-start when conditions are met
  useEffect(() => {
    if (!autoStart || !shouldShow) {
      // Clean up any existing driver instance
      if (driverInstance.current) {
        driverInstance.current.destroy()
        driverInstance.current = null
      }
      return
    }

    const timer = setTimeout(() => {
      startTour()
    }, delay)

    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, shouldShow, delay, section])

  return {
    shouldShow,
    isCompleted: isSectionCompleted(section),
    isSkipped: isSectionSkipped(section),
    startTour,
    skipSection,
    completeSection,
    driverInstance: driverInstance.current
  }
}
