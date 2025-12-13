'use client'
import React from 'react'
import { ChatWindow } from '../app/components/templates/ChatWindow'
import { useQuestionFlow } from '../app/hooks/useQuestionFlow'
import { ProgressIndicator } from '../app/components/organisms/ProgressIndicator'
import { PatientDataSummary } from '../app/components/organisms/PatientDataSummary'

export default function AppShell() {
  const { state, sendUserMessage, loading, error, reset, exportAnswers } = useQuestionFlow()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
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
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Chat Window */}
          <div className="order-2 lg:order-1">
            <ChatWindow
              messages={state.messages}
              onSend={async (t) => await sendUserMessage(t)}
              loading={loading}
              error={error}
              eligibilityStatus={state.eligibilityStatus}
              onReset={reset}
            />
          </div>

          {/* Sidebar */}
          <aside className="order-1 lg:order-2 space-y-6">
            {/* Progress Indicator */}
            <ProgressIndicator
              completionPercentage={state.completionPercentage}
              categoryProgress={state.categoryProgress}
            />

            {/* Patient Data Summary */}
            <PatientDataSummary
              answers={state.answers}
              completionPercentage={state.completionPercentage}
              eligibilityStatus={state.eligibilityStatus}
              onExport={exportAnswers}
            />

            {/* Info Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <span>ℹ️</span>
                <span>How it works</span>
              </h3>
              <ol className="text-sm space-y-2.5 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold mt-0.5">1</span>
                  <span>Answer all questions honestly and accurately</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold mt-0.5">2</span>
                  <span>Get a preliminary eligibility assessment instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold mt-0.5">3</span>
                  <span>Healthcare provider reviews for final decision</span>
                </li>
              </ol>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> This assessment is for informational purposes only and does not constitute medical advice or a prescription.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Your answers are saved locally in your browser and kept private.</p>
        </footer>
      </div>
    </div>
  )
}
