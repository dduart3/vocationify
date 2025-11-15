import { useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { driver } from 'driver.js'
import type { Driver } from 'driver.js'
import { useOnboardingStore } from '../store/onboarding-store'
import { onboardingFlow } from '../config/onboarding-pages'
import { useAuth } from '@/context/auth-context'
import 'driver.js/dist/driver.css'

interface UseGuidedOnboardingOptions {
  autoStart?: boolean
}

export function useGuidedOnboarding({ autoStart = false }: UseGuidedOnboardingOptions = {}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, updateProfile } = useAuth()
  const driverInstance = useRef<Driver | null>(null)

  // TODO: Fix onboarding store to support page-based flow
  // const {
  //   isActive,
  //   currentPageIndex,
  //   completedPages,
  //   setCurrentPageIndex,
  //   markPageCompleted,
  //   startOnboarding,
  //   completeOnboarding,
  //   resetOnboarding,
  //   isPageCompleted
  // } = useOnboardingStore()

  const { resetOnboarding } = useOnboardingStore()

  // Temporary placeholders until store is updated
  const isActive = false
  const currentPageIndex = 0
  const completedPages: string[] = []
  const setCurrentPageIndex = (_index: number) => {}
  const markPageCompleted = (_page: string) => {}
  const startOnboarding = () => {}
  const completeOnboarding = () => {}
  const isPageCompleted = (_page: string) => false

  // Get current page config
  const currentPage = onboardingFlow[currentPageIndex]
  const isLastPage = currentPageIndex === onboardingFlow.length - 1

  // Navigate to next page in onboarding flow
  const goToNextPage = useCallback(async () => {
    if (!currentPage) return

    // Mark current page as completed
    markPageCompleted(currentPage.page)

    if (isLastPage) {
      // Complete the entire onboarding flow
      try {
        await updateProfile({ onboarding_completed: true })
        completeOnboarding()
        driverInstance.current?.destroy()
      } catch (error) {
        console.error('Error completing onboarding:', error)
      }
    } else {
      // Move to next page
      const nextPageIndex = currentPageIndex + 1
      const nextPage = onboardingFlow[nextPageIndex]

      setCurrentPageIndex(nextPageIndex)

      // Navigate to next page
      await navigate({ to: nextPage.route })
    }
  }, [currentPage, currentPageIndex, isLastPage, markPageCompleted, setCurrentPageIndex, navigate, updateProfile, completeOnboarding])

  // Start tour for current page
  const startPageTour = useCallback(() => {
    if (!currentPage || !isActive) return

    // Destroy existing instance
    if (driverInstance.current) {
      driverInstance.current.destroy()
    }

    // Create new driver instance for current page
    driverInstance.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous'],
      allowClose: false, // Prevent closing by clicking outside
      disableActiveInteraction: true, // Prevent interaction with highlighted elements during tour
      steps: currentPage.steps.map((step, index) => ({
        element: step.element,
        popover: {
          title: step.popover.title,
          description: step.popover.description +
            (index === currentPage.steps.length - 1 && !isLastPage
              ? `\n\nAl terminar este paso, te llevaré a "${onboardingFlow[currentPageIndex + 1]?.title}" para continuar el recorrido.`
              : index === currentPage.steps.length - 1 && isLastPage
              ? '\n\n¡Este es el último paso! Al completarlo, terminarás el recorrido completo de Vocationify.'
              : ''),
          side: step.popover.side || 'bottom',
          align: step.popover.align || 'start'
        }
      })),
      onDestroyed: () => {
        // Only advance if all steps were completed (not manually closed)
        const currentDriver = driverInstance.current
        if (currentDriver && currentDriver.isLastStep()) {
          goToNextPage()
        }
      },
      onNextClick: () => {
        driverInstance.current?.moveNext()
      },
      onPrevClick: () => {
        driverInstance.current?.movePrevious()
      }
    })

    // Start the tour after a delay to ensure DOM is ready
    setTimeout(() => {
      driverInstance.current?.drive()
    }, 500)
  }, [currentPage, isActive, currentPageIndex, isLastPage, goToNextPage])

  // Initialize onboarding flow
  const beginOnboarding = useCallback(async () => {
    startOnboarding()

    // Navigate to first page
    const firstPage = onboardingFlow[0]
    await navigate({ to: firstPage.route })
  }, [startOnboarding, navigate])

  // Auto-start onboarding when conditions are met
  useEffect(() => {
    if (!profile) return

    // Check if user should see onboarding
    const shouldShowOnboarding =
      autoStart &&
      profile.onboarding_completed === false &&
      !isActive

    if (shouldShowOnboarding) {
      // Small delay before starting
      const timer = setTimeout(() => {
        beginOnboarding()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [autoStart, profile, isActive, beginOnboarding])

  // Start page tour when arriving at the correct page during active onboarding
  useEffect(() => {
    if (!isActive || !currentPage) return

    // Check if we're on the correct page for current onboarding step
    const currentPath = location.pathname
    const expectedPath = currentPage.route

    if (currentPath === expectedPath) {
      // Start the tour for this page
      startPageTour()
    }

    return () => {
      // Cleanup driver when changing pages
      driverInstance.current?.destroy()
    }
  }, [isActive, currentPage, location.pathname, startPageTour])

  // Force progress indicator
  const getProgress = useCallback(() => {
    return {
      current: currentPageIndex + 1,
      total: onboardingFlow.length,
      percentage: ((currentPageIndex + 1) / onboardingFlow.length) * 100,
      currentPageTitle: currentPage?.title || '',
      completedPages: completedPages.length
    }
  }, [currentPageIndex, currentPage, completedPages])

  return {
    isActive,
    currentPage,
    currentPageIndex,
    completedPages,
    isPageCompleted,
    beginOnboarding,
    resetOnboarding,
    startPageTour,
    goToNextPage,
    getProgress,
    driverInstance: driverInstance.current
  }
}
