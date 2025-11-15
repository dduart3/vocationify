import type { OnboardingStep } from '../types'

export const dashboardOnboardingSteps: OnboardingStep[] = [
  {
    element: '#welcome-section',
    popover: {
      title: 'Bienvenido a Vocationify',
      description: 'Esta es tu aplicación de orientación vocacional. Te ayudaremos a descubrir las carreras que mejor se ajustan a tus intereses y habilidades.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#dashboard-stats',
    popover: {
      title: 'Tu Progreso',
      description: 'Aquí podrás ver un resumen de tus pruebas completadas, carreras recomendadas y escuelas disponibles.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#start-test-button',
    popover: {
      title: 'Comienza tu Prueba Vocacional',
      description: 'Haz clic aquí para iniciar tu primera prueba RIASEC. El test evaluará tus intereses en 6 áreas: Realista, Investigador, Artístico, Social, Emprendedor y Convencional.',
      side: 'left',
      align: 'start'
    }
  },
  {
    element: '[href="/results"]',
    popover: {
      title: 'Resultados',
      description: 'Después de completar una prueba, tus resultados aparecerán aquí. Podrás ver análisis detallados y recomendaciones personalizadas.',
      side: 'right',
      align: 'start'
    }
  },
  {
    element: '[href="/careers"]',
    popover: {
      title: 'Explorar Carreras',
      description: 'Navega por nuestro catálogo completo de carreras universitarias. Puedes filtrar por área y ver descripciones detalladas.',
      side: 'right',
      align: 'start'
    }
  },
  {
    element: '[href="/schools"]',
    popover: {
      title: 'Instituciones Educativas',
      description: 'Descubre universidades e institutos en Venezuela que ofrecen las carreras que te interesan.',
      side: 'right',
      align: 'start'
    }
  },
  {
    element: '[href="/profile"]',
    popover: {
      title: 'Tu Perfil',
      description: 'Actualiza tu información personal, incluyendo ubicación, teléfono y dirección para recibir recomendaciones más precisas.',
      side: 'right',
      align: 'start'
    }
  }
]

// Additional onboarding for test page
export const testOnboardingSteps: OnboardingStep[] = [
  {
    element: '#question-display',
    popover: {
      title: 'Preguntas de la Prueba',
      description: 'Lee cada pregunta cuidadosamente. Las preguntas evalúan tus preferencias en diferentes actividades y contextos laborales.',
      side: 'top',
      align: 'center'
    }
  },
  {
    element: '#voice-controls',
    popover: {
      title: 'Controles de Voz',
      description: 'Puedes escuchar cada pregunta y responder usando tu voz. Ideal para una experiencia más interactiva.',
      side: 'top',
      align: 'center'
    }
  },
  {
    element: '#response-options',
    popover: {
      title: 'Opciones de Respuesta',
      description: 'Selecciona tu nivel de acuerdo con cada afirmación. Tus respuestas honestas nos ayudarán a darte mejores recomendaciones.',
      side: 'top',
      align: 'center'
    }
  }
]

// Onboarding for results page
export const resultsOnboardingSteps: OnboardingStep[] = [
  {
    element: '#riasec-chart',
    popover: {
      title: 'Tu Perfil RIASEC',
      description: 'Este gráfico muestra tus puntuaciones en las 6 dimensiones del modelo Holland. Las áreas más altas indican tus intereses más fuertes.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#career-recommendations',
    popover: {
      title: 'Carreras Recomendadas',
      description: 'Basándonos en tu perfil, estas son las carreras que mejor se ajustan a tus intereses. Haz clic en cada una para ver más detalles.',
      side: 'top',
      align: 'start'
    }
  },
  {
    element: '#export-pdf-button',
    popover: {
      title: 'Exportar Resultados',
      description: 'Descarga tus resultados en PDF para compartirlos con orientadores, padres o guardarlos para referencia futura.',
      side: 'left',
      align: 'center'
    }
  }
]
