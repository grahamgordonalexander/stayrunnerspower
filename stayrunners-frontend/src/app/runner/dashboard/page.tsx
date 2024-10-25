// src/app/runner/dashboard/page.tsx
'use client'

import { useEffect } from 'react'
import { useStore } from '@/store'
import ChatInterface from '@/components/chat/ChatInterface'
import MapView from '@/components/maps/MapView'
import { socket } from '@/lib/socket'

export default function RunnerDashboard() {
  const { orders, location, updateLocation } = useStore()

  useEffect(() => {
    // Connect to WebSocket
    socket.connect()
    
    // Start location tracking
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          updateLocation([
            position.coords.longitude,
            position.coords.latitude
          ])
        },
        (error) => console.error('Location error:', error)
      )
    }

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="h-screen flex">
      <div className="w-1/2 h-full flex flex-col">
        <div className="h-1/2">
          <MapView
            center={location}
            markers={[
              { coordinates: location, type: 'runner' },
              ...orders.map(order => ({
                coordinates: order.location,
                type: order.type
              }))
            ]}
          />
        </div>
        <div className="h-1/2">
          <ChatInterface />
        </div>
      </div>
      
      <div className="w-1/2 p-4">
        <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
        {/* Order list component */}
      </div>
    </div>
  )
}
