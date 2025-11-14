import { createFileRoute, useRouter } from '@tanstack/react-router'
import { VocationalTest } from '@/features/vocational-test'
import { useAuth } from '@/context/auth-context'
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
  const { session } = useAuth()
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
