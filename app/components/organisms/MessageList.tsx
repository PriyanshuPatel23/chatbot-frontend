import React, { useEffect, useRef } from 'react'
import { ConversationEntry } from '../../lib/types'
import { MessageBubble } from '../molecules/MessageBubble'
import { motion } from 'framer-motion'

interface MessageListProps {
  messages: ConversationEntry[]
  autoScroll?: boolean
  isLoading?: boolean
}

export const MessageList: React.FC<MessageListProps> = ({ messages, autoScroll = true, isLoading = false }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (autoScroll && ref.current) {
      // smooth unless user prefers reduced motion
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) {
        ref.current.scrollTop = ref.current.scrollHeight
      } else {
        ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' })
      }
    }
  }, [messages, autoScroll, isLoading])

  return (
    <div 
      ref={ref} 
      role="log" 
      aria-live="polite" 
      aria-relevant="additions" 
      className="flex flex-col gap-3 p-4 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 320px)' }}
    >
      {messages.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>Start the conversation...</p>
        </div>
      )}

      {messages.map((message, idx) => (
        <MessageBubble key={idx} message={message} />
      ))}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-start"
        >
          <div className="max-w-[82%] rounded-2xl px-4 py-3 bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
