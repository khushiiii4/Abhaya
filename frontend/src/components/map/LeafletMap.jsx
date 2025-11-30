import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng)
    },
  })
  return null
}

export default function LeafletMap({ 
  center = [28.6139, 77.2090], 
  zoom = 13,
  selectedLocation,
  radius,
  onLocationSelect,
  onRadiusChange 
}) {
  const [mapCenter, setMapCenter] = useState(center)

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter([selectedLocation.lat, selectedLocation.lng])
    }
  }, [selectedLocation])

  return (
    <div className="relative w-full h-full">
      {/* Radius Slider */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4 w-64">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Radius: {radius}m
          </label>
          <input
            type="range"
            min="50"
            max="5000"
            step="50"
            value={radius}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50m</span>
            <span>5000m</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl shadow-lg px-4 py-2">
        <p className="text-sm font-medium text-gray-700">
          📍 Click on map to select safe zone location
        </p>
      </div>

      {/* Coordinates Display */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-3">
          <div className="text-xs text-gray-600">
            <div><strong>Lat:</strong> {selectedLocation.lat.toFixed(6)}</div>
            <div><strong>Lng:</strong> {selectedLocation.lng.toFixed(6)}</div>
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="w-full h-full rounded-xl"
        style={{ height: '100%', minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onLocationSelect={onLocationSelect} />
        
        {selectedLocation && (
          <>
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
            <Circle
              center={[selectedLocation.lat, selectedLocation.lng]}
              radius={radius}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.2,
                weight: 2
              }}
            />
          </>
        )}
      </MapContainer>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
