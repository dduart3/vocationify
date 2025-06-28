import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { handleServerError } from '@/utils/handle-server-error'
import './index.css'

// Generated Routes
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (import.meta.env.DEV) console.log({ failureCount, error })
        if (failureCount >= 2 && import.meta.env.DEV) return false
        if (failureCount > 3 && import.meta.env.PROD) return false
        return !(
          error instanceof AxiosError &&
          [401, 403, 404].includes(error.response?.status ?? 0)
        )
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)
        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Content not modified', {
              description: 'The content has not been updated.',
            })
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status
        
        if (status === 401) {
          toast.error('Session expired!', {
            description: 'Please sign in again to continue.',
            action: {
              label: 'Sign In',
              onClick: () => {
                const redirect = `${router.history.location.href}`
                router.navigate({ to: '/auth/sign-in', search: { redirect } })
              },
            },
          })
        }
        
        if (status === 500) {
          toast.error('Server Error!', {
            description: 'Something went wrong on our end. Please try again.',
            action: {
              label: 'Retry',
              onClick: () => window.location.reload(),
            },
          })
          router.navigate({ to: '/error/500' })
        }
        
        if (status === 403) {
          toast.error('Access Denied!', {
            description: 'You do not have permission to access this resource.',
          })
          router.navigate({ to: '/error/403' })
        }

        if (status === 404) {
          router.navigate({ to: '/error/404' })
        }
      }
    },
  }),
})

// Create router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  ),
  defaultErrorComponent: ({ error }) => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center max-w-md">
        <h1 className="heading-secondary mb-4">Something went wrong!</h1>
        <p className="text-body mb-6">{error.message}</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Reload Page
          </button>
          <button 
            onClick={() => router.navigate({ to: '/' })} 
            className="btn-secondary"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  ),
})

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster 
          position="top-right"
          expand={true}
          richColors
          closeButton
          toastOptions={{
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </QueryClientProvider>
    </StrictMode>
  )
}
