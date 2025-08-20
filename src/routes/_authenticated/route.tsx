import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { useAuthStore } from '@/stores/auth-store'
import { GlassmorphismLoader } from '@/components/ui/glassmorphism-loader'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { session, isAuthenticated, isLoading } = useAuthStore()
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <AppSidebar />
      
      {/* Main content area - Fixed positioning to prevent shifting */}
      <div className="fixed inset-0 w-full h-full flex flex-col">
        {/* Background effects for main content */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/8 to-pink-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Content area with fixed left padding */}
        <div className="relative z-10 flex-1 overflow-auto pl-[50px]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
