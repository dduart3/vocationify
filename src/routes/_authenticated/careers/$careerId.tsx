import { createFileRoute } from '@tanstack/react-router'
import { CareerDetailPage } from '@/features/careers/career-detail'

export const Route = createFileRoute('/_authenticated/careers/$careerId')({
  component: () => {
    const { careerId } = Route.useParams()
    return <CareerDetailPage careerId={careerId} />
  },
})