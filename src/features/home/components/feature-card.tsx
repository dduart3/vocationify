import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FeatureCardProps {
  title: string
  description: string
  className?: string
  image?: string
  imageScale?: number
  imagePaddingY?: number
  imageMargin?: number
  imageMarginTop?: number
  imageMarginLeft?: number
  imageMarginRight?: number
  delay?: number
}

export function FeatureCard({ title, description, className, image, imageScale = 1.7, imagePaddingY = 0, imageMargin = 0, imageMarginTop = 0, imageMarginLeft = 0, imageMarginRight = 0, delay = 0 }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.set(card, { opacity: 0, y: 20 })

    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: delay * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })
  }, [delay])

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden bg-neutral-200/40 backdrop-blur-xl border border-white/60 shadow-[0_2px_0_0_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)] ${className ?? ''}`}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.3] mix-blend-overlay rounded-2xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      {/* Image area */}
      <div className="relative w-full h-52 flex items-center justify-center overflow-hidden flex-shrink-0">
        {/* Glow gradient behind image only */}
        {image && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 75% 75% at 50% 50%, rgba(96,165,250,0.65) 0%, rgba(147,197,253,0.5) 25%, rgba(186,230,253,0.35) 45%, rgba(224,242,254,0.2) 65%, transparent 90%)',
            }}
          />
        )}
        <div className="relative w-full h-full flex items-center justify-center">
          {image ? (
            <>
              {/* Mask layer – fixed at bottom of image area */}
              <div
                className="absolute inset-0"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    paddingTop: imagePaddingY ? `${imagePaddingY}rem` : undefined,
                    paddingBottom: imagePaddingY ? `${imagePaddingY}rem` : undefined,
                    margin: imageMargin ? `${imageMargin}rem` : undefined,
                    marginTop: imageMarginTop ? `${imageMarginTop}rem` : undefined,
                    marginLeft: imageMarginLeft ? `${imageMarginLeft}rem` : undefined,
                    marginRight: imageMarginRight ? `${imageMarginRight}rem` : undefined,
                  }}
                >
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full pl-3 object-contain"
                    style={{ transform: `scale(${imageScale})` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-200/60 border border-neutral-300/50" />
          )}
        </div>
      </div>

      {/* Text content */}
      <div className="px-5 pt-4 pb-5">
        <h3 className="text-base font-medium text-neutral-800 mb-1.5 font-['Inter']">
          {title}
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
