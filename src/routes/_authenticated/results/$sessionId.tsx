import { createFileRoute } from '@tanstack/react-router'
import { ResultDetail } from '@/features/results/components/result-detail'

export const Route = createFileRoute('/_authenticated/results/$sessionId')({
  component: () => {
    const { sessionId } = Route.useParams()
    return <ResultDetail key={sessionId} />
  },
})