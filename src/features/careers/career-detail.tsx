import { CareerDetail } from './components/career-detail'

interface CareerDetailPageProps {
  careerId: string
}

export function CareerDetailPage({ careerId }: CareerDetailPageProps) {
  return <CareerDetail key={careerId} careerId={careerId} />
}