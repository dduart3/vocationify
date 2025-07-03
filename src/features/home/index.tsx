import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { Footer } from "@/components/layout/footer";
import { Background } from "./components/background";
import { CTASection } from "./sections/call-to-action";
import { FeaturesSection } from "./sections/features";
import { HeroSection } from "./sections/hero";
import { ProcessSection } from "./sections/process";

export function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-neutral-950 dark:bg-neutral-950 text-white dark:text-white">
      {/* Conditionally render Header or Sidebar based on authentication */}
      {isAuthenticated ? <Sidebar /> : <Header />}

      {/* Main content area */}
      <div
        className={` transition-all duration-500 ease-in-out z-0`}
      >
        <div className="relative overflow-hidden">
          <Background />
          <HeroSection />
          <FeaturesSection />
          <ProcessSection />
          <CTASection />
        </div>
      </div>

      {/* Footer is always present */}
      <Footer />
    </div>
  );
}
