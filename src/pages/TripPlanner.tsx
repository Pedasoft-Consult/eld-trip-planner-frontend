// Updated TripPlanner.tsx with proper ELD logs handling
// Replace the existing TripPlanner component with this updated version

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  MapIcon,
  ClockIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

// API Services
import { tripService, driverService, vehicleService, eldService } from '@/api/services'

// Components
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Input from '@/components/ui/Input'
import RouteMap from '@/components/maps/RouteMap'
import ErrorMessage from '@/components/ui/ErrorMessage'

// Types
interface TripFormData {
  currentLocation: string
  pickupLocation: string
  dropoffLocation: string
  currentCycleHours: number
  currentDailyDriveHours: number
  currentDailyDutyHours: number
  driverId?: number
  vehicleId?: number
  notes?: string
}

interface HOSStatus {
  can_drive: boolean
  available_drive_hours?: number
  available_duty_hours?: number
  remaining_cycle_hours?: number
  needs_restart: boolean
  reason?: string
}

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

// Updated ELD Log interfaces to match API response
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

interface ELDLogsResponse {
  trip_id: number
  logs: ELDLog[]
}

// Updated TripResult interface to match actual API response
interface TripResult {
  id?: number
  trip_id?: number
  total_distance_miles?: number
  total_distance?: number
  estimated_duration_hours?: number
  estimated_duration?: number
  segments?: RouteSegment[]
  route?: {
    segments: RouteSegment[]
  }
  stops?: any[]
  eld_logs?: any[] // Keep as any[] to match RouteMap component expectation
  eld_logs_data?: ELDLogsResponse | ELDLog[] // Add separate property for typed ELD data
  compliance_status?: {
    is_compliant: boolean
    violations: string[]
  }
}

