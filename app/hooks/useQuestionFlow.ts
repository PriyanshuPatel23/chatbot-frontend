'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChatMessage } from '../lib/types'
import {
  getAllQuestionsSequential,
  getNextQuestion,
  getCompletionPercentage,
  getCategoryProgress,
  validateAnswer,
  Question
} from '../faker/data'

const STORAGE_KEY = 'glp1_patient_answers'
const MESSAGES_KEY = 'glp1_chat_messages'

interface QuestionFlowState {
  messages: ChatMessage[]
  currentQuestion: Question | null
  answers: Record<string, unknown>
  completionPercentage: number
  categoryProgress: Record<string, number>
  assessmentComplete: boolean
  eligibilityStatus?: 'eligible' | 'ineligible' | 'pending'
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

const calculateBMI = (weightKg?: number, heightCm?: number) => {
  if (!weightKg || !heightCm) return undefined
  const h = heightCm / 100
  const bmi = +(weightKg / (h * h)).toFixed(1)
  return bmi
}

const assessEligibility = (answers: Record<string, unknown>): 'eligible' | 'ineligible' | 'pending' => {
  const age = answers.age as number | undefined
  const weight = answers.weight as number | undefined
  const height = answers.height as number | undefined
  const pregnant = answers.pregnant as boolean | undefined
  const thyroidDisease = answers.thyroidDisease as boolean | undefined
  const pancreatitisHistory = answers.pancreatitisHistory as boolean | undefined
  const diagnosedConditions = answers.diagnosedConditions as string[] | undefined

  // Calculate BMI
  const bmi = calculateBMI(weight, height)

  // Not enough data yet
  if (!age || !bmi || !diagnosedConditions) return 'pending'

  // Age requirement
  if (age < 18) return 'ineligible'

  // Contraindications
  if (pregnant) return 'ineligible'
  if (thyroidDisease) return 'ineligible'
  if (pancreatitisHistory) return 'ineligible'

  // BMI requirement (27+ with comorbidity, or 30+ without)
  const hasQualifyingCondition = diagnosedConditions.some(c =>
    ['type2Diabetes', 'prediabetes', 'obesity', 'hypertension', 'cardiovascular'].includes(c)
  )

  if (bmi >= 30) return 'eligible'
  if (bmi >= 27 && hasQualifyingCondition) return 'eligible'

  return 'ineligible'
}

export function useQuestionFlow() {
  const [state, setState] = useState<QuestionFlowState>(() => {
    // Try to load from localStorage on init
    if (typeof window !== 'undefined') {
      const savedAnswers = localStorage.getItem(STORAGE_KEY)
      const savedMessages = localStorage.getItem(MESSAGES_KEY)

      if (savedAnswers && savedMessages) {
        const answers = JSON.parse(savedAnswers)
        const messages = JSON.parse(savedMessages)
        const nextQ = getNextQuestion(answers)
        const completion = getCompletionPercentage(answers)
        const categoryProg = getCategoryProgress(answers)
        const elig = assessEligibility(answers)

        return {
          messages,
          currentQuestion: nextQ,
          answers,
          completionPercentage: completion,
          categoryProgress: categoryProg,
          assessmentComplete: nextQ === null,
          eligibilityStatus: elig
        }
      }
    }

    // Initial state
    const firstQuestion = getAllQuestionsSequential()[0]
    const initialMessages: ChatMessage[] = [
      {
        id: uid(),
        role: 'system',
        text: "👋 Welcome to the GLP-1 Medication Eligibility Assessment.\n\nI'll ask you a series of questions to determine if you may be eligible for GLP-1 treatment. This assessment takes about 5-7 minutes.\n\nYour answers are saved locally and kept private. Let's get started!",
        time: Date.now()
      },
      {
        id: uid(),
        role: 'assistant',
        text: firstQuestion.question + (firstQuestion.helperText ? `\n\n💡 ${firstQuestion.helperText}` : ''),
        time: Date.now()
      }
    ]

    return {
      messages: initialMessages,
      currentQuestion: firstQuestion,
      answers: {},
      completionPercentage: 0,
      categoryProgress: {
        personal: 0,
        medical: 0,
        lifestyle: 0,
        medications: 0,
        goals: 0
      },
      assessmentComplete: false,
      eligibilityStatus: 'pending'
    }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Save to localStorage whenever answers change
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(state.answers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.answers))
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(state.messages))
    }
  }, [state.answers, state.messages])

  const pushMessage = useCallback((role: ChatMessage['role'], text: string, metadata?: Record<string, unknown>) => {
    const m: ChatMessage = {
      id: uid(),
      role,
      text,
      time: Date.now(),
      metadata
    }
    setState(prev => ({ ...prev, messages: [...prev.messages, m] }))
    return m
  }, [])

  const parseAnswer = useCallback((text: string, question: Question): unknown => {
    const lowerText = text.toLowerCase().trim()

    switch (question.type) {
      case 'number':
      case 'weight':
      case 'height': {
        const match = text.match(/\d+(?:\.\d+)?/)
        return match ? parseFloat(match[0]) : null
      }

      case 'boolean': {
        if (lowerText.includes('yes') || lowerText.includes('true') || lowerText === 'y') return true
        if (lowerText.includes('no') || lowerText.includes('false') || lowerText === 'n') return false
        return null
      }

      case 'select': {
        // Try to match option value or label
        const matchedOption = question.options?.find(opt =>
          lowerText.includes(opt.value.toLowerCase()) || lowerText.includes(opt.label.toLowerCase())
        )
        return matchedOption?.value || text
      }

      case 'multiselect': {
        // Parse comma-separated values or match multiple options
        const matched: string[] = []
        question.options?.forEach(opt => {
          if (lowerText.includes(opt.value.toLowerCase()) || lowerText.includes(opt.label.toLowerCase())) {
            matched.push(opt.value)
          }
        })
        return matched.length > 0 ? matched : [text]
      }

      case 'text':
      default:
        return text
    }
  }, [])

  const sendUserMessage = useCallback(
    async (text: string) => {
      if (!state.currentQuestion) return

      setError(null)
      setLoading(true)

      try {
        // Add user message
        pushMessage('user', text)

        // Simulate processing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500))

        // Parse answer
        const answer = parseAnswer(text, state.currentQuestion)

        // Validate answer
        const validation = validateAnswer(state.currentQuestion, answer)
        if (!validation.valid) {
          pushMessage('assistant', `⚠️ ${validation.error}\n\nPlease try again: ${state.currentQuestion.question}`)
          setLoading(false)
          return
        }

        // Store answer
        const newAnswers = {
          ...state.answers,
          [state.currentQuestion.id]: answer
        }

        // Calculate metrics
        const bmi = calculateBMI(
          newAnswers.weight as number | undefined,
          newAnswers.height as number | undefined
        )

        // Add BMI info if just calculated
        let metadata: Record<string, unknown> | undefined
        if (bmi && state.currentQuestion.id === 'height') {
          metadata = { bmi }
        }

        // Get next question
        const nextQ = getNextQuestion(newAnswers)
        const completion = getCompletionPercentage(newAnswers)
        const categoryProg = getCategoryProgress(newAnswers)
        const elig = assessEligibility(newAnswers)

        // Update state
        setState(prev => ({
          ...prev,
          answers: newAnswers,
          currentQuestion: nextQ,
          completionPercentage: completion,
          categoryProgress: categoryProg,
          assessmentComplete: nextQ === null,
          eligibilityStatus: elig
        }))

        // Send response
        if (nextQ) {
          // Show BMI if calculated
          if (bmi && state.currentQuestion.id === 'height') {
            pushMessage('assistant', `✅ Thank you! Your BMI is ${bmi}.\n\nNext question:`, { bmi })
          }

          // Ask next question
          pushMessage('assistant', nextQ.question + (nextQ.helperText ? `\n\n💡 ${nextQ.helperText}` : ''))
        } else {
          // Assessment complete
          const finalMessage = elig === 'eligible'
            ? `✅ **Assessment Complete!**\n\nBased on your responses, you appear to be preliminarily eligible for GLP-1 treatment.\n\n**Important:** This is not a prescription or medical diagnosis. A licensed healthcare provider must review your full medical history and conduct a proper evaluation.\n\nWould you like to:\n• Review your answers\n• Schedule a consultation with a healthcare provider\n• Learn more about GLP-1 medications`
            : `📋 **Assessment Complete**\n\nBased on current eligibility criteria, you may not qualify for GLP-1 treatment at this time.\n\nThis could be due to:\n• Age requirements (18+)\n• BMI criteria (27+ with comorbidity, or 30+)\n• Medical contraindications\n\nWould you like to:\n• Review your answers\n• Explore alternative treatment options\n• Speak with a healthcare provider about other possibilities`

          pushMessage('assistant', finalMessage, { bmi })
        }

        setLoading(false)
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg || 'Unknown error')
        pushMessage('assistant', '❌ Sorry, there was an error processing your answer. Please try again.')
        setLoading(false)
      }
    },
    [state.currentQuestion, state.answers, pushMessage, parseAnswer]
  )

  const reset = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(MESSAGES_KEY)
    }

    const firstQuestion = getAllQuestionsSequential()[0]
    const initialMessages: ChatMessage[] = [
      {
        id: uid(),
        role: 'system',
        text: "👋 Welcome to the GLP-1 Medication Eligibility Assessment.\n\nI'll ask you a series of questions to determine if you may be eligible for GLP-1 treatment. This assessment takes about 5-7 minutes.\n\nYour answers are saved locally and kept private. Let's get started!",
        time: Date.now()
      },
      {
        id: uid(),
        role: 'assistant',
        text: firstQuestion.question + (firstQuestion.helperText ? `\n\n💡 ${firstQuestion.helperText}` : ''),
        time: Date.now()
      }
    ]

    setState({
      messages: initialMessages,
      currentQuestion: firstQuestion,
      answers: {},
      completionPercentage: 0,
      categoryProgress: {
        personal: 0,
        medical: 0,
        lifestyle: 0,
        medications: 0,
        goals: 0
      },
      assessmentComplete: false,
      eligibilityStatus: 'pending'
    })

    setError(null)
    setLoading(false)
  }, [])

  const exportAnswers = useCallback(() => {
    return JSON.stringify(state.answers, null, 2)
  }, [state.answers])

  return {
    state,
    sendUserMessage,
    reset,
    loading,
    error,
    exportAnswers
  }
}
