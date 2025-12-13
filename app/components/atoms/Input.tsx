import React from 'react'
import clsx from 'clsx'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, hint, className, ...rest }, ref) => {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium mb-1">{label}</span>}
      <input
        {...rest}
        ref={ref}
        className={clsx(
          'w-full rounded-md px-3 py-2 border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          'focus-visible:ring-primary-500',
          className
        )}
      />
      {hint && <span className="text-xs text-gray-500 mt-1 block">{hint}</span>}
    </label>
  )
})

Input.displayName = 'Input'
