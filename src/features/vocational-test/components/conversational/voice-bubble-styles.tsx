import type { ConversationalBubbleState } from './types'

export function getStateStyles(state: ConversationalBubbleState, audioLevel: number) {
  const audioIntensity = state === 'listening' ? audioLevel : 0
  const pulseIntensity = 0.3 + audioIntensity * 0.7
  
  switch (state) {
    case 'listening':
      return {
        background: `
          radial-gradient(circle at 30% 30%, 
            rgba(34, 197, 94, ${0.4 + audioIntensity * 0.3}) 0%, 
            rgba(34, 197, 94, ${0.2 + audioIntensity * 0.2}) 35%,
            rgba(34, 197, 94, ${0.1 + audioIntensity * 0.1}) 70%,
            transparent 100%
          ),
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.05) 100%
          )
        `,
        boxShadow: `
          0 0 ${60 + audioIntensity * 40}px rgba(34, 197, 94, ${pulseIntensity}),
          0 0 ${100 + audioIntensity * 60}px rgba(34, 197, 94, ${pulseIntensity * 0.5}),
          inset 0 2px 0 rgba(255, 255, 255, 0.2)
        `,
        border: `2px solid rgba(34, 197, 94, ${0.3 + audioIntensity * 0.4})`,
        transform: `scale(${1 + audioIntensity * 0.05})`,
      }
    case 'session-starting':
      return {
        background: `
          radial-gradient(circle at 30% 30%, 
            rgba(59, 130, 246, 0.3) 0%, 
            rgba(147, 51, 234, 0.2) 35%,
            rgba(59, 130, 246, 0.1) 70%,
            transparent 100%
          ),
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.05) 100%
          )
        `,
        boxShadow: `
          0 0 80px rgba(59, 130, 246, 0.4),
          0 0 120px rgba(147, 51, 234, 0.3),
          inset 0 2px 0 rgba(255, 255, 255, 0.2)
        `,
        border: '2px solid rgba(59, 130, 246, 0.4)',
      }
    case 'speaking':
      return {
        background: `
          radial-gradient(circle at 30% 30%, 
            rgba(59, 130, 246, 0.4) 0%, 
            rgba(59, 130, 246, 0.2) 35%,
            rgba(59, 130, 246, 0.1) 70%,
            transparent 100%
          ),
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.05) 100%
          )
        `,
        boxShadow: `
          0 0 60px rgba(59, 130, 246, 0.4),
          0 0 100px rgba(59, 130, 246, 0.2),
          inset 0 2px 0 rgba(255, 255, 255, 0.2)
        `,
        border: '2px solid rgba(59, 130, 246, 0.3)',
      }
    case 'thinking':
      return {
        background: `
          radial-gradient(circle at 30% 30%, 
            rgba(147, 51, 234, 0.4) 0%, 
            rgba(147, 51, 234, 0.2) 35%,
            rgba(147, 51, 234, 0.1) 70%,
            transparent 100%
          ),
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.05) 100%
          )
        `,
        boxShadow: `
          0 0 60px rgba(147, 51, 234, 0.4),
          0 0 100px rgba(147, 51, 234, 0.2),
          inset 0 2px 0 rgba(255, 255, 255, 0.2)
        `,
        border: '2px solid rgba(147, 51, 234, 0.3)',
      }
    case 'results-display':
      return {
        background: `
          radial-gradient(circle at 50% 50%, 
            rgba(34, 197, 94, 0.4) 0%, 
            rgba(16, 185, 129, 0.3) 25%,
            rgba(59, 130, 246, 0.2) 50%,
            rgba(147, 51, 234, 0.1) 75%,
            transparent 100%
          ),
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.2) 0%, 
            rgba(255, 255, 255, 0.05) 100%
          )
        `,
        boxShadow: `
          0 0 100px rgba(34, 197, 94, 0.5),
          0 0 150px rgba(16, 185, 129, 0.4),
          0 0 200px rgba(59, 130, 246, 0.3),
          inset 0 2px 0 rgba(255, 255, 255, 0.3)
        `,
        border: '2px solid rgba(34, 197, 94, 0.4)',
      }
    default:
      return {
        background: `
          radial-gradient(ellipse at 25% 25%, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(59, 130, 246, 0.1) 25%,
            rgba(147, 51, 234, 0.08) 50%,
            rgba(59, 130, 246, 0.05) 75%,
            transparent 100%
          ),
          radial-gradient(ellipse at 75% 75%, 
            rgba(147, 51, 234, 0.1) 0%, 
            rgba(59, 130, 246, 0.05) 50%,
            transparent 100%
          ),
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.02) 100%
          )
        `,
        boxShadow: `
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(255, 255, 255, 0.05)
        `,
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }
  }
}