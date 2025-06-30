import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { LucideIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const iconEl = iconRef.current
    const content = contentRef.current

    if (!card || !iconEl || !content) return

    // Initial state
    gsap.set(card, { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    })

    // Scroll trigger animation
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay: delay * 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    })

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out"
      })
      
      gsap.to(iconEl, {
        scale: 1.1,
        rotate: 5,
        duration: 0.3,
        ease: "back.out(1.7)"
      })

      gsap.to(content, {
        y: -2,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      })
      
      gsap.to(iconEl, {
        scale: 1,
        rotate: 0,
        duration: 0.3,
        ease: "power2.out"
      })

      gsap.to(content, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      })
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [delay])

  return (
    <div
      ref={cardRef}
      className="group relative p-6 rounded-xl cursor-pointer"
      style={{
        background: 'transparent',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 50px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent"></div>
      
      {/* Icon */}
      <div 
        ref={iconRef}
        className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center relative"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Icon 
          size={24} 
          className="text-white drop-shadow-sm group-hover:text-white transition-colors duration-300" 
        />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="text-center relative z-10">
        <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-sm text-neutral-300 leading-relaxed font-light">
          {description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-12 transition-all duration-500 rounded-full"></div>
    </div>
  )
}
