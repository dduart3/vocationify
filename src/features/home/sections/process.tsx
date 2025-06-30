import { ClipboardList, Cpu, FileText } from "lucide-react";
import { ProcessStep } from "../process-step";

export function ProcessSection () {
    return (
        <section className="py-24 relative">
        {/* Background effects */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Proceso Simplificado
            </h2>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto font-light">
              Tres pasos para descubrir tu futuro profesional
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
              <ProcessStep
                number={1}
                title="Evaluación"
                description="Completa nuestro test psicométrico avanzado en 15 minutos. Preguntas inteligentes que se adaptan a tus respuestas."
                icon={ClipboardList}
                delay={0}
              />

              <ProcessStep
                number={2}
                title="Análisis"
                description="Nuestra IA procesa tus datos contra nuestra base de conocimiento de carreras y perfiles profesionales exitosos."
                icon={Cpu}
                delay={1}
              />

              <ProcessStep
                number={3}
                title="Resultados"
                description="Recibe tu informe detallado con recomendaciones específicas, plan de estudios y oportunidades laborales."
                icon={FileText}
                delay={2}
              />
            </div>
          </div>
        </div>
      </section>
    )
}
