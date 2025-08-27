// Simple speech recognition hook
import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseSpeechRecognitionReturn {
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  transcript: string
  isListening: boolean
  isSupported: boolean
  error: string | null
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'es-ES'
    
    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }
    
    recognition.onresult = (event) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
      }
    }
    
    recognition.onerror = (event) => {
      setError(event.error)
      setIsListening(false)
    }
    
    recognition.onend = () => {
      setIsListening(false)
    }
    
    recognitionRef.current = recognition
    
    return () => {
      recognition.stop()
    }
  }, [isSupported])

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return
    
    try {
      recognitionRef.current.start()
    } catch (error) {
      console.error('Speech recognition start error:', error)
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) return
    
    recognitionRef.current.stop()
  }, [isSupported])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setError(null)
  }, [])

  return {
    startListening,
    stopListening,
    resetTranscript,
    transcript,
    isListening,
    isSupported,
    error
  }
}

// Type declarations for browser speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}