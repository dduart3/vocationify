# Onboarding Implementation Guide

This document lists all the element IDs that need to be added to complete the onboarding system.

## ✅ Completed Pages

- **Dashboard** - All IDs added, OnboardingProvider wrapped
- **Careers** - All IDs added, OnboardingProvider wrapped
- **Schools** - All IDs added, OnboardingProvider wrapped
- **Results** - All IDs added, OnboardingProvider wrapped
- **Profile** - All IDs added, OnboardingProvider wrapped

## 🚧 Remaining Pages

### 1. Vocational Test Page

**File**: `src/features/vocational-test/components/vocational-test.tsx`

**Required IDs:**
- `id="test-header"` - Add to the main header/title section
- `id="test-progress-bar"` - Add to progress indicator element
- `id="question-display"` - Add to conversation history/question display area
- `id="voice-text-toggle"` - Add to UI mode switcher component
- `id="audio-controls"` - Add to voice interface controls
- `id="response-options"` - Add to message input area
- `id="navigation-buttons"` - Add to phase transition buttons

**OnboardingProvider:**
```tsx
import { OnboardingProvider, vocationalTestSteps } from '@/features/onboarding'

export function VocationalTest({ userId, sessionId, onComplete }: VocationalTestProps) {
  // ... existing code

  return (
    <OnboardingProvider section="vocational-test" steps={vocationalTestSteps}>
      {/* Existing JSX */}
    </OnboardingProvider>
  )
}
```

### 2. Result Detail Page

**File**: `src/features/results/components/result-detail.tsx`

**Required IDs:**
- `id="riasec-chart"` - Add to RiasecRadarChart component wrapper
- `id="riasec-scores-breakdown"` - Add to scores display section
- `id="career-recommendations"` - Add to career recommendations list
- `id="export-pdf-button"` - Add to PDFExport button/component

**OnboardingProvider:**
```tsx
import { OnboardingProvider, resultDetailSteps } from '@/features/onboarding'

export function ResultDetail() {
  // ... existing code

  return (
    <OnboardingProvider section="result-detail" steps={resultDetailSteps}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Back button */}
        </div>

        {/* RIASEC Chart Section */}
        <div id="riasec-chart">
          <RiasecRadarChart ... />
        </div>

        {/* Scores Breakdown */}
        <div id="riasec-scores-breakdown">
          {/* Score cards */}
        </div>

        {/* Career Recommendations */}
        <div id="career-recommendations">
          {/* Recommendations list */}
        </div>

        {/* Export Button */}
        <div id="export-pdf-button">
          <PDFExport ... />
        </div>
      </div>
    </OnboardingProvider>
  )
}
```

### 3. Career Detail Page

**File**: Find the career detail component (likely in `src/features/careers/components/` or similar)

**Required IDs:**
- `id="career-detail-header"` - Add to career name/title section
- `id="career-riasec-match"` - Add to RIASEC compatibility indicator
- `id="career-schools-list"` - Add to list of schools offering this career

**OnboardingProvider:**
```tsx
import { OnboardingProvider, careerDetailSteps } from '@/features/onboarding'

export function CareerDetail() {
  // ... existing code

  return (
    <OnboardingProvider section="career-detail" steps={careerDetailSteps}>
      {/* Header */}
      <div id="career-detail-header">
        <h1>Career Name</h1>
        {/* Description, etc */}
      </div>

      {/* RIASEC Match */}
      <div id="career-riasec-match">
        {/* Compatibility indicators */}
      </div>

      {/* Schools List */}
      <div id="career-schools-list">
        {/* Schools offering this career */}
      </div>
    </OnboardingProvider>
  )
}
```

### 4. School Detail Page

**File**: Find the school detail component (likely in `src/features/schools/components/` or similar)

**Required IDs:**
- `id="school-detail-header"` - Add to school name/info section
- `id="school-location-map"` - Add to map component or location display
- `id="school-careers-offered"` - Add to list of careers offered

