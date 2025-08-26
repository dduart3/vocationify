import { createFileRoute } from '@tanstack/react-router'
import { Register } from '@/features/auth/register'

export const Route = createFileRoute('/(auth)/register')({
  component: Register,
})
