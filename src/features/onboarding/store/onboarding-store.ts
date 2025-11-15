import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type OnboardingSection =
  | 'dashboard'
  | 'vocational-test'
  | 'vocational-test-active'
  | 'results'
  | 'result-detail'
  | 'careers'
  | 'career-detail'
  | 'schools'
  | 'school-detail'
  | 'profile'

interface OnboardingSectionStatus {
  completed: boolean
  skipped: boolean
  completedAt: string | null
}

interface OnboardingStore {
  sections: Record<OnboardingSection, OnboardingSectionStatus>
  markSectionCompleted: (section: OnboardingSection) => void
  markSectionSkipped: (section: OnboardingSection) => void
  isSectionCompleted: (section: OnboardingSection) => boolean
  isSectionSkipped: (section: OnboardingSection) => boolean
  shouldShowOnboarding: (section: OnboardingSection) => boolean
  getAllCompletedSections: () => OnboardingSection[]
  getAllSkippedSections: () => OnboardingSection[]
  isFullyCompleted: () => boolean
  resetOnboarding: () => void
  resetSection: (section: OnboardingSection) => void
}

const initialSectionStatus: OnboardingSectionStatus = {
  completed: false,
  skipped: false,
  completedAt: null
}

const allSections: OnboardingSection[] = [
  'dashboard',
  'vocational-test',
  'vocational-test-active',
  'results',
  'result-detail',
  'careers',
  'career-detail',
  'schools',
  'school-detail',
  'profile'
]

const createInitialSections = (): Record<OnboardingSection, OnboardingSectionStatus> => {
  const sections: any = {}
  allSections.forEach(section => {
    sections[section] = { ...initialSectionStatus }
  })
  return sections
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      sections: createInitialSections(),

      markSectionCompleted: (section: OnboardingSection) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [section]: {
              completed: true,
              skipped: false,
              completedAt: new Date().toISOString()
            }
          }
        })),

      markSectionSkipped: (section: OnboardingSection) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [section]: {
              completed: false,
              skipped: true,
              completedAt: new Date().toISOString()
            }
          }
        })),

      isSectionCompleted: (section: OnboardingSection) =>
        get().sections[section]?.completed || false,

      isSectionSkipped: (section: OnboardingSection) =>
        get().sections[section]?.skipped || false,

      shouldShowOnboarding: (section: OnboardingSection) => {
        const sectionStatus = get().sections[section]
        return !sectionStatus?.completed && !sectionStatus?.skipped
      },

      getAllCompletedSections: () => {
        const { sections } = get()
        return allSections.filter(section => sections[section]?.completed)
      },

      getAllSkippedSections: () => {
        const { sections } = get()
        return allSections.filter(section => sections[section]?.skipped)
      },

      isFullyCompleted: () => {
        const { sections } = get()
        return allSections.every(
          section => sections[section]?.completed || sections[section]?.skipped
        )
      },

      resetOnboarding: () =>
        set({ sections: createInitialSections() }),

      resetSection: (section: OnboardingSection) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [section]: { ...initialSectionStatus }
          }
        })),
    }),
    {
      name: 'vocationify-onboarding-sections',
    }
  )
)
