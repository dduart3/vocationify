import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Link } from "@tanstack/react-router"
import { ArrowRight, Play, Sparkles, TrendingUp, Users } from 'lucide-react'

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const buttons = buttonsRef.current
    const stats = statsRef.current
    const floatingElements = floatingElementsRef.current

    if (!section || !title || !subtitle || !buttons || !stats) return

    // Initial states
    gsap.set(title, { opacity: 0, y: 50, scale: 0.9 })
    gsap.set(subtitle, { opacity: 0, y: 30 })
    gsap.set(buttons, { opacity: 0, y: 30 })
    gsap.set(stats, { opacity: 0, y: 30 })

    // Main animation timeline
    const tl = gsap.timeline({ delay: 0.5 })

    tl.to(title, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: "power3.out"
    })
    .to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.5")
    .to(buttons, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.4")
    .to(stats, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.3")

    // Floating elements animation
    if (floatingElements) {
      const elements = floatingElements.children
      Array.from(elements).forEach((element, index) => {
        gsap.to(element, {
          y: -20,
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: index * 0.5
        })
      })
    }

    // Stats counter animation - FIXED
    const statElements = [
      { element: stats.querySelector('[data-stat="students"]'), value: 15, suffix: '+' },
      { element: stats.querySelector('[data-stat="precision"]'), value: 98, suffix: '%' },
      { element: stats.querySelector('[data-stat="careers"]'), value: 750, suffix: '+' }
    ]

    statElements.forEach(({ element, value, suffix }, index) => {
      if (element) {
        gsap.fromTo(element, 
          { textContent: 0 },
          {
            textContent: value,
            duration: 2,
            delay: 1.5 + (index * 0.2),
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function() {
              const current = Math.round(this.targets()[0].textContent)
              element.textContent = current + suffix
            }
          }
        )
      }
    })

  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>

      {/* Floating Elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-60"></div>
        <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-60"></div>
        <div className="absolute bottom-40 left-20 w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 opacity-60"></div>
        <div className="absolute top-60 right-40 w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            {/* Main Title */}
            <h1 ref={titleRef} className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
              <span className="text-white">Descubre Tu</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Vocación Perfecta
              </span>
            </h1>

            {/* Subtitle */}
            <p ref={subtitleRef} className="text-lg md:text-xl text-neutral-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Plataforma de orientación vocacional impulsada por IA. Análisis
              científico, resultados precisos, futuro profesional claro.
            </p>

            {/* CTA Buttons */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                to="/register"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Sparkles size={20} />
                Comenzar Análisis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/demo"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'transparent',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Play size={20} />
                Ver Demo
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div ref={statsRef} className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div 
              className="p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300"
              style={{
                background: 'transparent',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Users size={24} className="text-blue-400" />
              </div>
              <div data-stat="students" className="text-3xl font-bold text-white mb-2">0K+</div>
              <div className="text-sm text-neutral-300 uppercase tracking-wide">
                Estudiantes Activos
              </div>
            </div>
            
            <div 
              className="p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300"
              style={{
                background: 'transparent',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-400" />
              </div>
              <div data-stat="precision" className="text-3xl font-bold text-white mb-2">0%</div>
              <div className="text-sm text-neutral-300 uppercase tracking-wide">
                Precisión IA
              </div>
            </div>
            
            <div 
              className="p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300"
              style={{
                background: 'transparent',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Sparkles size={24} className="text-green-400" />
              </div>
              <div data-stat="careers" className="text-3xl font-bold text-white mb-2">0+</div>
              <div className="text-sm text-neutral-300 uppercase tracking-wide">
                Carreras Analizadas
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
