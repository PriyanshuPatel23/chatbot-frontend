import React, { memo } from 'react'
import { ChatMessage } from '../../lib/types'
import { format } from 'date-fns'
import clsx from 'clsx'

export const MessageBubble: React.FC<{ m: ChatMessage }> = memo(({ m }) => {
  const isUser = m.role === 'user'
  const container = isUser ? 'justify-end' : 'justify-start'
  const bubbleBase = 'max-w-[85%] rounded-2xl px-4 py-3.5 text-[15px] shadow-sm transition-all duration-200'
  const bubbleVariant = isUser
    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg'
    : m.role === 'system'
    ? 'bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 border-2 border-blue-200 text-gray-800 shadow-md'
    : 'bg-white border border-gray-200 text-gray-800 hover:shadow-md'

  return (
    <div className={clsx('flex', container)} role="listitem" aria-live={isUser ? 'polite' : 'assertive'}>
      <div className={clsx(bubbleBase, bubbleVariant)}>
        <div className="leading-relaxed whitespace-pre-wrap">{m.text}</div>

        {/* metadata */}
        {(m.metadata?.bmi || m.time) && (
          <div className={clsx(
            'mt-2.5 pt-2 flex items-center gap-3 text-[11px] border-t',
            isUser ? 'border-white/20 text-white/80' : 'border-gray-200 text-gray-500'
          )}>
            {m.metadata?.bmi !== undefined && (
              <span className={clsx(
                'px-2 py-1 rounded-md font-medium',
                isUser ? 'bg-white/20' : 'bg-blue-50 text-blue-700'
              )}>
                BMI: {String(m.metadata.bmi)}
              </span>
            )}
            {m.time && (
              <time dateTime={new Date(m.time).toISOString()} className="flex items-center gap-1">
                <span>🕐</span>
                <span>{format(new Date(m.time), 'p')}</span>
              </time>
            )}
          </div>
        )}
      </div>
    </div>
  )
})
MessageBubble.displayName = 'MessageBubble'
