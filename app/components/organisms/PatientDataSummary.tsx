import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../atoms/Button'

interface PatientDataSummaryProps {
  answers: Record<string, unknown>
  completionPercentage: number
  eligibilityStatus?: 'eligible' | 'ineligible' | 'pending'
  onExport?: () => string
}

export function PatientDataSummary({
  answers,
  completionPercentage,
  eligibilityStatus,
  onExport
}: PatientDataSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleExport = () => {
    if (onExport) {
      const data = onExport()
      navigator.clipboard.writeText(data)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    if (value === null || value === undefined) {
      return 'Not provided'
    }
    return String(value)
  }

  const getDisplayLabel = (key: string): string => {
    const labels: Record<string, string> = {
      fullName: 'Full Name',
      age: 'Age',
      gender: 'Gender',
      pregnant: 'Pregnant/Breastfeeding',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
      diagnosedConditions: 'Diagnosed Conditions',
      diabetesType: 'Diabetes Type',
      lastA1C: 'Last A1C Level (%)',
      thyroidDisease: 'Thyroid Disease',
      pancreatitisHistory: 'Pancreatitis History',
      kidneyDisease: 'Kidney Disease',
      gastroparesis: 'Gastroparesis',
      allergies: 'Allergies',
      weightLossAttempts: 'Previous Weight Loss Methods',
      exerciseFrequency: 'Exercise Frequency',
      dietPattern: 'Diet Pattern',
      smokingStatus: 'Smoking Status',
      alcoholUse: 'Alcohol Use',
      currentMedications: 'Current Medications',
      diabetesMedications: 'Diabetes Medications',
      insulinType: 'Insulin Type',
      bloodPressureMeds: 'Blood Pressure Meds',
      cholesterolMeds: 'Cholesterol Meds',
      previousGLP1: 'Previous GLP-1 Use',
      previousGLP1Response: 'Previous GLP-1 Response',
      primaryGoal: 'Primary Treatment Goal',
      weightLossGoal: 'Weight Loss Goal (kg)',
      timeline: 'Preferred Timeline',
      injectionComfort: 'Injection Comfort Level',
      costConcern: 'Insurance Coverage',
      additionalInfo: 'Additional Information'
    }
    return labels[key] || key
  }

  const calculateBMI = () => {
    const weight = answers.weight as number | undefined
    const height = answers.height as number | undefined
    if (!weight || !height) return null
    const bmi = weight / Math.pow(height / 100, 2)
    return bmi.toFixed(1)
  }

  const bmi = calculateBMI()
  const hasAnswers = Object.keys(answers).length > 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Patient Summary</h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {hasAnswers ? `${Object.keys(answers).length} answers provided` : 'No data yet'}
            </p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Key Metrics */}
        {hasAnswers && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {answers.age !== undefined && (
              <div className="bg-white/60 rounded-lg px-2 py-1.5">
                <p className="text-xs text-gray-500">Age</p>
                <p className="text-sm font-semibold text-gray-800">{String(answers.age)} years</p>
              </div>
            )}
            {bmi && (
              <div className="bg-white/60 rounded-lg px-2 py-1.5">
                <p className="text-xs text-gray-500">BMI</p>
                <p className="text-sm font-semibold text-gray-800">{bmi}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 max-h-96 overflow-y-auto">
              {hasAnswers ? (
                <div className="space-y-3">
                  {Object.entries(answers).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-100 pb-2 last:border-0">
                      <p className="text-xs font-medium text-gray-500 mb-0.5">
                        {getDisplayLabel(key)}
                      </p>
                      <p className="text-sm text-gray-800">{formatValue(value)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Start answering questions to see your data here.
                </p>
              )}
            </div>

            {hasAnswers && (
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Button
                  onClick={handleExport}
                  variant="secondary"
                  ariaLabel="Export answers to clipboard"
                  className="w-full text-sm"
                >
                  {copied ? '✓ Copied to Clipboard' : '📋 Copy Answers'}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Eligibility Status */}
      {eligibilityStatus && completionPercentage === 100 && (
        <div className={`p-4 border-t ${
          eligibilityStatus === 'eligible'
            ? 'bg-green-50 border-green-100'
            : eligibilityStatus === 'ineligible'
            ? 'bg-red-50 border-red-100'
            : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {eligibilityStatus === 'eligible' ? '✅' : eligibilityStatus === 'ineligible' ? '❌' : '⏳'}
            </span>
            <div>
              <p className="text-xs font-semibold text-gray-700">Eligibility Status</p>
              <p className={`text-sm font-medium ${
                eligibilityStatus === 'eligible'
                  ? 'text-green-700'
                  : eligibilityStatus === 'ineligible'
                  ? 'text-red-700'
                  : 'text-blue-700'
              }`}>
                {eligibilityStatus === 'eligible'
                  ? 'Preliminarily Eligible'
                  : eligibilityStatus === 'ineligible'
                  ? 'Not Eligible'
                  : 'Pending Assessment'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
