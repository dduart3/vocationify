import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Logo } from '../logo'


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
    <footer ref={footerRef} className="relative z-30 pt-0 w-full flex flex-col justify-between min-h-[500px]">
      
      {/* Fading overlap to smooth the transition from the previously cropped section */}
      {/* Scaled slightly wider than screen so no edges show over horizontal scroll if it breaks */}
      <div className="absolute top-0 left-0 w-[120vw] -ml-[10vw] h-48 -translate-y-[99%] bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/90 to-transparent pointer-events-none z-0"></div>

      {/* Main Container Layer with overflow-hidden to cut off horizontal bleed and tight crop bottom */}
      <div className="relative w-full flex-1 flex flex-col justify-between bg-[#f8fafc] overflow-hidden pt-24 z-10">
      
        {/* Main Background gradient */}
        <div className="absolute inset-0 pointer-events-none z-0">
            <div 
              className="absolute inset-0 opacity-90" 
              style={{
                background: 'linear-gradient(120deg, #fed7aa 0%, #fbcfe8 50%, #bae6fd 100%)',
                maskImage: 'linear-gradient(to top, black 5%, transparent 40%)',
                WebkitMaskImage: 'linear-gradient(to top, black 5%, transparent 40%)'
              }}
            >
              {/* Premium Fine Grain Texture Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                  backgroundSize: '120px 120px',
                }}
              />
            </div>
        </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex-1 flex flex-col pt-10">
        
        {/* Top Content Row */}
        <div className="flex flex-col lg:flex-row justify-between w-full pb-10 gap-16 lg:gap-8">
          
          {/* Top Left Column (Slogan) */}
          <div ref={brandRef} className="w-full lg:w-[35%] flex flex-col mt-2">
            <h3 className="font-hero text-2xl lg:text-3xl font-medium text-slate-800 tracking-tight">
              Desbloquea tu potencial.
            </h3>
          </div>

          {/* Top Right Column (Links Grid) */}
          <div ref={linksRef} className="w-full lg:w-[60%] grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 mt-6 lg:mt-0">
            <div className="flex flex-col space-y-5">
              <h4 className="font-semibold text-slate-800 text-[14px]">Planes</h4>
              <nav className="flex flex-col space-y-4">
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Test Vocacional</a>
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Asesorías</a>
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Instituciones</a>
              </nav>
            </div>
            
            <div className="flex flex-col space-y-5">
              <h4 className="font-semibold text-slate-800 text-[14px]">Aprende</h4>
              <nav className="flex flex-col space-y-4">
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Blog</a>
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Investigación</a>
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Guías</a>
              </nav>
            </div>

            <div className="flex flex-col space-y-5">
              <h4 className="font-semibold text-slate-800 text-[14px]">Nosotros</h4>
              <nav className="flex flex-col space-y-4">
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Plataforma</a>
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Misión</a>
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Contacto</a>
              </nav>
            </div>

            <div className="flex flex-col space-y-5">
              <h4 className="font-semibold text-slate-800 text-[14px]">Legal</h4>
              <nav className="flex flex-col space-y-4">
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Términos</a>
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Privacidad</a>
                <a href="#" className="text-[#718299] hover:text-blue-600 text-[14px] font-medium transition-colors">Cookies</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Massive Typography in Middle */}
        <div className="w-full relative z-10 flex justify-center items-center pointer-events-none select-none py-8 md:py-16">
          <h1 
            className="font-hero font-normal text-[17.5vw] md:text-[20vw] leading-none tracking-[-0.04em] text-[#0f172a] opacity-10"
          >
            Vocationify
          </h1>
        </div>

        {/* Bottom Bar (Logo/Copyright & Links) */}
        <div ref={bottomRef} className="w-full border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center py-8 gap-4">
          <Logo className=' invisible' size={45} showText={true} />
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-800 text-[13px] font-medium transition-colors">Términos de servicio</a>
            <a href="#" className="text-slate-500 hover:text-slate-800 text-[13px] font-medium transition-colors">Política de privacidad</a>
            <a href="#" className="text-slate-500 hover:text-slate-800 text-[13px] font-medium transition-colors">Configuración de cookies</a>
            <p className="text-slate-400 font-medium text-[13px] ml-2">
              {`© ${new Date().getFullYear()}`}
            </p>
          </div>
        </div>
      </div>
      </div>{/* closes inner overflow-hidden flex container */}

    </footer>
  )
}
