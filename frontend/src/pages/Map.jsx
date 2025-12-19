import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaMapMarkerAlt, FaRoute, FaExclamationCircle, FaArrowLeft, FaHome } from 'react-icons/fa'
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import BottomNav from '../components/BottomNav'

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// Custom pulsing marker for user location
const createPulsingIcon = () => {
  return L.divIcon({
    className: 'custom-pulsing-marker',
    html: `
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-ping opacity-75"></div>
        <div class="relative w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
          <div class="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

// Component to recenter map
function RecenterMap({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, 14)
    }
  }, [center, map])
  return null
}

export default function Map() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Get safe zones from Redux
  const safeZones = useSelector((state) => state.zones.zones)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
          setLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setUserLocation([28.6139, 77.2090])
          setLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      )
    } else {
      setUserLocation([28.6139, 77.2090])
      setLoading(false)
    }
  }, [])

  const handleMyLocation = () => {
    setActiveFilter('location')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error getting location:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      )
    }
    setTimeout(() => setActiveFilter(null), 2000)
  }

  const handleSafeRoutes = () => {
    setActiveFilter('routes')
    setTimeout(() => setActiveFilter(null), 3000)
  }

  const handleReportsNearby = () => {
    setActiveFilter('reports')
    setTimeout(() => setActiveFilter(null), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Control Bar */}
      <div className="bg-white shadow-md z-30 relative">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FaArrowLeft className="text-gray-700" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Live Safety Map
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700 font-medium">Live</span>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                title="Go to Dashboard"
              >
                <FaHome className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={handleMyLocation}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all shadow-sm ${
                activeFilter === 'location'
                  ? 'bg-gradient-to-r from-primary to-secondary text-white'
                  : 'bg-white border-2 border-primary/30 text-primary hover:bg-primary/10'
              }`}
            >
              <FaMapMarkerAlt />
              <span className="hidden sm:inline">My Location</span>
            </button>

            <button
              onClick={handleSafeRoutes}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all shadow-sm ${
                activeFilter === 'routes'
                  ? 'bg-green-500 text-white'
                  : 'bg-white border-2 border-green-200 text-green-600 hover:bg-green-50'
              }`}
            >
              <FaRoute />
              <span className="hidden sm:inline">Safe Routes</span>
            </button>

            <button
              onClick={handleReportsNearby}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all shadow-sm ${
                activeFilter === 'reports'
                  ? 'bg-red-500 text-white'
                  : 'bg-white border-2 border-red-200 text-red-600 hover:bg-red-50'
              }`}
            >
              <FaExclamationCircle />
              <span className="hidden sm:inline">Reports Nearby</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative pb-16">
        {userLocation && (
          <MapContainer
            center={userLocation}
            zoom={13}
            className="h-full w-full"
            style={{ height: 'calc(100vh - 180px)' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Recenter map when location changes */}
            <RecenterMap center={userLocation} />

            {/* User Location Marker */}
            <Marker position={userLocation} icon={createPulsingIcon()}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-primary">You are here</p>
                  <p className="text-xs text-gray-600">Current Location</p>
                </div>
              </Popup>
            </Marker>

            {/* Safe Zones */}
            {safeZones.map((zone) => (
              <Circle
                key={zone._id}
                center={[zone.location.lat, zone.location.lng]}
                radius={zone.radius}
                pathOptions={{
                  fillColor: '#3b82f6',
                  fillOpacity: 0.2,
                  color: '#3b82f6',
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-bold text-blue-600">{zone.name}</p>
                    <p className="text-xs text-gray-600">Safe Zone • {zone.radius}m radius</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {zone.location.lat.toFixed(4)}, {zone.location.lng.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        )}

        {/* Stats Overlay */}
        <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4 w-48">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Map Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Safe Zones</span>
              <span className="text-sm font-bold text-blue-600">{safeZones.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Status</span>
              <span className="text-xs font-semibold text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {activeFilter && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200 animate-slideUp">
          <p className="text-sm text-gray-700 font-medium">
            {activeFilter === 'location' && '📍 Centered on your location'}
            {activeFilter === 'routes' && '🛣️ Safe routes feature coming soon'}
            {activeFilter === 'reports' && '⚠️ Nearby reports feature coming soon'}
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
