'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface EligibilityDisplayProps {
  eligibility: any  // We'll handle the actual structure from backend
  onProceed: () => void
  loading?: boolean
}

export const EligibilityDisplay: React.FC<EligibilityDisplayProps> = ({
  eligibility,
  onProceed,
  loading = false,
}) => {
  // Guard against undefined eligibility
  if (!eligibility) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center"
      >
        <p className="text-xl text-red-700 font-semibold">⚠️ No Eligibility Data</p>
        <p className="text-red-600 mt-2">Unable to load eligibility assessment results.</p>
      </motion.div>
    )
  }

  // Safe accessors with fallbacks
  const eligibilityStatus = eligibility?.eligibility_status || 'UNKNOWN'
  const eligibilityScore = eligibility?.eligibility_score || 0
  const riskLevel = eligibility?.risk_level || 'UNKNOWN'
  
  // Clinical assessment with safe defaults
  const clinicalAssessment = eligibility?.clinical_assessment || {}
  const bmiData = clinicalAssessment?.bmi || {}
  const diabetesData = clinicalAssessment?.diabetes_status || {}
  const comorbiditiesData = clinicalAssessment?.comorbidities || {}
  const weightGoalData = clinicalAssessment?.weight_loss_goal || {}
  const contraindicationsData = clinicalAssessment?.contraindications || {}
  
  // Decision support with safe defaults
  const decisionSupport = eligibility?.decision_support || {}
  const recommendation = decisionSupport?.recommendation || 'Assessment complete'
  const clinicalReasoning = decisionSupport?.clinical_reasoning || []
  const keyConsiderations = decisionSupport?.key_considerations || []
  
  // Physician review with safe defaults
  const physicianReview = eligibility?.physician_review || {}
  const reviewLevel = physicianReview?.review_level || 'Standard'
  const focusAreas = physicianReview?.focus_areas || []
  
  // Constraints with safe defaults
  const constraints = eligibility?.constraints || {}
  const softConstraints = constraints?.soft_constraints || []
  
  // Status color mapping
  const statusColor = useMemo(() => {
    switch (eligibilityStatus) {
      case 'HIGHLY_ELIGIBLE':
      case 'ELIGIBLE':
        return 'from-green-500 to-emerald-600'
      case 'CONDITIONALLY_ELIGIBLE':
        return 'from-yellow-500 to-amber-600'
      case 'NOT_ELIGIBLE':
      case 'INELIGIBLE':
      case 'CONTRAINDICATED':
        return 'from-red-500 to-red-600'
      case 'REQUIRES_REVIEW':
        return 'from-orange-500 to-orange-600'
      default:
        return 'from-blue-500 to-blue-600'
    }
  }, [eligibilityStatus])

  // Risk color mapping
  const riskColor = useMemo(() => {
    switch (riskLevel) {
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }, [riskLevel])

  // Format status text for display
  const formatStatusText = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Check if button should be disabled
  const isButtonDisabled = 
    loading ||
    eligibilityStatus === 'NOT_ELIGIBLE' ||
    eligibilityStatus === 'INELIGIBLE' ||
    eligibilityStatus === 'CONTRAINDICATED' ||
    contraindicationsData?.has_contraindications === true

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className={clsx(
        'rounded-2xl bg-gradient-to-r p-8 text-white shadow-lg',
        statusColor
      )}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Eligibility Assessment</h2>
          <div className="text-6xl font-bold opacity-20">{eligibilityScore}</div>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="text-2xl font-bold">{formatStatusText(eligibilityStatus)}</div>
          <div className={clsx(
            'px-4 py-2 rounded-lg border-2 font-semibold',
            riskColor
          )}>
            {formatStatusText(riskLevel)} Risk
          </div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Eligibility Score</h3>
          <span className="text-2xl font-bold text-blue-600">{eligibilityScore}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(eligibilityScore, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={clsx(
              'h-full rounded-full bg-gradient-to-r',
              statusColor
            )}
          />
        </div>
      </div>

      {/* Clinical Assessment */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Clinical Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* BMI */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-700">BMI</h4>
              {bmiData?.meets_criteria && (
                <span className="text-green-600 text-sm font-bold">✓ Meets Criteria</span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {bmiData?.value ? bmiData.value.toFixed(1) : 'N/A'}
            </p>
            <p className="text-sm text-gray-600">{bmiData?.category || 'Not calculated'}</p>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Score: {bmiData?.score || 0}/40
              </p>
            </div>
          </div>

          {/* Diabetes Status */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">Diabetes Status</h4>
            <p className="text-lg font-bold text-gray-900">
              {diabetesData?.has_type2_diabetes
                ? 'Type 2 Diabetes'
                : 'No Type 2 Diabetes'}
            </p>
            {diabetesData?.controlled && (
              <p className="text-sm text-green-600 font-semibold">✓ Well Controlled</p>
            )}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Score: {diabetesData?.score || 0}/25
              </p>
            </div>
          </div>

          {/* Comorbidities */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">Comorbidities</h4>
            {Array.isArray(comorbiditiesData?.present) && comorbiditiesData.present.length > 0 ? (
              <div className="space-y-1">
                {comorbiditiesData.present.map((cond: string, idx: number) => (
                  <p key={idx} className="text-sm text-gray-700">• {cond}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">None identified</p>
            )}
            {comorbiditiesData?.cardiovascular_risk && (
              <p className="text-sm text-gray-600 mt-2">
                CV Risk: {comorbiditiesData.cardiovascular_risk}
              </p>
            )}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Score: {comorbiditiesData?.score || 0}/20
              </p>
            </div>
          </div>

          {/* Weight Loss Goal */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-700">Weight Loss Goal</h4>
              {weightGoalData?.realistic && (
                <span className="text-green-600 text-sm font-bold">✓ Realistic</span>
              )}
            </div>
            <p className="text-sm text-gray-700">
              {weightGoalData?.realistic 
                ? 'Goal is achievable and sustainable'
                : 'Weight loss goal assessed'}
            </p>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Score: {weightGoalData?.score || 0}/15
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contraindications */}
      {contraindicationsData?.has_contraindications ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-red-800 mb-3">⚠️ Contraindications Found</h3>
          <div className="space-y-2">
            {Array.isArray(contraindicationsData?.violations) && 
              contraindicationsData.violations.map((violation: string, idx: number) => (
                <p key={idx} className="text-red-700">• {violation}</p>
              ))
            }
            {(!Array.isArray(contraindicationsData?.violations) || 
              contraindicationsData.violations.length === 0) && (
              <p className="text-red-700">• Contraindications detected - see physician notes</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-green-800">✓ No Contraindications</h3>
          <p className="text-green-700 mt-2">Patient can safely proceed with GLP-1 therapy.</p>
        </div>
      )}

      {/* Decision Support */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Clinical Decision Support</h3>
        <p className="text-gray-700 mb-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          {recommendation}
        </p>

        {Array.isArray(clinicalReasoning) && clinicalReasoning.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Clinical Reasoning:</h4>
            <ul className="space-y-2">
              {clinicalReasoning.map((reason: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(keyConsiderations) && keyConsiderations.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3">Key Considerations:</h4>
            <ul className="space-y-2">
              {keyConsiderations.map((consideration: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="text-blue-600 text-lg">💡</span>
                  <span>{consideration}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Physician Review */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Physician Review Required</h3>
        <p className="text-gray-700 mb-4">
          Review Level: <span className="font-semibold">{reviewLevel}</span>
        </p>
        {Array.isArray(focusAreas) && focusAreas.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Focus Areas for Physician:</h4>
            <ul className="space-y-2">
              {focusAreas.map((area: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-gray-700 p-2 bg-gray-50 rounded">
                  <span>📋</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Soft Constraints */}
      {Array.isArray(softConstraints) && softConstraints.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-4">⚠️ Actions Required</h3>
          <div className="space-y-3">
            {softConstraints.map((constraint: any, idx: number) => (
              <div key={idx} className="p-3 bg-white rounded border border-amber-300">
                <p className="font-semibold text-amber-900">
                  {constraint?.constraint || 'Action required'}
                </p>
                <p className="text-sm text-amber-800 mt-1">
                  Status: {constraint?.status || 'Pending'}
                </p>
                {constraint?.action_required && (
                  <p className="text-sm text-amber-700 mt-2 font-medium">
                    🔹 {constraint.action_required}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: isButtonDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isButtonDisabled ? 1 : 0.98 }}
        onClick={onProceed}
        disabled={isButtonDisabled}
        className={clsx(
          'w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-200',
          isButtonDisabled
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg active:scale-95'
        )}
      >
        {loading 
          ? 'Getting Recommendation...' 
          : isButtonDisabled && eligibilityStatus === 'CONTRAINDICATED'
          ? 'Contraindicated - Cannot Proceed'
          : isButtonDisabled && (eligibilityStatus === 'NOT_ELIGIBLE' || eligibilityStatus === 'INELIGIBLE')
          ? 'Not Eligible for GLP-1 Therapy'
          : 'Get Medication Recommendation'
        }
      </motion.button>
    </motion.div>
  )
}