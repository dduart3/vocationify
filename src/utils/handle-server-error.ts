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
        toast.error('Bad Request', {
          description: data?.message || 'Please check your input and try again.',
        })
        break
        
      case 401:
        // Handled in QueryCache onError
        break
        
      case 403:
        // Handled in QueryCache onError
        break
        
      case 404:
        toast.error('Not Found', {
          description: data?.message || 'The requested resource was not found.',
        })
        break
        
      case 422:
        toast.error('Validation Error', {
          description: data?.message || 'Please check your input.',
        })
        break
        
      case 429:
        toast.error('Too Many Requests', {
          description: 'Please wait a moment before trying again.',
        })
        break
        
      case 500:
        // Handled in QueryCache onError
        break
        
      case 503:
        toast.error('Service Unavailable', {
          description: 'The service is temporarily unavailable. Please try again later.',
        })
        break
        
      default:
        if (status && status >= 400) {
          toast.error('Request Failed', {
            description: data?.message || `Request failed with status ${status}`,
          })
        }
    }
  } else if (error instanceof Error) {
    // Handle network errors, etc.
    if (error.message.includes('Network Error')) {
      toast.error('Network Error', {
        description: 'Please check your internet connection and try again.',
      })
    } else {
      toast.error('Error', {
        description: error.message,
      })
    }
  } else {
    toast.error('Unknown Error', {
      description: 'An unexpected error occurred.',
    })
  }
}
