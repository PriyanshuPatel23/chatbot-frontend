import React, { useRef, useState } from 'react'
import { MessageList } from '../organisms/MessageList'
import { Button } from '../atoms/Button'
import { Input } from '../atoms/Input'
import { ChatMessage } from '../../lib/types'

interface ChatWindowProps {
  messages: ChatMessage[]
  onSend: (text: string) => Promise<void> | void
  loading?: boolean
  error?: string | null
  eligibilityStatus?: 'eligible' | 'ineligible' | 'pending'
  onReset?: () => void
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSend, loading=false, error = null, eligibilityStatus, onReset }) => {
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span>Chat Assistant</span>
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">Answer each question to continue the assessment</p>
          </div>
          <div aria-live="polite" role="status">
            {eligibilityStatus === 'eligible' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm shadow-sm">
                <span className="text-lg">✓</span>
                <span>Preliminarily Eligible</span>
              </span>
            )}
            {eligibilityStatus === 'ineligible' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-medium text-sm shadow-sm">
                <span className="text-lg">✗</span>
                <span>Not Eligible</span>
              </span>
            )}
            {eligibilityStatus === 'pending' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm shadow-sm">
                <span className="text-lg">⋯</span>
                <span>In Progress</span>
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="overflow-y-auto bg-gray-50">
        <MessageList messages={messages} isTyping={loading} />
      </main>

      <footer className="p-5 border-t border-gray-200 bg-white">
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
          <Button variant="ghost" onClick={onReset} ariaLabel="Reset chat" className="px-4">
            ↻ Reset
          </Button>
        </div>
        {error && (
          <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-2">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </footer>
    </div>
  )
}
