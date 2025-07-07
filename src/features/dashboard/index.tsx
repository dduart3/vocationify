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
          className="grid w-full grid-cols-3 lg:w-[400px] h-12 p-1"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.08) 0%, 
                rgba(255, 255, 255, 0.04) 100%
              )
            `,
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
          }}
        >
          <TabsTrigger
            value="overview"
            className="h-full rounded-lg text-sm font-medium transition-all duration-200 border-0"
            style={{
              background: activeTab === 'overview' 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.12) 100%)'
                : 'transparent',
              color: activeTab === 'overview' ? '#ffffff' : '#cbd5e1',
              boxShadow: activeTab === 'overview' 
                ? 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                : 'none',
              transform: activeTab === 'overview' ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            Vista General
          </TabsTrigger>
          
          <TabsTrigger
            value="progress"
            className="h-full rounded-lg text-sm font-medium transition-all duration-200 border-0"
            style={{
              background: activeTab === 'progress' 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.12) 100%)'
                : 'transparent',
              color: activeTab === 'progress' ? '#ffffff' : '#cbd5e1',
              boxShadow: activeTab === 'progress' 
                ? 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                : 'none',
              transform: activeTab === 'progress' ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            Progreso
          </TabsTrigger>
          
          <TabsTrigger
            value="analytics"
            className="h-full rounded-lg text-sm font-medium transition-all duration-200 border-0"
            style={{
              background: activeTab === 'analytics' 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.12) 100%)'
                : 'transparent',
              color: activeTab === 'analytics' ? '#ffffff' : '#cbd5e1',
              boxShadow: activeTab === 'analytics' 
                ? 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                : 'none',
              transform: activeTab === 'analytics' ? 'scale(0.98)' : 'scale(1)',
            }}
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
