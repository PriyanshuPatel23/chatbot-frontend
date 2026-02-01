import React, { useRef, useState } from 'react'
import { MessageList } from '../organisms/MessageList'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { ConversationEntry } from '../../lib/types'
import clsx from 'clsx'

interface ChatWindowProps {
  messages: ConversationEntry[]
  onSend: (text: string) => Promise<void> | void
  loading?: boolean
  error?: string | null
  completionPercentage?: number
  isConversationComplete?: boolean
  onReset?: () => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSend,
  loading = false,
  error = null,
  completionPercentage = 0,
  isConversationComplete = false,
  onReset,
}) => {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleSend = async () => {
    if (!value.trim()) return
    await onSend(value.trim())
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-[75vh] max-w-3xl mx-auto gap-0 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <header className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span>GLP-1 Assessment Chat</span>
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">Answer questions to complete your assessment</p>
          </div>
          {isConversationComplete && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm shadow-sm animate-pulse">
              <span className="text-lg">✓</span>
              <span>Complete</span>
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-gray-700">Assessment Progress</label>
            <span className="text-xs font-bold text-blue-600">{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </header>

      <main className="overflow-y-auto bg-gray-50">
        <MessageList messages={messages} isLoading={loading} />
      </main>

      <footer className="p-5 border-t border-gray-200 bg-white">
        {error && (
          <div className="mb-3 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isConversationComplete ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-900 font-semibold mb-3">✓ Assessment Complete!</p>
            <p className="text-green-800 text-sm mb-4">
              All required information has been collected. Click the button below to get your personalized recommendation.
            </p>
          </div>
        ) : (
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type your answer here..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                aria-label="Reply to assistant"
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={loading || !value.trim()}
              ariaLabel="Send message"
              className="px-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⟳</span>
                  <span>Sending...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Send</span>
                  <span>→</span>
                </span>
              )}
            </Button>
          </div>
        )}
      </footer>
    </div>
  )
}
