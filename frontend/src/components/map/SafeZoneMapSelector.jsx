import React, { useState } from 'react'
import LeafletMap from './LeafletMap'

export default function SafeZoneMapSelector({ onZoneSelect, initialLocation }) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null)
  const [radius, setRadius] = useState(500)

  const handleLocationSelect = (latlng) => {
    const location = {
      lat: latlng.lat,
      lng: latlng.lng
    }
    setSelectedLocation(location)
    
    // Pass data to parent
    if (onZoneSelect) {
      onZoneSelect({
        latitude: location.lat,
        longitude: location.lng,
        radius: radius
      })
    }
  }

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius)
    
    // Update parent with new radius
    if (selectedLocation && onZoneSelect) {
      onZoneSelect({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        radius: newRadius
      })
    }
  }

  return (
    <div className="w-full h-[500px]">
      <LeafletMap
        selectedLocation={selectedLocation}
        radius={radius}
        onLocationSelect={handleLocationSelect}
        onRadiusChange={handleRadiusChange}
      />
    </div>
  )
}
