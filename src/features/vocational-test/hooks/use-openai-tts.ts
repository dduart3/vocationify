import { useState, useRef, useCallback } from 'react'

export interface OpenAITTSOptions {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  model?: 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts'
  speed?: number // 0.25 to 4.0
  apiUrl?: string
}

export interface UseOpenAITTSReturn {
  speak: (text: string, onComplete?: () => void) => Promise<void>
  stop: () => void
  isSpeaking: boolean
  isLoading: boolean
  isSupported: boolean
  error: string | null
  progress: number
}

export function useOpenAITTS(options: OpenAITTSOptions = {}): UseOpenAITTSReturn {
  const {
    voice = 'nova', // Female Spanish voice, perfect for ARIA
    model = 'gpt-4o-mini-tts', // Cheapest OpenAI TTS model available
    speed = 1.0,
    apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tts/openai-speech`
  } = options

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const lastProgressRef = useRef<number>(0)
  const lastUpdateRef = useRef<number>(0)
  const onCompleteRef = useRef<(() => void) | null>(null)
  const audioCache = useRef<Map<string, string>>(new Map())
  const currentRequestRef = useRef<AbortController | null>(null)
  const isPlayingRef = useRef(false)

  const speak = useCallback(async (text: string, onComplete?: () => void) => {
    if (!text.trim()) {
      onComplete?.()
      return
    }

    // Prevent multiple simultaneous speak calls
    if (isPlayingRef.current) {
      console.log('🚫 OpenAI TTS: Already playing audio, ignoring new request')
      onComplete?.()
      return
    }

    try {
      setError(null)
      setIsLoading(true)
      isPlayingRef.current = true
      console.log('🎯 TTS setIsLoading(true) called')

      // Abort any ongoing request
      if (currentRequestRef.current) {
        currentRequestRef.current.abort()
      }

      // Stop any currently playing audio (suppress callback to prevent auto-listening)
      stop(true)
      
      // Set completion callback AFTER stopping previous audio
      onCompleteRef.current = onComplete || null
      console.log('🎯 TTS speak() set completion callback after stop:', !!onComplete)

      // Create cache key based on text and voice settings
      const cacheKey = `${text.trim()}-${voice}-${model}-${speed}`
      let audioUrl = audioCache.current.get(cacheKey)

      if (!audioUrl) {
        console.log('🔊 Generating OpenAI TTS audio for:', text.substring(0, 50) + '...')
        
        // Create abort controller for this request
        const abortController = new AbortController()
        currentRequestRef.current = abortController
        
        // Generate new audio from OpenAI
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: text.substring(0, 4000), // OpenAI TTS limit
            voice,
            model,
            speed
          }),
          signal: abortController.signal
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `TTS API failed with status ${response.status}`)
        }

        const audioBlob = await response.blob()
        audioUrl = URL.createObjectURL(audioBlob)
        
        // Cache management (keep last 20 items to prevent memory issues)
        if (audioCache.current.size >= 20) {
          const iterator = audioCache.current.keys().next()
          if (!iterator.done) {
            const oldUrl = audioCache.current.get(iterator.value)
            if (oldUrl) {
              URL.revokeObjectURL(oldUrl)
            }
            audioCache.current.delete(iterator.value)
          }
        }
        
        audioCache.current.set(cacheKey, audioUrl)
        console.log('✅ OpenAI TTS audio generated and cached')
      } else {
        console.log('🎵 Using cached OpenAI TTS audio')
      }

      // Create and configure audio element for fastest playback
      const audio = new Audio()
      audio.preload = 'auto' // Preload for faster playback
      audio.crossOrigin = 'anonymous' // Enable CORS for cached content
      audio.src = audioUrl
      audioRef.current = audio

      // Force load to start immediately
      audio.load()

      // Set up event listeners (don't end loading on canplay, wait for actual playback)
      audio.oncanplay = () => {
        console.log('🎯 TTS audio can play (not setting isLoading false yet)')
      }

      audio.onloadstart = () => {
        console.log('🔄 Audio loading started')
      }

      audio.onplay = () => {
        setIsSpeaking(true)
        setIsLoading(false) // Only end loading when audio actually starts playing
        setProgress(0)
        console.log('🎤 OpenAI TTS started speaking')
        console.log('🎯 TTS setIsLoading(false) on play')
      }

      audio.onpause = () => {
        console.log('⏸️ Audio paused')
      }

      audio.ontimeupdate = () => {
        // Track progress for debugging and UI syncing (throttled for performance)
        if (audio.duration && audio.currentTime) {
          const now = performance.now()
          const currentProgress = audio.currentTime / audio.duration
          
          // Throttle updates: Ensure we only trigger a React re-render max once every ~60ms
          // AND only if the progress changed meaningfully (>0.5% threshold) to avoid micro-stutters
          if (
            now - lastUpdateRef.current > 60 && 
            Math.abs(currentProgress - lastProgressRef.current) > 0.005
          ) {
            setProgress(currentProgress)
            lastProgressRef.current = currentProgress
            lastUpdateRef.current = now
            
            if (currentProgress * 100 > 95) { // Near end
              console.log(`🔊 Audio near end: ${(currentProgress * 100).toFixed(1)}%`)
            }
          }
        }
      }

      audio.onended = () => {
        setIsSpeaking(false)
        isPlayingRef.current = false
        setProgress(0)
        lastProgressRef.current = 0
        console.log('✅ OpenAI TTS finished speaking')
        console.log('🎯 TTS onended - checking completion callback:', !!onCompleteRef.current)
        if (onCompleteRef.current) {
          console.log('🎯 TTS calling completion callback')
          onCompleteRef.current()
          onCompleteRef.current = null
        } else {
          console.log('🚫 TTS no completion callback to call')
        }
      }

      audio.onerror = (event) => {
        setIsLoading(false)
        setIsSpeaking(false)
        isPlayingRef.current = false
        setError('Failed to play generated audio')
        console.error('❌ OpenAI TTS audio error:', event)
        
        if (onCompleteRef.current) {
          onCompleteRef.current()
          onCompleteRef.current = null
        }
      }

      audio.onabort = () => {
        setIsLoading(false)
        setIsSpeaking(false)
        isPlayingRef.current = false
        console.log('🛑 OpenAI TTS playback aborted')
        
        if (onCompleteRef.current) {
          onCompleteRef.current()
          onCompleteRef.current = null
        }
      }

      // Start playing immediately without waiting
      await audio.play()

    } catch (err) {
      setIsLoading(false)
      setIsSpeaking(false)
      isPlayingRef.current = false
      currentRequestRef.current = null
      
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🛑 OpenAI TTS request aborted')
        return
      }
      
      const errorMessage = err instanceof Error ? err.message : 'OpenAI TTS failed'
      setError(errorMessage)
      console.error('❌ OpenAI TTS Error:', err)
      
      // Always call completion callback even on error to prevent getting stuck
      if (onCompleteRef.current) {
        onCompleteRef.current()
        onCompleteRef.current = null
      }
    }
  }, [voice, model, speed, apiUrl])

  const stop = useCallback((suppressCallback: boolean = false) => {
    console.log('🛑 TTS stop() called with suppressCallback:', suppressCallback, 'had callback:', !!onCompleteRef.current)
    
    // Abort any ongoing request
    if (currentRequestRef.current) {
      currentRequestRef.current.abort()
      currentRequestRef.current = null
    }
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    
    setIsSpeaking(false)
    setProgress(0)
    lastProgressRef.current = 0
    // Don't reset isLoading when suppressing callback (we're about to start new audio)
    if (!suppressCallback) {
      setIsLoading(false)
      console.log('🎯 TTS stop() setIsLoading(false)')
    } else {
      console.log('🎯 TTS stop() keeping isLoading true (suppressCallback)')
    }
    isPlayingRef.current = false
    
    // Call completion callback only if not suppressed (for manual stops only)
    if (!suppressCallback && onCompleteRef.current) {
      console.log('🎯 TTS stop() calling completion callback')
      onCompleteRef.current()
      onCompleteRef.current = null
    } else if (suppressCallback) {
      // Clear the callback without calling it
      console.log('🎯 TTS stop() clearing callback without calling (suppressCallback=true)')
      onCompleteRef.current = null
    }
    
    console.log('🛑 OpenAI TTS stopped')
  }, [])

  // Cleanup on unmount
  /* 
  const cleanup = useCallback(() => {
    stop()
    // Clean up all cached URLs
    audioCache.current.forEach(url => URL.revokeObjectURL(url))
    audioCache.current.clear()
  }, [stop])
*/
  // OpenAI TTS is always supported as it's server-side
  const isSupported = true

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    isSupported,
    error,
    progress
  }
}