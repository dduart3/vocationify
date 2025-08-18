import { CareerDetail } from './components/career-detail'

interface CareerDetailPageProps {
  careerId: string
}

export function CareerDetailPage({ careerId }: CareerDetailPageProps) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <CareerDetail careerId={careerId} />
      </div>
    </div>
  )
}