// src/components/maps/EnhancedMap.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import { useStore } from '@/store'

interface EnhancedMapProps {
  onLocationSelect?: (location: { lng: number; lat: number }) => void
  showRoute?: boolean
  markers?: Array<{
    id: string
    coordinates: [number, number]
    type: 'pickup' | 'delivery' | 'runner'
    popup?: {
      title: string
      description: string
    }
  }>
}

export default function EnhancedMap({ 
  onLocationSelect, 
  showRoute = false,
  markers = [] 
}: EnhancedMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const { location: userLocation } = useStore()
  const [routePath, setRoutePath] = useState<any>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: userLocation,
      zoom: 12
    })

    // Add geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false
    })

    map.current.addControl(geocoder)
    map.current.addControl(new mapboxgl.NavigationControl())
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }))

    // Handle location selection
    map.current.on('click', (e) => {
      onLocationSelect?.({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat
      })
    })

    return () => map.current?.remove()
  }, [])

  // Handle markers
  useEffect(() => {
    if (!map.current) return

    // Clear existing markers
    const markerElements = document.getElementsByClassName('mapboxgl-marker')
    while (markerElements[0]) {
      markerElements[0].remove()
    }

    // Add new markers
    markers.forEach(marker => {
      const el = document.createElement('div')
      el.className = `marker-${marker.type}`

      const markerInstance = new mapboxgl.Marker({
        element: el,
        color: marker.type === 'pickup' ? '#22c55e' : 
               marker.type === 'delivery' ? '#ef4444' : '#3b82f6'
      })
        .setLngLat(marker.coordinates)
        .addTo(map.current!)

      if (marker.popup) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <h3 class="font-bold">${marker.popup.title}</h3>
            <p>${marker.popup.description}</p>
          `)
        markerInstance.setPopup(popup)
      }
    })

    // Draw route if needed
    if (showRoute && markers.length >= 2) {
      getRoute(markers[0].coordinates, markers[1].coordinates)
    }
  }, [markers, showRoute])

  const getRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      )
      const json = await query.json()
      const data = json.routes[0]
      const route = data.geometry.coordinates

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      }

      if (map.current?.getSource('route')) {
        (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson as any)
      } else {
        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson as any
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 5,
            'line-opacity': 0.75
          }
        })
      }
    } catch (error) {
      console.error('Error getting route:', error)
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  )
}
