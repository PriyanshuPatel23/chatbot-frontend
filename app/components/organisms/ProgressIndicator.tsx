import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ProgressIndicatorProps {
  completionPercentage: number
  categoryProgress: Record<string, number>
}

const categoryLabels: Record<string, string> = {
  personal: 'Personal Info',
  medical: 'Medical History',
  lifestyle: 'Lifestyle',
  medications: 'Medications',
  goals: 'Treatment Goals'
}

const categoryIcons: Record<string, string> = {
  personal: '👤',
  medical: '🏥',
  lifestyle: '🏃',
  medications: '💊',
  goals: '🎯'
}

export function ProgressIndicator({ completionPercentage, categoryProgress }: ProgressIndicatorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Overall Progress */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Assessment Progress</h3>
          <span className="text-lg font-bold text-blue-600">{completionPercentage}%</span>
        </div>

        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Category Progress */}
      <div className="p-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Categories</h4>
        <div className="space-y-3">
          {Object.entries(categoryProgress).map(([category, progress]) => (
            <div key={category} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[category]}</span>
                  <span className="text-sm text-gray-700">{categoryLabels[category]}</span>
                </div>
                <span className={clsx(
                  'text-xs font-medium',
                  progress === 100 ? 'text-green-600' : 'text-gray-500'
                )}>
                  {progress}%
                </span>
              </div>

              <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className={clsx(
                    'absolute inset-y-0 left-0 rounded-full',
                    progress === 100
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-blue-400 to-blue-500'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Status */}
      {completionPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border-t border-green-100"
        >
          <div className="flex items-center gap-2 text-green-700">
            <span className="text-xl">✅</span>
            <span className="text-sm font-medium">Assessment Complete!</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
