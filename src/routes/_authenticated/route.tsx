import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { useAuth } from '@/context/auth-context'
import { GlassmorphismLoader } from '@/components/ui/glassmorphism-loader'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { session, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Only check auth after loading is complete
    if (!isLoading && (!session || !isAuthenticated)) {
      navigate({ to: '/login' })
    }
  }, [session, isAuthenticated, isLoading, navigate])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <GlassmorphismLoader 
        size="lg" 
        text="Verificando autenticación..." 
        fullScreen 
      />
    )
  }

  // Don't render if not authenticated
  if (!session || !isAuthenticated) {
    return null
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 overflow-hidden">
      <AppSidebar />

      {/* Main content area - Fixed positioning to prevent shifting */}
      <div className="fixed inset-0 w-full h-full flex flex-col">
        {/* Stronger background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(99 102 241 / 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* More prominent accent gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-200/40 via-indigo-100/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-200/30 via-pink-100/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Content area with fixed left padding */}
        <div className="relative z-10 flex-1 overflow-auto pl-[50px]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
