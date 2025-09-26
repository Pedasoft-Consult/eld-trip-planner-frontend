// src/components/ui/ErrorMessage.tsx
import React from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface ErrorMessageProps {
  title?: string
  message: string
  action?: React.ReactNode
  className?: string
  variant?: 'default' | 'compact'
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  action,
  className,
  variant = 'default'
}) => {
  if (variant === 'compact') {
    return (
      <div className={clsx('flex items-center text-red-600', className)}>
        <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
    )
  }

  return (
    <div className={clsx('rounded-md bg-red-50 p-4', className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium text-red-800">
              {title}
            </h3>
          )}
          <div className={clsx('text-sm text-red-700', title && 'mt-2')}>
            <p>{message}</p>
          </div>
          {action && (
            <div className="mt-4">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
