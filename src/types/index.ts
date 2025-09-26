// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status?: number
}

// Base Model interfaces
export interface BaseModel {
  id: number
  created_at: string
  updated_at: string
}

// Location interfaces
export interface Location extends BaseModel {
  address: string
  latitude: number
  longitude: number
  city: string
  state: string
  country: string
  postal_code: string
}

export interface GeocodeResult {
  address: string
  latitude: number
  longitude: number
  city: string
  state: string
  country: string
  postal_code: string
}

// Driver interfaces
export interface Driver extends BaseModel {
  name: string
  license_number: string
  license_state: string
  phone: string
  email: string
  co_driver_name?: string
  shipping_document_number?: string
  employee_id?: string
  home_terminal_address?: string
  home_terminal_timezone: string
  carrier_name?: string
  carrier_usdot_number?: string
  eld_device_id?: string
  eld_device_model?: string
  last_certification_date?: string
  certification_method: 'ELECTRONIC' | 'PIN' | 'BIOMETRIC'
  is_active: boolean
  current_duty_status: 'OFF' | 'SB' | 'D' | 'ON'
  current_cycle_hours: number
  current_daily_drive_hours: number
  current_daily_duty_hours: number
  last_duty_change_time?: string
  last_duty_change_location?: string
  driver_signature?: string
}

// Vehicle interfaces
export interface Vehicle extends BaseModel {
  vin: string
  license_plate: string
  license_state: string
  make: string
  model: string
  year: number
  fuel_capacity: number
  mpg: number
  vehicle_number?: string
  engine_serial_number?: string
  engine_model?: string
  eld_device_id?: string
  eld_connection_type?: 'OBDII' | 'J1939' | 'J1708' | 'WIRELESS'
  current_odometer: number
  current_engine_hours: number
  gvwr?: number
  vehicle_type: 'TRUCK' | 'TRACTOR' | 'BUS' | 'OTHER'
  is_active: boolean
}

// Trip interfaces
export interface Trip extends BaseModel {
  driver?: Driver
  vehicle?: Vehicle
  current_location: Location
  pickup_location: Location
  dropoff_location: Location
  current_cycle_hours: number
  current_daily_drive_hours: number
  current_daily_duty_hours: number
  total_distance_miles?: number
  estimated_duration_hours?: number
  estimated_fuel_cost?: number
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  route_segments?: RouteSegment[]
  stops?: Stop[]
}

export interface TripSummary {
  id: number
  status: string
  current_location_address: string
  pickup_location_address: string
  dropoff_location_address: string
  driver_name?: string
  total_distance_miles?: number
  estimated_duration_hours?: number
  created_at: string
}

export interface TripCreateRequest {
  current_location: string
  pickup_location: string
  dropoff_location: string
  current_cycle_hours: number
  current_daily_drive_hours?: number
  current_daily_duty_hours?: number
  driver_id?: number
  vehicle_id?: number
  notes?: string
}

// Route interfaces
export interface RouteSegment extends BaseModel {
  trip: number
  start_location: Location
  end_location: Location
  sequence_order: number
  distance_miles: number
  estimated_time_hours: number
  geometry?: any
}

export interface Stop extends BaseModel {
  trip: number
  location: Location
  stop_type: 'rest' | 'fuel' | 'pickup' | 'dropoff' | 'mandatory_break' | 'meal'
  sequence_order: number
  estimated_arrival_time: string
  estimated_departure_time: string
  duration_minutes: number
  is_mandatory: boolean
  description?: string
  fuel_details?: FuelStop
}

export interface FuelStop extends BaseModel {
  stop: number
  diesel_price_per_gallon?: number
  estimated_fuel_gallons?: number
  estimated_fuel_cost?: number
  has_parking: boolean
  has_restrooms: boolean
  has_food: boolean
  has_showers: boolean
  has_truck_wash: boolean
  station_name?: string
  station_brand?: string
}

