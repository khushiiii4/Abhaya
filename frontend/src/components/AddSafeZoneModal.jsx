import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

export default function AddSafeZoneModal({ isOpen, onClose, onAdd, defaultLocation }) {
  const [formData, setFormData] = useState({
    name: '',
    radius: 500,
    latitude: '',
    longitude: ''
  })

  useEffect(() => {
    if (isOpen && defaultLocation) {
      setFormData(prev => ({
        ...prev,
        latitude: defaultLocation.lat.toFixed(6),
        longitude: defaultLocation.lng.toFixed(6)
      }))
    }
  }, [isOpen, defaultLocation])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a zone name')
      return
    }
    
    const lat = parseFloat(formData.latitude)
    const lng = parseFloat(formData.longitude)
    const radius = parseInt(formData.radius)
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Please enter valid coordinates')
      return
    }
    
    if (isNaN(radius) || radius < 50 || radius > 5000) {
      alert('Radius must be between 50 and 5000 meters')
      return
    }

    onAdd({
      name: formData.name.trim(),
      latitude: lat,
      longitude: lng,
      radius: radius
    })

    // Reset form
    setFormData({
      name: '',
      radius: 500,
      latitude: '',
      longitude: ''
    })
    
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Add Safe Zone
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200/50 rounded-full transition-all duration-200 hover:scale-110"
          >
            <FaTimes className="text-gray-600" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Zone Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Home, Office, School"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Radius (meters) *
            </label>
            <input
              type="number"
              name="radius"
              value={formData.radius}
              onChange={handleChange}
              min="50"
              max="5000"
              step="50"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Range: 50 - 5000 meters</p>
          </div>

          {/* Latitude */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude *
            </label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              step="0.000001"
              min="-90"
              max="90"
              placeholder="e.g., 28.6139"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude *
            </label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              step="0.000001"
              min="-180"
              max="180"
              placeholder="e.g., 77.2090"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Add Zone
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
