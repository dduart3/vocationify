import { createFileRoute, useRouter } from '@tanstack/react-router'
import { VocationalTest } from '@/features/vocational-test-v2'
import { useAuthStore } from '@/stores/auth-store'
import { z } from 'zod'

const searchSchema = z.object({
  sessionId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/vocational-test/')({
  component: VocationalTestPage,
  validateSearch: searchSchema,
})

function VocationalTestPage() {
  const search = Route.useSearch()
  const { session } = useAuthStore()
  const router = useRouter()
  
  // Get user ID from auth
  const userId = session?.user?.id || 'anonymous'

  return (
    <VocationalTest
      userId={userId}
      sessionId={search.sessionId}
      onComplete={(sessionId) => {
        console.log('✅ Vocational test completed:', sessionId)
        // Navigate to results page
        router.navigate({ 
          to: '/results/$sessionId',
          params: { sessionId }
        })
      }}
    />
  )
}
