import { DashboardHeader } from './components/dashboard-header'
import { DashboardStats } from './components/dashboard-stats'
import { RecentActivity } from './components/recent-activity'
import { VocationalProgress } from './components/vocational-progress'
import { QuickActions } from './components/quick-actions'

export function Dashboard() {
  return (
    <div className="flex-1 min-h-screen p-4 sm:p-6 max-w-7xl mx-auto">
      <DashboardHeader />

      {/* Stats Section */}
      <div className="mb-8 sm:mb-12">
        <DashboardStats />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column - Progress & Activity */}
        <div className="xl:col-span-2 space-y-6 sm:space-y-8">
          <VocationalProgress />
          <RecentActivity />
        </div>

        {/* Right Column - Quick Actions */}
        <div className="xl:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
