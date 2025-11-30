import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Users, MapPin, Shield, Trash2, Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { addZone, deleteZone } from '../redux/zonesSlice'
import SafeZonePopup from '../components/SafeZonePopup'

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng)
    },
  })
  return null
}

export default function SafeZones() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const zones = useSelector((state) => state.zones.zones)
  
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [currentRadius, setCurrentRadius] = useState(1000)

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
          setLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to Delhi coordinates
          setUserLocation([28.6139, 77.2090])
          setLoading(false)
        }
      )
    } else {
      setUserLocation([28.6139, 77.2090])
      setLoading(false)
    }
  }, [])

  const handleLocationSelect = (latlng) => {
    setSelectedLocation({ lat: latlng.lat, lng: latlng.lng })
    setShowPopup(true)
    setCurrentRadius(1000)
  }

  const handleSaveZone = (zoneData) => {
    dispatch(addZone({
      id: Date.now().toString(),
      name: zoneData.name,
      location: zoneData.location,
      radius: zoneData.radius,
      createdAt: new Date().toISOString()
    }))
    setShowPopup(false)
    setSelectedLocation(null)
    setCurrentRadius(1000)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setSelectedLocation(null)
    setCurrentRadius(1000)
  }

  const handleDeleteZone = (id) => {
    if (window.confirm('Are you sure you want to delete this safe zone?')) {
      dispatch(deleteZone(id))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C471ED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-bg pb-24">
      {/* Header */}
      <div className="glass-card rounded-none border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glass">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-heading">Safe Zones</h1>
                <p className="text-sm text-text-secondary">{zones.length} zones protecting you</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/40 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Instruction Banner */}
      {!showPopup && (
        <div className="bg-gradient-primary/10 border-b border-white/40 py-3 px-4">
          <p className="text-center text-sm text-text-heading font-semibold">
            🎯 Click anywhere on the map to add a safe zone
          </p>
        </div>
      )}

      {/* Map Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="h-[60vh] relative glass-card rounded-3xl overflow-visible border border-white/40">
          {userLocation && (
            <MapContainer 
              center={userLocation} 
              zoom={14} 
              className="h-full w-full"
              zoomControl={true}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapClickHandler onLocationSelect={handleLocationSelect} />
              
              {/* User Location Marker */}
              <Marker 
                position={userLocation}
                icon={L.divIcon({
                  className: 'user-location-marker',
                  html: '<div style="width: 18px; height: 18px; background: linear-gradient(135deg, #FF4B5C, #FF6FD8, #C471ED); border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(196, 113, 237, 0.4);"></div>',
                  iconSize: [18, 18],
                  iconAnchor: [9, 9]
                })}
              />

              {/* Selected Location Marker and Circle */}
              {selectedLocation && (
                <>
                  <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                  <Circle
                    center={[selectedLocation.lat, selectedLocation.lng]}
                    radius={currentRadius}
                    pathOptions={{
                      fillColor: '#FF4B5C',
                      fillOpacity: 0.15,
                      color: '#C471ED',
                      weight: 3,
                      opacity: 0.8
                    }}
                  />
                </>
              )}

              {/* Existing Safe Zones */}
              {zones.map((zone) => (
                <React.Fragment key={zone.id}>
                  <Marker position={[zone.location.lat, zone.location.lng]} />
                  <Circle
                    center={[zone.location.lat, zone.location.lng]}
                    radius={zone.radius}
                    pathOptions={{
                      fillColor: '#FF4B5C',
                      fillOpacity: 0.15,
                      color: '#C471ED',
                      weight: 3,
                      opacity: 0.8,
                      dashArray: '8, 4'
                    }}
                  />
                </React.Fragment>
              ))}
            </MapContainer>
          )}

          {/* Safe Zone Popup */}
          {showPopup && selectedLocation && (
            <SafeZonePopup
              position={selectedLocation}
              onSave={handleSaveZone}
              onClose={handleClosePopup}
              onRadiusChange={setCurrentRadius}
              currentRadius={currentRadius}
            />
          )}
        </div>
      </div>

      {/* Zone Cards */}
      {zones.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 mb-6">
          <h2 className="text-lg font-bold text-text-heading mb-4">Your Safe Zones</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="glass-card rounded-3xl p-4 border border-white/40 hover:bg-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-md">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-text-heading">{zone.name}</h3>
                      <p className="text-sm text-text-secondary">{zone.radius}m radius</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteZone(zone.id)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-100 flex items-center justify-center transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary">Lat:</span>
                    <span className="font-mono text-text-heading">{zone.location.lat.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-secondary">Lng:</span>
                    <span className="font-mono text-text-heading">{zone.location.lng.toFixed(6)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-xs text-text-muted">
                    Added: {new Date(zone.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {zones.length === 0 && !showPopup && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-12">
          <div className="glass-card rounded-3xl p-8 border border-white/40 text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glass">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-text-heading mb-2">No Safe Zones Yet</h3>
            <p className="text-text-secondary mb-6">Tap anywhere on the map above to create your first safe zone</p>
            
            <div className="bg-white/10 p-4 rounded-2xl max-w-md mx-auto">
              <h4 className="font-bold text-text-heading mb-3 text-sm">Quick Guide:</h4>
              <div className="text-xs text-text-secondary space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold">1</span>
                  <span>Click any location on the map</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold">2</span>
                  <span>Adjust the radius using the slider</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold">3</span>
                  <span>Name your zone and save it</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Glassmorphism Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
          <div className="glass-card rounded-3xl border border-white/40">
            <div className="flex items-center justify-around py-3 px-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-text-secondary" />
                </div>
                <span className="text-xs text-text-muted">Dashboard</span>
              </button>

              <button
                onClick={() => navigate('/safe-zones')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-gradient-primary/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold bg-gradient-primary bg-clip-text text-transparent">Safe Zones</span>
              </button>

              <button
                onClick={() => navigate('/contacts')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-text-secondary" />
                </div>
                <span className="text-xs text-text-muted">Contacts</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
