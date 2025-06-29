import { Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useState } from 'react'

export function Header() {
  const { user, profile, isAuthenticated, signOut } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-xl text-neutral-900">
              Vocationify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/como-funciona" 
                  className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
                >
                  Proceso
                </Link>
                <Link 
                  to="/carreras" 
                  className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
                >
                  Carreras
                </Link>
                <Link 
                  to="/precios" 
                  className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
                >
                  Precios
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/evaluaciones" 
                  className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
                >
                  Evaluaciones
                </Link>
                <Link 
                  to="/resultados" 
                  className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
                >
                  Resultados
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-tech-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-neutral-700">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
                >
                  Salir
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/auth/login"
                  className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/auth/register"
                  className="bg-neutral-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-all duration-300 hover:scale-105"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`block h-0.5 bg-neutral-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block h-0.5 bg-neutral-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 bg-neutral-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200/50 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/como-funciona" className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
                    Proceso
                  </Link>
                  <Link to="/carreras" className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
                    Carreras
                  </Link>
                  <Link to="/precios" className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
                    Precios
                  </Link>
                  <div className="pt-4 border-t border-neutral-200/50 space-y-3">
                    <Link to="/auth/login" className="block text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
                      Iniciar Sesión
                    </Link>
                                       <Link to="/auth/register" className="block bg-neutral-900 text-white px-4 py-2.5 rounded-xl font-medium text-center">
                      Registrarse
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
                    Dashboard
                  </Link>
                  <Link to="/evaluaciones" className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
                    Evaluaciones
                  </Link>
                  <Link to="/resultados" className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
                    Resultados
                  </Link>
                  <div className="pt-4 border-t border-neutral-200/50">
                    <button
                      onClick={() => signOut()}
                      className="text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
                    >
                      Cerrar Sesión
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
