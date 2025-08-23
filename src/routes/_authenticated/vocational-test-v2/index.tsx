import { createFileRoute } from '@tanstack/react-router'
import { VocationalTest } from '@/features/vocational-test-v2'
import { useAuthStore } from '@/stores/auth-store'
import { z } from 'zod'

const searchSchema = z.object({
  sessionId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/vocational-test-v2/')({
  component: VocationalTestV2Page,
  validateSearch: searchSchema,
})

function VocationalTestV2Page() {
  const search = Route.useSearch()
  const { session } = useAuthStore()
  
  // Get user ID from auth
  const userId = session?.user?.id || 'anonymous'

  return (
    <VocationalTest
      userId={userId}
      sessionId={search.sessionId}
      onComplete={(sessionId) => {
        console.log('✅ Clean vocational test completed:', sessionId)
        // You can navigate to results page here if you have one
        console.log('Navigate to results for session:', sessionId)
      }}
    />
  )
}