// ELD interfaces
export interface ELDLog extends BaseModel {
  trip: number
  driver: Driver
  vehicle: Vehicle
  log_date: string
  starting_odometer: number
  ending_odometer: number
  total_miles_driven: number
  total_drive_time: number
  total_on_duty_time: number
  total_off_duty_time: number
  cycle_hours_used: number
  is_compliant: boolean
  violation_summary?: string
  is_certified: boolean
  certified_at?: string
  duty_entries?: DutyStatusEntry[]
  violations?: ELDViolation[]
  documents?: ELDDocument[]
}

export interface DutyStatusEntry extends BaseModel {
  eld_log: number
  duty_status: 'OFF' | 'SB' | 'D' | 'ON'
  start_time: string
  end_time?: string
  duration_minutes: number
  location?: Location
  location_description?: string
  odometer_reading: number
  remarks?: string
  is_automatic: boolean
}

export interface ELDViolation extends BaseModel {
  eld_log: number
  violation_type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  description: string
  violation_time: string
  duration_minutes: number
  is_resolved: boolean
  resolution_notes?: string
  resolved_at?: string
}

export interface ELDDocument extends BaseModel {
  eld_log: number
  document_type: string
  title: string
  description?: string
  file?: File | string
  file_name?: string
  file_size: number
  document_date: string
  reference_number?: string
}

export interface PrintableELD {
  header_info: any
  graph_grid: any
  duty_status_summary: any
  supporting_documents: any[]
  certification_info: any
  violations_warnings: any[]
  odometer_info: any
  location_info: any[]
}

// HOS and Compliance interfaces
export interface HOSStatus {
  can_drive: boolean
  available_drive_hours: number
  available_duty_hours: number
  remaining_cycle_hours: number
  needs_restart: boolean
  reason?: string
  violations?: string[]
  recommendations?: string[]
}

export interface ComplianceReport {
  report_period: {
    start_date: string
    end_date: string
    days: number
  }
  fleet_overview: {
    total_active_drivers: number
    total_active_vehicles: number
  }
  hos_compliance: {
    cycle_compliant: number
    daily_drive_compliant: number
    daily_duty_compliant: number
    overall_compliance_rate: number
  }
  violations: {
    cycle_violations: number
    daily_drive_violations: number
    daily_duty_violations: number
  }
  certification_status: {
    certified_today: number
    certified_this_week: number
    never_certified: number
  }
}

// Dashboard interfaces
export interface DashboardStats {
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
  generated_at: string
}

// Route and mapping interfaces
export interface RestArea extends BaseModel {
  location: Location
  name: string
  brand?: string
  phone?: string
  truck_parking_spaces: number
  car_parking_spaces: number
  is_24_hours: boolean
  opening_time?: string
  closing_time?: string
  amenities: string[]
  rating?: number
  review_count: number
  diesel_price?: number
  price_updated?: string
  is_active: boolean
}

export interface RouteAlert extends BaseModel {
  location: Location
  alert_type: string
  severity: string
  title: string
  description: string
  start_time: string
  end_time?: string
  expected_duration_hours?: number
  estimated_delay_minutes: number
  affects_trucks: boolean
  source?: string
  external_id?: string
  is_active: boolean
}

// Notification interfaces
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

// Form interfaces
export interface TripFormData {
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

// Error interfaces
export interface AppError {
  message: string
  code?: string
  details?: any
}

// Theme interfaces
export type Theme = 'light' | 'dark'

// Navigation interfaces
export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
}

// Generic utility types
export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next?: string
  previous?: string
}

// Export commonly used types
export type DutyStatus = 'OFF' | 'SB' | 'D' | 'ON'
export type TripStatus = 'planning' | 'in_progress' | 'completed' | 'cancelled'
export type VehicleType = 'TRUCK' | 'TRACTOR' | 'BUS' | 'OTHER'
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
