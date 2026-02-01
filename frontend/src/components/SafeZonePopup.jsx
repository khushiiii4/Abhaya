import React, { useState, useEffect } from 'react'
import { X, MapPin } from 'lucide-react'

export default function SafeZonePopup({
  position,
  onSave,
  onClose,
  onRadiusChange,
  currentRadius = 1000,
  initialName = '',
  initialDescription = '',
  mode = 'create',
}) {
  const [zoneName, setZoneName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [radius, setRadius] = useState(currentRadius)

  useEffect(() => {
    setRadius(currentRadius)
  }, [currentRadius])

  useEffect(() => {
    setZoneName(initialName)
    setDescription(initialDescription)
  }, [initialName, initialDescription])

  const handleRadiusChange = (value) => {
    const newRadius = parseInt(value)
    setRadius(newRadius)
    if (onRadiusChange) {
      onRadiusChange(newRadius)
    }
  }

  const handleSave = () => {
    if (!zoneName.trim()) {
      alert('Please enter a zone name')
      return
    }
    onSave({
      name: zoneName,
      description,
      location: {
        lat: position.lat,
        lng: position.lng
      },
      radius: radius
    })
    setZoneName('')
    setDescription('')
    setRadius(1000)
  }

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[600] w-80 max-w-[90vw]">
      <div className="glass-card rounded-3xl p-4 border-2 border-white/50 shadow-glass animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-text-heading">
              {mode === 'edit' ? 'Edit Safe Zone' : 'Add Safe Zone'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        {/* Zone Name Input */}
        <div className="mb-3">
          <label className="text-xs text-text-secondary mb-1 block">Zone Name</label>
          <input
            type="text"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            placeholder="e.g., Home, Office"
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-heading placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="mb-3">
          <label className="text-xs text-text-secondary mb-1 block">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Well-lit area"
            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-xl text-sm text-text-heading placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Location Display */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Latitude</label>
            <div className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-text-heading">
              {position.lat.toFixed(6)}
            </div>
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Longitude</label>
            <div className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-sm text-text-heading">
              {position.lng.toFixed(6)}
            </div>
          </div>
        </div>

        {/* Radius Input */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-text-secondary">Radius (meters)</label>
            <span className="text-xs font-semibold text-text-heading">{radius}m</span>
          </div>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={radius}
            onChange={(e) => handleRadiusChange(e.target.value)}
            className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #F64F59 0%, #C471ED ${((radius - 100) / 4900) * 100}%, rgba(255,255,255,0.3) ${((radius - 100) / 4900) * 100}%, rgba(255,255,255,0.3) 100%)`
            }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-text-muted">100m</span>
            <span className="text-xs text-text-muted">5000m</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-sm font-semibold text-text-secondary transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!zoneName.trim()}
            className="flex-1 px-4 py-2 bg-gradient-primary hover:shadow-glass rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'edit' ? 'Save Changes' : 'Save Zone'}
          </button>
        </div>
      </div>
    </div>
  )
}
