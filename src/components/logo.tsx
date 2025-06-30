// Logo SVG Component
export function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle 
        cx="16" 
        cy="16" 
        r="15" 
        fill="url(#gradient1)" 
        stroke="rgba(255,255,255,0.2)" 
        strokeWidth="1"
      />
      
      {/* Main V Shape */}
      <path 
        d="M8 10 L16 22 L24 10" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Academic Cap Detail */}
      <path 
        d="M12 8 L16 6 L20 8 L16 10 Z" 
        fill="rgba(255,255,255,0.8)"
      />
      
      {/* Graduation Tassel */}
      <circle 
        cx="21" 
        cy="9" 
        r="1.5" 
        fill="rgba(234, 179, 8, 0.9)"
      />
      
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(59, 130, 246)" />
          <stop offset="50%" stopColor="rgb(147, 51, 234)" />
          <stop offset="100%" stopColor="rgb(79, 70, 229)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
