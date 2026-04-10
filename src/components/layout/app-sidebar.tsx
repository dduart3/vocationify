import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useRef, useCallback, useEffect, useState } from "react";
import {
  IconDashboard,
  IconFileText,
  IconChartBar,
  IconSchool,
  IconBuilding,
  IconUser,
  IconLogout,
  IconMenu2,
  IconX,
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
  const { user, profile, signOut } = useAuth();
  const { isHovered, setHovered, isMobile, setMobile, isOpen, setOpen } = useSidebarStore();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [mounted, setMounted] = useState(false);

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

  // Detect mobile on mount and window resize
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768; // md breakpoint
      setMobile(isMobileView);
      // Close drawer when switching to desktop
      if (!isMobileView && isOpen) {
        setOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearHoverTimeout();
    };
  }, [clearHoverTimeout, setMobile, isOpen, setOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleLinkClick = () => {
    // Close mobile drawer when clicking a link
    if (isMobile && isOpen) {
      setOpen(false);
    }
  };

  // Mobile Hamburger Button
  if (!mounted) return null;

  if (isMobile) {
    return (
      <>
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setOpen(!isOpen)}
          className="fixed top-6 left-6 z-50 p-3 rounded-full bg-slate-50/80 backdrop-blur-md border border-white/50 hover:border-blue-300 hover:bg-blue-50/80 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,1)] group"
        >
          {isOpen ? (
            <IconX size={22} className="text-gray-700 group-hover:scale-90 transition-transform" />
          ) : (
            <IconMenu2 size={22} className="text-gray-700 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed left-0 top-0 h-full w-[280px] bg-slate-50/80 backdrop-blur-2xl z-50 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-r border-white/50 rounded-r-[2.5rem] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full py-8 px-4">
            {/* Logo */}
            <div className="flex items-center mb-8 px-2">
              <Link
                to="/"
                className="flex items-center gap-3"
                onClick={handleLinkClick}
              >
                <Logo size={48} showText={true} className="drop-shadow-sm" />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1.5 px-1">
              {menuItems.map((item) => {
                const isActive = isRouteActive(item.url);
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    onClick={handleLinkClick}
                    className={`flex items-center p-2 rounded-full relative transition-all duration-300 overflow-hidden group ${
                      isActive
                        ? "bg-gradient-to-b from-blue-50/80 to-blue-100/50 shadow-[0_4px_12px_rgba(59,130,246,0.12),inset_0_-2px_4px_rgba(59,130,246,0.05),inset_0_2px_4px_rgba(255,255,255,1)] border border-blue-200/60 text-blue-900"
                        : "text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] border border-transparent"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 -translate-x-[150%] animate-[glare-sweep-sidebar_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                    )}
                    <div 
                      className="flex items-center justify-center flex-shrink-0 w-9 h-9"
                    >
                      <item.icon 
                        size={20} 
                        className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-600' : ''}`}
                        stroke={isActive ? 2 : 1.5}
                      />
                    </div>
                    <span className={`text-[13px] font-medium ml-2 ${isActive ? 'text-blue-900' : ''}`}>
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="mt-auto space-y-1.5 px-1">
              {/* User Profile */}
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="flex items-center w-full rounded-full p-1.5 transition-all duration-300 overflow-hidden group text-gray-500 hover:text-gray-900 bg-transparent"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(37,99,235,0.2),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-blue-400/50 text-white group-hover:scale-105 transition-transform">
                  <span className="text-sm font-semibold">
                    {(profile?.first_name || user?.email || "U")[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col ml-3">
                  <span className="text-[13px] font-medium text-gray-900">
                    {profile?.first_name || user?.email?.split("@")[0]}
                  </span>
                  <span className="text-[11px] leading-none text-gray-500 font-medium mt-0.5">Estudiante</span>
                </div>
              </Link>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="flex items-center w-full rounded-full p-2 text-gray-500 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-center w-9 h-9 transition-transform duration-300 group-hover:scale-110">
                  <IconLogout size={20} stroke={1.5} />
                </div>
                <span className="text-[13px] font-medium ml-2">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar (hover-expand)
  return (
    <>
      <style>{`
        @keyframes glare-sweep-sidebar {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }
      `}</style>
      <div className="fixed left-0 top-0 h-full z-50 flex items-center pl-6">
        {/* Main Sidebar */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex flex-col py-6 relative transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] bg-slate-50/40 backdrop-blur-2xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.08)] rounded-[2.5rem] ${
          isHovered ? 'w-[240px]' : 'w-[64px]'
        } h-[calc(100vh-3rem)]`}
      >
        {/* Top Logo */}
        <div className="flex items-center mb-6 w-full flex-shrink-0 overflow-hidden px-2 mt-2">
          <Link 
            to="/" 
            className={`flex items-center w-full group rounded-full transition-all duration-300 ${isHovered ? 'gap-3 px-3' : 'justify-center'}`} 
            style={{ padding: '6px' }}
          >
            <Logo 
              size={46} 
              showText={isHovered} 
              className="drop-shadow-sm group-hover:scale-105 transition-transform duration-300" 
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 flex-shrink-0 items-center px-2 w-full">
          {menuItems.map((item) => {
            const isActive = isRouteActive(item.url);
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex items-center w-full rounded-full relative transition-all duration-300 overflow-hidden group ${
                  isActive
                    ? 'bg-gradient-to-b from-blue-50/80 to-blue-100/50 shadow-[0_4px_12px_rgba(59,130,246,0.12),inset_0_-2px_4px_rgba(59,130,246,0.05),inset_0_2px_4px_rgba(255,255,255,1)] border border-blue-200/60 text-blue-900'
                    : 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-black/[0.04] border border-transparent'
                }`}
                title={!isHovered ? item.title : undefined}
                style={{
                  padding: '6px', 
                }}
              >
                {isActive && (
                  <div className="absolute inset-0 -translate-x-[150%] animate-[glare-sweep-sidebar_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                )}
                <div 
                  className={`flex items-center justify-center flex-shrink-0 transition-transform duration-300`}
                  style={{ width: '36px', height: '36px' }}
                >
                  <item.icon
                    size={20}
                    className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-600' : ''}`}
                    stroke={isActive ? 2 : 1.5}
                  />
                </div>
                <div 
                  className="flex flex-col justify-center whitespace-nowrap transition-opacity duration-300 ml-3"
                  style={{ opacity: isHovered ? 1 : 0 }}
                >
                  <span className={`font-medium text-[13px] ${isActive ? 'text-blue-900' : ''}`}>
                    {item.title}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1 py-4"></div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-1 w-full px-2 pb-2 flex-shrink-0 items-center">
          {/* User Profile */}
          <Link
            to="/profile"
            className={`flex items-center w-full rounded-full transition-all duration-300 overflow-hidden group text-gray-500 hover:text-gray-900 bg-transparent`}
            style={{
              padding: '6px',
            }}
          >
            <div className={`flex items-center justify-center flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_4px_10px_rgba(37,99,235,0.2),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-blue-400/50 text-white font-semibold transition-transform duration-300 group-hover:scale-110`}
                 style={{ width: '36px', height: '36px', fontSize: '13px' }}>
              {(profile?.first_name || user?.email || "U")[0]?.toUpperCase()}
            </div>
            
            <div
              className="flex flex-col justify-center whitespace-nowrap transition-opacity duration-300 ml-3"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <span className="text-[13px] font-medium text-gray-900">
                {profile?.first_name || user?.email?.split("@")[0]}
              </span>
              <span className="text-[10px] leading-none text-gray-500 mt-1 font-medium">Estudiante</span>
            </div>
          </Link>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className={`flex items-center w-full rounded-full transition-all duration-300 overflow-hidden group text-gray-500 hover:text-red-600 hover:bg-red-50/50`}
            title={!isHovered ? "Cerrar Sesión" : undefined}
            style={{
              padding: '6px',
            }}
          >
            <div 
              className="flex items-center justify-center flex-shrink-0 transition-transform duration-300"
              style={{ width: '36px', height: '36px' }}
            >
              <IconLogout
                size={20}
                className="transition-transform duration-300 group-hover:scale-110"
                stroke={1.5}
              />
            </div>
            <div
              className="flex flex-col justify-center whitespace-nowrap transition-opacity duration-300 ml-3"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <span className="font-medium text-[13px]">
                Cerrar Sesión
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
