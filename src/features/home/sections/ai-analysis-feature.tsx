import { useRef, useEffect } from 'react';
import { LaptopStraight } from '../components/laptop-straight';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AIAnalysisFeature() {
  const sectionRef = useRef<HTMLElement>(null);
  const features = [
    "Entiende tu potencial a través de un análisis semántico profundo impulsado por IA.",
    "Conversaciones naturales que revelan tus verdaderas pasiones e intereses profesionales.",
    "Precisión psicométrica basada en el modelo RIASEC para un mapeo vocacional exacto.",
    "Explora un universo de carreras con datos actualizados del mercado laboral real.",
    "Recomendaciones inteligentes que conectan tu personalidad con tu futuro éxito."
  ];

  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Initial state: first feature is visible
    gsap.set(textRefs.current.slice(1), { y: "150%", opacity: 0 });
    gsap.set(textRefs.current[0], { y: "0%", opacity: 1 });

    const animateTo = (newIndex: number) => {
      if (newIndex === currentIndexRef.current) return;
      
      const currentText = textRefs.current[currentIndexRef.current];
      const nextText = textRefs.current[newIndex];
      const goingDown = newIndex > currentIndexRef.current;

      gsap.to(currentText, {
        y: goingDown ? "-150%" : "150%",
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut"
      });

      gsap.fromTo(nextText, 
        { y: goingDown ? "150%" : "-150%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.8,
          ease: "power2.inOut",
          overwrite: true
        }
      );

      currentIndexRef.current = newIndex;
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${features.length * 80}%`,
      pin: true,
      onUpdate: (self) => {
        const p = self.progress;
        const segment = 1 / features.length;
        const newIndex = Math.min(Math.floor(p / segment), features.length - 1);
        
        if (newIndex !== currentIndexRef.current) {
          animateTo(newIndex);
        }
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full h-screen flex items-center justify-center overflow-visible bg-[#f8fafc] z-30 font-inter"
    >
      {/* Background - Mirrored from previous section for perfect seamless continuity */}
      <div className="absolute inset-0 z-0 overflow-visible pointer-events-none bg-[#f8fafc]">
          {/* 1. The Multi-Color Pastel Gradient Background (Fading Top to Bottom) */}
          <div 
            className="absolute inset-x-0 top-0 h-full opacity-100" 
            style={{
              background: 'linear-gradient(to right, #fbcfe8 0%, #e9d5ff 50%, #bae6fd 100%)',
              maskImage: 'linear-gradient(to bottom, black 10%, transparent 65%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 65%)'
            }}
          />

          {/* 2. The Ellipse from Bottom to Top (creating the U-shape upward arch) */}
          <div className="absolute -bottom-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[95vh] bg-[#f8fafc] rounded-[50%] blur-[70px]" />
          <div className="absolute -bottom-[5%] left-1/2 -translate-x-1/2 w-[70vw] h-[90vh] bg-[#f8fafc] rounded-[50%] blur-[40px]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55vw] h-[85vh] bg-[#f8fafc] rounded-[50%] blur-[20px]" />

          {/* Premium Fine Grain Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.25] mix-blend-overlay z-50 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '120px 120px',
            }}
          />
      </div>

      <div className="container mx-auto px-6 lg:px-24 relative z-20 h-full flex flex-col md:flex-row items-center md:items-center justify-center md:justify-start pt-10 md:pt-0 pb-32 md:pb-0 max-w-[1400px]">
        {/* Left Side: Minimal Content Container with masked animation */}
        <div className="w-full max-w-2xl relative h-[250px] md:h-[450px] flex items-center justify-center md:justify-start overflow-hidden">
          {features.map((text, index) => (
             <p 
               key={index}
               ref={el => { textRefs.current[index] = el; }}
               className="absolute inset-0 flex items-center md:items-center justify-center md:justify-start text-center md:text-left text-[28px] md:text-[36px] lg:text-[44px] xl:text-[52px] 2xl:text-[64px] text-[#111111] font-normal tracking-[-0.05em] leading-[1.1] max-w-3xl font-inter antialiased"
             >
               {text}
             </p>
           ))}
         </div>
      </div>

      <div className="absolute inset-0 w-full h-full z-10 animate-in fade-in zoom-in-95 duration-1000 delay-300 pointer-events-none flex flex-col justify-end md:justify-center">
        <div className="relative w-full h-full flex items-end md:items-center justify-center translate-x-0 md:translate-x-[25%] lg:translate-x-[35%] pb-8 md:pb-0 mt-8">
          <LaptopStraight />
          {/* Ambient glow behind the straight laptop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-50/50 blur-[120px] -z-10 rounded-full" />
        </div>
      </div>
    </section>
  );
}
