import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

export function ProcessStep({
  number,
  title,
  description,
  icon: Icon,
  delay = 0,
}: ProcessStepProps) {
  const stepRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const step = stepRef.current;
    const circle = circleRef.current;
    const content = contentRef.current;
    const line = lineRef.current;

    if (!step || !circle || !content) return;

    // Initial state
    gsap.set(step, { opacity: 0, y: 50 });
    gsap.set(circle, { scale: 0, rotation: -180 });
    gsap.set(content, { opacity: 0, y: 20 });
    if (line) gsap.set(line, { scaleX: 0 });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: step,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
    tl.to(step, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: delay * 0.2,
      ease: "power3.out",
    })
      .to(
        circle,
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      )
      .to(
        content,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );

    if (line) {
      tl.to(
        line,
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }

    // Hover animation
    const handleMouseEnter = () => {
      gsap.to(circle, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(content, {
        y: -5,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(circle, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(content, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    step.addEventListener("mouseenter", handleMouseEnter);
    step.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      step.removeEventListener("mouseenter", handleMouseEnter);
      step.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [delay]);

  return (
    <div ref={stepRef} className="relative group cursor-pointer">
      {/* Connecting Line */}

      <div
        ref={lineRef}
        className="hidden md:block absolute top-10  w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 origin-left"
      />

      {/* Step Circle */}
      <div className="flex flex-col items-center text-center">
        <div
          ref={circleRef}
          className="relative w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
          style={{
            background: "transparent",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 50px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Icon and Number */}
          <div className="relative z-10 flex flex-col items-center">
            <Icon size={20} className="text-white mb-1" />
            <span className="text-xs font-bold text-neutral-300">{number}</span>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"></div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="max-w-xs">
          <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
