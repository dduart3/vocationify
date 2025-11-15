# Onboarding Feature

Comprehensive section-based onboarding system using Driver.js for guiding new users through every part of the Vocationify platform.

## Setup

### 1. Install Driver.js

Stop the dev server first (to avoid file locking), then run:

```bash
cd vocationify
yarn add driver.js
```

### 2. Database Migration

Add the `onboarding_completed` field to the `profiles` table in Supabase:

```sql
-- Add onboarding_completed column to profiles table
ALTER TABLE profiles
ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;

-- Optional: Set all existing users to have completed onboarding (to avoid showing it retroactively)
UPDATE profiles
SET onboarding_completed = TRUE
WHERE created_at < NOW();
```

## Architecture

### Section-Based Onboarding

The onboarding system is split into **9 independent sections**, each with its own tour:

1. **Dashboard** - Overview of the platform
2. **Vocational Test** - How to take the RIASEC test (voice/text modes)
3. **Results** - Viewing test history
4. **Result Detail** - Understanding RIASEC charts and recommendations
5. **Careers** - Browsing career catalog
6. **Career Detail** - Viewing career details and school offerings
7. **Schools** - Exploring educational institutions
8. **School Detail** - Institution information and location
9. **Profile** - Updating personal information

### How It Works

1. Each section triggers **independently** when a user visits that page for the first time
2. Users can **skip** any section they want using the "Omitir Tutorial" button
3. Progress is tracked in **Zustand** (persisted to localStorage)
4. When **ALL sections** are either completed or skipped, `onboarding_completed` is set to `true` in the database
5. Users can **never accidentally close** the tour by clicking outside - they must explicitly skip or complete it

## Usage

### Basic Implementation

Wrap any page component with the `OnboardingProvider`:

```tsx
import { OnboardingProvider, dashboardSteps } from '@/features/onboarding'

export function Dashboard() {
  return (
    <OnboardingProvider section="dashboard" steps={dashboardSteps}>
      <div>
        {/* Your page content */}
      </div>
    </OnboardingProvider>
  )
}
```

### Available Sections and Steps

```tsx
import {
  dashboardSteps,           // Dashboard tour
  vocationalTestSteps,      // Test page tour
  resultsSteps,            // Results list tour
  resultDetailSteps,       // Result detail tour
  careersSteps,            // Careers list tour
  careerDetailSteps,       // Career detail tour
  schoolsSteps,            // Schools list tour
  schoolDetailSteps,       // School detail tour
  profileSteps             // Profile page tour
} from '@/features/onboarding'
```

### Manual Control

Use the `useSectionOnboarding` hook for manual control:

```tsx
import { useSectionOnboarding, vocationalTestSteps } from '@/features/onboarding'

function VocationalTest() {
  const { shouldShow, startTour, skipSection, isCompleted } = useSectionOnboarding({
    section: 'vocational-test',
    steps: vocationalTestSteps,
    autoStart: false // Don't auto-start
  })

  return (
    <div>
      {shouldShow && (
        <button onClick={startTour}>
          Ver Tutorial
        </button>
      )}
      {/* Page content */}
    </div>
  )
}
```

### Checking Completion Status

```tsx
import { useOnboardingStore } from '@/features/onboarding'

function MyComponent() {
  const {
    isSectionCompleted,
    isSectionSkipped,
    shouldShowOnboarding,
    isFullyCompleted,
    getAllCompletedSections
  } = useOnboardingStore()

  const dashboardDone = isSectionCompleted('dashboard')
  const testSkipped = isSectionSkipped('vocational-test')
  const allDone = isFullyCompleted()

  // ...
}
```

## Key Features

### 1. Independent Sections

Each section operates independently. Users can explore the app in any order, and each page will show its onboarding tour the first time they visit.

### 2. Skip Functionality

Every tour includes a "Omitir Tutorial" button. Skipping a section counts as completing it for the purposes of overall progress.

### 3. Auto-Completion to Database

When all 9 sections are either completed or skipped, the system automatically updates the `onboarding_completed` field in the database to `true`. No manual intervention needed!

### 4. Cannot Close Accidentally

Driver.js is configured with:
- `allowClose: false` - Can't click outside to close
- `disableActiveInteraction: true` - Can't interact with highlighted elements during tour
- Only way out: Complete the tour or click "Omitir Tutorial"

### 5. Progress Persistence

All progress is saved to localStorage via Zustand, so users don't lose progress if they refresh the page or come back later.

## Adding New Sections

### Step 1: Add IDs to Your Page Elements

```tsx
export function MyNewPage() {
  return (
    <div>
      <h1 id="my-page-header">Welcome</h1>
      <div id="my-feature">
        {/* content */}
      </div>
    </div>
  )
}
```

### Step 2: Define Steps in `onboarding-pages.ts`

```tsx
const myNewPageSteps: OnboardingStep[] = [
  {
    element: '#my-page-header',
    popover: {
      title: 'Título del Paso',
      description: 'Descripción en español de este paso.',
      side: 'bottom',
      align: 'start'
    }
  },
  // Add more steps...
]

// Export it
export { myNewPageSteps }
```

