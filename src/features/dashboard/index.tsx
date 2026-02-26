import { DashboardHeader } from './components/dashboard-header'
import { DashboardStats } from './components/dashboard-stats'
import { RecentActivity } from './components/recent-activity'
import { VocationalProgress } from './components/vocational-progress'
import { QuickActions } from './components/quick-actions'
import { OnboardingProvider } from '@/features/onboarding'
import { dashboardSteps } from '@/features/onboarding/config/onboarding-pages'

export function Dashboard() {
  return (
    <OnboardingProvider section="dashboard" steps={dashboardSteps}>
      <div className="flex-1 min-h-screen w-full relative flex flex-col">
        {/* Fixed Ambient Background Gradient Behind Everything */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[#f8fafc]">
          <div 
            className="absolute inset-x-0 bottom-0 h-full opacity-70" 
            style={{
              background: 'linear-gradient(120deg, #fed7aa 0%, #fbcfe8 45%, #bae6fd 100%)',
              maskImage: 'linear-gradient(to top, black 10%, transparent 80%)',
              WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 80%)'
            }}
          />
          {/* Premium Fine Grain Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '120px 120px',
            }}
          />
          {/* White Ellipse from top down for contrast matching */}
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[95vh] bg-[#f8fafc] rounded-[50%] blur-[70px]" />
        </div>

        {/* Dashboard Content Container */}
        <div className="relative z-10 min-h-screen p-4 md:pl-[104px] md:pr-4 md:py-4 max-w-[1500px] w-full mx-auto flex flex-col pt-8 sm:pt-4">
          <div className="flex-1 bg-white/30 backdrop-blur-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_32px_rgba(0,0,0,0.04)] rounded-[2.5rem] p-4 sm:p-6 flex flex-col">
            <DashboardHeader />

          {/* Stats Section */}
          <div className="mb-4">
            <DashboardStats />
          </div>

          {/* Main Content Group */}
          <div className="flex flex-col gap-4 flex-1">
            <QuickActions />
            
            {/* Two Column Layout for Profile and Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1">
              <div className="xl:col-span-2 flex flex-col h-full">
                <VocationalProgress />
              </div>
              <div className="xl:col-span-1 flex flex-col h-full">
                <RecentActivity />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </OnboardingProvider>
  )
}
