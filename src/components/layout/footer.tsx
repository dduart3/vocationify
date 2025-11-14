import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  IconHeart,
} from '@tabler/icons-react'

gsap.registerPlugin(ScrollTrigger)

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    const brand = brandRef.current
    const links = linksRef.current
    const bottom = bottomRef.current

    if (!footer || !brand || !links || !bottom) return

    // Initial states
    gsap.set([brand, links, bottom], { opacity: 0, y: 30 })

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
    .to(bottom, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.2")

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

          </div>

          {/* Links Section */}
          <div ref={linksRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:col-span-2">
            {/* Quick Links */}
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
