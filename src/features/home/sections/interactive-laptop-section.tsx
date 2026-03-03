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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Handle the pinning here
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=150%', // Pin for 1.5x the viewport height
      pin: true,
      anticipatePin: 1,
    });

    return () => {
      st.kill();
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
    </section>
  );
}
