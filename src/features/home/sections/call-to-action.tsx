import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Clock, Database, Brain, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

gsap.registerPlugin(ScrollTrigger)

export function CTASection() {
  const { isAuthenticated } = useAuthStore()
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const button = buttonRef.current
    const benefits = benefitsRef.current
    const card = cardRef.current

    if (!section || !title || !subtitle || !button || !benefits || !card) return

    // Initial states
    gsap.set([title, subtitle, button, benefits], { opacity: 0, y: 30 })
    gsap.set(card, { opacity: 0, scale: 0.9, y: 50 })

    // Animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    })

    tl.to(card, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    .to(title, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3")
    .to(benefits, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.2")
    .to(button, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3")

    // Button hover animation
    const handleButtonHover = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    const handleButtonLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    if (button) {
      button.addEventListener('mouseenter', handleButtonHover)
      button.addEventListener('mouseleave', handleButtonLeave)
    }

    return () => {
      if (button) {
        button.removeEventListener('mouseenter', handleButtonHover)
        button.removeEventListener('mouseleave', handleButtonLeave)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Main CTA */}
            <div>
              <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-6 text-white">
                ¿Listo Para Descubrir
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Tu Verdadera Vocación?
                </span>
              </h2>
              
              <p ref={subtitleRef} className="text-lg text-neutral-300 mb-8 font-light leading-relaxed">
                Toma decisiones informadas sobre tu futuro profesional. Explora carreras
                que se alinean con tu personalidad y habilidades.
              </p>

              {/* Benefits List */}
              <div ref={benefitsRef} className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Clock size={16} className="text-green-400" />
                  </div>
                  <span className="text-neutral-300">Test conversacional con IA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Brain size={16} className="text-blue-400" />
                  </div>
                  <span className="text-neutral-300">Evaluación basada en modelo RIASEC</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Database size={16} className="text-purple-400" />
                  </div>
                  <span className="text-neutral-300">126+ carreras e instituciones</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                ref={buttonRef}
                to={isAuthenticated ? "/vocational-test" : "/register"}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Sparkles size={20} />
                {isAuthenticated ? "Comenzar Test" : "Registrarse Gratis"}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

            </div>

            {/* Right Side - Info Card */}
            <div
              ref={cardRef}
              className="relative p-8 rounded-2xl"
              style={{
                background: 'transparent',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 50px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">
                  ¿Cómo Funciona?
                </h3>
                <div className="space-y-4 text-neutral-300">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-400 text-sm font-bold">1</span>
                    </div>
                    <p className="leading-relaxed">
                      <strong className="text-white">Conversa con la IA:</strong> Responde preguntas sobre
                      tus intereses, habilidades y preferencias de forma natural.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-purple-400 text-sm font-bold">2</span>
                    </div>
                    <p className="leading-relaxed">
                      <strong className="text-white">Obtén tu perfil:</strong> La IA analiza tus respuestas
                      y calcula tu perfil RIASEC personalizado.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-green-400 text-sm font-bold">3</span>
                    </div>
                    <p className="leading-relaxed">
                      <strong className="text-white">Explora carreras:</strong> Descubre carreras compatibles
                      y las universidades que las ofrecen.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
