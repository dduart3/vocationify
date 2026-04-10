import { Suspense, useRef, useEffect, lazy, useState, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Mic, Volume2 } from 'lucide-react';
import { Persona } from '@/components/ai-elements/persona';
import { Shimmer } from '@/components/ai-elements/shimmer';

gsap.registerPlugin(ScrollTrigger);

const Laptop3DLazy = lazy(() =>
  import('../components/laptop-3d')
    .then((module) => ({ default: module.Laptop3D }))
    .catch(() => ({
      default: function LaptopFallback() {
        return (
          <img
            src="/images/laptop-mockup.webp"
            alt="Vocationify app preview"
            className="w-full max-w-[100%] scale-120 mx-auto object-contain drop-shadow-2xl"
          />
        )
      },
    }))
)

export function InteractiveLaptopSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const text = "Explora el futuro de tu carrera con Aria";
  
  const chatBubble1Ref = useRef<HTMLDivElement>(null);
  const chatBubble2Ref = useRef<HTMLDivElement>(null);
  const chatBubble3Ref = useRef<HTMLDivElement>(null);
  const voiceRef = useRef<HTMLDivElement>(null);
  const voiceSwitchRef = useRef<HTMLDivElement>(null);
  const voiceThumbRef = useRef<HTMLDivElement>(null);
  const voiceLabelRef = useRef<HTMLDivElement>(null);
  const chatLabelRef = useRef<HTMLDivElement>(null);
  const personaContainerRef = useRef<HTMLDivElement>(null);
  const personaListeningIconRef = useRef<HTMLDivElement>(null);
  const personaProcessingIconRef = useRef<HTMLDivElement>(null);
  const personaSpeakingIconRef = useRef<HTMLDivElement>(null);
  const transcriptBoxContainerRef = useRef<HTMLDivElement>(null);
  const transcribingShimmerRef = useRef<HTMLDivElement>(null);
  const userTypedTextRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const ariaAnswerContainerRef = useRef<HTMLDivElement>(null);

  const ariaWordsText = "¡Genial! El diseño UX y la estética creativa es una excelente ruta. ¿Quieres explorar recursos tecnológicos creativos?";
  const userTypedText = "Me gusta el diseño y la tecnología";
  
  const ariaWordsArray = useMemo(() => ariaWordsText.split(' '), []);
  const userWordsArray = useMemo(() => userTypedText.split(' '), []);
  const charsArray = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    // Optimization: Defer mounting the 3D heavy canvas until it's actually needed
    // This solves the "chunky" feeling during hero entrance
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Start loading a bit before it enters
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || !textRef.current || !chatRef.current || !voiceRef.current) return;

    // Text animation setup
    const chars = textRef.current.querySelectorAll('.char');
    
    // Grouped initial state sets for efficiency
    gsap.set([chars, textRef.current, chatRef.current, voiceRef.current, chatBubble1Ref.current, chatBubble2Ref.current, chatBubble3Ref.current, voiceSwitchRef.current], { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    });
    
    gsap.set(chars, { y: 15 });
    gsap.set(voiceThumbRef.current, { x: 88 });
    gsap.set(chatLabelRef.current, { color: "#ffffff" });
    gsap.set(voiceLabelRef.current, { color: "#64748b" });

    const userWords = userTypedTextRef.current ? gsap.utils.toArray(userTypedTextRef.current.querySelectorAll('.user-word')) : [];
    const ariaWords = ariaAnswerContainerRef.current ? gsap.utils.toArray(ariaAnswerContainerRef.current.querySelectorAll('.aria-word')) : [];

    gsap.set(userWords, { opacity: 0 });
    gsap.set(transcriptBoxContainerRef.current, { opacity: 1, scale: 1, y: 0 });
    gsap.set(personaListeningIconRef.current, { opacity: 1 });
    gsap.set(personaProcessingIconRef.current, { opacity: 0 });
    gsap.set(personaSpeakingIconRef.current, { opacity: 0 });
    gsap.set(ariaAnswerContainerRef.current, { opacity: 0, y: 10 });
    gsap.set(ariaWords, { color: "rgba(51,65,85,0.3)" });

    // Master Direct Scroll Timeline mapped to 0-100 to match 3D laptop exactly
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=600%',
        pin: true,
        scrub: 2,
        anticipatePin: 1
      }
    });

    masterTl
      // Text Appears
      .to(textRef.current, { opacity: 1, duration: 1 }, 2)
      .to(chars, { y: 0, opacity: 1, stagger: 0.05, ease: "power2.out", duration: 3 }, 2)
      
      // Text Disappears (Sliding UP to the other side, staggering from start)
      .to(chars, { 
        y: -40, 
        opacity: 0, 
        stagger: 0.04, 
        ease: "power2.inOut", 
        duration: 2.5 
      }, 10)
      .to(textRef.current, { opacity: 0, duration: 1 }, 12.5)

      // Chat Appears
      .to(chatRef.current, { opacity: 1, duration: 0.5 }, 20)
      .to(chatBubble1Ref.current, { y: 0, opacity: 1, scale: 1, duration: 3, ease: "back.out(1.2)" }, 20)
      .to(chatBubble2Ref.current, { y: 0, opacity: 1, scale: 1, duration: 3, ease: "back.out(1.2)" }, 22)
      .to(chatBubble3Ref.current, { y: 0, opacity: 1, scale: 1, duration: 3, ease: "back.out(1.2)" }, 24)

      // Chat Sucks In
      .to([chatBubble1Ref.current, chatBubble3Ref.current], { 
        x: 400, y: 150, scale: 0, opacity: 0, duration: 3, ease: "expo.in" 
      }, 35)
      .to(chatBubble2Ref.current, { 
        x: -400, y: -150, scale: 0, opacity: 0, duration: 3, ease: "expo.in" 
      }, 35)
      .to(chatRef.current, { opacity: 0, duration: 1 }, 38)

      // Voice Appears
      .to(voiceRef.current, { opacity: 1, duration: 1 }, 42)
      .to(voiceSwitchRef.current, { y: 0, opacity: 1, scale: 1, duration: 2, ease: "back.out(1.4)" }, 42)
      .to(voiceThumbRef.current, { x: 0, duration: 2, ease: "power3.inOut" }, 45)
      .to(voiceLabelRef.current, { color: "#ffffff", duration: 1 }, 45)
      .to(chatLabelRef.current, { color: "#64748b", duration: 1 }, 45)

      // Voice Disappears (Right as laptop starts dropping down at 55%)
      .to(voiceRef.current, { opacity: 0, scale: 0.95, duration: 2 }, 53)

      // Persona Appears (Fully visible after laptop drops at 65%)
      .to(personaContainerRef.current, { opacity: 1, scale: 1, y: 0, duration: 4, ease: "back.out(1.2)" }, 66)

      // User Types Text
      .to(transcribingShimmerRef.current, { opacity: 0, duration: 1 }, 72)
      .to(userWords, { opacity: 1, stagger: 0.5, duration: 3 }, 72)

      // Send & Process Message
      .to(transcriptBoxContainerRef.current, { opacity: 0, scale: 0.8, y: -20, duration: 2 }, 80)
      .to(personaListeningIconRef.current, { opacity: 0, duration: 1 }, 80)
      .to(personaProcessingIconRef.current, { opacity: 1, duration: 1 }, 81)

      // Aria Answers
      .to(personaProcessingIconRef.current, { opacity: 0, duration: 1 }, 87)
      .to(personaSpeakingIconRef.current, { opacity: 1, duration: 1 }, 87)
      .to(ariaAnswerContainerRef.current, { opacity: 1, y: 0, duration: 3, ease: "back.out(1.2)" }, 87)
      .to(ariaWords, { color: "#334155", stagger: 0.3, duration: 5, ease: "power1.inOut" }, 89)
      
      // Final padding to ensure timeline adds up exactly to 100 for perfect synchronization
      .to({}, { duration: 1 }, 100);

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      id="interactive-laptop-container"
      className="relative w-full h-[100vh] flex items-center justify-center pointer-events-auto overflow-hidden bg-transparent"
    >
      <div className="relative w-full h-full flex items-center justify-center p-0 m-0 z-10">
        {shouldMount && (
          <Suspense fallback={
            <div className="flex items-center justify-center w-full h-full text-black/40 font-medium">
              Cargando interactividad 3D...
            </div>
          }>
            <Laptop3DLazy />
          </Suspense>
        )}
      </div>

      {/* Chat Mockup Overlay */}
      <div 
        ref={chatRef}
        className="absolute top-[20%] md:top-[24%] left-1/2 -translate-x-1/2 w-full max-w-[1400px] flex flex-col z-[100] pointer-events-none px-6 md:px-12"
      >
        <div ref={chatBubble1Ref} className="relative mb-16 self-start w-full max-w-sm md:max-w-md">
           <div 
              className="absolute -left-[16px] md:-left-[52px] top-1 hidden md:flex items-center justify-center w-10 h-10 rounded-full z-10 shadow-[0_4px_10px_rgba(0,0,0,0.15)] border border-gray-300 ring-1 ring-white/50"
              style={{ background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e7eb 30%, #9ca3af 70%, #4b5563 100%)' }}
            >
              <div className="absolute inset-0 opacity-[0.3] mix-blend-overlay rounded-full pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '40px 40px' }} />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(255,255,255,0.8),inset_0_1px_3px_rgba(255,255,255,0.9)] pointer-events-none" />
            </div>
            <div className='bg-gray-100 text-slate-900 w-full rounded-[24px] rounded-bl-[4px] px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-200 md:ml-0 ml-4'>
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  Hola, veo que te interesa la tecnología. ¿Has pensado en Ingeniería de Software?
              </div>
            </div>
        </div>

        <div ref={chatBubble2Ref} className="relative mb-16 self-end w-full max-w-sm md:max-w-md">
            <div className='bg-blue-50 text-blue-600 rounded-[24px] rounded-br-[4px] w-full px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-blue-100/50'>
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  Sí, pero también me gusta el diseño y crear interfaces iterativas.
              </div>
            </div>
        </div>

        <div ref={chatBubble3Ref} className="relative self-start w-full max-w-sm md:max-w-md">
           <div 
              className="absolute -left-[16px] md:-left-[52px] top-1 hidden md:flex items-center justify-center w-10 h-10 rounded-full z-10 shadow-[0_4px_10px_rgba(0,0,0,0.15)] border border-gray-300 ring-1 ring-white/50"
              style={{ background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #e5e7eb 30%, #9ca3af 70%, #4b5563 100%)' }}
            >
              <div className="absolute inset-0 opacity-[0.3] mix-blend-overlay rounded-full pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '40px 40px' }} />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(255,255,255,0.8),inset_0_1px_3px_rgba(255,255,255,0.9)] pointer-events-none" />
            </div>
            <div className='bg-gray-100 text-slate-900 w-full rounded-[24px] rounded-bl-[4px] px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-200 md:ml-0 ml-4'>
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  ¡Entiendo! Entonces el diseño UX/UI o el desarrollo Frontend creativo serían ideales para ti.
              </div>
            </div>
        </div>
      </div>

      {/* Voice Mode Mockup Overlay */}
      <div 
        ref={voiceRef}
        className="absolute top-[22%] left-0 w-full flex flex-col items-center justify-center z-50 pointer-events-none px-4"
      >
        <h3 className="text-2xl md:text-4xl font-bold text-slate-800 mb-8 tracking-tight text-center">
          O habla directamente con ARIA
        </h3>
        
        <div ref={voiceSwitchRef} className="flex items-center justify-center pointer-events-auto">
          {/* 3D Deep Embedded Pill Track */}
          <div className="relative flex items-center p-1.5 bg-slate-200/80 border border-slate-300 rounded-full backdrop-blur-md shadow-inner">
            
            {/* Animated 3D Sliding Blue Thumb */}
            <div 
              ref={voiceThumbRef}
              className="absolute left-1.5 top-1.5 bottom-1.5 w-[88px] bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_6px_rgba(37,99,235,0.4)] rounded-full"
            />

            {/* Voice Button Label */}
            <div 
              ref={voiceLabelRef}
              className="relative z-10 flex items-center justify-center gap-2 w-[88px] h-8 text-slate-500 transition-colors duration-300 text-xs font-semibold tracking-wide"
            >
              <Mic className="w-3.5 h-3.5" />
              Voz
            </div>

            {/* Chat Button Label */}
            <div 
              ref={chatLabelRef}
              className="relative z-10 flex items-center justify-center gap-2 w-[88px] h-8 text-white transition-colors duration-300 text-xs font-semibold tracking-wide"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chat
            </div>
          </div>
        </div>
      </div>

      {/* Background Text Overlay */}
      <div className="absolute top-[30%] left-0 w-full flex justify-center z-0 pointer-events-none px-4">
        <h2 
          ref={textRef}
          className="text-4xl md:text-6xl font-bold text-slate-800 text-center tracking-tight leading-tight opacity-0"
        >
          {charsArray.map((char, i) => (
            <span key={i} className="char inline-block min-w-[0.1em] origin-bottom opacity-0">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
      </div>

      {/* Persona Mockup Overlay */}
      <div 
        ref={personaContainerRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none px-4 opacity-0 translate-y-8 scale-95"
      >
        <div className="relative flex justify-center items-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-60 animate-pulse" style={{ transform: 'scale(1.8)' }} />
          <div className="relative z-10 flex items-center justify-center">
            <Persona 
              variant="obsidian" 
              state="listening"
              className="w-48 h-48 sm:w-64 sm:h-64 drop-shadow-2xl" 
            />
            {/* Central 3D Deep State Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-[inset_0_3px_6px_rgba(255,255,255,0.6),0_8px_16px_rgba(0,0,0,0.6)] flex items-center justify-center relative">
                
                {/* Listening Icon */}
                <div ref={personaListeningIconRef} className="absolute inset-0 flex items-center justify-center gap-[3px]">
                  <div className="w-[3px] bg-gray-800 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] shadow-sm" style={{ height: '50%', animationDelay: '0ms' }} />
                  <div className="w-[3px] bg-gray-800 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] shadow-sm" style={{ height: '100%', animationDelay: '200ms' }} />
                  <div className="w-[3px] bg-gray-800 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] shadow-sm" style={{ height: '70%', animationDelay: '400ms' }} />
                  <div className="w-[3px] bg-gray-800 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] shadow-sm" style={{ height: '40%', animationDelay: '600ms' }} />
                </div>
                
                {/* Processing Icon */}
                <div ref={personaProcessingIconRef} className="absolute inset-0 flex items-center justify-center gap-1 opacity-0">
                  <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '300ms' }} />
                </div>
                
                {/* Speaking Icon */}
                <div ref={personaSpeakingIconRef} className="absolute inset-0 flex items-center justify-center opacity-0">
                   <Volume2 className="w-5 h-5 text-gray-800 drop-shadow-md animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aria Answer Mockup (Appears after transcript sends) */}
        <div ref={ariaAnswerContainerRef} className="absolute top-[65%] w-full flex justify-center opacity-0 translate-y-4">
           <h2 className="text-xl md:text-2xl font-medium tracking-wide leading-relaxed drop-shadow-lg text-center max-w-2xl px-4 text-slate-700/30">
               {ariaWordsArray.map((word, i) => (
                  <span key={i} className="aria-word transition-colors duration-300">
                     {word}{' '}
                  </span>
               ))}
           </h2>
        </div>

        {/* Transcript Box Mockup */}
        <div ref={transcriptBoxContainerRef} className="mt-6 flex justify-center items-end w-full relative z-30">
          <div className="flex items-start px-4 py-2.5 bg-[#171717] backdrop-blur-xl border border-white/10 rounded-2xl text-xs text-white/90 w-fit shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative">
            <div className="flex-shrink-0 mt-[2px] mr-3 w-3 h-3 rounded-[3px] bg-[#ff5a5a] shadow-[0_0_8px_rgba(255,90,90,0.4)]" />
            <div className="flex-1 font-medium tracking-wide break-words leading-relaxed overflow-hidden relative min-h-[16px] min-w-[120px]">
              <div ref={transcribingShimmerRef} className="absolute top-0 left-0 w-full h-full">
                <Shimmer className="[--color-background:#ffffff] [--color-muted-foreground:rgba(255,255,255,0.4)] whitespace-nowrap">
                  Transcribiendo...
                </Shimmer>
              </div>
              <div ref={userTypedTextRef} className="relative z-10 font-medium">
                  {userWordsArray.map((word, i) => (
                      <span key={i} className="user-word opacity-0">{word}{' '}</span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