### Step 3: Add Section to Store

Update `onboarding-store.ts`:

```tsx
export type OnboardingSection =
  | 'dashboard'
  // ... other sections
  | 'my-new-page' // Add this

const allSections: OnboardingSection[] = [
  'dashboard',
  // ... other sections
  'my-new-page' // Add this
]
```

### Step 4: Wrap Your Page

```tsx
import { OnboardingProvider, myNewPageSteps } from '@/features/onboarding'

export function MyNewPage() {
  return (
    <OnboardingProvider section="my-new-page" steps={myNewPageSteps}>
      {/* Page content */}
    </OnboardingProvider>
  )
}
```

## Example: Vocational Test Onboarding

The vocational test page has comprehensive onboarding covering:

- Test header and progress bar
- Question display
- **Voice/Text toggle** - Explaining how to switch input modes
- **Audio controls** - How to listen to questions
- **Response options** - Likert scale explanation
- Navigation buttons

This ensures users understand all interaction modes before starting.

## Troubleshooting

### Tour doesn't start
- Check console for errors
- Verify Driver.js is installed: `yarn list driver.js`
- Ensure target elements have the correct IDs
- Check that `profile.onboarding_completed` is `false` in database

### Elements not highlighted
- Verify element IDs match exactly (case-sensitive)
- Use browser DevTools to inspect if element exists
- Check CSS z-index conflicts

### Database not updating after completing all sections
- Check browser console for API errors
- Verify `isFullyCompleted()` returns `true` in Zustand store
- Ensure `updateProfile` mutation works properly
- Check Supabase RLS policies on profiles table

### Onboarding shows again after completing
- Clear localStorage: `localStorage.removeItem('vocationify-onboarding-sections')`
- Check database: `SELECT onboarding_completed FROM profiles WHERE id = 'user-id'`
- If database shows `false`, manually set to `true`

## API Reference

### `useSectionOnboarding`

```tsx
interface UseSectionOnboardingOptions {
  section: OnboardingSection
  steps: OnboardingStep[]
  autoStart?: boolean  // Default: true
  delay?: number       // Default: 1000ms
}

const {
  shouldShow,         // boolean: Should this section's tour show?
  isCompleted,        // boolean: Is this section completed?
  isSkipped,          // boolean: Was this section skipped?
  startTour,          // function: Manually start the tour
  skipSection,        // function: Skip this section
  completeSection,    // function: Mark as completed
  driverInstance      // Driver: The Driver.js instance
} = useSectionOnboarding(options)
```

### `useOnboardingStore`

```tsx
const {
  sections,                // Record<OnboardingSection, SectionStatus>
  markSectionCompleted,    // (section) => void
  markSectionSkipped,      // (section) => void
  isSectionCompleted,      // (section) => boolean
  isSectionSkipped,        // (section) => boolean
  shouldShowOnboarding,    // (section) => boolean
  getAllCompletedSections, // () => OnboardingSection[]
  getAllSkippedSections,   // () => OnboardingSection[]
  isFullyCompleted,        // () => boolean
  resetOnboarding,         // () => void
  resetSection             // (section) => void
} = useOnboardingStore()
```

## File Structure

```
src/features/onboarding/
├── components/
│   ├── onboarding-provider.tsx           # Wrapper component
│   └── onboarding-progress-indicator.tsx # Visual progress (optional)
├── config/
│   ├── onboarding-pages.ts              # All step definitions
│   └── onboarding-steps.ts              # Legacy (keep for reference)
├── hooks/
│   ├── use-section-onboarding.ts        # Main hook for sections
│   ├── use-guided-onboarding.ts         # Legacy multi-page flow
│   └── use-onboarding.ts                # Legacy single-page hook
├── store/
│   └── onboarding-store.ts              # Zustand store
├── types/
│   └── index.ts                         # TypeScript interfaces
├── index.ts                             # Public API exports
└── README.md                            # This file
```

## Best Practices

1. **Element IDs** - Use descriptive, unique IDs (e.g., `#career-filters`, not `#filters`)
2. **Spanish Language** - All onboarding text must be in Spanish
3. **Step Order** - Order steps logically from top-to-bottom, left-to-right
4. **Context** - Each step description should explain WHAT the element is AND WHY it's useful
5. **Skip Option** - Always allow users to skip - don't force completion
6. **Testing** - Test onboarding on mobile and desktop views
7. **Database Sync** - Trust the auto-completion system - don't manually update the database

## Future Enhancements

- [ ] Add "Restart Tour" button in each page
- [ ] Show overall progress indicator across all sections
- [ ] Add analytics tracking for skipped vs. completed sections
- [ ] Implement conditional tours based on user role
- [ ] Add video demos embedded in tour steps
- [ ] Create admin panel to customize onboarding steps
- [ ] Add A/B testing for different onboarding flows
