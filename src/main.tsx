import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { handleServerError } from '@/utils/handle-server-error'
import { GlassmorphismLoader } from '@/components/ui/glassmorphism-loader'
import './index.css'

// Generated Routes
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false, // Disable automatic refetch on window focus
      refetchOnMount: false, // Don't refetch on component mount if data exists
      refetchOnReconnect: false, // Don't refetch on reconnect
      staleTime: Infinity, // Data never goes stale, always use cached data
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)
        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Contenido no modificado', {
              description: 'El contenido no ha sido actualizado.',
            })
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      // Handle Axios errors (REST API)
      if (error instanceof AxiosError) {
        const status = error.response?.status

        if (status === 401) {
          toast.error('¡Sesión expirada!', {
            description: 'Por favor, inicia sesión nuevamente para continuar.',
            action: {
              label: 'Iniciar Sesión',
              onClick: () => {
                const redirect = `${router.history.location.href}`
                router.navigate({ to: '/login', search: { redirect } })
              },
            },
          })
        }

        if (status === 500) {
          toast.error('¡Error del Servidor!', {
            description: 'Algo salió mal de nuestro lado. Por favor, inténtalo de nuevo.',
            action: {
              label: 'Reintentar',
              onClick: () => window.location.reload(),
            },
          })
          router.navigate({ to: '/' })
        }

        if (status === 403) {
          toast.error('¡Acceso Denegado!', {
            description: 'No tienes permisos para acceder a este recurso.',
          })
          router.navigate({ to: '/' })
        }

        if (status === 404) {
          router.navigate({ to: '/' })
        }
      }

      // Handle Supabase errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()

        // Check for common Supabase auth errors
        if (errorMessage.includes('jwt') ||
            errorMessage.includes('token') ||
            errorMessage.includes('session') ||
            errorMessage.includes('refresh')) {
          console.error('Supabase auth error:', error)
          toast.error('Sesión expirada o inválida', {
            description: 'Por favor, inicia sesión nuevamente.',
            action: {
              label: 'Iniciar Sesión',
              onClick: () => {
                router.navigate({ to: '/login' })
              },
            },
          })
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
    <GlassmorphismLoader 
      size="lg" 
      text="Cargando página..." 
      fullScreen 
    />
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
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster
          position="top-right"
          expand={true}
        />
      </QueryClientProvider>
    </StrictMode>
  )
}
