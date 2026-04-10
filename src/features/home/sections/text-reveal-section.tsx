import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function TextRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const sentence = "Vocationify es la plataforma de IA que guía a miles de estudiantes en su futuro profesional gracias a su análisis vocacional avanzado y experto.";

  useGSAP(() => {
    if (!textContainerRef.current || !sectionRef.current) return;

    const words = textContainerRef.current.querySelectorAll('.reveal-word');
    
    // 1. Entry Fade-in for the whole container to smooth the transition
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: true,
        }
      }
    );

    // 2. The main reveal animation with pinning
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top", 
        end: "+=120%", // Slightly longer for a better feel
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      }
    });

    tl.fromTo(words, 
      { 
        opacity: 0.15,
        color: "#cbd5e1", 
        y: 2,
      }, 
      { 
        opacity: 1,
        y: 0,
        color: "#2563eb", 
        stagger: 0.2,
        duration: 2,
        ease: "power2.out"
      }
    );

    // Add a small hold at the end so it doesn't unpin immediately after finishing the text
    tl.to({}, { duration: 1 });

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="h-screen w-full flex flex-col items-center justify-center relative bg-transparent overflow-clip z-30 font-inter"
    >
      {/* Background - Matching Vocational Test */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-transparent">
          {/* 1. The Multi-Color Pastel Gradient Background */}
          <div 
            className="absolute inset-x-0 bottom-0 h-full opacity-100" 
            style={{
              background: 'linear-gradient(to right, #fbcfe8 0%, #e9d5ff 50%, #bae6fd 100%)',
              // Smooth entry mask from top
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)'
            }}
          />

          {/* The Ellipse from Top to Bottom (creating the U-shape downward arch) */}
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[95vh] bg-[#f8fafc] rounded-[50%] blur-[70px]" />
          <div className="absolute -top-[5%] left-1/2 -translate-x-1/2 w-[70vw] h-[90vh] bg-[#f8fafc] rounded-[50%] blur-[40px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55vw] h-[85vh] bg-[#f8fafc] rounded-[50%] blur-[20px]" />
      </div>

      {/* 2. Premium Fine Grain Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 120px',
          // Fade grain in smoothly at top
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%)'
        }}
      />

      {/* 3. Anchoring accents */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-100/30 to-transparent" />

      {/* Inner Container with entry fade-in */}
      <div ref={containerRef} className="max-w-6xl mx-auto relative z-10 w-full flex flex-col items-start lg:pl-12 opacity-0 px-6">
        {/* Top small label mimic */}
        <div className="flex justify-between w-full mb-12 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold border-b border-slate-100/50 pb-4">
          <span>01 / IA Vocacional</span>
          <span>vocationify AI</span>
        </div>

        <div className="w-full max-w-4xl">
          <h2 
            ref={textContainerRef}
            className="text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight leading-[1.2] text-left text-slate-300 font-inter"
          >
            {sentence.split(' ').map((word, i) => (
              <span key={i} className="reveal-word inline-block mr-[0.25em] whitespace-nowrap font-bold">
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* Bottom details block mimic */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-16 mt-24 border-t border-slate-100/50 pt-12 w-full max-w-4xl items-start">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-900 mb-4 opacity-70">El Desafío</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Miles de estudiantes eligen sin guía, provocando deserción y frustración profesional.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-900 mb-4 opacity-70">La Solución</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Modelos de IA entrenados en psicometría para ofrecer orientación humana con precisión.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
            <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-900 mb-4 opacity-70">Desarrollado para</h4>
            {/* Visual crop container to remove white space from the logo asset */}
            <div className="md:-ml-3 -mt-2 overflow-hidden w-48 md:w-56 h-16 md:h-20 flex items-center justify-center md:justify-start mix-blend-multiply">
              <img 
                src="/images/urbe.webp" 
                alt="Universidad URBE" 
                className="w-full h-full object-cover scale-60 translate-y-[-15%] md:translate-x-[-20%] origin-center grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
