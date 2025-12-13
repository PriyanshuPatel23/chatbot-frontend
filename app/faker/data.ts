/**
 * GLP-1 Medication Prescription - Sequential Question Flow
 *
 * This file contains the structured questionnaire for GLP-1 medication eligibility assessment.
 * Questions are asked sequentially, and answers are stored for further processing.
 */

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  question: string
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'height' | 'weight'
  required: boolean
  placeholder?: string
  unit?: string
  options?: QuestionOption[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  helperText?: string
  category: 'personal' | 'medical' | 'lifestyle' | 'medications' | 'goals'
}

export interface QuestionnaireData {
  categories: {
    personal: Question[]
    medical: Question[]
    lifestyle: Question[]
    medications: Question[]
    goals: Question[]
  }
}

/**
 * Complete GLP-1 Prescription Questionnaire
 * Questions are organized by category and asked sequentially
 */
export const glp1Questionnaire: QuestionnaireData = {
  categories: {
    // PERSONAL INFORMATION
    personal: [
      {
        id: 'fullName',
        question: "What is your full name?",
        type: 'text',
        required: true,
        placeholder: 'e.g., John Smith',
        category: 'personal'
      },
      {
        id: 'age',
        question: "How old are you?",
        type: 'number',
        required: true,
        placeholder: 'e.g., 35',
        unit: 'years',
        validation: {
          min: 18,
          max: 120,
          message: 'You must be at least 18 years old to be eligible for GLP-1 treatment'
        },
        helperText: 'GLP-1 medications are approved for adults 18 years and older',
        category: 'personal'
      },
      {
        id: 'gender',
        question: "What is your biological sex?",
        type: 'select',
        required: true,
        options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Prefer not to say' }
        ],
        helperText: 'This information helps us assess potential interactions and contraindications',
        category: 'personal'
      },
      {
        id: 'pregnant',
        question: "Are you currently pregnant, planning to become pregnant, or breastfeeding?",
        type: 'boolean',
        required: true,
        helperText: 'GLP-1 medications are not recommended during pregnancy or breastfeeding',
        category: 'personal'
      },
      {
        id: 'height',
        question: "What is your height?",
        type: 'height',
        required: true,
        placeholder: 'e.g., 170',
        unit: 'cm',
        validation: {
          min: 100,
          max: 250,
          message: 'Please enter a valid height between 100-250 cm'
        },
        helperText: 'Used to calculate your BMI (Body Mass Index)',
        category: 'personal'
      },
      {
        id: 'weight',
        question: "What is your current weight?",
        type: 'weight',
        required: true,
        placeholder: 'e.g., 85',
        unit: 'kg',
        validation: {
          min: 30,
          max: 300,
          message: 'Please enter a valid weight between 30-300 kg'
        },
        helperText: 'Your current weight helps determine eligibility and dosing',
        category: 'personal'
      }
    ],

    // MEDICAL HISTORY & CONDITIONS
    medical: [
      {
        id: 'diagnosedConditions',
        question: "Have you been diagnosed with any of the following conditions? (Select all that apply)",
        type: 'multiselect',
        required: true,
        options: [
          { value: 'type2Diabetes', label: 'Type 2 Diabetes' },
          { value: 'prediabetes', label: 'Prediabetes' },
          { value: 'obesity', label: 'Obesity' },
          { value: 'hypertension', label: 'High Blood Pressure (Hypertension)' },
          { value: 'highCholesterol', label: 'High Cholesterol' },
          { value: 'cardiovascular', label: 'Cardiovascular Disease' },
          { value: 'fatty_liver', label: 'Fatty Liver Disease (NAFLD)' },
          { value: 'pcos', label: 'PCOS (Polycystic Ovary Syndrome)' },
          { value: 'sleep_apnea', label: 'Sleep Apnea' },
          { value: 'none', label: 'None of the above' }
        ],
        helperText: 'GLP-1 medications are approved for type 2 diabetes and obesity management',
        category: 'medical'
      },
      {
        id: 'diabetesType',
        question: "If you have diabetes, what type?",
        type: 'select',
        required: false,
        options: [
          { value: 'type1', label: 'Type 1 Diabetes' },
          { value: 'type2', label: 'Type 2 Diabetes' },
          { value: 'prediabetes', label: 'Prediabetes' },
          { value: 'gestational', label: 'Gestational Diabetes (past)' },
          { value: 'none', label: 'I do not have diabetes' }
        ],
        helperText: 'GLP-1s are primarily for Type 2 Diabetes, not Type 1',
        category: 'medical'
      },
      {
        id: 'lastA1C',
        question: "What was your most recent HbA1c (A1C) level? (If known)",
        type: 'number',
        required: false,
        placeholder: 'e.g., 7.5',
        unit: '%',
        validation: {
          min: 4,
          max: 15,
          message: 'Please enter a valid A1C between 4-15%'
        },
        helperText: 'A1C measures average blood sugar over 2-3 months. Normal is below 5.7%',
        category: 'medical'
      },
      {
        id: 'thyroidDisease',
        question: "Do you have any thyroid disease or family history of medullary thyroid cancer?",
        type: 'boolean',
        required: true,
        helperText: 'GLP-1 medications have contraindications for certain thyroid conditions',
        category: 'medical'
      },
      {
        id: 'pancreatitisHistory',
        question: "Have you ever had pancreatitis (inflammation of the pancreas)?",
        type: 'boolean',
        required: true,
        helperText: 'History of pancreatitis may be a contraindication for GLP-1 therapy',
        category: 'medical'
      },
      {
        id: 'kidneyDisease',
        question: "Do you have kidney disease or impaired kidney function?",
        type: 'select',
        required: true,
        options: [
          { value: 'none', label: 'No kidney issues' },
          { value: 'mild', label: 'Mild kidney disease (Stage 1-2)' },
          { value: 'moderate', label: 'Moderate kidney disease (Stage 3)' },
          { value: 'severe', label: 'Severe kidney disease (Stage 4-5)' },
          { value: 'dialysis', label: 'On dialysis' },
          { value: 'unknown', label: 'Not sure / Not tested' }
        ],
        helperText: 'Some GLP-1 medications require dose adjustment for kidney disease',
        category: 'medical'
      },
      {
        id: 'gastroparesis',
        question: "Have you been diagnosed with gastroparesis (delayed stomach emptying)?",
        type: 'boolean',
        required: true,
        helperText: 'GLP-1s slow gastric emptying, which may worsen gastroparesis',
        category: 'medical'
      },
      {
        id: 'allergies',
        question: "Do you have any known drug allergies or allergies to GLP-1 medications?",
        type: 'text',
        required: false,
        placeholder: 'e.g., Penicillin, Semaglutide',
        helperText: 'List any medications you have had allergic reactions to',
        category: 'medical'
      }
    ],

    // LIFESTYLE & HABITS
    lifestyle: [
      {
        id: 'weightLossAttempts',
        question: "Have you tried to lose weight before? If yes, what methods have you tried?",
        type: 'multiselect',
        required: true,
        options: [
          { value: 'diet', label: 'Diet changes' },
          { value: 'exercise', label: 'Exercise programs' },
          { value: 'counseling', label: 'Nutritional counseling' },
          { value: 'commercial', label: 'Commercial programs (Weight Watchers, etc.)' },
          { value: 'medications', label: 'Weight loss medications' },
          { value: 'surgery', label: 'Bariatric surgery' },
          { value: 'none', label: 'No previous attempts' }
        ],
        helperText: 'Understanding your weight loss history helps personalize treatment',
        category: 'lifestyle'
      },
      {
        id: 'exerciseFrequency',
        question: "How often do you currently exercise?",
        type: 'select',
        required: true,
        options: [
          { value: 'none', label: 'No regular exercise' },
          { value: '1-2', label: '1-2 times per week' },
          { value: '3-4', label: '3-4 times per week' },
          { value: '5+', label: '5 or more times per week' },
          { value: 'daily', label: 'Daily' }
        ],
        helperText: 'GLP-1 treatment works best combined with lifestyle modifications',
        category: 'lifestyle'
      },
      {
        id: 'dietPattern',
        question: "Which best describes your current eating pattern?",
        type: 'select',
        required: true,
        options: [
          { value: 'standard', label: 'Standard mixed diet' },
          { value: 'lowCarb', label: 'Low carb / Keto' },
          { value: 'mediterranean', label: 'Mediterranean diet' },
          { value: 'vegetarian', label: 'Vegetarian' },
          { value: 'vegan', label: 'Vegan' },
          { value: 'intermittent', label: 'Intermittent fasting' },
          { value: 'other', label: 'Other' }
        ],
        category: 'lifestyle'
      },
      {
        id: 'smokingStatus',
        question: "Do you currently smoke or use tobacco products?",
        type: 'select',
        required: true,
        options: [
          { value: 'never', label: 'Never smoked' },
          { value: 'former', label: 'Former smoker' },
          { value: 'current', label: 'Current smoker' },
          { value: 'vape', label: 'Vape/E-cigarettes only' }
        ],
        category: 'lifestyle'
      },
      {
        id: 'alcoholUse',
        question: "How often do you consume alcohol?",
        type: 'select',
        required: true,
        options: [
          { value: 'none', label: 'Never / Rarely' },
          { value: 'occasional', label: 'Occasionally (1-2 drinks per week)' },
          { value: 'moderate', label: 'Moderate (3-7 drinks per week)' },
          { value: 'heavy', label: 'Heavy (8+ drinks per week)' }
        ],
        helperText: 'Alcohol can affect blood sugar and interact with diabetes medications',
        category: 'lifestyle'
      }
    ],

    // CURRENT MEDICATIONS
    medications: [
      {
        id: 'currentMedications',
        question: "Are you currently taking any medications? Please list all prescription and over-the-counter medications.",
        type: 'text',
        required: true,
        placeholder: 'e.g., Metformin 1000mg twice daily, Lisinopril 10mg daily',
        helperText: 'Include vitamins, supplements, and herbal products',
        category: 'medications'
      },
      {
        id: 'diabetesMedications',
        question: "Are you currently taking any diabetes medications? (Select all that apply)",
        type: 'multiselect',
        required: false,
        options: [
          { value: 'metformin', label: 'Metformin' },
          { value: 'sulfonylureas', label: 'Sulfonylureas (Glipizide, Glyburide)' },
          { value: 'insulin', label: 'Insulin' },
          { value: 'glp1_current', label: 'GLP-1 agonist (Ozempic, Trulicity, etc.)' },
          { value: 'sglt2', label: 'SGLT2 inhibitor (Jardiance, Farxiga)' },
          { value: 'dpp4', label: 'DPP-4 inhibitor (Januvia, Tradjenta)' },
          { value: 'other', label: 'Other diabetes medication' },
          { value: 'none', label: 'None' }
        ],
        helperText: 'Current diabetes medications may need adjustment when starting GLP-1',
        category: 'medications'
      },
      {
        id: 'insulinType',
        question: "If you take insulin, what type? (Select all that apply)",
        type: 'multiselect',
        required: false,
        options: [
          { value: 'basal', label: 'Basal/Long-acting (Lantus, Levemir, Tresiba)' },
          { value: 'bolus', label: 'Bolus/Rapid-acting (Humalog, Novolog)' },
          { value: 'premix', label: 'Pre-mixed insulin' },
          { value: 'pump', label: 'Insulin pump' },
          { value: 'none', label: 'I do not take insulin' }
        ],
        category: 'medications'
      },
      {
        id: 'bloodPressureMeds',
        question: "Are you taking blood pressure medications?",
        type: 'boolean',
        required: true,
        category: 'medications'
      },
      {
        id: 'cholesterolMeds',
        question: "Are you taking cholesterol medications (statins)?",
        type: 'boolean',
        required: true,
        category: 'medications'
      },
      {
        id: 'previousGLP1',
        question: "Have you previously taken any GLP-1 medications?",
        type: 'select',
        required: true,
        options: [
          { value: 'never', label: 'Never taken GLP-1 medication' },
          { value: 'ozempic', label: 'Ozempic (Semaglutide weekly)' },
          { value: 'wegovy', label: 'Wegovy (Semaglutide weekly - weight loss)' },
          { value: 'trulicity', label: 'Trulicity (Dulaglutide)' },
          { value: 'victoza', label: 'Victoza (Liraglutide daily)' },
          { value: 'saxenda', label: 'Saxenda (Liraglutide daily - weight loss)' },
          { value: 'mounjaro', label: 'Mounjaro (Tirzepatide)' },
          { value: 'other', label: 'Other GLP-1 medication' }
        ],
        helperText: 'Previous GLP-1 experience helps determine the best medication choice',
        category: 'medications'
      },
      {
        id: 'previousGLP1Response',
        question: "If you took a GLP-1 medication before, what was your experience?",
        type: 'select',
        required: false,
        options: [
          { value: 'effective', label: 'Effective - good results' },
          { value: 'sideEffects', label: 'Stopped due to side effects' },
          { value: 'noEffect', label: 'Did not see results' },
          { value: 'cost', label: 'Stopped due to cost' },
          { value: 'other', label: 'Other reason' }
        ],
        category: 'medications'
      }
    ],

    // TREATMENT GOALS & EXPECTATIONS
    goals: [
      {
        id: 'primaryGoal',
        question: "What is your primary goal for GLP-1 treatment?",
        type: 'select',
        required: true,
        options: [
          { value: 'bloodSugar', label: 'Better blood sugar control' },
          { value: 'weightLoss', label: 'Weight loss' },
          { value: 'both', label: 'Both blood sugar control and weight loss' },
          { value: 'cardiovascular', label: 'Reduce cardiovascular risk' },
          { value: 'a1c', label: 'Lower A1C level' },
          { value: 'other', label: 'Other health goals' }
        ],
        category: 'goals'
      },
      {
        id: 'weightLossGoal',
        question: "How much weight would you like to lose?",
        type: 'number',
        required: false,
        placeholder: 'e.g., 10',
        unit: 'kg',
        validation: {
          min: 1,
          max: 100,
          message: 'Please enter a realistic weight loss goal'
        },
        helperText: 'Realistic goal: 5-15% of current body weight over 6-12 months',
        category: 'goals'
      },
      {
        id: 'timeline',
        question: "What is your preferred timeline for starting treatment?",
        type: 'select',
        required: true,
        options: [
          { value: 'immediately', label: 'As soon as possible' },
          { value: 'within_month', label: 'Within 1 month' },
          { value: 'within_3months', label: 'Within 3 months' },
          { value: 'exploring', label: 'Just exploring options' }
        ],
        category: 'goals'
      },
      {
        id: 'injectionComfort',
        question: "How comfortable are you with self-injecting medication weekly?",
        type: 'select',
        required: true,
        options: [
          { value: 'comfortable', label: 'Very comfortable - I already do injections' },
          { value: 'willing', label: 'Willing to learn' },
          { value: 'concerned', label: 'Somewhat concerned but willing to try' },
          { value: 'uncomfortable', label: 'Very uncomfortable with needles' }
        ],
        helperText: 'Most GLP-1 medications are weekly injections with small needles',
        category: 'goals'
      },
      {
        id: 'costConcern',
        question: "Do you have insurance coverage for prescription medications?",
        type: 'select',
        required: true,
        options: [
          { value: 'full', label: 'Yes - full coverage' },
          { value: 'partial', label: 'Yes - partial coverage / high copay' },
          { value: 'none', label: 'No insurance coverage' },
          { value: 'unknown', label: 'Not sure about coverage' }
        ],
        helperText: 'GLP-1 medications can be expensive without insurance coverage',
        category: 'goals'
      },
      {
        id: 'additionalInfo',
        question: "Is there anything else you would like us to know about your health or treatment goals?",
        type: 'text',
        required: false,
        placeholder: 'Any additional information that might be helpful...',
        category: 'goals'
      }
    ]
  }
}

