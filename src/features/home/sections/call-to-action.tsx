import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { Persona } from '@/components/ai-elements/persona'

// Careers for the floating pills positioned in a tight arch around the top of the sphere
const CAREERS = [
  // Left Side
  { name: "Psicología",        top: "5%",  left: "-15%", delay: "0.8s", rotation: "-12deg" },
  { name: "Ing. Sistemas",     top: "22%", left: "-2%",  delay: "2.1s", rotation: "8deg" },
  { name: "Ing. Mecatrónica",  top: "40%", left: "-20%", delay: "0.2s", rotation: "-14deg" },
  { name: "Diseño Gráfico",    top: "60%", left: "-5%",  delay: "1.5s", rotation: "-5deg" },
  { name: "Comunicación",      top: "78%", left: "-12%", delay: "0.5s", rotation: "-8deg" },
  
  // Right Side 
  { name: "Ing. Electrónica",  top: "10%", right: "-10%", delay: "0.5s", rotation: "10deg" },
  { name: "Mercadeo",          top: "28%", right: "-2%",  delay: "2.5s", rotation: "3deg" },
  { name: "Arquitectura",      top: "48%", right: "-18%", delay: "1.1s", rotation: "12deg" },
  { name: "Derecho",           top: "68%", right: "0%",   delay: "0.5s", rotation: "-6deg" },
  { name: "Odontología",       top: "86%", right: "-14%", delay: "0.2s", rotation: "15deg" },
]

export function CTASection() {
  const { isAuthenticated } = useAuth()
  
  return (
    <section className="relative w-full bg-[#f8fafc] overflow-hidden pt-24 lg:pt-32 pb-0 font-inter z-20 flex flex-col items-center">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col justify-start items-center text-center">
        
        {/* Floating Pills - 3D depth style spread left and right */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
            {CAREERS.map((career, i) => (
              <div 
                key={i}
                className="absolute will-change-transform"
                style={{ 
                  top: career.top, 
                  ...(career.left ? { left: career.left } : {}),
                  ...(career.right ? { right: career.right } : {}),
                  animation: `float-pill 6s ease-in-out infinite alternate`,
                  animationDelay: career.delay,
                }}
              >
                <div 
                  className="px-8 py-4 bg-gradient-to-b from-white to-slate-100 text-slate-600 font-bold text-[16px] leading-none rounded-full border border-slate-200 shadow-[0_6px_0_#cbd5e1,0_12px_20px_rgba(148,163,184,0.3)] transition-transform duration-300 pointer-events-auto hover:-translate-y-[2px] cursor-default whitespace-nowrap"
                  style={{ transform: `rotate(${career.rotation})` }}
                >
                  {career.name}
                </div>
              </div>
            ))}
        </div>

        {/* Text and Button at the Top */}
        <div className="relative z-40 max-w-3xl mx-auto flex flex-col items-center mb-16 sm:mb-20">
            <h2 className="text-4xl md:text-[52px] lg:text-[64px] font-normal text-slate-800 tracking-tight leading-[1.05] mb-6 drop-shadow-sm">
                Desbloquea tu potencial.<br />
                Comienza a explorar hoy.
            </h2>
            
            <p className="text-[17px] md:text-[19px] text-slate-500 mb-10 max-w-2xl font-light leading-relaxed px-4">
                Nuestra IA generativa analiza tus habilidades, intereses y estilo para encontrar carreras increíbles que realmente encajan contigo.
            </p>

            {/* Single Blue 3D Depth Button */}
            <Link
                to={isAuthenticated ? "/vocational-test" : "/register"}
                className="group/btn relative overflow-hidden inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-[18px] text-white bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_15px_rgba(37,99,235,0.35)] hover:from-blue-400 hover:to-blue-500 hover:border-blue-400 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_8px_20px_rgba(37,99,235,0.4)] active:shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_2px_5px_rgba(37,99,235,0.3)] active:scale-[0.98] transition-all duration-200"
            >
                <span className="absolute inset-0 -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" aria-hidden />
                <span className="relative z-10">{isAuthenticated ? "Comenzar Análisis" : "Comenzar Análisis"}</span>
                <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
        </div>

        {/* Center Content: White Sphere & Floating Pills - Cropped at bottom */}
        {/* Negative margin pulls the bottom boundary up, effectively cropping it in half */}
        <div className="relative w-full max-w-7xl h-[450px] flex items-start justify-center -mb-[220px] sm:-mb-[260px]">
          
          {/* Persona Core */}
          <div className="relative z-30 flex items-center justify-center -mt-4 sm:-mt-8">
             <Persona variant="obsidian" state="listening" className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] drop-shadow-2xl" />
          </div>

          {/* Mobile visible pills */}
          <div className="absolute top-[5%] left-[2%] sm:hidden animate-[float-pill_5s_ease-in-out_infinite_alternate]">
             <div className="px-4 py-2 bg-gradient-to-b from-white to-slate-100 text-slate-600 font-bold text-[11px] rounded-full border border-slate-200 shadow-[0_4px_0_#cbd5e1,0_10px_15px_rgba(148,163,184,0.3)] rotate-[-6deg]">
                Ing. Electrónica
             </div>
          </div>
          <div className="absolute top-[-5%] left-[50%] -translate-x-1/2 sm:hidden animate-[float-pill_4s_ease-in-out_infinite_alternate_0.5s]">
             <div className="px-4 py-2 bg-gradient-to-b from-white to-slate-100 text-slate-600 font-bold text-[11px] rounded-full border border-slate-200 shadow-[0_4px_0_#cbd5e1,0_10px_15px_rgba(148,163,184,0.3)] rotate-[0deg]">
                Mercadeo
             </div>
          </div>
          <div className="absolute top-[10%] right-[2%] sm:hidden animate-[float-pill_6s_ease-in-out_infinite_alternate_1s]">
             <div className="px-4 py-2 bg-gradient-to-b from-white to-slate-100 text-slate-600 font-bold text-[11px] rounded-full border border-slate-200 shadow-[0_4px_0_#cbd5e1,0_10px_15px_rgba(148,163,184,0.3)] rotate-[6deg]">
                Diseño Gráfico
             </div>
          </div>
        </div>

      </div>

      {/* Floating Animation Styles */}
      <style>{`
        @keyframes float-pill {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  )
}
