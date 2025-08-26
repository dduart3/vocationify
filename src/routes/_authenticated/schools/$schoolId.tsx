import { createFileRoute } from '@tanstack/react-router'
import { SchoolDetailPage } from '@/features/schools/school-detail'

export const Route = createFileRoute('/_authenticated/schools/$schoolId')({
  component: () => {
    const { schoolId } = Route.useParams()
    return <SchoolDetailPage key={schoolId} schoolId={schoolId} />
  },
})