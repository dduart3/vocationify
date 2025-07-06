import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardHeader } from './components/dashboard-header'
import { DashboardStats } from './components/dashboard-stats'
import { RecentActivity } from './components/recent-activity'
import { VocationalProgress } from './components/vocational-progress'
import { QuickActions } from './components/quick-actions'

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader />
      
      <Tabs
        defaultValue="overview"
        className="space-y-6"
        onValueChange={setActiveTab}
      >
        <TabsList 
          className="grid w-full grid-cols-3 lg:w-[400px]"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          }}
        >
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-slate-300"
          >
            Vista General
          </TabsTrigger>
          <TabsTrigger 
            value="progress"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-slate-300"
          >
            Progreso
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-slate-300"
          >
            Análisis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DashboardStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VocationalProgress />
            </div>
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
          </div>
          
          <RecentActivity />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Tu Progreso Vocacional</CardTitle>
              <CardDescription className="text-slate-400">
                Seguimiento detallado de tu desarrollo profesional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Contenido de progreso próximamente...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Análisis Detallado</CardTitle>
              <CardDescription className="text-slate-400">
                Insights sobre tus preferencias y aptitudes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Análisis próximamente...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
