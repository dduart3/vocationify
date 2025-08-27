import { createFileRoute } from '@tanstack/react-router'
import { OtpLogin } from '@/features/auth/otp'

export const Route = createFileRoute('/(auth)/otp')({
  component: OtpLogin,
})