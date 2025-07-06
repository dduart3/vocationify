import { useRef, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { 
  IconDashboard,
  IconUser,
  IconSettings,
  IconSchool,
  IconBrain,
  IconMicrophone,
  IconChartBar,
  IconLogout,
  IconSparkles,
  IconChevronRight,
  IconHome
} from '@tabler/icons-react'
import { Logo } from '@/components/logo'
import { useAuthStore } from '@/stores/auth-store'
import { useSidebarStore } from '@/stores/sidebar-store'
import { cn } from '@/lib/utils'
import gsap from 'gsap'

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: IconDashboard,
    isActive: true,
  },
  {
    title: 'Orientación Vocacional',
    icon: IconBrain,
    items: [
      {
        title: 'Test Vocacional',
        url: '/dashboard/vocational-test',
        icon: IconBrain,
      },
      {
        title: 'Asistente de Voz',
        url: '/dashboard/voice-assistant',
        icon: IconMicrophone,
      },
    ],
  },
  {
    title: 'Análisis',
    url: '/dashboard/analytics',
    icon: IconChartBar,
  },
  {
    title: 'Universidades',
    url: '/dashboard/universities',
    icon: IconSchool,
  },
  {
    title: 'Perfil',
    url: '/dashboard/profile',
    icon: IconUser,
  },
  {
    title: 'Configuración',
    url: '/dashboard/settings',
    icon: IconSettings,
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const { user, profile, signOut } = useAuthStore()
  const { setActiveItem } = useSidebarStore()
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sidebar = sidebarRef.current
    if (!sidebar) return

    // Animate sidebar entrance
    gsap.fromTo(sidebar, 
      { x: -280, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    )
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <Sidebar 
      ref={sidebarRef}
      collapsible="icon"
      className="border-r-0"
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: `
          20px 0 40px -12px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 255, 255, 0.05),
          inset -1px 0 0 rgba(255, 255, 255, 0.1)
        `,
      }}
    >
      <SidebarHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-3 px-3">
          <div className="relative">
            <Logo size={32} className="drop-shadow-lg" />
            <div className="absolute inset-0 bg-blue-500/15 rounded-full blur-md scale-125 animate-pulse"></div>
          </div>
          {state === 'expanded' && (
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Vocationify
              </h1>
              <IconSparkles size={14} className="text-blue-400 animate-pulse" />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url || 
                           (item.items && item.items.some(subItem => location.pathname === subItem.url))
            
            if (item.items) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={cn(
                      "group relative rounded-xl transition-all duration-300 mb-1",
                      "hover:bg-white/10 hover:text-white",
                      isActive && "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/10"
                    )}
                  >
                    <item.icon size={20} className="text-blue-400" />
                    <span className="font-medium">{item.title}</span>
                    <IconChevronRight size={16} className="ml-auto transition-transform group-data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isSubActive = location.pathname === subItem.url
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              "rounded-lg transition-all duration-300 ml-6",
                              "hover:bg-white/10 hover:text-white",
                              isSubActive && "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/10"
                            )}
                          >
                            <Link to={subItem.url} onClick={() => setActiveItem(subItem.title)}>
                              <subItem.icon size={16} className="text-blue-400" />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              )
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "rounded-xl transition-all duration-300 mb-1",
                    "hover:bg-white/10 hover:text-white hover:scale-[1.02]",
                    isActive && "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/10 shadow-lg"
                  )}
                >
                  <Link to={item.url} onClick={() => setActiveItem(item.title)}>
                    <item.icon size={20} className="text-blue-400" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 pt-4">
        {/* User Profile */}
        {state === 'expanded' && (
          <div 
            className="mb-4 p-3 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.full_name || 'Usuario'}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-xl transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              <Link to="/">
                <IconHome size={20} className="text-slate-400" />
                <span>Volver al Inicio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="rounded-xl transition-all duration-300 hover:bg-red-500/20 hover:text-red-400 text-slate-400"
            >
              <IconLogout size={20} />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
