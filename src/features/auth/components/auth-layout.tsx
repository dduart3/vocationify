import { useRef, useEffect, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import gsap from 'gsap'
import { IconArrowLeft } from '@tabler/icons-react'
import { MeshGradient } from '@paper-design/shaders-react'
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
  const formContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const formContainer = formContainerRef.current

    if (formContainer) {
      gsap.fromTo(formContainer, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col md:flex-row overflow-hidden">
      {/* 1. Left Decorative Side (Approx 42% width) */}
      <div className="hidden md:flex w-[42%] lg:w-[45%] h-screen p-3 lg:p-4 flex-col shrink-0">
        <div className="flex-1 relative rounded-[2.25rem] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)]">
          {/* Mesh Gradient Shader Background inside the card */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <MeshGradient
              colors={["#1d4ed8", "#1e40af", "#1e3a8a", "#2563eb"]}
              speed={0.3}
              distortion={2}
              swirl={0.1}
              className="w-full h-full"
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            />
          </div>
            
            {/* Extra Large Blended Logo Icon - Centered/Cropped with Texture */}
            <div className="absolute -bottom-[65%] -right-[80%] w-[1800px] h-[1800px] opacity-[0.16] mix-blend-overlay pointer-events-none z-0">
               <div className="relative w-full h-full">
                 <img 
                  src="/vocationify-icon.svg" 
                  alt="" 
                  className="w-full h-full object-contain" 
                 />
                 {/* Internal Icon Texture Overlay */}
                 <div 
                  className="absolute inset-0 opacity-[0.5] mix-blend-soft-light pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '80px 80px',
                  }}
                />
               </div>
            </div>

            {/* Centered Persona AI Element - Small and subtle reference removed */}
            
            {/* Grain Effect - Topmost layer of the decorative card */}
            <div 
              className="absolute inset-0 opacity-[0.65] mix-blend-overlay pointer-events-none z-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.0' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '120px 120px',
              }}
            />

          <div className="relative z-10 flex flex-col h-full p-12 lg:p-14 justify-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/70 mb-6">
                Vocationify AI
              </p>
              <h2 className="text-[1.85rem] lg:text-[2.25rem] font-bold tracking-tight text-white leading-[1.1] max-w-[340px]">
                Descubre tu camino profesional con claridad y propósito
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Right Form Side */}
      <div className="flex-1 flex flex-col relative bg-white">
        {/* Simple Back button - Top Right */}
        {showBackButton && (
          <Link
            to={backTo}
            className="absolute top-8 left-0 right-0 sm:left-auto sm:right-8 sm:top-10 lg:right-12 lg:top-12 flex items-center justify-center sm:justify-start text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors gap-2 z-50"
          >
            <IconArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        )}

        {/* Content Centered Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 lg:p-20">
          <div ref={formContainerRef} className="w-full max-w-[420px] flex flex-col">
            <div className="flex flex-col text-center sm:text-left items-center sm:items-start mb-10">
              {showLogo && (
                 <div className="mb-8">
                   <Logo size={42} showText={false} />
                 </div>
              )}
              <h1 className="text-[2.25rem] font-black tracking-tight text-slate-900 mb-3 leading-[1.1]">
                {title}
              </h1>
              <p className="text-[15px] leading-relaxed text-slate-500 max-w-[340px]">
                {subtitle}
              </p>
            </div>
            
            <div className="w-full">
              {children}
            </div>
            
            <div className="border-t border-slate-100 pt-8 mt-10">
              <p className="text-center sm:text-left text-[14px] text-slate-400 leading-relaxed font-medium">
                Al continuar, aceptas nuestros{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 hover:text-slate-600 font-bold transition-all"
                >
                  Términos de servicio
                </a>{" "}
                y{" "}
                <a
                  href="#"
                  className="underline underline-offset-4 hover:text-slate-600 font-bold transition-all"
                >
                  Política de privacidad
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}


