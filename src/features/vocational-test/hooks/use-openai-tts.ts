import { useState, useRef, useCallback } from 'react'

export interface OpenAITTSOptions {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  quality?: 'standard' | 'hd'
  apiUrl?: string
}

export function useOpenAITTS(options: OpenAITTSOptions = {}) {
  const {
    voice = 'nova', // Female voice, good for ARIA
    quality = 'standard',
    apiUrl = '/api/tts/speech'
  } = options

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCache = useRef<Map<string, string>>(new Map())

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return

    try {
      setIsLoading(true)
      setError(null)

      // Check cache first
      const cacheKey = `${text}-${voice}-${quality}`
      let audioUrl = audioCache.current.get(cacheKey)

      if (!audioUrl) {
        // Generate new audio
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: text.substring(0, 4000), // Limit to 4000 chars to be safe
            voice,
            quality
          })
        })

        if (!response.ok) {
          throw new Error(`TTS request failed: ${response.status}`)
        }

        const audioBlob = await response.blob()
        audioUrl = URL.createObjectURL(audioBlob)
        
        // Cache the URL (limit cache size to prevent memory issues)
        if (audioCache.current.size > 50) {
          const iterator = audioCache.current.keys().next()
          if (!iterator.done) {
            const firstKey = iterator.value
            const firstUrl = audioCache.current.get(firstKey)
            if (firstUrl) {
              URL.revokeObjectURL(firstUrl)
              audioCache.current.delete(firstKey)
            }
          }
        }
        audioCache.current.set(cacheKey, audioUrl)
      }

      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // Create and play new audio
      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onloadstart = () => setIsLoading(false)
      audio.onplay = () => setIsSpeaking(true)
      audio.onended = () => setIsSpeaking(false)
      audio.onerror = () => {
        setIsSpeaking(false)
        setError('Failed to play audio')
      }

      await audio.play()

    } catch (err) {
      setIsLoading(false)
      setIsSpeaking(false)
      setError(err instanceof Error ? err.message : 'TTS failed')
      console.error('OpenAI TTS Error:', err)
    }
  }, [voice, quality, apiUrl])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsSpeaking(false)
    }
  }, [])

  const isSupported = true // OpenAI TTS works everywhere with network

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    isSupported,
    error
  }
}