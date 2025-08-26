import { AxiosError } from 'axios'
import { toast } from 'sonner'

interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

export function handleServerError(error: unknown) {
  console.error('Server error:', error)

  if (error instanceof AxiosError) {
    const status = error.response?.status
    const data = error.response?.data as ApiError | undefined

    // Handle specific status codes
    switch (status) {
      case 400:
        toast.error('Solicitud Incorrecta', {
          description: data?.message || 'Por favor revisa tu información e inténtalo de nuevo.',
        })
        break
        
      case 401:
        // Handled in QueryCache onError
        break
        
      case 403:
        // Handled in QueryCache onError
        break
        
      case 404:
        toast.error('No Encontrado', {
          description: data?.message || 'El recurso solicitado no fue encontrado.',
        })
        break
        
      case 422:
        toast.error('Error de Validación', {
          description: data?.message || 'Por favor revisa tu información.',
        })
        break
        
      case 429:
        toast.error('Demasiadas Solicitudes', {
          description: 'Por favor espera un momento antes de intentarlo de nuevo.',
        })
        break
        
      case 500:
        // Handled in QueryCache onError
        break
        
      case 503:
        toast.error('Servicio No Disponible', {
          description: 'El servicio no está disponible temporalmente. Por favor inténtalo más tarde.',
        })
        break
        
      default:
        if (status && status >= 400) {
          toast.error('Solicitud Fallida', {
            description: data?.message || `La solicitud falló con estado ${status}`,
          })
        }
    }
  } else if (error instanceof Error) {
    // Handle network errors, etc.
    if (error.message.includes('Network Error')) {
      toast.error('Error de Conexión', {
        description: 'Por favor revisa tu conexión a internet e inténtalo de nuevo.',
      })
    } else {
      toast.error('Error', {
        description: error.message,
      })
    }
  } else {
    toast.error('Error Desconocido', {
      description: 'Ocurrió un error inesperado.',
    })
  }
}
