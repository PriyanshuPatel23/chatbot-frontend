export type Role = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: Role
  text: string
  time?: number
  metadata?: Record<string, unknown>
}

export interface ChatState {
  messages: ChatMessage[]
  assessmentComplete: boolean
  eligibilityStatus?: 'eligible' | 'ineligible' | 'pending'
  patientData: {
    weight?: number
    height?: number
    bmi?: number
    age?: number
    conditions: string[]
    medications: string[]
  }
}
