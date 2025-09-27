// src/pages/ELDLogs.tsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  UserIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Input from '@/components/ui/Input'
import { eldService } from '@/api/services'

interface DutyEntry {
  duty_status: string
  start_time: string
  end_time: string | null
  duration_minutes: number
  location: string
  remarks: string
}

interface ELDLog {
  id: number
  log_date: string
  driver: {
    name: string
    license_number: string
  }
  vehicle: {
    license_plate: string
    make: string
    model: string
  }
  totals: {
    drive_time: number
    on_duty_time: number
    off_duty_time: number
    miles_driven: number
  }
  cycle_hours_used: number
  is_compliant: boolean
  violations: string
  duty_entries: DutyEntry[]
}

const ELDLogs: React.FC = () => {
  const [logs, setLogs] = useState<ELDLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCompliance, setFilterCompliance] = useState<'all' | 'compliant' | 'non-compliant'>('all')
  const [selectedLog, setSelectedLog] = useState<ELDLog | null>(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      // This would typically fetch all logs, for demo we'll use sample data
      const sampleLogs: ELDLog[] = [
        {
          id: 1,
          log_date: "2025-09-25",
          driver: {
            name: "Test David Johnson",
            license_number: "FL11223344"
          },
          vehicle: {
            license_plate: "TEST002",
            make: "Freightliner",
            model: "Cascadia"
          },
          totals: {
            drive_time: 8.5,
            on_duty_time: 10.25,
            off_duty_time: 13.75,
            miles_driven: 425.0
          },
          cycle_hours_used: 42.5,
          is_compliant: true,
          violations: "",
          duty_entries: [
            {
              duty_status: "OFF",
              start_time: "2025-09-25T00:00:00+00:00",
              end_time: "2025-09-25T06:00:00+00:00",
              duration_minutes: 360,
              location: "Rest Area - I-95 Mile 120",
              remarks: "10-hour rest period"
            },
            {
              duty_status: "ON",
              start_time: "2025-09-25T06:00:00+00:00",
              end_time: "2025-09-25T06:15:00+00:00",
              duration_minutes: 15,
              location: "Rest Area - I-95 Mile 120",
              remarks: "Pre-trip inspection"
            },
            {
              duty_status: "DRIVE",
              start_time: "2025-09-25T06:15:00+00:00",
              end_time: "2025-09-25T14:45:00+00:00",
              duration_minutes: 510,
              location: "Various locations",
              remarks: "Driving to delivery location"
            },
            {
              duty_status: "ON",
              start_time: "2025-09-25T14:45:00+00:00",
              end_time: "2025-09-25T16:00:00+00:00",
              duration_minutes: 75,
              location: "ABC Warehouse, Chicago IL",
              remarks: "Unloading cargo"
            },
            {
              duty_status: "OFF",
              start_time: "2025-09-25T16:00:00+00:00",
              end_time: null,
              duration_minutes: 480,
              location: "Truck Stop - Chicago IL",
              remarks: "Off duty rest"
            }
          ]
        },
        {
          id: 2,
          log_date: "2025-09-26",
          driver: {
            name: "Test David Johnson",
            license_number: "FL11223344"
          },
          vehicle: {
            license_plate: "TEST002",
            make: "Freightliner",
            model: "Cascadia"
          },
          totals: {
            drive_time: 9.75,
            on_duty_time: 12.0,
            off_duty_time: 12.0,
            miles_driven: 487.0
          },
          cycle_hours_used: 54.5,
          is_compliant: false,
          violations: "Exceeded 11-hour driving limit by 45 minutes",
          duty_entries: [
            {
              duty_status: "OFF",
              start_time: "2025-09-26T00:00:00+00:00",
              end_time: "2025-09-26T08:00:00+00:00",
              duration_minutes: 480,
              location: "Truck Stop - Chicago IL",
              remarks: "Required rest period"
            },
            {
              duty_status: "ON",
              start_time: "2025-09-26T08:00:00+00:00",
              end_time: "2025-09-26T08:30:00+00:00",
              duration_minutes: 30,
              location: "XYZ Distribution Center",
              remarks: "Loading new cargo"
            },
            {
              duty_status: "DRIVE",
              start_time: "2025-09-26T08:30:00+00:00",
              end_time: "2025-09-26T19:15:00+00:00",
              duration_minutes: 585,
              location: "Various locations",
              remarks: "Long haul driving - VIOLATION"
            },
            {
              duty_status: "OFF",
              start_time: "2025-09-26T19:15:00+00:00",
              end_time: null,
              duration_minutes: 285,
              location: "Rest Area - I-80 Mile 200",
              remarks: "Mandatory rest after violation"
            }
          ]
        }
      ]
      setLogs(sampleLogs)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return timeString
    }
  }

  const formatDutyStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'OFF': 'Off Duty',
      'ON': 'On Duty',
      'DRIVE': 'Driving',
      'SB': 'Sleeper Berth'
    }
    return statusMap[status] || status
  }

  const getDutyStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'OFF': 'bg-gray-100 text-gray-800',
      'ON': 'bg-blue-100 text-blue-800',
      'DRIVE': 'bg-green-100 text-green-800',
      'SB': 'bg-purple-100 text-purple-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.log_date.includes(searchTerm)

    const matchesCompliance =
      filterCompliance === 'all' ||
      (filterCompliance === 'compliant' && log.is_compliant) ||
      (filterCompliance === 'non-compliant' && !log.is_compliant)

    return matchesSearch && matchesCompliance
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ELD Logs</h1>
          <p className="text-gray-600 mt-1">
            Electronic Logging Device records and compliance monitoring
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button variant="primary">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by driver, vehicle, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterCompliance}
              onChange={(e) => setFilterCompliance(e.target.value as any)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="all">All Logs</option>
              <option value="compliant">Compliant Only</option>
              <option value="non-compliant">Non-Compliant Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {new Date(log.log_date).toLocaleDateString()}
                      </h3>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        log.is_compliant 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.is_compliant ? 'Compliant' : 'Non-Compliant'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {log.driver.name} ({log.driver.license_number})
                      </div>
                      <div className="flex items-center">
                        <TruckIcon className="h-4 w-4 mr-1" />
                        {log.vehicle.license_plate} - {log.vehicle.make} {log.vehicle.model}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    {selectedLog?.id === log.id ? 'Hide' : 'View'} Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {log.totals.drive_time.toFixed(1)}h
                  </div>
                  <div className="text-xs text-gray-600">Drive Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {log.totals.on_duty_time.toFixed(1)}h
                  </div>
                  <div className="text-xs text-gray-600">On Duty</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {log.totals.off_duty_time.toFixed(1)}h
                  </div>
                  <div className="text-xs text-gray-600">Off Duty</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {log.cycle_hours_used.toFixed(1)}h
                  </div>
                  <div className="text-xs text-gray-600">Cycle Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {log.totals.miles_driven.toFixed(0)} mi
                  </div>
                  <div className="text-xs text-gray-600">Miles</div>
                </div>
              </div>

              {/* Violations */}
              {!log.is_compliant && log.violations && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800 mb-1">Violations</h4>
                      <p className="text-sm text-red-700">{log.violations}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Duty Entries */}
              {selectedLog?.id === log.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t"
                >
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Duty Status Changes</h4>
                  <div className="space-y-2">
                    {log.duty_entries.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between py-3 px-4 bg-white rounded border-l-4 border-blue-500">
                        <div className="flex items-center space-x-4">
                          <div className={`px-3 py-1 rounded text-xs font-medium ${getDutyStatusColor(entry.duty_status)}`}>
                            {formatDutyStatus(entry.duty_status)}
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              {formatTime(entry.start_time)}
                              {entry.end_time && ` - ${formatTime(entry.end_time)}`}
                            </div>
                            <div className="text-xs text-gray-600">
                              {entry.location} • {Math.floor(entry.duration_minutes / 60)}h {entry.duration_minutes % 60}m
                            </div>
                          </div>
                        </div>
                        {entry.remarks && (
                          <div className="text-xs text-gray-500 italic max-w-xs">
                            {entry.remarks}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card className="p-8 text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ELD Logs Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterCompliance !== 'all'
              ? 'No logs match your current filters.'
              : 'ELD logs will appear here once trips are completed.'
            }
          </p>
        </Card>
      )}
    </div>
  )
}

export default ELDLogs
