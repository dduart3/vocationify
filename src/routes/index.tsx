import { createFileRoute, Link } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { FeatureCard } from '@/components/ui/feature-card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <AuthenticatedHome />
  }

  return <LandingPage />
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100 py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-neon-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-tech-600 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Voice Bubble Hero Element */}
            <div className="flex justify-center mb-12">
              {/*<VoiceBubble state="idle" size="large" />*/}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
              <span className="text-neutral-900">Descubre Tu</span>
              <br />
              <span className="bg-gradient-to-r from-accent-600 via-tech-600 to-neon-600 bg-clip-text text-transparent">
                Vocación Perfecta
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Plataforma de orientación vocacional impulsada por IA. Análisis científico, 
              resultados precisos, futuro profesional claro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link 
                to="/auth/register"
                className="group relative overflow-hidden bg-neutral-900 text-white px-10 py-4 rounded-2xl font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10">Comenzar Análisis</span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-tech-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/demo"
                className="group px-10 py-4 rounded-2xl font-medium text-lg border-2 border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  Ver Demo
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-neutral-900 mb-2">15K+</div>
                <div className="text-sm text-neutral-500 uppercase tracking-wide">Estudiantes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-neutral-900 mb-2">98%</div>
                <div className="text-sm text-neutral-500 uppercase tracking-wide">Precisión</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-neutral-900 mb-2">750+</div>
                <div className="text-sm text-neutral-500 uppercase tracking-wide">Carreras</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-neutral-900">
              Tecnología de Vanguardia
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto font-light">
              Combinamos neurociencia, psicología y machine learning para 
              ofrecerte la orientación vocacional más avanzada del mercado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <FeatureCard
              icon="🧠"
              title="Análisis Neuropsicológico"
              description="Evaluación científica de patrones cognitivos, personalidad y aptitudes mediante algoritmos de última generación."
              delay="0s"
            />
            <FeatureCard
              icon="⚡"
              title="IA Predictiva"
              description="Machine learning avanzado que analiza millones de datos para predecir tu compatibilidad profesional."
              delay="0.1s"
            />
            <FeatureCard
              icon="📊"
              title="Big Data Laboral"
              description="Análisis en tiempo real del mercado laboral, salarios y tendencias de crecimiento por sector."
              delay="0.2s"
            />
            <FeatureCard
              icon="🎯"
              title="Roadmap Personalizado"
              description="Plan de acción específico con objetivos medibles y timeline para alcanzar tu meta profesional."
              delay="0.3s"
            />
            <FeatureCard
              icon="🔬"
              title="Validación Científica"
              description="Metodología respaldada por universidades líderes y validada con más de 50,000 casos de éxito."
              delay="0.4s"
            />
            <FeatureCard
              icon="🚀"
              title="Seguimiento Continuo"
              description="Monitoreo de tu progreso profesional con actualizaciones y recomendaciones adaptativas."
              delay="0.5s"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gradient-to-br from-neutral-50 to-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 text-neutral-900">
              Proceso Simplificado
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-light">
              Tres pasos para descubrir tu futuro profesional
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-accent-500 to-tech-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900">Evaluación</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Completa nuestro test psicométrico avanzado en 15 minutos. 
                  Preguntas inteligentes que se adaptan a tus respuestas.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-tech-600 to-neon-500 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900">Análisis</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Nuestra IA procesa tus datos contra nuestra base de conocimiento 
                  de carreras y perfiles profesionales exitosos.
                </p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-neon-500 to-accent-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900">Resultados</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Recibe tu informe detallado con recomendaciones específicas, 
                  plan de estudios y oportunidades laborales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-tech-600/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-5xl font-bold mb-8">
            Tu Futuro Profesional
            <br />
            <span className="bg-gradient-to-r from-accent-400 to-neon-400 bg-clip-text text-transparent">
              Comienza Hoy
            </span>
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-neutral-300 font-light">
            Únete a la nueva generación de profesionales que tomaron control 
            de su destino laboral con decisiones basadas en datos.
          </p>
          <Link 
            to="/auth/register"
            className="inline-block bg-gradient-to-r from-accent-500 to-tech-600 text-white px-12 py-5 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Iniciar Evaluación Gratuita
          </Link>
        </div>
      </section>
    </div>
  )
}

function AuthenticatedHome() {
  const { profile, user } = useAuthStore()
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-12">
          <VoiceBubble state="speaking" size="large" />
        </div>
        <h1 className="text-5xl font-bold mb-6 text-neutral-900">
          Bienvenido de vuelta,
          <br />
          <span className="bg-gradient-to-r from-accent-600 to-tech-600 bg-clip-text text-transparent">
            {profile?.full_name || user?.email?.split('@')[0]}
          </span>
        </h1>
        <p className="text-xl text-neutral-600 mb-12 font-light">
          Continúa tu journey hacia el éxito profesional
        </p>
        <Link 
          to="/dashboard"
          className="inline-block bg-neutral-900 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-neutral-800 transition-all duration-300 hover:scale-105"
        >
          Acceder al Dashboard
        </Link>
      </div>
    </div>
  )
}
