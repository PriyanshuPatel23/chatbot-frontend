// ============================================
// API SERVICE - Complete GLP-1 API Integration
// ============================================

import {
  ChatResponse,
  StartConversationResponse,
  EligibilityResponse,
  ContraindicationCheckResponse,
  EligibilityCriteria,
  CompleteRecommendationResponse,
  CollectedData,
  ConversationEntry,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

// ============================================
// ERROR HANDLING
// ============================================

class APIError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(detail)
    this.name = 'APIError'
  }
}

async function handleAPIResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`

    if (contentType?.includes('application/json')) {
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorMessage
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText || errorMessage
      }
    }

    throw new APIError(response.status, errorMessage)
  }

  if (!contentType?.includes('application/json')) {
    throw new APIError(response.status, 'Invalid response format')
  }

  return response.json()
}

// ============================================
// CONVERSATION MANAGEMENT
// ============================================

export async function startConversation(): Promise<StartConversationResponse> {
  const response = await fetch(`${API_BASE_URL}/start-conversation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleAPIResponse<StartConversationResponse>(response)
}

export async function sendChatMessage(
  message: string,
  conversationHistory: ConversationEntry[],
  collectedData: CollectedData,
  sessionId?: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversation_history: conversationHistory,
      collected_data: collectedData,
      session_id: sessionId,
    }),
  })

  return handleAPIResponse<ChatResponse>(response)
}

// ============================================
// ELIGIBILITY ASSESSMENT
// ============================================

/**
 * DEPRECATED: Use getCompleteRecommendation() instead
 * This function now calls the complete recommendation endpoint
 * which handles eligibility + medication + prescription in one call
 */
export async function evaluateEligibility(
  collectedData: CollectedData,
  sessionId?: string
): Promise<CompleteRecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/recommendation/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collected_data: collectedData,
      session_id: sessionId,
    }),
  })

  return handleAPIResponse<CompleteRecommendationResponse>(response)
}

export async function checkContraindications(
  age: number,
  isPregnantBreastfeeding: boolean,
  highRiskConditions: string[],
  currentMedicalConditions: string
): Promise<ContraindicationCheckResponse> {
  const response = await fetch(`${API_BASE_URL}/eligibility/check-contraindications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      age,
      is_pregnant_breastfeeding: isPregnantBreastfeeding,
      high_risk_conditions: highRiskConditions,
      current_medical_conditions: currentMedicalConditions,
    }),
  })

  return handleAPIResponse<ContraindicationCheckResponse>(response)
}

export async function getEligibilityCriteria(): Promise<EligibilityCriteria> {
  const response = await fetch(`${API_BASE_URL}/eligibility/criteria`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleAPIResponse<EligibilityCriteria>(response)
}

// ============================================
// MEDICATION RECOMMENDATION
// ============================================

export async function getCompleteRecommendation(
  collectedData: CollectedData,
  sessionId?: string
): Promise<CompleteRecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/recommendation/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collected_data: collectedData,
      session_id: sessionId,
    }),
  })

  return handleAPIResponse<CompleteRecommendationResponse>(response)
}

export async function getPipelineInfo(): Promise<{
  pipeline: string
  version: string
  update: string
  stages: Array<{ stage: number; name: string; method: string; output: string }>
  safety_features: string[]
}> {
  const response = await fetch(`${API_BASE_URL}/recommendation/pipeline-info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleAPIResponse(response)
}

// ============================================
// HEALTH & UTILITY
// ============================================

export async function checkHealth(): Promise<{ status: string; model: string }> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
  })

  return handleAPIResponse(response)
}

// ============================================
// EXPORT ALL FOR CONVENIENCE
// ============================================

export const api = {
  // Conversation
  startConversation,
  sendChatMessage,

  // Eligibility
  evaluateEligibility,
  checkContraindications,
  getEligibilityCriteria,

  // Recommendation
  getCompleteRecommendation,
  getPipelineInfo,

  // Utility
  checkHealth,
}

export type { APIError }
export { handleAPIResponse }
