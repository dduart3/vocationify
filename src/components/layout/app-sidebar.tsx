import { Link, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import {
  IconDashboard,
  IconFileText,
  IconChartBar,
  IconSchool,
  IconSettings,
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
    url: "/resultados",
    icon: IconChartBar,
  },
  {
    title: "Explorar Carreras",
    url: "/carreras",
    icon: IconSchool,
  },
  {
    title: "Configuración",
    url: "/configuracion",
    icon: IconSettings,
  },
];

export function AppSidebar() {
  const { user, profile, signOut } = useAuthStore();
  const { isHovered, setHovered } = useSidebarStore();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sidebarRef.current && arrowRef.current) {
      // Animate sidebar width
      gsap.to(sidebarRef.current, {
        width: isHovered ? "240px" : "50px",
        ease: "power3.out",
        duration: 0.5,
      });

      // Animate arrow position to follow the sidebar edge
      gsap.to(arrowRef.current, {
        left: isHovered ? "232px" : "42px",
        ease: "power3.out",
        duration: 0.5,
      });

      gsap.to(".sidebar-content", {
        opacity: isHovered ? 1 : 0,
        x: isHovered ? 0 : -20,
        delay: isHovered ? 0.2 : 0,
        duration: 0.3,
      });

      gsap.to(".chevron-arrow", {
        rotate: isHovered ? 180 : 0,
        duration: 0.4,
        ease: "power2.out",
      });

      // Animate collapsed logo
      gsap.to(".collapsed-logo", {
        opacity: isHovered ? 0 : 1,
        scale: isHovered ? 0.8 : 1,
        delay: isHovered ? 0 : 0.3,
        duration: 0.3,
        ease: "power2.out",
      });

      // Animate collapsed navigation icons
      gsap.to(".collapsed-nav", {
        opacity: isHovered ? 0 : 1,
        y: isHovered ? -10 : 0,
        delay: isHovered ? 0 : 0.3,
        duration: 0.3,
        ease: "power2.out",
      });

      // Animate collapsed avatar
      gsap.to(".collapsed-avatar", {
        opacity: isHovered ? 0 : 1,
        scale: isHovered ? 0.8 : 1,
        delay: isHovered ? 0 : 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isHovered]);

  // Clear any existing timeout
  const clearHoverTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Debounced hover handlers - ONLY CHANGE to fix race conditions
  const handleMouseEnter = useCallback(() => {
    clearHoverTimeout();
    if (!isHovered) {
      setHovered(true);
    }
  }, [isHovered, setHovered, clearHoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    clearHoverTimeout();
    // Add small delay before closing to prevent flickering
    timeoutRef.current = setTimeout(() => {
      setHovered(false);
      timeoutRef.current = null;
    }, 150); // Small 150ms delay
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
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex flex-col py-6 px-3 relative"
        style={{
          width: "50px",
          background: `linear-gradient(90deg,
            transparent 50%,                   
            transparent 100%
          )`,
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 50px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Collapsed Logo - Only visible when sidebar is closed */}
        <div className="collapsed-logo absolute top-6 left-1/2 -translate-x-1/2 opacity-0">
          <Link to="/" className="block group">
            <Logo
              size={28}
              className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
            />
          </Link>
        </div>

        {/* Collapsed Navigation Icons - Only visible when sidebar is closed */}
        <div className="collapsed-nav absolute top-20 left-1/2 -translate-x-1/2 opacity-0 flex flex-col space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
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
        <div className="collapsed-avatar absolute bottom-16 left-1/2 -translate-x-1/2 opacity-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
            <span className="text-white text-xs font-semibold">
              {(profile?.first_name || user?.email || "U")[0]?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Collapsed Sign Out - Only visible when sidebar is closed */}
        <div className="collapsed-nav absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0">
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

        <div className="flex flex-col flex-1 sidebar-content opacity-0">
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
              const isActive = location.pathname === item.url;
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
          <div className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-white/5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {(profile?.first_name || user?.email || "U")[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white">
                {profile?.first_name || user?.email?.split("@")[0]}
              </span>
              <span className="text-xs text-neutral-400">Estudiante</span>
            </div>
          </div>

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
        ref={arrowRef}
        className="flex items-center justify-center absolute top-1/2 -translate-y-1/2 cursor-pointer bg-none"
        style={{ left: "42px" }}
        onMouseEnter={handleMouseEnter}
      >
        <div className="chevron-arrow p-1  ">
          <IconChevronRight
            size={22}
            className="text-neutral-300 hover:text-white transition-colors duration-300"
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
}

function SidebarLink({ to, icon, label, isActive }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={`flex items-center p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 group ${
        isActive ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white" : ""
      }`}
    >
      <span className="mr-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <span className="text-sm font-normal">{label}</span>
    </Link>
  );
}
