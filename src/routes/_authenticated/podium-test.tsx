import { createFileRoute } from '@tanstack/react-router'
import { PodiumDevTest } from '@/components/PodiumDevTest'

export const Route = createFileRoute('/_authenticated/podium-test')({
  component: PodiumDevTest,
})