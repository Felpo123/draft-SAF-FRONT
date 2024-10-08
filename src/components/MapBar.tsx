import React from 'react'
import { Button } from './ui/button'
import { BarChart2, Building2, CloudMoon } from 'lucide-react'
import { Section } from './LayerisMapLibre'

interface MapBarProps {
  activeSection: {
    infrastructure: boolean
    graphs: boolean
    resources: boolean
  }
  onClick: (section: Section) => void
}

function MapBar({ activeSection, onClick }: MapBarProps) {
  return (
    <div
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 bg-white rounded-full shadow-md p-2"
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
    </div>
  )
}

export default MapBar
