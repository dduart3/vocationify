import { Link, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useRef, useCallback, useEffect } from "react";
import {
  IconDashboard,
  IconFileText,
  IconChartBar,
  IconSchool,
  IconBuilding,
  IconUser,
  IconLogout,
  IconChevronRight,
} from "@tabler/icons-react";
import { Logo } from "@/components/logo";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Test Vocacional",
    url: "/vocational-test",
    icon: IconFileText,
  },
  {
    title: "Resultados",
    url: "/results",
    icon: IconChartBar,
  },
  {
    title: "Carreras",
    url: "/careers",
    icon: IconSchool,
  },
  {
    title: "Instituciones",
    url: "/schools",
    icon: IconBuilding,
  },
  {
    title: "Mi Perfil",
    url: "/profile",
    icon: IconUser,
  },
];

export function AppSidebar() {
  const { user, profile, signOut } = useAuthStore();
  const { isHovered, setHovered } = useSidebarStore();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to check if current route matches parent route
  const isRouteActive = (itemUrl: string) => {
    const currentPath = location.pathname;
    // Exact match
    if (currentPath === itemUrl) return true;
    // Parent route match (e.g., /careers matches /careers/123)
    if (currentPath.startsWith(itemUrl + '/')) return true;
    return false;
  };

  // Clear any existing timeout
  const clearHoverTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Simplified hover handlers
  const handleMouseEnter = useCallback(() => {
    clearHoverTimeout();
    setHovered(true);
  }, [setHovered, clearHoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    clearHoverTimeout();
    // Add small delay before closing to prevent flickering
    timeoutRef.current = setTimeout(() => {
      setHovered(false);
      timeoutRef.current = null;
    }, 100); // Reduced delay
  }, [setHovered, clearHoverTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearHoverTimeout();
    };
  }, [clearHoverTimeout]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full z-50 flex">
      {/* Main Sidebar */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex flex-col py-6 px-3 relative transition-all duration-500 ease-out ${
          isHovered ? 'w-60' : 'w-[50px]'
        }`}
        style={{
          background: `linear-gradient(90deg,
            transparent 50%,                   
            transparent 100%
          )`,
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Collapsed Logo - Only visible when sidebar is closed */}
        <div className={`absolute top-6 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          isHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100 delay-300'
        }`}>
          <Link to="/" className="block group">
            <Logo
              size={28}
              className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
            />
          </Link>
        </div>

        {/* Collapsed Navigation Icons - Only visible when sidebar is closed */}
        <div className={`absolute top-20 left-1/2 -translate-x-1/2 flex flex-col space-y-3 transition-all duration-300 ${
          isHovered ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0 delay-300'
        }`}>
          {menuItems.map((item) => {
            const isActive = isRouteActive(item.url);
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`p-2 rounded-lg transition-all duration-300 group flex items-center justify-center ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white shadow-lg" 
                    : "text-neutral-300 hover:text-white hover:bg-white/10"
                }`}
                title={item.title}
              >
                <item.icon 
                  size={18} 
                  className="group-hover:scale-110 transition-transform duration-300" 
                />
              </Link>
            );
          })}
        </div>

        {/* Collapsed Avatar - Only visible when sidebar is closed */}
        <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          isHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100 delay-300'
        }`}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
            <span className="text-white text-xs font-semibold">
              {(profile?.first_name || user?.email || "U")[0]?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Collapsed Sign Out - Only visible when sidebar is closed */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300 ${
          isHovered ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0 delay-300'
        }`}>
          <button
            onClick={handleSignOut}
            className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-300 group flex items-center justify-center"
            title="Cerrar Sesión"
          >
            <IconLogout 
              size={18} 
              className="group-hover:scale-110 transition-transform duration-300" 
            />
          </button>
        </div>

        <div className={`flex flex-col flex-1 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0 delay-200' : 'opacity-0 -translate-x-5'
        }`}>
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 mb-8 group"
          >
            <Logo
              size={32}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-bold text-lg text-white">Vocationify</span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-3">
            {menuItems.map((item) => {
              const isActive = isRouteActive(item.url);
              return (
                <SidebarLink
                  key={item.url}
                  to={item.url}
                  icon={<item.icon size={16} />}
                  label={item.title}
                  isActive={isActive}
                />
              );
            })}
          </nav>

          {/* User Profile - Moved to bottom */}
          <Link 
            to="/profile"
            className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xs font-semibold">
                {(profile?.first_name || user?.email || "U")[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
                {profile?.first_name || user?.email?.split("@")[0]}
              </span>
              <span className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors duration-300">Estudiante</span>
            </div>
          </Link>

          {/* Sign Out */}
          <div className="pt-2">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group"
            >
              <IconLogout
                size={16}
                className="mr-3 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-xs font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chevron Arrow - Follows the sidebar edge dynamically */}
      <div
        className={`flex items-center justify-center absolute top-1/2 -translate-y-1/2 cursor-pointer bg-none transition-all duration-500 ease-out ${
          isHovered ? 'left-[232px]' : 'left-[42px]'
        }`}
        onMouseEnter={handleMouseEnter}
      >
        <div className="p-1">
          <IconChevronRight
            size={22}
            className={`text-neutral-300 hover:text-white transition-all duration-400 ease-out ${
              isHovered ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: string;
}

function SidebarLink({ to, icon, label, isActive, badge }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 group ${
        isActive ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white" : ""
      }`}
    >
      <div className="flex items-center">
        <span className="mr-3 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
        <span className="text-sm font-normal">{label}</span>
      </div>
      {badge && (
        <span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
          {badge}
        </span>
      )}
    </Link>
  );
}
