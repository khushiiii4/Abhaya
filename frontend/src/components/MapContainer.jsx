import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import '../styles/map.css'

export default function MapContainer({ zones = [] }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const zoneLayersRef = useRef([])
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log('Location obtained:', latitude, longitude)
          setUserLocation({ lat: latitude, lng: longitude })
          initializeMap(latitude, longitude)
        },
        (err) => {
          console.error('Geolocation error:', err)
          setError('Unable to get your location. Using default location.')
          // Default to a general location if geolocation fails
          const defaultLat = 28.6139 // Delhi, India
          const defaultLng = 77.2090
          setUserLocation({ lat: defaultLat, lng: defaultLng })
          initializeMap(defaultLat, defaultLng)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setError('Geolocation is not supported by your browser')
      // Default location
      const defaultLat = 28.6139
      const defaultLng = 77.2090
      setUserLocation({ lat: defaultLat, lng: defaultLng })
      initializeMap(defaultLat, defaultLng)
    }

    // Cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.remove()
      }
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [])

  // Update zones when they change
  useEffect(() => {
    if (mapRef.current && !loading) {
      updateZones()
    }
  }, [zones, loading])

  const updateZones = () => {
    const map = mapRef.current
    if (!map) return

    // Remove existing zone layers
    zoneLayersRef.current.forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId)
      }
      if (map.getSource(layerId)) {
        map.removeSource(layerId)
      }
    })
    zoneLayersRef.current = []

    // Add new zone layers
    zones.forEach((zone) => {
      const sourceId = `zone-source-${zone.id}`
      const layerId = `zone-layer-${zone.id}`

      // Create circle GeoJSON
      const circle = createCircle(
        [zone.longitude, zone.latitude],
        zone.radius,
        64
      )

      // Add source
      map.addSource(sourceId, {
        type: 'geojson',
        data: circle
      })

      // Add fill layer
      map.addLayer({
        id: layerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': '#00a4ff',
          'fill-opacity': 0.2
        }
      })

      // Add outline layer
      const outlineLayerId = `${layerId}-outline`
      map.addLayer({
        id: outlineLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': '#00a4ff',
          'line-width': 2,
          'line-opacity': 0.8
        }
      })

      // Add zone name marker
      const zoneMarker = document.createElement('div')
      zoneMarker.className = 'zone-marker'
      zoneMarker.innerHTML = `
        <div style="
          background: rgba(0, 164, 255, 0.9);
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          white-space: nowrap;
        ">
          ${zone.name}
        </div>
      `

      new maplibregl.Marker({
        element: zoneMarker,
        anchor: 'bottom'
      })
        .setLngLat([zone.longitude, zone.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="margin:0 0 8px 0; font-weight:bold; font-size:14px; color:#1f2937;">${zone.name}</h3>
                <div style="font-size:12px; color:#6b7280; line-height: 1.6;">
                  <p style="margin: 4px 0;"><strong>Radius:</strong> ${zone.radius}m</p>
                  <p style="margin: 4px 0;"><strong>Lat:</strong> ${zone.latitude.toFixed(6)}</p>
                  <p style="margin: 4px 0;"><strong>Lng:</strong> ${zone.longitude.toFixed(6)}</p>
                </div>
              </div>
            `)
        )
        .addTo(map)

      zoneLayersRef.current.push(layerId, outlineLayerId)
    })
  }

  // Helper function to create circle polygon
  const createCircle = (center, radiusInMeters, points = 64) => {
    const coords = {
      latitude: center[1],
      longitude: center[0]
    }

    const km = radiusInMeters / 1000
    const ret = []
    const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180))
    const distanceY = km / 110.574

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI)
      const x = distanceX * Math.cos(theta)
      const y = distanceY * Math.sin(theta)
      ret.push([coords.longitude + x, coords.latitude + y])
    }
    ret.push(ret[0])

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ret]
      }
    }
  }

  const initializeMap = (lat, lng) => {
    if (!mapContainerRef.current) return

    try {
      console.log('Initializing map...')
      
      // Initialize MapLibre GL map with OpenStreetMap tiles
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: 'raster',
              tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap Contributors',
              maxzoom: 19
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm'
            }
          ]
        },
        center: [lng, lat],
        zoom: 14
      })

      mapRef.current = map

      // Add navigation controls (zoom buttons)
      map.addControl(new maplibregl.NavigationControl(), 'top-right')

      // Wait for map to load
      map.on('load', () => {
        console.log('Map loaded successfully')
        setLoading(false)

        // Create custom marker element with pulsing animation
        const el = document.createElement('div')
        el.className = 'user-location-marker'

        // Add marker for user location
        const marker = new maplibregl.Marker({
          element: el,
          anchor: 'center'
        })
          .setLngLat([lng, lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25, closeButton: true })
              .setHTML(`
                <div style="padding: 4px;">
                  <h3 style="margin:0; font-weight:bold; font-size:14px; color:#1f2937;">You are here</h3>
                  <p style="margin:4px 0 0 0; font-size:12px; color:#6b7280;">Current Location</p>
                  <p style="margin:4px 0 0 0; font-size:11px; color:#9ca3af;">
                    Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}
                  </p>
                </div>
              `)
          )
          .addTo(map)

        markerRef.current = marker

        // Smooth zoom animation
        setTimeout(() => {
          map.flyTo({
            center: [lng, lat],
            zoom: 15,
            duration: 2000
          })
        }, 500)

        // Add zones after map loads
        updateZones()
      })

      // Add error handling
      map.on('error', (e) => {
        console.error('Map error:', e)
        setError('Map tiles failed to load. Please refresh the page.')
        setLoading(false)
      })
    } catch (err) {
      console.error('Map initialization error:', err)
      setError('Failed to initialize map. Please refresh the page.')
      setLoading(false)
    }
  }

  return (
    <div className="map-container">
      {loading && (
        <div className="map-loading">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700 font-medium">Loading map...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg shadow-md text-sm max-w-md text-center">
          ⚠️ {error}
        </div>
      )}

      <div ref={mapContainerRef} id="map" />
    </div>
  )
}
