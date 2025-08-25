// Voice settings hook with localStorage persistence
// Responsibility: Manage voice behavior preferences

import { useState, useEffect } from 'react'

export type VoiceListeningMode = 'auto' | 'manual'

interface VoiceSettings {
  listeningMode: VoiceListeningMode
  volume: number
  speechRate: number
}

const DEFAULT_SETTINGS: VoiceSettings = {
  listeningMode: 'auto',
  volume: 0.8,
  speechRate: 0.9
}

const STORAGE_KEY = 'vocational-test-voice-settings'

export function useVoiceSettings() {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY)
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      }
    } catch (error) {
      console.warn('Failed to load voice settings from localStorage:', error)
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.warn('Failed to save voice settings to localStorage:', error)
    }
  }, [settings])

  const updateSettings = (updates: Partial<VoiceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const setListeningMode = (mode: VoiceListeningMode) => {
    updateSettings({ listeningMode: mode })
  }

  const setVolume = (volume: number) => {
    updateSettings({ volume: Math.max(0, Math.min(1, volume)) })
  }

  const setSpeechRate = (rate: number) => {
    updateSettings({ speechRate: Math.max(0.5, Math.min(2, rate)) })
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return {
    settings,
    updateSettings,
    setListeningMode,
    setVolume,
    setSpeechRate,
    resetSettings
  }
}