import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ConversationalTestResults } from '@/features/vocational-test/components/conversational-test-results'

export const Route = createFileRoute('/_authenticated/vocational-test/results/$sessionId')({
  component: ConversationalTestResultsPage,
})

function ConversationalTestResultsPage() {
  const { sessionId } = Route.useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ConversationalTestResults 
        sessionId={sessionId}
        onRetakeTest={() => navigate({ to: '/vocational-test' })}
        onExploreAllCareers={() => {
          // TODO: Navigate to career explorer when implemented
          console.log('Navigate to career explorer')
        }}
      />
    </div>
  )
}