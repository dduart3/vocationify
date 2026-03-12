import { useRef, useEffect, useState } from 'react';
import { LaptopStraight } from '../components/laptop-straight';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AIAnalysisFeature() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      title: "Análisis Semántico",
      text: "Entiende tu potencial a través de un análisis semántico profundo impulsado por IA.",
      video: "/videos/ai-feature-1.mp4"
    },
    {
      title: "Conversación Natural",
      text: "Conversaciones naturales que revelan tus verdaderas pasiones e intereses profesionales.",
      video: "/videos/ai-feature-2.mp4"
    },
    {
      title: "Psicometría RIASEC",
      text: "Precisión psicométrica basada en el modelo RIASEC para un mapeo vocacional exacto.",
      video: "/videos/ai-feature-3.mp4"
    },
    {
      title: "Mercado Laboral",
      text: "Explora un universo de carreras con datos actualizados del mercado laboral real.",
      video: "/videos/ai-feature-1.mp4"
    },
    {
      title: "Éxito Profesional",
      text: "Recomendaciones inteligentes que conectan tu personalidad con tu futuro éxito.",
      video: "/videos/ai-feature-2.mp4"
    }
  ];

  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillHighlightRef = useRef<HTMLDivElement>(null);
  const pillTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    // Initial state: first feature is visible
    gsap.set(textRefs.current.slice(1), { y: "150%", opacity: 0 });
    gsap.set(textRefs.current[0], { y: "0%", opacity: 1 });
    
    // Initial state for the pill switcher highlight
    if (pillRefs.current[0] && pillHighlightRef.current) {
      gsap.set(pillHighlightRef.current, {
        width: pillRefs.current[0].offsetWidth,
        x: pillRefs.current[0].offsetLeft
      });
    }

    const animateTo = (newIndex: number) => {
      const currentText = textRefs.current[activeIndexRef.current];
      const nextText = textRefs.current[newIndex];
      const goingDown = newIndex > activeIndexRef.current;

      // Animate Pill Switcher Highlighting & Track Sliding
      const nextPill = pillRefs.current[newIndex];
      if (nextPill && pillHighlightRef.current && pillTrackRef.current) {
        // 1. Move the highlight within the track
        gsap.to(pillHighlightRef.current, {
          x: nextPill.offsetLeft,
          width: nextPill.offsetWidth,
          duration: 0.6,
          ease: "power3.inOut"
        });

        // 2. Slide the TRACK itself to keep the active pill visible/centered
        let targetX = nextPill.offsetLeft - 20;
        
        // If it's the last item, push the track enough to the left 
        // to leave a nice visually balanced padding on the right edge.
        if (newIndex === features.length - 1) {
          targetX = nextPill.offsetLeft + nextPill.offsetWidth - 245;
        }

        // Ensure we don't restrict the targetX with a too-small maxScroll
        const maxScroll = Math.max(0, pillTrackRef.current.scrollWidth - 220);
        const trackX = Math.max(0, Math.min(targetX, maxScroll));
        
        gsap.to(pillTrackRef.current, {
           x: -trackX,
           duration: 0.6,
           ease: "power3.inOut"
        });
      }

      // Animate Text Reveal
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

      activeIndexRef.current = newIndex;
      setActiveIndex(newIndex);
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${features.length * 50}%`,
      pin: true,
      onUpdate: (self) => {
        const p = self.progress;
        const segment = 1 / features.length;
        const newIndex = Math.min(Math.floor(p / segment), features.length - 1);
        
        if (newIndex !== activeIndexRef.current) {
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
      className="relative w-full h-screen flex items-center justify-center overflow-visible bg-transparent z-30 font-inter"
      style={{
        maskImage: 'linear-gradient(to bottom, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 92%, transparent 100%)'
      }}
    >
      {/* Background - Mirrored from previous section for perfect seamless continuity */}
      <div className="absolute inset-0 z-0 overflow-visible pointer-events-none bg-transparent">
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
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay z-50 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '120px 120px',
            }}
          />
      </div>

      <div className="container mx-auto px-6 lg:px-24 relative z-20 h-full flex flex-col items-center md:items-start justify-center pt-4 md:pt-0 pb-56 md:pb-0 max-w-[1400px]">
        {/* Top Feature Slider Switcher - Solid Container with Color Edge Fades */}
        <div className="mb-8 relative w-[280px] h-[40px] bg-slate-200/80 border border-slate-300 rounded-full backdrop-blur-md shadow-inner overflow-hidden">
          {/* Sliding Content Container */}
          <div className="absolute inset-0 px-2 overflow-hidden">
             <div 
                ref={pillTrackRef}
                className="relative flex items-center h-full p-1 w-max will-change-transform bg-transparent"
             >
                {/* Animated 3D Sliding Blue Highlight */}
                <div 
                  ref={pillHighlightRef}
                  className="absolute left-1 top-1 bottom-1 bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_6px_rgba(37,99,235,0.4)] rounded-full z-0"
                  style={{
                    width: pillRefs.current[0]?.offsetWidth || 140,
                    transform: `translateX(${pillRefs.current[0]?.offsetLeft || 0}px)`
                  }}
                />

                {features.map((feature, index) => (
                  <div
                    key={index}
                    ref={el => { pillRefs.current[index] = el; }}
                    className={`relative z-10 px-4 py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 whitespace-nowrap cursor-default ${
                      activeIndex === index ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {feature.title}
                  </div>
                ))}
              </div>
          </div>

          {/* Left Gradient Mask - Showing only when at the last feature */}
          {activeIndex === features.length - 1 && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-200 via-slate-200/50 to-transparent pointer-events-none z-20" />
          )}

          {/* Right Gradient Mask - Showing when there's more content to the right */}
          {activeIndex < features.length - 1 && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-200 via-slate-200/50 to-transparent pointer-events-none z-20" />
          )}
        </div>

        {/* Left Side: Minimal Content Container with masked animation */}
        <div className="w-full max-w-2xl relative h-[200px] md:h-[300px] flex items-center justify-center md:justify-start overflow-hidden -translate-y-4 md:translate-y-0">
          {features.map((feature, index) => (
             <p 
               key={index}
               ref={el => { textRefs.current[index] = el; }}
               className="absolute inset-0 flex items-center md:items-center justify-center md:justify-start text-center md:text-left text-[24px] md:text-[32px] lg:text-[38px] xl:text-[46px] 2xl:text-[54px] text-[#111111] font-normal tracking-[-0.05em] leading-[1.1] max-w-3xl font-inter antialiased"
             >
               {feature.text}
             </p>
           ))}
         </div>
      </div>



      {/* Laptop and entrance animation container - Only animates on initial mount */}
      <div className="absolute inset-0 w-full h-full z-10 animate-in fade-in zoom-in-95 duration-1000 delay-300 pointer-events-none">
        {/* State-dependent wrapper - No entrance animations here to prevent re-triggering */}
        <div className="w-full h-full flex flex-col justify-end md:justify-center">
          <div className="relative w-full h-full flex items-end md:items-center justify-center translate-x-0 md:translate-x-[25%] lg:translate-x-[35%] pb-8 md:pb-0 mt-8">
            <LaptopStraight videoUrl={features[activeIndex].video} />
            {/* Ambient glow behind the straight laptop */}
          </div>
        </div>
      </div>
    </section>
  );
}
