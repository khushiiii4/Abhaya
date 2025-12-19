import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet'
import { useDispatch } from 'react-redux'
import { createZone } from '../redux/zonesSlice'
import { FaTimes, FaCheck, FaMapMarkerAlt } from 'react-icons/fa'
import L from 'leaflet'

// Component to handle map view updates
function MapViewController({ center, zoom }) {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true, duration: 0.5 })
    }
  }, [center, zoom, map])
  
  return null
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }) {
  const map = useMap()
  
  useEffect(() => {
    const handleClick = (e) => {
      onLocationSelect([e.latlng.lat, e.latlng.lng])
    }
    
    map.on('click', handleClick)
    
    return () => {
      map.off('click', handleClick)
    }
  }, [map, onLocationSelect])
  
  return null
}

export default function AddSafeZoneModal({ isOpen, onClose, userLocation }) {
  const dispatch = useDispatch()
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [zoneName, setZoneName] = useState('')
  const [radius, setRadius] = useState(1000)
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const markerRef = useRef(null)

  useEffect(() => {
    if (isOpen && userLocation) {
      setSelectedLocation(userLocation)
      setLatitude(userLocation[0].toFixed(6))
      setLongitude(userLocation[1].toFixed(6))
    }
  }, [isOpen, userLocation])

  useEffect(() => {
    if (selectedLocation) {
      setLatitude(selectedLocation[0].toFixed(6))
      setLongitude(selectedLocation[1].toFixed(6))
    }
  }, [selectedLocation])

  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng)
  }

  const handleLatChange = (e) => {
    const val = e.target.value
    setLatitude(val)
    const num = parseFloat(val)
    if (!isNaN(num) && num >= -90 && num <= 90) {
      setSelectedLocation([num, selectedLocation ? selectedLocation[1] : 0])
    }
  }

  const handleLngChange = (e) => {
    const val = e.target.value
    setLongitude(val)
    const num = parseFloat(val)
    if (!isNaN(num) && num >= -180 && num <= 180) {
      setSelectedLocation([selectedLocation ? selectedLocation[0] : 0, num])
    }
  }

  const handleRadiusChange = (e) => {
    const val = parseInt(e.target.value)
    setRadius(Math.max(100, Math.min(5000, val)))
  }

  const handleSave = () => {
    if (!zoneName.trim()) {
      alert('Please enter a zone name')
      return
    }
    if (!selectedLocation) {
      alert('Please select a location on the map')
      return
    }

    dispatch(createZone({
      name: zoneName,
      description: '',
      location: {
        lat: selectedLocation[0],
        lng: selectedLocation[1]
      },
      radius: radius
    }))

    handleClose()
  }

  const handleClose = () => {
    setSelectedLocation(null)
    setZoneName('')
    setRadius(1000)
    setLatitude('')
    setLongitude('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100] animate-fadeIn"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[1101] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-gradient-to-br from-[#FFF5FA] to-purple-50 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden pointer-events-auto animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#F64F59] to-[#C471ED] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FaMapMarkerAlt className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Add Safe Zone</h2>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
            >
              <FaTimes className="text-white text-xl" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map Section */}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gradient-to-r from-[#F64F59] to-[#C471ED] rounded-full animate-pulse"></span>
                    Click on the map or drag marker to select location
                  </p>
                  
                  <div className="h-[450px] rounded-xl overflow-hidden shadow-inner">
                    {selectedLocation && (
                      <MapContainer
                        center={selectedLocation}
                        zoom={16}
                        className="h-full w-full"
                        zoomControl={true}
                        scrollWheelZoom={true}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        <MapViewController center={selectedLocation} zoom={16} />
                        <MapClickHandler onLocationSelect={handleLocationSelect} />
                        
                        {/* Selected Location Marker */}
                        <Marker 
                          position={selectedLocation}
                          draggable={true}
                          ref={markerRef}
                          eventHandlers={{
                            dragend: (e) => {
                              const marker = e.target
                              const position = marker.getLatLng()
                              setSelectedLocation([position.lat, position.lng])
                            }
                          }}
                        />
                        
                        {/* Radius Circle */}
                        <Circle
                          center={selectedLocation}
                          radius={radius}
                          pathOptions={{
                            fillColor: '#F64F59',
                            fillOpacity: 0.15,
                            color: '#C471ED',
                            weight: 3,
                            opacity: 0.8
                          }}
                        />
                      </MapContainer>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-4">
                {/* Zone Name */}
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Zone Name *
                  </label>
                  <input
                    type="text"
                    value={zoneName}
                    onChange={(e) => setZoneName(e.target.value)}
                    placeholder="e.g., Home, Office, School"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#C471ED] focus:ring-2 focus:ring-[#C471ED]/20 outline-none transition-all"
                  />
                </div>

                {/* Coordinates */}
                <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Location Coordinates</h3>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={latitude}
                      onChange={handleLatChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#C471ED] focus:ring-2 focus:ring-[#C471ED]/20 outline-none transition-all font-mono text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={longitude}
                      onChange={handleLngChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#C471ED] focus:ring-2 focus:ring-[#C471ED]/20 outline-none transition-all font-mono text-sm"
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 italic">
                    Drag the marker or edit coordinates manually
                  </p>
                </div>

                {/* Radius Control */}
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Radius: <span className="bg-gradient-to-r from-[#F64F59] to-[#C471ED] bg-clip-text text-transparent">{radius}m</span>
                  </label>
                  
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={radius}
                    onChange={handleRadiusChange}
                    className="w-full h-2 bg-gradient-to-r from-[#F64F59] to-[#C471ED] rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>100m</span>
                    <span>5000m</span>
                  </div>
                  
                  <div className="mt-3">
                    <input
                      type="number"
                      min="100"
                      max="5000"
                      step="100"
                      value={radius}
                      onChange={handleRadiusChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#C471ED] focus:ring-2 focus:ring-[#C471ED]/20 outline-none transition-all text-center font-bold"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!zoneName.trim() || !selectedLocation}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#F64F59] to-[#C471ED] hover:shadow-lg text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <FaCheck />
                    Save Zone
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(90deg, #F64F59, #C471ED);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(196, 113, 237, 0.4);
          border: 3px solid white;
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(90deg, #F64F59, #C471ED);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(196, 113, 237, 0.4);
          border: 3px solid white;
        }
      `}</style>
    </>
  )
}
