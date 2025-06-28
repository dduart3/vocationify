import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { toast } from 'sonner'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id?: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastState {
  toasts: ToastData[]
  
  addToast: (toast: Omit<ToastData, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
  
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

export const useToastStore = create<ToastState>()(
  devtools(
    (set, get) => ({
      toasts: [],

      addToast: (toastData) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast = { ...toastData, id }
        
        set((state) => ({
          toasts: [...state.toasts, newToast]
        }))

        const toastFn = toast[toastData.type] || toast
        
        toastFn(toastData.title, {
          description: toastData.description,
          duration: toastData.duration || 4000,
          action: toastData.action ? {
            label: toastData.action.label,
            onClick: toastData.action.onClick,
          } : undefined,
          onDismiss: () => get().removeToast(id),
          onAutoClose: () => get().removeToast(id),
        })
      },

      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id)
        }))
      },

      clearToasts: () => {
        set({ toasts: [] })
        toast.dismiss()
      },

      success: (title, description) => {
        get().addToast({ type: 'success', title, description })
      },

      error: (title, description) => {
        get().addToast({ type: 'error', title, description })
      },

      warning: (title, description) => {
        get().addToast({ type: 'warning', title, description })
      },

      info: (title, description) => {
        get().addToast({ type: 'info', title, description })
      },
    }),
    { name: 'ToastStore' }
  )
)

// Helper functions for easy access
export const showToast = {
  success: (title: string, description?: string) => useToastStore.getState().success(title, description),
  error: (title: string, description?: string) => useToastStore.getState().error(title, description),
  warning: (title: string, description?: string) => useToastStore.getState().warning(title, description),
  info: (title: string, description?: string) => useToastStore.getState().info(title, description),
}
