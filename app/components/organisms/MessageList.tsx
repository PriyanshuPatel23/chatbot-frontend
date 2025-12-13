import React, { useEffect, useRef } from 'react'
import { ChatMessage } from '../../lib/types'
import { MessageBubble } from '../molecules/MessageBubble'
import { motion } from 'framer-motion'

interface MessageListProps {
  messages: ChatMessage[]
  autoScroll?: boolean
  isTyping?: boolean
}

export const MessageList: React.FC<MessageListProps> = ({ messages, autoScroll = true, isTyping = false }) => {
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
  }, [messages, autoScroll, isTyping])

  return (
    <div ref={ref} role="log" aria-live="polite" aria-relevant="additions" className="flex flex-col gap-3 p-3">
      {messages.map((m) => (
        <MessageBubble key={m.id} m={m} />
      ))}

      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-start"
        >
          <div className="max-w-[82%] rounded-2xl px-4 py-3 bg-surface border border-gray-100 shadow-sm">
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
