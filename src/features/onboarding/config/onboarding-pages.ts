import type { OnboardingPageConfig, OnboardingStep } from '../types'

// Dashboard onboarding
const dashboardSteps: OnboardingStep[] = [
  {
    element: '#welcome-section',
    popover: {
      title: '¡Bienvenido a Vocationify!',
      description: 'Vamos a hacer un recorrido completo por la plataforma. Te guiaré paso a paso por cada sección para que aproveches al máximo todas las herramientas.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#dashboard-stats',
    popover: {
      title: 'Estadísticas de Tu Progreso',
      description: 'Aquí verás un resumen de tus pruebas completadas, tu nivel de confianza promedio y tu última actividad en la plataforma.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#start-test-button',
    popover: {
      title: 'Test Vocacional RIASEC',
      description: 'Este es el corazón de la plataforma. La prueba evalúa 6 dimensiones: Realista, Investigador, Artístico, Social, Emprendedor y Convencional. Visitaremos la página del test más adelante.',
      side: 'left',
      align: 'start'
    }
  }
]

// Careers page onboarding
const careersSteps: OnboardingStep[] = [
  {
    element: '#careers-header',
    popover: {
      title: 'Catálogo de Carreras',
      description: 'Explora más de 100 carreras universitarias disponibles en Venezuela. Cada carrera incluye descripción detallada, competencias requeridas y áreas RIASEC relacionadas.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#career-filters',
    popover: {
      title: 'Filtros de Búsqueda',
      description: 'Filtra carreras por área RIASEC (Realista, Investigador, etc.), nombre o palabras clave. Esto te ayuda a encontrar carreras afines a tus intereses.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#career-list',
    popover: {
      title: 'Lista de Carreras',
      description: 'Cada tarjeta muestra el nombre de la carrera, una breve descripción y las áreas RIASEC asociadas. Haz clic en cualquier carrera para ver detalles completos.',
      side: 'top',
      align: 'center'
    }
  }
]

// Career detail onboarding
const careerDetailSteps: OnboardingStep[] = [
  {
    element: '#career-detail-header',
    popover: {
      title: 'Detalles de la Carrera',
      description: 'Aquí encontrarás toda la información sobre esta carrera: descripción completa, competencias necesarias, perfil profesional y áreas RIASEC relacionadas.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#career-riasec-match',
    popover: {
      title: 'Compatibilidad RIASEC',
      description: 'Este indicador muestra qué tan bien se alinea la carrera con las diferentes dimensiones RIASEC. Si ya completaste un test, verás tu nivel de compatibilidad personal.',
      side: 'left',
      align: 'center'
    }
  },
  {
    element: '#career-schools-list',
    popover: {
      title: 'Instituciones que Ofrecen esta Carrera',
      description: 'Aquí verás todas las universidades e institutos en Venezuela donde puedes estudiar esta carrera, con ubicación y detalles de contacto.',
      side: 'top',
      align: 'start'
    }
  }
]

// Schools page onboarding
const schoolsSteps: OnboardingStep[] = [
  {
    element: '#schools-header',
    popover: {
      title: 'Instituciones Educativas',
      description: 'Explora universidades, institutos y centros de formación en toda Venezuela. Encuentra la institución perfecta para tu carrera elegida.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#schools-filters',
    popover: {
      title: 'Filtros de Instituciones',
      description: 'Filtra por ubicación, tipo de institución (pública/privada), o busca por nombre. También puedes filtrar por carreras ofrecidas.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#schools-list',
    popover: {
      title: 'Lista de Instituciones',
      description: 'Cada tarjeta muestra información clave: nombre, ubicación, número de carreras disponibles y tipo. Haz clic para ver detalles completos.',
      side: 'top',
      align: 'center'
    }
  }
]

// School detail onboarding
const schoolDetailSteps: OnboardingStep[] = [
  {
    element: '#school-detail-header',
    popover: {
      title: 'Información de la Institución',
      description: 'Detalles completos sobre la institución: dirección, contacto, tipo (pública/privada) y todas las carreras que ofrece.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#school-location-map',
    popover: {
      title: 'Ubicación en el Mapa',
      description: 'Visualiza la ubicación exacta de la institución. Esto te ayuda a calcular distancias y planificar tu traslado.',
      side: 'top',
      align: 'center'
    }
  },
  {
    element: '#school-careers-offered',
    popover: {
      title: 'Carreras Disponibles',
      description: 'Lista completa de carreras que puedes estudiar en esta institución. Haz clic en cualquier carrera para ver más detalles.',
      side: 'top',
      align: 'start'
    }
  }
]

// Results page onboarding
const resultsSteps: OnboardingStep[] = [
  {
    element: '#results-header',
    popover: {
      title: 'Tus Resultados',
      description: 'Aquí encontrarás todos los tests vocacionales que has completado. Cada test genera un análisis personalizado con recomendaciones de carreras.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#results-table',
    popover: {
      title: 'Historial de Tests',
      description: 'Cada fila representa un test completado. Puedes ver la fecha, tu nivel de confianza en las respuestas y el estado. Haz clic en "Ver Detalles" para análisis completo.',
      side: 'top',
      align: 'center'
    }
  }
]

// Result detail onboarding
const resultDetailSteps: OnboardingStep[] = [
  {
    element: '#riasec-chart',
    popover: {
      title: 'Tu Perfil RIASEC',
      description: 'Este gráfico hexagonal muestra tus puntuaciones en las 6 dimensiones. Cada punto representa tu afinidad con ese tipo de actividad o ambiente laboral.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#riasec-scores-breakdown',
    popover: {
      title: 'Desglose de Puntuaciones',
      description: 'Aquí ves tus puntos exactos en cada dimensión RIASEC. Las barras te ayudan a comparar visualmente tus áreas más fuertes.',
      side: 'left',
      align: 'center'
    }
  },
  {
    element: '#career-recommendations',
    popover: {
      title: 'Carreras Recomendadas',
      description: 'Basándonos en tu perfil RIASEC, estas son las carreras con mayor compatibilidad. El porcentaje indica qué tan bien se alinean con tus intereses.',
      side: 'top',
      align: 'start'
    }
  },
  {
    element: '#export-pdf-button',
    popover: {
      title: 'Exportar a PDF',
      description: 'Descarga un reporte completo en PDF con tu perfil RIASEC, carreras recomendadas y análisis detallado. Perfecto para compartir con orientadores o padres.',
      side: 'left',
      align: 'center'
    }
  }
]

// Vocational test landing page onboarding (before starting test)
const vocationalTestLandingSteps: OnboardingStep[] = [
  {
    element: '#test-landing-header',
    popover: {
      title: 'Bienvenido al Test Vocacional',
      description: 'Este es un test conversacional con IA que te ayudará a descubrir las carreras que mejor se ajustan a tu perfil. Utiliza el modelo RIASEC para análisis preciso.',
      side: 'bottom',
      align: 'center'
    }
  },
  {
    element: '#test-features',
    popover: {
      title: 'Características del Test',
      description: 'El test es 100% conversacional, con análisis personalizado y resultados precisos. Puedes usar voz o texto para responder.',
      side: 'top',
      align: 'center'
    }
  },
  {
    element: '#start-test-button',
    popover: {
      title: 'Iniciar Test',
      description: 'Haz clic aquí cuando estés listo para comenzar. El test toma aproximadamente 10-15 minutos. Asegúrate de estar en un lugar tranquilo.',
      side: 'top',
      align: 'center'
    }
  }
]

// Vocational test active interface onboarding (during test)
const vocationalTestActiveSteps: OnboardingStep[] = [
  {
    element: '#test-header',
    popover: {
      title: 'Interfaz del Test',
      description: 'Esta es la interfaz principal del test. Arriba verás tu progreso y el asistente de IA ARIA que te guiará durante el proceso.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#conversation-display',
    popover: {
      title: 'Conversación',
      description: 'Aquí verás el historial de tu conversación con ARIA. Ella te hará preguntas sobre tus intereses, habilidades y preferencias.',
      side: 'left',
      align: 'center'
    }
  },
  {
    element: '#message-input',
    popover: {
      title: 'Área de Respuesta',
      description: 'Escribe tus respuestas aquí o usa el botón de micrófono para responder por voz. Sé honesto y detallado en tus respuestas.',
      side: 'top',
      align: 'center'
    }
  },
  {
    element: '#ui-mode-toggle',
    popover: {
      title: 'Modo de Interfaz',
      description: 'Cambia entre modo de voz y texto según tu preferencia. El modo de voz permite una experiencia más natural y conversacional.',
      side: 'left',
      align: 'start'
    }
  }
]

// Keep backward compatibility - default to landing steps
const vocationalTestSteps = vocationalTestLandingSteps

// Profile page onboarding
const profileSteps: OnboardingStep[] = [
  {
    element: '#profile-header',
    popover: {
      title: 'Tu Perfil Personal',
      description: 'Mantén tu información actualizada para recibir recomendaciones más precisas. Puedes editar tu nombre, contacto, dirección y ubicación.',
      side: 'bottom',
      align: 'start'
    }
  },
  {
    element: '#profile-form',
    popover: {
      title: 'Información Personal',
      description: 'Haz clic en "Editar Perfil" para actualizar tus datos. La ubicación ayuda a recomendarte instituciones cercanas.',
      side: 'left',
      align: 'start'
    }
  },
  {
    element: '#activity-summary',
    popover: {
      title: 'Resumen de Actividad',
      description: 'Aquí verás estadísticas sobre tus tests completados, carreras exploradas y tu actividad reciente en la plataforma.',
      side: 'left',
      align: 'center'
    }
  }
]

// Complete onboarding flow configuration
export const onboardingFlow: OnboardingPageConfig[] = [
  {
    page: 'dashboard',
    route: '/dashboard',
    title: 'Panel Principal',
    steps: dashboardSteps,
    order: 1
  },
  {
    page: 'vocational-test',
    route: '/vocational-test',
    title: 'Test Vocacional',
    steps: vocationalTestSteps,
    order: 2
  },
  {
    page: 'results',
    route: '/results',
    title: 'Mis Resultados',
    steps: resultsSteps,
    order: 3
  },
  {
    page: 'careers',
    route: '/careers',
    title: 'Carreras',
    steps: careersSteps,
    order: 4
  },
  {
    page: 'schools',
    route: '/schools',
    title: 'Instituciones',
    steps: schoolsSteps,
    order: 5
  },
  {
    page: 'profile',
    route: '/profile',
    title: 'Mi Perfil',
    steps: profileSteps,
    order: 6
  }
]

// Export individual step arrays for conditional onboarding
export {
  dashboardSteps,
  careersSteps,
  careerDetailSteps,
  schoolsSteps,
  schoolDetailSteps,
  resultsSteps,
  resultDetailSteps,
  vocationalTestSteps,
  vocationalTestLandingSteps,
  vocationalTestActiveSteps,
  profileSteps
}
