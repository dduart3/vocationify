import { SchoolDetail } from './components/school-detail'

interface SchoolDetailPageProps {
  schoolId: string
}

export function SchoolDetailPage({ schoolId }: SchoolDetailPageProps) {
  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <SchoolDetail schoolId={schoolId} />
      </div>
    </div>
  )
}