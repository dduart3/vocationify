import { createFileRoute } from '@tanstack/react-router'
import { ResultDetail } from '@/features/results/components'

export const Route = createFileRoute('/_authenticated/vocational-test/results/$sessionId')({
  component: ResultDetailPage,
})

function ResultDetailPage() {
  const { sessionId } = Route.useParams()

  return (
    <div className="min-h-screen p-6">
      <ResultDetail resultId={sessionId} />
    </div>
  )
}