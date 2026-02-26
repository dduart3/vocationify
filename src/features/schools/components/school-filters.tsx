import { IconSearch, IconChevronDown } from '@tabler/icons-react'
import { useState, useRef, useEffect } from 'react'

interface SchoolFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  typeFilter: 'all' | 'public' | 'private'
  onTypeChange: (value: 'all' | 'public' | 'private') => void
}

export function SchoolFilters({ 
  searchTerm, 
  onSearchChange, 
  typeFilter, 
  onTypeChange
}: SchoolFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filterOptions: { id: 'all' | 'public' | 'private', label: string }[] = [
    { id: 'all', label: 'Todos los Tipos' },
    { id: 'public', label: 'Pública' },
    { id: 'private', label: 'Privada' }
  ]

  const currentLabel = filterOptions.find(opt => opt.id === typeFilter)?.label || 'Todos los Tipos'

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full h-[60px] mb-2 sm:mb-0">
      
      {/* 3D Static Search Bar */}
      <div className="relative flex-1 group w-full sm:w-auto h-full flex z-10">
        <IconSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 h-[18px] w-[18px] text-slate-500 z-10 transition-colors duration-300 group-focus-within:text-blue-500" />
        <input
          type="text"
          placeholder="Buscar instituciones..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-full pl-14 pr-6 bg-slate-200/80 backdrop-blur-md border border-slate-300 shadow-[inset_0_3px_8px_rgba(0,0,0,0.1),0_1px_2px_rgba(255,255,255,0.9)] hover:bg-slate-100/90 focus:bg-white rounded-full text-[14px] text-slate-800 font-bold placeholder-slate-500 focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10 focus:shadow-[inset_0_3px_8px_rgba(59,130,246,0.1),0_10px_30px_rgba(59,130,246,0.15)] transition-all duration-300"
        />
      </div>

      {/* 3D Custom Dropdown Menu with Pill Track */}
      <div className="relative shrink-0 w-full sm:w-auto p-1 bg-slate-200/80 backdrop-blur-md border border-slate-300 shadow-inner rounded-full z-20 h-full flex flex-col justify-center" ref={dropdownRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full h-full rounded-full bg-slate-50 border border-slate-200 shadow-[0_2px_5px_rgba(0,0,0,0.08),inset_0_-1px_2px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.15),inset_0_-2px_4px_rgba(59,130,246,0.08),inset_0_2px_4px_rgba(255,255,255,1)] hover:bg-white hover:border-blue-200/60 hover:-translate-y-[1px] transition-all duration-300 group flex items-center justify-between sm:justify-center cursor-pointer pl-6 pr-5 sm:w-[210px] select-none ${isOpen ? 'shadow-[0_4px_12px_rgba(59,130,246,0.15),inset_0_-2px_4px_rgba(59,130,246,0.08),inset_0_2px_4px_rgba(255,255,255,1)] bg-white border-blue-200/60 -translate-y-[1px]' : ''}`}
        >
          <span className={`text-[13px] font-bold transition-colors duration-300 whitespace-nowrap ${isOpen ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-600'}`}>
            {currentLabel}
          </span>
          <div className={`ml-3 flex items-center justify-center w-7 h-7 rounded-full border shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-300 shrink-0 ${isOpen ? 'bg-blue-50 border-blue-200 shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_2px_6px_rgba(59,130,246,0.15)]' : 'bg-slate-100 border-slate-200/60 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_2px_6px_rgba(59,130,246,0.15)]'}`}>
            <IconChevronDown stroke={2.5} className={`w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400 group-hover:text-blue-500'}`} />
          </div>
        </div>

        {/* Dropdown Options List */}
        <div 
          className={`absolute top-full right-0 mt-3 w-full sm:w-[230px] bg-white/95 backdrop-blur-3xl border border-slate-200 shadow-[0_12px_50px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,1)] rounded-3xl overflow-hidden transition-all duration-300 origin-top z-50 p-1.5 ${isOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none -translate-y-2'}`}
        >
          <div className="flex flex-col gap-1">
            {filterOptions.map(option => {
              const isActive = typeFilter === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    onTypeChange(option.id)
                    setIsOpen(false)
                  }}
                  className={`relative text-left px-5 py-3 text-[13px] font-bold rounded-2xl transition-all duration-200 overflow-hidden group/opt ${
                    isActive 
                      ? 'bg-blue-50/80 text-blue-600 shadow-[inset_0_1px_2px_rgba(255,255,255,1)] border border-blue-100/50' 
                      : 'text-slate-500 border border-transparent hover:text-slate-800'
                  }`}
                >
                  {/* Subtle hover background highlight */}
                  {!isActive && <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover/opt:opacity-100 transition-opacity pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,1)]" />}
                  <span className="relative z-10 flex items-center justify-between w-full">
                    {option.label}
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}