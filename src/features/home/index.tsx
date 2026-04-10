import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Background } from "./components/background";
import { HeroSection } from "./sections/hero";
import { lazy, Suspense } from "react";

import { InteractiveLaptopSection } from "./sections/interactive-laptop-section";
import { TextRevealSection } from "./sections/text-reveal-section";
const AIAnalysisFeature = lazy(() => import("./sections/ai-analysis-feature").then(m => ({ default: m.AIAnalysisFeature })));
const CTASection = lazy(() => import("./sections/call-to-action").then(m => ({ default: m.CTASection })));

export function Home() {
  return (
    <div className="min-h-screen text-foreground relative">
      <Header />

      {/* Main content area */}
      <div className="transition-all duration-500 ease-in-out z-0">
        <div className="relative overflow-x-clip">
          <Background />
          <HeroSection />
          
          <InteractiveLaptopSection key="interactive-laptop" />
          <TextRevealSection key="text-reveal" />
          
          <Suspense fallback={<div className="h-[60vh] flex items-center justify-center text-slate-400 font-medium">Cargando experiencia...</div>}>
            <AIAnalysisFeature key="ai-analysis" />
            <CTASection key="cta" />
          </Suspense>
        </div>
      </div>

      {/* Footer is always present */}
      <Footer />
    </div>
  );
}
