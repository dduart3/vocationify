import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import GeneralError from '@/components/errors/general-error'
import NotFoundError from '@/components/errors/not-found-error'
import { useAuthStore } from '@/stores/auth-store'
import { useEffect } from 'react'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})

function RootComponent() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    // Initialize auth on mount
    initialize()
  }, [initialize])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
