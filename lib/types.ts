// ============================================
// API TYPES
// ============================================

// Common Types
export interface ConversationEntry {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface CollectedData {
  name?: string
  age?: number
  height?: string
  weight?: number
  is_pregnant_breastfeeding?: boolean
  high_risk_conditions?: string[]
  current_medical_conditions?: string
  currently_on_glp1?: boolean
  other_medications?: string
  allergies?: string
  weight_loss_goal?: string
  interested_medication?: string
  bmi?: number
  [key: string]: any
}

// ============================================
// CHAT TYPES
// ============================================

export interface ChatRequest {
  message: string
  conversation_history: ConversationEntry[]
  collected_data: CollectedData
  session_id?: string
}

export interface ChatResponse {
  response: string
  collected_data: CollectedData
  completion_percentage: number
  is_complete: boolean
  next_expected_field?: string | null
  conversation_history: ConversationEntry[]
  session_id?: string
  processing_time?: number
}

export interface StartConversationResponse {
  response: string
  collected_data: CollectedData
  conversation_history: ConversationEntry[]
  session_id: string
  processing_time: number
}

// ============================================
// ELIGIBILITY TYPES
// ============================================

export interface BMIAssessment {
  value: number
  category: string
  meets_criteria: boolean
  score: number
}

export interface DiabetesStatus {
  has_type2_diabetes: boolean
  controlled?: boolean
  score: number
}

export interface Comorbidities {
  present: string[]
  cardiovascular_risk?: string
  score: number
}

export interface WeightLossGoal {
  realistic: boolean
  score: number
}

export interface Contraindications {
  has_contraindications: boolean
  violations: string[]
}

export interface ClinicalAssessment {
  bmi: BMIAssessment
  diabetes_status: DiabetesStatus
  comorbidities: Comorbidities
  weight_loss_goal: WeightLossGoal
  contraindications: Contraindications
}

export interface DecisionSupport {
  recommendation: string
  clinical_reasoning: string[]
  key_considerations?: string[]
}

export interface PhysicianReview {
  review_required: boolean
  review_level?: string
  focus_areas: string[]
}

export interface Constraint {
  constraint: string
  status: string
  action_required?: string
}

export interface Constraints {
  hard_constraints_passed: boolean
  soft_constraints: Constraint[]
}

export interface EligibilityResponse {
  success: boolean
  timestamp: string
  session_id?: string
  eligibility_status: 'ELIGIBLE' | 'CONDITIONALLY_ELIGIBLE' | 'INELIGIBLE'
  eligibility_score: number
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
  clinical_assessment: ClinicalAssessment
  decision_support: DecisionSupport
  physician_review: PhysicianReview
  constraints: Constraints
  processing_time: number
  engine_version: string
}

export interface ContraindicationCheckResponse {
  has_contraindications: boolean
  contraindications: string[]
  safe_to_proceed: boolean
  recommendation: string
}

export interface EligibilityCriteria {
  hard_constraints: {
    description: string
    criteria: string[]
  }
  scoring_criteria: {
    total_points: number
    breakdown: Record<string, { points: number; description: string }>
  }
  thresholds: Record<string, string>
  clinical_guidelines: string[]
}

// ============================================
// MEDICATION TYPES
// ============================================

export interface MedicationScore {
  rank: number
  medication: string
  total_score: number
  efficacy_score: number
  safety_score: number
  convenience_score: number
  cost_score: number
  suitability_score: number
  strengths: string[]
  weaknesses: string[]
  rationale: string
}

export interface FollowUpVisit {
  timepoint: string
  purpose: string
  tests: string[]
}

export interface SideEffect {
  symptom: string
  onset: string
  severity: string
  management: string
}

export interface SeriousSideEffect {
  symptom: string
  indicates: string
  action: string
}

export interface DrugInteraction {
  drug: string
  interaction: string
  recommendation: string
}

export interface TitrationSchedule {
  [key: string]: string
}

export interface Prescription {
  patient_name: string
  date: string
  medication_name: string
  starting_dose: string
  target_dose: string
  titration_schedule: Array<{
    weeks: string
    dose: string
  }>
  route: string
  frequency: string
  indication: string
  dosing_instructions: string
  administration_technique: string[]
  baseline_labs: string[]
  follow_up_visits: FollowUpVisit[]
  monitoring_parameters: string[]
  common_side_effects: SideEffect[]
  serious_side_effects: SeriousSideEffect[]
  drug_interactions: DrugInteraction[]
  lifestyle_modifications: string[]
  dietary_recommendations: string[]
  expected_outcomes: {
    weight_loss: string
    glycemic_control: string
    blood_pressure: string
    timeline: string
  }
  when_to_contact_physician: string[]
  cbr_metadata: {
    case_based_rationale: string
    similarity_score: number
    adaptations_made: string[]
    selected_by: string
  }
}

export interface CompleteRecommendationResponse {
  success: boolean
  timestamp: string
  session_id?: string
  processing_time: number
  eligibility: EligibilityResponse
  recommended_medication?: MedicationScore | null
  alternative_medications: MedicationScore[]
  prescription?: Prescription | null
  next_steps: string[]
  physician_review_required: boolean
}

// ============================================
// STATE TYPES
// ============================================

export interface AppState {
  // Chat state
  messages: ConversationEntry[]
  collectedData: CollectedData
  sessionId?: string
  completionPercentage: number
  isConversationComplete: boolean
  nextExpectedField?: string

  // Eligibility state
  eligibility?: EligibilityResponse
  eligibilityLoading: boolean
  eligibilityError?: string

  // Recommendation state
  recommendation?: CompleteRecommendationResponse
  recommendationLoading: boolean
  recommendationError?: string

  // UI state
  currentStep: 'chat' | 'eligibility' | 'recommendation' | 'complete'
  loading: boolean
  error?: string

  // Sidebar data
  medicalFlags: string[]
}
