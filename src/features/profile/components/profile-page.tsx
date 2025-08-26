import { useState } from 'react'
import { ProfileHeader } from './profile-header'
import { ProfileForm } from './profile-form'
import { AccountSettings } from './account-settings'
import { ActivitySummary } from './activity-summary'
import { AccountInfo } from './account-info'
import { useAuthStore } from '@/stores/auth-store'
import type { ProfileUpdateData } from '../types'

export function ProfilePage() {
  const { profile, updateProfile } = useAuthStore()
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
    // Validation
    if (!editData.first_name?.trim() || !editData.last_name?.trim()) {
      setError('El nombre y apellido son obligatorios')
      return
    }

    if (editData.first_name.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }

    if (editData.last_name.trim().length < 2) {
      setError('El apellido debe tener al menos 2 caracteres')
      return
    }

    // Optional email validation
    if (editData.email && editData.email.trim() && !editData.email.includes('@')) {
      setError('Ingrese un correo electrónico válido')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      await updateProfile({
        first_name: editData.first_name.trim(),
        last_name: editData.last_name.trim(),
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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Perfil</h1>
          <p className="text-neutral-400">Tu información y configuración</p>
        </div>
        
        {/* Profile Section */}
        <div className="bg-white/5 rounded-xl p-6 mb-6">
          <ProfileHeader 
            isEditing={isEditing}
            isLoading={isLoading}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <ProfileForm 
              isEditing={isEditing}
              editData={editData}
              onDataChange={setEditData}
            />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivitySummary />
          <div className="space-y-6">
            <AccountInfo />
            <AccountSettings />
          </div>
        </div>
      </div>
    </div>
  )
}