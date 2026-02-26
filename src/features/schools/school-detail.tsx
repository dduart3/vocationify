import { SchoolDetail } from './components/school-detail'

interface SchoolDetailPageProps {
  schoolId: string
}

export function SchoolDetailPage({ schoolId }: SchoolDetailPageProps) {
  return <SchoolDetail key={schoolId} schoolId={schoolId} />
}