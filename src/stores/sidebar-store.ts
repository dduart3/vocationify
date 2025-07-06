import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  activeItem: string
  setOpen: (open: boolean) => void
  setCollapsed: (collapsed: boolean) => void
  setActiveItem: (item: string) => void
  toggle: () => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      isCollapsed: false,
      activeItem: 'dashboard',
      
      setOpen: (open) => set({ isOpen: open }),
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      setActiveItem: (item) => set({ activeItem: item }),
      
      toggle: () => {
        const { isOpen } = get()
        set({ isOpen: !isOpen })
      },
    }),
    {
      name: 'sidebar-storage',
    }
  )
)
