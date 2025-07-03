import { createFileRoute } from '@tanstack/react-router'
import { AuthCallback } from '@/features/auth/auth-callback'

export const Route = createFileRoute('/(auth)/auth-callback')({
  component: AuthCallback,
})

