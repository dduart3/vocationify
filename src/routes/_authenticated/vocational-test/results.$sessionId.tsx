import { createFileRoute } from '@tanstack/react-router'
import { ResultDetail } from '@/features/results/components'

export const Route = createFileRoute('/_authenticated/vocational-test/results/$sessionId')({
  component: ResultDetailPage,
})

function ResultDetailPage() {
  const { sessionId } = Route.useParams()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ResultDetail resultId={sessionId} />
      </div>
    </div>
  )
}