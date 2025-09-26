import api from './client'
import type {
  Trip,
  TripCreateRequest,
  TripSummary,
  ELDLog,
  Driver,
  Vehicle,
  Location,
  GeocodeResult,
  HOSStatus,
  DashboardStats,
  ComplianceReport,
  RestArea,
  RouteAlert,
  PrintableELD,
  ApiResponse,
} from '@/types'

// Trip Services
export const tripService = {
  // Get all trips
  getTrips: async (): Promise<ApiResponse<TripSummary[]>> => {
    return api.get('/trips/')
  },

  // Get trip by ID
  getTrip: async (tripId: number): Promise<ApiResponse<Trip>> => {
    return api.get(`/trips/${tripId}/`)
  },

  // Create new trip
  createTrip: async (tripData: TripCreateRequest): Promise<ApiResponse<Trip>> => {
    return api.post('/trips/', tripData)
  },

  // Update trip
  updateTrip: async (tripId: number, tripData: Partial<Trip>): Promise<ApiResponse<Trip>> => {
    return api.patch(`/trips/${tripId}/`, tripData)
  },

  // Delete trip
  deleteTrip: async (tripId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/trips/${tripId}/`)
  },

  // Get trip route
  getTripRoute: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.get(`/trips/${tripId}/route/`)
  },

  // Get trip stops
  getTripStops: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.get(`/trips/${tripId}/stops/`)
  },

  // Generate ELD logs for trip
  generateELDLogs: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.get(`/trips/${tripId}/eld_logs/`)
  },

  // Start trip
  startTrip: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.post(`/trips/${tripId}/start_trip/`)
  },

  // Complete trip
  completeTrip: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.post(`/trips/${tripId}/complete_trip/`)
  },

  // Cancel trip
  cancelTrip: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.post(`/trips/${tripId}/cancel_trip/`)
  },
}

// ELD Services
export const eldService = {
  // Get all ELD logs
  getLogs: async (params?: { driver_id?: number; start_date?: string; end_date?: string }): Promise<ApiResponse<ELDLog[]>> => {
    return api.get('/eld/logs/', params)
  },

  // Get ELD log by ID
  getLog: async (logId: number): Promise<ApiResponse<ELDLog>> => {
    return api.get(`/eld/logs/${logId}/`)
  },

  // Get duty entries for log
  getDutyEntries: async (logId: number): Promise<ApiResponse<any>> => {
    return api.get(`/eld/logs/${logId}/duty_entries/`)
  },

  // Certify ELD log
  certifyLog: async (logId: number, certificationData?: any): Promise<ApiResponse<any>> => {
    return api.post(`/eld/logs/${logId}/certify/`, certificationData)
  },

  // Uncertify ELD log
  uncertifyLog: async (logId: number): Promise<ApiResponse<any>> => {
    return api.post(`/eld/logs/${logId}/uncertify/`)
  },

  // Get violations for log
  getViolations: async (logId: number): Promise<ApiResponse<any>> => {
    return api.get(`/eld/logs/${logId}/violations/`)
  },

  // Check HOS compliance
  checkCompliance: async (hosData: {
    current_cycle_hours: number
    daily_drive_hours: number
    daily_duty_hours: number
  }): Promise<ApiResponse<HOSStatus>> => {
    return api.post('/eld/compliance/check/', hosData)
  },

  // Generate daily report
  getDailyReport: async (logId: number): Promise<ApiResponse<any>> => {
    return api.get(`/eld/reports/daily/${logId}/`)
  },

  // Generate trip report
  getTripReport: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.get(`/eld/reports/trip/${tripId}/`)
  },

  // Generate printable log
  getPrintableLog: async (logId: number, format: 'printable' | 'inspection' | 'csv' = 'printable'): Promise<ApiResponse<PrintableELD | string>> => {
    return api.get(`/eld/logs/${logId}/printable/`, { format })
  },
}

// Driver Services
export const driverService = {
  // Get all drivers
  getDrivers: async (params?: { is_active?: boolean; duty_status?: string; can_drive?: boolean }): Promise<ApiResponse<Driver[]>> => {
    return api.get('/drivers/', params)
  },

  // Get driver by ID
  getDriver: async (driverId: number): Promise<ApiResponse<Driver>> => {
    return api.get(`/drivers/${driverId}/`)
  },

  // Create driver
  createDriver: async (driverData: Partial<Driver>): Promise<ApiResponse<Driver>> => {
    return api.post('/drivers/', driverData)
  },

  // Update driver
  updateDriver: async (driverId: number, driverData: Partial<Driver>): Promise<ApiResponse<Driver>> => {
    return api.patch(`/drivers/${driverId}/`, driverData)
  },

  // Certify driver logs
  certifyLogs: async (driverId: number, certificationData?: any): Promise<ApiResponse<any>> => {
    return api.post(`/drivers/${driverId}/certify_logs/`, certificationData)
  },

  // Change duty status
  changeDutyStatus: async (driverId: number, statusData: {
    new_status: string
    location?: string
    latitude?: number
    longitude?: number
    odometer_reading?: number
    remarks?: string
  }): Promise<ApiResponse<any>> => {
    return api.post(`/drivers/${driverId}/change_duty_status/`, statusData)
  },

  // Get HOS status
  getHOSStatus: async (driverId: number): Promise<ApiResponse<any>> => {
    return api.get(`/drivers/${driverId}/hos_status/`)
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    return api.get('/drivers/dashboard_stats/')
  },
}

// Vehicle Services
export const vehicleService = {
  // Get all vehicles
  getVehicles: async (params?: { is_active?: boolean; vehicle_type?: string }): Promise<ApiResponse<Vehicle[]>> => {
    return api.get('/vehicles/', params)
  },

  // Get vehicle by ID
  getVehicle: async (vehicleId: number): Promise<ApiResponse<Vehicle>> => {
    return api.get(`/vehicles/${vehicleId}/`)
  },

  // Create vehicle
  createVehicle: async (vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> => {
    return api.post('/vehicles/', vehicleData)
  },

  // Update vehicle
  updateVehicle: async (vehicleId: number, vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> => {
    return api.patch(`/vehicles/${vehicleId}/`, vehicleData)
  },

  // Update odometer
  updateOdometer: async (vehicleId: number, odometerData: {
    new_reading: number
    location?: string
  }): Promise<ApiResponse<any>> => {
    return api.post(`/vehicles/${vehicleId}/update_odometer/`, odometerData)
  },

  // Get vehicle status
  getVehicleStatus: async (vehicleId: number): Promise<ApiResponse<any>> => {
    return api.get(`/vehicles/${vehicleId}/vehicle_status/`)
  },
}

// Mapping Services
export const mappingService = {
  // Geocode address
  geocodeAddress: async (address: string): Promise<ApiResponse<GeocodeResult>> => {
    return api.post('/geocode/', { address })
  },

  // Calculate route
  calculateRoute: async (waypoints: Array<{ latitude: number; longitude: number }>): Promise<ApiResponse<any>> => {
    return api.post('/routes/calculate/', { waypoints })
  },

  // Optimize route
  optimizeRoute: async (stops: Array<{ latitude: number; longitude: number }>, optimizationType?: string): Promise<ApiResponse<any>> => {
    return api.post('/routes/optimize/', { stops, optimization_type: optimizationType || 'time' })
  },

  // Get traffic data
  getTrafficData: async (latitude: number, longitude: number): Promise<ApiResponse<any>> => {
    return api.get('/routes/traffic/', { lat: latitude, lng: longitude })
  },

  // Check restrictions
  checkRestrictions: async (waypoints: string): Promise<ApiResponse<any>> => {
    return api.get('/routes/restrictions/', { waypoints })
  },
}

// Rest Area Services
export const restAreaService = {
  // Get all rest areas
  getRestAreas: async (params?: { amenities?: string; state?: string }): Promise<ApiResponse<RestArea[]>> => {
    return api.get('/routes/rest-areas/', params)
  },

  // Get rest area by ID
  getRestArea: async (restAreaId: number): Promise<ApiResponse<RestArea>> => {
    return api.get(`/routes/rest-areas/${restAreaId}/`)
  },
}

// Route Alert Services
export const routeAlertService = {
  // Get all route alerts
  getRouteAlerts: async (params?: { alert_type?: string; severity?: string }): Promise<ApiResponse<RouteAlert[]>> => {
    return api.get('/routes/alerts/', params)
  },

  // Get route alert by ID
  getRouteAlert: async (alertId: number): Promise<ApiResponse<RouteAlert>> => {
    return api.get(`/routes/alerts/${alertId}/`)
  },
}

// Dashboard Services
export const dashboardService = {
  // Get fleet dashboard data
  getFleetDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    return api.get('/fleet-dashboard/')
  },

  // Get compliance report
  getComplianceReport: async (days?: number): Promise<ApiResponse<ComplianceReport>> => {
    return api.get('/compliance-report/', { days: days || 7 })
  },

  // Get system info
  getSystemInfo: async (): Promise<ApiResponse<any>> => {
    return api.get('/system-info/')
  },

  // Bulk driver operations
  bulkDriverOperations: async (operation: string, driverIds: number[]): Promise<ApiResponse<any>> => {
    return api.post('/bulk-driver-operations/', { operation, driver_ids: driverIds })
  },
}

// Utility Services
export const utilityService = {
  // Get duty status options
  getDutyStatusOptions: async (): Promise<ApiResponse<any>> => {
    return api.get('/duty-status-options/')
  },

  // Get HOS rules info
  getHOSRulesInfo: async (): Promise<ApiResponse<any>> => {
    return api.get('/hos-rules/')
  },

  // Health check
  healthCheck: async (): Promise<ApiResponse<any>> => {
    return api.get('/health/')
  },
}

// File Upload Service
export const uploadService = {
  // Upload ELD document
  uploadELDDocument: async (file: File, documentData: any): Promise<ApiResponse<any>> => {
    const formData = new FormData()
    formData.append('file', file)
    Object.keys(documentData).forEach(key => {
      formData.append(key, documentData[key])
    })

    return api.post('/eld/documents/', formData)
  },

  // Upload driver signature
  uploadDriverSignature: async (driverId: number, signatureData: string): Promise<ApiResponse<any>> => {
    return api.post(`/drivers/${driverId}/signature/`, { signature_data: signatureData })
  },
}

// Export all services as a single object for convenience
export const apiServices = {
  trip: tripService,
  eld: eldService,
  driver: driverService,
  vehicle: vehicleService,
  mapping: mappingService,
  restArea: restAreaService,
  routeAlert: routeAlertService,
  dashboard: dashboardService,
  utility: utilityService,
  upload: uploadService,
}

export default apiServices
