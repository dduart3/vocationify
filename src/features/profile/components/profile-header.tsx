import { IconUser, IconEdit, IconCheck, IconX } from '@tabler/icons-react'
import { useAuth } from '@/context/auth-context'
import type { ProfileUpdateData } from '../types'

interface ProfileHeaderProps {
  isEditing: boolean
  isLoading?: boolean
  editData?: ProfileUpdateData
  onDataChange?: (data: ProfileUpdateData) => void
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

export function ProfileHeader({ isEditing, isLoading, editData, onDataChange, onEdit, onSave, onCancel }: ProfileHeaderProps) {
  const { user, profile } = useAuth()

  return (
    <div className="relative w-full overflow-hidden shrink-0">
      
      {/* Top Banner with soft gradient */}
      <div 
        className="w-full h-24 sm:h-28 bg-gradient-to-r from-teal-100/60 via-blue-100/50 to-indigo-100/40"
        style={{
          boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.02)'
        }}
      />

      <div className="px-6 sm:px-8 pb-3 sm:pb-4 flex flex-col relative top-[-32px] sm:top-[-40px]">
        
        {/* Avatar and Button Row */}
        <div className="flex justify-between items-start mb-2">
          
          {/* Avatar floating out of banner */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 sm:p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] shrink-0">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center overflow-hidden relative shadow-inner">
               {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover relative z-10" />
               ) : (
                  <IconUser className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
               )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-10 sm:pt-14 shrink-0">
            {!isEditing ? (
              <button
                onClick={onEdit}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-1.5 bg-gradient-to-b from-blue-50 to-blue-100/50 rounded-full border border-blue-200/60 shadow-[inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(59,130,246,0.05),0_2px_6px_rgba(59,130,246,0.08)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(59,130,246,0.05),0_4px_12px_rgba(59,130,246,0.15)] hover:-translate-y-[1px] active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(59,130,246,0.1),0_1px_2px_rgba(59,130,246,0.05)] text-[12px] font-bold text-blue-600 transition-all duration-300"
              >
                <IconEdit className="w-3.5 h-3.5" />
                Editar perfil
              </button>
            ) : (
               <div className="flex gap-2">
                 <button
                   onClick={onSave}
                   disabled={isLoading}
                   className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-b from-blue-500 to-blue-600 text-white font-bold text-[12px] rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(37,99,235,0.3)] hover:from-blue-600 hover:to-blue-700 hover:-translate-y-[1px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.2),0_6px_14px_rgba(37,99,235,0.4)] active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2),0_2px_4px_rgba(37,99,235,0.3)] border border-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   <IconCheck className="w-3.5 h-3.5" />
                   {isLoading ? 'Guardando...' : 'Guardar'}
                 </button>
                 <button
                   onClick={onCancel}
                   className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-b from-white to-slate-50/80 border border-slate-200/80 shadow-[inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.04)] hover:-translate-y-[1px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.04),0_6px_14px_rgba(239,68,68,0.08)] active:translate-y-[1px] active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)] hover:text-red-500 hover:border-red-200/60 text-[12px] font-bold text-slate-600 rounded-full transition-all duration-300"
                 >
                   <IconX className="w-3.5 h-3.5" />
                   Cancelar
                 </button>
               </div>
            )}
          </div>
        </div>

        {/* User Info aligned tightly below Avatar */}
        <div className="flex flex-col gap-0.5 -mt-1 sm:-mt-2 relative">
          {isEditing ? (
            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={editData?.first_name || ''}
                  onChange={(e) => onDataChange?.({ ...editData!, first_name: e.target.value })}
                  className="px-3 py-1.5 sm:py-2 bg-white/60 border border-slate-200/80 rounded-[10px] text-[15px] sm:text-[17px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all max-w-[140px] sm:max-w-[180px]"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={editData?.last_name || ''}
                  onChange={(e) => onDataChange?.({ ...editData!, last_name: e.target.value })}
                  className="px-3 py-1.5 sm:py-2 bg-white/60 border border-slate-200/80 rounded-[10px] text-[15px] sm:text-[17px] font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all max-w-[140px] sm:max-w-[180px]"
                />
              </div>
              <input
                type="email"
                placeholder="tu@email.com"
                value={editData?.email || ''}
                onChange={(e) => onDataChange?.({ ...editData!, email: e.target.value })}
                className="px-3 py-1 sm:py-1.5 bg-white/60 border border-slate-200/80 rounded-[8px] text-[13px] text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder:text-slate-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] transition-all max-w-[288px] sm:max-w-[368px]"
              />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-1 duration-300">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-[24px] font-bold text-slate-900 tracking-tight leading-none transition-all duration-300">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_2px_5px_rgba(37,99,235,0.4),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-1px_2px_rgba(0,0,0,0.2)] border border-blue-400/50 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-transform duration-300 hover:scale-105">
                   <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                   </svg>
                </div>
              </div>
              <p className="text-[13px] text-slate-500 font-medium tracking-tight mt-1 transition-all duration-300">
                {profile?.email || user?.email}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}