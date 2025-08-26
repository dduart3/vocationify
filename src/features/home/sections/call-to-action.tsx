import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from "@tanstack/react-router"
import { ArrowRight, Clock, Shield, Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const testimonialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const button = buttonRef.current
    const benefits = benefitsRef.current
    const card = cardRef.current
    const testimonial = testimonialRef.current

    if (!section || !title || !subtitle || !button || !benefits || !card) return

    // Initial states
    gsap.set([title, subtitle, button, benefits], { opacity: 0, y: 30 })
    gsap.set(card, { opacity: 0, scale: 0.9, y: 50 })
    if (testimonial) gsap.set(testimonial, { opacity: 0, x: -30 })

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

    if (testimonial) {
      tl.to(testimonial, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.2")
    }

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
                No pierdas más tiempo en una carrera que no te apasiona. 
                Descubre tu camino profesional ideal en menos de 20 minutos.
              </p>

              {/* Benefits List */}
              <div ref={benefitsRef} className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Clock size={16} className="text-green-400" />
                  </div>
                  <span className="text-neutral-300">Evaluación completa en 15-20 minutos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Shield size={16} className="text-blue-400" />
                  </div>
                  <span className="text-neutral-300">100% gratuito, sin compromisos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Star size={16} className="text-purple-400" />
                  </div>
                  <span className="text-neutral-300">Resultados instantáneos y detallados</span>
                </div>
              </div>
              
            </div>

            {/* Right Side - Testimonial Card */}
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
                {/* Quote */}
                <div className="text-6xl text-blue-400/30 font-serif mb-4">"</div>
                <blockquote className="text-lg text-neutral-300 mb-6 font-light italic leading-relaxed">
                  Gracias a Vocationify descubrí que mi verdadera pasión estaba en la 
                  ingeniería de datos. Ahora trabajo en mi empresa soñada y amo lo que hago.
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold">MR</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">María Rodríguez</div>
                    <div className="text-neutral-400 text-sm">Data Engineer en Google</div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
