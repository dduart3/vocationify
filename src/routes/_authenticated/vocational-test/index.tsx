import { createFileRoute } from '@tanstack/react-router'
import { VocationalTest } from '@/features/vocational-test'
import { z } from 'zod'

const searchSchema = z.object({
  sessionId: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/vocational-test/')({
  component: VocationalTestPage,
  validateSearch: searchSchema,
})

function VocationalTestPage() {
  return <VocationalTest />
}
