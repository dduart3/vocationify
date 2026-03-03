import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { landingText } from '../landing-text'



export function HeroSection() {
  const { isAuthenticated } = useAuth()
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const mockupsRef = useRef<HTMLDivElement>(null)

  const {
    headline,
    subhead,
    ctaPrimary,
    ctaPrimaryAuthenticated,
  } = landingText.hero

  useEffect(() => {
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const buttons = buttonsRef.current
    const mockups = mockupsRef.current

    if (!title || !subtitle || !buttons) return

    gsap.set(title, { opacity: 0, y: 32 })
    gsap.set(subtitle, { opacity: 0, y: 24 })
    gsap.set(buttons, { opacity: 0, y: 20 })
    if (mockups) gsap.set(mockups, { opacity: 0, y: 40 })

    const tl = gsap.timeline({ delay: 0.3 })
    tl.to(title, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
      .to(buttons, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    if (mockups) {
      tl.to(mockups, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, '-=0.2')
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="font-hero relative h-[100dvh] flex flex-col overflow-hidden"
      style={{
        backgroundColor: '#f5fbff',
      }}
    >
      {/* Grid pattern + radial mask (no grid in center), behind photo */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 55%, transparent 38%, black 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 55%, transparent 38%, black 72%)',
        }}
      />
      {/* Rainbow glow beams moving slowly over the grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 55%, transparent 38%, black 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 55%, transparent 38%, black 72%)',
        }}
      >
        <div
          className="absolute inset-0 w-[200%] h-full blur-2xl"
          style={{
            backgroundImage: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(255,99,71,0.25) 8%,
              rgba(255,165,0,0.3) 16%,
              rgba(255,215,0,0.25) 24%,
              rgba(50,205,50,0.3) 32%,
              rgba(0,191,255,0.25) 40%,
              rgba(138,43,226,0.3) 48%,
              rgba(255,99,71,0.25) 56%,
              rgba(255,165,0,0.3) 64%,
              rgba(255,215,0,0.25) 72%,
              rgba(50,205,50,0.3) 80%,
              rgba(0,191,255,0.25) 88%,
              transparent 100%
            )`,
            backgroundSize: '50% 100%',
            animation: 'hero-rainbow-beams 25s linear infinite',
          }}
        />
      </div>

      {/* Grain effect overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.35] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Centered content – high z-index so button stays clickable */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-6 text-center">
        <div className="w-full max-w-6xl mx-auto">
          <h1
            ref={titleRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-neutral-800 leading-tight"
          >
            {headline.line1} {headline.line2}
          </h1>
          <p
            ref={subtitleRef}
            className="text-sm md:text-base text-neutral-600 max-w-3xl mx-auto mb-5 sm:mb-6 leading-relaxed"
          >
            {subhead}
          </p>
          <div
            ref={buttonsRef}
            className="flex flex-wrap items-center justify-center"
          >
            <Link
              to={isAuthenticated ? '/vocational-test' : '/register'}
              className="group/btn relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-base text-white bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_4px_10px_rgba(37,99,235,0.35)] hover:from-blue-400 hover:to-blue-500 hover:border-blue-400 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_6px_15px_rgba(37,99,235,0.4)] active:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_1px_3px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all duration-200"
            >
              <span className="absolute inset-0 -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" aria-hidden />
              <span className="relative z-10">{isAuthenticated ? ctaPrimaryAuthenticated : ctaPrimary}</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </Link>
          </div>
        </div>
      </div>

      {/* Laptop mockups */}
      <div
        ref={mockupsRef}
        className="relative z-10 flex-1 min-h-0 flex items-end justify-center px-4 pb-6 sm:pb-8 pt-4 w-full h-full"
      >
        <div className="relative w-full max-w-5xl flex items-center justify-center -mt-10 lg:-mt-20">
          <img
            src="/images/laptop-mockup.webp"
            alt="Vocationify app preview"
            className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            draggable="false"
          />
        </div>
      </div>

      {/* White fade at the bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 sm:h-48 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, white)',
        }}
      />
    </section>
  )
}
