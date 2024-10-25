// src/components/maps/MapView.tsx
'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

interface MapViewProps {
  center: [number, number]
  zoom?: number
  markers?: Array<{
    coordinates: [number, number]
    type: 'pickup' | 'delivery' | 'runner'
  }>
}

export default function MapView({ center, zoom = 12, markers = [] }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center,
      zoom,
    })

    markers.forEach(marker => {
      new mapboxgl.Marker({
        color: marker.type === 'pickup' ? '#22c55e' : 
               marker.type === 'delivery' ? '#ef4444' : '#3b82f6'
      })
        .setLngLat(marker.coordinates)
        .addTo(map.current!)
    })

    return () => map.current?.remove()
  }, [center, zoom, markers])

  return <div ref={mapContainer} className="w-full h-full min-h-[400px]" />
}
