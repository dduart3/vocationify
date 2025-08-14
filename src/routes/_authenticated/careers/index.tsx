import { createFileRoute } from '@tanstack/react-router'
import { CareersPage } from '@/features/careers'

export const Route = createFileRoute('/_authenticated/careers/')({
  component: CareersPage,
})