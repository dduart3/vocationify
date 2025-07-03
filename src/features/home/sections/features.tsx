import { Brain, Zap, BarChart3, Target, Microscope, Rocket } from "lucide-react";
import { FeatureCard } from "../components/feature-card";

export function FeaturesSection () {
    return( 
      <section className="py-24 relative">
        {/* Background blur effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Tecnología de Vanguardia
            </h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto font-light">
              Combinamos neurociencia, psicología y machine learning para
              ofrecerte la orientación vocacional más avanzada del mercado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={Brain}
              title="Análisis Neuropsicológico"
              description="Evaluación científica de patrones cognitivos, personalidad y aptitudes mediante algoritmos de última generación."
              delay={0}
            />
            <FeatureCard
              icon={Zap}
              title="IA Predictiva"
              description="Machine learning avanzado que analiza millones de datos para predecir tu compatibilidad profesional."
              delay={1}
            />
            <FeatureCard
              icon={BarChart3}
              title="Big Data Laboral"
              description="Análisis en tiempo real del mercado laboral, salarios y tendencias de crecimiento por sector."
              delay={2}
            />
            <FeatureCard
              icon={Target}
              title="Roadmap Personalizado"
              description="Plan de acción específico con objetivos medibles y timeline para alcanzar tu meta profesional."
              delay={3}
            />
            <FeatureCard
              icon={Microscope}
              title="Validación Científica"
              description="Metodología respaldada por universidades líderes y validada con más de 50,000 casos de éxito."
              delay={4}
            />
            <FeatureCard
              icon={Rocket}
              title="Seguimiento Continuo"
              description="Monitoreo de tu progreso profesional con actualizaciones y recomendaciones adaptativas."
              delay={5}
            />
          </div>
        </div>
      </section>
    )
}