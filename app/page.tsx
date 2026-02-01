'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store'
import {
  addMessage,
  setSession,
  mergeCollectedData,
  setChatCompletion,
  setLoading,
  setError,
  setEligibilityLoading,
  setEligibility,
  setEligibilityError,
  setRecommendationLoading,
  setRecommendation,
  setRecommendationError,
  setCurrentStep,
  reset,
} from './features/chat/chatSlice'
import { ChatWindow } from './components/templates/ChatWindow'
import { ProgressIndicator } from './components/organisms/ProgressIndicator'
import { PatientDataSummary } from './components/organisms/PatientDataSummary'
import { EligibilityDisplay } from './components/organisms/EligibilityDisplay'
import { RecommendationDisplay } from './components/organisms/RecommendationDisplay'
import { api } from '../lib/api'
import { motion } from 'framer-motion'

export default function Home() {
  const dispatch = useDispatch()
  const state = useSelector((root: RootState) => root.chat)
  const [initialized, setInitialized] = useState(false)

  // ============================================
  // Initialize Chat on Mount
  // ============================================
  useEffect(() => {
    if (!initialized) {
      initializeChat()
      setInitialized(true)
    }
  }, [initialized])

  const initializeChat = async () => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      const response = await api.startConversation()

      dispatch(setSession(response.session_id))
      dispatch(addMessage({
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      }))
      dispatch(mergeCollectedData(response.collected_data))

      dispatch(setCurrentStep('chat'))
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to initialize chat'
      dispatch(setError(errorMsg))
      console.error('Init error:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  // ============================================
  // Send Chat Message
  // ============================================
  const sendUserMessage = async (message: string) => {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))

      // Add user message to state
      dispatch(addMessage({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      }))

      // Send to API
      const response = await api.sendChatMessage(
        message,
        state.messages,
        state.collectedData,
        state.sessionId
      )

      // Update state with response
      dispatch(addMessage({
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      }))

      dispatch(mergeCollectedData(response.collected_data))
      dispatch(setChatCompletion({
        completionPercentage: response.completion_percentage,
        isComplete: response.is_complete,
        nextExpectedField: response.next_expected_field,
      }))

      // If conversation complete, automatically proceed to eligibility
      if (response.is_complete) {
        setTimeout(() => {
          proceedToEligibility()
        }, 2000)
      }
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to send message'
      dispatch(setError(errorMsg))
      console.error('Chat error:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  // ============================================
  // Evaluate Eligibility
  // ============================================
  const proceedToEligibility = async () => {
    try {
      dispatch(setEligibilityLoading(true))
      dispatch(setError(null))

      // This now calls /recommendation/complete which returns:
      // eligibility + recommended_medication + alternative_medications + prescription
      const response = await api.evaluateEligibility(
        state.collectedData,
        state.sessionId
      )

      // Set the complete recommendation (which includes eligibility)
      dispatch(setEligibility(response))
      
      // Auto-transition to recommendation after 2 seconds
      setTimeout(() => {
        dispatch(setCurrentStep('recommendation'))
      }, 2000)
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to evaluate eligibility'
      dispatch(setEligibilityError(errorMsg))
      dispatch(setError(errorMsg))
      console.error('Eligibility error:', error)
    } finally {
      dispatch(setEligibilityLoading(false))
    }
  }

  // ============================================
  // Get Complete Recommendation (Manual call)
  // ============================================
  const getCompleteRecommendation = async () => {
    try {
      dispatch(setRecommendationLoading(true))
      dispatch(setError(null))

      const response = await api.getCompleteRecommendation(
        state.collectedData,
        state.sessionId
      )

      dispatch(setRecommendation(response))
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to get recommendation'
      dispatch(setRecommendationError(errorMsg))
      dispatch(setError(errorMsg))
      console.error('Recommendation error:', error)
    } finally {
      dispatch(setRecommendationLoading(false))
    }
  }

  // ============================================
  // Reset Assessment
  // ============================================
  const handleReset = () => {
    dispatch(reset())
    setInitialized(false)
  }

  // ============================================
  // Determine What to Display
  // ============================================
  const shouldShowEligibility = state.eligibility && state.currentStep === 'eligibility'
  const shouldShowRecommendation = state.recommendation && state.currentStep === 'recommendation'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <span>🏥</span>
            <span>Medical Assessment</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            GLP-1 Eligibility Assessment
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Complete our comprehensive questionnaire to determine your eligibility for GLP-1 medication treatment
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            {!shouldShowEligibility && !shouldShowRecommendation && (
              <ChatWindow
                messages={state.messages}
                onSend={sendUserMessage}
                loading={state.loading}
                error={state.error}
                completionPercentage={state.completionPercentage}
                isConversationComplete={state.isConversationComplete}
              />
            )}

            {shouldShowEligibility && (
              <div className="space-y-6">
                <EligibilityDisplay
                  eligibility={state.eligibility!}
                  onProceed={getCompleteRecommendation}
                  loading={state.recommendationLoading}
                />
              </div>
            )}

            {shouldShowRecommendation && (
              <div className="space-y-6">
                <RecommendationDisplay
                  recommendation={state.recommendation!}
                  onReset={handleReset}
                />
              </div>
            )}

            {state.error && !state.loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-red-800"
              >
                <h3 className="font-bold mb-2">Error occurred:</h3>
                <p>{state.error}</p>
                {state.currentStep === 'chat' && (
                  <button
                    onClick={initializeChat}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-1 lg:order-2 space-y-6"
          >
            {/* Progress Indicator */}
            {!shouldShowRecommendation && (
              <ProgressIndicator
                completionPercentage={state.completionPercentage}
                categoryProgress={{
                  'Patient Info': Math.min(state.completionPercentage * 0.3, 100),
                  'Medical History': Math.min(state.completionPercentage * 0.4, 100),
                  'Goals': Math.min(state.completionPercentage * 0.3, 100),
                }}
              />
            )}

            {/* Patient Data Summary */}
            {Object.keys(state.collectedData).length > 0 && !shouldShowRecommendation && (
              <PatientDataSummary
                data={state.collectedData}
                completionPercentage={state.completionPercentage}
              />
            )}

            {/* Status Card */}
            {!shouldShowRecommendation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-blue-500"
              >
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Status
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Current Step:</span>{' '}
                    <span className="text-blue-600 capitalize">{state.currentStep}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Progress:</span>{' '}
                    <span className="text-blue-600">{Math.round(state.completionPercentage)}%</span>
                  </p>
                  {state.isConversationComplete && (
                    <p className="text-sm text-green-700 font-semibold">
                      ✓ Ready for eligibility assessment
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Reset Button - Always Available */}
            {(shouldShowEligibility || shouldShowRecommendation) && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleReset}
                className="w-full py-3 px-4 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-md"
              >
                Start New Assessment
              </motion.button>
            )}
          </motion.aside>
        </div>
      </div>
    </div>
  )
}
