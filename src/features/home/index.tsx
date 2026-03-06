import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Background } from "./components/background";
import { CTASection } from "./sections/call-to-action";
// import { FeaturesSection } from "./sections/features";
import { HeroSection } from "./sections/hero";
import { TextRevealSection } from "./sections/text-reveal-section";
import { InteractiveLaptopSection } from "./sections/interactive-laptop-section";
import { AIAnalysisFeature } from "./sections/ai-analysis-feature";

export function Home() {
  return (
    <div className="min-h-screen text-foreground">
      {/* Header handles both authenticated and unauthenticated states beautifully */}
      <Header />

      {/* Main content area */}
      <div className="transition-all duration-500 ease-in-out z-0">
        <div className="relative overflow-x-clip">
          <Background />
          <HeroSection />
          <InteractiveLaptopSection />
          <TextRevealSection />
          <AIAnalysisFeature />
          <CTASection />
        </div>
      </div>

      {/* Footer is always present */}
      <Footer />
    </div>
  );
}
