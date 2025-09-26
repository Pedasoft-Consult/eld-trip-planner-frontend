// src/components/ui/StatsCard.tsx
import React from 'react'
import { clsx } from 'clsx'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: string
  trendColor?: 'green' | 'red' | 'blue' | 'gray'
  className?: string
  onClick?: () => void
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendColor = 'gray',
  className,
  onClick
}) => {
  const getTrendIcon = () => {
    if (!trend) return null

    const isPositive = trendColor === 'green'
    const isNegative = trendColor === 'red'

    if (isPositive) {
      return <ArrowUpIcon className="h-4 w-4" />
    }
    if (isNegative) {
      return <ArrowDownIcon className="h-4 w-4" />
    }
    return null
  }

  const trendColorClasses = {
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    blue: 'text-blue-600 bg-blue-100',
    gray: 'text-gray-600 bg-gray-100'
  }

  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={clsx(
        'bg-white overflow-hidden shadow rounded-lg border border-gray-200',
        onClick && 'hover:shadow-md transition-shadow duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon && (
              <div className="p-3 bg-primary-100 rounded-md">
                <div className="h-6 w-6 text-primary-600">
                  {icon}
                </div>
              </div>
            )}
          </div>
          <div className={clsx('flex-1', icon && 'ml-5')}>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">
                {value}
              </p>
            </div>
            <h3 className="text-sm font-medium text-gray-500 truncate">
              {title}
            </h3>
          </div>
        </div>

        {trend && (
          <div className="mt-4">
            <div className={clsx(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              trendColorClasses[trendColor]
            )}>
              {getTrendIcon()}
              <span className={clsx(getTrendIcon() && 'ml-1')}>
                {trend}
              </span>
            </div>
          </div>
        )}
      </div>
    </Component>
  )
}

export default StatsCard
