import { useState, useEffect, useRef } from 'react'
import type { ConversationalBubbleState } from './types'

export function useAudioVisualization(state: ConversationalBubbleState, isRecording: boolean) {
  const [audioLevel, setAudioLevel] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    if (state === 'listening' && isRecording) {
      const startAudioVisualization = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const analyser = audioContext.createAnalyser()
          const microphone = audioContext.createMediaStreamSource(stream)
          
          analyser.smoothingTimeConstant = 0.8
          analyser.fftSize = 256
          microphone.connect(analyser)
          
          audioContextRef.current = audioContext
          analyserRef.current = analyser
          
          const bufferLength = analyser.frequencyBinCount
          const dataArray = new Uint8Array(bufferLength)
          
          const updateAudioLevel = () => {
            if (!analyserRef.current) return
            
            analyserRef.current.getByteFrequencyData(dataArray)
            const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
            setAudioLevel(average / 255)
            
            if (state === 'listening') {
              animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
            }
          }
          
          updateAudioLevel()
        } catch (error) {
          console.error('Error accessing microphone:', error)
        }
      }
      
      startAudioVisualization()
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [state, isRecording])

  return { audioLevel }
}

export function useMorphAnimation(state: ConversationalBubbleState) {
  const [morphPhase, setMorphPhase] = useState(0)

  useEffect(() => {
    if (state === 'idle') {
      const interval = setInterval(() => {
        setMorphPhase(prev => (prev + 1) % 4)
      }, 3750)
      
      return () => clearInterval(interval)
    }
  }, [state])

  const getMorphedBorderRadius = () => {
    if (state !== 'idle') return '50%'
    
    const morphShapes = [
      '50% 50% 50% 50% / 50% 50% 50% 50%',
      '51.5% 48.5% 50% 50% / 48.5% 51.5% 50% 50%',
      '50% 50% 48.5% 51.5% / 50% 50% 51.5% 48.5%',
      '48.5% 51.5% 50% 50% / 51.5% 48.5% 50% 50%',
    ]
    
    return morphShapes[morphPhase]
  }

  const getMorphedClipPath = () => {
    if (state !== 'idle') return 'none'
    
    const morphClipPaths = [
      'ellipse(50% 50% at 50% 50%)',
      'ellipse(52% 48% at 49% 51%)',
      'ellipse(48% 52% at 51% 49%)',
      'ellipse(51% 49% at 50% 50%)',
    ]
    
    return morphClipPaths[morphPhase]
  }

  return { getMorphedBorderRadius, getMorphedClipPath }
}