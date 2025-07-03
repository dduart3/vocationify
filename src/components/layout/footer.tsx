import { useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  IconBrandTwitter, 
  IconBrandLinkedin, 
  IconBrandInstagram, 
  IconBrandGithub,
  IconMail,
  IconPhone,
  IconMapPin,
  IconHeart,
  IconBolt
} from '@tabler/icons-react'

gsap.registerPlugin(ScrollTrigger)

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    const brand = brandRef.current
    const links = linksRef.current
    const social = socialRef.current
    const bottom = bottomRef.current

    if (!footer || !brand || !links || !social || !bottom) return

    // Initial states
    gsap.set([brand, links, social, bottom], { opacity: 0, y: 30 })

    // Animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    })

    tl.to(brand, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(links, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.6")
    .to(social, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4")
    .to(bottom, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.2")

    // Social icons hover animation
    const socialIcons = social.querySelectorAll('.social-icon')
    socialIcons.forEach((icon) => {
      const handleMouseEnter = () => {
        gsap.to(icon, {
          scale: 1.1,
          duration: 0.3,
          ease: "back.out(1.7)"
        })
      }
      
      const handleMouseLeave = () => {
        gsap.to(icon, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
      }

      icon.addEventListener('mouseenter', handleMouseEnter)
      icon.addEventListener('mouseleave', handleMouseLeave)
    })

  }, [])

  return (
    <footer ref={footerRef} className="relative overflow-hidden py-24">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div ref={brandRef} className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
                }}
              >
                <span className="text-white font-bold">V</span>
              </div>
              <span className="font-bold text-2xl text-white">
                Vocationify
              </span>
            </div>
            
            <p className="text-neutral-300 mb-8 max-w-md leading-relaxed">
              La plataforma más avanzada de orientación vocacional.
              Tecnología de vanguardia para decisiones profesionales inteligentes.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-neutral-400">
                <IconMail size={16} className="text-blue-400" />
                <span className="text-sm">contacto@vocationify.com</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400">
                <IconPhone size={16} className="text-green-400" />
                <span className="text-sm">+58 424 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-400">
                <IconMapPin size={16} className="text-red-400" />
                <span className="text-sm">Maracaibo, Venezuela</span>
              </div>
            </div>

            {/* Social Links */}
            <div ref={socialRef} className="flex space-x-4">
              <a 
                href="#" 
                className="social-icon w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/5"
                style={{
                  background: 'transparent',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)'
                }}
              >
                <IconBrandTwitter size={18} className="text-blue-400" />
              </a>
              <a 
                href="#" 
                className="social-icon w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/5"
                style={{
                  background: 'transparent',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)'
                }}
              >
                <IconBrandLinkedin size={18} className="text-blue-600" />
              </a>
              <a 
                href="#" 
                className="social-icon w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/5"
                style={{
                  background: 'transparent',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)'
                }}
              >
                <IconBrandInstagram size={18} className="text-pink-400" />
              </a>
              <a 
                href="#" 
                className="social-icon w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/5"
                style={{
                  background: 'transparent',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)'
                }}
              >
                <IconBrandGithub size={18} className="text-neutral-300" />
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div ref={linksRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:col-span-2">
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-6 text-lg flex items-center gap-2">
                <IconBolt size={18} className="text-yellow-400" />
                Plataforma
              </h3>
              <ul className="space-y-3">
                {[
                  { to: "/como-funciona", label: "Cómo Funciona" },
                  { to: "/carreras", label: "Explorar Carreras" },
                  { to: "/precios", label: "Precios" },
                  { to: "/testimonios", label: "Casos de Éxito" },
                  { to: "/blog", label: "Recursos" }
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-neutral-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-white mb-6 text-lg flex items-center gap-2">
                <IconHeart size={18} className="text-red-400" />
                Soporte
              </h3>
              <ul className="space-y-3">
                {[
                  { to: "/ayuda", label: "Centro de Ayuda" },
                  { to: "/contacto", label: "Contacto" },
                  { to: "/privacidad", label: "Privacidad" },
                  { to: "/terminos", label: "Términos" },
                  { to: "/api", label: "API" }
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-neutral-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div 
          ref={bottomRef}
          className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <p className="text-neutral-400 text-sm">
            {`© ${new Date().getFullYear()} Vocationify. Todos los derechos reservados.`}
          </p>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-neutral-500 text-sm flex items-center gap-2">
              Desarrollado con 
              <IconHeart size={14} className="text-red-400 animate-pulse" />
              en Venezuela
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-neutral-500 text-sm">Sistema Activo</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
