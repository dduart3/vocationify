// Simple text-to-speech hook
import { useState, useCallback } from 'react'

export interface UseTextToSpeechReturn {
  speak: (text: string) => void
  stop: () => void
  isSpeaking: boolean
  isSupported: boolean
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return

    // Stop any current speech
    speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.9
    utterance.pitch = 1
    
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    setIsSpeaking(true)
    speechSynthesis.speak(utterance)
  }, [isSupported])

  const stop = useCallback(() => {
    if (!isSupported) return
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [isSupported])

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  }
}