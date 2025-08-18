import { SchoolDetail } from './components/school-detail'

interface SchoolDetailPageProps {
  schoolId: string
}

export function SchoolDetailPage({ schoolId }: SchoolDetailPageProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <SchoolDetail schoolId={schoolId} />
      </div>
    </div>
  )
}