const TripPlanner: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<TripFormData>({
    currentLocation: '',
    pickupLocation: '',
    dropoffLocation: '',
    currentCycleHours: 0,
    currentDailyDriveHours: 0,
    currentDailyDutyHours: 0,
    notes: ''
  })
  const [hosStatus, setHosStatus] = useState<HOSStatus | null>(null)
  const [tripResult, setTripResult] = useState<TripResult | null>(null)
  const [drivers, setDrivers] = useState<any[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch drivers and vehicles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversResponse, vehiclesResponse] = await Promise.all([
          driverService.getDrivers({ is_active: true }),
          vehicleService.getVehicles({ is_active: true })
        ])

        // Handle drivers data - API returns paginated response with 'results' array
        if (driversResponse.data) {
          let driversData = []
          if (Array.isArray(driversResponse.data)) {
            driversData = driversResponse.data
          } else if (driversResponse.data && typeof driversResponse.data === 'object' && 'results' in driversResponse.data && Array.isArray((driversResponse.data as any).results)) {
            driversData = (driversResponse.data as any).results
          }
          setDrivers(driversData)
        } else {
          setDrivers([])
        }

        // Handle vehicles data - API returns direct array
        if (vehiclesResponse.data) {
          let vehiclesData = []
          if (Array.isArray(vehiclesResponse.data)) {
            vehiclesData = vehiclesResponse.data
          } else if (vehiclesResponse.data && typeof vehiclesResponse.data === 'object' && 'results' in vehiclesResponse.data && Array.isArray((vehiclesResponse.data as any).results)) {
            vehiclesData = (vehiclesResponse.data as any).results
          }
          setVehicles(vehiclesData)
        } else {
          setVehicles([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load drivers and vehicles')
        setDrivers([])
        setVehicles([])
      }
    }

    fetchData()
  }, [])

  // Validate form data
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.currentLocation.trim()) {
          newErrors.currentLocation = 'Current location is required'
        }
        if (!formData.pickupLocation.trim()) {
          newErrors.pickupLocation = 'Pickup location is required'
        }
        if (!formData.dropoffLocation.trim()) {
          newErrors.dropoffLocation = 'Dropoff location is required'
        }
        break
      case 2:
        if (formData.currentCycleHours < 0 || formData.currentCycleHours > 70) {
          newErrors.currentCycleHours = 'Cycle hours must be between 0 and 70'
        }
        if (formData.currentDailyDriveHours < 0 || formData.currentDailyDriveHours > 11) {
          newErrors.currentDailyDriveHours = 'Daily drive hours must be between 0 and 11'
        }
        if (formData.currentDailyDutyHours < 0 || formData.currentDailyDutyHours > 14) {
          newErrors.currentDailyDutyHours = 'Daily duty hours must be between 0 and 14'
        }
        if (formData.currentDailyDriveHours > formData.currentDailyDutyHours) {
          newErrors.currentDailyDriveHours = 'Drive hours cannot exceed duty hours'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleInputChange = (field: keyof TripFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Check HOS compliance
  const checkHOSCompliance = async () => {
    try {
      setIsLoading(true)
      const response = await eldService.checkCompliance({
        current_cycle_hours: formData.currentCycleHours,
        daily_drive_hours: formData.currentDailyDriveHours,
        daily_duty_hours: formData.currentDailyDutyHours
      })

      if (response.data && typeof response.data === 'object') {
        const hosData = {
          can_drive: response.data.can_drive ?? false,
          available_drive_hours: Number(response.data.available_drive_hours) || 0,
          available_duty_hours: Number(response.data.available_duty_hours) || 0,
          remaining_cycle_hours: Number(response.data.remaining_cycle_hours) || 0,
          needs_restart: response.data.needs_restart ?? false,
          reason: response.data.reason || 'Status determined by API'
        }
        setHosStatus(hosData)
      } else {
        const canDrive = formData.currentCycleHours < 70 &&
                        formData.currentDailyDriveHours < 11 &&
                        formData.currentDailyDutyHours < 14

        setHosStatus({
          can_drive: canDrive,
          available_drive_hours: Math.max(0, 11 - formData.currentDailyDriveHours),
          available_duty_hours: Math.max(0, 14 - formData.currentDailyDutyHours),
          remaining_cycle_hours: Math.max(0, 70 - formData.currentCycleHours),
          needs_restart: formData.currentCycleHours >= 70,
          reason: canDrive ? 'Driver can legally drive' : 'HOS limits exceeded'
        })
      }
    } catch (error) {
      console.error('Error checking HOS compliance:', error)
      toast.error('Failed to check HOS compliance')

      const canDrive = formData.currentCycleHours < 70 &&
                      formData.currentDailyDriveHours < 11 &&
                      formData.currentDailyDutyHours < 14

      setHosStatus({
        can_drive: canDrive,
        available_drive_hours: Math.max(0, 11 - formData.currentDailyDriveHours),
        available_duty_hours: Math.max(0, 14 - formData.currentDailyDutyHours),
        remaining_cycle_hours: Math.max(0, 70 - formData.currentCycleHours),
        needs_restart: formData.currentCycleHours >= 70,
        reason: canDrive ? 'Driver can legally drive' : 'HOS limits exceeded'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle step navigation
  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return
    }

    if (currentStep === 2) {
      await checkHOSCompliance()
    }

    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  // Submit trip planning request
 const handleSubmit = async () => {
  if (!validateStep(currentStep)) {
    return
  }

  try {
    setIsLoading(true)
    const response = await tripService.createTrip({
      current_location: formData.currentLocation,
      pickup_location: formData.pickupLocation,
      dropoff_location: formData.dropoffLocation,
      current_cycle_hours: formData.currentCycleHours,
      current_daily_drive_hours: formData.currentDailyDriveHours,
      current_daily_duty_hours: formData.currentDailyDutyHours,
      driver_id: formData.driverId,
      vehicle_id: formData.vehicleId,
      notes: formData.notes
    })

    if (response.data && typeof response.data === 'object') {
      console.log('API Response:', response.data)
      const apiData = response.data as any

      const tripResult: TripResult = {
        id: response.data.id,
        trip_id: response.data.id,
        total_distance_miles: Number(response.data.total_distance_miles) || 0,
        total_distance: Number(response.data.total_distance_miles) || 0,
        estimated_duration_hours: Number(response.data.estimated_duration_hours) || 0,
        estimated_duration: Number(response.data.estimated_duration_hours) || 0,
        segments: apiData.route_segments || apiData.segments || [],
        stops: apiData.stops || [],
        eld_logs: apiData.eld_logs || [], // Keep as any[] for RouteMap compatibility
        eld_logs_data: apiData.eld_logs_response || apiData.eld_logs || [], // Store actual ELD data
        compliance_status: apiData.compliance_status || {
          is_compliant: hosStatus?.can_drive ?? true,
          violations: hosStatus?.can_drive ? [] : ['HOS compliance issue detected']
        }
      }

      console.log('Processed Trip Result:', tripResult)
      setTripResult(tripResult)
      toast.success('Trip planned successfully!')
      setCurrentStep(4)
    } else {
      throw new Error(response.error || 'Failed to create trip - no data received')
    }
  } catch (error: any) {
    console.error('Error creating trip:', error)
    toast.error(error.message || 'Failed to plan trip')
  } finally {
    setIsLoading(false)
  }
}
  // Helper functions
  const getTotalDistance = () => {
    return tripResult?.total_distance_miles || tripResult?.total_distance || 0
  }

  const getTotalDuration = () => {
    return tripResult?.estimated_duration_hours || tripResult?.estimated_duration || 0
  }

  // Helper function to get ELD logs array from different response formats
const getELDLogs = (): ELDLog[] => {
  if (!tripResult?.eld_logs_data) return []

  // Handle the actual API response structure
  if (Array.isArray(tripResult.eld_logs_data)) {
    return tripResult.eld_logs_data as ELDLog[]
  } else if (typeof tripResult.eld_logs_data === 'object' && 'logs' in tripResult.eld_logs_data) {
    return (tripResult.eld_logs_data as ELDLogsResponse).logs
  }

  return []
}

  // Format time for display
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

  // Format duty status for display
  const formatDutyStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'OFF': 'Off Duty',
      'ON': 'On Duty',
      'DRIVE': 'Driving',
      'SB': 'Sleeper Berth'
    }
    return statusMap[status] || status
  }

  const stepTitles = [
    'Route Information',
    'Hours of Service',
    'Driver & Vehicle',
    'Trip Results'
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">ELD Trip Planner</h1>
        <p className="mt-2 text-gray-600">
          Plan FMCSA compliant routes with automatic ELD log generation
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${currentStep >= step
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {step}
              </div>
              <div className="hidden sm:block ml-2 mr-4">
                <p className={`text-sm font-medium ${currentStep >= step ? 'text-red-600' : 'text-gray-400'}`}>
                  {stepTitles[step - 1]}
                </p>
              </div>
              {step < 4 && (
                <div
                  className={`
                    w-16 h-1 mx-2
                    ${currentStep > step ? 'bg-red-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {/* Step 1: Route Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card title="Route Information" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Location *
                  </label>
                  <Input
                    type="text"
                    value={formData.currentLocation}
                    onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                    placeholder="Enter your current location"
                    error={errors.currentLocation}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use full address for accurate routing (e.g., "123 Main St, Chicago, IL 60601")
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location *
                  </label>
                  <Input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    placeholder="Enter pickup address"
                    error={errors.pickupLocation}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dropoff Location *
                  </label>
                  <Input
                    type="text"
                    value={formData.dropoffLocation}
                    onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                    placeholder="Enter dropoff address"
                    error={errors.dropoffLocation}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  variant="primary"
                  className="flex items-center"
                >
                  Next Step
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Hours of Service */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card title="Hours of Service Status" className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800">
                      Enter Current HOS Status
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Provide accurate hours for compliance checking and route planning
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Cycle Hours (0-70) *
                  </label>
                  <Input
                    type="number"
                    step="0.25"
                    min="0"
                    max="70"
                    value={formData.currentCycleHours}
                    onChange={(e) => handleInputChange('currentCycleHours', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    error={errors.currentCycleHours}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Drive Hours (0-11)
                  </label>
                  <Input
                    type="number"
                    step="0.25"
                    min="0"
                    max="11"
                    value={formData.currentDailyDriveHours}
                    onChange={(e) => handleInputChange('currentDailyDriveHours', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    error={errors.currentDailyDriveHours}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Duty Hours (0-14)
                  </label>
                  <Input
                    type="number"
                    step="0.25"
                    min="0"
                    max="14"
                    value={formData.currentDailyDutyHours}
                    onChange={(e) => handleInputChange('currentDailyDutyHours', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    error={errors.currentDailyDutyHours}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex items-center"
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  variant="primary"
                  className="flex items-center"
                  loading={isLoading}
                >
                  Check Compliance
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Driver & Vehicle Selection */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card title="Driver & Vehicle Selection" className="space-y-6">
              {/* HOS Status Display */}
              {hosStatus && (
                <div className={`p-4 rounded-lg border ${
                  hosStatus.can_drive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start">
                    {hosStatus.can_drive ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                    )}
                    <div>
                      <h3 className={`text-sm font-medium ${
                        hosStatus.can_drive ? 'text-green-800' : 'text-red-800'
                      }`}>
                        HOS Compliance Status
                      </h3>
                      <p className={`text-sm mt-1 ${
                        hosStatus.can_drive ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {hosStatus.can_drive ? 'Driver can legally drive' : hosStatus.reason}
                      </p>
                      <div className="mt-2 grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Available Drive: </span>
                          {(hosStatus.available_drive_hours ?? 0).toFixed(1)}h
                        </div>
                        <div>
                          <span className="font-medium">Available Duty: </span>
                          {(hosStatus.available_duty_hours ?? 0).toFixed(1)}h
                        </div>
                        <div>
                          <span className="font-medium">Cycle Remaining: </span>
                          {(hosStatus.remaining_cycle_hours ?? 0).toFixed(1)}h
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver (Optional)
                  </label>
                  <select
                    value={formData.driverId || ''}
                    onChange={(e) => handleInputChange('driverId', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="">Select a driver</option>
                    {Array.isArray(drivers) && drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name || driver.full_display_name} ({driver.license_number})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle (Optional)
                  </label>
                  <select
                    value={formData.vehicleId || ''}
                    onChange={(e) => handleInputChange('vehicleId', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="">Select a vehicle</option>
                    {Array.isArray(vehicles) && vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.display_name || `${vehicle.license_plate} - ${vehicle.make} ${vehicle.model}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any additional notes about this trip..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex items-center"
                >
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  className="flex items-center"
                  loading={isLoading}
                  disabled={!hosStatus?.can_drive}
                >
                  Plan Trip
                  <TruckIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Trip Results */}
        {currentStep === 4 && tripResult && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-6">
              {/* Trip Summary */}
              <Card title="Trip Summary" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {getTotalDistance().toFixed(1)} mi
                    </div>
                    <div className="text-sm text-gray-600">Total Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {getTotalDuration().toFixed(1)} hrs
                    </div>
                    <div className="text-sm text-gray-600">Estimated Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {getELDLogs().length}
                    </div>
                    <div className="text-sm text-gray-600">ELD Log Days</div>
                  </div>
                </div>

                {/* Compliance Status */}
                <div className={`p-4 rounded-lg border ${
                  tripResult.compliance_status?.is_compliant 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-start">
                    {tripResult.compliance_status?.is_compliant ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                    ) : (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                    )}
                    <div>
                      <h3 className={`text-sm font-medium ${
                        tripResult.compliance_status?.is_compliant ? 'text-green-800' : 'text-yellow-800'
                      }`}>
                        {tripResult.compliance_status?.is_compliant ? 'Trip is HOS Compliant' : 'Compliance Warnings'}
                      </h3>
                      {tripResult.compliance_status?.violations && tripResult.compliance_status.violations.length > 0 && (
                        <ul className="text-sm text-yellow-700 mt-1">
                          {tripResult.compliance_status.violations.map((violation, index) => (
                            <li key={index}>• {violation}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Interactive Map */}
              <Card title="Route Map" className="h-96">
                <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                   <RouteMap tripResult={tripResult} />
                </div>
              </Card>

              {/* ELD Logs - Updated to handle actual API response structure */}
              <Card
                title="ELD Daily Log Sheets"
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
                  {getELDLogs().length > 0 ? (
                    getELDLogs().map((log: ELDLog, index: number) => (
                      <div key={log.id || index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {log.log_date}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {log.driver?.name} • {log.vehicle?.license_plate} ({log.vehicle?.make} {log.vehicle?.model})
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
                              {log.totals?.drive_time?.toFixed(1) || '0.0'}h
                            </div>
                            <div className="text-xs text-gray-600">Drive Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                              {log.totals?.on_duty_time?.toFixed(1) || '0.0'}h
                            </div>
                            <div className="text-xs text-gray-600">On Duty</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                              {log.cycle_hours_used?.toFixed(1) || '0.0'}h
                            </div>
                            <div className="text-xs text-gray-600">Cycle Hours</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                              {log.totals?.miles_driven?.toFixed(0) || '0'} mi
                            </div>
                            <div className="text-xs text-gray-600">Miles</div>
                          </div>
                        </div>

                        {/* Duty Status Entries */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Duty Status Changes</h5>
                          <div className="space-y-1">
                            {log.duty_entries?.map((entry: DutyEntry, entryIndex: number) => (
                              <div key={entryIndex} className="flex items-center justify-between py-2 px-3 bg-white rounded border-l-4 border-blue-500">
                                <div className="flex items-center space-x-3">
                                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                                    entry.duty_status === 'DRIVE' ? 'bg-green-100 text-green-800' :
                                    entry.duty_status === 'ON' ? 'bg-blue-100 text-blue-800' :
                                    entry.duty_status === 'OFF' ? 'bg-gray-100 text-gray-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {formatDutyStatus(entry.duty_status)}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">
                                      {formatTime(entry.start_time)}
                                      {entry.end_time && ` - ${formatTime(entry.end_time)}`}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {entry.location} • {entry.duration_minutes} min
                                    </div>
                                  </div>
                                </div>
                                {entry.remarks && (
                                  <div className="text-xs text-gray-500 italic">
                                    {entry.remarks}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Violations */}
                        {log.violations && log.violations.trim() !== '' && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                            <h6 className="text-sm font-medium text-red-800 mb-1">Violations</h6>
                            <p className="text-sm text-red-700">{log.violations}</p>
                          </div>
                        )}

                        {/* Action buttons for individual logs */}
                        <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
                          <Button variant="outline" size="sm">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">ELD logs will be generated automatically</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Complete the trip planning to generate detailed daily log sheets
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  onClick={() => {
                    setCurrentStep(1)
                    setTripResult(null)
                    setHosStatus(null)
                    setFormData({
                      currentLocation: '',
                      pickupLocation: '',
                      dropoffLocation: '',
                      currentCycleHours: 0,
                      currentDailyDriveHours: 0,
                      currentDailyDutyHours: 0,
                      notes: ''
                    })
                  }}
                  variant="outline"
                >
                  Plan Another Trip
                </Button>
                <div className="space-x-2">
                  <Button variant="outline">
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Export Trip
                  </Button>
                  <Button variant="primary">
                    <MapIcon className="h-4 w-4 mr-1" />
                    Start Trip
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TripPlanner
