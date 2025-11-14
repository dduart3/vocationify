import { MessageCircle, Brain, Database, School, BarChart3, BookOpen } from "lucide-react";
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
              Características Principales
            </h2>
            <p className="text-lg text-neutral-300 max-w-3xl mx-auto font-light">
              Herramientas diseñadas para ayudarte a descubrir tu vocación ideal
              mediante evaluación RIASEC y recomendaciones personalizadas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={MessageCircle}
              title="Test Conversacional"
              description="Interactúa con un asistente de IA que guía tu evaluación vocacional de forma natural y personalizada."
              delay={0}
            />
            <FeatureCard
              icon={Brain}
              title="Modelo RIASEC"
              description="Evaluación basada en las 6 dimensiones de Holland: Realista, Investigador, Artístico, Social, Emprendedor, Convencional."
              delay={1}
            />
            <FeatureCard
              icon={Database}
              title="Base de Datos Completa"
              description="Acceso a más de 126 carreras profesionales con información detallada y actualizada."
              delay={2}
            />
            <FeatureCard
              icon={School}
              title="Directorio de Instituciones"
              description="Encuentra universidades e institutos que ofrecen las carreras recomendadas para ti."
              delay={3}
            />
            <FeatureCard
              icon={BarChart3}
              title="Resultados Personalizados"
              description="Recibe recomendaciones de carreras basadas en tu perfil RIASEC y tus respuestas."
              delay={4}
            />
            <FeatureCard
              icon={BookOpen}
              title="Historial de Resultados"
              description="Consulta tus evaluaciones anteriores y revisa las carreras que exploraste."
              delay={5}
            />
          </div>
        </div>
      </section>
    )
}