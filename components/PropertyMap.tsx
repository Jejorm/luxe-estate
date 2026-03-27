'use client'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix for default marker icon in leaflet with Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png', // We'll rely on custom styling mostly, or default CDN
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
})

interface PropertyMapProps {
  lat: number
  lng: number
  address: string
}

export const PropertyMap = ({ lat, lng, address }: PropertyMapProps) => {
  // To avoid SSR issues with Leaflet, ensure it only renders on client
  useEffect(() => {
    // This hook ensures window is defined.
    // CSS is also imported here or above.
  }, [])

  return (
    <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5 w-full h-full relative z-0">
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
        <a
          href={`https://maps.google.com/?q=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-2 z-400 bg-white/90 text-xs font-medium px-2 py-1 rounded shadow-sm text-nordic-dark hover:text-mosque"
        >
          View on Map
        </a>
      </div>
    </div>
  )
}
