import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { landingText } from '../landing-text'

export function HeroSection({ isReady = true }: { isReady?: boolean }) {
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

  useGSAP(() => {
    const title = titleRef.current
    const subtitle = subtitleRef.current
    const buttons = buttonsRef.current
    const mockups = mockupsRef.current

    if (!title || !subtitle || !buttons) return

    gsap.set(title, { opacity: 0, y: 32 })
    gsap.set(subtitle, { opacity: 0, y: 24 })
    gsap.set(buttons, { opacity: 0, y: 20 })
    if (mockups) {
      gsap.set(mockups, {
        opacity: 0,
        y: 40,
        scale: 0.92
      })
    }

    if (!isReady) return; // Wait until Preloader is done

    const tl = gsap.timeline({ delay: 0.15 })
    tl.to(title, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' })
      .to(subtitle, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, '-=1.0')
      .to(buttons, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, '-=1.0')

    if (mockups) {
      tl.to(mockups, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.6,
        ease: 'power4.out',
        force3D: true
      }, '-=1.2')
    }
  }, { scope: sectionRef, dependencies: [isReady] })

  return (
    <section
      ref={sectionRef}
      className="font-hero relative h-[100dvh] flex flex-col overflow-hidden bg-transparent"
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

      {/* Optimized Rainbow Glow Beams — static blobs with slow breathing animation */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 55%, transparent 38%, black 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 55%, transparent 38%, black 72%)',
          transform: 'translateZ(0)', // Force GPU layer
        }}
      >
        {/* Left: Pink / Red tones */}
        <div className="absolute -top-[15%] -left-[8%] w-[45%] h-[70%] rounded-full blur-[100px] will-change-[opacity]"
          style={{ background: 'radial-gradient(circle, rgba(255,80,60,0.5) 0%, rgba(255,105,180,0.35) 50%, transparent 80%)', animation: 'hero-blob-breathe 12s ease-in-out infinite' }} />
        
        {/* Center-Left: Orange / Yellow */}
        <div className="absolute top-[0%] left-[18%] w-[38%] h-[60%] rounded-full blur-[100px] will-change-[opacity]"
          style={{ background: 'radial-gradient(circle, rgba(255,155,0,0.45) 0%, rgba(255,210,0,0.3) 50%, transparent 80%)', animation: 'hero-blob-breathe 15s ease-in-out infinite 3s' }} />
        
        {/* Center-Left: Green / Emerald */}
        <div className="absolute top-[8%] left-[30%] w-[28%] h-[50%] rounded-full blur-[100px] will-change-[opacity]"
          style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.4) 0%, rgba(16,185,129,0.25) 50%, transparent 80%)', animation: 'hero-blob-breathe 17s ease-in-out infinite 5s' }} />
        
        {/* Center: Warm pink */}
        <div className="absolute top-[5%] left-[38%] w-[30%] h-[50%] rounded-full blur-[100px] will-change-[opacity]"
          style={{ background: 'radial-gradient(circle, rgba(255,105,180,0.35) 0%, rgba(255,215,0,0.2) 60%, transparent 80%)', animation: 'hero-blob-breathe 18s ease-in-out infinite 6s' }} />
        
        {/* Center-Right: Cyan / Sky Blue */}
        <div className="absolute -top-[10%] right-[8%] w-[45%] h-[70%] rounded-full blur-[100px] will-change-[opacity]"
          style={{ background: 'radial-gradient(circle, rgba(0,180,255,0.5) 0%, rgba(100,200,255,0.35) 50%, transparent 80%)', animation: 'hero-blob-breathe 14s ease-in-out infinite 2s' }} />
        
        {/* Far Right: Purple / Violet */}
        <div className="absolute top-[10%] -right-[5%] w-[35%] h-[55%] rounded-full blur-[100px] will-change-[opacity]"
          style={{ background: 'radial-gradient(circle, rgba(138,43,226,0.45) 0%, rgba(100,0,200,0.3) 50%, transparent 80%)', animation: 'hero-blob-breathe 16s ease-in-out infinite 4s' }} />
      </div>

      {/* Centered content – high z-index so button stays clickable */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 sm:px-8 lg:px-12 pt-28 sm:pt-20 pb-10 sm:pb-6 text-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          <h1
            ref={titleRef}
            className="text-5xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-normal tracking-tight text-neutral-900 leading-[0.9] mb-4 sm:mb-6"
            style={{ opacity: 0 }}
          >
            {headline.line1} {headline.line2}
          </h1>
          <p
            ref={subtitleRef}
            className="text-[13px] sm:text-sm md:text-base text-neutral-600 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed"
            style={{ opacity: 0 }}
          >
            {subhead}
          </p>
          <div
            ref={buttonsRef}
            className="flex flex-wrap items-center justify-center"
            style={{ opacity: 0 }}
          >
            <Link
              to={isAuthenticated ? '/vocational-test' : '/register'}
              className="group/btn relative overflow-hidden inline-flex items-center justify-center gap-2 px-7 py-3 sm:px-8 sm:py-3 xl:px-10 xl:py-4 text-[16px] xl:text-[18px] font-bold rounded-full text-white bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_15px_rgba(37,99,235,0.35)] hover:from-blue-400 hover:to-blue-500 hover:border-blue-400 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_8px_20px_rgba(37,99,235,0.4)] active:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_2px_5px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all duration-200"
            >
              <span className="absolute inset-0 -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" aria-hidden />
              <span className="relative z-10">{isAuthenticated ? ctaPrimaryAuthenticated : ctaPrimary}</span>
              <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Laptop mockups */}
      <div
        ref={mockupsRef}
        className="relative z-10 flex-1 min-h-0 flex items-end justify-center px-4 pb-0 w-full h-full will-change-transform"
        style={{ opacity: 0 }}
      >
        <div className="relative w-full max-w-5xl sm:max-w-4xl 2xl:max-w-3xl flex items-center justify-center -mt-20 sm:-mt-4 lg:-mt-10 2xl:-mt-16 transition-all duration-500">
          {/* Ultra-performant fake shadow under the laptop */}
          <div className="absolute top-[30%] sm:top-[20%] w-[80%] h-[70%] bg-black/15 blur-[60px] rounded-[100%] pointer-events-none" />
          
          <img
            src="/images/laptop-mockup.webp"
            alt="Vocationify app preview"
            className="relative z-10 w-full h-auto object-contain scale-110 sm:scale-100 will-change-transform"
            draggable="false"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}
