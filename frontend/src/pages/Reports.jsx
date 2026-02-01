import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AlertTriangle, MapPin, Users, Shield, Plus, X, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { fetchNearbyReports, fetchReports, createReport, removeReport, updateReport } from '../redux/reportsSlice'

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// Custom warning marker icon
const createWarningIcon = () => {
  return L.divIcon({
    className: 'custom-warning-marker',
    html: `
      <div class="relative">
        <div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background: linear-gradient(135deg, #FF3B30, #F64F59);"></div>
        <div class="relative w-10 h-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center" style="background: linear-gradient(135deg, #FF3B30, #F64F59);">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect, isSelecting }) {
  useMapEvents({
    click: (e) => {
      if (isSelecting) {
        onLocationSelect(e.latlng)
      }
    },
  })
  return null
}

const CATEGORIES = [
  { value: 'harassment', label: 'Harassment', icon: '⚠️' },
  { value: 'theft', label: 'Theft', icon: '🎒' },
  { value: 'assault', label: 'Assault', icon: '🚨' },
  { value: 'poor-lighting', label: 'Poor Lighting', icon: '🌙' },
  { value: 'suspicious-activity', label: 'Suspicious Activity', icon: '👁️' },
  { value: 'other', label: 'Other', icon: '📍' },
]

export default function Reports() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const reports = useSelector((state) => state.reports.reports)
  const nearbyReports = useSelector((state) => state.reports.nearbyReports)
  
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSelectingLocation, setIsSelectingLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [toast, setToast] = useState(null)
  const [editingReport, setEditingReport] = useState(null)
  const [editForm, setEditForm] = useState({ category: '', description: '', severity: 'medium' })
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    severity: 'medium',
  })

  // Fetch reports on mount
  useEffect(() => {
    dispatch(fetchReports())
  }, [dispatch])

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
          setLoading(false)
          dispatch(fetchNearbyReports({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }))
        },
        (error) => {
          console.error('Error getting location:', error)
          setUserLocation([28.6139, 77.2090]) // Fallback to Delhi
          setLoading(false)
          dispatch(fetchNearbyReports({ lat: 28.6139, lng: 77.2090 }))
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
      dispatch(fetchNearbyReports({ lat: 28.6139, lng: 77.2090 }))
    }
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddReportClick = () => {
    setShowAddForm(true)
    setIsSelectingLocation(true)
    showToast('Click on the map to select location', 'info')
  }

  const handleLocationSelect = (latlng) => {
    setSelectedLocation({ lat: latlng.lat, lng: latlng.lng })
    setIsSelectingLocation(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      showToast('Please enter a title', 'error')
      return
    }
    if (!formData.category) {
      showToast('Please select a category', 'error')
      return
    }
    if (!formData.description.trim()) {
      showToast('Please enter a description', 'error')
      return
    }
    if (!selectedLocation) {
      showToast('Please select a location on the map', 'error')
      return
    }

    const reportData = {
      category: formData.category,
      description: formData.description,
      location: {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      },
      severity: formData.severity || 'medium',
    }

    dispatch(createReport(reportData))
    showToast('Report added successfully!', 'success')
    
    // Reset form
    setFormData({ title: '', category: '', description: '', severity: 'medium' })
    setSelectedLocation(null)
    setShowAddForm(false)
    setIsSelectingLocation(false)
  }

  const handleCloseForm = () => {
    setShowAddForm(false)
    setIsSelectingLocation(false)
    setSelectedLocation(null)
    setFormData({ title: '', category: '', description: '', severity: 'medium' })
  }

  const getCategoryIcon = (category) => {
    const cat = CATEGORIES.find(c => c.value === category)
    return cat ? cat.icon : '📍'
  }

  const getCategoryLabel = (category) => {
    const cat = CATEGORIES.find(c => c.value === category)
    return cat ? cat.label : category
  }

  const getLastReportedArea = () => {
    if (nearbyReports.length === 0) return 'No reports yet'
    const lastReport = nearbyReports[nearbyReports.length - 1]
    return lastReport.description || lastReport.category
  }

  const handleEditOpen = (report) => {
    setEditingReport(report)
    setEditForm({
      category: report.category || '',
      description: report.description || '',
      severity: report.severity || 'medium',
    })
  }

  const handleEditSave = () => {
    if (!editingReport) return
    dispatch(updateReport({
      reportId: editingReport._id,
      updates: {
        category: editForm.category,
        description: editForm.description,
        severity: editForm.severity,
      },
    }))
    setEditingReport(null)
    showToast('Report updated successfully!', 'success')
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
              <div className="w-12 h-12 rounded-full bg-gradient-sos flex items-center justify-center shadow-glass">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-heading">Unsafe Area Reports</h1>
                <p className="text-sm text-text-secondary">Help make areas safer</p>
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

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="glass-card rounded-3xl p-4 border border-white/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-sos flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-heading">{nearbyReports.length}</p>
                <p className="text-xs text-text-secondary">Total Reports</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-4 border border-white/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-heading truncate">{getLastReportedArea()}</p>
                <p className="text-xs text-text-secondary">Last Reported</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction Banner */}
      {isSelectingLocation && (
        <div className="bg-gradient-sos/20 border-b border-white/40 py-3 px-4">
          <p className="text-center text-sm text-text-heading font-semibold">
            📍 Click anywhere on the map to mark unsafe area
          </p>
        </div>
      )}

      {/* Map Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="h-[55vh] relative glass-card rounded-3xl overflow-visible border border-white/40" style={{ cursor: isSelectingLocation ? 'crosshair' : 'default' }}>
          {userLocation && (
            <MapContainer 
              center={userLocation} 
              zoom={13} 
              className="h-full w-full rounded-3xl"
              zoomControl={true}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapClickHandler 
                onLocationSelect={handleLocationSelect} 
                isSelecting={isSelectingLocation}
              />
              
              {/* User Location Marker */}
              <Marker 
                position={userLocation}
                icon={L.divIcon({
                  className: 'user-location-marker',
                  html: '<div style="width: 18px; height: 18px; background: linear-gradient(135deg, #F64F59, #C471ED); border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(196, 113, 237, 0.4);"></div>',
                  iconSize: [18, 18],
                  iconAnchor: [9, 9]
                })}
              />

              {/* Selected Location for New Report */}
              {selectedLocation && showAddForm && (
                <Marker 
                  position={[selectedLocation.lat, selectedLocation.lng]}
                  icon={createWarningIcon()}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold text-text-heading">Selected Location</p>
                      <p className="text-xs text-text-secondary">Fill the form to add report</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Existing Report Markers */}
              {nearbyReports.map((report) => (
                <Marker
                  key={report._id || report.id}
                  position={[report.location?.lat || report.latitude, report.location?.lng || report.longitude]}
                  icon={createWarningIcon()}
                >
                  <Popup maxWidth={250}>
                    <div className="p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                        <div>
                          <h3 className="font-bold text-text-heading text-sm">{report.description.substring(0, 30)}...</h3>
                          <span className="text-xs text-text-muted">{getCategoryLabel(report.category)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary mb-2">{report.description}</p>
                      <div className="flex items-center gap-1 text-xs text-text-muted">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(report.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Add Report Form Popup */}
          {showAddForm && selectedLocation && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[600] w-[90%] max-w-md">
              <div className="glass-card rounded-3xl p-4 border-2 border-white/50 shadow-glass animate-slideUp">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-sos flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-text-heading">Report Unsafe Area</h3>
                  </div>
                  <button
                    onClick={handleCloseForm}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div className="mb-3">
                    <label className="text-xs text-text-secondary mb-1 block">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Poor lighting at night"
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-heading placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  {/* Category */}
                  <div className="mb-3">
                    <label className="text-xs text-text-secondary mb-1 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="text-xs text-text-secondary mb-1 block">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the safety concern..."
                      rows={3}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-heading placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>

                  {/* Location Display */}
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-text-secondary mb-1 block">Latitude</label>
                      <div className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-text-heading">
                        {selectedLocation.lat.toFixed(6)}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-text-secondary mb-1 block">Longitude</label>
                      <div className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-text-heading">
                        {selectedLocation.lng.toFixed(6)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-sm font-semibold text-text-secondary transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-sos hover:shadow-glass rounded-xl text-sm font-semibold text-white transition-all"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* My Reports */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <h2 className="text-lg font-bold text-text-heading mb-4">My Reports</h2>
        {reports.length === 0 ? (
          <p className="text-sm text-text-secondary">You haven't created any reports yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <div
                key={report._id || report.id}
                className="glass-card rounded-3xl p-4 border border-white/40 hover:bg-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-text-heading">{getCategoryLabel(report.category)}</p>
                    <p className="text-xs text-text-secondary">{new Date(report.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditOpen(report)}
                      className="px-3 py-1 text-xs font-semibold bg-white/20 rounded-full hover:bg-white/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(removeReport(report._id || report.id))}
                      className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{report.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Report Modal */}
      {editingReport && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/40 px-4">
          <div className="glass-card rounded-3xl p-6 border border-white/40 w-full max-w-md">
            <h3 className="text-lg font-bold text-text-heading mb-4">Edit Report</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-heading"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-heading"
                />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Severity</label>
                <select
                  value={editForm.severity}
                  onChange={(e) => setEditForm({ ...editForm, severity: e.target.value })}
                  className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-heading"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setEditingReport(null)}
                className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-sm font-semibold text-text-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 px-4 py-2 bg-gradient-sos hover:shadow-glass rounded-xl text-sm font-semibold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Report Button */}
      {!showAddForm && (
        <div className="fixed bottom-24 right-6 z-50">
          <button
            onClick={handleAddReportClick}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-sos hover:shadow-glass rounded-full text-white font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Report
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[700] animate-slideUp">
          <div className={`glass-card rounded-2xl px-6 py-3 border-2 shadow-glass ${
            toast.type === 'success' ? 'border-green-400/50' : 
            toast.type === 'error' ? 'border-red-400/50' : 
            'border-blue-400/50'
          }`}>
            <p className="text-sm font-semibold text-text-heading">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
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
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/20 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-text-secondary" />
                </div>
                <span className="text-xs text-text-muted">Safe Zones</span>
              </button>

              <button
                onClick={() => navigate('/reports')}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-gradient-sos/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-sos flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold bg-gradient-sos bg-clip-text text-transparent">Reports</span>
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
