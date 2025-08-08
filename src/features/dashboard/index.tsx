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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RIASEC Progress Chart */}
            <Card className="glass-card lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">Evolución del Perfil RIASEC</CardTitle>
                <CardDescription className="text-slate-400">
                  Cómo ha cambiado tu perfil vocacional a lo largo del tiempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VocationalProgress />
              </CardContent>
            </Card>

            {/* Test History */}
            <Card className="glass-card lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">Historial de Tests</CardTitle>
                <CardDescription className="text-slate-400">
                  Todos tus tests completados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>

          {/* Progress Goals */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Objetivos de Desarrollo</CardTitle>
              <CardDescription className="text-slate-400">
                Áreas recomendadas para fortalecer tu perfil vocacional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="text-white font-medium mb-2">Exploración</h4>
                  <p className="text-slate-400 text-sm">
                    Continúa explorando diferentes carreras y universidades para ampliar tus opciones.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h4 className="text-white font-medium mb-2">Validación</h4>
                  <p className="text-slate-400 text-sm">
                    Realiza tests adicionales para confirmar y refinar tu perfil vocacional.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <h4 className="text-white font-medium mb-2">Acción</h4>
                  <p className="text-slate-400 text-sm">
                    Investiga requisitos de admisión y planifica tu ruta académica.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Detailed RIASEC Analysis */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Análisis Detallado de Personalidad</CardTitle>
              <CardDescription className="text-slate-400">
                Insights profundos sobre tu perfil RIASEC y compatibilidad con carreras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Fortalezas Identificadas</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <div>
                        <p className="text-white font-medium">Pensamiento Analítico</p>
                        <p className="text-slate-400 text-sm">Excelente para resolver problemas complejos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <div>
                        <p className="text-white font-medium">Creatividad</p>
                        <p className="text-slate-400 text-sm">Capacidad para generar ideas innovadoras</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Áreas de Desarrollo</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <div>
                        <p className="text-white font-medium">Habilidades Sociales</p>
                        <p className="text-slate-400 text-sm">Fortalecer comunicación interpersonal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <div>
                        <p className="text-white font-medium">Liderazgo</p>
                        <p className="text-slate-400 text-sm">Desarrollar capacidades de dirección</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Compatibility Matrix */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Matriz de Compatibilidad</CardTitle>
              <CardDescription className="text-slate-400">
                Cómo se alinea tu perfil con diferentes áreas profesionales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { area: 'Ciencias e Ingeniería', compatibility: 92, color: 'bg-blue-500' },
                  { area: 'Tecnología', compatibility: 88, color: 'bg-cyan-500' },
                  { area: 'Artes y Diseño', compatibility: 75, color: 'bg-pink-500' },
                  { area: 'Negocios', compatibility: 68, color: 'bg-orange-500' },
                  { area: 'Ciencias Sociales', compatibility: 65, color: 'bg-green-500' },
                  { area: 'Educación', compatibility: 58, color: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.area} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-medium text-sm">{item.area}</h4>
                      <span className="text-slate-400 text-sm font-mono">{item.compatibility}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-1000`} 
                        style={{ width: `${item.compatibility}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
