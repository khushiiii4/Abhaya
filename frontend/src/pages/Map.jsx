import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMapMarkerAlt, FaRoute, FaExclamationCircle, FaArrowLeft, FaHome } from 'react-icons/fa'
import MapContainer from '../components/MapContainer'

export default function Map() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState(null)

  const handleMyLocation = () => {
    // TODO: Day 8 - Recenter map to current location
    console.log('My Location clicked')
    setActiveFilter('location')
  }

  const handleSafeRoutes = () => {
    // TODO: Day 8 - Display safe routes overlay
    console.log('Safe Routes clicked')
    setActiveFilter('routes')
  }

  const handleReportsNearby = () => {
    // TODO: Day 8 - Show nearby incident reports
    console.log('Reports Nearby clicked')
    setActiveFilter('reports')
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
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Live Safety Map</h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title="Go to Dashboard"
            >
              <FaHome className="text-gray-700" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={handleMyLocation}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all shadow-sm ${
                activeFilter === 'location'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50'
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
      <div className="flex-1 relative">
        <MapContainer />
      </div>

      {/* Info Banner (optional - shows when filters active) */}
      {activeFilter && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200 animate-slideUp">
          <p className="text-sm text-gray-700 font-medium">
            {activeFilter === 'location' && '📍 Centering on your location...'}
            {activeFilter === 'routes' && '🛣️ Safe routes feature coming soon'}
            {activeFilter === 'reports' && '⚠️ Nearby reports feature coming soon'}
          </p>
        </div>
      )}
    </div>
  )
}
