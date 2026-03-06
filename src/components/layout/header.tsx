import { Link, useLocation } from '@tanstack/react-router'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect } from 'react'
import {
  IconMenu2,
  IconX,
  IconChevronDown,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react'
import { Logo } from '../logo'

export function Header() {
  const { user, profile, isAuthenticated, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY
        
        // Always show at the very top
        if (currentScrollY < 10) {
          setIsVisible(true)
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Hide when scrolling down significantly
          setIsVisible(false)
        } else if (currentScrollY < lastScrollY) {
          // Show when scrolling up
          setIsVisible(true)
        }
        
        setLastScrollY(currentScrollY)
      }
    }

    window.addEventListener('scroll', controlNavbar)
    return () => {
      window.removeEventListener('scroll', controlNavbar)
    }
  }, [lastScrollY])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] py-4 px-4 sm:px-6 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="container mx-auto">
        <div
          className="flex items-center justify-between rounded-[2rem] px-4 sm:px-6 py-3 bg-white/20 backdrop-blur-3xl border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_8px_32px_rgba(0,0,0,0.06)]"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group text-neutral-800">
            <Logo
              size={28}
              variant="light"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-bold text-lg">Vocationify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>
                  Dashboard
                </NavLink>
                <NavLink to="/results" active={location.pathname.startsWith('/results')}>
                  Resultados
                </NavLink>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 p-2 rounded-2xl text-neutral-700 hover:bg-white/60 hover:border-slate-200/60 border border-transparent hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.3)] border border-blue-400/40">
                    <span className="text-white text-xs font-semibold">
                      {(profile?.first_name || user?.email || 'U')[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {profile
                      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
                        user?.email?.split('@')[0]
                      : user?.email?.split('@')[0]}
                  </span>
                  <IconChevronDown
                    size={16}
                    className={`text-neutral-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-[1.5rem] bg-white/95 backdrop-blur-xl py-2 border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_12px_40px_rgba(0,0,0,0.12)]">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <IconSettings size={18} className="text-neutral-400" />
                      <span className="text-sm font-medium">Configuración</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setIsUserMenuOpen(false)
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <IconLogout size={18} />
                      <span className="text-sm font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 shadow-[0_4px_12px_rgba(59,130,246,0.25),inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)] hover:shadow-[0_6px_16px_rgba(59,130,246,0.3),inset_0_-2px_4px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,0.4)] hover:-translate-y-[1px] transition-all duration-300"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl text-neutral-700 border border-transparent hover:bg-white/60 hover:border-slate-200/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] transition-all duration-300"
          >
            {isMenuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pt-4 rounded-[1.5rem] bg-white/40 backdrop-blur-xl border border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_24px_rgba(0,0,0,0.06)] px-3 pb-4 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col gap-1">
              {!isAuthenticated ? (
                <>
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="py-2.5 text-sm font-medium text-neutral-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="py-3 rounded-2xl text-sm font-semibold text-white bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 shadow-[0_4px_12px_rgba(59,130,246,0.2),inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)] text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <MobileNavLink to="/dashboard" active={location.pathname === '/dashboard'} onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/results" active={location.pathname.startsWith('/results')} onClick={() => setIsMenuOpen(false)}>
                    Resultados
                  </MobileNavLink>
                  <div className="pt-4 mt-2 border-t border-neutral-200 space-y-1">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {(profile?.first_name || user?.email || 'U')[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-neutral-700 truncate">
                        {profile
                          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
                            user?.email?.split('@')[0]
                          : user?.email?.split('@')[0]}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-neutral-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconSettings size={18} />
                      <span className="text-sm">Configuración</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600"
                    >
                      <IconLogout size={18} />
                      <span className="text-sm">Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
        active
          ? 'bg-gradient-to-b from-blue-50/90 to-blue-100/60 text-blue-900 border border-blue-200/70 shadow-[0_4px_12px_rgba(59,130,246,0.12),inset_0_-2px_4px_rgba(59,130,246,0.06),inset_0_2px_4px_rgba(255,255,255,1)] -translate-y-[1px]'
          : 'text-neutral-700 hover:text-neutral-900 border border-transparent hover:bg-white/60 hover:border-slate-200/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] hover:-translate-y-[1px]'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  to,
  active,
  children,
  onClick,
}: {
  to: string
  active?: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Link
      to={to}
      className={`py-2.5 px-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
        active
          ? 'bg-gradient-to-b from-blue-50/90 to-blue-100/60 text-blue-900 border border-blue-200/70 shadow-[0_4px_12px_rgba(59,130,246,0.1),inset_0_-2px_4px_rgba(59,130,246,0.05),inset_0_2px_4px_rgba(255,255,255,1)]'
          : 'text-neutral-700'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
