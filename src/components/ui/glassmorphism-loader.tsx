import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'

interface GlassmorphismLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
  fullScreen?: boolean
}

export function GlassmorphismLoader({ 
  size = 'md', 
  className,
  text = 'Cargando...',
  fullScreen = false 
}: GlassmorphismLoaderProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg', 
    xl: 'text-xl'
  }

  const logoSizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Logo with Animated Ring */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div 
          className={cn(
            'absolute inset-0 rounded-full animate-spin',
            sizeClasses[size]
          )}
          style={{
            background: `
              conic-gradient(
                from 0deg,
                transparent 0deg,
                rgba(59, 130, 246, 0.6) 90deg,
                rgba(147, 51, 234, 0.6) 180deg,
                rgba(79, 70, 229, 0.6) 270deg,
                transparent 360deg
              )
            `,
            padding: '4px',
            borderRadius: '50%'
          }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'transparent'
            }}
          />
        </div>
        
        {/* Logo in center */}
        <div 
          className={cn(
            'relative rounded-full flex items-center justify-center',
            sizeClasses[size]
          )}
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(20px)',
            boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `
          }}
        >
          <Logo 
            size={logoSizes[size]} 
            className="animate-pulse"
          />
        </div>
        
        {/* Inner glow effect */}
        <div 
          className={cn(
            'absolute inset-2 rounded-full opacity-40 animate-pulse',
          )}
          style={{
            background: `
              radial-gradient(circle, 
                rgba(59, 130, 246, 0.2) 0%, 
                rgba(147, 51, 234, 0.2) 50%,
                transparent 70%
              )
            `,
            animationDelay: '0.5s'
          }}
        />
      </div>

      {/* Loading text */}
      {text && (
        <p 
          className={cn(
            'font-medium text-white/90',
            textSizeClasses[size]
          )}
          style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
          }}
        >
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div 
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
          className
        )}
      >
        {/* Background effects matching your main layout */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/8 to-pink-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      {content}
    </div>
  )
}

// Skeleton component for content loading
export function GlassmorphismSkeleton({ 
  className,
  count = 1,
  height = 'h-4'
}: {
  className?: string
  count?: number  
  height?: string
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array(count).fill(0).map((_, i) => (
        <div 
          key={i}
          className={cn(
            'animate-pulse rounded-lg',
            height
          )}
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.1) 0%, 
                rgba(255, 255, 255, 0.05) 100%
              )
            `,
            backdropFilter: 'blur(10px)'
          }}
        />
      ))}
    </div>
  )
}