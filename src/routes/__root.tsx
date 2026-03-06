import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import GeneralError from '@/components/errors/general-error'
import NotFoundError from '@/components/errors/not-found-error'
import { AuthProvider } from '@/context/auth-context'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})

function RootComponent() {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    // Sync ReactLenis with GSAP's requestAnimationFrame ticking
    // to ensure pinned sections and scrolltriggers don't jitter
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <AuthProvider>
      <ReactLenis 
        root 
        ref={lenisRef} 
        autoRaf={false} 
        options={{ 
          lerp: 0.08, 
          duration: 1.2, 
          smoothWheel: true 
        }}
      >
        <div className="min-h-screen bg-transparent flex flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </ReactLenis>
    </AuthProvider>
  )
}