**OnboardingProvider:**
```tsx
import { OnboardingProvider, schoolDetailSteps } from '@/features/onboarding'

export function SchoolDetail() {
  // ... existing code

  return (
    <OnboardingProvider section="school-detail" steps={schoolDetailSteps}>
      {/* Header */}
      <div id="school-detail-header">
        <h1>School Name</h1>
        {/* Address, contact, etc */}
      </div>

      {/* Location Map */}
      <div id="school-location-map">
        {/* Map component */}
      </div>

      {/* Careers Offered */}
      <div id="school-careers-offered">
        {/* List of careers */}
      </div>
    </OnboardingProvider>
  )
}
```

## Testing Checklist

After adding all IDs, test each section:

1. ✅ **Dashboard** - Verify tour highlights welcome section, stats, and quick actions
2. ✅ **Careers** - Verify tour highlights header, filters, and career list
3. ✅ **Schools** - Verify tour highlights header, filters, and schools list
4. ✅ **Results** - Verify tour highlights header and results table
5. ✅ **Profile** - Verify tour highlights header, form, and activity summary
6. ⬜ **Vocational Test** - Verify tour highlights all test components
7. ⬜ **Result Detail** - Verify tour highlights chart, scores, recommendations, and PDF button
8. ⬜ **Career Detail** - Verify tour highlights header, RIASEC match, and schools list
9. ⬜ **School Detail** - Verify tour highlights header, map, and careers list

## Database Verification

1. Ensure the migration was run:
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'profiles' AND column_name = 'onboarding_completed';
   ```

2. Check that new users have `onboarding_completed = FALSE`:
   ```sql
   SELECT id, email, onboarding_completed
   FROM profiles
   WHERE created_at > NOW() - INTERVAL '1 day';
   ```

3. After a user completes all 9 sections, verify database update:
   ```sql
   SELECT onboarding_completed
   FROM profiles
   WHERE id = 'user-id-here';
   ```

## Troubleshooting

### Tour doesn't start
1. Open browser DevTools console
2. Check for error: `Element not found: #element-id`
3. Verify the element exists in the DOM
4. Ensure ID exactly matches (case-sensitive)

### Multiple tours show simultaneously
- This shouldn't happen - each section is independent
- If it does, check for duplicate `<OnboardingProvider>` wrappers

### Database not updating
1. Check `isFullyCompleted()` in Zustand store
2. Verify all 9 sections show in localStorage
3. Check network tab for API call to `updateProfile`
4. Ensure Supabase RLS policies allow update

## Manual Testing Flow

1. **Clear onboarding state**:
   ```javascript
   localStorage.removeItem('vocationify-onboarding-sections')
   ```

2. **Set profile to show onboarding**:
   ```sql
   UPDATE profiles SET onboarding_completed = FALSE WHERE id = 'your-user-id';
   ```

3. **Visit pages in order** and complete/skip each tour:
   - Dashboard
   - Vocational Test
   - Results (need at least one test completed)
   - Result Detail (click into a result)
   - Careers
   - Career Detail (click into a career)
   - Schools
   - School Detail (click into a school)
   - Profile

4. **Verify completion**:
   ```sql
   SELECT onboarding_completed FROM profiles WHERE id = 'your-user-id';
   -- Should return TRUE
   ```

5. **Verify localStorage**:
   ```javascript
   JSON.parse(localStorage.getItem('vocationify-onboarding-sections'))
   // Should show all 9 sections as completed or skipped
   ```

## Next Steps

Once all IDs are added and tested:

1. Test on mobile devices (ensure IDs are present in responsive views)
2. Test with screen readers (ensure accessibility)
3. Consider adding analytics to track completion rates
4. Consider adding a "Restart Tour" button in each page's UI
5. Create user documentation explaining the onboarding system

## Questions?

Refer to the main README at `src/features/onboarding/README.md` for:
- API reference
- Adding new sections
- Customization options
- Full troubleshooting guide
