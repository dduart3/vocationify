import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { useState } from "react";
import {
  IconMenu2,
  IconX,
  IconChevronDown,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { Logo } from "../logo";

export function Header() {
  const { user, profile, isAuthenticated, signOut } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 py-4 px-6"
      style={{
        background: "transparent",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 50px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <Logo
              size={32}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-bold text-lg text-white">Vocationify</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {!isAuthenticated ? (
              <>
                <NavLink to="/como-funciona">Proceso</NavLink>
                <NavLink to="/carreras">Carreras</NavLink>
                <NavLink to="/precios">Precios</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/evaluaciones">Evaluaciones</NavLink>
                <NavLink to="/resultados">Resultados</NavLink>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {(profile?.first_name ||
                        user?.email ||
                        "U")[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">
                      {profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user?.email?.split("@")[0] : user?.email?.split("@")[0]}
                    </span>
                    <span className="text-xs text-neutral-400">Estudiante</span>
                  </div>
                  <IconChevronDown
                    size={16}
                    className={`text-neutral-300 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-lg py-2 animate-fade-in"
                    style={{
                      background: "transparent",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 0 50px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 group mx-2"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <IconSettings
                        size={16}
                        className="mr-3 group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="text-xs font-medium">Configuración</span>
                    </Link>

                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center w-full p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group mx-2 mt-1"
                    >
                      <IconLogout
                        size={16}
                        className="mr-3 group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="text-xs font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Link
                  to="/login"
                  className="flex items-center p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                >
                  <span className="text-sm font-medium">Iniciar Sesión</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 group"
                >
                  <span className="text-sm font-medium">Registrarse</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
          >
            <span className="group-hover:scale-110 transition-transform duration-300">
              {isMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 animate-slide-up">
            <nav className="flex flex-col space-y-1">
              {!isAuthenticated ? (
                <>
                  <MobileNavLink
                    to="/como-funciona"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Proceso
                  </MobileNavLink>
                  <MobileNavLink
                    to="/carreras"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Carreras
                  </MobileNavLink>
                  <MobileNavLink
                    to="/precios"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Precios
                  </MobileNavLink>

                  <div className="pt-4 space-y-1 border-t border-white/10 mt-4">
                    <Link
                      to="/login"
                      className="flex items-center p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-xs font-medium">
                        Iniciar Sesión
                      </span>
                    </Link>

                    <Link
                      to="/register"
                      className="flex items-center p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-xs font-medium">Registrarse</span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <MobileNavLink
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink
                    to="/evaluaciones"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Evaluaciones
                  </MobileNavLink>
                  <MobileNavLink
                    to="/resultados"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Resultados
                  </MobileNavLink>

                  {/* Mobile User Info */}
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <div className="flex items-center space-x-3 mb-6 p-2 rounded-lg bg-white/5">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {(profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user?.email || "U" : user?.email || "U")[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-white">
                          {profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user?.email?.split("@")[0] : user?.email?.split("@")[0]}
                        </span>
                        <span className="text-xs text-neutral-400">
                          Estudiante
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 group mb-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconSettings
                        size={16}
                        className="mr-3 group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="text-xs font-medium">Configuración</span>
                    </Link>

                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group"
                    >
                      <IconLogout
                        size={16}
                        className="mr-3 group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="text-xs font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// Desktop Navigation Link Component
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      activeProps={{
        className:
          "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white",
      }}
      className="flex items-center p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
    >
      <span className="text-sm font-medium group-hover:scale-110 transition-transform duration-300">
        {children}
      </span>
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      activeProps={{
        className:
          "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white",
      }}
      className="flex items-center p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
      onClick={onClick}
    >
      <span className="text-xs font-medium group-hover:scale-110 transition-transform duration-300">
        {children}
      </span>
    </Link>
  );
}
