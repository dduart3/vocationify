import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTextToSpeechOptions {
  language?: string
  rate?: number
  pitch?: number
  volume?: number
}

interface UseTextToSpeechReturn {
  speak: (text: string, onComplete?: () => void) => void
  stop: () => void
  isSpeaking: boolean
  isSupported: boolean
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void
}

export function useTextToSpeech(
  options: UseTextToSpeechOptions = {}
): UseTextToSpeechReturn {
  const {
    language = 'es-VE',
    rate = 0.9,
    pitch = 1,
    volume = 0.8
  } = options

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true)
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
        
        // Try to find a Spanish voice
        const spanishVoice = availableVoices.find(voice => 
          voice.lang.startsWith('es') && voice.lang.includes('VE')
        ) || availableVoices.find(voice => 
          voice.lang.startsWith('es')
        )
        
        if (spanishVoice) {
          setSelectedVoice(spanishVoice)
        }
      }
      
      loadVoices()
      
      // Some browsers load voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    } else {
      setIsSupported(false)
    }
  }, [])

  const speak = useCallback((text: string, onComplete?: () => void) => {
    if (!isSupported || !text.trim()) return

    // Stop any current speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume
    utterance.lang = language

    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      // Call the completion callback if provided
      if (onComplete) {
        onComplete()
      }
    }

    utterance.onerror = (event) => {
      // Only log non-interrupted errors to avoid spam
      if (event.error !== 'interrupted') {
        console.error('Speech synthesis error:', event.error)
      }
      setIsSpeaking(false)
      // Also call onComplete on error to prevent getting stuck
      if (onComplete) {
        onComplete()
      }
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [isSupported, rate, pitch, volume, language, selectedVoice])

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice
  }
}