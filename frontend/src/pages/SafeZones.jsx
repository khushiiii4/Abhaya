import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaPlus, FaTrash, FaMapMarkerAlt } from 'react-icons/fa'
import MapContainer from '../components/MapContainer'
import AddSafeZoneModal from '../components/AddSafeZoneModal'
import { addZone, deleteZone } from '../redux/zonesSlice'

export default function SafeZones() {
  const dispatch = useDispatch()
  const zones = useSelector((state) => state.zones.zones)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  // Get user location for default coordinates
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        () => {
          // Default to Delhi if geolocation fails
          setUserLocation({ lat: 28.6139, lng: 77.2090 })
        }
      )
    } else {
      setUserLocation({ lat: 28.6139, lng: 77.2090 })
    }
  }, [])

  const handleAddZone = (zoneData) => {
    dispatch(addZone(zoneData))
  }

  const handleDeleteZone = (zoneId) => {
    if (window.confirm('Are you sure you want to delete this safe zone?')) {
      dispatch(deleteZone(zoneId))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Safe Zones
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <FaPlus size={16} />
              Add Safe Zone
            </button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="h-[400px] relative">
            <MapContainer zones={zones} />
          </div>
        </div>

        {/* Zones List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Your Safe Zones ({zones.length})
          </h2>

          {zones.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-blue-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Safe Zones Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first safe zone to mark important locations
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <FaPlus className="inline mr-2" />
                Add Your First Zone
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="glass-card p-5 hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                        <FaMapMarkerAlt className="text-white" size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {zone.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {zone.radius}m radius
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteZone(zone.id)}
                      className="p-2 hover:bg-red-100 rounded-full transition-all duration-200 hover:scale-110"
                    >
                      <FaTrash className="text-red-500" size={16} />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">Latitude:</span>
                      <span className="text-gray-700 font-mono">{zone.latitude.toFixed(6)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">Longitude:</span>
                      <span className="text-gray-700 font-mono">{zone.longitude.toFixed(6)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                      Added: {new Date(zone.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Safe Zone Modal */}
      <AddSafeZoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddZone}
        defaultLocation={userLocation}
      />
    </div>
  )
}
