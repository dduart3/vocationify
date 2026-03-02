import { FeatureCard } from "../components/feature-card";

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-white px-8 sm:px-12 lg:p-40">
        <div className="max-w-7xl mx-auto relative z-10 pt-16 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-800">
            Características Principales
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto font-light">
            Herramientas diseñadas para ayudarte a descubrir tu vocación ideal
            mediante evaluación RIASEC y recomendaciones personalizadas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          <FeatureCard
            image="/images/prueba2.png"
            title="Test Conversacional"
            description="Interactúa con un asistente de IA que guía tu evaluación vocacional de forma natural y personalizada."
            delay={0}
            imageScale={2}
            imageMarginRight={1.9}
          />
          <FeatureCard
            image="/images/prueba.png"
            imageScale={1.5}
            imagePaddingY={0.1}
            imageMarginTop={-2}
            imageMarginRight={-1.4}
            title="Modelo RIASEC"
            description="Evaluación basada en las 6 dimensiones de Holland: Realista, Investigador, Artístico, Social, Emprendedor, Convencional."
            delay={1}
          />
          <FeatureCard
            image="/images/card-3.png"
            title="Base de Datos Completa"
            description="Acceso a más de 126 carreras profesionales con información detallada y actualizada."
            delay={2}
            imageScale={1.8}
            imagePaddingY={0.1}
            imageMarginTop={-2}
            imageMarginRight={1}
          />
          <FeatureCard
            title="Comparación de Carreras"
            description="Compara múltiples carreras lado a lado según tu perfil RIASEC y elige la que mejor se adapte a ti."
            delay={3}
          />
          <FeatureCard
            title="Resultados Personalizados"
            description="Recibe recomendaciones de carreras basadas en tu perfil RIASEC y tus respuestas."
            delay={4}
          />
          <FeatureCard
            image="/images/card-4.png"
            title="Historial de Resultados"
            description="Consulta tus evaluaciones anteriores y revisa las carreras que exploraste."
            delay={5}
            imageScale={1.9}
            imagePaddingY={2}
            imageMarginTop={0.5}
            imageMarginRight={1}
          />
        </div>
      </div>
    </section>
  )
}
