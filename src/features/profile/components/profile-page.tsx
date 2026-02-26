import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { ProfileHeader } from './profile-header'
import { ProfileForm, validateProfileData } from './profile-form'
import { ActivitySummary } from './activity-summary'

import { useAuth } from '@/context/auth-context'
import type { ProfileUpdateData } from '../types'
import { OnboardingProvider, profileSteps } from '@/features/onboarding'
import { Shimmer } from "@/components/ai-elements/shimmer"
export function ProfilePage() {
  const { profile, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editData, setEditData] = useState<ProfileUpdateData>({
    first_name: profile?.first_name || null,
    last_name: profile?.last_name || null,
    email: profile?.email || null,
    phone: profile?.phone || null,
    address: profile?.address || null,
    avatar_url: profile?.avatar_url || null,
    location: profile?.location || null
  })

  const handleEdit = () => {
    setEditData({
      first_name: profile?.first_name || null,
      last_name: profile?.last_name || null,
      email: profile?.email || null,
      phone: profile?.phone || null,
      address: profile?.address || null,
      avatar_url: profile?.avatar_url || null,
      location: profile?.location || null
    })
    setError(null)
    setIsEditing(true)
  }

  const handleSave = async () => {
    // Log the current editData to see what we're working with
    console.log('📝 Current editData before save:', editData)
    console.log('📍 Location value:', editData.location)

    // Robust validation using Zod schema
    const validation = validateProfileData({
      first_name: editData.first_name?.trim() || '',
      last_name: editData.last_name?.trim() || '',
      email: editData.email?.trim() || null,
      phone: editData.phone?.trim() || null,
      address: editData.address?.trim() || null,
      location: editData.location
    })

    if (!validation.isValid) {
      console.error('❌ Validation errors:', validation.errors)
      setError(validation.errors[0] || 'Error de validación')
      return
    }

    const updateData = {
      first_name: editData.first_name!.trim(),
      last_name: editData.last_name!.trim(),
      email: editData.email?.trim() || null,
      phone: editData.phone?.trim() || null,
      address: editData.address?.trim() || null,
      location: editData.location
    }

    console.log('🚀 Sending update to backend:', updateData)

    setIsLoading(true)
    setError(null)

    try {
      await updateProfile(updateData)
      console.log('✅ Profile updated successfully')
      setIsEditing(false)
    } catch (error: any) {
      console.error('❌ Error updating profile:', error)
      setError(error.message || 'Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      first_name: profile?.first_name || null,
      last_name: profile?.last_name || null,
      email: profile?.email || null,
      phone: profile?.phone || null,
      address: profile?.address || null,
      avatar_url: profile?.avatar_url || null,
      location: profile?.location || null
    })
    setError(null)
    setIsEditing(false)
  }

  return (
    <OnboardingProvider section="profile" steps={profileSteps}>
      <div className="flex-1 min-h-[100dvh] w-full relative flex flex-col bg-[#f8fafc] overflow-hidden">
        
        {/* Exact Sandra AI Background Match: Blue Gradient + Light Ellipse from Top */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#f8fafc]">
            {/* 1. The Multi-Color Pastel Gradient Background */}
            <div 
              className="absolute inset-x-0 bottom-0 h-full opacity-100" 
              style={{
                background: 'linear-gradient(120deg, #fed7aa 0%, #fbcfe8 45%, #bae6fd 100%)',
                maskImage: 'linear-gradient(to top, black 10%, transparent 65%)',
                WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 65%)'
              }}
            />

            {/* Premium Fine Grain Texture Overlay */}
            <div 
              className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '120px 120px',
              }}
            />

            {/* 2. The Ellipse from Top to Bottom (creating the U-shape downward arch) */}
            <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[95vh] bg-[#f8fafc] rounded-[50%] blur-[70px]" />
            <div className="absolute -top-[5%] left-1/2 -translate-x-1/2 w-[70vw] h-[90vh] bg-[#f8fafc] rounded-[50%] blur-[40px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55vw] h-[85vh] bg-[#f8fafc] rounded-[50%] blur-[20px]" />

            {/* Warm reflection edge */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 opacity-60" />
            <div className="absolute bottom-0 inset-x-0 h-[8px] bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 blur-[4px] opacity-40" />
        </div>

        {/* Inner Structure */}
        <div className="relative z-10 w-full min-h-screen p-4 md:pl-[104px] md:pr-6 md:py-6 max-w-[1000px] mx-auto flex flex-col pt-6 sm:pt-6 lg:h-screen lg:max-h-screen lg:overflow-hidden">
          <div className="flex-1 flex flex-col min-h-0 px-2 sm:px-4 lg:px-6 pt-6 sm:pt-8 lg:pt-10">

            {/* Header */}
            <div id="profile-header" className="mb-6 sm:mb-8 shrink-0 text-center lg:text-left px-2 sm:px-4">
              <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-medium tracking-tight mb-1 text-slate-800">
                <Shimmer 
                  as="span" 
                  duration={3} 
                  spread={1.5} 
                  className="font-medium [--color-muted-foreground:theme(colors.blue.400)] [--color-background:theme(colors.white)] drop-shadow-sm"
                >
                  Perfil
                </Shimmer>
              </h1>
              <p className="text-[14px] text-slate-500 font-medium">Tu información y configuración</p>
            </div>

            {/* Profile Content inside the big Glassmorphism Container */}
            <div className="flex-1 flex flex-col min-h-0">
              
              {error && (
                <div className="mb-4 mt-1 p-2 rounded-xl bg-red-50 text-red-700 text-xs sm:text-sm border border-red-200 flex items-start gap-2 max-w-2xl mx-auto w-full">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Combine Header + Stats + Form into one seamless block */}
              <div className="flex-1 flex flex-col bg-white/50 backdrop-blur-md rounded-[24px] border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="shrink-0">
                  <ProfileHeader
                    isEditing={isEditing}
                    isLoading={isLoading}
                    editData={editData}
                    onDataChange={setEditData}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                  <div className="px-6 pb-2">
                     <ActivitySummary />
                  </div>
                </div>

                {/* Subtle Divider */}
                <div className="mx-6 h-[1px] bg-slate-200/50 my-3 shrink-0" />

                {/* Form flush below with added padding for breathing room */}
                <div id="profile-form" className="flex-1 overflow-y-auto custom-scrollbar px-5 sm:px-8 pb-8 pr-3 sm:pr-8">
                  <ProfileForm
                    isEditing={isEditing}
                    editData={editData}
                    onDataChange={setEditData}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </OnboardingProvider>
  )
}