/**
 * Get all questions in sequential order
 */
export function getAllQuestionsSequential(): Question[] {
  return [
    ...glp1Questionnaire.categories.personal,
    ...glp1Questionnaire.categories.medical,
    ...glp1Questionnaire.categories.lifestyle,
    ...glp1Questionnaire.categories.medications,
    ...glp1Questionnaire.categories.goals
  ]
}

/**
 * Get question by ID
 */
export function getQuestionById(id: string): Question | undefined {
  const allQuestions = getAllQuestionsSequential()
  return allQuestions.find(q => q.id === id)
}

/**
 * Get next question based on current answers
 */
export function getNextQuestion(answers: Record<string, unknown>): Question | null {
  const allQuestions = getAllQuestionsSequential()

  // Find first unanswered required question
  for (const question of allQuestions) {
    // Skip conditional questions
    if (question.id === 'diabetesType' && !shouldAskDiabetesType(answers)) continue
    if (question.id === 'insulinType' && !shouldAskInsulinType(answers)) continue
    if (question.id === 'previousGLP1Response' && !shouldAskPreviousGLP1Response(answers)) continue
    if (question.id === 'weightLossGoal' && !shouldAskWeightLossGoal(answers)) continue

    // Check if question is answered
    if (question.required && !(question.id in answers)) {
      return question
    }
  }

  return null // All required questions answered
}

