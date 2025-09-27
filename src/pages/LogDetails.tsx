// src/pages/TripDetails.tsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  MapIcon,
  ClockIcon,
  TruckIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  PlayIcon,
  StopIcon,
  PauseIcon
} from '@heroicons/react/24/outline'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import RouteMap from '@/components/maps/RouteMap'
import { tripService } from '@/api/services'

interface Location {
  id: number
  address: string
  latitude: string
  longitude: string
  city: string
  state: string
  country: string
  postal_code: string
  display_address: string
}

interface RouteSegment {
  id: number
  sequence_order: number
  start_location: Location
  end_location: Location
  distance_miles: string
  estimated_time_hours: string
  geometry: any
}

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

interface TripDetail {
  id: number
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  current_location: string
  pickup_location: string
  dropoff_location: string
  total_distance_miles: number
  estimated_duration_hours: number
  driver?: {
    id: number
    name: string
    license_number: string
  }
  vehicle?: {
    id: number
    license_plate: string
    make: string
    model: string
  }
  segments: RouteSegment[]
  eld_logs: ELDLog[]
  compliance_status: {
    is_compliant: boolean
    violations: string[]
  }
  notes?: string
}

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<TripDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (id) {
      fetchTripDetails(parseInt(id))
    }
  }, [id])

  const fetchTripDetails = async (tripId: number) => {
    try {
      setIsLoading(true)
      // For demo purposes, using sample data
      const sampleTrip: TripDetail = {
        id: tripId,
        status: 'in_progress',
        created_at: '2025-09-25T10:30:00Z',
        current_location: '1234 Main St, Jacksonville, FL 32201',
        pickup_location: '5678 Industrial Blvd, Jacksonville, FL 32254',
        dropoff_location: '9999 Ocean Drive, Miami, FL 33139',
        total_distance_miles: 347.2,
        estimated_duration_hours: 6.5,
        driver: {
          id: 1,
          name: 'David Johnson',
          license_number: 'FL11223344'
        },
        vehicle: {
          id: 1,
          license_plate: 'TEST002',
          make: 'Freightliner',
          model: 'Cascadia'
        },
        segments: [
          {
            id: 1,
            sequence_order: 1,
            start_location: {
              id: 1,
              address: '1234 Main St',
              latitude: '30.3322',
              longitude: '-81.6557',
              city: 'Jacksonville',
              state: 'FL',
              country: 'US',
              postal_code: '32201',
              display_address: '1234 Main St, Jacksonville, FL 32201'
            },
            end_location: {
              id: 2,
              address: '5678 Industrial Blvd',
              latitude: '30.2672',
              longitude: '-81.5565',
              city: 'Jacksonville',
              state: 'FL',
              country: 'US',
              postal_code: '32254',
              display_address: '5678 Industrial Blvd, Jacksonville, FL 32254'
            },
            distance_miles: '12.4',
            estimated_time_hours: '0.5',
            geometry: null
          },
          {
            id: 2,
            sequence_order: 2,
            start_location: {
              id: 2,
              address: '5678 Industrial Blvd',
              latitude: '30.2672',
              longitude: '-81.5565',
              city: 'Jacksonville',
              state: 'FL',
              country: 'US',
              postal_code: '32254',
              display_address: '5678 Industrial Blvd, Jacksonville, FL 32254'
            },
            end_location: {
              id: 3,
              address: '9999 Ocean Drive',
              latitude: '25.7617',
              longitude: '-80.1918',
              city: 'Miami',
              state: 'FL',
              country: 'US',
              postal_code: '33139',
              display_address: '9999 Ocean Drive, Miami, FL 33139'
            },
            distance_miles: '334.8',
            estimated_time_hours: '6.0',
            geometry: null
          }
        ],
        eld_logs: [
          {
            id: 1,
            log_date: "2025-09-25",
            driver: {
              name: "David Johnson",
              license_number: "FL11223344"
            },
            vehicle: {
              license_plate: "TEST002",
              make: "Freightliner",
              model: "Cascadia"
            },
            totals: {
              drive_time: 5.5,
              on_duty_time: 7.25,
              off_duty_time: 16.75,
              miles_driven: 347.2
            },
            cycle_hours_used: 32.5,
            is_compliant: true,
            violations: "",
            duty_entries: [
              {
                duty_status: "OFF",
                start_time: "2025-09-25T00:00:00+00:00",
                end_time: "2025-09-25T08:00:00+00:00",
                duration_minutes: 480,
                location: "Home Terminal - Jacksonville FL",
                remarks: "Required 10-hour rest period"
              },
              {
                duty_status: "ON",
                start_time: "2025-09-25T08:00:00+00:00",
                end_time: "2025-09-25T08:30:00+00:00",
                duration_minutes: 30,
                location: "Home Terminal - Jacksonville FL",
                remarks: "Pre-trip inspection and paperwork"
              },
              {
                duty_status: "DRIVE",
                start_time: "2025-09-25T08:30:00+00:00",
                end_time: "2025-09-25T09:00:00+00:00",
                duration_minutes: 30,
                location: "Jacksonville FL to pickup location",
                remarks: "Driving to pickup"
              },
              {
                duty_status: "ON",
                start_time: "2025-09-25T09:00:00+00:00",
                end_time: "2025-09-25T10:45:00+00:00",
                duration_minutes: 105,
                location: "Pickup Location - Jacksonville FL",
                remarks: "Loading cargo - 25 pallets"
              },
              {
                duty_status: "DRIVE",
                start_time: "2025-09-25T10:45:00+00:00",
                end_time: null,
                duration_minutes: 270,
                location: "En route to Miami FL",
                remarks: "Currently driving to delivery location"
              }
            ]
          }
        ],
        compliance_status: {
          is_compliant: true,
          violations: []
        },
        notes: "High priority delivery - customer requested before 5 PM"
      }
      setTrip(sampleTrip)
    } catch (error) {
      console.error('Error fetching trip details:', error)
    } finally {
      setIsLoading(false)
    }
  }

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'planned': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-green-100 text-green-800',
    'completed': 'bg-gray-100 text-gray-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned':
        return <CalendarIcon className="h-5 w-5" />
      case 'in_progress':
        return <PlayIcon className="h-5 w-5" />
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />
      case 'cancelled':
        return <StopIcon className="h-5 w-5" />
      default:
        return <PauseIcon className="h-5 w-5" />
    }
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Ongoing'
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Trip Not Found</h3>
          <p className="text-gray-600 mb-4">The requested trip could not be found.</p>
          <Button onClick={() => navigate('/trip-planner')} variant="primary">
            Back to Trip Planner
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/trip-planner')}
            className="flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Trip #{trip.id}
            </h1>
            <p className="text-gray-600">
              Created {new Date(trip.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
            {getStatusIcon(trip.status)}
            <span className="ml-1 capitalize">{trip.status.replace('_', ' ')}</span>
          </div>
          <Button variant="outline">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: MapIcon },
            { id: 'route', label: 'Route Details', icon: MapPinIcon },
            { id: 'logs', label: 'ELD Logs', icon: DocumentTextIcon }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Trip Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Summary</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Route Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Route Information</h3>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-600">Current Location</p>
                        <p className="font-medium">{trip.current_location}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-600">Pickup Location</p>
                        <p className="font-medium">{trip.pickup_location}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm text-gray-600">Dropoff Location</p>
                        <p className="font-medium">{trip.dropoff_location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trip Metrics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Trip Metrics</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">
                        {trip.total_distance_miles.toFixed(1)}
                      </div>
                      <div className="text-sm text-blue-700">Miles</div>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-900">
                        {trip.estimated_duration_hours.toFixed(1)}
                      </div>
                      <div className="text-sm text-green-700">Hours</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver and Vehicle */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {trip.driver && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <UserIcon className="h-8 w-8 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Driver</h4>
                      <p className="text-sm text-gray-600">{trip.driver.name}</p>
                      <p className="text-xs text-gray-500">License: {trip.driver.license_number}</p>
                    </div>
                  </div>
                )}

                {trip.vehicle && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <TruckIcon className="h-8 w-8 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Vehicle</h4>
                      <p className="text-sm text-gray-600">{trip.vehicle.make} {trip.vehicle.model}</p>
                      <p className="text-xs text-gray-500">Plate: {trip.vehicle.license_plate}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              {trip.notes && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Trip Notes</h4>
                  <p className="text-sm text-yellow-700">{trip.notes}</p>
                </div>
              )}

              {/* Compliance Status */}
              <div className={`mt-6 p-4 rounded-lg border ${
                trip.compliance_status.is_compliant 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start">
                  {trip.compliance_status.is_compliant ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                  )}
                  <div>
                    <h4 className={`text-sm font-medium ${
                      trip.compliance_status.is_compliant ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {trip.compliance_status.is_compliant ? 'HOS Compliant' : 'Compliance Issues'}
                    </h4>
                    {trip.compliance_status.violations.length > 0 && (
                      <ul className="text-sm text-red-700 mt-1">
                        {trip.compliance_status.violations.map((violation, index) => (
                          <li key={index}>• {violation}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Route Tab */}
        {activeTab === 'route' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Route Map */}
            <Card title="Route Map" className="h-96">
              <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <RouteMap tripResult={{
                  segments: trip.segments,
                  eld_logs: trip.eld_logs
                }} />
              </div>
            </Card>

            {/* Route Segments */}
            <Card title="Route Segments" className="p-6">
              <div className="space-y-4">
                {trip.segments.map((segment, index) => (
                  <div key={segment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-medium">
                        {segment.sequence_order}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {segment.start_location.display_address}
                        </p>
                        <p className="text-sm text-gray-600">
                          to {segment.end_location.display_address}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {parseFloat(segment.distance_miles).toFixed(1)} mi
                      </p>
                      <p className="text-sm text-gray-600">
                        {parseFloat(segment.estimated_time_hours).toFixed(1)} hrs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ELD Logs Tab */}
        {activeTab === 'logs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card
              title="ELD Logs"
              actions={
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                {trip.eld_logs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {log.log_date}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {log.driver.name} • {log.vehicle.license_plate}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        log.is_compliant 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.is_compliant ? 'Compliant' : 'Non-Compliant'}
                      </div>
                    </div>

                    {/* Daily Totals */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-white rounded border">
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

                    {/* Current Status */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Current Status</h5>
                      <div className="space-y-1">
                        {log.duty_entries.slice(-1).map((entry, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded border-l-4 border-blue-500">
                            <div className="flex items-center space-x-3">
                              <div className={`px-2 py-1 rounded text-xs font-medium ${getDutyStatusColor(entry.duty_status)}`}>
                                {formatDutyStatus(entry.duty_status)}
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {formatTime(entry.start_time)}
                                  {entry.end_time && ` - ${formatTime(entry.end_time)}`}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {entry.location}
                                </div>
                              </div>
                            </div>
                            {!entry.end_time && (
                              <div className="text-xs text-green-600 font-medium">
                                ACTIVE
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/log-details/${log.id}`)}
                      >
                        <EyeIcon className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TripDetails
