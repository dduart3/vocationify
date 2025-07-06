import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
 offset={16}
      toastOptions={{
        duration: 4000,
        unstyled: true,
        classNames: {
          toast: 'toast-glass',
          title: 'toast-title',
          description: 'toast-description',
          success: 'toast-success',
          error: 'toast-error',
          warning: 'toast-warning',
          info: 'toast-info',
          closeButton: 'toast-close',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
