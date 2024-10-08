import React from 'react'

interface WeatherData {
  id: number
  day: string
  icon: any
  tempeture: number
}

interface WeatherCardProps {
  weatherInfo: WeatherData[]
}

function WeatherCard({ weatherInfo }: WeatherCardProps) {
  return (
    <div className="absolute right-44 top-6 space-x-4 flex">
      {weatherInfo.map(({ day, icon, id, tempeture }) => (
        <div
          key={id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-sm"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{day}</p>
            <p className="text-2xl font-bold text-gray-900">{tempeture}°</p>
          </div>

          <div className={`p-2 rounded-full text-2xl `}>{icon}</div>
        </div>
      ))}
    </div>
  )
}

export default WeatherCard
