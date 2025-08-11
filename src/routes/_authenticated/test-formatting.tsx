import { createFileRoute } from '@tanstack/react-router'
import { 
  Monitor, Cpu, Network, GraduationCap, Star, TrendingUp,
  Stethoscope, Scale, Briefcase, Heart, Palette, Calculator,
  Building2, Users, Wrench, BookOpen, Camera, Music
} from 'lucide-react'

export const Route = createFileRoute('/_authenticated/test-formatting')({
  component: TestFormattingPage,
})

// Helper function to get career icon
const getCareerIcon = (careerName: string) => {
  const name = careerName.toLowerCase()
  
  // Technology & Engineering
  if (name.includes('informática') || name.includes('programación') || name.includes('software')) {
    return Monitor
  }
  if (name.includes('computación') || name.includes('hardware') || name.includes('electrónica')) {
    return Cpu
  }
  if (name.includes('sistemas') || name.includes('redes') || name.includes('telecomunicaciones')) {
    return Network
  }
  if (name.includes('ingeniería') && (name.includes('mecánica') || name.includes('industrial'))) {
    return Wrench
  }
  
  // Health & Medicine
  if (name.includes('medicina') || name.includes('médico') || name.includes('salud')) {
    return Stethoscope
  }
  if (name.includes('psicología') || name.includes('terapia') || name.includes('social')) {
    return Heart
  }
  
  // Business & Law
  if (name.includes('derecho') || name.includes('abogado') || name.includes('legal')) {
    return Scale
  }
  if (name.includes('administración') || name.includes('negocios') || name.includes('gestión')) {
    return Briefcase
  }
  if (name.includes('contabilidad') || name.includes('finanzas') || name.includes('economía')) {
    return Calculator
  }
  
  // Arts & Creative
  if (name.includes('arte') || name.includes('diseño') || name.includes('creatividad')) {
    return Palette
  }
  if (name.includes('música') || name.includes('musical')) {
    return Music
  }
  if (name.includes('comunicación') || name.includes('periodismo') || name.includes('fotografía')) {
    return Camera
  }
  
  // Education & Social
  if (name.includes('educación') || name.includes('pedagogía') || name.includes('docencia')) {
    return BookOpen
  }
  if (name.includes('recursos humanos') || name.includes('sociología')) {
    return Users
  }
  
  // Architecture & Construction
  if (name.includes('arquitectura') || name.includes('construcción') || name.includes('civil')) {
    return Building2
  }
  
  return GraduationCap // Default icon
}

