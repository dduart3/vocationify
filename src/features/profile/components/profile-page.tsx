import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { ProfileHeader } from './profile-header'
import { ProfileForm, validateProfileData } from './profile-form'
import { ActivitySummary } from './activity-summary'
import { AccountInfo } from './account-info'
import { useAuth } from '@/context/auth-context'
import type { ProfileUpdateData } from '../types'
import { OnboardingProvider, profileSteps } from '@/features/onboarding'

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
      setError(validation.errors[0] || 'Error de validación')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await updateProfile({
        first_name: editData.first_name!.trim(),
        last_name: editData.last_name!.trim(),
        email: editData.email?.trim() || null,
        phone: editData.phone?.trim() || null,
        address: editData.address?.trim() || null,
        location: editData.location
      })
      setIsEditing(false)
    } catch (error: any) {
      console.error('Error updating profile:', error)
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
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div id="profile-header" className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Perfil</h1>
            <p className="text-sm sm:text-base text-gray-600">Tu información y configuración</p>
          </div>

          {/* Profile Section */}
          <div id="profile-form" className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 shadow-sm border border-gray-200 relative overflow-hidden">
            <ProfileHeader
              isEditing={isEditing}
              isLoading={isLoading}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
            />

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 text-red-700 text-xs sm:text-sm border border-red-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <ProfileForm
                isEditing={isEditing}
                editData={editData}
                onDataChange={setEditData}
              />
            </div>
          </div>

          {/* Bottom Grid */}
          <div id="activity-summary" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ActivitySummary />
            <div className="space-y-4 sm:space-y-6">
              <AccountInfo />
            </div>
          </div>
        </div>
      </div>
    </OnboardingProvider>
  )
}