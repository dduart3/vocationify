import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { useSidebarStore } from '@/stores/sidebar-store'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    // Get the current auth state
    const { session, isAuthenticated } = useAuthStore.getState()
    console.log(session, isAuthenticated)
    
    // If no session or not authenticated, redirect to login
    if (!session || !isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
    
    // You can add role-based checks here if needed
    // const { profile } = useAuthStore.getState()
    // if (profile?.role !== 'admin') {
    //   throw redirect({ to: '/unauthorized' })
    // }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { isOpen } = useSidebarStore()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SidebarProvider defaultOpen={isOpen}>
        <AppSidebar />
        <div
          className={cn(
            'ml-auto w-full max-w-full transition-all duration-300 ease-in-out',
            'peer-data-[state=collapsed]:w-[calc(100%-60px)]',
            'peer-data-[state=expanded]:w-[calc(100%-280px)]',
            'flex h-screen flex-col relative'
          )}
        >
          {/* Background effects for main content */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/8 to-pink-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="relative z-10 flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
