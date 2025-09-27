// Compatible RouteMap.tsx - works with TripPlanner data
import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  MapIcon,
  TruckIcon,
  PlusIcon,
  MinusIcon,
  ArrowsPointingOutIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

// Set Mapbox token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN_HERE'

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

interface FuelStop {
  id: number
  location: string
  mileage: number
  estimated_fuel_gallons: number
  estimated_fuel_cost: number
  station_name: string
  amenities: string[]
  latitude?: number
  longitude?: number
  address?: string
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

// Compatible with TripPlanner's TripResult interface
interface TripResult {
  id?: number
  trip_id?: number
  total_distance_miles?: number
  total_distance?: number
  estimated_duration_hours?: number
  estimated_duration?: number
  route?: {
    segments: RouteSegment[]
  }
  segments?: RouteSegment[]
  fuel_stops?: FuelStop[]
  stops?: any[]
  eld_logs?: any[]
  compliance_status?: {
    is_compliant: boolean
    violations: string[]
  }
}

interface RouteMapProps {
  tripResult: TripResult | null
  height?: string
  className?: string
}

const RouteMap: React.FC<RouteMapProps> = ({
  tripResult,
  height = 'h-96',
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showFuelStops, setShowFuelStops] = useState(true)
  const [showRestAreas, setShowRestAreas] = useState(true)

  // Debug logging
  useEffect(() => {
    console.log('RouteMap: tripResult received:', tripResult)

    if (!tripResult) {
      setError('No trip data available')
      setIsLoading(false)
      return
    }

    const segments = tripResult?.route?.segments || tripResult?.segments
    console.log('RouteMap: segments extracted:', segments)

    if (!segments || segments.length === 0) {
      setError('No route segments available')
      setIsLoading(false)
      return
    }
  }, [tripResult])

  // Generate fuel stop coordinates along route
  const generateFuelStopCoordinates = (startLat: number, startLng: number, endLat: number, endLng: number, fuelStops: FuelStop[]) => {
    const totalDistance = tripResult?.total_distance_miles || tripResult?.total_distance || 1000

    return fuelStops.map((stop, index) => {
      // If coordinates already provided, use them
      if (stop.latitude && stop.longitude) {
        return stop
      }

      // Otherwise calculate position along route based on mileage
      const progress = stop.mileage / totalDistance
      const lat = startLat + (endLat - startLat) * progress
      const lng = startLng + (endLng - startLng) * progress

      return {
        ...stop,
        latitude: lat,
        longitude: lng
      }
    })
  }

  // Generate rest areas (every 200-300 miles)
  const generateRestAreas = (startLat: number, startLng: number, endLat: number, endLng: number) => {
    const totalDistance = tripResult?.total_distance_miles || tripResult?.total_distance || 1000
    const restAreas = []
    const restAreaInterval = 250 // Every 250 miles

    for (let mileage = restAreaInterval; mileage < totalDistance; mileage += restAreaInterval) {
      const progress = mileage / totalDistance
      const lat = startLat + (endLat - startLat) * progress
      const lng = startLng + (endLng - startLng) * progress

      restAreas.push({
        id: restAreas.length + 1,
        name: `Rest Area - Mile ${mileage}`,
        latitude: lat,
        longitude: lng,
        mileage,
        amenities: ['Restrooms', 'Parking', 'Picnic Area']
      })
    }

    return restAreas
  }

  useEffect(() => {
    // Check Mapbox token
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN_HERE') {
      setError('Mapbox token not configured. Please set VITE_MAPBOX_TOKEN environment variable.')
      setIsLoading(false)
      return
    }

    if (!mapContainer.current) {
      setError('Map container not available')
      setIsLoading(false)
      return
    }

    // Get segments from either route.segments or direct segments
    const segments = tripResult?.route?.segments || tripResult?.segments

    if (!segments?.length) {
      console.log('No segments available. Trip result:', tripResult)
      setError('No route data available')
      setIsLoading(false)
      return
    }

    const firstSegment = segments[0]
    if (!firstSegment?.start_location || !firstSegment?.end_location) {
      setError('Invalid route segment data')
      setIsLoading(false)
      return
    }

    mapboxgl.accessToken = MAPBOX_TOKEN

    const initializeMap = async () => {
      try {
        console.log('Initializing map...')

        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-98.5795, 39.8283], // Geographic center of USA
          zoom: 3
        })

        map.current.on('load', async () => {
          console.log('Map loaded successfully')
          setMapLoaded(true)

          const startLoc = firstSegment.start_location
          const endLoc = firstSegment.end_location

          // Validate coordinates
          const startLng = parseFloat(startLoc.longitude)
          const startLat = parseFloat(startLoc.latitude)
          const endLng = parseFloat(endLoc.longitude)
          const endLat = parseFloat(endLoc.latitude)

          if (isNaN(startLng) || isNaN(startLat) || isNaN(endLng) || isNaN(endLat)) {
            throw new Error('Invalid coordinates in location data')
          }

          console.log('Adding markers:', { startLat, startLng, endLat, endLng })

          // Add main route markers
          const startMarker = new mapboxgl.Marker({
            color: '#10b981', // Green for start
            scale: 1.2
          })
            .setLngLat([startLng, startLat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-3">
                    <h3 class="font-semibold text-green-600 mb-1">Current/Pickup Location</h3>
                    <p class="text-sm font-medium">${startLoc.display_address}</p>
                    <p class="text-xs text-gray-500 mt-1">${startLoc.address}</p>
                  </div>
                `)
            )
            .addTo(map.current!)

          const endMarker = new mapboxgl.Marker({
            color: '#ef4444', // Red for end
            scale: 1.2
          })
            .setLngLat([endLng, endLat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-3">
                    <h3 class="font-semibold text-red-600 mb-1">Dropoff Location</h3>
                    <p class="text-sm font-medium">${endLoc.display_address}</p>
                    <p class="text-xs text-gray-500 mt-1">${endLoc.address}</p>
                  </div>
                `)
            )
            .addTo(map.current!)

          // Add fuel stops if available
          if (tripResult?.fuel_stops && showFuelStops) {
            console.log('Adding fuel stops:', tripResult.fuel_stops)
            const fuelStopsWithCoords = generateFuelStopCoordinates(startLat, startLng, endLat, endLng, tripResult.fuel_stops)

            fuelStopsWithCoords.forEach((stop) => {
              const fuelMarker = new mapboxgl.Marker({
                color: '#f59e0b', // Orange for fuel
                scale: 0.8
              })
                .setLngLat([stop.longitude!, stop.latitude!])
                .setPopup(
                  new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`
                      <div class="p-3">
                        <h3 class="font-semibold text-orange-600 mb-1 flex items-center">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                          </svg>
                          ${stop.station_name}
                        </h3>
                        <p class="text-sm text-gray-700">Mile ${stop.mileage}</p>
                        <p class="text-sm"><strong>Fuel:</strong> ${stop.estimated_fuel_gallons} gal</p>
                        <p class="text-sm"><strong>Cost:</strong> $${stop.estimated_fuel_cost}</p>
                        <div class="mt-2">
                          ${stop.amenities.map(amenity => `<span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">${amenity}</span>`).join('')}
                        </div>
                      </div>
                    `)
                )
                .addTo(map.current!)
            })
          }

          // Add rest areas
          if (showRestAreas) {
            const restAreas = generateRestAreas(startLat, startLng, endLat, endLng)

            restAreas.forEach((area) => {
              const restMarker = new mapboxgl.Marker({
                color: '#8b5cf6', // Purple for rest areas
                scale: 0.6
              })
                .setLngLat([area.longitude, area.latitude])
                .setPopup(
                  new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`
                      <div class="p-3">
                        <h3 class="font-semibold text-purple-600 mb-1 flex items-center">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z"/>
                          </svg>
                          ${area.name}
                        </h3>
                        <p class="text-sm text-gray-700">Mandatory rest stop</p>
                        <div class="mt-2">
                          ${area.amenities.map(amenity => `<span class="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-1 mb-1">${amenity}</span>`).join('')}
                        </div>
                      </div>
                    `)
                )
                .addTo(map.current!)
            })
          }

          // Get and display route line
          try {
            const geometry = await getRouteGeometry(startLoc, endLoc)

            if (geometry) {
              console.log('Adding route to map')

              // Add route line
              map.current!.addSource('route', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: geometry
                }
              })

              // Route outline (wider, lighter)
              map.current!.addLayer({
                id: 'route-outline',
                type: 'line',
                source: 'route',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': '#ffffff',
                  'line-width': 8,
                  'line-opacity': 0.8
                }
              })

              // Main route line
              map.current!.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': '#1e88e5',
                  'line-width': 4,
                  'line-opacity': 1
                }
              })
            } else {
              console.warn('Could not fetch route geometry from Mapbox - showing markers only')
            }
          } catch (routeError) {
            console.warn('Route geometry error:', routeError)
          }

          // Fit map to show entire route
          const bounds = new mapboxgl.LngLatBounds()
          bounds.extend([startLng, startLat])
          bounds.extend([endLng, endLat])

          map.current!.fitBounds(bounds, {
            padding: 60,
            maxZoom: 12
          })

          setIsLoading(false)
        })

        map.current.on('error', (e) => {
          console.error('Map error:', e)
          setError(`Map error: ${e.error?.message || 'Unknown error'}`)
          setIsLoading(false)
        })

      } catch (err: any) {
        console.error('Map initialization error:', err)
        setError(`Failed to initialize map: ${err.message}`)
        setIsLoading(false)
      }
    }

    initializeMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [tripResult, showFuelStops, showRestAreas])

  // Get route geometry from Mapbox Directions API
  const getRouteGeometry = async (start: Location, end: Location) => {
    try {
      const startCoords = `${start.longitude},${start.latitude}`
      const endCoords = `${end.longitude},${end.latitude}`

      console.log('Fetching route from Mapbox:', { startCoords, endCoords })

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
      )

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Mapbox route response:', data)

      if (data.routes && data.routes.length > 0) {
        return data.routes[0].geometry
      }

      throw new Error('No route found in Mapbox response')
    } catch (error) {
      console.error('Error fetching route geometry:', error)
      return null
    }
  }

  // Helper functions
  const getTotalDistance = () => {
    return tripResult?.total_distance_miles || tripResult?.total_distance || 0
  }

  const getTotalDuration = () => {
    return tripResult?.estimated_duration_hours || tripResult?.estimated_duration || 0
  }

  const segments = tripResult?.route?.segments || tripResult?.segments
  const firstSegment = segments?.[0]

  // Error state
  if (error) {
    return (
      <div className={`${height} bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 ${className}`}>
        <div className="text-center p-6 max-w-md">
          <ExclamationTriangleIcon className="h-12 w-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Unavailable</h3>
          <p className="text-sm text-gray-600 mb-3">{error}</p>

          {/* Fallback route information */}
          {firstSegment && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-left">
              <h4 className="font-medium text-gray-900 mb-2">Route Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-green-600">Start: </span>
                  <span className="text-gray-700">{firstSegment.start_location.display_address}</span>
                </div>
                <div>
                  <span className="font-medium text-red-600">End: </span>
                  <span className="text-gray-700">{firstSegment.end_location.display_address}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Distance:</span><br />
                      <span className="text-blue-600">{getTotalDistance().toFixed(0)} mi</span>
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span><br />
                      <span className="text-blue-600">{getTotalDuration().toFixed(1)} hrs</span>
                    </div>
                  </div>
                </div>
                {tripResult?.fuel_stops && tripResult.fuel_stops.length > 0 && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="font-medium">Fuel Stops:</span><br />
                    <span className="text-orange-600">{tripResult.fuel_stops.length} required</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div
        ref={mapContainer}
        className={`${height} w-full rounded-lg overflow-hidden border border-gray-200`}
        style={{ minHeight: '400px' }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading route map...</p>
          </div>
        </div>
      )}

      {/* Map Controls */}
      {mapLoaded && !isLoading && (
        <>
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <button
              onClick={() => {
                if (map.current) {
                  map.current.setZoom(map.current.getZoom() + 1)
                }
              }}
              className="bg-white shadow-lg rounded-md p-2 hover:bg-gray-50 transition-colors border border-gray-200"
              title="Zoom In"
            >
              <PlusIcon className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={() => {
                if (map.current) {
                  map.current.setZoom(map.current.getZoom() - 1)
                }
              }}
              className="bg-white shadow-lg rounded-md p-2 hover:bg-gray-50 transition-colors border border-gray-200"
              title="Zoom Out"
            >
              <MinusIcon className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={() => {
                if (map.current && firstSegment) {
                  const bounds = new mapboxgl.LngLatBounds()
                  bounds.extend([
                    parseFloat(firstSegment.start_location.longitude),
                    parseFloat(firstSegment.start_location.latitude)
                  ])
                  bounds.extend([
                    parseFloat(firstSegment.end_location.longitude),
                    parseFloat(firstSegment.end_location.latitude)
                  ])
                  map.current.fitBounds(bounds, { padding: 60 })
                }
              }}
              className="bg-white shadow-lg rounded-md p-2 hover:bg-gray-50 transition-colors border border-gray-200"
              title="Fit to Route"
            >
              <ArrowsPointingOutIcon className="h-4 w-4 text-gray-700" />
            </button>
          </div>

          {/* Layer Toggle Controls */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Map Layers</h4>
            <div className="space-y-2">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showFuelStops}
                  onChange={(e) => setShowFuelStops(e.target.checked)}
                  className="mr-2 rounded"
                />
                <BoltIcon className="h-4 w-4 text-orange-500 mr-1" />
                Fuel Stops
              </label>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showRestAreas}
                  onChange={(e) => setShowRestAreas(e.target.checked)}
                  className="mr-2 rounded"
                />
                <MapPinIcon className="h-4 w-4 text-purple-500 mr-1" />
                Rest Areas
              </label>
            </div>
          </div>

          {/* Route Information Panel */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm border border-gray-200">
            <div className="flex items-start space-x-3">
              <TruckIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 mb-2">Trip Route</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    <span className="truncate">{firstSegment?.start_location.display_address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                    <span className="truncate">{firstSegment?.end_location.display_address}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium text-gray-700">Distance:</span>
                        <br />
                        <span className="text-blue-600 font-semibold">
                          {getTotalDistance().toFixed(0)} miles
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <br />
                        <span className="text-blue-600 font-semibold">
                          {getTotalDuration().toFixed(1)} hours
                        </span>
                      </div>
                    </div>
                    {tripResult?.fuel_stops && tripResult.fuel_stops.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <span className="font-medium text-gray-700 text-xs">Fuel Stops:</span>
                        <br />
                        <span className="text-orange-600 font-semibold text-xs">
                          {tripResult.fuel_stops.length} required stops
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default RouteMap
