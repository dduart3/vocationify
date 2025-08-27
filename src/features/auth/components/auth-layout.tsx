import { useRef, useEffect, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { IconArrowLeft, IconSparkles } from '@tabler/icons-react'
import { Logo } from '@/components/logo'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  showLogo?: boolean
  showBackButton?: boolean
  backTo?: string
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showLogo = true,
  showBackButton = true,
  backTo = "/"
}: AuthLayoutProps) {
  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const backButtonRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([])

  // Helper function to set floating element refs
  const setFloatingElementRef = (index: number) => (el: HTMLDivElement | null) => {
    floatingElementsRef.current[index] = el
  }

  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current
    const logo = logoRef.current
    const title = titleRef.current
    const content = contentRef.current
    const backButton = backButtonRef.current

    if (!container || !card) return

    // Initial states
    gsap.set(card, { 
      opacity: 0, 
      y: 30, 
      scale: 0.95
    })

    const elementsToAnimate = [backButton, logo, title, content].filter(Boolean)
    gsap.set(elementsToAnimate, { opacity: 0, y: 20 })

    // Floating elements animation
    floatingElementsRef.current.forEach((el, index) => {
      if (el) {
        gsap.set(el, { opacity: 0, scale: 0 })
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: 0.3 + index * 0.1,
          ease: "back.out(1.7)"
        })
        
        // Continuous floating animation
        gsap.to(el, {
          y: -8,
          duration: 2 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2
        })
      }
    })

    // Main animation timeline
    const tl = gsap.timeline({ delay: 0.1 })

    // Card entrance
    tl.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "power3.out"
    })

    // Content animations
    elementsToAnimate.forEach((element, index) => {
      if (element) {
        tl.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, index === 0 ? "-=0.6" : "-=0.4")
      }
    })


  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Primary gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-600/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] sm:w-[600px] sm:h-[400px] bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            ref={setFloatingElementRef(i)}
            className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
              i % 3 === 0 ? 'bg-blue-400/30' : 
              i % 3 === 1 ? 'bg-purple-400/30' : 'bg-pink-400/30'
            }`}
            style={{
              top: `${25 + (i * 20)}%`,
              left: `${15 + (i * 20)}%`,
            }}
          />
        ))}
      </div>

      <div ref={containerRef} className="w-full max-w-sm sm:max-w-md relative z-10">
        {/* Back Button */}
        {showBackButton && (
          <div ref={backButtonRef} className="mb-4 sm:mb-6">
            <Link 
              to={backTo}
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-slate-300 hover:text-white transition-all duration-300 group text-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <IconArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
          </div>
        )}

        {/* Main Card */}
        <div 
          ref={cardRef}
          className="relative"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: `
              0 20px 40px -12px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            padding: '1.5rem',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Inner glow effect */}
          <div 
            className="absolute inset-0 rounded-[20px] opacity-40"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
              pointerEvents: 'none'
            }}
          />

          {/* Logo */}
          {showLogo && (
            <div ref={logoRef} className="text-center mb-6">
              <div className="flex justify-center mb-3 relative">
                <div className="relative">
                  <Logo size={44} className="drop-shadow-2xl relative z-10" />
                  {/* Logo glow effect */}
                  <div className="absolute inset-0 bg-blue-500/15 rounded-full blur-lg scale-125 animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Vocationify
                </h1>
                <IconSparkles size={16} className="text-blue-400 animate-pulse" />
              </div>
            </div>
          )}

          {/* Title */}
          <div ref={titleRef} className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
              {title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Content */}
          <div ref={contentRef}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
