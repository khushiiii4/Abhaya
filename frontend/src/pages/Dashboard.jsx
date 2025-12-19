import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AuthContext } from '../context/AuthContext'
import { fetchZones } from '../redux/zonesSlice'
import { fetchNearbyReports } from '../redux/reportsSlice'
import { Users, MapPin, Activity, Shield } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AddSafeZoneModal from '../components/AddSafeZoneModal'
import '../styles/map.css'

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// Custom pulsing marker icon for user location
const createPulsingIcon = () => {
  return L.divIcon({
    className: 'custom-pulsing-marker',
    html: `
      <div class="relative">
        <div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background: linear-gradient(135deg, #FF4B5C, #FF6FD8, #C471ED);"></div>
        <div class="relative w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center" style="background: linear-gradient(135deg, #FF4B5C, #FF6FD8, #C471ED);">
          <div class="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

// Component to recenter map when location changes
function RecenterMap({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true })
    }
  }, [center, map])
  return null
}

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState([])
  const [showAddZoneModal, setShowAddZoneModal] = useState(false)
  
  // Get safe zones and reports from Redux
  const safeZones = useSelector((state) => state.zones.zones)
  const reports = useSelector((state) => state.reports.nearbyReports || state.reports.reports)
  
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'

  // Fetch zones and reports on mount
  useEffect(() => {
    dispatch(fetchZones())
    dispatch(fetchNearbyReports())
  }, [dispatch])

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
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      )
    } else {
      // Fallback if geolocation is not supported
      setUserLocation([28.6139, 77.2090])
      setLoading(false)
    }
  }, [])

  // Fetch contacts from backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { default: axios } = await import('../api/axios')
        const response = await axios.get('/contacts')
        setContacts(response.data || [])
      } catch (error) {
        console.error('Error fetching contacts:', error)
        setContacts([])
      }
    }
    fetchContacts()
  }, [])

  const handleLogout = () => {
    logout()
    nav('/login')
  }

  const handleSOSClick = () => {
    nav('/sos')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C471ED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your location...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-bg relative overflow-hidden pb-24">
      {/* Header with greeting and avatar */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-heading mb-1">{greeting}, {user?.name || 'Khushi'}!</h2>
            <p className="text-sm text-text-secondary">Your safety is our priority.</p>
          </div>
          
          {/* User Avatar on Right */}
          <button
            onClick={() => nav('/profile')}
            className="w-14 h-14 rounded-full overflow-hidden border-4 border-white/30 shadow-glass hover:border-white/50 transition-all"
          >
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Khushi')}&background=FF4B5C&color=fff&size=128`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Stats Cards - Glassmorphism */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
        <div className="grid grid-cols-3 gap-3">
          {/* Emergency Contacts Card */}
          <button
            onClick={() => nav('/contacts')}
            className="glass-card rounded-3xl p-3 border border-white/40 hover:bg-white/20 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-text-heading">{contacts.length}</p>
                <p className="text-[10px] text-text-secondary">Emergency Contacts</p>
              </div>
            </div>
          </button>

          {/* Safe Zones Card */}
          <button
            onClick={() => nav('/safe-zones')}
            className="glass-card rounded-3xl p-3 border border-white/40 hover:bg-white/20 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-text-heading">{safeZones.length}</p>
                <p className="text-[10px] text-text-secondary">Safe Zones</p>
              </div>
            </div>
          </button>

          {/* Live Map Status Card */}
          <button
            onClick={() => nav('/map')}
            className="glass-card rounded-3xl p-3 border border-white/40 hover:bg-white/20 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-green-600">Active</p>
                <p className="text-[10px] text-text-secondary">Live Map Status</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Map Container - 50vh with rounded corners and glassmorphism */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-[50vh] relative glass-card rounded-3xl overflow-hidden border border-white/40">
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
              
              <RecenterMap center={userLocation} />
              
              {/* User Location Marker with Pulsing Effect */}
              <Marker position={userLocation} icon={createPulsingIcon()}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold bg-gradient-to-r from-[#F64F59] to-[#C471ED] bg-clip-text text-transparent">You are here</p>
                    <p className="text-xs text-gray-600">Current Location</p>
                  </div>
                </Popup>
              </Marker>

              {/* Real Safe Zones from Redux */}
              {safeZones.map((zone) => (
                <Circle
                  key={zone._id}
                  center={[zone.location.lat, zone.location.lng]}
                  radius={zone.radius}
                  pathOptions={{
                    fillColor: '#F64F59',
                    fillOpacity: 0.15,
                    color: '#C471ED',
                    weight: 3,
                    opacity: 0.8
                  }}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold bg-gradient-to-r from-[#F64F59] to-[#C471ED] bg-clip-text text-transparent">{zone.name}</p>
                      <p className="text-xs text-gray-600">Safe Zone • {zone.radius}m radius</p>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          )}

          {/* Floating SOS Button - Centered at bottom with animated rings */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[500]">
            <button
              onClick={handleSOSClick}
              className="relative group"
            >
              {/* Outer pulse ring */}
              <div className="absolute -inset-4 bg-gradient-sos rounded-full pulse-ring-large opacity-40"></div>
              
              {/* Middle pulse ring */}
              <div className="absolute -inset-2 bg-gradient-sos rounded-full pulse-ring opacity-60"></div>
              
              {/* Inner pulse ring */}
              <div className="absolute inset-0 bg-gradient-sos rounded-full pulse-ring-delayed opacity-50"></div>
              
              {/* Main button */}
              <div className="relative w-28 h-28 bg-gradient-sos rounded-full flex items-center justify-center shadow-glass hover:scale-105 transition-transform">
                <div className="text-center">
                  <p className="text-white text-2xl font-bold tracking-wider">SOS</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Glassmorphism Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
          <div className="glass-card rounded-3xl border border-white/40">
            <div className="flex items-center justify-around py-3 px-2">
              <button
                onClick={() => nav('/dashboard')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-gradient-primary/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold bg-gradient-primary bg-clip-text text-transparent">Dashboard</span>
              </button>

              <button
                onClick={() => nav('/safe-zones')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-text-secondary" />
                </div>
                <span className="text-xs text-text-muted">Safe Zones</span>
              </button>

              <button
                onClick={() => nav('/reports')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-text-secondary" />
                </div>
                <span className="text-xs text-text-muted">Reports</span>
              </button>

              <button
                onClick={() => nav('/contacts')}
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

      {/* Add Safe Zone Modal */}
      <AddSafeZoneModal 
        isOpen={showAddZoneModal}
        onClose={() => setShowAddZoneModal(false)}
        userLocation={userLocation}
      />
    </div>
  )
}
