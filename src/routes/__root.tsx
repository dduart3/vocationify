import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import GeneralError from '@/components/errors/general-error'
import NotFoundError from '@/components/errors/not-found-error'
import { AuthProvider } from '@/context/auth-context'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})

function RootComponent() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}
