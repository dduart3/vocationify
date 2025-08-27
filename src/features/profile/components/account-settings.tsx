import { IconShield, IconKey, IconShieldCheck, IconDownload, IconTrash } from '@tabler/icons-react'

export function AccountSettings() {
  const handleChangePassword = () => {
    // TODO: Implement password change functionality
    console.log('Change password clicked')
  }

  const handleEnable2FA = () => {
    // TODO: Implement 2FA setup
    console.log('Enable 2FA clicked')
  }

  const handleDownloadData = () => {
    // TODO: Implement data export
    console.log('Download data clicked')
  }

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion with confirmation
    console.log('Delete account clicked')
  }

  const settingsOptions = [
    {
      label: 'Cambiar contraseña',
      description: 'Actualiza tu contraseña de acceso',
      icon: IconKey,
      onClick: handleChangePassword,
      color: 'text-blue-400'
    },
    {
      label: 'Autenticación de dos factores',
      description: 'Mejora la seguridad de tu cuenta',
      icon: IconShieldCheck,
      onClick: handleEnable2FA,
      color: 'text-green-400'
    },
    {
      label: 'Descargar mis datos',
      description: 'Exporta toda tu información personal',
      icon: IconDownload,
      onClick: handleDownloadData,
      color: 'text-purple-400'
    },
    {
      label: 'Eliminar cuenta',
      description: 'Eliminar permanentemente tu cuenta',
      icon: IconTrash,
      onClick: handleDeleteAccount,
      color: 'text-red-400'
    }
  ]

  return (
    <div className="bg-white/5 rounded-xl p-6 h-fit">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <IconShield className="w-5 h-5 text-blue-400" />
        Configuración de Cuenta
      </h3>

      <div className="space-y-2">
        {settingsOptions.map((option, index) => {
          const Icon = option.icon
          return (
            <button
              key={index}
              onClick={option.onClick}
              className="w-full p-2 text-left bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${option.color}`} />
                <div className="text-sm font-medium">{option.label}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}