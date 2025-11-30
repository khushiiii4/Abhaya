import React, { useEffect, useRef, useState } from 'react'
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FaMapMarkerAlt, FaPlus } from 'react-icons/fa'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// MapClickHandler component
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng)
      }
    },
  })
  return null
}

export default function MapContainer({ 
  zones = [], 
  onZoneSelect, 
  showCreateCircle = false,
  selectedLocation = null,
  selectedRadius = 500
}) {
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showComingSoon, setShowComingSoon] = useState(false)

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setLoading(false)
        },
        (err) => {
          console.error('Geolocation error:', err)
          setError('Location access denied. Using default location.')
          // Fallback to India coordinates
          setUserLocation([20.5937, 78.9629])
          setLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setError('Geolocation not supported')
      setUserLocation([20.5937, 78.9629])
      setLoading(false)
    }
  }, [])

  const handleMapClick = (latlng) => {
    if (onZoneSelect) {
      onZoneSelect({
        latitude: latlng.lat,
        longitude: latlng.lng
      })
    }
  }

  if (loading) {
    return (
      <div className="w-full h-[600px] rounded-xl shadow-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600 font-medium">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] rounded-xl shadow-lg overflow-hidden">
      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg text-sm">
          {error}
        </div>
      )}

      {/* Create Circle Button */}
      {showCreateCircle && (
        <button
          onClick={() => setShowComingSoon(true)}
          className="absolute top-4 right-4 z-[1000] bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 font-semibold transition-all hover:scale-105"
        >
          <FaPlus /> Create Circle
        </button>
      )}

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="absolute inset-0 z-[1001] bg-black/50 flex items-center justify-center" onClick={() => setShowComingSoon(false)}>
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon!</h3>
              <p className="text-gray-600 mb-6">Create Circle feature will be available in the next update.</p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaflet Map */}
      <LeafletMapContainer
        center={userLocation}
        zoom={13}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map Click Handler */}
        <MapClickHandler onMapClick={handleMapClick} />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-blue-600">📍 You are here</p>
                <p className="text-xs text-gray-500 mt-1">Current Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Selected Location (temporary) */}
        {selectedLocation && (
          <>
            <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-green-600">Selected Zone</p>
                  <p className="text-xs text-gray-500">Radius: {selectedRadius}m</p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[selectedLocation.latitude, selectedLocation.longitude]}
              radius={selectedRadius}
              pathOptions={{
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.2,
                weight: 2
              }}
            />
          </>
        )}

        {/* Existing Safe Zones */}
        {zones.map((zone) => (
          <React.Fragment key={zone.id}>
            <Marker position={[zone.latitude, zone.longitude]}>
              <Popup>
                <div className="text-center">
                  <p className="font-bold text-purple-600">{zone.name}</p>
                  <p className="text-xs text-gray-500">Radius: {zone.radius}m</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(zone.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[zone.latitude, zone.longitude]}
              radius={zone.radius}
              pathOptions={{
                color: '#8b5cf6',
                fillColor: '#8b5cf6',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '5, 5'
              }}
            />
          </React.Fragment>
        ))}
      </LeafletMapContainer>
    </div>
  )
}
