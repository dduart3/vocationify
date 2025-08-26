import {  useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { IconLoader2, IconSparkles } from '@tabler/icons-react'
import gsap from 'gsap'


export function AuthCallback() {
  const navigate = useNavigate()
  const { setUser, setSession, setProfile, setLoading, setError } = useAuthStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const card = cardRef.current

    if (container && card) {
      // Initial animation
      gsap.set(card, { opacity: 0, y: 20, scale: 0.95 })
      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out"
      })

      // Floating animation
      gsap.to(card, {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    }

    const handleAuthCallback = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (data.session?.user) {
          console.log('🔍 Checking for existing profile for user:', data.session.user.email)
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single()
          
          console.log('Profile query result:', { profileData, profileError })

          if (profileError || !profileData) {
            // Profile doesn't exist, create it
            console.log('🆕 Profile does not exist, creating new profile for OAuth user:', data.session.user.email)
            console.log('📋 Full user metadata from Google:', JSON.stringify(data.session.user.user_metadata, null, 2))
            
            // Extract names from Google OAuth user metadata
            // Check what Supabase actually provides from Google
            const rawDisplayName = data.session.user.user_metadata?.name
            const rawFullName = data.session.user.user_metadata?.full_name
            const rawDisplayName2 = data.session.user.user_metadata?.display_name
            
            console.log('Raw Google data - name:', rawDisplayName)
            console.log('Raw Google data - full_name:', rawFullName) 
            console.log('Raw Google data - display_name:', rawDisplayName2)
            
            // Use the display name that you can see in auth module
            const fullName = rawDisplayName || rawFullName || rawDisplayName2 || ''
            
            console.log('Final extracted full name:', fullName)
            
            if (!fullName) {
              console.warn('⚠️ No name found in Google user metadata!')
            }
            
            const nameParts = fullName.trim().split(' ')
            const firstName = nameParts[0] || ''
            const lastName = nameParts.slice(1).join(' ') || ''
            
            console.log('✅ Parsed names - First:', firstName, 'Last:', lastName)

            const newProfile = {
              id: data.session.user.id,
              first_name: firstName.trim() || null,
              last_name: lastName.trim() || null,
              email: data.session.user.email || null,
              avatar_url: data.session.user.user_metadata?.avatar_url || null,
              phone: null,
              address: null,
              location: null,
              role_id: 2, // Default user role (1=admin, 2=user)
            }

            console.log('📝 About to create profile with data:', newProfile)

            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single()

            if (createError) {
              console.error('❌ Profile creation error:', createError)
              console.error('❌ Error details:', {
                message: createError.message,
                code: createError.code,
                details: createError.details,
                hint: createError.hint
              })
              throw createError
            }
            
            console.log('✅ Profile created successfully in database!')
            console.log('✅ Created profile data:', createdProfile)
            
            // Verify the names were actually saved
            if (createdProfile?.first_name && createdProfile?.last_name) {
              console.log(`✅ Names saved correctly: ${createdProfile.first_name} ${createdProfile.last_name}`)
            } else {
              console.warn('⚠️ Names may not have been saved properly:', {
                first_name: createdProfile?.first_name,
                last_name: createdProfile?.last_name
              })
            }
            setProfile(createdProfile as UserProfile)
          } else {
            // Profile exists, check if names are missing and update them
            console.log('Found existing profile:', profileData)
            
            if (!profileData.first_name || !profileData.last_name) {
              console.log('🔄 Profile exists but names are missing, updating with Google data...')
              console.log('📋 Full user metadata from Google:', JSON.stringify(data.session.user.user_metadata, null, 2))
              
              // Extract names from Google OAuth user metadata
              const rawDisplayName = data.session.user.user_metadata?.name
              const rawFullName = data.session.user.user_metadata?.full_name
              const rawDisplayName2 = data.session.user.user_metadata?.display_name
              
              console.log('Raw Google data - name:', rawDisplayName)
              console.log('Raw Google data - full_name:', rawFullName) 
              console.log('Raw Google data - display_name:', rawDisplayName2)
              
              const fullName = rawDisplayName || rawFullName || rawDisplayName2 || ''
              console.log('Final extracted full name:', fullName)
              
              if (fullName) {
                const nameParts = fullName.trim().split(' ')
                const firstName = nameParts[0] || ''
                const lastName = nameParts.slice(1).join(' ') || ''
                
                console.log('✅ Parsed names - First:', firstName, 'Last:', lastName)
                
                // Update the profile with the names
                const { data: updatedProfile, error: updateError } = await supabase
                  .from('profiles')
                  .update({
                    first_name: firstName.trim() || null,
                    last_name: lastName.trim() || null
                  })
                  .eq('id', data.session.user.id)
                  .select()
                  .single()
                
                if (updateError) {
                  console.error('❌ Profile update error:', updateError)
                } else {
                  console.log('✅ Profile updated successfully with names!')
                  console.log('✅ Updated profile:', updatedProfile)
                  setProfile(updatedProfile as UserProfile)
                  // Don't return here - continue with auth flow
                }
              } else {
                console.warn('⚠️ No name found in Google user metadata to update profile')
              }
            }
            
            setProfile(profileData)
          }

          setUser(data.session.user)
          setSession(data.session)

          // Set a flag to indicate OAuth login completion
          sessionStorage.setItem('oauth-login-completed', 'true')
          
          // Add a small delay to prevent duplicate toasts and ensure state is set
          setTimeout(() => {
            // Only show toast if it hasn't been shown already
            if (sessionStorage.getItem('oauth-toast-shown') !== 'true') {
              sessionStorage.setItem('oauth-toast-shown', 'true')
              toast.success('¡Bienvenido!', {
                description: 'Has iniciado sesión correctamente.',
              })
            }

            navigate({ to: '/dashboard' })
            
            // Clean up flags after navigation
            setTimeout(() => {
              sessionStorage.removeItem('oauth-login-completed')
              sessionStorage.removeItem('oauth-toast-shown')
            }, 1000)
          }, 100)
        } else {
          throw new Error('No se encontró la sesión')
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setError(error.message)
        toast.error('Error de autenticación', {
          description: error.message || 'Por favor, intenta iniciar sesión nuevamente.',
        })
        
        navigate({ to: '/login' })
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [navigate, setUser, setSession, setProfile, setLoading, setError])

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-600/15 to-purple-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div 
        ref={cardRef}
        className="text-center relative z-10"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
            0 20px 40px -12px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          padding: '2rem',
          maxWidth: '320px'
        }}
      >
        {/* Loading Icon with glow */}
        <div className="relative mb-4">
          <IconLoader2 size={40} className="animate-spin text-blue-400 mx-auto" />
          <div className="absolute inset-0 bg-blue-400/15 rounded-full blur-lg animate-pulse"></div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <h2 className="text-lg font-semibold text-white">
            Completando inicio de sesión
          </h2>
          <IconSparkles size={16} className="text-blue-400 animate-pulse" />
        </div>

        <p className="text-slate-400 text-sm leading-relaxed">
          Por favor espera mientras configuramos tu cuenta.
        </p>

        {/* Progress indicator */}
        <div className="mt-4">
          <div className="w-full bg-slate-700/50 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{
                width: '100%',
                animation: 'progress 2s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
