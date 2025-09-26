import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
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
} from '@heroicons/react/24/outline'

// API Services
import { tripService, driverService, vehicleService, eldService } from '@/api/services'

// Components
import {
  Card,
  Button,
  LoadingSpinner,
  Input,
  Select,
  ErrorMessage,
  LoadingButton,
} from '@/components/ui'

// Types
import type { TripCreateRequest, Driver, Vehicle, HOSStatus } from '@/types'

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

const TripPlanner: React.FC = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [hosStatus, setHosStatus] = useState<HOSStatus | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<TripFormData>({
    mode: 'onChange',
    defaultValues: {
      currentCycleHours: 0,
      currentDailyDriveHours: 0,
      currentDailyDutyHours: 0,
    },
  })

  const watchedValues = watch()

  // Fetch drivers and vehicles
  const { data: drivers = [] } = useQuery(
    'active-drivers',
    async () => {
      const response = await driverService.getDrivers({ is_active: true })
      return response.data || []
    }
  )

  const { data: vehicles = [] } = useQuery(
    'active-vehicles',
    async () => {
      const response = await vehicleService.getVehicles({ is_active: true })
      return response.data || []
    }
  )

  // HOS Compliance Check
  const { mutate: checkHOSCompliance, isLoading: isCheckingHOS } = useMutation(
    async (data: { current_cycle_hours: number; daily_drive_hours: number; daily_duty_hours: number }) => {
      const response = await eldService.checkCompliance(data)
      if (response.error) throw new Error(response.error)
      return response.data
    },
    {
      onSuccess: (data) => {
        setHosStatus(data)
      },
      onError: (error) => {
        toast.error(`HOS check failed: ${error}`)
      },
    }
  )

  // Create Trip
  const { mutate: createTrip, isLoading: isCreatingTrip } = useMutation(
    async (tripData: TripCreateRequest) => {
      const response = await tripService.createTrip(tripData)
      if (response.error) throw new Error(response.error)
      return response.data
    },
    {
      onSuccess: (data) => {
        toast.success('Trip created successfully!')
        navigate(`/trips/${data.id}`)
      },
      onError: (error) => {
        toast.error(`Failed to create trip: ${error}`)
      },
    }
  )

  const handleStepNext = async () => {
    const isStepValid = await trigger()
    if (isStepValid) {
      if (currentStep === 2) {
        // Check HOS compliance before proceeding
        checkHOSCompliance({
          current_cycle_hours: watchedValues.currentCycleHours,
          daily_drive_hours: watchedValues.currentDailyDriveHours,
          daily_duty_hours: watchedValues.currentDailyDutyHours,
        })
      }
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const handleStepBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = (data: TripFormData) => {
    const tripData: TripCreateRequest = {
      current_location: data.currentLocation,
      pickup_location: data.pickupLocation,
      dropoff_location: data.dropoffLocation,
      current_cycle_hours: data.currentCycleHours,
      current_daily_drive_hours: data.currentDailyDriveHours,
      current_daily_duty_hours: data.currentDailyDutyHours,
      driver_id: data.driverId,
      vehicle_id: data.vehicleId,
      notes: data.notes,
    }

    createTrip(tripData)
  }

  const isLoading = isCheckingHOS || isCreatingTrip

  const stepTitles = [
    'Route Information',
    'Hours of Service',
    'Driver & Vehicle',
    'Review & Create'
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Trip Planner</h1>
        <p className="mt-2 text-gray-600">
          Plan FMCSA compliant routes with automatic ELD log generation
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${currentStep >= step
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {step}
              </div>
              <div className="hidden sm:block ml-2 mr-4">
                <p className={`text-sm font-medium ${currentStep >= step ? 'text-primary-600' : 'text-gray-400'}`}>
                  {stepTitles[step - 1]}
                </p>
              </div>
              {step < 4 && (
                <div
                  className={`
                    w-16 h-1 mx-2
                    ${currentStep > step ? 'bg-primary-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    {...register('currentLocation', {
                      required: 'Current location is required'
                    })}
                    placeholder="Enter your current location"
                    error={errors.currentLocation?.message}
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
                    {...register('pickupLocation', {
                      required: 'Pickup location is required'
                    })}
                    placeholder="Enter pickup address"
                    error={errors.pickupLocation?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dropoff Location *
                  </label>
                  <Input
                    {...register('dropoffLocation', {
                      required: '
