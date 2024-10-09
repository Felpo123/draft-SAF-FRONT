'use client'

import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ChevronDown,
  ChevronUp,
  Home,
  TrendingUp,
  Users,
  Cloud,
  Sun,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
} from 'lucide-react'

L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

const WeatherWidget = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const weatherData = [
    { day: 'DOM', temp: 23, icon: <Sun className="h-6 w-6" /> },
    { day: 'LUN', temp: 22, icon: <CloudIcon className="h-6 w-6" /> },
    { day: 'MAR', temp: 20, icon: <CloudRain className="h-6 w-6" /> },
    { day: 'MIE', temp: 21, icon: <Sun className="h-6 w-6" /> },
    { day: 'JUE', temp: 19, icon: <CloudSnow className="h-6 w-6" /> },
  ]

  return (
    <Card
      className="absolute top-4 right-4 bg-white shadow-md"
      style={{ zIndex: 1000 }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Clima</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-9 p-0 hover:bg-gray-200 rounded-full"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="flex space-x-4">
            {weatherData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm">{day.day}</div>
                {day.icon}
                <div className="font-bold">{day.temp}°</div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default function MapDashboard() {
  const [isCardsVisible, setIsCardsVisible] = useState(false)
  const [collapsed, setCollapsed] = useState({})

  const toggleCards = () => setIsCardsVisible(!isCardsVisible)

  const toggleCard = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const cards = [
    { id: 1, title: 'Bomberos', value: 100, icon: '🚒', color: 'bg-blue-500' },
    {
      id: 2,
      title: 'Edificaciones Afectadas',
      value: 100,
      icon: '🏢',
      color: 'bg-white',
    },
    { id: 3, title: 'PDI', value: 50, icon: '🕵️', color: 'bg-green-500' },
    {
      id: 4,
      title: 'Infraestructura',
      value: 75,
      icon: '🏗️',
      color: 'bg-yellow-500',
    },
  ]

  return (
    <div className="h-screen flex flex-col bg-gray-100 relative">
      <div className="flex-grow">
        <MapContainer
          center={[-33.4569, -70.6483]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[-33.4569, -70.6483]}>
            <Popup>Santiago, Chile</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Sidebar */}

      {/* Weather widget */}
      <WeatherWidget />

      {/* Floating toggle bar and cards */}
      <div
        className="absolute bottom-40 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        style={{ zIndex: 1000 }}
      >
        <Button
          onClick={toggleCards}
          className="px-4 py-2 text-sm font-semibold bg-white rounded-full shadow-md"
          variant="ghost"
        >
          <p className="text-sm lg:text-xl xl:text-9xl">
            {isCardsVisible ? 'Ocultar Detalles' : 'Mostrar Detalles'}
          </p>
          {isCardsVisible ? (
            <ChevronDown className="h-4 w-4 ml-2" />
          ) : (
            <ChevronUp className="h-4 w-4 ml-2" />
          )}
        </Button>

        {isCardsVisible && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 flex space-x-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`p-4 rounded-lg shadow-md ${card.color} bg-opacity-80 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">{card.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 hover:bg-opacity-20 hover:bg-gray-700 rounded-full"
                    onClick={() => toggleCard(card.id)}
                  >
                    {collapsed[card.id] ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronUp className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                {!collapsed[card.id] && (
                  <div>
                    <span className="text-2xl font-bold">{card.value}</span>
                    <span className="ml-2 text-xl">{card.icon}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
