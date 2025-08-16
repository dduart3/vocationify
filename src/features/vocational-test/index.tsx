import { useState, useEffect } from 'react'
import { VoiceTestController } from './components/voice-test-controller'
import { ChatInterface } from './components/chat-interface'
import { InteractionToggle } from './components/interaction-toggle'
import { ResumeSessionBanner } from './components/resume-session-banner'
import { useIncompleteSession } from './hooks/use-incomplete-session'
import { useSearch } from '@tanstack/react-router'
import { 
  IconSparkles, 
} from '@tabler/icons-react'

type TestState = 'idle' | 'conversational' | 'completed'

export function VocationalTest() {
  const [interactionMode, setInteractionMode] = useState<'voice' | 'chat'>('voice')
  const [isTestCompleted, setIsTestCompleted] = useState(false)
  const [hasConversationStarted, setHasConversationStarted] = useState(false)
  const [testState, setTestState] = useState<TestState>('idle')
  const [completedSessionId, setCompletedSessionId] = useState<string | null>(null)
  const [showResumePrompt, setShowResumePrompt] = useState(false)
  const [resumingSessionId, setResumingSessionId] = useState<string | null>(null)
  
  // Get URL search params to check if we're resuming a session
  const search = useSearch({ from: '/_authenticated/vocational-test/' }) as { sessionId?: string }
  const urlSessionId = search?.sessionId
  
  // Check for incomplete sessions
  const { data: incompleteSession, isLoading: isLoadingIncomplete } = useIncompleteSession()

  // Handle session resumption
  useEffect(() => {
    // If we have a sessionId in URL, we're resuming a session
    if (urlSessionId) {
      setResumingSessionId(urlSessionId)
      setTestState('conversational')
      setHasConversationStarted(true)
      return
    }

    // If we have an incomplete session and no conversation has started, show resume prompt
    if (incompleteSession && !hasConversationStarted && !isTestCompleted) {
      setShowResumePrompt(true)
    }
  }, [incompleteSession, urlSessionId, hasConversationStarted, isTestCompleted])

  const handleResumeSession = () => {
    if (incompleteSession) {
      setResumingSessionId(incompleteSession.id)
      setTestState('conversational')
      setHasConversationStarted(true)
      setShowResumePrompt(false)
    }
  }

  const handleDismissResume = () => {
    setShowResumePrompt(false)
  }

  const handleTestComplete = (sessionId: string) => {
    setIsTestCompleted(true)
    setTestState('completed')
    setCompletedSessionId(sessionId)
    console.log('Test completed:', sessionId)
  }

  const handleConversationStart = () => {
    setHasConversationStarted(true)
    setTestState('conversational')
  }

  return (
    <div className="flex-1 min-h-screen relative overflow-hidden">
      {/* Resume Session Banner */}
      {showResumePrompt && incompleteSession && (
        <ResumeSessionBanner
          session={incompleteSession}
          onResume={handleResumeSession}
          onDismiss={handleDismissResume}
        />
      )}

      {/* Background remains the same */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.15),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative">
              {/* Subtle animated background */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-96 h-16 bg-gradient-to-r from-blue-500/8 via-purple-500/10 to-indigo-500/8 blur-3xl rounded-full animate-pulse" />
              
              <h1 className="relative text-6xl md:text-7xl font-black mb-4 leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-50 to-purple-50 bg-clip-text text-transparent">
                  Test Vocacional
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  con IA
                </span>
              </h1>
            </div>

            {/* Interaction Mode Toggle - Show only when conversation has started but not completed */}
            {hasConversationStarted && !isTestCompleted && (
              <InteractionToggle 
                mode={interactionMode} 
                onModeChange={setInteractionMode} 
              />
            )}
          </div>

          {/* Main Test Area */}
          {interactionMode === 'voice' ? (
            <VoiceTestController 
              onTestComplete={handleTestComplete} 
              onConversationStart={handleConversationStart}
              testState={testState}
              setTestState={setTestState}
              completedSessionId={completedSessionId}
              resumingSessionId={resumingSessionId}
              hasIncompleteSession={!!incompleteSession && !urlSessionId}
            />
          ) : (
            /* Chat Interface */
            <div className="flex justify-center">
              <ChatInterface 
                onSwitchToVoice={() => setInteractionMode('voice')}
                isVoiceAvailable={true}
                onTestComplete={handleTestComplete}
                onConversationStart={handleConversationStart}
                testState={testState}
                setTestState={setTestState}
                resumingSessionId={resumingSessionId}
                hasIncompleteSession={!!incompleteSession && !urlSessionId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

