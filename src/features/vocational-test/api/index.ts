import axios from 'axios'
import type { 
  TestSession, 
  Question, 
  TestResponse, 
  TestResults, 
  Career, 
  RiasecScore,
  ConversationalSession,
  ConversationResponse,
  SessionResults 
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Query Keys
export const queryKeys = {
  health: ['health'] as const,
  sessions: {
    all: ['sessions'] as const,
    detail: (sessionId: string) => ['sessions', sessionId] as const,
  },
  questions: {
    next: (sessionId: string) => ['questions', 'next', sessionId] as const,
  },
  results: {
    basic: (sessionId: string) => ['results', sessionId] as const,
    detailed: (sessionId: string) => ['results', 'detailed', sessionId] as const,
  },
  careers: {
    all: ['careers'] as const,
    detail: (careerId: string) => ['careers', careerId] as const,
    recommendations: (scores: RiasecScore) => ['careers', 'recommendations', scores] as const,
  },
  conversations: {
    session: (sessionId: string) => ['conversations', 'session', sessionId] as const,
    results: (sessionId: string) => ['conversations', 'results', sessionId] as const,
    history: (sessionId: string) => ['conversations', 'history', sessionId] as const,
  },
} as const

// API Functions (used by TanStack Query hooks)
export const sessionAPI = {
  create: async (userId?: string): Promise<{ id: string; question: Question; progress: number }> => {
    const response = await api.post('/sessions', { user_id: userId })
    return response.data.data
  },

  get: async (sessionId: string): Promise<any> => {
    const response = await api.get(`/sessions/${sessionId}`)
    return response.data.data
  },

  complete: async (sessionId: string): Promise<TestSession> => {
    const response = await api.post(`/sessions/${sessionId}/complete`)
    return response.data.data
  },
}

export const questionAPI = {
  getNext: async (sessionId: string): Promise<Question | null> => {
    const response = await api.get(`/questions/${sessionId}/next`)
    return response.data.data
  },

  submitResponse: async (data: { sessionId: string } & TestResponse): Promise<any> => {
    const { sessionId, ...responseData } = data
    const response = await api.post('/questions/response', {
      session_id: sessionId,
      ...responseData,
    })
    return response.data.data
  },
}

export const resultsAPI = {
  get: async (sessionId: string): Promise<TestResults> => {
    const response = await api.get(`/results/${sessionId}`)
    return response.data.data
  },

  getDetailed: async (sessionId: string): Promise<any> => {
    const response = await api.get(`/results/${sessionId}/detailed`)
    return response.data.data
  },
}

export const careersAPI = {
  getRecommendations: async (data: { scores: RiasecScore; limit?: number }): Promise<Career[]> => {
    const response = await api.post('/careers/recommendations', data)
    return response.data.data
  },

  getAll: async (): Promise<Career[]> => {
    const response = await api.get('/careers')
    return response.data.data
  },

  getById: async (careerId: string): Promise<Career> => {
    const response = await api.get(`/careers/${careerId}`)
    return response.data.data
  },
}

export const healthAPI = {
  check: async (): Promise<any> => {
    const response = await api.get('/health')
    return response.data
  },
}

// Conversational API functions
export const conversationalAPI = {
  createSession: async (userId?: string): Promise<ConversationalSession> => {
    const response = await api.post('/conversations/sessions', { user_id: userId })
    return response.data.data
  },

  sendMessage: async (sessionId: string, message: string): Promise<ConversationResponse> => {
    const response = await api.post(`/conversations/sessions/${sessionId}/messages`, { message })
    return response.data.data
  },

  getSessionDetails: async (sessionId: string): Promise<any> => {
    const response = await api.get(`/conversations/sessions/${sessionId}`)
    return response.data.data
  },

  getResults: async (sessionId: string): Promise<SessionResults> => {
    const response = await api.get(`/conversations/sessions/${sessionId}/results`)
    return response.data.data
  },
}