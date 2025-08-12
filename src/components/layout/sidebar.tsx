import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth-store';
import { useState, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  GraduationCap, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../logo';

export function Sidebar() {
  const { user, profile, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  const clearExistingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    // Prevent rapid state changes during transitions
    if (isTransitioningRef.current) return;
    
    clearExistingTimeout();
    
    if (!isOpen) {
      isTransitioningRef.current = true;
      setIsOpen(true);
      
      // Reset transition lock after animation completes
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 350); // Slightly longer than CSS transition
    }
  }, [isOpen, clearExistingTimeout]);

  const handleMouseLeave = useCallback(() => {
    // Prevent rapid state changes during transitions
    if (isTransitioningRef.current) return;
    
    clearExistingTimeout();
    
    if (isOpen) {
      // Add significant delay before closing
      timeoutRef.current = setTimeout(() => {
        isTransitioningRef.current = true;
        setIsOpen(false);
        
        // Reset transition lock after animation completes
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 350);
        
        timeoutRef.current = null;
      }, 300); // 300ms delay before closing
    }
  }, [isOpen, clearExistingTimeout]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearExistingTimeout();
    };
  }, [clearExistingTimeout]);

  return (
    <div 
      ref={containerRef}
      className="fixed left-0 top-0 h-full z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width: isOpen ? '280px' : '80px' }}
    >
      {/* Main Sidebar */}
      <div
        className="h-full flex flex-col py-8 px-4 transition-all duration-300 ease-out"
        style={{
          width: isOpen ? '256px' : '64px',
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
        {/* Logo Section */}
        <div className="mb-10">
          <Link to="/dashboard" className="flex items-center group/logo">
            <div className="w-8 h-8 flex-shrink-0">
              <Logo 
                size={32} 
                className="group-hover/logo:scale-110 transition-transform duration-300" 
              />
            </div>
            {isOpen && (
              <span className="ml-4 font-bold text-lg text-white transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                Vocationify
              </span>
            )}
          </Link>
        </div>

        {/* User Profile */}
        {isOpen && (
          <div className="mb-8 transition-opacity duration-300">
            <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white text-sm font-semibold">
                  {(profile?.first_name || user?.email || 'U')[0]?.toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium text-white truncate">
                  {profile?.first_name || user?.email?.split('@')[0] || 'Usuario'}
                </span>
                <span className="text-xs text-slate-400">Estudiante</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-3">
          <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isOpen} />
          <SidebarLink to="/vocational-test" icon={<FileText size={20} />} label="Test Vocacional" isOpen={isOpen} />
          <SidebarLink to="/results" icon={<BarChart3 size={20} />} label="Mis Resultados" isOpen={isOpen} />
          <SidebarLink to="/careers" icon={<GraduationCap size={20} />} label="Carreras" isOpen={isOpen} />
          <SidebarLink to="/profile" icon={<Settings size={20} />} label="Mi Perfil" isOpen={isOpen} />
        </nav>

        {/* Sign Out */}
        <div className="mt-8">
          <button
            onClick={() => signOut()}
            className="flex items-center w-full p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group/logout"
            title={!isOpen ? "Cerrar Sesión" : undefined}
          >
            <LogOut size={20} className="flex-shrink-0 group-hover/logout:scale-110 transition-transform duration-300" />
            {isOpen && (
              <span className="ml-4 text-sm font-medium whitespace-nowrap">
                Cerrar Sesión
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expansion Indicator */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
        style={{ left: isOpen ? '240px' : '48px' }}
      >
        <div className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
          <ChevronRight 
            size={14} 
            className={`text-slate-300 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : 'rotate-0'
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
  isOpen: boolean;
}

function SidebarLink({ to, icon, label, isOpen }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      activeProps={{ 
        className: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-blue-400/30' 
      }}
      className="flex items-center p-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-transparent transition-all duration-300 group/link"
      title={!isOpen ? label : undefined}
    >
      <span className="flex-shrink-0 group-hover/link:scale-110 transition-transform duration-300">
        {icon}
      </span>
      {isOpen && (
        <span className="ml-4 text-sm font-medium whitespace-nowrap">
          {label}
        </span>
      )}
    </Link>
  );
}