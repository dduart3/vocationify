import { Suspense, useRef, useEffect, lazy } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const text = "Explora el futuro de tu carrera con Aria";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !textRef.current) return;

    // Pinning trigger
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=150%',
      pin: true,
      anticipatePin: 1,
    });

    // Text animation timeline
    const chars = textRef.current.querySelectorAll('.char');
    // Initial state: Invisible
    gsap.set(chars, { y: 60, opacity: 0, scale: 0.9, rotateX: -30 });
    gsap.set(textRef.current, { '--mask-p': '0%' } as any);

    // Initial state: Invisible
    gsap.set(chars, { y: 20, opacity: 0 });
    gsap.set(textRef.current, { opacity: 0 });

    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: '70% top', // Entrance starts when laptop is fully open
        end: '95% top', 
        scrub: true,
      }
    });

    // Simple fade in + wavy for now to ensure visibility
    textTl.to(textRef.current, {
      opacity: 1,
      duration: 0.5
    })
    .to(chars, {
      y: 0,
      opacity: 1,
      stagger: 0.03,
      ease: "power2.out",
    }, 0);

    return () => {
      st.kill();
      textTl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="interactive-laptop-container"
      className="relative w-full h-[100vh] flex items-center justify-center pointer-events-auto overflow-hidden bg-gradient-to-b from-white to-[#f5fbff]"
    >
      <div 
        className="relative w-full h-full flex items-center justify-center p-0 m-0"
      >
        <Suspense fallback={
          <div className="flex items-center justify-center w-full h-full text-black">
            Cargando interactividad 3D...
          </div>
        }>
          <Laptop3DLazy />
        </Suspense>
      </div>

      {/* Background Text Overlay - Moved to bottom for Z-index safety */}
      <div className="absolute top-[30%] left-0 w-full flex justify-center z-50 pointer-events-none px-4">
        <h2 
          ref={textRef}
          className="text-4xl md:text-6xl font-bold text-slate-800 text-center tracking-tight leading-tight opacity-0"
        >
          {text.split('').map((char, i) => (
            <span key={i} className="char inline-block min-w-[0.1em] origin-bottom opacity-0">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
