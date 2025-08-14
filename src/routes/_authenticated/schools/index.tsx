import { createFileRoute } from '@tanstack/react-router'
import { SchoolsPage } from '@/features/schools'

export const Route = createFileRoute('/_authenticated/schools/')({
  component: SchoolsPage,
})