import React from 'react'
import clsx from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  ariaLabel?: string
}

/**
 * Accessible button with variants. Uses Tailwind tokens.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ariaLabel,
  ...rest
}) => {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  }
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
    secondary: 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100 focus-visible:ring-secondary-400',
    ghost: 'bg-transparent text-primary-700 hover:bg-primary-50 focus-visible:ring-primary-300'
  }

  return (
    <button
      {...rest}
      aria-label={ariaLabel}
      className={clsx(base, sizes[size], variants[variant], className)}
    >
      {children}
    </button>
  )
}
