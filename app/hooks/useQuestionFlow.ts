'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ChatMessage } from '../lib/types'
import { addMessage as addMessageAction, mergeCollectedData, setSession as setSessionAction, reset as resetChatState } from '../features/chat/chatSlice'

import {
  getAllQuestionsSequential,
  getNextQuestion,
  getCompletionPercentage,
  getCategoryProgress,
  validateAnswer,
  Question
} from '../faker/data'

import { startConversation, sendChat } from '../lib/api'

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
  medicalFlags?: string[]
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
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)
  const [useServer, setUseServer] = useState<boolean | null>(null)

  // Save to localStorage whenever answers or session change
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(state.answers).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.answers))
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(state.messages))
    }

    if (sessionId) {
      localStorage.setItem('glp1_session_id', sessionId)
    }
  }, [state.answers, state.messages, sessionId])

  // Try to initialize conversation from server if available
  useEffect(() => {
    let mounted = true
    ;(async () => {
      // If storage already has a session id, prefer it
      const stored = typeof window !== 'undefined' ? localStorage.getItem('glp1_session_id') : null
      if (stored) setSessionId(stored)

      try {
        const res = await startConversation()
        if (!mounted) return
        // Use server messages if provided
        setUseServer(true)
        setSessionId((res as any).session_id || undefined)

        // Map server conversation history to ChatMessage
        const serverMessages = (res.conversation_history || []).map((m: any) => ({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          role: m.role as ChatMessage['role'],
          text: m.content,
          time: Date.now()
        }))

        setState(prev => ({ ...prev, messages: serverMessages, currentQuestion: prev.currentQuestion }))
      } catch (err) {
        // Server not available — fall back to local flow
        setUseServer(false)
      }
    })()

    return () => { mounted = false }
  }, [])


  const dispatch = useDispatch()

  const pushMessage = useCallback((role: ChatMessage['role'], text: string, metadata?: Record<string, unknown>) => {
    const m: ChatMessage = {
      id: uid(),
      role,
      text,
      time: Date.now(),
      metadata
    }
    setState(prev => ({ ...prev, messages: [...prev.messages, m] }))

    // Also push to redux store for global visibility
    try {
      dispatch(addMessageAction({ role, content: text, timestamp: new Date(m.time).toISOString() }))
    } catch (e) {
      // ignore if dispatch not available
    }

    return m
  }, [dispatch])

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

      // Add user message locally (optimistic)
      pushMessage('user', text)

      // Parse and validate as before
      const answer = parseAnswer(text, state.currentQuestion)
      const validation = validateAnswer(state.currentQuestion, answer)
      if (!validation.valid) {
        pushMessage('assistant', `⚠️ ${validation.error}\n\nPlease try again: ${state.currentQuestion.question}`)
        setLoading(false)
        return
      }

      // Update local answers immediately
      const newAnswers = {
        ...state.answers,
        [state.currentQuestion.id]: answer
      }
      setState(prev => ({ ...prev, answers: newAnswers }))

      // If server integration is enabled, send to backend
      if (useServer) {
        try {
          const conversation_history = state.messages.map(m => ({ role: m.role, content: m.text, timestamp: new Date(m.time || Date.now()).toISOString() }))

          const payload = {
            message: text,
            conversation_history,
            collected_data: newAnswers,
            session_id: sessionId
          }

          const res = await sendChat(payload)

          // Merge collected data from server
          const merged = { ...newAnswers, ...res.collected_data }

          // Append assistant reply
          pushMessage('assistant', res.response)

          // Update state using server values
          setState(prev => ({
            ...prev,
            answers: merged,
            completionPercentage: res.completion_percentage,
            assessmentComplete: res.is_complete,
            medicalFlags: res.medical_flags || prev.medicalFlags,
            // keep eligibility logic local for now
          }))

          // If there are medical flags, surface them as assistant/system messages
          if (Array.isArray(res.medical_flags) && res.medical_flags.length > 0) {
            pushMessage('assistant', `⚠️ Medical flags detected: ${res.medical_flags.join(', ')}`)
          }

          // Sync to Redux
          try {
            dispatch(mergeCollectedData(merged))
            if ((res as any).session_id) dispatch(setSessionAction((res as any).session_id))
            if (Array.isArray((res as any).medical_flags) && (res as any).medical_flags.length > 0) {
              // Use setChatStateFromServer to store flags
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              dispatch({ type: 'chat/setChatStateFromServer', payload: { medical_flags: (res as any).medical_flags } })
            }
          } catch (e) {
            // ignore
          }

          // Save session_id returned from server if any
          if ((res as any).session_id) setSessionId((res as any).session_id)

          setLoading(false)
          return
        } catch (err) {
          // Fall back to local flow if server call fails
          console.warn('Server chat failed, falling back to local flow:', err)
        }
      }

      // Local fallback logic (same as previous implementation)
      try {
        // Simulate processing delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500))

        // Calculate metrics
        const bmi = calculateBMI(
          newAnswers.weight as number | undefined,
          newAnswers.height as number | undefined
        )

        // Add BMI info if just calculated
        if (bmi && state.currentQuestion.id === 'height') {
          pushMessage('assistant', `✅ Thank you! Your BMI is ${bmi}.\n\nNext question:`, { bmi })
        }

        const nextQ = getNextQuestion(newAnswers)
        const completion = getCompletionPercentage(newAnswers)
        const categoryProg = getCategoryProgress(newAnswers)
        const elig = assessEligibility(newAnswers)

        setState(prev => ({
          ...prev,
          answers: newAnswers,
          currentQuestion: nextQ,
          completionPercentage: completion,
          categoryProgress: categoryProg,
          assessmentComplete: nextQ === null,
          eligibilityStatus: elig
        }))

        if (nextQ) {
          pushMessage('assistant', nextQ.question + (nextQ.helperText ? `\n\n💡 ${nextQ.helperText}` : ''))
        } else {
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
    [state.currentQuestion, state.answers, pushMessage, parseAnswer, useServer, sessionId]
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

    // Also clear redux
    try { dispatch(resetChatState()) } catch (e) { }
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
