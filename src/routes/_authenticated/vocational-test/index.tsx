import { createFileRoute } from '@tanstack/react-router'
import { VocationalTest } from '@/features/vocational-test'

export const Route = createFileRoute('/_authenticated/vocational-test/')({
  component: VocationalTestPage,
})

function VocationalTestPage() {
  return <VocationalTest />
}
