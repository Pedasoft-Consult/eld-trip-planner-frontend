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

// Trip Services - Fixed URL patterns
export const tripService = {
  // Get all trips
  getTrips: async (): Promise<ApiResponse<TripSummary[]>> => {
    return api.get('/api/v1/trips/')
  },

  // Get trip by ID
  getTrip: async (tripId: number): Promise<ApiResponse<Trip>> => {
    return api.get(`/api/v1/trips/${tripId}/`)
  },

  // Create new trip
  createTrip: async (tripData: TripCreateRequest): Promise<ApiResponse<Trip>> => {
    return api.post('/api/v1/trips/', tripData)
  },

  // Update trip
  updateTrip: async (tripId: number, tripData: Partial<Trip>): Promise<ApiResponse<Trip>> => {
    return api.patch(`/api/v1/trips/${tripId}/`, tripData)
  },

  // Delete trip
  deleteTrip: async (tripId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/v1/trips/${tripId}/`)
  },

  // Get trip route
  getTripRoute: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.get(`/api/v1/trips/${tripId}/route/`)
  },

  // Get trip stops
  getTripStops: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.get(`/api/v1/trips/${tripId}/stops/`)
  },

  // Generate ELD logs for trip
  generateELDLogs: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.get(`/api/v1/trips/${tripId}/eld_logs/`)
  },

  // Start trip
  startTrip: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.post(`/api/v1/trips/${tripId}/start_trip/`)
  },

  // Complete trip
  completeTrip: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.post(`/api/v1/trips/${tripId}/complete_trip/`)
  },

  // Cancel trip
  cancelTrip: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.post(`/api/v1/trips/${tripId}/cancel_trip/`)
  },
}

// ELD Services - Fixed URL patterns
export const eldService = {
  // Get all ELD logs
  getLogs: async (params?: { driver_id?: number; start_date?: string; end_date?: string }): Promise<ApiResponse<ELDLog[]>> => {
    return api.get('/api/v1/eld/logs/', params)
  },

  // Get ELD log by ID
  getLog: async (logId: number): Promise<ApiResponse<ELDLog>> => {
    return api.get(`/api/v1/eld/logs/${logId}/`)
  },

  // Get duty entries for log
  getDutyEntries: async (logId: number): Promise<ApiResponse<any>> => {
    return api.get(`/api/v1/eld/logs/${logId}/duty_entries/`)
  },

  // Certify ELD log
  certifyLog: async (logId: number, certificationData?: any): Promise<ApiResponse<any>> => {
    return api.post(`/api/v1/eld/logs/${logId}/certify/`, certificationData)
  },

  // Uncertify ELD log
  uncertifyLog: async (logId: number): Promise<ApiResponse<any>> => {
    return api.post(`/api/v1/eld/logs/${logId}/uncertify/`)
  },

  // Get violations for log
  getViolations: async (logId: number): Promise<ApiResponse<any>> => {
    return api.get(`/api/v1/eld/logs/${logId}/violations/`)
  },

  // Check HOS compliance
  checkCompliance: async (hosData: {
    current_cycle_hours: number
    daily_drive_hours: number
    daily_duty_hours: number
  }): Promise<ApiResponse<HOSStatus>> => {
    return api.post('/api/v1/eld/compliance/check/', hosData)
  },

  // Generate daily report
  getDailyReport: async (logId: number): Promise<ApiResponse<any>> => {
    return api.get(`/api/v1/eld/reports/daily/${logId}/`)
  },

  // Generate trip report
  getTripReport: async (tripId: number): Promise<ApiResponse<any>> => {
    return api.get(`/api/v1/eld/reports/trip/${tripId}/`)
  },

  // Generate printable log
  getPrintableLog: async (logId: number, format: 'printable' | 'inspection' | 'csv' = 'printable'): Promise<ApiResponse<PrintableELD | string>> => {
    return api.get(`/api/v1/eld/logs/${logId}/printable/`, { format })
  },
}

// Driver Services - FIXED: Corrected URL patterns to match Django URLs
export const driverService = {
  // Get all drivers
  getDrivers: async (params?: { is_active?: boolean; duty_status?: string; can_drive?: boolean }): Promise<ApiResponse<Driver[]>> => {
    return api.get('/health/api/drivers/', params)
  },

  // Get driver by ID
  getDriver: async (driverId: number): Promise<ApiResponse<Driver>> => {
    return api.get(`/health/api/drivers/${driverId}/`)
  },

  // Create driver
  createDriver: async (driverData: Partial<Driver>): Promise<ApiResponse<Driver>> => {
    return api.post('/health/api/drivers/', driverData)
  },

  // Update driver
  updateDriver: async (driverId: number, driverData: Partial<Driver>): Promise<ApiResponse<Driver>> => {
    return api.patch(`/health/api/drivers/${driverId}/`, driverData)
  },

  // Certify driver logs
  certifyLogs: async (driverId: number, certificationData?: any): Promise<ApiResponse<any>> => {
    return api.post(`/health/api/drivers/${driverId}/certify_logs/`, certificationData)
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
    return api.post(`/health/api/drivers/${driverId}/change_duty_status/`, statusData)
  },

  // Get HOS status
  getHOSStatus: async (driverId: number): Promise<ApiResponse<any>> => {
    return api.get(`/health/api/drivers/${driverId}/hos_status/`)
  },

  // Get dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    return api.get('/health/api/drivers/dashboard_stats/')
  },
}

// Vehicle Services - FIXED: Corrected URL patterns to match Django URLs
export const vehicleService = {
  // Get all vehicles
  getVehicles: async (params?: { is_active?: boolean; vehicle_type?: string }): Promise<ApiResponse<Vehicle[]>> => {
    return api.get('/health/api/vehicles/', params)
  },

  // Get vehicle by ID
  getVehicle: async (vehicleId: number): Promise<ApiResponse<Vehicle>> => {
    return api.get(`/health/api/vehicles/${vehicleId}/`)
  },

  // Create vehicle
  createVehicle: async (vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> => {
    return api.post('/health/api/vehicles/', vehicleData)
  },

  // Update vehicle
  updateVehicle: async (vehicleId: number, vehicleData: Partial<Vehicle>): Promise<ApiResponse<Vehicle>> => {
    return api.patch(`/health/api/vehicles/${vehicleId}/`, vehicleData)
  },

  // Update odometer
  updateOdometer: async (vehicleId: number, odometerData: {
    new_reading: number
    location?: string
  }): Promise<ApiResponse<any>> => {
    return api.post(`/health/api/vehicles/${vehicleId}/update_odometer/`, odometerData)
  },

  // Get vehicle status
  getVehicleStatus: async (vehicleId: number): Promise<ApiResponse<any>> => {
    return api.get(`/health/api/vehicles/${vehicleId}/vehicle_status/`)
  },
}

// Company Services - Fixed URL patterns
export const companyService = {
  // Get all companies
  getCompanies: async (params?: { is_active?: boolean }): Promise<ApiResponse<any[]>> => {
    return api.get('/api/companies/', params)
  },

  // Get company by ID
  getCompany: async (companyId: number): Promise<ApiResponse<any>> => {
    return api.get(`/api/companies/${companyId}/`)
  },

  // Create company
  createCompany: async (companyData: any): Promise<ApiResponse<any>> => {
    return api.post('/api/companies/', companyData)
  },

  // Update company
  updateCompany: async (companyId: number, companyData: any): Promise<ApiResponse<any>> => {
    return api.patch(`/api/companies/${companyId}/`, companyData)
  },

  // Get compliance info
  getComplianceInfo: async (companyId: number): Promise<ApiResponse<any>> => {
    return api.get(`/api/companies/${companyId}/compliance_info/`)
  },
}

// Mapping Services - Fixed URL patterns
export const mappingService = {
  // Geocode address
  geocodeAddress: async (address: string): Promise<ApiResponse<GeocodeResult>> => {
    return api.post('/api/geocode/', { address })
  },

  // Calculate route
  calculateRoute: async (waypoints: Array<{ latitude: number; longitude: number }>): Promise<ApiResponse<any>> => {
    return api.post('/api/v1/routes/calculate/', { waypoints })
  },

  // Optimize route
  optimizeRoute: async (stops: Array<{ latitude: number; longitude: number }>, optimizationType?: string): Promise<ApiResponse<any>> => {
    return api.post('/api/v1/routes/optimize/', { stops, optimization_type: optimizationType || 'time' })
  },

  // Get traffic data
  getTrafficData: async (latitude: number, longitude: number): Promise<ApiResponse<any>> => {
    return api.get('/api/v1/routes/traffic/', { lat: latitude, lng: longitude })
  },

  // Check restrictions
  checkRestrictions: async (waypoints: string): Promise<ApiResponse<any>> => {
    return api.get('/api/v1/routes/restrictions/', { waypoints })
  },
}

// Rest Area Services
export const restAreaService = {
  // Get all rest areas
  getRestAreas: async (params?: { amenities?: string; state?: string }): Promise<ApiResponse<RestArea[]>> => {
    return api.get('/api/v1/routes/rest-areas/', params)
  },

  // Get rest area by ID
  getRestArea: async (restAreaId: number): Promise<ApiResponse<RestArea>> => {
    return api.get(`/api/v1/routes/rest-areas/${restAreaId}/`)
  },
}

// Route Alert Services
export const routeAlertService = {
  // Get all route alerts
  getRouteAlerts: async (params?: { alert_type?: string; severity?: string }): Promise<ApiResponse<RouteAlert[]>> => {
    return api.get('/api/v1/routes/alerts/', params)
  },

  // Get route alert by ID
  getRouteAlert: async (alertId: number): Promise<ApiResponse<RouteAlert>> => {
    return api.get(`/api/v1/routes/alerts/${alertId}/`)
  },
}

// Route Template Services
export const routeTemplateService = {
  // Get all route templates
  getTemplates: async (params?: { start_location?: string; end_location?: string }): Promise<ApiResponse<any[]>> => {
    return api.get('/api/v1/routes/templates/', params)
  },

  // Get template by ID
  getTemplate: async (templateId: number): Promise<ApiResponse<any>> => {
    return api.get(`/api/v1/routes/templates/${templateId}/`)
  },

  // Create template
  createTemplate: async (templateData: any): Promise<ApiResponse<any>> => {
    return api.post('/api/v1/routes/templates/', templateData)
  },

  // Update template
  updateTemplate: async (templateId: number, templateData: any): Promise<ApiResponse<any>> => {
    return api.patch(`/api/v1/routes/templates/${templateId}/`, templateData)
  },

  // Delete template
  deleteTemplate: async (templateId: number): Promise<ApiResponse<void>> => {
    return api.delete(`/api/v1/routes/templates/${templateId}/`)
  },
}

// Dashboard Services - Fixed URL patterns
export const dashboardService = {
  // Get fleet dashboard data
  getFleetDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
    return api.get('/api/fleet-dashboard/')
  },

  // Get compliance report
  getComplianceReport: async (days?: number): Promise<ApiResponse<ComplianceReport>> => {
    return api.get('/api/compliance-report/', { days: days || 7 })
  },

  // Get system info
  getSystemInfo: async (): Promise<ApiResponse<any>> => {
    return api.get('/api/system-info/')
  },

  // Bulk driver operations
  bulkDriverOperations: async (operation: string, driverIds: number[]): Promise<ApiResponse<any>> => {
    return api.post('/api/bulk-driver-operations/', { operation, driver_ids: driverIds })
  },
}

// Utility Services - Fixed URL patterns
export const utilityService = {
  // Get duty status options
  getDutyStatusOptions: async (): Promise<ApiResponse<any>> => {
    return api.get('/api/duty-status-options/')
  },

  // Get HOS rules info
  getHOSRulesInfo: async (): Promise<ApiResponse<any>> => {
    return api.get('/api/hos-rules/')
  },

  // Health check - Use the actual health endpoint
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

    return api.upload('/api/documents/upload/', formData)
  },

  // Upload driver signature
  uploadDriverSignature: async (driverId: number, signatureData: string): Promise<ApiResponse<any>> => {
    return api.post(`/api/drivers/${driverId}/signature/`, { signature_data: signatureData })
  },
}

// Export all services as a single object for convenience
export const apiServices = {
  trip: tripService,
  eld: eldService,
  driver: driverService,
  vehicle: vehicleService,
  company: companyService,
  mapping: mappingService,
  restArea: restAreaService,
  routeAlert: routeAlertService,
  routeTemplate: routeTemplateService,
  dashboard: dashboardService,
  utility: utilityService,
  upload: uploadService,
}

export default apiServices
