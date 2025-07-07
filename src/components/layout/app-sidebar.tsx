import { Link, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useRef, useEffect } from "react";
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
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Evaluaciones",
    url: "/evaluaciones",
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
    }
  }, [isHovered]);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

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
          background: `
            linear-gradient(135deg, 
              rgba(15, 23, 42, 0.95) 0%, 
              rgba(30, 41, 59, 0.9) 30%,
              rgba(51, 65, 85, 0.85) 60%,
              rgba(15, 23, 42, 0.95) 100%
            )
          `,
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.37),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
          `,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRight: "1px solid rgba(59, 130, 246, 0.15)",
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
            <span className="font-bold text-lg text-white drop-shadow-sm">
              Vocationify
            </span>
          </Link>

          {/* User Profile */}
          <div
            className="flex items-center space-x-3 mb-6 p-3 rounded-lg"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-semibold">
                {(profile?.full_name || user?.email || "U")[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white drop-shadow-sm">
                {profile?.full_name || user?.email?.split("@")[0]}
              </span>
              <span className="text-xs text-neutral-300">Estudiante</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
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

          {/* Sign Out */}
          <div className="mt-auto pt-4">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group"
              style={{
                backdropFilter: "blur(4px)",
              }}
            >
              <IconLogout
                size={16}
                className="mr-3 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chevron Arrow - Follows the sidebar edge dynamically */}
      <div
        ref={arrowRef}
        className="flex items-center justify-center absolute top-1/2 -translate-y-1/2 cursor-pointer"
        style={{ left: "45px" }}
        onMouseEnter={handleMouseEnter}
      >
        <IconChevronRight
          size={24}
          className="text-neutral-300 hover:text-white transition-colors duration-300"
        />
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
      className={cn(
        "flex items-center p-2 rounded-lg transition-all duration-300 group relative",
        isActive ? "text-white shadow-lg" : "text-neutral-300 hover:text-white"
      )}
      style={{
        background: isActive
          ? "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)"
          : "transparent",
        border: isActive
          ? "1px solid rgba(59, 130, 246, 0.3)"
          : "1px solid transparent",
        backdropFilter: isActive ? "blur(8px)" : "none",
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
      )}

      <span className="mr-3 group-hover:scale-110 transition-transform duration-300 relative z-10">
        {icon}
      </span>
      <span className="text-sm font-medium relative z-10 drop-shadow-sm">
        {label}
      </span>

      {/* Hover glow effect */}
      {!isActive && (
        <div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}
    </Link>
  );
}
