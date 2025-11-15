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
  IconChevronRight,
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
          className="fixed top-4 left-4 z-50 p-3 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-lg"
        >
          {isOpen ? (
            <IconX size={24} className="text-gray-700" />
          ) : (
            <IconMenu2 size={24} className="text-gray-700" />
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
          className={`fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full py-6 px-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-3 mb-8"
              onClick={handleLinkClick}
            >
              <Logo size={32} />
              <span className="font-bold text-lg text-gray-900">Vocationify</span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => {
                const isActive = isRouteActive(item.url);
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    onClick={handleLinkClick}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile */}
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className="flex items-center space-x-3 mb-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {(profile?.first_name || user?.email || "U")[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {profile?.first_name || user?.email?.split("@")[0]}
                </span>
                <span className="text-xs text-gray-500">Estudiante</span>
              </div>
            </Link>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="flex items-center w-full p-3 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <IconLogout size={20} className="mr-3" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar (hover-expand)
  return (
    <div className="fixed left-0 top-0 h-full z-50 flex">
      {/* Main Sidebar */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`flex flex-col py-6 px-3 relative transition-all duration-500 ease-out bg-white border-r border-gray-200 ${
          isHovered ? 'w-60' : 'w-[50px]'
        }`}
        style={{
          boxShadow: "4px 0 24px rgba(0, 0, 0, 0.04)",
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
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer">
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
            className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 group flex items-center justify-center"
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
            <span className="font-bold text-lg text-gray-900">Vocationify</span>
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
            className="flex items-center space-x-3 mb-3 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xs font-semibold">
                {(profile?.first_name || user?.email || "U")[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {profile?.first_name || user?.email?.split("@")[0]}
              </span>
              <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Estudiante</span>
            </div>
          </Link>

          {/* Sign Out */}
          <div className="pt-2">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 group"
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
            className={`text-gray-400 hover:text-gray-600 transition-all duration-400 ease-out ${
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
      className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 group ${
        isActive
          ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center">
        <span className="mr-3 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
        <span className="text-sm font-normal">{label}</span>
      </div>
      {badge && (
        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full border border-green-200">
          {badge}
        </span>
      )}
    </Link>
  );
}
