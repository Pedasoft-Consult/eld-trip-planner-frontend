import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TruckIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MapIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

// API Services
import { dashboardService, driverService } from '@/api/services'

// Components
import { LoadingSpinner, Card, StatsCard, Button, ErrorMessage } from '@/components/ui'
import { useAppStore } from '@store/useAppStore'

// Types
import type { DashboardStats } from '@/types'

const Dashboard: React.FC = () => {
  const { addNotification } = useAppStore()

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useQuery(
    'dashboard-stats',
    async () => {
      const response = await dashboardService.getFleetDashboard()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    {
      refetchInterval: 30000, // Refresh every 30 seconds
      onError: (error) => {
        console.error('Dashboard data fetch failed:', error)
      },
    }
  )

  // Fetch driver stats
  const {
    data: driverStats,
    isLoading: isDriverStatsLoading,
  } = useQuery(
    'driver-dashboard-stats',
    async () => {
      const response = await driverService.getDashboardStats()
      if (response.error) {
        throw new Error(response.error)
      }
      return response.data
    },
    {
      refetchInterval: 30000,
    }
  )

  // Show welcome notification on first load
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('dashboard-welcome-seen')
    if (!hasSeenWelcome && dashboardData) {
      setTimeout(() => {
        addNotification({
          type: 'info',
          title: 'Dashboard Loaded',
          message: 'Welcome to your ELD Trip Planner dashboard. All systems operational.',
        })
        localStorage.setItem('dashboard-welcome-seen', 'true')
      }, 1000)
    }
  }, [dashboardData, addNotification])

  const isLoading = isDashboardLoading || isDriverStatsLoading

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (dashboardError) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <ErrorMessage
          title="Failed to load dashboard"
          message="Unable to fetch dashboard data. Please check your connection and try again."
          action={
            <Button onClick={() => refetchDashboard()} variant="primary">
              Retry
            </Button>
          }
        />
      </div>
    )
  }

  const stats = dashboardData?.dashboard_data || driverStats
  const complianceRate = stats?.compliance?.compliance_rate || 0
  const cycleViolations = stats?.compliance?.cycle_violations || 0
  const availableDrivers = stats?.availability?.available_drivers || 0
  const totalDrivers = stats?.totals?.drivers || 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Fleet overview and real-time compliance monitoring
          </p>
        </div>

        <div className="flex space-x-3">
          <Link to="/trip-planner">
            <Button variant="primary" className="flex items-center">
              <MapIcon className="h-4 w-4 mr-2" />
              Plan Trip
            </Button>
          </Link>
          <Link to="/compliance">
            <Button variant="outline" className="flex items-center">
              <ChartBarIcon className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total Drivers"
          value={totalDrivers.toString()}
          icon={<UserGroupIcon className="h-8 w-8" />}
          trend={availableDrivers > 0 ? `${availableDrivers} available` : 'No drivers available'}
          trendColor={availableDrivers > 0 ? 'green' : 'red'}
        />

        <StatsCard
          title="Active Vehicles"
          value={stats?.totals?.vehicles?.toString() || '0'}
          icon={<TruckIcon className="h-8 w-8" />}
          trend="Fleet operational"
          trendColor="blue"
        />

        <StatsCard
          title="HOS Compliance"
          value={`${complianceRate}%`}
          icon={complianceRate >= 95 ?
            <CheckCircleIcon className="h-8 w-8" /> :
            <ExclamationTriangleIcon className="h-8 w-8" />
          }
          trend={complianceRate >= 95 ? 'Excellent' : 'Needs attention'}
          trendColor={complianceRate >= 95 ? 'green' : 'red'}
        />

        <StatsCard
          title="Violations"
          value={cycleViolations.toString()}
          icon={<ClockIcon className="h-8 w-8" />}
          trend={cycleViolations === 0 ? 'No violations' : 'Action required'}
          trendColor={cycleViolations === 0 ? 'green' : 'red'}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card title="Fleet Status" className="h-full">
            <div className="space-y-4">
              {/* Driver Status Breakdown */}
              <div>
                <h3 className="text-