/**
 * Conditional question logic
 */
function shouldAskDiabetesType(answers: Record<string, unknown>): boolean {
  const conditions = answers.diagnosedConditions as string[] | undefined
  return conditions?.includes('type2Diabetes') || conditions?.includes('prediabetes') || false
}

function shouldAskInsulinType(answers: Record<string, unknown>): boolean {
  const meds = answers.diabetesMedications as string[] | undefined
  return meds?.includes('insulin') || false
}

function shouldAskPreviousGLP1Response(answers: Record<string, unknown>): boolean {
  const previous = answers.previousGLP1 as string | undefined
  return previous !== 'never' && previous !== undefined
}

function shouldAskWeightLossGoal(answers: Record<string, unknown>): boolean {
  const goal = answers.primaryGoal as string | undefined
  return goal === 'weightLoss' || goal === 'both' || false
}

/**
 * Calculate completion percentage
 */
export function getCompletionPercentage(answers: Record<string, unknown>): number {
  const allQuestions = getAllQuestionsSequential()
  const requiredQuestions = allQuestions.filter(q => q.required)
  const answeredRequired = requiredQuestions.filter(q => q.id in answers)

  return Math.round((answeredRequired.length / requiredQuestions.length) * 100)
}

/**
 * Validate answer for a question
 */
export function validateAnswer(question: Question, answer: unknown): { valid: boolean; error?: string } {
  if (question.required && (answer === null || answer === undefined || answer === '')) {
    return { valid: false, error: 'This question is required' }
  }

  if (question.type === 'number' && typeof answer === 'number') {
    if (question.validation?.min !== undefined && answer < question.validation.min) {
      return { valid: false, error: question.validation.message || `Value must be at least ${question.validation.min}` }
    }
    if (question.validation?.max !== undefined && answer > question.validation.max) {
      return { valid: false, error: question.validation.message || `Value must be at most ${question.validation.max}` }
    }
  }

  return { valid: true }
}

/**
 * Get category progress
 */
export function getCategoryProgress(answers: Record<string, unknown>): Record<string, number> {
  const progress: Record<string, number> = {}

  for (const [category, questions] of Object.entries(glp1Questionnaire.categories)) {
    const total = questions.filter(q => q.required).length
    const answered = questions.filter(q => q.required && q.id in answers).length
    progress[category] = total > 0 ? Math.round((answered / total) * 100) : 100
  }

  return progress
}
