import React, { memo } from 'react'
import { ConversationEntry } from '../../lib/types'
import { format } from 'date-fns'
import clsx from 'clsx'

interface MessageBubbleProps {
  message: ConversationEntry
}

export const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message }) => {
  const isUser = message.role === 'user'
  const isError = message.role === 'system'
  const container = isUser ? 'justify-end' : 'justify-start'
  const bubbleBase = 'max-w-[85%] rounded-2xl px-4 py-3.5 text-[15px] shadow-sm transition-all duration-200'
  const bubbleVariant = isUser
    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg'
    : isError
    ? 'bg-gradient-to-br from-red-50 to-red-50 border-2 border-red-200 text-red-800'
    : 'bg-white border border-gray-200 text-gray-800 hover:shadow-md'

  return (
    <div className={clsx('flex', container, 'mb-3')} role="listitem" aria-live={isUser ? 'polite' : 'assertive'}>
      <div className={clsx(bubbleBase, bubbleVariant)}>
        <div className="leading-relaxed whitespace-pre-wrap break-words">{message.content}</div>

        {/* Timestamp */}
        {message.timestamp && (
          <div className={clsx(
            'mt-2 pt-2 flex items-center gap-2 text-[11px] border-t',
            isUser ? 'border-white/20 text-white/70' : isError ? 'border-red-200 text-red-600' : 'border-gray-200 text-gray-500'
          )}>
            <time dateTime={new Date(message.timestamp).toISOString()}>
              {format(new Date(message.timestamp), 'HH:mm')}
            </time>
          </div>
        )}
      </div>
    </div>
  )
})
MessageBubble.displayName = 'MessageBubble'

