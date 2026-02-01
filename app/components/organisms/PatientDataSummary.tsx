import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CollectedData } from '../../lib/types'
import clsx from 'clsx'

interface PatientDataSummaryProps {
  data: CollectedData
  completionPercentage: number
}

export function PatientDataSummary({
  data,
  completionPercentage,
}: PatientDataSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

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
      name: 'Name',
      age: 'Age',
      height: 'Height',
      weight: 'Weight (kg)',
      bmi: 'BMI',
      is_pregnant_breastfeeding: 'Pregnant/Breastfeeding',
      high_risk_conditions: 'High Risk Conditions',
      current_medical_conditions: 'Medical Conditions',
      currently_on_glp1: 'Currently on GLP-1',
      other_medications: 'Current Medications',
      allergies: 'Allergies',
      weight_loss_goal: 'Weight Loss Goal',
      interested_medication: 'Interested Medication',
    }
    return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  const displayEntries = Object.entries(data)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .slice(0, 8)

  const hasMore = Object.keys(data).length > 8

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">👤</span>
          Patient Data
        </h3>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {Object.keys(data).length} fields
        </span>
      </div>

      {Object.keys(data).length > 0 ? (
        <>
          <AnimatePresence>
            <div className="space-y-3">
              {displayEntries.map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="pb-3 border-b border-gray-100 last:border-0"
                >
                  <p className="text-xs font-semibold text-gray-600 mb-1">{getDisplayLabel(key)}</p>
                  <p className="text-sm text-gray-900 break-words">{formatValue(value)}</p>
                </motion.div>
              ))}
            </div>

            {isExpanded && (
              Object.entries(data)
                .filter(([_, value]) => value !== undefined && value !== null && value !== '')
                .slice(8)
                .map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="pb-3 border-b border-gray-100 last:border-0 mt-3"
                  >
                    <p className="text-xs font-semibold text-gray-600 mb-1">{getDisplayLabel(key)}</p>
                    <p className="text-sm text-gray-900 break-words">{formatValue(value)}</p>
                  </motion.div>
                ))
            )}
          </AnimatePresence>

          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full mt-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              {isExpanded ? '▼ Show Less' : '▶ Show More'}
            </button>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-sm">No data collected yet...</p>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs font-semibold text-gray-700">Completion</p>
          <p className="text-xs font-bold text-blue-600">{Math.round(completionPercentage)}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
          />
        </div>
      </div>
    </motion.div>
  )
}
