import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  MapIcon,
  ClockIcon,
  TruckIcon,
  UserIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

// API Services
import { dashboardService, driverService, vehicleService } from '@/api/services'

// Components
import Card from '@/components/ui/Card'
import StatsCard from '@/components/ui/StatsCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'

// Types
interface DashboardStats {
  dashboard_data: {
    totals: {
      drivers: number
      vehicles: number
      companies: number
    }
    active: {
      drivers: number
      vehicles: number
      companies: number
    }
    availability: {
      available_drivers: number
      utilization_rate: number
    }
    compliance: {
      cycle_warnings: number
      cycle_violations: number
      compliance_rate: number
    }
    recent_activity: {
      certifications_24h: number
    }
    alerts: {
      high_priority: number
      medium_priority: number
      needs_attention: number
    }
  }
}

interface RecentActivity {
  id: string
  type: 'trip_started' | 'trip_completed' | 'log_certified' | 'violation_detected'
  driver: string
  message: string
  time: string
  status: 'success' | 'warning' | 'error'
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch dashboard stats
        const statsResponse = await dashboardService.getFleetDashboard()
        if (statsResponse.error) {
          throw new Error(statsResponse.error)
        }
        setStats(statsResponse.data)

        // Mock recent activity data - in production this would come from the API
        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'trip_completed',
            driver: 'John Smith',
            message: 'Completed trip from LA to Phoenix',
            time: '2 hours ago',
            status: 'success'
          },
          {
            id: '2',
            type: 'log_certified',
            driver: 'Maria Rodriguez',
            message: 'Certified daily log for 09/26/2025',
            time: '3 hours ago',
            status: 'success'
          },
          {
            id: '3',
            type: 'violation_detected',
            driver: 'David Johnson',
            message: 'HOS violation detected - cycle hours exceeded',
            time: '5 hours ago',
            status: 'error'
          },
          {
            id: '4',
            type: 'trip_started',
            driver: 'Sarah Wilson',
            message: 'Started trip from Dallas to Houston',
            time: '6 hours ago',
            status: 'success'
          }
        ]
        setRecentActivity(mockActivity)

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trip_started':
      case 'trip_completed':
        return <TruckIcon className="h-5 w-5" />
      case 'log_certified':
        return <CheckCircleIcon className="h-5 w-5" />
      case 'violation_detected':
        return <ExclamationTriangleIcon className="h-5 w-5" />
      default:
        return <ClockIcon className="h-5 w-5" />
    }
  }

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage
          title="Dashboard Error"
          message={error}
          action={
            <button
              onClick={() => window.location.reload()}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Reload Dashboard
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Overview of your fleet operations and compliance status
          </p>
        </div>

        <div className="flex space-x-3">
          <button className="btn btn-outline">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Generate Report
          </button>
          <button className="btn btn-primary">
            <MapIcon className="h-5 w-5 mr-2" />
            Plan New Trip
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Drivers"
          value={stats?.dashboard_data.totals.drivers || 0}
          icon={<UserIcon />}
          trend={`${stats?.dashboard_data.active.drivers || 0} active`}
          trendColor="green"
        />

        <StatsCard
          title="Active Vehicles"
          value={stats?.dashboard_data.totals.vehicles || 0}
          icon={<TruckIcon />}
          trend={`${stats?.dashboard_data.active.vehicles || 0} in use`}
          trendColor="blue"
        />

        <StatsCard
          title="Available Drivers"
          value={stats?.dashboard_data.availability.available_drivers || 0}
          icon={<CheckCircleIcon />}
          trend={`${stats?.dashboard_data.availability.utilization_rate || 0}% utilization`}
          trendColor="green"
        />

        <StatsCard
          title="Compliance Rate"
          value={`${stats?.dashboard_data.compliance.compliance_rate || 0}%`}
          icon={<ChartBarIcon />}
          trend={stats?.dashboard_data.compliance.cycle_violations === 0 ? 'No violations' : `${stats?.dashboard_data.compliance.cycle_violations} violations`}
          trendColor={stats?.dashboard_data.compliance.cycle_violations === 0 ? 'green' : 'red'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Alerts */}
        <Card title="Compliance Alerts" className="h-fit">
          <div className="space-y-4">
            {stats?.dashboard_data.alerts.high_priority > 0 && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {stats.dashboard_data.alerts.high_priority} High Priority Alerts
                  </p>
                  <p className="text-xs text-red-600">Immediate attention required</p>
                </div>
              </div>
            )}

            {stats?.dashboard_data.alerts.medium_priority > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <ClockIcon className="h-5 w-5 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {stats.dashboard_data.alerts.medium_priority} Medium Priority Alerts
                  </p>
                  <p className="text-xs text-yellow-600">Review recommended</p>
                </div>
              </div>
            )}

            {stats?.dashboard_data.alerts.needs_attention > 0 && (
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <UserIcon className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {stats.dashboard_data.alerts.needs_attention} Items Need Attention
                  </p>
                  <p className="text-xs text-blue-600">Log certifications pending</p>
                </div>
              </div>
            )}

            {(!stats?.dashboard_data.alerts.high_priority &&
              !stats?.dashboard_data.alerts.medium_priority &&
              !stats?.dashboard_data.alerts.needs_attention) && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">All Clear</p>
                  <p className="text-xs text-green-600">No active compliance alerts</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" className="h-fit">
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`flex-shrink-0 ${getActivityStatusColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.driver} • {activity.time}</p>
                </div>
              </motion.div>
            ))}

            {recentActivity.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-left">
            <MapIcon className="h-6 w-6 text-red-600 mb-2" />
            <h3 className="font-medium text-gray-900">Plan New Trip</h3>
            <p className="text-sm text-gray-600">Create a new compliant trip plan</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-left">
            <ClockIcon className="h-6 w-6 text-red-600 mb-2" />
            <h3 className="font-medium text-gray-900">View ELD Logs</h3>
            <p className="text-sm text-gray-600">Review and certify daily logs</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-left">
            <ChartBarIcon className="h-6 w-6 text-red-600 mb-2" />
            <h3 className="font-medium text-gray-900">Compliance Report</h3>
            <p className="text-sm text-gray-600">Generate compliance reports</p>
          </button>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
