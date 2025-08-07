import { useTextToSpeech } from './use-text-to-speech'
import { useOpenAITTS } from './use-openai-tts'

// ==========================================
// TTS PROVIDER CONFIGURATION
// ==========================================
// TO SWITCH TTS PROVIDERS, JUST CHANGE THE 'provider' VALUE BELOW:
// 
// For TESTING (free): provider: 'browser'
// For PRODUCTION (paid): provider: 'openai'
// 
// ==========================================

const TTS_CONFIG = {
  provider: 'browser', // 🔄 CHANGE THIS: 'browser' | 'openai'
  
  // Browser TTS settings (FREE - for testing)
  browser: {
    language: 'es-VE',
    rate: 0.9,
    pitch: 1.1,
    volume: 0.8
  },
  
  // OpenAI TTS settings (PAID - for production)
  openai: {
    voice: 'nova' as const, // 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
    quality: 'standard' as const // 'standard' | 'hd'
  }
}

export interface TTSService {
  speak: (text: string) => Promise<void> | void
  stop: () => void
  isSpeaking: boolean
  isLoading: boolean
  isSupported: boolean
  error: string | null
}

export function useTTSService(): TTSService {
  const browserTTS = useTextToSpeech(TTS_CONFIG.browser)
  const openaiTTS = useOpenAITTS(TTS_CONFIG.openai)

  if (TTS_CONFIG.provider === 'openai') {
    return {
      speak: openaiTTS.speak,
      stop: openaiTTS.stop,
      isSpeaking: openaiTTS.isSpeaking,
      isLoading: openaiTTS.isLoading,
      isSupported: openaiTTS.isSupported,
      error: openaiTTS.error
    }
  } else {
    // Browser TTS implementation
    return {
      speak: async (text: string) => {
        console.log('🔊 Browser TTS speaking:', text.substring(0, 50) + '...')
        browserTTS.speak(text)
      },
      stop: browserTTS.stop,
      isSpeaking: browserTTS.isSpeaking,
      isLoading: false, // Browser TTS doesn't have loading state
      isSupported: browserTTS.isSupported,
      error: null // Browser TTS doesn't expose error state
    }
  }
}