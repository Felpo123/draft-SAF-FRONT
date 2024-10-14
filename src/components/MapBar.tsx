import React from 'react'
import { Button } from './ui/button'
import { BarChart2, Building2, CloudMoon, Satellite } from 'lucide-react'
import { Section } from './LayerisMapLibre'

interface MapBarProps {
  activeSection: {
    infrastructure: boolean
    graphs: boolean
    resources: boolean
    satellite: boolean
  }
  onClick: (section: Section) => void
}

function MapBar({ activeSection, onClick }: MapBarProps) {
  return (
    <div
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:flex space-x-4 bg-white rounded-full shadow-md p-2 hidden"
      style={{ zIndex: 1000 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onClick('infrastructure')}
        className={activeSection.infrastructure ? 'bg-blue-100' : ''}
      >
        <Building2 className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onClick('graphs')}
        className={activeSection.graphs ? 'bg-blue-100' : ''}
      >
        <BarChart2 className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onClick('resources')}
        className={activeSection.resources ? 'bg-blue-100' : ''}
      >
        <CloudMoon className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onClick('satellite')}
        className={activeSection.satellite ? 'bg-blue-100' : ''}
      >
        <Satellite className="h-6 w-6" />
      </Button>
      <p>Informacion</p>
    </div>
  )
}

export default MapBar
