import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from '@tanstack/react-router'
import { IconLogout, IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'

interface LogoutButtonProps {
  variant?: 'default' | 'sidebar' | 'dropdown'
  className?: string
}

export function LogoutButton({ variant = 'default', className = '' }: LogoutButtonProps) {
  const { signOut } = useAuthStore()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      navigate({ to: '/' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const baseStyles = "flex items-center gap-2 transition-all duration-200"
  
  const variantStyles = {
    default: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg",
    sidebar: "w-full px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg",
    dropdown: "w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-100 rounded-md"
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`${baseStyles} ${variantStyles[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoggingOut ? (
        <IconLoader2 size={16} className="animate-spin" />
      ) : (
        <IconLogout size={16} />
      )}
      <span>Cerrar sesión</span>
    </button>
  )
}
