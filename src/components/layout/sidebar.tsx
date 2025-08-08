import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth-store';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { 
  IconDashboard, 
  IconFileText, 
  IconChartBar, 
  IconSchool, 
  IconSettings,
  IconLogout,
  IconChevronRight
} from '@tabler/icons-react';
import { Logo } from '../logo';


export function Sidebar() {
  const { user, profile, signOut } = useAuthStore();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarRef.current && arrowRef.current) {
      // Animate sidebar width
      gsap.to(sidebarRef.current, {
        width: isSidebarOpen ? '240px' : '50px',
        ease: 'power3.out',
        duration: 0.5,
      });

      // Animate arrow position to follow the sidebar edge
      gsap.to(arrowRef.current, {
        left: isSidebarOpen ? '232px' : '42px',
        ease: 'power3.out',
        duration: 0.5,
      });

      gsap.to('.sidebar-content', {
        opacity: isSidebarOpen ? 1 : 0,
        x: isSidebarOpen ? 0 : -20,
        delay: isSidebarOpen ? 0.2 : 0,
        duration: 0.3,
      });

      gsap.to('.chevron-arrow', {
        rotate: isSidebarOpen ? 180 : 0,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Animate collapsed logo
      gsap.to('.collapsed-logo', {
        opacity: isSidebarOpen ? 0 : 1,
        scale: isSidebarOpen ? 0.8 : 1,
        delay: isSidebarOpen ? 0 : 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isSidebarOpen]);

  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
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
          width: '50px',
          background: `linear-gradient(180deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.90) 50%,
            rgba(15, 23, 42, 0.95) 100%
          )`,
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: `
            0 10px 25px -5px rgba(0, 0, 0, 0.4),
            0 4px 6px -2px rgba(0, 0, 0, 0.2)
          `
        }}
      >
        {/* Collapsed Logo - Only visible when sidebar is closed */}
        <div className="collapsed-logo absolute top-6 left-1/2 -translate-x-1/2 opacity-0">
          <Link to="/dashboard" className="block group">
            <Logo 
              size={28} 
              className="group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" 
            />
          </Link>
        </div>

        <div className="flex flex-col flex-1 sidebar-content opacity-0">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 mb-8 group">
            <Logo 
              size={32} 
              className="group-hover:scale-110 transition-transform duration-300" 
            />
            <span className="font-bold text-lg text-white">Vocationify</span>
          </Link>

          {/* User Profile */}
          <div className="flex items-center space-x-3 mb-6 p-3 rounded-lg bg-gradient-to-r from-white/10 to-white/5 border border-white/10">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-semibold">
                {(profile?.first_name || user?.email || 'U')[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium text-white truncate">
                {profile?.first_name || user?.email?.split('@')[0] || 'Usuario'}
              </span>
              <span className="text-xs text-slate-400">Estudiante</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            <SidebarLink to="/dashboard" icon={<IconDashboard size={16} />} label="Dashboard" />
            <SidebarLink to="/vocational-test" icon={<IconFileText size={16} />} label="Test Vocacional" />
            <SidebarLink to="/results" icon={<IconChartBar size={16} />} label="Mis Resultados" />
            <SidebarLink to="/careers" icon={<IconSchool size={16} />} label="Carreras" />
            <SidebarLink to="/profile" icon={<IconSettings size={16} />} label="Mi Perfil" />
          </nav>

          {/* Sign Out */}
          <div className="mt-auto pt-4">
            <button
              onClick={() => signOut()}
              className="flex items-center w-full p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group"
            >
              <IconLogout size={16} className="mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chevron Arrow - Follows the sidebar edge dynamically */}
      <div 
        ref={arrowRef}
        className="flex items-center justify-center absolute top-1/2 -translate-y-1/2 cursor-pointer"
        style={{ left: '42px' }}
        onMouseEnter={handleMouseEnter}
      >
        <div className="chevron-arrow p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
          <IconChevronRight 
            size={16} 
            className="text-slate-300 hover:text-white transition-colors duration-300" 
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
}

function SidebarLink({ to, icon, label }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      activeProps={{ 
        className: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white' 
      }}
      className="flex items-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
    >
      <span className="mr-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
