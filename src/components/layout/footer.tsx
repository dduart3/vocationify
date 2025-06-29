import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-100">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-tech-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="font-bold text-2xl text-white">
                Vocationify
              </span>
            </div>
            <p className="text-neutral-400 mb-8 max-w-md leading-relaxed">
              La plataforma más avanzada de orientación vocacional. 
              Tecnología de vanguardia para decisiones profesionales inteligentes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-accent-600 transition-colors duration-300 group">
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-accent-600 transition-colors duration-300 group">
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-accent-600 transition-colors duration-300 group">
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center hover:bg-accent-600 transition-colors duration-300 group">
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-lg">Plataforma</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/como-funciona" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link to="/carreras" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Explorar Carreras
                </Link>
              </li>
              <li>
                <Link to="/precios" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Precios
                </Link>
              </li>
              <li>
                <Link to="/testimonios" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Casos de Éxito
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Recursos
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-lg">Soporte</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/ayuda" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Términos
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  API
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            © 2024 Vocationify. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-neutral-500 text-sm">Desarrollado en España</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-neon-500 rounded-full animate-pulse"></div>
              <span className="text-neutral-500 text-sm">Sistema Activo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
