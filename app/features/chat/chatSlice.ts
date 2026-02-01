import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  ConversationEntry,
  CollectedData,
  EligibilityResponse,
  CompleteRecommendationResponse,
} from '../../../lib/types'

interface ChatState {
  // Conversation State
  messages: ConversationEntry[]
  collectedData: CollectedData
  sessionId?: string
  completionPercentage: number
  isConversationComplete: boolean
  nextExpectedField?: string

  // Eligibility State
  eligibility?: EligibilityResponse
  eligibilityLoading: boolean
  eligibilityError?: string

  // Recommendation State
  recommendation?: CompleteRecommendationResponse
  recommendationLoading: boolean
  recommendationError?: string

  // UI State
  currentStep: 'chat' | 'eligibility' | 'recommendation' | 'complete'
  loading: boolean
  error?: string | null

  // Additional data
  medicalFlags: string[]
}

const initialState: ChatState = {
  messages: [],
  collectedData: {},
  sessionId: undefined,
  completionPercentage: 0,
  isConversationComplete: false,
  nextExpectedField: undefined,
  eligibilityLoading: false,
  recommendationLoading: false,
  currentStep: 'chat',
  loading: false,
  error: null,
  medicalFlags: [],
}

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // ============================================
    // Chat Actions
    // ============================================
    addMessage(state, action: PayloadAction<ConversationEntry>) {
      state.messages.push(action.payload)
    },
    setMessages(state, action: PayloadAction<ConversationEntry[]>) {
      state.messages = action.payload
    },
    setSession(state, action: PayloadAction<string | undefined>) {
      state.sessionId = action.payload
    },
    mergeCollectedData(state, action: PayloadAction<Partial<CollectedData>>) {
      state.collectedData = { ...state.collectedData, ...action.payload }
    },
    setCollectedData(state, action: PayloadAction<CollectedData>) {
      state.collectedData = action.payload
    },
    setChatCompletion(state, action: PayloadAction<{
      completionPercentage: number
      isComplete: boolean
      nextExpectedField?: string
    }>) {
      state.completionPercentage = action.payload.completionPercentage
      state.isConversationComplete = action.payload.isComplete
      state.nextExpectedField = action.payload.nextExpectedField
    },

    // ============================================
    // Eligibility Actions
    // ============================================
    setEligibilityLoading(state, action: PayloadAction<boolean>) {
      state.eligibilityLoading = action.payload
    },
    setEligibility(state, action: PayloadAction<EligibilityResponse | CompleteRecommendationResponse>) {
      // Handle both EligibilityResponse and CompleteRecommendationResponse
      const payload = action.payload as any
      
      // If it has eligibility property, it's a CompleteRecommendationResponse
      if (payload.eligibility) {
        state.eligibility = payload.eligibility
        state.recommendation = payload as CompleteRecommendationResponse
      } else {
        // Otherwise it's just an EligibilityResponse
        state.eligibility = payload
      }
      
      state.eligibilityLoading = false
      state.eligibilityError = undefined
      state.currentStep = 'eligibility'
    },
    setEligibilityError(state, action: PayloadAction<string>) {
      state.eligibilityError = action.payload
      state.eligibilityLoading = false
    },

    // ============================================
    // Recommendation Actions
    // ============================================
    setRecommendationLoading(state, action: PayloadAction<boolean>) {
      state.recommendationLoading = action.payload
    },
    setRecommendation(state, action: PayloadAction<CompleteRecommendationResponse>) {
      state.recommendation = action.payload
      state.recommendationLoading = false
      state.recommendationError = undefined
      state.currentStep = 'recommendation'
    },
    setRecommendationError(state, action: PayloadAction<string>) {
      state.recommendationError = action.payload
      state.recommendationLoading = false
    },

    // ============================================
    // General Actions
    // ============================================
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload || null
    },
    setCurrentStep(state, action: PayloadAction<'chat' | 'eligibility' | 'recommendation' | 'complete'>) {
      state.currentStep = action.payload
    },
    setMedicalFlags(state, action: PayloadAction<string[]>) {
      state.medicalFlags = action.payload
    },

    // ============================================
    // Full State Update
    // ============================================
    setChatStateFromServer(state, action: PayloadAction<Partial<ChatState>>) {
      Object.assign(state, action.payload)
    },
    reset(state) {
      Object.assign(state, initialState)
    },
    clearEligibility(state) {
      state.eligibility = undefined
      state.eligibilityError = undefined
      state.eligibilityLoading = false
    },
    clearRecommendation(state) {
      state.recommendation = undefined
      state.recommendationError = undefined
      state.recommendationLoading = false
    },
  }
})

export const {
  addMessage,
  setMessages,
  setSession,
  mergeCollectedData,
  setCollectedData,
  setChatCompletion,
  setEligibilityLoading,
  setEligibility,
  setEligibilityError,
  setRecommendationLoading,
  setRecommendation,
  setRecommendationError,
  setLoading,
  setError,
  setCurrentStep,
  setMedicalFlags,
  setChatStateFromServer,
  reset,
  clearEligibility,
  clearRecommendation,
} = slice.actions

export default slice.reducer
