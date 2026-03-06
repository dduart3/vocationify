import { ArrowRight, Wand2 } from "lucide-react";
import { LaptopStraight } from "../components/laptop-straight";
import { Link } from "@tanstack/react-router";

export function SleekLaptopSection() {
  return (
    <section className="w-full min-h-[90vh] flex items-center justify-center relative bg-transparent overflow-visible z-20 font-inter py-32">
      
      {/* Subtle sleek ambient light */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-slate-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 opacity-60" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="flex-1 w-full max-w-xl flex flex-col items-start justify-center">
            
            <div className="inline-flex items-center gap-2 mb-8 origin-left animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">
                <Wand2 className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Diseño Premium
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-semibold tracking-tight text-slate-900 leading-[1.15] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
              La claridad <br/>
              <span className="text-slate-400">que necesitas.</span>
            </h2>
            
            <p className="text-[17px] text-slate-500 font-normal leading-relaxed mb-10 max-w-[28rem] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              Visualiza tus resultados de manera intuitiva. Nuestra plataforma procesa variables complejas y te entrega recomendaciones precisas en una interfaz limpia y minimalista, diseñada para que te concentres en lo que realmente importa.
            </p>
            
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
              <Link 
                to="/vocational-test"
                className="group flex items-center justify-center gap-3 bg-black hover:bg-neutral-800 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] text-[15px]"
              >
                Explorar plataforma
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* Right 3D Laptop */}
          <div className="flex-1 w-full lg:w-1/2 relative lg:-mr-12 xl:-mr-24 animate-in fade-in zoom-in-95 duration-1000 delay-700 fill-mode-both">
            <div className="w-full h-full relative z-10">
              <LaptopStraight />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
