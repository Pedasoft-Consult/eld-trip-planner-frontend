// src/components/ui/Card.tsx
import React from 'react'
import { clsx } from 'clsx'

interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className,
  actions,
  padding = 'md',
  shadow = 'md'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }

  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-gray-200',
        shadowClasses[shadow],
        className
      )}
    >
      {(title || subtitle || actions) && (
        <div className={clsx(
          'border-b border-gray-200',
          padding === 'none' ? 'px-6 py-4' : paddingClasses[padding]
        )}>
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-medium text-gray-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={clsx(
        padding !== 'none' && paddingClasses[padding]
      )}>
        {children}
      </div>
    </div>
  )
}

export default Card
