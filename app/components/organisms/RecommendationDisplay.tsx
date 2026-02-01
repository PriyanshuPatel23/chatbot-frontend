'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

// Simplified types that match backend response
interface MedicationScore {
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

interface Prescription {
  patient_name: string
  date: string
  medication_name: string
  starting_dose: string
  target_dose: string
  titration_schedule: any[]
  route: string
  frequency: string
  indication: string
  dosing_instructions: string[]
  administration_technique: string[]
  baseline_labs: string[]
  follow_up_visits: any[]
  monitoring_parameters: string[]
  common_side_effects: string[]
  serious_side_effects: string[]
  drug_interactions: string[]
  lifestyle_modifications: string[]
  dietary_recommendations: string[]
  expected_outcomes: string
  when_to_contact_physician: string[]
  cbr_metadata?: any
}

interface CompleteRecommendationResponse {
  success: boolean
  timestamp: string
  session_id?: string
  processing_time: number
  eligibility: any
  recommended_medication?: MedicationScore | null
  alternative_medications: MedicationScore[]
  prescription?: Prescription | null
  next_steps: string[]
  physician_review_required: boolean
}

interface RecommendationDisplayProps {
  recommendation: CompleteRecommendationResponse
  onReset: () => void
}

type TabType = 'medication' | 'prescription' | 'alternatives' | 'next-steps'

export const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({
  recommendation,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('medication')

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'medication', label: 'Recommended', icon: '💊' },
    { id: 'prescription', label: 'Prescription', icon: '📋' },
    { id: 'alternatives', label: 'Alternatives', icon: '🔄' },
    { id: 'next-steps', label: 'Next Steps', icon: '✅' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🎯</span>
          <h2 className="text-3xl font-bold">Complete Recommendation</h2>
        </div>
        <p className="text-green-50">Your personalized GLP-1 medication and prescription plan</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-2 shadow-md flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-2',
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'medication' && (
          <MedicationTab key="medication" medication={recommendation.recommended_medication} />
        )}
        {activeTab === 'prescription' && (
          <PrescriptionTab key="prescription" prescription={recommendation.prescription} />
        )}
        {activeTab === 'alternatives' && (
          <AlternativesTab key="alternatives" medications={recommendation.alternative_medications || []} />
        )}
        {activeTab === 'next-steps' && (
          <NextStepsTab key="next-steps" steps={recommendation.next_steps || []} onReset={onReset} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================
// MEDICATION TAB
// ============================================

const MedicationTab: React.FC<{ medication?: MedicationScore | null }> = ({ medication }) => {
  if (!medication) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center"
      >
        <p className="text-xl text-red-700 font-semibold">⚠️ Not Eligible for GLP-1 Therapy</p>
        <p className="text-red-600 mt-2">Based on your assessment, you do not currently meet the eligibility criteria for GLP-1 medications.</p>
        <p className="text-red-600 mt-2 text-sm">Please consult with your healthcare provider to discuss alternative treatment options.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">🏆</span>
              <h3 className="text-2xl font-bold text-blue-900">{medication.medication}</h3>
            </div>
            <p className="text-blue-700">Rank #{medication.rank} - Recommended for you</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-blue-600">{medication.total_score.toFixed(1)}</p>
            <p className="text-sm text-blue-700">/100</p>
          </div>
        </div>

        <p className="text-blue-800 leading-relaxed">{medication.rationale}</p>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <ScoreCard label="Total" score={medication.total_score} color="from-blue-500 to-blue-600" />
        <ScoreCard label="Efficacy" score={medication.efficacy_score} color="from-green-500 to-green-600" />
        <ScoreCard label="Safety" score={medication.safety_score} color="from-purple-500 to-purple-600" />
        <ScoreCard label="Convenience" score={medication.convenience_score} color="from-orange-500 to-orange-600" />
        <ScoreCard label="Cost" score={medication.cost_score} color="from-pink-500 to-pink-600" />
        <ScoreCard label="Suitability" score={medication.suitability_score} color="from-teal-500 to-teal-600" />
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
          <h4 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
            <span>✓</span> Strengths
          </h4>
          <ul className="space-y-3">
            {Array.isArray(medication.strengths) && medication.strengths.map((strength, idx) => (
              <li key={idx} className="flex gap-3 text-green-900">
                <span className="text-green-500 font-bold flex-shrink-0">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
          <h4 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
            <span>⚠️</span> Considerations
          </h4>
          <ul className="space-y-3">
            {Array.isArray(medication.weaknesses) && medication.weaknesses.map((weakness, idx) => (
              <li key={idx} className="flex gap-3 text-amber-900">
                <span className="text-amber-500 font-bold flex-shrink-0">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================
// PRESCRIPTION TAB
// ============================================

const PrescriptionTab: React.FC<{ prescription?: Prescription | null }> = ({ prescription }) => {
  if (!prescription) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center"
      >
        <p className="text-xl text-amber-700 font-semibold">⚠️ No Prescription Available</p>
        <p className="text-amber-600 mt-2">Prescriptions are only generated for eligible patients.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Patient & Medication Info */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Patient Name</p>
            <p className="text-lg font-bold text-gray-900">{prescription.patient_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="text-lg font-bold text-gray-900">{prescription.date}</p>
          </div>
        </div>
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600">Medication</p>
          <p className="text-xl font-bold text-blue-600">{prescription.medication_name}</p>
        </div>
        <div className="mt-4 border-t pt-4">
          <p className="text-sm text-gray-600">Indication</p>
          <p className="text-gray-800">{prescription.indication}</p>
        </div>
      </div>

      {/* Dosing Information */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Dosing Information</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Starting Dose</p>
            <p className="font-semibold text-gray-900">{prescription.starting_dose}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Target Dose</p>
            <p className="font-semibold text-gray-900">{prescription.target_dose}</p>
          </div>
        </div>
        
        {/* Dosing Instructions */}
        {Array.isArray(prescription.dosing_instructions) && prescription.dosing_instructions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-3">Dosing Instructions:</h4>
            <ul className="space-y-2">
              {prescription.dosing_instructions.map((instruction, idx) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Titration Schedule */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Titration Schedule</h3>
        <div className="space-y-3">
          {Array.isArray(prescription.titration_schedule) && prescription.titration_schedule.map((schedule, idx) => {
            // Handle different schedule formats
            const scheduleKey = Object.keys(schedule).find(k => k !== 'dose') || Object.keys(schedule)[0]
            const dose = schedule.dose || Object.values(schedule)[0]
            
            return (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-semibold text-sm whitespace-nowrap">
                  {scheduleKey}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">{dose}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Administration */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Administration</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Route</p>
            <p className="font-semibold text-gray-900">{prescription.route}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Frequency</p>
            <p className="font-semibold text-gray-900">{prescription.frequency}</p>
          </div>
        </div>
        
        {Array.isArray(prescription.administration_technique) && prescription.administration_technique.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">
              {prescription.route.toLowerCase().includes('oral') ? 'Instructions:' : 'Injection Technique:'}
            </h4>
            <ol className="space-y-2">
              {prescription.administration_technique.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="font-bold text-blue-600 flex-shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Baseline Labs */}
      {Array.isArray(prescription.baseline_labs) && prescription.baseline_labs.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Baseline Labs Required</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {prescription.baseline_labs.map((lab, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="text-blue-600 font-bold text-lg">✓</span>
                <span className="text-gray-700">{lab}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up Schedule */}
      {Array.isArray(prescription.follow_up_visits) && prescription.follow_up_visits.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Follow-up Schedule</h3>
          <div className="space-y-3">
            {prescription.follow_up_visits.map((visit, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-900">
                    {visit.timing || `Visit ${idx + 1}`}
                  </p>
                </div>
                <p className="text-gray-700">{visit.purpose || 'Follow-up assessment'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side Effects */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Common Side Effects */}
        {Array.isArray(prescription.common_side_effects) && prescription.common_side_effects.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-4">⚠️ Common Side Effects</h3>
            <ul className="space-y-2">
              {prescription.common_side_effects.map((effect, idx) => (
                <li key={idx} className="text-sm text-yellow-800 flex gap-2">
                  <span>•</span>
                  <span>{typeof effect === 'string' ? effect : effect.symptom || 'Side effect'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Serious Side Effects */}
        {Array.isArray(prescription.serious_side_effects) && prescription.serious_side_effects.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-900 mb-4">🚨 Serious Side Effects</h3>
            <ul className="space-y-2">
              {prescription.serious_side_effects.map((effect, idx) => (
                <li key={idx} className="text-sm text-red-800 flex gap-2">
                  <span>•</span>
                  <span>{typeof effect === 'string' ? effect : effect.symptom || 'Serious side effect'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Drug Interactions */}
      {Array.isArray(prescription.drug_interactions) && prescription.drug_interactions.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Drug Interactions</h3>
          <div className="space-y-3">
            {prescription.drug_interactions.map((interaction, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <p className="text-gray-700">{typeof interaction === 'string' ? interaction : interaction.drug || 'Drug interaction noted'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lifestyle & Diet */}
      <div className="grid md:grid-cols-2 gap-6">
        {Array.isArray(prescription.dietary_recommendations) && prescription.dietary_recommendations.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4">🥗 Dietary Recommendations</h3>
            <ul className="space-y-2">
              {prescription.dietary_recommendations.map((rec, idx) => (
                <li key={idx} className="text-green-800 flex gap-2 text-sm">
                  <span>✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(prescription.lifestyle_modifications) && prescription.lifestyle_modifications.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4">💪 Lifestyle Modifications</h3>
            <ul className="space-y-2">
              {prescription.lifestyle_modifications.map((mod, idx) => (
                <li key={idx} className="text-blue-800 flex gap-2 text-sm">
                  <span>✓</span>
                  <span>{mod}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Expected Outcomes */}
      {prescription.expected_outcomes && (
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-900 mb-4">📊 Expected Outcomes</h3>
          <p className="text-gray-900">{prescription.expected_outcomes}</p>
        </div>
      )}

      {/* When to Contact */}
      {Array.isArray(prescription.when_to_contact_physician) && prescription.when_to_contact_physician.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-900 mb-4">📞 When to Contact Your Physician</h3>
          <ul className="space-y-2">
            {prescription.when_to_contact_physician.map((condition, idx) => (
              <li key={idx} className="text-red-800 flex gap-2">
                <span className="font-bold">→</span>
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CBR Metadata (optional, for transparency) */}
      {prescription.cbr_metadata && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📝 Generation Details</h3>
          <p className="text-gray-700 text-sm mb-2">{prescription.cbr_metadata.case_based_rationale}</p>
          {Array.isArray(prescription.cbr_metadata.adaptations_made) && prescription.cbr_metadata.adaptations_made.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700 mb-2">Patient-Specific Adaptations:</p>
              <ul className="space-y-1">
                {prescription.cbr_metadata.adaptations_made.map((adaptation: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-600">• {adaptation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ============================================
// ALTERNATIVES TAB
// ============================================

const AlternativesTab: React.FC<{ medications: MedicationScore[] }> = ({ medications }) => {
  if (!medications || medications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 text-center"
      >
        <p className="text-xl text-gray-700 font-semibold">No Alternative Medications</p>
        <p className="text-gray-600 mt-2">The primary recommendation is the best choice for your profile.</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
        <p className="text-blue-900">
          These are alternative medications that may be suitable if your primary recommendation is unavailable or contraindicated.
        </p>
      </div>

      {medications.map((med, idx) => (
        <div key={idx} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-gray-300 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">#{med.rank} {med.medication}</h3>
              <p className="text-gray-600 mt-1">{med.rationale}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">{med.total_score.toFixed(1)}</p>
              <p className="text-xs text-gray-500">/100</p>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-2 mb-6 pb-6 border-b">
            <ScoreCardSmall label="Efficacy" score={med.efficacy_score} />
            <ScoreCardSmall label="Safety" score={med.safety_score} />
            <ScoreCardSmall label="Convenience" score={med.convenience_score} />
            <ScoreCardSmall label="Cost" score={med.cost_score} />
            <ScoreCardSmall label="Suitability" score={med.suitability_score} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">✓ Strengths</h4>
              <ul className="space-y-1">
                {Array.isArray(med.strengths) && med.strengths.map((s, sidx) => (
                  <li key={sidx} className="text-sm text-gray-700">• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">⚠️ Weaknesses</h4>
              <ul className="space-y-1">
                {Array.isArray(med.weaknesses) && med.weaknesses.map((w, widx) => (
                  <li key={widx} className="text-sm text-gray-700">• {w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

// ============================================
// NEXT STEPS TAB
// ============================================

const NextStepsTab: React.FC<{ steps: string[]; onReset: () => void }> = ({ steps, onReset }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Action Plan</h3>
      <ol className="space-y-4">
        {Array.isArray(steps) && steps.map((step, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">
                {idx + 1}
              </div>
            </div>
            <p className="text-gray-700 pt-1">{step}</p>
          </motion.li>
        ))}
      </ol>
    </div>

    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
      <h3 className="text-lg font-bold text-green-900 mb-2">✓ Assessment Complete!</h3>
      <p className="text-green-800 mb-4">
        Your eligibility assessment and personalized medication recommendation are ready to share with your healthcare provider.
      </p>
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Start New Assessment
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Print Report
        </button>
      </div>
    </div>
  </motion.div>
)

// ============================================
// HELPER COMPONENTS
// ============================================

const ScoreCard: React.FC<{ label: string; score: number; color: string }> = ({ label, score, color }) => (
  <div className={clsx('bg-gradient-to-br rounded-lg p-4 text-white shadow-md', color)}>
    <p className="text-sm font-semibold opacity-90">{label}</p>
    <p className="text-3xl font-bold mt-1">{score.toFixed(1)}</p>
    <p className="text-xs opacity-75">/ 100</p>
  </div>
)

const ScoreCardSmall: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div className="bg-gray-100 rounded-lg p-2 text-center">
    <p className="text-xs text-gray-600 font-medium">{label}</p>
    <p className="text-lg font-bold text-gray-900">{score.toFixed(1)}</p>
  </div>
)