function TestFormattingPage() {
  // Your example data
  const mockAIResponse = {
    message: "¡Comprendido! Con base en tus respuestas, estas son algunas recomendaciones iniciales que creo que podrían encajarte muy bien:\n\n1. **Ingeniería en Informática:** Muestra un alto 'I' (Investigativo) y 'R' (Realista), lo que se alinea perfectamente con tu pasión por la resolución de problemas de código y la innovación en el desarrollo de software. Además, el componente 'C' (Convencional) sugiere que también aprecias la estructura y organización, lo cual es útil en el desarrollo de software.\n\n2. **Ingeniería en Computación:** Similar a la anterior, esta carrera combina habilidades de resolución de problemas ('I' y 'R') con un enfoque en la automatización y la aplicación de sistemas de computación, algo que mencionaste que te atrae.\n\n3. **Ingeniería de Sistemas:** Dado tu interés en la innovación y la resolución de problemas, esta carrera te permitiría diseñar, desarrollar e implementar sistemas complejos, integrando hardware, software y procesos. El aspecto 'C' (Convencional) de esta carrera te ayudaría con la gestión y organización de los sistemas complejos.",
    intent: "recommendation",
    suggestedFollowUp: [
      "¿Te gustaría conocer más detalles sobre estas carreras?",
      "¿Prefieres que te dé otras alternativas?",
      "¿Quieres ver los resultados finales?"
    ],
    riasecAssessment: {
      scores: {
        R: 70,
        I: 90,
        A: 40,
        S: 30,
        E: 50,
        C: 60
      },
      confidence: 80,
      reasoning: "El usuario muestra un alto interés en actividades Investigativas (I) como la resolución de problemas de código y la innovación. También valora aspectos Realistas (R) como la creación de soluciones tangibles y el liderazgo técnico. El interés en el trabajo en equipo y la comunicación sugieren un componente Social (S), mientras que la preferencia por un ambiente estructurado indica un componente Convencional (C)."
    },
    careerSuggestions: [
      {
        careerId: "1ddd3e36-9bc8-49dc-9672-24d5fee645a5",
        name: "INGENIERÍA EN INFORMÁTICA",
        confidence: 90,
        reasoning: "Esta carrera se alinea con tu interés en la resolución de problemas de código ('I' y 'R') y la innovación en el desarrollo de software. Además, el componente 'C' (Convencional) es útil en el desarrollo de software."
      },
      {
        careerId: "bc6693e1-70b0-4c85-82f0-c40d2a9f7855",
        name: "INGENIERÍA EN COMPUTACIÓN",
        confidence: 85,
        reasoning: "Similar a la anterior, esta carrera combina habilidades de resolución de problemas ('I' y 'R') con un enfoque en la automatización y la aplicación de sistemas de computación."
      },
      {
        careerId: "34c1cabc-9354-4e8f-b96c-1fe4cd7ccdb5",
        name: "INGENIERIA DE SISTEMAS",
        confidence: 80,
        reasoning: "Dado tu interés en la innovación y la resolución de problemas, esta carrera te permitiría diseñar, desarrollar e implementar sistemas complejos. El aspecto 'C' (Convencional) de esta carrera te ayudaría con la gestión y organización de los sistemas complejos."
      }
    ]
  }

  // Helper function to format AI message with career recommendations
  const formatAIMessage = (message: string, careerSuggestions?: any[]) => {
    // Remove markdown formatting
    let formatted = message.replace(/\*\*(.*?)\*\*/g, '$1')
    
    // If there are career suggestions, extract the intro text and format careers separately
    if (careerSuggestions && careerSuggestions.length > 0) {
      // Find the intro text before career listings
      const introMatch = formatted.match(/^(.*?)(?=\d+\.\s*\*?\*?[A-ZÁÉÍÓÚ])/s)
      const introText = introMatch ? introMatch[1].trim() : ''
      
      return {
        introText,
        hasCareerList: true,
        careers: careerSuggestions
      }
    }
    
    // For regular messages, just clean up and split into paragraphs
    const paragraphs = formatted
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
    
    return {
      paragraphs,
      hasCareerList: false
    }
  }

  const formattedContent = formatAIMessage(mockAIResponse.message, mockAIResponse.careerSuggestions)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">
            Vista Previa del Formato de Respuesta AI
          </h1>
          <p className="text-xl text-slate-600">
            Así es como se verá la respuesta formateada en la conversación
          </p>
        </div>

        {/* Formatted AI Response Preview */}
        <div 
          className="p-8 rounded-3xl max-w-4xl mx-auto"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.12) 0%, 
                rgba(255, 255, 255, 0.06) 100%
              )
            `,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-blue-400 text-sm font-semibold">
              ARIA
            </span>
            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            <span className="text-slate-400 text-sm uppercase tracking-wider">
              {mockAIResponse.intent}
            </span>
          </div>
          
          {formattedContent.hasCareerList ? (
            <div className="space-y-6">
              {/* Intro Text */}
              {formattedContent.introText && (
                <p className="text-white text-lg font-medium leading-relaxed text-center">
                  {formattedContent.introText}
                </p>
              )}
              
              {/* Career Recommendations */}
              <div className="space-y-4">
                {formattedContent.careers.map((career: any, index: number) => {
                  const IconComponent = getCareerIcon(career.name)
                  return (
                    <div 
                      key={career.careerId}
                      className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/8 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        {/* Ranking Badge */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-slate-400 text-white' :
                          'bg-orange-600 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        
                        {/* Career Icon */}
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-blue-400" />
                        </div>
                        
                        {/* Career Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <h4 className="text-white font-bold text-lg leading-tight">
                              {career.name}
                            </h4>
                            <div className="flex items-center gap-1 bg-green-500/20 px-3 py-1 rounded-full flex-shrink-0">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 font-semibold text-sm">
                                {career.confidence}%
                              </span>
                            </div>
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed">
                            {career.reasoning}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* RIASEC Assessment Display */}
              {mockAIResponse.riasecAssessment && (
                <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Tu Perfil RIASEC</h4>
                      <p className="text-white/60 text-sm">{mockAIResponse.riasecAssessment.confidence}% de confianza</p>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {mockAIResponse.riasecAssessment.reasoning}
                  </p>
                  
                  {/* RIASEC Scores Display */}
                  <div className="grid grid-cols-6 gap-2 mt-4">
                    {Object.entries(mockAIResponse.riasecAssessment.scores).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="bg-white/10 rounded-lg p-2">
                          <div className="text-white font-bold text-lg">{value}</div>
                          <div className="text-white/60 text-xs font-medium">{key}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Original Text Comparison */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Texto Original (Sin Formato)</h3>
          <div className="bg-slate-100 rounded-xl p-4 font-mono text-sm text-slate-700 whitespace-pre-wrap">
            {mockAIResponse.message}
          </div>
        </div>
      </div>
    </div>
  )
}