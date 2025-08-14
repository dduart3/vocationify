import { CareerDetail } from './components/career-detail'

interface CareerDetailPageProps {
  careerId: string
}

export function CareerDetailPage({ careerId }: CareerDetailPageProps) {
  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <CareerDetail careerId={careerId} />
      </div>
    </div>
  )
}