import { createFileRoute } from '@tanstack/react-router'
import { ResultsPage } from '@/features/results'

export const Route = createFileRoute('/_authenticated/results/')({
  component: ResultsPage,
})